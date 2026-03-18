import type { TopTeacher } from "@/hooks/useRecomendation";
import { Icon } from "@iconify/react";
import { useState } from "react";

export const TeacherCard = ({ teacher, index }: { teacher: TopTeacher, index: number }) => {
    const [expanded, setExpanded] = useState(false);

    // Filter out null/empty items and deduplicate courses/flags
    const courses = [...new Set(teacher.course_names?.filter(Boolean) || [])];
    const messages = teacher.content_messages?.filter(Boolean) || [];
    const flags = [...new Set(teacher.all_flags?.filter(Boolean) || [])];

    // Top 3 Ranking logic
    const isTop3 = index < 3;
    const rankColors = [
        'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', // 1st
        'text-gray-300 bg-gray-300/10 border-gray-300/30',     // 2nd
        'text-amber-600 bg-amber-600/10 border-amber-600/30'   // 3rd
    ];

    const rankStyle = isTop3 ? rankColors[index] : 'text-gray-500 bg-gray-800 border-gray-700';

    return (
        <div className="w-full bg-brand-dark rounded-2xl border border-brand-cyan/10 overflow-hidden transition-all duration-300 hover:border-brand-cyan/30">
            {/* Card Header (Visible Always) */}
            <div className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex items-center gap-4">
                    <div className={`
                        flex items-center justify-center 
                        min-w-12 h-12 
                        rounded-full border 
                        font-bold text-xl 
                        ${rankStyle}
                    `}>
                        #{index + 1}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white capitalize">{teacher.teacher_name}</h2>
                        <div className="flex flex-wrap gap-4 mt-1 text-sm">
                            <span className="flex items-center gap-1.5 text-green-400">
                                <Icon icon="mingcute:thumb-up-fill" className="text-lg" /> {teacher.recommendation_count}
                            </span>
                            <span className="flex items-center gap-1.5 text-red-400">
                                <Icon icon="mingcute:thumb-down-fill" className="text-lg" /> {teacher.not_recommendation_count}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tags preview */}
            {flags.length > 0 && (
                <div className="px-5 pb-4 flex flex-wrap gap-2">
                    {flags.map((flag, i) => (
                        <span key={i} className="capitalize px-2 py-1 bg-brand-cyan/10 text-brand-cyan text-xs rounded border border-brand-cyan/20">
                            {flag}
                        </span>
                    ))}
                </div>
            )}

            <div className="w-full sm:w-auto flex justify-end p-5">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="
                        flex items-center 
                        gap-1 
                        text-sm font-medium text-brand-cyan hover:text-brand-cyan-hover 
                        transition-colors cursor-pointer
                        px-4 py-2 rounded-xl 
                        bg-brand-cyan/5 hover:bg-brand-cyan/10
                    "
                >
                    {expanded ? 'Ocultar detalles' : 'Ver más'}
                    <Icon icon={expanded ? "mingcute:up-line" : "mingcute:down-line"} className="text-lg" />
                </button>
            </div>

            {/* Accordion Content */}
            <div className={`grid transition-all duration-300 ease-in-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                    <div className="p-5 border-t border-brand-cyan/10 bg-black/20 space-y-6">
                        {courses.length > 0 && (
                            <div>
                                <h3 className="text-gray-400 text-sm font-bold flex items-center gap-2 mb-3">
                                    <Icon icon="mingcute:book-2-line" className="text-brand-cyan text-lg" /> Cursos que dicta
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {courses.map((course, i) => (
                                        <span key={i} className="capitalize px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700">
                                            {course}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.length > 0 && (
                            <div>
                                <h3 className="text-gray-400 text-sm font-bold flex items-center gap-2 mb-3">
                                    <Icon icon="mingcute:comment-line" className="text-brand-cyan text-lg" /> Qué dicen los alumnos
                                </h3>
                                <div className="space-y-3">
                                    {messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className="
                                                p-4 bg-gray-800/40 rounded-xl 
                                                text-gray-300 text-sm italic 
                                                border-l-2 border-brand-cyan/50 shadow-sm
                                            "
                                        >
                                            "{msg}"
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {courses.length === 0 && messages.length === 0 && (
                            <p className="text-gray-500 text-sm italic">No hay detalles adicionales para este profesor.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};