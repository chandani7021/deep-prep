import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { LEVELS, OPS_MILESTONES, PROJECT_MILESTONES, STORY_PROMPTS, RESOURCES } from './data/content.js'
import { AREA_IDS, CURRICULUM, DEFAULT_TRACKS, planFor } from './data/curriculum.js'
import { benchmarksFor } from './data/readiness.js'
import { PATTERNS, ALL_PROBLEMS } from './data/problems.js'
import { connect as connectToGist, pull as pullGist, push as pushGist, readGistConfig, writeGistConfig } from './sync.js'

const STORAGE_KEY = 'deep-prep:v1'
const SAVED_AT_KEY = 'deep-prep:v1:savedAt' // when this device last changed progress

// ---------------------------------------------------------------- dates
export const dayKey = (d = new Date()) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}
export const parseKey = (k) => {
  const [y, m, d] = k.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const addDays = (k, n) => {
  const d = parseKey(k)
  d.setDate(d.getDate() + n)
  return dayKey(d)
}
export const diffDays = (a, b) => Math.round((parseKey(b) - parseKey(a)) / 86400000)
export const prettyDate = (k, opts = { month: 'short', day: 'numeric' }) => parseKey(k).toLocaleDateString(undefined, opts)

// ---------------------------------------------------------------- defaults
const defaultState = () => ({
  version: 1,
  profile: { name: '', startDate: dayKey(), dailyProblems: 2, dsaMode: 'patterns', planDays: 90, tracks: [...DEFAULT_TRACKS], areasSeen: [...AREA_IDS], planSet: false, role: '', weeklyHours: 22, language: 'python' },
  xp: 0,
  xpLog: [],
  activity: {}, // dayKey -> xp earned that day
  days: {}, // dayKey -> { tasks: {id:true}, custom: [], perfect: bool, note: '' }
  problems: {}, // slug -> { status, interval, due, solved, notes }
  customProblems: [],
  resources: {}, // id -> { current, total, note, done }
  customResources: [],
  sdTopics: {},
  sdProblems: {}, // id -> { count, rating, notes, last }
  aiTopics: {},
  project: {},
  fundTopics: {},
  opsTopics: {},
  opsProject: {},
  productTopics: {},
  areaTopics: {}, // topic id -> true, for Language, LLD, SQL, Frontend, Mobile, Getting hired
  readiness: {}, // benchmark id -> { status, date, note }
  practice: [], // interview practice sessions
  linkOverrides: {}, // original url (or res:<id>) -> your replacement link
  stories: {},
  mocks: [],
  weeks: {}, // n -> { goals: {track:true}, reflection: '' }
  badges: {},
  freezes: 0,
  frozen: [],
  freezeEarnedOn: '',
  focusSessions: 0,
  reviewsDone: 0,
})

const normalize = (parsed) => {
  const base = defaultState()
  if (!parsed || typeof parsed !== 'object') return base
  const profile = { ...base.profile, ...(parsed.profile || {}) }
  if (!Array.isArray(profile.tracks) || !profile.tracks.some((t) => AREA_IDS.includes(t))) profile.tracks = [...DEFAULT_TRACKS]
  profile.tracks = profile.tracks.filter((t) => AREA_IDS.includes(t))
  // Product thinking joined existing plans once when it was added. Newer areas are opt-in (pick a role or tick them).
  const seen = Array.isArray(parsed.profile?.areasSeen) ? parsed.profile.areasSeen : ['dsa', 'sd', 'ai', 'ops', 'fund']
  const added = ['product'].filter((a) => !seen.includes(a) && !profile.tracks.includes(a))
  if (added.length) profile.tracks = [...profile.tracks, ...added]
  profile.areasSeen = [...AREA_IDS]
  return { ...base, ...parsed, profile }
}

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return normalize(JSON.parse(raw))
  } catch {
    return defaultState()
  }
}

const readLocal = (k) => { try { return localStorage.getItem(k) } catch { return null } }
const writeLocal = (k, v) => { try { localStorage.setItem(k, v) } catch { /* storage full or blocked */ } }

// ---------------------------------------------------------------- derived
export const levelFor = (xp) => {
  let i = 0
  for (let j = 0; j < LEVELS.length; j++) if (xp >= LEVELS[j].at) i = j
  const cur = LEVELS[i]
  const next = LEVELS[i + 1]
  const pct = next ? (xp - cur.at) / (next.at - cur.at) : 1
  return { index: i, name: cur.name, next, pct }
}

