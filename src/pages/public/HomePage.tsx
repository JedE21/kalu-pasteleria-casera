import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { ProductCard } from '../../components/public/ProductCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/States';
import { obtenerCategorias } from '../../lib/queries/categorias';
import { obtenerConfiguracionEmpresa, obtenerSucursales } from '../../lib/queries/configuracion';
import { obtenerImagenesProductos, obtenerProductosDestacados } from '../../lib/queries/productos';
import { obtenerPromociones } from '../../lib/queries/promociones';
import { whatsappLink } from '../../lib/utils';
import { useAsync } from '../../hooks/useAsync';

export function HomePage() {
  const { data, loading } = useAsync(async () => {
    const [productos, imagenes, categorias, promociones, config, sucursales] = await Promise.all([
      obtenerProductosDestacados(),
      obtenerImagenesProductos(),
      obtenerCategorias(),
      obtenerPromociones(),
      obtenerConfiguracionEmpresa(),
      obtenerSucursales(),
    ]);
    return { productos, imagenes, categorias, promociones, config, sucursales };
  }, []);

  const imagenes = useMemo(() => new Map((data?.imagenes.data ?? []).filter((item) => item.principal).map((item) => [item.producto_id, item])), [data]);

  if (loading || !data) return <main className="mx-auto max-w-7xl px-4 py-10"><LoadingState /></main>;

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1fr_0.85fr] md:items-center">
        <div className="grid gap-6">
          <Badge tone="warning">Pastelería artesanal premium</Badge>
          <div>
            <h1 className="m-0 font-display text-5xl font-bold leading-none text-morado dark:text-lila md:text-7xl">Kalú Pastelería Casera</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-chocolate/75 dark:text-crema/75">Postres artesanales con sabor premium, preparados con detalle casero, estética elegante y mucho cariño para cada celebración.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/catalogo"><Button icon={<ArrowRight className="h-4 w-4" />}>Ver carta</Button></Link>
            <a href={whatsappLink(data.config.data.whatsapp, 'Hola Kalú, quiero hacer un pedido')} target="_blank" rel="noreferrer">
              <Button variant="secondary" icon={<MessageCircle className="h-4 w-4" />}>Pedir por WhatsApp</Button>
            </a>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-lavanda/70 bg-white/70 p-4 shadow-glow dark:border-white/10 dark:bg-white/8">
          <img className="aspect-square w-full rounded-md object-cover" src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1100&q=85" alt="Torta artesanal Kalú" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="m-0 font-display text-4xl text-ciruela dark:text-crema">Productos destacados</h2>
            <p className="m-0 mt-1 text-chocolate/70 dark:text-crema/70">Selección desde `productos.destacado` y `imagenes_productos`.</p>
          </div>
          <Link className="text-sm font-extrabold text-morado dark:text-lila" to="/catalogo">Ver catálogo</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.productos.data.map((producto) => <ProductCard key={producto.id} producto={producto} imagen={imagenes.get(producto.id)} />)}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-3">
        {data.categorias.data.map((categoria) => (
          <Card key={categoria.id}>
            <CardContent className="grid gap-3">
              <Sparkles className="h-6 w-6 text-dorado" />
              <h3 className="m-0 text-xl font-extrabold text-ciruela dark:text-crema">{categoria.nombre}</h3>
              <p className="m-0 text-sm text-chocolate/70 dark:text-crema/70">{categoria.descripcion}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-[0.8fr_1.2fr]">
        <Card className="bg-morado text-white dark:bg-lavanda dark:text-cacao">
          <CardContent>
            <h2 className="m-0 font-display text-4xl">Promociones activas</h2>
            <p className="mt-3 text-white/80 dark:text-cacao/75">Cupones y reglas desde `promociones` y `reglas_promocion`.</p>
          </CardContent>
        </Card>
        <div className="grid gap-3">
          {data.promociones.data.map((promo) => (
            <Card key={promo.id}>
              <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="m-0 font-extrabold text-ciruela dark:text-crema">{promo.nombre}</h3>
                  <p className="m-0 mt-1 text-sm text-chocolate/70 dark:text-crema/70">{promo.descripcion}</p>
                </div>
                <Badge tone="warning">{promo.codigo ?? promo.tipo_descuento}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
