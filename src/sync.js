// Online backup to a private GitHub Gist.
// The gist holds one file, FILE_NAME, with { app, version, savedAt, state }.
// The token and gist id are kept in this browser only.

const API = 'https://api.github.com'
export const FILE_NAME = 'deep-prep-progress.json'
const CONFIG_KEY = 'deep-prep:gist'

export const readGistConfig = () => {
  try { return JSON.parse(localStorage.getItem(CONFIG_KEY)) || null } catch { return null }
}
export const writeGistConfig = (cfg) => {
  try {
    if (cfg) localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg))
    else localStorage.removeItem(CONFIG_KEY)
  } catch { /* storage blocked */ }
}

export class SyncError extends Error {
  constructor(message, status) { super(message); this.status = status }
}

async function gh(token, path, opts = {}) {
  let res
  try {
    res = await fetch(API + path, {
      ...opts,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
      },
    })
  } catch {
    throw new SyncError('Can’t reach GitHub. Check your connection.', 0)
  }
  if (res.status === 401) throw new SyncError('GitHub rejected the token. It may have expired or been revoked: create a new one.', 401)
  if (res.status === 403 || res.status === 404) {
    const rate = res.headers.get('x-ratelimit-remaining') === '0'
    throw new SyncError(rate
      ? 'GitHub rate limit reached. Saving will resume in a while.'
      : 'The token can’t access gists. Create one with the “gist” scope (classic) or Gists read and write (fine-grained).', res.status)
  }
  if (!res.ok) throw new SyncError(`GitHub returned an error (${res.status}).`, res.status)
  return res.status === 204 ? null : res.json()
}

/** Check the token, then find the existing backup gist or create a private one. */
export async function connect(token) {
  const user = await gh(token, '/user')
  for (let page = 1; page <= 10; page++) {
    const list = await gh(token, `/gists?per_page=100&page=${page}`)
    const hit = list.find((g) => g.files && g.files[FILE_NAME])
    if (hit) return { token, id: hit.id, login: user.login, created: false }
    if (list.length < 100) break
  }
  const gist = await gh(token, '/gists', {
    method: 'POST',
    body: JSON.stringify({
      description: 'Deep Prep progress backup',
      public: false,
      files: { [FILE_NAME]: { content: JSON.stringify({ app: 'deep-prep', version: 1, savedAt: 0, state: null }) } },
    }),
  })
  return { token, id: gist.id, login: user.login, created: true }
}

/** Read the backup. Resolves { savedAt, state } (state null when empty). */
export async function pull(cfg) {
  const gist = await gh(cfg.token, `/gists/${cfg.id}`)
  const file = gist.files?.[FILE_NAME]
  if (!file) return { savedAt: 0, state: null }
  let text = file.content
  if (file.truncated && file.raw_url) {
    const raw = await fetch(file.raw_url)
    if (!raw.ok) throw new SyncError('Could not download the backup file from GitHub.', raw.status)
    text = await raw.text()
  }
  try {
    const body = JSON.parse(text)
    return { savedAt: Number(body.savedAt) || 0, state: body.state && typeof body.state === 'object' ? body.state : null }
  } catch {
    throw new SyncError('The backup gist does not contain valid progress data.', 0)
  }
}

/** Overwrite the backup with this state. */
export async function push(cfg, state, savedAt) {
  await gh(cfg.token, `/gists/${cfg.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ files: { [FILE_NAME]: { content: JSON.stringify({ app: 'deep-prep', version: 1, savedAt, state }) } } }),
  })
}

export const gistUrl = (cfg) => (cfg?.login && cfg?.id ? `https://gist.github.com/${cfg.login}/${cfg.id}` : null)
