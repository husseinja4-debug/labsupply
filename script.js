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
        return {
          product: product,
          qty: Number(item.qty) || 0,
          total: product.price * (Number(item.qty) || 0)
        };
      })
      .filter(Boolean);
  }

  function cartTotals() {
    var lines = cartLines();
    var subtotal = lines.reduce(function (sum, line) {
      return sum + line.total;
    }, 0);
    var shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING_COST;
    return { lines: lines, subtotal: subtotal, shipping: shipping, total: subtotal + shipping };
  }

  function updateCount() {
    var count = cartCount();
    document.querySelectorAll("[data-cart-count]").forEach(function (node) {
      node.textContent = String(count);
      node.classList.toggle("is-empty", count === 0);
    });
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

  /* ---------- Product card markup ---------- */
  function productCard(product) {
    return (
      '<li class="product-card">' +
      '<div class="product-card__media">' +
      '<img src="' + product.image + '" width="800" height="800" loading="lazy" alt="' +
      product.name + ' research vial">' +
      "</div>" +
      '<div class="product-card__body">' +
      '<p class="product-card__cat">' + product.category + "</p>" +
      '<h3 class="product-card__name"><a href="product.html?id=' + product.id + '">' +
      product.name + "</a></h3>" +
      '<p class="product-card__price"><strong>' + money(product.price) + "</strong> · " +
      product.size + "</p>" +
      '<button class="btn btn--outline" type="button" data-add-to-cart data-id="' +
      product.id + '">Add to cart</button>' +
      "</div></li>"
    );
  }

  /* ---------- Shop page ---------- */
  function setupShop() {
    var grid = document.querySelector("[data-shop-grid]");
    if (!grid) return;

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

    function matches(product) {
      var inCategory = state.category === "All" || product.category === state.category;
      var haystack = (product.name + " " + product.category + " " + product.size).toLowerCase();
      var inSearch = !state.q || haystack.indexOf(state.q.toLowerCase()) !== -1;
      return inCategory && inSearch;
    }

    function draw() {
      var results = catalog.filter(matches);
      grid.innerHTML = results.map(productCard).join("");
      if (count) {
        count.textContent = results.length + (results.length === 1 ? " product" : " products");
      }
      if (empty) empty.hidden = results.length > 0;
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
    root.querySelector("[data-qty-plus]").addEventListener("click", function () {
      qty += 1;
      output.textContent = qty;
    });
    root.querySelector("[data-qty-minus]").addEventListener("click", function () {
      qty = Math.max(1, qty - 1);
      output.textContent = qty;
    });
    root.querySelector("[data-add-qty]").addEventListener("click", function () {
      addToCart(product.id, qty);
    });
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
      root.querySelector("form").hidden = true;
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

  /* ---------- Wire it up ---------- */
  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-add-to-cart]");
    if (!button) return;
    addToCart(button.getAttribute("data-id"), 1);
  });

  updateCount();
  setupRail();
  setupShop();
  setupProduct();
  setupCartPage();
  setupCheckout();
  setupNewsletter();
  setupContact();
})();
