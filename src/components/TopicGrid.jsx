import { celebrate, useStore } from '../store.jsx'
import { Check } from './ui.jsx'

/** Checklist of [id, name] topics stored under state[storeKey]. */
export default function TopicGrid({ topics, storeKey, xp = 15 }) {
  const { state, act } = useStore()
  const toggle = (id, name) => {
    const was = !!state[storeKey][id]
    act((s) => { s[storeKey][id] = !was }, { xp: was ? -xp : xp, reason: was ? '' : name })
    if (!was) celebrate()
  }
  return (
    <div className="check-grid">
      {topics.map(([id, name]) => {
        const on = !!state[storeKey][id]
        return (
          <div key={id} className={`check-item ${on ? 'on' : ''}`} onClick={() => toggle(id, name)} role="checkbox" aria-checked={on} tabIndex={0}
            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(id, name) } }}>
            <Check on={on} small />
            <div className="ci-text">{name}</div>
          </div>
        )
      })}
    </div>
  )
}
