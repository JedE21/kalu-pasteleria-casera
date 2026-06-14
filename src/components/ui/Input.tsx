import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const fieldClass = 'h-10 w-full rounded-md border border-lavanda/80 bg-white px-3 text-sm text-cacao shadow-sm placeholder:text-chocolate/45 dark:border-white/10 dark:bg-cacao/70 dark:text-crema';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('min-h-24 w-full rounded-md border border-lavanda/80 bg-white px-3 py-2 text-sm text-cacao shadow-sm dark:border-white/10 dark:bg-cacao/70 dark:text-crema', className)} {...props} />;
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-chocolate dark:text-crema/90">
      <span>{label}</span>
      {children}
    </label>
  );
}
