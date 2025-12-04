import { useState, useEffect } from 'react';
import { NoteCard } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { getApprovedNotes, getPendingNotes, approveNote, rejectNote, deleteNote, updateNotes } from '@/api/firestore';
import { Note } from '@/types';

export function NotesPage() {
  const { isAdmin } = useAuth();
  const [approvedNotes, setApprovedNotes] = useState<Note[]>([]);
  const [pendingNotes, setPendingNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const [approved, pending] = await Promise.all([
        getApprovedNotes(),
        getPendingNotes(),
      ]);
      setApprovedNotes(approved);
      setPendingNotes(pending);
    } catch (error) {
      console.error('Notlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    await approveNote(id);
    await loadNotes();
  };

  const handleReject = async (id: string) => {
    await rejectNote(id);
    await loadNotes();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu notu kalıcı olarak silmek istediğinizden emin misiniz?')) {
      await deleteNote(id);
      await loadNotes();
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newNotes = [...approvedNotes];
    const draggedItem = newNotes[draggedIndex];
    newNotes.splice(draggedIndex, 1);
    newNotes.splice(index, 0, draggedItem);

    setApprovedNotes(newNotes);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex !== null) {
      await updateNotes(approvedNotes);
      setDraggedIndex(null);
    }
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
    <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
      <main className="py-12">
        {/* Page Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 px-4">
          <div className="flex max-w-xl flex-col gap-2">
            <h1 className="font-display text-4xl font-bold tracking-tighter text-gray-900 dark:text-white sm:text-5xl">
              Yeşim Öğretmen İçin Notlar
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Yeşim Öğretmenimizin ardından sevenlerinin bıraktığı değerli notlar ve anılar.
            </p>
          </div>
        </div>

        {/* Admin Panel - Pending Notes */}
        {isAdmin && (
          <div className="mb-12 rounded-xl border border-teal-500/30 bg-teal-500/10 p-6 dark:border-teal-700/50 dark:bg-teal-900/20">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined mt-1 text-2xl text-primary">
                admin_panel_settings
              </span>
              <div className="flex flex-col gap-3 flex-1">
                <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-white">
                  Yönetici Paneli: Onay Bekleyen Notlar
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bu bölüm yalnızca yönetici olarak giriş yaptığınızda görünür. 
                  Yeni bir not gönderildiğinde e-posta ile bildirim alırsınız.
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col gap-6">
              {pendingNotes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Şu anda onay bekleyen not bulunmuyor.
                </div>
              ) : (
                pendingNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    showStatus
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Approved Notes */}
        <div className="flex flex-col gap-8">
          <h2 className="border-b border-gray-200 pb-2 font-display text-3xl font-bold text-gray-800 dark:border-gray-700 dark:text-white">
            Yayınlanan Notlar
          </h2>
          
          {approvedNotes.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Henüz onaylanmış not bulunmuyor.
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {approvedNotes.map((note, index) => (
                <div 
                  key={note.id} 
                  className={`relative group ${isAdmin ? 'cursor-move' : ''} ${draggedIndex === index ? 'opacity-50' : ''}`}
                  draggable={isAdmin}
                  onDragStart={() => isAdmin && handleDragStart(index)}
                  onDragOver={(e) => isAdmin && handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <NoteCard note={note} />
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="flex size-8 items-center justify-center rounded-full bg-red-500/90 text-white backdrop-blur-sm hover:bg-red-600 shadow-lg"
                        title="Notu Sil"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
