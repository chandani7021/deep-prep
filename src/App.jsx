import { useEffect, useState } from 'react'
import { Award, BookOpen, Brain, Code2, Cpu, Map, Mic, Network, Rocket, Settings as Cog, Sun, Target, Waves } from 'lucide-react'
import { dueReviews, levelFor, streakInfo, useStore } from './store.jsx'
import { DepthGauge, Toasts } from './components/ui.jsx'
import { FocusProvider, FocusWidget } from './components/Focus.jsx'
import Today from './pages/Today.jsx'
import Roadmap from './pages/Roadmap.jsx'
import DSA from './pages/DSA.jsx'
import SystemDesign from './pages/SystemDesign.jsx'
import AIML from './pages/AIML.jsx'
import Fundamentals from './pages/Fundamentals.jsx'
import DevOps from './pages/DevOps.jsx'
import Product from './pages/Product.jsx'
import Library from './pages/Library.jsx'
import Mocks from './pages/Mocks.jsx'
import Achievements from './pages/Achievements.jsx'
import Settings from './pages/Settings.jsx'

const PAGES = [
  { id: 'today', name: 'Today', icon: Sun, el: Today },
  { id: 'roadmap', name: 'Roadmap', icon: Map, el: Roadmap },
  { id: 'dsa', name: 'DSA', icon: Code2, el: DSA },
  { id: 'system-design', name: 'System design', icon: Network, el: SystemDesign },
  { id: 'ai-ml', name: 'AI/ML', icon: Brain, el: AIML },
  { id: 'devops', name: 'DevOps', icon: Rocket, el: DevOps },
  { id: 'product', name: 'Product thinking', icon: Target, el: Product },
  { id: 'fundamentals', name: 'Fundamentals', icon: Cpu, el: Fundamentals },
  { id: 'library', name: 'Library', icon: BookOpen, el: Library },
  { id: 'mocks', name: 'Mock interviews', icon: Mic, el: Mocks },
  { id: 'achievements', name: 'Achievements', icon: Award, el: Achievements },
  { id: 'settings', name: 'Settings', icon: Cog, el: Settings },
]

const fromHash = () => {
  const h = window.location.hash.replace('#', '')
  return PAGES.some((p) => p.id === h) ? h : 'today'
}

export default function App() {
  return (
    <FocusProvider>
      <Shell />
    </FocusProvider>
  )
}

function Shell() {
  const { state, sync } = useStore()
  const [page, setPage] = useState(fromHash)

  useEffect(() => {
    const on = () => { setPage(fromHash()); window.scrollTo({ top: 0 }) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const go = (id) => {
    window.location.hash = id
    setPage(id)
    window.scrollTo({ top: 0 })
  }

  const due = dueReviews(state).length
  const streak = streakInfo(state)
  const lvl = levelFor(state.xp)
  const Current = PAGES.find((p) => p.id === page).el

  const navButton = (p) => (
    <button key={p.id} onClick={() => go(p.id)} aria-current={page === p.id ? 'page' : undefined}>
      <p.icon size={18} aria-hidden="true" />
      <span>{p.name}</span>
      {p.id === 'dsa' && due > 0 && <span className="count" aria-label={`${due} reviews due`}>{due}</span>}
    </button>
  )

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark"><Waves size={20} /></span>
          <span className="brand-name">Deep Prep</span>
        </div>
        <nav className="nav" aria-label="Main">{PAGES.map(navButton)}</nav>
        <DepthGauge />
      </aside>

      <main className="main">
        <header className="topbar">
          <div className={`pill ${streak.doneToday ? 'streak-on' : ''}`} title={`Longest streak: ${streak.longest} days`}>
            <span className="flame" aria-hidden="true">{streak.doneToday ? '🔥' : '🕯️'}</span>
            {streak.current} day{streak.current === 1 ? '' : 's'}
            {state.freezes > 0 && <span className="muted small" title="Streak freezes">· 🧊 {state.freezes}</span>}
          </div>
          <div className="pill level-pill" title={`${state.xp} metres`}>
            <span>{lvl.name}</span>
            <div className="xpbar" aria-label={`Progress to next depth: ${Math.round(lvl.pct * 100)}%`}><span style={{ width: `${lvl.pct * 100}%` }} /></div>
            <span className="muted small">{state.xp.toLocaleString()} m</span>
          </div>
          <FocusWidget />
          {sync.status !== 'off' && (
            <button className="pill" onClick={() => go('settings')} title={sync.msg || 'Online backup to GitHub'} style={{ cursor: 'pointer', color: 'var(--text)', font: 'inherit' }}>
              <span aria-hidden="true">{sync.status === 'synced' ? '☁️' : sync.status === 'saving' || sync.status === 'connecting' ? '⏳' : '⚠️'}</span>
              <span className="small">{{ synced: 'Backed up', saving: 'Saving…', connecting: 'Connecting…', error: 'Not backed up' }[sync.status]}</span>
            </button>
          )}
        </header>
        <Current go={go} />
      </main>

      <nav className="mobile-nav" aria-label="Main">{PAGES.map(navButton)}</nav>
      <Toasts />
    </div>
  )
}
