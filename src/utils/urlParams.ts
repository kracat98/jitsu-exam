/**
 * Parse a positive integer from a URL search param (e.g. page numbers).
 * Returns 1 if missing or invalid.
 */
export function parsePage(param: string | null): number {
  const n = parseInt(param || '1', 10)
  return Number.isNaN(n) || n < 1 ? 1 : n
}
