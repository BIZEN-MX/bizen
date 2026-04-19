import { z } from 'zod'

export const liveAnswerSchema = z.object({
  session_id: z.string().uuid('ID de sesión inválido'),
  question_id: z.string().uuid('ID de pregunta inválido'),
  participant_id: z.string().uuid('ID de participante inválido'),
  selected_option_id: z.string().uuid('Opción seleccionada inválida').nullable().optional(),
  answer_time_ms: z.number()
    .min(0, 'El tiempo no puede ser negativo')
    .max(60000, 'El tiempo excede el límite lógico de 60 segundos')
})

export type LiveAnswerData = z.infer<typeof liveAnswerSchema>
