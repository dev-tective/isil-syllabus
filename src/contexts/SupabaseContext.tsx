import { createContext, type ReactNode } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from "../lib/supabaseClient.ts";

// Definir el tipo del contexto
interface SupabaseContextType {
    supabase: SupabaseClient;
}

// Crear el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Provider props
interface SupabaseProviderProps {
    children: ReactNode;
}

// Provider component
export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
    return (
        <SupabaseContext.Provider value={{ supabase }}>
            {children}
        </SupabaseContext.Provider>
    );
};