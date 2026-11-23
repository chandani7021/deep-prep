import { OPS_MILESTONES, PROJECT_MILESTONES, RESOURCES, SD_PROBLEMS, TRACKS } from '../data/content.js'
import { CURRICULUM } from '../data/curriculum.js'
import { LANGUAGES } from '../data/areas-extra.js'
import { PATTERNS, lcUrl } from '../data/problems.js'
import { celebrate, dayKey, dueReviews, problemActions, useStore } from '../store.jsx'
import { DiffChip } from './ui.jsx'
import EditableLink from './EditableLink.jsx'

// Which page each area lives on, and where its checkable topics are stored.
export const PAGE_FOR = { dsa: 'dsa', sd: 'system-design', ai: 'ai-ml', ops: 'devops', product: 'product', fund: 'fundamentals', lang: 'language', lld: 'lld', sql: 'sql', fe: 'frontend', mobile: 'mobile', career: 'career' }
const TOPIC_STORE = { ops: 'opsTopics', product: 'productTopics', lang: 'areaTopics', lld: 'areaTopics', sql: 'areaTopics', fe: 'areaTopics', mobile: 'areaTopics', career: 'areaTopics' }

const SD_STEPS = [
  'Clarify users and requirements (5 min): who uses it, core features, scale, one success metric.',
  'Estimate (5 min): users, QPS, storage. Only numbers that change the design.',
  'API (5 min): the main endpoints with inputs and outputs.',
  'Data model (5 min): entities, access patterns, which database and why.',
  'High-level design (10 min): boxes and arrows for the main flow.',
  'Deep dives (10 min): the bottleneck, scaling, failure modes.',
  'Trade-offs (5 min): what you gave up and what you would revisit.',
]

/**
 * Today's DSA problems: the first N unsolved problems in plan order, plus any you already solved today,
 * so the list stays the same all day instead of moving on as you solve.
 */
export function todaysProblems(state, plan, week) {
  const today = dayKey()
  const wk = (id) => plan.firstWeek[id] || 999
  const ordered = [...PATTERNS.filter((p) => wk(p.id) === week), ...PATTERNS.filter((p) => wk(p.id) < week), ...PATTERNS.filter((p) => wk(p.id) > week)]
  const n = state.profile.dailyProblems || 2
  const out = []
  for (const p of ordered) {
    for (const [slug, title, diff] of p.problems) {
      const s = state.problems[slug]
      const open = !s?.status || s.status === 'todo'
      const solvedToday = s?.solved === today
      if ((open || solvedToday) && out.length < n) out.push({ slug, title, diff, pattern: p, url: lcUrl(slug), done: !open })
    }
    if (out.length >= n) break
  }
  return out
}

function Steps({ items }) {
  return <ol className="steps">{items.map((s) => <li key={s}>{s}</li>)}</ol>
}

function ProblemList({ list }) {
  const { act } = useStore()
  const pa = problemActions(act)
  return (
    <div className="detail-list">
      {list.map((p) => (
        <div key={p.slug} className="row detail-row">
          <div style={{ flex: 1, minWidth: 180 }}>
            <EditableLink href={p.url} style={{ fontWeight: 600 }}>{p.title}</EditableLink>
            <div className="small dim">{p.pattern.name}</div>
          </div>
          <DiffChip diff={p.diff} />
          {p.done
            ? <span className="chip easy">Done today</span>
            : <>
                <button className="btn sm primary" onClick={() => { pa.solve(p, false); celebrate() }}>Solved</button>
                <button className="btn sm" onClick={() => pa.solve(p, true)}>Needed help</button>
              </>}
        </div>
      ))}
    </div>
  )
}

function ModuleDetail({ track, items }) {
  const { state } = useStore()
  const store = state[TOPIC_STORE[track]] || {}
  if (!items.length) return <p className="small muted">No module is scheduled for this area this week. Use the time on whatever is behind.</p>
  return items.map(({ module: m, part, parts }) => {
    const tuple = Array.isArray(m.topics?.[0])
    const open = tuple ? m.topics.filter(([id]) => !store[id]) : m.topics
    const focus = tuple ? open.slice(0, 2) : []
    const lang = track === 'lang' ? (LANGUAGES[state.profile.language] || LANGUAGES.python) : null
    const links = m.links?.length ? m.links : lang ? lang.links : []
    return (
      <div key={m.id} className="detail-module">
        <div style={{ fontWeight: 700 }}>{m.title}{parts > 1 ? ` · part ${part} of ${parts}` : ''}</div>
        {m.outcome && <p className="small"><strong>Goal:</strong> {m.outcome}</p>}
        {focus.length > 0 && (
          <p className="small"><strong>Today, focus on:</strong> {focus.map(([, t]) => t).join('; ')}.</p>
        )}
        {m.topics?.length > 0 && (
          <details className="small">
            <summary>All topics in this module ({tuple ? `${m.topics.length - open.length}/${m.topics.length} done` : m.topics.length})</summary>
            <ul className="module-topics">{m.topics.map((t) => { const [id, text] = Array.isArray(t) ? t : [t, t]; return <li key={id} style={tuple && store[id] ? { textDecoration: 'line-through' } : undefined}>{text}</li> })}</ul>
          </details>
        )}
        {m.practice && <p className="small"><strong>Do:</strong> {m.practice}</p>}
        {links.length > 0 && (
          <div className="module-links">{links.map(([title, url]) => <EditableLink key={url} href={url} className="small" iconSize={11}>{title}</EditableLink>)}</div>
        )}
      </div>
    )
  })
}

