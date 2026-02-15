
#!/usr/bin/env bash
set -u

# ======================================================
# ROBYN BANKS OS // PRODUCTION STARTUP (SECURE)
# ======================================================

PRIMARY=$'\033[38;2;99;102;241m'
SUCCESS=$'\033[38;2;34;197;94m'
ERROR=$'\033[38;2;239;68;68m'
MUTED=$'\033[38;2;148;163;184m'
BOLD=$'\033[1m'
NC=$'\033[0m'

UI_PORT=3002
PY_PORT=3001
CF_URL_REGEX='https://[-a-zA-Z0-9]*\.trycloudflare\.com'
SECURE_TOKEN="?token=projectsarah"

cleanup() {
    echo -e "\n${PRIMARY}${BOLD}>> SHUTTING DOWN SERVICES...${NC}"
    kill $(jobs -p) 2>/dev/null || true
    fuser -k "${UI_PORT}/tcp" "${PY_PORT}/tcp" >/dev/null 2>&1 || true
    exit 0
}
trap cleanup SIGINT SIGTERM

msg() { echo -e "${PRIMARY}>> ${BOLD}$1${NC} ${MUTED}:: $2${NC}"; }

clear
echo -e "${PRIMARY}${BOLD}ROBYN BANKS OS // SECURE BOOT${NC}"
echo "═" | tr " " "═"

# STEP 1: CLEANUP
msg "STEP 1" "System Purge"
fuser -k "${UI_PORT}/tcp" "${PY_PORT}/tcp" >/dev/null 2>&1 || true
rm -rf dist server/__pycache__

# STEP 2: DEPENDENCIES
msg "STEP 2" "Environment Matrix Synchronization"
if [ ! -d "node_modules" ]; then
    npm install --no-audit --no-fund --quiet --prefer-offline --no-package-lock
fi

# STEP 3: BUILD
msg "STEP 3" "Compiling Neural Interface"
npx vite build --emptyOutDir

# STEP 4: START SERVICES
msg "STEP 4" "Launching Dual Core Services"
mkdir -p "server/data/logs"
node "server/index.js" > "server/shadow_core.log" 2>&1 &
CORE_PID=$!

# PHP Gateway on 3002
php -S 127.0.0.1:${UI_PORT} "server/index.php" > "server/php_gateway.log" 2>&1 &

# Cloudflared Uplinks
if [[ ! -x "./cloudflared" ]]; then
    curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
    chmod +x cloudflared
fi

# Tunnel for UI
./cloudflared tunnel --url "http://127.0.0.1:${UI_PORT}" --no-autoupdate > "server/cf_ui.log" 2>&1 &
# Tunnel for Python/JS API
./cloudflared tunnel --url "http://127.0.0.1:${PY_PORT}" --no-autoupdate > "server/cf_api.log" 2>&1 &

UI_URL=""
for i in {1..30}; do
    sleep 1
    UI_URL=$(grep -oE "$CF_URL_REGEX" "server/cf_ui.log" | head -n1 || true)
    [[ -n "$UI_URL" ]] && break
done

if [[ -n "$UI_URL" ]]; then
    echo -e "${SUCCESS}${BOLD}>> GRID ACTIVE // SYSTEM READY${NC}"
    echo -e "${PRIMARY}   SECURE INTERFACE → ${BOLD}${UI_URL}${SECURE_TOKEN}${NC}"
    echo "${UI_URL}${SECURE_TOKEN}" > "server/cf_ui.txt"
else
    echo -e "${ERROR}Satellite protocol timeout.${NC}"
fi

tail -f "server/shadow_core.log" "server/php_gateway.log"
