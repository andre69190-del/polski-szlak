@echo off
REM Freigabe fuer Port 8788 wieder entfernen
net session >nul 2>&1 || (powershell -NoProfile -Command "Start-Process -FilePath %~f0 -Verb RunAs" & exit /b)
netsh advfirewall firewall delete rule name="Polski Szlak Test 8788"
echo Freigabe entfernt.
pause
