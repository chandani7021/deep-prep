// Optional AI feedback and AI interviewer with your own API key: Groq (free tier),
// Google Gemini (free tier) or Anthropic Claude (paid).
// Keys and settings live in this browser's localStorage only. They are NOT part of
// your progress, so they are never exported or synced to your GitHub gist.

const SETTINGS_KEY = 'deep-prep:ai'
const OLD_ANTHROPIC_KEY = 'deep-prep:anthropic-key'

export const PROVIDERS = {
  groq: {
    name: 'Groq', free: true, defaultModel: 'openai/gpt-oss-120b',
    keyUrl: 'https://console.groq.com/keys', keyHint: 'gsk_…',
    note: 'Free tier, very fast. Open models (default: gpt-oss-120b). Roughly 1,000 requests a day; check your limits in the Groq console.',
  },
  gemini: {
    name: 'Google Gemini', free: true, defaultModel: 'gemini-flash-latest',
    keyUrl: 'https://aistudio.google.com/apikey', keyHint: 'AIza…',
    note: 'Free tier with Flash models only and low daily limits. On the free tier Google may use your prompts to improve its products, and people may review them.',
  },
  anthropic: {
    name: 'Anthropic Claude', free: false, defaultModel: 'claude-opus-5-5',
    keyUrl: 'https://platform.claude.com/settings/keys', keyHint: 'sk-ant-…',
    note: 'Paid (a few cents per feedback). Strongest at judging whether a solution is actually correct.',
  },
}

const DEFAULTS = { feedbackProvider: 'groq', interviewProvider: 'groq', keys: {}, models: {} }

export function getAiSettings() {
  let s = {}
  try { s = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {} } catch { /* blocked or corrupt */ }
  const out = { ...DEFAULTS, ...s, keys: { ...(s.keys || {}) }, models: { ...(s.models || {}) } }
  try { // carry over a key saved by the previous (Anthropic-only) version
    const old = localStorage.getItem(OLD_ANTHROPIC_KEY)
    if (old && !out.keys.anthropic) { out.keys.anthropic = old; if (!s.feedbackProvider) { out.feedbackProvider = 'anthropic'; out.interviewProvider = 'anthropic' } }
  } catch { /* blocked */ }
  return out
}
export function saveAiSettings(patch) {
  const next = { ...getAiSettings(), ...patch }
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); localStorage.removeItem(OLD_ANTHROPIC_KEY) } catch { /* blocked */ }
  return next
}

const modelFor = (p, s = getAiSettings()) => s.models[p] || PROVIDERS[p].defaultModel
/** Is the provider chosen for this use ('feedback' | 'interview') ready (has a key)? */
export const aiReady = (use = 'feedback') => { const s = getAiSettings(); return !!s.keys[s[`${use}Provider`]] }
export const hasAiKey = () => aiReady('feedback') || aiReady('interview')
export const aiLabel = (use = 'feedback') => { const s = getAiSettings(); const p = s[`${use}Provider`]; return `${PROVIDERS[p].name} · ${modelFor(p, s)}` }

class AiError extends Error {}

/** Turn provider errors into a sentence the user can act on. */
export function aiErrorMessage(e) {
  if (e instanceof AiError) return e.message
  const A = anthropicMods?.Anthropic
  if (A) {
    if (e instanceof A.AuthenticationError) return 'Your Anthropic key was rejected. Check it in Settings → AI feedback.'
    if (e instanceof A.PermissionDeniedError) return 'This Anthropic key is not allowed to use this model.'
    if (e instanceof A.RateLimitError) return 'Anthropic rate limit or credit reached. Wait a minute, or check your Console billing.'
    if (e instanceof A.BadRequestError) return `The request was rejected: ${e.message}`
    if (e instanceof A.APIConnectionError) return 'Could not reach the Anthropic API. Check your connection.'
    if (e instanceof A.APIError) return `Anthropic API error (${e.status}). Try again in a moment.`
  }
  if (e instanceof TypeError) return 'Could not reach the AI provider. Check your connection.'
  return e?.message || 'Something went wrong.'
}

async function httpError(provider, res) {
  let detail = ''
  try { const j = await res.json(); detail = j?.error?.message || '' } catch { /* not JSON */ }
  const name = PROVIDERS[provider].name
  if (res.status === 401 || res.status === 403 || /api key not valid/i.test(detail)) return new AiError(`Your ${name} key was rejected. Check it in Settings → AI feedback.`)
  if (res.status === 429) return new AiError(`${name} free-tier limit reached for now. Wait a bit, or switch provider in Settings → AI feedback.`)
  if (res.status === 404) return new AiError(`${name} does not know the model “${modelFor(provider)}”. Pick another model in Settings → AI feedback.`)
  if (res.status === 400) return new AiError(`${name} rejected the request${detail ? `: ${detail}` : '.'}`)
  return new AiError(`${name} error (${res.status}). Try again in a moment.`)
}

