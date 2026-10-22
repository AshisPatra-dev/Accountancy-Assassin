// ============================================================
// ACCOUNTANCY ASSASSIN — Number & Date Formatting Utilities
// Indian digit grouping (Lakhs/Crores), robust amount parsing,
// and date arithmetic for accounting transactions & bills.
// ============================================================

/**
 * Formats a number in Indian Rupee format with Indian digit grouping (₹1,00,000).
 * Handles negative numbers, decimals, and zero.
 */
export function formatINR(amount: number, includeSymbol: boolean = true): string {
  if (isNaN(amount) || !isFinite(amount)) return includeSymbol ? '₹0' : '0';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const rounded = Math.round(absAmount * 100) / 100;
  const parts = rounded.toFixed(rounded % 1 === 0 ? 0 : 2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? `.${parts[1]}` : '';

  // Indian digit grouping: last 3 digits, then groups of 2
  if (integerPart.length > 3) {
    const last3 = integerPart.slice(-3);
    const remaining = integerPart.slice(0, -3);
    const groupsOf2 = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    integerPart = `${groupsOf2},${last3}`;
  }

  const prefix = isNegative ? '-' : '';
  const symbol = includeSymbol ? '₹' : '';
  return `${prefix}${symbol}${integerPart}${decimalPart}`;
}

/**
 * Parses user input amounts flexibly.
 * Accepts: "1,00,000", "100000", "₹1,00,000", "1 00 000", "(1,00,000)" (negative).
 * Returns NaN if string cannot be parsed.
 */
export function parseAmount(str: string | number | null | undefined): number {
  if (typeof str === 'number') return isNaN(str) ? 0 : str;
  if (!str) return 0;

  const trimmed = String(str).trim();
  if (trimmed === '') return 0;

  // Check for accounting bracketed negative format: (1,000) or (₹1,000)
  const isBracketNegative = /^\(.*\)$/.test(trimmed);

  // Clean out currency symbol, commas, spaces, letters, brackets
  let cleaned = trimmed.replace(/[₹$,\s]/g, '');
  if (isBracketNegative) {
    cleaned = cleaned.replace(/[()]/g, '');
  }

  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;

  return isBracketNegative ? -Math.abs(num) : num;
}

/**
 * Formats date as DD/MM/YYYY.
 */
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Adds months to a Date, adjusting for month length (e.g. Jan 31 + 1 month = Feb 28/29).
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  const expectedMonth = (result.getMonth() + months) % 12;
  result.setMonth(result.getMonth() + months);
  // Normalize if day rolled into next month
  while (result.getMonth() > (expectedMonth < 0 ? expectedMonth + 12 : expectedMonth)) {
    result.setDate(result.getDate() - 1);
  }
  return result;
}

/**
 * Adds days to a Date.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Computes difference in whole days between two dates (b - a).
 */
export function daysBetween(a: Date, b: Date): number {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((utcB - utcA) / msPerDay);
}
