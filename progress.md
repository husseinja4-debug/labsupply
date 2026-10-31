# progress.md — LabSupply

## Done
- [x] Project planned (AGENTS.md, CLAUDE.md, plan.md, progress.md created)
- [x] Step 1: Setup — `styles.css` design system (cream + deep plum, pill buttons, spacing and type scales)
- [x] Step 2: Homepage — announcement bar, header + search + nav, hero, trust row, dark proof card, tested-for list, stats, how it works, plum band, product rail with arrows and dots, quote, newsletter, docs, research notice, footer
- [x] Step 3: Mobile pass — checked at 375px and 1440px, nav strip, hero buttons, trust grid and card images fixed
- [x] Step 4: Product data — `products.js` with 12 products (name, category, size, price, image, blurb, specs)
- [x] Step 5: Shop page — search, category chips, result count, empty state (cards are in the HTML, JS only filters)
- [x] Step 6: Product page — reads `?id`, shows specs, quantity picker, add to cart, missing-product state
- [x] Step 7: Cart page — quantities +/-, remove, subtotal, shipping, free-shipping hint, saved in `localStorage`
- [x] Step 8: Checkout page — six-field guest form, validation, research-use checkbox, order summary, thank-you state that clears the cart
- [x] Step 9: About, Contact, FAQ/policies pages, with a working contact form message
- [x] Step 10: Final check
  - [x] Every page loads with no console errors and no broken images
  - [x] Keyboard pass: skip link → logo → search → cart → nav → CTAs → cards, every stop shows a focus ring
  - [x] Contrast audited on every text element; breadcrumbs, footer fine print and buttons inside prose fixed
  - [x] Tap targets brought to 44×44 (nav links, search button, chips, rail arrows, quantity steppers, card buttons); pagination dots 24×24 (WCAG minimum)
  - [x] Headings in order on every page (hidden section headings where needed)
  - [x] `robots.txt`, `sitemap.xml`, favicon, Organization + Product structured data
  - [x] Lighthouse: index 90 / 100 / 100 / 100, shop 98 / 100 / 100 / 100, product 100 / 100 / 100 / 100, checkout 100 / 100 / 100 / 63 (checkout is deliberately `noindex`)
  - [x] Layout shift fixed: static shop cards, reserved space for chips and counters, hero preloaded with `fetchpriority="high"`
  - [x] Fonts load without blocking the first paint; scripts moved to the end of `<body>`

## Next
- [ ] Replace the generated placeholder photography with real product photos when they arrive
- [ ] Put the real domain into `robots.txt` and `sitemap.xml` before launch
- [ ] Optional: real payment step (Stripe) and a backend for orders
- [ ] Optional: remove the unused first-design SVGs in `images/` (ask first)

## Notes
- 2026-10-31 — Design direction changed on request: the site follows the
  protidehealth.com layout and mood (warm cream, deep plum, pill buttons,
  editorial spacing) instead of the earlier dark + teal palette in `plan.md`.
  Brand name, copy and product data stay LabSupply's. All colours are tokens at
  the top of `styles.css`, so a palette change is a small edit.
- 2026-10-31 — Two sans families plus one italic serif accent
  ("Instrument Serif") for emphasised words, matching the reference.
- 2026-10-31 — Product photography is AI-generated placeholder imagery
  (`images/*.webp`) on a consistent cream/greige set. Swap for real photos later.
- 2026-10-31 — Site is plain HTML/CSS/JS and opens directly from disk
  (`index.html`), no server or build step needed.
