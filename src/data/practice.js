// ---------------------------------------------------------------------------
// Interview practice: question banks, phases, interviewer follow-ups, and an
// offline (no AI, no account) analysis of a spoken or typed answer.
// ---------------------------------------------------------------------------
import { SD_PROBLEMS, STORY_PROMPTS } from './content.js'
import { PATTERNS, lcUrl } from './problems.js'

export const KINDS = {
  explain: { name: 'Explain a solution', track: 'dsa', minutes: 2 },
  coding: { name: 'Coding', track: 'dsa', minutes: 45 },
  sd: { name: 'System design', track: 'sd', minutes: 45 },
  behavioral: { name: 'Behavioral', track: 'fund', minutes: 15 },
  lld: { name: 'LLD / machine coding', track: 'lld', minutes: 45 },
  sql: { name: 'SQL', track: 'sql', minutes: 20 },
  fe: { name: 'Frontend', track: 'fe', minutes: 45 },
  product: { name: 'Product sense', track: 'product', minutes: 20 },
}

const BEHAVIORAL_EXTRA = [
  'Tell me about yourself.',
  'Why do you want to work here?',
  'Tell me about the most technically challenging project you have worked on.',
  'Tell me about a time you received critical feedback.',
  'Tell me about a time you had to learn something new quickly.',
  'Tell me about a time you made a decision with incomplete information.',
]

const BANK = {
  sd: () => SD_PROBLEMS.map((p) => `Design ${p.name.replace(/\s*\(.*\)/, '')}.`),
  behavioral: () => [...STORY_PROMPTS.map((p) => `Tell me about ${p.q.charAt(0).toLowerCase() + p.q.slice(1)}.`), ...BEHAVIORAL_EXTRA],
  lld: () => ['Design a parking lot system.', 'Design an elevator system.', 'Design Splitwise (expense sharing).', 'Design a movie ticket booking system.', 'Design an LRU cache with O(1) operations.', 'Design an in-memory rate limiter.', 'Design a vending machine.', 'Design Snake & Ladder.', 'Design a library management system.', 'Design a logging framework.'],
  sql: () => ['Find the second-highest salary in an employees table.', 'Return the top 3 products by revenue in each category.', 'Compute 7-day retention for users who signed up each day.', 'Find users who logged in on 3 or more consecutive days.', 'Compute a running total of daily sales.', 'Find the department with the highest average salary, including ties.', 'Find customers who bought product A but never product B.', 'Compute month-over-month revenue growth.'],
  fe: () => ['Build an autocomplete input with debounced search.', 'Implement debounce and throttle, and explain the difference.', 'Design a news feed with infinite scroll.', 'Implement Promise.all from scratch.', 'Explain the event loop, then predict the output of a snippet with setTimeout and promises.', 'Design the API for a reusable modal component.', 'Build a star rating component that is keyboard accessible.', 'How would you make a slow page load faster?'],
  product: () => ['How would you improve Google Maps?', 'Daily active users dropped 10% last week. How do you investigate?', 'What metrics would you track for Instagram Stories?', 'Design a product to help people prepare for job interviews.', 'Should YouTube remove the dislike count? How would you decide?', 'Pick a product you use daily. What would you build next and why?'],
}

/** Pick a question for a kind. For coding, prefers problems from patterns you have reached. */
export function pickQuestion(kind, { plan, week, state } = {}, avoid = '') {
  if (kind === 'coding' || kind === 'explain') {
    const reached = plan ? PATTERNS.filter((p) => (plan.firstWeek[p.id] || 999) <= week) : PATTERNS
    const pool = (reached.length ? reached : PATTERNS).flatMap((p) => p.problems.map(([slug, title, diff]) => ({ slug, title, diff, pattern: p.name, url: lcUrl(slug) })))
    const solved = state ? pool.filter((p) => state.problems[p.slug]?.status && state.problems[p.slug].status !== 'todo') : []
    const src = kind === 'explain' && solved.length ? solved : pool
    const options = src.filter((p) => p.title !== avoid)
    const p = options[Math.floor(Math.random() * options.length)] || src[0]
    return { text: p.title, url: p.url, meta: `${p.pattern} · ${p.diff}`, slug: p.slug }
  }
  const list = BANK[kind]().filter((q) => q !== avoid)
  return { text: list[Math.floor(Math.random() * list.length)] }
}

