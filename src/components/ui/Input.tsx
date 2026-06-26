import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const fieldClass = 'h-11 w-full rounded-md border border-lavanda/80 bg-white/95 px-3.5 text-sm font-semibold text-cacao shadow-sm transition placeholder:text-chocolate/40 hover:border-morado/35 focus:border-morado/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(125,75,152,0.10)] focus:outline-none dark:border-white/10 dark:bg-cacao/70 dark:text-crema dark:focus:bg-cacao/85';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('min-h-28 w-full rounded-md border border-lavanda/80 bg-white/95 px-3.5 py-3 text-sm font-semibold leading-6 text-cacao shadow-sm transition placeholder:text-chocolate/40 hover:border-morado/35 focus:border-morado/70 focus:bg-white focus:shadow-[0_0_0_4px_rgba(125,75,152,0.10)] focus:outline-none dark:border-white/10 dark:bg-cacao/70 dark:text-crema dark:focus:bg-cacao/85', className)} {...props} />;
}

export function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn('grid gap-2 text-sm font-semibold text-chocolate dark:text-crema/90', className)}>
      <span className="text-[0.82rem] font-extrabold text-chocolate/85 dark:text-crema/85">{label}</span>
      {children}
    </label>
  );
}
