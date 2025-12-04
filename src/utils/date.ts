/**
 * Format a date string to relative time (e.g., "2 gün önce")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMinutes < 1) {
    return 'az önce';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} dakika önce`;
  } else if (diffInHours < 24) {
    return `${diffInHours} saat önce`;
  } else if (diffInDays === 1) {
    return 'dün';
  } else if (diffInDays < 7) {
    return `${diffInDays} gün önce`;
  } else if (diffInWeeks === 1) {
    return '1 hafta önce';
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} hafta önce`;
  } else if (diffInMonths === 1) {
    return '1 ay önce';
  } else if (diffInMonths < 12) {
    return `${diffInMonths} ay önce`;
  } else {
    return formatDate(dateString);
  }
}

/**
 * Format a date string to a readable date (e.g., "15 Mayıs 2024")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}
