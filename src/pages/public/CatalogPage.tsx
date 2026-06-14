import { useMemo, useState } from 'react';
import { ProductCard } from '../../components/public/ProductCard';
import { Select } from '../../components/ui/Input';
import { SearchBar } from '../../components/ui/SearchBar';
import { LoadingState } from '../../components/ui/States';
import { obtenerCategorias } from '../../lib/queries/categorias';
import { obtenerImagenesProductos, obtenerProductos } from '../../lib/queries/productos';
import { normalizarTexto } from '../../lib/utils';
import { useAsync } from '../../hooks/useAsync';

export function CatalogPage() {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [precio, setPrecio] = useState('todos');
  const { data, loading } = useAsync(async () => {
    const [productos, imagenes, categorias] = await Promise.all([obtenerProductos(), obtenerImagenesProductos(), obtenerCategorias()]);
    return { productos, imagenes, categorias };
  }, []);

  const imagenes = useMemo(() => new Map((data?.imagenes.data ?? []).filter((item) => item.principal).map((item) => [item.producto_id, item])), [data]);
  const productos = useMemo(() => (data?.productos.data ?? []).filter((producto) => {
    const matchesSearch = normalizarTexto(producto.nombre).includes(normalizarTexto(search));
    const matchesCategoria = categoria === 'todas' || producto.categoria_id === categoria;
    const matchesPrecio = precio === 'todos' || (precio === 'menor100' ? producto.precio_venta < 100 : producto.precio_venta >= 100);
    return producto.disponible && matchesSearch && matchesCategoria && matchesPrecio;
  }), [data, search, categoria, precio]);

  if (loading || !data) return <main className="mx-auto max-w-7xl px-4 py-10"><LoadingState /></main>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6">
        <h1 className="m-0 font-display text-5xl text-morado dark:text-lila">Catálogo Kalú</h1>
        <p className="mt-2 text-chocolate/70 dark:text-crema/70">Productos desde `productos`, filtros por `categorias` e imágenes desde `imagenes_productos`.</p>
      </div>
      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_220px_220px]">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre" />
        <Select value={categoria} onChange={(event) => setCategoria(event.target.value)}>
          <option value="todas">Todas las categorías</option>
          {data.categorias.data.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
        </Select>
        <Select value={precio} onChange={(event) => setPrecio(event.target.value)}>
          <option value="todos">Todos los precios</option>
          <option value="menor100">Menos de S/ 100</option>
          <option value="mayor100">S/ 100 o más</option>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {productos.map((producto) => <ProductCard key={producto.id} producto={producto} imagen={imagenes.get(producto.id)} />)}
      </div>
    </main>
  );
}
