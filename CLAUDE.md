@AGENTS.md
@../../Aboutme.md

# Claude: how to work on this project

## Where the rules live

Every project rule is its own file in `.claude/rules/` and is loaded automatically:

- Rules **without** `paths:` frontmatter load every session — workflow, tech stack,
  explaining, screenshot loop, definition of done.
- Rules **with** `paths:` frontmatter load only when you read or edit a file matching
  those globs — HTML structure, responsive, performance, accessibility, SEO,
  e-commerce UX, code quality, design method.

`AGENTS.md` is the index and describes what each file covers. Do not restate a rule here
or in `AGENTS.md`; edit the rule file and bump nothing else.

## Adding or changing a rule

1. Create or edit one topic per file in `.claude/rules/`, numbered `NN-topic.md`.
2. Give it `paths:` frontmatter only if it applies to specific file types. Leave it out
   for anything that governs how you behave.
3. Add the file to the table in `AGENTS.md`.

Run `/memory` if you are unsure which rules are actually loaded.

## Never

- Call a visual task done without taking screenshots.
- Use frameworks or libraries.
- Delete or replace files without asking.
