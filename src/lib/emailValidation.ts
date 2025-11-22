/**
 * Email validation utilities for BIZEN
 * BIZEN accepts any valid email address
 */

/**
 * Check if an email is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if an email is allowed to access BIZEN app
 * BIZEN accepts any valid email address
 */
export function canAccessBIZEN(email: string): boolean {
  return isValidEmail(email);
}

// Legacy functions kept for backward compatibility (deprecated)
// These can be removed if not used elsewhere

/**
 * @deprecated Use canAccessBIZEN instead
 * Check if an email belongs to Mondragon University
 */
export function isMondragonEmail(email: string): boolean {
  if (!email) return false;
  const emailLower = email.toLowerCase();
  return emailLower.endsWith("@mondragonmexico.edu.mx") || 
         emailLower.endsWith("@mondragon.edu.mx");
}

/**
 * @deprecated Microcredential app is no longer supported
 * Check if an email is allowed to access Microcredential app
 */
export function canAccessMicrocredential(email: string): boolean {
  return isMondragonEmail(email);
}

/**
 * @deprecated Use canAccessBIZEN instead
 * Get the allowed apps for an email
 */
export function getAllowedApps(email: string): {
  microcredential: boolean;
  bizen: boolean;
} {
  return {
    microcredential: false, // Microcredential app no longer supported
    bizen: canAccessBIZEN(email),
  };
}

/**
 * @deprecated Use canAccessBIZEN instead
 * Get user type based on email
 */
export function getUserType(email: string): "mondragon" | "public" {
  return isMondragonEmail(email) ? "mondragon" : "public";
}

