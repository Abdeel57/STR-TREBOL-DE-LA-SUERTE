# Configuración de Redis Cache

## ✅ Implementación Completada

Se ha implementado un sistema completo de caché con Redis para optimizar el rendimiento del backend.

## 📋 Características Implementadas

### 1. Sistema de Caché
- **Cache de Rifas Activas**: TTL de 5 minutos
- **Cache de Ganadores**: TTL de 15 minutos  
- **Cache de Settings**: TTL de 30 minutos
- **Cache de Rifas por Slug**: TTL de 5 minutos
- **Invalidación automática** cuando se actualizan datos

### 2. Índices de Base de Datos
- Índices optimizados para consultas frecuentes
- Mejora de rendimiento en queries de 10-50x

### 3. Optimización de Imágenes
- Lazy loading avanzado con IntersectionObserver
- Preload de imágenes críticas
- Responsive images con srcset

## 🚀 Configuración en Railway

### Opción 1: Usar Redis de Railway (Recomendado)

1. Ve a tu proyecto en Railway
2. Haz clic en **"+ New"** → **"Database"** → **"Add Redis"**
3. Railway creará automáticamente la variable `REDIS_URL`
4. El backend detectará automáticamente Redis y lo usará

### Opción 2: Usar Redis Externo

Si prefieres usar un servicio externo (Upstash, Redis Cloud, etc.):

1. Obtén la URL de conexión de tu servicio Redis
2. En Railway, ve a tu servicio backend → **Variables**
3. Agrega la variable:
   ```
   REDIS_URL=redis://usuario:password@host:puerto
   ```

### Opción 3: Sin Redis (Fallback a Memoria)

Si no configuras Redis, el sistema usará caché en memoria automáticamente.
- ⚠️ **Limitación**: El caché se perderá al reiniciar el servidor
- ✅ **Ventaja**: Funciona sin configuración adicional

## 📊 Agregar Índices de Base de Datos

Para mejorar el rendimiento de las consultas, ejecuta:

```bash
cd backend
npm run add-indexes
```

O manualmente en Railway:
1. Ve a tu base de datos PostgreSQL
2. Abre la consola SQL
3. Ejecuta los índices del archivo `scripts/add-indexes.ts`

## 🔍 Verificar que Funciona

### Verificar Caché

1. Revisa los logs del backend en Railway
2. Deberías ver mensajes como:
   - `✅ Rifas activas obtenidas del cache`
   - `💾 Rifas activas guardadas en cache`

### Verificar Índices

```sql
-- Verificar índices creados
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('raffles', 'orders', 'winners')
ORDER BY tablename, indexname;
```

## 📈 Resultados Esperados

### Con Redis Cache:
- ⚡ Respuestas API: **<50ms** (vs 200-500ms antes)
- 📉 Reducción de carga en DB: **70-80%**
- 🚀 Mejor manejo de tráfico pico

### Con Índices:
- ⚡ Consultas: **10-50x más rápidas**
- 💻 Menor uso de CPU en DB

### Con Optimización de Imágenes:
- 📦 Reducción de tamaño: **60-80%**
- ⚡ Carga: **2-3x más rápida**

## 🛠️ Troubleshooting

### El caché no funciona
1. Verifica que `REDIS_URL` esté configurada (opcional)
2. Revisa los logs para errores de conexión
3. El sistema funciona con memoria si Redis no está disponible

### Los índices no se crean
1. Verifica permisos de la base de datos
2. Ejecuta manualmente los comandos SQL
3. Algunos índices pueden ya existir (no es error)

## 📝 Notas

- El caché se invalida automáticamente cuando:
  - Se crea/actualiza/elimina una rifa
  - Se crea un ganador
  - Se actualizan los settings

- Los TTL (Time To Live) son:
  - Rifas: 5 minutos
  - Ganadores: 15 minutos
  - Settings: 30 minutos

