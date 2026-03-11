export function playAudio(text: string, lang: string = "en-US") {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for language learners
    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Speech Synthesis not supported in this browser.");
  }
}
