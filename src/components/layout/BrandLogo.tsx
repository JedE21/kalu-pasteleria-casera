import { CakeSlice } from 'lucide-react';

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-full border border-morado/35 bg-lavanda/70 text-morado shadow-sm dark:border-lila/40 dark:bg-white/10 dark:text-lila">
        <CakeSlice className="h-6 w-6" />
      </div>
      {!compact ? (
        <div className="leading-tight">
          <strong className="font-display text-2xl font-bold text-morado dark:text-lila">Kalú</strong>
          <span className="block text-xs font-bold uppercase tracking-[0.22em] text-chocolate/65 dark:text-crema/65">Pastelería Casera</span>
        </div>
      ) : null}
    </div>
  );
}
