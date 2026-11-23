import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, NotebookPen, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { PATTERNS } from '../data/problems.js'
import { allProblems, celebrate, dayKey, dueReviews, planPosition, prettyDate, problemActions, useStore } from '../store.jsx'
import { DiffChip, Progress, Ring } from '../components/ui.jsx'
import EditableLink from '../components/EditableLink.jsx'
import ModuleList from '../components/Modules.jsx'

export default function DSA() {
  const { state, act } = useStore()
  const mode = state.profile.dsaMode || 'patterns'
  const setMode = (m) => act((s) => { s.profile.dsaMode = m })
  const problems = allProblems(state)
  const st = (slug) => state.problems[slug]?.status || 'todo'
  const solved = problems.filter((p) => st(p.slug) !== 'todo')
  const byDiff = (d) => [solved.filter((p) => p.diff === d).length, problems.filter((p) => p.diff === d).length]
  const mastered = problems.filter((p) => st(p.slug) === 'mastered').length
  const due = dueReviews(state)

  return (
    <div className="page">
      <div className="row">
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1>Data structures & algorithms</h1>
          <p className="muted" style={{ maxWidth: '68ch' }}>
            Learn the pattern, then the problems. Mark “Needed help” honestly: those come back for review in 3 days, then 6, 12 and 24 until mastered.
            Prefer NeetCode videos? Open the <a href="https://neetcode.io/roadmap" target="_blank" rel="noreferrer">NeetCode roadmap</a>; problems tagged NC here are on its list.
          </p>
        </div>
        <div className="seg" role="group" aria-label="View">
          {[['patterns', 'By pattern'], ['all', 'All problems'], ['review', `Review (${due.length})`]].map(([id, name]) => (
            <button key={id} aria-pressed={mode === id} onClick={() => setMode(id)}>{name}</button>
          ))}
        </div>
      </div>

      <div className="grid-4">
        <div className="stat row"><Ring value={solved.length / problems.length} label={solved.length} /><div><div className="small muted">Solved</div><div>of {problems.length}</div></div></div>
        {['Easy', 'Medium', 'Hard'].map((d) => {
          const [a, b] = byDiff(d)
          return <div key={d} className="stat"><div className="n">{a}<span className="dim" style={{ fontSize: 18 }}>/{b}</span></div><DiffChip diff={d} /></div>
        })}
      </div>
      <p className="small muted" style={{ marginTop: -10 }}>{mastered} mastered · {due.length} due for review</p>

      {mode === 'patterns' && <ModuleList track="dsa" />}
      {mode === 'patterns' && <PatternView />}
      {mode === 'all' && <FlatView />}
      {mode === 'review' && (
        <section className="panel flush">
          {due.length === 0 ? <div className="empty">Nothing due. Solve something new, or come back tomorrow.</div>
            : due.map((p) => <ProblemRow key={p.slug} p={p} review />)}
        </section>
      )}
      <AddProblem />
    </div>
  )
}

