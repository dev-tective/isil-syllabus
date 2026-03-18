import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { DifficultyBadge } from './DifficultyBadge';
import type { Course } from '../../hooks/useCourse';

export const CourseHeader = ({ course } : { course: Course } ) => {
  const { name, code, credits, difficulty } = course;
  const navigate = useNavigate();

  return (
    <section className="mx-auto w-11/12 py-5">
      {/* Back button + difficulty badge */}
      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="rounded-xl bg-brand-cyan/10 p-2 text-brand-cyan transition-colors hover:bg-brand-cyan/20"
          aria-label="Volver al inicio"
        >
          <Icon icon="mingcute:left-line" className="text-xl" />
        </button>

        <DifficultyBadge difficulty={difficulty as any} />
      </div>

      {/* Course title + meta */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold capitalize text-white lg:text-4xl">{name}</h1>
        <div className="flex flex-wrap gap-4 text-gray-400">
          <span className="flex items-center gap-1">
            <Icon icon="mingcute:barcode-line" /> {code}
          </span>
          <span className="flex items-center gap-1">
            <Icon icon="mingcute:book-line" /> {credits} Créditos
          </span>
        </div>
      </div>
    </section>
  );
};
