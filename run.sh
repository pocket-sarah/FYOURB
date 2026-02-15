#!/usr/bin/env bash
set -u

# ======================================================
# ROBYN BANKS OS // TERMUX MOBILE STARTUP v1.2
# Optimized for Reorganized Structures (frontend/bot/gateway)
# ======================================================

# ---------- COLORS ----------
PRIMARY=$'\033[38;2;99;102;241m'
SUCCESS=$'\033[38;2;34;197;94m'
ERROR=$'\033[38;2;239;68;68m'
MUTED=$'\033[38;2;148;163;184m'
BOLD=$'\033[1m'
NC=$'\033[0m'

UI_PORT=3000
PY_PORT=3001
PHP_PORT=3002
CF_URL_REGEX='https://[-a-zA-Z0-9]*\.trycloudflare\.com'

# Determine absolute project root
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

# ======================================================
# SAFE SHUTDOWN
# ======================================================

cleanup() {
    echo -e "\n${PRIMARY}${BOLD}>> SHUTTING DOWN SERVICES...${NC}"
    kill $(jobs -p) 2>/dev/null || true
    pkill -f "php -S" 2>/dev/null || true
    pkill -f "python main.py" 2>/dev/null || true
    pkill -f "node" 2>/dev/null || true
    pkill -f "cloudflared tunnel" 2>/dev/null || true
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
TERM_WIDTH=$(tput cols 2>/dev/null || echo 80)

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
center "ROBYN BANKS OS // TERMUX CORE BOOT SEQUENCE"
echo -e "${PRIMARY}"
line
echo ""
echo -e "${NC}"

# ======================================================
# STEP 0: ENVIRONMENT DETECTION
# ======================================================
msg "STEP 0" "Detecting Grid Infrastructure"

FRONTEND_DIR="$PROJECT_ROOT"
BOT_DIR="$PROJECT_ROOT"
GATEWAY_DIR="$PROJECT_ROOT"

if [ -d "$PROJECT_ROOT/frontend" ]; then
    FRONTEND_DIR="$PROJECT_ROOT/frontend"
    msg "UI" "Located in /frontend"
fi

if [ -d "$PROJECT_ROOT/bot" ]; then
    BOT_DIR="$PROJECT_ROOT/bot"
    msg "CORE" "Located in /bot"
fi

if [ -d "$PROJECT_ROOT/gateway" ]; then
    GATEWAY_DIR="$PROJECT_ROOT/gateway"
    msg "GATEWAY" "Located in /gateway"
fi

# ======================================================
# STEP 1: PKG CHECK
# ======================================================
msg "STEP 1" "Validating Termux Packages"
REQUIRED_PKGS=(nodejs php python git curl openssl)
for pkg in "${REQUIRED_PKGS[@]}"; do
    if ! command -v "$pkg" &> /dev/null; then
        echo -e "${MUTED}   - Installing missing package: $pkg...${NC}"
        pkg install -y "$pkg" --quiet
    fi
done

# ======================================================
# STEP 2: DEPENDENCIES
# ======================================================
msg "STEP 2" "Synchronizing Logic Matrix"

# Python Core Setup
cd "$BOT_DIR" || exit 1
if [[ ! -d "venv" ]]; then
    echo -e "${MUTED}   - Generating Neural Context (venv)...${NC}"
    python -m venv venv || { echo -e "${ERROR}Venv creation failed.${NC}"; exit 1; }
fi

VENV_PYTHON="./venv/bin/python"
echo -e "${MUTED}   - Syncing Python Dependencies...${NC}"
"$VENV_PYTHON" -m pip install --upgrade pip --quiet
"$VENV_PYTHON" -m pip install -r requirements.txt --quiet || {
    echo -e "${ERROR}Python dependency sync failed.${NC}"
}

# UI Dependencies Setup
cd "$FRONTEND_DIR" || exit 1
if [ ! -d "node_modules" ]; then
    echo -e "${MUTED}   - Synchronizing UI Dependencies (Heavy)...${NC}"
    npm install --no-audit --no-fund --quiet --prefer-offline --no-package-lock || {
        echo -e "${ERROR}   - UI Dependency sync failed. Check package.json location.${NC}"
        exit 1
    }
fi

# ======================================================
# STEP 3: BUILD UI
# ======================================================
msg "STEP 3" "Compiling Neural Interface"
npx vite build --emptyOutDir || {
    echo -e "${ERROR}UI compilation failure.${NC}"
}
echo -e "${SUCCESS}   - Artifacts staged in /dist${NC}"

# ======================================================
# STEP 4: IGNITION
# ======================================================
msg "STEP 4" "Launching Dual Core Services"
mkdir -p "$PROJECT_ROOT/data/logs"

# --- PHP UI Gateway (Port 3002) ---
php -S 127.0.0.1:${PHP_PORT} -t "$GATEWAY_DIR" > "$PROJECT_ROOT/data/logs/php_gateway.log" 2>&1 &
msg "GATEWAY" "PHP Active on $PHP_PORT"

# --- Python Logic Core (Port 3001) ---
cd "$BOT_DIR" || exit 1
"$VENV_PYTHON" main.py > "$PROJECT_ROOT/data/logs/python_core.log" 2>&1 &
msg "CORE" "Python Active on $PY_PORT"

# --- Frontend Node (Port 3000) ---
cd "$FRONTEND_DIR" || exit 1
npm run dev -- --port ${UI_PORT} --host > "$PROJECT_ROOT/data/logs/ui_dev.log" 2>&1 &
msg "UI" "Vite Active on $UI_PORT"

# ======================================================
# STEP 5: SATELLITE UPLINK
# ======================================================
msg "STEP 5" "Establishing Satellite Uplinks"

# Cloudflared Bin - ARCH detection
cd "$PROJECT_ROOT"
if [[ ! -x "./cloudflared" ]]; then
    echo -e "${MUTED}   - Fetching Cloudflare satellite link (ARM64)...${NC}"
    ARCH=$(uname -m)
    CF_URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64"
    if [[ "$ARCH" == "arm" ]]; then
        CF_URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm"
    fi
    curl -sL "$CF_URL" -o cloudflared
    chmod +x cloudflared
fi

# Tunnels
./cloudflared tunnel --url "http://127.0.0.1:${UI_PORT}" --no-autoupdate > "$PROJECT_ROOT/data/logs/cf_ui.log" 2>&1 &
./cloudflared tunnel --url "http://127.0.0.1:${PY_PORT}" --no-autoupdate > "$PROJECT_ROOT/data/logs/cf_api.log" 2>&1 &

UI_URL=""
API_URL=""

echo -ne "${MUTED}   - Negotiating Tunnel Handshake"
for i in {1..20}; do
    sleep 1
    [[ -z "$UI_URL" ]] && UI_URL=$(grep -oE "$CF_URL_REGEX" "$PROJECT_ROOT/data/logs/cf_ui.log" | head -n1 || true)
    [[ -z "$API_URL" ]] && API_URL=$(grep -oE "$CF_URL_REGEX" "$PROJECT_ROOT/data/logs/cf_api.log" | head -n1 || true)
    [[ -n "$UI_URL" && -n "$API_URL" ]] && break
    echo -ne "."
done

echo ""

if [[ -n "$UI_URL" && -n "$API_URL" ]]; then
    echo -e "${SUCCESS}${BOLD}>> GRID ACTIVE // SYSTEM READY${NC}"
    echo -e "${PRIMARY}   INTERFACE → ${BOLD}${UI_URL}${NC}"
    echo -e "${PRIMARY}   LOGIC API → ${BOLD}${API_URL}${NC}"
    
    echo "$UI_URL" > "$PROJECT_ROOT/data/logs/ui_link.txt"
    echo "$API_URL" > "$PROJECT_ROOT/data/logs/api_link.txt"
else
    echo -e "${ERROR}Satellite protocol timeout. Using local access.${NC}"
    echo -e "${PRIMARY}   LOCAL UI → http://localhost:3000${NC}"
fi

echo -e "${MUTED}   - Streaming Realtime Logs...${NC}"
tail -f "$PROJECT_ROOT/data/logs/python_core.log" "$PROJECT_ROOT/data/logs/ui_dev.log"
