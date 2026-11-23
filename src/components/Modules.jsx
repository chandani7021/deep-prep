import { ExternalLink } from 'lucide-react'
import { CURRICULUM } from '../data/curriculum.js'
import { TRACKS } from '../data/content.js'
import { planPosition, useStore } from '../store.jsx'

/** The body of one module: outcome, topics, practice, resources. */
export function ModuleBody({ m }) {
  return (
    <div className="module-body">
      {m.outcome && <p className="small"><strong>Outcome:</strong> {m.outcome}</p>}
      {m.topics?.length > 0 && (
        <ul className="module-topics">
          {m.topics.map((t) => {
            const text = Array.isArray(t) ? t[1] : t
            return <li key={text}>{text}</li>
          })}
        </ul>
      )}
      {m.practice && <p className="small"><strong>Practice:</strong> {m.practice}</p>}
      {m.links?.length > 0 && (
        <div className="module-links">
          {m.links.map(([title, url]) => (
            <a key={url} href={url} target="_blank" rel="noreferrer" className="small">{title} <ExternalLink size={11} /></a>
          ))}
        </div>
      )}
    </div>
  )
}

/** Weeks label for a module, e.g. "Week 3" or "Weeks 3–4". */
export const weeksLabel = (plan, track, moduleId) => {
  const ws = plan.weeks.filter((w) => (w.items[track] || []).some((x) => x.module.id === moduleId)).map((w) => w.n)
  if (!ws.length) return 'Not scheduled'
  return ws.length === 1 ? `Week ${ws[0]}` : `Weeks ${ws[0]}–${ws[ws.length - 1]}`
}

/** All modules of one area, with when they are scheduled. Current week opens by default. */
export default function ModuleList({ track, title = 'Week-by-week plan' }) {
  const { state } = useStore()
  const pos = planPosition(state.profile)
  const { plan } = pos
  const inPlan = plan.tracks.includes(track)
  const current = new Set((plan.weeks[pos.week - 1]?.items[track] || []).map((x) => x.module.id))
  const mods = CURRICULUM[track]

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>{title}</h2>
          <p className="muted small">
            {inPlan
              ? `${mods.length} modules spread over your ${plan.days}-day plan. Open one for topics, practice and the best resources.`
              : `${TRACKS[track].name} is not in your plan. Add it on the Roadmap page to schedule these modules.`}
          </p>
        </div>
      </div>
      {mods.map((m, i) => (
        <details key={m.id} className={`module ${current.has(m.id) ? 'current' : ''}`} open={current.has(m.id)}>
          <summary>
            <span className="module-n">{i + 1}</span>
            <span className="module-title">{m.title}</span>
            <span className="small dim">{inPlan ? weeksLabel(plan, track, m.id) : ''}{current.has(m.id) ? ' · this week' : ''}{m.hours ? ` · ~${m.hours} h` : ''}</span>
          </summary>
          <ModuleBody m={m} />
        </details>
      ))}
    </section>
  )
}
