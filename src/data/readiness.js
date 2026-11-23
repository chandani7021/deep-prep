// ---------------------------------------------------------------------------
// Readiness benchmarks: concrete tests you can run every 2–3 weeks.
// `track` ties a benchmark to an area (null = always shown).
// ---------------------------------------------------------------------------

export const CHECK_EVERY_DAYS = 14

export const BENCHMARKS = [
  { id: 'dsa-speed', track: 'dsa', title: 'Unseen mediums in 25 minutes', test: 'Pick 4 medium problems you have never seen. Give each 25 minutes, talking out loud. Ready = 3 of 4 solved with correct complexity.' },
  { id: 'dsa-hard', track: 'dsa', title: 'A hard problem without panic', test: 'Attempt one unseen hard in 45 minutes. Ready = a working brute force and a clear plan for the optimal, even if unfinished.' },
  { id: 'sd-45', track: 'sd', title: 'A new design in 45 minutes', test: 'Pick a design you have not practised. Run the full framework in 45 minutes, out loud. Ready = requirements, estimates, API, data model, diagram and two deep dives without freezing.' },
  { id: 'lang-q', track: 'lang', title: 'Language questions without notes', test: 'Answer 10 random questions from your language list (memory, concurrency, gotchas). Ready = 8 of 10 clear and correct.' },
  { id: 'lld-90', track: 'lld', title: 'Machine coding in 90 minutes', test: 'Build an unseen LLD problem (e.g. Splitwise, parking lot) as working code in 90 minutes. Ready = runs, has tests, and you can add a follow-up feature in 15 minutes.' },
  { id: 'sql-10', track: 'sql', title: 'Medium SQL in 10 minutes', test: 'Solve 3 unseen medium SQL problems (joins + window functions), 10 minutes each. Ready = all 3 correct.' },
  { id: 'fe-build', track: 'fe', title: 'A UI component in 45 minutes', test: 'Build an unseen component (autocomplete, modal, data table) from scratch in 45 minutes. Ready = works, keyboard accessible, handles loading and errors.' },
  { id: 'fe-sd', track: 'fe', title: 'Frontend system design in 45 minutes', test: 'Design an unseen UI (e.g. Google Docs, Instagram feed) out loud. Ready = component tree, data and state, API, performance and accessibility covered.' },
  { id: 'mob-sd', track: 'mobile', title: 'Mobile system design in 45 minutes', test: 'Design an unseen app client out loud. Ready = architecture, offline and sync, networking, and battery/data trade-offs covered.' },
  { id: 'ai-explain', track: 'ai', title: 'Explain the core AI ideas in 5 minutes each', test: 'Explain transformers, RAG and how you evaluate an LLM feature, 5 minutes each, to a non-expert. Ready = no notes, correct, with an example from your project.' },
  { id: 'ai-pitch', track: 'ai', title: 'Project pitch with numbers', test: 'Pitch your AI project in 2 minutes and in 10 minutes. Ready = architecture, a trade-off you made and the eval numbers.' },
  { id: 'ops-pipeline', track: 'ops', title: 'Your pipeline, commit to production', test: 'Whiteboard your delivery pipeline in 5 minutes. Ready = CI stages, deploy strategy, rollback and one zero-downtime database migration.' },
  { id: 'product-sense', track: 'product', title: 'A product question in 10 minutes', test: 'Answer “how would you improve X?” for a product you use. Ready = users, a problem, a solution, and the metric you would move.' },
  { id: 'fund-url', track: 'fund', title: 'Fundamentals rapid-fire', test: 'Answer: what happens when you type a URL, processes vs threads, isolation levels, TCP vs UDP. Ready = each in 2 minutes, correct.' },
  { id: 'stories', track: 'fund', title: 'Every STAR story in 2 minutes', test: 'Tell each story out loud with a timer. Ready = all under 2 minutes, each result has a number.' },
  { id: 'career-pipeline', track: 'career', title: 'A live interview pipeline', test: 'Ready = resume reviewed by 2 engineers, 10+ targeted applications or referrals out, and an interview brief for your top 5 companies.' },
  { id: 'mocks', track: null, title: 'Mock interviews with strangers', test: 'Do mocks with people you do not know. Ready = you passed (4★ or more) at least 2 of your last 3 logged mocks.' },
]

export const STATUSES = [
  ['not', 'Not yet'],
  ['close', 'Close'],
  ['ready', 'Ready'],
]

/** Benchmarks that apply to your plan. */
export const benchmarksFor = (tracks) => BENCHMARKS.filter((b) => b.track === null || tracks.includes(b.track))

/** Signals computed from your data, shown next to the benchmark. Returns { text, auto? } where auto is a suggested status. */
export function signalFor(id, state, helpers) {
  const { solvedCount, totalProblems, storiesDone, storiesTotal } = helpers
  switch (id) {
    case 'dsa-speed':
    case 'dsa-hard':
      return { text: `${solvedCount} of ${totalProblems} problems solved` }
    case 'mocks': {
      const last = state.mocks.slice(0, 3)
      const passed = last.filter((m) => Number(m.rating) >= 4).length
      if (!last.length) return { text: 'No mocks logged yet', auto: 'not' }
      return { text: `${passed} of your last ${last.length} mocks rated 4★+`, auto: last.length === 3 && passed >= 2 ? 'ready' : passed >= 1 ? 'close' : 'not' }
    }
    case 'stories':
      return { text: `${storiesDone} of ${storiesTotal} STAR stories written` }
    case 'ai-pitch': {
      const n = Object.values(state.project || {}).filter(Boolean).length
      return { text: `${n} AI project milestones done` }
    }
    case 'ops-pipeline': {
      const n = Object.values(state.opsProject || {}).filter(Boolean).length
      return { text: `${n} DevOps project milestones done` }
    }
    default:
      return null
  }
}
