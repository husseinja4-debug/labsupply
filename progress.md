# progress.md — LabSupply

## Done
- [x] Project planned (AGENTS.md, CLAUDE.md, plan.md, progress.md created)
- [x] Step 1: Setup — `styles.css` design system (cream + deep plum, pill buttons, spacing and type scales)
- [x] Step 2: Homepage — announcement bar, header + search + nav, hero, trust row, dark proof card, tested-for list, stats, how it works, plum band, product rail with arrows and dots, quote, newsletter, docs, research notice, footer
- [x] Step 3: Mobile pass — checked at 375px and 1440px, nav strip, hero buttons, trust grid and card images fixed
- [x] Step 4: Product data — `products.js` with 12 products (name, category, size, price, image, blurb, specs)
- [x] Step 5: Shop page — search, category chips, result count, empty state
- [x] Step 6: Product page — reads `?id`, shows specs, quantity picker, add to cart, missing-product state
- [x] Step 7: Cart page — quantities +/-, remove, subtotal, shipping, free-shipping hint, saved in `localStorage`
- [x] Step 8: Checkout page — six-field guest form, validation, research-use checkbox, order summary, thank-you state that clears the cart
- [x] Step 9: About, Contact, FAQ/policies pages, with a working contact form message
- [x] Every page loads with no console errors and no broken images
- [x] Buttons tested end to end: add to cart, quantity, remove, search, filters, checkout, newsletter, contact

## Next
- [ ] Step 10: Final check — Lighthouse pass (Performance, Accessibility, Best Practices, SEO 90+), keyboard tab order, favicon/robots.txt/sitemap.xml before launch
- [ ] Replace the generated placeholder photography with real product photos when they arrive
- [ ] Optional: real payment step (Stripe) and a backend for orders

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
