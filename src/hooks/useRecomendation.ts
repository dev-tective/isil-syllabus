import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export const RECOMMENDATION_TYPES = [
    "solo lee ppt",
    "llega tarde",
    "no viene",
    "sabe pero no explica",
    "explica pero confunde",
    "se duerme",
    "habla rapido",
    "habla lento",
    "cuenta su vida",
    "es chismoso",
    "regala puntos",
    "deja jatear",
    "estricto",
    "todo mal",
    "hace bien su chamba",
    "responde preguntas",
    "domina su campo",
    "es buena gente",
];

export interface TeacherRecomendation {
    id: number;
    teacher_name: string;
    content: string;
    course_id: number;
    user_id: string;
    recommendation_flags: string[];
    is_recommended: boolean;
    created_at: string;
}

export const useGetTeachers = async (): Promise<string[]> => {
    const { data, error } = await supabase
        .from('teacher_recommendation')
        .select('teacher_name')
        .not('teacher_name', 'is', null);

    if (error) throw new Error(error.message);

    // Deduplicate client-side (PostgREST distinct is not supported via JS SDK)
    return [...new Set((data ?? []).map((d) => d.teacher_name as string))];
}

export const useCreateRecomendation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            content,
            teacher_name,
            course_id,
            user_id,
            recommendation_flags,
            is_recommended,
        }: {
            content: string;
            teacher_name: string;
            course_id: number;
            user_id: string;
            recommendation_flags: string[];
            is_recommended: boolean;
        }) => {
            const { data, error } = await supabase
                .from('teacher_recommendation')
                .insert([{ content, teacher_name, course_id, user_id, recommendation_flags, is_recommended }])
                .select()
                .single();

            if (error) {
                console.error(error.message);
                throw new Error(error.message)
            }
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course'] });
        },
    });
};

export const useUpdateRecomendation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id, content, teacher_name, recommendation_flags, is_recommended,
        }: {
            id: number;
            content: string;
            teacher_name: string;
            recommendation_flags: string[];
            is_recommended: boolean;
        }) => {
            const { data, error } = await supabase
                .from('teacher_recommendation')
                .update({ content, teacher_name, recommendation_flags, is_recommended })
                .eq('id', id)
                .select()
                .single();

            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course'] });
        },
    });
};

export const useDeleteRecomendation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase
                .from('teacher_recommendation')
                .delete()
                .eq('id', id);

            if (error) throw new Error(error.message);
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course'] });
        },
    });
};
