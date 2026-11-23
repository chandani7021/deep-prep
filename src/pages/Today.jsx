import { useState } from 'react'
import { ChevronDown, ExternalLink, ListChecks, Play, Plus, Trash2 } from 'lucide-react'
import { QUOTES, RESOURCES, SD_PROBLEMS, AI_SECTIONS, TRACKS, tasksForDay } from '../data/content.js'
import { CURRICULUM, planLoad } from '../data/curriculum.js'
import { PATTERNS, lcUrl } from '../data/problems.js'
import { addDays, celebrate, dayKey, dueReviews, planPosition, problemActions, streakInfo, useStore } from '../store.jsx'
import { Check, DiffChip, DiveLog } from '../components/ui.jsx'
import { linkFor } from '../components/EditableLink.jsx'
import { useFocus } from '../components/Focus.jsx'
import TaskDetail, { todaysProblems } from '../components/TaskDetail.jsx'

export default function Today({ go }) {
  const { state, act } = useStore()
  const focus = useFocus()
  const today = dayKey()
  const pos = planPosition(state.profile)
  const week = pos.plan.weeks[pos.week - 1]
  const tasks = tasksForDay(new Date(), pos.plan.tracks, state.profile.weeklyHours || 22)
  const load = planLoad(state.profile)
  const day = state.days[today] || { tasks: {}, custom: [] }
  const doneCount = tasks.filter((t) => day.tasks[t.id]).length
  const streak = streakInfo(state)
  const quote = QUOTES[(pos.day - 1) % QUOTES.length]
  const [newTask, setNewTask] = useState('')
  // Open the first unfinished task by default so today's "what to do" is visible straight away.
  const [openIds, setOpenIds] = useState(() => new Set([tasks.find((t) => !day.tasks[t.id])?.id].filter(Boolean)))
  const toggleOpen = (id) => setOpenIds((o) => { const n = new Set(o); n.has(id) ? n.delete(id) : n.add(id); return n })
  const totalMins = tasks.reduce((a, t) => a + t.mins, 0)
  const fmt = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`)
  const jumpToTasks = () => document.getElementById('todays-dive')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

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
          <button className="btn primary today-jump" onClick={jumpToTasks}>
            <ListChecks size={16} /> Today: {tasks.length} tasks · about {fmt(totalMins)} · {doneCount} done
          </button>
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

      {state.profile.planSet && load.status === 'overloaded' && (
        <div className="banner">
          <span style={{ fontSize: 22 }} aria-hidden="true">⚖️</span>
          <span style={{ flex: 1 }}>Your plan has more content than time: it needs about {load.neededDays} days at {load.weekly} h/week, but it is {load.days} days long.</span>
          <button className="btn" onClick={() => go('roadmap')}>Adjust plan</button>
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
          <section className="panel" id="todays-dive">
            <div className="panel-head">
              <div>
                <h2>Today’s dive</h2>
                <p className="muted small">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
              <span className="chip xp">{doneCount}/{tasks.length} done</span>
            </div>
            <div className="day-bar" aria-hidden="true"><span style={{ width: `${(doneCount / tasks.length) * 100}%` }} /></div>

            <p className="small muted" style={{ marginBottom: 10 }}>Tap a task to see exactly what to do. Tick the circle when it’s done.</p>
            {tasks.map((t) => {
              const done = !!day.tasks[t.id]
              const isOpen = openIds.has(t.id)
              return (
                <div key={t.id} className={`task ${done ? 'done' : ''} ${isOpen ? 'open' : ''}`}>
                  <button type="button" className="task-check" onClick={() => toggleTask(t)} aria-pressed={done}
                    aria-label={`${done ? 'Mark not done' : 'Mark done'}: ${t.label}`}>
                    <Check on={done} />
                  </button>
                  <div className="task-body">
                    <button type="button" className="task-summary" onClick={() => toggleOpen(t.id)} aria-expanded={isOpen} aria-controls={`task-${t.id}`}>
                      <span className="task-label">{t.id === 'dsa' ? `Solve ${state.profile.dailyProblems} DSA problems` : t.label}</span>
                      <ChevronDown size={18} className="task-chevron" aria-hidden="true" />
                    </button>
                    <div className="muted small">{t.detail}</div>
                    <div className="task-meta">
                      <span className="chip xp">+{t.xp} m</span>
                      <span className="chip track" style={{ color: TRACKS[t.track].color }}>{TRACKS[t.track].name}</span>
                      <span className="chip">{t.mins} min</span>
                      {!done && t.mins >= 25 && (
                        <button className="btn sm ghost" onClick={() => focus.start(Math.min(t.mins, 60), t.label)}>
                          <Play size={13} /> Focus {Math.min(t.mins, 60)} min
                        </button>
                      )}
                    </div>
                    {isOpen && (
                      <div className="task-detail" id={`task-${t.id}`}>
                        <TaskDetail task={t} pos={pos} go={go} />
                        <div className="row" style={{ marginTop: 4 }}>
                          <button className={`btn sm ${done ? '' : 'primary'}`} onClick={() => toggleTask(t)}>{done ? 'Mark not done' : 'Mark task done'}</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {day.custom.map((c) => (
              <div key={c.id} className={`task ${c.done ? 'done' : ''}`}>
                <button type="button" className="task-check" onClick={() => toggleCustom(c)} aria-pressed={c.done} aria-label={`${c.done ? 'Mark not done' : 'Mark done'}: ${c.text}`}>
                  <Check on={c.done} />
                </button>
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
  const next = todaysProblems(state, plan, week).filter((p) => !p.done).map((p) => ({ ...p, pattern: p.pattern.name }))

  const sd = has('sd') && (SD_PROBLEMS.find((p) => wk(p.id) <= week && !(state.sdProblems[p.id]?.count > 0)) || SD_PROBLEMS.find((p) => !(state.sdProblems[p.id]?.count > 0)))
  const aiTopic = has('ai') && AI_SECTIONS.flatMap((s) => s.topics.map(([id, name]) => ({ id, name, section: s.name }))).find((t) => !state.aiTopics[t.id])
  // Next unchecked topic in each checklist-style area, from modules already scheduled.
  const STORE = { ops: 'opsTopics', product: 'productTopics' }
  const PAGE = { ops: 'devops', product: 'product', lang: 'language', lld: 'lld', sql: 'sql', fe: 'frontend', mobile: 'mobile', career: 'career' }
  const nextTopics = Object.keys(PAGE).filter(has).map((t) => {
    const store = state[STORE[t] || 'areaTopics'] || {}
    const topic = CURRICULUM[t].filter((m) => wk(m.id) <= week).flatMap((m) => m.topics.map(([id, name]) => ({ id, name, section: m.title }))).find((x) => !store[x.id])
    return topic && { ...topic, track: t, page: PAGE[t] }
  }).filter(Boolean).slice(0, 4)
  const mine = (r) => r.must && (has(r.track) || r.track === 'craft')
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
            <a href={linkFor(state, p.url, p.url)} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>{p.title} <ExternalLink size={12} /></a>
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
        {nextTopics.map((t) => (
          <button key={t.track} className="task" style={{ textAlign: 'left', width: '100%' }} onClick={() => go(t.page)}>
            <div className="task-body"><span className="small" style={{ color: TRACKS[t.track].color, fontWeight: 600 }}>{TRACKS[t.track].name} · {t.section}</span><div className="task-label">{t.name}</div></div>
          </button>
        ))}
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
          <a href={linkFor(state, p.url, p.url)} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 180, fontWeight: 600 }}>{p.title}</a>
          <DiffChip diff={p.diff} />
          <button className="btn sm primary" onClick={() => { pa.review(p, true); celebrate() }}>Got it</button>
          <button className="btn sm" onClick={() => pa.review(p, false)}>Struggled</button>
        </div>
      ))}
      {due.length > 6 && <p className="small muted" style={{ marginTop: 8 }}>+{due.length - 6} more on the DSA page.</p>}
    </section>
  )
}
