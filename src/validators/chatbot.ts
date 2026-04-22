import { z } from 'zod'

export const chatbotMessageSchema = z.object({
  message: z.string()
    .min(1, 'Mensaje requerido')
    .max(1000, 'El mensaje es demasiado largo (máximo 1000 caracteres)'),
  conversationHistory: z.array(z.any()).optional(),
  userName: z.string().max(50).optional(),
  xp: z.number().optional(),
  level: z.number().optional(),
  currentPath: z.string().optional(),
  adnProfile: z.string().optional(),
  userContext: z.any().optional()
})

export type ChatbotMessageData = z.infer<typeof chatbotMessageSchema>
