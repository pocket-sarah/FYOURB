//Load Resources depending on mobile or desktop configuration
        Modernizr.load({
            test: Modernizr.touch && Modernizr.mq('only all and (max-width: 600px)'),
            nope: ['/resources/newgateway/vendor/jquery-mobile-theme/themes/interac-jqm.min.css',
                   '/resources/newgateway/vendor/jquery-mobile-theme/themes/jquery.mobile.icons.min.css',
                   '/resources/newgateway/vendor/jquery.mobile-1.4.5/jquery.mobile.structure-1.4.5.min.css',
					
                   '/resources/newgateway/vendor/jquery-ui-1.11.4.custom/jquery-ui.min.css',
                   '/resources/newgateway/vendor/jquery-ui-1.11.4.custom/jquery-ui.min.js' ]
        });

        var detailPanelIsOpen = false;
        
        $('.accordion-toggle').click(function(){
          //Expand or collapse this panel
          $(this).next().slideToggle('fast');
            if (detailPanelIsOpen == false){
                $("#detailToggleChevron").attr("transform", "rotate(90 10 10)");
                detailPanelIsOpen = true;
            }else{
                $("#detailToggleChevron").attr("transform", "rotate(0 10 10)");
                detailPanelIsOpen = false;
            }

          //Hide the other panels
          $(".accordion-content").not($(this).next()).slideUp('fast');

        });