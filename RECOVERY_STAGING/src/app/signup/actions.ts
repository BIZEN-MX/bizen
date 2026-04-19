"use server"

import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { signupSchema, type SignupFormData } from "@/validators/auth"

// Function to translate Supabase error messages to Spanish
function translateAuthError(errorMessage: string): string {
  const errorTranslations: Record<string, string> = {
    "Invalid login credentials": "Credenciales de inicio de sesión inválidas",
    "Email not confirmed": "Email no confirmado. Revisa tu correo y haz clic en el enlace de verificación.",
    "Too many requests": "Demasiados intentos. Espera un momento antes de intentar de nuevo.",
    "User not found": "Usuario no encontrado",
    "Invalid email": "Email inválido",
    "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres",
    "Unable to validate email address: invalid format": "No se puede validar la dirección de email: formato inválido",
    "Signup is disabled": "El registro está deshabilitado",
    "Email rate limit exceeded": "Límite de emails excedido. Intenta de nuevo más tarde.",
    "For security purposes, you can only request this once every 60 seconds": "Por seguridad, solo puedes solicitar esto una vez cada 60 segundos",
    "User already registered": "El usuario ya está registrado",
    "Signup requires a valid password": "El registro requiere una contraseña válida",
    "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres",
    "Unable to validate email address: invalid format": "No se puede validar la dirección de email: formato inválido"
  }
  
  // Check for exact matches first
  if (errorTranslations[errorMessage]) {
    return errorTranslations[errorMessage]
  }
  
  // Check for partial matches
  for (const [english, spanish] of Object.entries(errorTranslations)) {
    if (errorMessage.includes(english)) {
      return spanish
    }
  }
  
  // Default fallback
  return "Error de autenticación. Intenta de nuevo"
}

export interface SignupState {
  success: boolean
  message: string | null
  errors: Partial<Record<keyof SignupFormData, string[]>>
  loading: boolean
}

export async function signupAction(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  console.log('🔍 Signup action called')
  
  // Just return a simple success message for now
  return {
    success: true,
    message: '✅ Test: Server action is working!',
    errors: {},
    loading: false
  }
}


