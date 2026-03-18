import type { Syllabus } from "../hooks/useSupabase";

export const SyllabusCardField = ({ value }: { value: string | number }) => {
    return (
        <span className={'py-1 px-2 bg-black border border-white text-white rounded-lg'}>
            {value}
        </span>
    )
}

const SyllabusCard = ({ syllabus } : { syllabus: Syllabus }) => {
    const { course, periodAcademic, pdf_url } = syllabus;

    return (
        <section className="
            flex flex-col
            w-full p-5
            bg-brand-cyan/5
            backdrop-blur-md
            border border-brand-cyan/10
            rounded-2xl
            shadow-lg
        ">
            <span className="
                w-full h-32 
                rounded-xl 
                bg-linear-to-br from-brand-cyan/30 to-blue-600/30 
                overflow-hidden relative
            "/>
            <div className={'px-4 flex flex-wrap content-between gap-4'}>
                <h1 className={'w-full text-xl font-bold capitalize'}>{course && course.name}</h1>

                <div className="w-full flex flex-wrap gap-2 text-md font-bold">
                    <span className={'px-2 bg-linear-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center'}>
                        {course && course.code}
                    </span>

                    {course && (
                        <SyllabusCardField
                            value={`${course.credits} Creditos`}
                        />
                    )}

                    <SyllabusCardField value={course.course_type} />

                    {periodAcademic && (
                        <>
                            <SyllabusCardField value={`${periodAcademic.semester.name} (${periodAcademic.semester.period})`} />
                            <SyllabusCardField value={periodAcademic.semester.nature} />
                            <SyllabusCardField value={`${periodAcademic.year} - ${periodAcademic.code}`} />
                        </>
                    )}
                </div>
                <a
                    href={pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-bold
                    flex items-center gap-1"
                >
                    Ver Sílabo (PDF)
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                    >
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13.5 10.5L21 3m-5 0h5v5m0 6v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"
                        />
                    </svg>
                </a>
            </div>
        </section>
    );
};

export default SyllabusCard;