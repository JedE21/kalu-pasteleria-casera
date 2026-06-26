import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/States';
import { OfferCountdown } from '../../components/public/OfferCountdown';
import { useCatalogoPublico } from '../../hooks/useCatalogoPublico';
import { soles } from '../../lib/utils';

export function OffersPage() {
  const { products, loading } = useCatalogoPublico();
  const ofertas = products.filter((product) => product.ofertaActiva && product.ofertaPrecio !== null && product.ofertaFechaFin);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Badge tone="danger">Tiempo limitado</Badge>
      <h1 className="m-0 mt-3 font-display text-5xl text-morado dark:text-lila">Ofertas Kalú</h1>
      <p className="mt-2 max-w-2xl text-chocolate/70 dark:text-crema/70">Productos con precio especial por tiempo limitado. Cuando el contador llega a cero, dejan de mostrarse.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? <LoadingState label="Cargando ofertas..." /> : null}
        {!loading && !ofertas.length ? (
          <Card>
            <CardContent>
              <p className="m-0 font-bold text-chocolate/75 dark:text-crema/75">No hay ofertas activas en este momento.</p>
            </CardContent>
          </Card>
        ) : null}
        {ofertas.map((product) => (
          <Card key={product.id} className="overflow-hidden border-dorado/70">
            <img className="aspect-[4/3] w-full object-cover" src={product.imagen} alt={product.nombre} />
            <CardContent className="grid gap-4 p-6">
              <div className="flex items-start justify-between gap-3">
                <Badge tone="danger">Oferta</Badge>
                <Badge tone="warning">{product.categoria}</Badge>
              </div>
              <div>
                <h2 className="m-0 text-2xl font-extrabold text-ciruela dark:text-crema">{product.nombre}</h2>
                <p className="m-0 mt-2 text-sm leading-6 text-chocolate/70 dark:text-crema/70">{product.descripcion}</p>
              </div>
              <div className="flex items-end justify-between gap-3">
                <div className="grid">
                  {product.precio !== null ? <span className="text-sm font-bold text-chocolate/45 line-through dark:text-crema/45">{soles(product.precio)}</span> : null}
                  <strong className="text-2xl text-morado dark:text-lila">{soles(product.ofertaPrecio ?? 0)}</strong>
                </div>
                <span className="text-sm font-bold text-chocolate/70 dark:text-crema/70">Stock: {product.stock}</span>
              </div>
              {product.ofertaFechaFin ? <OfferCountdown fechaFin={product.ofertaFechaFin} /> : null}
              <Link to={`/producto/${product.id}`}>
                <Button className="w-full" variant="secondary">Ver producto</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
