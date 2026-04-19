// Content filtering and safety utilities for forum

const BLOCKED_WORDS = [
  'spam',
  'scam',
  'hack',
  // Add more as needed
]

const BLOCKED_URLS = [
  'instagram.com',
  'facebook.com',
  'tiktok.com',
  'twitter.com',
  'snapchat.com'
]

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g
const URL_REGEX = /(https?:\/\/[^\s]+)/g

export interface FilterResult {
  isBlocked: boolean
  reason?: string
  warnings: string[]
  filteredContent: string
}

export function filterContent(
  content: string, 
  userReputation: number
): FilterResult {
  const warnings: string[] = []
  let isBlocked = false
  let reason: string | undefined

  // Check for blocked words
  const lowerContent = content.toLowerCase()
  for (const word of BLOCKED_WORDS) {
    if (lowerContent.includes(word)) {
      isBlocked = true
      reason = `Contenido bloqueado: palabra prohibida detectada`
      break
    }
  }

  // Check for email addresses
  if (EMAIL_REGEX.test(content)) {
    isBlocked = true
    reason = 'No compartas información personal (correos electrónicos)'
  }

  // Check for phone numbers
  if (PHONE_REGEX.test(content)) {
    isBlocked = true
    reason = 'No compartas información personal (números de teléfono)'
  }

  // Check for social media URLs (reputation-based)
  if (userReputation < 20) {
    const urls = content.match(URL_REGEX) || []
    for (const url of urls) {
      const urlLower = url.toLowerCase()
      for (const blockedUrl of BLOCKED_URLS) {
        if (urlLower.includes(blockedUrl)) {
          isBlocked = true
          reason = `Necesitas 20 puntos de reputación para compartir enlaces de redes sociales (tienes ${userReputation})`
          break
        }
      }
      if (isBlocked) break
    }
  }

  // Sanitize HTML (remove all tags)
  let filteredContent = content.replace(/<[^>]*>/g, '')

  // Escape dangerous characters
  filteredContent = filteredContent
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')

  return {
    isBlocked,
    reason,
    warnings,
    filteredContent
  }
}

export function sanitizeMarkdown(markdown: string): string {
  // Remove HTML tags
  let sanitized = markdown.replace(/<[^>]*>/g, '')
  
  // Allow markdown formatting but escape HTML
  sanitized = sanitized
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  return sanitized
}

export function detectMentions(content: string): string[] {
  const mentionRegex = /@(\w+)/g
  const mentions: string[] = []
  let match

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1])
  }

  return mentions
}

