# 🔧 Solución: Cómo Iniciar los Servidores

## ⚠️ Problema Detectado

Los servidores no se están iniciando porque faltan:
1. Archivo `.env` en `backend/`
2. Dependencias instaladas (`node_modules`)

## ✅ Solución Paso a Paso

### Paso 1: Crear archivo .env

**Opción A: Si tienes una base de datos de Railway/Supabase**

1. Ve a la carpeta `backend`
2. Copia el archivo `config-migration.env` y renómbralo a `.env`
3. O crea un archivo `.env` con este contenido:

```
DATABASE_URL=postgresql://usuario:password@host:puerto/database
PORT=3000
NODE_ENV=development
JWT_SECRET=lucky_snap_jwt_secret_2024_change_in_production
```

**Opción B: Si NO tienes base de datos aún**

El backend puede iniciar sin base de datos (intentará reconectar), pero algunas funciones no funcionarán.

Crea `backend/.env` con:
```
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
NODE_ENV=development
JWT_SECRET=lucky_snap_jwt_secret_2024_change_in_production
```

### Paso 2: Instalar Dependencias

Abre **DOS terminales** (PowerShell o CMD):

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

Esto puede tardar 2-5 minutos la primera vez.

### Paso 3: Generar Prisma Client

En la terminal del backend:
```bash
cd backend
npx prisma generate
```

### Paso 4: Iniciar Servidores

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:prisma
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Paso 5: Verificar

Espera 15-20 segundos y abre en tu navegador:
- **Frontend**: http://localhost:5173
- **Admin**: http://localhost:5173/#/admin

## 🚀 Método Rápido (Si tienes npm funcionando)

Ejecuta este comando en la raíz del proyecto:

```bash
configurar-y-iniciar.bat
```

Este script hace todo automáticamente.

## ⚠️ Si npm no funciona

1. Verifica que Node.js esté instalado:
   ```bash
   node --version
   npm --version
   ```

2. Si no está instalado, descárgalo de: https://nodejs.org/

## 📞 ¿Necesitas ayuda?

Si sigues teniendo problemas, dime:
1. ¿Qué error ves en las ventanas de los servidores?
2. ¿Tienes Node.js instalado? (`node --version`)
3. ¿Tienes una base de datos PostgreSQL configurada?

