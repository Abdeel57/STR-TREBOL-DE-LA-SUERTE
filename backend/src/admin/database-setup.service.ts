import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DatabaseSetupService {
  private readonly logger = new Logger(DatabaseSetupService.name);

  constructor(private prisma: PrismaService) {}

  async ensureWinnersTable() {
    try {
      await this.prisma.$queryRaw`SELECT 1 FROM "winners" LIMIT 1`;
    } catch (error: any) {
      const isTableError = error.code === 'P2021' || 
                          error.code === '42P01' || 
                          error.message?.includes('does not exist') ||
                          error.message?.includes('Unknown table') ||
                          (error.message?.includes('relation') && error.message?.includes('does not exist'));
      
      if (isTableError) {
        this.logger.warn('⚠️ winners table does not exist, creating it...');
        await this.prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "winners" (
              "id" TEXT NOT NULL,
              "name" TEXT NOT NULL,
              "prize" TEXT NOT NULL,
              "imageUrl" TEXT NOT NULL,
              "raffleTitle" TEXT NOT NULL,
              "drawDate" TIMESTAMP(3) NOT NULL,
              "ticketNumber" INTEGER,
              "testimonial" TEXT,
              "phone" TEXT,
              "city" TEXT,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT "winners_pkey" PRIMARY KEY ("id")
          );
        `;
        this.logger.log('✅ winners table created successfully');
      } else {
        throw error;
      }
    }
  }

  async ensureRafflesTable() {
    try {
      const columnsToCheck = [
        { name: 'gallery', type: 'JSONB', nullable: true },
        { name: 'sold', type: 'INTEGER', nullable: false, defaultValue: '0' },
        { name: 'status', type: 'TEXT', nullable: false, defaultValue: "'draft'" },
        { name: 'slug', type: 'TEXT', nullable: true },
        { name: 'packs', type: 'JSONB', nullable: true },
        { name: 'bonuses', type: 'TEXT[]', nullable: true, defaultValue: "'{}'" },
        { name: 'boletosConOportunidades', type: 'BOOLEAN', nullable: false, defaultValue: 'false' },
        { name: 'numeroOportunidades', type: 'INTEGER', nullable: false, defaultValue: '1' },
        { name: 'giftTickets', type: 'INTEGER', nullable: true },
      ];
      
      for (const col of columnsToCheck) {
        const colResult = await this.prisma.$queryRaw<Array<{column_name: string}>>`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'raffles' AND column_name = ${col.name}
        `;
        
        if (colResult.length === 0) {
          this.logger.warn(`⚠️ raffles table missing ${col.name} column, adding it...`);
          
          let alterStatement = `ALTER TABLE "raffles" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type}`;
          
          if (col.defaultValue) {
            alterStatement += ` DEFAULT ${col.defaultValue}`;
          }
          
          if (!col.nullable) {
            alterStatement += ` NOT NULL`;
          }
          
          await this.prisma.$executeRawUnsafe(alterStatement);
        }
      }
      
      const drawDateResult = await this.prisma.$queryRaw<Array<{column_name: string}>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'raffles' AND column_name = 'drawDate'
      `;
      
      if (drawDateResult.length === 0) {
        const endDateResult = await this.prisma.$queryRaw<Array<{column_name: string}>>`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'raffles' AND column_name = 'endDate'
        `;
        
        if (endDateResult.length > 0) {
          await this.prisma.$executeRaw`ALTER TABLE "raffles" RENAME COLUMN "endDate" TO "drawDate";`;
        } else {
          await this.prisma.$executeRaw`ALTER TABLE "raffles" ADD COLUMN IF NOT EXISTS "drawDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;`;
        }
      }
      
      const ticketsResult = await this.prisma.$queryRaw<Array<{column_name: string}>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'raffles' AND column_name = 'tickets'
      `;
      
      if (ticketsResult.length === 0) {
        const totalTicketsResult = await this.prisma.$queryRaw<Array<{column_name: string}>>`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'raffles' AND column_name = 'totalTickets'
        `;
        
        if (totalTicketsResult.length > 0) {
          await this.prisma.$executeRaw`ALTER TABLE "raffles" RENAME COLUMN "totalTickets" TO "tickets";`;
        } else {
          await this.prisma.$executeRaw`ALTER TABLE "raffles" ADD COLUMN IF NOT EXISTS "tickets" INTEGER NOT NULL DEFAULT 100;`;
        }
      }
      
    } catch (error: any) {
      const isTableError = error.code === 'P2021' || 
                          error.code === '42P01' || 
                          error.message?.includes('does not exist') ||
                          error.message?.includes('Unknown table');
      
      if (isTableError) {
        this.logger.warn('⚠️ raffles table does not exist, creating it...');
        await this.prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "raffles" (
              "id" TEXT NOT NULL,
              "title" TEXT NOT NULL,
              "description" TEXT,
              "imageUrl" TEXT,
              "gallery" JSONB,
              "price" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
              "tickets" INTEGER NOT NULL,
              "sold" INTEGER NOT NULL DEFAULT 0,
              "drawDate" TIMESTAMP(3) NOT NULL,
              "status" TEXT NOT NULL DEFAULT 'draft',
              "slug" TEXT,
              "boletosConOportunidades" BOOLEAN NOT NULL DEFAULT false,
              "numeroOportunidades" INTEGER NOT NULL DEFAULT 1,
              "giftTickets" INTEGER,
              "packs" JSONB,
              "bonuses" TEXT[] DEFAULT '{}',
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT "raffles_pkey" PRIMARY KEY ("id")
          );
        `;
        
        await this.prisma.$executeRaw`
          CREATE UNIQUE INDEX IF NOT EXISTS "raffles_slug_key" ON "raffles"("slug") WHERE "slug" IS NOT NULL;
        `;
        
        this.logger.log('✅ raffles table created successfully');
      } else {
        this.logger.error('❌ Error ensuring raffles table:', error);
      }
    }
  }

  async ensureUsersTable() {
    try {
      await this.prisma.$queryRaw`SELECT 1 FROM "users" LIMIT 1`;
      
      const columnsToCheck = ['phone', 'district'];
      for (const col of columnsToCheck) {
        const colResult = await this.prisma.$queryRaw<Array<{column_name: string}>>`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = ${col}
        `;
        
        if (colResult.length === 0) {
          this.logger.warn(`⚠️ users table missing ${col} column, adding it...`);
          await this.prisma.$executeRawUnsafe(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "${col}" TEXT;`);
        }
      }
    } catch (error: any) {
      const isTableError = error.code === 'P2021' || 
                          error.code === '42P01' || 
                          error.message?.includes('does not exist') ||
                          error.message?.includes('Unknown table') ||
                          (error.message?.includes('relation') && error.message?.includes('does not exist'));
      
      if (isTableError) {
        this.logger.warn('⚠️ users table does not exist, creating it...');
        await this.prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "users" (
              "id" TEXT NOT NULL,
              "email" TEXT NOT NULL,
              "name" TEXT,
              "phone" TEXT,
              "district" TEXT,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT "users_pkey" PRIMARY KEY ("id")
          );
        `;
        
        await this.prisma.$executeRaw`
          CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
        `;
        
        this.logger.log('✅ users table created successfully');
      } else {
        throw error;
      }
    }
  }

  async ensureOrdersTable() {
    try {
      await this.prisma.$executeRaw`
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrderStatus') THEN
                CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'EXPIRED', 'RELEASED');
                RAISE NOTICE 'Enum OrderStatus creado';
            END IF;
        END $$;
      `;
      
      await this.prisma.$queryRaw`SELECT 1 FROM "orders" LIMIT 1`;
    } catch (error: any) {
      const isTableError = error.code === 'P2021' || 
                          error.code === '42P01' || 
                          error.message?.includes('does not exist') ||
                          error.message?.includes('Unknown table') ||
                          (error.message?.includes('relation') && error.message?.includes('does not exist'));
      
      if (isTableError) {
        this.logger.warn('⚠️ orders table does not exist, creating it...');
        
        await this.ensureUsersTable();
        await this.ensureRafflesTable();
        
        await this.prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "orders" (
              "id" TEXT NOT NULL,
              "folio" TEXT NOT NULL,
              "raffleId" TEXT NOT NULL,
              "userId" TEXT NOT NULL,
              "tickets" INTEGER[] NOT NULL DEFAULT '{}',
              "total" DOUBLE PRECISION NOT NULL,
              "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
              "paymentMethod" TEXT,
              "notes" TEXT,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "expiresAt" TIMESTAMP(3) NOT NULL,
              CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
          );
        `;
        
        await this.prisma.$executeRaw`
          CREATE UNIQUE INDEX IF NOT EXISTS "orders_folio_key" ON "orders"("folio");
        `;
        
        await this.prisma.$executeRaw`
          CREATE INDEX IF NOT EXISTS "orders_raffleId_idx" ON "orders"("raffleId");
        `;
        
        await this.prisma.$executeRaw`
          CREATE INDEX IF NOT EXISTS "orders_userId_idx" ON "orders"("userId");
        `;
        
        await this.prisma.$executeRaw`
          CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");
        `;
        
        this.logger.log('✅ orders table created successfully');
      } else {
        throw error;
      }
    }
  }

  async ensureAdminUsersTable() {
    try {
      await this.prisma.$queryRaw`SELECT 1 FROM "admin_users" LIMIT 1`;
    } catch (error: any) {
      const isTableError = error.code === 'P2021' || 
                          error.code === '42P01' || 
                          error.message?.includes('does not exist') ||
                          error.message?.includes('Unknown table') ||
                          (error.message?.includes('relation') && error.message?.includes('does not exist'));
      
      if (isTableError) {
        this.logger.warn('⚠️ admin_users table does not exist, creating it...');
        await this.prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "admin_users" (
              "id" TEXT NOT NULL,
              "name" TEXT NOT NULL,
              "username" TEXT NOT NULL,
              "email" TEXT,
              "password" TEXT NOT NULL,
              "role" TEXT NOT NULL DEFAULT 'ventas',
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
          );
        `;
        
        await this.prisma.$executeRaw`
          CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_username_key" ON "admin_users"("username");
        `;
        
        await this.prisma.$executeRaw`
          CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_email_key" ON "admin_users"("email") WHERE "email" IS NOT NULL;
        `;
        
        this.logger.log('✅ admin_users table created successfully');
      } else {
        throw error;
      }
    }
  }

  async ensureSettingsTableColumns() {
    try {
      const titleColorExists = await this.prisma.$queryRaw<Array<{column_name: string}>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'settings' AND column_name = 'titleColor'
      `;
      if (titleColorExists.length === 0) {
        await this.prisma.$executeRawUnsafe(`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "titleColor" TEXT;`);
        this.logger.log('✅ Added titleColor column to settings table');
      }

      const subtitleColorExists = await this.prisma.$queryRaw<Array<{column_name: string}>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'settings' AND column_name = 'subtitleColor'
      `;
      if (subtitleColorExists.length === 0) {
        await this.prisma.$executeRawUnsafe(`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "subtitleColor" TEXT;`);
        this.logger.log('✅ Added subtitleColor column to settings table');
      }

      const descriptionColorExists = await this.prisma.$queryRaw<Array<{column_name: string}>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'settings' AND column_name = 'descriptionColor'
      `;
      if (descriptionColorExists.length === 0) {
        await this.prisma.$executeRawUnsafe(`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "descriptionColor" TEXT;`);
        this.logger.log('✅ Added descriptionColor column to settings table');
      }
    } catch (error) {
      this.logger.warn('⚠️ Error checking/adding text color columns to settings table:', error);
    }
  }
}

