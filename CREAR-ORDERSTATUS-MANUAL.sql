-- Script SQL para crear el tipo OrderStatus manualmente
-- Ejecuta esto en tu base de datos de Railway ANTES de ejecutar las migraciones

-- Crear el enum OrderStatus si no existe
DO $$ BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Verificar que se creó correctamente
SELECT enum_range(NULL::"OrderStatus");

