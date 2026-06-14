import { demoUsuarios } from '../demoData';
import type { Permiso, Rol, RolPermiso, Usuario } from '../../types/esquema';
import { insertRow, selectTable, updateRow } from './base';

export const obtenerUsuarios = () => selectTable<Usuario>('usuarios', demoUsuarios, { column: 'nombres' });
export const obtenerRoles = () => selectTable<Rol>('roles', [], { column: 'nombre' });
export const obtenerPermisos = () => selectTable<Permiso>('permisos', [], { column: 'modulo' });
export const obtenerRolPermisos = () => selectTable<RolPermiso>('rol_permisos', []);
export const crearUsuario = (payload: Partial<Usuario>) => insertRow<Usuario>('usuarios', payload);
export const editarUsuario = (id: string, payload: Partial<Usuario>) => updateRow<Usuario>('usuarios', id, payload);