// ---------------------------------------------------------------------------
// Shared prompts and the feedback format
// ---------------------------------------------------------------------------
const RUBRIC = {
  explain: 'problem restatement, brute force, the optimal idea and why it works, an example walkthrough, time/space complexity, edge cases, clarity and pace',
  coding: 'clarifying questions, brute force then optimal approach, correctness, code quality as described, testing, complexity, communication',
  sd: 'requirements and users, estimates, API, data model, high-level design, deep dives on bottlenecks and failures, trade-offs, communication',
  behavioral: 'STAR structure, personal ownership ("I" not only "we"), specific actions, measurable result, reflection, conciseness',
  lld: 'requirements, entities and relationships, class design and patterns, extensibility, concurrency, communication',
  sql: 'correctness of logic, joins/windows chosen, edge cases (NULLs, ties), performance awareness, communication',
  fe: 'requirements, component/API design, JavaScript/React correctness, accessibility, performance, edge cases, communication',
  product: 'goal and user clarity, problem selection, solution quality and prioritization, metrics, trade-offs, structure',
}

const FEEDBACK_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['overall', 'verdict', 'scores', 'strengths', 'improvements', 'better_answer', 'follow_ups'],
  properties: {
    overall: { type: 'number', description: 'Overall score from 1 (weak) to 5 (strong hire signal)' },
    verdict: { type: 'string', description: 'One sentence: how this would land with a real interviewer' },
    scores: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false, required: ['criterion', 'score', 'note'],
        properties: { criterion: { type: 'string' }, score: { type: 'number', description: '1 to 5' }, note: { type: 'string', description: 'One short, specific sentence' } },
      },
    },
    strengths: { type: 'array', items: { type: 'string' }, description: '2-3 specific things done well' },
    improvements: { type: 'array', items: { type: 'string' }, description: '2-4 specific, actionable fixes, most important first' },
    better_answer: { type: 'string', description: 'A concise model answer or outline the candidate could say instead' },
    follow_ups: { type: 'array', items: { type: 'string' }, description: '2 follow-up questions an interviewer would likely ask next' },
  },
}

const feedbackSystem = (kind) => `You are an experienced software engineering interviewer giving practice feedback to a candidate preparing for interviews. Be direct, specific and kind. Judge the substance: say plainly if the approach or facts are wrong. The answer may be a speech-to-text transcript, so ignore transcription glitches and punctuation, but do comment on filler words and structure. Score on: ${RUBRIC[kind] || RUBRIC.coding}.`
const feedbackUser = ({ kind, question, transcript, seconds }) => `Interview type: ${kind}\nQuestion: ${question}\n${seconds ? `Time taken: ${Math.round(seconds)} seconds\n` : ''}\nCandidate's answer:\n"""\n${transcript}\n"""`
const JSON_INSTRUCTIONS = `\n\nReply with only a JSON object matching this JSON Schema (no markdown, no extra text):\n${JSON.stringify(FEEDBACK_SCHEMA)}`

const interviewerSystem = (kind, question) => `You are a realistic, friendly but rigorous interviewer running a ${kind} interview for a software engineering candidate. The question is: "${question}".
Run it like a real interview: start by presenting the question briefly (one or two sentences, plus any constraints a real interviewer would give). Then respond to the candidate turn by turn: answer clarifying questions, nudge if they are stuck (a small hint, never the full solution), push back on weak points, and ask one follow-up at a time.
Keep every reply short (2–5 sentences), like speech. Do not give feedback or scores during the interview. If the candidate says they are done or asks to end, say a brief closing line.`

