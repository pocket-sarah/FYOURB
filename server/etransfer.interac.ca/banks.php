<?php
$banks = [
    ["fiid"=>"CA000219","filabel"=>"ATB Financial","value"=>"CA000219","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000219_FULL_IMAGE.svg"],
    ["fiid"=>"CA000001","filabel"=>"BMO Bank of Montreal","value"=>"CA000001","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000001_FULL_IMAGE.svg"],
    ["fiid"=>"CA000010","filabel"=>"CIBC","value"=>"CA000010","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000010_FULL_IMAGE.svg"],
    ["fiid"=>"CA000382","filabel"=>"Coast Capital Savings Federal CU","value"=>"CA000382","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000382_FULL_IMAGE.svg"],
    ["fiid"=>"CA000815","filabel"=>"Desjardins","value"=>"CA000815","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000815_FULL_IMAGE.svg"],

    // FIXED FIID
    ["fiid"=>"CA000039","filabel"=>"Laurentian Bank","value"=>"038860000","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000809_038860000_FULL_IMAGE.svg"],

    ["fiid"=>"CA000540","filabel"=>"Manulife Bank of Canada","value"=>"CA000540","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000540_FULL_IMAGE.svg"],
    ["fiid"=>"CA000837","filabel"=>"Meridian","value"=>"CA000837","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000837_FULL_IMAGE.svg"],
    ["fiid"=>"CA000374","filabel"=>"motusbank","value"=>"CA000374","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000374_FULL_IMAGE.svg"],
    ["fiid"=>"CA000006","filabel"=>"National Bank","value"=>"CA000006","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000006_FULL_IMAGE.svg"],
    ["fiid"=>"CA000320","filabel"=>"PC Financial","value"=>"CA000320","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000320_FULL_IMAGE.svg"],
    ["fiid"=>"CA000621","filabel"=>"Peoples Trust","value"=>"CA000621","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000621_FULL_IMAGE.svg"],
    ["fiid"=>"CA000003","filabel"=>"RBC Royal Bank","value"=>"CA000003","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000003_FULL_IMAGE.svg"],
    ["fiid"=>"CA000002","filabel"=>"Scotiabank","value"=>"CA000002","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000002_FULL_IMAGE.svg"],

    ["fiid"=>"CA002222","filabel"=>"Simplii Financial","value"=>"000030800","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000010_000030800_FULL_IMAGE.svg"],

    ["fiid"=>"CA000614","filabel"=>"Tangerine Bank","value"=>"CA000614","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000614_FULL_IMAGE.svg"],
    ["fiid"=>"CA000004","filabel"=>"TD Canada Trust","value"=>"CA000004","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000004_FULL_IMAGE.svg"],

    // FIXED QUOTES
    ["fiid"=>"CA111111","filabel"=>"Wealthsimple","value"=>"CA111111","logo"=>"https://etransfer-content.interac.ca/en/logo_CA000809_818287030_FULL_IMAGE.svg"]
];
?>

<ol class="pure-g" style="list-style:none;margin:0;padding:0;">
<?php foreach ($banks as $bank): ?>
<li class="pure-u-1-2 pure-u-sm-1-3 pure-u-md-1-4 pure-u-lg-1-6 ui-link">

    <a class="fi-tile"
       data-ajax="false"
       fiid="<?= htmlspecialchars($bank['fiid'], ENT_QUOTES) ?>"
       filabel="<?= htmlspecialchars($bank['filabel'], ENT_QUOTES) ?>"
       value="<?= htmlspecialchars($bank['value'], ENT_QUOTES) ?>"
       href="#">

        <div class="white-background pure-g inherit-height vertical-middle fi-option">

            <div class="pure-u-1 inherit-height vertical-middle fi-logo-wrapper"
                 id="fi-logo-<?= htmlspecialchars($bank['fiid'], ENT_QUOTES) ?>">

                <img src="<?= htmlspecialchars($bank['logo'], ENT_QUOTES) ?>"
                     alt="<?= htmlspecialchars($bank['filabel'], ENT_QUOTES) ?>"
                     class="fi-logo-image"
                     onerror="Gateway.useImage(this,'resources/images/en/fiLogo/logo_default.svg')" />

            </div>

        </div>

    </a>

</li>
<?php endforeach; ?>
</ol>
