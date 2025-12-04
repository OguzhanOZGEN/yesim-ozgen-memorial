/**
 * Detects if text is primarily in Turkish or English
 * Returns 'tr' for Turkish, 'en' for English
 */
export function detectLanguage(text: string): 'tr' | 'en' {
  // Turkish-specific characters and common words
  const turkishChars = /[ğĞıİöÖüÜşŞçÇ]/;
  const turkishWords = /\b(bir|bu|ve|için|ile|olan|olarak|çok|daha|en|var|gibi|kadar|ne|mi|mı|mu|mü)\b/gi;
  
  // English-specific common words
  const englishWords = /\b(the|is|are|was|were|have|has|had|will|would|can|could|should|this|that|with|from|for|and|or|but)\b/gi;
  
  // Count matches
  const turkishCharCount = (text.match(turkishChars) || []).length;
  const turkishWordCount = (text.match(turkishWords) || []).length;
  const englishWordCount = (text.match(englishWords) || []).length;
  
  // Calculate scores
  const turkishScore = turkishCharCount * 3 + turkishWordCount;
  const englishScore = englishWordCount;
  
  // Return based on score (default to Turkish if unsure)
  return turkishScore > englishScore ? 'tr' : 'en';
}
