#!/usr/bin/env node

/**
 * 🔍 Script de Verificación de Servidores
 * Verifica si los servidores de desarrollo están corriendo
 */

import { spawn } from 'child_process';
import net from 'net';

const config = {
  frontend: { port: 5173, name: 'Frontend', url: 'http://localhost:5173' },
  backend: { port: 3000, name: 'Backend', url: 'http://localhost:3000' }
};

// Función para verificar si un puerto está en uso
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => resolve(false));
      server.close();
    });
    
    server.on('error', () => resolve(true));
  });
}

// Función para hacer una petición HTTP
async function checkHttp(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Función principal de verificación
async function verificarServidores() {
  console.log('🔍 Verificando estado de los servidores...\n');

  const resultados = {};

  // Verificar puertos
  for (const [key, servidor] of Object.entries(config)) {
    const portInUse = await checkPort(servidor.port);
    resultados[key] = {
      port: servidor.port,
      portInUse,
      name: servidor.name,
      url: servidor.url
    };
  }

  // Mostrar resultados
  console.log('📊 Estado de los Servidores:\n');
  console.log('─'.repeat(60));

  for (const [key, resultado] of Object.entries(resultados)) {
    const estado = resultado.portInUse ? '✅ CORRIENDO' : '❌ DETENIDO';
    console.log(`${resultado.name}:`);
    console.log(`  Estado: ${estado}`);
    console.log(`  Puerto: ${resultado.port}`);
    console.log(`  URL: ${resultado.url}`);
    console.log('');
  }

  console.log('─'.repeat(60));

  // Resumen
  const todosCorriendo = Object.values(resultados).every(r => r.portInUse);
  const ningunoCorriendo = Object.values(resultados).every(r => !r.portInUse);

  if (todosCorriendo) {
    console.log('✅ ¡Todos los servidores están corriendo!');
    console.log(`\n🌐 Abre tu navegador en: ${resultados.frontend.url}`);
    console.log(`📊 Panel Admin: ${resultados.frontend.url}/#/admin`);
  } else if (ningunoCorriendo) {
    console.log('❌ Ningún servidor está corriendo.');
    console.log('\n💡 Para iniciar los servidores, ejecuta:');
    console.log('   npm run dev');
    console.log('\n   O por separado:');
    console.log('   npm run dev:frontend  (solo frontend)');
    console.log('   npm run dev:backend  (solo backend)');
  } else {
    console.log('⚠️  Algunos servidores están corriendo:');
    for (const [key, resultado] of Object.entries(resultados)) {
      if (resultado.portInUse) {
        console.log(`   ✅ ${resultado.name} está corriendo`);
      } else {
        console.log(`   ❌ ${resultado.name} NO está corriendo`);
      }
    }
  }

  console.log('');
}

// Ejecutar verificación
verificarServidores().catch(console.error);

