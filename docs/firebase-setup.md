# 🚀 Firebase ve Cloudinary Kurulum Rehberi

## ✅ YAPILACAKLAR LİSTESİ

### 1️⃣ Firebase Console Ayarları

#### A) Projeye Web App Ekle
1. Firebase Console'a git: https://console.firebase.google.com
2. "Yesim-Ozgen-Web" projesini aç
3. Sol üstteki "Project Overview" yanındaki ⚙️ > "Project settings"
4. Scroll down > "Your apps" > Web ikon (</>) tıkla
5. App nickname: "yesim-ozgen-memorial"
6. Firebase Hosting'i işaretle
7. "Register app"
8. Config bilgilerini kopyala ve `.env` dosyasına yapıştır

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_MESSAGING_SENDER_ID=123...
VITE_FIREBASE_APP_ID=1:123...
```

#### B) Firestore Database
1. Sol menü > "Firestore Database" > "Create database"
2. Start mode: **Production mode** seç
3. Location: **europe-west1 (Belgium)** seç
4. Oluştur
5. "Rules" tab > Aşağıdaki kuralları yapıştır:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      allow read: if true;
      allow create: if request.auth == null;
      allow update, delete: if request.auth != null;
    }
    match /gallery/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /{collection}/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

6. "Publish" tıkla

#### C) Authentication
1. Sol menü > "Authentication" > "Get started"
2. "Email/Password" provider'ı aktif et
3. "Save"
4. "Users" tab > "Add user"
   - Email: `admin@yesimozgen.com.tr`
   - Password: Güçlü bir şifre belirle (en az 6 karakter)
5. "Add user"

#### D) Storage
1. Sol menü > "Storage" > "Get started"
2. **Production mode** seç
3. Location: **europe-west1** seç
4. "Rules" tab > Aşağıdaki kuralları yapıştır:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

5. "Publish"

---

### 2️⃣ Cloudinary Ayarları

1. https://cloudinary.com/users/register_free adresine git
2. Ücretsiz hesap oluştur (Gmail ile sign up yapabilirsin)
3. Dashboard açılınca:
   - **Cloud Name** kopyala (örn: `dzx123abc`)
   - `.env` dosyasına yapıştır: `VITE_CLOUDINARY_CLOUD_NAME=dzx123abc`

4. Sol menü > **Settings** > **Upload** sekmesi
5. "Add upload preset" tıkla
6. Aşağıdaki ayarları yap:
   - **Upload preset name**: `memorial_uploads`
   - **Signing mode**: **Unsigned** seç (önemli!)
   - **Folder**: `yesim-memorial`
   - **Allowed formats**: `jpg, png, jpeg, webp, gif`
   - **Max file size**: `10485760` (10MB)
   - **Transformation**: Eager transformations ekle:
     - `c_limit,w_2000,h_2000,q_auto,f_auto`
7. "Save" tıkla

---

### 3️⃣ Gmail App Password Oluşturma (E-posta bildirimi için)

1. Google hesabına giriş yap
2. https://myaccount.google.com/apppasswords adresine git
3. "App name" kutusuna: `Yesim Memorial`
4. "Create" tıkla
5. 16 haneli kodu kopyala (örn: `abcd efgh ijkl mnop`)
6. `functions/index.js` dosyasını aç
7. Şu satırları güncelle:

```javascript
user: 'your-email@gmail.com',  // Gmail adresiniz
pass: 'abcd efgh ijkl mnop',   // Az önce oluşturduğun 16 haneli kod
```

---

### 4️⃣ Firebase CLI Kurulum

Terminal'de sırayla çalıştır:

```powershell
# Firebase CLI kur (global)
npm install -g firebase-tools

# Firebase'e giriş yap
firebase login

# Projeyi initialize et
firebase init

# Şunları seç (Space ile işaretle, Enter ile onayla):
# ✅ Firestore
# ✅ Functions
# ✅ Hosting
# ✅ Storage

# Existing project seç: yesim-ozgen-web
# Firestore rules: firestore.rules (enter)
# Functions language: JavaScript
# ESLint: No
# Install dependencies: Yes
# Hosting public directory: dist
# Single-page app: Yes
# GitHub Actions: No
```

---

### 5️⃣ Functions Dependencies Kur

```powershell
cd functions
npm install
cd ..
```

---

### 6️⃣ Build ve Deploy

```powershell
# Projeyi build et
npm run build

# Firebase'e deploy et (ilk defa)
firebase deploy

# Sadece hosting deploy
firebase deploy --only hosting

# Sadece functions deploy
firebase deploy --only functions
```

---

### 7️⃣ Domain Bağlama (yesimozgen.com.tr)

1. Firebase Console > "Hosting" > "Add custom domain"
2. Domain adı gir: `yesimozgen.com.tr`
3. Firebase size 2 A record gösterecek:
   ```
   A    @    151.101.1.195
   A    @    151.101.65.195
   ```
4. Domain sağlayıcına git (GoDaddy, Turhost, vs.)
5. DNS ayarlarından mevcut A recordları sil
6. Firebase'in verdiği 2 A record'u ekle
7. SSL otomatik aktif olacak (24 saat içinde)

---

### 8️⃣ Test Etme

```powershell
# Local'de test et
npm run dev

# Production build test et
npm run build
npm run preview
```

Site açıldığında:
1. Not bırak (oguzhanozgen@hotmail.com'a mail gelecek)
2. Admin girişi yap (admin@yesimozgen.com.tr)
3. Galeri'ye foto ekle (Cloudinary'ye yüklenecek)
4. Her şey çalışıyorsa deploy et!

---

## 📝 Önemli Notlar

- ✅ `.env` dosyası `.gitignore`'da (güvenli)
- ✅ Firebase Functions ücretsiz: 125K çağrı/ay
- ✅ Cloudinary ücretsiz: 25GB storage, 25GB bandwidth/ay
- ✅ Firebase Hosting ücretsiz: 10GB storage, 360MB/gün bandwidth
- ✅ Her not için 1 e-posta gidecek (spam olmuyor)

---

## 🆘 Sorun Giderme

### "Permission denied" hatası
- Firestore/Storage rules'ları kontrol et
- Admin login yaptın mı kontrol et

### E-posta gelmiyor
- Gmail App Password doğru mu?
- functions/index.js'de email adresleri doğru mu?
- Firebase Console > Functions > Logs kontrolü

### Fotoğraf yüklenmiyor
- Cloudinary Upload Preset "Unsigned" mı?
- Cloud Name doğru mu?
- Dosya boyutu 10MB'dan küçük mü?

---

## 🎉 Deploy Sonrası

Site yayında olunca:
1. https://yesimozgen.com.tr çalışacak
2. SSL sertifikası otomatik
3. CDN'den hızlı yükleme
4. Her not için e-posta bildirimi

**Destek:** Sorun olursa Firebase Console > Logs kontrol et.
