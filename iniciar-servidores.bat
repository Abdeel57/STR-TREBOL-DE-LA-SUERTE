@echo off
chcp 65001 >nul
echo ========================================
echo   INICIANDO SERVIDORES DE DESARROLLO
echo ========================================
echo.

REM Detener procesos existentes en los puertos
echo [1/3] Liberando puertos...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo    ✓ Puertos liberados
echo.

REM Iniciar Backend
echo [2/3] Iniciando Backend (puerto 3000)...
start "🚀 Backend - Puerto 3000" cmd /k "cd /d %~dp0backend && echo ======================================== && echo   BACKEND - Puerto 3000 && echo ======================================== && echo. && npm run start:prisma"
timeout /t 3 /nobreak >nul
echo    ✓ Backend iniciado
echo.

REM Iniciar Frontend
echo [3/3] Iniciando Frontend (puerto 5173)...
start "🎨 Frontend - Puerto 5173" cmd /k "cd /d %~dp0frontend && echo ======================================== && echo   FRONTEND - Puerto 5173 && echo ======================================== && echo. && npm run dev"
echo    ✓ Frontend iniciado
echo.

echo ========================================
echo   SERVIDORES INICIADOS
echo ========================================
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:3000/api
echo 📊 Admin:    http://localhost:5173/#/admin
echo.
echo ⏳ Espera 15-20 segundos para que los servidores inicien completamente
echo.
echo 💡 Las ventanas de los servidores están abiertas arriba
echo    Puedes ver los logs en tiempo real ahí
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul

