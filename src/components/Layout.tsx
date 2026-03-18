import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

const HeaderBtn = ({ icon, onClick, title }: { icon: string, onClick?: () => void, title?: string }) => {
    return (
        <button
            onClick={onClick}
            title={title}
            className='text-3xl transition hover:text-brand-cyan-hover'
        >
            <Icon icon={icon} />
        </button>
    )
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            console.table(session)
            setUser(session?.user ?? null);
        };
        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            console.table(session)
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleUserClick = async () => {
        if (user) {
            await supabase.auth.signOut();
        } else {
            navigate('/login');
        }
    };

    const avatarUrl: string | undefined =
        user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture;
        console.table(user)

    return (
        <main className={'bg-brand-dark min-h-screen flex flex-col'}>
            <header className="
                sticky top-0 z-50 
                flex justify-between items-center
                w-full h-14 px-5
                bg-brand-dark/80
                text-brand-cyan
                backdrop-blur-md 
                border-b border-brand-cyan/10
            ">
                {/* <HeaderBtn icon='ic:baseline-menu' /> */}

                <span className={'text-2xl text-white font-bold'}>
                    <strong className={'text-cyan-400'}>ISIL</strong> Syllabus
                </span>

                <div className="flex items-center gap-3">
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-brand-cyan/20"
                    />
                    <HeaderBtn
                        icon={user ? 'bxs:log-in' : 'mingcute:user-4-fill'}
                        onClick={handleUserClick}
                        title={user ? "Cerrar sesión" : "Iniciar sesión"}
                    />
                </div>
            </header>

            {children}
        </main>
    )
}