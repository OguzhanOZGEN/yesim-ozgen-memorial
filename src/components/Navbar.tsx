import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LoginModal } from './LoginModal';

export function Navbar() {
  const { isAdmin, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/resume', label: t('nav.resume') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/notes', label: t('nav.notes') },
    { path: '/achievements', label: t('nav.achievements') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200/50 dark:border-white/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between whitespace-nowrap px-4 sm:px-6 lg:px-8 h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-4">
            <div className="text-primary size-6">
              <span className="material-symbols-outlined !text-2xl">auto_stories</span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white font-display hidden sm:block">
              Yeşim Özgen Anısına
            </h2>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary font-bold'
                    : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side - Language + Auth buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setLanguage('tr')}
                className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                  language === 'tr'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary'
                }`}
              >
                TR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary'
                }`}
              >
                EN
              </button>
            </div>

            {isAdmin && (
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                <span className="material-symbols-outlined !text-sm">admin_panel_settings</span>
                <span>{t('common.admin')}</span>
              </div>
            )}

            {isAdmin ? (
              <button
                onClick={logout}
                className="hidden sm:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-600 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="truncate">{t('nav.logout')}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden sm:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/20 hover:bg-primary/30 transition-colors text-primary text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">{t('nav.login')}</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 text-gray-600 dark:text-gray-300"
            >
              <span className="material-symbols-outlined">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200/50 dark:border-white/10 bg-background-light dark:bg-background-dark">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary bg-primary/10 font-bold'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
