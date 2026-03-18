import type { Difficulty } from "@/hooks/useNote"

interface Props {
    difficulty: Difficulty;
    opacity?: number;
    className?: string;
}

export const DifficultyBadge = ({ difficulty, opacity, className }: Props) => {
    const bg = `${difficulty === 'fácil' ? 'bg-green-500' :
        difficulty === 'intermedio' ? 'bg-yellow-500' :
            difficulty === 'difícil' ? 'bg-red-500' :
                'bg-gray-500'}${opacity ? `/${opacity}` : ''}`;

    return (
        <span className={`
            rounded-md font-bold uppercase
            text-gray-200
            ${bg} ${className}
        `}>
            {difficulty || 'Sin evaluar'}
        </span>
    )
}