# Guía de contenido para lecciones estilo Duolingo (BIZEN)

## Cómo está armado hoy

- **Una lección** = lista de **pasos** (steps) en orden.
- Cada paso tiene un **tipo** (`stepType`) y datos según ese tipo.
- Los datos viven en `src/data/lessons/lesson1.ts` (y futuros `lesson2.ts`, etc.).
- La ruta interactiva es: `/learn/course-1/unit-1/l1-1/interactive` y el **ID de lección** (`l1-1`, `l1-2`, …) decide qué archivo de datos se usa.
- El **LessonEngine** ya implementa: barra de progreso, navegación paso a paso, feedback correcto/incorrecto, y opción de “revisar” pasos fallidos.

---

## Principios estilo Duolingo para el contenido

1. **Bocados cortos**  
   Pocas frases por pantalla. Un concepto (o medio concepto) por paso.

2. **Enseñar → practicar → evaluar**  
   - 1–2 pasos **info** (explicación).  
   - Luego **preguntas** (mcq, order, match, fill_blanks, true_false, multi_select, image_choice).  
   - Alternar explicación y práctica, no poner toda la teoría al inicio.

3. **Variar el tipo de pregunta**  
   No seguir con 10 mcq seguidos. Mezclar: mcq, ordenar, relacionar, completar, verdadero/falso, multi_select, elegir imagen.

4. **Feedback claro**  
   En opciones de preguntas usa `explanation` para decir por qué algo es correcto o incorrecto (el engine ya lo muestra).

5. **Cerrar con resumen**  
   Un paso final `summary` con “Lo que aprendí hoy” en 2–4 frases.

6. **Idioma y tono**  
   Todo en español, tono cercano y claro (como en lesson1).

---

## Tipos de paso que puedes usar

| Tipo            | Uso típico                          | Campos clave |
|-----------------|-------------------------------------|--------------|
| `info`          | Explicación, definición, mini historia | `title`, `body`, opcional `imageUrl` |
| `mcq`           | Pregunta de una respuesta correcta  | `question`, `options[]` (cada una: `id`, `label`, `isCorrect`, `explanation?`) |
| `multi_select`  | “Selecciona todas las que apliquen” | `question`, `options[]` (varias pueden ser `isCorrect: true`) |
| `true_false`    | Afirmación verdadero/falso          | `statement`, `correctValue` (true/false), `explanation?` |
| `order`         | Ordenar elementos (ej. evolución)  | `question?`, `items[]` (`id`, `label`, `correctOrder`) |
| `match`         | Relacionar conceptos con definiciones | `leftItems`, `rightItems`, `correctPairs` |
| `fill_blanks`   | Completar huecos en una frase       | `textParts` (texto + blanks), `options` para cada hueco |
| `image_choice`  | Elegir la imagen correcta           | `question`, `imageOptions[]`, `correctImageId` |
| `summary`       | Cierre “Lo que aprendí”             | `title`, `body` |

Todos los pasos pueden llevar `id`, `title?`, `description?`, `isAssessment?`, `recordIncorrect?` según necesites.

---

## Flujo de trabajo para llenar lecciones

### 1. Definir lección en el curso

En `src/app/courses/page.tsx`, el curso ya tiene un array de lecciones con `unitTitle` y `title`. El **ID** se genera así: `l{order}-{índice}` (ej. curso 1 → `l1-1`, `l1-2`, …).  
Eso ya está; solo asegúrate de que el `title` coincida con el contenido que vas a escribir.

### 2. Crear el archivo de datos de la lección

- **Ubicación:** `src/data/lessons/lessonN.ts` (ej. `lesson2.ts`, `lesson3.ts`).
- **Export:** un array llamado `lessonNSteps: LessonStep[]`.
- **Contenido:** lista de pasos en el orden en que quieres que aparezcan.

### 3. Conectar lección ID ↔ datos (registry)

