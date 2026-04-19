import { z } from 'zod'

export const updateProfileSchema = z.object({
  fullName: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    // More permissive regex for names (allows dots, hyphens, and apostrophes)
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.'-]+$/, 'El nombre contiene caracteres no permitidos')
    .optional(),
  schoolId: z.string()
    .transform(v => v === "" ? null : v)
    .pipe(z.string().uuid('ID de escuela inválido').nullable())
    .optional()
    .nullable(),
  username: z.string()
    .min(3, 'El usuario es muy corto')
    .max(50, 'El usuario es muy largo')
    .regex(/^[a-zA-Z0-9_]+$/, 'El usuario solo puede tener letras, números y guiones bajos')
    .optional(),
  bio: z.string()
    .max(500, 'La biografía no puede exceder los 500 caracteres')
    .regex(/^[^<>]*$/, 'La biografía no puede contener caracteres HTML (< o >)')
    .optional(),
  phone: z.string()
    .max(20, 'Teléfono inválido')
    .regex(/^\+?[0-9\s-]*$/, 'El teléfono no tiene un formato válido')
    .optional(),
  birthDate: z.string().optional().nullable(),
  cardTheme: z.string().max(30).optional(),
  avatar: z.union([z.string(), z.record(z.any())]).optional().nullable(),
  settings: z.record(z.any()).optional(),
  role: z.string().optional()
})

export type UpdateProfileData = z.infer<typeof updateProfileSchema>
