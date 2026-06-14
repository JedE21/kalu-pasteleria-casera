import { Card, CardContent } from '../../components/ui/Card';

export function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <Card>
        <CardContent className="p-8 md:p-12">
          <h1 className="m-0 font-display text-5xl text-morado dark:text-lila">Sobre Kalú</h1>
          <p className="mt-5 text-lg leading-8 text-chocolate/75 dark:text-crema/75">
            Kalú Pastelería Casera nace para unir recetas caseras, presentación premium y atención cercana. Cada torta, cupcake y postre se prepara pensando en celebraciones reales: cumpleaños, reuniones familiares, detalles de oficina y momentos que merecen algo bonito.
          </p>
          <p className="text-lg leading-8 text-chocolate/75 dark:text-crema/75">
            La operación está conectada a un dashboard administrativo para mantener catálogo, promociones, producción, inventario y pedidos sincronizados con la web pública.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
