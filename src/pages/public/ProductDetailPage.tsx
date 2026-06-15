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

  function add() {
    if (!product) return;
    addItem(product);
    toast.success(`${product.nombre} agregado al carrito`);
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[0.9fr_1.1fr]">
      <img className="aspect-square w-full rounded-lg border border-lavanda/70 object-cover shadow-glow" src={product.imagen} alt={product.nombre} />
      <section className="grid content-start gap-5">
        <Link className="text-sm font-extrabold text-morado dark:text-lila" to="/productos">Volver a productos</Link>
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="warning">{product.categoria}</Badge>
            {product.promoCuchareable ? <Badge tone="success">Participa en promo cuchareables</Badge> : null}
            {product.id === 'cuch-pistacho' ? <Badge tone="danger">No aplica a promo</Badge> : null}
          </div>
          <h1 className="m-0 mt-3 font-display text-5xl text-morado dark:text-lila">{product.nombre}</h1>
          <p className="mt-4 text-lg leading-8 text-chocolate/75 dark:text-crema/75">{product.descripcion}</p>
        </div>
        <strong className="text-3xl text-ciruela dark:text-crema">{product.precio === null ? 'Precio según diseño' : soles(product.precio)}</strong>
        <Card>
          <CardContent>
            <h2 className="m-0 mb-2 text-base font-extrabold text-ciruela dark:text-crema">Atención en Ica</h2>
            <p className="m-0 text-sm text-chocolate/70 dark:text-crema/70">Puedes recoger tu pedido afuera de Precio Uno de La Tinguiña o afuera de Oechsle de Ica. También puedes pedir delivery y enviar tu ubicación.</p>
          </CardContent>
        </Card>
        {product.consultable ? (
          <a href={whatsappLink(officialWhatsapp, `Hola Kalú, quiero consultar una ${product.nombre}`)} target="_blank" rel="noreferrer">
            <Button className="w-full md:w-auto" variant="secondary" icon={<MessageCircle className="h-4 w-4" />}>Consultar por WhatsApp</Button>
          </a>
        ) : (
          <Button className="w-full md:w-auto" variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={add}>Agregar al carrito</Button>
        )}
      </section>
    </main>
  );
}
