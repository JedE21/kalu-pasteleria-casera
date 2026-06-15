import { MessageCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { officialWhatsapp, type KaluProduct } from '../../config/kaluCatalog';
import { useCart } from '../../context/CartContext';
import { soles, whatsappLink } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function KaluProductCard({ product }: { product: KaluProduct }) {
  const { addItem } = useCart();

  function add() {
    addItem(product);
    toast.success(`${product.nombre} agregado al carrito`);
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <Link to={`/producto/${product.id}`}>
        <img className="aspect-[4/3] w-full object-cover" src={product.imagen} alt={product.nombre} />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <Badge tone="warning">{product.categoria}</Badge>
          {product.promoCuchareable ? <Badge tone="success">Promo</Badge> : null}
        </div>
        <div className="flex-1">
          <h3 className="m-0 text-base font-extrabold text-ciruela dark:text-crema">{product.nombre}</h3>
          <p className="m-0 mt-1 line-clamp-2 text-sm text-chocolate/70 dark:text-crema/70">{product.descripcion}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <strong className="text-lg text-morado dark:text-lila">{product.precio === null ? 'Consultar' : soles(product.precio)}</strong>
          {product.consultable ? (
            <a href={whatsappLink(officialWhatsapp, `Hola Kalú, quiero consultar por ${product.nombre}`)} target="_blank" rel="noreferrer">
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
