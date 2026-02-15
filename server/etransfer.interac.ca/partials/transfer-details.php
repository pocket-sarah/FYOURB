<main id="main">
  <div style="position:relative" class="interac-max-width" data-role="page" data-enhance="false">
    <div class="details-panel margin-top-15">
      <div class="pure-u-1"><div class="pure"><div class="pure-g">

        <!-- Left-hand info -->
        <div class="pure-u-1 pure-u-sm-1-2 left-hand-info">
          <div class="pure-u-2-24 global-left-padding">
            <div class="line">
              <svg width="25" height="25" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <path d="M24,15l-1.406-1.406L16,20.188V2h-2v18.188l-6.594-6.594L6,15l9,9L24,15z M2,26v2h26v-2H2z" fill="#999"/>
              </svg>
            </div>
          </div>
          <div class="pure-u-21-24">
            <h1 class="deposit-label" style="margin-top:0">Deposit Your Money</h1>
            <div class="margin-bottom-15 line">
              <span id="amountValue" class="largeFont">$<?= $amount ?>.00</span>
              <span id="currencyValue" class="paymentDetailsImportantFont">CAD</span>
              <input id="fmtAmount" name="fmtAmount" type="hidden" value="<?= $amount ?>" />
            </div>
            <div class="pure-u-1 paymentDetailsImportantFont line fromDiv">
              <div class="grid-style"><span id="fromLabel">From:</span></div>
              <div class="pure-u-4-5 line white-space-normal">
                <span id="fromValue"><?= $sender ?></span>
              </div>
            </div>
            <br>
          </div>
        </div>

        <!-- Right-hand info -->
        <div class="pure-hidden-xs pure-hidden-sm pure-u-sm-1-2 desktop-only-left-grey-border right-hand-info">
          <div class="pure-u-1 right-hand-container">
            <div class="left-hand-line">
              <div class="pure-u-xl-5-24 pure-u-md-6-24 pure-u-sm-7-24 right-hand-label">
                <span id="expiryLabel">Expires:</span>
              </div>
              <div class="pure-u-1-24">&nbsp;</div>
              <div class="pure-u-xl-18-24 pure-u-md-17-24 pure-u-sm-16-24">
                <span id="expiryValue"><?= $expiry ?></span>
              </div>
            </div>
            <div class="left-hand-line">
              <div class="pure-u-xl-5-24 pure-u-md-6-24 pure-u-sm-7-24 right-hand-label">
                <span id="referenceNumLabel">Reference #:</span>
              </div>
              <div class="pure-u-1-24">&nbsp;</div>
              <div class="pure-u-xl-18-24 pure-u-md-17-24 pure-u-sm-16-24 white-space-normal">
                <span id="referenceNumValue"><?= $ref ?></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Spacer for layout -->
        <div class="pure-u-1 pure-u-sm-1-2 pure-u-md-1-3"></div>

      </div></div></div></div>
    </div>

    <div class="separator"></div>

    <!-- Mobile accordion -->
    <div class="pure-u-1 pure-hidden-xl pure-hidden-lg pure-hidden-md mobile-details-panel">
      <div class="accordion">
        <div class="pure-g accordion-toggle">
          <div class="pure-u-4-5">
            <h4 class="global-left-padding">View Transfer Details</h4>
          </div>
          <div class="pure-u-1-5 text-right">
          <svg height="40px" width="40px" viewBox="-5 -5 30 30"
               xmlns="http://www.w3.org/2000/svg"
               xmlns:xlink="http://www.w3.org/1999/xlink"
               class="translate-y-d-10">
            <switch>
              <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
                <path
                  d="M0,11 C0,4.92486745 4.92486745,0 11,0 C17.0751325,0 22,4.92486745 22,11
                     C22,17.0751325 17.0751325,22 11,22 C4.92486745,22 0,17.0751325 0,11 Z
                     M21,11 C21,5.47715223 16.5228478,1 11,1 C5.47715223,1 1,5.47715223 1,11
                     C1,16.5228478 5.47715223,21 11,21 C16.5228478,21 21,16.5228478 21,11 Z
                     M12.1454356,11.4205619 L8.25634833,15.3096492 L9.6767767,16.7300776
                     L14.9800776,11.4267767 L9.3232233,5.76992245 L7.90900974,7.18413601
                     L12.1454356,11.4205619 Z"
                  fill="#f0b51c" id="detailToggleChevron"/>
              </g>
            </switch>
          </svg>
          </div>
        </div>
        <div class="accordion-content global-left-padding">
          <div class="pure-u-1">
            <div class="left-hand-line">
              <div class="pure-u-1-2 right-hand-label"><span>Expires:</span></div>
              <div class="pure-u-1-2"><span><?= $expiry ?></span></div>
            </div>
            <div class="left-hand-line">
              <div class="pure-u-1-2 right-hand-label"><span>Reference #:</span></div>
              <div class="pure-u-1-2 white-space-normal"><span><?= $ref ?></span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="separator"></div>
    <div class="separator"></div>

  </div>

