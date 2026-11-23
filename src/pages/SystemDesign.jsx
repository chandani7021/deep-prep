import { Minus, Plus } from 'lucide-react'
import { SD_PROBLEMS, SD_TOPICS } from '../data/content.js'
import { celebrate, dayKey, planPosition, prettyDate, useStore } from '../store.jsx'
import { Check, Ring, Stars } from '../components/ui.jsx'
import ModuleList from '../components/Modules.jsx'

const FRAMEWORK = [
  ['Clarify users and requirements', 'Who are the users and what problem are we solving? What does success look like (one metric)? Then functional and non-functional: scale, latency, consistency. 5 min.'],
  ['Estimate', 'Users, QPS, storage, bandwidth. Only what changes the design.'],
  ['API', 'The main endpoints with inputs and outputs.'],
  ['Data model', 'Entities, access patterns, which database and why.'],
  ['High-level design', 'Boxes and arrows for the happy path end to end.'],
  ['Deep dives', 'Bottlenecks, scaling, failure modes. Let the interviewer steer.'],
  ['Trade-offs', 'Say what you gave up and what you would revisit.'],
]

export default function SystemDesign() {
  const { state, act } = useStore()
  const { week, plan } = planPosition(state.profile)
  const pw = (id) => plan.firstWeek[id]
  const topicsDone = SD_TOPICS.filter((t) => state.sdTopics[t.id]).length
  const designs = SD_PROBLEMS.filter((p) => state.sdProblems[p.id]?.count > 0).length

  const toggleTopic = (t) => {
    const was = !!state.sdTopics[t.id]
    act((s) => { s.sdTopics[t.id] = !was }, { xp: was ? -15 : 15, reason: was ? '' : t.name })
    if (!was) celebrate()
  }
  const practise = (p, delta) => {
    const cur = state.sdProblems[p.id]?.count || 0
    if (cur + delta < 0) return
    act((s) => {
      const d = (s.sdProblems[p.id] ||= { count: 0, rating: 0, notes: '' })
      d.count = cur + delta
      if (delta > 0) d.last = dayKey()
    }, { xp: delta > 0 ? 50 : -50, reason: delta > 0 ? `Designed ${p.name}` : '' })
    if (delta > 0) celebrate(true)
  }
  const update = (p, patch) => act((s) => { Object.assign((s.sdProblems[p.id] ||= { count: 0, rating: 0, notes: '' }), patch) })

  return (
    <div className="page">
      <div className="row">
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1>System design</h1>
          <p className="muted">Learn the building blocks first, then design systems out loud. Practise each design more than once.</p>
        </div>
        <Ring value={topicsDone / SD_TOPICS.length} size={64} label={`${topicsDone}`} />
        <Ring value={designs / SD_PROBLEMS.length} size={64} label={`${designs}`} color="var(--glow)" />
      </div>

      <ModuleList track="sd" />

      <section className="panel">
        <div className="panel-head"><h2>The interview framework</h2><span className="muted small">Use it for every design, every time</span></div>
        <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6 }}>
          {FRAMEWORK.map(([a, b]) => <li key={a}><strong>{a}.</strong> <span className="muted">{b}</span></li>)}
        </ol>
      </section>

      <section className="panel">
        <div className="panel-head"><div><h2>Building blocks</h2><p className="muted small">Check one off when you can explain it without notes. +15 m each.</p></div><span className="chip">{topicsDone}/{SD_TOPICS.length}</span></div>
        <div className="check-grid">
          {SD_TOPICS.map((t) => (
            <div key={t.id} className={`check-item ${state.sdTopics[t.id] ? 'on' : ''}`} onClick={() => toggleTopic(t)} role="checkbox" aria-checked={!!state.sdTopics[t.id]} tabIndex={0}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleTopic(t) } }}>
              <Check on={state.sdTopics[t.id]} small />
              <div><div className="ci-text">{t.name}</div><div className="ci-note">{t.note}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel flush">
        <div className="panel-head" style={{ padding: '18px 18px 0' }}>
          <div><h2>Design practice</h2><p className="muted small">Log each time you design one end to end, out loud, in 45 minutes. +50 m per session.</p></div>
        </div>
        {SD_PROBLEMS.map((p) => {
          const d = state.sdProblems[p.id] || { count: 0, rating: 0, notes: '' }
          return (
            <div key={p.id} style={{ padding: '14px 18px', borderTop: '1px solid var(--line)', background: pw(p.id) === week ? 'rgba(61,139,253,0.07)' : undefined }}>
              <div className="row">
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div className="small dim">{p.level}{pw(p.id) ? ` · week ${pw(p.id)}` : ''}{pw(p.id) === week ? ' · this week' : ''}{d.last ? ` · last ${prettyDate(d.last)}` : ''}</div>
                </div>
                <Stars value={d.rating} onChange={(n) => update(p, { rating: n })} label={`Confidence for ${p.name}`} />
                <div className="stepper">
                  <button className="btn icon" onClick={() => practise(p, -1)} disabled={!d.count} aria-label="Remove a session"><Minus size={14} /></button>
                  <span className="chip" style={{ minWidth: 70, justifyContent: 'center' }}>{d.count} session{d.count === 1 ? '' : 's'}</span>
                  <button className="btn icon primary" onClick={() => practise(p, 1)} aria-label={`Log a session for ${p.name}`}><Plus size={14} /></button>
                </div>
              </div>
              <details className="notes" style={{ marginTop: 8 }}>
                <summary>{d.notes ? 'Notes' : 'Add notes'}</summary>
                <textarea className="textarea" style={{ marginTop: 8 }} placeholder="Key components, trade-offs, what the interviewer pushed on, what to improve"
                  defaultValue={d.notes} onBlur={(e) => update(p, { notes: e.target.value })} aria-label={`Notes for ${p.name}`} />
              </details>
            </div>
          )
        })}
      </section>
    </div>
  )
}
