# progress.md — Ordyn

**Status:** the site is built and running on the Ordyn brand; everything below the
"Rebrand to Ordyn" section documents the earlier LabSupply build and is kept as a
record of what the pages can do.

---

## Rebrand to Ordyn (current)

Source of truth: `../../brand/brand-guide.md` (v1.1).

### Done
- [x] `styles.css` rewritten to the Ordyn system: bone/white/ink at 70/20/10, Lab Blue
      for actions only, Inter Tight / Inter / IBM Plex Mono, spacing and radius tokens,
      1px borders with shadow on hover only, 150/250/400ms motion, reduced-motion
- [x] Logo: measurement mark as inline SVG, wordmark set as `mark + "rdyn"` with the
      full name in the `aria-label`; favicon rebuilt from the symbol alone
- [x] Name, titles, meta, Open Graph, structured data and email moved to Ordyn /
      ordyn.example
- [x] Navigation cut from seven links to the five the guide allows
- [x] Footer disclaimer replaced with the approved two-paragraph copy; copyright line
      reads "© 2026, Ordyn. All rights reserved."
- [x] Product cards carry a catalogue number (`ORD-0001` …), a research-use line under
      the price, and mono pricing — on the home rail, on `shop.html` and on every
      JS-rendered grid
- [x] Product page: catalogue-number eyebrow, research-use line beside the price, dark
      mono specification panel
- [x] Home page rebuilt to the brand (hero on ink, trust strip, catalogue, batch-record
      panel with chromatogram, certificate lookup, CTA band, documentation, compliance,
      batch notes)
- [x] Fixed: closed `<dialog>` elements rendering on load; horizontal overflow from
      nowrap top-bar text and grid children that could not shrink
- [x] Verified in Chrome at 1440 and 390: home, shop, product, cart, about, support
- [x] Home hero rewritten to "Specified per lot. Documented per order." with a factual
      lede that leads on purity, identity, form and storage
- [x] Closing CTA band centred (`.band--center`): eyebrow, heading, lede, three columns
      and the button all sit on the page axis
- [x] Trust strip rebuilt as a slow marquee — 52s linear loop, three duplicated groups so
      the wrap is seamless, masked edges, white surface with blue ticks so it reads as a
      band rather than a pale divider; duplicates are `aria-hidden` and the whole strip
      falls back to a centred static row under `prefers-reduced-motion`
- [x] Navigation cut to five: Products · Categories · COA library · Wholesale · Support.
      About and Contact moved out of the nav; both remain in the footer
- [x] New `wholesale.html`: institutional ordering, volume terms (5% / 10% / Net 30),
      account opening, stated limits, quote CTA. Added to `sitemap.xml`, the nav and the
      footer Resources column on every page
- [x] Product page: the specification table is no longer a dark block in the right-hand
      column. It is now a light bordered panel sitting directly under the product photo,
      which uses the empty space in the left column. On phones it stacks after the buy
      box, before Related compounds
- [x] Trust strip direction reversed — it now travels to the right — and the type raised
      from 13px to 16px with wider gaps and larger ticks
- [x] Navigation moved out of its own row and into the header: from 1024px up the five
      links sit in a bordered tab band between the search and the account/cart cluster.
      Below 1024 it stays a scrolling strip on its own row. (It had been `display: none`
      on every desktop width, so no tabs were visible at all.)
- [x] Stylesheet and script URLs are versioned (`styles.css?v=4`). The old copy
      was being served from the browser cache, so page markup and CSS fell out of sync:
      the trust strip rendered as bare bullet lists, the specification panel stayed dark
      and the tabs stayed hidden. Bump the value whenever `styles.css` or `script.js`
      changes significantly.
- [x] Fixed the real cause of the frozen trust strip: a blanket
      `prefers-reduced-motion` rule at the end of `styles.css` set
      `animation-duration: 0.01ms !important` on `*`, which beat every other rule. The
      track is now exempted and reports `52s infinite running`.
- [x] Email offer: a modal after 12s or 1,400px of scroll, asking for an address in
      exchange for `WELCOME10` (10% off). Dismissal is remembered in `localStorage`, and
      `WELCOME10` is wired into the cart alongside `LAB5`.
