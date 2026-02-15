#!/bin/bash

# RBOS-CORE :: NEURAL LAUNCHER v18.0
# --------------------------------------------------------

# Configuration
BACKEND_PORT=3001
FRONTEND_PORT=3000
PHP_PORT=3002
VENV_DIR="bot/venv"
SHADOW_NAME=".rbos-core-nexus"

# Colors
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear
echo -e "${PURPLE}   RBOS-CORE :: OMNI-LAUNCHER v18.0${NC}"

cleanup_stale() {
    echo -e "${BLUE}[*] Phase 1: Cleansing stale nodes...${NC}"
    pkill -f "cloudflared" 2>/dev/null
    pkill -f "vite" 2>/dev/null
    pkill -f "bot/main.py" 2>/dev/null
    pkill -f "php -S 127.0.0.1:$PHP_PORT" 2>/dev/null
}

cleanup_stale

# 1. Environment Sync
CURRENT_DIR=$(pwd)
if [[ "$CURRENT_DIR" == /mnt/* ]]; then
    SHADOW_DIR="$HOME/$SHADOW_NAME"
    mkdir -p "$SHADOW_DIR"
    echo -e "${BLUE}[*] Phase 2: Syncing Shadow Node (WSL Speed Boost)...${NC}"
    rsync -a --delete --exclude 'node_modules' --exclude 'bot/venv' --exclude '.git' "$CURRENT_DIR/" "$SHADOW_DIR/"
    cd "$SHADOW_DIR"
fi

# 2. Gateway Ignition
echo -e "${BLUE}[*] Phase 3: Igniting Gateway Tier (PHP)...${NC}"
php -S 127.0.0.1:$PHP_PORT -t gateway > /dev/null 2>&1 &

# 3. Bot Ignition
echo -e "${BLUE}[*] Phase 4: Igniting Logic Tier (Python)...${NC}"
if [ ! -d "$VENV_DIR" ]; then
    python3 -m venv $VENV_DIR
    source $VENV_DIR/bin/activate
    pip install -r bot/requirements.txt --quiet
else
    source $VENV_DIR/bin/activate
fi

cd bot
python3 -u main.py > ../bot.log 2>&1 &
cd ..

# 4. Frontend Ignition
echo -e "${BLUE}[*] Phase 5: Igniting UI Tier (React)...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}    > Provisioning Node dependencies...${NC}"
    npm install --no-fund --no-audit --silent
fi

echo -e "${GREEN}SYSTEM ONLINE${NC}"
npm run dev