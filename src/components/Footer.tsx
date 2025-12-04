import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-gray-200/10 dark:border-white/10 py-10 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Navigation links */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
            >
              Ana Sayfa
            </Link>
            <Link
              to="/ozgecmis"
              className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
            >
              Özgeçmiş
            </Link>
            <Link
              to="/galeri"
              className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
            >
              Galeri
            </Link>
            <Link
              to="/notlar"
              className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
            >
              Notlar
            </Link>
            <Link
              to="/iletisim"
              className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
            >
              İletişim
            </Link>
          </div>

          {/* Memorial text */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Yeşim Özgen'in anısına. Onu sevgi ve saygıyla anıyoruz.
          </p>

          {/* Copyright */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Yeşim Özgen Anısına. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
