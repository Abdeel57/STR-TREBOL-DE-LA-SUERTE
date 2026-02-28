import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addIndexes() {
  console.log('🔧 Agregando índices de rendimiento...');

  try {
    // Índices para raffles
    console.log('📊 Creando índices para raffles...');
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_raffles_status 
      ON raffles(status) 
      WHERE status = 'active';
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_raffles_drawdate 
      ON raffles(drawDate);
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_raffles_slug 
      ON raffles(slug) 
      WHERE slug IS NOT NULL;
    `;

    // Índices para orders
    console.log('📊 Creando índices para orders...');
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_orders_status 
      ON orders(status);
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_orders_createdat 
      ON orders(createdAt DESC);
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_orders_userid 
      ON orders(userId);
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_orders_raffleid 
      ON orders(raffleId);
    `;

    // Índices para winners
    console.log('📊 Creando índices para winners...');
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_winners_drawdate 
      ON winners(drawDate DESC);
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_winners_createdat 
      ON winners(createdAt DESC);
    `;

    console.log('✅ Todos los índices agregados exitosamente');
  } catch (error) {
    console.error('❌ Error agregando índices:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addIndexes()
  .then(() => {
    console.log('✅ Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en script:', error);
    process.exit(1);
  });
