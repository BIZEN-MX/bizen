"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export type Language = 'es' | 'en'
export type Theme = 'light' | 'dark' | 'auto'
export type TextSize = 'small' | 'medium' | 'large' | 'extra-large'
export type ContrastMode = 'normal' | 'high'

export interface NotificationSettings {
  push: boolean
  email: boolean
  sound: boolean
  courseUpdates: boolean
  achievements: boolean
  reminders: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private'
  activityVisibility: 'public' | 'friends' | 'private'
  showProgress: boolean
  allowMessages: boolean
}

export interface ContentPreferences {
  showSubtitles: boolean
  autoplayVideos: boolean
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  showHints: boolean
}

export interface AccessibilitySettings {
  textSize: TextSize
  contrastMode: ContrastMode
  reducedMotion: boolean
  screenReaderOptimized: boolean
  keyboardNavigation: boolean
}

export interface LinkedAccounts {
  google: boolean
  facebook: boolean
  apple: boolean
}

export interface AppSettings {
  language: Language
  theme: Theme
  soundsEnabled: boolean
  animationsEnabled: boolean
  notifications: NotificationSettings
  privacy: PrivacySettings
  contentPreferences: ContentPreferences
  accessibility: AccessibilitySettings
  linkedAccounts: LinkedAccounts
}

const defaultSettings: AppSettings = {
  language: 'es',
  theme: 'light',
  soundsEnabled: true,
  animationsEnabled: true,
  notifications: {
    push: true,
    email: true,
    sound: true,
    courseUpdates: true,
    achievements: true,
    reminders: true
  },
  privacy: {
    profileVisibility: 'public',
    activityVisibility: 'public',
    showProgress: true,
    allowMessages: true
  },
  contentPreferences: {
    showSubtitles: false,
    autoplayVideos: true,
    difficultyLevel: 'beginner',
    showHints: true
  },
  accessibility: {
    textSize: 'medium',
    contrastMode: 'normal',
    reducedMotion: false,
    screenReaderOptimized: false,
    keyboardNavigation: false
  },
  linkedAccounts: {
    google: false,
    facebook: false,
    apple: false
  }
}

interface SettingsContextType {
  settings: AppSettings
  updateSettings: (newSettings: Partial<AppSettings>) => void
  resetSettings: () => void
  applyTheme: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Provider Component

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [isInitialized, setIsInitialized] = useState(false)
  const { dbProfile } = useAuth()

  // Load settings from localStorage on mount (initial load)
  useEffect(() => {
    const savedSettings = localStorage.getItem('bizen_settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
    setIsInitialized(true)
  }, [])

  // 🔄 Sync from Database if logged in 🔄
  useEffect(() => {
    if (isInitialized && dbProfile?.settings && Object.keys(dbProfile.settings).length > 0) {
      console.log('🔄 Syncing settings from DB profile...');
      setSettings(prev => ({ ...prev, ...dbProfile.settings }));
      localStorage.setItem('bizen_settings', JSON.stringify({ ...settings, ...dbProfile.settings }));
    }
  }, [dbProfile?.settings, isInitialized])

  // Apply theme when settings change
  useEffect(() => {
    if (!isInitialized) return
    applyTheme()
  }, [settings.theme, settings.accessibility.contrastMode, isInitialized])

  // Apply text size
  useEffect(() => {
    if (!isInitialized) return
    const root = document.documentElement
    const textSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px'
    }
    root.style.fontSize = textSizeMap[settings.accessibility.textSize]
  }, [settings.accessibility.textSize, isInitialized])

  // Apply reduced motion
  useEffect(() => {
    if (!isInitialized) return
    const root = document.documentElement
    if (settings.accessibility.reducedMotion || !settings.animationsEnabled) {
      root.style.setProperty('--transition-duration', '0ms')
    } else {
      root.style.setProperty('--transition-duration', '300ms')
    }
  }, [settings.accessibility.reducedMotion, settings.animationsEnabled, isInitialized])

  const applyTheme = () => {
    const root = document.documentElement
    let theme = settings.theme

    // Handle auto theme
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme = prefersDark ? 'dark' : 'light'
    }

    // Apply theme
    root.classList.remove('light', 'dark')
    root.classList.add(theme)

    // Apply contrast mode
    if (settings.accessibility.contrastMode === 'high') {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
  }

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem('bizen_settings', JSON.stringify(updated))
      return updated
    })
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.setItem('bizen_settings', JSON.stringify(defaultSettings))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, applyTheme }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}


