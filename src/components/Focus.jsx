import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw, Timer } from 'lucide-react'
import { celebrate, useStore } from '../store.jsx'

const FocusCtx = createContext(null)
const beep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.value = 880
    o.connect(g); g.connect(ctx.destination)
    g.gain.setValueAtTime(0.15, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9)
    o.start(); o.stop(ctx.currentTime + 0.9)
  } catch { /* audio unavailable */ }
}
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export function FocusProvider({ children }) {
  const { act } = useStore()
  const [length, setLength] = useState(25 * 60)
  const [remaining, setRemaining] = useState(25 * 60)
  const [endAt, setEndAt] = useState(null)
  const [label, setLabel] = useState('')
  const baseTitle = useRef(document.title)

  const running = endAt !== null

  useEffect(() => {
    if (!running) return
    const tick = () => {
      const left = Math.max(0, Math.round((endAt - Date.now()) / 1000))
      setRemaining(left)
      if (left === 0) {
        setEndAt(null)
        act((s) => { s.focusSessions += 1 }, { xp: Math.round(length / 60 / 2), reason: 'Focus session done' })
        celebrate(true)
        beep()
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [running, endAt, act, length])

  useEffect(() => {
    document.title = running ? `${fmt(remaining)} · ${label || 'Focus'}` : baseTitle.current
  }, [running, remaining, label])

  const start = useCallback((mins, what = '') => {
    const secs = Math.round((mins ?? length / 60) * 60)
    setLength(secs)
    setRemaining(secs)
    setLabel(what)
    setEndAt(Date.now() + secs * 1000)
  }, [length])

  const pause = () => { setEndAt(null) }
  const resume = () => { setEndAt(Date.now() + remaining * 1000) }
  const reset = () => { setEndAt(null); setRemaining(length) }
  const choose = (mins) => { setEndAt(null); setLength(mins * 60); setRemaining(mins * 60) }

  return (
    <FocusCtx.Provider value={{ running, remaining, length, label, start, pause, resume, reset, choose }}>
      {children}
    </FocusCtx.Provider>
  )
}

export const useFocus = () => useContext(FocusCtx)

export function FocusWidget() {
  const f = useFocus()
  const fresh = !f.running && f.remaining === f.length
  return (
    <div className={`pill focus ${f.running ? 'running' : ''}`} title={f.label || 'Focus timer'}>
      <Timer size={16} aria-hidden="true" />
      <span className="focus-time" aria-live="off">{fmt(f.remaining)}</span>
      {fresh && (
        <select className="select" style={{ width: 'auto', padding: '4px 6px', fontSize: 13 }} value={f.length / 60}
          onChange={(e) => f.choose(Number(e.target.value))} aria-label="Focus length">
          {[25, 45, 50, 60, 90].map((m) => <option key={m} value={m}>{m} min</option>)}
        </select>
      )}
      {f.running
        ? <button className="btn icon ghost" onClick={f.pause} aria-label="Pause focus timer"><Pause size={16} /></button>
        : <button className="btn icon ghost" onClick={fresh ? () => f.start() : f.resume} aria-label="Start focus timer"><Play size={16} /></button>}
      {!fresh && <button className="btn icon ghost" onClick={f.reset} aria-label="Reset focus timer"><RotateCcw size={15} /></button>}
    </div>
  )
}
