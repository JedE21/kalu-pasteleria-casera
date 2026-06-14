import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-morado text-white hover:bg-ciruela shadow-sm',
  secondary: 'bg-dorado text-cacao hover:bg-[#b7893e] shadow-sm',
  ghost: 'bg-transparent text-morado hover:bg-lavanda/45 dark:text-lila dark:hover:bg-white/10',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export function Button({ className, variant = 'primary', icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
