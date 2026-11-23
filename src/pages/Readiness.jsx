import { useState } from 'react'
import { BENCHMARKS, CHECK_EVERY_DAYS, STATUSES, benchmarksFor, signalFor } from '../data/readiness.js'
import { STORY_PROMPTS, TRACKS } from '../data/content.js'
import { celebrate, computeStats, dayKey, diffDays, planPosition, prettyDate, useStore } from '../store.jsx'
import { allProblems } from '../store.jsx'
import { Ring } from '../components/ui.jsx'
import PlanLoad from '../components/PlanLoad.jsx'

export default function Readiness({ go }) {
  const { state, act } = useStore()
  const { plan } = planPosition(state.profile)
  const list = benchmarksFor(plan.tracks)
  const r = state.readiness || {}
  const ready = list.filter((b) => r[b.id]?.status === 'ready').length
  const stats = computeStats(state)
  const helpers = {
    solvedCount: stats.solved,
    totalProblems: allProblems(state).length,
    storiesDone: stats.stories,
    storiesTotal: STORY_PROMPTS.length,
  }
  const today = dayKey()
  const due = list.filter((b) => !r[b.id]?.date || diffDays(r[b.id].date, today) >= CHECK_EVERY_DAYS)

  const setStatus = (b, status) => {
    const was = r[b.id]?.status
    act((s) => {
      s.readiness ||= {}
      s.readiness[b.id] = { ...(s.readiness[b.id] || {}), status, date: dayKey() }
    }, { xp: status === 'ready' && was !== 'ready' ? 40 : was === 'ready' && status !== 'ready' ? -40 : 10, reason: status === 'ready' ? `Ready: ${b.title}` : `Checked: ${b.title}` })
    if (status === 'ready' && was !== 'ready') celebrate(true)
  }

  return (
    <div className="page">
      <div className="row">
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1>Readiness check</h1>
          <p className="muted" style={{ maxWidth: '72ch' }}>
            Ticked boxes are not the goal; passing interviews is. Every {CHECK_EVERY_DAYS} days, run each test below honestly and mark where you are.
            If you are mostly “Not yet” at the halfway point of your plan, extend it rather than pushing on.
          </p>
        </div>
        <Ring value={list.length ? ready / list.length : 0} size={76} label={`${ready}/${list.length}`} />
      </div>

      <section className="panel">
        <div className="panel-head"><div><h2>Does your plan fit?</h2><p className="muted small">Based on the areas you picked, your weekly hours and plan length.</p></div><button className="btn sm ghost" onClick={() => go('roadmap')}>Plan setup</button></div>
        <PlanLoad />
      </section>

      {due.length > 0 && (
        <div className="banner">
          <span style={{ fontSize: 22 }} aria-hidden="true">⏱️</span>
          <span style={{ flex: 1 }}>{due.length} check{due.length === 1 ? ' is' : 's are'} due. Block 2–3 hours this week to run them.</span>
        </div>
      )}

      <section className="panel flush">
        {list.map((b) => <Benchmark key={b.id} b={b} entry={r[b.id]} signal={signalFor(b.id, state, helpers)} onStatus={setStatus} />)}
      </section>

      <p className="small dim">Benchmarks for areas outside your plan are hidden ({BENCHMARKS.length - list.length}). Add areas on the Roadmap to see them.</p>
    </div>
  )
}

function Benchmark({ b, entry, signal, onStatus }) {
  const { act } = useStore()
  const [note, setNote] = useState(entry?.note || '')
  const status = entry?.status || ''
  const color = b.track ? TRACKS[b.track].color : 'var(--glow)'
  return (
    <div className="bench">
      <div style={{ flex: 1, minWidth: 240 }}>
        <div className="small" style={{ color, fontWeight: 600 }}>{b.track ? TRACKS[b.track].name : 'Interviews'}</div>
        <h3 style={{ margin: '2px 0 4px' }}>{b.title}</h3>
        <p className="small muted" style={{ maxWidth: '70ch' }}>{b.test}</p>
        {signal && (
          <p className="small" style={{ marginTop: 4 }}>
            📊 {signal.text}
            {signal.auto && signal.auto !== status && <> · suggests <button className="btn sm ghost" onClick={() => onStatus(b, signal.auto)}>{STATUSES.find(([k]) => k === signal.auto)[1]}</button></>}
          </p>
        )}
        <input className="input" style={{ marginTop: 8 }} placeholder="Notes from the last check: what went wrong, what to fix" value={note}
          onChange={(e) => setNote(e.target.value)} aria-label={`Notes for ${b.title}`}
          onBlur={() => act((s) => { s.readiness ||= {}; s.readiness[b.id] = { ...(s.readiness[b.id] || {}), note } })} />
      </div>
      <div style={{ display: 'grid', gap: 6, justifyItems: 'end' }}>
        <div className="seg" role="group" aria-label={`Status for ${b.title}`}>
          {STATUSES.map(([k, label]) => <button key={k} aria-pressed={status === k} onClick={() => onStatus(b, k)}>{label}</button>)}
        </div>
        <span className="small dim">{entry?.date ? `Checked ${prettyDate(entry.date)}` : 'Never checked'}</span>
      </div>
    </div>
  )
}
