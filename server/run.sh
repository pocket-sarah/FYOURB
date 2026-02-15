#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

# ======================================================
# ROBYN BANKS OS // TERMUX MASTER FIX
# ======================================================

PRIMARY=$'\033[38;2;99;102;241m'
SUCCESS=$'\033[38;2;34;197;94m'
ERROR=$'\033[38;2;239;68;68m'
BOLD=$'\033[1m'
NC=$'\033[0m'

UI_PORT=3002
PY_PORT=3001
CF_URL_REGEX='https://[-a-zA-Z0-9]*\.trycloudflare\.com'
SECURE_TOKEN="?token=projectsarah"
REPO_URL="https://github.com/pocket-sarah/FYOURB"
PROJECT_DIR="$HOME/FYOURB"

# ==========================
# Functions
# ==========================
msg() { echo -e "${PRIMARY}>> ${BOLD}$1${NC} :: ${2}"; }

cleanup() {
    echo -e "\n${PRIMARY}${BOLD}>> SHUTTING DOWN SERVICES...${NC}"
    kill $(jobs -p) 2>/dev/null || true
    fuser -k "${UI_PORT}/tcp" "${PY_PORT}/tcp" >/dev/null 2>&1 || true
    exit 0
}
trap cleanup SIGINT SIGTERM

# ==========================
# STEP 0: Install dependencies
# ==========================
msg "STEP 0" "Installing Termux packages"
pkg update -y
pkg install -y nodejs php git curl unzip wget openjdk-17

# ==========================
# STEP 1: Clone Repo
# ==========================
msg "STEP 1" "Cloning repository"
if [ ! -d "$PROJECT_DIR" ]; then
    git clone "$REPO_URL" "$PROJECT_DIR"
else
    cd "$PROJECT_DIR" && git reset --hard && git pull
fi
cd "$PROJECT_DIR"

# ==========================
# STEP 2: Fix missing files
# ==========================
msg "STEP 2" "Ensuring package.json & index.html exist"
if [ ! -f "package.json" ]; then
    echo '{"name":"robyn-banks-os","version":"1.0.0","scripts":{"build":"vite build"}}' > package.json
fi

if [ ! -f "index.html" ]; then
cat <<EOF > index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Robyn Banks OS</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="./main.js"></script>
</body>
</html>
EOF
fi

# ==========================
# STEP 3: Node dependencies
# ==========================
msg "STEP 3" "Installing Node.js dependencies"
npm install --no-audit --no-fund --quiet --prefer-offline --no-package-lock

# ==========================
# STEP 4: Build frontend
# ==========================
msg "STEP 4" "Building frontend"
npx vite build --emptyOutDir

# ==========================
# STEP 5: Launch services
# ==========================
msg "STEP 5" "Launching server services"
mkdir -p server/data/logs

# Node API
node server/index.js > server/shadow_core.log 2>&1 &

# PHP Gateway
php -S 127.0.0.1:${UI_PORT} server/index.php > server/php_gateway.log 2>&1 &

# Cloudflared tunnels
if [ ! -x "./cloudflared" ]; then
    curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 -o cloudflared
    chmod +x cloudflared
fi

# UI Tunnel
./cloudflared tunnel --url "http://127.0.0.1:${UI_PORT}" --no-autoupdate > server/cf_ui.log 2>&1 &
# API Tunnel
./cloudflared tunnel --url "http://127.0.0.1:${PY_PORT}" --no-autoupdate > server/cf_api.log 2>&1 &

# Wait for CF URL
UI_URL=""
for i in {1..30}; do
    sleep 1
    UI_URL=$(grep -oE "$CF_URL_REGEX" server/cf_ui.log | head -n1 || true)
    [[ -n "$UI_URL" ]] && break
done

if [[ -n "$UI_URL" ]]; then
    echo -e "${SUCCESS}${BOLD}>> GRID ACTIVE // SYSTEM READY${NC}"
    echo -e "${PRIMARY}   SECURE INTERFACE → ${BOLD}${UI_URL}${SECURE_TOKEN}${NC}"
    echo "${UI_URL}${SECURE_TOKEN}" > server/cf_ui.txt
else
    echo -e "${ERROR}>> Satellite protocol timeout.${NC}"
fi

# ==========================
# Tail logs
# ==========================
msg "STEP 6" "Streaming logs"
tail -f server/shadow_core.log server/php_gateway.log
