@echo off
title Reiniciando Backend
color 0A
cls
echo ========================================
echo   REINICIANDO BACKEND
echo ========================================
echo.

echo Deteniendo procesos en puerto 3000...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo   Deteniendo proceso %%a...
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

echo.
echo Iniciando Backend...
echo.
cd /d %~dp0backend
call npm run start:dev

pause

