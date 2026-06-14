import { demoProducciones } from '../demoData';
import type { Produccion } from '../../types/esquema';
import { deleteRow, insertRow, selectTable, updateRow } from './base';

export const obtenerProducciones = () => selectTable<Produccion>('producciones', demoProducciones, { column: 'created_at', ascending: false });
export const crearProduccion = (payload: Partial<Produccion>) => insertRow<Produccion>('producciones', payload);
export const editarProduccion = (id: string, payload: Partial<Produccion>) => updateRow<Produccion>('producciones', id, payload);
export const eliminarProduccion = (id: string) => deleteRow('producciones', id);
