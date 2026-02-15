#!/bin/bash

# SARAH-CORE :: NEURAL LAUNCHER v15.2 (STABILITY & SPEED)
# --------------------------------------------------------

# Configuration
BACKEND_PORT=3001
FRONTEND_PORT=3000
PHP_PORT=3002
VENV_DIR="server/venv"
SHADOW_NAME=".sarah-core-nexus"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear
echo -e "${PURPLE}   SARAH-CORE :: OPTIMIZED LAUNCHER${NC}"

kill_port() {
    local port=$1
    if command -v lsof >/dev/null; then
        local pids=$(lsof -t -i:$port)
        [ ! -z "$pids" ] && kill -9 $pids 2>/dev/null
    fi
}

cleanup_stale() {
    pkill -f "cloudflared" 2>/dev/null
    pkill -f "vite" 2>/dev/null
    pkill -f "main.py" 2>/dev/null
    pkill -f "php -S 127.0.0.1:$PHP_PORT" 2>/dev/null
    kill_port $BACKEND_PORT
    kill_port $FRONTEND_PORT
    kill_port $PHP_PORT
}

cleanup_stale

# 1. Environment Logic
CURRENT_DIR=$(pwd)
if [[ "$CURRENT_DIR" == /mnt/* ]]; then
    SHADOW_DIR="$HOME/$SHADOW_NAME"
    mkdir -p "$SHADOW_DIR"
    echo -e "${BLUE}[*] Phase 2: Syncing Shadow Node...${NC}"
    rsync -a --delete --exclude 'node_modules' --exclude 'server/venv' --exclude '.git' "$CURRENT_DIR/" "$SHADOW_DIR/"
    cd "$SHADOW_DIR"
fi

# 2. Uplink Pre-fetch
if [ ! -f "./cloudflared" ]; then
    echo -e "${YELLOW}    > Fetching binary...${NC}"
    curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
    chmod +x cloudflared
fi

# 3. Parallel Service Start
echo -e "${BLUE}[*] Phase 3: Igniting Engines...${NC}"
./cloudflared tunnel --url http://localhost:$FRONTEND_PORT --logfile ft.log > /dev/null 2>&1 &
./cloudflared tunnel --url http://localhost:$BACKEND_PORT --logfile bt.log > /dev/null 2>&1 &
./cloudflared tunnel --url http://localhost:$PHP_PORT --logfile pt.log > /dev/null 2>&1 &

php -S 127.0.0.1:$PHP_PORT -t server > /dev/null 2>&1 &

if [ ! -d "$VENV_DIR" ]; then
    python3 -m venv $VENV_DIR
    source $VENV_DIR/bin/activate
    pip install -r server/requirements.txt --quiet
else
    source $VENV_DIR/bin/activate
fi

cd server
APP_URL="https://negotiating" python3 -u main.py > ../server.log 2>&1 &
cd ..

# 4. Fast Node Check
[ ! -d "node_modules" ] && npm install --no-fund --no-audit --silent

echo -ne "    > Negotiating Cipher Keys"
TRIES=0
while [ $TRIES -lt 30 ]; do
    U=$(grep -o 'https://[-a-zA-Z0-9]*\.trycloudflare.com' ft.log | head -n 1)
    if [ ! -z "$U" ]; then
        echo -e " ${GREEN}[LOCKED]${NC}"
        echo -e " UI Entry: ${PURPLE}$U${NC}"
        break
    fi
    echo -ne "."
    sleep 1
    TRIES=$((TRIES+1))
done

echo -e "${GREEN}SYSTEM ONLINE${NC}"
npm run dev
