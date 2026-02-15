#!/usr/bin/env bash
set -u

# ======================================================
# ROBYN BANKS OS // TERMUX MOBILE STARTUP
# Optimized for Android/Aarch64 Environments
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
    # Stop background jobs
    kill $(jobs -p) 2>/dev/null || true
    # Termux doesn't always have fuser; pkill is more reliable here
    pkill -f "php -S 127.0.0.1:${UI_PORT}" 2>/dev/null || true
    pkill -f "python main.py" 2>/dev/null || true
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
# STEP 0: TERMUX PKG CHECK
# ======================================================
msg "STEP 0" "Validating Termux Packages"
REQUIRED_PKGS=(nodejs php python git curl openssl)
for pkg in "${REQUIRED_PKGS[@]}"; do
    if ! command -v "$pkg" &> /dev/null; then
        echo -e "${MUTED}   - Installing missing package: $pkg...${NC}"
        pkg install -y "$pkg" --quiet
    fi
done

# ======================================================
# STEP 1: CLEANUP
# ======================================================

msg "STEP 1" "System Purge"

pkill -f "php -S 127.0.0.1:${UI_PORT}" 2>/dev/null || true
pkill -f "python main.py" 2>/dev/null || true
pkill -f "cloudflared tunnel" 2>/dev/null || true

rm -rf dist server/__pycache__
echo -e "${MUTED}   - Cache purged.${NC}"

# ======================================================
# STEP 2: DEPENDENCIES
# ======================================================

msg "STEP 2" "Environment Matrix Synchronization"

# UI Dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${MUTED}   - Synchronizing UI Dependencies...${NC}"
    npm install --no-audit --no-fund --quiet --prefer-offline --no-package-lock || {
        echo -e "${ERROR}   - UI Dependency sync failed.${NC}"
    }
else
    echo -e "${MUTED}   - UI Matrix stable.${NC}"
fi

# Python Core
cd "server" || exit 1
if [[ ! -d "venv" ]]; then
    echo -e "${MUTED}   - Generating Neural Context (venv)...${NC}"
    python -m venv venv || { echo -e "${ERROR}Venv creation failed.${NC}"; exit 1; }
fi

VENV_PYTHON="./venv/bin/python"

echo -e "${MUTED}   - Synchronizing Core Logic Matrix...${NC}"
"$VENV_PYTHON" -m pip install --upgrade pip --quiet
"$VENV_PYTHON" -m pip install -r requirements.txt --quiet || {
    echo -e "${ERROR}Python dependency sync failed.${NC}"
    exit 1
}

# Ensure DKIM keys exist
mkdir -p "../config/dkim"
[[ ! -f "../config/dkim/private.key" ]] && openssl genrsa -out "../config/dkim/private.key" 2048 &>/dev/null
[[ ! -f "../config/dkim/projectsarah_private.key" ]] && openssl genrsa -out "../config/dkim/projectsarah_private.key" 2048 &>/dev/null

cd ..

# Cloudflared Bin - Specific for Aarch64 (Android usually)
if [[ ! -x "./cloudflared" ]]; then
    echo -e "${MUTED}   - Fetching Cloudflare satellite link (ARM64)...${NC}"
    # ARCH detection for Termux
    ARCH=$(uname -m)
    CF_URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64"
    if [[ "$ARCH" == "arm" ]]; then
        CF_URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm"
    fi
    curl -sL "$CF_URL" -o cloudflared
    chmod +x cloudflared
fi

# ======================================================
# STEP 3: BUILD UI
# ======================================================

msg "STEP 3" "Compiling Neural Interface"
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
php -S 127.0.0.1:${UI_PORT} -t "server" > "server/php_gateway.log" 2>&1 &
echo -e "${MUTED}   - Gateway UI (PHP:3002) active${NC}"

# --- Python Logic Core ---
cd "server" || exit 1
"$VENV_PYTHON" main.py > python_core.log 2>&1 &
cd ..
echo -e "${MUTED}   - Logic Core (Python:3001) active${NC}"

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
    [[ $i -eq 60 ]] && { echo -e "${ERROR} [TIMEOUT]${NC}"; exit 1; }
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
    [[ -z "$UI_URL" ]] && UI_URL=$(grep -oE "$CF_URL_REGEX" "server/cf_ui.log" | head -n1 || true)
    [[ -z "$GW_URL" ]] && GW_URL=$(grep -oE "$CF_URL_REGEX" "server/cf_gateway.log" | head -n1 || true)
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
    echo -e "${ERROR}Satellite protocol timeout. Check server/cf_*.log${NC}"
fi

echo -e "${MUTED}   - Streaming Realtime Matrix Logs...${NC}"
tail -f "server/python_core.log" "server/php_gateway.log"
