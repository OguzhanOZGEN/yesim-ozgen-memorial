import { useState } from 'react';

export function ShareButton() {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;
  const shareTitle = 'Yeşim Özgen Anısına';
  const shareText = 'Yeşim Özgen anı sayfasını ziyaret edin';

  const handleShare = async (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(shareTitle);

    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Copy failed:', err);
        }
        setShowMenu(false);
        return;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
      setShowMenu(false);
    }
  };

  // Web Share API desteği varsa kullan
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setShowMenu(false);
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-md"
      >
        <span className="material-symbols-outlined !text-lg">share</span>
        <span className="font-medium">Paylaş</span>
      </button>

      {showMenu && !navigator.share && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[200px] py-2">
            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
            >
              <span className="material-symbols-outlined !text-lg text-blue-600">group</span>
              <span>Facebook</span>
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
            >
              <span className="material-symbols-outlined !text-lg text-sky-500">tag</span>
              <span>Twitter</span>
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
            >
              <span className="material-symbols-outlined !text-lg text-green-600">chat</span>
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
            >
              <span className="material-symbols-outlined !text-lg text-blue-700">work</span>
              <span>LinkedIn</span>
            </button>
            <button
              onClick={() => handleShare('email')}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
            >
              <span className="material-symbols-outlined !text-lg text-red-600">mail</span>
              <span>E-posta</span>
            </button>
            <div className="border-t border-gray-200 dark:border-gray-600 my-2" />
            <button
              onClick={() => handleShare('copy')}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
            >
              <span className="material-symbols-outlined !text-lg">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Kopyalandı!' : 'Linki Kopyala'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
