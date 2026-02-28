# 🚂 Deploy del Backend en Railway

## 📋 Requisitos Previos

- ✅ Cuenta en [Railway.app](https://railway.app)
- ✅ Repositorio en GitHub con el código
- ✅ Base de datos PostgreSQL (puede ser en Railway o externa)

---

## 🚀 Paso 1: Crear Proyecto en Railway

1. **Ve a Railway**: https://railway.app
2. **Inicia sesión** (puedes usar GitHub)
3. **Click en "New Project"**
4. **Selecciona "Deploy from GitHub repo"**
5. **Conecta tu repositorio** (Neo o el que uses)
6. **Selecciona el repositorio** y haz click en "Deploy Now"

---

## 🔧 Paso 2: Configurar el Servicio

Railway detectará automáticamente que es un proyecto Node.js, pero necesitas configurarlo:

### A) Configurar Root Directory

1. En tu servicio, ve a **Settings**
2. Busca **"Root Directory"**
3. Cambia a: `backend`
4. **Save**

### B) Configurar Variables de Entorno

Ve a **Variables** y agrega:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=tu-database-url-aqui
JWT_SECRET=tu-secreto-jwt-unico
CORS_ORIGINS=https://tu-sitio-neo.netlify.app
```

**Nota sobre DATABASE_URL:**
- Si ya tienes una base de datos en Railway, Railway la detectará automáticamente
- Si es externa, cópiala manualmente
- Si necesitas crear una nueva, ve al paso 3

---

## 🗄️ Paso 3: Crear Base de Datos (Si no tienes)

1. En tu proyecto de Railway, click **"+ New"**
2. Selecciona **"Database"** → **"Add PostgreSQL"**
3. Railway creará automáticamente la base de datos
4. **Railway automáticamente creará la variable `DATABASE_URL`** y la conectará a tu servicio

---

## ⚙️ Paso 4: Configurar Build y Start Commands

Railway debería detectar automáticamente los comandos, pero verifica:

### Build Command:
```bash
cd backend && npm install && npx prisma generate && npm run build
```

### Start Command:
```bash
cd backend && npm run start:prod
```

**O Railway puede usar el archivo `railway.json` que creé automáticamente.**

---

## 🔄 Paso 5: Ejecutar Migraciones

Después del primer deploy, necesitas ejecutar las migraciones de Prisma:

### Opción A: Desde Railway (Recomendado)

1. En tu servicio, ve a **Settings** → **Deploy**
2. Busca **"Run Command"** o **"One-off Command"**
3. Ejecuta:
   ```bash
   cd backend && npx prisma migrate deploy
   ```

### Opción B: Desde tu máquina local

1. Conecta tu base de datos localmente
2. Ejecuta:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

---

## 🌐 Paso 6: Configurar Dominio Público

1. En tu servicio, ve a **Settings** → **Networking**
2. Click en **"Generate Domain"** o **"Custom Domain"**
3. Railway te dará una URL como: `https://tu-backend.up.railway.app`
4. **Copia esta URL** - la necesitarás para el frontend

---

## ✅ Paso 7: Verificar que Funciona

### A) Health Check

Abre en tu navegador:
```
https://tu-backend.up.railway.app/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": ...
}
```

### B) Verificar Logs

1. En Railway, ve a tu servicio
2. Click en **"Deployments"** → Selecciona el último deploy
3. Revisa los **logs** para ver si hay errores

---

## 🔗 Paso 8: Configurar Frontend

Ahora que tienes el backend en Railway, configura el frontend:

### En Netlify:

1. Ve a tu sitio en Netlify
2. **Site settings** → **Environment variables**
3. Agrega/Modifica:
   ```
   Key: VITE_API_URL
   Value: https://tu-backend.up.railway.app/api
   ```
4. **Redeploy** el sitio

---

## 🔒 Paso 9: Configurar CORS

Asegúrate de que el backend permita requests desde tu frontend:

En Railway, agrega/modifica la variable:
```
CORS_ORIGINS=https://tu-sitio-neo.netlify.app
```

**Nota:** Sin "/" al final, y separa múltiples URLs con comas.

---

## 📊 Estructura del Proyecto en Railway

```
Proyecto: Neo
├── Servicio 1: Backend (Web Service)
│   ├── Root Directory: backend
│   ├── Build: cd backend && npm install && npx prisma generate && npm run build
│   ├── Start: cd backend && npm run start:prod
│   └── Variables:
│       ├── DATABASE_URL (conectada automáticamente)
│       ├── NODE_ENV=production
│       ├── PORT=3000
│       ├── JWT_SECRET=...
│       └── CORS_ORIGINS=...
└── Servicio 2: PostgreSQL (Database)
    └── DATABASE_URL (generada automáticamente)
```

---

## 🆘 Solución de Problemas

### Error: "Cannot find module"

**Solución:**
- Verifica que el **Root Directory** esté configurado como `backend`
- Verifica que el **Build Command** incluya `cd backend`

### Error: "Prisma Client not generated"

**Solución:**
- Asegúrate de que el build command incluya: `npx prisma generate`
- Verifica que `DATABASE_URL` esté configurada

### Error: "Database connection failed"

**Solución:**
- Verifica que la base de datos esté activa
- Verifica que `DATABASE_URL` sea correcta
- Si la BD está en Railway, Railway debería conectarla automáticamente

### Error: "Port already in use"

**Solución:**
- Railway asigna el puerto automáticamente
- Usa `process.env.PORT` en tu código (ya lo estás haciendo)
- No necesitas configurar PORT manualmente, pero puedes dejarlo como 3000

### El backend no responde

**Solución:**
1. Revisa los logs en Railway
2. Verifica que el servicio esté "Active"
3. Verifica que el dominio público esté configurado
4. Prueba el health check endpoint

---

## 📝 Comandos Útiles

### Ver logs en tiempo real:
Railway muestra los logs automáticamente en el dashboard.

### Reiniciar servicio:
En Railway → Tu servicio → Click en el botón de reinicio

### Ver variables de entorno:
Railway → Tu servicio → Variables

---

## 🎯 Checklist Final

- [ ] Proyecto creado en Railway
- [ ] Repositorio conectado
- [ ] Root Directory configurado como `backend`
- [ ] Base de datos creada (o conectada)
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Dominio público generado
- [ ] Health check funciona
- [ ] Frontend configurado con nueva URL
- [ ] CORS configurado

---

## 💡 Tips

1. **Railway es gratuito** para empezar (con límites)
2. **Railway conecta automáticamente** la base de datos si está en el mismo proyecto
3. **Los deploys son automáticos** cuando haces push a GitHub
4. **Railway muestra logs en tiempo real** para debugging
5. **Puedes hacer rollback** fácilmente desde el dashboard

---

## 🔗 URLs Importantes

- **Railway Dashboard**: https://railway.app/dashboard
- **Documentación Railway**: https://docs.railway.app
- **Tu Backend**: `https://tu-backend.up.railway.app`
- **Health Check**: `https://tu-backend.up.railway.app/api/health`

---

¡Listo! Tu backend debería estar funcionando en Railway. 🚀

