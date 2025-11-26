import { useEffect, useRef, useState } from 'react';
import { useSupabase } from "../../contexts/hooks/useSupabase.ts";
import type { OptionType } from "../SyllabusFilterOptions.tsx";
import type { SyllabusData } from "../../lib/read-pdf.ts";

export interface SyllabusFilter {
    name: string;
    years: number[];
    semesters: number[];
    department_ids: number[];
    courseType: string[];
}

export interface Syllabus {
    id: number;
    pdfUrl: string;
    course: Course;
    periodAcademic: PeriodAcademic | null;
}

interface Course {
    id: number;
    code: number;
    name: string;
    credits: number;
    courseType: string;
}

interface PeriodAcademic {
    id: number;
    code: string;
    year: number;
    semester: { id: number; name: string; nature: string; period: string };
}

let allSyllables: Syllabus[] = [];

function useSyllabus() {
    const { supabase } = useSupabase();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [syllables, setSyllables] = useState<Syllabus[]>([]);
    const [syllabusFilter, setSyllabusFilter] = useState<SyllabusFilter>({
        name: '', years: [], semesters: [], department_ids: [], courseType: []
    })
    const [totalYears, setTotalYears] = useState<string[]>([])

    const fetchingRef = useRef(false);
    const hasFetchedRef = useRef(false);

    const getAllSyllabus = async () => {
        if (fetchingRef.current) {
            console.log('⏳ Ya hay una petición en curso, ignorando...');
            return;
        }

        fetchingRef.current = true;
        setTotalYears([])
        setLoading(true);
        setError(null);

        try {
            const { data, error: invokeError } = await supabase
                .functions
                .invoke('get-courses-with-syllabi')

            if (invokeError) {
                console.error(invokeError);
                if (invokeError.message?.includes('Edge Function returned a non-2xx status code')) {
                    setError('Demasiadas peticiones. Por favor espera un momento.');
                    fetchingRef.current = false;
                    return;
                }
                setError(invokeError.message);
                fetchingRef.current = false;
                return;
            }

            allSyllables = data || []

            setSyllables(allSyllables);

            const years = Array.from(
                new Set(
                    allSyllables
                        .filter(
                            (s): s is Syllabus & { periodAcademic: PeriodAcademic } =>
                                s.periodAcademic !== null
                        )
                        .map(s => s.periodAcademic.year.toString())
                )
            );

            setTotalYears(years);

            hasFetchedRef.current = true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error inesperado';
            console.error(err);
            setError(errorMessage);
        } finally {
            setLoading(false);
            fetchingRef.current = false;
        }
    };

    const createSyllabus = async (syllabus: SyllabusData, file: File) => {
        setLoading(true);
        setError(null);

        try {
            // Crear FormData
            const formData = new FormData();
            formData.append('courseCode', syllabus.courseCode.toString());

            if (syllabus.academicCode) {
                formData.append('periodAcademicCode', syllabus.academicCode);
            }

            formData.append('pdf', file);

            // Llamar a la Edge Function usando el cliente de Supabase
            const { data, error: invokeError } = await supabase.functions.invoke('create-syllabus', {
                body: formData,
            });

            if (invokeError) {
                console.error(invokeError);
                if (invokeError.message?.includes('Edge Function returned a non-2xx status code')) {
                    setError('Error al procesar la solicitud. Por favor intenta nuevamente.');
                }
                setError(invokeError.message || 'Error al crear el sílabo');
            }

            // Retornar los datos exitosos
            return data.data;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error inesperado al crear sílabo';
            console.error(err);
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const filterSyllables = (syllabusFilter: SyllabusFilter) => {
        const normalizeString = (str: string) => {
            return str
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
        };

        // Normaliza el término de búsqueda una sola vez
        const normalizedSearchName = normalizeString(syllabusFilter.name);

        // Filtros
        const filtered = allSyllables.filter(({ periodAcademic, course }) => {
            const yearMatch = syllabusFilter.years.length === 0 || periodAcademic &&
                syllabusFilter.years.includes(periodAcademic.year);

            const semesterMatch = syllabusFilter.semesters.length === 0 || periodAcademic &&
                syllabusFilter.semesters.includes(periodAcademic.semester.id);

            const nameMatch = syllabusFilter.name === '' || course != null &&
                normalizeString(course.name).includes(normalizedSearchName);

            const courseTypeMatch = syllabusFilter.courseType.length === 0 || course &&
                syllabusFilter.courseType.includes(course.courseType);

            return yearMatch && semesterMatch && nameMatch && courseTypeMatch;
        });

        setSyllables(filtered);
    };

    const setYears = (values: OptionType[]) => {
        const years = values.map(value => Number.parseInt(value.value));
        setSyllabusFilter(prev => ({
            ...prev,
            years
        }))
    }

    const setSemesters = (values: OptionType[]) => {
        const semesters = values.map(value => Number.parseInt(value.value));
        setSyllabusFilter(prev => ({
            ...prev,
            semesters: semesters
        }))
    }

    const setName = (value: string) => {
        setSyllabusFilter(prev => ({
            ...prev,
            name: value
        }))
    }

    const setCourseType = (values: OptionType[]) => {
        const courseTypes = values.map(value => value.value);
        setSyllabusFilter(prev => ({
            ...prev,
            courseType: courseTypes
        }))
    }

    useEffect(() => {
        if (!hasFetchedRef.current) {
            getAllSyllabus();
        }

        // Cleanup opcional para evitar memory leaks
        return () => {
            // Si el componente se desmonta mientras está cargando, cancelar
            fetchingRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (allSyllables.length > 0) {
            filterSyllables(syllabusFilter);
        }
    }, [syllabusFilter]);

    return {
        totalYears,
        createSyllabus,
        setName,
        setYears,
        setSemesters,
        setCourseType,
        syllables,
        loading,
        error,
        getAllSyllabus,
    };
}

export default useSyllabus;