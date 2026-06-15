import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';

const eligible = [
  'Torta de Chocolate con Fudge Casero',
  'Torta Sublime con Maní',
  'Cheesecake de Maracuyá',
  'Carrot Cake',
  'Tres Leches',
  'Torta de Chocoteja con Pecanas',
];

export function PromotionsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Badge tone="warning">Exclusiva en Ica</Badge>
      <h1 className="m-0 mt-3 font-display text-5xl text-morado dark:text-lila">Promociones Kalú</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-morado text-white">
          <CardContent className="grid gap-4 p-6">
            <h2 className="m-0 font-display text-4xl">Cuchareables surtidos</h2>
            <div className="grid gap-3 text-lg font-extrabold">
              <div className="rounded-md bg-white/12 p-4">2 cuchareables surtidos → S/ 13.00</div>
              <div className="rounded-md bg-white/12 p-4">3 cuchareables surtidos → S/ 18.00</div>
            </div>
            <p className="m-0 text-white/80">Sabores a elección entre los cuchareables participantes. La promoción se calcula automáticamente en el carrito.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid gap-4 p-6">
            <div>
              <h2 className="m-0 text-xl font-extrabold text-ciruela dark:text-crema">Sí aplica para:</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {eligible.map((item) => <Badge key={item} tone="success">{item}</Badge>)}
              </div>
            </div>
            <div>
              <h2 className="m-0 text-xl font-extrabold text-ciruela dark:text-crema">No aplica para:</h2>
              <div className="mt-3"><Badge tone="danger">Torta de Pistacho</Badge></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
