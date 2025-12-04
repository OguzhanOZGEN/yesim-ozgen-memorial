import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NoteCard, GalleryLightbox } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { getApprovedNotes, submitNote, getGalleryImages, getHeroContent, updateHeroContent, seedInitialData } from '@/api/firestore';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { NoteInput, Note, GalleryImage } from '@/types';

interface HeroContent {
  title: string;
  subtitle: string;
  imageUrl: string;
}

export function HomePage() {
  const { isAdmin } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Hero content state
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: 'Yeşim Özgen',
    subtitle: '',
    imageUrl: '',
  });
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string>('');
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [notesData, galleryData, heroData] = await Promise.all([
          getApprovedNotes(),
          getGalleryImages(),
          getHeroContent(),
        ]);
        setNotes(notesData.slice(0, 3));
        setGalleryImages(galleryData);
        setHeroContent(heroData);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSeedData = async () => {
    if (confirm('Başlangıç verilerini yüklemek istediğinizden emin misiniz? (Zaten varsa etkilenmez)')) {
      try {
        await seedInitialData();
        alert('Başlangıç verileri yüklendi! Sayfa yenileniyor...');
        window.location.reload();
      } catch (error) {
        console.error('Seed hatası:', error);
        alert('Hata oluştu! Konsolu kontrol edin.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingNote(true);
    
    try {
      let finalImageUrl: string | undefined = undefined;
      
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile);
      }
      
      const noteInput: NoteInput = {
        name: name.trim(),
        message: message.trim(),
        imageUrl: finalImageUrl,
      };

      await submitNote(noteInput);
      
      // Reset form
      setName('');
      setMessage('');
      setImageFile(null);
      setImagePreview('');
      setSubmitSuccess(true);
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Not gönderi hatası:', error);
      alert('Not gönderilirken hata oluştu!');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const openGallery = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const startEditingHero = () => {
    setEditTitle(heroContent.title);
    setEditSubtitle(heroContent.subtitle);
    setEditImageUrl(heroContent.imageUrl);
    setHeroImageFile(null);
    setHeroImagePreview('');
    setIsEditingHero(true);
  };

  const handleHeroImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeHeroImage = () => {
    setHeroImageFile(null);
    setHeroImagePreview('');
  };

  const saveHeroContent = async () => {
    setIsUploadingHero(true);
    try {
      let finalImageUrl = editImageUrl;
      
      if (heroImageFile) {
        finalImageUrl = await uploadToCloudinary(heroImageFile);
      }
      
      const updated = await updateHeroContent({
        title: editTitle,
        subtitle: editSubtitle,
        imageUrl: finalImageUrl,
      });
      setHeroContent(updated);
      setIsEditingHero(false);
      setHeroImageFile(null);
      setHeroImagePreview('');
    } catch (error) {
      console.error('Hero görsel yükleme hatası:', error);
      alert('Görsel yüklenirken hata oluştu!');
    } finally {
      setIsUploadingHero(false);
    }
  };

  const cancelEditingHero = () => {
    setIsEditingHero(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          <p className="text-white/70">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="container mx-auto px-4 pt-4">
          <button
            onClick={handleSeedData}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-base">database</span>
            <span>Başlangıç Verilerini Yükle</span>
          </button>
        </div>
      )}
      
      {/* Hero Section */}
      <div className="@container">
        <div className="flex flex-col gap-6 px-4 py-10 md:gap-8 md:flex-row md:items-center container mx-auto relative">
          {isAdmin && !isEditingHero && (
            <button
              onClick={startEditingHero}
              className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              <span className="text-sm font-medium">Düzenle</span>
            </button>
          )}
          
          {isEditingHero ? (
            <div className="w-full flex flex-col gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-white text-xl font-bold mb-4">Hero Bölümünü Düzenle</h3>
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col">
                    <span className="text-white/90 text-sm font-medium mb-2">Başlık</span>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="form-input h-12 w-full rounded-lg border border-white/20 bg-white/5 text-white p-3 focus:border-primary focus:ring-2 focus:ring-primary/50"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-white/90 text-sm font-medium mb-2">Alt Başlık</span>
                    <textarea
                      value={editSubtitle}
                      onChange={(e) => setEditSubtitle(e.target.value)}
                      className="form-input w-full rounded-lg border border-white/20 bg-white/5 text-white p-3 focus:border-primary focus:ring-2 focus:ring-primary/50 min-h-32"
                    />
                  </label>
                  <div className="flex flex-col">
                    <span className="text-white/90 text-sm font-medium mb-2">Görsel</span>
                    {!heroImagePreview && !heroImageFile ? (
                      <>
                        <div className="w-48 h-48 rounded-lg overflow-hidden mb-3 border border-white/20">
                          <img
                            src={editImageUrl}
                            alt="Mevcut görsel"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <label className="cursor-pointer">
                          <div className="flex items-center justify-center gap-2 h-12 rounded-lg border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-white/70">upload_file</span>
                            <span className="text-white/70 text-sm">Yeni görsel seç</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleHeroImageSelect}
                            className="hidden"
                          />
                        </label>
                      </>
                    ) : (
                      <div className="relative w-48 h-48">
                        <div className="w-full h-full rounded-lg overflow-hidden border border-white/20">
                          <img
                            src={heroImagePreview}
                            alt="Önizleme"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeHeroImage}
                          className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={saveHeroContent}
                      disabled={isUploadingHero}
                      className="flex-1 h-12 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isUploadingHero ? (
                        <>
                          <span className="material-symbols-outlined animate-spin">progress_activity</span>
                          <span>Yükleniyor...</span>
                        </>
                      ) : (
                        'Kaydet'
                      )}
                    </button>
                    <button
                      onClick={cancelEditingHero}
                      className="flex-1 h-12 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div
                className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-xl md:h-auto md:min-w-[400px] md:w-1/2"
                style={{
                  backgroundImage: `url("${heroContent.imageUrl}")`,
                }}
              />
              <div className="flex flex-col gap-6 md:min-w-[400px] md:gap-8 md:w-1/2 md:justify-center">
                <div className="flex flex-col gap-2 text-left">
                  <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl font-display">
                    {heroContent.title}
                  </h1>
                  <h2 className="text-white/70 text-sm font-normal leading-normal md:text-base">
                    {heroContent.subtitle}
                  </h2>
                </div>
                <Link
                  to="/resume"
                  className="flex min-w-[84px] w-full md:w-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 md:h-12 md:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] md:text-base hover:bg-primary-dark transition-colors"
                >
                  <span className="truncate">Hayatını Keşfedin</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Share Your Memories Section */}
      <div className="flex flex-col gap-8 px-4 container mx-auto">
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 border-b border-white/10 font-display">
          Anılarınızı ve Düşüncelerinizi Paylaşın
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Note Submission Form */}
          <div className="w-full lg:w-1/2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {submitSuccess && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
                  Notunuz alındı. Yönetici onayından sonra yayınlanacaktır.
                </div>
              )}
              
              <label className="flex flex-col w-full">
                <p className="text-white/90 text-base font-medium leading-normal pb-2">
                  Adınız
                </p>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-white/20 bg-white/5 focus:border-primary/80 h-14 placeholder:text-white/40 p-[15px] text-base font-normal leading-normal"
                  placeholder="Adınızı buraya yazın"
                />
              </label>
              
              <label className="flex flex-col w-full">
                <p className="text-white/90 text-base font-medium leading-normal pb-2">
                  Notunuz
                </p>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-white/20 bg-white/5 focus:border-primary/80 min-h-36 placeholder:text-white/40 p-[15px] text-base font-normal leading-normal"
                  placeholder="Yeşim Öğretmen ile ilgili anınızı veya notunuzu paylaşın"
                />
              </label>
              
              <div className="flex flex-col gap-4">
                <p className="text-white/90 text-base font-medium leading-normal">
                  Resim Ekleyin (İsteğe Bağlı)
                </p>
                
                {!imagePreview ? (
                  <label className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-8 transition-colors hover:border-primary/50 hover:bg-white/10">
                    <span className="material-symbols-outlined text-4xl text-white/50">
                      upload_file
                    </span>
                    <p className="mt-2 text-center text-sm text-white/70">
                      Resminizi buraya sürükleyin veya{' '}
                      <span className="font-semibold text-primary">yüklemek için tıklayın</span>
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between gap-4 rounded-lg bg-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 flex-shrink-0 rounded-md bg-cover bg-center"
                        style={{ backgroundImage: `url('${imagePreview}')` }}
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-white">
                          {imageFile?.name || 'uploaded-image.jpg'}
                        </p>
                        <p className="text-xs text-white/60">
                          {imageFile ? (imageFile.size / 1024 / 1024).toFixed(2) : '0'} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex-shrink-0 text-white/60 hover:text-white"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmittingNote}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-dark transition-colors self-start disabled:opacity-50 disabled:cursor-not-allowed gap-2"
              >
                {isSubmittingNote ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                    <span className="truncate">Gönderiliyor...</span>
                  </>
                ) : (
                  <span className="truncate">Not Bırak</span>
                )}
              </button>
            </form>
          </div>

          {/* Recent Approved Notes */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {notes.length === 0 ? (
              <p className="text-white/50 text-center py-8">Henüz onaylanmış not bulunmuyor.</p>
            ) : (
              notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))
            )}
            <Link
              to="/notes"
              className="text-primary hover:text-primary-dark text-sm font-medium text-center py-2"
            >
              Tüm notları görüntüle →
            </Link>
          </div>
        </div>
      </div>

      {/* Photo Gallery Section */}
      <div className="flex flex-col gap-8 px-4 container mx-auto pb-12">
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 border-b border-white/10 font-display">
          Fotoğraf Galerisi
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.slice(0, 7).map((image, index) => (
            <div
              key={image.id}
              onClick={() => openGallery(index)}
              className="aspect-square bg-cover bg-center rounded-lg overflow-hidden cursor-pointer group"
            >
              <div
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundImage: `url('${image.imageUrl}')` }}
              />
            </div>
          ))}
          
          <Link
            to="/gallery"
            className="aspect-square bg-cover bg-center rounded-lg overflow-hidden cursor-pointer group"
          >
            <div className="w-full h-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <span className="text-white/80 group-hover:text-white">Daha Fazla Gör</span>
            </div>
          </Link>
        </div>
      </div>

      <GalleryLightbox
        images={galleryImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
