---
paths:
  - "**/*.html"
  - "**/*.css"
  - "**/*.js"
---

# Accessibility

The site has to work for everyone, including keyboard-only users and screen readers.

- Every image gets `alt="…"` text describing it. Purely decorative images get `alt=""`.
- Text must contrast enough with its background (at least **4.5:1**). Check muted gray on
  dark backgrounds especially.
- Everything must work with the **keyboard** alone (Tab, Enter, Esc). Never remove the
  focus outline without replacing it.
- Every form input needs a visible `<label>`.
- Don't use color alone to show meaning (e.g. errors need text too).
- Respect `prefers-reduced-motion` for animations.
- Test with Lighthouse and the **axe DevTools** or **WAVE** browser extension.
