import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export const LoginBtn = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setIsLoading(false);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleAction = async () => {
        if (user) {
            // Option 1: Just sign out (current behavior)
            // Option 2: Navigate to profile
            // I will keep sign out for now as it was the current logic, or maybe show a small menu?
            // The user didn't specify, so I'll keep the previous logout logic but made it look better.
            const { error } = await supabase.auth.signOut();
            if (error) console.error('Error signing out:', error.message);
        } else {
            navigate('/login');
        }
    };

    if (isLoading) {
        return (
            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
        );
    }

    if (!user) {
        return (
            <button
                onClick={handleAction}
                className="
                    flex items-center gap-2
                    px-4 py-1.5 
                    bg-brand-cyan/10 hover:bg-brand-cyan/20
                    text-brand-cyan text-sm font-semibold
                    rounded-full border border-brand-cyan/20
                    transition-all active:scale-95
                "
            >
                <span>Iniciar sesión</span>
            </button>
        );
    }

    const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? '/user.png';

    return (
        <button
            onClick={handleAction}
            title="Cerrar sesión"
            className="
                relative flex items-center justify-center
                w-10 h-10 rounded-full
                border-2 border-brand-cyan/50 hover:border-brand-cyan
                transition-all active:scale-95 overflow-hidden
                bg-brand-dark shadow-lg shadow-brand-cyan/10
            "
        >
            <img
                src={avatarUrl}
                alt="User"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = '/user.png';
                }}
            />
            <div className="
                absolute inset-0 bg-black/60 opacity-0 hover:opacity-100
                flex items-center justify-center transition-opacity
            ">
                <Icon icon="mingcute:exit-line" className="text-white text-xl" />
            </div>
        </button>
    );
};
