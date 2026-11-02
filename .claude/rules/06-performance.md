---
paths:
  - "**/*.html"
  - "**/*.css"
  - "**/*.js"
---

# Speed (Google Core Web Vitals)

Google measures three things. Aim for "good" on all of them:

| Metric | What it means | Good |
|---|---|---|
| **LCP**: Largest Contentful Paint | How fast the main content shows up | ≤ 2.5s |
| **INP**: Interaction to Next Paint | How fast the page reacts when you click | ≤ 200ms |
| **CLS**: Cumulative Layout Shift | How much things jump around while loading | ≤ 0.1 |

How to hit those numbers:

- **Images:** use WebP or AVIF, size them to how they're shown, and always set `width`
  and `height` (this stops jumping). Add `loading="lazy"` to images below the fold, but
  **not** to the hero image.
- **Fonts:** load only the weights you use, with `&display=swap`.
- **JavaScript:** keep it small. Load scripts with `defer` so the page shows first.
- **CSS:** one stylesheet, no unused rules.
- Test with **Lighthouse** (Chrome DevTools → Lighthouse tab) and **PageSpeed Insights**.
