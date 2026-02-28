@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   INICIANDO SERVIDORES
echo ========================================
echo.

REM Verificar si existe .env, si no, crearlo desde config-migration.env
cd /d %~dp0backend
if not exist ".env" (
    if exist "config-migration.env" (
        copy "config-migration.env" ".env" >nul
        echo [OK] Archivo .env creado
    ) else (
        echo DATABASE_URL=postgresql://user:password@host:port/database > .env
        echo PORT=3000 >> .env
        echo NODE_ENV=development >> .env
        echo JWT_SECRET=lucky_snap_jwt_secret_2024 >> .env
        echo [OK] Archivo .env básico creado
    )
)

REM Instalar dependencias si no existen
if not exist "node_modules" (
    echo [INSTALANDO] Dependencias del backend...
    call npm install
)

cd /d %~dp0frontend
if not exist "node_modules" (
    echo [INSTALANDO] Dependencias del frontend...
    call npm install
)

cd /d %~dp0backend
if not exist "node_modules\.prisma" (
    echo [GENERANDO] Cliente de Prisma...
    call npx prisma generate >nul 2>&1
)

cd /d %~dp0

REM Detener procesos anteriores
echo [LIMPIANDO] Puertos...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3000" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
timeout /t 1 /nobreak >nul

REM Iniciar Backend
echo [INICIANDO] Backend en puerto 3000...
start "Backend" cmd /k "cd /d %~dp0backend && npm run start:prisma"

timeout /t 3 /nobreak >nul

REM Iniciar Frontend
echo [INICIANDO] Frontend en puerto 5173...
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo   SERVIDORES INICIADOS
echo ========================================
echo.
echo Abre en tu navegador:
echo   http://localhost:5173
echo.
echo Espera 10-15 segundos para que inicien...
echo.
timeout /t 3 /nobreak >nul

REM Abrir navegador automáticamente después de 15 segundos
timeout /t 12 /nobreak >nul
start http://localhost:5173

echo.
echo Presiona cualquier tecla para cerrar...
pause >nul

