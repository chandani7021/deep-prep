import { useCallback, useEffect, useRef, useState } from 'react'

// Browser speech-to-text (Web Speech API). Works in Chrome, Edge and Safari; not in Firefox.
// Note: Chrome sends the audio to Google's speech service to transcribe it.
const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null
export const speechSupported = !!SR

export function useSpeech() {
  const [listening, setListening] = useState(false)
  const [finalText, setFinalText] = useState('')
  const [interim, setInterim] = useState('')
  const [error, setError] = useState('')
  const rec = useRef(null)
  const wanted = useRef(false)

  const start = useCallback(() => {
    if (!SR) { setError('Speech-to-text is not supported in this browser. Type your answer instead, or use Chrome, Edge or Safari.'); return }
    setError('')
    const r = new SR()
    r.continuous = true
    r.interimResults = true
    r.lang = navigator.language || 'en-US'
    r.onresult = (e) => {
      let fin = ''
      let tmp = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) fin += t
        else tmp += t
      }
      if (fin) setFinalText((p) => (p ? `${p} ${fin.trim()}` : fin.trim()))
      setInterim(tmp)
    }
    r.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { wanted.current = false; setError('Microphone access was blocked. Allow it in the browser’s site settings, or type your answer.') }
      else if (e.error === 'no-speech') { /* keep listening */ }
      else setError(`Speech recognition stopped (${e.error}).`)
    }
    // Browsers stop after a pause; restart while the user still wants to record.
    r.onend = () => { if (wanted.current) { try { r.start() } catch { /* already started */ } } else { setListening(false); setInterim('') } }
    rec.current = r
    wanted.current = true
    try { r.start(); setListening(true) } catch { /* already started */ }
  }, [])

  const stop = useCallback(() => { wanted.current = false; rec.current?.stop() }, [])
  const reset = useCallback(() => { setFinalText(''); setInterim('') }, [])
  useEffect(() => () => { wanted.current = false; rec.current?.abort() }, [])

  return { supported: speechSupported, listening, text: finalText, interim, error, start, stop, reset, setText: setFinalText }
}
