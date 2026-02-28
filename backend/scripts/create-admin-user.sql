-- Script para crear un usuario administrador inicial
-- Ejecuta este script en tu base de datos después de las migraciones
-- Reemplaza los valores entre < > con los del cliente

-- Opción 1: Crear usuario admin básico
INSERT INTO admin_users (id, name, username, email, password, role, "createdAt", "updatedAt")
VALUES (
  'admin-1',
  'Administrador Principal',
  '<username>',  -- ⬅️ Cambia esto (ej: 'admin', 'cliente_nombre')
  '<email>',     -- ⬅️ Cambia esto (ej: 'admin@cliente.com')
  '<password_hash>',  -- ⬅️ Necesitas hashear la contraseña con bcrypt
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (username) DO NOTHING;

-- ⚠️ IMPORTANTE: La contraseña debe estar hasheada con bcrypt
-- Puedes generar el hash usando Node.js:
-- node -e "const bcrypt = require('bcrypt'); bcrypt.hash('tu_password', 10).then(h => console.log(h));"
-- O usar un generador online de bcrypt

-- Opción 2: Si prefieres crear el usuario desde el panel admin
-- 1. Inicia la aplicación
-- 2. Ve a http://localhost:5173/#/admin
-- 3. Si no hay usuarios, el sistema te permitirá crear uno
-- 4. O usa el endpoint POST /api/admin/users desde Postman/Thunder Client

-- Opción 3: Usar el superadmin temporal (solo para configuración inicial)
-- Usuario: Orlando12
-- Contraseña: Pomelo_12@
-- Luego crea un usuario admin desde el panel y elimina este superadmin

