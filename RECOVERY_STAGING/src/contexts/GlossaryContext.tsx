"use client"

import React, { createContext, useContext, ReactNode } from "react"

interface GlossaryContextType {
  terms: { word: string; definition: string }[]
}

const GlossaryContext = createContext<GlossaryContextType | undefined>(undefined)

export function GlossaryProvider({ terms, children }: { terms: { word: string; definition: string }[], children: ReactNode }) {
  return (
    <GlossaryContext.Provider value={{ terms }}>
      {children}
    </GlossaryContext.Provider>
  )
}

export function useGlossary() {
  const context = useContext(GlossaryContext)
  return context?.terms || []
}
