import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function soles(valor: number | null | undefined) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(Number(valor ?? 0));
}

export function fechaCorta(valor: string | null | undefined) {
  if (!valor) return '-';
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(valor));
}

export function porcentaje(valor: number | null | undefined) {
  return `${Number(valor ?? 0).toFixed(1)}%`;
}

export function normalizarTexto(valor: string) {
  return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function generarCodigo(prefijo: string) {
  return `${prefijo}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function slugify(valor: string) {
  return normalizarTexto(valor).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function whatsappLink(numero: string | null | undefined, mensaje: string) {
  const limpio = (numero || '51999555121').replace(/\D/g, '');
  return `https://wa.me/${limpio}?text=${encodeURIComponent(mensaje)}`;
}
