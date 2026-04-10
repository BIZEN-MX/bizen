'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/nextjs'

interface AuthContextBizenType {
  user: any | null
  session: any | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: any | null }>
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signOut: () => Promise<{ error: any | null }>
  resetPassword: (email: string) => Promise<{ error: any | null }>
  updatePassword: (newPassword: string) => Promise<{ error: any | null }>
}

const AuthContextBizen = createContext<AuthContextBizenType | undefined>(undefined)

export function AuthProviderBizen({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: userLoaded } = useUser()
  const { sessionId, isLoaded: authLoaded } = useClerkAuth()
  const { signOut: clerkSignOut } = useClerk()
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userLoaded && authLoaded) {
      setLoading(false)
    }
  }, [userLoaded, authLoaded])

  const user = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    user_metadata: {
      full_name: clerkUser.fullName || '',
      avatar_url: clerkUser.imageUrl || ''
    }
  } : null

  const signUp = async (email: string, password: string) => {
    return { error: { message: "Redirect to /signup" } as any }
  }

  const signIn = async (email: string, password: string) => {
    return { error: { message: "Redirect to /login" } as any }
  }

  const signOut = async () => {
    await clerkSignOut()
    return { error: null }
  }

  const resetPassword = async (email: string) => {
    return { error: null }
  }

  const updatePassword = async (newPassword: string) => {
    return { error: null }
  }

  const value = {
    user,
    session: sessionId ? { id: sessionId } : null,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  }

  return (
    <AuthContextBizen.Provider value={value}>
      {children}
    </AuthContextBizen.Provider>
  )
}

export function useAuthBizen() {
  const context = useContext(AuthContextBizen)
  if (context === undefined) {
    throw new Error('useAuthBizen must be used within an AuthProviderBizen')
  }
  return context
}

