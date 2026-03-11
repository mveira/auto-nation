import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Uppercase + strip whitespace. */
export function normalizeVrm(raw: string): string {
  return raw.toUpperCase().replace(/\s+/g, '')
}
