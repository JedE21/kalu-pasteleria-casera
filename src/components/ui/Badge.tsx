import { cn } from '../../lib/utils';

export function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) {
  const tones = {
    default: 'bg-lavanda/70 text-ciruela dark:bg-white/10 dark:text-lila',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200',
  };
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold', tones[tone])}>{children}</span>;
}

export function statusTone(value: string | boolean | null | undefined): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  const text = String(value).toLowerCase();
  if (['true', 'activo', 'activa', 'disponible', 'entregado', 'pagado', 'terminada'].includes(text)) return 'success';
  if (['pendiente', 'preparacion', 'asignada', 'advertencia', 'en_proceso'].includes(text)) return 'warning';
  if (['false', 'cancelado', 'fallido', 'critica', 'no disponible'].includes(text)) return 'danger';
  if (['web', 'confirmado', 'info'].includes(text)) return 'info';
  return 'default';
}
