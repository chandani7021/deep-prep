import { LEVELS } from '../data/content.js'
import { BADGES, computeStats, levelFor, prettyDate, useStore } from '../store.jsx'

export default function Achievements() {
  const { state } = useStore()
  const stats = computeStats(state)
  const lvl = levelFor(state.xp)
  const earned = BADGES.filter((b) => state.badges[b.id]).length

  return (
    <div className="page">
      <div>
        <h1>Achievements</h1>
        <p className="muted">Every bit of work takes you deeper. {earned} of {BADGES.length} badges collected.</p>
      </div>

      <div className="grid-4">
        <div className="stat"><div className="n">{state.xp.toLocaleString()} m</div><div className="small muted">Total depth</div></div>
        <div className="stat"><div className="n">{stats.current}</div><div className="small muted">Current streak · best {stats.longest}</div></div>
        <div className="stat"><div className="n">{stats.solved}</div><div className="small muted">Problems solved</div></div>
        <div className="stat"><div className="n">{stats.perfectDays}</div><div className="small muted">Perfect days</div></div>
      </div>

      <div className="grid-2">
        <section className="panel">
          <div className="panel-head"><h2>Badges</h2></div>
          <div className="badges">
            {BADGES.map((b) => {
              const on = state.badges[b.id]
              return (
                <div key={b.id} className={`badge ${on ? 'earned' : 'locked'}`}>
                  <div className="b-icon" aria-hidden="true">{b.icon}</div>
                  <div className="b-name">{b.name}</div>
                  <div className="small muted">{b.desc}</div>
                  {on && <div className="small" style={{ color: 'var(--glow)', marginTop: 4 }}>{prettyDate(on)}</div>}
                </div>
              )
            })}
          </div>
        </section>

        <div className="stack">
          <section className="panel">
            <div className="panel-head"><h2>Depth chart</h2></div>
            <div className="ladder">
              {LEVELS.map((l, i) => (
                <div key={l.name} className={`rung ${state.xp >= l.at ? 'reached' : ''} ${i === lvl.index ? 'here' : ''}`}>
                  <span className="small muted">{l.at.toLocaleString()} m</span>
                  <span style={{ fontWeight: i === lvl.index ? 700 : 500 }}>{l.name}</span>
                  <span aria-hidden="true">{i === lvl.index ? '🤿' : state.xp >= l.at ? '✓' : ''}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head"><h2>How to earn depth</h2></div>
            <div className="small" style={{ display: 'grid', gap: 4 }}>
              {[['Daily task', '10–60 m'], ['Clean sweep (all daily tasks)', '+50 m'], ['Easy / Medium / Hard problem', '10 / 20 / 35 m'], ['Spaced review', '10 m'], ['System design session', '50 m'], ['Weekly goal / full week', '25 / +75 m'], ['Mock interview', '60 m'], ['Finish a book or course', '+100 m'], ['Focus session', '½ m per minute'], ['Ship the AI project', '+200 m']].map(([a, b]) => (
                <div key={a} className="row" style={{ borderTop: '1px solid var(--line)', padding: '5px 0' }}><span style={{ flex: 1 }}>{a}</span><span className="chip xp">{b}</span></div>
              ))}
            </div>
            <p className="small muted" style={{ marginTop: 10 }}>Keep a 7-day run to earn a streak freeze (hold up to 2). A freeze covers one missed day.</p>
          </section>

          <section className="panel">
            <div className="panel-head"><h2>Recent</h2></div>
            {state.xpLog.length === 0 ? <p className="muted small">Nothing yet. Check off your first task on Today.</p>
              : state.xpLog.slice(0, 12).map((x, i) => (
                <div key={i} className="row small" style={{ borderTop: '1px solid var(--line)', padding: '5px 0' }}>
                  <span className="dim" style={{ width: 60 }}>{prettyDate(x.date)}</span>
                  <span style={{ flex: 1 }}>{x.reason || (x.xp < 0 ? 'Undone' : 'Progress')}</span>
                  <span style={{ color: x.xp < 0 ? 'var(--dim)' : 'var(--glow)' }}>{x.xp > 0 ? '+' : ''}{x.xp}</span>
                </div>
              ))}
          </section>
        </div>
      </div>
    </div>
  )
}
