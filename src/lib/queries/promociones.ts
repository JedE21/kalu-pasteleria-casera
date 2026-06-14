import { demoPromociones } from '../demoData';
import type { Promocion, ReglaPromocion } from '../../types/esquema';
import { deleteRow, insertRow, selectTable, updateRow } from './base';

export async function obtenerPromociones() {
  return selectTable<Promocion>('promociones', demoPromociones, { column: 'fecha_fin' });
}

export async function obtenerReglasPromocion() {
  return selectTable<ReglaPromocion>('reglas_promocion', []);
}

export const crearPromocion = (payload: Partial<Promocion>) => insertRow<Promocion>('promociones', payload);
export const editarPromocion = (id: string, payload: Partial<Promocion>) => updateRow<Promocion>('promociones', id, payload);
export const eliminarPromocion = (id: string) => deleteRow('promociones', id);
export const crearReglaPromocion = (payload: Partial<ReglaPromocion>) => insertRow<ReglaPromocion>('reglas_promocion', payload);
