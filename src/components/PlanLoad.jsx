import { TRACKS } from '../data/content.js'
import { planLoad } from '../data/curriculum.js'
import { useStore } from '../store.jsx'

const TEXT = {
  fits: ['Fits', 'var(--ok)', 'The content fits the time you have.'],
  tight: ['Tight', 'var(--warn)', 'Doable, but expect to fall behind on some weeks. Consider a little more time.'],
  overloaded: ['Overloaded', 'var(--hard)', 'There is more content than time. Extend the plan, add hours, or drop an area.'],
}

/** Shows whether the selected areas fit in the plan length at your weekly hours. */
export default function PlanLoad({ compact = false }) {
  const { state, act } = useStore()
  const load = planLoad(state.profile)
  const [label, color, advice] = TEXT[load.status]
  const pct = Math.min(100, Math.round(100 / Math.max(load.ratio, 0.01)))

  return (
    <div className="plan-load" style={{ borderColor: color }}>
      <div className="row" style={{ gap: 10 }}>
        <span className="chip" style={{ color, borderColor: color, border: '1px solid' }}>{label}</span>
        <span className="small">
          ~{load.contentHours} h of content · your time: {load.weekly} h/week × {load.days} days ≈ {load.availableHours} h.
          {' '}Needs about <strong>{load.neededDays} days</strong> at this pace.
        </span>
      </div>
      <div className="load-bar" aria-hidden="true"><span style={{ width: `${pct}%`, background: color }} /></div>
      <p className="small muted">{advice}</p>
      {load.status !== 'fits' && (
        <div className="row" style={{ gap: 8 }}>
          <button className="btn sm primary" onClick={() => act((s) => { s.profile.planDays = load.recommendedDays })}>Use {load.recommendedDays} days</button>
          <span className="small dim">(includes a final review week)</span>
        </div>
      )}
      {!compact && (
        <div className="load-areas">
          {load.perArea.map((a) => (
            <div key={a.track} className="small">
              <span style={{ color: TRACKS[a.track].color, fontWeight: 600 }}>{TRACKS[a.track].name}</span>
              <span className="dim"> · {a.hours} h · ~{a.weeklyHours} h/week</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
