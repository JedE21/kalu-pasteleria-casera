import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: React.ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-cacao/55 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-lavanda/70 bg-crema shadow-glow dark:border-white/10 dark:bg-cacao">
        <div className="flex items-center justify-between border-b border-lavanda/70 p-4 dark:border-white/10">
          <h2 className="text-lg font-extrabold text-ciruela dark:text-crema">{title}</h2>
          <Button variant="ghost" className="h-9 w-9 px-0" onClick={onClose} aria-label="Cerrar"><X className="h-5 w-5" /></Button>
        </div>
        <div className="max-h-[75vh] overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
