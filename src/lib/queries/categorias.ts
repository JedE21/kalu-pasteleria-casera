import { demoCategorias } from '../demoData';
import type { Categoria, Subcategoria } from '../../types/esquema';
import { deleteRow, insertRow, selectTable, updateRow } from './base';
import { requireSupabase } from '../supabase';

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

export async function subirIconoCategoria(categoria: Categoria, archivo: File) {
  const client = requireSupabase() as any;
  const extension = archivo.name.split('.').pop()?.toLowerCase() || 'png';
  const safeName = categoria.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const path = `${categoria.id}/${Date.now()}-${safeName}.${extension}`;
  const { error: uploadError } = await client.storage
    .from('categorias')
    .upload(path, archivo, { cacheControl: '3600', upsert: true, contentType: archivo.type });

  if (uploadError) throw new Error(`storage.categorias: ${uploadError.message}`);

  const { data } = client.storage.from('categorias').getPublicUrl(path);
  const url = data.publicUrl as string;
  await editarCategoria(categoria.id, { icono: url });
  return url;
}
