import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

export type Difficulty = "fácil" | "intermedio" | "difícil" | null;

export interface Note {
    id: number;
    content: string;
    define_difficulty: Difficulty;
    course_id: number;
    user_id: string;
    created_at: string;
}

export const useCreateNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ content, difficulty, course_id, user_id }: { content: string, difficulty: Difficulty, course_id: number, user_id: string }) => {
            const { data, error } = await supabase
                .from('note')
                .insert([
                    { content, define_difficulty: difficulty, course_id, user_id }
                ])
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

export const useUpdateNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, content, difficulty }: { id: number, content: string, difficulty: Difficulty }) => {
            const { data, error } = await supabase
                .from('note')
                .update({ content, define_difficulty: difficulty })
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

export const useDeleteNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase
                .from('note')
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