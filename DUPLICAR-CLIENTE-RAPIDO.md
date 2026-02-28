# ⚡ Duplicación Rápida - 3 Pasos

## 🎯 Para Duplicar un Cliente en 5 Minutos

### Paso 1: Preparar Template (Solo la primera vez)
```bash
npm run prepare:new-client
```

### Paso 2: Duplicar y Configurar
1. **Copia** toda la carpeta del proyecto
2. **Renombra** la carpeta con el nombre del cliente
3. **Crea** base de datos PostgreSQL (Railway/Supabase)
4. **Copia** `backend/.env.example` → `backend/.env`
5. **Edita** `backend/.env`:
   ```
   DATABASE_URL="postgresql://usuario:password@host:puerto/database"
   JWT_SECRET="genera_un_secret_unico_aqui"
   ```
6. **Edita** `backend/src/main.ts` - Agrega dominios del cliente:
   ```typescript
   // En la sección "DOMINIOS DE CLIENTES"
   'https://dominio-del-cliente.com',
   'https://www.dominio-del-cliente.com',
   ```

### Paso 3: Inicializar
```bash
cd backend
npm run migrate:deploy
cd ..
npm start
```

### Paso 4: Crear Usuario Admin
```bash
cd backend
node scripts/create-admin-user.js admin password123 admin@cliente.com "Admin"
```

O desde el panel: http://localhost:5173/#/admin

## ✅ Listo!

El cliente puede:
- Acceder a http://localhost:5173/#/admin
- Configurar todo desde el panel
- Crear sus rifas

**Tú solo pagas el dominio y hosting.** 🎉

---

📖 Para más detalles, ver: `GUIA-DUPLICACION-CLIENTES.md`

