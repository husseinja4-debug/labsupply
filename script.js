/* LabSupply — shared behaviours for every page.
   Cart storage, the product rail, shop filters, product, cart and checkout. */

(function () {
  "use strict";

  var CART_KEY = "labsupply.cart.v1";
  var FREE_SHIPPING = 199;
  var SHIPPING_COST = 12;
  var toastTimer = null;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var catalog = window.PRODUCTS || [];

  /* ---------- Small helpers ---------- */
  function money(value) {
    return "$" + Number(value).toFixed(2);
  }

  function findProduct(id) {
    for (var i = 0; i < catalog.length; i += 1) {
      if (String(catalog[i].id) === String(id)) return catalog[i];
    }
    return null;
  }

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function productCard(product) {
    return (
      '<li class="product-card">' +
      '<div class="product-card__media"><img src="' + product.image +
      '" width="800" height="800" loading="lazy" alt="' + product.name + ' research vial"></div>' +
      '<div class="product-card__body">' +
      '<p class="product-card__cat">' + product.category + "</p>" +
      '<h3 class="product-card__name"><a href="product.html?id=' + product.id + '">' + product.name + "</a></h3>" +
      '<p class="product-card__price"><strong>' + money(product.price) + "</strong> · " + product.size + "</p>" +
      '<button class="btn btn--outline" type="button" data-add-to-cart data-id="' + product.id + '">Add to cart</button>' +
      "</div></li>"
    );
  }

  /* ---------- Cart storage ---------- */
  function readCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      var cart = raw ? JSON.parse(raw) : [];
      return Array.isArray(cart) ? cart : [];
    } catch (error) {
      return []; // storage blocked — cart still works on this page
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      /* private mode: ignore, nothing breaks */
    }
  }

  /* ---------- Coupon ---------- */
  function readCoupon() {
    try {
      return localStorage.getItem("labsupply.coupon.v1") || "";
    } catch (error) {
      return "";
    }
  }

  function saveCoupon(code) {
    try {
      if (code) localStorage.setItem("labsupply.coupon.v1", code);
      else localStorage.removeItem("labsupply.coupon.v1");
    } catch (error) {
      /* ignore */
    }
  }

  function cartCount(cart) {
    return (cart || readCart()).reduce(function (sum, item) {
      return sum + (Number(item.qty) || 0);
    }, 0);
  }

  function cartLines(cart) {
    return (cart || readCart())
      .map(function (item) {
        var product = findProduct(item.id);
        if (!product) return null;
        var qty = Number(item.qty) || 0;
        var rate = tierRate(qty);
        var gross = product.price * qty;
        return {
          product: product,
          qty: qty,
          rate: rate,
          total: gross * (1 - rate),
          saving: gross * rate
        };
      })
      .filter(Boolean);
  }

  function tierRate(qty) {
    if (qty >= 9) return 0.1;
    if (qty >= 5) return 0.05;
    return 0;
  }

  function cartTotals() {
    var lines = cartLines();
    var subtotal = lines.reduce(function (sum, line) {
      return sum + line.total;
    }, 0);

    // 5% off when three or more different compounds are in the cart
    var bundle = lines.length >= 3 ? subtotal * 0.05 : 0;
    var couponCode = readCoupon();
    var coupon = couponCode ? (subtotal - bundle) * 0.05 : 0;
    var shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING_COST;
    var total = subtotal - bundle - coupon + shipping;
    var tierSaving = lines.reduce(function (sum, line) {
      return sum + line.saving;
    }, 0);

    return {
      lines: lines,
      distinct: lines.length,
      subtotal: subtotal,
      bundle: bundle,
      coupon: coupon,
      couponCode: couponCode,
      shipping: shipping,
      total: total,
      saving: bundle + coupon + tierSaving
    };
  }

  function updateCount() {
    var count = cartCount();
    document.querySelectorAll("[data-cart-count]").forEach(function (node) {
      node.textContent = String(count);
      node.classList.toggle("is-empty", count === 0);

      // Keep the cart link's spoken name in sync ("Cart, 3 items")
      var link = node.closest(".cart");
      if (link) {
        link.setAttribute("aria-label", count === 0 ? "Cart, empty" : "Cart, " + count + " items");
      }
    });

    document.dispatchEvent(new CustomEvent("labsupply:cart"));
  }

  function addToCart(id, qty) {
    var product = findProduct(id);
    if (!product) return;
    qty = Math.max(1, Number(qty) || 1);

    var cart = readCart();
    var existing = cart.filter(function (item) {
      return String(item.id) === String(id);
    })[0];

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: String(id), qty: qty });
    }

    saveCart(cart);
    updateCount();
    showToast(product.name + " added to your cart");
  }

  function setQty(id, qty) {
    var cart = readCart();
    var next = [];
    cart.forEach(function (item) {
      if (String(item.id) !== String(id)) return next.push(item);
      if (qty > 0) next.push({ id: String(item.id), qty: qty });
    });
    saveCart(next);
    updateCount();
  }

  function removeFromCart(id) {
    setQty(id, 0);
  }

  /* ---------- Toast ---------- */
  function showToast(message) {
    var toast = document.querySelector("[data-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2600);
  }

  /* ---------- Shop page ---------- */
  function setupShop() {
    var grid = document.querySelector("[data-shop-grid]");
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".product-card"));
    var search = document.querySelector("[data-shop-search]");
    var filterWrap = document.querySelector("[data-shop-filters]");
    var count = document.querySelector("[data-shop-count]");
    var empty = document.querySelector("[data-shop-empty]");
    var params = new URLSearchParams(window.location.search);
    var state = {
      q: (params.get("q") || "").trim(),
      category: params.get("category") || "All"
    };

    if (search) search.value = state.q;

    var categories = ["All"].concat(
      catalog
        .map(function (product) {
          return product.category;
        })
        .filter(function (cat, i, all) {
          return all.indexOf(cat) === i;
        })
    );

    if (filterWrap) {
      categories.forEach(function (cat) {
        var chip = el("button", "chip", cat);
        chip.type = "button";
        chip.setAttribute("aria-pressed", String(cat === state.category));
        chip.addEventListener("click", function () {
          state.category = cat;
          filterWrap.querySelectorAll(".chip").forEach(function (node) {
            node.classList.toggle("is-active", node === chip);
            node.setAttribute("aria-pressed", String(node === chip));
          });
          draw();
        });
        filterWrap.appendChild(chip);
      });
      var first = filterWrap.querySelector(".chip");
      if (first) first.classList.add("is-active");
    }

    // The cards are already in the HTML (so the page paints complete);
    // filtering only hides and shows them.
    function matches(card) {
      var product = findProduct(card.getAttribute("data-id"));
      if (!product) return false;
      var inCategory = state.category === "All" || product.category === state.category;
      var haystack = (product.name + " " + product.category + " " + product.size).toLowerCase();
      var inSearch = !state.q || haystack.indexOf(state.q.toLowerCase()) !== -1;
      return inCategory && inSearch;
    }

    function draw() {
      var visible = 0;
      cards.forEach(function (card) {
        var show = matches(card);
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (count) {
        count.textContent = visible + (visible === 1 ? " product" : " products");
      }
      if (empty) empty.hidden = visible > 0;
    }

    if (search) {
      search.addEventListener("input", function () {
        state.q = search.value.trim();
        draw();
      });
    }

    draw();
  }

  /* ---------- Product page ---------- */
  function injectJsonLd(id, data) {
    var old = document.getElementById(id);
    if (old) old.remove();
    var tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.id = id;
    tag.textContent = JSON.stringify(data);
    document.head.appendChild(tag);
  }

  function setupProduct() {
    var root = document.querySelector("[data-product]");
    if (!root) return;

    var id = new URLSearchParams(window.location.search).get("id");
    var product = findProduct(id);
    var missing = document.querySelector("[data-product-missing]");

    if (!product) {
      root.hidden = true;
      if (missing) missing.hidden = false;
      return;
    }

    document.title = product.name + " — LabSupply";
    root.querySelector("[data-product-image]").src = product.image;
    root.querySelector("[data-product-image]").alt = product.name + " research vial";
    root.querySelector("[data-product-name]").textContent = product.name;
    root.querySelector("[data-product-cat]").textContent = product.category;
    root.querySelector("[data-product-price]").innerHTML =
      money(product.price) + " <span>" + product.size + "</span>";
    root.querySelector("[data-product-blurb]").textContent = product.blurb;

    var crumb = document.querySelector("[data-breadcrumb-name]");
    if (crumb) crumb.textContent = product.name;

    var specs = root.querySelector("[data-product-specs]");
    Object.keys(product.specs).forEach(function (label) {
      var row = el("div", "", "<dt>" + label + "</dt><dd>" + product.specs[label] + "</dd>");
      specs.appendChild(row);
    });

    var output = root.querySelector("[data-qty-output]");
    var qty = 1;

    var sku = root.querySelector("[data-meta-sku]");
    if (sku) sku.textContent = "P-" + String(product.id).padStart(3, "0");
    var purity = root.querySelector("[data-meta-purity]");
    if (purity && product.specs && product.specs.Purity) purity.textContent = product.specs.Purity + " (third-party tested)";

    // Quantity pricing table
    var tierPrices = root.querySelectorAll("[data-tier-price]");
    tierPrices.forEach(function (cell, index) {
      var tierQty = index === 0 ? 1 : index === 1 ? 5 : 9;
      cell.textContent = money(product.price * (1 - tierRate(tierQty))) + " / vial";
    });

    var tiers = Array.prototype.slice.call(root.querySelectorAll("[data-tier]"));

    function syncTier() {
      output.textContent = qty;
      var level = qty >= 9 ? 9 : qty >= 5 ? 5 : 1;
      tiers.forEach(function (radio) {
        radio.checked = Number(radio.value) === level;
      });
    }

    tiers.forEach(function (radio) {
      radio.addEventListener("change", function () {
        qty = Number(radio.value);
        syncTier();
      });
    });

    root.querySelector("[data-qty-plus]").addEventListener("click", function () {
      qty += 1;
      syncTier();
    });
    root.querySelector("[data-qty-minus]").addEventListener("click", function () {
      qty = Math.max(1, qty - 1);
      syncTier();
    });
    root.querySelector("[data-add-qty]").addEventListener("click", function () {
      addToCart(product.id, qty);
    });

    // Structured data + share tags for this specific product
    var url = window.location.href;
    var image = new URL(product.image, window.location.href).href;

    injectJsonLd("product-schema", {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: [image],
      description: product.blurb,
      category: product.category,
      brand: { "@type": "Brand", name: "LabSupply" },
      offers: {
        "@type": "Offer",
        price: product.price.toFixed(2),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: url
      }
    });

    injectJsonLd("breadcrumb-schema", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: new URL("index.html", window.location.href).href },
        { "@type": "ListItem", position: 2, name: "Shop", item: new URL("shop.html", window.location.href).href },
        { "@type": "ListItem", position: 3, name: product.name }
      ]
    });

    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", product.blurb.slice(0, 155));
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", product.name + " — LabSupply");

    // Related compounds: same category first, then the rest
    var relatedWrap = document.querySelector("[data-related-wrap]");
    var relatedList = document.querySelector("[data-related]");
    if (relatedWrap && relatedList) {
      var pool = catalog.filter(function (item) {
        return String(item.id) !== String(product.id);
      });
      pool.sort(function (a, b) {
        return (a.category === product.category ? 0 : 1) - (b.category === product.category ? 0 : 1);
      });
      relatedList.innerHTML = pool.slice(0, 4).map(productCard).join("");
      relatedWrap.hidden = false;
    }
  }

  /* ---------- Cart page ---------- */
  function setupCartPage() {
    var wrap = document.querySelector("[data-cart-page]");
    if (!wrap) return;

    var linesWrap = wrap.querySelector("[data-cart-lines]");
    var empty = wrap.querySelector("[data-cart-empty]");
    var body = wrap.querySelector("[data-cart-body]");
    var summary = wrap.querySelector("[data-cart-summary]");

    function draw() {
      var totals = cartTotals();
      var hasItems = totals.lines.length > 0;

      if (empty) empty.hidden = hasItems;
      if (body) body.hidden = !hasItems;
      if (summary) summary.hidden = !hasItems;
      if (!hasItems) return;

      linesWrap.innerHTML = totals.lines
        .map(function (line) {
          return (
            '<li class="cart-line" data-line="' + line.product.id + '">' +
            '<div class="cart-line__media"><img src="' + line.product.image +
            '" width="64" height="64" alt="' + line.product.name + '"></div>' +
            "<div><p class=\"cart-line__name\">" + line.product.name + "</p>" +
            '<p class="cart-line__meta">' + money(line.product.price) + " · " +
            line.product.size + "</p></div>" +
            '<div class="cart-line__controls">' +
            '<div class="qty">' +
            '<button type="button" data-cart-action="dec" aria-label="Decrease quantity of ' +
            line.product.name + '">−</button>' +
            "<output>" + line.qty + "</output>" +
            '<button type="button" data-cart-action="inc" aria-label="Increase quantity of ' +
            line.product.name + '">+</button>' +
            "</div>" +
            '<p class="cart-line__price">' + money(line.total) + "</p>" +
            '<button type="button" class="remove-btn" data-cart-action="remove">Remove</button>' +
            "</div></li>"
          );
        })
        .join("");

      summary.querySelector("[data-subtotal]").textContent = money(totals.subtotal);
      summary.querySelector("[data-shipping]").textContent =
        totals.shipping === 0 ? "Free" : money(totals.shipping);
      summary.querySelector("[data-total]").textContent = money(totals.total);

      var discountRow = summary.querySelector("[data-discount-row]");
      if (discountRow) {
        discountRow.hidden = totals.saving <= 0;
        var discountValue = summary.querySelector("[data-discount]");
        if (discountValue) discountValue.textContent = "−" + money(totals.saving);
      }

      var remaining = FREE_SHIPPING - totals.subtotal;
      var hint = summary.querySelector("[data-ship-hint]");
      if (hint) {
        hint.textContent =
          remaining > 0
            ? "Add " + money(remaining) + " more for free US shipping."
            : "Free US shipping unlocked.";
      }
    }

    wrap.addEventListener("click", function (event) {
      var button = event.target.closest("[data-cart-action]");
      if (!button) return;
      var row = button.closest("[data-line]");
      if (!row) return;
      var id = row.getAttribute("data-line");
      var line = cartLines().filter(function (item) {
        return String(item.product.id) === String(id);
      })[0];
      if (!line) return;

      var action = button.getAttribute("data-cart-action");
      if (action === "inc") setQty(id, line.qty + 1);
      if (action === "dec") setQty(id, line.qty - 1);
      if (action === "remove") removeFromCart(id);
      draw();
    });

    draw();
  }

  /* ---------- Checkout page ---------- */
  function setupCheckout() {
    var root = document.querySelector("[data-checkout]");
    if (!root) return;

    var summary = root.querySelector("[data-checkout-summary]");
    var totals = cartTotals();

    if (totals.lines.length === 0) {
      summary.innerHTML = '<p class="lede">Your cart is empty. <a href="shop.html">Browse compounds</a>.</p>';
      var submit = root.querySelector('form button[type="submit"]');
      if (submit) {
        submit.disabled = true;
        submit.textContent = "Add a product first";
        submit.style.opacity = "0.55";
        submit.style.cursor = "not-allowed";
      }
      return;
    }

    summary.innerHTML = totals.lines
      .map(function (line) {
        return (
          '<div class="summary__row"><span>' + line.product.name + " × " + line.qty +
          "</span><span>" + money(line.total) + "</span></div>"
        );
      })
      .join("") +
      (totals.saving > 0
        ? '<div class="summary__row"><span>Bundle &amp; coupon saving</span><span>−' +
          money(totals.saving) + "</span></div>"
        : "") +
      '<div class="summary__row"><span>Shipping</span><span>' +
      (totals.shipping === 0 ? "Free" : money(totals.shipping)) + "</span></div>" +
      '<div class="summary__row summary__row--total"><span>Total</span><span>' +
      money(totals.total) + "</span></div>";

    var form = root.querySelector("form");
    var status = root.querySelector("[data-checkout-status]");
    var done = root.querySelector("[data-checkout-done]");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var ok = true;

      form.querySelectorAll("[required]").forEach(function (field) {
        var holder = field.closest(".field") || field.closest(".check");
        var valid = field.type === "checkbox" ? field.checked : field.value.trim() !== "";
        if (field.type === "email" && field.value.trim()) {
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value.trim());
        }
        if (holder) holder.classList.toggle("has-error", !valid);
        if (!valid) ok = false;
      });

      if (!ok) {
        status.textContent = "Please check the highlighted fields and confirm the research-use statement.";
        status.classList.add("is-error");
        return;
      }

      status.classList.remove("is-error");
      status.textContent = "";
      saveCart([]);
      updateCount();
      if (form) form.hidden = true;
      if (done) done.hidden = false;
      summary.innerHTML = "";
      var heading = root.querySelector("[data-checkout-head]");
      if (heading) heading.hidden = true;
    });
  }

  /* ---------- Newsletter form ---------- */
  function setupNewsletter() {
    var form = document.querySelector("[data-newsletter]");
    var note = document.querySelector("[data-newsletter-note]");
    if (!form || !note) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var value = input.value.trim();
      var looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

      note.classList.toggle("is-error", !looksLikeEmail);

      if (!looksLikeEmail) {
        note.textContent = "Please enter a valid email address, for example name@lab.org.";
        input.focus();
        return;
      }

      form.reset();
      note.textContent = "Thanks — you are on the list. Watch for the next batch note.";
    });
  }

  /* ---------- Horizontal rail ---------- */
  function setupRail() {
    var rail = document.querySelector("[data-rail]");
    if (!rail) return;

    var prev = document.querySelector("[data-rail-prev]");
    var next = document.querySelector("[data-rail-next]");
    var dotsWrap = document.querySelector("[data-rail-dots]");
    var card = rail.querySelector(".product-card");
    if (!card) return;

    function cardStep() {
      var styles = window.getComputedStyle(rail);
      var gap = parseFloat(styles.columnGap || styles.gap) || 16;
      return card.getBoundingClientRect().width + gap;
    }

    function scrollByStep(direction) {
      rail.scrollBy({
        left: direction * cardStep(),
        behavior: reduceMotion.matches ? "auto" : "smooth"
      });
    }

    if (prev) prev.addEventListener("click", function () { scrollByStep(-1); });
    if (next) next.addEventListener("click", function () { scrollByStep(1); });

    function update() {
      var maxScroll = rail.scrollWidth - rail.clientWidth - 4;
      if (prev) prev.disabled = rail.scrollLeft <= 4;
      if (next) next.disabled = rail.scrollLeft >= maxScroll;
      if (dotsWrap) {
        var index = Math.round(rail.scrollLeft / Math.max(1, rail.clientWidth));
        dotsWrap.querySelectorAll("button").forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === index);
        });
      }
    }

    if (dotsWrap) {
      var perView = Math.max(1, Math.round(rail.clientWidth / cardStep()));
      var pages = Math.max(1, Math.ceil(rail.children.length / perView));
      for (var i = 0; i < pages; i += 1) {
        (function (page) {
          var dot = el("button");
          dot.type = "button";
          dot.setAttribute("aria-label", "Go to page " + (page + 1));
          dot.addEventListener("click", function () {
            rail.scrollTo({
              left: page * rail.clientWidth,
              behavior: reduceMotion.matches ? "auto" : "smooth"
            });
          });
          dotsWrap.appendChild(dot);
        })(i);
      }
    }

    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Contact form ---------- */
  function setupContact() {
    var form = document.querySelector("[data-contact-form]");
    var status = document.querySelector("[data-contact-status]");
    if (!form || !status) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var ok = true;

      form.querySelectorAll("[required]").forEach(function (field) {
        var valid = field.value.trim() !== "";
        if (field.type === "email" && field.value.trim()) {
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value.trim());
        }
        field.closest(".field").classList.toggle("has-error", !valid);
        if (!valid) ok = false;
      });

      status.classList.toggle("is-error", !ok);

      if (!ok) {
        status.textContent = "Please add your name, a valid email and a short message.";
        return;
      }

      form.reset();
      status.textContent = "Thanks — your message is queued. A person replies within one business day.";
    });
  }

  /* ---------- Cart drawer ---------- */
  function setupDrawer() {
    var dialog = document.createElement("dialog");
    dialog.className = "drawer";
    dialog.setAttribute("aria-label", "Shopping cart");
    dialog.innerHTML =
      '<div class="drawer__head">' +
      '<h2>Your cart <span class="drawer__count" data-drawer-count>0</span></h2>' +
      '<button class="drawer__close" type="button" data-drawer-close aria-label="Close cart">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      "</button></div>" +
      '<div class="drawer__body">' +
      '<div class="ship-nudge"><p data-ship-text></p><div class="ship-bar"><span data-ship-fill></span></div></div>' +
      '<div class="promo">' +
      '<span class="promo__badge" aria-hidden="true">%</span>' +
      "<div><p class=\"promo__title\"><strong data-promo-title>Add 2 more different compounds to save an extra 5%</strong></p>" +
      '<p class="promo__meta"><span data-promo-count>0 of 3 different compounds</span> · <a href="shop.html">Build a kit →</a></p>' +
      '<div class="promo__dots" data-promo-dots aria-hidden="true"></div></div></div>' +
      '<ul class="drawer__lines" data-drawer-lines></ul>' +
      '<p class="drawer__empty" data-drawer-empty hidden>Your cart is empty. <a href="shop.html">Browse compounds</a>.</p>' +
      '<div class="cross"><p class="kicker">Complete your order</p>' +
      '<div class="cross__row">' +
      '<img src="images/vial-02.webp" width="48" height="48" alt="">' +
      '<div class="cross__copy"><p><strong>Glass sample vials, 10 mL</strong></p><p>50-pack · $18.00</p></div>' +
      '<button class="cross__add" type="button" data-add-cross aria-label="Add a 50-pack of glass sample vials">Add</button>' +
      "</div></div>" +
      '<form class="coupon" data-coupon>' +
      '<label class="visually-hidden" for="coupon-code">Coupon code</label>' +
      '<input id="coupon-code" name="coupon" type="text" placeholder="Coupon code" autocomplete="off">' +
      '<button class="btn btn--outline" type="submit">Apply</button>' +
      "</form>" +
      '<p class="form-note" data-coupon-note role="status"></p>' +
      "</div>" +
      '<div class="drawer__foot">' +
      '<div class="drawer__row"><span>Subtotal</span><span data-drawer-subtotal>$0.00</span></div>' +
      '<p class="drawer__saving" data-drawer-saving hidden></p>' +
      '<a class="btn btn--solid btn--block" href="checkout.html">Secure checkout →</a>' +
      '<a class="btn btn--outline btn--block" href="cart.html">View cart</a>' +
      '<p class="drawer__fine">Shipping and taxes calculated at checkout · For research use only.</p>' +
      "</div>";

    document.body.appendChild(dialog);

    var linesWrap = dialog.querySelector("[data-drawer-lines]");
    var empty = dialog.querySelector("[data-drawer-empty]");
    var countEl = dialog.querySelector("[data-drawer-count]");
    var shipText = dialog.querySelector("[data-ship-text]");
    var shipFill = dialog.querySelector("[data-ship-fill]");
    var promoTitle = dialog.querySelector("[data-promo-title]");
    var promoCount = dialog.querySelector("[data-promo-count]");
    var promoDots = dialog.querySelector("[data-promo-dots]");
    var subtotalEl = dialog.querySelector("[data-drawer-subtotal]");
    var savingEl = dialog.querySelector("[data-drawer-saving]");
    var couponForm = dialog.querySelector("[data-coupon]");
    var couponInput = dialog.querySelector("#coupon-code");
    var couponNote = dialog.querySelector("[data-coupon-note]");

    couponInput.value = readCoupon();

    function draw() {
      var totals = cartTotals();
      var items = cartCount();
      var hasItems = totals.lines.length > 0;

      countEl.textContent = String(items);
      empty.hidden = hasItems;
      linesWrap.hidden = !hasItems;
      subtotalEl.textContent = money(totals.subtotal);
      savingEl.hidden = totals.saving <= 0;
      savingEl.textContent = "You are saving " + money(totals.saving) + " on this order";

      var remaining = FREE_SHIPPING - totals.subtotal;
      if (totals.subtotal === 0) {
        shipText.textContent = "Free US shipping on orders over $199.";
      } else if (remaining > 0) {
        shipText.textContent = "You are " + money(remaining) + " away from free shipping";
      } else {
        shipText.textContent = "Free US shipping unlocked";
      }
      shipFill.style.width = Math.min(100, (totals.subtotal / FREE_SHIPPING) * 100) + "%";

      var need = Math.max(0, 3 - totals.distinct);
      promoTitle.textContent = need > 0
        ? "Add " + need + " more different compound" + (need === 1 ? "" : "s") + " to save an extra 5%"
        : "5% bundle saving applied to this order";
      promoCount.textContent = totals.distinct + " of 3 different compounds";
      promoDots.innerHTML = "";
      for (var i = 0; i < 3; i += 1) {
        var dot = document.createElement("span");
        dot.className = i < totals.distinct ? "is-on" : "";
        promoDots.appendChild(dot);
      }

      linesWrap.innerHTML = totals.lines
        .map(function (line) {
          return (
            '<li class="drawer-line" data-line="' + line.product.id + '">' +
            '<img class="drawer-line__img" src="' + line.product.image +
            '" width="56" height="56" alt="' + line.product.name + '">' +
            '<div class="drawer-line__info">' +
            '<p class="drawer-line__name">' + line.product.name + "</p>" +
            '<p class="drawer-line__meta">' + money(line.product.price) + " · " + line.product.size + "</p>" +
            '<div class="qty qty--sm">' +
            '<button type="button" data-cart-action="dec" aria-label="Decrease quantity of ' + line.product.name + '">−</button>' +
            "<output>" + line.qty + "</output>" +
            '<button type="button" data-cart-action="inc" aria-label="Increase quantity of ' + line.product.name + '">+</button>' +
            "</div></div>" +
            '<div class="drawer-line__end"><p class="drawer-line__total">' + money(line.total) + "</p>" +
            '<button type="button" class="drawer-line__remove" data-cart-action="remove" aria-label="Remove ' +
            line.product.name + ' from cart">×</button></div>' +
            "</li>"
          );
        })
        .join("");
    }

    dialog.addEventListener("click", function (event) {
      var button = event.target.closest("[data-cart-action]");
      if (button) {
        var row = button.closest("[data-line]");
        if (!row) return;
        var id = row.getAttribute("data-line");
        var line = cartLines().filter(function (item) {
          return String(item.product.id) === String(id);
        })[0];
        if (!line) return;
        var action = button.getAttribute("data-cart-action");
        if (action === "inc") setQty(id, line.qty + 1);
        if (action === "dec") setQty(id, line.qty - 1);
        if (action === "remove") {
          removeFromCart(id);
          showToast(line.product.name + " removed");
        }
        draw();
        return;
      }

      if (event.target.closest("[data-add-cross]")) {
        addToCart("12", 1);
        draw();
        return;
      }
    });

    dialog.querySelector("[data-drawer-close]").addEventListener("click", function () {
      dialog.close();
    });

    couponForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var code = couponInput.value.trim().toUpperCase();
      couponNote.classList.remove("is-error");

      if (!code) {
        saveCoupon("");
        couponNote.textContent = "Coupon removed.";
      } else if (code === "LAB5") {
        saveCoupon(code);
        couponNote.textContent = "LAB5 applied — an extra 5% off.";
      } else {
        couponNote.classList.add("is-error");
        couponNote.textContent = "That code is not recognised. Try LAB5.";
        return;
      }
      draw();
    });

    document.querySelectorAll("[data-open-cart]").forEach(function (trigger) {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        draw();
        dialog.showModal();
      });
    });

    // Keep the drawer honest if the cart changes elsewhere
    document.addEventListener("labsupply:cart", draw);
    draw();
  }

  /* ---------- Age gate ---------- */
  function setupAgeGate() {
    var KEY = "labsupply.age.v1";
    var accepted = false;
    try {
      accepted = localStorage.getItem(KEY) === "yes" || sessionStorage.getItem(KEY) === "yes";
    } catch (error) {
      accepted = false;
    }
    if (accepted) return;

    var dialog = document.createElement("dialog");
    dialog.className = "age-gate";
    dialog.setAttribute("aria-labelledby", "age-gate-title");
    dialog.innerHTML =
      '<div class="age-gate__inner">' +
      '<p class="kicker">Researcher verification</p>' +
      '<h2 id="age-gate-title">Are you 21 or Older</h2>' +
      "<p>Our products are crafted for research and for investigative purposes and are not suitable for direct human consumption or consumers, nor are they intended for clinical or therapeutic use. The statements and products listed on this website are not intended to diagnose, treat, cure, or prevent any disease</p>" +
      '<p class="age-gate__q">Are you over 21 years of age?</p>' +
      '<div class="age-gate__actions">' +
      '<button class="btn btn--solid btn--block" type="button" data-age-yes>I agree &amp; enter</button>' +
      '<button class="btn btn--outline btn--block" type="button" data-age-no>I am under 21</button>' +
      "</div>" +
      '<p class="age-gate__denied" data-age-denied hidden>You must be 21 or older to enter this site. These products are supplied for laboratory research only and are not for human consumption.</p>' +
      "</div>";
    document.body.appendChild(dialog);

    var denied = dialog.querySelector("[data-age-denied]");
    var actions = dialog.querySelector(".age-gate__actions");

    // The gate cannot be dismissed by pressing Escape or clicking the backdrop
    dialog.addEventListener("cancel", function (event) {
      event.preventDefault();
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) event.stopPropagation();
    });

    dialog.querySelector("[data-age-yes]").addEventListener("click", function () {
      try {
        localStorage.setItem(KEY, "yes");
        sessionStorage.setItem(KEY, "yes");
      } catch (error) {
        /* ignore */
      }
      dialog.close();
    });

    dialog.querySelector("[data-age-no]").addEventListener("click", function () {
      denied.hidden = false;
      actions.hidden = true;
      dialog.querySelector(".age-gate__q").hidden = true;
    });

    dialog.showModal();
    dialog.querySelector("[data-age-yes]").focus();
  }

  /* ---------- Category landing page ---------- */
  var CATEGORY_COPY = {
    "Research compounds": [
      "Research compounds are supplied as lyophilised powders for in-vitro laboratory work. Every lot in this category is third-party tested by an independent US laboratory and HPLC-MS verified, with a certificate of analysis published for each batch.",
      "The collection includes single compounds such as BPC-157, TB-500, MOTS-c and Tesamorelin. Each is clearly labelled with its lot number, supplied with a safety data sheet, and shipped from the USA within 24 hours.",
      "Review the published analytical data in our <a href=\"faq.html#quality\">COA library</a>, or <a href=\"shop.html\">browse the full catalogue</a>."
    ],
    "Copper compounds": [
      "Copper compounds are coordination complexes studied in in-vitro systems. Each lot is screened for heavy metals by ICP-MS and tested for identity by LC-MS before release.",
      "The collection includes GHK-Cu, supplied as a lyophilised powder with a lot-specific certificate of analysis, a safety data sheet and documented storage conditions.",
      "Read the <a href=\"faq.html#quality\">testing methodology</a> or <a href=\"shop.html\">browse the full catalogue</a>."
    ],
    "Blends": [
      "Blends combine two or more research compounds in a single sealed vial. Each component is verified separately and reported on the same certificate of analysis, so the blend can be traced to one batch record.",
      "Every blend is supplied lyophilised, labelled with its component list and lot number, and accompanied by a safety data sheet.",
      "See <a href=\"faq.html#quality\">how batch testing works</a> or <a href=\"shop.html\">browse the full catalogue</a>."
    ],
    "Cofactors & coenzymes": [
      "Cofactors and coenzymes are non-protein compounds involved in enzymatic reactions. This category groups the compounds in the LabSupply catalogue that act as, or modulate, these biochemical cofactors.",
      "The collection includes NAD+, a pyridine dinucleotide coenzyme supplied as a lyophilised powder for in-vitro work. Every lot is third-party tested and documented.",
      "Review the published analytical data in our <a href=\"faq.html#quality\">COA library</a> or <a href=\"shop.html\">browse the full catalogue</a>."
    ],
    "Laboratory supplies": [
      "Laboratory supplies cover the glassware and consumables used to store and handle research samples. These items ship with a materials certificate where applicable.",
      "This category includes clear borosilicate sample vials with screw caps, supplied clean and ready for labelling.",
      "Questions about materials or dimensions? <a href=\"contact.html\">Contact the team</a>."
    ]
  };

  function setupCategory() {
    var grid = document.querySelector("[data-cat-grid]");
    if (!grid) return;

    var params = new URLSearchParams(window.location.search);
    var category = params.get("category") || "Research compounds";
    var titleEl = document.querySelector("[data-category-title]");
    var crumb = document.querySelector("[data-category-crumb]");
    var intro = document.querySelector("[data-category-intro]");
    var search = document.querySelector("[data-cat-search]");
    var count = document.querySelector("[data-cat-count]");
    var empty = document.querySelector("[data-cat-empty]");
    var sort = document.querySelector("[data-cat-sort]");
    var toggles = document.querySelectorAll("[data-view]");

    var items = catalog.filter(function (product) {
      return product.category === category;
    });

    if (titleEl) titleEl.textContent = category;
    if (crumb) crumb.textContent = category;
    document.title = category + " — LabSupply";

    if (intro) {
      var paragraphs = CATEGORY_COPY[category] || [];
      intro.innerHTML =
        paragraphs.map(function (text) {
          return "<p>" + text + "</p>";
        }).join("") +
        '<p class="cat-intro__note">For laboratory and research use only. Not for human or animal consumption.</p>';
    }

    function draw() {
      var query = (search && search.value.trim().toLowerCase()) || "";
      var list = items.filter(function (product) {
        return !query || (product.name + " " + product.category).toLowerCase().indexOf(query) !== -1;
      });

      if (sort) {
        var mode = sort.value;
        list = list.slice().sort(function (a, b) {
          if (mode === "price-asc") return a.price - b.price;
          if (mode === "price-desc") return b.price - a.price;
          if (mode === "name") return a.name.localeCompare(b.name);
          return 0;
        });
      }

      grid.innerHTML = list.map(productCard).join("");
      if (count) count.textContent = "Showing all " + list.length + " results";
      if (empty) empty.hidden = list.length > 0;
    }

    if (search) search.addEventListener("input", draw);
    if (sort) sort.addEventListener("change", draw);

    toggles.forEach(function (button) {
      button.addEventListener("click", function () {
        var view = button.getAttribute("data-view");
        grid.classList.toggle("is-list", view === "list");
        toggles.forEach(function (other) {
          var active = other === button;
          other.classList.toggle("is-active", active);
          other.setAttribute("aria-pressed", String(active));
        });
      });
    });

    draw();
  }

  /* ---------- COA: recent releases, lookup, viewer ---------- */
  function coaRecord(product) {
    var b = product.batch || {};
    return [
      "CERTIFICATE OF ANALYSIS",
      "LabSupply — for laboratory research use only",
      "",
      "Product: " + product.name + " (" + product.size + ")",
      "COA number: " + (b.coa || "—"),
      "Lot: " + (b.lot || "—"),
      "Reported: " + (b.reported || "—"),
      "",
      "Analysis            Result",
      "Identity (LC-MS)     Confirmed",
      "Purity (HPLC-UV)     " + (b.purity || "—") + "%",
      "Endotoxins (USP 85)  Pass",
      "Appearance           White lyophilised powder",
      "",
      "Drug-free, not for human or animal consumption.",
      "Not for diagnostic, therapeutic or clinical use."
    ].join("\n");
  }

  function downloadCoa(product) {
    var blob = new Blob([coaRecord(product)], { type: "text/plain" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "LabSupply-COA-" + (product.batch ? product.batch.coa : product.id) + ".txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1500);
    showToast("Certificate downloaded");
  }

  function coaCard(product) {
    var b = product.batch || {};
    return (
      '<li class="coa-card">' +
      '<div class="coa-paper" aria-hidden="true">' +
      '<div class="coa-paper__head"><span class="coa-paper__purity"><i></i>' + (b.purity || "") +
      '%</span><span>Certificate of Analysis</span></div>' +
      '<div class="coa-paper__body"><div class="coa-paper__vials"><span></span><span></span></div>' +
      "<dl>" +
      "<div><dt>Product</dt><dd>" + product.name + "</dd></div>" +
      "<div><dt>Lot</dt><dd>" + (b.lot || "") + "</dd></div>" +
      "<div><dt>Reported</dt><dd>" + (b.reported || "") + "</dd></div>" +
      "</dl></div>" +
      '<div class="coa-paper__strip">Sample summary</div>' +
      '<div class="coa-paper__rows"><span>Identity — Confirmed</span><span>Purity — ' +
      (b.purity || "") + "%</span><span>Endotoxins — Pass</span></div></div>" +
      "<h3>" + product.name + " " + product.size + " COA<br>#" + (b.coa || "") + "</h3>" +
      '<p class="coa-card__meta">COA: ' + (b.coa || "") + "</p>" +
      '<p class="coa-card__meta">Lot: ' + (b.lot || "") + "</p>" +
      '<p class="coa-card__meta">Reported date: ' + (b.reported || "") + "</p>" +
      '<div class="coa-card__actions">' +
      '<button type="button" data-coa-view="' + product.id + '">View certificate</button>' +
      '<button type="button" data-coa-download="' + product.id + '">Download</button>' +
      "</div></li>"
    );
  }

  function setupCoa() {
    var recent = document.querySelector("[data-coa-recent]");
    var form = document.querySelector("[data-coa-form]");
    var input = document.querySelector("[data-coa-input]");
    var result = document.querySelector("[data-coa-result]");
    if (!recent && !form) return;

    if (recent) {
      recent.innerHTML = catalog.slice(0, 3).map(coaCard).join("");
    }

    // Certificate viewer
    var viewer = document.createElement("dialog");
    viewer.className = "coa-modal";
    viewer.setAttribute("aria-label", "Certificate of analysis");
    document.body.appendChild(viewer);

    function openViewer(product) {
      var b = product.batch || {};
      viewer.innerHTML =
        '<div class="coa-modal__head"><div><p class="kicker">Certificate of analysis</p>' +
        "<h2>" + product.name + " " + product.size + "</h2></div>" +
        '<button class="drawer__close coa-modal__close" type="button" aria-label="Close certificate">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
        '<dl class="coa-modal__rows">' +
        "<div><dt>COA number</dt><dd>" + (b.coa || "—") + "</dd></div>" +
        "<div><dt>Lot</dt><dd>" + (b.lot || "—") + "</dd></div>" +
        "<div><dt>Reported</dt><dd>" + (b.reported || "—") + "</dd></div>" +
        "<div><dt>Identity (LC-MS)</dt><dd>Confirmed</dd></div>" +
        "<div><dt>Purity (HPLC-UV)</dt><dd>" + (b.purity || "—") + "%</dd></div>" +
        "<div><dt>Endotoxins (USP &lt;85&gt;)</dt><dd>Pass</dd></div>" +
        "<div><dt>Appearance</dt><dd>White lyophilised powder</dd></div>" +
        "</dl>" +
        '<p class="coa-modal__note">For laboratory research use only. Not for human or animal consumption, diagnosis, treatment or household use.</p>' +
        '<div class="coa-modal__actions"><button class="btn btn--solid" type="button" data-coa-modal-download>Download certificate</button>' +
        '<a class="btn btn--outline" href="product.html?id=' + product.id + '">View product</a></div>';

      viewer.querySelector(".coa-modal__close").addEventListener("click", function () {
        viewer.close();
      });
      viewer.querySelector("[data-coa-modal-download]").addEventListener("click", function () {
        downloadCoa(product);
      });
      viewer.showModal();
    }

    document.addEventListener("click", function (event) {
      var view = event.target.closest("[data-coa-view]");
      if (view) {
        var product = findProduct(view.getAttribute("data-coa-view"));
        if (product) openViewer(product);
        return;
      }
      var down = event.target.closest("[data-coa-download]");
      if (down) {
        var item = findProduct(down.getAttribute("data-coa-download"));
        if (item) downloadCoa(item);
      }
    });

    if (!form || !input || !result) return;

    function lookup(term) {
      var q = term.trim().toLowerCase();
      if (!q) return;

      var found = catalog.filter(function (product) {
        var b = product.batch || {};
        return (
          product.name.toLowerCase().indexOf(q) !== -1 ||
          String(b.coa).indexOf(q.replace(/[^0-9]/g, "")) !== -1 && q.replace(/[^0-9]/g, "").length > 2 ||
          (product.category || "").toLowerCase().indexOf(q) !== -1
        );
      })[0];

      result.hidden = false;

      if (!found) {
        result.innerHTML =
          '<p class="coa__miss"><strong>No batch found for “' + term + '”.</strong> ' +
          'Check the lot number on your vial, or <a href="contact.html">ask our team</a>.</p>';
        return;
      }

      var b = found.batch || {};
      result.innerHTML =
        '<div class="coa__found">' +
        '<div><p class="coa__found-purity"><span>Purity</span>' + (b.purity || "") + "%</p></div>" +
        "<div><p class=\"kicker\">Batch found</p><h3>" + found.name + " " + found.size + "</h3>" +
        '<p class="coa__found-meta">COA ' + (b.coa || "") + " · Lot " + (b.lot || "") +
        " · Reported " + (b.reported || "") + "</p></div>" +
        '<div class="coa__found-actions">' +
        '<button class="btn btn--light" type="button" data-coa-view="' + found.id + '">View certificate</button>' +
        '<a class="btn btn--outline" href="product.html?id=' + found.id + '">Product page</a>' +
        "</div></div>";
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      lookup(input.value);
    });

    document.querySelectorAll("[data-coa-try]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        input.value = chip.getAttribute("data-coa-try");
        lookup(input.value);
      });
    });
  }

  /* ---------- Wire it up ---------- */
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-add-to-cart]");
    if (!button) return;
    addToCart(button.getAttribute("data-id"), 1);
  });

  updateCount();
  setupAgeGate();
  setupDrawer();
  setupRail();
  setupShop();
  setupCategory();
  setupProduct();
  setupCoa();
  setupCartPage();
  setupCheckout();
  setupNewsletter();
  setupContact();
})();
