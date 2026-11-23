// ---------------------------------------------------------------------------
// Areas that close common interview gaps: your language in depth, low-level
// design & machine coding, SQL, frontend, mobile, and getting hired.
// Topics are [id, text] so they can be checked off (stored in state.areaTopics).
// ---------------------------------------------------------------------------

export const EXTRA_AREAS = [
  { id: 'lang', name: 'Language mastery', blurb: 'Your main language in depth: memory, concurrency, idioms, gotchas' },
  { id: 'lld', name: 'LLD & machine coding', blurb: 'Object-oriented design and building a working app in 90 minutes' },
  { id: 'sql', name: 'SQL', blurb: 'Joins, window functions, query tuning and interview-style SQL' },
  { id: 'fe', name: 'Frontend', blurb: 'JavaScript, browser, React, performance, accessibility, frontend design' },
  { id: 'mobile', name: 'Mobile', blurb: 'Platform fundamentals, architecture, offline sync, mobile system design' },
  { id: 'career', name: 'Getting hired', blurb: 'Resume, referrals, interview formats, debugging & AI rounds, offers' },
]

export const EXTRA_INTROS = {
  lang: 'Interviewers probe the language you put on your resume: how memory works, how concurrency works, and the gotchas. Pick your language below; the modules are the same for every language and the resources change with it.',
  lld: 'Many companies run a low-level design or “machine coding” round: design classes for a real problem, then build a working, tested version in 60–90 minutes. Practise both the design and the speed.',
  sql: 'Backend, data and full-stack interviews often include a live SQL round. Learn to write correct queries fast, then make them fast to run.',
  fe: 'Frontend loops test JavaScript depth, building UI components from scratch, browser knowledge, and frontend system design (not just backend boxes and arrows).',
  mobile: 'Mobile loops test your platform (Android or iOS), app architecture, offline-first data, and mobile system design.',
  career: 'Preparation only pays off if you get interviews and close offers. This area covers the job search itself, plus two newer round types: code reading / debugging and AI-assisted coding.',
}

