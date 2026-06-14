import { demoGastos, demoIngresos, demoMetodosPago, demoPagos } from '../demoData';
import type { Gasto, Ingreso, MetodoPago, Pago } from '../../types/esquema';
import { deleteRow, insertRow, selectTable, updateRow } from './base';

export const obtenerPagos = () => selectTable<Pago>('pagos', demoPagos, { column: 'created_at', ascending: false });
export const obtenerMetodosPago = () => selectTable<MetodoPago>('metodos_pago', demoMetodosPago, { column: 'nombre' });
export const obtenerIngresos = () => selectTable<Ingreso>('ingresos', demoIngresos, { column: 'fecha', ascending: false });
export const obtenerGastos = () => selectTable<Gasto>('gastos', demoGastos, { column: 'fecha', ascending: false });

export const crearPago = (payload: Partial<Pago>) => insertRow<Pago>('pagos', payload);
export const editarPago = (id: string, payload: Partial<Pago>) => updateRow<Pago>('pagos', id, payload);
export const crearIngreso = (payload: Partial<Ingreso>) => insertRow<Ingreso>('ingresos', payload);
export const crearGasto = (payload: Partial<Gasto>) => insertRow<Gasto>('gastos', payload);
export const eliminarGasto = (id: string) => deleteRow('gastos', id);
