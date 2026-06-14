import { z } from 'zod';

export const categoriaSchema = z.object({
  nombre: z.string().min(2),
  descripcion: z.string().nullable().optional(),
  icono: z.string().nullable().optional(),
  orden: z.coerce.number().int().default(0),
  activa: z.boolean().default(true),
});

export const promocionSchema = z.object({
  nombre: z.string().min(3),
  descripcion: z.string().nullable().optional(),
  codigo: z.string().nullable().optional(),
  tipo_descuento: z.enum(['porcentaje', 'monto_fijo', 'envio_gratis']),
  valor: z.coerce.number().min(0),
  fecha_inicio: z.string().min(1),
  fecha_fin: z.string().min(1),
  activa: z.boolean().default(true),
});

export const clienteSchema = z.object({
  nombres: z.string().min(2),
  apellidos: z.string().nullable().optional(),
  documento_tipo: z.string().nullable().optional(),
  documento_numero: z.string().nullable().optional(),
  email: z.string().email().nullable().optional().or(z.literal('')),
  telefono: z.string().nullable().optional(),
  fecha_nacimiento: z.string().nullable().optional(),
  notas: z.string().nullable().optional(),
  activo: z.boolean().default(true),
});
