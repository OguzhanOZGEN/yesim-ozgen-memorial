import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function VisitorCounter() {
  const [viewCount, setViewCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateViews = async () => {
      try {
        const statsRef = doc(db, 'settings', 'stats');
        const statsDoc = await getDoc(statsRef);

        if (!statsDoc.exists()) {
          // İlk ziyaret - başlat
          await setDoc(statsRef, { views: 1 });
          setViewCount(1);
        } else {
          // Var olan sayıyı artır
          await updateDoc(statsRef, {
            views: increment(1)
          });
          const updatedDoc = await getDoc(statsRef);
          setViewCount(updatedDoc.data()?.views || 0);
        }
      } catch (error) {
        console.error('View count error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Sadece bir kez çalış
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      updateViews();
      sessionStorage.setItem('hasVisited', 'true');
    } else {
      // Sayıyı sadece oku
      const loadViews = async () => {
        try {
          const statsRef = doc(db, 'settings', 'stats');
          const statsDoc = await getDoc(statsRef);
          if (statsDoc.exists()) {
            setViewCount(statsDoc.data()?.views || 0);
          }
        } catch (error) {
          console.error('Load views error:', error);
        } finally {
          setLoading(false);
        }
      };
      loadViews();
    }
  }, []);

  if (loading) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <span className="material-symbols-outlined !text-lg">visibility</span>
      <span>{viewCount.toLocaleString()} ziyaret</span>
    </div>
  );
}
