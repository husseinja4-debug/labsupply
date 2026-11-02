# AGENTS.md — Ordyn

Entry point for anyone — human or AI — working on this project.

The rules are split by topic into `.claude/rules/`, one file per topic. **Claude Code
loads these automatically** (see `CLAUDE.md`). Any other tool should read the matching
files before starting work, or read all of them once at the top of a session.

## Read first, every session

1. `../../Aboutme.md` — who I am.
2. `../../brand/brand-guide.md` — before any design or writing work.
3. `plan.md` — build in the order it lists.
4. `progress.md` — what's done and what's next.

## Always applies

| Rule file | Covers |
|---|---|
| `.claude/rules/01-workflow.md` | Before every task, execute don't stall, progress, safety |
| `.claude/rules/02-tech-stack.md` | Plain HTML/CSS/JS only, no frameworks, no build tools |
| `.claude/rules/03-explaining.md` | Plain-words explanations, no jargon |
| `.claude/rules/12-screenshot-loop.md` | Visual work: build, screenshot, compare, fix, repeat |
| `.claude/rules/13-definition-of-done.md` | The six checks before calling a step done |

## Applies when you touch markup, styles or scripts

| Rule file | Covers | Paths |
|---|---|---|
| `.claude/rules/04-html-structure.md` | Semantic tags, one `h1`, document boilerplate | `**/*.html`, `**/*.js` |
| `.claude/rules/05-responsive.md` | Mobile first, 44px tap targets, no sideways scroll | `**/*.css`, `**/*.html` |
| `.claude/rules/06-performance.md` | Core Web Vitals: LCP, INP, CLS | `**/*.html`, `**/*.css`, `**/*.js` |
| `.claude/rules/07-accessibility.md` | Alt text, 4.5:1 contrast, keyboard, focus | `**/*.html`, `**/*.css`, `**/*.js` |
| `.claude/rules/08-seo.md` | Titles, meta, structured data, sitemap | `**/*.html`, `**/sitemap.xml`, `**/robots.txt` |
| `.claude/rules/09-ecommerce-ux.md` | Guest checkout, total cost early, cart feedback | `**/*.html`, `**/*.js` |
| `.claude/rules/10-code-quality.md` | Readable code, shared components, no secrets, asset versions | `**/*.js`, `**/*.css`, `**/*.html` |
| `.claude/rules/11-design-method.md` | Reference first, hierarchy, spacing, type, colour | `**/*.css`, `**/*.html` |

The **Paths** column is the same glob list each rule declares in its YAML frontmatter, so
Claude Code only pulls a rule in when a matching file is being worked on.

## Editing these rules

- One topic per file. If a rule grows a second subject, split it.
- Change a rule in its file, not in `AGENTS.md` or `CLAUDE.md` — both are only indexes.
