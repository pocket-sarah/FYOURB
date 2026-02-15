
@echo off
title RBOS-CORE :: OMNI-CORE (v19.0)
color 0B
cls

echo.
echo  /$$$$$$   /$$$$$$  /$$$$$$$   /$$$$$$  /$$   /$$
echo /$$__  $$ /$$__  $$| $$__  $$ /$$__  $$| $$  | $$
echo ^| $$  \__/| $$  \ $$| $$  \ $$| $$  \ $$| $$  | $$
echo ^|  $$$$$$ | $$$$$$$$| $$$$$$$/| $$$$$$$$| $$$$$$$$
echo  \____  $$| $$__  $$| $$__  $$| $$__  $$| $$__  $$
echo  /$$  \ $$| $$  | $$| $$  \ $$| $$  | $$| $$  | $$
echo ^|  $$$$$$/| $$  | $$| $$  | $$| $$  | $$| $$  | $$
echo  \______/ |__/  |__/|__/  |__/|__/  |__/|__/  |__/
echo.
echo  =======================================================
echo   RBOS-CORE // WINDOWS OMNI-LOADER v19.0
echo  =======================================================
echo.

:: 1. Integrity
echo [*] Phase 1: Checking dependencies...
where php >nul 2>nul || (echo [!] PHP missing. && pause && exit)
where npm >nul 2>nul || (echo [!] Node.js missing. && pause && exit)
where python >nul 2>nul || (echo [!] Python missing. && pause && exit)

:: 2. Cleanup
echo [*] Phase 2: Cleansing stale processes...
taskkill /f /im cloudflared.exe >nul 2>&1
taskkill /f /im php.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

:: 3. Log Reset
echo [*] Phase 3: Synchronizing local logs...
if exist nexus.log del nexus.log
if exist php_link.log del php_link.log
type nul > nexus.log
type nul > php_link.log

:: 4. Binary Check
if not exist "cloudflared.exe" (
    echo     > Fetching Cloudflare binary...
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe -OutFile cloudflared.exe"
)

:: 5. Ignition
echo [*] Phase 4: Igniting Neural Monoliths...
start "PHP_MATRIX" /min php -S 127.0.0.1:3002 -t server
start "PYTHON_CORE" /min cmd /c "cd server && python main.py"

:: Wait for services to respond to TCP
echo.
echo [*] Phase 5: Waiting for TCP-Lock (Port 3001/3002)...
:TCP_CHECK
powershell -Command "try { $t = New-Object Net.Sockets.TcpClient('127.0.0.1', 3001); $t.Close(); $t2 = New-Object Net.Sockets.TcpClient('127.0.0.1', 3002); $t2.Close(); exit 0 } catch { exit 1 }"
if %ERRORLEVEL% NEQ 0 (
    timeout /t 1 >nul
    goto TCP_CHECK
)
echo [OK] TCP Uplink Verified.

:: 6. Tunnels
echo [*] Phase 6: Routing Satellite Links...
start "UI_TUNNEL" /min cmd /c "cloudflared.exe tunnel --url http://127.0.0.1:3000 > nexus.log 2>&1"
start "PHP_TUNNEL" /min cmd /c "cloudflared.exe tunnel --url http://127.0.0.1:3002 > php_link.log 2>&1"

echo.
echo Negotiating Cloudflare Wormholes...
:NEGOTIATE
timeout /t 2 >nul
findstr "trycloudflare.com" nexus.log >nul || goto :NEGOTIATE
findstr "trycloudflare.com" php_link.log >nul || goto :NEGOTIATE

echo.
echo =======================================================
echo  CORE ONLINE (v19.0)
echo =======================================================
echo.
echo  INTERFACE: 
powershell -Command "$c = Get-Content nexus.log | Select-String 'https://[a-zA-Z0-9-]+\.trycloudflare\.com'; if ($c) { $c.Matches[0].Value } else { 'Negotiating...' }"
echo.
echo  DEPOSIT:
powershell -Command "$c = Get-Content php_link.log | Select-String 'https://[a-zA-Z0-9-]+\.trycloudflare\.com'; if ($c) { $c.Matches[0].Value } else { 'Negotiating...' }"
echo =======================================================
echo Press any key to terminate system nodes.
pause >nul
taskkill /f /im cloudflared.exe >nul 2>&1
taskkill /f /im php.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1
exit
