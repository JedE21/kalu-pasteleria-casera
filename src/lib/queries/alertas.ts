import { demoAlertas } from '../demoData';
import type { Alerta, Notificacion } from '../../types/esquema';
import { insertRow, selectTable, updateRow } from './base';

export const obtenerAlertas = () => selectTable<Alerta>('alertas', demoAlertas, { column: 'created_at', ascending: false });
export const obtenerNotificaciones = () => selectTable<Notificacion>('notificaciones', [], { column: 'created_at', ascending: false });
export const crearAlerta = (payload: Partial<Alerta>) => insertRow<Alerta>('alertas', payload);
export const editarAlerta = (id: string, payload: Partial<Alerta>) => updateRow<Alerta>('alertas', id, payload);
export const marcarAlertaLeida = (id: string) => updateRow<Alerta>('alertas', id, { leida: true });
