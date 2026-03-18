import { Icon } from "@iconify/react";
import type { Course } from "../hooks/useCourse";
import { useNavigate } from "react-router-dom";
import { DifficultyBadge } from "./shared/DifficultyBadge";

export const CourseCard = ({ course }: { course: Course }) => {
    const { 
        name, 
        code, 
        credits, 
        difficulty, 
        syllabusCount = 0,
        notesCount = 0,
        recommendationsCount = 0
    } = course;

    const navigate = useNavigate();

    return (
        <section
            onClick={() => navigate(`/cursos/${code}`)} 
            className="
                flex flex-col
                w-full p-5 gap-2
                bg-brand-cyan/5
                backdrop-blur-md
                border border-brand-cyan/10
                rounded-2xl
                shadow-lg cursor-pointer
            "
        >
            <div className="
                flex justify-center items-center
                w-full h-32 
                rounded-xl
                text-5xl text-white/40
                bg-linear-to-br from-brand-cyan/30 to-blue-600/30 
                overflow-hidden relative
            ">
                <Icon icon="ant-design:book-filled" />

                <div className="absolute bottom-2 right-2">
                    <DifficultyBadge 
                        difficulty={difficulty}
                        opacity={80}
                        className="text-xs px-2 py-1" 
                    /> 
                </div>    
            </div>
           
            <h1 className="w-4/5 text-white capitalize font-bold">{name}</h1>

            <div className="flex justify-between items-center text-sm text-gray-300">
                <p>{code} - {credits} Créditos</p>
            </div>

            <div className="mt-2 flex justify-between items-center text-sm text-gray-300">
                <CourseAttribute
                    title="Sílabos"
                    icon="tdesign:file-filled" 
                    value={syllabusCount} 
                />
                <CourseAttribute 
                    title="Apuntes"
                    icon="clarity:note-edit-solid" 
                    value={notesCount} 
                />
                <CourseAttribute 
                    title="Profesores"
                    icon="mdi:teacher" 
                    value={recommendationsCount} 
                />
            </div>
        </section>
    )
}

const CourseAttribute = ({ title, icon, value }: { title: string, icon: string, value: number }) => {
    return (
        <span
            title={title} 
            className="flex items-center gap-1"
        >
            <Icon 
                icon={icon} 
                width="20" 
                height="20" 
            />
            <p>{value}</p>
        </span>
    )
}