import { NotesTab } from "@/components/course/NotesTab";
import { RecommendationsTab } from "@/components/course/RecommendationsTab";
import { StatCard } from "@/components/course/StatCard";
import { SyllabusTab } from "@/components/course/SyllabusTab";
import { TabButton } from "@/components/course/TabButton";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { useCourseByCode } from "@/hooks/useCourse";
import { supabase } from "@/lib/supabaseClient";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Tab = 'syllabus' | 'notes' | 'recommendations';

const TABS: { id: Tab; icon: string; label: string }[] = [
    { id: 'syllabus', icon: 'tdesign:file-filled', label: 'Sílabos' },
    { id: 'notes', icon: 'clarity:note-edit-solid', label: 'Apuntes' },
    { id: 'recommendations', icon: 'mdi:teacher', label: 'Profesores' },
];

export const CoursePage = () => {
    const { code } = useParams();
    const { data: course, isLoading, error } = useCourseByCode(code);
    const [activeTab, setActiveTab] = useState<Tab>('syllabus');
    const [userId, setUserId] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) setUserId(session.user.id);
        });
    }, []);

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] w-full items-center justify-center">
                <Icon icon="mingcute:loading-line" className="animate-spin text-4xl text-brand-cyan" />
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="flex min-h-[50vh] w-full flex-col items-center justify-center space-y-4">
                <Icon icon="mingcute:warning-line" className="text-6xl text-red-500" />
                <h1 className="text-2xl font-bold text-white">Curso no encontrado</h1>
                <p className="text-gray-400">Verifica que el código del curso sea correcto.</p>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col items-center justify-start pb-10 mb-auto">
            {/* Header */}
            <section className="mx-auto w-11/12 py-5">
                  {/* Back button + difficulty badge */}
                  <div className="mb-4 flex items-center gap-4">
                    <button
                      onClick={() => navigate('/')}
                      className="rounded-xl bg-brand-cyan/10 p-2 text-brand-cyan transition-colors hover:bg-brand-cyan/20"
                      aria-label="Volver al inicio"
                    >
                      <Icon icon="mingcute:left-line" className="text-xl" />
                    </button>
            
                    <DifficultyBadge
                        className="py-0.5 px-3 text-lg"
                        difficulty={course.difficulty}
                    />
                  </div>
            
                  {/* Course title + meta */}
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold capitalize text-white lg:text-4xl">{course.name}</h1>
                    <div className="flex flex-wrap gap-4 text-gray-400">
                      <span className="flex items-center gap-1">
                        <Icon icon="mingcute:barcode-line" /> {course.code}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon icon="mingcute:book-line" /> {course.credits} Créditos
                      </span>
                    </div>
                  </div>
                </section>

            {/* Stats */}
            <section className="mx-auto mb-8 grid w-11/12 grid-cols-3 gap-4">
                <StatCard 
                    icon="tdesign:file-filled" 
                    title="Sílabos" 
                    value={course.syllabus?.length ?? 0} 
                />
                <StatCard 
                    icon="clarity:note-edit-solid" 
                    title="Apuntes" 
                    value={course.note?.length ?? 0} 
                />
                <StatCard 
                    icon="mdi:teacher" 
                    title="Profesores" 
                    value={course.teacher_recommendation?.length ?? 0} 
                />
            </section>

            {/* Tabs */}
            <section className="mx-auto w-11/12">
                {/* Tab bar */}
                <div className="mb-6 flex gap-2 rounded-2xl border border-brand-cyan/10 bg-brand-cyan/5 p-1">
                    {TABS.map((tab) => (
                        <TabButton
                            key={tab.id}
                            active={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            icon={tab.icon}
                            label={tab.label}
                        />
                    ))}
                </div>

                {/* Tab content */}
                <div className="min-h-[300px]">
                    {activeTab === 'syllabus' && (
                        <SyllabusTab syllabuses={course.syllabus ?? []} />
                    )}

                    {activeTab === 'notes' && (
                        <NotesTab
                            notes={course.note ?? []}
                            courseId={course.id}
                            userId={userId}
                        />
                    )}

                    {activeTab === 'recommendations' && (
                        <RecommendationsTab
                            recommendations={course.teacher_recommendation ?? []}
                            courseId={course.id}
                            userId={userId}
                        />
                    )}
                </div>
            </section>
        </div>
    )
}