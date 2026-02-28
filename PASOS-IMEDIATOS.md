# 🎯 PASOS INMEDIATOS - Duplicar para Nuevo Cliente

## ⚡ PROCESO COMPLETO (Sigue estos pasos en orden)

### PASO 1: Preparar el Template Base (Solo esta vez)
```bash
npm run prepare:new-client
```
Este comando limpia todos los datos de ejemplo y deja el proyecto listo para duplicar.

### PASO 2: Duplicar el Proyecto
1. **Cierra** cualquier proceso que esté corriendo (Ctrl+C en las terminales)
2. **Copia** toda la carpeta `PAGINA DE RIFAS 1.0` 
3. **Pégala** en otra ubicación (ej: `C:\Users\Admin\Desktop\CLIENTE-JUAN-RIFAS`)
4. **Renombra** la carpeta con el nombre del cliente

### PASO 3: Configurar Base de Datos
1. Crea una nueva base de datos PostgreSQL:
   - Opción A: Railway (https://railway.app) - Gratis para empezar
   - Opción B: Supabase (https://supabase.com) - Gratis
   - Opción C: Cualquier proveedor PostgreSQL

2. Copia el archivo de ejemplo:
   ```bash
   cd backend
   copy .env.example .env
   ```
   (O manualmente: copia `backend/.env.example` y renómbralo a `.env`)

3. Edita `backend/.env` y configura:
   ```
   DATABASE_URL="postgresql://usuario:password@host:puerto/database?schema=public"
   JWT_SECRET="genera_un_secret_unico_aqui"
   PORT=3000
   NODE_ENV=development
   ```

   **Para generar JWT_SECRET único:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### PASO 4: Configurar Dominios CORS
Edita `backend/src/main.ts` y busca la sección:
```typescript
// ============================================
// DOMINIOS DE CLIENTES - Agrega aquí los nuevos
// ============================================
```

Agrega los dominios del nuevo cliente:
```typescript
// Cliente: [Nombre del Cliente]
'https://dominio-del-cliente.com',
'https://www.dominio-del-cliente.com',
'http://dominio-del-cliente.com',  // Solo si necesitas HTTP
'http://www.dominio-del-cliente.com',
```

### PASO 5: Inicializar Base de Datos
```bash
cd backend
npm run migrate:deploy
```

Esto crea todas las tablas necesarias en la base de datos.

### PASO 6: Crear Usuario Administrador
```bash
node scripts/create-admin-user.js admin password123 admin@cliente.com "Administrador"
```

O desde el panel web después de iniciar la app.

### PASO 7: Iniciar la Aplicación
```bash
cd ..  # Volver a la raíz del proyecto
npm start
```

O manualmente:
```bash
# Terminal 1 - Backend
cd backend
npm run start:prisma

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### PASO 8: Verificar que Funciona
1. Frontend: http://localhost:5173
2. Backend: http://localhost:3000/api/health
3. Panel Admin: http://localhost:5173/#/admin

### PASO 9: El Cliente Configura Todo
El cliente puede acceder al panel admin y configurar:
- ✅ Nombre del sitio
- ✅ Logo y favicon
- ✅ Colores de la marca
- ✅ Información de contacto
- ✅ Redes sociales
- ✅ Cuentas de pago
- ✅ Preguntas frecuentes
- ✅ Crear sus rifas

## ✅ ¡LISTO!

El cliente tiene su propia plataforma independiente.

---

## 📋 Checklist Rápido

- [ ] Ejecutado `npm run prepare:new-client` en el template
- [ ] Proyecto duplicado y renombrado
- [ ] Base de datos PostgreSQL creada
- [ ] `backend/.env` configurado
- [ ] Dominios agregados en `backend/src/main.ts`
- [ ] Migraciones ejecutadas
- [ ] Usuario admin creado
- [ ] Aplicación iniciada
- [ ] Cliente puede acceder al panel

## 🆘 Si Algo Falla

1. **Error de CORS**: Verifica que el dominio esté en `backend/src/main.ts`
2. **Error de Base de Datos**: Verifica `DATABASE_URL` en `backend/.env`
3. **Error de Migraciones**: Asegúrate de que la base de datos esté accesible
4. **No puedo iniciar sesión**: Crea el usuario admin con el script

## 💡 Tip Pro

Guarda esta carpeta original como "TEMPLATE" o "BASE" para futuros clientes.

