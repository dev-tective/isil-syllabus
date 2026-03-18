import { useState } from 'react';
import { Icon } from '@iconify/react';
import { RecomendationModification } from '../RecomendationModification';
import { useDeleteRecomendation } from '../../hooks/useRecomendation';
import { EmptyState } from './EmptyState';
import type { TeacherRecomendation } from '../../hooks/useRecomendation';

interface RecommendationsTabProps {
  recommendations: TeacherRecomendation[];
  courseId: number;
  userId: string | null;
}

export const RecommendationsTab = ({ recommendations, courseId, userId }: RecommendationsTabProps) => {
  const myRec = recommendations.find((r) => r.user_id === userId);
  const communityRecs = recommendations.filter((r) => r.user_id !== userId);

  return (
    <div className="space-y-4">
      <MyRecSection myRec={myRec} courseId={courseId} userId={userId} />
      <CommunityRecs recs={communityRecs} hasMyRec={!!myRec} userId={userId} />
    </div>
  );
};

/* ─── Shared: rec card body ──────────────────────────────────────── */

const RecCard = ({ rec, children }: { rec: TeacherRecomendation; children?: React.ReactNode }) => (
  <div className="space-y-3">
    {/* Teacher name + recommend badge */}
    <div className="flex items-center gap-3 flex-wrap">
      <h3 className="text-lg font-bold text-brand-cyan">{rec.teacher_name}</h3>
      <span
        className={[
          'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
          rec.is_recommended
            ? 'bg-green-500/15 text-green-400'
            : 'bg-red-500/15 text-red-400',
        ].join(' ')}
      >
        <Icon
          icon={rec.is_recommended ? 'mingcute:thumb-up-fill' : 'mingcute:thumb-down-fill'}
          className="text-sm"
        />
        {rec.is_recommended ? 'Recomendado' : 'No recomendado'}
      </span>
    </div>

    {/* Flags / chips */}
    {rec.recommendation_flags?.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {rec.recommendation_flags.map((flag) => (
          <span
            key={flag}
            className="rounded-full border border-brand-cyan/20 bg-brand-cyan/10 px-2.5 py-0.5 text-xs capitalize text-brand-cyan"
          >
            {flag}
          </span>
        ))}
      </div>
    )}

    {/* Optional comment */}
    {rec.content && (
      <p className="whitespace-pre-line text-sm leading-relaxed text-white">{rec.content}</p>
    )}

    {children}
  </div>
);

/* ─── My recommendation ──────────────────────────────────────────── */

interface MyRecSectionProps {
  myRec?: TeacherRecomendation;
  courseId: number;
  userId: string | null;
}

const MyRecSection = ({ myRec, courseId, userId }: MyRecSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const deleteRec = useDeleteRecomendation();

  if (!userId || !myRec) {
    return <RecomendationModification courseId={courseId} userId={userId} />;
  }

  if (isEditing) {
    return (
      <RecomendationModification
        recomendationId={myRec.id}
        initialContent={myRec.content}
        initialTeacherName={myRec.teacher_name}
        initialRecommendation={myRec.recommendation_flags ?? []}
        initialIsRecommended={myRec.is_recommended}
        courseId={courseId}
        userId={userId}
        onSuccess={() => setIsEditing(false)}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="relative mb-6 overflow-hidden rounded-xl border border-brand-cyan/20 bg-brand-cyan/10 p-5">
      {/* "Mi recomendación" badge */}
      {/* <div className="absolute right-0 top-0 rounded-bl-xl bg-brand-cyan/20 p-2">
        <span className="text-xs font-bold italic text-brand-cyan">Mi recomendación</span>
      </div> */}

      <div className="pt-2">
        <RecCard rec={myRec}>
          <div className="flex items-center justify-between border-t border-brand-cyan/20 pt-3 text-xs">
            <span className="text-gray-400">{new Date(myRec.created_at).toLocaleDateString()}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="text-brand-cyan transition-colors hover:text-white"
                aria-label="Editar recomendación"
              >
                <Icon icon="mingcute:edit-line" className="text-xl" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que deseas eliminar esta recomendación?')) {
                    deleteRec.mutate(myRec.id);
                  }
                }}
                disabled={deleteRec.isPending}
                className="text-red-500 transition-colors hover:text-white disabled:opacity-50"
                aria-label="Eliminar recomendación"
              >
                <Icon icon="mingcute:delete-2-line" className="text-xl" />
              </button>
            </div>
          </div>
        </RecCard>
      </div>
    </div>
  );
};

/* ─── Community recommendations ─────────────────────────────────── */

interface CommunityRecsProps {
  recs: TeacherRecomendation[];
  hasMyRec: boolean;
  userId: string | null;
}

const CommunityRecs = ({ recs, hasMyRec, userId }: CommunityRecsProps) => {
  if (recs.length === 0 && (!userId || !hasMyRec)) {
    return <EmptyState icon="mdi:teacher" message="Aún no hay recomendaciones" />;
  }

  if (recs.length === 0) {
    return (
      <p className="py-4 text-center text-sm italic text-gray-400">
        Aún no hay recomendaciones de otros estudiantes.
      </p>
    );
  }

  return (
    <>
      {hasMyRec && (
        <h3 className="mb-2 mt-6 text-sm font-bold text-gray-400">Comunidad</h3>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {recs.map((rec) => (
          <div
            key={rec.id}
            className={[
              'rounded-xl border bg-brand-cyan/5 p-5',
              rec.is_recommended
                ? 'border-green-500/20'
                : 'border-red-500/20',
            ].join(' ')}
          >
            <RecCard rec={rec}>
              <p className="border-t border-brand-cyan/10 pt-2 text-xs text-gray-500">
                {new Date(rec.created_at).toLocaleDateString()}
              </p>
            </RecCard>
          </div>
        ))}
      </div>
    </>
  );
};
