/**
 * Financial Simulators - Formatting Utilities
 * Currency, percentage, and number formatting for Mexico locale
 */

/**
 * Format number as Mexican Pesos
 * @param n - Number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string like "$12,345.67 MXN"
 */
export function currencyMXN(n: number, decimals: number = 2): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/**
 * Format number as percentage
 * @param n - Number to format (e.g., 8.5 for 8.5%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string like "8.50%"
 */
export function pct(n: number, decimals: number = 2): string {
  return `${n.toFixed(decimals)}%`;
}

/**
 * Format number with thousands separator
 * @param n - Number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string like "12,345"
 */
export function formatNumber(n: number, decimals: number = 0): string {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/**
 * Clamp a number between min and max
 * @param n - Number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped number
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

/**
 * Round to specified decimal places
 * @param n - Number to round
 * @param decimals - Decimal places (default: 2)
 * @returns Rounded number
 */
export function roundTo(n: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(n * multiplier) / multiplier;
}

/**
 * Format duration in months to human-readable string
 * @param months - Number of months
 * @returns String like "2 años, 3 meses" or "15 meses"
 */
export function formatMonths(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  }
  
  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? 'año' : 'años'}`;
  }
  
  return `${years} ${years === 1 ? 'año' : 'años'}, ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
}

