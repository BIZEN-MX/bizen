# Arquitectura del Módulo de Gamificación, Economía y Comunidad (ÉPICA 4)

Este documento expone la ingeniería detrás del motor de retención de BIZEN. Una vez que el usuario consume teoría (LMS) y la aplica (Simuladores), este módulo se asegura de que el usuario regrese todos los días mediante bucles de recompensa (Reward Loops), estatus y presión social positiva.

---

## 1. El Motor Económico Core (XP y Bizcoins)
BIZEN maneja una economía dual inyectada directamente en el modelo `Profile`.

*   **Puntos de Experiencia (XP):** Representan el "Estatus Académico" del alumno. Sirven exclusivamente para determinar su posición en los Leaderboards y su nivel en el sistema. **No se pueden gastar**.
*   **Bizcoins:** Representan la liquidez virtual de la economía. Son la moneda de cambio para comprar en la tienda virtual (`UserInventoryItem`) o ejecutar transacciones complejas.

### 1.1 Mutaciones Atómicas (Prevención de Fraude)
Toda alteración a la economía del jugador ocurre del lado del servidor usando transacciones seguras de Prisma (`increment` / `decrement`).
Nunca se envía desde el cliente un payload como `{ xp: 1500 }`. El cliente solo envía el `Id` de la lección terminada, y el servidor consulta en la base de datos el `xpReward` oficial de dicha lección y ejecuta un `increment`. Esto evita manipulaciones del lado del cliente.

---

## 2. Rachas (Streaks) y Retención Diaria
La retención de Corto Plazo se gestiona a través de las rachas de conexión ininterrumpidas.

### 2.1 Algoritmo de Cálculo en `AuthContext`
Cada vez que el usuario se loguea (o el `middleware` lo deja pasar al Dashboard):
1.  Se consulta el campo `lastActive` (DateTime).
2.  Si la diferencia entre hoy y `lastActive` es **exactamente 1 día**, se hace un `increment: 1` a `streakDays`.
3.  Si la diferencia es **> 1 día**, la racha se rompe y se setea `streakDays: 1`.
4.  Si la diferencia es **0 días** (mismo día), no pasa nada.
Se actualiza `lastActive` a `now()` atómicamente.

---

## 3. Motor de Misiones Diarias
Para incentivar el uso holístico de la plataforma (ej. "Hoy debes usar un simulador en lugar de solo leer").

*   **Modelo `DailyMission`:** Define tareas rotativas ("Completa 2 lecciones", "Gana 100 XP").
*   **Gestión de Progreso:** Se evalúa a través del campo estático o dinámico que rastree los triggers del sistema. Una vez que el `Progress` o la condición del simulador empatan con la regla del `objectiveType` de la misión, se libera la recompensa (Bizcoins/XP extra) en bloque.

---

## 4. Rankings y Filtros Institucionales (Social Graph)
El motor competitivo para el entorno escolar.

### 4.1 Jerarquía de Ranking
1.  **Global Leaderboard:** Query `orderBy: { xp: 'desc' }` sobre todos los perfiles de la DB (Limit 100 por performance).
2.  **School Leaderboard:** Para generar tableros privados donde los alumnos de una universidad solo compiten entre ellos, se hace un "Inner Join" virtual en Prisma:
    `where: { schoolId: user.schoolId }`.

---

## 5. El Foro BIZEN (User-Generated Content)
El hub social donde los usuarios resuelven dudas y debaten simuladores.

### 5.1 Estructura Relacional StackOverflow-Style
*   **`ForumTopic` / `ForumTag`:** Categorías macro.
*   **`ForumThread`:** La pregunta o debate original creado por un `Profile`.
*   **`ForumComment`:** Las respuestas anidadas.
*   **`ForumVote`:** Sistema de Upvotes y Downvotes que altera la visibilidad del thread y afecta la "reputación" invisible del usuario.

### 5.2 Gatekeeping de Contenido
Las APIs del foro (ej. `/api/forum/comments`) validan la sesión con Clerk antes de permitir `POST`. Además, cuentan con un `isSuperAdmin()` bypasser para permitir moderación y eliminación de comentarios tóxicos desde el panel del Mission Control.
