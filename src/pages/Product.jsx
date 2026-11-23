import { RESOURCES } from '../data/content.js'
import { CURRICULUM } from '../data/curriculum.js'
import { planPosition, useStore } from '../store.jsx'
import { Ring } from '../components/ui.jsx'
import TopicGrid from '../components/TopicGrid.jsx'
import EditableLink from '../components/EditableLink.jsx'
import { weeksLabel } from '../components/Modules.jsx'

const HABITS = [
  ['Before building', 'Ask who it is for, what problem it solves, and how you will know it worked.'],
  ['In system design', 'Open with users, core use cases and one success metric before any boxes.'],
  ['In code review', 'Check the edge cases a real user will hit, not just the happy path.'],
  ['After shipping', 'Look at the metric a week later and write down what you learned.'],
  ['In behavioral answers', 'End every story with impact in business terms: users, revenue, time or cost.'],
]

export default function Product({ go }) {
  const { state } = useStore()
  const { week, plan } = planPosition(state.profile)
  const inPlan = plan.tracks.includes('product')
  const mods = CURRICULUM.product
  const all = mods.flatMap((m) => m.topics)
  const done = all.filter(([id]) => state.productTopics?.[id]).length
  const current = new Set((plan.weeks[week - 1]?.items.product || []).map((x) => x.module.id))

  return (
    <div className="page">
      <div className="row">
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1>Product thinking</h1>
          <p className="muted" style={{ maxWidth: '70ch' }}>
            The difference between “I built what the ticket said” and “I solved the user’s problem and moved the metric”.
            It makes your system designs sharper, your behavioral stories stronger, and is what senior and staff interviews look for.
          </p>
          {!inPlan && <p className="small" style={{ color: 'var(--warn)' }}>Product thinking isn’t in your plan yet. <button className="btn sm" onClick={() => go('roadmap')}>Add it on the Roadmap</button></p>}
        </div>
        <Ring value={done / all.length} size={64} label={`${done}`} color="var(--c-product)" />
      </div>

      <section className="panel">
        <div className="panel-head"><h2>Habits of a product-minded engineer</h2><span className="muted small">Use them every week, not just in interviews</span></div>
        <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6 }}>
          {HABITS.map(([a, b]) => <li key={a}><strong>{a}.</strong> <span className="muted">{b}</span></li>)}
        </ol>
      </section>

      {mods.map((m, i) => {
        const d = m.topics.filter(([id]) => state.productTopics?.[id]).length
        return (
          <section key={m.id} className="panel" style={current.has(m.id) ? { borderColor: 'var(--c-product)' } : undefined}>
            <div className="panel-head">
              <div>
                <h2>{i + 1}. {m.title}</h2>
                <p className="muted small">{inPlan ? weeksLabel(plan, 'product', m.id) : 'Not scheduled'}{current.has(m.id) ? ' · this week' : ''} · ~{m.hours} h · {m.outcome}</p>
              </div>
              <span className="chip">{d}/{m.topics.length}</span>
            </div>
            <TopicGrid topics={m.topics} storeKey="productTopics" xp={10} />
            <p className="small" style={{ marginTop: 12 }}><strong>Practice:</strong> {m.practice}</p>
            <div className="module-links" style={{ marginTop: 8 }}>
              {m.links.map(([title, url]) => <EditableLink key={url} href={url} className="small" iconSize={11}>{title}</EditableLink>)}
            </div>
          </section>
        )
      })}

      <section className="panel">
        <div className="panel-head"><h2>Read</h2><button className="btn sm ghost" onClick={() => go('library')}>Track progress in Library</button></div>
        {RESOURCES.filter((r) => r.track === 'product').map((r) => (
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
