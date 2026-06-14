import { demoCategorias } from '../demoData';
import type { Categoria, Subcategoria } from '../../types/esquema';
import { deleteRow, insertRow, selectTable, updateRow } from './base';

export async function obtenerCategorias() {
  return selectTable<Categoria>('categorias', demoCategorias, { column: 'orden' });
}

export async function obtenerSubcategorias() {
  return selectTable<Subcategoria>('subcategorias', [], { column: 'orden' });
}

export const crearCategoria = (payload: Partial<Categoria>) => insertRow<Categoria>('categorias', payload);
export const editarCategoria = (id: string, payload: Partial<Categoria>) => updateRow<Categoria>('categorias', id, payload);
export const eliminarCategoria = (id: string) => deleteRow('categorias', id);
export const crearSubcategoria = (payload: Partial<Subcategoria>) => insertRow<Subcategoria>('subcategorias', payload);
export const editarSubcategoria = (id: string, payload: Partial<Subcategoria>) => updateRow<Subcategoria>('subcategorias', id, payload);
export const eliminarSubcategoria = (id: string) => deleteRow('subcategorias', id);
