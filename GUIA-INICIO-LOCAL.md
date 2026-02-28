# 🚀 Guía Completa para Iniciar el Proyecto en Local

## 📋 Requisitos Previos

- Node.js 18+ instalado
- npm instalado
- Dependencias instaladas (`npm run install:all`)

## 🔧 Configuración Inicial (Solo la primera vez)

### 1. Verificar/Crear archivo .env del backend

El backend necesita un archivo `.env` en la carpeta `backend/` con la configuración de la base de datos.

Si no existe, puedes crearlo ejecutando:
```bash
cd backend
node create-env.js
```

O crearlo manualmente basándote en `backend/env.example`.

### 2. Generar cliente de Prisma

```bash
cd backend
npx prisma generate
```

## 🚀 Iniciar Servidores

### Opción 1: Script Automático (Recomendado)

Ejecuta el archivo batch:
```
iniciar-completo.bat
```

Este script:
- ✅ Detiene procesos existentes
- ✅ Verifica dependencias
- ✅ Configura Prisma
- ✅ Verifica .env
- ✅ Inicia ambos servidores en ventanas separadas

### Opción 2: Manual (2 Terminales)

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Opción 3: Desde la raíz

```bash
npm run dev
```

## 🔍 Verificar Estado

Para verificar si los servidores están corriendo:

```bash
node verificar-servidores.js
```

## 🌐 URLs de Acceso

Una vez que los servidores estén corriendo:

- **Frontend (Aplicación)**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **Panel Admin**: http://localhost:5173/#/admin

## ⚠️ Solución de Problemas

### Los servidores no inician

1. **Verifica que los puertos estén libres:**
   ```powershell
   netstat -ano | findstr ":3000"
   netstat -ano | findstr ":5173"
   ```

2. **Detén procesos manualmente:**
   ```powershell
   # Encuentra el PID del proceso
   netstat -ano | findstr ":3000"
   # Mata el proceso (reemplaza PID)
   taskkill /F /PID <PID>
   ```

3. **Verifica dependencias:**
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

4. **Verifica Prisma:**
   ```bash
   cd backend
   npx prisma generate
   ```

5. **Verifica archivo .env:**
   ```bash
   cd backend
   # Debe existir el archivo .env
   type .env
   ```

### El backend no conecta a la base de datos

1. Verifica que `DATABASE_URL` en `.env` sea correcta
2. Verifica que la base de datos esté accesible
3. Ejecuta las migraciones:
   ```bash
   cd backend
   npm run migrate:deploy
   ```

### El frontend no se conecta al backend

1. Verifica que el backend esté corriendo en puerto 3000
2. Verifica la configuración de CORS en el backend
3. Revisa la consola del navegador para errores

## 🛑 Detener Servidores

### Si usaste el script batch:
- Cierra las ventanas de CMD que se abrieron

### Si usaste terminales manuales:
- Presiona `Ctrl+C` en cada terminal

### Detener procesos por puerto:
```powershell
# Puerto 3000 (Backend)
Get-NetTCPConnection -LocalPort 3000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Puerto 5173 (Frontend)
Get-NetTCPConnection -LocalPort 5173 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

## 📝 Notas Importantes

- El backend tarda aproximadamente 10-15 segundos en iniciar completamente
- El frontend tarda aproximadamente 5-10 segundos en iniciar
- Los cambios en el código se reflejan automáticamente gracias a Hot Module Replacement (HMR)
- Si modificas el archivo `.env`, necesitas reiniciar el backend

## 🆘 Si Nada Funciona

1. Reinicia tu computadora
2. Verifica que Node.js esté correctamente instalado: `node --version`
3. Verifica que npm esté correctamente instalado: `npm --version`
4. Reinstala dependencias:
   ```bash
   npm run clean
   npm run install:all
   ```

