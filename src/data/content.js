// ---------------------------------------------------------------------------
// Daily task templates (0 = Sunday ... 6 = Saturday)
// ---------------------------------------------------------------------------
const STUDY_BLOCKS = {
  sd: { id: 'sd', label: 'System design: read + one-page summary', detail: 'This week’s module. Write it in your own words with a rough diagram.', xp: 30, track: 'sd', mins: 60 },
  ai: { id: 'ai', label: 'AI/ML: study or project work', detail: 'This week’s module: course videos, reading, or building.', xp: 30, track: 'ai', mins: 60 },
  ops: { id: 'ops', label: 'DevOps: study + hands-on lab', detail: 'This week’s module. Build something small: a workflow, a Dockerfile, a migration.', xp: 30, track: 'ops', mins: 60 },
  product: { id: 'product', label: 'Product thinking: one idea, applied', detail: 'This week’s module. Apply it to something you built or use every day.', xp: 25, track: 'product', mins: 30 },
  fund: { id: 'fund', label: 'Fundamentals: one topic, deep', detail: 'This week’s module. Explain it out loud when you are done.', xp: 30, track: 'fund', mins: 45 },
}
const DSA_TASK = { id: 'dsa', label: 'Solve today’s DSA problems', detail: 'Pattern of the week. 25 min per problem, then study the solution and mark it for review.', xp: 40, track: 'dsa', mins: 60 }
const TALK_TASK = { id: 'talk', label: 'Explain one solution out loud', detail: 'Two minutes, as if to an interviewer. Communication is a skill too.', xp: 10, track: 'dsa', mins: 5 }