/** Make whatever came back safe to render, even if a free model bent the format a little. */
function normalizeFeedback(raw) {
  const arr = (v) => (Array.isArray(v) ? v.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))) : v ? [String(v)] : [])
  const num = (v) => Math.max(1, Math.min(5, Number(v) || 3))
  if (!raw || typeof raw !== 'object') throw new AiError('The feedback came back in an unexpected format. Try again.')
  return {
    overall: num(raw.overall),
    verdict: String(raw.verdict || ''),
    scores: (Array.isArray(raw.scores) ? raw.scores : []).map((s) => ({ criterion: String(s?.criterion || ''), score: num(s?.score), note: String(s?.note || '') })).filter((s) => s.criterion),
    strengths: arr(raw.strengths),
    improvements: arr(raw.improvements),
    better_answer: String(raw.better_answer || ''),
    follow_ups: arr(raw.follow_ups),
  }
}
function parseJson(text) {
  try { return JSON.parse(text) } catch { /* try to find the object */ }
  const m = text.match(/\{[\s\S]*\}/)
  if (m) { try { return JSON.parse(m[0]) } catch { /* fall through */ } }
  throw new AiError('The feedback came back in an unexpected format. Try again.')
}

export const textOf = (content) => (Array.isArray(content) ? content.filter((b) => b.type === 'text').map((b) => b.text).join('') : String(content || ''))

// ---------------------------------------------------------------------------
// Groq (OpenAI-compatible chat completions)
// ---------------------------------------------------------------------------
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const isGptOss = (m) => m.startsWith('openai/gpt-oss')
// Groq recommends putting all instructions in the user message for reasoning models.
const groqMessages = (system, history) => history.map((m, i) => ({ role: m.role, content: i === 0 ? `${system}\n\n${textOf(m.content)}` : textOf(m.content) }))

async function groqFeedback(args, key, model) {
  const strict = isGptOss(model)
  const body = {
    model,
    messages: groqMessages(feedbackSystem(args.kind) + (strict ? '' : JSON_INSTRUCTIONS), [{ role: 'user', content: feedbackUser(args) }]),
    response_format: strict ? { type: 'json_schema', json_schema: { name: 'feedback', strict: true, schema: FEEDBACK_SCHEMA } } : { type: 'json_object' },
    ...(isGptOss(model) ? { reasoning_effort: 'medium', include_reasoning: false } : {}),
  }
  const res = await fetch(GROQ_URL, { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) throw await httpError('groq', res)
  const j = await res.json()
  return parseJson(j.choices?.[0]?.message?.content || '')
}

async function groqInterview({ system, history, onText }, key, model) {
  const body = { model, stream: true, messages: groqMessages(system, history), ...(isGptOss(model) ? { reasoning_effort: 'low', include_reasoning: false } : {}) }
  const res = await fetch(GROQ_URL, { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) throw await httpError('groq', res)
  let text = ''
  for await (const data of sseData(res)) {
    if (data === '[DONE]') break
    let chunk
    try { chunk = JSON.parse(data) } catch { continue }
    const d = chunk.choices?.[0]?.delta?.content
    if (d) { text += d; onText?.(d) }
  }
  return text
}

/** Yield the payload of each `data:` line of a server-sent-events response. */
async function* sseData(res) {
  const reader = res.body.getReader()
  const dec = new TextDecoder()
  let buf = ''
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    let i
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim()
      buf = buf.slice(i + 1)
      if (line.startsWith('data:')) yield line.slice(5).trim()
    }
  }
}

// ---------------------------------------------------------------------------
// Google Gemini (generateContent REST)
// ---------------------------------------------------------------------------
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta'
const BLOCKED = new Set(['SAFETY', 'BLOCKLIST', 'PROHIBITED_CONTENT', 'SPII'])

