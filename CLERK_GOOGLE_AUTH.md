# 🔐 Configuración de Google Auth (Clerk Edition)

Dado que BIZEN se ha migrado de Supabase a **Clerk**, los pasos para configurar Google Auth han cambiado. Ya no necesitas configurar nada en el dashboard de Supabase para el login social.

## 🚀 Pasos para Clerk

### 1. Activar Google en el Dashboard de Clerk
1. Ve al [Dashboard de Clerk](https://dashboard.clerk.com/).
2. Selecciona tu proyecto (BIZEN).
3. Ve a **User & Authentication** > **Social Connections**.
4. Busca **Google** y actívalo.

### 2. (Opcional) Usar tus propias credenciales de Google
Si quieres que aparezca "BIZEN" específicamente en la pantalla de autorización de Google (en lugar de Clerk), debes usar tus propias credenciales:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea/Selecciona tu proyecto.
3. Ve a **API & Services** > **Credentials**.
4. Edita (o crea) tu **OAuth 2.0 Client ID**.
5. **Configura las URIs sugeridas por Clerk**:
   - En el Dashboard de Clerk, al editar la conexión de Google, verás un campo llamado **"Authorized redirect URI"**.
   - Cópialo y pégalo en Google Cloud Console bajo **"Authorized redirect URIs"**.
   - Suele tener este formato: `https://clerk.bizen.mx/v1/oauth_callback` (para producción).
6. Copia el **Client ID** y **Client Secret** de Google a Clerk.

### 3. Verificar Variables de Entorno
Asegúrate de que tus claves de Clerk en `.env.local` son las correctas:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

---

## ⚠️ ¿Por qué fallaba antes?
1. **Redundancia de CSP**: Tenías configuraciones de seguridad en `next.config.ts` y en `middleware.ts`. El `middleware.ts` era más restrictivo y estaba bloqueando fuentes de Clerk y Google. **(YA LO HE CORREGIDO)**.
2. **Setup Obsoleto**: El archivo `GOOGLE_AUTH_SETUP.md` contenía instrucciones para Supabase, las cuales ya no aplican al sistema de login actual basado en Clerk.

---

## ✅ Checklist de Verificación
- [ ] ¿Aparece el botón de Google en `/login`? (Si no aparece, actívalo en Clerk > Social Connections).
- [ ] ¿Te redirige a Google al pulsar?
- [ ] ¿Te devuelve a `/dashboard` tras loguear?
