import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import {
    useCreateRecomendation,
    useUpdateRecomendation,
    useGetTeachers,
    useGetRecommendationFlags,
} from "../hooks/useRecomendation";
import { Icon } from "@iconify/react";

interface RecomendationModificationProps {
    initialContent?: string;
    initialTeacherName?: string;
    initialRecommendation?: string[];
    initialIsRecommended?: boolean;
    recomendationId?: number;
    courseId: number;
    userId: string | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const RecomendationModification = ({
    initialContent = "",
    initialTeacherName = "",
    initialRecommendation = [],
    initialIsRecommended = true,
    recomendationId,
    courseId,
    userId,
    onSuccess,
    onCancel,
}: RecomendationModificationProps) => {
    const navigate = useNavigate();
    const createMutation = useCreateRecomendation();
    const updateMutation = useUpdateRecomendation();

    const [content, setContent] = useState(initialContent);
    const [teacherName, setTeacherName] = useState(initialTeacherName);
    const [selectedFlags, setSelectedFlags] = useState<string[]>(initialRecommendation);
    const [isRecommended, setIsRecommended] = useState(initialIsRecommended);

    const { data: availableFlags = [] } = useQuery({
        queryKey: ['recommendationFlags'],
        queryFn: useGetRecommendationFlags,
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    // Autocomplete state
    const [teachers, setTeachers] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const isEditing = !!recomendationId;
    const isPending = createMutation.isPending || updateMutation.isPending;
    const isError = createMutation.isError || updateMutation.isError;

    // Load existing teacher names for autocomplete
    useEffect(() => {
        useGetTeachers().then((names) => setTeachers(names));
    }, []);

    // Filter suggestions on input change
    const handleTeacherInput = (value: string) => {
        setTeacherName(value);
        if (value.length >= 2) {
            const filtered = teachers.filter((t) =>
                t.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (name: string) => {
        setTeacherName(name);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const toggleFlag = (flag: string) => {
        setSelectedFlags((prev) =>
            prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
        );
    };

    const hasChanges =
        content !== initialContent ||
        teacherName !== initialTeacherName ||
        isRecommended !== initialIsRecommended ||
        JSON.stringify(selectedFlags) !== JSON.stringify(initialRecommendation);

    const handleSave = () => {
        if (!userId) { navigate("/login"); return; }
        if (!teacherName.trim()) return;

        const payload = {
            content,
            teacher_name: teacherName,
            recommendation_flags: selectedFlags,
            is_recommended: isRecommended,
        };

        if (isEditing) {
            updateMutation.mutate(
                { id: recomendationId, ...payload },
                { onSuccess: () => onSuccess?.() }
            );
        } else {
            createMutation.mutate(
                { ...payload, course_id: courseId, user_id: userId },
                {
                    onSuccess: () => {
                        setContent(""); setTeacherName("");
                        setSelectedFlags([]); setIsRecommended(true);
                        onSuccess?.();
                    },
                }
            );
        }
    };

    const [isExpanded, setIsExpanded] = useState(isEditing);

    return (
        <div className="mb-6 rounded-xl border border-brand-cyan/10 bg-brand-cyan/5">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-brand-cyan/5 focus:outline-none"
            >
                <div className="flex items-center gap-2 text-white">
                    <h3 className="text-sm font-bold">
                        {isEditing ? "Edita" : "Agrega"} la recomendación
                    </h3>
                </div>
                <Icon
                    icon={isExpanded ? "mingcute:up-line" : "mingcute:down-line"}
                    className={`text-brand-cyan transition-transform duration-300 ${isExpanded ? "" : "rotate-180"}`}
                />
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                    <div className="space-y-4 p-5 pt-0">
                        {/* ── Teacher name with autocomplete ── */}
            <div className="relative">
                <label className="mb-1 block text-xs font-medium text-gray-400">
                    Nombre del profesor
                </label>
                <div className="relative flex items-center">
                    <Icon
                        icon="mdi:teacher"
                        className="absolute left-3 text-brand-cyan text-lg pointer-events-none"
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        value={teacherName}
                        onChange={(e) => handleTeacherInput(e.target.value)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        onFocus={() => teacherName.length >= 2 && setShowSuggestions(suggestions.length > 0)}
                        placeholder="Nombre completo del profesor"
                        disabled={isPending}
                        className="w-full rounded-xl border border-brand-cyan/20 bg-brand-dark py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 transition-colors focus:border-brand-cyan focus:outline-none"
                    />
                </div>

                {/* Suggestions dropdown */}
                {showSuggestions && (
                    <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-brand-cyan/20 bg-brand-dark shadow-xl">
                        {suggestions.map((name) => (
                            <li
                                key={name}
                                onMouseDown={() => selectSuggestion(name)}
                                className="cursor-pointer px-4 py-2 text-sm text-white transition-colors hover:bg-brand-cyan/10"
                            >
                                {name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* ── Would you recommend? toggle ── */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => setIsRecommended((v) => !v)}
                    disabled={isPending}
                    className={[
                        "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-all",
                        isRecommended
                            ? "border-green-500/50 bg-green-500/15 text-green-400"
                            : "border-red-500/50 bg-red-500/15 text-red-400",
                    ].join(" ")}
                >
                    <Icon
                        icon={isRecommended ? "mingcute:thumb-up-fill" : "mingcute:thumb-down-fill"}
                        className="text-lg"
                    />
                    {isRecommended ? "Lo recomiendo" : "No lo recomiendo"}
                </button>
                <span className="text-xs text-gray-500 italic">Toca para cambiar</span>
            </div>

            {/* ── Comment textarea ── */}
            <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                    Comentario <span className="text-gray-600">(opcional)</span>
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Comparte tu experiencia con este profesor, su metodología, etc..."
                    rows={3}
                    disabled={isPending}
                    className="w-full resize-none rounded-xl border border-brand-cyan/20 bg-brand-dark/50 p-3 text-sm text-white placeholder-gray-500 transition-all focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan"
                />
            </div>

            {/* ── Flags / chips ── */}
            <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                    Características del profesor <span className="text-gray-600">(opcional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {availableFlags.map((flag) => {
                        const active = selectedFlags.includes(flag);
                        return (
                            <button
                                key={flag}
                                type="button"
                                onClick={() => toggleFlag(flag)}
                                disabled={isPending}
                                className={[
                                    "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all",
                                    active
                                        ? "border-brand-cyan/60 bg-brand-cyan/20 text-brand-cyan"
                                        : "border-brand-cyan/10 bg-transparent text-gray-400 hover:border-brand-cyan/30 hover:text-white",
                                ].join(" ")}
                            >
                                {active && <span className="mr-1">✓</span>}
                                {flag}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Actions ── */}
            <div className="flex justify-end gap-3">
                {onCancel && (
                    <button
                        onClick={onCancel}
                        disabled={isPending}
                        className="px-4 py-2 text-sm font-bold text-gray-400 transition-colors hover:text-white"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    onClick={handleSave}
                    disabled={!teacherName.trim() || isPending || (isEditing && !hasChanges)}
                    className="flex items-center gap-2 rounded-xl bg-brand-cyan px-6 py-2 text-sm font-bold text-brand-dark transition-colors hover:bg-brand-cyan-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isPending ? (
                        <Icon icon="mingcute:loading-line" className="animate-spin text-lg" />
                    ) : (
                        <Icon icon={isEditing ? "mingcute:save-line" : "mingcute:send-fill"} />
                    )}
                    {isPending ? "Guardando..." : isEditing ? "Guardar cambios" : "Publicar"}
                </button>
            </div>

            {isError && (
                <p className="mt-2 text-right text-xs text-red-500">
                    Ocurrió un error al guardar la recomendación.
                </p>
            )}
                    </div>
                </div>
            </div>
        </div>
    );
};
