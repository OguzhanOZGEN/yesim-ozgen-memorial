import { useState } from 'react';
import { Note } from '@/types';
import { formatRelativeTime } from '@/utils/date';
import { translateText } from '@/utils/translate';
import { detectLanguage } from '@/utils/detectLanguage';
import { useLanguage } from '@/context/LanguageContext';

interface NoteCardProps {
  note: Note;
  showStatus?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function NoteCard({ note, showStatus, onApprove, onReject }: NoteCardProps) {
  const hasImage = !!note.imageUrl;
  const isPending = note.status === 'pending';
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { language, t } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedMessage, setTranslatedMessage] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  // Detect note language and check if translation is needed
  const noteLanguage = detectLanguage(note.message);
  const needsTranslation = noteLanguage !== language;

  const handleTranslate = async () => {
    if (translatedMessage) {
      setShowTranslation(!showTranslation);
      return;
    }

    setIsTranslating(true);
    try {
      const translated = await translateText(note.message, language);
      setTranslatedMessage(translated);
      setShowTranslation(true);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className={`rounded-xl border p-6 shadow-sm ${
      isPending 
        ? 'border-teal-500/30 bg-white/50 dark:border-teal-900/50 dark:bg-background-dark/30'
        : 'border-gray-200 bg-white dark:border-teal-900/50 dark:bg-background-dark/50'
    }`}>
      <div className={`flex flex-col gap-6 ${hasImage ? 'md:flex-row' : ''}`}>
        {/* Content */}
        <div className={`flex flex-col gap-3 ${hasImage ? 'flex-[2_2_0px]' : ''}`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {note.name} - {formatRelativeTime(note.createdAt)}
              {showStatus && isPending && (
                <span className="ml-2 text-amber-500">({t('notes.pending')})</span>
              )}
            </p>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {showTranslation && translatedMessage ? translatedMessage : note.message}
          </p>

          {/* Translate Button - Only show if note is in different language */}
          {needsTranslation && (
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="self-start flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined !text-sm">translate</span>
              <span>
                {isTranslating 
                  ? t('common.loading')
                  : showTranslation 
                  ? t('common.original')
                  : t('common.translate')}
              </span>
            </button>
          )}

          {/* Admin Actions */}
          {isPending && onApprove && onReject && (
            <div className="mt-2 flex w-full shrink-0 items-center gap-3">
              <button
                onClick={() => onApprove(note.id)}
                className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-500/10 px-4 text-sm font-medium text-green-600 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30 transition-colors"
              >
                <span className="material-symbols-outlined !text-base">check_circle</span>
                <span>{t('notes.approve')}</span>
              </button>
              <button
                onClick={() => onReject(note.id)}
                className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 text-sm font-medium text-red-500 hover:bg-red-500/20 dark:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors"
              >
                <span className="material-symbols-outlined !text-base">cancel</span>
                <span>{t('notes.reject')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Image */}
        {hasImage && (
          <>
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="aspect-video w-full flex-1 self-stretch rounded-lg bg-cover bg-center bg-no-repeat md:w-auto cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundImage: `url('${note.imageUrl}')` }}
            />
            
            {/* Lightbox */}
            {isLightboxOpen && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                onClick={() => setIsLightboxOpen(false)}
              >
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <img
                  src={note.imageUrl}
                  alt="Not görseli"
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
