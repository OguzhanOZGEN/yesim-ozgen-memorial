export const translations = {
  tr: {
    // Navigation
    nav: {
      home: 'Ana Sayfa',
      resume: 'Özgeçmiş',
      gallery: 'Galeri',
      notes: 'Notlar',
      achievements: 'Başarılar',
      contact: 'İletişim',
      login: 'Giriş Yap',
      logout: 'Çıkış Yap',
    },
    // Common
    common: {
      loading: 'Yükleniyor...',
      error: 'Hata oluştu',
      save: 'Kaydet',
      cancel: 'İptal',
      delete: 'Sil',
      edit: 'Düzenle',
      add: 'Ekle',
      close: 'Kapat',
      translate: 'Çevir',
      original: 'Orijinal',
      admin: 'Yönetici',
    },
    // Home Page
    home: {
      memorial: 'Anısına',
      readMore: 'Devamını Oku',
    },
    // Resume Page
    resume: {
      title: 'Özgeçmiş',
      education: 'Eğitim',
      experience: 'Deneyim',
      skills: 'Yetenekler',
    },
    // Gallery Page
    gallery: {
      title: 'Galeri',
      addPhoto: 'Fotoğraf Ekle',
      editPhoto: 'Fotoğrafı Düzenle',
      deleteConfirm: 'Bu fotoğrafı silmek istediğinizden emin misiniz?',
      photoTitle: 'Fotoğraf Başlığı',
      photoDescription: 'Açıklama',
      uploadNew: 'Yeni Fotoğraf Yükle',
    },
    // Notes Page
    notes: {
      title: 'Notlar',
      addNote: 'Not Ekle',
      editNote: 'Notu Düzenle',
      deleteConfirm: 'Bu notu silmek istediğinizden emin misiniz?',
      noteTitle: 'Not Başlığı',
      noteContent: 'İçerik',
      author: 'Yazar',
      anonymous: 'Anonim',
      pending: 'Onay Bekliyor',
      approved: 'Onaylandı',
      approve: 'Onayla',
      reject: 'Reddet',
    },
    // Achievements Page
    achievements: {
      title: 'Başarılar',
      addAchievement: 'Başarı Ekle',
      editAchievement: 'Başarıyı Düzenle',
      deleteConfirm: 'Bu başarıyı silmek istediğinizden emin misiniz?',
      achievementTitle: 'Başarı Başlığı',
      description: 'Açıklama',
      date: 'Tarih',
    },
    // Contact Page
    contact: {
      title: 'İletişim',
      name: 'İsim',
      email: 'E-posta',
      message: 'Mesaj',
      send: 'Gönder',
      success: 'Mesajınız başarıyla gönderildi!',
      error: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
    },
    // Login Modal
    login: {
      title: 'Yönetici Girişi',
      username: 'Kullanıcı Adı',
      password: 'Şifre',
      loginButton: 'Giriş Yap',
      error: 'Geçersiz kullanıcı adı veya şifre',
    },
    // Footer
    footer: {
      rights: 'Tüm hakları saklıdır',
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      resume: 'Resume',
      gallery: 'Gallery',
      notes: 'Notes',
      achievements: 'Achievements',
      contact: 'Contact',
      login: 'Login',
      logout: 'Logout',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      close: 'Close',
      translate: 'Translate',
      original: 'Original',
      admin: 'Admin',
    },
    // Home Page
    home: {
      memorial: 'In Memory',
      readMore: 'Read More',
    },
    // Resume Page
    resume: {
      title: 'Resume',
      education: 'Education',
      experience: 'Experience',
      skills: 'Skills',
    },
    // Gallery Page
    gallery: {
      title: 'Gallery',
      addPhoto: 'Add Photo',
      editPhoto: 'Edit Photo',
      deleteConfirm: 'Are you sure you want to delete this photo?',
      photoTitle: 'Photo Title',
      photoDescription: 'Description',
      uploadNew: 'Upload New Photo',
    },
    // Notes Page
    notes: {
      title: 'Notes',
      addNote: 'Add Note',
      editNote: 'Edit Note',
      deleteConfirm: 'Are you sure you want to delete this note?',
      noteTitle: 'Note Title',
      noteContent: 'Content',
      author: 'Author',
      anonymous: 'Anonymous',
      pending: 'Pending Approval',
      approved: 'Approved',
      approve: 'Approve',
      reject: 'Reject',
    },
    // Achievements Page
    achievements: {
      title: 'Achievements',
      addAchievement: 'Add Achievement',
      editAchievement: 'Edit Achievement',
      deleteConfirm: 'Are you sure you want to delete this achievement?',
      achievementTitle: 'Achievement Title',
      description: 'Description',
      date: 'Date',
    },
    // Contact Page
    contact: {
      title: 'Contact',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send',
      success: 'Your message has been sent successfully!',
      error: 'Failed to send message. Please try again.',
    },
    // Login Modal
    login: {
      title: 'Admin Login',
      username: 'Username',
      password: 'Password',
      loginButton: 'Login',
      error: 'Invalid username or password',
    },
    // Footer
    footer: {
      rights: 'All rights reserved',
    },
  },
};

export type Language = 'tr' | 'en';
export type TranslationKey = keyof typeof translations.tr;
