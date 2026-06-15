import { useCallback, useEffect, useMemo, useState } from 'react';
import { kaluCategories, kaluProducts, type KaluCategory, type KaluCategoryId, type KaluProduct } from '../config/kaluCatalog';
import { obtenerCatalogoPublico, type ProductoCatalogoPublico } from '../lib/queries/productos';
import { supabase, supabaseConfig } from '../lib/supabase';
import { normalizarTexto } from '../lib/utils';

const fallbackImage = 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=85';

function categoryIdFromName(nombre: string): KaluCategoryId | null {
  const value = normalizarTexto(nombre);
  if (value.includes('cuchareable')) return 'cuchareables';
  if (value.includes('1/4')) return 'tortas-cuarto';
  if (value.includes('1 kg')) return 'tortas-kilo';
  if (value.includes('personalizada')) return 'personalizadas';
  if (value.includes('bocadito')) return 'bocaditos';
  if (value.includes('keke')) return 'kekes';
  return null;
}

function mapProduct(producto: ProductoCatalogoPublico): KaluProduct | null {
  const categoriaNombre = producto.categorias?.nombre ?? '';
  const categoriaId = categoryIdFromName(categoriaNombre);
  if (!categoriaId) return null;

  const principal = producto.imagenes_productos
    ?.filter((imagen) => imagen.principal)
    .sort((a, b) => a.orden - b.orden)[0] ?? producto.imagenes_productos?.[0];
  const consultable = categoriaId === 'personalizadas' || Number(producto.precio_venta) <= 0;
  const nombreNormalizado = normalizarTexto(producto.nombre);

  return {
    id: producto.slug || producto.id,
    nombre: producto.nombre,
    precio: consultable ? null : Number(producto.precio_venta),
    categoriaId,
    categoria: categoriaNombre,
    descripcion: producto.descripcion ?? '',
    imagen: principal?.url || fallbackImage,
    promoCuchareable: categoriaId === 'cuchareables' && !nombreNormalizado.includes('pistacho'),
    consultable,
    destacado: producto.destacado,
  };
}

export function useCatalogoPublico() {
  const [products, setProducts] = useState<KaluProduct[]>(kaluProducts);
  const [loading, setLoading] = useState(Boolean(supabaseConfig.isConfigured));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabaseConfig.isConfigured) {
      setProducts(kaluProducts);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const result = await obtenerCatalogoPublico();
    if (result.error) {
      setError(result.error);
      setProducts(kaluProducts);
    } else {
      const mapped = result.data.map(mapProduct).filter(Boolean) as KaluProduct[];
      setProducts(mapped.length ? mapped : kaluProducts);
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

  const categories = useMemo<KaluCategory[]>(() => kaluCategories, []);

  return { products, categories, loading, error, refetch: load };
}
