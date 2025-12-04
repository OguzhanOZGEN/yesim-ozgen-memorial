export async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    // Using MyMemory Translation API (free, no API key needed)
    const sourceLang = targetLang === 'en' ? 'tr' : 'en';
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );
    
    if (!response.ok) {
      throw new Error('Translation failed');
    }
    
    const data = await response.json();
    return data.responseData.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}
