import { z } from 'zod'

export const transferBizcoinsSchema = z.object({
  targetUserId: z.string().uuid('ID de destinatario inválido'),
  amount: z.number()
    .positive('La cantidad debe ser mayor a 0')
    .max(1000000, 'Límite de transferencia excedido (máximo 1,000,000 Bizcoins)'),
  concept: z.string()
    .max(140, 'El concepto no puede exceder los 140 caracteres')
    .optional()
    .nullable()
})

export type TransferBizcoinsData = z.infer<typeof transferBizcoinsSchema>
