# ⚡ Instrucciones Rápidas - Configurar Nuevo Cliente

## 🎯 Método Rápido (3 pasos)

### Paso 1: Completa el archivo de configuración

Abre `config-cliente.json` y completa con los datos del cliente:

```json
{
  "clientName": "Juan Rifas",
  "domain": "juanrifas.com",
  "databaseUrl": "postgresql://usuario:password@host:puerto/database",
  "admin": {
    "username": "admin",
    "password": "password123",
    "email": "admin@juanrifas.com",
    "name": "Administrador Principal"
  }
}
```

### Paso 2: Aplica la configuración

```bash
npm run apply:config
```

O directamente:
```bash
node scripts/apply-client-config.js
```

### Paso 3: Inicializa la base de datos

```bash
cd backend
npm run migrate:deploy
cd ..
```

### Paso 4: Crea el usuario admin

Ejecuta el archivo creado:
```bash
CREAR-ADMIN-CLIENTE.bat
```

O manualmente:
```bash
node backend/scripts/create-admin-user.js admin password123 admin@cliente.com "Administrador"
```

### Paso 5: Inicia la aplicación

```bash
npm start
```

## ✅ ¡Listo!

Accede a: http://localhost:5173/#/admin

---

## 📋 Checklist

- [ ] `config-cliente.json` completado
- [ ] `npm run apply:config` ejecutado
- [ ] Base de datos PostgreSQL creada
- [ ] `backend/.env` verificado (URL de base de datos correcta)
- [ ] Migraciones ejecutadas
- [ ] Usuario admin creado
- [ ] Aplicación iniciada

## 🆘 Si algo falla

1. **Error de base de datos**: Verifica `DATABASE_URL` en `backend/.env`
2. **Error de CORS**: Verifica que los dominios estén en `backend/src/main.ts`
3. **No puedo iniciar sesión**: Ejecuta `CREAR-ADMIN-CLIENTE.bat` de nuevo

