import { useState } from 'react'
import { ExternalLink, Play, Plus, Trash2 } from 'lucide-react'
import { QUOTES, RESOURCES, SD_PROBLEMS, AI_SECTIONS, TRACKS, tasksForDay } from '../data/content.js'
import { CURRICULUM } from '../data/curriculum.js'
import { PATTERNS, lcUrl } from '../data/problems.js'
import { addDays, celebrate, dayKey, dueReviews, planPosition, problemActions, streakInfo, useStore } from '../store.jsx'
import { Check, DiffChip, DiveLog } from '../components/ui.jsx'
import { useFocus } from '../components/Focus.jsx'

export default function Today({ go }) {
  const { state, act } = useStore()
  const focus = useFocus()
  const today = dayKey()
  const pos = planPosition(state.profile)
  const week = pos.plan.weeks[pos.week - 1]
  const tasks = tasksForDay(new Date(), pos.plan.tracks)
  const day = state.days[today] || { tasks: {}, custom: [] }
  const doneCount = tasks.filter((t) => day.tasks[t.id]).length
  const streak = streakInfo(state)
  const quote = QUOTES[(pos.day - 1) % QUOTES.length]
  const [newTask, setNewTask] = useState('')

  const toggleTask = (t) => {
    const was = !!day.tasks[t.id]
    const willAllDone = !was && tasks.every((x) => x.id === t.id || day.tasks[x.id])
    const bonus = willAllDone && !day.bonus ? 50 : 0
    act((s) => {
      const d = (s.days[today] ||= { tasks: {}, custom: [] })
      d.tasks[t.id] = !was
      if (willAllDone) { d.perfect = true; d.bonus = true }
      if (was) d.perfect = false
    }, { xp: (was ? -t.xp : t.xp) + bonus, reason: was ? 'Task unchecked' : bonus ? `${t.label} + clean sweep bonus` : t.label })
    if (!was) celebrate(willAllDone)
  }

  const addCustom = (e) => {
    e.preventDefault()
    const text = newTask.trim()
    if (!text) return
    act((s) => {
      const d = (s.days[today] ||= { tasks: {}, custom: [] })
      d.custom.push({ id: Date.now().toString(36), text, done: false })
    })
    setNewTask('')
  }

  const toggleCustom = (c) => {
    act((s) => {
      const item = s.days[today].custom.find((x) => x.id === c.id)
      item.done = !item.done
    }, { xp: c.done ? -10 : 10, reason: c.done ? '' : c.text })
    if (!c.done) celebrate()
  }

  const repair = () => {
    act((s) => { s.freezes -= 1; s.frozen.push(addDays(today, -1)) })
  }

  return (
    <div className="page">
      <section className="hero">
        <div>
          <div className="hero-day">{pos.finished ? 'Done' : `Day ${pos.day}`}<small>of {pos.totalDays}</small></div>
          <p className="hero-sub">
            Week {pos.week} of {pos.plan.totalWeeks}, {pos.phaseName.toLowerCase()} phase. {pos.daysLeft} days left.
            {state.profile.name ? ` Keep going, ${state.profile.name}.` : ''}
          </p>
          <p className="hero-quote">{quote}</p>
        </div>
        <div className="hero-streak">
          <div className="big">{streak.current}<span aria-hidden="true">{streak.doneToday ? ' 🔥' : ''}</span></div>
          <div className="muted">day streak{streak.doneToday ? '' : streak.current ? ' · do one task to keep it' : ' · check off a task to start one'}</div>
        </div>
      </section>

      {!state.profile.planSet && (
        <div className="banner">
          <span style={{ fontSize: 22 }} aria-hidden="true">🗺️</span>
          <span style={{ flex: 1 }}>Choose how many days you want to prepare and which areas to include. Your weekly modules and daily tasks follow that plan.</span>
          <button className="btn primary" onClick={() => go('roadmap')}>Set up my plan</button>
        </div>
      )}

      {streak.canRepair && (
        <div className="banner">
          <span style={{ fontSize: 22 }} aria-hidden="true">🧊</span>
          <span style={{ flex: 1 }}>You missed yesterday. Use a streak freeze to protect your run?</span>
          <button className="btn primary" onClick={repair}>Use a freeze</button>
        </div>
      )}

      <div className="grid-2">
        <div className="stack">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Today’s dive</h2>
                <p className="muted small">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
              <span className="chip xp">{doneCount}/{tasks.length} done</span>
            </div>
            <div className="day-bar" aria-hidden="true"><span style={{ width: `${(doneCount / tasks.length) * 100}%` }} /></div>

            {tasks.map((t) => (
              <div key={t.id} className={`task ${day.tasks[t.id] ? 'done' : ''}`} onClick={() => toggleTask(t)}
                role="checkbox" aria-checked={!!day.tasks[t.id]} tabIndex={0}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleTask(t) } }}>
                <Check on={day.tasks[t.id]} />
                <div className="task-body">
                  <div className="task-label">{t.id === 'dsa' ? `Solve ${state.profile.dailyProblems} DSA problems` : t.label}</div>
                  <div className="muted small">{t.detail}</div>
                  <div className="task-meta">
                    <span className="chip xp">+{t.xp} m</span>
                    <span className="chip track" style={{ color: TRACKS[t.track].color }}>{TRACKS[t.track].name}</span>
                    <span className="chip">{t.mins} min</span>
                    {!day.tasks[t.id] && t.mins >= 25 && (
                      <button className="btn sm ghost" onClick={(e) => { e.stopPropagation(); focus.start(Math.min(t.mins, 60), t.label) }}>
                        <Play size={13} /> Focus {Math.min(t.mins, 60)} min
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {day.custom.map((c) => (
              <div key={c.id} className={`task ${c.done ? 'done' : ''}`} onClick={() => toggleCustom(c)} role="checkbox" aria-checked={c.done} tabIndex={0}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleCustom(c) } }}>
                <Check on={c.done} />
                <div className="task-body"><div className="task-label">{c.text}</div><div className="task-meta"><span className="chip xp">+10 m</span></div></div>
                <button className="btn icon ghost" aria-label="Delete task" onClick={(e) => {
                  e.stopPropagation()
                  act((s) => { s.days[today].custom = s.days[today].custom.filter((x) => x.id !== c.id) }, { xp: c.done ? -10 : 0 })
                }}><Trash2 size={15} /></button>
              </div>
            ))}

            <form className="row" style={{ marginTop: 12 }} onSubmit={addCustom}>
              <input className="input" style={{ flex: 1 }} placeholder="Add your own task for today" value={newTask} onChange={(e) => setNewTask(e.target.value)} aria-label="New task" />
              <button className="btn" type="submit"><Plus size={16} /> Add</button>
            </form>
          </section>

          <NextUp pos={pos} go={go} />
          <ReviewQueue />
        </div>

        <div className="stack">
          <section className="panel">
            <div className="panel-head"><h2>Dive log</h2><span className="muted small">{pos.totalDays} days</span></div>
            <DiveLog />
          </section>

          <section className="panel">
            <div className="panel-head">
              <h2>Week {week.n} focus{week.review ? ' · review' : ''}</h2>
              <button className="btn sm ghost" onClick={() => go('roadmap')}>Roadmap</button>
            </div>
            {pos.plan.tracks.map((k) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '108px 1fr', gap: 10, padding: '7px 0', borderTop: '1px solid var(--line)' }}>
                <span className="small" style={{ color: TRACKS[k].color, fontWeight: 600 }}>{TRACKS[k].name}</span>
                <span className="small">
                  {(week.items[k] || []).map((x) => x.module.title + (x.parts > 1 ? ` (${x.part}/${x.parts})` : '')).join(' + ')}
                  {(week.items[k] || [])[0]?.module.practice && <span className="muted" style={{ display: 'block' }}>{week.items[k][0].module.practice}</span>}
                </span>
              </div>
            ))}
          </section>

          <section className="panel">
            <div className="panel-head"><h2>One-line reflection</h2></div>
            <textarea className="textarea" placeholder="What clicked today? What was hard?" defaultValue={day.note || ''} key={today}
              onBlur={(e) => act((s) => { (s.days[today] ||= { tasks: {}, custom: [] }).note = e.target.value })} aria-label="Today’s reflection" />
          </section>
        </div>
      </div>
    </div>
  )
}

