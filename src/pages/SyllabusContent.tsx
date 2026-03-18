import { useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { useCourses } from "@/hooks/useCourse";
import { Icon } from '@iconify/react';
import { UploadSyllabus } from "@/components/interactive/UploadSyllabus";

const cleanString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const SyllabusContent = () => {
    const { data, isLoading, error } = useCourses();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCourses = !searchTerm.trim()
        ? data
        : data?.filter(course =>
            cleanString(course.name).includes(cleanString(searchTerm))
        );

    return (
        <div className="flex flex-col justify-start items-center w-full mb-auto">
            <section className="w-11/12 mx-auto py-5 space-y-5">
                <div className="space-y-2">
                    <h1 className="w-4/5 text-2xl text-white font-bold">
                        Por estudiantes, para estudiantes.
                    </h1>
                    <p className="text-gray-400">
                        Encuentra sílabos, recomendaciones y apuntes compartidos por la comunidad.
                    </p>
                </div>
            </section>

            <div className="sticky top-14 z-40 w-full bg-brand-dark/80 backdrop-blur-md pt-2 pb-4">
                <div className="space-y-4 w-11/12 mx-auto">
                    <div className="
                        relative flex items-center 
                        max-w-2xl w-full h-12
                        bg-brand-cyan/5 shadow-lg
                        border border-brand-cyan/10 
                        rounded-2xl
                    ">
                        <Icon
                            icon="mingcute:search-line"
                            className="absolute left-3 text-brand-cyan text-xl"
                        />
                        <input
                            onChange={e => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            type={'text'}
                            className="
                                w-full h-12 pl-12 pr-4
                                text-sm text-white
                                placeholder:text-gray-400
                                border border-transparent
                                rounded-2xl
                                focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan
                                transition-all
                            "
                            placeholder='Buscar cursos de tu interes'
                        />
                    </div>
                    <UploadSyllabus />
                </div>
            </div>

            <div className={`w-11/12 h-fit grid lg:grid-cols-3 md:grid-cols-2 gap-7 py-7`}>
                {error && (
                    <h1 className={'text-red-500 text-xl font-bold mt-5 text-center h-full'}>{error.message}</h1>
                )}
                {isLoading && !error && (
                    <h1 className={'text-white text-xl font-bold mt-5'}>Cargando...</h1>
                )}
                {!isLoading && !error && (!filteredCourses || filteredCourses.length === 0) && (
                    <h1 className={'text-white text-xl font-bold mt-5'}>No se encontraron cursos</h1>
                )}
                {!isLoading && !error && filteredCourses?.map((course, index) => (
                    <CourseCard key={course.id || index} course={course} />
                ))}
            </div>
        </div>
    );
};