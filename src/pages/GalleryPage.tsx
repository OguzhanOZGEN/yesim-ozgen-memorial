import { useState, useEffect } from 'react';
import { GalleryLightbox } from '@/components';
import { useAuth } from '@/context/AuthContext';
import {
  getGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  updateGalleryImages,
} from '@/api/firestore';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { GalleryImage, GalleryImageInput } from '@/types';

export function GalleryPage() {
  const { isAdmin } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getGalleryImages();
        setImages(data);
      } catch (error) {
        console.error('Galeri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const openGallery = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const openAddModal = () => {
    setEditingImage(null);
    setFormTitle('');
    setFormDescription('');
    setFormImageUrl('');
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

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

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const openEditModal = (image: GalleryImage) => {
    setEditingImage(image);
    setFormTitle(image.title);
    setFormDescription(image.description || '');
    setFormImageUrl(image.imageUrl);
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      let finalImageUrl = formImageUrl;
      
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile);
      }
      
      if (!finalImageUrl) {
        alert('Lütfen bir görsel seçin!');
        setIsUploading(false);
        return;
      }
      
      const input: GalleryImageInput = {
        title: formTitle.trim(),
        description: formDescription.trim() || undefined,
        imageUrl: finalImageUrl,
      };

      if (editingImage) {
        await updateGalleryImage(editingImage.id, input);
      } else {
        await addGalleryImage(input);
      }

      const updatedImages = await getGalleryImages();
      setImages(updatedImages);
      setIsModalOpen(false);
      setImageFile(null);
      setImagePreview('');
    } catch (error) {
      console.error('Galeri görseli yükleme hatası:', error);
      alert('Görsel yüklenirken hata oluştu!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) {
      await deleteGalleryImage(id);
      const updatedImages = await getGalleryImages();
      setImages(updatedImages);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex !== null) {
      await updateGalleryImages(images);
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
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <main className="flex flex-col gap-8">
          {/* Page Header */}
          <div className="flex flex-wrap items-end justify-between gap-4 px-4 sm:px-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white font-display">
                {isAdmin ? 'Galeri Yönetimi' : 'Fotoğraf Galerisi'}
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400">
                {isAdmin
                  ? 'Buradan yeni anı fotoğrafları ekleyebilir ve mevcut fotoğrafları düzenleyebilirsiniz.'
                  : 'Yeşim Öğretmenin hayatından anılar'}
              </p>
            </div>
            
            {isAdmin && (
              <button
                onClick={openAddModal}
                className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm transition-colors hover:bg-primary-dark"
              >
                <span className="material-symbols-outlined text-base">add_photo_alternate</span>
                <span className="truncate">Yeni Fotoğraf Ekle</span>
              </button>
            )}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 px-4 sm:px-6">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable={isAdmin}
                onDragStart={() => isAdmin && handleDragStart(index)}
                onDragOver={(e) => isAdmin && handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`group relative overflow-hidden rounded-xl border-2 border-transparent transition-all duration-300 hover:border-primary-400 ${
                  isAdmin ? 'cursor-move' : 'cursor-pointer'
                } ${draggedIndex === index ? 'opacity-50' : ''}`}
              >
                <div 
                  className="aspect-square w-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    openGallery(index);
                  }}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                  <p className="text-base font-bold text-white line-clamp-2">{image.title}</p>
                </div>
                
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(image);
                      }}
                      className="flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-primary-600"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.id);
                      }}
                      className="flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-red-500"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 bg-white dark:bg-background-dark rounded-xl p-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-display">
              {editingImage ? 'Fotoğrafı Düzenle' : 'Yeni Fotoğraf Ekle'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="flex flex-col">
                <p className="pb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                  Başlık
                </p>
                <input
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="form-input h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Fotoğraf başlığı"
                />
              </label>
              
              <label className="flex flex-col">
                <p className="pb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                  Açıklama (İsteğe bağlı)
                </p>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-24"
                  placeholder="Fotoğraf açıklaması"
                />
              </label>
              
              <div className="flex flex-col">
                <p className="pb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                  Fotoğraf {editingImage && !imageFile && '(Değiştirmek için yeni seçin)'}
                </p>
                {!imagePreview && !imageFile ? (
                  <>
                    {editingImage && (
                      <div className="aspect-square w-full rounded-lg overflow-hidden mb-3">
                        <img src={formImageUrl} alt="Mevcut" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                        <span className="material-symbols-outlined text-gray-400">add_photo_alternate</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          {editingImage ? 'Yeni fotoğraf seç' : 'Fotoğraf seç'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </>
                ) : (
                  <div className="relative">
                    <div className="aspect-square w-full rounded-lg overflow-hidden">
                      <img src={imagePreview} alt="Önizleme" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 h-12 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      <span>Yükleniyor...</span>
                    </>
                  ) : (
                    editingImage ? 'Güncelle' : 'Ekle'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <GalleryLightbox
        images={images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
