@echo off
echo Iniciando servidores...

REM Crear .env si no existe
cd backend
if not exist .env (
    if exist config-migration.env (
        copy config-migration.env .env
    ) else (
        echo DATABASE_URL=postgresql://user:password@host:port/database > .env
        echo PORT=3000 >> .env
        echo NODE_ENV=development >> .env
        echo JWT_SECRET=lucky_snap_jwt_secret_2024 >> .env
    )
)

REM Instalar dependencias backend si no existen
if not exist node_modules (
    echo Instalando dependencias del backend...
    call npm install
)

cd ..\frontend

REM Instalar dependencias frontend si no existen
if not exist node_modules (
    echo Instalando dependencias del frontend...
    call npm install
)

cd ..

REM Iniciar backend
echo Iniciando backend...
start "Backend" cmd /k "cd backend && npm run start:prisma"

timeout /t 5 /nobreak >nul

REM Iniciar frontend
echo Iniciando frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Servidores iniciados!
echo Abre: http://localhost:5173
echo.
pause

