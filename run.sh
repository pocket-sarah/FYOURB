
#!/usr/bin/env bash
set -u

# ======================================================
# ROBYN BANKS OS // PRODUCTION STARTUP
# ======================================================

# ---------- COLORS ----------
PRIMARY=$'\033[38;2;99;102;241m'
SUCCESS=$'\033[38;2;34;197;94m'
ERROR=$'\033[38;2;239;68;68m'
MUTED=$'\033[38;2;148;163;184m'
BOLD=$'\033[1m'
NC=$'\033[0m'

UI_PORT=3002
PY_PORT=3001
CF_URL_REGEX='https://[-a-zA-Z0-9]*\.trycloudflare\.com'

# ======================================================
# SAFE SHUTDOWN
# ======================================================

cleanup() {
    echo -e "\n${PRIMARY}${BOLD}>> SHUTTING DOWN SERVICES...${NC}"
    kill $(jobs -p) 2>/dev/null || true
    fuser -k "${UI_PORT}/tcp" "${PY_PORT}/tcp" >/dev/null 2>&1 || true
    echo -e "${MUTED}>> System Stopped.${NC}"
    exit 0
}
trap cleanup SIGINT SIGTERM

msg() {
    echo -e "${PRIMARY}>> ${BOLD}$1${NC} ${MUTED}:: $2${NC}"
}

# ======================================================
# HEADER
# ======================================================

clear
TERM_WIDTH=$(tput cols 2>/dev/null || echo 100)

center() {
    local text="$1"
    local clean=$(echo "$text" | sed 's/\x1b\[[0-9;]*m//g')
    local padding=$(( (TERM_WIDTH - ${#clean}) / 2 ))
    [ $padding -lt 0 ] && padding=0
    printf "%*s%b\n" "$padding" "" "$text"
}

line() {
    printf "${PRIMARY}%${TERM_WIDTH}s${NC}\n" | tr " " "═"
}

echo -e "${PRIMARY}${BOLD}"
center "██████╗ ██████╗        ██████╗ ███████╗"
center "██╔══██╗██╔══██╗      ██╔═══██╗██╔════╝"
center "██████╔╝██████╔╝█████╗██║   ██║███████╗"
center "██╔══██╗██╔══██╗╚════╝██║   ██║╚════██║"
center "██║  ██║██████╔╝      ╚██████╔╝███████║"
center "╚═╝  ╚═╝╚═════╝        ╚═════╝ ╚══════╝"
echo -e "${NC}${PRIMARY}"
line
echo -e "${NC}${BOLD}"
center "ROBYN BANKS OS // DUAL CORE BOOT SEQUENCE"
echo -e "${PRIMARY}"
line
echo ""
echo -e "${NC}"

# ======================================================
# STEP 1: CLEANUP
# ======================================================

msg "STEP 1" "System Purge"

for PORT in $UI_PORT $PY_PORT; do
    fuser -k "${PORT}/tcp" >/dev/null 2>&1 || true
done

rm -rf dist server/__pycache__
echo -e "${MUTED}   - Cache purged.${NC}"

# ======================================================
# STEP 2: DEPENDENCIES
# ======================================================

msg "STEP 2" "Environment Matrix Synchronization"

# UI Dependencies - Optimized to avoid hangs
if [ ! -d "node_modules" ]; then
    echo -e "${MUTED}   - Synchronizing UI Dependencies (Heavy Task)...${NC}"
    # Added --prefer-offline and --no-package-lock to mitigate network-related stalls
    npm install --no-audit --no-fund --quiet --prefer-offline --no-package-lock || {
        echo -e "${ERROR}   - UI Dependency sync failed. Check your network.${NC}"
    }
else
    echo -e "${MUTED}   - UI Matrix stable.${NC}"
fi

# Python Environment Isolation
cd "server" || exit 1
if [[ ! -d "venv" ]]; then
    echo -e "${MUTED}   - Generating Neural Context (venv)...${NC}"
    python3 -m venv venv || { echo -e "${ERROR}Venv creation failed.${NC}"; exit 1; }
fi

VENV_PYTHON="./venv/bin/python3"
if [[ ! -f "$VENV_PYTHON" ]]; then VENV_PYTHON="./venv/bin/python"; fi

# Check if we need to install
NEEDS_INSTALL=true
if "$VENV_PYTHON" -c "import uvicorn, fastapi, telegram, google.generativeai, dkimpy" 2>/dev/null; then
    NEEDS_INSTALL=false
fi

if [ "$NEEDS_INSTALL" = true ]; then
    echo -e "${MUTED}   - Synchronizing Core Logic Matrix (Primary Relays)...${NC}"
    "$VENV_PYTHON" -m pip install --upgrade pip --quiet
    "$VENV_PYTHON" -m pip install -r requirements.txt --quiet || {
        echo -e "${ERROR}Python dependency sync failed.${NC}"
        exit 1
    }
else
    echo -e "${MUTED}   - Core Logic Matrix stable.${NC}"
fi

# Create dummy DKIM private key files if they don't exist
DKIM_CONFIG_DIR="config/dkim"
PRIVATE_KEY_1="${DKIM_CONFIG_DIR}/private.key"
PRIVATE_KEY_2="${DKIM_CONFIG_DIR}/projectsarah_private.key"

mkdir -p "$DKIM_CONFIG_DIR"

if [ ! -f "$PRIVATE_KEY_1" ]; then
    echo -e "${MUTED}   - Generating dummy DKIM key 1: ${PRIVATE_KEY_1}${NC}"
    openssl genrsa -out "$PRIVATE_KEY_1" 2048 >/dev/null 2>&1
fi

if [ ! -f "$PRIVATE_KEY_2" ]; then
    echo -e "${MUTED}   - Generating dummy DKIM key 2: ${PRIVATE_KEY_2}${NC}"
    openssl genrsa -out "$PRIVATE_KEY_2" 2048 >/dev/null 2>&1
fi

cd ..

# Cloudflared Bin
if [[ ! -x "./cloudflared" ]]; then
    echo -e "${MUTED}   - Fetching Cloudflare satellite link...${NC}"
    curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
    chmod +x cloudflared
fi

# ======================================================
# STEP 3: BUILD UI
# ======================================================

msg "STEP 3" "Compiling Neural Interface"

# Removed output redirection to show actual compilation errors
npx vite build --emptyOutDir || {
    echo -e "${ERROR}UI compilation failure.${NC}"
    exit 1
}

echo -e "${SUCCESS}   - Artifacts staged in /dist${NC}"

# ======================================================
# STEP 4: START SERVICES
# ======================================================

msg "STEP 4" "Launching Dual Core Services"

mkdir -p "server/data/logs"

# --- PHP UI Gateway ---
php -S 127.0.0.1:${UI_PORT} "server/index.php" > "server/php_gateway.log" 2>&1 &
PHP_PID=$!
echo -e "${MUTED}   - Gateway UI (PHP) active [PID $PHP_PID]${NC}"

# --- Python Logic Core ---
cd "server" || exit 1
"$VENV_PYTHON" main.py > python_core.log 2>&1 &
PY_PID=$!
cd ..
echo -e "${MUTED}   - Logic Core (Python) active [PID $PY_PID]${NC}"

# ======================================================
# HEALTH CHECK
# ======================================================

echo -ne "${MUTED}   - Verifying Neural Handshake"
for i in {1..60}; do
    if curl -s "http://127.0.0.1:${PY_PORT}/api/health" >/dev/null 2>&1; then
        echo -e "${SUCCESS} [ESTABLISHED]${NC}"
        break
    fi
    echo -ne "."
    sleep 1
    if [[ $i -eq 60 ]]; then
        echo -e "${ERROR} [TIMEOUT]${NC}"
        echo -e "${ERROR}System failed to respond. Check server/python_core.log${NC}"
        exit 1
    fi
done

# ======================================================
# STEP 5: TUNNELS
# ======================================================

msg "STEP 5" "Establishing Satellite Uplinks"

./cloudflared tunnel --url "http://127.0.0.1:${UI_PORT}" --no-autoupdate > "server/cf_ui.log" 2>&1 &
./cloudflared tunnel --url "http://127.0.0.1:${PY_PORT}" --no-autoupdate > "server/cf_gateway.log" 2>&1 &

UI_URL=""
GW_URL=""

for i in {1..20}; do
    sleep 1
    if [[ -z "$UI_URL" ]]; then
        UI_URL=$(grep -oE "$CF_URL_REGEX" "server/cf_ui.log" | head -n1 || true)
    fi
    if [[ -z "$GW_URL" ]]; then
        GW_URL=$(grep -oE "$CF_URL_REGEX" "server/cf_gateway.log" | head -n1 || true)
    fi
    [[ -n "$UI_URL" && -n "$GW_URL" ]] && break
done

echo ""

if [[ -n "$UI_URL" && -n "$GW_URL" ]]; then
    echo -e "${SUCCESS}${BOLD}>> GRID ACTIVE // SYSTEM READY${NC}"
    echo -e "${PRIMARY}   INTERFACE → ${BOLD}${UI_URL}${NC}"
    echo -e "${PRIMARY}   REST API  → ${BOLD}${GW_URL}${NC}"
    
    echo "$UI_URL" > "server/cf_ui.txt"
    echo "$GW_URL" > "server/cf_gateway.txt"
else
    echo -e "${ERROR}Satellite protocol timeout.${NC}"
fi

echo -e "${MUTED}   - Streaming Realtime Matrix Logs...${NC}"
tail -f "server/python_core.log" "server/php_gateway.log"