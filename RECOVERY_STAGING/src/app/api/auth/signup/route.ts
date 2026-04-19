import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  // Create a response object to collect cookies
  const response = new NextResponse()

  try {
    console.log('🔍 API route signup called')
    console.log('🔍 Request method:', request.method)
    console.log('🔍 Content-Type:', request.headers.get('content-type'))

    const formData = await request.formData()

    // Debug: Log all form data entries
    console.log('🔍 FormData entries:')
    for (const [key, value] of formData.entries()) {
      console.log(`   ${key}:`, key === 'password' ? '[HIDDEN]' : value)
    }

    const rawData = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      accepted: formData.get('accepted') === 'on',
      appSource: formData.get('appSource') as string || 'bizen', // Default to bizen
      recaptchaToken: formData.get('recaptchaToken') as string || ''
    }

    console.log('📝 Parsed form data:', {
      fullName: rawData.fullName || '(empty)',
      email: rawData.email || '(empty)',
      passwordLength: rawData.password?.length || 0,
      accepted: rawData.accepted,
      appSource: rawData.appSource
    })

    // Detailed validation with specific field errors
    const missingFields = []
    if (!rawData.fullName || rawData.fullName.trim() === '') missingFields.push('fullName')
    if (!rawData.email || rawData.email.trim() === '') missingFields.push('email')
    if (!rawData.password || rawData.password.trim() === '') missingFields.push('password')
    if (!rawData.accepted) missingFields.push('accepted')

    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields)
      return NextResponse.json({
        success: false,
        message: 'Por favor completa todos los campos requeridos',
        errors: {
          ...missingFields.reduce((acc, field) => {
            acc[field] = [`El campo ${field} es requerido`]
            return acc
          }, {} as Record<string, string[]>)
        }
      }, { status: 400 })
    }


    // BIZEN-only project - use standard Supabase env vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_BIZEN || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Validate environment variables exist
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables:', {
        hasUrlGeneric: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKeyGeneric: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasUrlBizen: !!process.env.NEXT_PUBLIC_SUPABASE_URL_BIZEN,
        hasKeyBizen: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN
      })
      return NextResponse.json({
        success: false,
        message: 'Error de configuración: faltan las claves de Supabase. Verifica NEXT_PUBLIC_SUPABASE_URL(_BIZEN) y NEXT_PUBLIC_SUPABASE_ANON_KEY(_BIZEN) en las variables de entorno.',
        errors: {}
      }, { status: 500 })
    }

    console.log('✅ Supabase keys found:', {
      urlSet: !!supabaseUrl,
      keySet: !!supabaseKey,
      urlPreview: supabaseUrl.substring(0, 40) + '...'
    })

    // Validate reCAPTCHA if token is provided
    if (rawData.recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
      const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: rawData.recaptchaToken
        })
      })

      const recaptchaResult = await recaptchaResponse.json()

      if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
        console.warn('⚠️ reCAPTCHA verification failed:', recaptchaResult)
        return NextResponse.json({
          success: false,
          message: 'Verificación de seguridad falló. Por favor intenta de nuevo.',
          errors: {}
        })
      }
    }

    // BIZEN allows all emails (no domain restriction)
    // Can be overridden with ALLOW_ALL_EMAILS if needed

    console.log('🔧 Creating Supabase client for BIZEN')
    console.log('🔧 Supabase URL:', supabaseUrl.substring(0, 30) + '...')
    console.log('🔧 Supabase Key (first 30):', supabaseKey.substring(0, 30))
    console.log('🔧 Supabase Key (last 20):', supabaseKey.substring(supabaseKey.length - 20))
    console.log('🔧 Key length:', supabaseKey.length)
    console.log('🔧 Key from process.env directly:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30) || 'NOT IN PROCESS.ENV')

    // Get cookie store (same pattern as auth callback route)
    const cookieStore = await cookies()

    // Create Supabase server client with cookie handling (EXACT same pattern as auth callback)
    let supabase
    try {
      supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // The `setAll` method was called from a route handler.
              // This can be ignored if you have middleware refreshing user sessions.
            }
          },
        },
      })
      console.log('✅ Supabase client created successfully')
    } catch (clientError) {
      console.error('❌ Failed to create Supabase client:', clientError)
      throw new Error(`Failed to initialize authentication service: ${clientError instanceof Error ? clientError.message : 'Unknown error'}`)
    }

    // Get origin from environment or use current request origin in development
    const origin = process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.NODE_ENV === 'development'
        ? (request.headers.get('origin') || request.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'http://localhost:3000')
        : 'https://bizen.mx')
    console.log('🌐 Origin:', origin)

    console.log('📤 Calling Supabase signUp...')
    console.log('📤 Using URL:', supabaseUrl)
    console.log('📤 Key length:', supabaseKey.length)
    console.log('📤 Key starts with:', supabaseKey.substring(0, 20))

    // BIZEN callback URL
    const callbackPath = '/bizen/auth/callback'
    const redirectUrl = `${origin}${callbackPath}`
    console.log('📤 Redirect URL:', redirectUrl)

    // Create user account (this creates the account immediately, but email_confirmed_at is NULL)
    // The user CANNOT log in until they click the verification email
    // This prevents someone else from using their email if they confirm it first
    const { data, error } = await supabase.auth.signUp({
      email: rawData.email,
      password: rawData.password,
      options: {
        emailRedirectTo: `${origin}${callbackPath}`,
        data: {
          full_name: rawData.fullName,
          app_source: rawData.appSource
        }
      }
    })

    console.log('📥 Supabase response:', {
      hasData: !!data,
      hasError: !!error,
      errorMessage: error?.message,
      hasSession: !!data?.session,
      hasUser: !!data?.user
    })

    if (error) {
      console.error('Signup error:', error)
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        code: error.status
      })

      // Handle specific error cases
      let errorMessage = 'Error de autenticación. Intenta de nuevo'

      if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
        errorMessage = 'Error de configuración: La API key de Supabase es inválida. Verifica que las claves en .env.local coincidan con tu proyecto Supabase.'
        console.error('❌ CRITICAL: Invalid Supabase API key detected!')
      } else if (error.message.includes('User already registered') || error.message.includes('user_already_exists')) {
        errorMessage = 'Este correo ya está registrado. Si ya tienes una cuenta, ve a la página de inicio de sesión.'
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'El formato del correo no es válido'
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres'
      } else if (error.message.includes('Email rate limit exceeded')) {
        errorMessage = 'Demasiados intentos. Espera un momento antes de intentar de nuevo'
      }

      return NextResponse.json({
        success: false,
        message: errorMessage,
        errors: {},
        // Include original error in development for debugging
        ...(process.env.NODE_ENV === 'development' ? {
          originalError: error.message,
          errorCode: error.status
        } : {})
      }, { status: 400, headers: response.headers })
    }

    // --- BIZEN: AUTO-PROFILE CREATION ---
    if (data?.user) {
      try {
        console.log('👤 Creating profile for user:', data.user.id)

        // Check if profile already exists to avoid duplicate errors
        const existingProfile = await prisma.profile.findUnique({
          where: { userId: data.user.id }
        })

        if (!existingProfile) {
          const emailForRole = rawData.email.toLowerCase()
          const isInstitutional = emailForRole.endsWith('.edu') || emailForRole.includes('.edu.')
          const role = isInstitutional ? 'student' : 'particular'

          await prisma.profile.create({
            data: {
              userId: data.user.id,
              fullName: rawData.fullName,
              role: role,
              xp: 0,
              level: 1
            }
          })
          console.log(`✅ Profile created successfully with role: ${role}`)
        } else {
          console.log('ℹ️ Profile already exists for user')
        }
      } catch (profileError) {
        // We log but don't fail the signup if profile creation fails
        // In a real app, you might want to retry or alert admins
        console.error('❌ Failed to create user profile:', profileError)
      }
    }
    // ------------------------------------

    // Check if user was created and has a session (auto-login scenario)
    if (data?.session && data?.user) {
      console.log('✅ User signed up and session created - auto-login successful')
      // Session cookies are automatically set by the server client
      return NextResponse.json({
        success: true,
        message: '✅ ¡Cuenta creada exitosamente! Redirigiendo...',
        redirect: '/dashboard'
      }, { headers: response.headers })
    }

    const needsConfirmation = data?.user && !data?.user?.email_confirmed_at && data?.user?.identities?.length === 0

    if (needsConfirmation) {
      return NextResponse.json({
        success: true,
        message: '✅ Cuenta creada. Te enviamos un correo de verificación.\n\n📧 Revisa tu bandeja de entrada y carpeta de spam.\n\n⚠️ Si no recibes el correo en 5 minutos, usa "Reenviar verificación".',
        errors: {}
      }, { headers: response.headers })
    } else if (data?.user?.email_confirmed_at) {
      return NextResponse.json({
        success: true,
        message: '✅ ¡Cuenta creada exitosamente! Puedes iniciar sesión ahora.',
        errors: {}
      }, { headers: response.headers })
    } else {
      return NextResponse.json({
        success: true,
        message: '✅ Cuenta creada. Verifica tu correo para continuar.',
        errors: {}
      }, { headers: response.headers })
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
    const errorStack = err instanceof Error ? err.stack : undefined

    console.error('❌ Signup exception:', {
      message: errorMessage,
      stack: errorStack,
      type: typeof err,
      error: err
    })

    // Return proper error response with cookie headers
    const errorDetails = process.env.NODE_ENV === 'development'
      ? { error: errorMessage, stack: errorStack }
      : {}

    return NextResponse.json({
      success: false,
      message: 'Error de autenticación. Intenta de nuevo. Si el problema persiste, contacta al administrador.',
      errors: {},
      ...errorDetails
    }, {
      status: 500,
      headers: response.headers
    })
  }
}
