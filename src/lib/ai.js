// Optional AI feedback and AI interviewer, using your own Anthropic API key.
// The key is kept in this browser's localStorage only: it is NOT part of your
// progress, so it is never exported or synced to your GitHub gist.
// The SDK and zod are loaded only when an AI feature is used, so the rest of the app stays small.
let mods = null
const load = async () => {
  if (!mods) {
    const [{ default: Anthropic }, { betaZodOutputFormat }, { z }] = await Promise.all([
      import('@anthropic-ai/sdk'), import('@anthropic-ai/sdk/helpers/beta/zod'), import('zod'),
    ])
    mods = { Anthropic, betaZodOutputFormat, z }
  }
  return mods
}

const KEY_STORAGE = 'deep-prep:anthropic-key'
export const AI_MODEL = 'claude-opus-5-5'
// If the model declines a request, the API retries it on a fallback model it picks.
const FALLBACK = { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }

export const getAiKey = () => { try { return localStorage.getItem(KEY_STORAGE) || '' } catch { return '' } }
export const setAiKey = (k) => { try { k ? localStorage.setItem(KEY_STORAGE, k.trim()) : localStorage.removeItem(KEY_STORAGE) } catch { /* blocked */ } }
export const hasAiKey = () => !!getAiKey()

const client = async () => {
  const { Anthropic } = await load()
  return new Anthropic({ apiKey: getAiKey(), dangerouslyAllowBrowser: true })
}

/** Turn SDK errors into a sentence the user can act on. */
export function aiErrorMessage(e) {
  const Anthropic = mods?.Anthropic
  if (!Anthropic) return e?.message || 'Could not load the AI module. Check your connection.'
  if (e instanceof Anthropic.AuthenticationError) return 'Your API key was rejected. Check it in Settings → AI feedback.'
  if (e instanceof Anthropic.PermissionDeniedError) return 'This API key is not allowed to use this model.'
  if (e instanceof Anthropic.RateLimitError) return 'Rate limited or out of credit. Wait a minute, or check your Anthropic Console billing.'
  if (e instanceof Anthropic.BadRequestError) return `The request was rejected: ${e.message}`
  if (e instanceof Anthropic.APIConnectionError) return 'Could not reach the Anthropic API. Check your connection.'
  if (e instanceof Anthropic.APIError) return `Anthropic API error (${e.status}). Try again in a moment.`
  return e?.message || 'Something went wrong.'
}

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

const feedbackSchema = (z) => z.object({
  overall: z.number().describe('Overall score from 1 (weak) to 5 (strong hire signal)'),
  verdict: z.string().describe('One sentence: how this would land with a real interviewer'),
  scores: z.array(z.object({
    criterion: z.string(),
    score: z.number().describe('1 to 5'),
    note: z.string().describe('One short, specific sentence'),
  })),
  strengths: z.array(z.string()).describe('2-3 specific things done well'),
  improvements: z.array(z.string()).describe('2-4 specific, actionable fixes, most important first'),
  better_answer: z.string().describe('A concise model answer or outline the candidate could say instead'),
  follow_ups: z.array(z.string()).describe('2 follow-up questions an interviewer would likely ask next'),
})

/**
 * Score one answer (spoken transcript or typed) like an experienced interviewer.
 * `transcript` may be a single answer or a full interviewer/candidate conversation.
 */
export async function getAiFeedback({ kind, question, transcript, seconds }) {
  const { betaZodOutputFormat, z } = await load()
  const res = await (await client()).beta.messages.parse({
    model: AI_MODEL,
    max_tokens: 16000,
    ...FALLBACK,
    output_config: { effort: 'medium', format: betaZodOutputFormat(feedbackSchema(z)) },
    system: `You are an experienced software engineering interviewer giving practice feedback to a candidate preparing for interviews. Be direct, specific and kind. Judge the substance: say plainly if the approach or facts are wrong. The answer may be a speech-to-text transcript, so ignore transcription glitches and punctuation, but do comment on filler words and structure. Score on: ${RUBRIC[kind] || RUBRIC.coding}.`,
    messages: [{
      role: 'user',
      content: `Interview type: ${kind}\nQuestion: ${question}\n${seconds ? `Time taken: ${Math.round(seconds)} seconds\n` : ''}\nCandidate's answer:\n"""\n${transcript}\n"""`,
    }],
  })
  if (res.stop_reason === 'refusal') throw new Error('The model declined to review this answer. Try rephrasing it.')
  if (!res.parsed_output) throw new Error('The feedback came back incomplete. Try again.')
  return res.parsed_output
}

/**
 * One turn of the AI interviewer. `history` is a list of API messages, with assistant turns
 * kept as the full content blocks the API returned (so they can be sent back unchanged).
 * Streams the interviewer's reply text to onText and resolves with the final message.
 */
export async function interviewerTurn({ kind, question, history, onText }) {
  const stream = (await client()).beta.messages.stream({
    model: AI_MODEL,
    max_tokens: 16000,
    ...FALLBACK,
    output_config: { effort: 'low' },
    system: `You are a realistic, friendly but rigorous interviewer running a ${kind} interview for a software engineering candidate. The question is: "${question}".
Run it like a real interview: start by presenting the question briefly (one or two sentences, plus any constraints a real interviewer would give). Then respond to the candidate turn by turn: answer clarifying questions, nudge if they are stuck (a small hint, never the full solution), push back on weak points, and ask one follow-up at a time.
Keep every reply short (2–5 sentences), like speech. Do not give feedback or scores during the interview. If the candidate says they are done or asks to end, say a brief closing line.`,
    messages: history.length ? history : [{ role: 'user', content: 'Hi, I am ready to start.' }],
  })
  stream.on('text', (delta) => onText?.(delta))
  const msg = await stream.finalMessage()
  if (msg.stop_reason === 'refusal') throw new Error('The interviewer declined to continue. Start a new interview.')
  return msg
}

export const textOf = (content) => (Array.isArray(content) ? content.filter((b) => b.type === 'text').map((b) => b.text).join('') : String(content || ''))
