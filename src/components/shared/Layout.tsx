import { Icon } from '@iconify/react';
import { useLocation, Link } from 'react-router-dom';
import { LoginBtn } from '@/components/interactive/LoginBtn';

const navItems = [
    { to: '/', icon: 'ic:baseline-home', label: 'Inicio' },
    { to: '/ranking', icon: 'fa6-solid:ranking-star', label: 'Ranking' },
];

const NavItem = ({ to, icon, isActive }: {
    to: string,
    icon: string,
    isActive: boolean
}) => (
    <Link
        to={to}
        className={`
            flex flex-col items-center justify-center
            w-full h-full
            transition-all
            ${isActive ? 'bg-brand-cyan/10 text-brand-cyan' : 'text-gray-400'}
        `}
    >
        <Icon
            icon={icon}
            className="text-3xl"
        />
    </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    return (
        <main className={'bg-brand-dark min-h-dvh flex flex-col justify-between'}>
            <header className="
                sticky top-0 z-50 
                flex justify-between items-center
                w-full h-14 px-5
                bg-brand-dark/80
                text-brand-cyan
                backdrop-blur-md 
                border-b border-brand-cyan/10
            ">
                <span className={'text-2xl text-white font-bold shrink-0'}>
                    Comunidad <strong className={'text-cyan-400'}>ISIL</strong>
                </span>

                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.to;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`
                                    relative text-sm font-semibold transition-all duration-300
                                    ${isActive ? 'text-brand-cyan' : 'text-gray-400 hover:text-white'}
                                `}
                            >
                                {item.label}
                                {isActive && (
                                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-brand-cyan rounded-full animate-in fade-in slide-in-from-bottom-1" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="flex items-center gap-3">
                    <LoginBtn />
                </div>
            </header>

            {children}

            <footer className='
                sticky bottom-0 z-50
                flex md:hidden
                w-full h-14
                bg-brand-dark/90
                backdrop-blur-md
                border-t border-brand-cyan/10
            '>
                <div className="flex items-center justify-around w-full h-full">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.to}
                            {...item}
                            isActive={location.pathname === item.to}
                        />
                    ))}
                </div>
            </footer>
        </main>
    )
}