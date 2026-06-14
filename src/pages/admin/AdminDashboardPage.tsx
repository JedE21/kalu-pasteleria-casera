import { AlertTriangle, CakeSlice, ShoppingBag, TrendingUp, Users, Wallet } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge, statusTone } from '../../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/Table';
import { StatCard } from '../../components/ui/StatCard';
import { LoadingState } from '../../components/ui/States';
import { obtenerDashboardCompleto } from '../../lib/queries/dashboard';
import { soles } from '../../lib/utils';
import { useAsync } from '../../hooks/useAsync';

export function AdminDashboardPage() {
  const { data, loading } = useAsync(obtenerDashboardCompleto, []);
  if (loading || !data) return <LoadingState />;

  const resumen = data.resumen.data;
  const pedidos = data.pedidos.data;
  const metricas = data.metricas.data;
  const insumosBajos = data.insumos.data.filter((item) => item.stock_actual <= item.stock_minimo);

  return (
    <section className="grid gap-5">
      <div>
        <h2 className="m-0 text-2xl font-extrabold text-ciruela dark:text-crema">Dashboard principal</h2>
        <p className="m-0 mt-1 text-sm text-chocolate/70 dark:text-crema/70">Usa `vista_resumen_dashboard`, `metricas_dashboard`, `vista_pedidos_detalle`, `vista_costeo_productos`, `insumos` y `alertas`.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Ventas acumuladas" value={soles(resumen.ventas_acumuladas)} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Pedidos" value={resumen.pedidos_acumulados} icon={<ShoppingBag className="h-4 w-4" />} />
        <StatCard label="Clientes" value={resumen.clientes_totales} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Gastos" value={soles(resumen.gastos_acumulados)} icon={<Wallet className="h-4 w-4" />} />
        <StatCard label="Alertas" value={resumen.alertas_pendientes} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Stock bajo" value={insumosBajos.length} icon={<CakeSlice className="h-4 w-4" />} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Ventas diarias</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ventas_totales" stroke="#7d4b98" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Ingresos vs gastos</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ventas_totales" fill="#7d4b98" />
                <Bar dataKey="gastos_totales" fill="#c79a48" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Pedidos recientes</CardTitle></CardHeader>
        <DataTable
          rows={pedidos}
          columns={[
            { header: 'Código', cell: (row) => row.codigo },
            { header: 'Cliente', cell: (row) => row.cliente ?? '-' },
            { header: 'Estado', cell: (row) => <Badge tone={statusTone(row.estado)}>{row.estado}</Badge> },
            { header: 'Canal', cell: (row) => <Badge tone={statusTone(row.canal)}>{row.canal}</Badge> },
            { header: 'Total', cell: (row) => soles(row.total) },
          ]}
        />
      </Card>
    </section>
  );
}
