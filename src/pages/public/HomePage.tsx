import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import { KaluProductCard } from '../../components/public/KaluProductCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { officialWhatsapp, pickupPoints } from '../../config/kaluCatalog';
import { useCatalogoPublico } from '../../hooks/useCatalogoPublico';
import { whatsappLink } from '../../lib/utils';

export function HomePage() {
  const { products, categories: kaluCategories } = useCatalogoPublico();
  const ofertas = products
    .filter((product) => product.ofertaActiva && product.ofertaPrecio !== null && product.ofertaFechaFin)
    .slice(0, 4);
  const destacados = products
    .filter((product) => product.destacado || ['cuch-chocolate-fudge', 'cuch-cheesecake-maracuya', 'kilo-combo-triple', 'boc-alfajores-maicena'].includes(product.id))
    .slice(0, 4);

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1fr_0.85fr] md:items-center">
        <div className="grid gap-6">
          <Badge tone="warning">Pastelería casera premium en Ica</Badge>
          <div>
            <h1 className="m-0 font-display text-5xl font-bold leading-none text-morado dark:text-lila md:text-7xl">Kalú Pastelería Casera</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-chocolate/75 dark:text-crema/75">Cuchareables, tortas y bocaditos artesanales para Ica. Recoge en La Tinguiña u Oechsle, o pide delivery con ubicación exacta.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/productos"><Button icon={<ArrowRight className="h-4 w-4" />}>Ver productos</Button></Link>
            <a href={whatsappLink(officialWhatsapp, 'Hola Kalú, quiero hacer un pedido en Ica')} target="_blank" rel="noreferrer">
              <Button variant="secondary" icon={<MessageCircle className="h-4 w-4" />}>Pedir por WhatsApp</Button>
            </a>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-lavanda/70 bg-white/70 p-4 shadow-glow dark:border-white/10 dark:bg-white/8">
          <img className="aspect-square w-full rounded-md object-cover" src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1100&q=85" alt="Torta artesanal Kalú en Ica" />
        </div>
      </section>

      {ofertas.length ? (
        <section className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <Badge tone="danger">Tiempo limitado</Badge>
              <h2 className="m-0 mt-2 font-display text-4xl text-ciruela dark:text-crema">Ofertas de hoy</h2>
              <p className="m-0 mt-1 text-chocolate/70 dark:text-crema/70">Productos con precio especial y contador activo.</p>
            </div>
            <Link className="text-sm font-extrabold text-morado dark:text-lila" to="/ofertas">Ver ofertas</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {ofertas.map((product) => <KaluProductCard key={product.id} product={product} />)}
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-6 md:grid-cols-2">
        {pickupPoints.map((point) => (
          <Card key={point.id}>
            <CardContent className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-morado" />
              <div>
                <h2 className="m-0 text-lg font-extrabold text-ciruela dark:text-crema">{point.nombre}</h2>
                <p className="m-0 mt-1 text-sm text-chocolate/70 dark:text-crema/70">{point.direccion}</p>
                <a className="mt-2 inline-block text-sm font-bold text-morado dark:text-lila" href={point.mapa} target="_blank" rel="noreferrer">Ver ubicación</a>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="m-0 font-display text-4xl text-ciruela dark:text-crema">Favoritos de Kalú</h2>
            <p className="m-0 mt-1 text-chocolate/70 dark:text-crema/70">Productos reales disponibles para pedido en Ica.</p>
          </div>
          <Link className="text-sm font-extrabold text-morado dark:text-lila" to="/productos">Ver todo</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {destacados.map((product) => <KaluProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-3">
        {kaluCategories.map((categoria) => (
          <Card key={categoria.id}>
            <CardContent className="grid gap-3">
              <Sparkles className="h-6 w-6 text-dorado" />
              <h3 className="m-0 text-xl font-extrabold text-ciruela dark:text-crema">{categoria.nombre}</h3>
              <p className="m-0 text-sm text-chocolate/70 dark:text-crema/70">{categoria.descripcion}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <Card className="bg-morado text-white">
          <CardContent className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="m-0 font-display text-4xl">Promo cuchareables</h2>
              <p className="m-0 mt-2 text-white/80">2 cuchareables surtidos por S/ 13.00 o 3 por S/ 18.00. No aplica para Torta de Pistacho.</p>
            </div>
            <Link to="/promociones"><Button variant="secondary">Ver promoción</Button></Link>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
