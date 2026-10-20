(function(){
  // 1. Inject Premium Styles: Tactile Feedback, Smooth Page Entrance & Glowing Top Loader
  const css = `
    @keyframes shPageEntrance {
      0% {
        opacity: 0;
        transform: translateY(6px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    html, body {
      -webkit-tap-highlight-color: transparent !important;
    }

    body {
      animation: shPageEntrance 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
      touch-action: manipulation;
    }

    /* Tactile instant-press feel for buttons and interactive items */
    button, a, input[type="button"], input[type="submit"], [role="button"], 
    .menu-item, .category-card, .product-box, .product-card, .action-item, 
    .cart-btn, .fav-btn, .icon-btn, .nav-node, .nav-link, .hero-btn, .btn-buy-now-d,
    .pdp-btn-buy, .pdp-btn-cart, .btn-add-cart-d, .view-all-link, .d-size-btn, .size-btn,
    .qty-btn, .tab-btn {
      touch-action: manipulation !important;
      -webkit-tap-highlight-color: transparent !important;
      cursor: pointer;
      transition: transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.15s ease, box-shadow 0.15s ease !important;
    }

    button:active, a:active, [role="button"]:active, .menu-item:active, 
    .category-card:active, .action-item:active, .cart-btn:active, .fav-btn:active, 
    .icon-btn:active, .nav-node:active, .hero-btn:active, .btn-buy-now-d:active,
    .pdp-btn-buy:active, .d-size-btn:active, .size-btn:active, .qty-btn:active {
      transform: scale(0.96) !important;
    }

    /* Top Glowing Progress Loader for Luxury Navigation */
    #sh-top-loader {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 0%;
      background: linear-gradient(90deg, #11131c 0%, #2563eb 50%, #10b981 100%);
      box-shadow: 0 0 10px rgba(37, 99, 235, 0.8), 0 0 5px rgba(16, 185, 129, 0.6);
      z-index: 99999999;
      pointer-events: none;
      transition: width 0.32s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.2s ease;
      opacity: 0;
    }

    /* Ripple Wave Effect */
    .sh-ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(17, 19, 28, 0.14);
      transform: scale(0);
      pointer-events: none;
      animation: shRippleAnim 0.45s cubic-bezier(0.25, 1, 0.5, 1);
      z-index: 999;
    }

    @keyframes shRippleAnim {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // 2. Top Loader Bar Controller
  function getLoader() {
    let bar = document.getElementById('sh-top-loader');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'sh-top-loader';
      document.body.appendChild(bar);
    }
    return bar;
  }

  function startLoader() {
    const bar = getLoader();
    bar.style.opacity = '1';
    bar.style.width = '15%';
    setTimeout(function(){ if (bar) bar.style.width = '70%'; }, 40);
  }

  function finishLoader() {
    const bar = document.getElementById('sh-top-loader');
    if (bar) {
      bar.style.width = '100%';
      setTimeout(function(){
        bar.style.opacity = '0';
        setTimeout(function(){ bar.style.width = '0%'; }, 200);
      }, 120);
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    finishLoader();
    hydrateUser();
  } else {
    window.addEventListener('DOMContentLoaded', function(){
      finishLoader();
      hydrateUser();
    });
  }

  // Instant User Hydration to remove any demo name flashes across all pages
  function hydrateUser() {
    try {
      const raw = localStorage.getItem('xpord_user');
      if (!raw) return;
      const u = JSON.parse(raw);
      const name = u.displayName || u.name || (u.email ? u.email.split('@')[0] : 'Member');
      const firstName = name.split(' ')[0] || name;
      const email = u.email || '';

      document.querySelectorAll('.user-name-display, .profile-name').forEach(el => {
        el.textContent = name;
      });
      document.querySelectorAll('.order-recipient-name').forEach(el => {
        el.textContent = name;
      });
      document.querySelectorAll('.user-email-display, .profile-email').forEach(el => {
        el.textContent = email;
      });
      document.querySelectorAll('.user-first-name').forEach(el => {
        el.textContent = firstName;
      });
      document.querySelectorAll('.hello-banner h2').forEach(el => {
        el.textContent = 'Hello, ' + firstName + '!';
      });
    } catch(e) {}
  }
  hydrateUser();

  // 3. Smooth Page Navigation
  function go(path) {
    if (!path) return;
    
    // In-page hash scroll
    if (path.startsWith('#') && path.length > 1) {
      const target = document.querySelector(path);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    startLoader();
    document.body.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    document.body.style.opacity = '0.75';
    document.body.style.transform = 'scale(0.995)';

    setTimeout(function(){
      window.location.href = path;
    }, 100);
  }
  window.styleHubGo = go;

  // 4. Optical Ripple Effect
  function spawnRipple(e, target) {
    if (!target) return;
    try {
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ripple = document.createElement('span');
      ripple.className = 'sh-ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      const x = e.clientX ? (e.clientX - rect.left - size / 2) : (rect.width / 2 - size / 2);
      const y = e.clientY ? (e.clientY - rect.top - size / 2) : (rect.height / 2 - size / 2);
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      const compPos = window.getComputedStyle(target).position;
      if (compPos === 'static') {
        target.style.position = 'relative';
      }
      const overflow = window.getComputedStyle(target).overflow;
      if (overflow !== 'hidden') {
        target.style.overflow = 'hidden';
      }

      target.appendChild(ripple);
      setTimeout(function(){ ripple.remove(); }, 480);
    } catch(err) {}
  }

  // 5. URL Normalization Resolver (Fixes broken / legacy dummy links)
  function resolveDestination(rawHref, textContent, targetEl) {
    if (!rawHref) return null;
    let h = rawHref.trim();
    const t = (textContent || '').trim().toLowerCase();

    // Map old legacy mockup files
    if (h.includes('stylehub-desktop-view.html') || h.includes('stylehub-mobile-view.html')) return 'index.html';
    if (h.includes('stylehub-cart-desktop.html') || h.includes('stylehub-cart-mobile.html')) return 'cart.html';
    if (h.includes('stylehub-signup-desktop.html') || h.includes('stylehub-signup-mobile.html')) return 'signup.html';
    if (h.includes('stylehub-desktop-3dot-menu.html')) return 'menu.html';

    // Check hash or placeholder anchors
    if (h === '#' || h.startsWith('#')) {
      const hash = h.toLowerCase();
      if (hash === '#home' || t.includes('home')) return 'index.html';
      if (hash === '#categories' || hash === '#category' || t.includes('categor')) return 'category.html';
      if (hash === '#orders' || hash === '#order' || t.includes('order')) return 'account.html#orders';
      if (hash === '#wishlist' || t.includes('wishlist')) return 'index.html#wishlist';
      if (hash === '#account' || hash === '#profile' || t.includes('account') || t.includes('profile')) return 'account.html';
      if (hash === '#addresses' || hash === '#address' || t.includes('address')) return 'address.html';
      if (hash === '#payments' || hash === '#payment' || t.includes('payment')) return 'checkout.html';
      if (hash === '#checkout' || t.includes('checkout')) return 'checkout.html';
      if (hash === '#shop' || t.includes('shop now') || t.includes('shop collection')) return 'category.html';
      if (hash === '#all-products' || t.includes('view all')) return 'category.html';
      if (hash === '#deals' || t.includes('deals')) return 'category.html?cat=deals';
      if (hash === '#new-arrivals' || t.includes('new arrival')) return 'category.html?cat=new';
      if (hash === '#about' || hash === '#about-us' || t.includes('about')) return 'index.html#about';
      if (hash === '#contact' || t.includes('contact')) return 'index.html#contact';
      if (hash === '#support' || t.includes('support') || t.includes('help')) return 'index.html#support';
      if (hash === '#returns' || t.includes('return')) return 'index.html#returns';
      if (hash === '#terms' || t.includes('terms')) return 'index.html#terms';
      if (hash === '#privacy' || t.includes('privacy')) return 'index.html#privacy';
      if (hash === '#settings' || t.includes('settings')) return 'account.html';
      if (t.includes('sign up')) return 'signup.html';
      if (t.includes('log in') || t.includes('login')) return 'login.html';
      if (t.includes('cart') || t.includes('bag')) return 'cart.html';
      return null;
    }

    return null;
  }

  // 6. Fast Single-Click Global Event Delegation
  document.addEventListener('click', function(e) {
    // Find interactive button, anchor, or clickable card
    const btn = e.target.closest('button, [role="button"]');
    const a = e.target.closest('a');
    const interactive = btn || a || e.target.closest('.category-card, .menu-item, .nav-node, .action-item');

    // Visual ripple feedback on click
    if (interactive) {
      spawnRipple(e, interactive);
    }

    // A. Anchors handling
    if (a) {
      const href = a.getAttribute('href');
      const resolved = resolveDestination(href, a.textContent, a);
      if (resolved) {
        e.preventDefault();
        e.stopPropagation();
        go(resolved);
        return;
      }
      // If regular page link, still run smooth transition
      if (href && !href.startsWith('javascript:') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#')) {
        e.preventDefault();
        e.stopPropagation();
        go(href);
        return;
      }
    }

    // B. Header Icon Buttons / Special Action Buttons
    if (btn) {
      const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
      const cls = btn.className || '';
      
      // Menu toggle / 3-dot menu
      if (aria === 'menu' || cls.includes('mobile-menu-btn')) {
        e.preventDefault();
        e.stopPropagation();
        go('menu.html');
        return;
      }

      // Wishlist header icon (not PDP favorite toggle)
      if ((aria === 'wishlist' || cls.includes('action-item')) && !cls.includes('fav-btn') && !cls.includes('card-fav-btn')) {
        if ((btn.textContent || '').toLowerCase().includes('wishlist') || aria === 'wishlist') {
          e.preventDefault();
          e.stopPropagation();
          go('index.html#wishlist');
          return;
        }
      }

      // Cart header icon
      if (aria === 'cart' || ((btn.textContent || '').toLowerCase().includes('cart') && cls.includes('action-item'))) {
        e.preventDefault();
        e.stopPropagation();
        go('cart.html');
        return;
      }

      // Account header icon
      if (aria === 'account' || ((btn.textContent || '').toLowerCase().includes('account') && cls.includes('action-item'))) {
        e.preventDefault();
        e.stopPropagation();
        go('account.html');
        return;
      }

      // Back button
      if (aria === 'back' || cls.includes('back-btn')) {
        e.preventDefault();
        e.stopPropagation();
        if (window.history.length > 1) {
          window.history.back();
        } else {
          go('index.html');
        }
        return;
      }

      // Buy Now buttons
      if (cls.includes('btn-buy-now-d') || cls.includes('pdp-btn-buy')) {
        e.preventDefault();
        e.stopPropagation();
        go('checkout.html');
        return;
      }
    }
  }, { capture: false, passive: false });

})();
