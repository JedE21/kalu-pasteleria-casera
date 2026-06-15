import { ImageUp, Loader2, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAsync } from '../../hooks/useAsync';
import { obtenerImagenesProductos, obtenerProductos, subirImagenProducto } from '../../lib/queries/productos';
import { supabaseConfig } from '../../lib/supabase';
import type { ImagenProducto, Producto } from '../../types/esquema';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Field, Input, Select } from '../ui/Input';
import { ErrorState, LoadingState } from '../ui/States';

function imagenPrincipal(producto: Producto | undefined, imagenes: ImagenProducto[]) {
  if (!producto) return null;
  return imagenes
    .filter((imagen) => imagen.producto_id === producto.id)
    .sort((a, b) => Number(b.principal) - Number(a.principal) || a.orden - b.orden)[0] ?? null;
}

export function ProductImageManager() {
  const productosState = useAsync(obtenerProductos, ['productos-imagenes']);
  const imagenesState = useAsync(obtenerImagenesProductos, ['imagenes-productos']);
  const productos = productosState.data?.data ?? [];
  const imagenes = imagenesState.data?.data ?? [];
  const [productoId, setProductoId] = useState('');
  const [uploading, setUploading] = useState(false);

  const selectedProduct = useMemo(() => productos.find((producto) => producto.id === productoId) ?? productos[0], [productoId, productos]);
  const selectedImage = imagenPrincipal(selectedProduct, imagenes);

  async function refresh() {
    await Promise.all([productosState.refetch(), imagenesState.refetch()]);
  }

  async function handleFile(file: File | undefined) {
    if (!file || !selectedProduct) return;
    if (!supabaseConfig.isConfigured) {
      toast.warning('Configura Supabase para subir imágenes reales.');
      return;
    }

    setUploading(true);
    try {
      await subirImagenProducto(selectedProduct, file);
      toast.success('Imagen referencial actualizada');
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo subir la imagen');
    } finally {
      setUploading(false);
    }
  }

  if (productosState.loading || imagenesState.loading) return <LoadingState label="Cargando imágenes de productos..." />;
  if (productosState.error) return <ErrorState message={productosState.error} onRetry={productosState.refetch} />;
  if (imagenesState.error) return <ErrorState message={imagenesState.error} onRetry={imagenesState.refetch} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagen referencial del producto</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1fr_280px] lg:items-start">
        <div className="grid gap-4">
          <Field label="Producto">
            <Select value={selectedProduct?.id ?? ''} onChange={(event) => setProductoId(event.target.value)}>
              {productos.map((producto) => <option key={producto.id} value={producto.id}>{producto.nombre}</option>)}
            </Select>
          </Field>
          <Field label="Subir imagen">
            <Input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => void handleFile(event.target.files?.[0])} />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="ghost" icon={<RefreshCw className="h-4 w-4" />} onClick={() => void refresh()}>Refrescar</Button>
            <Button type="button" disabled icon={uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}>
              {uploading ? 'Subiendo...' : 'La tienda se actualiza en tiempo real'}
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-md border border-lavanda/70 bg-white/70 dark:border-white/10 dark:bg-white/8">
          {selectedImage ? (
            <img className="aspect-square w-full object-cover" src={selectedImage.url} alt={selectedImage.alt_text ?? selectedProduct?.nombre ?? 'Producto Kalú'} />
          ) : (
            <div className="grid aspect-square place-items-center p-6 text-center text-sm font-semibold text-chocolate/60 dark:text-crema/60">
              Este producto todavía no tiene imagen principal.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
