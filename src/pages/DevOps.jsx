import { OPS_MILESTONES, RESOURCES } from '../data/content.js'
import { CURRICULUM } from '../data/curriculum.js'
import { celebrate, planPosition, useStore } from '../store.jsx'
import { Check, Progress, Ring } from '../components/ui.jsx'
import TopicGrid from '../components/TopicGrid.jsx'
import EditableLink from '../components/EditableLink.jsx'
import { weeksLabel } from '../components/Modules.jsx'

export default function DevOps({ go }) {
  const { state, act } = useStore()
  const { week, plan } = planPosition(state.profile)
  const inPlan = plan.tracks.includes('ops')
  const mods = CURRICULUM.ops
  const all = mods.flatMap((m) => m.topics)
  const done = all.filter(([id]) => state.opsTopics?.[id]).length
  const project = state.opsProject || {}
  const projDone = OPS_MILESTONES.filter((m) => project[m.id]).length
  const current = new Set((plan.weeks[week - 1]?.items.ops || []).map((x) => x.module.id))

  const toggleMilestone = (m) => {
    const was = !!project[m.id]
    const finishing = !was && projDone + 1 === OPS_MILESTONES.length
    act((s) => { (s.opsProject ||= {})[m.id] = !was }, { xp: (was ? -30 : 30) + (finishing ? 200 : 0), reason: was ? '' : finishing ? 'Pipeline shipped!' : 'DevOps milestone' })
    if (!was) celebrate(finishing)
  }

  return (
    <div className="page">
      <div className="row">
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1>DevOps & delivery</h1>
          <p className="muted" style={{ maxWidth: '70ch' }}>
            CI/CD, containers, deployment strategies, Kubernetes, infrastructure as code, and database DevOps: migrations, backups and reliability.
            Learn each module, then do its lab on a real repo. Interviewers love “here’s the pipeline I built”.
          </p>
          {!inPlan && <p className="small" style={{ color: 'var(--warn)' }}>DevOps isn’t in your plan yet. <button className="btn sm" onClick={() => go('roadmap')}>Add it on the Roadmap</button></p>}
        </div>
        <Ring value={done / all.length} size={64} label={`${done}`} color="var(--c-ops)" />
      </div>

      {mods.map((m, i) => {
        const d = m.topics.filter(([id]) => state.opsTopics?.[id]).length
        return (
          <section key={m.id} className="panel" style={current.has(m.id) ? { borderColor: 'var(--c-ops)' } : undefined}>
            <div className="panel-head">
              <div>
                <h2>{i + 1}. {m.title}</h2>
                <p className="muted small">{inPlan ? weeksLabel(plan, 'ops', m.id) : 'Not scheduled'}{current.has(m.id) ? ' · this week' : ''} · ~{m.hours} h · {m.outcome}</p>
              </div>
              <span className="chip">{d}/{m.topics.length}</span>
            </div>
            <TopicGrid topics={m.topics} storeKey="opsTopics" xp={10} />
            <p className="small" style={{ marginTop: 12 }}><strong>Lab:</strong> {m.practice}</p>
            <div className="module-links" style={{ marginTop: 8 }}>
              {m.links.map(([title, url]) => <EditableLink key={url} href={url} className="small" iconSize={11}>{title}</EditableLink>)}
            </div>
          </section>
        )
      })}

      <section className="panel">
        <div className="panel-head">
          <div><h2>Project: ship it like a production team</h2><p className="muted small">Use this tracker’s repo (or any app) and take it from “works on my machine” to a monitored, secure pipeline. +30 m per milestone, +200 m when done.</p></div>
          <span className="chip xp">{projDone}/{OPS_MILESTONES.length}</span>
        </div>
        <Progress value={projDone / OPS_MILESTONES.length} color="var(--c-ops)" />
        <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
          {OPS_MILESTONES.map((m) => {
            const on = !!project[m.id]
            const w = plan.firstWeek[m.id]
            return (
              <div key={m.id} className={`check-item ${on ? 'on' : ''}`} onClick={() => toggleMilestone(m)} role="checkbox" aria-checked={on} tabIndex={0}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleMilestone(m) } }}>
                <Check on={on} small />
                <div style={{ flex: 1 }}><div className="ci-text">{m.label}</div></div>
                {inPlan && w && <span className="small" style={{ color: w === week ? 'var(--glow)' : 'var(--dim)' }}>Week {w}</span>}
              </div>
            )
          })}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Study from</h2><button className="btn sm ghost" onClick={() => go('library')}>Track progress in Library</button></div>
        {RESOURCES.filter((r) => r.track === 'ops').map((r) => (
          <div key={r.id} className="row" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <EditableLink href={r.url} fixKey={r.url || `res:${r.id}`} style={{ fontWeight: 600 }}>{r.title}</EditableLink>
              <div className="small dim">{r.author} · {r.why}</div>
            </div>
            {r.must && <span className="chip must">Must</span>}
          </div>
        ))}
      </section>
    </div>
  )
}
