import { SupabaseContext } from "../SupabaseContext.tsx";
import { useContext } from "react";

export const useSupabase = () => {
    const context = useContext(SupabaseContext);

    if (context === undefined) {
        throw new Error('useSupabase debe ser usado dentro de un SupabaseProvider');
    }

    return context;
};