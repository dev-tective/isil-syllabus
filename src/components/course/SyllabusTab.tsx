import { Icon } from '@iconify/react';
import { EmptyState } from './EmptyState';
import { UploadSyllabus } from '@/components/interactive/UploadSyllabus';
import type { Syllabus } from '@/hooks/useCourse';

interface SyllabusTabProps {
  syllabuses: Syllabus[];
}

export const SyllabusTab = ({ syllabuses }: SyllabusTabProps) => (
  <div className="space-y-4">
    <UploadSyllabus />

    {syllabuses.length === 0 ? (
      <EmptyState icon="tdesign:file-filled" message="Aún no hay sílabos para este curso" />
    ) : (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {syllabuses.map((syl) => (
          <SyllabusCard key={syl.id} syllabus={syl} />
        ))}
      </div>
    )}
  </div>
);

const SyllabusCard = ({ syllabus: syl }: { syllabus: Syllabus }) => (
  <a
    href={syl.pdf_url}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center justify-between rounded-xl border border-brand-cyan/10 bg-brand-cyan/5 p-4"
  >
    <div>
      <p className="font-medium text-white">{syl.period_academic?.code}</p>
      {syl.period_academic && (
        <p className="text-sm text-gray-400">
          {syl.period_academic.year} - {syl.period_academic.semester?.name || 'Semestre'}
        </p>
      )}
      <p className="mt-1 text-xs text-brand-cyan/60">
        {new Date(syl.created_at).toLocaleDateString()}
      </p>
    </div>

    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-cyan/10 text-brand-cyan transition-all group-hover:bg-brand-cyan group-hover:text-brand-dark">
      <Icon icon="mingcute:download-line" className="text-xl" />
    </span>
  </a>
);
