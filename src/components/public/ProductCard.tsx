import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import type { ImagenProducto, Producto } from '../../types/esquema';
import { soles, whatsappLink } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export function ProductCard({ producto, imagen }: { producto: Producto; imagen?: ImagenProducto }) {
  return (
    <Card className="overflow-hidden">
      <Link to={`/producto/${producto.id}`}>
        <img className="aspect-[4/3] w-full object-cover" src={imagen?.url ?? 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=900&q=80'} alt={imagen?.alt_text ?? producto.nombre} />
      </Link>
      <div className="grid gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="m-0 text-base font-extrabold text-ciruela dark:text-crema">{producto.nombre}</h3>
            <p className="m-0 mt-1 line-clamp-2 text-sm text-chocolate/70 dark:text-crema/70">{producto.descripcion}</p>
          </div>
          {producto.destacado ? <Badge tone="warning">Destacado</Badge> : null}
        </div>
        <div className="flex items-center justify-between gap-3">
          <strong className="text-lg text-morado dark:text-lila">{soles(producto.precio_venta)}</strong>
          <a href={whatsappLink('51999555121', `Hola Kalú, quiero pedir ${producto.nombre}`)} target="_blank" rel="noreferrer">
            <Button variant="secondary" icon={<MessageCircle className="h-4 w-4" />}>Pedir</Button>
          </a>
        </div>
      </div>
    </Card>
  );
}
