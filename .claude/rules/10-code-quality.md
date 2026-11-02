---
paths:
  - "**/*.js"
  - "**/*.css"
  - "**/*.html"
---

# Code quality

- Keep it simple and readable. Clear names, small functions, comments only where the
  *why* isn't obvious.
- Reuse styles with CSS variables (`--color-accent`) instead of repeating values.
- Don't copy-paste the same header and footer code in different ways. Keep them identical
  on every page.
- Wrap `localStorage` reads and writes in `try/catch` so the site still works if storage
  is blocked.
- Never put secrets (API keys, passwords) in front-end code.
- When `styles.css` or `script.js` changes significantly, bump the `?v=` version on the
  `<link>` and `<script>` tags so browsers don't serve a stale copy.
