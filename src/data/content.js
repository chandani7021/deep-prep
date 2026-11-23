// ---------------------------------------------------------------------------
// 90-day plan
// ---------------------------------------------------------------------------
export const MONTHS = [
  {
    n: 1, name: 'Foundations', days: '1–30',
    goals: [
      'Solve ~60 problems across the first 7 patterns',
      'Explain every system design building block without notes',
      'Finish Andrew Ng ML Specialization Course 1 and most of Course 2',
      'Answer “what happens when you type a URL” end to end',
    ],
  },
  {
    n: 2, name: 'Depth', days: '31–60',
    goals: [
      'Reach ~120 problems total, including trees, graphs, heaps and backtracking',
      'Design 6 classic systems out loud, start to finish',
      'Understand attention and transformers well enough to teach them',
      'Start the RAG project and do your first 4 mock interviews',
    ],
  },
  {
    n: 3, name: 'Interview mode', days: '61–90',
    goals: [
      'Reach 170+ problems with DP, greedy and intervals done',
      'Design 10+ systems, including 2 AI/ML systems',
      'Ship the RAG project with an evaluation write-up',
      'Write 8 STAR stories and do 6+ mock interviews',
    ],
  },
]

export const WEEKS = [
  { n: 1, dsa: 'Arrays & Hashing, Two Pointers', sd: 'Scaling basics: vertical vs horizontal, load balancers, stateless services', ai: 'ML Specialization C1: linear regression, cost function, gradient descent', fund: 'HTTP, DNS, what happens when you type a URL' },
  { n: 2, dsa: 'Sliding Window, Stack', sd: 'Caching: CDN, cache-aside vs write-through, eviction, invalidation', ai: 'Logistic regression, overfitting, regularization', fund: 'TCP vs UDP, TLS handshake, HTTP/2 and HTTP/3' },
  { n: 3, dsa: 'Binary Search, Linked List', sd: 'Databases: SQL vs NoSQL, indexing, replication', ai: 'ML Specialization C2: neural network basics, evaluation metrics', fund: 'Transactions, ACID, isolation levels' },
  { n: 4, dsa: 'Prefix Sum + month 1 review, first timed sessions', sd: 'Sharding, CAP & PACELC, consistency models, message queues', ai: 'Decision trees, ensembles, bias-variance. Month 1 recap', fund: 'Index internals: B-trees vs LSM trees' },
  { n: 5, dsa: 'Trees part 1 (traversals, depth, BST basics)', sd: 'Design: URL shortener, rate limiter', ai: 'Karpathy: building micrograd (backprop from scratch)', fund: 'Processes vs threads, context switching' },
  { n: 6, dsa: 'Trees part 2, Tries', sd: 'Design: notification system, key-value store', ai: 'Karpathy: makemore 1–2, embeddings', fund: 'Concurrency: locks, mutexes, semaphores. First mock interview' },
  { n: 7, dsa: 'Heap / Top-K, Backtracking', sd: 'Design: news feed, chat system', ai: 'Illustrated Transformer, attention mechanism', fund: 'Deadlocks, virtual memory, paging' },
  { n: 8, dsa: 'Graphs, Union-Find, Topological sort', sd: 'Design: file storage (Dropbox), search autocomplete', ai: 'Karpathy: Let’s build GPT. Start the RAG project', fund: 'CPU scheduling, memory hierarchy and caching' },
  { n: 9, dsa: '1-D Dynamic Programming', sd: 'Design: video streaming, unique ID generator, web crawler', ai: 'AI Engineering: prompting, RAG. Project: ingestion + retrieval', fund: 'Behavioral: write STAR stories 1–4' },
  { n: 10, dsa: '2-D Dynamic Programming, Greedy', sd: 'AI system design: RAG-based search / support bot', ai: 'Evaluation, fine-tuning vs RAG, agents. Project: eval harness', fund: 'Behavioral: write STAR stories 5–8' },
  { n: 11, dsa: 'Intervals, Math & Bits, Weighted graphs', sd: 'ML system design: recommendation system', ai: 'Designing ML Systems key chapters. Project: polish and deploy', fund: 'Two mock interviews this week' },
  { n: 12, dsa: 'Mixed timed practice, clear the review queue', sd: 'Mock system design interviews, revisit weak designs', ai: 'Project write-up, practice explaining it in 2 and 10 minutes', fund: 'Two mock interviews this week' },
  { n: 13, dsa: 'Light review of mastered patterns only', sd: 'Skim your one-page summaries', ai: 'Re-read project notes', fund: 'Rest, sleep, confidence. You did the work.' },
]

