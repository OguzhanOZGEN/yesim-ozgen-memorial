import { useEffect, useCallback } from 'react';
import { GalleryImage } from '@/types';

interface GalleryLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({ 
  images, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNavigate 
}: GalleryLightboxProps) {
  const totalImages = images.length;
  const currentImage = images[currentIndex];

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex <= 0 ? totalImages - 1 : currentIndex - 1;
    onNavigate(newIndex);
  }, [currentIndex, totalImages, onNavigate]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex >= totalImages - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
  }, [currentIndex, totalImages, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, goToPrevious, goToNext]);

  if (!isOpen || !currentImage) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl p-4 md:p-8">
        <div className="relative overflow-hidden rounded-lg shadow-2xl bg-black">
          {/* Image */}
          <img 
            src={currentImage.imageUrl} 
            alt={currentImage.title}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          
          {/* Image info */}
          {currentImage.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white font-bold text-lg">{currentImage.title}</p>
              {currentImage.description && (
                <p className="text-white/70 text-sm mt-1">{currentImage.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 transform bg-black/30 text-white p-2 rounded-full hover:bg-primary transition-colors ml-2 md:ml-4"
          aria-label="Önceki"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 transform bg-black/30 text-white p-2 rounded-full hover:bg-primary transition-colors mr-2 md:mr-4"
          aria-label="Sonraki"
        >
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-4 text-white bg-black/30 p-2 rounded-full hover:bg-primary transition-colors"
          aria-label="Kapat"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {totalImages}
        </div>
      </div>
    </div>
  );
}
