import { MessageCircle, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { EmptyState, LoadingState } from '../../components/ui/States';
import { officialWhatsapp } from '../../config/kaluCatalog';
import { useCart } from '../../context/CartContext';
import { useCatalogoPublico } from '../../hooks/useCatalogoPublico';
import { soles, whatsappLink } from '../../lib/utils';

export function ProductDetailPage() {
  const { id = '' } = useParams();
  const { products, loading } = useCatalogoPublico();
  const product = products.find((item) => item.id === id);
  const { addItem } = useCart();

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-10"><LoadingState label="Cargando producto..." /></main>;
  if (!product) return <main className="mx-auto max-w-7xl px-4 py-10"><EmptyState title="Producto no encontrado" /></main>;

  const agotado = product.stock <= 0;

  function add() {
    if (!product) return;
    if (agotado) {
      toast.warning(`${product.nombre} esta agotado`);
      return;
    }
    addItem(product);
    toast.success(`${product.nombre} agregado al carrito`);
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[0.9fr_1.1fr]">
      <div className="relative">
        <img className={`aspect-square w-full rounded-lg border border-lavanda/70 object-cover shadow-glow ${agotado ? 'grayscale opacity-60' : ''}`} src={product.imagen} alt={product.nombre} />
        {agotado ? <div className="absolute inset-0 grid place-items-center rounded-lg bg-zinc-900/35 text-3xl font-extrabold uppercase tracking-normal text-white">Agotado</div> : null}
      </div>
      <section className="grid content-start gap-5">
        <Link className="text-sm font-extrabold text-morado dark:text-lila" to="/productos">Volver a productos</Link>
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="warning">{product.categoria}</Badge>
            {product.promoCuchareable ? <Badge tone="success">Participa en promo cuchareables</Badge> : null}
            {product.id === 'cuch-pistacho' ? <Badge tone="danger">No aplica a promo</Badge> : null}
            {agotado ? <Badge tone="danger">Agotado</Badge> : null}
          </div>
          <h1 className="m-0 mt-3 font-display text-5xl text-morado dark:text-lila">{product.nombre}</h1>
          <p className="mt-4 text-lg leading-8 text-chocolate/75 dark:text-crema/75">{product.descripcion}</p>
        </div>
        <strong className="text-3xl text-ciruela dark:text-crema">{product.precio === null ? 'Precio segun diseno' : soles(product.precio)}</strong>
        <p className="m-0 text-base font-bold text-chocolate/75 dark:text-crema/75">Stock disponible: {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}</p>
        <Card>
          <CardContent>
            <h2 className="m-0 mb-2 text-base font-extrabold text-ciruela dark:text-crema">Atencion en Ica</h2>
            <p className="m-0 text-sm text-chocolate/70 dark:text-crema/70">Puedes recoger tu pedido afuera de Precio Uno de La Tinguina o afuera de Oechsle de Ica. Tambien puedes pedir delivery y enviar tu ubicacion.</p>
          </CardContent>
        </Card>
        {agotado ? (
          <Button className="w-full md:w-auto" variant="ghost" disabled>Agotado</Button>
        ) : product.consultable ? (
          <a href={whatsappLink(officialWhatsapp, `Hola Kalu, quiero consultar una ${product.nombre}`)} target="_blank" rel="noreferrer">
            <Button className="w-full md:w-auto" variant="secondary" icon={<MessageCircle className="h-4 w-4" />}>Consultar por WhatsApp</Button>
          </a>
        ) : (
          <Button className="w-full md:w-auto" variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={add}>Agregar al carrito</Button>
        )}
      </section>
    </main>
  );
}
