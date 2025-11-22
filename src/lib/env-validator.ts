/**
 * Environment variable validation at startup
 * Call this early in your application lifecycle
 */

import { validateEnv } from './env'

/**
 * Validates environment variables and logs errors
 * Should be called at application startup
 */
export function validateEnvironmentVariables(): void {
  try {
    validateEnv()
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Environment variables validated successfully')
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Environment variable validation failed:')
    console.error(message)
    
    // In production, we might want to throw to prevent the app from starting
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Environment validation failed: ${message}`)
    }
  }
}


