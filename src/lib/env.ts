import { z } from 'zod'

/**
 * Environment variable validation schema
 * Validates all required environment variables at startup
 */
const envSchema = z.object({
  // Supabase Configuration (BIZEN or fallback to generic)
  NEXT_PUBLIC_SUPABASE_URL_BIZEN: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  
  // Database Configuration
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  
  // Site Configuration
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  
  // Email Service (Optional)
  RESEND_API_KEY: z.string().optional(),
  
  // OpenAI (Optional)
  OPENAI_API_KEY: z.string().optional(),
  
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

type EnvSchema = z.infer<typeof envSchema>

/**
 * Validates environment variables and returns typed env object
 * Throws error if required variables are missing
 */
export function validateEnv(): EnvSchema {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL_BIZEN: process.env.NEXT_PUBLIC_SUPABASE_URL_BIZEN,
    NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NODE_ENV: process.env.NODE_ENV || 'development',
  }

  // Check for at least one Supabase configuration
  const hasBizenConfig = env.NEXT_PUBLIC_SUPABASE_URL_BIZEN && env.NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN
  const hasGenericConfig = env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!hasBizenConfig && !hasGenericConfig) {
    throw new Error(
      'Missing Supabase configuration. Please set either:\n' +
      '  - NEXT_PUBLIC_SUPABASE_URL_BIZEN and NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN, or\n' +
      '  - NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  // Validate the rest
  const result = envSchema.safeParse(env)
  
  if (!result.success) {
    const errors = result.error.errors.map(err => 
      `  - ${err.path.join('.')}: ${err.message}`
    ).join('\n')
    
    throw new Error(
      `Invalid environment variables:\n${errors}\n\n` +
      'Please check your .env.local file or deployment environment variables.'
    )
  }

  return result.data
}

/**
 * Get validated environment variables
 * Use this instead of process.env directly
 */
let validatedEnv: EnvSchema | null = null

export function getEnv(): EnvSchema {
  if (!validatedEnv) {
    validatedEnv = validateEnv()
  }
  return validatedEnv
}

/**
 * Get Supabase configuration (BIZEN preferred, fallback to generic)
 */
export function getSupabaseConfig() {
  const env = getEnv()
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL_BIZEN || env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN || env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  }
}


