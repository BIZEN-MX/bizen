'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signInWithApple: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>
  dbProfile: any | null
  setDbProfile: React.Dispatch<React.SetStateAction<any | null>>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [dbProfile, setDbProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session (catch network errors e.g. Capacitor/offline so app can run as guest)
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (e) {
        // Failed to fetch / network error: treat as signed out so app still works (guest mode)
        setSession(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setSession(session)
          setUser(session?.user ?? null)
        } catch {
          setSession(null)
          setUser(null)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signUp = async (email: string, password: string) => {
    // Add small delay to prevent rate limiting during development
    await new Promise(resolve => setTimeout(resolve, 1000))

    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`
      }
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { error }
  }

  const signInWithGoogle = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`
      }
    })
    return { error }
  }

  const signInWithApple = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${origin}/auth/callback`
      }
    })
    return { error }
  }

  const signOut = async () => {
    // Clear BIZEN local storage to prevent zombie data leaks between users
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bizen_diagnostic_quiz_v1')
      localStorage.removeItem('bizen_has_access')
    }
    setDbProfile(null)
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?type=recovery`
    })
    return { error }
  }

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { error }
  }

  const fetchDbProfile = async () => {
    try {
      // Add no-cache headers and timestamp to ensure we get the latest data from DB
      const res = await fetch(`/api/profiles?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      })
      if (res.status === 401) {
        console.warn('Unauthorized session detected. Clearing storage...')
        setDbProfile(null)
        setUser(null)
        setSession(null)
        
        // Clear BIZEN specific local storage to prevent "zombie" data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('bizen_diagnostic_quiz_v1')
          localStorage.removeItem('supabase.auth.token') // Common supabase key
        }

        // Force logout to break the loop
        supabase.auth.signOut().then(() => {
          // If we are on a protected route, redirect to login
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
             window.location.href = '/login?error=session_expired'
          }
        })
        return
      }

      if (res.ok) {
        const data = await res.json()
        setDbProfile(data)
      } else {
        setDbProfile(null)
      }
    } catch (err) {
      console.error('Error fetching DB profile:', err)
      setDbProfile(null)
    }
  }

  useEffect(() => {
    if (user) {
      fetchDbProfile()
    } else {
      setDbProfile(null)
    }
  }, [user])

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchDbProfile()
      }
    } catch {
      setSession(null)
      setUser(null)
      setDbProfile(null)
    }
  }

  const value = {
    user,
    session,
    dbProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
    resetPassword,
    updatePassword,
    refreshUser,
    setDbProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
