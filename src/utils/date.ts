/**
 * Format a date string to relative time (e.g., "2 days ago" / "2 gün önce")
 */
export function formatRelativeTime(dateString: string, language: 'tr' | 'en' = 'tr'): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  const translations = {
    tr: {
      justNow: 'az önce',
      minutesAgo: (n: number) => `${n} dakika önce`,
      hoursAgo: (n: number) => `${n} saat önce`,
      yesterday: 'dün',
      daysAgo: (n: number) => `${n} gün önce`,
      weekAgo: '1 hafta önce',
      weeksAgo: (n: number) => `${n} hafta önce`,
      monthAgo: '1 ay önce',
      monthsAgo: (n: number) => `${n} ay önce`
    },
    en: {
      justNow: 'just now',
      minutesAgo: (n: number) => `${n} minute${n > 1 ? 's' : ''} ago`,
      hoursAgo: (n: number) => `${n} hour${n > 1 ? 's' : ''} ago`,
      yesterday: 'yesterday',
      daysAgo: (n: number) => `${n} day${n > 1 ? 's' : ''} ago`,
      weekAgo: '1 week ago',
      weeksAgo: (n: number) => `${n} week${n > 1 ? 's' : ''} ago`,
      monthAgo: '1 month ago',
      monthsAgo: (n: number) => `${n} month${n > 1 ? 's' : ''} ago`
    }
  };

  const t = translations[language];

  if (diffInMinutes < 1) {
    return t.justNow;
  } else if (diffInMinutes < 60) {
    return t.minutesAgo(diffInMinutes);
  } else if (diffInHours < 24) {
    return t.hoursAgo(diffInHours);
  } else if (diffInDays === 1) {
    return t.yesterday;
  } else if (diffInDays < 7) {
    return t.daysAgo(diffInDays);
  } else if (diffInWeeks === 1) {
    return t.weekAgo;
  } else if (diffInWeeks < 4) {
    return t.weeksAgo(diffInWeeks);
  } else if (diffInMonths === 1) {
    return t.monthAgo;
  } else if (diffInMonths < 12) {
    return t.monthsAgo(diffInMonths);
  } else {
    return formatDate(dateString, language);
  }
}

/**
 * Format a date string to a readable date (e.g., "15 May 2024" / "15 Mayıs 2024")
 */
export function formatDate(dateString: string, language: 'tr' | 'en' = 'tr'): string {
  const date = new Date(dateString);
  
  const monthsTr = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  
  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const months = language === 'en' ? monthsEn : monthsTr;
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}
