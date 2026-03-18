type Difficulty = 'fácil' | 'intermedio' | 'difícil' | null | undefined;

const difficultyStyles: Record<string, string> = {
  'fácil': 'bg-green-500/80 text-white',
  'intermedio': 'bg-yellow-500/80 text-white',
  'difícil': 'bg-red-500/80 text-white',
};

interface DifficultyBadgeProps {
  difficulty?: Difficulty;
  className?: string;
}

export const DifficultyBadge = ({ difficulty, className = '' }: DifficultyBadgeProps) => {
  const style = difficulty ? (difficultyStyles[difficulty] ?? 'bg-gray-600 text-white') : 'bg-gray-600 text-white';

  return (
    <span className={`px-3 py-1 text-sm font-bold uppercase rounded-md ${style} ${className}`}>
      {difficulty || 'Sin evaluar'}
    </span>
  );
};

/** Inline variant used inside note/rec cards (subtle background) */
export const DifficultyPill = ({ difficulty }: { difficulty?: Difficulty }) => {
  return (
    <span className={`
      px-2 py-1 
      rounded-md font-medium 
      uppercase text-xs
      text-gray-200
      ${difficulty === 'fácil' ? 'bg-green-500/50' : 
        difficulty === 'intermedio' ? 'bg-yellow-500/50' : 
        difficulty === 'difícil' ? 'bg-red-500/50' : 'bg-gray-500/50'}
    `}>
      {difficulty || 'Sin evaluar'}
    </span>
  );
};
