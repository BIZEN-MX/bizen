# Arquitectura del Módulo de Identidad (Auth, Login & Onboarding)

Este documento detalla el ciclo de vida completo de un usuario en BIZEN, desde que ingresa a la plataforma por primera vez hasta que se le asigna un rol y un perfil en la base de datos local.

---

## 1. Proveedor de Identidad (Clerk)
BIZEN delega el manejo de contraseñas, tokens JWT, sesiones y validaciones OTP/OAuth a **Clerk** (`@clerk/nextjs`).

*   **Rutas Frontend:**
    *   `/login/[[...sign-in]]`: Envuelve el componente `<SignIn>` de Clerk.
    *   `/signup/[[...sign-up]]`: Envuelve el componente `<SignUp>` de Clerk.
*   **Customización UI:** Ambos componentes utilizan el prop `appearance` para inyectar clases de Tailwind y sobrescribir el CSS de Clerk, asegurando que los formularios parezcan nativos de BIZEN y adopten los colores del *Skins System* (ej. colores Anáhuac si el usuario escribe un correo `@anahuac.mx`).

---

## 2. El "Gatekeeper": Edge Middleware
El archivo `src/middleware.ts` actúa como la primera línea de defensa antes de que cualquier request toque los componentes de React o la base de datos.

**Flujo del Middleware:**
1.  **Exclusión de APIs:** Si la ruta es `/api/(.*)`, el middleware permite el paso. Esto es crucial para que las APIs devuelvan un JSON `{ error: "Unauthorized" }` con código HTTP 401, en lugar de intentar redirigir un fetch request a una página de login.
2.  **Fast Redirect (Anti-Flash):** Si el usuario **ya tiene sesión iniciada** e intenta visitar la landing page (`/`), `/login` o `/signup`, el middleware lo intercepta en el Edge y lo redirige instantáneamente a `/dashboard`. Esto evita el "parpadeo" de la pantalla pública antes de cargar la app.
3.  **Rutas Protegidas:** Evaluadores Regex (`/dashboard(.*)`, `/admin(.*)`, `/teacher(.*)`) fuerzan el bloqueo mediante `auth.protect()` si no hay un token de sesión válido.

---

## 3. Sincronización Clerk ↔ Base de Datos (PostgreSQL)
El desafío arquitectónico principal es mantener sincronizado el `userId` de Clerk con la tabla `Profile` de nuestra base de datos relacional (Prisma). BIZEN utiliza un patrón **Lazy Sync / Onboarding Forced**.

**El ciclo de vida del "Handshake":**
1.  El usuario crea su cuenta en Clerk y es redirigido a `/dashboard`.
2.  El `AuthContext.tsx` o `DashboardClient.tsx` monta y hace una petición a `/api/profile/me`.
3.  **Si el perfil no existe** en PostgreSQL, la API lo detecta. El frontend reacciona mostrando el `<OnboardingModal>`.
4.  El Modal **bloquea la interfaz** (no se puede cerrar) obligando al usuario a proporcionar los datos que Clerk no nos da (ej. Nickname único, Institución/Escuela, Fecha de Nacimiento).

---

## 4. El Endpoint de Onboarding (`/api/onboarding/complete`)
Cuando el usuario envía el formulario inicial, este endpoint ejecuta la lógica crítica de creación en Prisma.

*   **Validación de Unicidad:** Hace un query (`findFirst`) para asegurar que el `nickname` (trimmeado y *case-insensitive*) no le pertenezca a otro `userId`.
*   **Operación Atómica (UPSERT):**
    *   Se utiliza `prisma.profile.upsert` usando el `userId` de Clerk como llave foránea implícita.
    *   **Si es nuevo (`create`):** Lo inicializa con `xp: 0`, `bizcoins: 0`, `role: 'particular'`, y enlaza el `schoolId` seleccionado.
    *   **Si existía (`update`):** Actualiza el avatar y datos demográficos.
*   **Safety Fallback:** Si la base de datos tira un error crítico (ej. caída de conexión), el endpoint registra un log físico (`_onboarding_error.log`). Si detecta que está en un ambiente local de desarrollo (`localhost`), fuerza un retorno "success" simulado para no bloquear al desarrollador.

---

## 5. Autorización Basada en Roles (RBAC) y Gatekeeping Interno
Una vez que el usuario existe en `Profile`, el campo `role` (`admin`, `school_admin`, `teacher`, `user`) y el dominio de su `email` dictan a dónde puede ir.

1.  **Client-Side Gatekeeping (Skins):**
    *   Lógica alojada en hooks como `useAuth`.
    *   Si el correo coincide con patrones institucionales (`.endsWith('@anahuac.mx')`), se inyecta la clase `.theme-anahuac` al `<html>`.
2.  **Server-Side Gatekeeping (Layouts):**
    *   Archivos como `src/app/admin/layout.tsx` y `src/app/teacher/layout.tsx` se ejecutan en el servidor.
    *   Hacen un fetch al `Profile` a través de Prisma.
    *   Si el `role` no coincide, ejecutan un `redirect('/dashboard')` antes de siquiera renderizar el HTML al cliente, haciéndolo in-hackeable desde el navegador.
    *   **Super Admins:** Tienen un array duro de correos `const SUPER_ADMINS = [...]` que sobrescribe cualquier rol de DB para el Mission Control (`/admin`).
