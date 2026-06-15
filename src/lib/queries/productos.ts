import { demoImagenes, demoProductos, demoVariantes } from '../demoData';
import type { Categoria, ImagenProducto, Producto, VarianteProducto } from '../../types/esquema';
import { deleteRow, insertRow, safeQuery, selectTable, updateRow } from './base';
import { requireSupabase } from '../supabase';

export async function obtenerProductos() {
  return selectTable<Producto>('productos', demoProductos, { column: 'nombre' });
}

export async function obtenerProductosDestacados() {
  return safeQuery<Producto[]>('productos.destacado', demoProductos.filter((producto) => producto.destacado), async () => {
    const client = requireSupabase();
    const { data, error } = await client.from('productos').select('*').eq('disponible', true).eq('destacado', true).order('nombre');
    if (error) throw new Error(`productos: ${error.message}`);
    return (data ?? []) as Producto[];
  });
}

export async function obtenerProductoPorId(id: string) {
  return safeQuery<Producto | null>('productos.detalle', demoProductos.find((producto) => producto.id === id) ?? null, async () => {
    const client = requireSupabase();
    const { data, error } = await client.from('productos').select('*').eq('id', id).single();
    if (error) throw new Error(`productos: ${error.message}`);
    return data as Producto;
  });
}

export async function obtenerImagenesProductos() {
  return selectTable<ImagenProducto>('imagenes_productos', demoImagenes, { column: 'orden' });
}

export async function obtenerVariantesProducto(productoId?: string) {
  return safeQuery<VarianteProducto[]>('variantes_productos', productoId ? demoVariantes.filter((item) => item.producto_id === productoId) : demoVariantes, async () => {
    const client = requireSupabase();
    let query = client.from('variantes_productos').select('*').order('nombre');
    if (productoId) query = query.eq('producto_id', productoId);
    const { data, error } = await query;
    if (error) throw new Error(`variantes_productos: ${error.message}`);
    return (data ?? []) as VarianteProducto[];
  });
}

export const crearProducto = (payload: Partial<Producto>) => insertRow<Producto>('productos', payload);
export const editarProducto = (id: string, payload: Partial<Producto>) => updateRow<Producto>('productos', id, payload);
export const eliminarProducto = (id: string) => deleteRow('productos', id);
export const crearImagenProducto = (payload: Partial<ImagenProducto>) => insertRow<ImagenProducto>('imagenes_productos', payload);
export const crearVarianteProducto = (payload: Partial<VarianteProducto>) => insertRow<VarianteProducto>('variantes_productos', payload);

export interface ProductoCatalogoPublico extends Producto {
  categorias?: Pick<Categoria, 'id' | 'nombre' | 'descripcion' | 'orden'> | null;
  imagenes_productos?: ImagenProducto[];
}

export async function obtenerCatalogoPublico() {
  return safeQuery<ProductoCatalogoPublico[]>('catalogo.publico', [], async () => {
    const client = requireSupabase() as any;
    const { data, error } = await client
      .from('productos')
      .select('*, categorias(id,nombre,descripcion,orden), imagenes_productos(id,producto_id,url,alt_text,orden,principal)')
      .eq('disponible', true)
      .order('destacado', { ascending: false })
      .order('nombre');

    if (error) throw new Error(`catalogo.publico: ${error.message}`);
    return (data ?? []) as ProductoCatalogoPublico[];
  });
}

export async function subirImagenProducto(producto: Producto, archivo: File) {
  const client = requireSupabase() as any;
  const extension = archivo.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${producto.id}/${Date.now()}-${producto.slug}.${extension}`;
  const { error: uploadError } = await client.storage
    .from('productos')
    .upload(path, archivo, { cacheControl: '3600', upsert: true, contentType: archivo.type });

  if (uploadError) throw new Error(`storage.productos: ${uploadError.message}`);

  const { data } = client.storage.from('productos').getPublicUrl(path);
  const url = data.publicUrl as string;

  await marcarImagenPrincipalProducto(producto.id, url, producto.nombre);
  return url;
}

export async function marcarImagenPrincipalProducto(productoId: string, url: string, altText: string) {
  const client = requireSupabase() as any;
  const { error: updateError } = await client
    .from('imagenes_productos')
    .update({ principal: false })
    .eq('producto_id', productoId);

  if (updateError) throw new Error(`imagenes_productos: ${updateError.message}`);

  const { data, error } = await client
    .from('imagenes_productos')
    .insert({ producto_id: productoId, url, alt_text: altText, orden: 1, principal: true })
    .select('*')
    .single();

  if (error) throw new Error(`imagenes_productos: ${error.message}`);
  return data as ImagenProducto;
}
