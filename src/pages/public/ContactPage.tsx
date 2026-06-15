import { MessageCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Field, Input, Textarea } from '../../components/ui/Input';
import { officialWhatsapp, pickupPoints } from '../../config/kaluCatalog';
import { whatsappLink } from '../../lib/utils';

export function ContactPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-[0.8fr_1.2fr]">
      <section>
        <h1 className="m-0 font-display text-5xl text-morado dark:text-lila">Contacto en Ica</h1>
        <p className="mt-3 text-chocolate/70 dark:text-crema/70">Pedidos programados, recojo en puntos de venta o delivery.</p>
        <div className="mt-6 grid gap-3">
          {pickupPoints.map((point) => (
            <Card key={point.id}>
              <CardContent>
                <h2 className="m-0 text-lg font-extrabold text-ciruela dark:text-crema">{point.nombre}</h2>
                <p className="m-0 mt-1 text-sm text-chocolate/70 dark:text-crema/70">{point.direccion}</p>
                <a className="mt-2 inline-block text-sm font-bold text-morado dark:text-lila" href={point.mapa} target="_blank" rel="noreferrer">Ver mapa</a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <Card>
        <CardContent className="grid gap-4">
          <Field label="Nombre"><Input placeholder="Tu nombre" /></Field>
          <Field label="Teléfono"><Input placeholder="Tu WhatsApp" /></Field>
          <Field label="Mensaje"><Textarea placeholder="Cuéntanos qué postre necesitas" /></Field>
          <a href={whatsappLink(officialWhatsapp, 'Hola Kalú, quiero información para un pedido en Ica')} target="_blank" rel="noreferrer">
            <Button className="w-full" variant="secondary" icon={<MessageCircle className="h-4 w-4" />}>Enviar por WhatsApp</Button>
          </a>
        </CardContent>
      </Card>
    </main>
  );
}