// ---------------------------------------------------------------------------
// Daily task templates (0 = Sunday ... 6 = Saturday)
// ---------------------------------------------------------------------------
export const WEEKDAY_TASKS = [
  { id: 'dsa', label: 'Solve today’s DSA problems', detail: 'Pattern of the week. 25 min per problem, then study the solution and mark it for review.', xp: 40, track: 'dsa', mins: 60 },
  { id: 'sd', label: 'System design: read + one-page summary', detail: 'Write it in your own words with a rough diagram.', xp: 30, track: 'sd', mins: 60 },
  { id: 'ai', label: 'AI/ML: study or project work', detail: 'Course videos, reading, or building.', xp: 30, track: 'ai', mins: 60 },
  { id: 'talk', label: 'Explain one solution out loud', detail: 'Two minutes, as if to an interviewer. Communication is a skill too.', xp: 10, track: 'dsa', mins: 5 },
]

export const SATURDAY_TASKS = [
  { id: 'timed', label: 'Timed DSA: 3 problems in 90 minutes', detail: 'A LeetCode contest counts too.', xp: 60, track: 'dsa', mins: 90 },
  { id: 'design', label: 'Design one full system out loud', detail: 'Requirements → estimates → API → data model → high level → deep dive.', xp: 60, track: 'sd', mins: 90 },
  { id: 'deep', label: 'AI project or CS fundamentals (2 h)', detail: 'Pick whichever is behind.', xp: 50, track: 'ai', mins: 120 },
]

export const SUNDAY_TASKS = [
  { id: 'resolve', label: 'Re-solve problems you got stuck on', detail: 'Clear your review queue first.', xp: 40, track: 'dsa', mins: 60 },
  { id: 'review', label: 'Weekly review', detail: 'Write what went well and what is weak on the Roadmap page.', xp: 30, track: 'plan', mins: 60 },
  { id: 'catchup', label: 'Catch-up or fundamentals (1 h)', detail: 'Then take the rest of the day off.', xp: 30, track: 'fund', mins: 60 },
]

export const tasksForDay = (date) => {
  const d = date.getDay()
  if (d === 6) return SATURDAY_TASKS
  if (d === 0) return SUNDAY_TASKS
  return WEEKDAY_TASKS
}

