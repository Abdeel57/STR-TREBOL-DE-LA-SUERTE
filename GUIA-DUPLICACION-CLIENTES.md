# 🚀 Guía de Duplicación para Nuevos Clientes

Esta guía te ayudará a duplicar rápidamente la plataforma para un nuevo cliente.

## 📋 Proceso Completo (5 minutos)

### Paso 1: Preparar el Template Base
Si aún no lo has hecho, ejecuta el script de preparación:
```bash
npm run prepare:new-client
```

Este script:
- ✅ Limpia todos los datos de ejemplo
- ✅ Configura valores por defecto genéricos
- ✅ Actualiza referencias en el código
- ✅ Crea archivos de configuración base

### Paso 2: Duplicar el Proyecto
1. Copia toda la carpeta del proyecto a una nueva ubicación
2. Renombra la carpeta con el nombre del cliente (ej: `cliente-juan-rifas`)

### Paso 3: Configurar Base de Datos
1. Crea una nueva base de datos PostgreSQL (Railway, Supabase, etc.)
2. Copia `backend/.env.example` a `backend/.env`
3. Actualiza `DATABASE_URL` con las credenciales del nuevo cliente
4. Genera un `JWT_SECRET` único (puedes usar: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

### Paso 4: Configurar Dominios CORS
Edita `backend/src/main.ts` y agrega los dominios del cliente:

```typescript
const allowedOrigins = [
  /^http:\/\/localhost:5173$/, // Desarrollo local
  /\.onrender\.com$/,
  /\.netlify\.app$/,
  'https://dominio-del-cliente.com',        // ⬅️ Agrega aquí
  'https://www.dominio-del-cliente.com',    // ⬅️ Agrega aquí
  'http://dominio-del-cliente.com',         // ⬅️ Agrega aquí (opcional)
  'http://www.dominio-del-cliente.com',     // ⬅️ Agrega aquí (opcional)
];
```

### Paso 5: Inicializar Base de Datos
```bash
cd backend
npm run migrate:deploy
```

### Paso 6: Instalar Dependencias (si es necesario)
```bash
npm run install:all
```

### Paso 7: Iniciar y Verificar
```bash
npm start
```

Verifica que:
- Frontend funciona en http://localhost:5173
- Backend funciona en http://localhost:3000/api
- Panel admin accesible en http://localhost:5173/#/admin

### Paso 8: Crear Usuario Administrador

Tienes 3 opciones:

**Opción A: Desde el Panel (Más fácil)**
1. Ve a http://localhost:5173/#/admin
2. Si no hay usuarios, el sistema te permitirá crear uno
3. Completa el formulario y crea el usuario

**Opción B: Usando el Script (Recomendado)**
```bash
cd backend
node scripts/create-admin-user.js admin miPassword123 admin@cliente.com "Admin Principal"
```

**Opción C: Usar Superadmin Temporal**
- Usuario: `Orlando12`
- Contraseña: `Pomelo_12@`
- Luego crea un usuario admin desde el panel y elimina este superadmin

### Paso 9: Personalizar desde el Panel
El cliente puede configurar todo desde el panel de administración:
- **Configuración** → Nombre, logo, colores, contacto, redes sociales
- **Rifas** → Crear sus rifas
- **Cuentas de Pago** → Agregar sus cuentas bancarias
- **FAQs** → Agregar preguntas frecuentes

### Paso 10: Actualizar Meta Tags (Opcional)
Si quieres personalizar los meta tags antes de que el cliente configure:
Edita `frontend/index.html` y actualiza:
- Título
- URLs
- Descripciones

## 🎯 Checklist Rápido

- [ ] Ejecutado `npm run prepare:new-client` en el template base
- [ ] Proyecto duplicado y renombrado
- [ ] Base de datos PostgreSQL creada
- [ ] `backend/.env` configurado con `DATABASE_URL` y `JWT_SECRET`
- [ ] Dominios agregados en `backend/src/main.ts`
- [ ] Migraciones ejecutadas (`npm run migrate:deploy`)
- [ ] Aplicación iniciada y funcionando
- [ ] Usuario administrador creado
- [ ] Cliente puede acceder al panel admin

## 💡 Tips Profesionales

### 1. Usar Variables de Entorno para CORS
Puedes hacer el CORS más flexible usando variables de entorno:

```typescript
// backend/src/main.ts
const clientDomain = process.env.CLIENT_DOMAIN || 'tudominio.com';
const allowedOrigins = [
  /^http:\/\/localhost:5173$/,
  new RegExp(`^https?://(www\\.)?${clientDomain.replace('.', '\\.')}$`),
];
```

Luego en `backend/.env`:
```
CLIENT_DOMAIN=dominio-del-cliente.com
```

### 2. Script de Inicialización Automática
Puedes crear un script que haga todo automáticamente:

```bash
# scripts/setup-new-client.sh
#!/bin/bash
CLIENT_NAME=$1
DOMAIN=$2

# Duplicar proyecto
cp -r . "../$CLIENT_NAME"
cd "../$CLIENT_NAME"

# Preparar
npm run prepare:new-client

# Configurar dominio en main.ts (requiere sed o similar)
# ... código para reemplazar dominios ...

echo "✅ Cliente $CLIENT_NAME configurado!"
```

### 3. Template en Git
Mantén una rama `template` en Git con el proyecto limpio:
```bash
git checkout -b template
npm run prepare:new-client
git add .
git commit -m "Template limpio para nuevos clientes"
```

Luego para cada cliente:
```bash
git checkout template
git checkout -b cliente-nombre
# Configurar y hacer commit
```

## 🔒 Seguridad

- ✅ **Nunca** compartas el mismo `JWT_SECRET` entre clientes
- ✅ **Nunca** uses la misma base de datos para múltiples clientes
- ✅ **Siempre** usa HTTPS en producción
- ✅ **Siempre** valida y sanitiza inputs del cliente

## 📊 Costos Estimados por Cliente

- **Dominio**: $10-15/año
- **Hosting Frontend** (Netlify/Render): Gratis o $7/mes
- **Hosting Backend** (Railway/Render): $5-10/mes
- **Base de Datos** (Railway/Supabase): Gratis o $5/mes

**Total**: ~$15-30/mes por cliente

## 🆘 Solución de Problemas

### Error: "CORS blocked"
- Verifica que el dominio esté en `backend/src/main.ts`
- Reinicia el backend después de cambios

### Error: "Database connection failed"
- Verifica `DATABASE_URL` en `backend/.env`
- Asegúrate de que la base de datos esté accesible
- Verifica credenciales

### Error: "JWT secret missing"
- Asegúrate de tener `JWT_SECRET` en `backend/.env`
- Genera uno nuevo si es necesario

## ✅ Listo!

Una vez completados estos pasos, el cliente puede:
1. Acceder al panel de administración
2. Configurar toda su información
3. Crear sus rifas
4. Comenzar a recibir órdenes

**Tú solo necesitas pagar el dominio y configurar el hosting.** 🎉

