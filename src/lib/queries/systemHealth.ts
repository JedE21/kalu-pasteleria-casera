import { columnasPrincipales, tablasContrato, vistasContrato } from '../../config/schemaContract';
import { demoSchema } from '../demoData';
import { safeQuery } from './base';
import { requireSupabase, supabaseConfig } from '../supabase';
import type { SchemaOverview, TablaContrato } from '../../types/esquema';

export async function obtenerSchemaOverview() {
  return safeQuery<SchemaOverview[]>('get_schema_overview', demoSchema, async () => {
    const client = requireSupabase();
    const { data, error } = await client.rpc('get_schema_overview');
    if (error) throw new Error(`get_schema_overview: ${error.message}`);
    return (data ?? []) as SchemaOverview[];
  });
}

export async function validarContratoSupabase() {
  const overview = await obtenerSchemaOverview();
  const objetos = new Map(overview.data.map((item) => [item.objeto, item]));
  const tablasFaltantes = tablasContrato.filter((tabla) => !objetos.has(tabla));
  const vistasFaltantes = vistasContrato.filter((vista) => !objetos.has(vista));
  const columnasFaltantes = tablasContrato.flatMap((tabla) => {
    const columnas = new Set((objetos.get(tabla)?.columnas ?? []).map((columna) => columna.columna));
    return columnasPrincipales[tabla].filter((columna) => !columnas.has(columna)).map((columna) => `${tabla}.${columna}`);
  });

  return {
    ...overview,
    configured: supabaseConfig.isConfigured,
    tablasFaltantes,
    vistasFaltantes,
    columnasFaltantes,
    healthy: tablasFaltantes.length === 0 && vistasFaltantes.length === 0 && columnasFaltantes.length === 0,
  };
}

export async function contarRegistros(tablas: TablaContrato[]) {
  if (!supabaseConfig.isConfigured) {
    return tablas.map((tabla) => ({ tabla, total: null, error: 'Modo demo' }));
  }
  const client = requireSupabase();
  return Promise.all(
    tablas.map(async (tabla) => {
      const { count, error } = await client.from(tabla).select('*', { count: 'exact', head: true });
      return { tabla, total: count, error: error?.message ?? null };
    }),
  );
}
