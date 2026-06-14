import type { ReactNode } from 'react';
import { Card } from './Card';

export function StatCard({ label, value, icon, hint }: { label: string; value: ReactNode; icon?: ReactNode; hint?: string }) {
  return (
    <Card className="grid min-h-32 content-between gap-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-extrabold uppercase text-chocolate/60 dark:text-crema/60">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-md bg-lavanda/60 text-morado dark:bg-white/10 dark:text-lila">{icon}</span>
      </div>
      <div>
        <strong className="text-2xl font-extrabold text-ciruela dark:text-crema">{value}</strong>
        {hint ? <p className="m-0 mt-1 text-xs text-chocolate/60 dark:text-crema/60">{hint}</p> : null}
      </div>
    </Card>
  );
}
