@echo off
chcp 65001 >nul
echo ========================================
echo   INICIO COMPLETO DE SERVIDORES
echo ========================================
echo.

REM Detener procesos existentes
echo [1/5] Deteniendo procesos existentes...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo    ✓ Procesos detenidos
echo.

REM Verificar dependencias
echo [2/5] Verificando dependencias...
cd /d %~dp0backend
if not exist "node_modules" (
    echo    ⚠ Instalando dependencias del backend...
    call npm install
)
cd /d %~dp0frontend
if not exist "node_modules" (
    echo    ⚠ Instalando dependencias del frontend...
    call npm install
)
cd /d %~dp0
echo    ✓ Dependencias verificadas
echo.

REM Verificar Prisma
echo [3/5] Verificando Prisma...
cd /d %~dp0backend
if exist "prisma\schema.prisma" (
    echo    Generando cliente de Prisma...
    call npx prisma generate >nul 2>&1
    echo    ✓ Prisma configurado
) else (
    echo    ⚠ Schema de Prisma no encontrado
)
cd /d %~dp0
echo.

REM Verificar archivo .env
echo [4/5] Verificando configuración...
cd /d %~dp0backend
if not exist ".env" (
    echo    ⚠ Archivo .env no encontrado, creando...
    if exist "create-env.js" (
        call node create-env.js
    ) else (
        echo    ⚠ No se puede crear .env automáticamente
        echo    Por favor crea el archivo .env manualmente
    )
) else (
    echo    ✓ Archivo .env encontrado
)
cd /d %~dp0
echo.

REM Iniciar servidores
echo [5/5] Iniciando servidores...
echo.
echo    Iniciando Backend (puerto 3000)...
start "Backend - Puerto 3000" cmd /k "cd /d %~dp0backend && echo [BACKEND] Iniciando... && npm run start:dev"

timeout /t 5 /nobreak >nul

echo    Iniciando Frontend (puerto 5173)...
start "Frontend - Puerto 5173" cmd /k "cd /d %~dp0frontend && echo [FRONTEND] Iniciando... && npm run dev"

echo.
echo ========================================
echo   SERVIDORES INICIADOS
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3000
echo Admin:    http://localhost:5173/#/admin
echo.
echo Espera 15-20 segundos para que los servidores inicien completamente
echo.
echo Presiona cualquier tecla para verificar el estado...
pause >nul

cd /d %~dp0
timeout /t 3 /nobreak >nul
node verificar-servidores.js

