@echo off
title Gym Website Server
echo ==========================================
echo       Starting Gym Website...
echo ==========================================
echo.

echo Opening application in your default browser...
start http://localhost:8080

echo Starting Node.js server...
echo (You can close this window to stop the server)
echo.

node server.js

pause