- [x] Support chat: a "Chat with Kit" launcher bottom-right on every page, with a
      rule-based assistant covering certificates, shipping, returns, wholesale, discounts,
      payment, storage and solubility — and refusing dosing or reconstitution questions,
      which is the compliance boundary.
- [x] `wholesale.html` gained a proper application form: institution, type, expected
      volume, contact, work email, phone, shipping city, PO/tax reference, plus RUO and
      21+ confirmations. Client-side validation, no backend yet.
- [x] Age gate now remembers acceptance for the session only, so it greets each new visit
      instead of disappearing forever.
- [x] Removed the duplicate research-use line on the product page; the badge alone carries
      it there, and the full statement still appears in the compliance panel below.
- [x] Brand audit must-fixes (2026-11-02), asset version bumped to `v=4`:
      - Top bar: the research-use line no longer truncates (it was cut off with "…"
        at 1440). Top bar set in Inter 12px; the third message shows from 1280px up
      - Every product card and the product page carry a **RESEARCH USE ONLY** badge;
        the research-use sentence is now plain sentence case, not mono capitals
      - One research-use wording everywhere: the category note, the product-page
        compliance box (the duplicate notice box was folded into it), the COA viewer
        and the downloadable certificate
      - "LabSupply" removed from page titles, share titles, product structured data,
        category copy and the certificate download name
      - Email is `hello@ordyn.example` (lowercase) on every page
      - Demo certificates: reported purity now always sits above each product's
        published minimum, and lot numbers run `-048, -049, -050…`

### Next
- [ ] Phones: since the nav moved beside the cart, the nav is 501px wide at 375px and
      the whole page can be dragged about 126px sideways
- [ ] Remaining audit items: off-scale font sizes and spacing, body text under 16px,
      mixed spelling (catalogue/catalog, fulfilment/fulfillment), numbers written as
      words, title-case page titles
- [ ] Story, mission and values are still not supplied; the About copy is the old one
      and needs rewriting in the Ordyn voice once those are written
- [ ] Real product photography at the brand's cool grade (current set is placeholder)
- [ ] Legal review of the footer disclaimer, especially the 503A/503B paragraph
- [ ] Confirm the wholesale terms on `wholesale.html` (net 30, institutional-only
      shipping) before the page goes live
- [ ] Domain, payments, hosting before launch
- [ ] Optional: dark-mode pass using `[data-theme="dark"]`, already wired in the tokens

---

## Done

### Design system
- [x] `styles.css` tokens: cream `#FAF7F2` / deep plum `#3B0F35`, line, muted, spacing scale (4→128), type scale (12→60), 8px radius
- [x] Typography: **Fraunces** for headings and italic accents, **Inter Tight** for body and UI
- [x] Components: pill buttons (solid / outline / light / on-dark), cards, chips, fields, summary panel, empty states, toasts
- [x] Motion: 200–300ms transitions, hover lift and image zoom, `prefers-reduced-motion` respected

### Shared shell (every page)
- [x] Announcement bar: "All products are for research use only, not for human use." + shipping + COA note
- [x] Sticky header: logo, search, account, cart button with live count
- [x] Navigation strip that scrolls sideways on phones and centres on desktop
- [x] Footer: four trust features, brand block, four link columns, full legal disclaimer, legal links
- [x] Skip link, semantic landmarks, one `h1` per page, heading order checked

### Homepage (`index.html`)
- [x] Hero with 21+ research badge, headline, CTAs, clickable product photo
- [x] Trust strip (HPLC-MS verified, independent lab testing, third-party COAs, ships in 24 hours)
- [x] Dark "HPLC-MS tested" card + "Independently Lab Tested For" list
- [x] Stats row (12,400+ orders, 99.4% average purity)
- [x] How It Works — three numbered cards
- [x] Plum band: "Buy Research Compounds Online: Verified 99% Purity & Identity"
- [x] Product rail: five cards, arrows, page dots, whole-card links
- [x] Testing methodology: "Four tests, every batch, every time." with sample chromatogram SVG and 01–04 columns
- [x] COA verification band: "Every batch on the record. Verify yours." + working lookup (name or COA number), quick chips, result panel
- [x] Latest batch releases: three certificate cards, mini document preview, viewer dialog, real `.txt` download
- [x] Pack-size section: "Choose the right scale for your research." (1 / 10 / 100) with popular highlight
- [x] Statement block (no testimonials), promise checklist, newsletter form with validation
- [x] Documentation section (COA image, two text blocks)
- [x] Compliance band: "Research use only · 21+" with four warnings
- [x] Research-use-only notice and full footer disclaimer

