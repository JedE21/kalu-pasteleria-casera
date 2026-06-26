import { MapPin, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { officialWhatsapp, pickupPoints } from '../../config/kaluCatalog';
import { useCart } from '../../context/CartContext';
import { soles } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Field, Input, Select, Textarea } from '../ui/Input';
import { DeliveryMap } from './DeliveryMap';

interface CheckoutState {
  nombre: string;
  telefono: string;
  tipoEntrega: 'recojo' | 'delivery';
  puntoRecojo: string;
  direccion: string;
  referencia: string;
  latitud: number | null;
  longitud: number | null;
}

const initialCheckout: CheckoutState = {
  nombre: '',
  telefono: '',
  tipoEntrega: 'recojo',
  puntoRecojo: pickupPoints[0].id,
  direccion: '',
  referencia: '',
  latitud: null,
  longitud: null,
};

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, totals, count, updateQuantity, removeItem } = useCart();
  const [checkout, setCheckout] = useState(initialCheckout);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

  const pickupPoint = pickupPoints.find((point) => point.id === checkout.puntoRecojo) ?? pickupPoints[0];
  const whatsappUrl = useMemo(() => {
    const lines = [
      'Hola Kalú Pastelería Casera, quiero realizar este pedido:',
      '',
      `Nombre: ${checkout.nombre || '-'}`,
      `Teléfono / WhatsApp: ${checkout.telefono || '-'}`,
      `Tipo de entrega: ${checkout.tipoEntrega === 'recojo' ? 'Recoger en tienda' : 'Delivery'}`,
      checkout.tipoEntrega === 'recojo'
        ? `Punto de recojo: ${pickupPoint.nombre} - ${pickupPoint.direccion}`
        : `Dirección delivery: ${checkout.direccion || '-'}${checkout.referencia ? ` (${checkout.referencia})` : ''}`,
      checkout.tipoEntrega === 'delivery' && checkout.latitud && checkout.longitud ? `Coordenadas: ${checkout.latitud.toFixed(6)}, ${checkout.longitud.toFixed(6)}` : null,
      '',
      'Productos:',
      ...items.map((item) => `- ${item.quantity} x ${item.product.nombre} (${item.product.categoria}) - ${soles((item.product.precio ?? 0) * item.quantity)}`),
      '',
      `Subtotal: ${soles(totals.subtotal)}`,
      totals.discount > 0 ? `Descuento cuchareables: -${soles(totals.discount)}` : null,
      `Total final: ${soles(totals.total)}`,
      checkout.tipoEntrega === 'recojo' ? 'Adelanto requerido para separar pedido: S/ 5.00' : null,
      '',
      'Quedo atenta/o a la confirmación. Gracias.',
    ].filter(Boolean).join('\n');
    return `https://wa.me/${officialWhatsapp}?text=${encodeURIComponent(lines)}`;
  }, [checkout, items, pickupPoint, totals]);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setGeoMessage('Tu navegador no permite obtener ubicación. Ingresa la dirección manualmente.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCheckout((current) => ({ ...current, latitud: position.coords.latitude, longitud: position.coords.longitude }));
        setGeoMessage('Ubicación detectada. Puedes mover el pin para ajustar el punto exacto.');
      },
      () => setGeoMessage('No se pudo obtener tu ubicación. Puedes ingresar la dirección manualmente.'),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  function validateBeforeSend(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!items.length) {
      event.preventDefault();
      toast.error('Agrega productos al carrito antes de enviar el pedido.');
      return;
    }
    if (!checkout.nombre.trim() || !checkout.telefono.trim()) {
      event.preventDefault();
      toast.error('Completa nombre y teléfono para enviar el pedido.');
      return;
    }
    if (checkout.tipoEntrega === 'delivery' && !checkout.direccion.trim()) {
      event.preventDefault();
      toast.error('Ingresa tu dirección de delivery.');
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-cacao/55">
      <aside className="ml-auto flex h-full w-full max-w-xl flex-col overflow-auto bg-crema p-4 shadow-glow dark:bg-cacao">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="m-0 text-xs font-extrabold uppercase text-morado dark:text-lila">Carrito Kalú</p>
            <h2 className="m-0 text-2xl font-extrabold text-ciruela dark:text-crema">{count} productos</h2>
          </div>
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
        </div>

        <div className="grid gap-3">
          {items.length ? items.map((item) => (
            <Card key={item.product.id} className="p-3">
              <div className="flex gap-3">
                <img className="h-20 w-20 rounded-md object-cover" src={item.product.imagen} alt={item.product.nombre} />
                <div className="min-w-0 flex-1">
                  <strong className="text-sm text-ciruela dark:text-crema">{item.product.nombre}</strong>
                  <p className="m-0 text-xs text-chocolate/65 dark:text-crema/65">{item.product.categoria} · {soles(item.product.precio)} · Stock: {item.product.stock}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button className="h-8 w-8 px-0" variant="ghost" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <Button className="h-8 w-8 px-0" variant="ghost" disabled={item.quantity >= item.product.stock} onClick={() => updateQuantity(item.product.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                    <Button className="ml-auto h-8 w-8 px-0" variant="ghost" onClick={() => removeItem(item.product.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </Card>
          )) : (
            <Card className="grid place-items-center p-8 text-center text-sm text-chocolate/70 dark:text-crema/70">
              <ShoppingBag className="mb-2 h-8 w-8 text-morado" />
              Sin productos por ahora.
            </Card>
          )}
        </div>

        <Card className="mt-4 grid gap-2 p-4">
          <div className="flex justify-between"><span>Subtotal</span><strong>{soles(totals.subtotal)}</strong></div>
          <div className="flex justify-between"><span>Promoción cuchareables</span><strong>-{soles(totals.discount)}</strong></div>
          {totals.promoMessage ? <p className="m-0 text-xs font-bold text-morado dark:text-lila">{totals.promoMessage}. No aplica a Torta de Pistacho.</p> : null}
          <div className="flex justify-between border-t border-lavanda/70 pt-2 text-lg"><span>Total</span><strong>{soles(totals.total)}</strong></div>
        </Card>

        <form className="mt-4 grid gap-3">
          <Field label="Nombre completo"><Input value={checkout.nombre} onChange={(event) => setCheckout((current) => ({ ...current, nombre: event.target.value }))} /></Field>
          <Field label="Teléfono / WhatsApp"><Input value={checkout.telefono} onChange={(event) => setCheckout((current) => ({ ...current, telefono: event.target.value }))} /></Field>
          <Field label="Tipo de entrega">
            <Select value={checkout.tipoEntrega} onChange={(event) => setCheckout((current) => ({ ...current, tipoEntrega: event.target.value as CheckoutState['tipoEntrega'] }))}>
              <option value="recojo">Recoger en tienda</option>
              <option value="delivery">Delivery</option>
            </Select>
          </Field>

          {checkout.tipoEntrega === 'recojo' ? (
            <Card className="grid gap-3 p-3">
              <Field label="Punto de recojo">
                <Select value={checkout.puntoRecojo} onChange={(event) => setCheckout((current) => ({ ...current, puntoRecojo: event.target.value }))}>
                  {pickupPoints.map((point) => <option key={point.id} value={point.id}>{point.nombre}</option>)}
                </Select>
              </Field>
              <p className="m-0 text-sm text-chocolate/70 dark:text-crema/70">{pickupPoint.direccion}</p>
              <a className="inline-flex items-center gap-2 text-sm font-bold text-morado dark:text-lila" href={pickupPoint.mapa} target="_blank" rel="noreferrer"><MapPin className="h-4 w-4" /> Ver mapa</a>
              <p className="m-0 rounded-md bg-dorado/15 p-3 text-sm font-bold text-chocolate dark:text-crema">Para separar tu pedido se solicita un adelanto de S/ 5.00.</p>
            </Card>
          ) : (
            <Card className="grid gap-3 p-3">
              <Field label="Dirección"><Input value={checkout.direccion} onChange={(event) => setCheckout((current) => ({ ...current, direccion: event.target.value }))} /></Field>
              <Field label="Referencia"><Textarea value={checkout.referencia} onChange={(event) => setCheckout((current) => ({ ...current, referencia: event.target.value }))} /></Field>
              <Button type="button" variant="ghost" onClick={useCurrentLocation}>Usar mi ubicación actual</Button>
              {geoMessage ? <p className="m-0 text-sm font-semibold text-morado dark:text-lila">{geoMessage}</p> : null}
              <DeliveryMap latitude={checkout.latitud} longitude={checkout.longitud} onChange={(lat, lng) => setCheckout((current) => ({ ...current, latitud: lat, longitud: lng }))} />
              <p className="m-0 text-xs text-chocolate/65 dark:text-crema/65">Coordenadas: {checkout.latitud && checkout.longitud ? `${checkout.latitud.toFixed(6)}, ${checkout.longitud.toFixed(6)}` : 'Selecciona un punto en el mapa.'}</p>
            </Card>
          )}
        </form>

        <a className="mt-4" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={validateBeforeSend}>
          <Button className="w-full" variant="secondary" icon={<MessageCircle className="h-4 w-4" />}>Enviar pedido por WhatsApp</Button>
        </a>
      </aside>
    </div>
  );
}
