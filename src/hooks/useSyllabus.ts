import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface SyllabusData {
    courseCode: string | number;
    academicCode?: string;
}

export function useCreateSyllabus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ syllabus, file }: { syllabus: SyllabusData; file: File }) => {
            const formData = new FormData();
            formData.append('courseCode', syllabus.courseCode.toString());

            if (syllabus.academicCode) {
                formData.append('periodAcademicCode', syllabus.academicCode);
            }

            formData.append('pdf', file);

            const { data, error } = await supabase.functions.invoke('create-syllabus', {
                body: formData,
            });

            if (error) {
                // El body real está en error.context
                const body = await error.context?.json().catch(() => null);
                throw new Error(body?.error || error.message || 'Error al crear el sílabo');
            }

            return data.data;
        },
        onSuccess: () => {
            // Invalidate course and syllabi query cache
            queryClient.invalidateQueries({ queryKey: ['syllabi'] });
            queryClient.invalidateQueries({ queryKey: ['course'] });
        },
    });
}