/** Interview phases with suggested minutes, shown alongside the timer. */
export const PHASES = {
  explain: [['Restate the problem', 0.25], ['Brute force and why it is slow', 0.25], ['The pattern / optimal idea', 0.75], ['Walk through an example', 0.4], ['Complexity and edge cases', 0.35]],
  coding: [['Clarify inputs, outputs, constraints', 5], ['Brute force, then optimal approach', 8], ['Code it, talking as you go', 20], ['Test with examples and edge cases', 7], ['Complexity and follow-ups', 5]],
  sd: [['Requirements and users', 5], ['Estimates', 5], ['API', 5], ['Data model', 5], ['High-level design', 10], ['Deep dives', 10], ['Trade-offs and wrap-up', 5]],
  behavioral: [['Situation (short)', 2], ['Task: what you owned', 2], ['Actions: what you did', 6], ['Result with numbers', 3], ['What you learned', 2]],
  lld: [['Requirements and scope', 7], ['Entities and relationships', 8], ['Class design and patterns', 12], ['Key methods / code', 13], ['Extensions and concurrency', 5]],
  sql: [['Clarify the tables and output', 3], ['Plan the joins / windows', 5], ['Write the query', 8], ['Check edge cases (NULLs, ties)', 4]],
  fe: [['Clarify requirements', 5], ['Component / API design', 10], ['Build or explain', 20], ['Accessibility, performance, edge cases', 10]],
  product: [['Clarify the goal and users', 4], ['Pick a user problem', 4], ['Solutions and prioritization', 6], ['Metrics and trade-offs', 6]],
}

/** Pushback an interviewer might give, revealed one at a time. */
export const FOLLOW_UPS = {
  explain: ['What is the space complexity, and can you reduce it?', 'What happens with an empty input?', 'Why does this approach work? Convince me.'],
  coding: ['Can you do better than that time complexity?', 'What if the input does not fit in memory?', 'How would you test this?', 'What happens with duplicates or negative numbers?', 'Can you do it in place?'],
  sd: ['Traffic just grew 10×. What breaks first?', 'How do you handle a data center going down?', 'Why that database and not another?', 'How do you keep the cache consistent?', 'What would you monitor and alert on?', 'How would you reduce cost by half?'],
  behavioral: ['What would you do differently next time?', 'What was your specific contribution versus the team’s?', 'How did you measure the result?', 'How did the other person react?'],
  lld: ['Now add a new vehicle / payment type. What changes?', 'How do you make this thread-safe?', 'Which design pattern did you use and why?', 'How would you test this class?'],
  sql: ['What if there are ties?', 'How would this perform on 1 billion rows?', 'Which index would help?', 'How do NULLs change your answer?'],
  fe: ['How does this work with a screen reader?', 'What happens on a slow network?', 'How do you avoid unnecessary re-renders?', 'How would you test this component?'],
  product: ['How would you measure success?', 'What is the biggest risk with your idea?', 'Which user segment would you start with and why?', 'What would you cut to ship in 2 weeks?'],
}

// ---------------------------------------------------------------------------
// Offline analysis: delivery (pace, fillers, length) + content checks by kind.
// It looks for words that usually appear in a strong answer; it cannot judge
// whether the content is correct (that needs a person or the AI feedback).
// ---------------------------------------------------------------------------
const FILLERS = ['um', 'uh', 'erm', 'like', 'basically', 'actually', 'you know', 'kind of', 'sort of', 'i mean', 'literally']

