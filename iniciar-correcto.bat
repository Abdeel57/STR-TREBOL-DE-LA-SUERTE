@echo off
chcp 65001 >nul
cls
echo ========================================
echo   INICIANDO SERVIDORES CORRECTAMENTE
echo ========================================
echo.

REM Ir a la carpeta del proyecto
cd /d %~dp0

REM Crear .env si no existe
cd backend
if not exist .env (
    echo [1/4] Creando archivo .env...
    if exist config-migration.env (
        copy config-migration.env .env >nul
        echo    OK: .env creado desde config-migration.env
    ) else (
        echo DATABASE_URL=postgresql://user:password@host:port/database > .env
        echo PORT=3000 >> .env
        echo NODE_ENV=development >> .env
        echo JWT_SECRET=lucky_snap_jwt_secret_2024 >> .env
        echo    OK: .env basico creado
    )
) else (
    echo [1/4] OK: .env ya existe
)

REM Instalar dependencias backend
if not exist node_modules (
    echo [2/4] Instalando dependencias del backend...
    echo    Esto puede tardar 2-3 minutos...
    call npm install
    if errorlevel 1 (
        echo    ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
    echo    OK: Dependencias instaladas
) else (
    echo [2/4] OK: Dependencias del backend ya instaladas
)

REM Generar Prisma
echo [3/4] Generando cliente de Prisma...
call npx prisma generate >nul 2>&1
echo    OK: Prisma generado

cd ..\frontend

REM Instalar dependencias frontend
if not exist node_modules (
    echo [4/4] Instalando dependencias del frontend...
    echo    Esto puede tardar 2-3 minutos...
    call npm install
    if errorlevel 1 (
        echo    ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
    echo    OK: Dependencias instaladas
) else (
    echo [4/4] OK: Dependencias del frontend ya instaladas
)

cd ..

REM Detener procesos anteriores
echo.
echo [LIMPIANDO] Liberando puertos...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul

REM Iniciar Backend
echo [INICIANDO] Backend en puerto 3000...
start "Backend - Puerto 3000" cmd /k "cd /d %~dp0backend && echo ======================================== && echo   BACKEND - Puerto 3000 && echo ======================================== && echo. && npm run start:dev"

timeout /t 5 /nobreak >nul

REM Iniciar Frontend
echo [INICIANDO] Frontend en puerto 5173...
start "Frontend - Puerto 5173" cmd /k "cd /d %~dp0frontend && echo ======================================== && echo   FRONTEND - Puerto 5173 && echo ======================================== && echo. && npm run dev"

echo.
echo ========================================
echo   SERVIDORES INICIADOS
echo ========================================
echo.
echo Abre en tu navegador:
echo   http://localhost:5173
echo.
echo Espera 15-20 segundos para que inicien completamente...
echo.
echo IMPORTANTE: Mira las ventanas de Backend y Frontend
echo   Si ves errores, copialos y compartelos
echo.
timeout /t 15 /nobreak >nul

REM Abrir navegador
start http://localhost:5173

echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul






