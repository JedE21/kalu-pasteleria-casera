import { toast } from 'sonner';
import { requireSupabase, supabaseConfig } from '../supabase';

export interface QueryResult<T> {
  data: T;
  error: string | null;
  fromDemo: boolean;
}

function logQuery(nombre: string, error: unknown) {
  console.error(`[Kalú Supabase] ${nombre}`, error);
}

export async function safeQuery<T>(nombre: string, fallback: T, run: () => Promise<T>): Promise<QueryResult<T>> {
  if (!supabaseConfig.isConfigured) {
    console.info(`[Kalú Supabase] ${nombre}: usando modo demo porque faltan variables de entorno.`);
    return { data: fallback, error: null, fromDemo: true };
  }

  try {
    return { data: await run(), error: null, fromDemo: false };
  } catch (error) {
    logQuery(nombre, error);
    const message = error instanceof Error ? error.message : 'Error desconocido al consultar Supabase.';
    toast.error(message);
    return { data: fallback, error: message, fromDemo: true };
  }
}

export async function selectTable<T>(tabla: string, fallback: T[], order?: { column: string; ascending?: boolean }) {
  return safeQuery<T[]>(tabla, fallback, async () => {
    const client = requireSupabase() as any;
    let query = client.from(tabla).select('*');
    if (order) query = query.order(order.column, { ascending: order.ascending ?? true });
    const { data, error } = await query;
    if (error) throw new Error(`${tabla}: ${error.message}`);
    return (data ?? []) as T[];
  });
}

export async function insertRow<T extends object>(tabla: string, payload: Partial<T>) {
  const client = requireSupabase() as any;
  const { data, error } = await client.from(tabla).insert(payload).select('*').single();
  if (error) throw new Error(`${tabla}: ${error.message}`);
  return data as T;
}

export async function updateRow<T extends object>(tabla: string, id: string, payload: Partial<T>) {
  const client = requireSupabase() as any;
  const { data, error } = await client.from(tabla).update(payload).eq('id', id).select('*').single();
  if (error) throw new Error(`${tabla}: ${error.message}`);
  return data as T;
}

export async function deleteRow(tabla: string, id: string) {
  const client = requireSupabase() as any;
  const { error } = await client.from(tabla).delete().eq('id', id);
  if (error) throw new Error(`${tabla}: ${error.message}`);
  return true;
}
