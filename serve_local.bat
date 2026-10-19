@echo off
REM Polski Szlak - lokaler Test-Server fuers Handy im WLAN (uebernommen aus GeoQuest serve_local.bat)
REM IP-Ermittlung: nur der Adapter mit Standard-Gateway (= echtes WLAN/LAN), nicht WSL/Hyper-V/VPN.
echo ================================================
echo  Polski Szlak - Lokaler Test-Server
echo ================================================
echo.
set "IP="
for /f "usebackq delims=" %%a in (`powershell -NoProfile -Command "(Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null -and $_.NetAdapter.Status -eq 'Up' } | Select-Object -First 1).IPv4Address.IPAddress"`) do set "IP=%%a"
if "%IP%"=="" (
  echo Konnte die WLAN-Adresse nicht automatisch finden. Alle Adressen:
  ipconfig | findstr /C:"IPv4"
  echo Nimm die Adresse, die mit 192.168. oder 10. beginnt.
  set "IP=DEINE-IP"
)
echo Deine WLAN-Adresse: %IP%
echo.
echo Oeffne auf dem Handy (gleiches WLAN):
echo   http://%IP%:8788
echo.
echo Hinweis: Fragt die Windows-Firewall, "Private Netzwerke" fuer Python erlauben.
echo Offline-Modus und Spracherkennung brauchen HTTPS (siehe docs\HANDY_TEST.md).
echo.
echo [Strg+C zum Beenden]
echo ================================================
cd /d "%~dp0"
python -m http.server 8788 --bind 0.0.0.0
pause
