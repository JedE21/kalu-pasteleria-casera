import { z } from 'zod';
import { slugify } from '../utils';

export const productoSchema = z.object({
  categoria_id: z.string().nullable().optional(),
  subcategoria_id: z.string().nullable().optional(),
  nombre: z.string().min(3, 'Nombre requerido'),
  slug: z.string().optional(),
  descripcion: z.string().nullable().optional(),
  precio_venta: z.coerce.number().min(0),
  costo_unitario: z.coerce.number().min(0),
  stock_actual: z.coerce.number().int().min(0).default(0),
  stock_minimo: z.coerce.number().int().min(0).default(0),
  disponible: z.boolean().default(true),
  destacado: z.boolean().default(false),
  tiempo_preparacion_min: z.coerce.number().int().min(0).default(60),
}).transform((data) => ({ ...data, slug: data.slug || slugify(data.nombre) }));

export type ProductoFormValues = z.input<typeof productoSchema>;
