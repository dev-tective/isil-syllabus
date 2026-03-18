import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

export const TermsOfService = () => {
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
                    <span className="text-sm text-gray-500">Condiciones del Servicio</span>
                </div>
            </div>

            {/* Content */}
            <main className="mx-auto max-w-3xl px-6 py-12 space-y-10">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white">Condiciones del Servicio</h1>
                    <p className="text-sm text-gray-500">Última actualización: {lastUpdated}</p>
                </div>

                <Section title="1. Aceptación de las condiciones">
                    <p>
                        Al acceder o utilizar <strong className="text-white">ISIL Syllabus</strong>, aceptas
                        quedar vinculado por estas Condiciones del Servicio. Si no estás de acuerdo con alguna
                        de ellas, no debes utilizar la plataforma.
                    </p>
                </Section>

                <Section title="2. Descripción del servicio">
                    <p>
                        ISIL Syllabus es una plataforma educativa gratuita, sin fines de lucro, creada por
                        estudiantes para facilitar el acceso a sílabos académicos del Instituto ISIL. El servicio
                        se ofrece «tal cual» y puede ser modificado, suspendido o descontinuado sin previo aviso.
                    </p>
                    <div className="mt-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-yellow-300/80 text-xs">
                        <Icon icon="mingcute:warning-line" className="inline mr-2 text-base" />
                        Este sitio <strong>no es oficial</strong> del Instituto ISIL. El contenido académico
                        (sílabos, planes de estudio) pertenece al Instituto ISIL.
                    </div>
                </Section>

                <Section title="3. Registro y cuenta">
                    <p>
                        Para utilizar algunas funciones de la plataforma debes crear una cuenta. Al registrarte,
                        aceptas:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                        <li>Proporcionar información veraz y actualizada.</li>
                        <li>Mantener la confidencialidad de tus credenciales.</li>
                        <li>Ser responsable de toda actividad realizada desde tu cuenta.</li>
                    </ul>
                    <p className="mt-2">
                        Podemos suspender o eliminar cuentas que violen estas condiciones.
                    </p>
                </Section>

                <Section title="4. Uso aceptable">
                    <p>Te comprometes a utilizar la plataforma únicamente con fines educativos legítimos.
                        <strong className="text-white"> Está prohibido:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                        <li>Subir contenido que no sea de naturaleza académica o que infrinja derechos de terceros.</li>
                        <li>Usar la plataforma para actividades comerciales o con fines de lucro.</li>
                        <li>Intentar acceder sin autorización a sistemas o datos de otros usuarios.</li>
                        <li>Difundir información falsa, spam o contenido ofensivo.</li>
                        <li>Realizar scraping masivo o automatizado sin autorización expresa.</li>
                    </ul>
                </Section>

                <Section title="5. Contenido de los usuarios">
                    <p>
                        Al subir contenido (por ejemplo, sílabos o comentarios), declaras que tienes los derechos
                        necesarios para compartirlo o que el contenido proviene de fuentes institucionales de
                        libre acceso. ISIL Syllabus no se responsabiliza por el contenido subido por los usuarios.
                    </p>
                    <p className="mt-2">
                        Nos reservamos el derecho de remover cualquier contenido que consideremos inapropiado o
                        que viole estas condiciones, sin necesidad de previo aviso.
                    </p>
                </Section>

                <Section title="6. Propiedad intelectual">
                    <p>
                        Los sílabos y materiales académicos disponibles en la plataforma son propiedad del
                        Instituto ISIL. ISIL Syllabus no reclama derechos sobre dicho contenido. El código
                        fuente de la plataforma es de propiedad de sus creadores.
                    </p>
                </Section>

                <Section title="7. Exención de responsabilidad">
                    <p>
                        ISIL Syllabus se proporciona <strong className="text-white">sin garantías de ningún tipo</strong>.
                        No nos responsabilizamos por:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                        <li>Inexactitudes o desactualización de los sílabos.</li>
                        <li>Interrupciones del servicio.</li>
                        <li>Pérdida de datos por causas ajenas a nuestra voluntad.</li>
                        <li>Decisiones académicas tomadas con base en la información de la plataforma.</li>
                    </ul>
                </Section>

                <Section title="8. Modificaciones del servicio">
                    <p>
                        Podemos modificar o discontinuar el servicio en cualquier momento. También podemos
                        actualizar estas Condiciones; los cambios importantes serán notificados por correo
                        electrónico o mediante un aviso en la plataforma. El uso continuado de ISIL Syllabus
                        después de tales cambios implica la aceptación de las nuevas condiciones.
                    </p>
                </Section>

                <Section title="9. Ley aplicable">
                    <p>
                        Estas condiciones se rigen por las leyes de la República del Perú. Cualquier disputa
                        se someterá a los tribunales competentes de Lima, Perú.
                    </p>
                </Section>

                <Section title="10. Contacto">
                    <p>
                        Para cualquier consulta sobre estas condiciones, escríbenos a:{" "}
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

const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white border-l-2 border-brand-cyan pl-3">
            {title}
        </h2>
        <div className="text-sm leading-relaxed space-y-2 pl-1">{children}</div>
    </section>
);
