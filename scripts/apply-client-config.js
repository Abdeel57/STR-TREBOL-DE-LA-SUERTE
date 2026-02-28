#!/usr/bin/env node

/**
 * Script para aplicar la configuración del cliente desde config-cliente.json
 * Uso: node scripts/apply-client-config.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function log(message, color = 'reset') {
  const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    red: '\x1b[31m'
  };
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function applyConfig() {
  const configPath = path.join(__dirname, '..', 'config-cliente.json');
  
  if (!fs.existsSync(configPath)) {
    log('❌ No se encontró config-cliente.json', 'red');
    log('   Crea el archivo config-cliente.json con los datos del cliente', 'yellow');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  if (config.clientName === 'NOMBRE_DEL_CLIENTE') {
    log('❌ Por favor, completa config-cliente.json con los datos del cliente', 'red');
    process.exit(1);
  }

  log('⚙️  Aplicando configuración del cliente...\n', 'blue');

  // 1. Crear .env
  const jwtSecret = crypto.randomBytes(32).toString('hex');
  const envContent = `# Base de datos PostgreSQL
DATABASE_URL="${config.databaseUrl}"

# Puerto del servidor
PORT=3000

# Entorno
NODE_ENV=development

# JWT Secret (generado automáticamente)
JWT_SECRET="${jwtSecret}"

# Dominio del cliente
CLIENT_DOMAIN="${config.domain}"
`;

  const envPath = path.join(__dirname, '..', 'backend', '.env');
  fs.writeFileSync(envPath, envContent);
  log('✅ backend/.env creado', 'green');

  // 2. Actualizar main.ts con dominios
  const mainTsPath = path.join(__dirname, '..', 'backend', 'src', 'main.ts');
  if (fs.existsSync(mainTsPath) && config.domain) {
    let mainTs = fs.readFileSync(mainTsPath, 'utf8');
    
    const domainSection = `    // Cliente: ${config.clientName}
    'https://${config.domain}',
    'https://www.${config.domain}',
    'http://${config.domain}',
    'http://www.${config.domain}',`;
    
    // Buscar la sección de dominios
    const insertMarker = '// DOMINIOS DE CLIENTES - Agrega aquí los nuevos';
    const markerIndex = mainTs.indexOf(insertMarker);
    
    if (markerIndex !== -1) {
      // Buscar el siguiente comentario de cliente o el cierre del array
      const nextClientIndex = mainTs.indexOf('// Cliente:', markerIndex + 50);
      const arrayEndIndex = mainTs.lastIndexOf('  ];');
      
      if (nextClientIndex !== -1 && nextClientIndex < arrayEndIndex) {
        // Insertar antes del siguiente cliente
        mainTs = mainTs.slice(0, nextClientIndex) + 
                 '    ' + domainSection + '\n    \n    ' + 
                 mainTs.slice(nextClientIndex);
      } else if (arrayEndIndex !== -1) {
        // Insertar antes del cierre del array
        mainTs = mainTs.slice(0, arrayEndIndex) + 
                 '    ' + domainSection + '\n' + 
                 mainTs.slice(arrayEndIndex);
      }
      
      fs.writeFileSync(mainTsPath, mainTs);
      log('✅ backend/src/main.ts actualizado con dominios', 'green');
    }
  }

  // 3. Crear script de creación de usuario
  const createUserScript = `#!/usr/bin/env node
// Script para crear usuario admin para ${config.clientName}
// Ejecuta este comando después de las migraciones:
// node backend/scripts/create-admin-user.js ${config.admin.username} ${config.admin.password} ${config.admin.email} "${config.admin.name}"
`;

  const scriptPath = path.join(__dirname, '..', 'CREAR-ADMIN-CLIENTE.bat');
  const batContent = `@echo off
echo Creando usuario administrador para ${config.clientName}...
node backend\\scripts\\create-admin-user.js ${config.admin.username} ${config.admin.password} ${config.admin.email} "${config.admin.name}"
pause
`;
  fs.writeFileSync(scriptPath, batContent);
  log('✅ CREAR-ADMIN-CLIENTE.bat creado', 'green');

  log('\n✅ Configuración aplicada exitosamente!\n', 'green');
  log('📋 Resumen:', 'blue');
  log(`   Cliente: ${config.clientName}`, 'green');
  log(`   Dominio: ${config.domain}`, 'green');
  log(`   Usuario admin: ${config.admin.username}`, 'green');
  log(`   JWT Secret generado`, 'green');
  
  log('\n📝 Próximos pasos:', 'yellow');
  log('1. Verifica que backend/.env tenga la URL correcta de la base de datos', 'blue');
  log('2. Ejecuta las migraciones: cd backend && npm run migrate:deploy', 'blue');
  log('3. Crea el usuario admin ejecutando: CREAR-ADMIN-CLIENTE.bat', 'blue');
  log('4. Inicia la aplicación: npm start', 'blue');
  log('5. Accede al panel: http://localhost:5173/#/admin', 'blue');
  
  log('\n🎉 ¡Configuración completada!', 'green');
}

applyConfig();