function PatternView() {
  const { state } = useStore()
  const { week, plan } = planPosition(state.profile)
  const pw = (id) => plan.firstWeek[id]
  const current = PATTERNS.filter((p) => pw(p.id) === week).map((p) => p.id)
  const [open, setOpen] = useState(() => new Set(current.length ? current : [PATTERNS[0].id]))
  const toggle = (id) => setOpen((o) => { const n = new Set(o); n.has(id) ? n.delete(id) : n.add(id); return n })
  const custom = state.customProblems

  return (
    <div>
      {PATTERNS.map((p, i) => {
        const list = [
          ...p.problems.map(([slug, title, diff, nc]) => ({ slug, title, diff, nc, url: `https://leetcode.com/problems/${slug}/` })),
          ...custom.filter((c) => c.pattern === p.id).map((c) => ({ ...c, custom: true })),
        ]
        const done = list.filter((x) => state.problems[x.slug]?.status && state.problems[x.slug].status !== 'todo').length
        const isOpen = open.has(p.id)
        return (
          <section key={p.id} className={`pattern ${current.includes(p.id) ? 'current' : ''}`}>
            <button className="pattern-head" onClick={() => toggle(p.id)} aria-expanded={isOpen}>
              {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <div>
                <h3>{p.name} {done === list.length && <span aria-label="complete">✅</span>}</h3>
                <div className="small dim">Pattern {i + 1} · {pw(p.id) ? `planned for week ${pw(p.id)}` : 'not in your plan'}{current.includes(p.id) ? ' · this week' : ''}</div>
              </div>
              <Progress value={done / list.length} />
              <span className="chip">{done}/{list.length}</span>
            </button>
            {isOpen && (
              <>
                <div className="pattern-info">
                  <div><strong>When to reach for it</strong>{p.when}</div>
                  <div><strong>Core idea</strong>{p.key}</div>
                </div>
                <div style={{ borderTop: '1px solid var(--line)' }}>
                  {list.map((x) => <ProblemRow key={x.slug} p={x} />)}
                </div>
              </>
            )}
          </section>
        )
      })}
    </div>
  )
}

function FlatView() {
  const { state } = useStore()
  const [q, setQ] = useState('')
  const [diff, setDiff] = useState('All')
  const [status, setStatus] = useState('All')
  const items = useMemo(() => allProblems(state).filter((p) => {
    const s = state.problems[p.slug]?.status || 'todo'
    return (diff === 'All' || p.diff === diff)
      && (status === 'All' || (status === 'To do' ? s === 'todo' : status === 'Solved' ? s !== 'todo' : s === 'review'))
      && p.title.toLowerCase().includes(q.toLowerCase())
  }), [state, q, diff, status])
  const patternName = Object.fromEntries(PATTERNS.map((p) => [p.id, p.name]))

  return (
    <section className="panel flush">
      <div className="row" style={{ padding: 14, borderBottom: '1px solid var(--line)' }}>
        <input className="input" style={{ flex: 1, minWidth: 180 }} placeholder="Search problems" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search problems" />
        <select className="select" style={{ width: 'auto' }} value={diff} onChange={(e) => setDiff(e.target.value)} aria-label="Difficulty">
          {['All', 'Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
        </select>
        <select className="select" style={{ width: 'auto' }} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          {['All', 'To do', 'Solved', 'Needs review'].map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>
      {items.length === 0 ? <div className="empty">No problems match these filters.</div>
        : items.map((p) => <ProblemRow key={p.slug} p={p} sub={patternName[p.pattern]} />)}
    </section>
  )
}

function ProblemRow({ p, sub, review }) {
  const { state, act } = useStore()
  const pa = problemActions(act)
  const s = state.problems[p.slug] || { status: 'todo' }
  const [notesOpen, setNotesOpen] = useState(false)

  return (
    <div style={{ borderTop: '1px solid var(--line)' }}>
      <div className={`list-row ${s.status !== 'todo' ? 'solved' : ''}`} style={{ borderTop: 0, flexWrap: 'wrap' }}>
        <span className={`status-dot ${s.status}`} title={s.status} />
        <div className="title">
          <EditableLink href={p.url}>{p.title}</EditableLink>
          {(sub || s.solved) && <div className="small dim">{sub}{sub && s.solved ? ' · ' : ''}{s.solved ? `solved ${prettyDate(s.solved)}` : ''}</div>}
        </div>
        {p.nc && <span className="chip" title="On the NeetCode 150 list">NC</span>}
        {p.custom && <span className="chip">Custom</span>}
        <DiffChip diff={p.diff} />
        {review || (s.status !== 'todo' && s.status !== 'mastered' && s.due && s.due <= dayKey()) ? (
          <>
            <button className="btn sm primary" onClick={() => { pa.review(p, true); celebrate() }}>Got it</button>
            <button className="btn sm" onClick={() => pa.review(p, false)}>Struggled</button>
          </>
        ) : s.status === 'todo' ? (
          <>
            <button className="btn sm primary" onClick={() => { pa.solve(p, false); celebrate() }}>Solved</button>
            <button className="btn sm" onClick={() => pa.solve(p, true)}>Needed help</button>
          </>
        ) : s.status === 'mastered' ? (
          <span className="chip easy">Mastered</span>
        ) : (
          <span className="chip">{s.status === 'review' ? 'Review' : 'Recheck'} {s.due ? prettyDate(s.due) : ''}</span>
        )}
        <button className="btn icon ghost" onClick={() => setNotesOpen((o) => !o)} aria-label="Notes" aria-expanded={notesOpen} title={s.notes ? 'Has notes' : 'Add notes'}>
          <NotebookPen size={15} color={s.notes ? 'var(--glow)' : undefined} />
        </button>
        {s.status !== 'todo' && <button className="btn icon ghost" onClick={() => pa.reset(p)} aria-label="Mark as not solved" title="Mark as not solved"><RotateCcw size={14} /></button>}
        {p.custom && <button className="btn icon ghost" aria-label="Delete custom problem" onClick={() => act((st) => { st.customProblems = st.customProblems.filter((c) => c.slug !== p.slug); delete st.problems[p.slug] })}><Trash2 size={14} /></button>}
      </div>
      {notesOpen && (
        <div style={{ padding: '0 16px 12px 38px' }}>
          <textarea className="textarea" placeholder="Approach, key insight, complexity, mistakes to avoid" defaultValue={s.notes || ''}
            onBlur={(e) => pa.note(p, e.target.value)} aria-label={`Notes for ${p.title}`} />
        </div>
      )}
    </div>
  )
}

function AddProblem() {
  const { act, toast } = useStore()
  const [f, setF] = useState({ title: '', url: '', diff: 'Medium', pattern: PATTERNS[0].id })
  const submit = (e) => {
    e.preventDefault()
    if (!f.title.trim()) return
    const slug = `custom-${Date.now().toString(36)}`
    act((s) => { s.customProblems.push({ slug, title: f.title.trim(), url: f.url.trim() || '#', diff: f.diff, pattern: f.pattern }) })
    toast('Problem added')
    setF({ ...f, title: '', url: '' })
  }
  return (
    <section className="panel">
      <div className="panel-head"><div><h3>Add your own problem</h3><p className="muted small">From any list, company tag, or contest. It joins the pattern and the review cycle.</p></div></div>
      <form className="row" onSubmit={submit}>
        <input className="input" style={{ flex: 2, minWidth: 180 }} placeholder="Problem name" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} aria-label="Problem name" />
        <input className="input" style={{ flex: 2, minWidth: 180 }} placeholder="Link (optional)" value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} aria-label="Problem link" />
        <select className="select" style={{ width: 'auto' }} value={f.diff} onChange={(e) => setF({ ...f, diff: e.target.value })} aria-label="Difficulty">
          {['Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
        </select>
        <select className="select" style={{ width: 'auto' }} value={f.pattern} onChange={(e) => setF({ ...f, pattern: e.target.value })} aria-label="Pattern">
          {PATTERNS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button className="btn primary" type="submit"><Plus size={16} /> Add problem</button>
      </form>
    </section>
  )
}
