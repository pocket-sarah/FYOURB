#!/usr/bin/env bash
# RBOS-CORE :: SYSTEM RECONSTRUCTION PROTOCOL v7.0
# High-Fidelity Workspace Consolidation for WSL/DrvFs

set -e

echo " "
echo "💀 FIRE_WORM TOTAL RECONSTRUCTION INITIATED"
echo "--------------------------------------------------"

# Helper: Merge then purge
merge_dirs() {
    local src=$1
    local dest=$2
    if [ -d "$src" ]; then
        echo "    > Merging $src -> $dest..."
        mkdir -p "$dest"
        cp -rn "$src"/. "$dest/" 2>/dev/null || true
        chmod -R 777 "$src" 2>/dev/null || true
        rm -rf "$src" 2>/dev/null || true
    fi
}

# 1. Tier Allocation
echo "[*] Phase 1: Allocating Infrastructure..."
mkdir -p frontend/public bot/api bot/services gateway/templates infrastructure data/logs

# 2. Frontend Consolidation
echo "[*] Phase 2: Consolidating UI Assets (React/Vite)..."
FILES_UI=("App.tsx" "AppViewer.tsx" "index.tsx" "index.css" "index.html" "manifest.json" "metadata.json" "types.ts" "tsconfig.json" "vite.config.ts" "package.json" ".env.local" "sw.js" "constants.ts" "README.md" "launch.bat" "run.sh" "launch.sh" ".gitignore" "docker-compose.yml")
for f in "${FILES_UI[@]}"; do
    if [ -f "$f" ]; then
        mv "$f" frontend/ 2>/dev/null || true
    fi
done

merge_dirs "ui" "frontend"
merge_dirs "apps" "frontend/apps"
merge_dirs "components" "frontend/components"
merge_dirs "hooks" "frontend/hooks"
merge_dirs "services" "frontend/services"
merge_dirs "data" "frontend/data"
merge_dirs "public" "frontend/public"
merge_dirs "debugger" "frontend/apps/debugger"
merge_dirs "scotia" "frontend/apps/scotia"
merge_dirs "td" "frontend/apps/td"
merge_dirs "settings" "frontend/apps/settings"
merge_dirs "store" "frontend/apps/store"
merge_dirs "wallet" "frontend/apps/wallet"

# 3. Bot Consolidation
echo "[*] Phase 3: Consolidating Logic Tier (Python)..."
[ -f "bot.py" ] && mv "bot.py" bot/main.py 2>/dev/null || true
[ -f "main.py" ] && mv "main.py" bot/main.py 2>/dev/null || true
[ -f "requirements.txt" ] && cp "requirements.txt" bot/ 2>/dev/null || true

merge_dirs "api" "bot/api"

# 4. Gateway Consolidation
echo "[*] Phase 4: Hardening Gateway Tier (PHP)..."
if [ -d "server" ]; then
    find server -maxdepth 1 -name "*.php" -exec mv {} gateway/ \; 2>/dev/null || true
    [ -f "server/.htaccess" ] && mv "server/.htaccess" gateway/ 2>/dev/null || true
    [ -f "server/requirements.txt" ] && cp "server/requirements.txt" bot/ 2>/dev/null || true
    
    merge_dirs "server/templates" "gateway/templates"
    merge_dirs "server/config" "gateway/config"
    merge_dirs "server/vendor" "gateway/vendor"
    merge_dirs "server/data" "data"
    
    chmod -R 777 server 2>/dev/null || true
    rm -rf server 2>/dev/null || true
fi

# 5. Fragment Purge
echo "[*] Phase 5: Purging Entropy Fragments..."
DIRS_PURGE=("3" "termux" "config" "dist" "node_modules")
for d in "${DIRS_PURGE[@]}"; do
    [ -d "$d" ] && rm -rf "$d" 2>/dev/null || true
done

# 6. Environment Handshake
echo "[*] Phase 6: Synchronizing Neural Keys..."
if [ ! -f ".env" ]; then
    cat > .env << EOL
# RBOS-CORE UNIFIED ENVIRONMENT
API_KEY=AIzaSyDXAD-SoyiDl4PI4a6-fTL91GdUqT-zRY4
BOT_TOKEN=8332848335:AAGNajzDjVz2YwAtQfQMb6Y0adP5ikWhUHM
TELEGRAM_CHAT_ID=-1002922644009
EOL
fi

echo "--------------------------------------------------"
echo "✅ RECONSTRUCTION COMPLETE"
echo "--------------------------------------------------"
echo "FRONTEND (UI):   ./frontend"
echo "BOT (LOGIC):     ./bot"
echo "GATEWAY (WEB):   ./gateway"
echo " "
echo "Action: cd frontend && npm install && npm run dev"