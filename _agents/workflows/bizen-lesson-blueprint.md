---
description: Guía de Oro para la creación y expansión de lecciones en BIZEN
---

# BIZEN Lesson Blueprint: Reglas de Integridad

Este flujo de trabajo es **MANDATORIO** para cualquier edición del currículo de BIZEN. Garantiza que las lecciones sean profundas, analíticas y técnicamente íntegras.

## 1. Métrica de Longitud
- **Total:** Obligatoriamente **15 diapositivas (slides)** por lección.
- No se permiten rellenos. Cada slide debe añadir un concepto o validar un aprendizaje.

## 2. Tipos de Actividades Requeridas
Toda lección de 15 slides debe rotar entre al menos **5 tipos de actividades** diferentes:
1. **Impulse Meter:** Al menos 1 por lección. Usado para "Pausas de respiración", "Control de dopamina" o "Análisis de impulso antes de decidir".
2. **Swipe Sorter:** Al menos 1 por lección. Usado para clasificar binariamente (Necesidad vs Deseo, Activo vs Pasivo, Gasto vs Inversión).
3. **Blitz Challenge:** Obligatoriamente **2 por lección**. Retos de velocidad para fijar conceptos clave bajo presión.
4. **Mindset Translator:** Transformar creencias limitantes en lenguaje de ingeniería financiera.
5. **Order by Priority:** Jerarquizar pasos de un sistema o valor de mercado.
6. **Narrative Check:** Reflexión abierta sobre el propio sistema del usuario.

## 3. Billy Insight & Splash Screens
- **Trigger:** Toda slide que incluya la propiedad `aiInsight` disparará automáticamente una **Splash Screen de Billy Insight** antes del contenido.
- **Frecuencia:** Se recomienda incluirlos en **2-3 slides clave** por lección.
- **Límite:** El sistema permite un máximo de **3 Billy Insights por lección** para evitar redundancia.

## 4. Integridad del Glosario
- **Metadata:** La primera slide de cada lección DEBE incluir el objeto `data: { glossary: [...] }`.
- **Sintaxis Interactiva:** El cuerpo de los pasos (`body`) debe utilizar la sintaxis `[[término|definición]]` para activar los popups interactivos.
- **Detección:** El sistema solo activa el icono del libro si hay términos detectados.

## 4. Tono BIZEN (Anti-Conductual)
- **NO DAR CONSEJOS:** Evitar frases como "Debes ahorrar", "No gastes en X".
- **USAR INGENIERÍA:** Usar frases como "Analiza el Costo de Oportunidad", "Evalúa la Rareza de Mercado", "Ingeniería del Ingreso".
- **PERSPECTIVA DE SISTEMAS:** Ver al usuario como un sistema de flujos de energía (dinero), no como un deudor.

## 6. Checklist de Salida
Antes de entregar un archivo de lecciones:
- [ ] ¿Hay exactamente 15 slides por lección?
- [ ] ¿Hay **2 Blitz Challenges** configurados?
- [ ] ¿Hay al menos **2 aiInsight** para disparar Splash Screens de Billy?
- [ ] ¿Está presente el `impulse_meter`?
- [ ] ¿Está presente el `swipe_sorter`?
- [ ] ¿Se usó la sintaxis `[[...]]` en al menos 3 slides?
- [ ] ¿El tono es analítico de ingeniería?

Este manual es la protección contra "accidentes" de borrado de features.
