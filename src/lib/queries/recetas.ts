import { demoRecetas } from '../demoData';
import type { DetalleReceta, Receta } from '../../types/esquema';
import { deleteRow, insertRow, selectTable, updateRow } from './base';

export const obtenerRecetas = () => selectTable<Receta>('recetas', demoRecetas, { column: 'nombre' });
export const obtenerDetalleRecetas = () => selectTable<DetalleReceta>('detalle_recetas', []);
export const crearReceta = (payload: Partial<Receta>) => insertRow<Receta>('recetas', payload);
export const editarReceta = (id: string, payload: Partial<Receta>) => updateRow<Receta>('recetas', id, payload);
export const eliminarReceta = (id: string) => deleteRow('recetas', id);
export const crearDetalleReceta = (payload: Partial<DetalleReceta>) => insertRow<DetalleReceta>('detalle_recetas', payload);
