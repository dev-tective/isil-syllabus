import { useQuery } from '@tanstack/react-query';
import { Icon } from '@iconify/react';
import { useGetTopTeachers } from '@/hooks/useRecomendation';
import { TeacherCard } from '@/components/TeacherCard';

export const RankingPage = () => {
    const { data: teachers, isLoading, error } = useQuery({
        queryKey: ['topTeachers'],
        queryFn: useGetTopTeachers,
    });

    return (
        <div className="flex flex-col items-center justify-start w-full min-h-screen pb-20 fade-in">
            {/* Header section */}
            <section className="w-11/12 max-w-4xl mx-auto py-8 space-y-2">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Ranking de Profesores</h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Descubre qué profesores tienen las mejores recomendaciones de la comunidad.
                        </p>
                    </div>
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
                    <TeacherCard key={teacher.teacher_name} teacher={teacher} index={index} />
                ))}
            </section>
        </div>
    );
};