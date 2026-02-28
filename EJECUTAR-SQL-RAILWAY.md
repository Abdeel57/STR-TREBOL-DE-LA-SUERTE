# 🚀 Ejecutar SQL en Railway - Guía Rápida

## Opción 1: Usar Railway CLI (Recomendado)

### Paso 1: Instalar Railway CLI
```bash
# Windows (PowerShell)
iwr https://railway.app/install.ps1 | iex

# O con npm
npm install -g @railway/cli
```

### Paso 2: Iniciar sesión
```bash
railway login
```

### Paso 3: Conectar a tu proyecto
```bash
railway link
# Selecciona tu proyecto "Neo"
```

### Paso 4: Ejecutar el script SQL
```bash
railway run psql < CREAR-TABLAS-FALTANTES-NEO.sql
```

---

## Opción 2: Usar la Interfaz Web de Railway

### Método A: Railway Database Viewer
1. Ve a Railway → Tu proyecto → Servicio PostgreSQL
2. Pestaña **"Database"** → **"Data"**
3. Haz clic en **"+ New Table"** (pero esto solo crea tablas básicas)
4. **Mejor opción**: Usa el método de Prisma (abajo)

### Método B: Ejecutar desde el Backend (Mejor Opción)
1. El backend de Neo ya tiene un endpoint para inicializar la base de datos
2. O ejecuta las migraciones de Prisma directamente

---

## Opción 3: Ejecutar Migraciones de Prisma (Más Fácil)

### Desde Railway Dashboard:
1. Ve a tu servicio **Backend de Neo** en Railway
2. Pestaña **"Deployments"** o **"Logs"**
3. Busca el botón **"Run Command"** o **"Shell"**
4. Ejecuta:
```bash
cd backend
npx prisma migrate deploy
```

### O desde tu computadora local:
1. Conecta tu proyecto local a Railway:
```bash
railway link
```

2. Ejecuta las migraciones:
```bash
railway run --service backend npx prisma migrate deploy
```

---

## Opción 4: Usar el Endpoint de Inicialización del Backend

Tu backend tiene un endpoint para inicializar la base de datos:

1. Ve a: `https://neo-production-9455.up.railway.app/api/init/database`
2. O ejecuta desde terminal:
```bash
curl -X POST https://neo-production-9455.up.railway.app/api/init/database
```

Este endpoint ejecutará automáticamente la creación de todas las tablas.

---

## Opción 5: Crear un Script Temporal en el Backend

Puedo crear un script que ejecutes desde Railway que cree las tablas automáticamente.

