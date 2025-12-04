# E-posta Bildirimi Kurulum Rehberi

## ✅ Tamamlanan İşlemler

1. **Kodlama:** `functions/index.js` dosyasında e-posta bildirimi fonksiyonu oluşturuldu
2. **Bağımlılıklar:** `nodemailer` paketi `functions/package.json`'a eklendi ve yüklendi
3. **Yapılandırma:** Gmail SMTP ayarları tamamlandı
   - Gönderen: `oguzhanozgen1998@gmail.com`
   - Alıcı: `oguzhanozgen@hotmail.com`

## 🔧 Yapmanız Gereken İşlem: Gmail App Password Oluşturma

Firebase Functions'ın Gmail üzerinden e-posta gönderebilmesi için **Gmail App Password (Uygulama Şifresi)** oluşturmanız gerekiyor.

### Adım 1: Gmail App Password Oluşturma

1. Bu linke tıklayın: https://myaccount.google.com/apppasswords
2. `oguzhanozgen1998@gmail.com` hesabıyla giriş yapın
3. "App name" alanına: `Yesim Memorial Website` yazın
4. "Create" butonuna tıklayın
5. **16 haneli şifreyi kopyalayın** (örnek: `abcd efgh ijkl mnop`)

### Adım 2: Şifreyi functions/index.js Dosyasına Ekleme

1. `functions/index.js` dosyasını açın
2. **11. satırdaki** `pass: "YOUR_APP_PASSWORD_HERE"` kısmını bulun
3. `YOUR_APP_PASSWORD_HERE` yerine kopyaladığınız 16 haneli şifreyi yapıştırın:
   ```javascript
   pass: "abcd efgh ijkl mnop", // Kendi şifrenizi buraya yapıştırın
   ```
4. Dosyayı kaydedin

### Adım 3: Firebase Functions'ı Deploy Etme

Şifreyi ekledikten sonra terminalde şu komutu çalıştırın:

```powershell
firebase deploy --only functions
```

Bu komut:
- Cloud Functions'ı Firebase sunucularına yükler
- E-posta bildirimi sistemini aktif hale getirir
- İşlem 2-3 dakika sürebilir

## 📧 E-posta Bildirimi Nasıl Çalışır?

1. **Kullanıcı ana sayfadan not gönderir**
2. **Not Firestore database'e kaydedilir**
3. **Firebase Function otomatik tetiklenir** (`sendNoteNotification`)
4. **E-posta oguzhanozgen@hotmail.com adresine gönderilir**

### E-posta İçeriği:

- **Gönderen adı**
- **Not mesajı**
- **Tarih ve saat** (Türkçe format)
- **Görsel** (eğer eklenmiştiyse)
- **Yönetim paneline git** butonu

## 🔒 Güvenlik Notları

- **Gmail App Password** normal şifrenizden farklıdır
- Bu şifre sadece bu uygulama için kullanılır
- İstediğiniz zaman https://myaccount.google.com/apppasswords adresinden iptal edebilirsiniz
- `.env` dosyası `.gitignore`'da olduğu için şifre GitHub'a yüklenmez

## 🧪 Test Etme

Deploy işlemi tamamlandıktan sonra:

1. Yayınlanan sitenize gidin: https://yesim-ozgen-web.web.app
2. Ana sayfadan bir test notu gönderin
3. 1-2 dakika içinde `oguzhanozgen@hotmail.com` adresine e-posta gelmelidir

## ❓ Sorun Giderme

### E-posta gelmiyor?

1. **Spam klasörünü kontrol edin**
2. **Firebase Console > Functions** bölümünde logları kontrol edin:
   ```
   firebase functions:log
   ```
3. **App Password'ün doğru girildiğinden emin olun** (boşluklar olmadan)

### Deploy hatası alıyorsanız?

```powershell
# Firebase CLI'ı güncelleyin
npm install -g firebase-tools

# Tekrar giriş yapın
firebase login --reauth

# Deploy işlemini tekrarlayın
firebase deploy --only functions
```

## 📝 Önemli Notlar

- **ÜCRETLENDİRME:** Firebase Blaze (Pay as you go) planında olmanız gerekiyor
  - Aylık ilk 2 milyon function çağrısı ücretsiz
  - E-posta bildirimleri bu limitin çok altında kalır
- **GÜVENLİK:** `functions/index.js` dosyasını GitHub'a yüklemeden önce, App Password'ü environment variable'a taşımayı düşünebilirsiniz (opsiyonel)
- **TESTİNHALTA:** Functions henüz deploy edilmedi, Gmail App Password eklendikten sonra deploy edilmelidir

## 🎯 Sonraki Adımlar

✅ Cloudinary image upload'ları entegre edildi  
✅ Email notification kodu yazıldı  
⏳ **ŞU ANKİ GÖREV:** Gmail App Password ekleyip Functions'ı deploy etmek  
⏳ Domain bağlantısı (yesimozgen.com.tr DNS ayarları)  
⏳ Firestore migration (localStorage'dan Firestore'a geçiş)

---

**Yardıma ihtiyacınız olursa sormaktan çekinmeyin! 🚀**
