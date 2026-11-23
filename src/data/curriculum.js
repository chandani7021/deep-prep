// ---------------------------------------------------------------------------
// Curriculum: an ordered list of modules per area.
// buildPlan() spreads each area's modules across however many weeks you pick.
//
// Module fields
//   id, title       stable id + short name
//   outcome         what you can do when the module is done
//   topics          what to learn (strings; DevOps uses [id, text] so they can be checked off)
//   practice        hands-on work for the week
//   links           best resources for this module: [title, url]
//   patterns        (DSA) pattern ids from problems.js scheduled with this module
//   designs         (System design) practice design ids from content.js
//   milestones      (AI/ML, DevOps) project milestone ids
//   hours           rough effort at the default pace
// ---------------------------------------------------------------------------

export const AREAS = [
  { id: 'dsa', name: 'DSA', blurb: 'Patterns, ~150 LeetCode problems, spaced repetition' },
  { id: 'sd', name: 'System design', blurb: 'Building blocks, then 16 full designs out loud' },
  { id: 'ai', name: 'AI/ML', blurb: 'Classic ML → deep learning → LLM apps, plus a RAG project' },
  { id: 'ops', name: 'DevOps & delivery', blurb: 'CI/CD, deployment, Kubernetes, IaC, database DevOps' },
  { id: 'product', name: 'Product thinking', blurb: 'Users, metrics, experiments, prioritization, product sense' },
  { id: 'fund', name: 'Fundamentals', blurb: 'Networking, OS, databases, code design, behavioral' },
]
export const AREA_IDS = AREAS.map((a) => a.id)

