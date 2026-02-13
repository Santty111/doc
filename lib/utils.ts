import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Convierte cualquier valor a string; evita pasar ObjectIds a Client Components. */
export function toStr(v: unknown): string {
  if (v == null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'object' && v !== null && typeof (v as { toString?: () => string }).toString === 'function') {
    return (v as { toString(): string }).toString()
  }
  return String(v)
}

/** Convierte fecha a string ISO o null. */
export function toDateStr(v: unknown): string | null {
  if (v == null) return null
  if (v instanceof Date) return v.toISOString()
  if (typeof v === 'string') return v
  return null
}
