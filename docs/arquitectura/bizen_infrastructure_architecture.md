# Arquitectura de Infraestructura, DevOps y Cloud

Este documento es el mapa maestro de operaciones (DevOps). Detalla dónde vive el código de BIZEN, cómo se conecta a los datos en producción y cuál es el pipeline exacto para compilar y desplegar nuevas versiones sin causar caídas de servicio (Downtime).

---

## 1. Topología de Servidores (Google Cloud Platform)
BIZEN está construido sobre una arquitectura **Serverless (Sin Servidor Fijo)**. Esto significa que la aplicación escala a cero cuando no hay usuarios, y puede levantar miles de instancias simultáneas si una universidad entera se conecta al mismo tiempo, garantizando alta disponibilidad y bajo costo.

### 1.1 Compute (Google Cloud Run)
*   **Contenedores:** La aplicación Next.js se empaca en una imagen de Docker multi-etapa (definida en el `Dockerfile`).
*   **Despliegue Serverless:** La imagen se despliega en **Google Cloud Run** (`bizen-frontend-...a.run.app`). Google Cloud Run se encarga del balanceo de carga y de asignar CPU/RAM dinámicamente según el tráfico web.

### 1.2 Base de Datos (Google Cloud SQL)
*   **Motor:** PostgreSQL.
*   **Conexión Segura (Proxy):** La base de datos nunca expone un puerto público al internet. Para que el servidor de Cloud Run (o la máquina local de desarrollo) se conecte a la DB de producción, se debe utilizar el `cloud-sql-proxy`.
*   **Túnel Local:** En desarrollo, el comando `./cloud-sql-proxy --port 5433 bizen-475002:us-central1:bizen-db` abre un túnel cifrado en el puerto `5433` de `localhost`. Prisma (`schema.prisma`) apunta a este túnel para ejecutar migraciones (`npx prisma db push`).

---

## 2. Servicios de Terceros (SaaS)
La infraestructura se apoya en servicios externos altamente especializados para descargar carga computacional de Cloud Run.

*   **Autenticación (Clerk):** Actúa como el portero (Identity Provider). Maneja sesiones, 2FA, OTP y webhooks. Descarga de BIZEN la responsabilidad legal y de seguridad de almacenar contraseñas en texto plano.
*   **Almacenamiento (Supabase / GCS):** Utilizado como API de respaldo para activos estáticos pesados o posibles expansiones de bases de datos en tiempo real (Edge Functions o WebSockets).

---

## 3. Pipeline de Despliegue Continúo (CI/CD)
El proceso para pasar código de la computadora del ingeniero a las pantallas de los estudiantes está automatizado.

### 3.1 Script de Deploy (`./deploy.sh`)
El ingeniero **no** sube archivos manualmente vía FTP. En su lugar, ejecuta el script `./deploy.sh` en la raíz del proyecto.
El flujo interno del script es:
1.  **Google Cloud Build:** Empaca el código local y lo envía a los servidores de compilación de Google.
2.  **Build Step:** Descarga dependencias de npm, inyecta las variables de entorno de producción (Clerk Keys, Supabase URLs, etc.), compila Next.js (`npm run build`) y genera el cliente de Prisma.
3.  **Lanzamiento (Rollout):** Si la compilación es exitosa, reemplaza la imagen antigua en Cloud Run redirigiendo el 100% del tráfico a la nueva versión al instante. Si falla (como cuando hay errores de tipado o de sintaxis en React), aborta el despliegue manteniendo la versión anterior segura (Rollback automático).

---

## 4. Desarrollo Local y Monitoreo
Para que un ingeniero trabaje en su máquina, debe encender 3 procesos simultáneos:
1.  **El Túnel DB:** `./cloud-sql-proxy --port 5433 ...` (Para que Prisma pueda leer/escribir).
2.  **El Servidor Web:** `npm run dev` (Para renderizar la app en `localhost:3000`).
3.  **Watchdog (`./watchdog.sh`):** Un script personalizado que monitorea el estado general de los procesos y previene errores silenciosos en local.