const CHECKS = {
  explain: [
    ['restate', 'Restated the problem', /\b(given|we need to|the problem|input|output|return)\b/, 'Open with one sentence restating the problem and the expected output.'],
    ['brute', 'Mentioned a brute force', /\b(brute|naive|nested loop|try (all|every)|simple approach|o\(n\s*\^?\s*2\)|n squared)\b/, 'Say the brute force first, and why it is too slow. It shows you can always get a working answer.'],
    ['approach', 'Named the approach or data structure', /\b(hash ?(map|set|table)|dictionary|two pointers?|sliding window|binary search|stack|queue|heap|priority queue|dfs|bfs|depth.first|breadth.first|dynamic programming|\bdp\b|memo|greedy|trie|union.find|prefix sum|backtrack|sort(ed|ing)?|graph|tree|recursion|pointer)\b/, 'Name the pattern or data structure you use and the key insight that makes it work.'],
    ['example', 'Walked through an example', /\b(example|for instance|let'?s say|suppose|walk through|e\.g\.|if the input is)\b/, 'Walk through a small example step by step; it proves the idea works.'],
    ['complexity', 'Stated time and space complexity', /(big o|o\(|time complexity|space complexity|linear|logarithmic|constant (time|space)|n log n|o of n)/, 'Always end with time and space complexity, and why.'],
    ['edge', 'Covered edge cases', /\b(edge case|empty|null|none|zero|single (element|item)|duplicate|negative|overflow|out of bounds|corner case)\b/, 'Mention 2 edge cases (empty input, duplicates, negatives…) and how your code handles them.'],
  ],
  coding: null, // same as explain plus testing
  sd: [
    ['req', 'Clarified requirements and users', /\b(requirement|functional|non.functional|users?|use case|features?|scope)\b/, 'Start with users, core features and non-functional requirements (latency, availability, consistency).'],
    ['scale', 'Estimated scale', /\b(qps|requests per second|per second|million|billion|daily active|dau|storage|terabytes?|tb|gb|bandwidth|estimate)\b/, 'Give rough numbers: users, QPS, storage. Only the ones that change the design.'],
    ['api', 'Defined an API', /\b(api|endpoint|get |post |put |rest|grpc|request|response)\b/, 'Sketch 2–3 API endpoints with inputs and outputs.'],
    ['data', 'Chose a data model / database', /\b(database|schema|table|sql|nosql|postgres|mysql|cassandra|dynamo|mongo|key.value|index|partition key)\b/, 'Say which database and why, based on the access patterns.'],
    ['hl', 'Described high-level components', /\b(load balancer|service|server|cache|redis|cdn|queue|kafka|worker|gateway|microservice)\b/, 'Describe the main components and the request flow end to end.'],
    ['scaling', 'Discussed scaling and failure', /\b(shard|partition|replica|replication|scale|horizontal|bottleneck|failover|fault|retry|consistent hashing|rate limit)\b/, 'Pick the bottleneck and explain how you scale it and what happens when a part fails.'],
    ['tradeoff', 'Named trade-offs', /\b(trade.?off|instead of|downside|cost|consistency|availability|latency vs|pros?|cons?|on the other hand)\b/, 'State at least one trade-off you made and what you gave up.'],
  ],
  behavioral: [
    ['situation', 'Set the situation briefly', /\b(when i was|at my (last|previous)|we were|our team|the project|situation|context)\b/, 'One or two sentences of context: team, project, stakes.'],
    ['i', 'Used “I” for your actions', null, 'Say what YOU did (“I proposed…”, “I built…”), not only what the team did.'],
    ['action', 'Described concrete actions', /\b(i (built|wrote|proposed|led|designed|decided|talked|reached out|created|fixed|organized|analy[sz]ed|set up|changed))\b/, 'Give 2–3 specific actions you took, in order.'],
    ['result', 'Gave a result with a number', /(\d+\s?(%|percent|x|ms|seconds|minutes|hours|days|weeks|users|customers|\$|k\b)|\b(reduced|increased|improved|saved|cut|grew)\b)/, 'End with a measurable result: %, time saved, users, revenue.'],
    ['learn', 'Shared what you learned', /\b(learn(ed|t)|next time|lesson|would do differently|takeaway|now i)\b/, 'Close with what you learned or would do differently.'],
  ],
  generic: [
    ['clarify', 'Clarified the question', /\b(clarify|assume|assumption|requirement|do we|should it|scope|constraint)\b/, 'Start by clarifying assumptions and scope.'],
    ['structure', 'Gave a structured answer', /\b(first|second|then|next|finally|step|approach)\b/, 'Signpost your structure: “First…, then…, finally…”.'],
    ['example', 'Used a concrete example', /\b(example|for instance|let'?s say|suppose|e\.g\.)\b/, 'Ground your answer in a concrete example.'],
    ['tradeoff', 'Discussed trade-offs', /\b(trade.?off|downside|instead|pros?|cons?|cost|risk)\b/, 'Name a trade-off or risk and how you would handle it.'],
    ['measure', 'Talked about testing or measuring', /\b(test|metric|measure|edge case|monitor|benchmark|success)\b/, 'Say how you would test it or measure success.'],
  ],
}
CHECKS.coding = [...CHECKS.explain, ['test', 'Talked about testing', /\b(test|assert|dry run|trace|verify|check)\b/, 'Before saying you are done, test with an example and an edge case out loud.']]
const checksFor = (kind) => CHECKS[kind] || CHECKS.generic

const TARGET_SECONDS = { explain: [60, 150] }

export function analyzeAnswer(kind, text, seconds) {
  const t = ` ${(text || '').toLowerCase().replace(/\s+/g, ' ')} `
  const words = t.trim() ? t.trim().split(' ').length : 0
  const mins = Math.max(seconds, 1) / 60
  const wpm = Math.round(words / mins)
  const fillerHits = FILLERS.map((f) => [f, (t.match(new RegExp(`\\b${f}\\b`, 'g')) || []).length]).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1])
  const fillerCount = fillerHits.reduce((a, [, n]) => a + n, 0)
  const fillerPerMin = +(fillerCount / mins).toFixed(1)

  const checks = checksFor(kind).map(([id, label, re, tip]) => {
    let hit
    if (id === 'i') {
      const i = (t.match(/\bi\b/g) || []).length
      const we = (t.match(/\bwe\b/g) || []).length
      hit = i > 0 && i >= we * 0.6
    } else hit = re.test(t)
    return { id, label, hit, tip }
  })

  const notes = []
  if (words < 25) notes.push({ good: false, text: 'Very short answer. Aim for a complete explanation, not a summary.' })
  const [lo, hi] = TARGET_SECONDS[kind] || [0, Infinity]
  if (seconds && seconds < lo) notes.push({ good: false, text: `Under ${lo} seconds: you probably skipped steps. Use the phases as a checklist.` })
  if (seconds > hi) notes.push({ good: false, text: `Over ${Math.round(hi / 60 * 10) / 10} minutes: practise cutting to the essentials.` })
  if (words >= 25 && seconds >= 10) {
    if (wpm > 185) notes.push({ good: false, text: `Fast pace (${wpm} words/min). Slow down; interviewers need time to follow.` })
    else if (wpm < 95) notes.push({ good: false, text: `Slow pace (${wpm} words/min). Long pauses are fine while thinking, but narrate what you are considering.` })
    else notes.push({ good: true, text: `Good pace (${wpm} words/min).` })
  }
  if (fillerPerMin > 6) notes.push({ good: false, text: `${fillerCount} filler words (${fillerHits.slice(0, 3).map(([f, n]) => `“${f}” ×${n}`).join(', ')}). Replace them with a short pause.` })
  else if (words >= 25) notes.push({ good: true, text: 'Few filler words.' })

  const contentScore = checks.filter((c) => c.hit).length / checks.length
  const deliveryPenalty = notes.filter((n) => !n.good).length * 0.07
  const score = Math.max(0, Math.min(100, Math.round((contentScore - deliveryPenalty) * 100)))
  return { words, wpm, fillerCount, fillerPerMin, fillerHits, checks, notes, score }
}