### Shop and categories
- [x] `shop.html`: search, category chips, result count, empty state, 12 static cards (no layout shift)
- [x] `category.html?category=…`: per-category intro copy, search, "Showing all N results", sort (popularity / price / name), grid–list toggle, 404-style empty state
- [x] Footer category links point at the category pages

### Product page (`product.html?id=…`)
- [x] Reads the id from the link, fills name, category, price, size, description
- [x] Purity, "tested by" and SKU lines
- [x] Certificate of Analysis button
- [x] Quantity tiers: 1–4 full price, 5–8 −5%, 9+ −10% (radio table, live per-vial prices)
- [x] Stepper + add to cart (tier discount carries into the cart)
- [x] Specs table, batch documentation panel, compliance note, research-use notice
- [x] Four related compounds
- [x] Product JSON-LD, breadcrumb JSON-LD, updated title/description/share tags
- [x] Missing-product state

### Cart, checkout, forms
- [x] Slide-out cart drawer on every page: full viewport height, pinned footer, free-shipping progress, bundle offer, line items with steppers/remove, compliant cross-sell (glass sample vials), coupon `LAB5`, subtotal, savings, checkout and cart links
- [x] `cart.html`: quantity +/−, remove, subtotal, bundle/coupon saving row, shipping, total, free-shipping hint, empty state, saved in `localStorage` (wrapped in try/catch)
- [x] `checkout.html`: six-field guest form, inline validation, research-use checkbox, order summary with discounts, thank-you state that clears the cart, `noindex`
- [x] `contact.html`: form with validation and status message, direct contact details
- [x] `faq.html`: shipping, testing/COA, returns, school purchase orders, research-use policy, support
- [x] `about.html`: story, method, who we serve, location, CTAs

### Age gate and compliance
- [x] 21+ gate on entry with the exact wording ("Are you 21 or Older…", "Are you over 21 years of age?"), "I agree & enter" / "I am under 21"
- [x] Gate cannot be dismissed with Escape or a backdrop click; under-21 gets a hard stop
- [x] Remembers acceptance (localStorage with sessionStorage fallback)
- [x] No injection accessories sold — bacteriostatic water removed and replaced with glass sample vials
- [x] No testimonials or human-use reviews; the quote block is a statement, the star rating was removed
- [x] No dosing, reconstitution or administration content; pages state we cannot provide it
- [x] Research-use wording copied verbatim into the top bar, the notice section and the footer legal block

### Quality, SEO and speed
- [x] `robots.txt`, `sitemap.xml`, `favicon.svg`, Open Graph tags
- [x] Organization, Product and Breadcrumb structured data
- [x] Contrast audited on every text element; all failures fixed
- [x] Tap targets: primary controls 44×44, secondary controls at least 24×24
- [x] Keyboard pass: skip link → logo → search → cart → nav → CTAs → cards, visible focus ring at every stop
- [x] Fonts load without blocking first paint; scripts at the end of `<body>`; hero preloaded with `fetchpriority="high"`
- [x] Cards are in the HTML on shop (no CLS); reserved space for chips, counters and drawer
- [x] No console errors and no broken images on any page

### Tested end to end
- [x] Add to cart, quantity changes, remove, cart badge, toast
- [x] Bundle discount (5% at three different compounds) and coupon `LAB5`
- [x] Quantity tiers applied in cart totals
- [x] Checkout validation, order placement, cart cleared
- [x] Shop search, category filters, category sort and grid/list toggle
- [x] COA lookup found / not found, certificate viewer, download
- [x] Whole-card click opens the product page; the Add to cart button does not navigate
- [x] Age gate accepted / declined, drawer opens from the header on every page

