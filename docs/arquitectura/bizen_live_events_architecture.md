# Arquitectura del Sistema Multiplayer en Vivo (ÉPICA 7)

Este documento detalla la ingeniería planeada para la Fase 2 de BIZEN: Los Eventos en Vivo. Diseñado para transformar el salón de clases físico en un entorno competitivo estilo Kahoot, pero enfocado 100% en educación financiera.

---

## 1. El Motor Síncrono (WebSockets / Supabase Realtime)
A diferencia del Core LMS que es asíncrono (HTTP REST), los eventos en vivo requieren comunicación bidireccional de baja latencia. BIZEN usará el protocolo WebSocket (probablemente a través de canales de Supabase Realtime) para mantener conectados a los alumnos y al host.

### 1.1 Modelado en Base de Datos (Prisma)
La arquitectura transaccional se compone de las siguientes entidades:
*   **`live_sessions`:** El lobby creado por el profesor. Contiene un código PIN (ej. "BIZEN-8492"), el estado del juego (`WAITING`, `IN_PROGRESS`, `FINISHED`) y el `hostId`.
*   **`live_participants`:** Registro de unión (`Join`) de los perfiles que han ingresado al lobby usando el PIN.
*   **`live_quiz_templates`:** Colección de preguntas pre-aprobadas que el profesor puede disparar durante el evento.

---

## 2. Flujo de Estados del Juego (State Machine)
El ciclo de vida de una batalla en vivo:

1.  **Lobby:** El profesor crea una sesión. La interfaz emite un evento de *broadcasting*. Los alumnos envían el PIN y su Avatar aparece en la pantalla del host en tiempo real.
2.  **Countdown & Broadcasting:** El servidor dispara la primera pregunta. Se ignora la latencia de la base de datos principal y todo fluye por el canal de WebSockets.
3.  **Score Resolution:** Cada respuesta correcta otorga puntos ponderados por velocidad (quien contesta en 1 segundo gana más que quien contesta en 5 segundos). Se guarda en el modelo temporal de memoria y no en PostgreSQL de inmediato para evitar cuellos de botella de escritura masiva.
4.  **`live_leaderboard_snapshots`:** Al final de cada ronda, el servidor toma una "fotografía" del ranking actual y la emite a todos los clientes para mostrar el Top 3 y las animaciones de subida/bajada de posición.

---

## 3. Impacto en la Economía Base
Al finalizar la sesión (`FINISHED`), el servidor ejecuta una Transacción ACID maestra que vuelca los resultados de la memoria temporal hacia la base de datos oficial.
El ganador se lleva un *Jackpot* de Bizcoins y XP que impacta sus modelos permanentes (`Profile.xp`, `Profile.bizcoins`), cerrando la brecha entre el modo en vivo y su carrera individual en la plataforma.
