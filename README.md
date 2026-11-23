# Deep Prep 🌊

An interview prep tracker for DSA, system design, AI/ML, DevOps and CS fundamentals. You choose the plan length (14–365 days) and the areas.
Every bit of work takes you deeper: XP is measured in metres, levels go from the Shoreline to Challenger Deep.

## What's inside

- **Today**: day X of your plan, daily tasks (weekday / Saturday / Sunday schedules), next problems picked for you, review queue, 90-day dive log, reflection.
- **Roadmap**: plan setup (length, start date, areas), phases, and a week-by-week plan where each area's module has topics, practice and the best resources.
- **DevOps & delivery**: CI/CD, Docker, deployment strategies, Kubernetes, IaC/GitOps, database migrations and operations, observability, supply-chain security, plus a ship-it project.
- **DSA**: 19 patterns, ~150 LeetCode problems (NeetCode 150 ones tagged `NC`), spaced repetition (3 → 6 → 12 → 24 days → mastered), notes per problem, add your own problems.
- **System design**: interview framework, 20 building blocks, 16 practice designs (including AI/ML systems) with session counts and confidence ratings.
- **AI/ML**: classic ML → deep learning → LLM engineering → ML system design, plus RAG project milestones.
- **Fundamentals**: networking, OS, databases, code design, and 8 STAR story templates.
- **Library**: books, courses and videos (including trending tech: AI agents & MCP, Kubernetes, Terraform, Go, Rust, Kafka, OpenTelemetry) with progress counters and "where I left off" notes.
- **Mock interviews**: log sessions with ratings and takeaways.
- **Achievements**: 28 badges, depth levels, streak freezes, focus timer rewards.

Progress is cached in your browser (localStorage) and can be backed up online to a **private GitHub Gist** in your own account:
Settings → Online backup → paste a GitHub token with only the `gist` scope. Paste the same token on other devices and
the backup is found automatically; the newest copy wins. The gist file (`deep-prep-progress.json`) has the same format
as an exported backup, so you can download it and import it anywhere. You can also export a backup file from Settings.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Vercel (easiest)

1. Push this folder to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Deep Prep tracker"
   git branch -M main
   git remote add origin https://github.com/<you>/deep-prep.git
   git push -u origin main
   ```
2. Go to https://vercel.com/new, import the repo, keep the defaults (Framework: Vite, build `npm run build`, output `dist`), click **Deploy**.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys on every push to `main`.

1. Push the repo to GitHub (steps above).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push again (or run the workflow from the Actions tab). Your site will be at `https://<you>.github.io/<repo>/`.

## Customising

- Modules per area and how they are spread over your plan: `src/data/curriculum.js`
- Daily tasks, resources, topics, levels: `src/data/content.js`
- DSA patterns and problems: `src/data/problems.js`
- Colours and fonts: the variables at the top of `src/styles.css`
