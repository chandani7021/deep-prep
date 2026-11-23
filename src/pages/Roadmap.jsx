import { MONTHS, TRACKS, WEEKS } from '../data/content.js'
import { addDays, celebrate, planPosition, prettyDate, useStore } from '../store.jsx'
import { Check, Ring } from '../components/ui.jsx'

const KEYS = ['dsa', 'sd', 'ai', 'fund']

export default function Roadmap() {
  const { state, act } = useStore()
  const pos = planPosition(state.profile.startDate)
  const weekDone = (n) => KEYS.filter((k) => state.weeks[n]?.goals?.[k]).length
  const total = WEEKS.reduce((a, w) => a + weekDone(w.n), 0)

  const toggle = (n, k) => {
    const was = !!state.weeks[n]?.goals?.[k]
    const allAfter = !was && KEYS.every((x) => x === k || state.weeks[n]?.goals?.[x])
    act((s) => {
      const w = (s.weeks[n] ||= { goals: {}, reflection: '' })
      w.goals[k] = !was
    }, { xp: (was ? -25 : 25) + (allAfter ? 75 : 0), reason: was ? '' : allAfter ? `Week ${n} complete` : `Week ${n} goal` })
    if (!was) celebrate(allAfter)
  }

  return (
    <div className="page">
      <div className="row">
        <div style={{ flex: 1 }}>
          <h1>The 90-day roadmap</h1>
          <p className="muted">Check off each track when you’ve covered the week’s goal. Finishing all four in a week earns a bonus.</p>
        </div>
        <Ring value={total / (WEEKS.length * 4)} size={76} />
      </div>

      <div className="month-tabs">
        {MONTHS.map((m) => (
          <section key={m.n} className={`month ${pos.month === m.n ? 'current' : ''}`}>
            <div className="row"><h3 style={{ flex: 1 }}>Month {m.n}: {m.name}</h3><span className="small dim">Days {m.days}</span></div>
            <ul>{m.goals.map((g) => <li key={g}>{g}</li>)}</ul>
          </section>
        ))}
      </div>

      <section className="panel flush">
        {WEEKS.map((w) => {
          const start = addDays(state.profile.startDate, (w.n - 1) * 7)
          const isCur = w.n === pos.week
          return (
            <div key={w.n} className={`week ${isCur ? 'current' : ''} ${w.n < pos.week ? 'past' : ''}`} id={`week-${w.n}`}>
              <div>
                <div className="week-n">{w.n}</div>
                <div className="small dim">{prettyDate(start)}</div>
                <div className="small muted" style={{ marginTop: 4 }}>{weekDone(w.n)}/4</div>
              </div>
              <div>
                <div className="week-goals">
                  {KEYS.map((k) => {
                    const on = !!state.weeks[w.n]?.goals?.[k]
                    return (
                      <div key={k} className={`check-item ${on ? 'on' : ''}`} onClick={() => toggle(w.n, k)} role="checkbox" aria-checked={on} tabIndex={0}
                        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(w.n, k) } }}>
                        <Check on={on} small />
                        <div>
                          <div className="small" style={{ color: TRACKS[k].color, fontWeight: 600 }}>{TRACKS[k].name}</div>
                          <div className="ci-text">{w[k]}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {(isCur || w.n < pos.week || state.weeks[w.n]?.reflection) && (
                  <textarea className="textarea" style={{ marginTop: 10, minHeight: 56 }} key={`r-${w.n}`}
                    placeholder="Weekly review: what went well, what’s weak, what changes next week?"
                    defaultValue={state.weeks[w.n]?.reflection || ''} aria-label={`Week ${w.n} review`}
                    onBlur={(e) => act((s) => { (s.weeks[w.n] ||= { goals: {}, reflection: '' }).reflection = e.target.value })} />
                )}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
