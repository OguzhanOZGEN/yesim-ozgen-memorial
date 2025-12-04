import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(username, password);
    if (success) {
      setUsername('');
      setPassword('');
      setError('');
      onClose();
    } else {
      setError(t('login.error'));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setError('');
    setUsername('');
    setPassword('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Background blur image */}
      <div className="absolute inset-0 z-0">
        <img 
          className="h-full w-full object-cover opacity-30 blur-sm" 
          alt="Abstract background"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk4qaLEHbJnXnCzB94DB6hUOxetOGs48qVuDbNHNoPMbe5vmlcTFZTD2r3abjSVPw9a07FUvTa2jYn2GtKkqGroFaGy0RUTRSdkLVVRR02ctb0vXOpeirwjrfapMnT10gNBlGdaZtHYFYO9kg9U5DJ7AduaI-WDozlTpgTyXJKAG8kS2oNPr6MgI0XQ9TpAJ4pIJZBNz-5OaNtJSsQL68egh4nh8q5Rgog9R0JTvcyvHnOwH4EL_0gaSJG_d1oSHc3dhmTu1wrSuU"
        />
      </div>
      
      <div className="relative flex w-full max-w-md flex-col items-center justify-center rounded-xl border border-white/10 bg-background-light/80 p-6 shadow-2xl backdrop-blur-lg dark:bg-background-dark/80 sm:p-8 mx-4">
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
          {t('login.title')}
        </h2>
        <p className="mt-2 text-center text-base text-zinc-600 dark:text-zinc-400">
          {t('login.description')}
        </p>
        
        <form onSubmit={handleSubmit} className="mt-8 w-full">
          <div className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            
            <label className="flex flex-col">
              <p className="pb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {t('login.username')}
              </p>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-lg border border-zinc-300 bg-white p-3 text-base font-normal leading-normal text-zinc-900 placeholder:text-zinc-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
                placeholder={t('login.usernamePlaceholder')}
              />
            </label>
            
            <label className="flex flex-col">
              <p className="pb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {t('login.password')}
              </p>
              <div className="flex w-full flex-1 items-stretch">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-l-lg border border-r-0 border-zinc-300 bg-white p-3 text-base font-normal leading-normal text-zinc-900 placeholder:text-zinc-400 focus:z-10 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
                  placeholder={t('login.passwordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="flex items-center justify-center rounded-r-lg border border-l-0 border-zinc-300 bg-white px-4 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </label>
            
            <button
              type="submit"
              className="flex h-12 w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold leading-normal text-white shadow-sm transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="truncate">{t('login.loginButton')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
