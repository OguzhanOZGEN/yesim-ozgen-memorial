import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import emailjs from '@emailjs/browser';

export function ContactPage() {
  const { t } = useLanguage();
  
  // Contact form state
  const [publicName, setPublicName] = useState('');
  const [publicEmail, setPublicEmail] = useState('');
  const [publicPhone, setPublicPhone] = useState('');
  const [publicMessage, setPublicMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicName.trim() || !publicEmail.trim() || !publicMessage.trim()) return;
    
    setIsSendingMessage(true);
    try {
      // EmailJS - Get your keys from https://www.emailjs.com/
      await emailjs.send(
        'service_2vhgwme', // Your EmailJS service ID
        'template_cyr5rjg', // Your EmailJS template ID
        {
          from_name: publicName.trim(),
          from_email: publicEmail.trim(),
          phone: publicPhone.trim() || 'Belirtilmedi',
          message: publicMessage.trim(),
          to_email: 'oguzhanozgen@hotmail.com',
        },
        'FqTSST5Xz-MN8Qjb7' // Your EmailJS public key
      );
      
      setMessageSent(true);
      setPublicName('');
      setPublicEmail('');
      setPublicPhone('');
      setPublicMessage('');
      setTimeout(() => setMessageSent(false), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert(t('contact.error'));
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="layout-content-container flex w-full flex-col max-w-2xl flex-1">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white font-display mb-3">
            {t('contact.formTitle')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('contact.formDescription')}
          </p>
        </div>

        {/* Contact Form */}
        <div className="p-4">
          <div className="max-w-2xl mx-auto">

            {messageSent ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center shadow-lg">
                <span className="material-symbols-outlined text-5xl text-green-600 dark:text-green-400 mb-4 block">check_circle</span>
                <p className="text-green-800 dark:text-green-300 font-medium text-lg">
                  {t('contact.messageSent')}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg"
              >
                <label className="flex flex-col">
                  <p className="pb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {t('contact.yourName')} <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="text"
                    required
                    value={publicName}
                    onChange={(e) => setPublicName(e.target.value)}
                    className="form-input h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder={t('contact.yourNamePlaceholder')}
                  />
                </label>

                <label className="flex flex-col">
                  <p className="pb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {t('contact.yourEmail')} <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="email"
                    required
                    value={publicEmail}
                    onChange={(e) => setPublicEmail(e.target.value)}
                    className="form-input h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder={t('contact.yourEmailPlaceholder')}
                  />
                </label>

                <label className="flex flex-col">
                  <p className="pb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {t('contact.yourPhone')}
                  </p>
                  <input
                    type="tel"
                    value={publicPhone}
                    onChange={(e) => setPublicPhone(e.target.value)}
                    className="form-input h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder={t('contact.yourPhonePlaceholder')}
                  />
                </label>

                <label className="flex flex-col">
                  <p className="pb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {t('contact.yourMessage')} <span className="text-red-500">*</span>
                  </p>
                  <textarea
                    required
                    value={publicMessage}
                    onChange={(e) => setPublicMessage(e.target.value)}
                    rows={6}
                    className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
                    placeholder={t('contact.yourMessagePlaceholder')}
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSendingMessage || !publicName.trim() || !publicEmail.trim() || !publicMessage.trim()}
                  className="w-full h-14 rounded-lg bg-primary text-white text-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {isSendingMessage ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      <span>{t('common.loading')}</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">send</span>
                      <span>{t('contact.sendMessage')}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
