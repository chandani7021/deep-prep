import { useRef, useState } from 'react'
import { Cloud, Download, ExternalLink, RefreshCw, Upload } from 'lucide-react'
import { gistUrl } from '../sync.js'
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
