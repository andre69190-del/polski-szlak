@echo off
REM Port 8788 fuer den Handy-Test in der Windows-Firewall freigeben (braucht Admin, fragt automatisch nach)
net session >nul 2>&1 || (powershell -NoProfile -Command "Start-Process -FilePath %~f0 -Verb RunAs" & exit /b)
netsh advfirewall firewall delete rule name="Polski Szlak Test 8788" >nul 2>&1
netsh advfirewall firewall add rule name="Polski Szlak Test 8788" dir=in action=allow protocol=TCP localport=8788 profile=any
echo.
echo Freigabe aktiv: Port 8788 ist fuer Handys im WLAN erreichbar.
echo Wieder schliessen mit firewall_sperren.bat
echo.
echo Aktueller Netzwerktyp (sollte "Private" sein):
powershell -NoProfile -Command "Get-NetConnectionProfile | Format-Table Name,InterfaceAlias,NetworkCategory -AutoSize"
pause
