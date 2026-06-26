import { MessageCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { officialWhatsapp, type KaluProduct } from '../../config/kaluCatalog';
import { useCart } from '../../context/CartContext';
import { soles, whatsappLink } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { OfferCountdown } from './OfferCountdown';

export function KaluProductCard({ product }: { product: KaluProduct }) {
  const { addItem } = useCart();
  const agotado = product.stock <= 0;
  const tieneOferta = Boolean(product.ofertaActiva && product.ofertaPrecio !== null && product.ofertaFechaFin);
  const precioVisible = tieneOferta ? product.ofertaPrecio : product.precio;

  function add() {
    if (agotado) {
      toast.warning(`${product.nombre} esta agotado`);
      return;
    }
    addItem(product);
    toast.success(`${product.nombre} agregado al carrito`);
  }

  return (
    <Card className={`flex h-full flex-col overflow-hidden ${agotado ? 'bg-zinc-100 grayscale dark:bg-zinc-900' : ''}`}>
      <Link to={`/producto/${product.id}`}>
        <div className="relative">
          <img className={`aspect-[4/3] w-full object-cover ${agotado ? 'opacity-55' : ''}`} src={product.imagen} alt={product.nombre} />
          {agotado ? <div className="absolute inset-0 grid place-items-center bg-zinc-900/35 text-2xl font-extrabold uppercase tracking-normal text-white">Agotado</div> : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <Badge tone="warning">{product.categoria}</Badge>
          {agotado ? <Badge tone="danger">Agotado</Badge> : tieneOferta ? <Badge tone="danger">Oferta</Badge> : product.promoCuchareable ? <Badge tone="success">Promo</Badge> : null}
        </div>
        <div className="flex-1">
          <h3 className="m-0 text-base font-extrabold text-ciruela dark:text-crema">{product.nombre}</h3>
          <p className="m-0 mt-1 line-clamp-2 text-sm text-chocolate/70 dark:text-crema/70">{product.descripcion}</p>
        </div>
        <p className={`m-0 text-sm font-bold ${agotado ? 'text-zinc-600 dark:text-zinc-300' : 'text-chocolate/70 dark:text-crema/70'}`}>
          Stock: {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
        </p>
        {tieneOferta && product.ofertaFechaFin ? <OfferCountdown fechaFin={product.ofertaFechaFin} compact /> : null}
        <div className="flex items-center justify-between gap-3">
          <div className="grid">
            {tieneOferta && product.precio !== null ? <span className="text-sm font-bold text-chocolate/45 line-through dark:text-crema/45">{soles(product.precio)}</span> : null}
            <strong className="text-lg text-morado dark:text-lila">{precioVisible === null ? 'Consultar' : soles(precioVisible ?? 0)}</strong>
          </div>
          {agotado ? (
            <Button variant="ghost" disabled>Agotado</Button>
          ) : product.consultable ? (
            <a href={whatsappLink(officialWhatsapp, `Hola Kalu, quiero consultar por ${product.nombre}`)} target="_blank" rel="noreferrer">
              <Button variant="secondary" icon={<MessageCircle className="h-4 w-4" />}>Consultar</Button>
            </a>
          ) : (
            <Button variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={add}>Agregar</Button>
          )}
        </div>
      </div>
    </Card>
  );
}
