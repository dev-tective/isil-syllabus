import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Vite no cargó las variables de Supabase correctamente.");
    throw new Error('Las variables de entorno de Supabase son requeridas.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);