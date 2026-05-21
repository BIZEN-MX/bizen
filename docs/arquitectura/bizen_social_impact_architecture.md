# Arquitectura de Impacto Social y ESG (ÉPICA 8)

Este documento proyecta el motor de Responsabilidad Social de BIZEN (Fase 2). Este módulo convierte la plataforma en un ecosistema B2B2C donde el esfuerzo intelectual del estudiante (XP/Cursos) se traduce en donaciones reales de las universidades a causas benéficas.

---

## 1. Mapeo de Objetivos Institucionales
Las universidades no solo compran BIZEN por pedagogía, sino para cumplir sus métricas ESG (Environmental, Social, and Governance).

### 1.1 Modelo `SchoolCycleGoal`
Se define una meta macro a nivel institución.
*   *Ejemplo:* "Si los alumnos de la Anáhuac logran acumular 10 Millones de XP como comunidad antes de Diciembre, la Universidad donará 50 becas alimenticias".
*   **El Trigger:** Cronjobs semanales leen la suma de `Profile.xp` con un `INNER JOIN` a `School` y evalúan el porcentaje de compleción de la meta. Este porcentaje se muestra en un termómetro gigante en el Dashboard principal de los estudiantes.

---

## 2. Auditoría y Transparencia
Para evitar que las donaciones sean promesas vacías, la base de datos modela la ruta del dinero.

### 2.1 Modelos de Trazabilidad
*   **`Foundation`:** Perfil público de las ONGs asociadas (ej. "Save The Children"). Contiene meta, descripción y logo.
*   **`SchoolImpact`:** Relaciona a una universidad (`School`) con una `Foundation`, indicando cuánto dinero o especie se ha comprometido.
*   **`DonationEvidence`:** La clave del sistema anti-fraude. Para que un `SchoolCycleGoal` se marque como `COMPLETED`, el School Admin debe subir recibos fiscales, fotografías o facturas. Este registro se vuelve público para los estudiantes, cerrando el ciclo de confianza.

---

## 3. Integración UI: El Dashboard de Impacto
Los estudiantes de Fase 2 tendrán una pestaña dedicada ("Mi Impacto") que muestra un grafo de trazabilidad:
`[Tus 5,000 XP] -> [1% de la meta Anáhuac] -> [Construcción de 1 Aula] -> [Ver Fotos de Evidencia]`

Técnicamente, esto se resuelve con un pipeline de agregación en Prisma que calcula el "peso relativo" del XP del alumno frente a la suma total del `SchoolImpact`.
