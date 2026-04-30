# Arquitectura del Módulo LMS (Learning Management System)

De acuerdo al Backlog Técnico (ÉPICA 2), una vez que el usuario ha pasado el Onboarding, interactúa principalmente con el **Core LMS**. Este módulo es el responsable de servir el contenido educativo de forma dinámica y gamificada.

Este documento detalla la estructura para el equipo de Ingeniería.

---

## 1. Esquema de Datos (Prisma)
El currículum no es estático; está estructurado de manera jerárquica y relacional en PostgreSQL para permitir flexibilidad.

**Jerarquía Core:**
*   **`Course` (Opcional):** Contenedor de nivel superior (ej. "Finanzas Personales 101").
*   **`Topic` (El Eje Central):** Es la unidad principal de aprendizaje (ej. "Interés Compuesto"). Contiene un `displayOrder` para ordenarlos en la UI.
*   **`Lesson`:** Cada tema tiene múltiples lecciones. Tienen propiedades como `xpReward`, `duration` y `contentType` (ej. 'interactive', 'video').
*   **`LessonStep`:** El componente más granular. Cada lección se divide en pasos.

**El Campo Crítico: `LessonStep.data` (JSONB)**
Para evitar crear 20 tablas distintas para cada tipo de minijuego (opción múltiple, tarjetas deslizables, ordenar conceptos), el modelo `LessonStep` guarda toda su configuración en un campo tipo JSONB llamado `data`. El campo `type` (String) le indica al Frontend cómo debe interpretar y renderizar ese JSON.

---

## 2. El Motor de Renderizado (Interactive Player)
El reproductor de lecciones (`/learn/.../interactive`) funciona como una máquina de estados de un solo sentido.

**Flujo del Engine:**
1.  **Ingestión:** Hace fetch al endpoint de la lección y obtiene el array de `LessonStep` ordenados por `order`.
2.  **Factory Pattern (UI):** Según el `step.type`, el componente principal delega el renderizado a submódulos de React. Ejemplos de mapeo:
    *   `mcq` -> Renderiza `<MultipleChoiceQuiz />` leyendo `step.data.options`.
    *   `swipe_sorter` -> Renderiza lógica estilo Tinder (Tinder Cards) para clasificar conceptos a la izquierda o derecha.
    *   `match` -> Renderiza un juego de unir columnas.
    *   `billy_talks` -> Inyecta al avatar de IA dando un consejo intermedio.
3.  **State Management:** Un puntero numérico (`currentStepIndex`) avanza solo si el submódulo emite un evento `onSuccess`. Las respuestas fallidas suelen retener al usuario o restar un "corazón" (Health/Vidas).

---

## 3. Gestor Administrativo (Mission Control Builder)
Para que el equipo de BIZEN cree contenido sin tocar código, se construyó el **Curriculum Builder** en `/admin/curriculum/page.tsx`.

*   **UI:** Interfaz Drag & Drop / Master-Detail donde seleccionas un Tema y construyes sus Lecciones y Steps.
*   **Endpoint (`/api/admin/curriculum/route.ts`):** 
    *   Recibe payloads JSON desde el frontend.
    *   **Gatekeeping:** Protegido por la función `isSuperAdmin()`.
    *   **Type Parsing:** Maneja la conversión estricta de variables (ej. `parseInt(xpReward)`) para asegurar que el Frontend (que envía strings de inputs HTML) no rompa las validaciones `Int` de Prisma, evitando errores 500.
    *   **Auto-Ordenamiento:** Al crear un nuevo Step o Lesson, hace un aggregate (`_max`) sobre la base de datos para asignarle el último lugar de la fila automáticamente.

---

## 4. Tracking y Persistencia de Progreso
Para que el usuario pueda retomar donde se quedó y no haga trampa.

*   **Modelo `Progress` / `QuizResult`:** Al completarse un Step o Lección, se realiza un llamado al backend (`/api/lessons/[id]/complete`).
*   **Transacciones Atómicas (ACID):**
    Este endpoint es crítico. No solo marca la lección como terminada (`isCompleted: true`), sino que ejecuta operaciones atómicas matemáticas en el perfil del usuario:
    ```javascript
    prisma.profile.update({
      where: { userId },
      data: {
         xp: { increment: lesson.xpReward },
         bizcoins: { increment: calculatedCoins }
      }
    })
    ```
    *El uso de `increment` previene "Race Conditions" (que un usuario envíe dos requests rápido para duplicar sus monedas).*

---

## 5. BIZEN Bites (Microlearning)
Módulo independiente enfocado en contenido vertical (estilo TikTok) alojado en `/bites`.
*   **Streaming:** Los videos no se sirven de nuestra base de datos, sino que los URLs apuntan a buckets públicos de **Google Cloud Storage (GCS)** para no saturar el ancho de banda del servidor de Next.js.
*   **Intersection Observer:** El reproductor en React utiliza la API del DOM `IntersectionObserver` para auto-reproducir el video que está en el centro de la pantalla y pausar los que salen del viewport, optimizando memoria en móviles.
