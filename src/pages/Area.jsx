import { AREAS, CURRICULUM } from '../data/curriculum.js'
import { EXTRA_INTROS, LANGUAGES } from '../data/areas-extra.js'
import { RESOURCES, TRACKS } from '../data/content.js'
import { planPosition, useStore } from '../store.jsx'
import { Ring } from '../components/ui.jsx'
import TopicGrid from '../components/TopicGrid.jsx'
import EditableLink from '../components/EditableLink.jsx'
import { weeksLabel } from '../components/Modules.jsx'

/** Generic page for the topic-based areas: Language, LLD, SQL, Frontend, Mobile, Getting hired. */
export default function Area({ track, go }) {
  const { state, act } = useStore()
  const { week, plan } = planPosition(state.profile)
  const area = AREAS.find((a) => a.id === track)
  const inPlan = plan.tracks.includes(track)
  const mods = CURRICULUM[track]
  const all = mods.flatMap((m) => m.topics)
  const done = all.filter(([id]) => state.areaTopics?.[id]).length
  const current = new Set((plan.weeks[week - 1]?.items[track] || []).map((x) => x.module.id))
  const lang = LANGUAGES[state.profile.language] || LANGUAGES.python
  const color = TRACKS[track].color

  return (
    <div className="page">
      <div className="row">
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1>{area.name}</h1>
          <p className="muted" style={{ maxWidth: '72ch' }}>{EXTRA_INTROS[track]}</p>
          {!inPlan && <p className="small" style={{ color: 'var(--warn)' }}>{area.name} isn’t in your plan yet. <button className="btn sm" onClick={() => go('roadmap')}>Add it on the Roadmap</button></p>}
        </div>
        <Ring value={done / all.length} size={64} label={`${done}`} color={color} />
      </div>

      {track === 'lang' && (
        <section className="panel">
          <div className="panel-head">
            <div><h2>Your language</h2><p className="muted small">Use the language you will interview in. The modules stay the same; these resources follow your choice.</p></div>
            <select className="select" style={{ width: 'auto' }} value={state.profile.language} aria-label="Interview language"
              onChange={(e) => act((s) => { s.profile.language = e.target.value })}>
              {Object.entries(LANGUAGES).map(([id, l]) => <option key={id} value={id}>{l.name}</option>)}
            </select>
          </div>
          <div className="module-links">
            {lang.links.map(([title, url]) => <EditableLink key={url} href={url} className="small" iconSize={11}>{title}</EditableLink>)}
          </div>
        </section>
      )}

      {mods.map((m, i) => {
        const d = m.topics.filter(([id]) => state.areaTopics?.[id]).length
        return (
          <section key={m.id} className="panel" style={current.has(m.id) ? { borderColor: color } : undefined}>
            <div className="panel-head">
              <div>
                <h2>{i + 1}. {m.title}</h2>
                <p className="muted small">{inPlan ? weeksLabel(plan, track, m.id) : 'Not scheduled'}{current.has(m.id) ? ' · this week' : ''} · ~{m.hours} h · {m.outcome}</p>
              </div>
              <span className="chip">{d}/{m.topics.length}</span>
            </div>
            <TopicGrid topics={m.topics} storeKey="areaTopics" xp={10} />
            <p className="small" style={{ marginTop: 12 }}><strong>Practice:</strong> {m.practice}</p>
            {(m.links.length > 0 || track === 'lang') && (
              <div className="module-links" style={{ marginTop: 8 }}>
                {(m.links.length ? m.links : lang.links.slice(0, 3)).map(([title, url]) => <EditableLink key={url} href={url} className="small" iconSize={11}>{title}</EditableLink>)}
              </div>
            )}
          </section>
        )
      })}

      {RESOURCES.some((r) => r.track === track) && (
        <section className="panel">
          <div className="panel-head"><h2>Study from</h2><button className="btn sm ghost" onClick={() => go('library')}>Track progress in Library</button></div>
          {RESOURCES.filter((r) => r.track === track).map((r) => (
            <div key={r.id} className="row" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <EditableLink href={r.url} fixKey={r.url || `res:${r.id}`} style={{ fontWeight: 600 }}>{r.title}</EditableLink>
                <div className="small dim">{r.author} · {r.why}</div>
              </div>
              {r.must && <span className="chip must">Must</span>}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
