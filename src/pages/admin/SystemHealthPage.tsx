import { Activity, CheckCircle2, Database, XCircle } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/Table';
import { StatCard } from '../../components/ui/StatCard';
import { LoadingState } from '../../components/ui/States';
import { tablasContrato, vistasContrato } from '../../config/schemaContract';
import { supabaseConfig } from '../../lib/supabase';
import { contarRegistros, validarContratoSupabase } from '../../lib/queries/systemHealth';
import { useAsync } from '../../hooks/useAsync';

export function SystemHealthPage() {
  const { data, loading } = useAsync(async () => {
    const contrato = await validarContratoSupabase();
    const conteos = await contarRegistros(['productos', 'pedidos', 'clientes', 'insumos', 'pagos', 'entregas', 'producciones', 'recetas']);
    return { contrato, conteos };
  }, []);

  const objetos = useMemo(() => data?.contrato.data ?? [], [data]);
  if (loading || !data) return <LoadingState label="Validando contrato Supabase..." />;

  return (
    <section className="grid gap-5">
      <div>
        <h2 className="m-0 text-2xl font-extrabold text-ciruela dark:text-crema">System Health</h2>
        <p className="m-0 mt-1 text-sm text-chocolate/70 dark:text-crema/70">Prueba conexión, RPC `get_schema_overview`, tablas, vistas y variables de entorno.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="Supabase URL" value={supabaseConfig.url ? 'Configurada' : 'Falta'} icon={supabaseConfig.url ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} />
        <StatCard label="Anon key" value={supabaseConfig.anonKey ? 'Configurada' : 'Falta'} icon={supabaseConfig.anonKey ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} />
        <StatCard label="Tablas contrato" value={`${tablasContrato.length - data.contrato.tablasFaltantes.length}/${tablasContrato.length}`} icon={<Database className="h-4 w-4" />} />
        <StatCard label="Estado" value={data.contrato.healthy ? 'OK' : 'Revisar'} icon={<Activity className="h-4 w-4" />} />
      </div>
      <Card>
        <CardHeader><CardTitle>Validación del contrato</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone={data.contrato.tablasFaltantes.length ? 'danger' : 'success'}>Tablas faltantes: {data.contrato.tablasFaltantes.length}</Badge>
            <Badge tone={data.contrato.vistasFaltantes.length ? 'danger' : 'success'}>Vistas faltantes: {data.contrato.vistasFaltantes.length}</Badge>
            <Badge tone={data.contrato.columnasFaltantes.length ? 'danger' : 'success'}>Columnas faltantes: {data.contrato.columnasFaltantes.length}</Badge>
            <Badge tone={data.contrato.fromDemo ? 'warning' : 'success'}>{data.contrato.fromDemo ? 'Modo demo' : 'Supabase real'}</Badge>
          </div>
          {data.contrato.tablasFaltantes.length || data.contrato.vistasFaltantes.length || data.contrato.columnasFaltantes.length ? (
            <pre className="overflow-auto rounded-md bg-cacao p-4 text-xs text-crema">{JSON.stringify({ tablasFaltantes: data.contrato.tablasFaltantes, vistasFaltantes: data.contrato.vistasFaltantes, columnasFaltantes: data.contrato.columnasFaltantes }, null, 2)}</pre>
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Tablas y vistas detectadas</CardTitle></CardHeader>
        <DataTable
          rows={objetos}
          columns={[
            { header: 'Objeto', cell: (row) => row.objeto },
            { header: 'Tipo', cell: (row) => <Badge tone={row.tipo === 'tabla' ? 'info' : 'warning'}>{row.tipo}</Badge> },
            { header: 'Columnas', cell: (row) => row.total_columnas },
          ]}
        />
      </Card>
      <Card>
        <CardHeader><CardTitle>Conteo de registros</CardTitle></CardHeader>
        <DataTable rows={data.conteos} columns={[{ header: 'Tabla', cell: (row) => row.tabla }, { header: 'Total', cell: (row) => row.total ?? '-' }, { header: 'Error', cell: (row) => row.error ?? 'OK' }]} />
      </Card>
      <Card>
        <CardHeader><CardTitle>Vistas requeridas</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {vistasContrato.map((vista) => <Badge key={vista} tone={objetos.some((objeto) => objeto.objeto === vista) ? 'success' : 'danger'}>{vista}</Badge>)}
        </CardContent>
      </Card>
    </section>
  );
}
