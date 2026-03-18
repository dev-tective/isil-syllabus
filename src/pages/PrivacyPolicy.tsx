import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Section } from "@/components/shared/Section";

export const PrivacyPolicy = () => {
    const lastUpdated = "18 de marzo de 2026";

    return (
        <div className="min-h-screen bg-brand-dark text-gray-300">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-brand-cyan/10 bg-brand-dark/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-sm text-brand-cyan hover:text-white transition-colors"
                    >
                        <Icon icon="mingcute:arrow-left-line" className="text-lg" />
                        Volver
                    </Link>
                    <span className="h-5 border-l border-brand-cyan/20" />
                    <span className="text-sm text-gray-500">Política de Privacidad</span>
                </div>
            </div>

            {/* Content */}
            <main className="mx-auto max-w-3xl px-6 py-12 space-y-10">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white">Política de Privacidad</h1>
                    <p className="text-sm text-gray-500">Última actualización: {lastUpdated}</p>
                </div>

                <Section title="1. ¿Quiénes somos?">
                    <p>
                        <strong className="text-white">ISIL Syllabus</strong> es una plataforma educativa gratuita,
                        creada por estudiantes para estudiantes del Instituto ISIL. Su único propósito es facilitar
                        el acceso compartido a sílabos académicos sin fines de lucro. El contenido académico
                        pertenece al Instituto ISIL.
                    </p>
                </Section>

                <Section title="2. Información que recopilamos">
                    <p>Recopilamos únicamente la información estrictamente necesaria para que la plataforma funcione:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                        <li>
                            <strong className="text-white">Dirección de correo electrónico</strong> — para
                            identificarte en la plataforma.
                        </li>
                        <li>
                            <strong className="text-white">Nombre y foto de perfil</strong> — obtenidos de Google
                            si usas inicio de sesión con Google (solo lectura).
                        </li>
                        <li>
                            <strong className="text-white">Datos de uso</strong> — páginas visitadas, cursos
                            consultados, de forma anónima y agregada para mejorar la plataforma.
                        </li>
                    </ul>
                    <p className="mt-3">
                        <strong className="text-white">No recopilamos</strong> datos bancarios, números de
                        documento de identidad ni información sensible de ningún tipo.
                    </p>
                </Section>

                <Section title="3. Cómo usamos tu información">
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Permitir el acceso autenticado a la plataforma.</li>
                        <li>Mostrar tu nombre o correo en tu sesión activa.</li>
                        <li>Enviar correos transaccionales (confirmación de cuenta, restablecimiento de contraseña).</li>
                        <li>Mejorar la experiencia de la plataforma a partir de datos agregados y anónimos.</li>
                    </ul>
                    <p className="mt-3">
                        <strong className="text-white">No vendemos, compartimos ni monetizamos</strong> tus datos
                        personales con terceros.
                    </p>
                </Section>

                <Section title="4. Inicio de sesión con Google">
                    <p>
                        Al usar «Iniciar sesión con Google», Google comparte con nosotros tu correo electrónico,
                        nombre y foto de perfil pública. Esta información solo se utiliza para crear y gestionar
                        tu sesión dentro de ISIL Syllabus. Puedes revocar este acceso en cualquier momento desde
                        la{" "}
                        <a
                            href="https://myaccount.google.com/permissions"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-cyan hover:underline"
                        >
                            configuración de permisos de tu cuenta Google
                        </a>
                        .
                    </p>
                </Section>

                <Section title="5. Almacenamiento y seguridad">
                    <p>
                        Tus datos se almacenan en <strong className="text-white">Supabase</strong>, plataforma que
                        cumple con estándares de seguridad modernos (cifrado en tránsito y en reposo). No
                        almacenamos contraseñas en texto plano; el proceso de autenticación usa hashing seguro.
                    </p>
                </Section>

                <Section title="6. Cookies y almacenamiento local">
                    <p>
                        Utilizamos cookies de sesión y almacenamiento local del navegador exclusivamente para
                        mantener tu sesión activa. No usamos cookies de rastreo ni publicidad.
                    </p>
                </Section>

                <Section title="7. Tus derechos">
                    <p>Tienes derecho a:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                        <li>Solicitar la eliminación de tu cuenta y todos tus datos.</li>
                        <li>Acceder a los datos que tenemos sobre ti.</li>
                        <li>Revocar el acceso de inicio de sesión con Google en cualquier momento.</li>
                    </ul>
                    <p className="mt-3">
                        Para ejercer cualquiera de estos derechos, contáctanos mediante el correo indicado al final
                        de este documento.
                    </p>
                </Section>

                <Section title="8. Menores de edad">
                    <p>
                        Esta plataforma está dirigida a estudiantes universitarios y técnicos. No recopilamos
                        intencionalmente datos de menores de 13 años. Si detectamos que un usuario es menor de esa
                        edad, eliminaremos su información.
                    </p>
                </Section>

                <Section title="9. Cambios a esta política">
                    <p>
                        Podemos actualizar esta política ocasionalmente. Te notificaremos por correo electrónico
                        o mediante un aviso visible en la plataforma ante cambios significativos.
                    </p>
                </Section>

                <Section title="10. Contacto">
                    <p>
                        Si tienes preguntas o inquietudes sobre esta política, puedes escribirnos a:{" "}
                        <a
                            href="mailto:soporte@isilsyllabus.com"
                            className="text-brand-cyan hover:underline"
                        >
                            soporte@isilsyllabus.com
                        </a>
                    </p>
                </Section>
            </main>
        </div>
    );
};