import { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import EditableLink from '../components/EditableLink.jsx'
import { RESOURCES, TRACKS } from '../data/content.js'
import { celebrate, useStore } from '../store.jsx'
import { Progress } from '../components/ui.jsx'

const FILTERS = [['all', 'All'], ['craft', 'Developer craft'], ['current', 'Stay current'], ['trend', 'Trending tech'], ['dsa', 'DSA'], ['sd', 'System design'], ['lld', 'LLD & machine coding'], ['sql', 'SQL'], ['fe', 'Frontend'], ['mobile', 'Mobile'], ['ai', 'AI/ML'], ['ops', 'DevOps'], ['product', 'Product'], ['fund', 'Fundamentals'], ['career', 'Getting hired']]

export default function Library() {
  const { state } = useStore()
  const [track, setTrack] = useState('all')
  const [mustOnly, setMustOnly] = useState(false)
  const list = [...RESOURCES, ...state.customResources.map((r) => ({ ...r, custom: true }))]
    .filter((r) => (track === 'all' || r.track === track) && (!mustOnly || r.must))
  const inProgress = list.filter((r) => state.resources[r.id]?.current > 0 && !state.resources[r.id]?.done)

  return (
    <div className="page">
      <div>
        <h1>Library</h1>
        <p className="muted" style={{ maxWidth: '70ch' }}>Books, courses and videos, with a place to note exactly where you stopped. “Must” items are the core path; the rest are for depth if you have time. Editions and links checked November 2026. If a link stops working, click the ✎ next to it to paste a new one.</p>
      </div>

      <div className="row">
        <select className="select" style={{ width: 'auto' }} value={track} onChange={(e) => setTrack(e.target.value)} aria-label="Show resources for">
          {FILTERS.map(([id, name]) => <option key={id} value={id}>{name} ({id === 'all' ? RESOURCES.length + state.customResources.length : [...RESOURCES, ...state.customResources].filter((r) => r.track === id).length})</option>)}
        </select>
        <div className="seg" role="group" aria-label="Priority">
          <button aria-pressed={!mustOnly} onClick={() => setMustOnly(false)}>Everything</button>
          <button aria-pressed={mustOnly} onClick={() => setMustOnly(true)}>Must only</button>
        </div>
      </div>

      {inProgress.length > 0 && (
        <section className="panel flush">
          <div className="panel-head" style={{ padding: '16px 16px 0', margin: 0 }}><h2>In progress</h2></div>
          {inProgress.map((r) => <Resource key={r.id} r={r} />)}
        </section>
      )}

      <section className="panel flush">
        {list.filter((r) => !inProgress.includes(r)).map((r) => <Resource key={r.id} r={r} />)}
      </section>

      <AddResource />
    </div>
  )
}

function Resource({ r }) {
  const { state, act } = useStore()
  const p = state.resources[r.id] || {}
  const total = p.total || r.total
  const current = p.current || 0
  const step = r.unit === 'percent' ? 5 : 1
  const xpPer = r.unit === 'percent' ? 5 : 10

  const setCurrent = (val) => {
    const next = Math.max(0, Math.min(total, val))
    if (next === current) return
    const finishing = next >= total && !p.done
    const delta = Math.round(((next - current) / step) * xpPer)
    act((s) => {
      const d = (s.resources[r.id] ||= {})
      d.current = next
      if (finishing) d.done = true
      if (next < total) d.done = false
    }, { xp: delta + (finishing ? 100 : 0), reason: finishing ? `Finished ${r.title}!` : r.title })
    if (finishing) celebrate(true)
  }
  const patch = (obj) => act((s) => { Object.assign((s.resources[r.id] ||= {}), obj) })

  return (
    <div className="res">
      <div>
        <div className="row" style={{ gap: 8 }}>
          <span className="res-title"><EditableLink href={r.url} fixKey={r.url || `res:${r.id}`}>{r.title}</EditableLink></span>
          {r.must && <span className="chip must">Must</span>}
          {p.done && <span className="chip easy">Finished</span>}
        </div>
        <div className="small muted">{r.author ? `${r.author} · ` : ''}{r.type} · <span style={{ color: TRACKS[r.track]?.color }}>{r.tech || TRACKS[r.track]?.name}</span></div>
        {r.why && <p className="small" style={{ marginTop: 6, maxWidth: '64ch' }}>{r.why}</p>}
        <input className="input" style={{ marginTop: 10 }} placeholder={r.unit === 'videos' ? 'Where I left off, e.g. video 3 at 1:12:40' : 'Where I left off, e.g. ch. 5, p. 142'}
          defaultValue={p.note || ''} onBlur={(e) => patch({ note: e.target.value })} aria-label={`Where you left off in ${r.title}`} />
        {r.custom && (
          <button className="btn sm ghost" style={{ marginTop: 8 }} onClick={() => act((s) => { s.customResources = s.customResources.filter((x) => x.id !== r.id); delete s.resources[r.id] })}>
            <Trash2 size={13} /> Remove
          </button>
        )}
      </div>
      <div className="res-ctrl">
        <Progress value={current / total} color={TRACKS[r.track]?.color} />
        <div className="stepper">
          <button className="btn icon" onClick={() => setCurrent(current - step)} aria-label="Less progress"><Minus size={14} /></button>
          <input className="input" type="number" min="0" max={total} key={`c-${current}`} defaultValue={current} onBlur={(e) => setCurrent(Number(e.target.value) || 0)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }} aria-label={`Current ${r.unit}`} />
          <span className="small muted">/</span>
          <input className="input" type="number" min="1" key={`t-${total}`} defaultValue={total} onBlur={(e) => patch({ total: Math.max(1, Number(e.target.value) || 1) })} aria-label={`Total ${r.unit}`} />
          <button className="btn icon primary" onClick={() => setCurrent(current + step)} aria-label="More progress"><Plus size={14} /></button>
        </div>
        <span className="small dim">{r.unit === 'percent' ? 'percent done' : r.unit} · +{xpPer} m per {r.unit === 'percent' ? '5%' : r.unit.replace(/s$/, '')}</span>
        {!p.done && <button className="btn sm" onClick={() => setCurrent(total)}>Mark finished</button>}
      </div>
    </div>
  )
}

