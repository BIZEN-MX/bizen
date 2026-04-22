'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/nextjs'

interface AuthContextType {
  user: any | null
  session: any | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: any | null }>
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signInWithGoogle: () => Promise<{ error: any | null }>
  signInWithApple: () => Promise<{ error: any | null }>
  signOut: () => Promise<{ error: any | null }>
  resetPassword: (email: string) => Promise<{ error: any | null }>
  updatePassword: (newPassword: string) => Promise<{ error: any | null }>
  dbProfile: any | null
  setDbProfile: React.Dispatch<React.SetStateAction<any | null>>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: userLoaded } = useUser()
  const { sessionId, isLoaded: authLoaded } = useClerkAuth()
  const { signOut: clerkSignOut } = useClerk()
  
  const [dbProfile, setDbProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  // Sync loading state
  useEffect(() => {
    if (userLoaded && authLoaded) {
      setLoading(false)
    }

    // Production & Dev Bypass: Don't wait forever for Clerk
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        setLoading(false)
      }, 2000) // Give it 2s then force entry
      return () => clearTimeout(timer)
    }
  }, [userLoaded, authLoaded])

  // Map Clerk user to Supabase-compatible format for existing components
  const user = React.useMemo(() => {
    // If we have a real clerk user, use it
    if (clerkUser) {
      return {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        user_metadata: {
          full_name: clerkUser.fullName || '',
          first_name: clerkUser.firstName || '',
          last_name: clerkUser.lastName || '',
          avatar_url: clerkUser.imageUrl || ''
        }
      }
    }

    return null
  }, [clerkUser])

  const signUp = async (email: string, password: string) => {
    // Redirecting to clerk signup is handled by components now
    return { error: { message: "Redirect to /signup" } as any }
  }

  const signIn = async (email: string, password: string) => {
    // Redirecting to clerk login is handled by components now
    return { error: { message: "Redirect to /login" } as any }
  }

  const signInWithGoogle = async () => {
    return { error: null }
  }

  const signInWithApple = async () => {
    return { error: null }
  }

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bizen_diagnostic_quiz_v1')
      localStorage.removeItem('bizen_has_access')
    }
    setDbProfile(null)
    await clerkSignOut()
    return { error: null }
  }

  const resetPassword = async (email: string) => {
    return { error: null }
  }

  const updatePassword = async (newPassword: string) => {
    return { error: null }
  }

  const fetchDbProfile = async () => {
    try {
      const res = await fetch(`/api/profiles?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      })
      
      if (res.status === 401) {
        setDbProfile(null)
        return
      }

      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json()
        setDbProfile(data)
      } else {
        console.warn('[AuthContext] Expected JSON but got something else or error code:', res.status)
        setDbProfile(null)
      }
    } catch (err) {
      console.error('Error fetching DB profile:', err)
      setDbProfile(null)
    }
  }

  useEffect(() => {
    if (clerkUser) {
      fetchDbProfile()
    } else if (userLoaded) {
      setDbProfile(null)
    }
  }, [clerkUser, userLoaded])

  useEffect(() => {
    if (user?.email) {
      const email = user.email.toLowerCase()
      if (email.endsWith('@anahuac.mx') || email.includes('.anahuac.mx') || email.endsWith('@bizen.mx')) {
        document.documentElement.classList.add('theme-anahuac')
      } else {
        document.documentElement.classList.remove('theme-anahuac')
      }
    } else {
      document.documentElement.classList.remove('theme-anahuac')
    }
  }, [user])

  const refreshUser = async () => {
    if (clerkUser) {
      await fetchDbProfile()
    }
  }

  const value = {
    user,
    session: sessionId ? { id: sessionId } : null,
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
