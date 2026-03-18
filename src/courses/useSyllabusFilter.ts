import { useState, useMemo } from "react";
import { useSyllables } from "../hooks/useSupabase";
import type { OptionType } from "../components/SyllabusFilterOptions";

export const semesterOptions: OptionType[] = [
    { value: "1", label: "Verano" },
    { value: "2", label: "Regular 1" },
    { value: "3", label: "Regular 2" },
];

export const courseTypeOptions: OptionType[] = [
    { value: "Carrera técnica", label: "Carrera técnica" },
    { value: "Escuela", label: "Escuela" },
];

const normalizeString = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const useSyllabusFilter = () => {
    const { isLoading, error, data } = useSyllables();

    const [searchTerm, setSearchTerm] = useState("");
    const [yearsId, setYearsId] = useState<number[]>([]);
    const [semestersId, setSemestersId] = useState<number[]>([]);
    const [courseTypeId, setCourseTypeId] = useState<string[]>([]);

    const allSyllables = data || [];

    const yearsOption = useMemo(() => {
        const uniqueYears = new Set(
            allSyllables
                .filter(s => s.periodAcademic !== null)
                .map(s => s.periodAcademic!.year.toString())
        );
        return Array.from(uniqueYears).map(year => ({ value: year, label: year }));
    }, [allSyllables]);

    const filteredSyllables = useMemo(() => {
        const normalized = normalizeString(searchTerm);
        return allSyllables.filter(({ periodAcademic, course }) => {
            const searchMatch = searchTerm === "" || (course && normalizeString(course.name).includes(normalized));
            const yearMatch = yearsId.length === 0 || (periodAcademic && yearsId.includes(periodAcademic.year));
            const semesterMatch = semestersId.length === 0 || (periodAcademic && semestersId.includes(periodAcademic.semester_id));
            const courseTypeMatch = courseTypeId.length === 0 || (course && courseTypeId.includes(course.course_type));
            return searchMatch && yearMatch && semesterMatch && courseTypeMatch;
        });
    }, [allSyllables, searchTerm, yearsId, semestersId, courseTypeId]);

    return {
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        yearsOption,
        filteredSyllables,
        setYearsId: (opts: OptionType[]) => setYearsId(opts.map(o => Number(o.value))),
        setSemestersId: (opts: OptionType[]) => setSemestersId(opts.map(o => Number(o.value))),
        setCourseTypeId: (opts: OptionType[]) => setCourseTypeId(opts.map(o => o.value)),
    };
};