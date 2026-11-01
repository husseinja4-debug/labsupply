# plan.md — LabSupply

**What it is:** an online shop selling laboratory products for research and education.
**Who it's for:** researchers, labs, teachers, and students who want to buy online.
**Name:** "LabSupply" (placeholder; easy to change later).

## Must-haves
- Search and category filters on the Shop page
- Mobile friendly on every page
- A clear "For research and educational use only" notice in the footer, on product pages, and at checkout
- The cart remembers its items after a refresh (it's saved in the browser with `localStorage`)

## Style
The visual system lives in **`../../brand/brand-guide.md`** and is implemented in
`styles.css`. Do not restyle from memory or from the old plan.

- **Name:** Ordyn (pronounced OR-din). Wordmark is lowercase `ordyn`, first "o"
  replaced by the measurement mark.
- **Mood ratio:** ~70% warm neutral (bone `#FAF9F6`), ~20% white + Lab Blue
  (`#2F5BEA`, actions only), ~10% dark ink (`#0B0E13`: hero, spec panels, CTA band,
  footer).
- **Fonts:** Inter Tight 600 (headings), Inter 400/500 (body), IBM Plex Mono
  (eyebrows, catalog numbers, specs, prices). Loaded once in `styles.css`.
- **Rules that never bend:** one primary button per view, 1px borders with no card
  shadow at rest, 96px/64px section padding, radii 6/10/16, research-use badge on every
  product, and the footer disclaimer from the brand guide.
- The old teal / Space Grotesk / dark-first direction is retired. Do not reintroduce it.

## Pages and sections

### 1. Home — `index.html`
- Header: logo, nav (Home, Shop, About, FAQ, Contact), cart icon with an item count
- Hero: headline, short tagline, "Shop now" button
- Featured categories (for example glassware, chemicals and reagents, equipment, education kits)
- Featured products (4 to 6 cards)
- Why choose us (quality, fast shipping, support for schools)
- Footer: links, contact info, research-use notice

### 2. Shop — `shop.html`
- Search bar
- Category filters
- Product grid (image, name, price, "Add to cart")
- "No results" message

### 3. Product — `product.html`
- One page that shows any product, picked from the link (for example `product.html?id=3`)
- Image, name, price, description, specs
- Quantity picker and "Add to cart"
- Research-use notice

### 4. Cart — `cart.html`
- List of items with quantity +/- and remove
- Subtotal
- "Continue shopping" and "Checkout" buttons

### 5. Checkout — `checkout.html`
- Shipping form
- Order summary
- Checkbox: "I confirm these products are for research or educational use only"
- "Place order" button. It's a demo for now: it shows a thank-you message. Real payments (for example Stripe) come later.

### 6. About — `about.html`
- Our story, mission, who we serve

### 7. Contact — `contact.html`
- Contact form (name, email, message) and contact details

### 8. FAQ / Policies — `faq.html`
- Shipping, returns, ordering for schools, research-use policy

## Files
```
labsupply/
  index.html, shop.html, product.html, cart.html,
  checkout.html, about.html, contact.html, faq.html
  styles.css     shared look for every page
  script.js      cart, search and filters
  products.js    the product list (name, price, category, image...)
  images/
```

## Build order
1. **Setup:** create `styles.css` with the colors and fonts above
2. **Homepage:** header, hero, categories, featured products, footer
3. **Make it mobile friendly:** check the homepage on a phone-size screen
4. **Product data:** `products.js` with about 12 sample products
5. **Shop page:** product grid, then search, then filters
6. **Product page:** reads the id from the link and shows that product
7. **Cart:** add to cart, cart page, save to `localStorage`, count in the header
8. **Checkout page:** form, summary, research-use checkbox, thank-you message
9. **About, Contact, FAQ pages**
10. **Final check:** all links work, every page works on mobile, the notice shows everywhere it should
