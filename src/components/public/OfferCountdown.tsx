import { Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';

function formatCountdown(ms: number) {
  const safe = Math.max(0, ms);
  const days = Math.floor(safe / 86400000);
  const hours = Math.floor((safe % 86400000) / 3600000);
  const minutes = Math.floor((safe % 3600000) / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);

  return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

export function OfferCountdown({ fechaFin, compact = false }: { fechaFin: string; compact?: boolean }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={`inline-flex items-center gap-2 rounded-md bg-morado text-white ${compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'}`}>
      <Clock3 className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
      <strong>{formatCountdown(new Date(fechaFin).getTime() - now)}</strong>
    </div>
  );
}
