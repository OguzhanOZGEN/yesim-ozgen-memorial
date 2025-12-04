import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getResume, updateResume } from '@/api/firestore';
import { ResumeData } from '@/types';

export function ResumePage() {
  const { isAdmin } = useAuth();
  const [resume, setResume] = useState<ResumeData>({ content: '', lastUpdated: '' });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const data = await getResume();
        setResume(data);
        setEditContent(data.content);
      } catch (error) {
        console.error('Özgeçmiş yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };
    loadResume();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updateResume(editContent);
      setResume(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Kaydetme sırasında hata oluştu!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditContent(resume.content);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          <p className="text-gray-500 dark:text-gray-400">Yükleniyor...</p>
        </div>
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
              {isAdmin && isEditing ? 'Özgeçmişi Düzenle' : 'Özgeçmiş'}
            </p>
            {isAdmin && isEditing && (
              <p className="text-base font-normal leading-normal text-gray-500 dark:text-gray-400">
                Lütfen aşağıdaki metin düzenleyiciyi kullanarak özgeçmişi güncelleyin ve 'Kaydet' butonuna tıklayın.
              </p>
            )}
          </div>
          
          {isAdmin && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary-dark transition-colors"
            >
              <span className="material-symbols-outlined !text-lg">edit</span>
              <span className="truncate">Düzenle</span>
            </button>
          )}
        </div>

        {/* Content */}
        {isAdmin && isEditing ? (
          <div className="p-4">
            {/* Simple toolbar (visual only for now) */}
            <div className="mb-[-1px] flex items-center gap-1 rounded-t-lg border border-gray-300 bg-gray-100 p-2 dark:border-gray-700 dark:bg-gray-800/50">
              <button type="button" className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Bold">
                <span className="material-symbols-outlined !text-xl">format_bold</span>
              </button>
              <button type="button" className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Italic">
                <span className="material-symbols-outlined !text-xl">format_italic</span>
              </button>
              <button type="button" className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Underline">
                <span className="material-symbols-outlined !text-xl">format_underlined</span>
              </button>
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-2"></div>
              <button type="button" className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Bullet List">
                <span className="material-symbols-outlined !text-xl">format_list_bulleted</span>
              </button>
              <button type="button" className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Numbered List">
                <span className="material-symbols-outlined !text-xl">format_list_numbered</span>
              </button>
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-2"></div>
              <button type="button" className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Link">
                <span className="material-symbols-outlined !text-xl">link</span>
              </button>
              <button type="button" className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="Quote">
                <span className="material-symbols-outlined !text-xl">format_quote</span>
              </button>
            </div>
            
            <label className="flex flex-col w-full">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-b-lg rounded-t-none text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary border border-gray-300 bg-background-light dark:bg-background-dark dark:border-gray-700 min-h-96 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base font-normal leading-relaxed"
                placeholder="Özgeçmiş metnini buraya yazın..."
              />
            </label>
            
            <div className="flex justify-start py-3">
              <div className="flex flex-1 gap-4 flex-wrap justify-start">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    <span className="truncate">Kaydet</span>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                >
                  <span className="truncate">İptal Et</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {resume.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
