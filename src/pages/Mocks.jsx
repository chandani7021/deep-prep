import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { celebrate, dayKey, prettyDate, useStore } from '../store.jsx'
import { Stars } from '../components/ui.jsx'

const TYPES = ['Coding', 'System design', 'ML / AI', 'Behavioral', 'Real interview']

export default function Mocks() {
  const { state, act } = useStore()
  const [f, setF] = useState({ date: dayKey(), type: 'Coding', platform: '', rating: 3, went: '', improve: '' })

  const submit = (e) => {
    e.preventDefault()
    act((s) => { s.mocks.unshift({ ...f, id: Date.now().toString(36) }) }, { xp: f.type === 'Real interview' ? 120 : 60, reason: `${f.type} mock logged` })
    celebrate(true)
    setF({ ...f, platform: '', went: '', improve: '' })
  }

  const byType = TYPES.map((t) => [t, state.mocks.filter((m) => m.type === t).length])

  return (
    <div className="page">
      <div>
        <h1>Mock interviews</h1>
        <p className="muted" style={{ maxWidth: '70ch' }}>
          Start around a third of the way into your plan: one a week at first, two a week near the end. Try <a href="https://interviewing.io/" target="_blank" rel="noreferrer">interviewing.io</a>,{' '}
          <a href="https://www.aced.io/practice" target="_blank" rel="noreferrer">Aced peer mocks (formerly Exponent)</a>, or trade sessions with a friend.
        </p>
      </div>

      <div className="grid-4">
        {byType.slice(0, 4).map(([t, n]) => <div key={t} className="stat"><div className="n">{n}</div><div className="small muted">{t}</div></div>)}
      </div>

      <section className="panel">
        <div className="panel-head"><div><h2>Log a session</h2><p className="muted small">+60 m per mock, +120 m for a real interview.</p></div></div>
        <form style={{ display: 'grid', gap: 12 }} onSubmit={submit}>
          <div className="row">
            <label style={{ flex: 1, minWidth: 140 }}><span className="label">Date</span><input className="input" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></label>
            <label style={{ flex: 1, minWidth: 140 }}><span className="label">Type</span>
              <select className="select" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
            </label>
            <label style={{ flex: 2, minWidth: 180 }}><span className="label">Where / with whom</span><input className="input" value={f.platform} onChange={(e) => setF({ ...f, platform: e.target.value })} placeholder="interviewing.io, a friend, Company X" /></label>
            <div><span className="label">How it went</span><Stars value={f.rating} onChange={(n) => setF({ ...f, rating: n })} label="Self-rating" /></div>
          </div>
          <div className="row">
            <label style={{ flex: 1, minWidth: 240 }}><span className="label">What went well</span><textarea className="textarea" value={f.went} onChange={(e) => setF({ ...f, went: e.target.value })} /></label>
            <label style={{ flex: 1, minWidth: 240 }}><span className="label">What to improve</span><textarea className="textarea" value={f.improve} onChange={(e) => setF({ ...f, improve: e.target.value })} /></label>
          </div>
          <div className="row end"><button className="btn primary" type="submit"><Plus size={16} /> Log session</button></div>
        </form>
      </section>

      <section className="panel flush">
        {state.mocks.length === 0 ? <div className="empty">No sessions yet. Book your first one for week 6 and log it here.</div> : state.mocks.map((m) => (
          <div key={m.id} style={{ padding: '14px 18px', borderTop: '1px solid var(--line)' }}>
            <div className="row">
              <strong style={{ flex: 1 }}>{m.type}{m.platform ? ` · ${m.platform}` : ''}</strong>
              <span className="small muted">{prettyDate(m.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span className="stars" aria-label={`Rated ${m.rating} of 5`}>{[1, 2, 3, 4, 5].map((n) => <span key={n} style={{ color: n <= m.rating ? 'var(--warn)' : 'var(--dim)' }}>★</span>)}</span>
              <button className="btn icon ghost" aria-label="Delete session" onClick={() => act((s) => { s.mocks = s.mocks.filter((x) => x.id !== m.id) }, { xp: m.type === 'Real interview' ? -120 : -60 })}><Trash2 size={14} /></button>
            </div>
            {m.went && <p className="small" style={{ marginTop: 6 }}><span className="muted">Went well:</span> {m.went}</p>}
            {m.improve && <p className="small" style={{ marginTop: 4 }}><span className="muted">Improve:</span> {m.improve}</p>}
          </div>
        ))}
      </section>
    </div>
  )
}
