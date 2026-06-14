import { Link, useParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingState, EmptyState } from '../../components/ui/States';
import { obtenerCategorias } from '../../lib/queries/categorias';
import { obtenerImagenesProductos, obtenerProductoPorId, obtenerVariantesProducto } from '../../lib/queries/productos';
import { soles, whatsappLink } from '../../lib/utils';
import { useAsync } from '../../hooks/useAsync';

export function ProductDetailPage() {
  const { id = '' } = useParams();
  const { data, loading } = useAsync(async () => {
    const [producto, imagenes, variantes, categorias] = await Promise.all([obtenerProductoPorId(id), obtenerImagenesProductos(), obtenerVariantesProducto(id), obtenerCategorias()]);
    return { producto, imagenes, variantes, categorias };
  }, [id]);

  if (loading || !data) return <main className="mx-auto max-w-7xl px-4 py-10"><LoadingState /></main>;
  if (!data.producto.data) return <main className="mx-auto max-w-7xl px-4 py-10"><EmptyState title="Producto no encontrado" /></main>;

  const producto = data.producto.data;
  const imagen = data.imagenes.data.find((item) => item.producto_id === producto.id && item.principal);
  const categoria = data.categorias.data.find((item) => item.id === producto.categoria_id);

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[0.9fr_1.1fr]">
      <img className="aspect-square w-full rounded-lg border border-lavanda/70 object-cover shadow-glow" src={imagen?.url ?? 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=900&q=80'} alt={imagen?.alt_text ?? producto.nombre} />
      <section className="grid content-start gap-5">
        <Link className="text-sm font-extrabold text-morado dark:text-lila" to="/catalogo">Volver al catálogo</Link>
        <div>
          <Badge tone="warning">{categoria?.nombre ?? 'Kalú'}</Badge>
          <h1 className="m-0 mt-3 font-display text-5xl text-morado dark:text-lila">{producto.nombre}</h1>
          <p className="mt-4 text-lg leading-8 text-chocolate/75 dark:text-crema/75">{producto.descripcion}</p>
        </div>
        <strong className="text-3xl text-ciruela dark:text-crema">{soles(producto.precio_venta)}</strong>
        <Card>
          <CardContent>
            <h2 className="m-0 mb-3 text-base font-extrabold text-ciruela dark:text-crema">Variantes</h2>
            <div className="grid gap-2">
              {data.variantes.data.length ? data.variantes.data.map((variante) => (
                <div key={variante.id} className="flex items-center justify-between rounded-md bg-lavanda/25 p-3 dark:bg-white/5">
                  <span>{variante.nombre}</span>
                  <strong>{soles(producto.precio_venta + variante.precio_adicional)}</strong>
                </div>
              )) : <span className="text-sm text-chocolate/70 dark:text-crema/70">Sin variantes registradas</span>}
            </div>
          </CardContent>
        </Card>
        <a href={whatsappLink('51999555121', `Hola Kalú, quiero pedir ${producto.nombre}`)} target="_blank" rel="noreferrer">
          <Button className="w-full md:w-auto" variant="secondary" icon={<MessageCircle className="h-4 w-4" />}>Pedir este producto</Button>
        </a>
      </section>
    </main>
  );
}
