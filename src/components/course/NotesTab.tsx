import { Icon } from '@iconify/react';
import { NoteModification } from '../NoteModification';
import { useDeleteNote } from '../../hooks/useNote';
import { EmptyState } from './EmptyState';
import { DifficultyPill } from './DifficultyBadge';
import { useState } from 'react';
import type { Note } from '../../hooks/useNote';
import { detectAllVideos } from '@/hooks/useVideoDetectation';
import { VideoPreviewList } from '@/components/interactive/VideoPreview';

interface NotesTabProps {
  notes: Note[];
  courseId: number;
  userId: string | null;
}

export const NotesTab = ({ notes, courseId, userId }: NotesTabProps) => {
  const myNote = notes.find((n) => n.user_id === userId);
  const communityNotes = notes.filter((n) => n.user_id !== userId);

  return (
    <div className="space-y-4">
      <MyNoteSection myNote={myNote} courseId={courseId} userId={userId} />
      <CommunityNotes notes={communityNotes} hasMyNote={!!myNote} userId={userId} />
    </div>
  );
};

/* ─── Utilidad: oculta URLs de video del texto ─────────────────── */

// Regex amplio para URLs — elimina cualquier link que detectAllVideos haya encontrado
const URL_REGEX = /https?:\/\/[^\s]+/g;

function stripVideoLinks(text: string): string {
  const videos = detectAllVideos(text);
  if (videos.length === 0) return text;
  const videoUrls = new Set(videos.map((v) => v.url));
  return text
    .replace(URL_REGEX, (url) => (videoUrls.has(url) ? '' : url))
    .replace(/\n{3,}/g, '\n\n') // colapsar líneas vacías extras
    .trim();
}

/* ─── My note ─────────────────────────────────────────────────── */

interface MyNoteSectionProps {
  myNote?: Note;
  courseId: number;
  userId: string | null;
}

const MyNoteSection = ({ myNote, courseId, userId }: MyNoteSectionProps) => {
  const { isEditing, setIsEditing } = useEditState();
  const deleteNote = useDeleteNote();

  if (!userId || !myNote) {
    return <NoteModification courseId={courseId} userId={userId} />;
  }

  if (isEditing) {
    return (
      <NoteModification
        noteId={myNote.id}
        initialContent={myNote.content}
        initialDifficulty={myNote.define_difficulty}
        courseId={courseId}
        userId={userId}
        onSuccess={() => setIsEditing(false)}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const videos = detectAllVideos(myNote.content);
  const cleanContent = stripVideoLinks(myNote.content);

  return (
    <div className="relative mb-6 overflow-hidden rounded-xl border border-brand-cyan/20 bg-brand-cyan/10 p-5 space-y-3">
      {/* Texto sin los links de video */}
      {cleanContent && (
        <p className="whitespace-pre-line pt-2 text-sm leading-relaxed text-white">
          {cleanContent}
        </p>
      )}

      {/* Previews de videos */}
      {videos.length > 0 && (
        <VideoPreviewList videos={videos} />
      )}

      <div className="flex items-center justify-between border-t border-brand-cyan/20 pt-3 text-xs">
        <DifficultyPill difficulty={myNote.define_difficulty as any} />
        <div className="flex items-center gap-3 text-gray-400">
          <span>{new Date(myNote.created_at).toLocaleDateString()}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-brand-cyan transition-colors hover:text-white"
            aria-label="Editar apunte"
          >
            <Icon icon="mingcute:edit-line" className="text-xl" />
          </button>
          <button
            onClick={() => {
              if (window.confirm('¿Estás seguro de que deseas eliminar este apunte?')) {
                deleteNote.mutate(myNote.id);
              }
            }}
            disabled={deleteNote.isPending}
            className="text-red-500 transition-colors hover:text-white disabled:opacity-50"
            aria-label="Eliminar apunte"
          >
            <Icon icon="mingcute:delete-2-line" className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Community notes ──────────────────────────────────────────── */

interface CommunityNotesProps {
  notes: Note[];
  hasMyNote: boolean;
  userId: string | null;
}

const CommunityNotes = ({ notes, hasMyNote, userId }: CommunityNotesProps) => {
  if (notes.length === 0 && (!userId || !hasMyNote)) {
    return <EmptyState icon="clarity:note-edit-solid" message="Aún no hay apuntes para este curso" />;
  }

  if (notes.length === 0) {
    return (
      <p className="py-4 text-center text-sm italic text-gray-400">
        Aún no hay apuntes de otros estudiantes.
      </p>
    );
  }

  return (
    <>
      {hasMyNote && (
        <h3 className="mb-2 mt-6 text-sm font-bold text-gray-400">Comunidad</h3>
      )}
      <div className="grid grid-cols-1 gap-4">
        {notes.map((note) => {
          const videos = detectAllVideos(note.content);
          const cleanContent = stripVideoLinks(note.content);

          return (
            <div key={note.id} className="space-y-3 rounded-xl border border-brand-cyan/10 bg-brand-cyan/5 p-5">
              {cleanContent && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-white">
                  {cleanContent}
                </p>
              )}

              {videos.length > 0 && (
                <VideoPreviewList videos={videos} />
              )}

              <div className="flex items-center justify-between border-t border-brand-cyan/10 pt-3 text-xs">
                <DifficultyPill difficulty={note.define_difficulty as any} />
                <span className="text-gray-500">{new Date(note.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ─── Local hook ───────────────────────────────────────────────── */

const useEditState = () => {
  const [isEditing, setIsEditing] = useState(false);
  return { isEditing, setIsEditing };
};