import { ImageUp, Loader2, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAsync } from '../../hooks/useAsync';
import { obtenerCategorias, subirIconoCategoria } from '../../lib/queries/categorias';
import { supabaseConfig } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Field, Input, Select } from '../ui/Input';
import { ErrorState, LoadingState } from '../ui/States';

export function CategoryIconManager() {
  const categoriasState = useAsync(obtenerCategorias, ['categorias-iconos']);
  const categorias = categoriasState.data?.data ?? [];
  const [categoriaId, setCategoriaId] = useState('');
  const [uploading, setUploading] = useState(false);
  const selectedCategory = useMemo(() => categorias.find((categoria) => categoria.id === categoriaId) ?? categorias[0], [categoriaId, categorias]);

  async function handleFile(file: File | undefined) {
    if (!file || !selectedCategory) return;
    if (!supabaseConfig.isConfigured) {
      toast.warning('Configura Supabase para subir iconos reales.');
      return;
    }

    setUploading(true);
    try {
      await subirIconoCategoria(selectedCategory, file);
      toast.success('Icono de categoría actualizado');
      await categoriasState.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo subir el icono');
    } finally {
      setUploading(false);
    }
  }

  if (categoriasState.loading) return <LoadingState label="Cargando iconos de categorías..." />;
  if (categoriasState.error) return <ErrorState message={categoriasState.error} onRetry={categoriasState.refetch} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Icono de categoría</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1fr_180px] lg:items-start">
        <div className="grid gap-4">
          <Field label="Categoría">
            <Select value={selectedCategory?.id ?? ''} onChange={(event) => setCategoriaId(event.target.value)}>
              {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>)}
            </Select>
          </Field>
          <Field label="Subir icono">
            <Input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(event) => void handleFile(event.target.files?.[0])} />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="ghost" icon={<RefreshCw className="h-4 w-4" />} onClick={() => void categoriasState.refetch()}>Refrescar</Button>
            <Button type="button" disabled icon={uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}>
              {uploading ? 'Subiendo...' : 'Guardar icono en categoría'}
            </Button>
          </div>
        </div>
        <div className="grid aspect-square place-items-center overflow-hidden rounded-md border border-lavanda/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/8">
          {selectedCategory?.icono?.startsWith('http') ? (
            <img className="h-full w-full object-contain" src={selectedCategory.icono} alt={`Icono ${selectedCategory.nombre}`} />
          ) : (
            <span className="text-center text-sm font-semibold text-chocolate/60 dark:text-crema/60">{selectedCategory?.icono || 'Sin icono'}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
