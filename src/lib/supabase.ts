import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/esquema';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function normalizeSupabaseUrl(value: string | undefined) {
  if (!value) return '';
  try {
    const url = new URL(value.trim());
    return url.origin;
  } catch {
    return value.trim().replace(/\/+$/, '');
  }
}

const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);

export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey ?? '',
  isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
};

export const supabase = supabaseConfig.isConfigured
  ? createClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error('Faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY. Se usará modo demo hasta configurar Supabase.');
  }
  return supabase;
}
