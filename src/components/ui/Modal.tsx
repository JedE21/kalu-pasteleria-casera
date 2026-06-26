import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: React.ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-cacao/60 p-3 backdrop-blur-sm sm:p-6">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg border border-white/70 bg-crema shadow-[0_24px_80px_rgba(47,28,43,0.28)] ring-1 ring-morado/10 dark:border-white/10 dark:bg-cacao">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-lavanda/70 bg-crema/95 px-5 py-4 backdrop-blur dark:border-white/10 dark:bg-cacao/95 sm:px-6">
          <div>
            <p className="m-0 text-xs font-extrabold uppercase tracking-[0.18em] text-dorado">Panel administrativo</p>
            <h2 className="m-0 mt-1 text-xl font-extrabold text-ciruela dark:text-crema">{title}</h2>
          </div>
          <Button variant="ghost" className="h-10 w-10 rounded-full px-0" onClick={onClose} aria-label="Cerrar"><X className="h-5 w-5" /></Button>
        </div>
        <div className="premium-scrollbar max-h-[78vh] overflow-auto bg-gradient-to-b from-white/45 to-crema px-5 py-5 dark:from-white/5 dark:to-cacao sm:px-6">{children}</div>
      </div>
    </div>
  );
}
