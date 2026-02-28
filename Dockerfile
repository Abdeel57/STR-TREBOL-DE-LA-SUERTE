# ============================================================
# Dockerfile para Railway - Solo el backend NestJS
# ============================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Copiar solo los archivos del backend
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Instalar dependencias (incluyendo devDeps para build)
RUN npm ci

# Generar cliente de Prisma
RUN npx prisma generate

# Copiar el resto del código del backend
COPY backend/ .

# Compilar NestJS
RUN npm run build

# ============================================================
# Imagen de producción (sin devDependencies)
# ============================================================
FROM node:20-alpine AS production

WORKDIR /app

# Copiar package.json
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Regenerar Prisma client para esta imagen
RUN npx prisma generate

# Copiar build compilado
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Iniciar aplicación
CMD ["node", "dist/main.js"]
