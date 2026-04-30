# Arquitectura del Módulo de Dashboards y Telemetría - ÉPICA 6

Este documento detalla la ingeniería del modelo B2B (Business to Business) de BIZEN. Muestra cómo la plataforma agrega los datos individuales de los alumnos para ofrecer métricas de valor a las instituciones educativas y cómo los administradores centrales gestionan el sistema.

---

## 1. School Admin Analytics (El Panel del Rector)
El layout protegido en `/school-admin` permite a las autoridades escolares monitorear el desempeño de su institución.

### 1.1 Gatekeeping y Aislamiento de Datos
*   **Autorización:** El middleware y el Server Component validan que el `Profile.role` sea `school_admin`.
*   **Filtro RLS (Row Level Security Virtual):** Todas las consultas de telemetría a Prisma incluyen obligatoriamente `where: { schoolId: admin.schoolId }`. Esto asegura que el rector de la Universidad A jamás pueda consultar las métricas o identidades de los alumnos de la Universidad B.

### 1.2 Agregación de Métricas (SQL y Prisma)
Las gráficas de riesgo y retención se alimentan de queries complejas:
*   **Average Attempts (Dificultad de Lecciones):** Se hace un query agregado (`_avg`) sobre el modelo `Attempt` para descubrir qué preguntas del LMS tienen la tasa de fallo más alta, permitiendo a la escuela ajustar su pedagogía.
*   **Progress Tracking:** Se cuenta la relación porcentual entre `Progress.isCompleted` y el total de lecciones del `Course` activo.

---

## 2. Mission Control (El Panel Super Admin BIZEN)
Ubicado en `/admin`, es la consola de comandos maestra de la plataforma, diseñada exclusivamente para el equipo interno de BIZEN.

### 2.1 Hardcoded Security (Lista Blanca)
A diferencia de los roles regulares, el panel de Super Admin implementa una capa extra de seguridad para prevenir escalamiento de privilegios por inyecciones en base de datos.
*   **`const SUPER_ADMINS`:** Array inmutable inyectado directamente en el código de los Route Handlers (APIs). Incluso si alguien hackeara Prisma y cambiara su rol a "admin", la API de creación de lecciones o borrado de usuarios rechazará el request si su correo (validado criptográficamente por Clerk) no está en esa lista.

### 2.2 CRUD Operations
*   **Curriculum Engine:** Modificación directa de la jerarquía `Topic` y `LessonStep` (descrito en Épica 2).
*   **User Management:** Endpoint en `/api/admin/users/sync` para forzar sincronizaciones manuales con Clerk, alteración de Bizcoins para soporte al cliente y borrado físico de perfiles anómalos.
