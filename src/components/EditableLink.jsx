import { useState } from 'react'
import { ExternalLink, Pencil, RotateCcw } from 'lucide-react'
import { useStore } from '../store.jsx'

/** The link to open: your replacement if you saved one, otherwise the original. */
export const linkFor = (state, key, fallback) => (key && state.linkOverrides?.[key]) || fallback || ''

/** Accepts "example.com/x" or a full URL; only http(s) links are allowed. */
export const cleanUrl = (raw) => {
  const v = raw.trim()
  if (!v || /\s/.test(v)) return null
  try {
    const u = new URL(/^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
    // Browsers are lenient about hosts; require a real-looking domain like example.com.
    if (!/^([a-z0-9-]+\.)+[a-z0-9-]{2,}$/i.test(u.hostname)) return null
    return u.href
  } catch {
    return null
  }
}

/**
 * An external link with a small pencil to replace it when it is broken (or add one when there is none).
 * The replacement is keyed by the original URL (or fixKey), so fixing it once fixes it everywhere it appears.
 */
export default function EditableLink({ href, fixKey, label, children, className, style, iconSize = 12 }) {
  const { state, act, toast } = useStore()
  const key = fixKey || href
  const override = key ? state.linkOverrides?.[key] : undefined
  const url = override || href
  const name = label || (typeof children === 'string' ? children : 'this resource')
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState('')
  const [err, setErr] = useState('')

  const open = () => { setVal(url || ''); setErr(''); setEditing(true) }
  const save = (e) => {
    e.preventDefault()
    const clean = cleanUrl(val)
    if (!clean) { setErr('Enter a web address, like https://example.com/page'); return }
    act((s) => {
      s.linkOverrides ||= {}
      if (clean === href) delete s.linkOverrides[key]
      else s.linkOverrides[key] = clean
    })
    setEditing(false)
    toast(href ? 'Link updated' : 'Link added')
  }
  const reset = () => {
    act((s) => { if (s.linkOverrides) delete s.linkOverrides[key] })
    setEditing(false)
    toast('Back to the original link')
  }

  if (editing) {
    return (
      <form className="link-edit" onSubmit={save} onClick={(e) => e.stopPropagation()}>
        <span className="small" style={{ fontWeight: 600 }}>{name}</span>
        <input className="input" autoFocus value={val} placeholder="Paste a working link: https://…" aria-label={`New link for ${name}`}
          onChange={(e) => { setVal(e.target.value); setErr('') }} onKeyDown={(e) => { if (e.key === 'Escape') setEditing(false) }} />
        <div className="row" style={{ gap: 6 }}>
          <button className="btn sm primary" type="submit">Save</button>
          <button className="btn sm" type="button" onClick={() => setEditing(false)}>Cancel</button>
          {override && href && <button className="btn sm ghost" type="button" onClick={reset}><RotateCcw size={13} /> Use original</button>}
        </div>
        {err && <span className="small" style={{ color: 'var(--warn)' }}>{err}</span>}
        {href && <span className="small dim">Original: {href}</span>}
      </form>
    )
  }

  return (
    <span className="elink">
      {url
        ? <a href={url} target="_blank" rel="noreferrer" className={className} style={style}>{children} <ExternalLink size={iconSize} /></a>
        : <span className={className} style={style}>{children}</span>}
      <button type="button" className="link-fix" onClick={(e) => { e.preventDefault(); e.stopPropagation(); open() }}
        aria-label={url ? `Replace the link for ${name}` : `Add a link for ${name}`} title={url ? 'Link broken? Replace it' : 'Add a link'}>
        <Pencil size={11} />{!url && <span>Add link</span>}
      </button>
      {override && <span className="chip" title={`Original: ${href || 'none'}`}>your link</span>}
    </span>
  )
}
