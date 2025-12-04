const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure Gmail transporter
// IMPORTANT: Replace 'YOUR_APP_PASSWORD_HERE' with actual Gmail App Password
// Get it from: https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "oguzhanozgen1998@gmail.com",
    pass: "sqls tldb hara ljww", // Gmail App Password
  },
});

// Send email notification when a new note is submitted
exports.sendNoteNotification = functions.firestore
    .document("notes/{noteId}")
    .onCreate(async (snap, context) => {
      const note = snap.data();

      // Email content
      const mailOptions = {
        from: "oguzhanozgen1998@gmail.com",
        to: "oguzhanozgen@hotmail.com",
        subject: "Yeni Not Gönderildi - Yeşim Özgen Anı Sitesi",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00b4d8; border-bottom: 2px solid #00b4d8; padding-bottom: 10px;">
              Yeni Not Gönderildi
            </h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Gönderen:</strong> ${note.name}</p>
              <p><strong>Tarih:</strong> ${new Date(note.createdAt.toDate()).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}</p>
              <p><strong>Mesaj:</strong></p>
              <p style="white-space: pre-wrap; padding: 10px; background: white; border-radius: 4px;">
                ${note.message}
              </p>
              ${note.imageUrl ? `
                <p><strong>Görsel:</strong></p>
                <img src="${note.imageUrl}" alt="Not görseli" style="max-width: 100%; border-radius: 4px;" />
              ` : ""}
            </div>
            <p style="color: #666; font-size: 14px;">
              Bu notu onaylamak veya reddetmek için yönetim paneline giriş yapın.
            </p>
            <a href="https://yesim-ozgen-web.web.app/notlar" 
               style="display: inline-block; background: #00b4d8; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; margin-top: 10px;">
              Yönetim Paneline Git
            </a>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully for note:", context.params.noteId);
        return {success: true};
      } catch (error) {
        console.error("Error sending email:", error);
        return {success: false, error: error.message};
      }
    });

// Send email notification when a new contact form is submitted
exports.sendContactNotification = functions.firestore
    .document("contacts/{contactId}")
    .onCreate(async (snap, context) => {
      const contact = snap.data();

      // Email content
      const mailOptions = {
        from: "oguzhanozgen1998@gmail.com",
        to: "oguzhanozgen@hotmail.com",
        subject: "Yeni İletişim Formu - Yeşim Özgen Anı Sitesi",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00b4d8; border-bottom: 2px solid #00b4d8; padding-bottom: 10px;">
              Yeni İletişim Formu Gönderildi
            </h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Ad Soyad:</strong> ${contact.name}</p>
              <p><strong>E-posta:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
              ${contact.phone ? `<p><strong>Telefon:</strong> ${contact.phone}</p>` : ""}
              <p><strong>Tarih:</strong> ${new Date(contact.createdAt.toDate()).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}</p>
              <p><strong>Mesaj:</strong></p>
              <p style="white-space: pre-wrap; padding: 10px; background: white; border-radius: 4px;">
                ${contact.message}
              </p>
            </div>
            <p style="color: #666; font-size: 14px;">
              Bu iletişim formuna cevap vermek için yukarıdaki e-posta adresini kullanabilirsiniz.
            </p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Contact email sent successfully:", context.params.contactId);
        return {success: true};
      } catch (error) {
        console.error("Error sending contact email:", error);
        return {success: false, error: error.message};
      }
    });
