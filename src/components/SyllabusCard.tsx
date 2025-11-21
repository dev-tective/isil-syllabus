import type { Syllabus } from "./hooks/useSyllabus.ts";

interface SyllabusCardProps {
    syllabus: Syllabus;
}

interface SyllabusCardFieldProps {
    field: string;
    value: string | number;
}

export const SyllabusCardField = ({ field, value }: SyllabusCardFieldProps) => {
    return (
        <div className={'w-full flex justify-between text-md'}>
            <strong>{field}:</strong>
            <span className={'capitalize'}>{value}</span>
        </div>
    )
}

const SyllabusCard = ({ syllabus }: SyllabusCardProps) => {
    const { course, periodAcademic, pdfUrl } = syllabus;

    return (
        <section className="w-1/5 min-w-[300px] bg-gray-600 rounded-xl flex flex-wrap content-between p-4 gap-6">
            <header className={'w-full border-b-2 border-b-cyan-500 text-white'}>
                <h1 className={'text-cyan-500 text-2xl font-bold capitalize'}>{course && course.name}</h1>
                <p className={'text-lg'}><strong>Código:</strong> {course && course.code}</p>
            </header>

            <div className={'w-full text-white gap-2 flex flex-col'}>
                {course && (
                    <SyllabusCardField
                        field={'Creditos'}
                        value={course.credits}
                    />
                )}

                <SyllabusCardField
                    field={'Semestre'}
                    value={`${periodAcademic.semester?.name} (${periodAcademic.semester?.period})`}
                />

                <SyllabusCardField
                    field={'Naturaleza'}
                    value={periodAcademic.semester?.nature}
                />

                <SyllabusCardField
                    field={'Periodo Académico'}
                    value={`${periodAcademic.year} - ${periodAcademic.code}`}
                />
            </div>

            <button className={'w-full btn-primary py-2'}>
                <a href={pdfUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className=""
                >
                    Ver Sílabo (PDF)
                </a>
            </button>
        </section>
    );
};

export default SyllabusCard;