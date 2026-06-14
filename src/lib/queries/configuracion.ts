import { demoConfiguracion, demoSucursales } from '../demoData';
import type { ConfiguracionEmpresa, Sucursal } from '../../types/esquema';
import { insertRow, safeQuery, selectTable, updateRow } from './base';
import { requireSupabase } from '../supabase';

export async function obtenerConfiguracionEmpresa() {
  return safeQuery<ConfiguracionEmpresa>('configuracion_empresa', demoConfiguracion, async () => {
    const client = requireSupabase();
    const { data, error } = await client.from('configuracion_empresa').select('*').limit(1).single();
    if (error) throw new Error(`configuracion_empresa: ${error.message}`);
    return data as ConfiguracionEmpresa;
  });
}

export const obtenerSucursales = () => selectTable<Sucursal>('sucursales', demoSucursales, { column: 'nombre' });
export const editarConfiguracionEmpresa = (id: string, payload: Partial<ConfiguracionEmpresa>) => updateRow<ConfiguracionEmpresa>('configuracion_empresa', id, payload);
export const crearSucursal = (payload: Partial<Sucursal>) => insertRow<Sucursal>('sucursales', payload);
export const editarSucursal = (id: string, payload: Partial<Sucursal>) => updateRow<Sucursal>('sucursales', id, payload);
