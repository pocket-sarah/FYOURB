$(document).ready(function () {
        $("a.change-language").click(function (event) {
            event.preventDefault();
            if (typeof customChangeLanguageFunction == 'function') {
                customChangeLanguageFunction('/changeLanguage.do?lang=fr&country=CA&lvt=F3E881921E378D6BB042A545319FDFEFD931B9C5A7095238C92C3239A481978D');
            } else {
                location.replace('/changeLanguage.do?lang=fr&country=CA&lvt=F3E881921E378D6BB042A545319FDFEFD931B9C5A7095238C92C3239A481978D');
            }

        });

        $("a.about-menu").click(function (event) {
            event.preventDefault();
            if (typeof customAboutFunction == 'function') {
                customAboutFunction("", "");
            } else {
                submitAbout("", "");
            }
        });

        $("a.help-link").click(function (event) {
            openWindow(event, 'http://interac.ca/en/etransferhelp', 'Help', 'resizable=yes,scrollbars=yes');
        });
        $("a.help-link").focus(function (event) {
            $('.interac-max-width').each(function (i, obj) {
                $(this).removeAttr("tabindex");
            });
        });
        $("a.contactus-link").click(function (event) {
            openWindow(event, 'https://www.interac.ca/en/contact-us/', 'contactUs', 'resizable=yes,scrollbars=yes,width=550,height=350');
        });

        $("a.certapay-link").click(function (event) {
            openWindow(event, 'https://www.interac.ca/en/about/', 'aboutUs', 'resizable=yes,scrollbars=yes,width=550,height=350');
        });

        $("a.privacy-link").click(function (event) {
            openWindow(event, 'https://www.interac.ca/en/interac-e-transfer-privacy-policy/', 'privacy', 'resizable=yes,scrollbars=yes');
        });

        $("a.security-link").click(function (event) {
            openWindow(event, 'https://www.interac.ca/en/consumers/security/interac-e-transfer/', 'security', 'resizable=yes,scrollbars=yes,width=550,height=350');
        });

        $("a.termsAndConditions-link").click(function (event) {
            openWindow(event, 'https://www.interac.ca/en/interac-e-transfer-terms-of-use/', 'terms', 'resizable=yes,scrollbars=yes,width=550,height=350');
        });
    });

    function submitAbout(pageName, pageAction) {
        var url = "aboutMoneyDeposit.do";
        if (pageName != "") {
            url += '?pageName=' + encodeURIComponent(pageName);
        }
        if (pageAction != "") {
            url += (pageName != "") ? "&" : "?";
            url += 'pageAction=' + pageAction;
        }
        location.replace(url);
    }

    function openWindow(event, url, windowName, windowParams) {
        event.preventDefault();
        window.open(url, windowName, windowParams);
    }