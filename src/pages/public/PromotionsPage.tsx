import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/States';
import { obtenerPromociones, obtenerReglasPromocion } from '../../lib/queries/promociones';
import { fechaCorta, soles } from '../../lib/utils';
import { useAsync } from '../../hooks/useAsync';

export function PromotionsPage() {
  const { data, loading } = useAsync(async () => {
    const [promociones, reglas] = await Promise.all([obtenerPromociones(), obtenerReglasPromocion()]);
    return { promociones, reglas };
  }, []);

  if (loading || !data) return <main className="mx-auto max-w-7xl px-4 py-10"><LoadingState /></main>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="m-0 font-display text-5xl text-morado dark:text-lila">Promociones</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {data.promociones.data.map((promo) => {
          const reglas = data.reglas.data.filter((regla) => regla.promocion_id === promo.id);
          return (
            <Card key={promo.id}>
              <CardContent className="grid gap-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="m-0 text-xl font-extrabold text-ciruela dark:text-crema">{promo.nombre}</h2>
                  <Badge tone={promo.activa ? 'success' : 'danger'}>{promo.activa ? 'Activa' : 'Inactiva'}</Badge>
                </div>
                <p className="m-0 text-sm text-chocolate/70 dark:text-crema/70">{promo.descripcion}</p>
                <strong>{promo.tipo_descuento === 'porcentaje' ? `${promo.valor}%` : promo.tipo_descuento === 'monto_fijo' ? soles(promo.valor) : 'Envío gratis'}</strong>
                <span className="text-sm text-chocolate/65 dark:text-crema/65">{fechaCorta(promo.fecha_inicio)} - {fechaCorta(promo.fecha_fin)}</span>
                <span className="text-xs font-bold uppercase text-morado dark:text-lila">{reglas.length} reglas configuradas</span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
