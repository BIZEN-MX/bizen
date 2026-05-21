# Cursor rules

Project-specific instructions for Cursor when editing this codebase.

## GLOBAL LAYOUT RULES (MANDATORY FOR ALL CONTENT)

These rules apply to every screen, slide, and content area. If they are not followed, the layout is invalid.

1. **All content must be visually centered.**
   - Text, buttons, interactions, and images must sit inside a centered container.
   - No element should touch or feel close to any screen edge.

2. **Content container requirements:**
   - Equal left and right spacing.
   - Balanced top and bottom spacing.
   - The same container width and padding across ALL slides/screens.

3. **Consistent visual rhythm:**
   - Every slide must feel aligned with the previous one.
   - No slide may shift content left, right, up, or down compared to others.

4. **Images (when allowed):**
   - Be placed LEFT or RIGHT inside the centered container.
   - Never break the centered layout.
   - Never push text outside the container.

5. **Buttons and CTAs:**
   - Align with the centered content.
   - Maintain equal spacing from other elements.

6. **Responsive behavior:**
   - The centered container must remain centered on all screen sizes.
   - Padding may adapt, but alignment must not change.

7. **Consistency over creativity:**
   - Do NOT experiment with layout variations.
   - Do NOT change alignment per slide.
   - Do NOT create asymmetrical layouts.

Use the shared layout constants (`CONTENT_MAX_WIDTH`, `CONTENT_PADDING_X`, etc.) in `src/components/lessons/layoutConstants.ts` for all lesson and app content so every slide uses the same container.

## Project

- **BIZEN**: Plataforma institucional de educación financiera (Next.js, React, Supabase/Prisma).
- Lenguaje principal de la UI: **español** (textos, mensajes, labels).
- Estilo: profesional, claro, accesible.

## Code

- TypeScript/TSX en `src/`. Evitar `any`; tipar props y respuestas de API.
- Componentes en `src/components/`, páginas en `src/app/`.
- Lecciones interactivas: datos en `src/data/lessons/`, registro en `src/data/lessons/registry.ts`.
- Estilos: Tailwind y/o estilos inline cuando haga falta; no abusar de `!important`.

## Convenciones

- Nombres de componentes: PascalCase. Archivos de componentes: PascalCase o kebab-case según el resto del repo.
- Rutas y IDs de lección: `l{courseOrder}-{lessonIndex}` (ej. `l1-1`, `l1-2`).
- Mantener consistencia con el sidebar (`FixedSidebar`), lecciones (`LessonEngine`, `StickyFooter`) y landing (`src/app/page.tsx`).

## Order / Timeline steps (MANDATORY)

Para cualquier flashcard de tipo **"Order by Priority"** o **"Timeline Ordering"** (pasos `stepType: "order"`):

1. Los ítems arrastrables deben mostrarse siempre en un **orden aleatorio / barajado**, nunca en el orden correcto.
2. El orden correcto se define solo en **`correctOrder`** por ítem (AnswerKey). El orden en que aparecen los ítems en el array del JSON no debe usarse como orden inicial en pantalla.
3. **Nunca** mostrar el orden correcto como secuencia inicial. Si los ítems no están barajados, la flashcard es inválida.

El componente `OrderStep` ya baraja automáticamente el orden inicial; aun así, en los datos de lección (`src/data/lessons/*.ts`) los ítems pueden ir en cualquier orden en el array; la clave de respuesta es siempre `correctOrder`.

## Structuring / Order exercises (MANDATORY)

Para pasos **"Order by Priority"** o **"Timeline Ordering"** (`stepType: "order"`):

1. **El usuario debe poder mover y organizar** los conceptos antes de enviar: arrastrar y soltar (drag-and-drop) y/o botones subir/bajar. La evaluación **no** debe ejecutarse al cambiar el orden; solo al hacer clic en **Continuar**.
2. **Lógica de submit**: no auto-evaluar en `useEffect` ni al reordenar. Evaluar únicamente cuando el usuario pulse **Continuar**: entonces calcular si el orden es correcto, guardar resultado, reproducir sonido y llamar a `onAnswered`; después el motor puede avanzar.
3. El botón **Continuar** debe estar habilitado en pasos de orden desde el principio (para que el usuario pueda enviar cuando quiera). En `LessonEngine`, para `stepType === "order"` pasar `isContinueEnabled: true`.
4. Mostrar indicación visual de que los ítems son reordenables (cursor grab, icono ⋮⋮ o similar, botones ↑↓).
5. **Botón "Comprobar"**: Incluir un botón "Comprobar" que compruebe la respuesta sin avanzar. Si no es 100% correcta, mostrar feedback (verde/rojo por ítem) y permitir que el usuario reordene y vuelva a pulsar "Comprobar". Solo al estar correcto se considera completado y se habilita avanzar con "Continuar".

## Verdadero y Falso (True/False)

- En actividades **Verdadero y Falso**, cuando sea la **segunda o más oportunidad** (paso de repaso, `reviewSourceStepId`), incluir un botón **"Intentar de nuevo"** que reinicie la actividad: borrar selección y feedback para que el usuario pueda responder de nuevo. El componente `TrueFalseStep` recibe `isReviewStep` y muestra el botón solo en ese caso.
- **Ocultar el botón de reset cuando la respuesta es 100% correcta**: en cualquier ejercicio o actividad (Verdadero/Falso, Orden, MCQ, etc.), el botón de reinicio / "Intentar de nuevo" / "Resetear" no debe mostrarse una vez que el usuario ha respondido correctamente.

## Lesson completion slide (last slide of each lesson)

- La última diapositiva de cada lección es de tipo **summary** (ej. "Lección completada" / "Has dado el primer paso...").
- Incluir la imagen **grande** de cierre en todas las lecciones: `public/Lección completada.png`. En el componente `SummaryStep` (modo full-screen) la imagen se muestra por defecto: **debajo del título y cuerpo**, **encima de los botones de navegación** (Salir / Continuar). Tamaño: grande (p. ej. max-width 320px o 85vw). Si el paso summary tiene `imageUrl` se usa esa; si no, se usa `/Lección completada.png`.

## Lesson images (MANDATORY)

- **Image placement:** On any lesson slide, images must be placed **to the left or right of the content** (side-by-side layout), not above or below centered. Use `imageAlign: "left"` or `imageAlign: "right"` in lesson step data and ensure step components (InfoStep, TrueFalseStep, MCQStep, OrderStep, etc.) render the image in a left/right column next to the activity. **Exception:** pure flashcard slides (e.g. intro with one line + “Empezar”, or closure/summary with a single reward image) may use a centered or full-bleed image if the design calls for it.
- **No blue background** on lesson images. Do not use the blue gradient (`linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)`) or any blue box behind images in `MatchStep`, `OrderStep`, or `InfoStep`. Show the image only (transparent or neutral container).
- Image paths: prefer paths without spaces (e.g. `/uploads/lesson-1/slide1.png`). Use plain `<img>` for dynamic lesson `imageUrl` in full-screen steps if needed so all paths load reliably.