/** Daily tasks for a date, built from the areas in your plan (0 = Sunday ... 6 = Saturday). */
export const tasksForDay = (date, tracks = ['dsa', 'sd', 'ai', 'ops', 'product', 'fund']) => {
  const has = (t) => tracks.includes(t)
  const others = ['sd', 'ai', 'ops', 'product', 'fund'].filter(has)
  const d = date.getDay()
  if (d === 6) {
    const project = has('ai') && has('ops') ? 'AI project or DevOps lab (2 h)' : has('ai') ? 'AI project work (2 h)' : has('ops') ? 'DevOps hands-on lab (2 h)' : 'CS fundamentals deep dive (2 h)'
    return [
      has('dsa') && { id: 'timed', label: 'Timed DSA: 3 problems in 90 minutes', detail: 'A LeetCode contest counts too.', xp: 60, track: 'dsa', mins: 90 },
      has('sd') && { id: 'design', label: 'Design one full system out loud', detail: 'Requirements → estimates → API → data model → high level → deep dive.', xp: 60, track: 'sd', mins: 90 },
      { id: 'deep', label: project, detail: 'Pick whichever is behind.', xp: 50, track: has('ai') ? 'ai' : has('ops') ? 'ops' : 'fund', mins: 120 },
    ].filter(Boolean)
  }
  if (d === 0) {
    return [
      has('dsa') && { id: 'resolve', label: 'Re-solve problems you got stuck on', detail: 'Clear your review queue first.', xp: 40, track: 'dsa', mins: 60 },
      { id: 'review', label: 'Weekly review', detail: 'Write what went well and what is weak on the Roadmap page.', xp: 30, track: 'plan', mins: 60 },
      { id: 'catchup', label: 'Catch-up (1 h)', detail: 'Whatever is behind. Then take the rest of the day off.', xp: 30, track: has('fund') ? 'fund' : 'plan', mins: 60 },
      { id: 'current', label: 'Stay current: 20 minutes of reading', detail: 'Skim one newsletter or the Tech Radar (Library → Stay current). Note one thing worth trying.', xp: 15, track: 'current', mins: 20 },
    ].filter(Boolean)
  }
  // Weekdays: DSA every day, plus two study blocks that rotate through your other areas.
  const per = has('dsa') ? 2 : 3
  const blocks = []
  for (let i = 0; i < Math.min(per, others.length); i++) blocks.push(STUDY_BLOCKS[others[((d - 1) * per + i) % others.length]])
  return [...(has('dsa') ? [DSA_TASK] : []), ...blocks, ...(has('dsa') ? [TALK_TASK] : [])]
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

  // DevOps & delivery
  { id: 'gha-docs', title: 'GitHub Actions documentation', author: 'GitHub', type: 'Site', track: 'ops', must: true, url: 'https://docs.github.com/en/actions', unit: 'percent', total: 100, why: 'Workflows, caching, matrices, environments and OIDC: the CI/CD you will use first.' },
  { id: 'docker-docs', title: 'Docker: Get started', author: 'Docker', type: 'Course', track: 'ops', must: true, url: 'https://docs.docker.com/get-started/', unit: 'percent', total: 100, why: 'Official hands-on intro: images, containers, Compose, multi-stage builds.' },
  { id: 'cd-book', title: 'Continuous Delivery', author: 'Jez Humble & David Farley', type: 'Book', track: 'ops', must: false, url: 'https://continuousdelivery.com/', unit: 'chapters', total: 15, why: 'The classic on deployment pipelines, testing strategy and release safety.' },
  { id: 'accelerate', title: 'Accelerate', author: 'Forsgren, Humble & Kim', type: 'Book', track: 'ops', must: false, url: 'https://itrevolution.com/product/accelerate/', unit: 'chapters', total: 16, why: 'The research behind DORA metrics. Great for “how do you measure delivery?” questions.' },
  { id: 'sre-book', title: 'Site Reliability Engineering', author: 'Google', type: 'Book', track: 'ops', must: true, url: 'https://sre.google/sre-book/table-of-contents/', unit: 'chapters', total: 34, why: 'Free. Read SLOs, monitoring, on-call, postmortems and handling overload.' },
  { id: 'dbre', title: 'Database Reliability Engineering', author: 'Laine Campbell & Charity Majors', type: 'Book', track: 'ops', must: true, url: 'https://www.oreilly.com/library/view/database-reliability-engineering/9781491925935/', unit: 'chapters', total: 13, why: 'The database DevOps book: migrations, backups, recovery, operational visibility.' },
  { id: 'evodb', title: 'Evolutionary Database Design', author: 'Martin Fowler & Pramod Sadalage', type: 'Article', track: 'ops', must: true, url: 'https://martinfowler.com/articles/evodb.html', unit: 'percent', total: 100, why: 'Free. How to version and migrate schemas safely alongside code.' },
  { id: 'devops-roadmap', title: 'DevOps roadmap', author: 'roadmap.sh', type: 'Site', track: 'ops', must: false, url: 'https://roadmap.sh/devops', unit: 'percent', total: 100, why: 'A map of the whole field with free links per topic. Use it to spot gaps.' },

  // Developer craft: books that make your fundamentals strong
  { id: 'pragprog', title: 'The Pragmatic Programmer (20th anniversary ed.)', author: 'David Thomas & Andrew Hunt', type: 'Book', track: 'craft', must: true, url: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/', unit: 'chapters', total: 9, why: 'The habits of an effective developer: DRY, orthogonality, tracer bullets, debugging. Read it first.' },
  { id: 'missing-semester', title: 'The Missing Semester of Your CS Education', author: 'MIT', type: 'Course', track: 'craft', must: true, url: 'https://missing.csail.mit.edu/', unit: 'lessons', total: 11, why: 'Free. Shell, Vim, git, debugging, profiling: the tools every developer uses but nobody teaches.' },
  { id: 'refactoring', title: 'Refactoring (2nd ed.)', author: 'Martin Fowler', type: 'Book', track: 'craft', must: true, url: 'https://martinfowler.com/books/refactoring.html', unit: 'chapters', total: 12, why: 'How to improve code safely in small steps. The catalog is a shared vocabulary for code review.' },
  { id: 'csapp', title: 'Computer Systems: A Programmer’s Perspective (3rd ed.)', author: 'Bryant & O’Hallaron', type: 'Book', track: 'craft', must: false, url: 'https://csapp.cs.cmu.edu/', unit: 'chapters', total: 12, why: 'How code really runs: memory, caches, linking, processes, concurrency. The deepest fundamentals book here.' },
  { id: 'fsa', title: 'Fundamentals of Software Architecture (2nd ed.)', author: 'Mark Richards & Neal Ford', type: 'Book', track: 'craft', must: true, url: 'https://www.oreilly.com/library/view/fundamentals-of-software/9781098175504/', unit: 'chapters', total: 27, why: 'Architecture styles, characteristics and trade-offs. Bridges code design and system design.' },
  { id: 'tdd-beck', title: 'Test-Driven Development: By Example', author: 'Kent Beck', type: 'Book', track: 'craft', must: false, url: '', unit: 'chapters', total: 32, why: 'Short and practical. Changes how you design code, not just how you test it.' },
  { id: 'tidy-first', title: 'Tidy First?', author: 'Kent Beck', type: 'Book', track: 'craft', must: false, url: 'https://www.oreilly.com/library/view/tidy-first/9781098151232/', unit: 'chapters', total: 33, why: 'A short, modern take on small design improvements and when they are worth it.' },
  { id: 'legacy-code', title: 'Working Effectively with Legacy Code', author: 'Michael Feathers', type: 'Book', track: 'craft', must: false, url: '', unit: 'chapters', total: 25, why: 'How to get untested code under test and change it safely. The reality of most jobs.' },
  { id: 'release-it', title: 'Release It! (2nd ed.)', author: 'Michael Nygard', type: 'Book', track: 'craft', must: false, url: 'https://pragprog.com/titles/mnee2/release-it-second-edition/', unit: 'chapters', total: 17, why: 'Stability patterns from real outages: timeouts, circuit breakers, bulkheads. Great for system design depth.' },
  { id: 'code-complete', title: 'Code Complete (2nd ed.)', author: 'Steve McConnell', type: 'Book', track: 'craft', must: false, url: '', unit: 'chapters', total: 35, why: 'The encyclopedia of construction: naming, routines, defensive programming. Dip into chapters as needed.' },
  { id: 'staff-path', title: 'The Staff Engineer’s Path', author: 'Tanya Reilly', type: 'Book', track: 'craft', must: false, url: 'https://www.oreilly.com/library/view/the-staff-engineers/9781098118723/', unit: 'chapters', total: 9, why: 'For senior roles: big-picture thinking, executing projects, leveling up others.' },

  // Stay current: build a 20-minute weekly habit
  { id: 'tech-radar', title: 'Thoughtworks Technology Radar', author: 'Thoughtworks', type: 'Site', track: 'current', must: true, url: 'https://www.thoughtworks.com/radar', unit: 'issues', total: 2, why: 'Twice a year: which tools, techniques and platforms to adopt, trial, assess or hold.' },
  { id: 'pragmatic-engineer', title: 'The Pragmatic Engineer', author: 'Gergely Orosz', type: 'Newsletter', track: 'current', must: true, url: 'https://newsletter.pragmaticengineer.com/', unit: 'issues', total: 26, why: 'How big tech and startups actually build software, plus the job market.' },
  { id: 'bytebytego-news', title: 'ByteByteGo newsletter', author: 'Alex Xu', type: 'Newsletter', track: 'current', must: false, url: 'https://blog.bytebytego.com/', unit: 'issues', total: 26, why: 'Weekly system design explainers with clear diagrams. Doubles as interview prep.' },
  { id: 'simon-willison', title: 'Simon Willison’s Weblog', author: 'Simon Willison', type: 'Site', track: 'current', must: false, url: 'https://simonwillison.net/', unit: 'issues', total: 26, why: 'The best running commentary on practical AI engineering and LLM tools.' },
  { id: 'infoq', title: 'InfoQ', author: 'InfoQ', type: 'Site', track: 'current', must: false, url: 'https://www.infoq.com/', unit: 'issues', total: 26, why: 'Talks and articles on architecture, cloud and engineering culture from practitioners.' },
  { id: 'hacker-news', title: 'Hacker News', author: 'Y Combinator', type: 'Site', track: 'current', must: false, url: 'https://news.ycombinator.com/', unit: 'issues', total: 26, why: 'Skim the front page weekly; read comments for the real debate. Time-box it.' },

  // Product thinking
  { id: 'inspired', title: 'Inspired (2nd ed.)', author: 'Marty Cagan', type: 'Book', track: 'product', must: true, url: 'https://www.svpg.com/books/inspired-how-to-create-tech-products-customers-love-2nd-edition/', unit: 'chapters', total: 67, why: 'How strong product teams work and what engineers bring to discovery. Short chapters.' },
  { id: 'mom-test', title: 'The Mom Test', author: 'Rob Fitzpatrick', type: 'Book', track: 'product', must: true, url: 'https://www.momtestbook.com/', unit: 'chapters', total: 8, why: 'A 2-hour read on talking to users without fooling yourself.' },
  { id: 'product-minded', title: 'The Product-Minded Software Engineer', author: 'Gergely Orosz', type: 'Article', track: 'product', must: true, url: 'https://blog.pragmaticengineer.com/the-product-minded-engineer/', unit: 'percent', total: 100, why: 'Free. The nine traits of engineers who think about product. Use it as a checklist.' },
  { id: 'shape-up', title: 'Shape Up', author: 'Ryan Singer (Basecamp)', type: 'Book', track: 'product', must: false, url: 'https://basecamp.com/shapeup', unit: 'chapters', total: 16, why: 'Free online. Appetite, shaping and scope hammering: how to ship the valuable part.' },
  { id: 'cdh', title: 'Continuous Discovery Habits', author: 'Teresa Torres', type: 'Book', track: 'product', must: false, url: 'https://www.producttalk.org/continuous-discovery-habits/', unit: 'chapters', total: 14, why: 'Weekly user touchpoints and opportunity solution trees.' },
  { id: 'build-trap', title: 'Escaping the Build Trap', author: 'Melissa Perri', type: 'Book', track: 'product', must: false, url: 'https://melissaperri.com/book', unit: 'chapters', total: 25, why: 'Outcomes over output: why shipping features is not the goal.' },
  { id: 'lean-analytics', title: 'Lean Analytics', author: 'Alistair Croll & Benjamin Yoskovitz', type: 'Book', track: 'product', must: false, url: 'https://leananalyticsbook.com/', unit: 'chapters', total: 30, why: 'Which metric matters at which stage, with benchmarks by business model.' },
  { id: 'kohavi', title: 'Trustworthy Online Controlled Experiments', author: 'Kohavi, Tang & Xu', type: 'Book', track: 'product', must: false, url: 'https://experimentguide.com/', unit: 'chapters', total: 23, why: 'The A/B testing book, from the people who ran experimentation at Microsoft, Google and LinkedIn.' },

  // Trending technologies
  { id: 'mcp-docs', title: 'Model Context Protocol', tech: 'AI agents & MCP', author: 'modelcontextprotocol.io', type: 'Site', track: 'trend', must: false, url: 'https://modelcontextprotocol.io/', unit: 'percent', total: 100, why: 'The open standard for connecting LLM apps to tools and data. Build one small MCP server.' },
  { id: 'effective-agents', title: 'Building effective agents', tech: 'AI agents & MCP', author: 'Anthropic', type: 'Article', track: 'trend', must: false, url: 'https://www.anthropic.com/engineering/building-effective-agents', unit: 'percent', total: 100, why: 'The clearest guide to agent patterns: workflows vs agents, routing, orchestrator-workers.' },
  { id: 'hf-agents', title: 'Hugging Face Agents Course', tech: 'AI agents & MCP', author: 'Hugging Face', type: 'Course', track: 'trend', must: false, url: 'https://huggingface.co/learn/agents-course', unit: 'percent', total: 100, why: 'Free, hands-on course building agents with popular frameworks.' },
  { id: 'k8s-hard-way', title: 'Kubernetes the Hard Way', tech: 'Kubernetes', author: 'Kelsey Hightower', type: 'Course', track: 'trend', must: false, url: 'https://github.com/kelseyhightower/kubernetes-the-hard-way', unit: 'percent', total: 100, why: 'Bootstrap a cluster by hand to really understand what managed Kubernetes hides.' },
  { id: 'k8s-up', title: 'Kubernetes: Up and Running (3rd ed.)', tech: 'Kubernetes', author: 'Burns, Beda, Hightower & Evenson', type: 'Book', track: 'trend', must: false, url: 'https://www.oreilly.com/library/view/kubernetes-up-and/9781098110192/', unit: 'chapters', total: 22, why: 'The standard practical book, from the people who created Kubernetes.' },
  { id: 'tf-up', title: 'Terraform: Up & Running (3rd ed.)', tech: 'Terraform / IaC', author: 'Yevgeniy Brikman', type: 'Book', track: 'trend', must: false, url: 'https://www.terraformupandrunning.com/', unit: 'chapters', total: 10, why: 'The best introduction to infrastructure as code with real-world patterns.' },
  { id: 'go-tests', title: 'Learn Go with Tests', tech: 'Go', author: 'Chris James', type: 'Site', track: 'trend', must: false, url: 'https://quii.gitbook.io/learn-go-with-tests', unit: 'percent', total: 100, why: 'Free. Learn Go (the language of cloud tooling) by writing tests first. Start with the Tour of Go.' },
  { id: 'rust-book', title: 'The Rust Programming Language', tech: 'Rust', author: 'Klabnik & Nichols', type: 'Book', track: 'trend', must: false, url: 'https://doc.rust-lang.org/book/', unit: 'chapters', total: 21, why: 'Free official book. Pair it with Rustlings exercises.' },
  { id: 'confluent', title: 'Confluent Developer courses', tech: 'Kafka & event streaming', author: 'Confluent', type: 'Course', track: 'trend', must: false, url: 'https://developer.confluent.io/courses/', unit: 'percent', total: 100, why: 'Free Kafka courses: fundamentals, Kafka Streams, event sourcing and data mesh.' },
  { id: 'obs-eng', title: 'Observability Engineering', tech: 'OpenTelemetry & observability', author: 'Majors, Fong-Jones & Miranda', type: 'Book', track: 'trend', must: false, url: 'https://www.oreilly.com/library/view/observability-engineering/9781492076438/', unit: 'chapters', total: 21, why: 'Modern observability with high-cardinality events and OpenTelemetry.' },

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
  ops: { name: 'DevOps', color: 'var(--c-ops)' },
  product: { name: 'Product thinking', color: 'var(--c-product)' },
  craft: { name: 'Developer craft', color: 'var(--c-craft)' },
  current: { name: 'Stay current', color: 'var(--c-current)' },
  trend: { name: 'Trending tech', color: 'var(--c-trend)' },
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
  { id: 'url-shortener', name: 'URL shortener', level: 'Starter' },
  { id: 'rate-limiter', name: 'Rate limiter', level: 'Starter' },
  { id: 'notification', name: 'Notification system', level: 'Core' },
  { id: 'kv-store', name: 'Distributed key-value store', level: 'Core' },
  { id: 'news-feed', name: 'News feed', level: 'Core' },
  { id: 'chat', name: 'Chat system (WhatsApp)', level: 'Core' },
  { id: 'dropbox', name: 'File storage (Dropbox / Google Drive)', level: 'Core' },
  { id: 'autocomplete', name: 'Search autocomplete', level: 'Core' },
  { id: 'youtube', name: 'Video streaming (YouTube)', level: 'Advanced' },
  { id: 'unique-id', name: 'Distributed unique ID generator', level: 'Core' },
  { id: 'crawler', name: 'Web crawler', level: 'Advanced' },
  { id: 'ticketmaster', name: 'Ticket booking (Ticketmaster)', level: 'Advanced' },
  { id: 'rag-search', name: 'RAG-based document search / support bot', level: 'AI' },
  { id: 'recsys', name: 'Recommendation system', level: 'AI' },
  { id: 'llm-gateway', name: 'LLM gateway (routing, caching, rate limits, cost)', level: 'AI' },
  { id: 'payments', name: 'Payment system', level: 'Advanced' },
]

// ---------------------------------------------------------------------------
// AI / ML
// ---------------------------------------------------------------------------
export const AI_SECTIONS = [
  {
    id: 'ml', name: 'Classic ML',
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
    id: 'dl', name: 'Deep learning',
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
    id: 'llm', name: 'LLM engineering',
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
    id: 'mlsys', name: 'ML system design',
    topics: [
      ['pipeline', 'Data pipelines & feature stores'],
      ['train-serve', 'Training vs serving, online vs batch inference'],
      ['drift', 'Monitoring & data drift'],
      ['abtest', 'A/B testing ML models'],
    ],
  },
]

export const PROJECT_MILESTONES = [
  { id: 'pick', label: 'Pick a dataset you care about (docs, papers, a public knowledge base)' },
  { id: 'baseline', label: 'Baseline: answer questions with plain prompting, no retrieval' },
  { id: 'ingest', label: 'Ingestion: load, clean and chunk documents' },
  { id: 'embed', label: 'Embed chunks and store them in a vector index' },
  { id: 'retrieve', label: 'Retrieval + generation with citations' },
  { id: 'evalset', label: 'Build a golden set of 30–50 questions with expected answers' },
  { id: 'evals', label: 'Measure retrieval quality and answer accuracy' },
  { id: 'improve', label: 'Try one improvement (chunk size, hybrid search, reranker) and measure it' },
  { id: 'ui', label: 'Simple UI and deploy it' },
  { id: 'writeup', label: 'Write-up: architecture, trade-offs, numbers, what you would do next' },
  { id: 'pitch', label: 'Practise explaining it in 2 minutes and in 10 minutes' },
]

// DevOps project: ship this tracker (or any app) the way a production team would.
export const OPS_MILESTONES = [
  { id: 'repo', label: 'Repo on GitHub with branch protection, PR template and code owners' },
  { id: 'ci', label: 'CI: install, lint and build on every pull request, as a required check' },
  { id: 'docker', label: 'Multi-stage Dockerfile, image pushed to a registry from CI' },
  { id: 'deploy', label: 'Automatic deploy on merge to main, plus preview deploys for PRs' },
  { id: 'k8s', label: 'Run the image on a local Kubernetes cluster (Deployment, Service, Ingress)' },
  { id: 'iac', label: 'Infrastructure defined in Terraform, with plan running in CI' },
  { id: 'migrations', label: 'Small API + Postgres with versioned migrations tested in CI; one expand/contract change' },
  { id: 'backup', label: 'Backup and restore drill, with a written runbook and timing' },
  { id: 'observe', label: 'Health checks, a metrics dashboard, one alert and a mock postmortem' },
  { id: 'secure', label: 'Dependabot + code scanning on, least-privilege workflow permissions, no long-lived secrets' },
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
  { id: 'product', q: 'A product or user-facing decision you influenced (with the metric that moved)' },
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
