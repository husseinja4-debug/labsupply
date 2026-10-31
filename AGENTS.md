# AGENTS.md — LabSupply

Rules for anyone (human or AI) working on this project.

## Before every task
1. Read `../../Aboutme.md` to understand who I am.
2. Read `plan.md` and follow it. Build in the order it lists.
3. Read `progress.md` to see what's done and what's next.

## Execute, don't stall
- When given a plan or an instruction, **execute it. Start building right away.**
- Don't ask "should I proceed?" or "is this ok?". Just do the task.
- If something is unclear, make the sensible choice, say what you chose, and keep going.
- The only times to stop and ask: deleting or replacing files, or when an instruction contradicts `plan.md`.

## Tech rules
- Plain HTML, CSS, and JavaScript only.
- No frameworks or libraries (no React, Vue, Tailwind, Bootstrap, jQuery, etc.).
- No build tools. Every page must open directly in a browser.
- Keep one shared `styles.css` and one shared `script.js` unless plan.md says otherwise.

## How to explain things
- I'm a beginner. Explain simply, in plain words.
- When you add something new, say in a sentence or two what it does and why.
- Avoid jargon. If you must use a technical term, explain it.

## Progress
- After each step, update `progress.md`: move finished items to **Done** and update **Next**.

## Safety
- Ask me before deleting or replacing any file.
- Change only what the task asks for.

---

# Website Building Best Practices

Follow these on every page. Sources: Google (web.dev, Search Central), Baymard Institute (e-commerce UX research), and common advice from experienced web developers.

## 1. Structure (HTML)
- Use **semantic HTML**: use tags for what things *are*, like `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<button>`, `<form>`. Don't build everything from `<div>`s.
- Use exactly one `<h1>` per page, then `<h2>`, `<h3>` in order. Never skip levels.
- Use a real `<button>` for actions and a real `<a href>` for links.
- Every page needs `<!doctype html>`, `<html lang="en">`, `<meta charset="utf-8">`, and `<meta name="viewport" content="width=device-width, initial-scale=1">`.

## 2. Mobile first
- Design for a phone screen first, then add CSS `@media (min-width: …)` rules for bigger screens. Google ranks sites by their mobile version.
- Make tap targets (buttons, links) at least **44×44px**.
- Never let the page scroll sideways on a phone.
- Use flexible layouts (`flexbox`, `grid`, `%`, `rem`) instead of fixed pixel widths.

## 3. Speed (Google Core Web Vitals)
Google measures three things. Aim for "good" on all of them:
| Metric | What it means | Good |
|---|---|---|
| **LCP**: Largest Contentful Paint | How fast the main content shows up | ≤ 2.5s |
| **INP**: Interaction to Next Paint | How fast the page reacts when you click | ≤ 200ms |
| **CLS**: Cumulative Layout Shift | How much things jump around while loading | ≤ 0.1 |

How to hit those numbers:
- **Images:** use WebP or AVIF, size them to how they're shown, and always set `width` and `height` (this stops jumping). Add `loading="lazy"` to images below the fold, but **not** to the hero image.
- **Fonts:** load only the weights you use, with `&display=swap`.
- **JavaScript:** keep it small. Load scripts with `defer` so the page shows first.
- **CSS:** one stylesheet, no unused rules.
- Test with **Lighthouse** (Chrome DevTools → Lighthouse tab) and **PageSpeed Insights**.

## 4. Accessibility (works for everyone)
- Every image gets `alt="…"` text describing it. Purely decorative images get `alt=""`.
- Text must contrast enough with its background (at least **4.5:1**). Check muted gray on dark backgrounds especially.
- Everything must work with the **keyboard** alone (Tab, Enter, Esc). Never remove the focus outline without replacing it.
- Every form input needs a visible `<label>`.
- Don't use color alone to show meaning (e.g. errors need text too).
- Respect `prefers-reduced-motion` for animations.
- Test with Lighthouse and the **axe DevTools** or **WAVE** browser extension.

## 5. SEO (getting found on Google)
- Every page gets a unique `<title>` (about 50–60 characters) and `<meta name="description">` (about 150 characters).
- Use clear, readable URLs and file names (`shop.html`, not `page2.html`).
- Write descriptive link text ("View microscope details", not "click here").
- Product pages: add **Product structured data** (JSON-LD with name, image, price, availability). This makes Google show price and stock in search results.
- Add **Organization** and **BreadcrumbList** structured data.
- Add Open Graph tags (`og:title`, `og:image`) so links look good when shared.
- Before launch: add `robots.txt`, `sitemap.xml`, and a favicon.

