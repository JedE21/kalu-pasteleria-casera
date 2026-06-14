import { demoInsumos, demoMovimientos, demoProveedores } from '../demoData';
import type { Compra, DetalleCompra, Insumo, MovimientoInventario, Proveedor } from '../../types/esquema';
import { deleteRow, insertRow, selectTable, updateRow } from './base';

export const obtenerInsumos = () => selectTable<Insumo>('insumos', demoInsumos, { column: 'nombre' });
export const obtenerMovimientosInventario = () => selectTable<MovimientoInventario>('movimientos_inventario', demoMovimientos, { column: 'fecha', ascending: false });
export const obtenerProveedores = () => selectTable<Proveedor>('proveedores', demoProveedores, { column: 'nombre' });
export const obtenerCompras = () => selectTable<Compra>('compras', [], { column: 'fecha', ascending: false });
export const obtenerDetalleCompras = () => selectTable<DetalleCompra>('detalle_compras', []);

export const crearInsumo = (payload: Partial<Insumo>) => insertRow<Insumo>('insumos', payload);
export const editarInsumo = (id: string, payload: Partial<Insumo>) => updateRow<Insumo>('insumos', id, payload);
export const eliminarInsumo = (id: string) => deleteRow('insumos', id);
export const crearMovimientoInventario = (payload: Partial<MovimientoInventario>) => insertRow<MovimientoInventario>('movimientos_inventario', payload);
export const crearProveedor = (payload: Partial<Proveedor>) => insertRow<Proveedor>('proveedores', payload);
export const crearCompra = (payload: Partial<Compra>) => insertRow<Compra>('compras', payload);