### Lighthouse (last run, local server)
| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Home | 98 | 100 | 100 | 100 |
| Shop | 97 | 100 | 100 | 100 |
| Category | 95 | 100 | 100 | 100 |
| Product | 100 | 100 | 100 | 100 |
| Checkout | 100 | 100 | 100 | 63 (deliberately `noindex`) |

Scores move a few points between runs on a local server without compression or caching.

### Saved
- [x] Git repository on `main`
- [x] `c59c785` full site v1 working
- [x] `d915f55` step 10: accessibility, SEO and performance pass
- [x] `cfb2d6e` add age gate, cart drawer, COA verification, category pages and compliance copy
- [x] `d707c02` fix cart drawer height so checkout footer stays visible

---

## Known limits (by design, for now)
- Photography is AI-generated placeholder imagery, not the real product.
- Batch records, purity figures, lot numbers and stats are demo data.
- Cart and checkout are local only: no payment, no order is sent anywhere, the thank-you screen is cosmetic.
- Search and filtering run in the browser; there is no backend index.
- Discount rules (3-compound bundle 5%, `LAB5` 5%, 5+/9+ tiers) stack — confirm the real rules before launch.
- Age acceptance is remembered per browser, not per session.
- The domain in `robots.txt` and `sitemap.xml` is the placeholder `labsupply.example`.
- Some categories hold a single product (copper, cofactors, supplies), so their pages look sparse.

---

## Next (in order)

1. **Real photography.** Replace `images/hero-vials.webp`, `card-vial.webp`, `vial-01…05.webp`, `coa-docs.webp` with real shots on the same cream/greige set; keep the same aspect ratios and update the `alt` text.
2. **Real batch data.** In `products.js`, replace every `batch` block (COA number, lot, reported date, purity) with the laboratory results, and correct the specs tables.
3. **Real certificates.** When PDFs exist, point the "View certificate" and "Download" actions at them instead of the generated `.txt`.
4. **Domain and indexing.** Put the real domain into `robots.txt` and `sitemap.xml`, add `category.html` entries, add canonical tags, make the Open Graph image an absolute URL.
5. **Catalogue gaps.** Add one or two more copper, cofactor and supply products — or hide categories that hold a single item.
6. **Payments and orders.** Add a server-side checkout (Stripe Payment Intents), order confirmation email, inventory counts, and move secrets out of the browser. Replace the demo thank-you with a real receipt page.
7. **Policies.** Add a standalone privacy policy and terms page (currently anchors in `faq.html`), and a 404 page.
8. **Final audit.** Re-run Lighthouse and axe on real content, test on a physical phone, verify keyboard flow through the age gate and drawer, and confirm every link resolves.
9. **Deploy.** Choose a host with HTTPS, enable compression and cache headers (the two things still flagged locally), then run the launch checklist in AGENTS.md.
10. **Housekeeping.** Remove the unused first-design SVGs in `images/` (hero, flask, beaker-set, docs, hotplate, kit, pipette, reagent-bottle) — ask before deleting.

---

## Notes
- 2026-10-31 — Design direction changed on request: cream + deep plum, editorial serif headings, following the protidehealth.com layout.
- 2026-10-31 — Two font families plus serif italic accents; imagery is AI-generated placeholder on a consistent set.
- 2026-11-01 — Age gate, cart drawer, COA verification, category pages, quantity tiers and the compliance rewrite were added; the drawer height bug was fixed.
- 2026-11-01 — Hero copy rewritten, CTA band centred, trust strip turned into a slow
  marquee, nav rebuilt around Products / Wholesale / Support (new `wholesale.html`), and
  the product specification table moved under the product photo as a light panel.
- 2026-11-01 — `faq.html` was repaired after the previous commit double-encoded it
  (UTF-8 read as Windows-1252); characters are clean and there is no byte-order mark.
- The site is plain HTML/CSS/JS and opens directly from disk; it also runs from `http://localhost:8000` via `python -m http.server`
