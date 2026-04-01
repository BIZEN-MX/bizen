import { z } from 'zod'

export const updateProfileSchema = z.object({
  fullName: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .optional(),
  schoolId: z.string().uuid('ID de escuela inválido').optional().nullable(),
  username: z.string()
    .min(3, 'El usuario es muy corto')
    .max(20, 'El usuario es muy largo')
    .regex(/^[a-zA-Z0-9_]+$/, 'El usuario solo puede tener letras, números y guiones bajos')
    .optional(),
  bio: z.string().max(200, 'La biografía no puede exceder los 200 caracteres').optional(),
  phone: z.string()
    .max(20, 'Teléfono inválido')
    .regex(/^\+?[0-9\s-]*$/, 'El teléfono no tiene un formato válido')
    .optional(),
  birthDate: z.string().datetime().optional().nullable(),
  cardTheme: z.string().max(30).optional(),
  avatar: z.string().url('URL de avatar inválida').optional().nullable(),
  settings: z.record(z.any()).optional(),
  role: z.string().optional()
})

export type UpdateProfileData = z.infer<typeof updateProfileSchema>