En **`src/data/lessons/registry.ts`**:

- Importa los steps de tu nuevo archivo: `import { lesson2Steps } from "./lesson2"`.
- Añade una entrada: `"l1-2": lesson2Steps`.

La página interactiva usa `getStepsForLesson(lessonId)` y ya no necesita un `switch`; solo hay que mantener el registry al día cuando agregues lecciones.

### 4. Esquema sugerido por lección (Duolingo-style)

- **1–2 pasos `info`**  
  Tema y contexto (ej. “¿Qué es el dinero?”).
- **Bloque 1: concepto A**  
  - 1 `info` corto.  
  - 1–2 preguntas (mcq, true_false, order, etc.).
- **Bloque 2: concepto B**  
  - 1 `info` corto.  
  - 1–2 preguntas de otro tipo.
- **Bloque 3 (opcional): concepto C o integración**  
  - 1 `info` si hace falta.  
  - 1–2 preguntas (match, fill_blanks, multi_select, etc.).
- **1 paso `summary`**  
  “Lo que aprendí hoy” en 2–4 frases.

Ajusta número de bloques y preguntas según la longitud que quieras (5–15 pasos por lección suele ser manejable).

---

## Plantilla mínima por lección (TypeScript)

Copia esto en un nuevo archivo `lesson2.ts` (o el que toque) y sustituye por tu contenido:

```ts
import { LessonStep } from "@/types/lessonTypes"

/**
 * Course 1 - Lesson 2: "¿Cómo gana valor?"
 * [Descripción breve del objetivo de la lección]
 */
export const lesson2Steps: LessonStep[] = [
  {
    id: "s1_intro",
    stepType: "info",
    title: "Título del primer paso",
    body: "Una o dos frases. Concepto claro y corto.",
    description: "Opcional, para accesibilidad",
    isAssessment: false,
  },
  {
    id: "s2_mcq_1",
    stepType: "mcq",
    isAssessment: true,
    title: "Título de la pregunta",
    question: "¿Pregunta?",
    options: [
      { id: "o1", label: "Opción correcta", isCorrect: true, explanation: "Por qué es correcta." },
      { id: "o2", label: "Opción incorrecta", isCorrect: false, explanation: "Por qué no." },
      { id: "o3", label: "Otra incorrecta", isCorrect: false, explanation: "Breve explicación." },
    ],
    recordIncorrect: true,
  },
  // Añade más pasos: info, mcq, order, match, fill_blanks, true_false, multi_select, image_choice...
  {
    id: "sN_summary",
    stepType: "summary",
    isAssessment: false,
    title: "Lo que aprendí hoy",
    body: "Dos o tres frases que resuman la lección.",
  },
]
```

Luego en **`src/data/lessons/registry.ts`** añade el import y la entrada:

```ts
import { lesson2Steps } from "./lesson2"
// ...
"l1-2": lesson2Steps,
```

---

## Cómo trabajar lección a lección

1. **Elegir la lección** (ej. “¿Cómo gana valor?” → `l1-2`).
2. **Definir 3–5 ideas clave** que quieras que el alumno se lleve.
3. **Escribir en papel o doc** un guion corto:  
   - 2–3 frases de explicación por idea.  
   - 1–2 preguntas por idea (elegir tipo: mcq, ordenar, relacionar, etc.).
4. **Traducir a pasos** en `lessonN.ts`:  
   - Cada frase/explicación → paso `info`.  
   - Cada pregunta → paso `mcq`, `order`, `match`, etc., con `options`/`items` y `explanation` donde aplique.
5. **Añadir** el `case "l1-N"` y el import en la página interactiva.
6. **Probar** en `/learn/course-1/unit-1/l1-N/interactive`.

Si quieres, en el siguiente paso podemos bajar esto a **una lección concreta** (por ejemplo “¿Cómo gana valor?”) y te escribo el `lesson2.ts` completo como ejemplo listo para copiar y ajustar.
