export function checkPronunciation(expectedText: string, onResult: (score: number, recognizedText: string) => void) {
  if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    let resultFired = false

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      resultFired = true
      const recognized = event.results[0][0].transcript

      // Fuzzy word-overlap scoring
      const clean = (s: string) => s.toLowerCase().replace(/[.,!?']/g, '').trim()
      const expectedWords = clean(expectedText).split(/\s+/)
      const recognizedWords = clean(recognized).split(/\s+/)

      const matched = expectedWords.filter(w => recognizedWords.includes(w)).length
      const score = Math.round((matched / expectedWords.length) * 100)

      onResult(score, recognized)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      resultFired = true
      console.error('Speech recognition error', event.error)
      onResult(0, '')
    }

    // CRITICAL: onend always fires when recognition stops (result, error, or silence).
    // Without this, if no speech is detected the UI freezes permanently in recording state.
    recognition.onend = () => {
      if (!resultFired) {
        onResult(0, '')
      }
    }

    recognition.start()
  } else {
    console.error("Speech Recognition API not supported in this browser.")
    alert("Reconhecimento de voz não suportado neste navegador.")
  }
}