function NextUp({ pos, go }) {
  const { week, plan } = pos
  const { state, act } = useStore()
  const pa = problemActions(act)
  const isDone = (slug) => state.problems[slug]?.status && state.problems[slug].status !== 'todo'

  const wk = (id) => plan.firstWeek[id] || 999
  const has = (t) => plan.tracks.includes(t)
  // DSA: this week's patterns first, then any earlier unfinished pattern, then anything left
  const ordered = [
    ...PATTERNS.filter((p) => wk(p.id) === week),
    ...PATTERNS.filter((p) => wk(p.id) < week),
    ...PATTERNS.filter((p) => wk(p.id) > week),
  ]
  const next = []
  for (const p of ordered) {
    for (const [slug, title, diff] of p.problems) {
      if (!isDone(slug) && next.length < state.profile.dailyProblems) next.push({ slug, title, diff, pattern: p.name, url: lcUrl(slug) })
    }
    if (next.length >= state.profile.dailyProblems) break
  }

  const sd = has('sd') && (SD_PROBLEMS.find((p) => wk(p.id) <= week && !(state.sdProblems[p.id]?.count > 0)) || SD_PROBLEMS.find((p) => !(state.sdProblems[p.id]?.count > 0)))
  const aiTopic = has('ai') && AI_SECTIONS.flatMap((s) => s.topics.map(([id, name]) => ({ id, name, section: s.name }))).find((t) => !state.aiTopics[t.id])
  const opsTopic = has('ops') && CURRICULUM.ops.filter((m) => wk(m.id) <= week).flatMap((m) => m.topics.map(([id, name]) => ({ id, name, section: m.title }))).find((t) => !state.opsTopics?.[t.id])
  const mine = (r) => r.must && has(r.track)
  const reading = RESOURCES.find((r) => mine(r) && state.resources[r.id]?.current > 0 && !state.resources[r.id]?.done)
    || RESOURCES.find((r) => mine(r) && !state.resources[r.id]?.current)

  return (
    <section className="panel">
      <div className="panel-head"><h2>Next up</h2><span className="muted small">Picked from where you are</span></div>

      {has('dsa') && <h3 className="small" style={{ color: 'var(--c-dsa)', marginBottom: 6 }}>Today’s problems</h3>}
      {has('dsa') && next.length === 0 && <p className="muted small">Every listed problem is solved. Add your own on the DSA page or clear your review queue.</p>}
      {has('dsa') && next.map((p) => (
        <div key={p.slug} className="row" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <a href={p.url} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>{p.title} <ExternalLink size={12} /></a>
            <div className="small dim">{p.pattern}</div>
          </div>
          <DiffChip diff={p.diff} />
          <button className="btn sm primary" onClick={() => { pa.solve(p, false); celebrate() }}>Solved</button>
          <button className="btn sm" onClick={() => pa.solve(p, true)}>Needed help</button>
        </div>
      ))}

      <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
        {sd && (
          <button className="task" style={{ textAlign: 'left', width: '100%' }} onClick={() => go('system-design')}>
            <div className="task-body"><span className="small" style={{ color: 'var(--c-sd)', fontWeight: 600 }}>System design</span><div className="task-label">Design: {sd.name}</div></div>
          </button>
        )}
        {aiTopic && (
          <button className="task" style={{ textAlign: 'left', width: '100%' }} onClick={() => go('ai-ml')}>
            <div className="task-body"><span className="small" style={{ color: 'var(--c-ai)', fontWeight: 600 }}>AI/ML · {aiTopic.section}</span><div className="task-label">{aiTopic.name}</div></div>
          </button>
        )}
        {opsTopic && (
          <button className="task" style={{ textAlign: 'left', width: '100%' }} onClick={() => go('devops')}>
            <div className="task-body"><span className="small" style={{ color: 'var(--c-ops)', fontWeight: 600 }}>DevOps · {opsTopic.section}</span><div className="task-label">{opsTopic.name}</div></div>
          </button>
        )}
        {reading && (
          <button className="task" style={{ textAlign: 'left', width: '100%' }} onClick={() => go('library')}>
            <div className="task-body">
              <span className="small" style={{ color: 'var(--glow)', fontWeight: 600 }}>{state.resources[reading.id]?.current ? 'Continue' : 'Start'} reading</span>
              <div className="task-label">{reading.title}</div>
              {state.resources[reading.id]?.note && <div className="small muted">Left off: {state.resources[reading.id].note}</div>}
            </div>
          </button>
        )}
      </div>
    </section>
  )
}

function ReviewQueue() {
  const { state, act } = useStore()
  const pa = problemActions(act)
  const due = dueReviews(state)
  if (due.length === 0) return null
  return (
    <section className="panel">
      <div className="panel-head">
        <div><h2>Review queue</h2><p className="muted small">Re-solve from scratch without looking at your old code.</p></div>
        <span className="chip must">{due.length} due</span>
      </div>
      {due.slice(0, 6).map((p) => (
        <div key={p.slug} className="row" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}>
          <a href={p.url} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 180, fontWeight: 600 }}>{p.title}</a>
          <DiffChip diff={p.diff} />
          <button className="btn sm primary" onClick={() => { pa.review(p, true); celebrate() }}>Got it</button>
          <button className="btn sm" onClick={() => pa.review(p, false)}>Struggled</button>
        </div>
      ))}
      {due.length > 6 && <p className="small muted" style={{ marginTop: 8 }}>+{due.length - 6} more on the DSA page.</p>}
    </section>
  )
}
