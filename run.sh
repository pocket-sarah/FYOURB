#!/data/data/com.termux/files/usr/bin/bash

# RBOS-CORE :: TERMUX SYSTEM IGNITION v1.1
# Optimized for Aarch64 / Android 13+ Environments
# Path-aware execution for high-fidelity node synchronization

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
WHITE='\033[1;37m'
NC='\033[0m'

# Determine absolute project root
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

clear
echo -e "${PURPLE}"
echo "   ____  ____  ____  _____"
echo "  / __ \/ __ )/ __ \/ ___/"
echo " / /_/ / __  / / / /\__ \ "
echo "/ _, _/ /_/ / /_/ /___/ / "
echo "/_/ |_/_____/\____//____/  TERMUX_NODE_v1.1"
echo -e "${NC}"
echo -e "${BLUE}--------------------------------------------------${NC}"

# 1. Environment Verification
echo -e "${BLUE}[*] Phase 1: Handshaking with Termux Kernel...${NC}"

# Check for required packages
REQUIRED_PKGS=(nodejs-lts python php git binutils pkg-config)
for pkg in "${REQUIRED_PKGS[@]}"; do
    if ! command -v $pkg &> /dev/null; then
        echo -e "${YELLOW}    > Installing missing dependency: $pkg...${NC}"
        pkg install -y $pkg
    fi
done

# 2. Process Purge & Log Prep
echo -e "${BLUE}[*] Phase 2: Cleansing Stale Handshakes...${NC}"
pkill -f "php -S"
pkill -f "python $PROJECT_ROOT/bot/main.py"
pkill -f "vite"
touch gateway.log bot.log ui.log
rm -f *.log
touch gateway.log bot.log ui.log

# 3. Component Ignition
echo -e "${BLUE}[*] Phase 3: Igniting Neural Modules...${NC}"

# A. GATEWAY ENGINE (PHP)
echo -ne "${CYAN}    [+] Gateway Node (PHP:3002)...${NC}"
if [ -d "$PROJECT_ROOT/gateway" ]; then
    php -S 0.0.0.0:3002 -t "$PROJECT_ROOT/gateway" > "$PROJECT_ROOT/gateway.log" 2>&1 &
    echo -e "${GREEN} ONLINE${NC}"
else
    echo -e "${RED} FAILED (Dir $PROJECT_ROOT/gateway missing)${NC}"
fi

# B. LOGIC CORE (PYTHON)
echo -ne "${CYAN}    [+] Logic Core (PY:3001)...${NC}"
if [ -d "$PROJECT_ROOT/bot" ]; then
    # Auto-VENV if possible
    if [ ! -d "$PROJECT_ROOT/bot/venv" ]; then
        echo -e "${YELLOW}\n        > Building Python Virtual Environment...${NC}"
        python -m venv "$PROJECT_ROOT/bot/venv"
    fi
    source "$PROJECT_ROOT/bot/venv/bin/activate"
    pip install fastapi uvicorn google-genai python-dotenv requests --quiet
    python "$PROJECT_ROOT/bot/main.py" > "$PROJECT_ROOT/bot.log" 2>&1 &
    echo -e "${GREEN} ONLINE${NC}"
else
    echo -e "${RED} FAILED (Dir $PROJECT_ROOT/bot missing)${NC}"
fi

# C. USER INTERFACE (VITE)
echo -ne "${CYAN}    [+] Interface Node (JS:3000)...${NC}"
if [ -d "$PROJECT_ROOT/frontend" ]; then
    cd "$PROJECT_ROOT/frontend"
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}\n        > Provisioning UI dependencies...${NC}"
        npm install --silent
    fi
    # Use --host to allow access from local network (other phones/PC)
    npm run dev -- --host --port 3000 > "$PROJECT_ROOT/ui.log" 2>&1 &
    cd "$PROJECT_ROOT"
    echo -e "${GREEN} ONLINE${NC}"
else
    echo -e "${RED} FAILED (Dir $PROJECT_ROOT/frontend missing)${NC}"
fi

# 4. Networking & Access
echo -e "${BLUE}--------------------------------------------------${NC}"
echo -e "${GREEN}SYSTEM NOMINAL :: ALL NODES SYNCHRONIZED${NC}"
echo -e "${BLUE}--------------------------------------------------${NC}"

# Get Local IP - Robust Method for Termux
LOCAL_IP=$(ip addr show | grep 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | cut -d/ -f1 | head -n 1)

echo -e "${WHITE}ACCESS DIRECTORY:${NC}"
echo -e "  ${CYAN}Local Loopback:${NC}  http://localhost:3000"
if [ ! -z "$LOCAL_IP" ]; then
    echo -e "  ${CYAN}Network Uplink:${NC}  http://$LOCAL_IP:3000"
fi
echo -e "  ${CYAN}Gateway Uplink:${NC}  http://localhost:3002"

echo -e "${BLUE}--------------------------------------------------${NC}"
echo -e "${WHITE}DIAGNOSTICS:${NC}"
echo -e "  - Logic Core API Status: http://localhost:3001/api/status"
echo -e "  - Logs: tail -f ui.log bot.log gateway.log"
echo -e "  - To Stop: ${RED}pkill -f node && pkill -f python && pkill -f php${NC}"
echo -e "${BLUE}--------------------------------------------------${NC}"

# Visual Confirmation
echo -e "${PURPLE}CORE_NODE_V99 :: AWAITING DIRECTIVES...${NC}"

# Monitor UI log for startup errors
tail -f ui.log