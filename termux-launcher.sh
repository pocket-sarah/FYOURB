
#!/data/data/com.termux/files/usr/bin/bash

# RBOS-CORE :: TERMUX OMNI-LAUNCHER v1.0
# "Spark, Gas, and AirContinue" - High Speed Mobile Orchestration

# Colors for the terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear
echo -e "${PURPLE}   RBOS-CORE :: TERMUX SYSTEM IGNITION${NC}"
echo -e "${BLUE}--------------------------------------------------${NC}"

# 1. Dependency Check & Install
echo -e "${BLUE}[*] Phase 1: Validating System Packages...${NC}"
pkg update -y
pkg install -y php python nodejs-lts git binutils pkg-config

# 2. Cleanup Stale Nodes
echo -e "${BLUE}[*] Phase 2: Cleansing Stale Processes...${NC}"
pkill -f "php -S"
pkill -f "python main.py"
pkill -f "vite"

# 3. Environment Setup
echo -e "${BLUE}[*] Phase 3: Synchronizing Neural Matrix...${NC}"

# Python VENV Setup
if [ ! -d "bot/venv" ]; then
    echo -e "${YELLOW}    > Provisioning Python Virtual Environment...${NC}"
    python -m venv bot/venv
    source bot/venv/bin/activate
    pip install --upgrade pip
    pip install -r bot/requirements.txt
else
    source bot/venv/bin/activate
fi

# Node Dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}    > Provisioning Frontend Dependencies...${NC}"
    cd frontend && npm install && cd ..
fi

# 4. Process Ignition
echo -e "${BLUE}[*] Phase 4: Igniting Nodes...${NC}"

# Start PHP Gateway (Port 3002)
echo -e "${GREEN}    [OK] Gateway Layer (PHP:3002) Starting...${NC}"
php -S 0.0.0.0:3002 -t gateway > gateway.log 2>&1 &

# Start Python Logic Core (Port 3001)
echo -e "${GREEN}    [OK] Logic Core (PY:3001) Starting...${NC}"
cd bot
python main.py > ../bot.log 2>&1 &
cd ..

# Start Vite UI (Port 3000)
echo -e "${GREEN}    [OK] User Interface (Vite:3000) Starting...${NC}"
cd frontend
npm run dev -- --host > ../ui.log 2>&1 &
cd ..

echo -e "${BLUE}--------------------------------------------------${NC}"
echo -e "${GREEN}SYSTEM ONLINE${NC}"
echo -e "${YELLOW}UI Access: ${NC}http://localhost:3000"
echo -e "${YELLOW}IP Access: ${NC}http://$(ifconfig wlan0 | grep 'inet ' | awk '{print $2}'):3000"
echo -e "${BLUE}--------------------------------------------------${NC}"
echo -e "Logs available in: ${WHITE}ui.log, bot.log, gateway.log${NC}"
echo -e "To stop all services, run: ${RED}pkill -f node && pkill -f python && pkill -f php${NC}"

# Keep script alive to monitor logs if needed
tail -f ui.log
