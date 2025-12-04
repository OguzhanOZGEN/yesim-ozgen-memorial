import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getAchievements, updateAchievements } from '@/api/firestore';
import { AchievementsData } from '@/types';

export function AchievementsPage() {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [achievements, setAchievements] = useState<AchievementsData>({ content: '', lastUpdated: '' });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const data = await getAchievements();
        setAchievements(data);
        setEditContent(data.content);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAchievements();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updateAchievements(editContent);
      setAchievements(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Save error:', error);
      alert(t('common.error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditContent(achievements.content);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="layout-content-container flex w-full flex-col max-w-4xl flex-1">
        {/* Header */}
        <div className="flex flex-wrap justify-between gap-4 p-4">
          <div className="flex flex-col gap-3">
            <p className="text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white font-display">
              {isAdmin && isEditing ? t('achievements.edit') : t('achievements.title')}
            </p>
            {isAdmin && isEditing && (
              <p className="text-base font-normal leading-normal text-gray-500 dark:text-gray-400 max-w-lg">
                {t('achievements.editInstructions')}
              </p>
            )}
          </div>
          
          {isAdmin && (
            <div className="flex gap-3 pr-4">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary-dark transition-colors"
                >
                  <span className="material-symbols-outlined !text-lg">edit</span>
                  <span className="truncate">{t('common.edit')}</span>
                </button>
              )}
              {isAdmin && !isEditing && (
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary/20 px-4">
                  <p className="text-primary text-sm font-medium leading-normal">{t('common.admin')}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {isAdmin && isEditing ? (
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col w-full">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">
                  {t('achievements.contentLabel')}
                </p>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-y overflow-y-auto rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 bg-background-light dark:bg-background-dark dark:border-gray-700 min-h-96 max-h-[600px] placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
                  placeholder={t('achievements.placeholder')}
                />
              </label>
            </div>
            
            <div className="flex px-0 py-3 justify-start">
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    <span className="truncate">{t('common.save')}</span>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                >
                  <span className="truncate">{t('common.cancel')}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {achievements.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
