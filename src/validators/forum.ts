import { z } from 'zod'

export const forumThreadSchema = z.object({
  title: z.string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede exceder los 100 caracteres'),
  body: z.string()
    .min(10, 'El contenido debe tener al menos 10 caracteres')
    .max(1000, 'El contenido del tema no puede exceder los 1,000 caracteres'),
  topicId: z.string().uuid('ID de tema inválido'),
  tagSlugs: z.array(z.string()).optional()
})

export const forumCommentSchema = z.object({
  threadId: z.string().uuid('ID de tema inválido'),
  parentCommentId: z.string().uuid('ID de comentario padre inválido').optional().nullable(),
  body: z.string()
    .min(2, 'El comentario es demasiado corto')
    .max(250, 'El comentario no puede exceder los 250 caracteres')
})

export type ForumThreadData = z.infer<typeof forumThreadSchema>
export type ForumCommentData = z.infer<typeof forumCommentSchema>
