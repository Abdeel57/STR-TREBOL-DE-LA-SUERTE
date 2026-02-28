#!/usr/bin/env node

/**
 * Script para crear un usuario administrador inicial
 * Uso: node backend/scripts/create-admin-user.js <username> <password> <email> <name>
 */

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdminUser() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('❌ Uso: node create-admin-user.js <username> <password> [email] [name]');
    console.log('');
    console.log('Ejemplo:');
    console.log('  node create-admin-user.js admin miPassword123 admin@cliente.com "Admin Principal"');
    process.exit(1);
  }

  const username = args[0];
  const password = args[1];
  const email = args[2] || null;
  const name = args[3] || 'Administrador Principal';

  try {
    console.log('🔐 Creando usuario administrador...');
    console.log(`   Usuario: ${username}`);
    console.log(`   Email: ${email || 'No especificado'}`);
    console.log(`   Nombre: ${name}`);

    // Verificar si el usuario ya existe
    const existingUser = await prisma.adminUser.findUnique({
      where: { username }
    });

    if (existingUser) {
      console.log('⚠️  El usuario ya existe. ¿Deseas actualizar la contraseña? (s/n)');
      // En modo no interactivo, simplemente salir
      console.log('❌ Usuario ya existe. Usa otro username o elimina el usuario existente.');
      process.exit(1);
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await prisma.adminUser.create({
      data: {
        id: `admin-${Date.now()}`,
        name,
        username,
        email,
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log('✅ Usuario administrador creado exitosamente!');
    console.log('');
    console.log('📋 Credenciales:');
    console.log(`   Usuario: ${user.username}`);
    console.log(`   Contraseña: ${password}`);
    console.log('');
    console.log('🔗 Accede al panel en: http://localhost:5173/#/admin');

  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();