export const streakInfo = (state) => {
  const on = (k) => (state.activity[k] || 0) > 0 || state.frozen.includes(k)
  const today = dayKey()
  let k = on(today) ? today : addDays(today, -1)
  let current = 0
  while (on(k)) { current++; k = addDays(k, -1) }
  const keys = [...new Set([...Object.keys(state.activity).filter(on), ...state.frozen])].sort()
  let longest = 0, run = 0, prev = null
  for (const key of keys) {
    run = prev && diffDays(prev, key) === 1 ? run + 1 : 1
    longest = Math.max(longest, run)
    prev = key
  }
  const yesterday = addDays(today, -1)
  const canRepair = !on(yesterday) && on(addDays(today, -2)) && state.freezes > 0
  return { current, longest, doneToday: on(today), canRepair }
}

/** Where you are in your plan. Pass state.profile. */
export const planPosition = (profile) => {
  const plan = planFor(profile)
  const day = Math.max(1, diffDays(profile.startDate, dayKey()) + 1)
  const week = Math.min(plan.totalWeeks, Math.ceil(day / 7))
  const phase = plan.phaseOf(week)
  return {
    day, week, phase, plan,
    phaseName: plan.phases[phase - 1].name,
    totalDays: plan.days,
    daysLeft: Math.max(0, plan.days - day + 1),
    finished: day > plan.days,
  }
}

export const allProblems = (state) => [
  ...ALL_PROBLEMS,
  ...state.customProblems.map((p) => ({ ...p, custom: true })),
]

export const dueReviews = (state) => {
  const today = dayKey()
  return allProblems(state).filter((p) => {
    const s = state.problems[p.slug]
    return s && (s.status === 'review' || s.status === 'solved') && s.due && s.due <= today
  })
}

export const solvedCount = (state) =>
  Object.values(state.problems).filter((p) => p.status && p.status !== 'todo').length

export const XP_BY_DIFF = { Easy: 10, Medium: 20, Hard: 35 }

// ---------------------------------------------------------------- badges
export const BADGES = [
  { id: 'first-solve', name: 'First catch', desc: 'Solve your first problem', icon: '🎣', test: (s) => s.solved >= 1 },
  { id: 'solve-25', name: 'School of 25', desc: 'Solve 25 problems', icon: '🐟', test: (s) => s.solved >= 25 },
  { id: 'solve-50', name: 'Half century', desc: 'Solve 50 problems', icon: '🐠', test: (s) => s.solved >= 50 },
  { id: 'solve-100', name: 'Centurion', desc: 'Solve 100 problems', icon: '🐬', test: (s) => s.solved >= 100 },
  { id: 'solve-150', name: 'Leviathan', desc: 'Solve 150 problems', icon: '🐋', test: (s) => s.solved >= 150 },
  { id: 'pattern-1', name: 'Pattern spotter', desc: 'Finish every problem in one pattern', icon: '🧩', test: (s) => s.patternsDone >= 1 },
  { id: 'pattern-5', name: 'Pattern hunter', desc: 'Finish 5 patterns', icon: '🗺️', test: (s) => s.patternsDone >= 5 },
  { id: 'pattern-all', name: 'Cartographer', desc: 'Finish every pattern', icon: '🧭', test: (s) => s.patternsDone >= PATTERNS.length },
  { id: 'streak-3', name: 'Warming up', desc: '3-day streak', icon: '🔥', test: (s) => s.longest >= 3 },
  { id: 'streak-7', name: 'Full week', desc: '7-day streak', icon: '📅', test: (s) => s.longest >= 7 },
  { id: 'streak-30', name: 'Habit formed', desc: '30-day streak', icon: '⚓', test: (s) => s.longest >= 30 },
  { id: 'streak-60', name: 'Unshakeable', desc: '60-day streak', icon: '🪸', test: (s) => s.longest >= 60 },
  { id: 'streak-90', name: 'The whole voyage', desc: '90-day streak', icon: '🏆', test: (s) => s.longest >= 90 },
  { id: 'perfect-1', name: 'Clean sweep', desc: 'Finish every task in a day', icon: '✨', test: (s) => s.perfectDays >= 1 },
  { id: 'perfect-7', name: 'Seven sweeps', desc: '7 perfect days', icon: '🌊', test: (s) => s.perfectDays >= 7 },
  { id: 'perfect-30', name: 'Relentless', desc: '30 perfect days', icon: '💎', test: (s) => s.perfectDays >= 30 },
  { id: 'design-1', name: 'Architect', desc: 'Practise your first system design', icon: '🏗️', test: (s) => s.designs >= 1 },
  { id: 'design-10', name: 'Principal material', desc: 'Practise 10 different designs', icon: '🏛️', test: (s) => s.designs >= 10 },
  { id: 'mock-1', name: 'Hot seat', desc: 'Log your first mock interview', icon: '🎙️', test: (s) => s.mocks >= 1 },
  { id: 'mock-6', name: 'Battle tested', desc: 'Log 6 mock interviews', icon: '🛡️', test: (s) => s.mocks >= 6 },
  { id: 'book-1', name: 'Bookworm', desc: 'Finish a book, course or series', icon: '📘', test: (s) => s.finished >= 1 },
  { id: 'book-5', name: 'Library card', desc: 'Finish 5 resources', icon: '📚', test: (s) => s.finished >= 5 },
  { id: 'review-20', name: 'Memory keeper', desc: 'Complete 20 spaced reviews', icon: '🧠', test: (s) => s.reviews >= 20 },
  { id: 'focus-10', name: 'Deep focus', desc: 'Complete 10 focus sessions', icon: '⏱️', test: (s) => s.focus >= 10 },
  { id: 'ops-project', name: 'Pipeline pro', desc: 'Finish every DevOps project milestone', icon: '🛠️', test: (s) => s.opsProjectDone },
  { id: 'product-all', name: 'Product minded', desc: 'Check off every product thinking topic', icon: '🎯', test: (s) => s.productDone },
  { id: 'ready', name: 'Interview ready', desc: 'Mark every readiness benchmark in your plan as Ready', icon: '🏁', test: (s) => s.interviewReady },
  { id: 'project', name: 'Shipped it', desc: 'Finish every AI project milestone', icon: '🚀', test: (s) => s.projectDone },
  { id: 'stories', name: 'Storyteller', desc: 'Write every STAR story', icon: '🗣️', test: (s) => s.stories >= STORY_PROMPTS.length },
  { id: 'level-5', name: 'Twilight diver', desc: 'Reach the Twilight zone', icon: '🌒', test: (s) => s.level >= 5 },
  { id: 'level-9', name: 'Challenger Deep', desc: 'Reach the deepest level', icon: '🌑', test: (s) => s.level >= 9 },
]

