@echo off
title LYBOK - Lancement
echo Demarrage de LYBOK en cours...
echo.

start "LYBOK Backend" cmd /k "cd /d %~dp0backend && npm start"
timeout /t 8 /nobreak >nul
start "LYBOK Frontend" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo Application lancee !
pause