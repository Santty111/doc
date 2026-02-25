# Despliegue en Vercel - MediControl

Guía para desplegar el sistema de Salud Ocupacional (incl. Certificado de Aptitud Oficial) en Vercel.

---

## 1. Requisitos previos

- [ ] Cuenta en [Vercel](https://vercel.com)
- [ ] Repositorio en [GitHub](https://github.com) (el código debe estar subido)
- [ ] Base de datos MongoDB (recomendado: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [ ] Cuenta en [UploadThing](https://uploadthing.com) (para subida de archivos)

---

## 2. Variables de entorno

Crea en **Vercel** → tu proyecto → **Settings** → **Environment Variables** las siguientes:

| Variable | Descripción | Dónde obtener |
|----------|-------------|---------------|
| `MONGODB_URI` | Conexión a MongoDB | MongoDB Atlas → Connect → Connection string |
| `NEXTAUTH_SECRET` | Secreto para sesiones | Generar: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL pública de la app | En producción: `https://tu-proyecto.vercel.app` |
| `UPLOADTHING_TOKEN` | Token UploadThing | [uploadthing.com/dashboard](https://uploadthing.com/dashboard) → API Keys |

### NEXTAUTH_URL

- **Production**: `https://tu-dominio.vercel.app`
- **Preview**: `https://tu-proyecto-git-rama-nombre.vercel.app` (o la URL que asigne Vercel)

### UPLOADTHING_TOKEN

1. Entra en [uploadthing.com](https://uploadthing.com) e inicia sesión.
2. Dashboard → **API Keys** → copia el **Token**.
3. Añade en Vercel como `UPLOADTHING_TOKEN`.

---

## 3. Pasos para deployar

### Opción A: Desde el dashboard de Vercel

1. Ve a [vercel.com/new](https://vercel.com/new).
2. **Import** tu repositorio de GitHub.
3. Vercel detectará **Next.js** automáticamente.
4. En **Environment Variables**, añade las 4 variables de la tabla anterior.
5. Haz clic en **Deploy**.

### Opción B: Con Vercel CLI

```bash
# Instalar Vercel CLI
pnpm add -g vercel

# En la raíz del proyecto
cd doc
vercel

# Seguir las instrucciones y vincular el proyecto
```

---

## 4. Verificar el deploy

1. Tras el build, la app estará en `https://tu-proyecto.vercel.app`.
2. Comprueba:
   - [ ] Login funciona (NextAuth)
   - [ ] Dashboard carga
   - [ ] Certificado de Aptitud Oficial: crear y listar
   - [ ] Subida de archivos (si usas exámenes con UploadThing)

---

## 5. Notas importantes

- **MongoDB Atlas**: La URI debe permitir conexiones desde cualquier IP (0.0.0.0/0) o añade los IPs de Vercel.
- **NextAuth**: En Vercel, desactiva **Vercel Authentication** en Project Settings si da conflictos.
- **UploadThing**: Sin el token, la subida de archivos fallará; el resto de la app puede funcionar.
- **Build**: El proyecto usa `pnpm`. Vercel lo detecta por `pnpm-lock.yaml` o `vercel.json`.
