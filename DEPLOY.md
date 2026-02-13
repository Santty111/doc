# Despliegue en Vercel + UploadThing

## 1. Variables de entorno

Crea en Vercel (Project → Settings → Environment Variables) las siguientes. En local, usa `.env.local`.

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGODB_URI` | Cadena de conexión de MongoDB (Atlas recomendado) | `mongodb+srv://user:pass@cluster.mongodb.net/medicontrol` |
| `NEXTAUTH_SECRET` | Secreto para firmar sesiones (generar con `openssl rand -base64 32`) | string largo aleatorio |
| `NEXTAUTH_URL` | URL pública de la app | En producción: `https://tu-app.vercel.app` |
| `UPLOADTHING_TOKEN` | Token de UploadThing (ver abajo) | `sk_live_...` o token de desarrollo |

### Cómo obtener UPLOADTHING_TOKEN

1. Entra en [uploadthing.com](https://uploadthing.com) y crea cuenta o inicia sesión.
2. En el [Dashboard](https://uploadthing.com/dashboard) crea una app (o usa la existente).
3. En **API Keys** copia el **Token** (no el Secret en el backend; el token se usa en el cliente/servidor según la doc). En la doc actual figura como `UPLOADTHING_TOKEN` en `.env`.
4. Añade ese valor como `UPLOADTHING_TOKEN` en Vercel y en tu `.env.local` para desarrollo.

## 2. Deploy en Vercel

1. Sube el repo a GitHub (si no está ya).
2. En [vercel.com](https://vercel.com) → **Add New Project** → importa el repositorio.
3. Framework Preset: **Next.js** (detectado automático).
4. Configura las variables de entorno (arriba) en **Environment Variables**.
5. **Deploy**. Tras el build, la app quedará en `https://tu-proyecto.vercel.app`.

### NEXTAUTH_URL en producción

- En **Production** pon: `https://tu-dominio.vercel.app`.
- En **Preview** (ramas) puedes usar la URL que te asigne Vercel (ej. `https://tu-proyecto-git-rama-tu.vercel.app`) o dejar la misma de producción si usas una sola URL.

## 3. UploadThing (archivos de exámenes)

- Los archivos que suban los usuarios en **Exámenes** se guardan en UploadThing, no en el disco del servidor.
- En MongoDB solo se guarda la **URL** del archivo (y el nombre); esa URL apunta a los servidores de UploadThing.
- Sin `UPLOADTHING_TOKEN` configurado, la subida de archivos en exámenes fallará (el resto de la app puede seguir funcionando).

## 4. Notas

- **Archivos subidos antes del cambio**: Si tenías archivos en `public/uploads/exams/` (subida local), esas URLs dejarán de funcionar en Vercel porque el filesystem no es persistente. Solo los exámenes nuevos (subidos con UploadThing) tendrán enlace válido.
- **MongoDB**: Usa MongoDB Atlas u otro servicio accesible desde internet; la URI debe ser válida desde los servidores de Vercel.
- **NextAuth**: Asegura que en tu proveedor de credenciales (o callbacks) uses `NEXTAUTH_URL` correcta para callbacks y cookies.
