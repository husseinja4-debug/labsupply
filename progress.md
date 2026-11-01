# progress.md — LabSupply

## Done
- [x] Project planned (AGENTS.md, CLAUDE.md, plan.md, progress.md created)
- [x] Steps 1–9: design system, homepage, mobile pass, product data, shop, product, cart, checkout, about/contact/FAQ
- [x] Step 10: final check — Lighthouse 90+ on every page, keyboard pass, contrast audit, tap targets, headings, robots/sitemap, structured data
- [x] Redesign pass: editorial serif headings (Fraunces) + Inter Tight body, larger imagery, whole product cards clickable
- [x] Slide-out cart drawer with free-shipping progress, bundle offer, cross-sell, coupon (LAB5), live totals
- [x] Quantity pricing tiers on product pages (5+ = 5%, 9+ = 10%), applied in the cart as well
- [x] "Choose the right scale" pack-size section
- [x] Testing methodology section with sample chromatogram and four numbered tests
- [x] COA verification band: search by compound name or COA number, quick chips, result panel
- [x] Latest batch releases: certificate previews, viewer dialog, real .txt download
- [x] Category landing pages (`category.html?category=…`) with intro copy, sort, grid/list toggle
- [x] 21+ age gate with the exact research-use wording, cannot be dismissed with Escape
- [x] Compliance: no injection accessories sold, no testimonials, no dosing/reconstitution guidance, verbatim research-use disclaimers

## Next
- [ ] Replace the generated placeholder photography with real product photos
- [ ] Put the real domain into `robots.txt` and `sitemap.xml` before launch
- [ ] Replace the demo batch records in `products.js` with real laboratory results
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
