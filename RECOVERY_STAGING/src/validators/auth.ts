import { z } from 'zod'

export const signupSchema = z.object({
  fullName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  
  email: z.string()
    .email('Debe ser un email válido')
    .min(1, 'El email es requerido'),
  
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres'),
    // Optional: Add stronger validation if needed
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),
  
  accepted: z.boolean()
    .refine(val => val === true, 'Debes aceptar los términos y condiciones')
})

export const loginSchema = z.object({
  email: z.string()
    .email('Debe ser un email válido')
    .min(1, 'El email es requerido'),
  
  password: z.string()
    .min(1, 'La contraseña es requerida'),
  
  remember: z.boolean().optional()
})

export const resetPasswordSchema = z.object({
  email: z.string()
    .email('Debe ser un email válido')
    .min(1, 'El email es requerido')
})

export type SignupFormData = z.infer<typeof signupSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>