import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import type { TeacherRecomendation } from './useRecomendation';
import type { Difficulty, Note } from './useNote';

export interface Course {
    id: number;
    code: number;
    name: string;
    credits: number;
    created_at: string;

    syllabusCount?: number;
    notesCount?: number;
    recommendationsCount?: number;

    syllabus?: Syllabus[];
    note?: Note[];
    teacher_recommendation?: TeacherRecomendation[];

    difficulty: Difficulty;
}

export interface Syllabus {
    id: number;
    pdf_url: string;
    course_id: number;
    period_academic_id: number;
    created_at: string;
    course: Course;
    period_academic: PeriodAcademic | null;
}

export interface Course {
    id: number;
    code: number;
    name: string;
    credits: number;
    course_type: string;
    created_at: string;
    updated_at: string;
}

export interface PeriodAcademic {
    id: number;
    code: string;
    year: number;
    semester_id: number;
    created_at: string;
    semester: Semester;
}

export interface Semester {
    id: number;
    name: string;
    nature: string;
    period: string;
    created_at: string;
}

export function useCourses(limit?: number) {
    return useQuery({
        queryKey: ['courses', limit],
        queryFn: async () => {
            try {
                let query = supabase
                    .from('course')
                    .select('*, syllabus(count), note(count), teacher_recommendation(count)')
                    .order('updated_at', { ascending: false });

                if (limit) {
                    query = query.limit(limit);
                }

                const { data, error } = await query;

                if (error) {
                    console.error("Error fetching courses:", error);
                    return [];
                }

                return (data as any[]).map(course => ({
                    ...course,
                    syllabusCount: course.syllabus?.[0]?.count || 0,
                    notesCount: course.note?.[0]?.count || 0,
                    recommendationsCount: course.teacher_recommendation?.[0]?.count || 0,
                })) as Course[];
            } catch (err) {
                console.error("Unexpected error fetching courses:", err);
                return [];
            }
        },
    });
}

export function useCourseByCode(code: string | undefined) {
    return useQuery({
        queryKey: ['course', code],
        queryFn: async () => {
            if (!code) return null;

            try {
                // Fetch the course with full relations, but especially syllabus which needs 
                // the nested period_academic and semester joins to be useful
                const { data, error } = await supabase
                    .from('course')
                    .select(`
                        *, 
                        syllabus(*, period_academic(*, semester(*))), 
                        note(*), 
                        teacher_recommendation(*)
                    `)
                    .eq('code', code)
                    .single();

                if (error) {
                    console.error("Error fetching course by code:", error);
                    return null;
                }

                return data as Course;
            } catch (err) {
                console.error("Unexpected error fetching course:", err);
                return null;
            }
        },
        enabled: !!code, // Only run the query if we have a code
    });
}