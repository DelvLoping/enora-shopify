// ENORA Theme — Main JavaScript
// Modules: Reveal, Cart, StickyCTA, FAQ, MobileMenu, SmoothScroll

// ─── Reveal Animations (IntersectionObserver) ───────────────────────────
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();

// ─── Cart Drawer ────────────────────────────────────────────────────────
(function () {
  const overlay = document.querySelector('[data-cart-overlay]');
  const drawer = document.querySelector('[data-cart-drawer]');
  const itemsContainer = document.querySelector('[data-cart-items]');
  const footer = document.querySelector('[data-cart-footer]');
  const subtotalEl = document.querySelector('[data-cart-subtotal]');
  const closeBtn = document.querySelector('[data-cart-close]');

  let isOpen = false;

  function open() {
    drawer.classList.add('translate-x-0');
    drawer.classList.remove('translate-x-full');
    overlay.classList.add('opacity-100');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
    isOpen = true;
  }

  function close() {
    drawer.classList.remove('translate-x-0');
    drawer.classList.add('translate-x-full');
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
    isOpen = false;
  }

  async function refreshCart() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      renderCart(cart);
    } catch (e) {
      console.error('Cart refresh error:', e);
    }
  }

  function renderCart(cart) {
    if (!cart.item_count) {
      itemsContainer.innerHTML =
        '<p class="text-muted-foreground text-sm text-center py-12">Votre panier est vide.</p>';
      footer.style.display = 'none';
      return;
    }

    footer.style.display = 'block';
    itemsContainer.innerHTML = cart.items
      .map(
        (item) => `
      <div class="flex gap-4 py-4 border-b border-border">
        <img src="${item.image}" alt="${item.product_title}" class="w-20 h-20 rounded-lg object-cover bg-sand/30" loading="lazy" />
        <div class="flex-1 min-w-0">
          <h4 class="font-display text-sm text-foreground mb-1">${item.product_title}</h4>
          ${item.variant_title !== 'Default Title' ? `<p class="text-xs text-muted-foreground mb-2">${item.variant_title}</p>` : ''}
          <div class="flex items-center gap-2 mt-2">
            <button data-cart-change data-key="${item.key}" data-qty="${item.quantity - 1}"
              class="w-6 h-6 rounded-full border border-border text-xs flex items-center justify-center bg-transparent cursor-pointer hover:bg-foreground/5 transition-colors" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
            <span class="text-sm w-6 text-center">${item.quantity}</span>
            <button data-cart-change data-key="${item.key}" data-qty="${item.quantity + 1}"
              class="w-6 h-6 rounded-full border border-border text-xs flex items-center justify-center bg-transparent cursor-pointer hover:bg-foreground/5 transition-colors">+</button>
            <button data-cart-remove data-key="${item.key}"
              class="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors border-0 bg-transparent cursor-pointer">Supprimer</button>
          </div>
        </div>
        <div class="text-sm text-foreground whitespace-nowrap">${Shopify.formatMoney(item.line_price, window.themeMoneyFormat || '€{{amount_with_comma_separator}}')}</div>
      </div>`
      )
      .join('');

    subtotalEl.textContent = Shopify.formatMoney(cart.total_price, window.themeMoneyFormat || '€{{amount_with_comma_separator}}');
  }

  async function addToCart(variantId) {
    try {
      await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 }),
      });
      await refreshCart();
      open();
    } catch (e) {
      console.error('Add to cart error:', e);
    }
  }

  async function changeItem(key, quantity) {
    if (quantity < 1) return;
    try {
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: quantity }),
      });
      await refreshCart();
    } catch (e) {
      console.error('Cart change error:', e);
    }
  }

  async function removeItem(key) {
    try {
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: 0 }),
      });
      await refreshCart();
    } catch (e) {
      console.error('Cart remove error:', e);
    }
  }

  // Event delegation
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add-to-cart]');
    if (addBtn) {
      e.preventDefault();
      const variantId = addBtn.dataset.variantId;
      if (variantId) {
        addBtn.classList.add('opacity-70', 'pointer-events-none');
        addToCart(variantId).finally(() => {
          addBtn.classList.remove('opacity-70', 'pointer-events-none');
        });
      }
      return;
    }

    const changeBtn = e.target.closest('[data-cart-change]');
    if (changeBtn) {
      changeItem(changeBtn.dataset.key, parseInt(changeBtn.dataset.qty));
      return;
    }

    const removeBtn = e.target.closest('[data-cart-remove]');
    if (removeBtn) {
      removeItem(removeBtn.dataset.key);
      return;
    }
  });

  overlay.addEventListener('click', close);
  closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });

  // Initial cart state
  refreshCart();
})();

// ─── Sticky CTA ──────────────────────────────────────────────────────────
(function () {
  var sticky = document.querySelector('[data-sticky-cta]');
  if (!sticky) return;

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        if (window.scrollY > 600) {
          sticky.style.opacity = '1';
          sticky.style.transform = 'translate(-50%, 0)';
          sticky.style.pointerEvents = 'auto';
        } else {
          sticky.style.opacity = '0';
          sticky.style.transform = 'translate(-50%, 24px)';
          sticky.style.pointerEvents = 'none';
        }
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ─── FAQ Accordion ──────────────────────────────────────────────────────
(function () {
  const container = document.querySelector('[data-faq-container]');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-faq-toggle]');
    if (!toggle) return;

    const item = toggle.closest('[data-faq-item]');
    const answer = item.querySelector('[data-faq-answer]');
    const plus = toggle.querySelector('.faq-plus');
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';

    // Close all
    container.querySelectorAll('[data-faq-toggle]').forEach((btn) => {
      btn.setAttribute('aria-expanded', 'false');
    });
    container.querySelectorAll('.faq-plus').forEach((p) => {
      p.classList.remove('rotate-45');
    });
    container.querySelectorAll('[data-faq-answer]').forEach((a) => {
      a.classList.remove('grid-rows-[1fr]', 'pb-7');
      a.classList.add('grid-rows-[0fr]');
    });

    // Open clicked (if it wasn't already open)
    if (!isOpen) {
      toggle.setAttribute('aria-expanded', 'true');
      plus.classList.add('rotate-45');
      answer.classList.remove('grid-rows-[0fr]');
      answer.classList.add('grid-rows-[1fr]', 'pb-7');
    }
  });
})();

// ─── Mobile Menu ────────────────────────────────────────────────────────
(function () {
  const toggle = document.querySelector('[data-mobile-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  const close = document.querySelector('[data-mobile-menu-close]');
  const links = document.querySelectorAll('[data-mobile-link]');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });

  function closeMenu() {
    menu.classList.add('hidden');
    document.body.style.overflow = '';
  }

  close.addEventListener('click', closeMenu);
  links.forEach((link) => link.addEventListener('click', closeMenu));
})();

// ─── Smooth Scroll ──────────────────────────────────────────────────────
(function () {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    const isOnHomepage = window.location.pathname === '/';

    // Anchor links: if on homepage, scroll. If not, navigate to /#anchor
    if (href.startsWith('/#')) {
      if (isOnHomepage) {
        e.preventDefault();
        const target = document.querySelector(href.slice(1)); // remove leading /
        if (target) {
          const headerHeight = 80;
          const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
      // else: let browser navigate to /#anchor naturally
    } else if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
})();
