import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { VisitorCounter } from './VisitorCounter';

export function Footer() {
  const { t } = useLanguage();
  
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
              {t('nav.home')}
            </Link>
            <Link
              to="/resume"
              className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
            >
              {t('nav.resume')}
            </Link>
            <Link
              to="/gallery"
              className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
            >
              {t('nav.gallery')}
            </Link>
            <Link
              to="/notes"
              className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
            >
              {t('nav.notes')}
            </Link>
            <Link
              to="/achievements"
              className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
            >
              {t('nav.achievements')}
            </Link>
            <Link
              to="/contact"
              className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
            >
              {t('nav.contact')}
            </Link>
          </div>

          {/* Memorial text */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            {t('footer.memorial')}
          </p>

          {/* Visitor Counter */}
          <div className="flex justify-center">
            <VisitorCounter />
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
