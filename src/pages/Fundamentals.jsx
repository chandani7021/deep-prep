import { FUND_SECTIONS, STORY_PROMPTS } from '../data/content.js'
import { useStore } from '../store.jsx'
import { Ring } from '../components/ui.jsx'
import TopicGrid from '../components/TopicGrid.jsx'
import ModuleList from '../components/Modules.jsx'

const FIELDS = [['s', 'Situation'], ['t', 'Task'], ['a', 'Action (what you did, specifically)'], ['r', 'Result (numbers if you have them)']]

export default function Fundamentals() {
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
