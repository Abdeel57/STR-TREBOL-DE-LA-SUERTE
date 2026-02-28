-- =====================================================
-- Script SQL para crear tablas faltantes en base de datos NEO
-- Ejecutar en pgAdmin conectado a la base de datos de Neo
-- =====================================================

-- 1. Crear el enum OrderStatus si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrderStatus') THEN
        CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'EXPIRED', 'RELEASED');
        RAISE NOTICE 'Enum OrderStatus creado';
    ELSE
        RAISE NOTICE 'Enum OrderStatus ya existe';
    END IF;
END $$;

-- 2. Crear tabla admin_users
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

-- Crear índice único para username
CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_username_key" ON "admin_users"("username");

-- Crear índice único para email (si existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'admin_users_email_key'
    ) THEN
        CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email") WHERE "email" IS NOT NULL;
    END IF;
END $$;

-- 3. Crear tabla orders
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

-- Crear índice único para folio
CREATE UNIQUE INDEX IF NOT EXISTS "orders_folio_key" ON "orders"("folio");

-- Crear índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS "orders_raffleId_idx" ON "orders"("raffleId");
CREATE INDEX IF NOT EXISTS "orders_userId_idx" ON "orders"("userId");
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");

-- Agregar foreign keys si las tablas relacionadas existen
DO $$ 
BEGIN
    -- Foreign key a raffles
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'raffles') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'orders_raffleId_fkey'
        ) THEN
            ALTER TABLE "orders" 
            ADD CONSTRAINT "orders_raffleId_fkey" 
            FOREIGN KEY ("raffleId") REFERENCES "raffles"("id") 
            ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
    END IF;
    
    -- Foreign key a users
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'orders_userId_fkey'
        ) THEN
            ALTER TABLE "orders" 
            ADD CONSTRAINT "orders_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") 
            ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
    END IF;
END $$;

-- 4. Crear tabla settings (versión completa según schema actual)
CREATE TABLE IF NOT EXISTS "settings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'Lucky Snap',
    
    -- Appearance settings
    "logo" TEXT,
    "favicon" TEXT,
    "logoAnimation" TEXT NOT NULL DEFAULT 'rotate',
    "primaryColor" TEXT NOT NULL DEFAULT '#111827',
    "secondaryColor" TEXT NOT NULL DEFAULT '#1f2937',
    "accentColor" TEXT NOT NULL DEFAULT '#ec4899',
    "actionColor" TEXT NOT NULL DEFAULT '#0ea5e9',
    
    -- Contact info
    "whatsapp" TEXT,
    "email" TEXT,
    
    -- Email customization
    "emailFromName" TEXT,
    "emailReplyTo" TEXT,
    "emailSubject" TEXT,
    
    -- Social links
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "tiktokUrl" TEXT,
    
    -- Other settings (JSONB para flexibilidad)
    "paymentAccounts" JSONB,
    "faqs" JSONB,
    "displayPreferences" JSONB,
    
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- Crear un registro inicial de settings si no existe
INSERT INTO "settings" ("id", "siteName", "createdAt", "updatedAt")
VALUES ('default-settings', 'Lucky Snap', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- =====================================================
-- Verificación: Mostrar las tablas creadas
-- =====================================================
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('admin_users', 'orders', 'settings')
ORDER BY table_name;

-- Mostrar estructura de las tablas creadas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name IN ('admin_users', 'orders', 'settings')
ORDER BY table_name, ordinal_position;

