---
paths:
  - "**/*.css"
  - "**/*.html"
---

# Design method

How to make it look professional. Based on *Refactoring UI* (Wathan & Schoger) and common
designer advice.

## Process order

1. **Start from a reference.** Before designing a section, find 1–3 real sites you like
   (premium lab/science/tech stores) and say what to copy: layout, spacing, mood. Never
   design from "make it modern".
2. **Layout first, in grayscale.** Get structure and spacing right with no color. If the
   hierarchy works in gray, it'll work in color.
3. **Then type, then color, then polish** (shadows, glows, hover effects) last.

## Hierarchy

- Every section has **one** most important thing. Make it obvious through **size, weight,
  and contrast**, not just color.
- Make less important things quieter (muted color, smaller) instead of making everything
  bigger.
- **Squint test:** blur your eyes. Can you still tell what matters most?

## Spacing system

- Only use these spacing values: **4, 8, 12, 16, 24, 32, 48, 64, 96, 128px**. Save them
  as CSS variables (`--space-1` … `--space-10`).
- Put more space *between* groups than *inside* them, so related things sit together.
- When in doubt, add more white space. Crowded looks cheap, spacious looks premium.

## Typography

- Three fonts, three jobs: **Inter Tight** (headings), **Inter** (body), **IBM Plex Mono**
  (eyebrows, specs, prices). See `../../brand/brand-guide.md`.
- Use the size scale in the brand guide: 12, 16, 20, 24, 36, 48, 64px. No random sizes.
- Body text is at least 16px, line-height 1.6, lines no wider than 680px.
- Headings: sentence case, tight line-height, negative letter-spacing.

## Color

- Stick to the tokens in `styles.css`, which come from `../../brand/brand-guide.md`. Do not
  invent colours.
- **Lab Blue `#2F5BEA`, used only for what you want clicked.** One primary button per view.
- On dark panels, make cards slightly lighter than the page instead of using heavy
  borders.
- Check text contrast (4.5:1 minimum). Muted grey on dark is the usual failure.

## Depth and polish

- Cards are separated by 1px borders. No shadow until hover.
- Prefer background differences and spacing over lots of borders.
- Every clickable thing has hover, focus, and active states.
- Keep animations subtle and quick (150–400ms).
- Radii: 6px small, 10px buttons, 16px cards. Nothing else.

## Consistency

- Reuse the same button, card, and input styles everywhere, built once in `styles.css`.
- Same header and footer on every page.
