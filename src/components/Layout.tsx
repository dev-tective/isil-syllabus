import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

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
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(!!session);
        };
        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleUserClick = async () => {
        if (isLoggedIn) {
            await supabase.auth.signOut();
        } else {
            navigate('/login');
        }
    };

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

                <HeaderBtn
                    icon={isLoggedIn ? 'bxs:log-in' : 'mingcute:user-4-fill'}
                    onClick={handleUserClick}
                    title={isLoggedIn ? "Cerrar sesión" : "Iniciar sesión"}
                />
            </header>

            {children}

            {/* Footer informativo */}
            {/* <div className={'h-1 w-full bg-linear-to-r from-cyan-400 to-blue-500 mt-10'}></div>
            <footer className={'bg-gray-950 text-white py-6 px-5'}>
                <div className={'max-w-4xl mx-auto'}>
                    <div className={'text-sm text-gray-300 space-y-2'}>
                        <p className={'text-center'}>
                            Esta aplicación ha sido creada <strong>por estudiantes y para estudiantes</strong> de manera completamente gratuita.
                        </p>
                        <p className={'text-center'}>
                            El objetivo es compartir sílabos acumulados durante el tiempo de estudio para facilitar el acceso a material académico a toda la comunidad estudiantil.
                        </p>
                        <p className={'text-center text-xs text-gray-400 mt-4 pt-4 border-t border-gray-700'}>
                            <strong>Importante:</strong> Todos los derechos del contenido académico y la marca ISIL son reservados por el Instituto San Ignacio de Loyola. Este es un proyecto independiente desarrollado por un estudiante sin afiliación oficial con la institución.
                        </p>
                        <p className={'text-center text-xs text-gray-500 mt-2'}>
                            © {new Date().getFullYear()} - ISIL Syllabus
                        </p>
                    </div>
                </div>
            </footer> */}
        </main>
    )
}