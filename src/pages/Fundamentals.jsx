import { ExternalLink } from 'lucide-react'
import { FUND_SECTIONS, RESOURCES, STORY_PROMPTS } from '../data/content.js'
import { useStore } from '../store.jsx'
import { Ring } from '../components/ui.jsx'
import TopicGrid from '../components/TopicGrid.jsx'
import ModuleList from '../components/Modules.jsx'

const FIELDS = [['s', 'Situation'], ['t', 'Task'], ['a', 'Action (what you did, specifically)'], ['r', 'Result (numbers if you have them)']]

export default function Fundamentals({ go }) {
  const { state, act } = useStore()
  const all = FUND_SECTIONS.flatMap((s) => s.topics)
  const done = all.filter(([id]) => state.fundTopics[id]).length
  const storyDone = (id) => { const s = state.stories[id]; return !!(s && s.s && s.a && s.r) }

  const saveField = (id, k, v) => {
    const before = storyDone(id)
    const next = { ...(state.stories[id] || {}), [k]: v }
    const after = !!(next.s && next.a && next.r)
    act((s) => { s.stories[id] = next }, { xp: !before && after ? 40 : before && !after ? -40 : 0, reason: 'STAR story written' })
  }

  return (
    <div className="page">
      <div className="row">
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1>CS fundamentals & behavioral</h1>
          <p className="muted">The questions that come up between coding rounds, and the stories that win the behavioral one.</p>
        </div>
        <Ring value={done / all.length} size={64} label={`${done}`} color="var(--c-fund)" />
      </div>

      <ModuleList track="fund" />

      <section className="panel">
        <div className="panel-head">
          <div><h2>Books that make your fundamentals strong</h2><p className="muted small">Start with the “Must” ones. Read a chapter a week alongside the plan; track progress in the Library. With AI writing more of the code, fundamentals matter more, not less: you have to judge what it produces (<a href="https://www.thoughtworks.com/en-us/about-us/news/2026/combat-ai-cognitive-debt-radar-v34" target="_blank" rel="noreferrer">Thoughtworks Radar, April 2026</a>).</p></div>
          <button className="btn sm ghost" onClick={() => go('library')}>Library</button>
        </div>
        {RESOURCES.filter((r) => r.track === 'craft' || (r.track === 'fund' && r.type === 'Book')).map((r) => (
          <div key={r.id} className="row" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              {r.url ? <a href={r.url} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>{r.title} <ExternalLink size={12} /></a> : <span style={{ fontWeight: 600 }}>{r.title}</span>}
              <div className="small dim">{r.author} · {r.why}</div>
            </div>
            {r.must && <span className="chip must">Must</span>}
          </div>
        ))}
      </section>

      {FUND_SECTIONS.map((s) => (
        <section key={s.id} className="panel">
          <div className="panel-head"><h2>{s.name}</h2><span className="chip">{s.topics.filter(([id]) => state.fundTopics[id]).length}/{s.topics.length}</span></div>
          <TopicGrid topics={s.topics} storeKey="fundTopics" xp={10} />
        </section>
      ))}

      <section className="panel">
        <div className="panel-head">
          <div><h2>STAR stories</h2><p className="muted small">Write each one from your last two years of work. A story counts once Situation, Action and Result are filled in. +40 m each.</p></div>
          <span className="chip xp">{STORY_PROMPTS.filter((p) => storyDone(p.id)).length}/{STORY_PROMPTS.length}</span>
        </div>
        {STORY_PROMPTS.map((p) => (
          <details key={p.id} style={{ borderTop: '1px solid var(--line)', padding: '12px 0' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{storyDone(p.id) ? '✅ ' : ''}{p.q}</summary>
            <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
              {FIELDS.map(([k, label]) => (
                <label key={k}>
                  <span className="label">{label}</span>
                  <textarea className="textarea" style={{ minHeight: 56 }} defaultValue={state.stories[p.id]?.[k] || ''} onBlur={(e) => saveField(p.id, k, e.target.value.trim())} />
                </label>
              ))}
            </div>
          </details>
        ))}
      </section>
    </div>
  )
}