// ---------------------------------------------------------------------------
// Library: books, courses, videos, sites
// unit = what you count progress in, total = how many of them (editable)
// ---------------------------------------------------------------------------
export const RESOURCES = [
  // DSA
  { id: 'neetcode-roadmap', title: 'NeetCode Roadmap', author: 'NeetCode', type: 'Site', track: 'dsa', must: true, url: 'https://neetcode.io/roadmap', unit: 'patterns', total: 18, why: 'Pattern-ordered problems with video solutions. Use it alongside the DSA page here.' },
  { id: 'lc-patterns', title: 'LeetCode Patterns', author: 'Sean Prashad', type: 'Site', track: 'dsa', must: false, url: 'https://seanprashad.com/leetcode-patterns/', unit: 'percent', total: 100, why: 'Filter problems by pattern and company if you prefer patterns over NeetCode.' },
  { id: 'tih', title: 'Tech Interview Handbook', author: 'Yangshun Tay', type: 'Site', track: 'dsa', must: true, url: 'https://www.techinterviewhandbook.org/', unit: 'percent', total: 100, why: 'Algorithm cheatsheets, interview process, and behavioral guides in one place.' },
  { id: 'grokking-algos', title: 'Grokking Algorithms (2nd ed.)', author: 'Aditya Bhargava', type: 'Book', track: 'dsa', must: false, url: '', unit: 'chapters', total: 12, why: 'Gentle visual refresher if any fundamentals feel shaky.' },

  // System design
  { id: 'sdi-1', title: 'System Design Interview – Vol. 1', author: 'Alex Xu', type: 'Book', track: 'sd', must: true, url: 'https://bytebytego.com/', unit: 'chapters', total: 16, why: 'The main guide. Each chapter is a full interview walkthrough.' },
  { id: 'sdi-2', title: 'System Design Interview – Vol. 2', author: 'Alex Xu & Sahn Lam', type: 'Book', track: 'sd', must: false, url: 'https://bytebytego.com/', unit: 'chapters', total: 13, why: 'Harder problems: payments, stock exchange, distributed queues.' },
  { id: 'ddia', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', type: 'Book', track: 'sd', must: true, url: 'https://dataintensive.net/', unit: 'chapters', total: 12, why: 'Read chapters 5–9 (replication, partitioning, transactions, consistency) for depth.' },
  { id: 'hello-sd', title: 'Hello Interview – System Design', author: 'Hello Interview', type: 'Site', track: 'sd', must: true, url: 'https://www.hellointerview.com/learn/system-design', unit: 'percent', total: 100, why: 'Interview-shaped framework and worked problems, written by ex-FAANG interviewers.' },
  { id: 'sd-primer', title: 'The System Design Primer', author: 'Donne Martin', type: 'Site', track: 'sd', must: false, url: 'https://github.com/donnemartin/system-design-primer', unit: 'percent', total: 100, why: 'Free reference for building blocks with links to deeper reading.' },

  // AI / ML
  { id: 'ng-ml', title: 'Machine Learning Specialization', author: 'Andrew Ng (DeepLearning.AI)', type: 'Course', track: 'ai', must: true, url: 'https://www.coursera.org/specializations/machine-learning-introduction', unit: 'weeks', total: 9, why: 'Classic ML fundamentals, three courses. Month 1.' },
  { id: 'karpathy', title: 'Neural Networks: Zero to Hero', author: 'Andrej Karpathy', type: 'Video', track: 'ai', must: true, url: 'https://karpathy.ai/zero-to-hero.html', unit: 'videos', total: 8, why: 'Build backprop, language models and GPT from scratch. Month 2.' },
  { id: '3b1b', title: 'Neural Networks series', author: '3Blue1Brown', type: 'Video', track: 'ai', must: false, url: 'https://www.3blue1brown.com/topics/neural-networks', unit: 'videos', total: 7, why: 'Visual intuition for backprop, attention and transformers.' },
  { id: 'illustrated-transformer', title: 'The Illustrated Transformer', author: 'Jay Alammar', type: 'Article', track: 'ai', must: true, url: 'https://jalammar.github.io/illustrated-transformer/', unit: 'percent', total: 100, why: 'The clearest single explanation of attention.' },
  { id: 'ai-eng', title: 'AI Engineering', author: 'Chip Huyen', type: 'Book', track: 'ai', must: true, url: '', unit: 'chapters', total: 10, why: 'Building products on foundation models: RAG, evals, fine-tuning, agents. Month 3.' },
  { id: 'dmls', title: 'Designing Machine Learning Systems', author: 'Chip Huyen', type: 'Book', track: 'ai', must: false, url: '', unit: 'chapters', total: 11, why: 'ML system design interviews. Essential for ML engineer roles.' },
  { id: 'hands-on-ml', title: 'Hands-On Machine Learning (3rd ed.)', author: 'Aurélien Géron', type: 'Book', track: 'ai', must: false, url: '', unit: 'chapters', total: 19, why: 'Practical scikit-learn and deep learning reference.' },
  { id: 'fastai', title: 'Practical Deep Learning for Coders', author: 'fast.ai', type: 'Course', track: 'ai', must: false, url: 'https://course.fast.ai/', unit: 'lessons', total: 9, why: 'Top-down, code-first alternative if you learn by building.' },
  { id: 'hf-learn', title: 'Hugging Face Courses', author: 'Hugging Face', type: 'Course', track: 'ai', must: false, url: 'https://huggingface.co/learn', unit: 'percent', total: 100, why: 'Hands-on transformers, fine-tuning and tooling.' },

  // Fundamentals
  { id: 'ostep', title: 'Operating Systems: Three Easy Pieces', author: 'Remzi & Andrea Arpaci-Dusseau', type: 'Book', track: 'fund', must: true, url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', unit: 'chapters', total: 50, why: 'Free. Read virtualization and concurrency sections for interviews.' },
  { id: 'hpbn', title: 'High Performance Browser Networking', author: 'Ilya Grigorik', type: 'Book', track: 'fund', must: false, url: 'https://hpbn.co/', unit: 'chapters', total: 18, why: 'Free. TCP, TLS, HTTP/2 explained for engineers.' },
  { id: 'aposd', title: 'A Philosophy of Software Design', author: 'John Ousterhout', type: 'Book', track: 'fund', must: true, url: '', unit: 'chapters', total: 21, why: 'Short and sharp on complexity and module design. Great for design discussions.' },
  { id: 'swe-google', title: 'Software Engineering at Google', author: 'Winters, Manshreck, Wright', type: 'Book', track: 'fund', must: false, url: 'https://abseil.io/resources/swe-book', unit: 'chapters', total: 25, why: 'Free online. Engineering practice at scale.' },

  // Interviews
  { id: 'behavioral', title: 'Behavioral Interview Guide', author: 'Tech Interview Handbook', type: 'Site', track: 'fund', must: true, url: 'https://www.techinterviewhandbook.org/behavioral-interview/', unit: 'percent', total: 100, why: 'How to structure STAR stories and common questions.' },
  { id: 'interviewing-io', title: 'interviewing.io', author: 'Mock interviews', type: 'Site', track: 'fund', must: false, url: 'https://interviewing.io/', unit: 'sessions', total: 6, why: 'Anonymous mocks with real engineers.' },
  { id: 'exponent', title: 'Exponent peer mocks (formerly Pramp)', author: 'Exponent', type: 'Site', track: 'fund', must: false, url: 'https://www.tryexponent.com/practice', unit: 'sessions', total: 6, why: 'Free peer-to-peer practice interviews.' },
]

export const TRACKS = {
  dsa: { name: 'DSA', color: 'var(--c-dsa)' },
  sd: { name: 'System design', color: 'var(--c-sd)' },
  ai: { name: 'AI/ML', color: 'var(--c-ai)' },
  fund: { name: 'Fundamentals', color: 'var(--c-fund)' },
  plan: { name: 'Planning', color: 'var(--muted)' },
}

// ---------------------------------------------------------------------------
// System design
// ---------------------------------------------------------------------------
export const SD_TOPICS = [
  { id: 'framework', name: 'Interview framework', note: 'Requirements, estimates, API, data model, high level, deep dive, trade-offs' },
  { id: 'estimation', name: 'Back-of-envelope estimation', note: 'QPS, storage, bandwidth; powers of two; latency numbers' },
  { id: 'scaling', name: 'Vertical vs horizontal scaling', note: 'Stateless services, session storage' },
  { id: 'lb', name: 'Load balancing', note: 'L4 vs L7, algorithms, health checks' },
  { id: 'cache', name: 'Caching', note: 'Cache-aside, write-through/back, eviction, stampede' },
  { id: 'cdn', name: 'CDN', note: 'Push vs pull, edge caching, invalidation' },
  { id: 'sql-nosql', name: 'SQL vs NoSQL', note: 'Document, key-value, wide-column, graph; when to pick each' },
  { id: 'indexing', name: 'Database indexing', note: 'B-trees, LSM trees, composite indexes' },
  { id: 'replication', name: 'Replication', note: 'Leader-follower, multi-leader, leaderless, replication lag' },
  { id: 'sharding', name: 'Sharding & partitioning', note: 'Hash vs range, consistent hashing, hot keys' },
  { id: 'cap', name: 'CAP, PACELC & consistency', note: 'Strong, eventual, read-your-writes, quorum' },
  { id: 'queues', name: 'Message queues & streams', note: 'Kafka vs RabbitMQ/SQS, at-least-once, idempotency' },
  { id: 'api', name: 'API design', note: 'REST vs gRPC vs GraphQL, pagination, versioning' },
  { id: 'realtime', name: 'Real-time communication', note: 'Polling, long polling, WebSockets, SSE' },
  { id: 'rate-limit', name: 'Rate limiting', note: 'Token bucket, leaky bucket, sliding window' },
  { id: 'id-gen', name: 'Unique ID generation', note: 'UUID, Snowflake, ticket servers' },
  { id: 'storage', name: 'Blob/object storage', note: 'S3-style storage, chunking, presigned URLs' },
  { id: 'search', name: 'Search & indexing', note: 'Inverted index, Elasticsearch basics' },
  { id: 'observability', name: 'Observability & reliability', note: 'Metrics, logs, traces, SLOs, circuit breakers, retries' },
  { id: 'vector-db', name: 'Vector databases & embeddings', note: 'ANN indexes (HNSW), hybrid search' },
]

export const SD_PROBLEMS = [
  { id: 'url-shortener', name: 'URL shortener', level: 'Starter', week: 5 },
  { id: 'rate-limiter', name: 'Rate limiter', level: 'Starter', week: 5 },
  { id: 'notification', name: 'Notification system', level: 'Core', week: 6 },
  { id: 'kv-store', name: 'Distributed key-value store', level: 'Core', week: 6 },
  { id: 'news-feed', name: 'News feed', level: 'Core', week: 7 },
  { id: 'chat', name: 'Chat system (WhatsApp)', level: 'Core', week: 7 },
  { id: 'dropbox', name: 'File storage (Dropbox / Google Drive)', level: 'Core', week: 8 },
  { id: 'autocomplete', name: 'Search autocomplete', level: 'Core', week: 8 },
  { id: 'youtube', name: 'Video streaming (YouTube)', level: 'Advanced', week: 9 },
  { id: 'unique-id', name: 'Distributed unique ID generator', level: 'Core', week: 9 },
  { id: 'crawler', name: 'Web crawler', level: 'Advanced', week: 9 },
  { id: 'ticketmaster', name: 'Ticket booking (Ticketmaster)', level: 'Advanced', week: 10 },
  { id: 'rag-search', name: 'RAG-based document search / support bot', level: 'AI', week: 10 },
  { id: 'recsys', name: 'Recommendation system', level: 'AI', week: 11 },
  { id: 'llm-gateway', name: 'LLM gateway (routing, caching, rate limits, cost)', level: 'AI', week: 11 },
  { id: 'payments', name: 'Payment system', level: 'Advanced', week: 12 },
]

// ---------------------------------------------------------------------------
// AI / ML
// ---------------------------------------------------------------------------
export const AI_SECTIONS = [
  {
    id: 'ml', name: 'Classic ML', month: 1,
    topics: [
      ['supervised', 'Supervised vs unsupervised learning'],
      ['linreg', 'Linear regression & gradient descent'],
      ['logreg', 'Logistic regression & classification'],
      ['overfit', 'Overfitting, regularization, bias-variance'],
      ['metrics', 'Metrics: precision, recall, F1, ROC-AUC'],
      ['trees', 'Decision trees, random forests, boosting'],
      ['features', 'Feature engineering & data leakage'],
      ['clustering', 'Clustering (k-means) & dimensionality reduction (PCA)'],
    ],
  },
  {
    id: 'dl', name: 'Deep learning', month: 2,
    topics: [
      ['nn', 'Neural networks & activation functions'],
      ['backprop', 'Backpropagation (build it once by hand)'],
      ['optim', 'Optimizers: SGD, Adam; learning rate schedules'],
      ['embeddings', 'Embeddings & representation learning'],
      ['attention', 'Attention & self-attention'],
      ['transformer', 'Transformer architecture end to end'],
      ['tokenization', 'Tokenization (BPE)'],
    ],
  },
  {
    id: 'llm', name: 'LLM engineering', month: 3,
    topics: [
      ['prompting', 'Prompt engineering & structured outputs'],
      ['rag', 'RAG: chunking, embeddings, retrieval, reranking'],
      ['evals', 'Evaluation: offline evals, LLM-as-judge, golden sets'],
      ['finetune', 'Fine-tuning vs RAG vs prompting; LoRA basics'],
      ['agents', 'Tool use & agents'],
      ['serving', 'Latency, cost, caching & serving trade-offs'],
      ['safety', 'Hallucinations, guardrails & prompt injection'],
    ],
  },
  {
    id: 'mlsys', name: 'ML system design', month: 3,
    topics: [
      ['pipeline', 'Data pipelines & feature stores'],
      ['train-serve', 'Training vs serving, online vs batch inference'],
      ['drift', 'Monitoring & data drift'],
      ['abtest', 'A/B testing ML models'],
    ],
  },
]

export const PROJECT_MILESTONES = [
  { id: 'pick', label: 'Pick a dataset you care about (docs, papers, a public knowledge base)', week: 8 },
  { id: 'baseline', label: 'Baseline: answer questions with plain prompting, no retrieval', week: 8 },
  { id: 'ingest', label: 'Ingestion: load, clean and chunk documents', week: 9 },
  { id: 'embed', label: 'Embed chunks and store them in a vector index', week: 9 },
  { id: 'retrieve', label: 'Retrieval + generation with citations', week: 9 },
  { id: 'evalset', label: 'Build a golden set of 30–50 questions with expected answers', week: 10 },
  { id: 'evals', label: 'Measure retrieval quality and answer accuracy', week: 10 },
  { id: 'improve', label: 'Try one improvement (chunk size, hybrid search, reranker) and measure it', week: 10 },
  { id: 'ui', label: 'Simple UI and deploy it', week: 11 },
  { id: 'writeup', label: 'Write-up: architecture, trade-offs, numbers, what you would do next', week: 11 },
  { id: 'pitch', label: 'Practise explaining it in 2 minutes and in 10 minutes', week: 12 },
]

// ---------------------------------------------------------------------------
// CS fundamentals & behavioral
// ---------------------------------------------------------------------------
export const FUND_SECTIONS = [
  {
    id: 'net', name: 'Networking',
    topics: [
      ['url', 'What happens when you type a URL'],
      ['dns', 'DNS resolution'],
      ['tcp-udp', 'TCP vs UDP, 3-way handshake'],
      ['tls', 'TLS / HTTPS handshake'],
      ['http', 'HTTP/1.1 vs HTTP/2 vs HTTP/3'],
      ['rest', 'REST, status codes, idempotency'],
    ],
  },
  {
    id: 'os', name: 'Operating systems',
    topics: [
      ['proc-thread', 'Processes vs threads'],
      ['concurrency', 'Locks, mutexes, semaphores, race conditions'],
      ['deadlock', 'Deadlocks: conditions and prevention'],
      ['memory', 'Virtual memory, paging'],
      ['scheduling', 'CPU scheduling'],
      ['async', 'Async I/O, event loop'],
    ],
  },
  {
    id: 'db', name: 'Databases',
    topics: [
      ['acid', 'ACID transactions'],
      ['isolation', 'Isolation levels & anomalies'],
      ['idx', 'Index internals (B-tree vs LSM)'],
      ['normal', 'Normalization vs denormalization'],
      ['query', 'Query plans & N+1 problems'],
    ],
  },
  {
    id: 'design', name: 'Code design',
    topics: [
      ['solid', 'SOLID principles'],
      ['patterns', 'Common design patterns (factory, strategy, observer)'],
      ['lld', 'Low-level design: parking lot, LRU cache, elevator'],
      ['testing', 'Testing strategy: unit vs integration'],
    ],
  },
]

export const STORY_PROMPTS = [
  { id: 'impact', q: 'Your project with the biggest impact' },
  { id: 'conflict', q: 'A conflict with a teammate' },
  { id: 'failure', q: 'A time you failed or made a mistake' },
  { id: 'disagree', q: 'You disagreed with your manager or a decision' },
  { id: 'deadline', q: 'A tight deadline or competing priorities' },
  { id: 'ownership', q: 'Going beyond your role / ownership' },
  { id: 'ambiguity', q: 'Working through an ambiguous problem' },
  { id: 'helping', q: 'Helping or mentoring someone' },
]

// ---------------------------------------------------------------------------
// Gamification: depth levels (XP = metres dived)
// ---------------------------------------------------------------------------
export const LEVELS = [
  { name: 'Shoreline', at: 0 },
  { name: 'Shallows', at: 300 },
  { name: 'Reef', at: 900 },
  { name: 'Kelp forest', at: 1800 },
  { name: 'Open water', at: 3200 },
  { name: 'Twilight zone', at: 5000 },
  { name: 'Midnight zone', at: 7500 },
  { name: 'Abyss', at: 10500 },
  { name: 'Hadal trench', at: 14000 },
  { name: 'Challenger Deep', at: 18000 },
]

export const QUOTES = [
  'Small daily wins compound. Show up today.',
  'You don’t need to feel ready. You need to start the timer.',
  'Consistency beats intensity. One problem still counts.',
  'The interview is a performance. Today is a rehearsal.',
  'Patterns, not problems. Ask what this one reminds you of.',
  'If it’s hard, you’re learning. If it’s easy, go deeper.',
  'Future you is counting on today’s 60 minutes.',
  'Talk out loud. Clarity is a skill you practise.',
]
