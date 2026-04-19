// src/lib/validator.ts
import { z } from "zod";

/** Schema para completar progreso */
export const progressCompleteSchema = z.object({
  moduleId: z.string().min(1, "moduleId requerido"),
  sectionId: z.string().min(1, "sectionId requerido"),
  userId: z.string().min(1, "userId requerido"),
  completedAt: z.string().datetime().optional(), // ISO-8601 opcional
});

export type ProgressCompleteInput = z.infer<typeof progressCompleteSchema>;

/** Validador reutilizable */
export function validateProgressComplete(
  input: unknown
): { ok: true; data: ProgressCompleteInput } | { ok: false; errors: Record<string, string[]> } {
  const parsed = progressCompleteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }
  return { ok: true, data: parsed.data };
}
