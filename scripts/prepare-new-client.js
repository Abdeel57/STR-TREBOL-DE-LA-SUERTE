#!/usr/bin/env node

/**
 * Script para preparar el proyecto para un nuevo cliente
 * Limpia datos de ejemplo y deja el proyecto listo para configuración
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparando proyecto para nuevo cliente...\n');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 1. Limpiar datos de ejemplo en backend/data/
const dataFiles = {
  'raffles.json': [],
  'orders.json': [],
  'winners.json': [],
  'users.json': []
};

log('📁 Limpiando archivos de datos de ejemplo...', 'blue');
Object.entries(dataFiles).forEach(([file, content]) => {
  const filePath = path.join(__dirname, '..', 'backend', 'data', file);
  if (fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    log(`  ✅ ${file} limpiado`, 'green');
  }
});

// 2. Crear settings.json limpio
log('\n⚙️  Creando configuración por defecto...', 'blue');
const cleanSettings = {
  "id": "main_settings",
  "siteName": "Mi Plataforma de Rifas",
  "appearance": {
    "siteName": "Mi Plataforma de Rifas",
    "colors": {
      "backgroundPrimary": "#1a1a1a",
      "backgroundSecondary": "#2d2d2d",
      "accent": "#ff6b6b",
      "action": "#4ecdc4"
    },
    "logo": "",
    "favicon": ""
  },
  "contactInfo": {
    "whatsapp": "",
    "email": "",
    "phone": "",
    "address": ""
  },
  "socialLinks": {
    "facebookUrl": "",
    "instagramUrl": "",
    "tiktokUrl": "",
    "youtubeUrl": ""
  },
  "paymentAccounts": [],
  "faqs": [],
  "createdAt": new Date().toISOString(),
  "updatedAt": new Date().toISOString()
};

const settingsPath = path.join(__dirname, '..', 'backend', 'data', 'settings.json');
fs.writeFileSync(settingsPath, JSON.stringify(cleanSettings, null, 2));
log('  ✅ settings.json configurado con valores por defecto', 'green');

// 3. Actualizar index.html con valores genéricos
log('\n📄 Actualizando frontend/index.html...', 'blue');
const indexHtmlPath = path.join(__dirname, '..', 'frontend', 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Reemplazar referencias específicas con valores genéricos
  indexHtml = indexHtml.replace(/Sorteos Gama/g, 'Mi Plataforma de Rifas');
  indexHtml = indexHtml.replace(/sorteosgama\.pro/g, 'tudominio.com');
  
  fs.writeFileSync(indexHtmlPath, indexHtml);
  log('  ✅ index.html actualizado', 'green');
}

// 4. Limpiar dominios específicos en main.ts (mantener solo desarrollo)
log('\n🔧 Limpiando dominios específicos en backend/src/main.ts...', 'blue');
const mainTsPath = path.join(__dirname, '..', 'backend', 'src', 'main.ts');
if (fs.existsSync(mainTsPath)) {
  let mainTs = fs.readFileSync(mainTsPath, 'utf8');
  
  // Remover líneas con dominios específicos de clientes (mantener solo desarrollo y genéricos)
  // Esto es un poco más complejo, así que solo agregamos un comentario
  // El usuario deberá agregar manualmente los dominios del nuevo cliente
  log('  ⚠️  Recuerda agregar los dominios del nuevo cliente en backend/src/main.ts', 'yellow');
  log('  📝 Busca la sección "DOMINIOS DE CLIENTES" y agrega los nuevos dominios', 'yellow');
}

// 4. Crear archivo .env.example actualizado
log('\n📝 Creando .env.example...', 'blue');
const envExample = `# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:password@host:puerto/database?schema=public"

# Puerto del servidor
PORT=3000

# Entorno
NODE_ENV=development

# JWT Secret (genera uno nuevo para cada cliente)
JWT_SECRET=tu_secret_jwt_muy_seguro_aqui

# CORS Origins (agrega los dominios del cliente)
# Los dominios se configuran en backend/src/main.ts
`;

const envExamplePath = path.join(__dirname, '..', 'backend', '.env.example');
fs.writeFileSync(envExamplePath, envExample);
log('  ✅ .env.example creado', 'green');

// 5. Crear archivo de instrucciones para el nuevo cliente
log('\n📋 Creando instrucciones para el cliente...', 'blue');
const clientInstructions = `# Instrucciones de Configuración Inicial

## 🎯 Pasos para Configurar tu Plataforma de Rifas

### 1. Configuración de Base de Datos
1. Crea una base de datos PostgreSQL (puedes usar Railway, Supabase, o cualquier proveedor)
2. Copia \`backend/.env.example\` a \`backend/.env\`
3. Actualiza \`DATABASE_URL\` con tus credenciales de base de datos
4. Genera un \`JWT_SECRET\` único y seguro

### 2. Inicializar Base de Datos
Ejecuta en la terminal:
\`\`\`bash
cd backend
npm run migrate:deploy
\`\`\`

### 3. Configurar Dominio en Backend
Edita \`backend/src/main.ts\` y agrega tu dominio a la lista de CORS:
\`\`\`typescript
const allowedOrigins = [
  // ... otros dominios ...
  'https://tudominio.com',
  'https://www.tudominio.com',
];
\`\`\`

### 4. Iniciar la Aplicación
\`\`\`bash
npm start
\`\`\`

### 5. Acceder al Panel de Administración
1. Ve a: http://localhost:5173/#/admin
2. Inicia sesión (si no hay usuario, el sistema te guiará para crear uno)
3. Ve a **Configuración** y completa:
   - Nombre del sitio
   - Logo y favicon
   - Colores de la marca
   - Información de contacto
   - Redes sociales
   - Cuentas de pago
   - Preguntas frecuentes

### 6. Personalizar Meta Tags
Edita \`frontend/index.html\` y actualiza:
- Título de la página
- URLs de Open Graph y Twitter
- Descripciones

### 7. Crear tu Primera Rifa
1. Ve al panel de administración
2. Haz clic en **Nueva Rifa**
3. Completa la información
4. Publica la rifa

## ✅ Listo!
Tu plataforma está lista para recibir clientes.

## 📞 Soporte
Si necesitas ayuda, contacta al desarrollador.
`;

const instructionsPath = path.join(__dirname, '..', 'INSTRUCCIONES-CLIENTE.md');
fs.writeFileSync(instructionsPath, clientInstructions);
log('  ✅ INSTRUCCIONES-CLIENTE.md creado', 'green');

log('\n✨ ¡Proyecto preparado para nuevo cliente!', 'green');
log('\n📌 Próximos pasos:', 'yellow');
log('  1. Duplica esta carpeta completa para el nuevo cliente', 'blue');
log('  2. Configura la base de datos en backend/.env', 'blue');
log('  3. Ejecuta: npm run migrate:deploy', 'blue');
log('  4. Actualiza los dominios en backend/src/main.ts', 'blue');
log('  5. Inicia la aplicación: npm start', 'blue');
log('  6. El cliente puede configurar todo desde el panel admin', 'blue');
log('\n📄 Revisa INSTRUCCIONES-CLIENTE.md para más detalles\n', 'yellow');

