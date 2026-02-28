# ============================================================
# Dockerfile para Railway - Solo el backend NestJS
# ============================================================

FROM node:20-slim AS builder

WORKDIR /app

# openssl es requerido por Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

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
FROM node:20-slim AS production

WORKDIR /app

# openssl es requerido por Prisma en runtime
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copiar package.json
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Regenerar Prisma client para esta imagen
RUN npx prisma generate

# Copiar build compilado
COPY --from=builder /app/dist ./dist

# Railway espera la app en puerto 8080
ENV PORT=8080
EXPOSE 8080

# Iniciar aplicación
CMD ["node", "dist/main.js"]
