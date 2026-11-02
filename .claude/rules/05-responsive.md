---
paths:
  - "**/*.css"
  - "**/*.html"
---

# Mobile first

Design for a phone screen first; Google ranks sites by their mobile version.

- Write the phone layout first, then add CSS `@media (min-width: …)` rules for bigger
  screens. Never write desktop-first and patch it down.
- Make tap targets (buttons, links) at least **44×44px**.
- Never let the page scroll sideways on a phone.
- Use flexible layouts (`flexbox`, `grid`, `%`, `rem`) instead of fixed pixel widths.
