import { useMemo, useState } from 'react';
import { KaluProductCard } from '../../components/public/KaluProductCard';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Input';
import { SearchBar } from '../../components/ui/SearchBar';
import { ErrorState, LoadingState } from '../../components/ui/States';
import type { KaluCategoryId } from '../../config/kaluCatalog';
import { useCatalogoPublico } from '../../hooks/useCatalogoPublico';
import { normalizarTexto } from '../../lib/utils';

export function CatalogPage() {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState<KaluCategoryId | 'todas'>('todas');
  const [precio, setPrecio] = useState('todos');
  const { products: catalogProducts, categories: kaluCategories, loading, error, refetch } = useCatalogoPublico();

  const productos = useMemo(() => catalogProducts.filter((producto) => {
    const matchesSearch = normalizarTexto(producto.nombre).includes(normalizarTexto(search));
    const matchesCategoria = categoria === 'todas' || producto.categoriaId === categoria;
    const price = producto.precio ?? 0;
    const matchesPrecio = precio === 'todos' || (precio === 'menor10' ? price > 0 && price < 10 : price >= 10);
    return matchesSearch && matchesCategoria && matchesPrecio;
  }), [catalogProducts, search, categoria, precio]);

  const grouped = kaluCategories.map((category) => ({
    category,
    products: productos.filter((product) => product.categoriaId === category.id),
  })).filter((group) => group.products.length);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Badge tone="warning">Ica, Perú</Badge>
          <h1 className="m-0 mt-3 font-display text-5xl text-morado dark:text-lila">Productos Kalú</h1>
          <p className="mt-2 max-w-2xl text-chocolate/70 dark:text-crema/70">Cuchareables, tortas y bocaditos con recojo en La Tinguiña u Oechsle de Ica, o delivery con ubicación en mapa.</p>
        </div>
      </div>
      <div className="mb-8 grid gap-3 md:grid-cols-[1fr_240px_220px]">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre completo" />
        <Select value={categoria} onChange={(event) => setCategoria(event.target.value as KaluCategoryId | 'todas')}>
          <option value="todas">Todas las categorías</option>
          {kaluCategories.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
        </Select>
        <Select value={precio} onChange={(event) => setPrecio(event.target.value)}>
          <option value="todos">Todos los precios</option>
          <option value="menor10">Menos de S/ 10</option>
          <option value="mayor10">S/ 10 o más</option>
        </Select>
      </div>
      <div className="grid gap-10">
        {loading ? <LoadingState label="Cargando catálogo Kalú..." /> : null}
        {error ? <ErrorState message={error} onRetry={refetch} /> : null}
        {grouped.map(({ category, products }) => (
          <section key={category.id}>
            <div className="mb-4">
              <h2 className="m-0 font-display text-3xl text-ciruela dark:text-crema">{category.nombre}</h2>
              <p className="m-0 mt-1 text-sm text-chocolate/70 dark:text-crema/70">{category.descripcion}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => <KaluProductCard key={product.id} product={product} />)}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
