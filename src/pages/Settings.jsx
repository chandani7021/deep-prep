import { useRef, useState } from 'react'
import { Cloud, Download, ExternalLink, RefreshCw, Upload } from 'lucide-react'
import { gistUrl } from '../sync.js'
import { PROVIDERS, getAiSettings, listModels, saveAiSettings } from '../lib/ai.js'
import { useStore } from '../store.jsx'

const STATUS = {
  connecting: 'Connecting…',
  synced: 'Up to date.',
  saving: 'Saving…',
  error: 'Not synced.',
  off: '',
}

export default function Settings() {
  const { state, act, replaceState, reset, toast, sync, gist, connectGist, disconnectGist, syncNow } = useStore()
  const [token, setToken] = useState('')
  const [busy, setBusy] = useState(false)
  const file = useRef(null)

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `deep-prep-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importData = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    try {
      const data = JSON.parse(await f.text())
      if (!data || typeof data !== 'object' || !data.profile) throw new Error('bad')
      replaceState(data)
      toast('Backup restored')
    } catch {
      toast('That file is not a Deep Prep backup. Choose a .json file you exported here.')
    }
    e.target.value = ''
  }

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <h1>Settings</h1>

      <section className="panel" style={{ display: 'grid', gap: 14 }}>
        <label><span className="label">Your name</span>
          <input className="input" defaultValue={state.profile.name} onBlur={(e) => act((s) => { s.profile.name = e.target.value.trim() })} placeholder="Shown on the Today page" />
        </label>
        <label><span className="label">Day 1 of the plan</span>
          <input className="input" type="date" value={state.profile.startDate} onChange={(e) => e.target.value && act((s) => { s.profile.startDate = e.target.value })} />
          <span className="small dim">Changing this moves which week and patterns count as “now”.</span>
        </label>
        <label><span className="label">Problems per weekday</span>
          <select className="select" value={state.profile.dailyProblems} onChange={(e) => act((s) => { s.profile.dailyProblems = Number(e.target.value) })}>
            {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </section>

      <section className="panel" style={{ display: 'grid', gap: 12 }}>
        <div className="panel-head"><div><h2>Online backup (GitHub)</h2>
          <p className="muted small">Saves your progress to a private gist in your own GitHub account, so it survives clearing this browser and follows you to other devices. Your token stays in this browser only.</p>
        </div></div>
        {gist ? (
          <>
            <p className="small">
              Connected as <strong>{gist.login}</strong>. {STATUS[sync.status]}
              {sync.at ? ` Last synced ${new Date(sync.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.` : ''}
            </p>
            {sync.msg && <p className="small" style={{ color: 'var(--warn)' }}>{sync.msg}</p>}
            <div className="row">
              <button className="btn" onClick={() => syncNow()}><RefreshCw size={16} /> Sync now</button>
              <a className="btn" href={gistUrl(gist)} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Open the gist</a>
              <button className="btn" onClick={() => { if (window.confirm('Stop backing up from this browser? The gist and your progress here are kept.')) disconnectGist() }}>Disconnect</button>
            </div>
          </>
        ) : (
          <>
            <ol className="small muted" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 4 }}>
              <li>Open <a href="https://github.com/settings/tokens/new?scopes=gist&description=Deep%20Prep%20backup" target="_blank" rel="noreferrer">GitHub → new token (classic)</a>.</li>
              <li>Tick only the <strong>gist</strong> scope and set expiration to <strong>No expiration</strong> (or at least a year).</li>
              <li>Generate it, copy it, paste it below. On other devices, paste the same token: the backup is found automatically.</li>
            </ol>
            <form className="row" onSubmit={async (e) => {
              e.preventDefault()
              if (!token.trim()) return
              setBusy(true)
              const ok = await connectGist(token)
              setBusy(false)
              if (ok) { setToken(''); toast('Online backup connected') }
            }}>
              <input className="input" style={{ flex: 1, minWidth: 220 }} type="password" autoComplete="off" placeholder="ghp_…" value={token} onChange={(e) => setToken(e.target.value)} aria-label="GitHub token" />
              <button className="btn primary" disabled={busy || !token.trim()}><Cloud size={16} /> {busy ? 'Connecting…' : 'Connect'}</button>
            </form>
            {sync.status === 'error' && sync.msg && <p className="small" style={{ color: 'var(--warn)' }}>{sync.msg}</p>}
          </>
        )}
      </section>

      <AiKeySettings />

      <section className="panel">
        <div className="panel-head"><div><h2>Backup file</h2><p className="muted small">A copy you keep yourself. Export one now and then, and import it to restore or to move to another browser.</p></div></div>
        <div className="row">
          <button className="btn primary" onClick={exportData}><Download size={16} /> Export backup</button>
          <button className="btn" onClick={() => file.current?.click()}><Upload size={16} /> Import backup</button>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={importData} />
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><div><h2>Start over</h2><p className="muted small">Erases all progress, badges and notes in this browser.</p></div></div>
        <button className="btn danger" onClick={() => { if (window.confirm('Erase all progress? Export a backup first if you might want it.')) { reset(); toast('Progress erased') } }}>Erase all progress</button>
      </section>
    </div>
  )
}

function AiKeySettings() {
  const { toast } = useStore()
  const [cfg, setCfg] = useState(getAiSettings)
  const [drafts, setDrafts] = useState({})
  const [models, setModels] = useState({})
  const [busy, setBusy] = useState('')
  const update = (patch) => setCfg(saveAiSettings(patch))
  const saveKey = (p) => {
    const k = (drafts[p] || '').trim()
    if (!k) return
    update({ keys: { ...cfg.keys, [p]: k } })
    setDrafts({ ...drafts, [p]: '' })
    toast(`${PROVIDERS[p].name} key saved in this browser`)
  }
  const removeKey = (p) => {
    if (!window.confirm(`Remove the ${PROVIDERS[p].name} key from this browser?`)) return
    const keys = { ...cfg.keys }; delete keys[p]
    update({ keys })
  }
  const loadModels = async (p) => {
    setBusy(p)
    try { setModels({ ...models, [p]: await listModels(p, cfg.keys[p]) }); toast('Key works. Models loaded.') }
    catch (e) { toast(e.message || 'Could not load models') }
    setBusy('')
  }
  const useSelect = (use, label) => (
    <label>
      <span className="label">{label}</span>
      <select className="select" style={{ width: 'auto' }} value={cfg[`${use}Provider`]} onChange={(e) => update({ [`${use}Provider`]: e.target.value })}>
        {Object.entries(PROVIDERS).map(([id, p]) => <option key={id} value={id}>{p.name}{p.free ? ' (free tier)' : ' (paid)'}{cfg.keys[id] ? '' : ' · no key yet'}</option>)}
      </select>
    </label>
  )

  return (
    <section className="panel" style={{ display: 'grid', gap: 12 }}>
      <div className="panel-head"><div><h2>AI feedback (optional)</h2>
        <p className="muted small">Adds AI feedback on your answers and a live AI interviewer on the Practice page. Groq and Google Gemini have free tiers (no credit card); Anthropic is paid. Everything else in the app works without any key.</p>
      </div></div>

      <div className="row" style={{ gap: 16 }}>
        {useSelect('feedback', 'Use for answer feedback')}
        {useSelect('interview', 'Use for the AI interviewer')}
      </div>

      {Object.entries(PROVIDERS).map(([id, p]) => {
        const used = cfg.feedbackProvider === id || cfg.interviewProvider === id
        return (
          <div key={id} className="provider" style={used ? { borderColor: 'var(--signal)' } : undefined}>
            <div className="row" style={{ gap: 8 }}>
              <strong style={{ flex: 1 }}>{p.name} {p.free ? <span className="chip easy">Free tier</span> : <span className="chip">Paid</span>}</strong>
              <a className="small" href={p.keyUrl} target="_blank" rel="noreferrer">Get a key</a>
            </div>
            <p className="small muted">{p.note}</p>
            {cfg.keys[id] ? (
              <div className="row" style={{ gap: 8 }}>
                <span className="small">✅ Key saved</span>
                <label className="row small" style={{ gap: 6 }}>Model
                  {models[id]?.length ? (
                    <select className="select" style={{ width: 'auto' }} value={cfg.models[id] || p.defaultModel} onChange={(e) => update({ models: { ...cfg.models, [id]: e.target.value } })}>
                      {[...new Set([cfg.models[id] || p.defaultModel, ...models[id]])].map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  ) : (
                    <input className="input" style={{ width: 230 }} defaultValue={cfg.models[id] || p.defaultModel} aria-label={`${p.name} model`}
                      onBlur={(e) => update({ models: { ...cfg.models, [id]: e.target.value.trim() || p.defaultModel } })} />
                  )}
                </label>
                {id !== 'anthropic' && <button className="btn sm" onClick={() => loadModels(id)} disabled={busy === id}>{busy === id ? 'Checking…' : 'Test key & list models'}</button>}
                <button className="btn sm ghost" onClick={() => removeKey(id)}>Remove key</button>
              </div>
            ) : (
              <form className="row" onSubmit={(e) => { e.preventDefault(); saveKey(id) }}>
                <input className="input" style={{ flex: 1, minWidth: 200 }} type="password" autoComplete="off" placeholder={p.keyHint} value={drafts[id] || ''}
                  onChange={(e) => setDrafts({ ...drafts, [id]: e.target.value })} aria-label={`${p.name} API key`} />
                <button className="btn primary" disabled={!(drafts[id] || '').trim()}>Save key</button>
              </form>
            )}
          </div>
        )
      })}

      <ul className="small muted" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 4 }}>
        <li>Keys stay in this browser only. They are not in your progress, backups or GitHub gist, so add them again on each device.</li>
        <li>Your answers are sent to the provider only when you click “Get AI feedback” or use the AI interviewer.</li>
        <li>Free tiers have daily limits. If you hit one, switch the provider above and keep practising.</li>
      </ul>
    </section>
  )
}