export const computeStats = (state) => {
  const streak = streakInfo(state)
  const solvedSet = new Set(Object.entries(state.problems).filter(([, v]) => v.status && v.status !== 'todo').map(([k]) => k))
  const patternsDone = PATTERNS.filter((p) => p.problems.every(([slug]) => solvedSet.has(slug))).length
  const totals = Object.fromEntries(RESOURCES.map((r) => [r.id, r.total]))
  const finished = Object.entries(state.resources).filter(([id, r]) => r.done || (r.current && r.current >= (r.total || totals[id] || Infinity))).length
  return {
    solved: solvedSet.size,
    patternsDone,
    longest: streak.longest,
    current: streak.current,
    perfectDays: Object.values(state.days).filter((d) => d.perfect).length,
    designs: Object.values(state.sdProblems).filter((p) => p.count > 0).length,
    mocks: state.mocks.length,
    finished,
    reviews: state.reviewsDone,
    focus: state.focusSessions,
    projectDone: PROJECT_MILESTONES.every((m) => state.project[m.id]),
    opsProjectDone: OPS_MILESTONES.every((m) => state.opsProject?.[m.id]),
    interviewReady: (() => { const bs = benchmarksFor(planFor(state.profile).tracks); return bs.length > 0 && bs.every((b) => state.readiness?.[b.id]?.status === 'ready') })(),
    productDone: CURRICULUM.product.flatMap((m) => m.topics).every(([id]) => state.productTopics?.[id]),
    stories: STORY_PROMPTS.filter((p) => {
      const s = state.stories[p.id]
      return s && s.s && s.a && s.r
    }).length,
    level: levelFor(state.xp).index,
  }
}

// ---------------------------------------------------------------- celebration
const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
export const celebrate = (big = false) => {
  if (reduceMotion()) return
  const colors = ['#3d8bfd', '#6fd3ff', '#bfe0ff', '#ffffff', '#1f6feb']
  confetti({ particleCount: big ? 160 : 60, spread: big ? 100 : 60, origin: { y: 0.7 }, colors, scalar: big ? 1.1 : 0.9 })
}

