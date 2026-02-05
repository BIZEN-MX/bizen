# Cursor rules

Project-specific instructions for Cursor when editing this codebase.

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
