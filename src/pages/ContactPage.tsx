import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  getContactPeople,
  addContactPerson,
  updateContactPerson,
  deleteContactPerson,
  updateContactPeople,
} from '@/api/firestore';
import { ContactPerson } from '@/types';

export function ContactPage() {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactPerson | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formRelation, setFormRelation] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await getContactPeople();
        setContacts(data);
      } catch (error) {
        console.error('Error loading contacts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadContacts();
  }, []);

  const openAddModal = () => {
    setEditingContact(null);
    setFormName('');
    setFormRelation('');
    setFormPhone('');
    setFormEmail('');
    setIsModalOpen(true);
  };

  const openEditModal = (contact: ContactPerson) => {
    setEditingContact(contact);
    setFormName(contact.name);
    setFormRelation(contact.relation);
    setFormPhone(contact.phone || '');
    setFormEmail(contact.email || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingContact) {
        await updateContactPerson(editingContact.id, {
          name: formName.trim(),
          relation: formRelation.trim(),
          phone: formPhone.trim() || undefined,
          email: formEmail.trim() || undefined,
        });
      } else {
        await addContactPerson({
          name: formName.trim(),
          relation: formRelation.trim(),
          phone: formPhone.trim() || undefined,
          email: formEmail.trim() || undefined,
        });
      }

      const updated = await getContactPeople();
      setContacts(updated);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Save error:', error);
      alert(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('contact.deleteConfirm'))) {
      try {
        await deleteContactPerson(id);
        const updated = await getContactPeople();
        setContacts(updated);
      } catch (error) {
        console.error('Delete error:', error);
        alert(t('common.error'));
      }
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newContacts = [...contacts];
    const draggedItem = newContacts[draggedIndex];
    newContacts.splice(draggedIndex, 1);
    newContacts.splice(index, 0, draggedItem);
    
    setContacts(newContacts);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex !== null && !loading) {
      try {
        await updateContactPeople(contacts);
      } catch (error) {
        console.error('Ordering error:', error);
      }
    }
    setDraggedIndex(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="layout-content-container flex w-full flex-col max-w-4xl flex-1">
        {/* Header */}
        <div className="flex flex-wrap justify-between gap-4 p-4 items-center">
          <div className="flex flex-col gap-3">
            <p className="text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white font-display">
              {t('contact.title')}
            </p>
            <p className="text-base font-normal leading-normal text-gray-500 dark:text-gray-400">
              {t('contact.description')}
            </p>
          </div>
          
          {isAdmin && (
            <button
              onClick={openAddModal}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary-dark transition-colors"
            >
              <span className="material-symbols-outlined !text-lg">add</span>
              <span className="truncate">{t('contact.addPerson')}</span>
            </button>
          )}
        </div>

        {/* Contact Cards */}
        <div className="p-4">
          <div className="grid gap-6 md:grid-cols-2">
            {contacts.map((contact, index) => (
              <div
                key={contact.id}
                draggable={isAdmin}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow relative ${
                  isAdmin ? 'cursor-move' : ''
                } ${draggedIndex === index ? 'opacity-50' : ''}`}
              >
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(contact)}
                      className="flex size-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined !text-lg">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="flex size-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined !text-lg">delete</span>
                    </button>
                  </div>
                )}
                
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-primary font-medium mt-1">
                      {contact.relation}
                    </p>
                  </div>
                  
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <span className="material-symbols-outlined !text-lg">phone</span>
                      <a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  
                  {contact.email && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <span className="material-symbols-outlined !text-lg">email</span>
                      <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors break-all">
                        {contact.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 bg-white dark:bg-background-dark rounded-xl p-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-display">
              {editingContact ? t('contact.editPerson') : t('contact.addPerson')}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="flex flex-col">
                <p className="pb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                  {t('contact.name')}
                </p>
                <input
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="form-input h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder={t('contact.namePlaceholder')}
                />
              </label>
              
              <label className="flex flex-col">
                <p className="pb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                  {t('contact.relation')}
                </p>
                <input
                  required
                  value={formRelation}
                  onChange={(e) => setFormRelation(e.target.value)}
                  className="form-input h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder={t('contact.relationPlaceholder')}
                />
              </label>
              
              <label className="flex flex-col">
                <p className="pb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                  {t('contact.phone')}
                </p>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="form-input h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder={t('contact.phonePlaceholder')}
                />
              </label>
              
              <label className="flex flex-col">
                <p className="pb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                  {t('contact.email')}
                </p>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="form-input h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder={t('contact.emailPlaceholder')}
                />
              </label>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      <span>{t('common.loading')}</span>
                    </>
                  ) : (
                    <span>{editingContact ? t('common.save') : t('common.add')}</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
