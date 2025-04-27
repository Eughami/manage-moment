import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function humanDate(d: string): string {
  return new Intl.DateTimeFormat('fr-Fr', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(d.split('T')[0]));
}