async function geminiGenerate(key, model, { system, contents, json }) {
  const res = await fetch(`${GEMINI_BASE}/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      ...(json ? { generationConfig: { responseMimeType: 'application/json' } } : {}),
    }),
  })
  if (!res.ok) throw await httpError('gemini', res)
  const j = await res.json()
  if (j.promptFeedback?.blockReason) throw new AiError('Gemini declined this request. Try rephrasing, or switch provider.')
  const cand = j.candidates?.[0]
  if (cand && BLOCKED.has(cand.finishReason)) throw new AiError('Gemini declined this request. Try rephrasing, or switch provider.')
  return (cand?.content?.parts || []).filter((p) => !p.thought && p.text).map((p) => p.text).join('')
}

const geminiFeedback = async (args, key, model) => parseJson(await geminiGenerate(key, model, {
  system: feedbackSystem(args.kind) + JSON_INSTRUCTIONS,
  contents: [{ role: 'user', parts: [{ text: feedbackUser(args) }] }],
  json: true,
}))

async function geminiInterview({ system, history, onText }, key, model) {
  const contents = history.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: textOf(m.content) }] }))
  const text = await geminiGenerate(key, model, { system, contents })
  onText?.(text)
  return text
}

/** List the models this key can use for text generation (Gemini and Groq). */
export async function listModels(provider, key) {
  if (provider === 'gemini') {
    const res = await fetch(`${GEMINI_BASE}/models?pageSize=200`, { headers: { 'x-goog-api-key': key } })
    if (!res.ok) throw await httpError('gemini', res)
    const j = await res.json()
    return (j.models || []).filter((m) => (m.supportedGenerationMethods || []).includes('generateContent') && /gemini/.test(m.name)).map((m) => m.name.replace(/^models\//, ''))
  }
  if (provider === 'groq') {
    const res = await fetch('https://api.groq.com/openai/v1/models', { headers: { Authorization: `Bearer ${key}` } })
    if (!res.ok) throw await httpError('groq', res)
    const j = await res.json()
    return (j.data || []).map((m) => m.id).filter((id) => !/whisper|guard|tts|orpheus|playai/i.test(id)).sort()
  }
  return Object.keys({ 'claude-opus-5-5': 1, 'claude-sonnet-5-5': 1, 'claude-haiku-5-5': 1 })
}

// ---------------------------------------------------------------------------
// Anthropic (official SDK, loaded only when used)
// ---------------------------------------------------------------------------
let anthropicMods = null
const loadAnthropic = async () => {
  if (!anthropicMods) {
    const [{ default: Anthropic }, { betaZodOutputFormat }, { z }] = await Promise.all([
      import('@anthropic-ai/sdk'), import('@anthropic-ai/sdk/helpers/beta/zod'), import('zod'),
    ])
    anthropicMods = { Anthropic, betaZodOutputFormat, z }
  }
  return anthropicMods
}
// If Claude declines a request, the API retries it on a fallback model it picks.
const FALLBACK = { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }
const feedbackZod = (z) => z.object({
  overall: z.number(), verdict: z.string(),
  scores: z.array(z.object({ criterion: z.string(), score: z.number(), note: z.string() })),
  strengths: z.array(z.string()), improvements: z.array(z.string()), better_answer: z.string(), follow_ups: z.array(z.string()),
})

async function anthropicFeedback(args, key, model) {
  const { Anthropic, betaZodOutputFormat, z } = await loadAnthropic()
  const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true })
  const res = await client.beta.messages.parse({
    model, max_tokens: 16000, ...FALLBACK,
    output_config: { effort: 'medium', format: betaZodOutputFormat(feedbackZod(z)) },
    system: feedbackSystem(args.kind),
    messages: [{ role: 'user', content: feedbackUser(args) }],
  })
  if (res.stop_reason === 'refusal') throw new AiError('Claude declined to review this answer. Try rephrasing it.')
  if (!res.parsed_output) throw new AiError('The feedback came back incomplete. Try again.')
  return res.parsed_output
}

async function anthropicInterview({ system, history, onText }, key, model) {
  const { Anthropic } = await loadAnthropic()
  const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true })
  const stream = client.beta.messages.stream({ model, max_tokens: 16000, ...FALLBACK, output_config: { effort: 'low' }, system, messages: history })
  stream.on('text', (d) => onText?.(d))
  const msg = await stream.finalMessage()
  if (msg.stop_reason === 'refusal') throw new AiError('The interviewer declined to continue. Start a new interview.')
  return msg.content // keep full content blocks so they can be sent back unchanged
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
const pick = (use) => {
  const s = getAiSettings()
  const provider = s[`${use}Provider`]
  const key = s.keys[provider]
  if (!key) throw new AiError(`Add a ${PROVIDERS[provider].name} key in Settings → AI feedback.`)
  return { provider, key, model: modelFor(provider, s) }
}

/** Score one answer (or a whole interview transcript) like an experienced interviewer. */
export async function getAiFeedback(args) {
  const { provider, key, model } = pick('feedback')
  const raw = provider === 'groq' ? await groqFeedback(args, key, model)
    : provider === 'gemini' ? await geminiFeedback(args, key, model)
    : await anthropicFeedback(args, key, model)
  return normalizeFeedback(raw)
}

/**
 * One interviewer turn. `history` is [{ role: 'user' | 'assistant', content }]; resolves with the
 * assistant content to append (a string, or Claude's full content blocks).
 */
export async function interviewerTurn({ kind, question, history, onText }) {
  const { provider, key, model } = pick('interview')
  const msgs = history.length ? history : [{ role: 'user', content: 'Hi, I am ready to start.' }]
  const args = { system: interviewerSystem(kind, question), history: msgs, onText }
  if (provider === 'groq') return groqInterview(args, key, model)
  if (provider === 'gemini') return geminiInterview(args, key, model)
  return anthropicInterview(args, key, model)
}
