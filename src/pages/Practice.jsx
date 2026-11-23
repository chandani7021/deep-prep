import { useEffect, useRef, useState } from 'react'
import { Bot, Mic, MicOff, RefreshCw, Send, Sparkles, Square, Timer } from 'lucide-react'
import { FOLLOW_UPS, KINDS, PHASES, analyzeAnswer, pickQuestion } from '../data/practice.js'
import { AI_MODEL, aiErrorMessage, getAiFeedback, hasAiKey, interviewerTurn, textOf } from '../lib/ai.js'
import { useSpeech } from '../lib/speech.js'
import { celebrate, dayKey, planPosition, prettyDate, useStore } from '../store.jsx'
import EditableLink from '../components/EditableLink.jsx'

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export default function Practice({ go }) {
  const { state } = useStore()
  const [mode, setMode] = useState('explain')
  const history = (state.practice || []).slice(0, 8)

  return (
    <div className="page">
      <div>
        <h1>Interview practice</h1>
        <p className="muted" style={{ maxWidth: '72ch' }}>
          Practise out loud. Speak (your browser turns it into text) or type, then get feedback.
          The instant feedback works offline and checks structure and delivery. For feedback on whether your answer is actually right, and a live AI interviewer, add your own Anthropic API key in Settings (optional).
        </p>
      </div>

      <div className="seg" role="group" aria-label="Practice mode" style={{ flexWrap: 'wrap' }}>
        {[['explain', 'Explain a solution (2 min)'], ['mock', 'Mock interview'], ['ai', 'AI interviewer']].map(([id, name]) => (
          <button key={id} aria-pressed={mode === id} onClick={() => setMode(id)}>{name}</button>
        ))}
      </div>

      {mode === 'explain' && <Session kind="explain" key="explain" />}
      {mode === 'mock' && <MockSetup />}
      {mode === 'ai' && (hasAiKey() ? <AiInterview /> : (
        <section className="panel">
          <h2>AI interviewer needs an API key</h2>
          <p className="small muted" style={{ marginTop: 6 }}>The AI interviewer talks with you turn by turn and scores you at the end. It runs on your own Anthropic API key (you pay Anthropic directly, a few cents per interview). Without a key, use “Mock interview”: it has a timer, phases and interviewer follow-ups, with offline feedback.</p>
          <div className="row" style={{ marginTop: 10 }}><button className="btn primary" onClick={() => go('settings')}>Add a key in Settings</button></div>
        </section>
      ))}

      {history.length > 0 && (
        <section className="panel">
          <div className="panel-head"><h2>Recent practice</h2><span className="small muted">{(state.practice || []).length} sessions</span></div>
          {history.map((h) => (
            <div key={h.id} className="row detail-row">
              <span className="small dim" style={{ width: 70 }}>{prettyDate(h.date)}</span>
              <span style={{ flex: 1, minWidth: 160 }}><strong>{KINDS[h.kind]?.name}</strong> · <span className="small">{h.question}</span></span>
              <span className="chip">{fmt(h.seconds || 0)}</span>
              <span className="chip xp">Structure {h.score}%</span>
              {h.ai && <span className="chip must">AI {h.ai}/5</span>}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

function MockSetup() {
  const { state } = useStore()
  const tracks = state.profile.tracks || []
  const kinds = Object.entries(KINDS).filter(([k]) => k !== 'explain')
  const [kind, setKind] = useState(() => (kinds.find(([, v]) => tracks.includes(v.track)) || kinds[0])[0])
  return (
    <>
      <div className="row">
        <span className="label" style={{ margin: 0 }}>Round type</span>
        <select className="select" style={{ width: 'auto' }} value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Round type">
          {kinds.map(([k, v]) => <option key={k} value={k}>{v.name}{tracks.includes(v.track) ? '' : ' (not in your plan)'}</option>)}
        </select>
      </div>
      <Session kind={kind} key={kind} />
    </>
  )
}

/** One practice round: question → timer + phases → speak/type → feedback. */
function Session({ kind }) {
  const { state, act } = useStore()
  const pos = planPosition(state.profile)
  const [q, setQ] = useState(() => pickQuestion(kind, { plan: pos.plan, week: pos.week, state }))
  const speech = useSpeech()
  const [typed, setTyped] = useState('')
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [followUps, setFollowUps] = useState([])
  const [result, setResult] = useState(null)
  const [ai, setAi] = useState({ status: 'idle' })
  const started = useRef(0)
  const minutes = KINDS[kind].minutes
  const phases = PHASES[kind]

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds((Date.now() - started.current) / 1000), 250)
    return () => clearInterval(id)
  }, [running])

  const answer = [speech.text, typed].filter(Boolean).join(' ').trim()
  const begin = (withMic) => {
    setResult(null); setAi({ status: 'idle' }); setFollowUps([])
    started.current = Date.now() - seconds * 1000
    setRunning(true)
    if (withMic) speech.start()
  }
  const finish = () => {
    speech.stop(); setRunning(false)
    const r = analyzeAnswer(kind, answer, seconds)
    setResult(r)
    const entry = { id: Date.now().toString(36), date: dayKey(), kind, question: q.text, seconds: Math.round(seconds), score: r.score, words: r.words }
    act((s) => { s.practice = [entry, ...(s.practice || [])].slice(0, 200) }, { xp: r.words >= 25 ? 15 : 0, reason: `Practised: ${KINDS[kind].name}` })
    if (r.words >= 25) celebrate()
  }
  const next = () => {
    speech.stop(); speech.reset(); setTyped(''); setRunning(false); setSeconds(0); setResult(null); setAi({ status: 'idle' }); setFollowUps([])
    setQ(pickQuestion(kind, { plan: pos.plan, week: pos.week, state }, q.text))
  }
  const askAi = async () => {
    setAi({ status: 'loading' })
    try {
      const fb = await getAiFeedback({ kind, question: q.text, transcript: answer, seconds })
      setAi({ status: 'done', fb })
      act((s) => { if (s.practice?.[0]) s.practice[0].ai = Math.round(fb.overall) })
    } catch (e) { setAi({ status: 'error', msg: aiErrorMessage(e) }) }
  }
  const logMock = () => {
    const rating = ai.fb ? Math.max(1, Math.min(5, Math.round(ai.fb.overall))) : Math.max(1, Math.min(5, Math.round(result.score / 20)))
    act((s) => { s.mocks.unshift({ id: Date.now().toString(36), date: dayKey(), type: KINDS[kind].name, platform: ai.fb ? 'Practice (AI feedback)' : 'Practice (self)', rating, went: q.text, improve: (ai.fb?.improvements || result.checks.filter((c) => !c.hit).map((c) => c.tip)).slice(0, 2).join(' ') }) }, { xp: 30, reason: 'Practice logged as a mock' })
    celebrate()
  }
  const elapsedMin = seconds / 60
  let acc = 0
  const phaseIdx = phases.findIndex(([, m]) => (acc += m) > elapsedMin)
  const over = seconds > minutes * 60

  return (
    <section className="panel practice">
      <div className="panel-head">
        <div style={{ flex: 1 }}>
          <span className="small" style={{ color: 'var(--glow)', fontWeight: 600 }}>{KINDS[kind].name}</span>
          <h2 style={{ marginTop: 2 }}>{q.url ? <EditableLink href={q.url}>{q.text}</EditableLink> : q.text}</h2>
          {q.meta && <p className="small dim">{q.meta}</p>}
        </div>
        <button className="btn sm" onClick={next}><RefreshCw size={14} /> Different question</button>
      </div>

      <div className="practice-grid">
        <div>
          <div className={`practice-timer ${over ? 'over' : ''}`}><Timer size={18} /> {fmt(seconds)} <span className="small muted">/ {minutes}:00</span></div>
          <ol className="phases">
            {phases.map(([label, m], i) => <li key={label} className={running && i === phaseIdx ? 'now' : ''}>{label} <span className="dim">· {m < 1 ? `${Math.round(m * 60)} s` : `${m} min`}</span></li>)}
          </ol>
          {running && (
            <div style={{ marginTop: 10 }}>
              <button className="btn sm" onClick={() => setFollowUps((f) => [...f, FOLLOW_UPS[kind].filter((x) => !f.includes(x))[0]].filter(Boolean))} disabled={followUps.length >= FOLLOW_UPS[kind].length}>Interviewer follow-up</button>
              {followUps.map((f) => <p key={f} className="followup">🎙️ “{f}”</p>)}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          {!running && !result && (
            <div className="row">
              {speech.supported && <button className="btn primary" onClick={() => begin(true)}><Mic size={16} /> Start speaking</button>}
              <button className={`btn ${speech.supported ? '' : 'primary'}`} onClick={() => begin(false)}>Start (type instead)</button>
            </div>
          )}
          {running && (
            <div className="row">
              {speech.supported && (speech.listening
                ? <button className="btn" onClick={speech.stop}><MicOff size={16} /> Pause mic</button>
                : <button className="btn" onClick={speech.start}><Mic size={16} /> Mic on</button>)}
              <button className="btn primary" onClick={finish}><Square size={14} /> Done, get feedback</button>
              {speech.listening && <span className="small rec">● recording</span>}
            </div>
          )}
          {speech.error && <p className="small" style={{ color: 'var(--warn)' }}>{speech.error}</p>}
          {(running || answer) && (
            <>
              {speech.text || speech.interim ? (
                <div className="transcript" aria-live="polite">{speech.text} <span className="dim">{speech.interim}</span></div>
              ) : null}
              <textarea className="textarea" style={{ minHeight: 90 }} placeholder={speech.supported ? 'Your words appear above as you speak. You can also type or add notes here.' : 'Type your answer here.'}
                value={typed} onChange={(e) => setTyped(e.target.value)} aria-label="Your answer" />
            </>
          )}
        </div>
      </div>

      {result && <OfflineFeedback r={result} seconds={seconds} />}

      {result && (
        <div className="row" style={{ marginTop: 12 }}>
          {hasAiKey()
            ? <button className="btn primary" onClick={askAi} disabled={ai.status === 'loading' || result.words < 10}><Sparkles size={15} /> {ai.status === 'loading' ? 'Reviewing…' : 'Get AI feedback'}</button>
            : <span className="small muted">Want feedback on correctness too? Add an Anthropic API key in Settings → AI feedback.</span>}
          <button className="btn" onClick={logMock}>Log as a mock</button>
          <button className="btn" onClick={next}>Next question</button>
        </div>
      )}
      {ai.status === 'error' && <p className="small" style={{ color: 'var(--warn)', marginTop: 8 }}>{ai.msg}</p>}
      {ai.status === 'done' && <AiFeedbackView fb={ai.fb} />}
    </section>
  )
}

function OfflineFeedback({ r, seconds }) {
  return (
    <div className="feedback">
      <div className="row" style={{ gap: 10 }}>
        <h3 style={{ margin: 0 }}>Instant feedback</h3>
        <span className="chip xp">Structure {r.score}%</span>
        <span className="chip">{fmt(seconds)} · {r.words} words{seconds >= 10 ? ` · ${r.wpm} words/min` : ''}</span>
      </div>
      <p className="small dim">Checks what a strong answer usually covers. It can’t tell whether your solution is correct.</p>
      <div className="fb-checks">
        {r.checks.map((c) => (
          <div key={c.id} className={`fb-check ${c.hit ? 'hit' : ''}`}>
            <span aria-hidden="true">{c.hit ? '✅' : '⬜'}</span>
            <div><div className="small" style={{ fontWeight: 600 }}>{c.label}</div>{!c.hit && <div className="small muted">{c.tip}</div>}</div>
          </div>
        ))}
      </div>
      {r.notes.length > 0 && <ul className="fb-notes">{r.notes.map((n) => <li key={n.text} className={n.good ? 'good' : ''}>{n.good ? '👍 ' : '⚠️ '}{n.text}</li>)}</ul>}
    </div>
  )
}

function AiFeedbackView({ fb }) {
  return (
    <div className="feedback ai">
      <div className="row" style={{ gap: 10 }}>
        <h3 style={{ margin: 0 }}><Sparkles size={16} /> AI feedback</h3>
        <span className="chip must">{Math.round(fb.overall)}/5</span>
        <span className="small">{fb.verdict}</span>
      </div>
      <div className="fb-scores">
        {fb.scores.map((s) => (
          <div key={s.criterion} className="small"><strong>{s.criterion}</strong> <span className="chip">{Math.round(s.score)}/5</span> <span className="muted">{s.note}</span></div>
        ))}
      </div>
      <div className="grid-2" style={{ gap: 12 }}>
        <div><h4>What worked</h4><ul className="fb-notes">{fb.strengths.map((s) => <li key={s} className="good">{s}</li>)}</ul></div>
        <div><h4>Fix next time</h4><ul className="fb-notes">{fb.improvements.map((s) => <li key={s}>{s}</li>)}</ul></div>
      </div>
      <details><summary className="small" style={{ cursor: 'pointer' }}>A stronger answer</summary><p className="small" style={{ whiteSpace: 'pre-wrap', marginTop: 6 }}>{fb.better_answer}</p></details>
      {fb.follow_ups?.length > 0 && <p className="small muted">Be ready for: {fb.follow_ups.map((f) => `“${f}”`).join('  ')}</p>}
      <p className="small dim">Reviewed by {AI_MODEL} with your API key.</p>
    </div>
  )
}

/** Live, turn-by-turn interview with an AI interviewer, then a scorecard. */
function AiInterview() {
  const { state, act } = useStore()
  const pos = planPosition(state.profile)
  const tracks = state.profile.tracks || []
  const kinds = Object.entries(KINDS).filter(([k]) => k !== 'explain')
  const [kind, setKind] = useState(() => (kinds.find(([, v]) => tracks.includes(v.track)) || kinds[0])[0])
  const [q, setQ] = useState(null)
  const [history, setHistory] = useState([]) // API messages; assistant turns keep full content blocks
  const [streaming, setStreaming] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [fb, setFb] = useState(null)
  const [draft, setDraft] = useState('')
  const startedAt = useRef(0)
  const speech = useSpeech()
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }) }, [history, streaming])
  useEffect(() => { if (speech.text) { setDraft((d) => `${d} ${speech.text}`.trim()); speech.reset() } }, [speech.text]) // eslint-disable-line react-hooks/exhaustive-deps

  const turn = async (msgs, question = q) => {
    setBusy(true); setErr(''); setStreaming('')
    try {
      const msg = await interviewerTurn({ kind, question: question.text, history: msgs, onText: (d) => setStreaming((s) => s + d) })
      setHistory([...msgs, { role: 'assistant', content: msg.content }])
    } catch (e) { setErr(aiErrorMessage(e)) }
    setStreaming(''); setBusy(false)
  }
  const start = (question) => {
    const qq = question || pickQuestion(kind, { plan: pos.plan, week: pos.week, state })
    setQ(qq); setFb(null); setHistory([]); startedAt.current = Date.now()
    const first = [{ role: 'user', content: 'Hi, I am ready to start.' }]
    setHistory(first)
    turn(first, qq)
  }
  const send = (e) => {
    e?.preventDefault()
    const text = [draft, speech.interim].filter(Boolean).join(' ').trim()
    if (!text || busy) return
    speech.stop(); setDraft('')
    turn([...history, { role: 'user', content: text }])
  }
  const end = async () => {
    speech.stop(); setBusy(true); setErr('')
    const transcript = history.slice(1).map((m) => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${textOf(m.content)}`).join('\n')
    try {
      const seconds = (Date.now() - startedAt.current) / 1000
      const f = await getAiFeedback({ kind, question: q.text, transcript, seconds })
      setFb(f)
      const rating = Math.max(1, Math.min(5, Math.round(f.overall)))
      act((s) => {
        s.practice = [{ id: Date.now().toString(36), date: dayKey(), kind, question: q.text, seconds: Math.round(seconds), score: Math.round(f.overall * 20), ai: rating }, ...(s.practice || [])].slice(0, 200)
        s.mocks.unshift({ id: Date.now().toString(36), date: dayKey(), type: KINDS[kind].name, platform: 'AI interviewer', rating, went: q.text, improve: f.improvements.slice(0, 2).join(' ') })
      }, { xp: 60, reason: 'AI mock interview' })
      celebrate(true)
    } catch (e) { setErr(aiErrorMessage(e)) }
    setBusy(false)
  }

  if (!q) {
    return (
      <section className="panel">
        <h2>Start an AI mock interview</h2>
        <p className="small muted" style={{ marginTop: 6 }}>The interviewer asks the question, answers your clarifying questions, gives hints if you are stuck, and pushes back like a real one. Speak or type each reply. End the interview to get a scorecard; it is logged in Mock interviews.</p>
        <div className="row" style={{ marginTop: 10 }}>
          <select className="select" style={{ width: 'auto' }} value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Round type">
            {kinds.map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
          </select>
          <button className="btn primary" onClick={() => start()}><Bot size={16} /> Start interview</button>
        </div>
      </section>
    )
  }

  const shown = history.slice(1)
  return (
    <section className="panel practice">
      <div className="panel-head">
        <div><span className="small" style={{ color: 'var(--glow)', fontWeight: 600 }}>AI interviewer · {KINDS[kind].name}</span><h2 style={{ marginTop: 2 }}>{q.text}</h2></div>
        <button className="btn sm" onClick={() => { setQ(null); setHistory([]); setFb(null) }}>New interview</button>
      </div>
      <div className="chat">
        {shown.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}><span className="small dim">{m.role === 'user' ? 'You' : 'Interviewer'}</span><p>{textOf(m.content)}</p></div>
        ))}
        {streaming && <div className="bubble assistant"><span className="small dim">Interviewer</span><p>{streaming}</p></div>}
        {busy && !streaming && !fb && <p className="small dim">…</p>}
        <div ref={endRef} />
      </div>
      {err && <p className="small" style={{ color: 'var(--warn)' }}>{err}</p>}
      {!fb && (
        <form className="row" onSubmit={send} style={{ marginTop: 10, alignItems: 'flex-end' }}>
          <textarea className="textarea" style={{ flex: 1, minHeight: 60 }} placeholder={speech.listening ? 'Listening…' : 'Your reply (or use the mic)'} value={draft + (speech.interim ? ` ${speech.interim}` : '')}
            onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(e) }} aria-label="Your reply" />
          <div style={{ display: 'grid', gap: 6 }}>
            {speech.supported && (speech.listening
              ? <button type="button" className="btn" onClick={speech.stop}><MicOff size={16} /> Stop</button>
              : <button type="button" className="btn" onClick={speech.start}><Mic size={16} /> Speak</button>)}
            <button className="btn primary" type="submit" disabled={busy}><Send size={15} /> Send</button>
          </div>
        </form>
      )}
      {!fb && shown.length > 2 && <div className="row" style={{ marginTop: 8 }}><button className="btn" onClick={end} disabled={busy}>{busy ? 'Scoring…' : 'End interview and get scorecard'}</button></div>}
      {speech.error && <p className="small" style={{ color: 'var(--warn)' }}>{speech.error}</p>}
      {fb && <AiFeedbackView fb={fb} />}
    </section>
  )
}