function AddResource() {
  const { act, toast } = useStore()
  const [f, setF] = useState({ title: '', url: '', track: 'dsa', unit: 'chapters', total: 10 })
  const submit = (e) => {
    e.preventDefault()
    if (!f.title.trim()) return
    act((s) => { s.customResources.push({ ...f, id: `custom-${Date.now().toString(36)}`, title: f.title.trim(), type: 'Custom', must: false, total: Number(f.total) || 1 }) })
    toast('Added to your library')
    setF({ ...f, title: '', url: '' })
  }
  return (
    <section className="panel">
      <div className="panel-head"><h3>Add a book, course or video</h3></div>
      <form className="row" onSubmit={submit}>
        <input className="input" style={{ flex: 2, minWidth: 180 }} placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} aria-label="Title" />
        <input className="input" style={{ flex: 2, minWidth: 160 }} placeholder="Link (optional)" value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} aria-label="Link" />
        <select className="select" style={{ width: 'auto' }} value={f.track} onChange={(e) => setF({ ...f, track: e.target.value })} aria-label="Track">
          {FILTERS.slice(1).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
        <select className="select" style={{ width: 'auto' }} value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value })} aria-label="Unit">
          {['chapters', 'videos', 'lessons', 'pages', 'percent'].map((u) => <option key={u}>{u}</option>)}
        </select>
        <input className="input" type="number" min="1" style={{ width: 90 }} value={f.total} onChange={(e) => setF({ ...f, total: e.target.value })} aria-label="Total" />
        <button className="btn primary" type="submit"><Plus size={16} /> Add</button>
      </form>
    </section>
  )
}