<input id="fiListOption" name="fiListOption" type="hidden" value="null"/>
<link href="assets/css/searchCSS.css" media="screen" rel="stylesheet" type="text/css"/>
<div class="pure-u-1">
<div class="pure">
<div class="pure-g">
<div class="pure-u-1 pure-u-sm-1-2">
<div class="title-on" id="select-fi-title">
<h2 aria-label="Select institution" class="resp-header-size global-left-padding">
                        Select Your Financial Institution
                    </h2>
</div>
<div class="title-off" id="search-title">
<h2 class="resp-header-size global-left-padding">
                        Search
                    </h2>
</div>
<div class="pure-u-1 pure-u-sm-1-2" style="text-align: right;">
<div class="column" id="search-pos">
<div id="search-container">
<div id="search-wrapper">
<div id="autocomplete-typehead-div">
<input aria-autocomplete="list" aria-expanded="false" aria-haspopup="listbox" aria-label="Bank or Credit Union Name" aria-labelledby="sb-search" aria-required="false" autocapitalize="off" autocomplete="off" autocorrect="off" class="typehead visibility-hidden" id="autocomplete-input" placeholder="Bank or Credit Union Name" role="combobox" type="text"/>
</div>
<div aria-label="Search" aria-pressed="false" class="sb-search ui-corner-all sb-search-close" data-role="searchbox" id="sb-search" role="button" style="margin: 0px">
<div id="search-retracted-label">
                                    Search
                                </div>
<button class="sb-icon-search" style="width: auto;background: none;border: none;">
<svg aria-hidden="false" aria-label="Open search form" class="yellow-background circle-icon" enable-background="new 0 0 60 60" height="40px" id="search-icon" style="position: absolute" version="1.1" viewbox="-20 -20 100 100" width="40px">
<path class="white-icon" d="m 3.281,54.376 3.407,3.407 c 1.038,1.037 2.721,1.037 3.758,0 L 27.243,40.986 c 0.059,-0.059 0.102,-0.125 0.153,-0.187 3.095,1.82 6.689,2.884 10.541,2.884 11.51,0 20.841,-9.331 20.841,-20.841 C 58.778,11.332 49.447,2 37.937,2 26.427,2 17.096,11.331 17.096,22.841 c 0,3.996 1.145,7.716 3.095,10.887 -0.036,0.033 -0.077,0.057 -0.112,0.092 L 3.281,50.618 c -1.038,1.038 -1.038,2.72 0,3.758 z m 18.791,-31.39 c 0,-8.722 7.071,-15.793 15.793,-15.793 8.722,0 15.793,7.071 15.793,15.793 0,8.723 -7.071,15.793 -15.793,15.793 -8.722,0 -15.793,-7.071 -15.793,-15.793">
</path>
</svg>
<img alt="Close search form" aria-hidden="true" aria-label="Close search form" height="40px" id="close-icon" role="button" src="assets/photos/close-icon.svg" style="visibility: hidden" width="40px"/>
</button>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>