# 🆘 Ayuda para Duplicar Cliente

## ✅ Ya está listo el template base

He limpiado todos los datos de ejemplo. El proyecto está listo para duplicar.

## 🚀 Opción 1: Configuración Automática (Recomendada)

Ejecuta este comando y responde las preguntas:

```bash
npm run setup:client
```

El script te preguntará:
- Nombre del cliente
- Dominio (opcional)
- URL de base de datos
- Credenciales de admin

Y configurará todo automáticamente.

## 🚀 Opción 2: Configuración Manual

### Paso 1: Duplicar Carpeta
1. Cierra cualquier proceso corriendo
2. Copia toda la carpeta `PAGINA DE RIFAS 1.0`
3. Pégala en otra ubicación
4. Renómbrala (ej: `CLIENTE-JUAN-RIFAS`)

### Paso 2: Configurar Base de Datos
1. Crea una base de datos PostgreSQL (Railway/Supabase)
2. Copia `backend/.env.example` → `backend/.env`
3. Edita `backend/.env`:
   ```
   DATABASE_URL="postgresql://usuario:password@host:puerto/database"
   JWT_SECRET="genera_un_secret_unico"
   ```

### Paso 3: Agregar Dominios
Edita `backend/src/main.ts` y agrega los dominios del cliente en la sección "DOMINIOS DE CLIENTES".

### Paso 4: Inicializar
```bash
cd backend
npm run migrate:deploy
```

### Paso 5: Crear Admin
```bash
node scripts/create-admin-user.js admin password123 admin@cliente.com "Admin"
```

### Paso 6: Iniciar
```bash
npm start
```

## 📞 ¿Necesitas ayuda?

Dame estos datos y lo configuro por ti:
- Nombre del cliente
- Dominio (si lo tiene)
- URL de base de datos (o te ayudo a crear una)
- Usuario y contraseña para el admin

