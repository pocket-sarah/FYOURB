
#!/data/data/com.termux/files/usr/bin/bash

# RBOS-CORE :: TRIAD-TUNNEL IGNITION (SPARK v25)
# --------------------------------------------------
# [JS:3000] [PY:3001] [PHP:3002] -> Separate Cloudflared URLs

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${PURPLE}   ____  ____  ____  _____${NC}"
echo -e "${PURPLE}  / __ \/ __ )/ __ \/ ___/${NC}"
echo -e "${PURPLE} / /_/ / __  / / / /\__ \ ${NC}"
echo -e "${PURPLE}/ _, _/ /_/ / /_/ /___/ / ${NC}"
echo -e "${PURPLE}/_/ |_/_____/\____//____/  TRIAD_TUNNEL_NODE${NC}"
echo -e "${BLUE}--------------------------------------------------${NC}"

# 1. Dependency Check
echo -e "${BLUE}[*] Phase 1: Validating System Environment...${NC}"
pkg update -y
pkg install -y php python nodejs-lts git binutils pkg-config curl wget -y

# 2. Architecture-Specific Cloudflared Acquisition
if [ ! -f "./cloudflared" ]; then
    echo -e "${YELLOW}    > Detecting Architecture...${NC}"
    ARCH=$(uname -m)
    if [[ "$ARCH" == "aarch64" ]]; then
        URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64"
    else
        URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm"
    fi
    echo -e "${YELLOW}    > Downloading Cloudflared for $ARCH...${NC}"
    curl -L $URL -o cloudflared
    chmod +x cloudflared
fi

# 3. Process Cleansing
echo -e "${BLUE}[*] Phase 2: Cleansing Stale Nodes...${NC}"
pkill -f "php -S"
pkill -f "python main.py"
pkill -f "vite"
pkill -f "cloudflared"
rm -f *.log

# 4. Engine Ignition
echo -e "${BLUE}[*] Phase 3: Igniting Engines...${NC}"

# Start PHP Gateway (3002)
echo -ne "${CYAN}    [+] Gateway Engine (PHP:3002)...${NC}"
php -S 127.0.0.1:3002 -t gateway > gateway_srv.log 2>&1 &
echo -e "${GREEN} ONLINE${NC}"

# Start Python Logic Core (3001)
echo -ne "${CYAN}    [+] Logic Core (PY:3001)...${NC}"
if [ ! -d "bot/venv" ]; then python -m venv bot/venv; fi
source bot/venv/bin/activate
pip install fastapi uvicorn google-genai python-dotenv jinja2 requests --quiet
cd bot
python main.py > ../bot_srv.log 2>&1 &
cd ..
echo -e "${GREEN} ONLINE${NC}"

# Start JS Frontend (3000)
echo -ne "${CYAN}    [+] Frontend UI (JS:3000)...${NC}"
if [ ! -d "node_modules" ]; then npm install --silent; fi
npm run dev -- --port 3000 --host > ui_srv.log 2>&1 &
echo -e "${GREEN} ONLINE${NC}"

# 5. Triad Tunnel Handshake
echo -e "${BLUE}[*] Phase 4: Establishing Triad Tunnels...${NC}"

echo -ne "${YELLOW}    > Opening UI Tunnel...${NC}"
./cloudflared tunnel --url http://localhost:3000 > ui_tunnel.log 2>&1 &
echo -e "${GREEN} [LOCKED]${NC}"

echo -ne "${YELLOW}    > Opening API Tunnel...${NC}"
./cloudflared tunnel --url http://localhost:3001 > api_tunnel.log 2>&1 &
echo -e "${GREEN} [LOCKED]${NC}"

echo -ne "${YELLOW}    > Opening DEPOSIT Tunnel...${NC}"
./cloudflared tunnel --url http://localhost:3002 > dep_tunnel.log 2>&1 &
echo -e "${GREEN} [LOCKED]${NC}"

# 6. URL Extraction
echo -e "${BLUE}[*] Phase 5: Extracting Satellite Links...${NC}"
sleep 8 # Give tunnels time to stabilize

get_url() {
    grep -o 'https://[-a-zA-Z0-9]*\.trycloudflare.com' $1 | head -n 1
}

UI_URL=$(get_url ui_tunnel.log)
API_URL=$(get_url api_tunnel.log)
DEP_URL=$(get_url dep_tunnel.log)

echo -e "${BLUE}--------------------------------------------------${NC}"
echo -e "${PURPLE}           SYSTEM ACCESS HUD (ACTIVE)${NC}"
echo -e "${BLUE}--------------------------------------------------${NC}"
echo -e "${CYAN}  [USER_INTERFACE] : ${NC}${GREEN}$UI_URL${NC}"
echo -e "${CYAN}  [LOGIC_CORE_API] : ${NC}${YELLOW}$API_URL${NC}"
echo -e "${CYAN}  [GATEWAY_NODE]   : ${NC}${RED}$DEP_URL${NC}"
echo -e "${BLUE}--------------------------------------------------${NC}"
echo -e "${WHITE}  Logs: tail -f ui_srv.log | bot_srv.log | gateway_srv.log${NC}"
echo -e "${WHITE}  To Kill: pkill -f node && pkill -f python && pkill -f php && pkill -f cloudflared${NC}"
echo -e "${BLUE}--------------------------------------------------${NC}"

# Stay alive for logs
tail -f ui_srv.log
