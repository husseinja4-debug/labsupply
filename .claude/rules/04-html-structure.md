---
paths:
  - "**/*.html"
  - "**/*.js"
---

# HTML structure

Part of **Website Building Best Practices** (sources: Google web.dev, Search Central,
Baymard Institute, and common advice from experienced web developers).

- Use **semantic HTML**: use tags for what things *are*, like `<header>`, `<nav>`,
  `<main>`, `<section>`, `<article>`, `<footer>`, `<button>`, `<form>`. Don't build
  everything from `<div>`s.
- Use exactly one `<h1>` per page, then `<h2>`, `<h3>` in order. Never skip levels.
- Use a real `<button>` for actions and a real `<a href>` for links.
- Every page needs `<!doctype html>`, `<html lang="en">`, `<meta charset="utf-8">`, and
  `<meta name="viewport" content="width=device-width, initial-scale=1">`.
