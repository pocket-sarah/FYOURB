 // tags.js - Advanced Interaction and Tracking Script

// Global settings for logging and tracking
const config = {
    logEndpoint: 'includes/log_action.php',
    errorReporting: true,
    debug: true, // Toggle debug logging
};

// Utility function for debugging
function debugLog(message) {
    if (config.debug) {
        console.log(`[Debug] ${message}`);
    }
}

// Function to log user actions
async function logUserAction(action, details) {
    const logData = {
        action,
        details,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
    };

    debugLog(`Logging Action: ${action}, Details: ${JSON.stringify(details)}`);

    try {
        const response = await fetch(config.logEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logData),
        });

        if (!response.ok) {
            console.error(`Failed to log action: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error logging action:', error);
    }
}

// Function to handle button clicks
function handleButtonClick(buttonId) {
    logUserAction('ButtonClick', { buttonId });
    alert(`Button ${buttonId} clicked!`);
}

// Function to track hover interactions
function handleHover(elementId) {
    logUserAction('Hover', { elementId });
}

// Function to track form submissions
function handleFormSubmission(formId, formData) {
    logUserAction('FormSubmission', { formId, formData });
}

// Document ready equivalent
document.addEventListener('DOMContentLoaded', function () {
    debugLog('Document fully loaded. Initializing trackers.');

    // Track page load
    logUserAction('PageLoad', 'Page loaded successfully');

    // Add click event listeners to buttons
    const buttons = document.querySelectorAll('.trackable-button');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            handleButtonClick(button.id);
        });
    });

    // Add hover event listeners to trackable elements
    const hoverElements = document.querySelectorAll('.trackable-hover');
    hoverElements.forEach(element => {
        element.addEventListener('mouseover', function () {
            handleHover(element.id);
        });
    });

    // Add form submission tracking
    const forms = document.querySelectorAll('.trackable-form');
    forms.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent actual form submission for tracking
            const formData = Object.fromEntries(new FormData(form).entries());
            handleFormSubmission(form.id, formData);

            // Submit the form after tracking
            form.submit();
        });
    });

    // Track link clicks dynamically
    document.body.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            logUserAction('LinkClick', { href: event.target.href });
        }
    });

    // Dynamic interaction tracking (e.g., dropdowns)
    document.body.addEventListener('change', function (event) {
        if (event.target.tagName === 'SELECT') {
            logUserAction('DropdownChange', {
                dropdownId: event.target.id,
                value: event.target.value,
            });
        }
    });

    debugLog('Trackers initialized successfully.');
});

// Global error tracking
if (config.errorReporting) {
    window.addEventListener('error', function (event) {
        logUserAction('JavaScriptError', {
            message: event.message,
            file: event.filename,
            line: event.lineno,
            column: event.colno,
        });
    });

    window.addEventListener('unhandledrejection', function (event) {
        logUserAction('PromiseRejection', { reason: event.reason });
    });
}

// Utility function to log custom events
function logCustomEvent(eventName, eventDetails) {
    logUserAction(eventName, eventDetails);
    debugLog(`Custom Event Logged: ${eventName}, Details: ${JSON.stringify(eventDetails)}`);
}

// Exportable functions for external use
window.TagsJS = {
    logCustomEvent,
    handleButtonClick,
    handleHover,
    handleFormSubmission,
};
