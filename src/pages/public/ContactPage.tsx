import { MessageCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Field, Input, Textarea } from '../../components/ui/Input';
import { LoadingState } from '../../components/ui/States';
import { obtenerConfiguracionEmpresa, obtenerSucursales } from '../../lib/queries/configuracion';
import { whatsappLink } from '../../lib/utils';
import { useAsync } from '../../hooks/useAsync';

export function ContactPage() {
  const { data, loading } = useAsync(async () => {
    const [config, sucursales] = await Promise.all([obtenerConfiguracionEmpresa(), obtenerSucursales()]);
    return { config, sucursales };
  }, []);

  if (loading || !data) return <main className="mx-auto max-w-7xl px-4 py-10"><LoadingState /></main>;

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-[0.8fr_1.2fr]">
      <section>
        <h1 className="m-0 font-display text-5xl text-morado dark:text-lila">Contacto</h1>
        <p className="mt-3 text-chocolate/70 dark:text-crema/70">Datos desde `configuracion_empresa` y `sucursales`.</p>
        <div className="mt-6 grid gap-3">
          {data.sucursales.data.map((sucursal) => (
            <Card key={sucursal.id}>
              <CardContent>
                <h2 className="m-0 text-lg font-extrabold text-ciruela dark:text-crema">{sucursal.nombre}</h2>
                <p className="m-0 mt-1 text-sm text-chocolate/70 dark:text-crema/70">{sucursal.direccion}, {sucursal.distrito}</p>
                <p className="m-0 mt-1 text-sm text-chocolate/70 dark:text-crema/70">{sucursal.horario_atencion}</p>
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
          <a href={whatsappLink(data.config.data.whatsapp, 'Hola Kalú, quiero información')} target="_blank" rel="noreferrer">
            <Button className="w-full" variant="secondary" icon={<MessageCircle className="h-4 w-4" />}>Enviar por WhatsApp</Button>
          </a>
        </CardContent>
      </Card>
    </main>
  );
}
