import { useCallback, useEffect, useMemo, useState } from 'react';
import { kaluCategories, kaluProducts, type KaluCategory, type KaluCategoryId, type KaluProduct } from '../config/kaluCatalog';
import { obtenerCategorias } from '../lib/queries/categorias';
import { obtenerCatalogoPublico, type ProductoCatalogoPublico } from '../lib/queries/productos';
import { supabase, supabaseConfig } from '../lib/supabase';
import { normalizarTexto, slugify } from '../lib/utils';

const fallbackImage = 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=85';

function categoryIdFromName(nombre: string): KaluCategoryId | null {
  const value = normalizarTexto(nombre);
  if (value.includes('cuchareable')) return 'cuchareables';
  if (value.includes('1/4')) return 'tortas-cuarto';
  if (value.includes('1 kg')) return 'tortas-kilo';
  if (value.includes('personalizada')) return 'personalizadas';
  if (value.includes('bocadito')) return 'bocaditos';
  if (value.includes('keke')) return 'kekes';
  return slugify(nombre);
}

function mapProduct(producto: ProductoCatalogoPublico): KaluProduct | null {
  const categoriaNombre = producto.categorias?.nombre ?? '';
  const categoriaId = producto.categorias?.id ?? categoryIdFromName(categoriaNombre);
  if (!categoriaId) return null;

  const principal = producto.imagenes_productos
    ?.filter((imagen) => imagen.principal)
    .sort((a, b) => a.orden - b.orden)[0] ?? producto.imagenes_productos?.[0];
  const categoriaNormalizada = normalizarTexto(categoriaNombre);
  const consultable = categoriaNormalizada.includes('personalizada') || Number(producto.precio_venta) <= 0;
  const nombreNormalizado = normalizarTexto(producto.nombre);
  const ofertaFechaFin = producto.oferta_fecha_fin ?? null;
  const ofertaActiva = Boolean(producto.oferta_activa && ofertaFechaFin && new Date(ofertaFechaFin).getTime() > Date.now());

  return {
    id: producto.slug || producto.id,
    nombre: producto.nombre,
    precio: consultable ? null : Number(producto.precio_venta),
    categoriaId,
    categoria: categoriaNombre,
    descripcion: producto.descripcion ?? '',
    imagen: principal?.url || fallbackImage,
    promoCuchareable: categoriaNormalizada.includes('cuchareable') && !nombreNormalizado.includes('pistacho'),
    consultable,
    destacado: producto.destacado,
    stock: Number(producto.stock_actual ?? 0),
    ofertaActiva,
    ofertaPrecio: producto.oferta_precio !== null ? Number(producto.oferta_precio) : null,
    ofertaFechaFin,
  };
}

export function useCatalogoPublico() {
  const [products, setProducts] = useState<KaluProduct[]>(kaluProducts);
  const [categories, setCategories] = useState<KaluCategory[]>(kaluCategories);
  const [loading, setLoading] = useState(Boolean(supabaseConfig.isConfigured));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabaseConfig.isConfigured) {
      setProducts(kaluProducts);
      setCategories(kaluCategories);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const [productsResult, categoriesResult] = await Promise.all([
      obtenerCatalogoPublico(),
      obtenerCategorias(),
    ]);
    if (productsResult.error || categoriesResult.error) {
      setError(productsResult.error ?? categoriesResult.error);
      setProducts(kaluProducts);
      setCategories(kaluCategories);
    } else {
      const mapped = productsResult.data.map(mapProduct).filter(Boolean) as KaluProduct[];
      const mappedCategories = categoriesResult.data
        .filter((categoria) => categoria.activa)
        .map((categoria) => ({
          id: categoria.id,
          nombre: categoria.nombre,
          descripcion: categoria.descripcion ?? '',
        }));
      setProducts(mapped.length ? mapped : kaluProducts);
      setCategories(mappedCategories.length ? mappedCategories : kaluCategories);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const client = supabase;
    if (!client) return undefined;
    const channel = client
      .channel('catalogo-publico-kalu')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'imagenes_productos' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categorias' }, () => void load())
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [load]);

  return { products, categories, loading, error, refetch: load };
}
