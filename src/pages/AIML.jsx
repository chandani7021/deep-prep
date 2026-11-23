import { ExternalLink } from 'lucide-react'
import { AI_SECTIONS, PROJECT_MILESTONES, RESOURCES } from '../data/content.js'
import { celebrate, planPosition, useStore } from '../store.jsx'
import { Check, Progress, Ring } from '../components/ui.jsx'
import TopicGrid from '../components/TopicGrid.jsx'

export default function AIML({ go }) {
  const { state, act } = useStore()
  const { month, week } = planPosition(state.profile.startDate)
  const all = AI_SECTIONS.flatMap((s) => s.topics)
  const done = all.filter(([id]) => state.aiTopics[id]).length
  const projDone = PROJECT_MILESTONES.filter((m) => state.project[m.id]).length

  const toggleMilestone = (m) => {
    const was = !!state.project[m.id]
    const finishing = !was && projDone + 1 === PROJECT_MILESTONES.length
    act((s) => { s.project[m.id] = !was }, { xp: (was ? -30 : 30) + (finishing ? 200 : 0), reason: was ? '' : finishing ? 'Project shipped!' : 'Project milestone' })
    if (!was) celebrate(finishing)
  }

  return (
    <div className="page">
      <div className="row">
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1>AI / ML</h1>
          <p className="muted">Classic ML in month 1, deep learning in month 2, LLM engineering and ML system design in month 3. One real project ties it together.</p>
        </div>
        <Ring value={done / all.length} size={64} label={`${done}`} color="var(--c-ai)" />
      </div>

      {AI_SECTIONS.map((s) => {
        const d = s.topics.filter(([id]) => state.aiTopics[id]).length
        return (
          <section key={s.id} className="panel" style={s.month === month ? { borderColor: 'rgba(154,168,255,.5)' } : undefined}>
            <div className="panel-head">
              <div><h2>{s.name}</h2><p className="muted small">Month {s.month}{s.month === month ? ' · now' : ''} · check off when you could explain it in an interview. +15 m</p></div>
              <span className="chip">{d}/{s.topics.length}</span>
            </div>
            <TopicGrid topics={s.topics} storeKey="aiTopics" />
          </section>
        )
      })}

      <section className="panel">
        <div className="panel-head">
          <div><h2>Project: a RAG app with real evaluation</h2><p className="muted small">The thing you’ll talk about in every interview. +30 m per milestone, +200 m when shipped.</p></div>
          <span className="chip xp">{projDone}/{PROJECT_MILESTONES.length}</span>
        </div>
        <Progress value={projDone / PROJECT_MILESTONES.length} color="var(--c-ai)" />
        <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
          {PROJECT_MILESTONES.map((m) => {
            const on = !!state.project[m.id]
            return (
              <div key={m.id} className={`check-item ${on ? 'on' : ''}`} onClick={() => toggleMilestone(m)} role="checkbox" aria-checked={on} tabIndex={0}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleMilestone(m) } }}>
                <Check on={on} small />
                <div style={{ flex: 1 }}><div className="ci-text">{m.label}</div></div>
                <span className="small" style={{ color: m.week === week ? 'var(--glow)' : 'var(--dim)' }}>Week {m.week}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Study from</h2><button className="btn sm ghost" onClick={() => go('library')}>Track progress in Library</button></div>
        {RESOURCES.filter((r) => r.track === 'ai').map((r) => (
          <div key={r.id} className="row" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              {r.url ? <a href={r.url} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>{r.title} <ExternalLink size={12} /></a> : <span style={{ fontWeight: 600 }}>{r.title}</span>}
              <div className="small dim">{r.author} · {r.why}</div>
            </div>
            {r.must && <span className="chip must">Must</span>}
          </div>
        ))}
      </section>
    </div>
  )
}