export const EXTRA_CURRICULUM = {
  // ------------------------------------------------------------------ Language mastery
  lang: [
    {
      id: 'lang-1', title: 'Core semantics & idioms', hours: 6,
      outcome: 'Write idiomatic code in your language and explain what each line does.',
      topics: [
        ['lang-types', 'Type system: value vs reference, mutability, equality and hashing'],
        ['lang-scope', 'Scope, closures and how functions are passed around'],
        ['lang-errors', 'Error handling conventions (exceptions, error values, Result types)'],
        ['lang-idioms', 'Idioms an expert would expect (comprehensions, streams, iterators, generics)'],
      ],
      practice: 'Re-solve 5 DSA problems you have done, this time in fully idiomatic style. Compare with top community solutions.',
      links: [],
    },
    {
      id: 'lang-2', title: 'Collections & standard library for interviews', hours: 5,
      outcome: 'Know the complexity of every collection operation you use.',
      topics: [
        ['lang-collections', 'Lists, maps, sets, deques, heaps: implementation and Big-O'],
        ['lang-sorting', 'Sorting with custom comparators; stable vs unstable sorts'],
        ['lang-strings', 'String immutability, builders and Unicode pitfalls'],
        ['lang-stdlib', 'Standard library helpers that save time in interviews'],
      ],
      practice: 'Write a one-page cheat sheet of collection operations and their complexity in your language.',
      links: [],
    },
    {
      id: 'lang-3', title: 'Memory & performance', hours: 6,
      outcome: 'Explain how your runtime allocates and frees memory, and find a performance problem.',
      topics: [
        ['lang-memory', 'Stack vs heap, object layout, references'],
        ['lang-gc', 'Garbage collection or ownership (GC, ARC, RAII / borrow checking)'],
        ['lang-leaks', 'Memory leaks in a managed language and how to find them'],
        ['lang-profile', 'Profiling CPU and memory; benchmarking correctly'],
      ],
      practice: 'Profile one slow script or service you own. Write down the hotspot and the fix.',
      links: [],
    },
    {
      id: 'lang-4', title: 'Concurrency in your language', hours: 7,
      outcome: 'Write correct concurrent code with your language’s primitives and explain its memory model.',
      topics: [
        ['lang-threads', 'Threads, async/await, coroutines, goroutines or virtual threads: what your language uses'],
        ['lang-sync', 'Locks, atomics, channels and thread-safe collections'],
        ['lang-model', 'The language’s memory model and happens-before'],
        ['lang-pitfalls', 'Common bugs: races, deadlocks, blocking the event loop or main thread'],
      ],
      practice: 'Implement a thread-safe bounded queue and a rate-limited parallel fetcher. Add a test that would catch a race.',
      links: [],
    },
    {
      id: 'lang-5', title: 'Testing, tooling & packaging', hours: 4,
      outcome: 'Set up a clean project with tests, linting and dependencies like a senior engineer.',
      topics: [
        ['lang-test', 'Unit testing framework, mocks and fixtures'],
        ['lang-tooling', 'Formatter, linter and type checker'],
        ['lang-deps', 'Dependency and version management, lockfiles'],
        ['lang-build', 'Build, packaging and running in a container'],
      ],
      practice: 'Create a template repo for your language with tests, lint and CI that you can reuse in machine-coding rounds.',
      links: [],
    },
    {
      id: 'lang-6', title: 'Language interview questions', hours: 4,
      outcome: 'Answer 20 classic language questions without notes.',
      topics: [
        ['lang-q-internals', 'Internals questions (how a map works, how strings are stored)'],
        ['lang-q-gotchas', 'Famous gotchas (default args, equality, integer overflow, closures in loops)'],
        ['lang-q-new', 'Recent language features and why they were added'],
      ],
      practice: 'Write and answer 20 “explain this” questions for your language, then say them out loud.',
      links: [],
    },
  ],

  // ------------------------------------------------------------------ LLD & machine coding
  lld: [
    {
      id: 'lld-1', title: 'OOP & SOLID, applied', hours: 5,
      outcome: 'Model a real problem as classes with clear responsibilities.',
      topics: [
        ['lld-oop', 'Encapsulation, composition over inheritance, interfaces'],
        ['lld-solid', 'SOLID with real examples, not definitions'],
        ['lld-uml', 'Class and sequence diagrams quick enough for an interview'],
        ['lld-approach', 'The LLD round approach: requirements → entities → relationships → APIs → code'],
      ],
      practice: 'Design a library management system: entities, class diagram and the main methods. 45 minutes.',
      links: [['awesome-low-level-design', 'https://github.com/ashishps1/awesome-low-level-design'], ['Refactoring.Guru: design patterns', 'https://refactoring.guru/design-patterns']],
    },
    {
      id: 'lld-2', title: 'Design patterns that come up', hours: 6,
      outcome: 'Use the right pattern when it helps, and skip it when it does not.',
      topics: [
        ['lld-creational', 'Factory, builder, singleton (and why singletons hurt testing)'],
        ['lld-behavioral', 'Strategy, observer, state, command, chain of responsibility'],
        ['lld-structural', 'Adapter, decorator, facade, composite'],
      ],
      practice: 'Design a vending machine with the state pattern and a notification service with observer + strategy.',
      links: [['Head First Design Patterns (2nd ed.)', 'https://www.oreilly.com/library/view/head-first-design/9781492077992/'], ['Refactoring.Guru: design patterns', 'https://refactoring.guru/design-patterns']],
    },
    {
      id: 'lld-3', title: 'Classic LLD problems', hours: 8,
      outcome: 'Design the six most-asked LLD problems in 45 minutes each.',
      topics: [
        ['lld-parking', 'Parking lot'],
        ['lld-elevator', 'Elevator system'],
        ['lld-splitwise', 'Expense sharing (Splitwise)'],
        ['lld-bookmyshow', 'Movie ticket booking'],
        ['lld-lru', 'LRU / LFU cache'],
        ['lld-logger', 'Logger / rate limiter (in-memory)'],
      ],
      practice: 'Design three of them out loud, timed. Rate yourself and redo the weakest.',
      links: [['awesome-low-level-design: problems', 'https://github.com/ashishps1/awesome-low-level-design']],
    },
    {
      id: 'lld-4', title: 'Machine coding: working code in 90 minutes', hours: 10,
      outcome: 'Ship a working, readable, tested mini-app inside the time limit.',
      topics: [
        ['mc-scope', 'Clarify requirements and cut scope in the first 10 minutes'],
        ['mc-structure', 'Folder and class structure that is easy to extend'],
        ['mc-inmemory', 'In-memory storage behind an interface you could swap later'],
        ['mc-tests', 'A few focused tests and a demo driver'],
        ['mc-extend', 'Handling the “now add this feature” follow-up'],
      ],
      practice: 'Build Splitwise and Snake & Ladder end to end, 90 minutes each, using your language template from Language mastery.',
      links: [['awesome-low-level-design', 'https://github.com/ashishps1/awesome-low-level-design']],
    },
    {
      id: 'lld-5', title: 'Concurrency in LLD', hours: 6,
      outcome: 'Make an LLD design thread-safe and explain the trade-offs.',
      topics: [
        ['lld-threadsafe', 'Thread-safe cache and counter'],
        ['lld-prodcons', 'Producer-consumer and worker pools'],
        ['lld-booking-race', 'Preventing double booking in-process'],
      ],
      practice: 'Make your ticket-booking design safe under concurrent bookings and write a test that runs 100 threads.',
      links: [],
    },
  ],

  // ------------------------------------------------------------------ SQL
  sql: [
    {
      id: 'sql-1', title: 'Querying fundamentals', hours: 5,
      outcome: 'Write joins, grouping and subqueries correctly on the first try.',
      topics: [
        ['sql-joins', 'INNER, LEFT, RIGHT, FULL and self joins; when rows disappear'],
        ['sql-group', 'GROUP BY, HAVING and aggregate pitfalls'],
        ['sql-null', 'NULL semantics in comparisons, joins and aggregates'],
        ['sql-subq', 'Subqueries vs joins; EXISTS vs IN'],
      ],
      practice: 'Finish SQLBolt, then the first 20 problems of LeetCode’s SQL 50.',
      links: [['SQLBolt', 'https://sqlbolt.com/'], ['LeetCode SQL 50', 'https://leetcode.com/studyplan/top-sql-50/']],
    },
    {
      id: 'sql-2', title: 'Window functions & CTEs', hours: 5,
      outcome: 'Solve ranking, running-total and “top N per group” questions quickly.',
      topics: [
        ['sql-window', 'ROW_NUMBER, RANK, DENSE_RANK, LAG / LEAD'],
        ['sql-running', 'Running totals and moving averages with frames'],
        ['sql-cte', 'CTEs and recursive CTEs'],
        ['sql-pivot', 'Conditional aggregation (pivoting with CASE)'],
      ],
      practice: 'Finish LeetCode SQL 50 and 10 DataLemur medium questions.',
      links: [['PostgreSQL tutorial: window functions', 'https://www.postgresql.org/docs/current/tutorial-window.html'], ['DataLemur', 'https://datalemur.com/']],
    },
    {
      id: 'sql-3', title: 'Making queries fast', hours: 5,
      outcome: 'Read a query plan and fix a slow query with the right index.',
      topics: [
        ['sql-explain', 'EXPLAIN / EXPLAIN ANALYZE: scans, joins, costs'],
        ['sql-index', 'Index design: composite, covering, partial; column order'],
        ['sql-antipatterns', 'Anti-patterns: functions on indexed columns, OFFSET pagination, N+1'],
      ],
      practice: 'Load a sample dataset into Postgres, write 3 slow queries, and make each 10× faster.',
      links: [['Use The Index, Luke', 'https://use-the-index-luke.com/'], ['PostgreSQL Exercises', 'https://pgexercises.com/']],
    },
    {
      id: 'sql-4', title: 'Modeling & interview SQL', hours: 4,
      outcome: 'Design a schema for a product and answer metrics questions in SQL.',
      topics: [
        ['sql-model', 'Schema design from requirements; keys and constraints'],
        ['sql-metrics', 'Metrics queries: DAU, retention, funnels, conversion'],
        ['sql-live', 'Live SQL rounds: talk through assumptions and edge cases'],
      ],
      practice: 'Design the schema for this tracker, then write SQL for weekly active users and 7-day retention.',
      links: [['DataLemur', 'https://datalemur.com/']],
    },
  ],

  // ------------------------------------------------------------------ Frontend
  fe: [
    {
      id: 'fe-1', title: 'JavaScript in depth', hours: 8,
      outcome: 'Explain closures, this, prototypes and the event loop, and write polyfills.',
      topics: [
        ['fe-closures', 'Scope, closures and hoisting'],
        ['fe-this', '`this`, call / apply / bind, arrow functions'],
        ['fe-proto', 'Prototypes and classes'],
        ['fe-eventloop', 'Event loop: tasks, microtasks, rendering'],
        ['fe-async', 'Promises, async/await; write Promise.all, debounce, throttle'],
      ],
      practice: 'Implement debounce, throttle, Promise.all, deep clone and an event emitter from scratch.',
      links: [['javascript.info', 'https://javascript.info/'], ['GreatFrontEnd: JS questions', 'https://www.greatfrontend.com/']],
    },
    {
      id: 'fe-2', title: 'Browser, DOM & web security', hours: 6,
      outcome: 'Describe how a page renders and how to keep it secure.',
      topics: [
        ['fe-render', 'Critical rendering path: parse, style, layout, paint, composite'],
        ['fe-dom', 'DOM events: bubbling, capturing, delegation'],
        ['fe-storage', 'Cookies, localStorage, IndexedDB, service workers'],
        ['fe-security', 'XSS, CSRF, CORS and Content Security Policy'],
      ],
      practice: 'Build a todo app with vanilla JS using event delegation, then audit it for XSS.',
      links: [['MDN Web Docs', 'https://developer.mozilla.org/'], ['web.dev: Learn', 'https://web.dev/learn']],
    },
    {
      id: 'fe-3', title: 'CSS & layout', hours: 4,
      outcome: 'Build any layout responsively without fighting CSS.',
      topics: [
        ['fe-box', 'Box model, specificity and the cascade'],
        ['fe-flexgrid', 'Flexbox and Grid'],
        ['fe-responsive', 'Responsive design, container queries, units'],
      ],
      practice: 'Rebuild a real product page layout (e.g. a pricing page) from a screenshot, responsive down to phone width.',
      links: [['web.dev: Learn CSS', 'https://web.dev/learn/css'], ['MDN: CSS layout', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout']],
    },
    {
      id: 'fe-4', title: 'React & state', hours: 8,
      outcome: 'Explain React rendering and pick the right state approach.',
      topics: [
        ['fe-render-react', 'Rendering, reconciliation and keys'],
        ['fe-hooks', 'Hooks: state, effects, memoization, custom hooks'],
        ['fe-state', 'State management: local, context, server state (React Query), stores'],
        ['fe-rsc', 'Server components, SSR, hydration and streaming'],
      ],
      practice: 'Build an autocomplete with debounced fetching, caching, keyboard navigation and loading/error states.',
      links: [['react.dev: Learn', 'https://react.dev/learn'], ['GreatFrontEnd: UI questions', 'https://www.greatfrontend.com/']],
    },
    {
      id: 'fe-5', title: 'Performance', hours: 5,
      outcome: 'Measure and improve Core Web Vitals.',
      topics: [
        ['fe-cwv', 'Core Web Vitals: LCP, INP, CLS'],
        ['fe-bundle', 'Code splitting, tree shaking, lazy loading'],
        ['fe-assets', 'Images, fonts and caching headers'],
        ['fe-runtime', 'Avoiding long tasks and unnecessary re-renders'],
      ],
      practice: 'Run Lighthouse on a site you built, fix the top 3 issues and record the before/after numbers.',
      links: [['web.dev: Core Web Vitals', 'https://web.dev/articles/vitals'], ['web.dev: Learn performance', 'https://web.dev/learn/performance']],
    },
    {
      id: 'fe-6', title: 'Accessibility & testing', hours: 4,
      outcome: 'Ship components that work with a keyboard and a screen reader, with tests.',
      topics: [
        ['fe-a11y', 'Semantic HTML, ARIA and focus management'],
        ['fe-wcag', 'WCAG basics: contrast, labels, keyboard access'],
        ['fe-testing', 'Testing Library for components, Playwright for end-to-end'],
      ],
      practice: 'Make your autocomplete fully keyboard and screen-reader accessible, and add tests for it.',
      links: [['web.dev: Learn accessibility', 'https://web.dev/learn/accessibility'], ['Testing Library', 'https://testing-library.com/'], ['Playwright', 'https://playwright.dev/']],
    },
    {
      id: 'fe-7', title: 'Frontend system design', hours: 8,
      outcome: 'Design a complex UI end to end: components, data, state, performance.',
      topics: [
        ['fe-sd-framework', 'Framework: requirements, architecture, data model, API, optimizations'],
        ['fe-sd-feed', 'Design a news feed with infinite scroll'],
        ['fe-sd-chat', 'Design a chat app or collaborative editor UI'],
        ['fe-sd-offline', 'Caching, offline support and optimistic updates'],
      ],
      practice: 'Design a news feed and an autocomplete component out loud, 45 minutes each.',
      links: [['GreatFrontEnd: front end system design', 'https://www.greatfrontend.com/front-end-system-design-playbook']],
    },
  ],

  // ------------------------------------------------------------------ Mobile
  mobile: [
    {
      id: 'mob-1', title: 'Platform fundamentals', hours: 7,
      outcome: 'Explain your platform’s app lifecycle, UI toolkit and threading model.',
      topics: [
        ['mob-lifecycle', 'App and screen lifecycle; process death and state restoration'],
        ['mob-ui', 'Declarative UI: Jetpack Compose or SwiftUI'],
        ['mob-threads', 'Main thread rules; coroutines or Swift concurrency'],
        ['mob-nav', 'Navigation and deep links'],
      ],
      practice: 'Build a two-screen app (list → detail) with navigation and state that survives rotation / backgrounding.',
      links: [['Android Developers: courses', 'https://developer.android.com/courses'], ['Apple: SwiftUI tutorials', 'https://developer.apple.com/tutorials/swiftui']],
    },
    {
      id: 'mob-2', title: 'App architecture', hours: 6,
      outcome: 'Structure an app so features are testable and teams do not collide.',
      topics: [
        ['mob-mvvm', 'MVVM / MVI and unidirectional data flow'],
        ['mob-di', 'Dependency injection'],
        ['mob-modules', 'Modularization for large apps'],
        ['mob-test', 'Unit, UI and snapshot testing'],
      ],
      practice: 'Refactor your app into UI / domain / data layers with a repository and tests.',
      links: [['Android: guide to app architecture', 'https://developer.android.com/topic/architecture']],
    },
    {
      id: 'mob-3', title: 'Networking, offline & sync', hours: 6,
      outcome: 'Design offline-first data with sync and conflict handling.',
      topics: [
        ['mob-net', 'Networking, pagination and retries on flaky connections'],
        ['mob-cache', 'Local database and caching strategy'],
        ['mob-sync', 'Background sync and conflict resolution'],
        ['mob-push', 'Push notifications'],
      ],
      practice: 'Make your app work offline: cache the list locally and sync changes when back online.',
      links: [['Android: build an offline-first app', 'https://developer.android.com/topic/architecture/data-layer/offline-first']],
    },
    {
      id: 'mob-4', title: 'Performance, releases & quality', hours: 5,
      outcome: 'Keep an app fast and ship it safely to millions of devices.',
      topics: [
        ['mob-perf', 'Startup time, jank, memory and battery'],
        ['mob-release', 'Release trains, staged rollouts and feature flags'],
        ['mob-crash', 'Crash reporting and analytics'],
        ['mob-compat', 'Supporting old OS versions and device fragmentation'],
      ],
      practice: 'Measure your app’s cold start and fix one slow path.',
      links: [['Android: app performance', 'https://developer.android.com/topic/performance/overview']],
    },
    {
      id: 'mob-5', title: 'Mobile system design', hours: 8,
      outcome: 'Answer a mobile system design round with a clear framework.',
      topics: [
        ['mob-sd-framework', 'Framework: requirements, client architecture, API, data, deep dives'],
        ['mob-sd-feed', 'Design a feed or chat client'],
        ['mob-sd-media', 'Design image loading / media upload'],
        ['mob-sd-tradeoffs', 'Trade-offs: battery, data usage, consistency'],
      ],
      practice: 'Design a news feed client and a photo upload flow out loud, 45 minutes each.',
      links: [['Mobile System Design Interview (ByteByteGo)', 'https://bytebytego.com/courses/mobile-system-design-interview/introduction'], ['weeeBox: mobile system design', 'https://github.com/weeeBox/mobile-system-design']],
    },
  ],

  // ------------------------------------------------------------------ Getting hired
  career: [
    {
      id: 'car-1', title: 'Resume & profile', hours: 4,
      outcome: 'A one-page resume where every bullet shows impact.',
      topics: [
        ['car-resume', 'One page, impact-first bullets with numbers'],
        ['car-ats', 'Keywords for the role without stuffing'],
        ['car-linkedin', 'LinkedIn and GitHub that back up the resume'],
        ['car-projects', 'Showcasing your RAG / DevOps / side projects'],
      ],
      practice: 'Rewrite your resume and get it reviewed by two engineers at companies you want to join.',
      links: [['Tech Interview Handbook: resume', 'https://www.techinterviewhandbook.org/resume/']],
    },
    {
      id: 'car-2', title: 'Targeting, referrals & applications', hours: 3,
      outcome: 'A target list and a steady pipeline of interviews.',
      topics: [
        ['car-targets', 'A tiered target list: practice companies first, dream companies last'],
        ['car-referrals', 'Asking for referrals that actually get read'],
        ['car-tracker', 'Tracking applications, stages and follow-ups'],
        ['car-timing', 'Batching interviews so offers land together'],
      ],
      practice: 'List 20 target companies in 3 tiers and send 5 referral requests this week.',
      links: [['Tech Interview Handbook: getting interviews', 'https://www.techinterviewhandbook.org/']],
    },
    {
      id: 'car-3', title: 'Company research & interview formats', hours: 3,
      outcome: 'Know each target company’s loop before you walk in.',
      topics: [
        ['car-loops', 'Each company’s rounds: coding, design, LLD, behavioral, take-home'],
        ['car-levels', 'Levels and what is expected at yours'],
        ['car-values', 'Company values and the stories that match them'],
      ],
      practice: 'Write a one-page “interview brief” for your top 5 companies: rounds, level, values, questions to ask.',
      links: [['Levels.fyi', 'https://www.levels.fyi/'], ['Glassdoor interviews', 'https://www.glassdoor.com/Interview/index.htm']],
    },
    {
      id: 'car-4', title: 'Code reading, debugging & code review rounds', hours: 5,
      outcome: 'Find and fix a bug in an unfamiliar codebase while explaining your steps.',
      topics: [
        ['car-read', 'Reading unfamiliar code: entry points, data flow, tests'],
        ['car-debug', 'Systematic debugging: reproduce, isolate, bisect, verify'],
        ['car-review', 'Code review rounds: correctness, design, tests, kindness'],
      ],
      practice: 'Pick a mid-size open-source repo, find a “good first issue”, and fix it. Narrate your process out loud.',
      links: [['Debugging: the 9 rules (Agans)', 'https://debuggingrules.com/'], ['Julia Evans: debugging zine', 'https://wizardzines.com/zines/debugging-guide/']],
    },
    {
      id: 'car-5', title: 'AI-assisted coding rounds', hours: 4,
      outcome: 'Use an AI assistant in an interview the way interviewers want: as a tool you verify.',
      topics: [
        ['car-ai-format', 'Formats: AI chat in the editor, multi-file projects, bug fix + feature phases'],
        ['car-ai-drive', 'You drive: plan first, ask for small pieces, read every line'],
        ['car-ai-verify', 'Verify with tests and edge cases; say what you checked'],
        ['car-ai-norules', 'When not to use AI, and asking the interviewer about the rules'],
      ],
      practice: 'Do two practice sessions with an AI assistant on a small multi-file project: fix a seeded bug, then add a feature, talking out loud.',
      links: [['Claude Code: best practices', 'https://code.claude.com/docs/en/best-practices'], ['AI-enabled coding interviews guide', 'https://techscreen.app/articles/ai-enabled-coding-interview-guide-2026']],
    },
    {
      id: 'car-6', title: 'Offers & negotiation', hours: 3,
      outcome: 'Negotiate calmly and with data.',
      topics: [
        ['car-comp', 'Total compensation: base, bonus, equity, vesting'],
        ['car-data', 'Market data for your level and location'],
        ['car-negotiate', 'Negotiation rules: never name the first number, use competing offers'],
      ],
      practice: 'Write your walk-away number and a negotiation script before your first offer arrives.',
      links: [['Haseeb Qureshi: ten rules for negotiating', 'https://haseebq.com/my-ten-rules-for-negotiating-a-job-offer/'], ['Levels.fyi', 'https://www.levels.fyi/']],
    },
  ],
}

export const EXTRA_REVIEW = {
  lang: { title: 'Final review: language questions', outcome: 'Language questions answered without notes.', topics: ['Re-read your collections cheat sheet', 'Answer your 20 language questions out loud'], practice: 'One mock focused on language internals.', links: [] },
  lld: { title: 'Final review: one machine-coding round', outcome: 'A working app in 90 minutes, calmly.', topics: ['One timed machine-coding problem', 'Redo your weakest LLD design'], practice: 'One 90-minute machine-coding run.', links: [] },
  sql: { title: 'Final review: timed SQL', outcome: 'Medium SQL in 10 minutes.', topics: ['Five timed medium SQL problems', 'Re-read window function notes'], practice: 'Five problems, 10 minutes each.', links: [] },
  fe: { title: 'Final review: build & design', outcome: 'Component and frontend design rounds ready.', topics: ['Build one component from scratch in 45 minutes', 'One frontend system design out loud'], practice: 'One full frontend mock.', links: [] },
  mobile: { title: 'Final review: mobile design', outcome: 'Mobile design and platform questions ready.', topics: ['One mobile system design out loud', 'Re-read lifecycle and threading notes'], practice: 'One mobile mock.', links: [] },
  career: { title: 'Final review: pipeline & offers', outcome: 'Interviews booked and a negotiation plan ready.', topics: ['Confirm interview dates and briefs', 'Rehearse your negotiation script'], practice: 'Send follow-ups for every open application.', links: [] },
}

// ---------------------------------------------------------------------------
// Languages for the Language mastery area
// ---------------------------------------------------------------------------
export const LANGUAGES = {
  python: {
    name: 'Python',
    links: [
      ['Fluent Python (2nd ed.)', 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/'],
      ['Python docs: tutorial', 'https://docs.python.org/3/tutorial/'],
      ['Effective Python', 'https://effectivepython.com/'],
      ['Python docs: free-threaded Python', 'https://docs.python.org/3/howto/free-threading-python.html'],
      ['Real Python: concurrency', 'https://realpython.com/python-concurrency/'],
    ],
  },
  java: {
    name: 'Java',
    links: [
      ['Effective Java (3rd ed.)', 'https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/'],
      ['dev.java: Learn Java', 'https://dev.java/learn/'],
      ['Java docs: virtual threads', 'https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html'],
      ['Java Concurrency in Practice', 'https://jcip.net/'],
    ],
  },
  javascript: {
    name: 'JavaScript / TypeScript',
    links: [
      ['javascript.info', 'https://javascript.info/'],
      ['You Don’t Know JS Yet', 'https://github.com/getify/You-Dont-Know-JS'],
      ['TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html'],
      ['Effective TypeScript', 'https://effectivetypescript.com/'],
      ['MDN: event loop', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model'],
    ],
  },
  go: {
    name: 'Go',
    links: [
      ['A Tour of Go', 'https://go.dev/tour/'],
      ['Effective Go', 'https://go.dev/doc/effective_go'],
      ['100 Go Mistakes and How to Avoid Them', 'https://100go.co/'],
      ['The Go memory model', 'https://go.dev/ref/mem'],
      ['Learn Go with Tests', 'https://quii.gitbook.io/learn-go-with-tests'],
    ],
  },
  cpp: {
    name: 'C++',
    links: [
      ['learncpp.com', 'https://www.learncpp.com/'],
      ['cppreference', 'https://en.cppreference.com/'],
      ['C++ Core Guidelines', 'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines'],
      ['C++ Concurrency in Action (2nd ed.)', 'https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition'],
    ],
  },
  kotlin: {
    name: 'Kotlin',
    links: [
      ['Kotlin docs', 'https://kotlinlang.org/docs/home.html'],
      ['Kotlin coroutines guide', 'https://kotlinlang.org/docs/coroutines-guide.html'],
      ['Kotlin in Action (2nd ed.)', 'https://www.manning.com/books/kotlin-in-action-second-edition'],
    ],
  },
  swift: {
    name: 'Swift',
    links: [
      ['The Swift Programming Language', 'https://docs.swift.org/swift-book/'],
      ['Swift concurrency', 'https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/'],
      ['Hacking with Swift', 'https://www.hackingwithswift.com/'],
    ],
  },
}

// ---------------------------------------------------------------------------
// Role presets
// ---------------------------------------------------------------------------
export const ROLES = [
  { id: 'backend', name: 'Backend engineer', language: 'java', tracks: ['dsa', 'sd', 'lang', 'lld', 'sql', 'fund', 'career'], optional: ['ops', 'product', 'ai'], note: 'Coding + system design carry the loop; SQL, LLD and language depth are common extra rounds.' },
  { id: 'frontend', name: 'Frontend engineer', language: 'javascript', tracks: ['dsa', 'fe', 'lang', 'fund', 'career'], optional: ['product', 'sd'], note: 'JavaScript depth, building components and frontend system design matter more than hard DSA.' },
  { id: 'fullstack', name: 'Full-stack engineer', language: 'javascript', tracks: ['dsa', 'sd', 'fe', 'sql', 'lang', 'career'], optional: ['ops', 'product', 'lld'], note: 'Breadth: a backend design round and a frontend build round are both likely.' },
  { id: 'mobile', name: 'Mobile engineer', language: 'kotlin', tracks: ['dsa', 'mobile', 'lang', 'lld', 'fund', 'career'], optional: ['sd', 'product'], note: 'Platform depth and mobile system design; switch the language to Swift for iOS.' },
  { id: 'ml', name: 'ML / AI engineer', language: 'python', tracks: ['dsa', 'ai', 'sd', 'lang', 'sql', 'career'], optional: ['ops', 'product'], note: 'ML fundamentals, LLM apps with evals, and ML system design, plus standard coding rounds.' },
  { id: 'devops', name: 'DevOps / platform / SRE', language: 'go', tracks: ['ops', 'sd', 'lang', 'fund', 'dsa', 'career'], optional: ['sql', 'lld'], note: 'Infrastructure, reliability and debugging go deepest; coding rounds are usually lighter.' },
  { id: 'generalist', name: 'Generalist / new grad', language: 'python', tracks: ['dsa', 'fund', 'lang', 'lld', 'sd', 'career'], optional: ['product', 'sql'], note: 'Strong DSA and CS fundamentals first; system design at a basic level.' },
]
