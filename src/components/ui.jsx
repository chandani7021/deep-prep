import { Check as CheckIcon } from 'lucide-react'
import { LEVELS } from '../data/content.js'
import { addDays, dayKey, levelFor, prettyDate, useStore } from '../store.jsx'
import { planFor } from '../data/curriculum.js'

export function Check({ on, small, label }) {
  return (
    <span className={`check ${on ? 'on' : ''} ${small ? 'sm' : ''}`} role="img" aria-label={label || (on ? 'Done' : 'Not done')}>
      {on && <CheckIcon size={small ? 13 : 15} strokeWidth={3} />}
    </span>
  )
}

export function Ring({ value, size = 54, stroke = 6, label, color = 'var(--signal)' }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(1, value || 0))
  return (
    <span className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(143,182,230,0.14)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v)} style={{ transition: 'stroke-dashoffset .6s ease' }} />
      </svg>
      <span className="ring-label" style={{ fontSize: size * 0.26 }}>{label ?? `${Math.round(v * 100)}%`}</span>
    </span>
  )
}

export function Progress({ value, color }) {
  return <div className="progress"><span style={{ width: `${Math.round(Math.min(1, value || 0) * 100)}%`, background: color }} /></div>
}

export function DiffChip({ diff }) {
  return <span className={`chip ${String(diff).toLowerCase()}`}>{diff}</span>
}

export function Stars({ value = 0, onChange, label = 'Confidence' }) {
  return (
    <span className="stars" role="group" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" className={n <= value ? 'on' : ''} onClick={() => onChange(n === value ? 0 : n)} aria-label={`${label} ${n} of 5`}>★</button>
      ))}
    </span>
  )
}

/** Activity heatmap across the whole plan */
export function DiveLog() {
  const { state } = useStore()
  const start = state.profile.startDate
  const today = dayKey()
  const total = planFor(state.profile).days
  const cells = Array.from({ length: total }, (_, i) => {
    const k = addDays(start, i)
    const xp = state.activity[k] || 0
    const l = xp === 0 ? 0 : xp < 40 ? 1 : xp < 100 ? 2 : xp < 180 ? 3 : 4
    return { k, l, xp, frozen: state.frozen.includes(k), future: k > today, isToday: k === today }
  })
  return (
    <div>
      <div className="dive-log" role="img" aria-label={`Activity over your ${total}-day plan`}>
        {cells.map((c, i) => (
          <span key={c.k}
            className={`dive-cell ${c.frozen ? 'frozen' : ''} ${c.future ? 'future' : ''} ${c.isToday ? 'today' : ''}`}
            data-l={c.l}
            title={`Day ${i + 1} · ${prettyDate(c.k)} · ${c.frozen ? 'streak freeze' : `${c.xp} m`}`} />
        ))}
      </div>
      <div className="dive-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => <span key={l} className="dive-cell" data-l={l} />)}
        <span>More</span>
        <span className="spacer" />
        <span className="dive-cell frozen" /> <span>Freeze</span>
      </div>
    </div>
  )
}

/** Vertical depth gauge in the sidebar. XP = metres. */
export function DepthGauge() {
  const { state } = useStore()
  const lvl = levelFor(state.xp)
  // Evenly spaced levels; the diver sits between its level and the next one.
  const step = 88 / (LEVELS.length - 1)
  const pos = (i) => 5 + i * step // % from top
  const diverTop = pos(lvl.index + (lvl.next ? lvl.pct : 0))
  return (
    <div className="gauge" aria-label={`Depth ${state.xp} metres, ${lvl.name}`}>
      <div className="gauge-head">
        <span className="gauge-depth">{state.xp.toLocaleString()} m</span>
        <span className="small muted">{lvl.name}</span>
      </div>
      <div className="gauge-track">
        {LEVELS.map((l, i) => (
          <span key={l.name} className={`gauge-tick ${state.xp >= l.at ? 'reached' : ''}`} style={{ top: `${pos(i)}%` }}>{l.name}</span>
        ))}
        <span className="gauge-diver" style={{ top: `${diverTop}%` }} aria-hidden="true">🤿</span>
      </div>
      {lvl.next && <p className="small dim" style={{ marginTop: 8 }}>{(lvl.next.at - state.xp).toLocaleString()} m to {lvl.next.name}</p>}
    </div>
  )
}

export function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => <div key={t.id} className={`toast ${t.kind}`}>{t.text}</div>)}
    </div>
  )
}