export const CURRICULUM = {
  // ------------------------------------------------------------------ DSA
  dsa: [
    {
      id: 'dsa-1', title: 'Arrays, hashing & two pointers', hours: 8, patterns: ['arrays-hashing', 'two-pointers'],
      outcome: 'Reach for a hash map or two pointers within a minute of reading a problem.',
      topics: ['Hash map / set for O(1) lookup, counting and grouping', 'Frequency counting and bucket sort', 'Opposite-end pointers on sorted input', 'Sort first when order does not matter (3Sum)', 'Big-O of every solution, said out loud'],
      practice: 'Solve the Arrays & Hashing and Two Pointers problems. Write each solution twice: brute force, then optimal.',
      links: [['NeetCode: Arrays & Hashing', 'https://neetcode.io/roadmap'], ['Big-O cheat sheet', 'https://www.bigocheatsheet.com/']],
    },
    {
      id: 'dsa-2', title: 'Sliding window & stacks', hours: 8, patterns: ['sliding-window', 'stack'],
      outcome: 'Write the expand/shrink window template and a monotonic stack from memory.',
      topics: ['Fixed vs variable window', 'Window state with a counter or map', 'Valid-parentheses style stack problems', 'Monotonic stack for next greater / smaller element', 'Stack-based expression evaluation'],
      practice: 'Solve the Sliding Window and Stack problems. Keep a one-line template for each in your notes.',
      links: [['Sliding window patterns (LeetCode discuss)', 'https://leetcode.com/discuss/study-guide/1773891/sliding-window-technique-and-question-bank'], ['Tech Interview Handbook: arrays', 'https://www.techinterviewhandbook.org/algorithms/array/']],
    },
    {
      id: 'dsa-3', title: 'Binary search & linked lists', hours: 8, patterns: ['binary-search', 'linked-list'],
      outcome: 'Binary search on the answer, and pointer surgery on lists without bugs.',
      topics: ['Lower/upper bound template (lo < hi)', 'Binary search on a rotated array', 'Binary search on the answer space', 'Reverse, merge and reorder lists', 'Fast/slow pointers: cycle, middle'],
      practice: 'Solve the Binary Search and Linked List problems. Draw the pointers on paper for every list problem.',
      links: [['Binary search template (LeetCode)', 'https://leetcode.com/discuss/study-guide/786126/python-powerful-ultimate-binary-search-template-solved-many-problems'], ['VisuAlgo: linked lists', 'https://visualgo.net/en/list']],
    },
    {
      id: 'dsa-4', title: 'Prefix sums & first timed sessions', hours: 6, patterns: ['prefix-sum'],
      outcome: 'Solve a medium in 25 minutes under a timer, talking through it.',
      topics: ['1-D and 2-D prefix sums', 'Prefix sum + hash map (subarray sum = k)', 'Difference arrays for range updates', 'Timed practice: 25 min per medium'],
      practice: 'Solve the Prefix Sum problems, then do one 90-minute timed set of 3 mixed problems from earlier modules.',
      links: [['LeetCode weekly contest', 'https://leetcode.com/contest/']],
    },
    {
      id: 'dsa-5', title: 'Trees', hours: 10, patterns: ['trees'],
      outcome: 'Pick DFS vs BFS on purpose and write both recursively and iteratively.',
      topics: ['Pre/in/post-order DFS', 'Level-order BFS with a queue', 'Return values up the recursion (height, diameter)', 'BST properties and validation', 'Lowest common ancestor', 'Serialize / deserialize'],
      practice: 'Solve the Trees problems. For three of them, write both the recursive and iterative version.',
      links: [['VisuAlgo: BST', 'https://visualgo.net/en/bst'], ['Tech Interview Handbook: trees', 'https://www.techinterviewhandbook.org/algorithms/tree/']],
    },
    {
      id: 'dsa-6', title: 'Tries', hours: 4, patterns: ['tries'],
      outcome: 'Implement a trie with insert, search and prefix search in 10 minutes.',
      topics: ['Trie node structure (map vs array of 26)', 'Prefix search and autocomplete', 'Trie + DFS (word search II)'],
      practice: 'Solve the Tries problems. Implement the trie from scratch each time, no copy-paste.',
      links: [['Trie (Wikipedia)', 'https://en.wikipedia.org/wiki/Trie']],
    },
    {
      id: 'dsa-7', title: 'Heaps & top-K', hours: 6, patterns: ['heap'],
      outcome: 'Know when a heap beats sorting, and use two heaps for running medians.',
      topics: ['Min-heap vs max-heap (negate in Python)', 'Top-K with a size-K heap', 'Merge K sorted lists', 'Two heaps for the median', 'Scheduling with a heap'],
      practice: 'Solve the Heap problems. State the time complexity before coding each one.',
      links: [['VisuAlgo: heap', 'https://visualgo.net/en/heap']],
    },
    {
      id: 'dsa-8', title: 'Backtracking', hours: 8, patterns: ['backtracking'],
      outcome: 'Write choose/explore/un-choose for subsets, permutations and combinations.',
      topics: ['Decision tree drawing before coding', 'Subsets, permutations, combinations', 'Pruning and skipping duplicates', 'Grid backtracking (word search, N-Queens)'],
      practice: 'Solve the Backtracking problems. Draw the recursion tree for the first two.',
      links: [['Backtracking template (LeetCode)', 'https://leetcode.com/problems/permutations/solutions/18239/a-general-approach-to-backtracking-questions-in-java-subsets-permutations-combination-sum-palindrome-partioning/']],
    },
    {
      id: 'dsa-9', title: 'Graphs & union-find', hours: 10, patterns: ['graphs', 'union-find'],
      outcome: 'Model a problem as a graph and choose BFS, DFS, topo sort or union-find.',
      topics: ['Adjacency list vs matrix vs grid', 'BFS for shortest path in unweighted graphs', 'DFS for islands / connected components', 'Topological sort (Kahn’s algorithm) and cycle detection', 'Union-find with path compression and union by rank'],
      practice: 'Solve the Graphs and Union-Find problems. Say which graph type each one is before coding.',
      links: [['VisuAlgo: graph traversal', 'https://visualgo.net/en/dfsbfs'], ['Tech Interview Handbook: graphs', 'https://www.techinterviewhandbook.org/algorithms/graph/']],
    },
    {
      id: 'dsa-10', title: '1-D dynamic programming', hours: 10, patterns: ['dp-1d'],
      outcome: 'Go from recursion → memoization → bottom-up table on any 1-D DP.',
      topics: ['Define the state and recurrence in words first', 'Top-down memoization', 'Bottom-up tabulation and space optimization', 'Classic shapes: climbing stairs, house robber, LIS, word break'],
      practice: 'Solve the 1-D DP problems. For each, write the recurrence as a comment before any code.',
      links: [['DP patterns (LeetCode discuss)', 'https://leetcode.com/discuss/study-guide/458695/dynamic-programming-patterns'], ['MIT 6.006 DP lectures', 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/']],
    },
    {
      id: 'dsa-11', title: '2-D DP & greedy', hours: 10, patterns: ['dp-2d', 'greedy'],
      outcome: 'Handle grid/string DP and justify when greedy is safe.',
      topics: ['Grid paths and edit distance', 'LCS and knapsack shapes', 'Greedy choice + exchange argument', 'Jump game, gas station style problems'],
      practice: 'Solve the 2-D DP and Greedy problems. For each greedy one, write why the greedy choice is safe.',
      links: [['Greedy vs DP (CP-Algorithms)', 'https://cp-algorithms.com/']],
    },
    {
      id: 'dsa-12', title: 'Intervals, bits & weighted graphs', hours: 8, patterns: ['intervals', 'math-bits', 'adv-graphs'],
      outcome: 'Close the remaining gaps: intervals, bit tricks, Dijkstra and MST.',
      topics: ['Sort by start, merge / insert intervals', 'Meeting rooms with a heap', 'XOR tricks and bit counting', 'Matrix rotation and spiral order', 'Dijkstra with a heap; Prim / Kruskal for MST'],
      practice: 'Solve the Intervals, Math & Bits and Weighted Graphs problems, then clear your review queue.',
      links: [['CP-Algorithms: Dijkstra', 'https://cp-algorithms.com/graph/dijkstra.html']],
    },
  ],

  // ------------------------------------------------------------------ System design
  sd: [
    {
      id: 'sd-1', title: 'The framework & scaling basics', hours: 6,
      outcome: 'Run the 7-step framework and do back-of-envelope estimates without notes.',
      topics: ['Requirements → estimates → API → data model → high level → deep dive → trade-offs', 'QPS, storage and bandwidth estimation', 'Latency numbers every engineer should know', 'Vertical vs horizontal scaling, stateless services', 'Load balancers: L4 vs L7, algorithms, health checks'],
      practice: 'Write a one-page summary of the framework. Estimate storage and QPS for Twitter and for WhatsApp.',
      links: [['Hello Interview: delivery framework', 'https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery'], ['Latency numbers', 'https://gist.github.com/jboner/2841832']],
    },
    {
      id: 'sd-2', title: 'Caching & CDNs', hours: 5,
      outcome: 'Choose a caching strategy and explain invalidation and stampedes.',
      topics: ['Cache-aside, write-through, write-back', 'Eviction: LRU, LFU, TTLs', 'Cache stampede and hot keys', 'CDN push vs pull, edge caching', 'Redis data structures you would actually use'],
      practice: 'Add a cache layer to a design you know. Write where it sits, what is cached, and how it is invalidated.',
      links: [['System Design Primer: cache', 'https://github.com/donnemartin/system-design-primer#cache'], ['Redis docs: data types', 'https://redis.io/docs/latest/develop/data-types/']],
    },
    {
      id: 'sd-3', title: 'Databases: models, indexes, replication', hours: 6,
      outcome: 'Pick SQL vs NoSQL from access patterns and explain replication lag.',
      topics: ['Relational vs document vs key-value vs wide-column vs graph', 'B-tree vs LSM-tree indexes, composite indexes', 'Leader-follower, multi-leader and leaderless replication', 'Read replicas and read-your-writes'],
      practice: 'Read DDIA chapters 2–3 and 5. Summarize each in one page with a diagram.',
      links: [['Designing Data-Intensive Applications', 'https://dataintensive.net/'], ['Use The Index, Luke', 'https://use-the-index-luke.com/']],
    },
    {
      id: 'sd-4', title: 'Sharding, consistency & queues', hours: 6,
      outcome: 'Shard a dataset, defend a consistency model and use a queue correctly.',
      topics: ['Hash vs range partitioning, consistent hashing', 'Hot partitions and resharding', 'CAP and PACELC; strong vs eventual consistency; quorums', 'Kafka vs SQS/RabbitMQ; at-least-once and idempotency', 'Outbox pattern and exactly-once myths'],
      practice: 'Read DDIA chapters 6 and 9 (skim). Explain consistent hashing to a rubber duck in 3 minutes.',
      links: [['Consistent hashing (ByteByteGo)', 'https://bytebytego.com/courses/system-design-interview/design-consistent-hashing'], ['Kafka docs: design', 'https://kafka.apache.org/documentation/#design']],
    },
    {
      id: 'sd-5', title: 'APIs, rate limiting & IDs', hours: 6, designs: ['url-shortener', 'rate-limiter', 'unique-id'],
      outcome: 'Design your first three systems end to end in 45 minutes each.',
      topics: ['REST vs gRPC vs GraphQL; pagination and versioning', 'Token bucket, leaky bucket, sliding window', 'Snowflake IDs vs UUIDs vs ticket servers', 'Polling, long polling, WebSockets, SSE'],
      practice: 'Design the URL shortener, rate limiter and unique ID generator out loud, timed.',
      links: [['System Design Interview Vol. 1, ch. 4, 7, 8', 'https://bytebytego.com/'], ['Hello Interview: URL shortener', 'https://www.hellointerview.com/learn/system-design/problem-breakdowns/bitly']],
    },
    {
      id: 'sd-6', title: 'Notifications & key-value stores', hours: 6, designs: ['notification', 'kv-store'],
      outcome: 'Design fan-out systems and a Dynamo-style store.',
      topics: ['Push vs pull delivery, retries, dedup', 'Template, preference and rate-limit services', 'Dynamo: partitioning, replication, vector clocks, hinted handoff', 'Gossip and failure detection'],
      practice: 'Design both systems out loud. Rate your confidence 1–5 on the System design page.',
      links: [['Amazon Dynamo paper', 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf']],
    },
    {
      id: 'sd-7', title: 'News feed & chat', hours: 6, designs: ['news-feed', 'chat'],
      outcome: 'Handle fan-out-on-write vs read and real-time delivery at scale.',
      topics: ['Fan-out on write vs read; celebrity problem', 'Feed ranking and caching', 'WebSocket gateways and presence', 'Message ordering, delivery receipts, offline sync'],
      practice: 'Design both systems out loud, then redo whichever felt weaker the next day.',
      links: [['Hello Interview: WhatsApp', 'https://www.hellointerview.com/learn/system-design/problem-breakdowns/whatsapp']],
    },
    {
      id: 'sd-8', title: 'File storage & autocomplete', hours: 6, designs: ['dropbox', 'autocomplete'],
      outcome: 'Design blob storage with chunking and a low-latency typeahead.',
      topics: ['Chunking, dedup and resumable uploads', 'Presigned URLs and object storage', 'Sync conflicts and metadata DB', 'Trie vs precomputed top-K for autocomplete'],
      practice: 'Design both systems. Draw the upload path and the read path separately.',
      links: [['Hello Interview: Dropbox', 'https://www.hellointerview.com/learn/system-design/problem-breakdowns/dropbox']],
    },
    {
      id: 'sd-9', title: 'Video, crawlers & bookings', hours: 8, designs: ['youtube', 'crawler', 'ticketmaster'],
      outcome: 'Handle large media pipelines, politeness at scale, and contention for scarce seats.',
      topics: ['Transcoding pipeline and adaptive bitrate streaming', 'URL frontier, politeness, dedup in crawlers', 'Seat reservation with locks / TTL holds', 'Virtual waiting rooms for traffic spikes'],
      practice: 'Design all three. For Ticketmaster, write how you prevent double booking.',
      links: [['Hello Interview: Ticketmaster', 'https://www.hellointerview.com/learn/system-design/problem-breakdowns/ticketmaster']],
    },
    {
      id: 'sd-10', title: 'AI & ML systems', hours: 8, designs: ['rag-search', 'llm-gateway', 'recsys'],
      outcome: 'Design LLM-powered and recommendation systems with evaluation built in.',
      topics: ['RAG architecture: ingestion, embeddings, vector index, reranking', 'LLM gateway: routing, caching, rate limits, cost tracking', 'Candidate generation → ranking → re-ranking', 'Online vs offline evaluation, feedback loops'],
      practice: 'Design all three out loud. Include an evaluation plan in each.',
      links: [['Designing Machine Learning Systems', 'https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/'], ['Eugene Yan: patterns for LLM systems', 'https://eugeneyan.com/writing/llm-patterns/']],
    },
    {
      id: 'sd-11', title: 'Payments, reliability & mock designs', hours: 8, designs: ['payments'],
      outcome: 'Design for correctness under failure and pass a full mock design round.',
      topics: ['Idempotency keys, double-entry ledgers, reconciliation', 'Retries with backoff, circuit breakers, bulkheads', 'SLOs, error budgets and graceful degradation', 'Multi-region active-active vs active-passive'],
      practice: 'Design the payment system, then do two mock design interviews and redo your weakest design.',
      links: [['System Design Interview Vol. 2: payments', 'https://bytebytego.com/'], ['Google SRE book: handling overload', 'https://sre.google/sre-book/handling-overload/']],
    },
  ],

  // ------------------------------------------------------------------ AI / ML
  ai: [
    {
      id: 'ai-1', title: 'ML foundations: regression', hours: 8,
      outcome: 'Derive and code linear regression with gradient descent.',
      topics: ['Supervised vs unsupervised learning', 'Linear regression and the cost function', 'Gradient descent and learning rate', 'Feature scaling'],
      practice: 'ML Specialization Course 1, weeks 1–2. Implement gradient descent in NumPy.',
      links: [['Machine Learning Specialization', 'https://www.coursera.org/specializations/machine-learning-introduction']],
    },
    {
      id: 'ai-2', title: 'Classification & evaluation', hours: 8,
      outcome: 'Choose the right metric for a business problem and explain why.',
      topics: ['Logistic regression and decision boundaries', 'Overfitting and regularization', 'Precision, recall, F1, ROC-AUC, PR-AUC', 'Train / validation / test splits and cross-validation'],
      practice: 'Course 1 week 3 + Course 2 evaluation. Train a classifier in scikit-learn on a real dataset and report 3 metrics.',
      links: [['scikit-learn: model evaluation', 'https://scikit-learn.org/stable/modules/model_evaluation.html'], ['Google ML crash course', 'https://developers.google.com/machine-learning/crash-course']],
    },
    {
      id: 'ai-3', title: 'Trees, ensembles & unsupervised', hours: 8,
      outcome: 'Explain why gradient boosting wins on tabular data.',
      topics: ['Decision trees, random forests, gradient boosting (XGBoost / LightGBM)', 'Bias-variance trade-off', 'Feature engineering and data leakage', 'k-means and PCA'],
      practice: 'Finish Course 2 and the trees part of Course 3. Enter a Kaggle playground competition with a boosted model.',
      links: [['Kaggle Learn: intermediate ML', 'https://www.kaggle.com/learn/intermediate-machine-learning'], ['StatQuest: gradient boost', 'https://www.youtube.com/@statquest']],
    },
    {
      id: 'ai-4', title: 'Neural networks & backprop', hours: 8,
      outcome: 'Build backprop from scratch and explain every line.',
      topics: ['Neurons, activations, loss functions', 'Computational graphs and the chain rule', 'Backpropagation by hand', 'Optimizers: SGD, momentum, Adam'],
      practice: 'Karpathy “Building micrograd”. Re-implement it without looking.',
      links: [['Neural Networks: Zero to Hero', 'https://karpathy.ai/zero-to-hero.html'], ['3Blue1Brown: neural networks', 'https://www.3blue1brown.com/topics/neural-networks']],
    },
    {
      id: 'ai-5', title: 'Embeddings & language models', hours: 8,
      outcome: 'Train a small character-level language model.',
      topics: ['Bigram models and sampling', 'Embeddings and representation learning', 'MLP language models, batch norm', 'Tokenization (BPE)'],
      practice: 'Karpathy makemore parts 1–3 and the tokenizer video.',
      links: [['Karpathy: makemore', 'https://karpathy.ai/zero-to-hero.html']],
    },
    {
      id: 'ai-6', title: 'Attention & transformers', hours: 10,
      outcome: 'Teach the transformer architecture on a whiteboard.',
      topics: ['Self-attention, queries / keys / values', 'Multi-head attention and positional encoding', 'Decoder-only transformers (GPT)', 'Pre-training vs fine-tuning vs RLHF at a high level'],
      practice: 'Read The Illustrated Transformer, then Karpathy “Let’s build GPT”.',
      links: [['The Illustrated Transformer', 'https://jalammar.github.io/illustrated-transformer/'], ['Karpathy: Let’s build GPT', 'https://karpathy.ai/zero-to-hero.html']],
    },
    {
      id: 'ai-7', title: 'LLM apps: prompting & RAG', hours: 10, milestones: ['pick', 'baseline', 'ingest', 'embed', 'retrieve'],
      outcome: 'Ship a working RAG prototype that cites its sources.',
      topics: ['Prompt engineering and structured outputs', 'Chunking strategies', 'Embedding models and vector indexes (HNSW)', 'Hybrid search and reranking'],
      practice: 'AI Engineering ch. 5–6. Build the RAG project milestones through retrieval with citations.',
      links: [['AI Engineering (Chip Huyen)', 'https://www.oreilly.com/library/view/ai-engineering/9781098166298/'], ['Anthropic: prompt engineering', 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview']],
    },
    {
      id: 'ai-8', title: 'Evals & fine-tuning', hours: 10, milestones: ['evalset', 'evals', 'improve'],
      outcome: 'Measure quality with numbers and decide fine-tune vs RAG vs prompt.',
      topics: ['Golden sets and offline evals', 'LLM-as-judge and its pitfalls', 'Retrieval metrics: recall@k, MRR', 'Fine-tuning vs RAG vs prompting; LoRA'],
      practice: 'Build a 30–50 question golden set, measure, then try one improvement and re-measure.',
      links: [['Hamel Husain: your AI product needs evals', 'https://hamel.dev/blog/posts/evals/'], ['Hugging Face: PEFT / LoRA', 'https://huggingface.co/docs/peft/index']],
    },
    {
      id: 'ai-9', title: 'Agents, serving & safety', hours: 8, milestones: ['ui'],
      outcome: 'Explain tool use, latency/cost trade-offs and prompt-injection defenses.',
      topics: ['Tool use and agent loops; MCP', 'Latency, cost, caching and batching', 'Guardrails, hallucinations and prompt injection', 'Deploying a model-backed app'],
      practice: 'Add a simple UI to the project and deploy it (use the DevOps module’s pipeline if you have it).',
      links: [['Anthropic: building effective agents', 'https://www.anthropic.com/engineering/building-effective-agents'], ['OWASP Top 10 for LLM apps', 'https://genai.owasp.org/llm-top-10/']],
    },
    {
      id: 'ai-10', title: 'ML system design & project story', hours: 8, milestones: ['writeup', 'pitch'],
      outcome: 'Answer an ML system design round and pitch your project in 2 and 10 minutes.',
      topics: ['Data pipelines and feature stores', 'Training vs serving, online vs batch inference', 'Monitoring and data drift', 'A/B testing models'],
      practice: 'Designing ML Systems key chapters. Write the project write-up and rehearse the pitch.',
      links: [['Designing Machine Learning Systems', 'https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/'], ['ML system design case studies (Evidently)', 'https://www.evidentlyai.com/ml-system-design']],
    },
  ],

  // ------------------------------------------------------------------ DevOps & delivery
  ops: [
    {
      id: 'ops-1', title: 'Git workflows & delivery basics', hours: 5, milestones: ['repo'],
      outcome: 'Explain trunk-based development, code review flow and the DORA metrics.',
      topics: [
        ['git-flow', 'Trunk-based development vs GitFlow; short-lived branches'],
        ['git-rebase', 'Rebase vs merge, squash, cherry-pick, bisect'],
        ['pr-review', 'Pull requests, code owners, branch protection'],
        ['dora', 'DORA metrics: lead time, deploy frequency, change failure rate, MTTR'],
        ['semver', 'Semantic versioning, tags and changelogs'],
      ],
      practice: 'Put this tracker in a GitHub repo with branch protection on main and a PR template.',
      links: [['Pro Git (free book)', 'https://git-scm.com/book/en/v2'], ['Trunk-based development', 'https://trunkbaseddevelopment.com/'], ['DORA research', 'https://dora.dev/']],
    },
    {
      id: 'ops-2', title: 'Continuous integration', hours: 6, milestones: ['ci'],
      outcome: 'Build a fast CI pipeline with caching, tests and required checks.',
      topics: [
        ['ci-stages', 'Pipeline stages: lint → test → build → package'],
        ['gha', 'GitHub Actions: workflows, jobs, matrices, reusable workflows'],
        ['ci-cache', 'Dependency caching and build artifacts'],
        ['test-pyramid', 'Test pyramid; flaky tests and how to quarantine them'],
        ['ci-alt', 'How GitLab CI / Jenkins / CircleCI map to the same ideas'],
      ],
      practice: 'Add a CI workflow that runs install, lint and build on every pull request, and make it a required check.',
      links: [['GitHub Actions docs', 'https://docs.github.com/en/actions'], ['Martin Fowler: continuous integration', 'https://martinfowler.com/articles/continuousIntegration.html']],
    },
    {
      id: 'ops-3', title: 'Containers & Docker', hours: 6, milestones: ['docker'],
      outcome: 'Write a small, secure, multi-stage Dockerfile and explain layers.',
      topics: [
        ['docker-basics', 'Images, containers, layers and the build cache'],
        ['docker-multistage', 'Multi-stage builds and small base images (alpine, distroless)'],
        ['docker-compose', 'Docker Compose for local dev with a database'],
        ['docker-sec', 'Non-root users, image scanning, pinning digests'],
        ['registries', 'Registries (GHCR, ECR) and image tagging strategy'],
      ],
      practice: 'Containerize the tracker with a multi-stage Dockerfile (build with Node, serve with nginx) and push it to GHCR from CI.',
      links: [['Docker: get started', 'https://docs.docker.com/get-started/'], ['Dockerfile best practices', 'https://docs.docker.com/build/building/best-practices/']],
    },
    {
      id: 'ops-4', title: 'Continuous delivery & deployment strategies', hours: 6, milestones: ['deploy'],
      outcome: 'Choose between rolling, blue-green and canary, and roll back safely.',
      topics: [
        ['cd-vs-cd', 'Continuous delivery vs continuous deployment; environments and promotion'],
        ['strategies', 'Rolling, blue-green, canary and shadow deployments'],
        ['flags', 'Feature flags and dark launches'],
        ['rollback', 'Rollback vs roll forward; immutable artifacts'],
        ['preview', 'Preview environments per pull request'],
      ],
      practice: 'Deploy the tracker automatically on merge to main, with a preview deployment for each PR.',
      links: [['Continuous Delivery (Humble & Farley)', 'https://continuousdelivery.com/'], ['Martin Fowler: blue-green deployment', 'https://martinfowler.com/bliki/BlueGreenDeployment.html']],
    },
    {
      id: 'ops-5', title: 'Kubernetes essentials', hours: 8, milestones: ['k8s'],
      outcome: 'Deploy, expose, scale and debug an app on Kubernetes.',
      topics: [
        ['k8s-objects', 'Pods, Deployments, ReplicaSets, Services, Ingress'],
        ['k8s-config', 'ConfigMaps, Secrets, resource requests and limits'],
        ['k8s-probes', 'Liveness / readiness probes and rolling updates'],
        ['k8s-scale', 'Horizontal Pod Autoscaler and cluster autoscaling'],
        ['helm', 'Helm charts and Kustomize'],
        ['k8s-debug', 'Debugging: kubectl describe, logs, exec, events'],
      ],
      practice: 'Run a local cluster (kind or minikube) and deploy the tracker image with a Deployment, Service and Ingress.',
      links: [['Kubernetes basics tutorial', 'https://kubernetes.io/docs/tutorials/kubernetes-basics/'], ['kind', 'https://kind.sigs.k8s.io/']],
    },
    {
      id: 'ops-6', title: 'Infrastructure as code & GitOps', hours: 6, milestones: ['iac'],
      outcome: 'Provision infrastructure with Terraform and deploy via GitOps.',
      topics: [
        ['tf-basics', 'Terraform: providers, resources, plan / apply'],
        ['tf-state', 'Remote state, locking and drift'],
        ['tf-modules', 'Modules and per-environment config'],
        ['gitops', 'GitOps with Argo CD or Flux: desired state in git'],
        ['cloud-basics', 'Cloud building blocks: VPC, IAM, compute, managed DB'],
      ],
      practice: 'Write Terraform for a small cloud setup (bucket + CDN or a managed Postgres), run plan in CI on PRs.',
      links: [['HashiCorp Terraform tutorials', 'https://developer.hashicorp.com/terraform/tutorials'], ['Argo CD docs', 'https://argo-cd.readthedocs.io/en/stable/']],
    },
    {
      id: 'ops-7', title: 'Database DevOps: migrations', hours: 7, milestones: ['migrations'],
      outcome: 'Ship schema changes with zero downtime through the pipeline.',
      topics: [
        ['migration-tools', 'Versioned migrations: Flyway, Liquibase, Alembic, Prisma Migrate'],
        ['expand-contract', 'Expand / contract (parallel change) for zero-downtime schema changes'],
        ['backfills', 'Safe backfills, batching and lock-aware DDL (e.g. CREATE INDEX CONCURRENTLY)'],
        ['migrations-ci', 'Running and testing migrations in CI against a real database'],
        ['db-rollback', 'Rolling back schema vs rolling forward; data migrations vs schema migrations'],
      ],
      practice: 'Build a tiny API with Postgres. Add versioned migrations, run them in CI in a Postgres service container, and do one expand/contract rename.',
      links: [['Evolutionary database design (Fowler)', 'https://martinfowler.com/articles/evodb.html'], ['Flyway docs', 'https://documentation.red-gate.com/flyway'], ['Strong Migrations (unsafe migration patterns)', 'https://github.com/ankane/strong_migrations']],
    },
    {
      id: 'ops-8', title: 'Database operations & reliability', hours: 7, milestones: ['backup'],
      outcome: 'Run a production database: backups, failover, pooling and slow-query triage.',
      topics: [
        ['backups', 'Backups, point-in-time recovery and restore drills'],
        ['db-ha', 'Replication, failover and read replicas in practice'],
        ['pooling', 'Connection pooling (PgBouncer) and connection limits'],
        ['slow-queries', 'Finding slow queries: EXPLAIN ANALYZE, pg_stat_statements'],
        ['db-secrets', 'Credentials, rotation and least privilege for databases'],
        ['db-scale', 'Vertical scaling, partitioning and when to shard'],
      ],
      practice: 'Take a backup of your Postgres, delete a table, and restore it. Time it and write the runbook.',
      links: [['Database Reliability Engineering (Campbell & Majors)', 'https://www.oreilly.com/library/view/database-reliability-engineering/9781491925935/'], ['PostgreSQL docs: backup and restore', 'https://www.postgresql.org/docs/current/backup.html']],
    },
    {
      id: 'ops-9', title: 'Observability & SRE', hours: 6, milestones: ['observe'],
      outcome: 'Define SLOs, instrument a service and run an incident.',
      topics: [
        ['three-pillars', 'Metrics, logs and traces; when each helps'],
        ['otel', 'OpenTelemetry instrumentation and collectors'],
        ['prom-grafana', 'Prometheus + Grafana dashboards'],
        ['slo', 'SLIs, SLOs, error budgets and alerting on symptoms'],
        ['incidents', 'Incident response, on-call and blameless postmortems'],
      ],
      practice: 'Add health checks and basic metrics to your API, build one dashboard and one alert, then write a mock postmortem.',
      links: [['Google SRE books (free)', 'https://sre.google/books/'], ['OpenTelemetry docs', 'https://opentelemetry.io/docs/']],
    },
    {
      id: 'ops-10', title: 'Security & supply chain', hours: 5, milestones: ['secure'],
      outcome: 'Keep secrets out of code and secure the build pipeline.',
      topics: [
        ['secrets', 'Secrets management: GitHub secrets, Vault, cloud secret managers'],
        ['oidc', 'OIDC from CI to the cloud instead of long-lived keys'],
        ['scanning', 'Dependency scanning, SAST, Dependabot / Renovate'],
        ['sbom', 'SBOMs, signing images (Sigstore / cosign), SLSA levels'],
        ['least-priv', 'Least-privilege tokens and workflow permissions'],
      ],
      practice: 'Turn on Dependabot and CodeQL for the repo, restrict workflow permissions, and remove any long-lived secrets.',
      links: [['GitHub: security hardening for Actions', 'https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions'], ['SLSA framework', 'https://slsa.dev/']],
    },
  ],

  // ------------------------------------------------------------------ Product thinking
  product: [
    {
      id: 'product-1', title: 'Users, problems & jobs to be done', hours: 4,
      outcome: 'Describe any feature as a user problem with a measurable outcome, not as a solution.',
      topics: [
        ['pm-problem', 'Problem space vs solution space'],
        ['pm-jtbd', 'Jobs to be done: what is the user “hiring” the product for?'],
        ['pm-users', 'Users vs customers vs buyers; segments and personas'],
        ['pm-engineer', 'What a product-minded engineer does differently'],
        ['pm-value', 'Value, usability, feasibility and viability risks'],
      ],
      practice: 'Pick a feature you built at work. Rewrite it as: who has the problem, how they solve it today, and how you would know it worked.',
      links: [['The product-minded software engineer (Gergely Orosz)', 'https://blog.pragmaticengineer.com/the-product-minded-engineer/'], ['Inspired (Marty Cagan)', 'https://www.svpg.com/books/inspired-how-to-create-tech-products-customers-love-2nd-edition/']],
    },
    {
      id: 'product-2', title: 'Discovery & talking to users', hours: 4,
      outcome: 'Run a user interview that produces facts, not compliments.',
      topics: [
        ['pm-mom-test', 'The Mom Test: ask about their life, not your idea'],
        ['pm-interviews', 'Continuous customer interviews and synthesis'],
        ['pm-ost', 'Opportunity solution trees'],
        ['pm-assumptions', 'Identifying and testing the riskiest assumption'],
        ['pm-prototype', 'Prototypes, fake doors and concierge tests'],
      ],
      practice: 'Interview 3 people about how they prepare for interviews. Write down 3 facts and 1 assumption you were wrong about.',
      links: [['The Mom Test (Rob Fitzpatrick)', 'https://www.momtestbook.com/'], ['Continuous Discovery Habits (Teresa Torres)', 'https://www.producttalk.org/continuous-discovery-habits/']],
    },
    {
      id: 'product-3', title: 'Metrics that matter', hours: 4,
      outcome: 'Define a north star metric, its input metrics and guardrails for any product.',
      topics: [
        ['pm-north-star', 'North star metric and input metrics'],
        ['pm-funnels', 'Funnels, activation and conversion'],
        ['pm-retention', 'Retention curves and cohorts'],
        ['pm-guardrails', 'Guardrail metrics and vanity metrics'],
        ['pm-instrument', 'Instrumenting events: what engineers should log'],
      ],
      practice: 'For a product you use daily (Spotify, Uber…), define the north star, 3 input metrics and 2 guardrails.',
      links: [['North Star Playbook (Amplitude)', 'https://amplitude.com/books/north-star'], ['Lean Analytics (Croll & Yoskovitz)', 'https://leananalyticsbook.com/']],
    },
    {
      id: 'product-4', title: 'Experiments & data-informed decisions', hours: 4,
      outcome: 'Design an A/B test and say when not to run one.',
      topics: [
        ['pm-ab', 'A/B testing: hypothesis, control, variant, success metric'],
        ['pm-stats', 'Sample size, significance and peeking'],
        ['pm-pitfalls', 'Novelty effects, network effects, Simpson’s paradox'],
        ['pm-flags', 'Feature flags and gradual rollouts as experiments'],
        ['pm-qual', 'When qualitative evidence beats an experiment'],
      ],
      practice: 'Write an experiment plan for one feature of your RAG project or this tracker: hypothesis, metric, sample size, decision rule.',
      links: [['Trustworthy Online Controlled Experiments (Kohavi et al.)', 'https://experimentguide.com/'], ['Evan Miller: sample size calculator', 'https://www.evanmiller.org/ab-testing/sample-size.html']],
    },
    {
      id: 'product-5', title: 'Prioritization, scoping & trade-offs', hours: 4,
      outcome: 'Cut scope to ship the smallest valuable thing, and defend the trade-off.',
      topics: [
        ['pm-rice', 'RICE and impact vs effort'],
        ['pm-mvp', 'MVPs, appetite and fixed time / variable scope'],
        ['pm-build-trap', 'Outcomes over output: escaping the build trap'],
        ['pm-tech-debt', 'Technical debt as a product decision'],
        ['pm-say-no', 'Saying no and negotiating scope with stakeholders'],
      ],
      practice: 'Write a one-page “shaped” pitch for a feature: problem, appetite, solution sketch, rabbit holes, no-gos.',
      links: [['Shape Up (Basecamp, free)', 'https://basecamp.com/shapeup'], ['Escaping the Build Trap (Melissa Perri)', 'https://melissaperri.com/book']],
    },
    {
      id: 'product-6', title: 'Product sense in interviews & docs', hours: 5,
      outcome: 'Open every design round with users and goals, and tell stories in business impact.',
      topics: [
        ['pm-sd', 'Start system design with users, use cases and success metrics'],
        ['pm-sense', 'Product sense questions: “how would you improve X?”'],
        ['pm-docs', 'Writing PRDs, RFCs and design docs'],
        ['pm-impact', 'Describing results in business terms (revenue, retention, cost, time)'],
        ['pm-collab', 'Working with PMs and designers: when to push back'],
      ],
      practice: 'Rewrite the Result of 3 STAR stories in business terms, and answer “how would you improve Google Maps?” out loud in 10 minutes.',
      links: [['Design docs at Google', 'https://www.industrialempathy.com/posts/design-docs-at-google/'], ['Cracking the PM Interview', 'https://www.crackingthepminterview.com/']],
    },
  ],

  // ------------------------------------------------------------------ Fundamentals
  fund: [
    {
      id: 'fund-1', title: 'The web request, end to end', hours: 4,
      outcome: 'Answer “what happens when you type a URL” in 5 confident minutes.',
      topics: ['DNS resolution and caching', 'HTTP request/response, status codes, idempotency', 'Browsers, cookies and sessions'],
      practice: 'Write your own “type a URL” answer in one page, then say it out loud.',
      links: [['What happens when… (GitHub)', 'https://github.com/alex/what-happens-when']],
    },
    {
      id: 'fund-2', title: 'Transport & security', hours: 4,
      outcome: 'Compare TCP, UDP, TLS and HTTP versions precisely.',
      topics: ['TCP vs UDP, 3-way handshake, congestion control', 'TLS handshake and certificates', 'HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)'],
      practice: 'Read High Performance Browser Networking chapters on TCP and TLS.',
      links: [['High Performance Browser Networking', 'https://hpbn.co/']],
    },
    {
      id: 'fund-3', title: 'Database internals', hours: 5,
      outcome: 'Explain isolation anomalies and index internals with examples.',
      topics: ['ACID transactions', 'Isolation levels: dirty read, non-repeatable read, phantom, write skew', 'B-tree vs LSM indexes', 'Query plans and N+1 problems', 'Normalization vs denormalization'],
      practice: 'Reproduce a non-repeatable read in Postgres with two terminals.',
      links: [['DDIA chapter 7', 'https://dataintensive.net/'], ['Use The Index, Luke', 'https://use-the-index-luke.com/']],
    },
    {
      id: 'fund-4', title: 'Processes, threads & concurrency', hours: 5,
      outcome: 'Debug a race condition and explain locks vs semaphores.',
      topics: ['Processes vs threads, context switching', 'Mutexes, semaphores, condition variables', 'Race conditions and atomic operations', 'Async I/O and the event loop'],
      practice: 'Write a tiny program with a race condition, then fix it two different ways.',
      links: [['OSTEP: concurrency', 'https://pages.cs.wisc.edu/~remzi/OSTEP/']],
    },
    {
      id: 'fund-5', title: 'Memory, scheduling & deadlocks', hours: 4,
      outcome: 'Explain virtual memory and the four deadlock conditions.',
      topics: ['Virtual memory and paging, TLB', 'CPU scheduling algorithms', 'Deadlock conditions and prevention', 'Memory hierarchy and caching'],
      practice: 'OSTEP virtualization chapters. Draw the address translation path.',
      links: [['OSTEP: virtualization', 'https://pages.cs.wisc.edu/~remzi/OSTEP/']],
    },
    {
      id: 'fund-6', title: 'Code design & low-level design', hours: 6,
      outcome: 'Solve an LLD round: classes, interfaces and trade-offs.',
      topics: ['SOLID principles', 'Factory, strategy, observer, decorator', 'LLD classics: parking lot, LRU cache, elevator', 'Testing strategy: unit vs integration'],
      practice: 'Do one LLD problem out loud: parking lot or LRU cache, with code.',
      links: [['A Philosophy of Software Design', 'https://web.stanford.edu/~ouster/cgi-bin/book.php'], ['Refactoring.Guru: design patterns', 'https://refactoring.guru/design-patterns']],
    },
    {
      id: 'fund-7', title: 'Behavioral stories, part 1', hours: 4,
      outcome: 'Four polished STAR stories with numbers.',
      topics: ['STAR structure and timing (2 minutes)', 'Impact, conflict, failure, disagreement stories', 'Quantifying results'],
      practice: 'Write STAR stories 1–4 on the Fundamentals page and record yourself telling one.',
      links: [['Tech Interview Handbook: behavioral', 'https://www.techinterviewhandbook.org/behavioral-interview/']],
    },
    {
      id: 'fund-8', title: 'Behavioral stories, part 2 & mocks', hours: 5,
      outcome: 'All STAR stories ready and two mock interviews done.',
      topics: ['Deadline, ownership, ambiguity, mentoring stories', 'Questions to ask the interviewer', 'Mock interview feedback loop'],
      practice: 'Write the remaining STAR stories, including the product decision one, and do two mock interviews (peer or interviewing.io).',
      links: [['interviewing.io', 'https://interviewing.io/'], ['Exponent peer mocks', 'https://www.tryexponent.com/practice']],
    },
  ],
}

/** What the final review week looks like for each area. */
const REVIEW = {
  dsa: { title: 'Final review: timed mixed sets', outcome: 'Calm, fast pattern recognition.', topics: ['Mixed timed sets', 'Clear the review queue', 'Re-solve your 10 hardest problems'], practice: 'Two timed sets of 3 problems and an empty review queue.', links: [] },
  sd: { title: 'Final review: mock designs', outcome: 'Two designs you can deliver in your sleep.', topics: ['Skim your one-page summaries', 'Redo your two weakest designs', 'One mock design interview'], practice: 'One mock design round, then rest.', links: [] },
  ai: { title: 'Final review: project & concepts', outcome: 'Project story and core concepts sharp.', topics: ['Re-read project notes and numbers', 'Rehearse the 2- and 10-minute pitch', 'Skim transformer and RAG notes'], practice: 'Pitch the project to a friend.', links: [] },
  ops: { title: 'Final review: pipeline walkthrough', outcome: 'Walk an interviewer through your delivery pipeline.', topics: ['Draw your pipeline from commit to production', 'Explain one migration you shipped with zero downtime', 'Explain your rollback plan'], practice: 'Whiteboard the pipeline in 5 minutes.', links: [] },
  product: { title: 'Final review: product stories', outcome: 'Every answer anchored in users and impact.', topics: ['Re-read your metric and experiment notes', 'Practise one product sense question', 'Check every STAR result has a number'], practice: 'One product sense answer out loud, 10 minutes.', links: [] },
  fund: { title: 'Final review: rest & confidence', outcome: 'Rested and confident.', topics: ['Skim fundamentals notes', 'Read your STAR stories once', 'Sleep'], practice: 'You did the work.', links: [] },
}

// ---------------------------------------------------------------------------
// Plan building
// ---------------------------------------------------------------------------
export const PLAN_PRESETS = [30, 45, 60, 90, 120, 180]
export const MIN_DAYS = 14
export const MAX_DAYS = 365
export const clampDays = (n) => Math.max(MIN_DAYS, Math.min(MAX_DAYS, Math.round(Number(n) || 90)))

const PHASE_NAMES = {
  1: ['Sprint'],
  2: ['Foundations', 'Interview mode'],
  3: ['Foundations', 'Depth', 'Interview mode'],
}

const cache = new Map()

/**
 * Spread every selected area's modules across the plan.
 * Returns { days, weeks, totalWeeks, phases, firstWeek: {moduleId|patternId|designId|milestoneId: week} }
 */
export function buildPlan(planDays = 90, tracks = AREA_IDS) {
  const days = clampDays(planDays)
  const selected = AREA_IDS.filter((id) => tracks.includes(id))
  const key = `${days}|${selected.join(',')}`
  if (cache.has(key)) return cache.get(key)

  const totalWeeks = Math.ceil(days / 7)
  const hasReview = totalWeeks >= 6
  const contentWeeks = totalWeeks - (hasReview ? 1 : 0)
  const weeks = Array.from({ length: totalWeeks }, (_, i) => ({ n: i + 1, review: hasReview && i === totalWeeks - 1, items: {} }))
  const firstWeek = {}

  for (const track of selected) {
    const mods = CURRICULUM[track]
    const M = mods.length
    // How many weeks each module spans (>= 1 when there are more weeks than modules).
    for (let w = 1; w <= contentWeeks; w++) {
      const start = Math.floor(((w - 1) * M) / contentWeeks)
      const end = Math.max(start + 1, Math.floor((w * M) / contentWeeks))
      const items = []
      for (let i = start; i < Math.min(end, M); i++) {
        const m = mods[i]
        // part numbering when a module spans several weeks
        const spanStart = firstWeekOf(i, M, contentWeeks)
        const spanEnd = lastWeekOf(i, M, contentWeeks)
        items.push({ module: m, part: w - spanStart + 1, parts: spanEnd - spanStart + 1 })
        if (!firstWeek[m.id]) {
          firstWeek[m.id] = w
          for (const ref of [...(m.patterns || []), ...(m.designs || []), ...(m.milestones || [])]) firstWeek[ref] = w
        }
      }
      weeks[w - 1].items[track] = items
    }
    if (hasReview) weeks[totalWeeks - 1].items[track] = [{ module: { id: `${track}-review`, ...REVIEW[track] }, part: 1, parts: 1 }]
  }

  const P = Math.min(3, totalWeeks)
  const phaseOf = (w) => Math.min(P, Math.ceil((w * P) / totalWeeks))
  const phases = PHASE_NAMES[P].map((name, i) => {
    const ws = weeks.filter((w) => phaseOf(w.n) === i + 1)
    const fromDay = (ws[0].n - 1) * 7 + 1
    const toDay = Math.min(days, ws[ws.length - 1].n * 7)
    const goals = selected.map((t) => {
      const titles = [...new Set(ws.flatMap((w) => (w.items[t] || []).map((x) => x.module.title)))]
      return { track: t, from: titles[0], to: titles[titles.length - 1], count: titles.length }
    }).filter((g) => g.count)
    return { n: i + 1, name, fromDay, toDay, weeks: ws.map((w) => w.n), goals }
  })

  const plan = { days, totalWeeks, weeks, phases, phaseOf, firstWeek, tracks: selected }
  cache.set(key, plan)
  return plan
}

function firstWeekOf(i, M, W) {
  for (let w = 1; w <= W; w++) {
    const start = Math.floor(((w - 1) * M) / W)
    const end = Math.max(start + 1, Math.floor((w * M) / W))
    if (i >= start && i < end) return w
  }
  return W
}
function lastWeekOf(i, M, W) {
  for (let w = W; w >= 1; w--) {
    const start = Math.floor(((w - 1) * M) / W)
    const end = Math.max(start + 1, Math.floor((w * M) / W))
    if (i >= start && i < end) return w
  }
  return 1
}

export const planFor = (profile) => buildPlan(profile?.planDays, profile?.tracks || AREA_IDS)
