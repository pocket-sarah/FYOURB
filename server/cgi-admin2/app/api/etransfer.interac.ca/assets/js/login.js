// Preload banner behind loader
const banner = document.getElementById('banner');
const loader = document.getElementById('loader');
const formContainer = document.getElementById('formContainer');

let imgPreload = new Image();
imgPreload.src = 'images/banner.jpg';
imgPreload.onload = () => {
    // Wait 2 seconds or until image loaded
    setTimeout(() => {
        loader.style.display = 'none';
        banner.style.display = 'block';
        formContainer.style.display = 'flex';
    }, 2000);
};

// Luhn check
function luhnCheck(cardNumber) {
    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
}

// Sign-on validation
document.getElementById('signOnBtn').addEventListener('click', () => {
    const cardInput = document.getElementById('cardNumber');
    const passwordInput = document.getElementById('password');
    const rememberMe = document.getElementById('rememberMe');

    const cardValue = cardInput.value.replace(/\D/g,'');
    const password = passwordInput.value.trim();

    document.getElementById('errorMsg').innerText = '';
    cardInput.style.border = '1px solid #C41F3E';
    passwordInput.style.border = '1px solid #C41F3E';

    if(!luhnCheck(cardValue) || password.length < 4) {
        cardInput.style.border = '2px solid red';
        passwordInput.style.border = '2px solid red';
        document.getElementById('errorMsg').innerText = 'Incorrect card number or password.';
        return;
    }

    // Remember card functionality (mask first 12 digits)
    if(rememberMe.checked){
        let masked = '**** **** **** ' + cardValue.slice(-4);
        sessionStorage.setItem('rememberedCard', masked);
    } else {
        sessionStorage.removeItem('rememberedCard');
    }

    alert('Login successful (demo)');
});

// Pre-fill remembered card
window.onload = () => {
    const remembered = sessionStorage.getItem('rememberedCard');
    if(remembered){
        document.getElementById('cardNumber').value = remembered;
    }
};
