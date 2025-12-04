import { useState, useRef, useEffect } from 'react';

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Kullanıcı etkileşiminden sonra müzik kontrolünü göster
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasInteracted]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error('Audio play error:', err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!hasInteracted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleMusic}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-all hover:scale-110"
        title={isPlaying ? 'Müziği Duraklat' : 'Müzik Çal'}
      >
        <span className="material-symbols-outlined">
          {isPlaying ? 'pause' : 'music_note'}
        </span>
      </button>
      <audio
        ref={audioRef}
        loop
        src="/music/background.mp3" // public/music/background.mp3 dosyası eklenecek
      />
    </div>
  );
}
