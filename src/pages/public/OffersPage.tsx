import { useEffect, useMemo, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/States';
import { useAsync } from '../../hooks/useAsync';
import { obtenerPromociones } from '../../lib/queries/promociones';
import { soles } from '../../lib/utils';

function useNowTick() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return now;
}

function formatCountdown(ms: number) {
  const safe = Math.max(0, ms);
  const days = Math.floor(safe / 86400000);
  const hours = Math.floor((safe % 86400000) / 3600000);
  const minutes = Math.floor((safe % 3600000) / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);

  return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

function discountLabel(tipo: string, valor: number) {
  if (tipo === 'porcentaje') return `${valor}% dscto.`;
  if (tipo === 'envio_gratis') return 'Delivery gratis';
  return `${soles(valor)} dscto.`;
}

export function OffersPage() {
  const now = useNowTick();
  const { data, loading } = useAsync(obtenerPromociones, ['ofertas-publicas']);

  const ofertas = useMemo(() => (data?.data ?? []).filter((item) => {
    const inicio = new Date(item.fecha_inicio).getTime();
    const fin = new Date(item.fecha_fin).getTime();
    return item.tipo === 'oferta' && item.activa && inicio <= now && fin > now;
  }), [data, now]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Badge tone="danger">Tiempo limitado</Badge>
      <h1 className="m-0 mt-3 font-display text-5xl text-morado dark:text-lila">Ofertas Kalú</h1>
      <p className="mt-2 max-w-2xl text-chocolate/70 dark:text-crema/70">Ofertas activas por tiempo limitado. Cuando el contador llega a cero, dejan de mostrarse.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? <LoadingState label="Cargando ofertas..." /> : null}
        {!loading && !ofertas.length ? (
          <Card>
            <CardContent>
              <p className="m-0 font-bold text-chocolate/75 dark:text-crema/75">No hay ofertas activas en este momento.</p>
            </CardContent>
          </Card>
        ) : null}
        {ofertas.map((oferta) => (
          <Card key={oferta.id} className="overflow-hidden border-dorado/70">
            <CardContent className="grid gap-4 p-6">
              <div className="flex items-start justify-between gap-3">
                <Badge tone="warning">{discountLabel(oferta.tipo_descuento, Number(oferta.valor))}</Badge>
                {oferta.codigo ? <Badge tone="info">{oferta.codigo}</Badge> : null}
              </div>
              <div>
                <h2 className="m-0 text-2xl font-extrabold text-ciruela dark:text-crema">{oferta.nombre}</h2>
                <p className="m-0 mt-2 text-sm leading-6 text-chocolate/70 dark:text-crema/70">{oferta.descripcion}</p>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-morado px-4 py-3 text-white">
                <Clock3 className="h-5 w-5" />
                <strong>{formatCountdown(new Date(oferta.fecha_fin).getTime() - now)}</strong>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
