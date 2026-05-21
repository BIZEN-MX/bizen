# Arquitectura del Módulo de Inteligencia Artificial (Billy AI) - ÉPICA 5

Este documento detalla la ingeniería detrás de "Billy", el mentor financiero impulsado por IA de BIZEN. A diferencia de un simple wrapper de ChatGPT, Billy actúa como un "Proxy Conversacional Sensible al Contexto".

---

## 1. El Cerebro (LLM Provider & Edge Runtime)
BIZEN se comunica con Modelos de Lenguaje Grande (LLMs) como OpenAI (GPT-4) o Anthropic a través del Vercel AI SDK.

*   **Rendimiento (Edge Runtime):** Las rutas de API de Billy (ej. `/api/ai/chat`) se configuran para correr en el Edge Runtime de Vercel. Esto elimina los tiempos de arranque (Cold Starts) y permite hacer streaming de la respuesta (Chunking) letra por letra hacia el navegador del alumno, garantizando una UX fluida.
*   **Vectorización de Identidad:** Billy tiene un "System Prompt" rígido inyectado en el servidor que le prohíbe responder preguntas fuera del ámbito financiero y lo obliga a adoptar la personalidad de un león mentor.

---

## 2. Inyección de Contexto en Tiempo Real
Para que Billy se sienta como un mentor personal real, el backend intercepta el mensaje del usuario antes de enviarlo a OpenAI y le inyecta el estado de la base de datos (Prisma).

**El Flujo del Proxy:**
1.  El usuario escribe: *"¿Qué hago con mi dinero?"*
2.  El servidor consulta el `Profile` y los `simulator_portfolios` del usuario.
3.  El servidor muta el prompt en secreto:
    *"[SISTEMA: El alumno se llama Diego. Tiene 100 Bizcoins. Su portafolio de bolsa va perdiendo -5%. En su último simulador CETES sacó 10% de yield]. El usuario pregunta: ¿Qué hago con mi dinero?"*
4.  Billy responde con contexto ultra-personalizado.

---

## 3. Inyecciones Estáticas en el LMS
Billy no solo vive en una pestaña de chat aislada; es parte del motor de aprendizaje.

*   **Paso `billy_talks`:** Dentro del JSONB `LessonStep.data` del Motor LMS, los administradores pueden crear un paso donde Billy interrumpe la lección para dar un consejo.
*   **Análisis Post-Error:** Cuando el usuario falla un quiz de opción múltiple, el frontend hace un fetch a un endpoint especial de Billy enviándole la pregunta y la respuesta equivocada, para que la IA le explique por qué se equivocó sin darle la respuesta correcta directamente.
