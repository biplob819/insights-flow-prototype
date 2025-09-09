/**
 * Utility functions for consistent formatting across server and client
 * to prevent hydration mismatches
 */

/**
 * Formats a number with consistent comma separators (US format)
 * to prevent hydration mismatches between server and client
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '';
  
  // Use US locale consistently for server/client compatibility
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Formats a number as currency with consistent formatting
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(value);
}

/**
 * Formats a number with specific decimal places and consistent formatting
 */
export function formatNumberWithDecimals(
  value: number | null | undefined, 
  minimumFractionDigits: number = 2, 
  maximumFractionDigits: number = 2
): string {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat('en-US', { 
    minimumFractionDigits, 
    maximumFractionDigits 
  }).format(value);
}

/**
 * Formats a percentage with consistent formatting
 */
export function formatPercentage(value: number | null | undefined, decimals: number = 1): string {
  if (value === null || value === undefined) return '';
  
  return `${value.toFixed(decimals)}%`;
}