/** The "what exactly do I do" panel for one of today's tasks. */
export default function TaskDetail({ task, pos, go }) {
  const { state, act } = useStore()
  const pa = problemActions(act)
  const { plan, week } = pos
  const items = (t) => plan.weeks[week - 1]?.items[t] || []
  const wk = (id) => plan.firstWeek[id] || 999
  const open = (t, label) => <button className="btn sm" onClick={() => go(PAGE_FOR[t] || t)}>{label || `Open ${TRACKS[t]?.name || t}`}</button>

  switch (task.id) {
    case 'dsa': {
      const list = todaysProblems(state, plan, week)
      const pats = [...new Map(list.map((p) => [p.pattern.id, p.pattern])).values()]
      return (
        <>
          {pats.map((p) => (
            <p key={p.id} className="small"><strong>{p.name}:</strong> use it when {p.when.charAt(0).toLowerCase() + p.when.slice(1)} <span className="muted">Key idea: {p.key}</span></p>
          ))}
          <ProblemList list={list} />
          <Steps items={[
            'Start a 25-minute focus timer for the first problem.',
            'Say the brute force out loud, then look for the pattern above.',
            'Stuck at 25 minutes? Watch the NeetCode solution, close it, and code it yourself.',
            'Mark “Solved” only if you did it alone; otherwise “Needed help” (it comes back for review in 3 days).',
          ]} />
          <div className="row">{open('dsa', 'All DSA patterns')}</div>
        </>
      )
    }
    case 'talk': {
      const recent = Object.entries(state.problems).filter(([, v]) => v.solved).sort((a, b) => (b[1].solved > a[1].solved ? 1 : -1))[0]
      const title = recent && PATTERNS.flatMap((p) => p.problems).find(([s]) => s === recent[0])?.[1]
      return (
        <>
          <p className="small">{title ? <>Explain <strong>{title}</strong> (your most recent solve).</> : 'Explain any problem you solved recently.'}</p>
          <Steps items={['Open Practice → “Explain a solution”: it times you, turns your speech into text and gives instant feedback.', 'Cover: the brute force, the pattern you used, why it works, an example, time and space complexity, edge cases.', 'Read the feedback, then explain it once more and compare.']} />
          <div className="row"><button className="btn sm primary" onClick={() => go('practice')}>Practise with feedback</button></div>
        </>
      )
    }
    case 'timed': {
      const earlier = PATTERNS.filter((p) => wk(p.id) <= week).flatMap((p) => p.problems.map(([slug, title, diff]) => ({ slug, title, diff, pattern: p, url: lcUrl(slug), done: false })))
      const pick = ['Easy', 'Medium', 'Medium'].map((d, i) => earlier.filter((p) => p.diff === d && !state.problems[p.slug]?.status)[i] || earlier.filter((p) => !state.problems[p.slug]?.status)[i]).filter(Boolean)
      return (
        <>
          <p className="small">Three unsolved problems from patterns you have covered. Or join the <a href="https://leetcode.com/contest/" target="_blank" rel="noreferrer">weekly LeetCode contest</a> instead.</p>
          <ProblemList list={[...new Map(pick.map((p) => [p.slug, p])).values()]} />
          <Steps items={['90 minutes total, no hints. Talk out loud as if in an interview.', 'Afterwards, read the best solution for any you missed and mark them “Needed help”.']} />
        </>
      )
    }
    case 'resolve': {
      const due = dueReviews(state)
      return due.length ? (
        <>
          <p className="small">{due.length} problem{due.length === 1 ? ' is' : 's are'} due for review. Re-solve from scratch without looking at your old code.</p>
          <div className="detail-list">
            {due.slice(0, 6).map((p) => (
              <div key={p.slug} className="row detail-row">
                <EditableLink href={p.url} style={{ flex: 1, fontWeight: 600 }}>{p.title}</EditableLink>
                <DiffChip diff={p.diff} />
                <button className="btn sm primary" onClick={() => { pa.review(p, true); celebrate() }}>Got it</button>
                <button className="btn sm" onClick={() => pa.review(p, false)}>Struggled</button>
              </div>
            ))}
          </div>
        </>
      ) : <p className="small">Nothing is due. Re-solve 2 problems you marked “Needed help” earlier, or the hardest one from this week.</p>
    }
    case 'design': {
      if (task.track === 'sd') {
        const next = SD_PROBLEMS.find((p) => wk(p.id) <= week && !(state.sdProblems[p.id]?.count > 0)) || SD_PROBLEMS.find((p) => !(state.sdProblems[p.id]?.count > 0)) || SD_PROBLEMS[0]
        return (
          <>
            <p className="small">Today’s design: <strong>{next.name}</strong> ({next.level}). Set a 45-minute timer and do it out loud, on paper or a whiteboard.</p>
            <Steps items={SD_STEPS} />
            <div className="row">{open('sd', 'Log the session on System design')}</div>
          </>
        )
      }
      return (
        <>
          <ModuleDetail track={task.track} items={items(task.track).length ? items(task.track) : CURRICULUM[task.track].slice(-1).map((m) => ({ module: m, part: 1, parts: 1 }))} />
          <Steps items={['Pick one design from the topics above and set a 45-minute timer.', 'Requirements → architecture → data and state → API → performance and edge cases.', 'Write down what you would do differently, then log it as a mock if you did it with someone.']} />
        </>
      )
    }
    case 'deep': {
      const t = task.track
      if (t === 'ai') {
        const m = PROJECT_MILESTONES.find((x) => !state.project[x.id])
        const o = plan.tracks.includes('ops') && OPS_MILESTONES.find((x) => !state.opsProject?.[x.id])
        return (
          <>
            {m && <p className="small"><strong>AI project, next milestone:</strong> {m.label}</p>}
            {o && <p className="small"><strong>Or DevOps lab, next milestone:</strong> {o.label}</p>}
            <Steps items={['Pick whichever is further behind.', 'Work in one focused 2-hour block; commit at least once.', 'Write 3 lines in your project notes: what you did, what broke, what is next.']} />
            <div className="row">{open('ai', 'AI project')}{o && open('ops', 'DevOps project')}</div>
          </>
        )
      }
      if (t === 'ops') {
        const o = OPS_MILESTONES.find((x) => !state.opsProject?.[x.id])
        return (<><p className="small"><strong>Next DevOps milestone:</strong> {o ? o.label : 'All done. Polish your pipeline write-up.'}</p><ModuleDetail track="ops" items={items('ops')} /><div className="row">{open('ops')}</div></>)
      }
      if (t === 'lld') {
        const probs = CURRICULUM.lld.find((m) => m.id === 'lld-3').topics
        const next = probs.find(([id]) => !state.areaTopics?.[id]) || probs[0]
        return (
          <>
            <p className="small">Build <strong>{next[1]}</strong> as working code in 90 minutes.</p>
            <Steps items={['10 min: requirements and scope; write them down.', '15 min: classes and interfaces (quick diagram).', '50 min: code it with in-memory storage, plus a small demo driver.', '10 min: two or three tests.', '5 min: add one follow-up feature to check your design extends.']} />
            <div className="row">{open('lld')}</div>
          </>
        )
      }
      return (<><ModuleDetail track={t} items={items(t)} />{PAGE_FOR[t] && <div className="row">{open(t)}</div>}</>)
    }
    case 'review': {
      return (
        <>
          <Steps items={[
            'On the Roadmap, tick each area whose weekly goal you met.',
            'Write the weekly review: what went well, what is weak, one change for next week.',
            'Every second week, run the Readiness checks.',
            'Look at next week’s modules so Monday starts without decisions.',
          ]} />
          <div className="row"><button className="btn sm" onClick={() => go('roadmap')}>Roadmap</button><button className="btn sm" onClick={() => go('readiness')}>Readiness</button></div>
        </>
      )
    }
    case 'catchup': {
      const behind = plan.tracks.filter((t) => !state.weeks[week]?.goals?.[t])
      return (
        <>
          <p className="small">{behind.length ? <>Not yet ticked this week: {behind.map((t) => <span key={t} style={{ color: TRACKS[t].color, fontWeight: 600 }}>{TRACKS[t].name} </span>)}. Spend the hour on the one furthest behind.</> : 'Every area is ticked this week. Use the hour for rest or a fundamentals book.'}</p>
          <div className="row">{behind.slice(0, 3).map((t) => <span key={t}>{open(t)}</span>)}</div>
        </>
      )
    }
    case 'current': {
      return (
        <>
          <p className="small">Pick one and skim for 20 minutes. Note one thing worth trying in your reflection.</p>
          <div className="module-links">{RESOURCES.filter((r) => r.track === 'current').map((r) => <EditableLink key={r.id} href={r.url} className="small" iconSize={11}>{r.title}</EditableLink>)}</div>
        </>
      )
    }
    default: {
      // Weekday study block for an area.
      const t = task.track
      return (
        <>
          <ModuleDetail track={t} items={items(t)} />
          <Steps items={[`Start a ${task.mins}-minute focus timer.`, 'Work on the “Today, focus on” topics (or the next part of the module).', 'Check off topics you can now explain on the area page.', 'End by writing two lines of notes in your own words.']} />
          {PAGE_FOR[t] && <div className="row">{open(t)}</div>}
        </>
      )
    }
  }
}
