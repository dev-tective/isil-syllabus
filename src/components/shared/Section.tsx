interface Props {
    title: string;
    children: React.ReactNode;
}

export const Section = ({ title, children }: Props) => (
    <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white border-l-2 border-brand-cyan pl-3">
            {title}
        </h2>
        <div className="text-sm leading-relaxed space-y-2 pl-1">{children}</div>
    </section>
);
