@echo off
chcp 65001 >nul
echo ========================================
echo   CONFIGURACION Y INICIO DE SERVIDORES
echo ========================================
echo.

REM 1. Crear .env si no existe
echo [1/4] Configurando archivo .env...
cd /d %~dp0backend
if not exist ".env" (
    echo    Creando .env desde config-migration.env...
    if exist "config-migration.env" (
        copy "config-migration.env" ".env" >nul
        echo    ✓ .env creado desde config-migration.env
    ) else (
        echo    Creando .env básico...
        (
            echo # Variables de Entorno
            echo DATABASE_URL=postgresql://user:password@host:port/database
            echo PORT=3000
            echo NODE_ENV=development
            echo JWT_SECRET=lucky_snap_jwt_secret_2024_change_in_production
        ) > .env
        echo    ✓ .env básico creado
        echo    ⚠️  IMPORTANTE: Edita backend\.env con tu DATABASE_URL real
    )
) else (
    echo    ✓ .env ya existe
)
cd /d %~dp0
echo.

REM 2. Instalar dependencias del backend
echo [2/4] Instalando dependencias del backend...
cd /d %~dp0backend
if not exist "node_modules" (
    echo    Instalando paquetes (esto puede tardar unos minutos)...
    call npm install
    if errorlevel 1 (
        echo    ❌ Error instalando dependencias del backend
        pause
        exit /b 1
    )
    echo    ✓ Dependencias del backend instaladas
) else (
    echo    ✓ Dependencias del backend ya instaladas
)
cd /d %~dp0
echo.

REM 3. Instalar dependencias del frontend
echo [3/4] Instalando dependencias del frontend...
cd /d %~dp0frontend
if not exist "node_modules" (
    echo    Instalando paquetes (esto puede tardar unos minutos)...
    call npm install
    if errorlevel 1 (
        echo    ❌ Error instalando dependencias del frontend
        pause
        exit /b 1
    )
    echo    ✓ Dependencias del frontend instaladas
) else (
    echo    ✓ Dependencias del frontend ya instaladas
)
cd /d %~dp0
echo.

REM 4. Generar Prisma Client
echo [4/4] Generando cliente de Prisma...
cd /d %~dp0backend
call npx prisma generate >nul 2>&1
echo    ✓ Prisma generado
cd /d %~dp0
echo.

REM 5. Iniciar servidores
echo ========================================
echo   INICIANDO SERVIDORES
echo ========================================
echo.

REM Detener procesos existentes
echo Liberando puertos...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo.

echo Iniciando Backend (puerto 3000)...
start "🚀 Backend - Puerto 3000" cmd /k "cd /d %~dp0backend && echo ======================================== && echo   BACKEND - Puerto 3000 && echo ======================================== && echo. && npm run start:prisma"

timeout /t 5 /nobreak >nul

echo Iniciando Frontend (puerto 5173)...
start "🎨 Frontend - Puerto 5173" cmd /k "cd /d %~dp0frontend && echo ======================================== && echo   FRONTEND - Puerto 5173 && echo ======================================== && echo. && npm run dev"

echo.
echo ========================================
echo   CONFIGURACION COMPLETA
echo ========================================
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:3000/api
echo 📊 Admin:    http://localhost:5173/#/admin
echo.
echo ⏳ Espera 15-20 segundos para que los servidores inicien
echo.
echo 💡 Las ventanas de los servidores están abiertas arriba
echo    Puedes ver los logs en tiempo real ahí
echo.
echo ⚠️  Si el backend muestra error de base de datos:
echo    Edita backend\.env y configura tu DATABASE_URL
echo.
pause

