// NoteModification.tsx — detecta y renderiza TODOS los videos del textarea

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Difficulty } from "../hooks/useNote";
import { useCreateNote, useUpdateNote } from "../hooks/useNote";
import { Icon } from "@iconify/react";
import { detectAllVideos } from "../hooks/useVideoDetectation";
import type { DetectedVideo } from "../hooks/useVideoDetectation";
import { VideoPreviewList } from "./interactive/VideoPreview";

interface NoteModificationProps {
    initialContent?: string;
    initialDifficulty?: Difficulty;
    noteId?: number;
    courseId: number;
    userId: string | null;
    onSuccess?: () => void;
    onCancel?: () => void;
    /** Callback con todos los videos detectados en el texto (array vacío si no hay) */
    onVideosDetected?: (videos: DetectedVideo[]) => void;
}

export const NoteModification = ({
    initialContent = "",
    initialDifficulty = null,
    noteId,
    courseId,
    userId,
    onSuccess,
    onCancel,
    onVideosDetected,
}: NoteModificationProps) => {
    const navigate = useNavigate();
    const createNoteMutation = useCreateNote();
    const updateNoteMutation = useUpdateNote();

    const [content, setContent] = useState(initialContent);
    const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);

    const isEditing = !!noteId;
    const isPending = createNoteMutation.isPending || updateNoteMutation.isPending;
    const isError = createNoteMutation.isError || updateNoteMutation.isError;

    // Detecta todos los videos cada vez que cambia el contenido
    const detectedVideos = useMemo(() => {
        const videos = detectAllVideos(content);
        onVideosDetected?.(videos);
        return videos;
    }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSave = () => {
        if (!userId) {
            navigate("/login");
            return;
        }
        if (!content.trim()) return;

        if (isEditing) {
            updateNoteMutation.mutate(
                { id: noteId, content, difficulty },
                { onSuccess: () => onSuccess?.() }
            );
        } else {
            createNoteMutation.mutate(
                { content, difficulty, course_id: courseId, user_id: userId },
                {
                    onSuccess: () => {
                        setContent("");
                        setDifficulty(null);
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
                <div className="w-full flex items-center justify-between gap-2 text-white">

                    <h3 className="text-sm font-bold">
                        {isEditing ? "Edita" : "Agrega"} tu aporte sobre el curso
                    </h3>
                    <Icon
                        icon={isExpanded ? "mingcute:up-line" : "mingcute:down-line"}
                        className={`ml-auto text-brand-cyan transition-transform duration-300 ${isExpanded ? "" : "rotate-180"}`}
                    />
                </div>

            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                    <div className="space-y-4 p-5 pt-0">
                        <div className="flex items-center gap-3">
                            <select
                                value={difficulty || ""}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => setDifficulty((e.target.value as Difficulty) || null)}
                                className="bg-brand-dark border border-brand-cyan/20 rounded-lg text-xs text-white p-2 focus:outline-none focus:border-brand-cyan"
                                disabled={isPending}
                            >
                                <option value="">Dificultad</option>
                                <option value="fácil">Fácil</option>
                                <option value="intermedio">Intermedio</option>
                                <option value="difícil">Difícil</option>
                            </select>

                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Comparte tu experiencia, tips o recomendaciones sobre el curso..."
                            className="w-full h-24 p-3 bg-brand-dark/50 text-white placeholder-gray-500 border border-brand-cyan/20 rounded-xl focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan resize-none transition-all text-sm"
                            disabled={isPending}
                        />

                        {/* Lista de todos los videos detectados */}
                        <VideoPreviewList videos={detectedVideos} />

                        <div className="flex justify-end gap-3">
                            {onCancel && (
                                <button
                                    onClick={onCancel}
                                    disabled={isPending}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm font-bold"
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={
                                    !content.trim() ||
                                    isPending ||
                                    (isEditing &&
                                        content === initialContent &&
                                        difficulty === initialDifficulty)
                                }
                                className="px-6 py-2 bg-brand-cyan text-brand-dark font-bold text-sm rounded-xl hover:bg-brand-cyan-hover transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? (
                                    <Icon icon="mingcute:loading-line" className="animate-spin text-lg" />
                                ) : (
                                    <Icon icon={isEditing ? "mingcute:save-line" : "mingcute:send-fill"} />
                                )}
                                {isPending
                                    ? "Guardando..."
                                    : isEditing
                                        ? "Guardar cambios"
                                        : "Publicar apunte"}
                            </button>
                        </div>

                        {isError && (
                            <p className="text-red-500 text-xs mt-2 text-right">
                                Ocurrió un error al guardar el apunte.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};