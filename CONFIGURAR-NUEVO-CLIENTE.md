# 🎯 Configuración para Nuevo Cliente

## 📋 Información que Necesito del Cliente

Para configurar la nueva página, necesito estos datos:

### 1. Información Básica
- [ ] **Nombre del cliente/empresa**: ________________
- [ ] **Dominio** (si ya lo tiene): ________________
- [ ] **Email de contacto**: ________________

### 2. Base de Datos
- [ ] **URL de PostgreSQL**: ________________
  - Puedes crear una en Railway (https://railway.app) o Supabase (https://supabase.com)
  - O usar cualquier proveedor PostgreSQL

### 3. Credenciales de Admin
- [ ] **Usuario admin**: ________________ (ej: admin, cliente_nombre)
- [ ] **Contraseña admin**: ________________

### 4. (Opcional) Dominio
- [ ] **Dominio principal**: ________________
- [ ] **Dominio con www**: ________________

---

## ⚡ Una vez tengas esta información:

1. **Duplica esta carpeta** y renómbrala con el nombre del cliente
2. **Edita** `backend/.env` con la URL de la base de datos
3. **Agrega** los dominios en `backend/src/main.ts`
4. **Ejecuta** las migraciones
5. **Crea** el usuario admin

**O dame la información y yo lo configuro todo por ti.** 🚀

