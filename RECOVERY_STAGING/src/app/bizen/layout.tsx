'use client'

import { AuthProviderBizen } from '@/contexts/AuthContextBizen'

export default function BIZENLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviderBizen>
      {children}
    </AuthProviderBizen>
  )
}