// ---------------------------------------------------------------- context
const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)
  const [toasts, setToasts] = useState([])
  const prevLevel = useRef(levelFor(state.xp).index)

  // ------------------------------------------------------------ online backup (GitHub Gist)
  // Progress is cached in localStorage and, once a GitHub token is added in
  // Settings, saved to a private gist. The copy with the newest savedAt wins.
  const [gist, setGist] = useState(readGistConfig) // { token, id, login, synced }
  const [sync, setSync] = useState({ status: readGistConfig() ? 'connecting' : 'off', msg: '', at: null })
  const gistRef = useRef(gist)
  const stateRef = useRef(state)
  const lastJson = useRef(null)
  if (lastJson.current === null) lastJson.current = JSON.stringify(state)
  // 0 = this browser has no progress of its own; 1 = progress saved before timestamps existed
  const savedAt = useRef(Number(readLocal(SAVED_AT_KEY)) || (readLocal(STORAGE_KEY) ? 1 : 0))
  const ready = useRef(false) // first read of the gist has landed
  const saving = useRef(false)
  const again = useRef(false)
  const debounce = useRef(null)
  const dirty = useRef(false) // a local change has not reached the gist yet
  const pullRef = useRef(null)

  const fail = (e) => setSync({ status: 'error', msg: e?.message || 'Online backup failed. Progress is kept in this browser.', at: null })

  const flush = useCallback(async () => {
    clearTimeout(debounce.current)
    const cfg = gistRef.current
    if (!cfg) return
    if (!ready.current) return pullRef.current?.() // must read the gist before overwriting it
    if (saving.current) { again.current = true; return }
    saving.current = true
    setSync((s) => ({ ...s, status: 'saving' }))
    try {
      dirty.current = false
      await pushGist(cfg, stateRef.current, savedAt.current)
      setSync({ status: 'synced', msg: '', at: Date.now() })
    } catch (e) { dirty.current = true; fail(e) }
    saving.current = false
    if (again.current) { again.current = false; flush() }
  }, [])

  const adopt = (remote) => {
    const next = normalize(structuredClone(remote.state))
    const json = JSON.stringify(next)
    lastJson.current = json
    savedAt.current = remote.savedAt
    writeLocal(SAVED_AT_KEY, String(remote.savedAt))
    if (json !== JSON.stringify(stateRef.current)) setState(next)
  }

  /** Read the gist and reconcile: the newer copy wins. */
  const pull = useCallback(async () => {
    const cfg = gistRef.current
    if (!cfg || saving.current) return
    try {
      const remote = await pullGist(cfg)
      ready.current = true
      if (!cfg.synced && remote.state && remote.savedAt > 0 && savedAt.current > 0) {
        // First time this browser meets an existing backup, and both have progress: ask.
        const useOnline = window.confirm(
          `An online backup from ${new Date(remote.savedAt).toLocaleString()} was found.\n\n` +
          'OK: load the online progress into this browser.\nCancel: keep this browser’s progress and overwrite the online backup.')
        if (useOnline) adopt(remote)
        else { savedAt.current = Math.max(Date.now(), remote.savedAt + 1); writeLocal(SAVED_AT_KEY, String(savedAt.current)) }
      } else if (remote.state && remote.savedAt > savedAt.current) {
        adopt(remote)
      }
      if (!cfg.synced) {
        const nextCfg = { ...cfg, synced: true }
        gistRef.current = nextCfg
        writeGistConfig(nextCfg)
        setGist(nextCfg)
      }
      if (!remote.state || savedAt.current > remote.savedAt) await flush()
      else setSync({ status: 'synced', msg: '', at: Date.now() })
    } catch (e) { fail(e) }
  }, [flush])
  pullRef.current = pull

  // Cache every change locally; a change made here bumps savedAt and is queued for the gist.
  useEffect(() => {
    stateRef.current = state
    const json = JSON.stringify(state)
    writeLocal(STORAGE_KEY, json)
    if (json === lastJson.current) return
    lastJson.current = json
    savedAt.current = Date.now()
    writeLocal(SAVED_AT_KEY, String(savedAt.current))
    dirty.current = true
    clearTimeout(debounce.current)
    debounce.current = setTimeout(flush, 4000)
  }, [state, flush])

  // Pull on load and whenever the tab comes back; save straight away when it is hidden.
  useEffect(() => {
    pull()
    const onVis = () => {
      if (document.visibilityState === 'hidden') flush()
      else if (dirty.current) flush()
      else pull()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [pull, flush])

  const connectGist = useCallback(async (token) => {
    setSync({ status: 'connecting', msg: '', at: null })
    try {
      const cfg = await connectToGist(token.trim())
      const stored = { token: cfg.token, id: cfg.id, login: cfg.login, synced: false }
      gistRef.current = stored
      writeGistConfig(stored)
      setGist(stored)
      ready.current = false
      await pull()
      return true
    } catch (e) {
      gistRef.current = null
      writeGistConfig(null)
      setGist(null)
      fail(e)
      return false
    }
  }, [pull])

  const disconnectGist = useCallback(() => {
    gistRef.current = null
    ready.current = false
    writeGistConfig(null)
    setGist(null)
    setSync({ status: 'off', msg: '', at: null })
  }, [])

  const syncNow = useCallback(async () => { await pull() }, [pull])

  const toast = useCallback((text, kind = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, text, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  /**
   * act(mutator, { xp, reason })
   * mutator receives a draft copy of state to change in place.
   */
  const act = useCallback((mutator, opts = {}) => {
    setState((prev) => {
      const next = structuredClone(prev)
      mutator(next)
      const xp = opts.xp || 0
      if (xp) {
        const today = dayKey()
        next.xp = Math.max(0, next.xp + xp)
        next.activity[today] = Math.max(0, (next.activity[today] || 0) + xp)
        if (next.activity[today] === 0) delete next.activity[today]
        next.xpLog = [{ date: today, xp, reason: opts.reason || '' }, ...next.xpLog].slice(0, 200)
      }
      return next
    })
    if (opts.xp > 0) toast(`+${opts.xp} m deeper${opts.reason ? ` · ${opts.reason}` : ''}`, 'xp')
  }, [toast])

  // Badges, streak freezes and level-ups
  useEffect(() => {
    const stats = computeStats(state)
    const newly = BADGES.filter((b) => !state.badges[b.id] && b.test(stats))
    const streak = stats.current
    const earnFreeze = streak > 0 && streak % 7 === 0 && state.freezeEarnedOn !== dayKey() && state.freezes < 2
    if (newly.length || earnFreeze) {
      setState((prev) => {
        const next = structuredClone(prev)
        newly.forEach((b) => { next.badges[b.id] = dayKey() })
        if (earnFreeze) {
          next.freezes = Math.min(2, next.freezes + 1)
          next.freezeEarnedOn = dayKey()
        }
        return next
      })
      newly.forEach((b) => toast(`${b.icon} Badge unlocked: ${b.name}`, 'badge'))
      if (earnFreeze) toast('🧊 You earned a streak freeze for a 7-day run', 'badge')
      if (newly.length) celebrate(true)
    }
    const lvl = levelFor(state.xp).index
    if (lvl > prevLevel.current) {
      toast(`🌊 New depth reached: ${levelFor(state.xp).name}`, 'badge')
      celebrate(true)
    }
    prevLevel.current = lvl
  }, [state, toast])

  const replaceState = useCallback((s) => setState(normalize(s)), [])
  const reset = useCallback(() => setState(defaultState()), [])

  return (
    <StoreCtx.Provider value={{ state, act, toast, toasts, replaceState, reset, sync, gist, connectGist, disconnectGist, syncNow }}>
      {children}
    </StoreCtx.Provider>
  )
}

export const useStore = () => useContext(StoreCtx)

// ---------------------------------------------------------------- problem actions
export const problemActions = (act) => ({
  solve(p, withHelp) {
    const today = dayKey()
    const interval = withHelp ? 3 : 7
    act((s) => {
      s.problems[p.slug] = {
        ...(s.problems[p.slug] || {}),
        status: withHelp ? 'review' : 'solved',
        interval,
        due: addDays(today, interval),
        solved: today,
      }
    }, { xp: XP_BY_DIFF[p.diff] || 15, reason: p.title })
  },
  review(p, gotIt) {
    const today = dayKey()
    act((s) => {
      const cur = s.problems[p.slug] || {}
      const interval = gotIt ? Math.min(60, (cur.interval || 3) * 2) : 3
      const mastered = gotIt && interval >= 28
      s.problems[p.slug] = {
        ...cur,
        status: mastered ? 'mastered' : gotIt ? 'solved' : 'review',
        interval,
        due: mastered ? null : addDays(today, interval),
      }
      s.reviewsDone += 1
    }, { xp: gotIt ? 10 : 5, reason: `Reviewed ${p.title}` })
  },
  reset(p) {
    act((s) => {
      const cur = s.problems[p.slug]
      if (cur) s.problems[p.slug] = { notes: cur.notes, status: 'todo' }
    })
  },
  note(p, notes) {
    act((s) => { s.problems[p.slug] = { ...(s.problems[p.slug] || { status: 'todo' }), notes } })
  },
})
