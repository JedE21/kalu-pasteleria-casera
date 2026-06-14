import { demoEntregas, demoRepartidores } from '../demoData';
import type { Entrega, Repartidor } from '../../types/esquema';
import { deleteRow, insertRow, selectTable, updateRow } from './base';

export const obtenerEntregas = () => selectTable<Entrega>('entregas', demoEntregas, { column: 'created_at', ascending: false });
export const obtenerRepartidores = () => selectTable<Repartidor>('repartidores', demoRepartidores, { column: 'nombres' });
export const crearEntrega = (payload: Partial<Entrega>) => insertRow<Entrega>('entregas', payload);
export const editarEntrega = (id: string, payload: Partial<Entrega>) => updateRow<Entrega>('entregas', id, payload);
export const eliminarEntrega = (id: string) => deleteRow('entregas', id);
export const crearRepartidor = (payload: Partial<Repartidor>) => insertRow<Repartidor>('repartidores', payload);
export const editarRepartidor = (id: string, payload: Partial<Repartidor>) => updateRow<Repartidor>('repartidores', id, payload);
