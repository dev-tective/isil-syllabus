import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon } from '@iconify/react';
import { useGetTopTeachers } from '@/hooks/useRecomendation';
import { TeacherCard } from '@/components/TeacherCard';

export const RankingPage = () => {
    const [isBest, setIsBest] = useState(true);

    const { data: teachers, isLoading, error } = useQuery({
        queryKey: ['topTeachers', isBest],
        queryFn: () => useGetTopTeachers(isBest),
    });

    return (
        <div className="flex flex-col items-center justify-start w-full min-h-screen pb-20 fade-in">
            {/* Header section */}
            <section className="w-11/12 max-w-4xl mx-auto py-8 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                {isBest ? "Ranking de Mejores Profesores" : "Ranking de Peores Profesores"}
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">
                                {isBest 
                                    ? "Descubre qué profesores tienen las mejores recomendaciones de la comunidad."
                                    : "Profesores con las calificaciones más bajas según la comunidad."}
                            </p>
                        </div>
                        
                        <button
                            onClick={() => setIsBest(!isBest)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all
                                ${isBest 
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20" 
                                    : "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 hover:bg-brand-cyan/20"}
                            `}
                        >
                            <Icon 
                                icon={isBest ? "mingcute:dislike-line" : "mingcute:like-line"} 
                                className="text-lg" 
                            />
                            {isBest ? "No recomendados" : "Más recomendados"}
                        </button>
                    </div>
            </section>

            {/* List section */}
            <section className="w-11/12 max-w-4xl mx-auto space-y-4">
                {isLoading && (
                    <div className="flex justify-center py-20">
                        <Icon icon="mingcute:loading-line" className="text-5xl text-brand-cyan animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-500 text-center flex flex-col items-center gap-2">
                        <Icon icon="mingcute:warning-line" className="text-3xl" />
                        <p>Hubo un error al cargar el ranking.</p>
                    </div>
                )}

                {teachers && teachers.length === 0 && (
                    <div className="p-10 bg-brand-cyan/5 border border-brand-cyan/10 rounded-2xl flex flex-col items-center text-center">
                        <Icon icon="mingcute:ghost-line" className="text-5xl text-gray-500 mb-3" />
                        <p className="text-gray-400 font-medium">Aún no hay recomendaciones de profesores.</p>
                    </div>
                )}

                {teachers && teachers.map((teacher, index) => (
                    <TeacherCard 
                        key={teacher.teacher_name} 
                        teacher={teacher} 
                        index={index} 
                        isBest={isBest}
                    />
                ))}
            </section>
        </div>
    );
};