## 6. E-commerce UX (Baymard research)
- **Guest checkout:** never force people to create an account to buy. Forced accounts are one of the top reasons people abandon carts.
- **Short checkout form:** ask only for what's needed. The average checkout has about 15 fields, roughly double what most purchases need.
- **Show the total cost early:** subtotal, shipping, and tax are visible in the cart *before* checkout. Surprise costs are the #1 reason people abandon carts.
- **Clear error messages:** say exactly what's wrong and how to fix it, next to the field.
- **Product pages:** big clear images, price, stock status, specs, and an obvious "Add to cart" button.
- **Search and filters:** search finds products by name and category. Always show a helpful "no results" message.
- Show trust signals: contact info, return policy, secure-checkout note.
- After "Add to cart", give clear feedback (the cart count updates and a short message appears).

## 7. Code quality
- Keep it simple and readable. Clear names, small functions, comments only where the *why* isn't obvious.
- Reuse styles with CSS variables (`--color-accent`) instead of repeating values.
- Don't copy-paste the same header and footer code in different ways. Keep them identical on every page.
- Wrap `localStorage` reads and writes in `try/catch` so the site still works if storage is blocked.
- Never put secrets (API keys, passwords) in front-end code.

## 8. Check before calling a step done
1. Open it in the browser. Does it look right?
2. Shrink the window to phone size. Does it still work?
3. Tab through it with the keyboard. Can you reach everything?
4. Open DevTools → Console. Are there any red errors?
5. Run Lighthouse. Aim for 90+ in Performance, Accessibility, Best Practices, and SEO.
6. Click every link and button.

---

# Design Method

How to make it look professional. Based on *Refactoring UI* (Wathan & Schoger) and common designer advice.

## Process order
1. **Start from a reference.** Before designing a section, find 1–3 real sites you like (premium lab/science/tech stores) and say what to copy: layout, spacing, mood. Never design from "make it modern".
2. **Layout first, in grayscale.** Get structure and spacing right with no color. If the hierarchy works in gray, it'll work in color.
3. **Then type, then color, then polish** (shadows, glows, hover effects) last.

## Hierarchy
- Every section has **one** most important thing. Make it obvious through **size, weight, and contrast**, not just color.
- Make less important things quieter (muted color, smaller) instead of making everything bigger.
- **Squint test:** blur your eyes. Can you still tell what matters most?

## Spacing system
- Only use these spacing values: **4, 8, 12, 16, 24, 32, 48, 64, 96, 128px**. Save them as CSS variables (`--space-1` … `--space-10`).
- Put more space *between* groups than *inside* them, so related things sit together.
- When in doubt, add more white space. Crowded looks cheap, spacious looks premium.

## Typography
- Two fonts max: **Space Grotesk** for headings, **Inter** for body.
- Use a fixed size scale: **12, 14, 16, 18, 20, 24, 30, 36, 48, 60px**. No random sizes.
- Body text is at least 16px, line-height about 1.5, lines no wider than about 65–75 characters.
- Headings: tighter line-height (about 1.1–1.2) and a bit of negative letter-spacing on big sizes.

## Color
- Stick to the palette in `plan.md`. Each color can have lighter/darker shades, but don't invent new colors.
- **One accent color (teal)**, used only for what you want clicked: main buttons, links, active states.
- On dark backgrounds, make cards slightly lighter than the page instead of using heavy borders.
- Check text contrast (4.5:1 minimum). Muted gray on dark is the usual failure.

## Depth and polish
- Small shadow or glow means slightly raised (cards). Larger means floating (menus, popups).
- Prefer background differences and spacing over lots of borders.
- Every clickable thing has hover, focus, and active states.
- Keep animations subtle and quick (150–250ms).
- Consistent corner radius everywhere (8px).

## Consistency
- Reuse the same button, card, and input styles everywhere, built once in `styles.css`.
- Same header and footer on every page.

---

# Screenshot Loop (visual check)

Code that *works* can still *look* wrong. After building or changing anything visual, **look at it**. Don't guess.

## The loop
1. **Build** the section.
2. **Screenshot** it in the browser at two sizes:
   - Phone: **375px** wide
   - Desktop: **1440px** wide
3. **Compare** the screenshot to the reference or design goal. Write down every difference as a specific list. Say "the button is 20px too close to the edge", not "it looks off".
4. **Fix** the differences.
5. **Repeat** steps 2–4 until nothing important is left (usually 2–3 rounds; stop after 5 and ask me).
6. **Show me** the final screenshots before calling the step done.

## Rules
- Do the screenshot loop **before** saying a visual task is done.
- Check hover and focus states too, not just the default view.
- Check the console for errors at the same time.
- If a fix breaks something else, compare the old and new screenshots to find what changed.
- Screenshots are temporary. Don't save them in the project folder.

## Tools
- **Claude Code:** use the browser tool (Claude in Chrome, the built-in browser, or Playwright MCP) to open the page, resize it, and take screenshots.
- **By hand:** open the page in Chrome, press F12, then Ctrl+Shift+M to switch to a phone-size view.
