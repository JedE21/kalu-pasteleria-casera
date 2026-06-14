import { demoClientes } from '../demoData';
import type { Cliente, DireccionCliente } from '../../types/esquema';
import { deleteRow, insertRow, selectTable, updateRow } from './base';

export async function obtenerClientes() {
  return selectTable<Cliente>('clientes', demoClientes, { column: 'nombres' });
}

export async function obtenerDireccionesClientes() {
  return selectTable<DireccionCliente>('direcciones_clientes', []);
}

export const crearCliente = (payload: Partial<Cliente>) => insertRow<Cliente>('clientes', payload);
export const editarCliente = (id: string, payload: Partial<Cliente>) => updateRow<Cliente>('clientes', id, payload);
export const eliminarCliente = (id: string) => deleteRow('clientes', id);
export const crearDireccionCliente = (payload: Partial<DireccionCliente>) => insertRow<DireccionCliente>('direcciones_clientes', payload);
