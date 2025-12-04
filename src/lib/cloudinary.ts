// Cloudinary Configuration

export const CLOUDINARY_CONFIG = {
  cloudName: 'dmbatziwg',
  uploadPreset: 'memorial_uploads',
};

// Cloudinary Upload Settings sekmesinden:
// 1. Upload Presets > Add upload preset
// 2. Upload preset name: memorial_uploads
// 3. Signing Mode: Unsigned
// 4. Folder: yesim-memorial
// 5. Allowed formats: jpg, png, jpeg, webp
// 6. Max file size: 10MB
// 7. Transformation: c_limit,w_2000,h_2000,q_auto
// 8. Save

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', 'yesim-memorial');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Cloudinary hatası:', data);
      throw new Error(data.error?.message || 'Fotoğraf yükleme başarısız');
    }

    return data.secure_url;
  } catch (error) {
    console.error('Upload hatası:', error);
    throw error;
  }
};
