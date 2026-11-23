import { useState } from 'react'
import { TRACKS } from '../data/content.js'
import { AREAS, MAX_DAYS, MIN_DAYS, PLAN_PRESETS, clampDays } from '../data/curriculum.js'
import { addDays, celebrate, planPosition, prettyDate, useStore } from '../store.jsx'
import { Check, Ring } from '../components/ui.jsx'
import { ModuleBody } from '../components/Modules.jsx'

export default function Roadmap() {
  const { state, act } = useStore()
  const pos = planPosition(state.profile)
  const { plan } = pos
  const KEYS = plan.tracks
  const weekDone = (n) => KEYS.filter((k) => state.weeks[n]?.goals?.[k]).length
  const total = plan.weeks.reduce((a, w) => a + weekDone(w.n), 0)

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
        <div style={{ flex: 1, minWidth: 240 }}>
          <h1>Your {plan.days}-day roadmap</h1>
          <p className="muted">{plan.totalWeeks} weeks · {prettyDate(state.profile.startDate)} → {prettyDate(addDays(state.profile.startDate, plan.days - 1), { month: 'short', day: 'numeric', year: 'numeric' })}. Open a week’s area for topics, practice and resources; tick it when the week’s goal is done. Finishing every area in a week earns a bonus.</p>
        </div>
        <Ring value={total / Math.max(1, plan.weeks.length * KEYS.length)} size={76} />
      </div>

      <PlanSetup />

      <div className="month-tabs">
        {plan.phases.map((ph) => (
          <section key={ph.n} className={`month ${pos.phase === ph.n ? 'current' : ''}`}>
            <div className="row"><h3 style={{ flex: 1 }}>{plan.phases.length > 1 ? `Phase ${ph.n}: ` : ''}{ph.name}</h3><span className="small dim">Days {ph.fromDay}–{ph.toDay}</span></div>
            <ul>
              {ph.goals.map((g) => (
                <li key={g.track}><span style={{ color: TRACKS[g.track].color, fontWeight: 600 }}>{TRACKS[g.track].name}:</span> {g.count === 1 ? g.from : `${g.from} → ${g.to}`}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="panel flush">
        {plan.weeks.map((w) => {
          const start = addDays(state.profile.startDate, (w.n - 1) * 7)
          const isCur = w.n === pos.week
          return (
            <div key={w.n} className={`week ${isCur ? 'current' : ''} ${w.n < pos.week ? 'past' : ''}`} id={`week-${w.n}`}>
              <div>
                <div className="week-n">{w.n}</div>
                <div className="small dim">{prettyDate(start)}</div>
                <div className="small muted" style={{ marginTop: 4 }}>{weekDone(w.n)}/{KEYS.length}</div>
                {w.review && <div className="small" style={{ color: 'var(--glow)', marginTop: 4 }}>Review</div>}
              </div>
              <div>
                <div className="week-goals">
                  {KEYS.map((k) => {
                    const on = !!state.weeks[w.n]?.goals?.[k]
                    const items = w.items[k] || []
                    return (
                      <details key={k} className={`week-track ${on ? 'on' : ''}`} open={isCur && !on}>
                        <summary>
                          <span role="checkbox" aria-checked={on} tabIndex={0} aria-label={`Mark week ${w.n} ${TRACKS[k].name} done`}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(w.n, k) }}
                            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); toggle(w.n, k) } }}>
                            <Check on={on} small />
                          </span>
                          <div style={{ flex: 1 }}>
                            <div className="small" style={{ color: TRACKS[k].color, fontWeight: 600 }}>{TRACKS[k].name}</div>
                            <div className="ci-text">
                              {items.map((x) => `${x.module.title}${x.parts > 1 ? ` (part ${x.part} of ${x.parts})` : ''}`).join(' + ')}
                            </div>
                          </div>
                          <span className="small dim">details</span>
                        </summary>
                        {items.map((x) => (
                          <div key={x.module.id}>
                            {items.length > 1 && <p className="small" style={{ fontWeight: 600, padding: '10px 0 0 32px' }}>{x.module.title}</p>}
                            {x.parts > 1 && <p className="small muted" style={{ padding: '8px 0 0 32px' }}>{x.part === 1 ? 'Start this module; it continues next week.' : x.part === x.parts ? 'Finish this module and do the practice.' : 'Keep going: more problems and depth.'}</p>}
                            <ModuleBody m={x.module} />
                          </div>
                        ))}
                      </details>
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

function PlanSetup() {
  const { state, act, toast } = useStore()
  const p = state.profile
  const [custom, setCustom] = useState(String(p.planDays))
  const setDays = (n) => {
    const d = clampDays(n)
    setCustom(String(d))
    if (d !== p.planDays) act((s) => { s.profile.planDays = d })
  }
  const toggleArea = (id) => {
    const on = p.tracks.includes(id)
    if (on && p.tracks.length === 1) { toast('Keep at least one area in your plan'); return }
    act((s) => { s.profile.tracks = on ? s.profile.tracks.filter((t) => t !== id) : [...s.profile.tracks, id] })
  }

  return (
    <details className="panel" open={!p.planSet}>
      <summary style={{ cursor: 'pointer' }}>
        <h2 style={{ display: 'inline' }}>Plan setup</h2>
        <span className="muted small"> · {p.planDays} days · {p.tracks.length} area{p.tracks.length === 1 ? '' : 's'}</span>
      </summary>
      <div className="plan-setup" style={{ marginTop: 14 }}>
        <div>
          <span className="label">How many days do you want to prepare?</span>
          <div className="preset-row">
            {PLAN_PRESETS.map((d) => (
              <button key={d} className="btn sm" aria-pressed={p.planDays === d} onClick={() => setDays(d)}>{d} days</button>
            ))}
            <label className="row" style={{ gap: 6 }}>
              <span className="small muted">Custom</span>
              <input className="input" type="number" min={MIN_DAYS} max={MAX_DAYS} style={{ width: 90 }} value={custom}
                onChange={(e) => setCustom(e.target.value)} onBlur={() => setDays(custom)}
                onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }} aria-label="Custom number of days" />
            </label>
          </div>
          <p className="small dim" style={{ marginTop: 6 }}>{MIN_DAYS}–{MAX_DAYS} days. Shorter plans pack more modules into each week; longer ones give each module more time. Plans of 6+ weeks end with a review week.</p>
        </div>

        <label style={{ maxWidth: 260 }}>
          <span className="label">Day 1</span>
          <input className="input" type="date" value={p.startDate} onChange={(e) => e.target.value && act((s) => { s.profile.startDate = e.target.value })} />
        </label>

        <div>
          <span className="label">Areas in your plan</span>
          <div className="area-grid">
            {AREAS.map((a) => {
              const on = p.tracks.includes(a.id)
              return (
                <div key={a.id} className={`check-item ${on ? 'on' : ''}`} role="checkbox" aria-checked={on} tabIndex={0} onClick={() => toggleArea(a.id)}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleArea(a.id) } }}>
                  <Check on={on} small />
                  <div>
                    <div style={{ fontWeight: 600, color: TRACKS[a.id].color }}>{a.name}</div>
                    <div className="small muted">{a.blurb}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <p className="small dim">Changing the plan reshuffles which week each module lands in. Solved problems, checked topics, notes and XP all stay.</p>
        {!p.planSet && (
          <div><button className="btn primary" onClick={() => { act((s) => { s.profile.planSet = true }); toast('Plan saved. Your daily tasks follow it now.') }}>Use this plan</button></div>
        )}
      </div>
    </details>
  )
}
