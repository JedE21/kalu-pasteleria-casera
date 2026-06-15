import { Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { DataTable, type Column } from '../ui/Table';
import { Badge, statusTone } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Field, Input, Select, Textarea } from '../ui/Input';
import { ErrorState, LoadingState } from '../ui/States';
import { SearchBar } from '../ui/SearchBar';
import { normalizarTexto } from '../../lib/utils';
import { useAsync } from '../../hooks/useAsync';
import { supabaseConfig } from '../../lib/supabase';

export type FieldType = 'text' | 'number' | 'textarea' | 'boolean' | 'date' | 'datetime' | 'select';

type CrudRow = object & { id?: string };

export interface CrudField<T extends CrudRow> {
  name: keyof T & string;
  label: string;
  type?: FieldType;
  required?: boolean;
  readonly?: boolean;
  step?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  options?: Array<{ label: string; value: string }>;
}

export interface CrudModule<T extends CrudRow> {
  title: string;
  description: string;
  tableName: string;
  loader: () => Promise<{ data: T[]; error: string | null; fromDemo: boolean }>;
  create?: (payload: Partial<T>) => Promise<T>;
  update?: (id: string, payload: Partial<T>) => Promise<T>;
  remove?: (id: string) => Promise<boolean>;
  columns: Column<T>[];
  fields: CrudField<T>[];
}

export function AdminCrudPage<T extends CrudRow>({ module }: { module: CrudModule<T> }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);
  const { data, loading, error, refetch } = useAsync(module.loader, [module.tableName]);

  const rows = useMemo(() => (data?.data ?? []).filter((row) => normalizarTexto(JSON.stringify(row)).includes(normalizarTexto(search))), [data, search]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!module.create && !module.update) return;
    if (!supabaseConfig.isConfigured) {
      toast.warning('Configura Supabase para guardar cambios reales.');
      return;
    }
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(module.fields.filter((field) => !field.readonly).map((field) => {
      const raw = form.get(field.name);
      if (field.type === 'boolean') return [field.name, raw === 'true'];
      if (field.type === 'number') return [field.name, Number(raw || 0)];
      return [field.name, raw === '' ? null : raw];
    })) as Partial<T>;
    setSaving(true);
    try {
      if (editing?.id && module.update) {
        await module.update(editing.id, payload);
        toast.success(`${module.tableName}: registro actualizado`);
      } else if (module.create) {
        await module.create(payload);
        toast.success(`${module.tableName}: registro creado`);
      }
      setOpen(false);
      setEditing(null);
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo crear el registro');
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(row: T) {
    setEditing(row);
    setOpen(true);
  }

  async function handleDelete(row: T) {
    if (!module.remove || !row.id) return;
    if (!supabaseConfig.isConfigured) {
      toast.warning('Configura Supabase para eliminar cambios reales.');
      return;
    }
    try {
      await module.remove(row.id);
      toast.success(`${module.tableName}: registro eliminado`);
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo eliminar');
    }
  }

  const columns: Column<T>[] = [
    ...module.columns,
    {
      header: 'Acciones',
      cell: (row) => (
        <div className="flex gap-2">
          {module.update ? <Button variant="ghost" className="h-8 w-8 px-0" title="Editar" onClick={() => handleEdit(row)} icon={<Pencil className="h-4 w-4" />} /> : null}
          {module.remove ? <Button variant="ghost" className="h-8 w-8 px-0" title="Eliminar" onClick={() => void handleDelete(row)} icon={<Trash2 className="h-4 w-4" />} /> : null}
          {!module.update && !module.remove ? <Badge tone="default">Lectura</Badge> : null}
        </div>
      ),
    },
  ];

  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="m-0 text-xs font-extrabold uppercase text-morado dark:text-lila">{module.tableName}</p>
          <h2 className="m-0 text-2xl font-extrabold text-ciruela dark:text-crema">{module.title}</h2>
          <p className="m-0 mt-1 text-sm text-chocolate/70 dark:text-crema/70">{module.description}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar registros" />
          <Button variant="ghost" icon={<RefreshCw className="h-4 w-4" />} onClick={refetch}>Refrescar</Button>
          {module.create ? <Button icon={<Plus className="h-4 w-4" />} onClick={() => { setEditing(null); setOpen(true); }}>Nuevo</Button> : null}
        </div>
      </div>
      {data?.fromDemo ? <Card className="border-dorado/60 bg-dorado/10 p-3 text-sm font-semibold text-chocolate dark:text-crema">Modo demo: conecta Supabase para CRUD real con RLS.</Card> : null}
      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={refetch} /> : <DataTable columns={columns} rows={rows} />}
      <Modal open={open} title={`${editing ? 'Editar' : 'Nuevo'} registro en ${module.tableName}`} onClose={() => { setOpen(false); setEditing(null); }}>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {module.fields.map((field) => (
            <Field key={field.name} label={field.label}>
              {field.type === 'textarea' ? <Textarea name={field.name} required={field.required} readOnly={field.readonly} defaultValue={String((editing as Record<string, unknown> | null)?.[field.name] ?? '')} /> : field.type === 'boolean' ? (
                <Select name={field.name} defaultValue={String((editing as Record<string, unknown> | null)?.[field.name] ?? true)}>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </Select>
              ) : field.type === 'select' ? (
                <Select name={field.name} required={field.required} defaultValue={String((editing as Record<string, unknown> | null)?.[field.name] ?? '')}>
                  <option value="">Seleccionar</option>
                  {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </Select>
              ) : (
                <Input
                  name={field.name}
                  type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'datetime' ? 'datetime-local' : 'text'}
                  step={field.type === 'number' ? field.step ?? '0.01' : undefined}
                  inputMode={field.type === 'number' ? field.inputMode ?? 'decimal' : undefined}
                  required={field.required}
                  readOnly={field.readonly}
                  defaultValue={String((editing as Record<string, unknown> | null)?.[field.name] ?? '')}
                />
              )}
            </Field>
          ))}
          <Button disabled={saving}>{saving ? 'Guardando...' : editing ? 'Actualizar' : 'Guardar'}</Button>
        </form>
      </Modal>
    </section>
  );
}

export function textColumn<T extends object>(key: keyof T & string, header: string): Column<T> {
  return { header, cell: (row) => <span>{String((row as Record<string, unknown>)[key] ?? '-')}</span> };
}

export function moneyColumn<T extends object>(key: keyof T & string, header: string): Column<T> {
  return { header, cell: (row) => <strong>S/ {Number((row as Record<string, unknown>)[key] ?? 0).toFixed(2)}</strong> };
}

export function badgeColumn<T extends object>(key: keyof T & string, header: string): Column<T> {
  return { header, cell: (row) => <Badge tone={statusTone((row as Record<string, unknown>)[key] as string)}>{String((row as Record<string, unknown>)[key] ?? '-')}</Badge> };
}
