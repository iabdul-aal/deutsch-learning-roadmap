/**
 * Centralized Web Speech API Text-To-Speech (TTS) Audio Utility
 * Provides native German speech synthesis with zero external dependencies.
 */
export const playGermanTTS = (text, rate = 0.85) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  }
};
