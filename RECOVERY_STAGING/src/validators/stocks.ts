import { z } from 'zod'

export const stockOrderSchema = z.object({
  symbol: z.string().min(1).max(10).toUpperCase(),
  side: z.enum(['buy', 'sell']),
  order_type: z.enum(['market', 'limit']),
  quantity: z.number().positive('La cantidad debe ser mayor a 0').max(1000000),
  limit_price: z.number().positive().optional().nullable()
})

export type StockOrderData = z.infer<typeof stockOrderSchema>
