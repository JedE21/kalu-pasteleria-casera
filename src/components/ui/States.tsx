import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

export function LoadingState({ label = 'Cargando datos...' }: { label?: string }) {
  return (
    <Card className="grid min-h-40 place-items-center p-8 text-center">
      <div className="grid justify-items-center gap-3 text-chocolate/70 dark:text-crema/70">
        <Loader2 className="h-6 w-6 animate-spin text-morado" />
        <span className="text-sm font-semibold">{label}</span>
      </div>
    </Card>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Card className="grid gap-4 p-6">
      <div className="flex items-start gap-3 text-red-700 dark:text-red-200">
        <AlertTriangle className="mt-0.5 h-5 w-5" />
        <div>
          <strong>Error al cargar</strong>
          <p className="m-0 mt-1 text-sm">{message}</p>
        </div>
      </div>
      {onRetry ? <Button variant="ghost" icon={<RefreshCw className="h-4 w-4" />} onClick={onRetry}>Reintentar</Button> : null}
    </Card>
  );
}

export function EmptyState({ title = 'Sin registros por ahora', description }: { title?: string; description?: string }) {
  return (
    <Card className="p-8 text-center">
      <strong className="text-ciruela dark:text-crema">{title}</strong>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm text-chocolate/70 dark:text-crema/70">{description}</p> : null}
    </Card>
  );
}
