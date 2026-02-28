# 🚀 Cómo Iniciar los Servidores

## ⚡ Método Rápido (Recomendado)

### Opción 1: Doble clic en el archivo
Haz doble clic en: **`iniciar-servidores.bat`**

Este script:
- ✅ Libera los puertos si están ocupados
- ✅ Inicia el Backend en una ventana separada
- ✅ Inicia el Frontend en otra ventana separada
- ✅ Te muestra las URLs para acceder

### Opción 2: Desde la terminal
```bash
iniciar-servidores.bat
```

## 📋 Método Manual (Si el script no funciona)

### Terminal 1 - Backend
```bash
cd backend
npm run start:prisma
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

## 🌐 URLs de Acceso

Una vez que los servidores estén corriendo:

- **Frontend (Página principal)**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Panel Admin**: http://localhost:5173/#/admin
- **Health Check**: http://localhost:3000/api/health

## ⏱️ Tiempo de Inicio

- Backend: ~10-15 segundos
- Frontend: ~5-10 segundos

**Total: Espera ~20 segundos después de iniciar**

## 🔍 Verificar que Están Corriendo

Abre tu navegador y ve a: http://localhost:5173

Si ves la página, ¡todo está funcionando! 🎉

## 🛑 Detener los Servidores

En las ventanas de los servidores, presiona: **Ctrl + C**

O cierra las ventanas directamente.

## ⚠️ Si Algo Falla

1. **Puerto ocupado**: El script debería liberarlo automáticamente
2. **Error de dependencias**: Ejecuta `npm install` en `backend` y `frontend`
3. **Error de base de datos**: Verifica `backend/.env` tiene `DATABASE_URL` configurado
4. **Error de Prisma**: Ejecuta `cd backend && npx prisma generate`

## 💡 Tips

- Los servidores se recargan automáticamente cuando haces cambios (hot reload)
- Puedes ver los logs en tiempo real en las ventanas de los servidores
- Si cambias algo en el backend, se reinicia automáticamente
- Si cambias algo en el frontend, se recarga en el navegador automáticamente

---

**¡Listo para desarrollar!** 🚀

