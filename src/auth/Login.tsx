import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Icon } from '@iconify/react';
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                navigate("/");
            }
        };
        
        checkSession();
    }, []);

    const handleOAuth = async (provider: 'google' | 'facebook') => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: window.location.origin },
        });
        if (error) setError(error.message);
        setLoading(false);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                setError(error.message);
            } else {
                navigate("/");
            }
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) {
                setError(error.message);
            } else {
                setMessage("Registro exitoso. Por favor revisa tu correo para confirmar tu cuenta, o inicia sesión.");
                setIsLogin(true);
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col justify-center items-center w-full min-h-screen bg-brand-dark">
            <section className="w-11/12 max-w-md mx-auto py-5 space-y-5">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl text-white font-bold">
                        {isLogin ? "Bienvenido" : "Crear cuenta"}
                    </h1>
                    <p className="text-gray-400">
                        {isLogin ? "Inicia sesión para continuar" : "Regístrate para comenzar"}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4 w-full">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-2xl text-green-500 text-sm text-center">
                            {message}
                        </div>
                    )}
                    
                    <div className="
                        flex items-center relative
                        w-full h-12
                        bg-brand-cyan/5 shadow-lg
                        border border-brand-cyan/10 
                        rounded-2xl
                    ">
                        <Icon
                            icon="mingcute:mail-line"
                            className="absolute left-4 text-brand-cyan text-xl"
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="
                                w-full h-12 pl-12 pr-4
                                text-sm text-white bg-transparent
                                placeholder:text-gray-400
                                border border-transparent
                                rounded-2xl
                                focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan
                                transition-all
                            "
                            placeholder="Correo electrónico"
                        />
                    </div>

                    <div className="
                        flex items-center relative
                        w-full h-12
                        bg-brand-cyan/5 shadow-lg
                        border border-brand-cyan/10 
                        rounded-2xl
                    ">
                        <Icon
                            icon="mingcute:lock-line"
                            className="absolute left-4 text-brand-cyan text-xl"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="
                                w-full h-12 pl-12 pr-4
                                text-sm text-white bg-transparent
                                placeholder:text-gray-400
                                border border-transparent
                                rounded-2xl
                                focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan
                                transition-all
                            "
                            placeholder="Contraseña"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full h-12 mt-6
                            flex items-center justify-center gap-2
                            text-brand-dark font-bold text-sm
                            rounded-2xl
                            bg-brand-cyan hover:bg-brand-cyan-hover
                            transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    >
                        {loading ? (
                            <Icon icon="mingcute:loading-line" className="text-lg animate-spin" />
                        ) : (
                            <Icon icon={isLogin ? "mingcute:login-2-line" : "mingcute:user-add-line"} className="text-lg" />
                        )}
                        {loading ? (isLogin ? "Iniciando sesión..." : "Registrando...") : (isLogin ? "Iniciar sesión" : "Registrarse")}
                    </button>
                </form>

                {/* ── Divider ── */}
                <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-brand-cyan/10" />
                    <span className="text-xs text-gray-500">O continúa con</span>
                    <span className="h-px flex-1 bg-brand-cyan/10" />
                </div>

                {/* ── Social buttons ── */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => handleOAuth('google')}
                        disabled={loading}
                        className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-brand-cyan/10 bg-brand-cyan/5 text-sm font-bold text-white transition-all hover:border-brand-cyan/30 hover:bg-brand-cyan/10 disabled:opacity-50"
                    >
                        <Icon icon="flat-color-icons:google" className="text-xl" />
                        Google
                    </button>
                    <button
                        type="button"
                        onClick={() => handleOAuth('facebook')}
                        disabled={true}
                        className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-brand-cyan/10 bg-brand-cyan/5 text-sm font-bold text-white transition-all hover:border-blue-500/30 hover:bg-blue-500/10 disabled:opacity-50"
                    >
                        <Icon icon="logos:facebook" className="text-xl" />
                        Facebook
                    </button>
                </div>

                <div className="text-center pt-2">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(null);
                            setMessage(null);
                        }}
                        className="text-sm text-gray-400 transition-colors"
                    >
                        {isLogin 
                            ? "¿No tienes cuenta? " 
                            : "¿Ya tienes cuenta? "}
                        <strong className="text-brand-cyan hover:text-brand-cyan-hover">
                            {isLogin ? "Regístrate aquí" : "Inicia sesión"}
                        </strong>
                    </button>
                </div>

                {/* ── Legal links ── */}
                <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-600">
                    <Link to="/privacy" className="hover:text-gray-400 transition-colors">
                        Política de Privacidad
                    </Link>
                    <span>·</span>
                    <Link to="/terms" className="hover:text-gray-400 transition-colors">
                        Condiciones del Servicio
                    </Link>
                </div>
            </section>
        </div>
    );
};
