(function(){
  // 0. StyleHub Theme Engine (Global Light/Dark Mode)
  let activeTheme = 'light';
  try {
    activeTheme = localStorage.getItem('stylehub-theme') || 'light';
  } catch(e) {
    activeTheme = 'light';
  }
  document.documentElement.setAttribute('data-theme', activeTheme);
  document.documentElement.dataset.theme = activeTheme;

  // 1. Inject Premium Styles: Tactile Feedback, Smooth Page Entrance & Glowing Top Loader
  const css = `
    @keyframes shPageEntrance {
      0% {
        opacity: 0.9;
      }
      100% {
        opacity: 1;
      }
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    html, body {
      overflow-x: hidden !important;
      max-width: 100% !important;
      width: 100% !important;
    }

    html, body, .phone, .mobile-page, .mobile-app, .mobile-container, main {
      -webkit-tap-highlight-color: transparent !important;
      transform: none !important;
      perspective: none !important;
      filter: none !important;
    }

    body {
      animation: shPageEntrance 0.12s ease both;
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

        /* ====================================================
       Premium Luxury Bottom Navigation & Animated Active State
       (Exact design, dimensions, gradient & animations from user HTML)
       ==================================================== */
    .bottomnav, #GlobalBottomNavigation {
      position: fixed !important;
      bottom: 0 !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 100% !important;
      max-width: 480px !important;
      min-height: 80px !important;
      height: 80px !important;
      background: linear-gradient(180deg, #191919 0%, #050505 100%) !important;
      color: #f7f4ed !important;
      border-radius: 22px 22px 0 0 !important;
      border-top: 1px solid #d5b46b !important;
      display: flex !important;
      justify-content: space-around !important;
      align-items: center !important;
      gap: 2px !important;
      padding: 8px 10px calc(14px + env(safe-area-inset-bottom, 0px)) !important;
      z-index: 2147483647 !important;
      box-shadow: 0 -8px 28px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
      box-sizing: border-box !important;
      isolation: isolate !important;
      overflow: hidden !important;
    }

    /* Animated active state: sliding pill background indicator */
    .bottomnav::before, #GlobalBottomNavigation::before {
      content: "" !important;
      position: absolute !important;
      z-index: 0 !important;
      top: 13px !important;
      bottom: calc(19px + env(safe-area-inset-bottom, 0px)) !important;
      left: var(--active-left, calc(80% + 2px)) !important;
      width: var(--active-width, calc(20% - 4px)) !important;
      border: 1px solid #8e713a !important;
      border-radius: 17px !important;
      background: linear-gradient(145deg, #3a3020 0%, #1e1a13 100%) !important;
      box-shadow: inset 0 1px 0 rgba(246, 229, 177, 0.33), 0 4px 14px rgba(0, 0, 0, 0.25) !important;
      transition: left .34s cubic-bezier(.22, .8, .25, 1), width .34s cubic-bezier(.22, .8, .25, 1) !important;
      pointer-events: none !important;
    }

    .bottomnav .navitem, #GlobalBottomNavigation .navitem {
      position: relative !important;
      z-index: 1 !important;
      flex: 1 !important;
      min-width: 0 !important;
      max-width: 132px !important;
      height: 62px !important;
      border: 1px solid transparent !important;
      background: transparent !important;
      color: #c9c9c9 !important;
      border-radius: 17px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 4px !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      letter-spacing: .1px !important;
      cursor: pointer !important;
      text-decoration: none !important;
      user-select: none !important;
      -webkit-tap-highlight-color: transparent !important;
      transition: color .22s ease, transform .22s ease, background .22s ease !important;
    }

    .bottomnav .navitem svg, #GlobalBottomNavigation .navitem svg {
      width: 25px !important;
      height: 25px !important;
      stroke: currentColor !important;
      fill: none !important;
      stroke-width: 1.8 !important;
      stroke-linecap: round !important;
      stroke-linejoin: round !important;
      transition: transform .28s cubic-bezier(.2, .8, .2, 1), filter .22s ease !important;
    }

    .bottomnav .navitem:active, #GlobalBottomNavigation .navitem:active {
      transform: scale(.93) !important;
    }

    .bottomnav .navitem.selected, #GlobalBottomNavigation .navitem.selected {
      background: transparent !important;
      border-color: transparent !important;
      color: #f2d48a !important;
      box-shadow: none !important;
    }

    .bottomnav .navitem.selected svg, #GlobalBottomNavigation .navitem.selected svg {
      transform: translateY(-2px) !important;
      filter: drop-shadow(0 0 4px rgba(212, 173, 89, 0.35)) !important;
      color: #f2d48a !important;
    }

    .bottomnav .navitem.selected span, #GlobalBottomNavigation .navitem.selected span {
      color: #f2d48a !important;
      font-weight: 700 !important;
    }

    .bottomnav .navicon, #GlobalBottomNavigation .navicon {
      position: relative !important;
      display: grid !important;
      place-items: center !important;
    }

    .bottomnav .navbadge, #GlobalBottomNavigation .navbadge {
      position: absolute !important;
      top: -7px !important;
      right: -13px !important;
      background: linear-gradient(135deg, #f0d28a, #b88735) !important;
      border: 1px solid #17130d !important;
      border-radius: 50% !important;
      font-size: 10px !important;
      line-height: 16px !important;
      min-width: 18px !important;
      height: 18px !important;
      text-align: center !important;
      padding: 0 4px !important;
      color: #21180a !important;
      font-weight: 850 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-sizing: border-box !important;
    }

    .gesture, #GlobalBottomGesture {
      position: fixed !important;
      bottom: calc(5px + env(safe-area-inset-bottom, 0px)) !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 120px !important;
      height: 4px !important;
      border-radius: 10px !important;
      background: #ffffff !important;
      z-index: 2147483647 !important;
      pointer-events: none !important;
      opacity: 0.9 !important;
    }

    body {
      padding-bottom: 96px !important;
    }
    .page, .app-screen, .phone, .mobile-page, .container-app, .mobile-container, main {
      padding-bottom: 96px !important;
    }

    .navitem:focus-visible {
      outline: 2px solid #e3c477 !important;
      outline-offset: 2px !important;
    }

    @media(max-width: 600px) {
      .bottomnav, #GlobalBottomNavigation {
        min-height: 82px !important;
        height: 82px !important;
        padding: 7px 7px calc(15px + env(safe-area-inset-bottom, 0px)) !important;
        gap: 2px !important;
      }
      .bottomnav .navitem, #GlobalBottomNavigation .navitem {
        height: 59px !important;
        font-size: 10px !important;
        border-radius: 15px !important;
      }
      .bottomnav .navitem svg, #GlobalBottomNavigation .navitem svg {
        width: 24px !important;
        height: 24px !important;
      }
    }

    @media(prefers-reduced-motion: reduce) {
      .bottomnav::before, #GlobalBottomNavigation::before,
      .bottomnav .navitem, #GlobalBottomNavigation .navitem,
      .bottomnav .navitem svg, #GlobalBottomNavigation .navitem svg {
        transition: none !important;
      }
    }

    /* ====================================================
       Universal Compact Premium Circular Back Button Component
       (Exact design match from user reference image:
       Compact 42x42px circular, crisp white background,
       subtle light-grey border, clean centered black arrow)
       ==================================================== */
    .back-btn, #backBtn, .sh-back-btn, .head-btn#backBtn, 
    button[data-role="back-btn"], .detail-back-btn, .pdp-mobile-back-btn,
    .sh-circular-back {
      width: 42px !important;
      height: 42px !important;
      min-width: 42px !important;
      min-height: 42px !important;
      max-width: 42px !important;
      max-height: 42px !important;
      border-radius: 50% !important;
      background: #ffffff !important;
      border: 1px solid #e2e8f0 !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04) !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 0 !important;
      margin: 0 !important;
      cursor: pointer !important;
      color: #171717 !important;
      font-size: 0 !important;
      line-height: 1 !important;
      outline: none !important;
      text-decoration: none !important;
      user-select: none !important;
      -webkit-tap-highlight-color: transparent !important;
      box-sizing: border-box !important;
      flex-shrink: 0 !important;
      transition: transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease !important;
    }

    .back-btn:hover, #backBtn:hover, .sh-back-btn:hover, .head-btn#backBtn:hover,
    button[data-role="back-btn"]:hover, .detail-back-btn:hover, .pdp-mobile-back-btn:hover,
    .sh-circular-back:hover {
      background: #f8fafc !important;
      border-color: #cbd5e1 !important;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
      transform: scale(1.04) !important;
    }

    .back-btn:active, #backBtn:active, .sh-back-btn:active, .head-btn#backBtn:active,
    button[data-role="back-btn"]:active, .detail-back-btn:active, .pdp-mobile-back-btn:active,
    .sh-circular-back:active {
      transform: scale(0.95) !important;
      background: #f1f5f9 !important;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
    }

    .back-btn:focus-visible, #backBtn:focus-visible, .sh-back-btn:focus-visible,
    .sh-circular-back:focus-visible {
      outline: 2px solid #b8944b !important;
      outline-offset: 2px !important;
    }

    .back-btn svg, #backBtn svg, .sh-back-btn svg, .head-btn#backBtn svg,
    button[data-role="back-btn"] svg, .detail-back-btn svg, .pdp-mobile-back-btn svg,
    .sh-circular-back svg {
      width: 20px !important;
      height: 20px !important;
      display: block !important;
      margin: 0 auto !important;
      stroke: #171717 !important;
      fill: none !important;
      stroke-width: 2.2 !important;
      stroke-linecap: round !important;
      stroke-linejoin: round !important;
      pointer-events: none !important;
      transition: transform 0.16s ease !important;
    }

    .back-btn:hover svg, #backBtn:hover svg, .sh-back-btn:hover svg,
    .sh-circular-back:hover svg {
      transform: translateX(-1.5px) !important;
    }

    /* Hide any text label inside back buttons ("Back", etc.) */
    .back-btn span, #backBtn span, .sh-back-btn span, 
    .back-btn .btn-text, #backBtn .btn-text, .sh-circular-back span {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
      visibility: hidden !important;
      font-size: 0 !important;
    }

    /* Top navigation bar layout for back button */
    .top-nav {
      min-height: 60px !important;
      padding: 8px 16px !important;
    }

    /* StyleHub Standard Universal Topbar Header */
    .topbar {
      height: 78px;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 0 22px;
      border-bottom: 1px solid #e8e1d4;
      background: rgba(255,255,255,.96);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(8px);
      box-sizing: border-box;
      width: 100%;
    }
    .topbar .iconbtn {
      border: 0;
      background: transparent;
      color: #111;
      padding: 6px;
      display: grid;
      place-items: center;
      position: relative;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      transition: background .2s, transform .2s;
      flex-shrink: 0;
    }
    .topbar .iconbtn:hover {
      background: #f7f1e5;
      transform: translateY(-1px);
    }
    .topbar .iconbtn svg {
      width: 22px;
      height: 22px;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.8;
    }
    .topbar .sh-circular-back {
      background: #ffffff !important;
      border: 1px solid #e2d8c3 !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important;
      color: #1c1a16 !important;
    }
    .topbar .sh-circular-back:hover {
      background: #fdfaf4 !important;
      border-color: #d4ad59 !important;
    }
    .topbar .brand {
      flex: 1;
      min-width: 0;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }
    .topbar .brandname {
      font-size: 28px;
      line-height: 1;
      font-weight: 850;
      letter-spacing: -1.2px;
      color: #171717;
    }
    .topbar .hub {
      color: #ad8439;
    }
    .topbar .tagline {
      font-size: 8px;
      letter-spacing: 3px;
      color: #8d8068;
      margin-top: 5px;
      white-space: nowrap;
      font-weight: 700;
    }
    .topbar .badge {
      position: absolute;
      top: 0;
      right: -1px;
      min-width: 19px;
      height: 19px;
      border-radius: 50%;
      background: linear-gradient(135deg, #c7a45d, #98702c);
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      display: grid;
      place-items: center;
      padding: 0 4px;
      box-shadow: 0 2px 6px #b9934d40;
    }
    html[data-theme="dark"] .topbar {
      background: rgba(22, 23, 21, 0.96) !important;
      border-bottom-color: #34342e !important;
    }
    html[data-theme="dark"] .topbar .sh-circular-back {
      background: #1b1c19 !important;
      border-color: #34342e !important;
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .topbar .sh-circular-back svg {
      stroke: #f5f1e8 !important;
    }
    html[data-theme="dark"] .topbar .brandname {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .topbar .hub {
      color: #e0bd75 !important;
    }
    html[data-theme="dark"] .topbar .tagline {
      color: #aaa69c !important;
    }
    html[data-theme="dark"] .topbar .iconbtn {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .topbar .iconbtn:hover {
      background: #22231f !important;
    }

    /* ====================================================
       STYLEHUB GLOBAL THEME SYSTEM: LUXE DARK / LIGHT MODE
       (Ivory, deep black, charcoal, metallic gold palette)
       ==================================================== */
    :root {
      color-scheme: light;
      --page: #f5f3ee;
      --surface: #ffffff;
      --surface-soft: #faf8f3;
      --text: #1d1b17;
      --muted: #77736b;
      --line: #e8e2d7;
      --gold: #b38a43;
      --gold-soft: #f4ead4;
      --shadow: 0 12px 34px rgba(36,29,15,.07);
      --toggle-track: #eee7d9;
      --toggle-knob: #fffdf8;
    }

    html[data-theme="dark"] {
      color-scheme: dark;
      --page: #111210;
      --surface: #1b1c19;
      --surface-soft: #22231f;
      --text: #f5f1e8;
      --muted: #aaa69c;
      --line: #34342e;
      --gold: #e0bd75;
      --gold-soft: #3a3020;
      --shadow: 0 14px 38px rgba(0,0,0,.24);
      --toggle-track: #39362e;
      --toggle-knob: #29271f;
    }

    /* Smooth page background, cards, text, borders and icons transitions */
    body, .mobile-app, .page, .mobile-page, .top-header, .topbar, .app-header, 
    .top, .header, .card, .product-card, .menu-card-container, .menu-row-item, 
    .summary, .item, .order-card, .compact-order-card, .sheet-card, 
    .back-btn, .icon-btn, .icon-link-btn, input, select, textarea, .coupon, 
    .delivery-box, .luxury-profile-card {
      transition: background 0.32s cubic-bezier(0.2, 0.8, 0.2, 1),
                  background-color 0.32s cubic-bezier(0.2, 0.8, 0.2, 1),
                  color 0.32s ease,
                  border-color 0.32s ease,
                  box-shadow 0.32s ease !important;
    }

    /* Theme Toggle Component (From user demo) */
    .theme-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      flex: 0 0 auto;
      user-select: none;
    }
    .theme-label {
      font-size: 9px;
      color: var(--muted, #77736b);
      font-weight: 750;
      letter-spacing: 0.5px;
      transition: color 0.3s ease;
      white-space: nowrap;
    }
    html[data-theme="dark"] .theme-label {
      color: #e0bd75 !important;
    }
    .theme-toggle {
      position: relative;
      width: 76px;
      height: 40px;
      border: 1px solid rgba(179, 138, 67, 0.42);
      border-radius: 99px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--toggle-track, #eee7d9);
      box-shadow: inset 0 2px 4px rgba(0,0,0,.07), 0 3px 10px rgba(0,0,0,.04);
      cursor: pointer;
      isolation: isolate;
      transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.25s ease;
      outline: none;
      box-sizing: border-box;
      border-color: #e8e2d7;
    }
    .theme-toggle:focus-visible {
      box-shadow: 0 0 0 4px rgba(224, 189, 117, 0.27);
    }
    .theme-toggle .icon {
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      z-index: 1;
      color: #77736b;
      transition: color 0.3s ease, transform 0.35s cubic-bezier(0.2, 0.85, 0.25, 1.25);
      pointer-events: none;
    }
    .theme-toggle .icon svg {
      width: 17px;
      height: 17px;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .theme-toggle .sun {
      color: #a7792b;
      transform: rotate(0deg) scale(1.08);
    }
    .theme-toggle .moon {
      color: #7d7b91;
      transform: rotate(25deg) scale(0.88);
    }
    .knob {
      position: absolute;
      z-index: 0;
      top: 4px;
      left: 4px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: var(--toggle-knob, #fffdf8);
      box-shadow: 0 2px 7px rgba(0,0,0,.16), inset 0 0 0 1px rgba(179,138,67,.17);
      transition: transform 0.42s cubic-bezier(.2,.85,.25,1.25), background 0.35s ease, box-shadow 0.35s ease;
      pointer-events: none;
    }

    /* Dark Mode State for Toggle */
    html[data-theme="dark"] .theme-toggle {
      background: #39362e !important;
      border-color: rgba(224, 189, 117, 0.4) !important;
      box-shadow: inset 0 2px 5px rgba(0,0,0,0.3) !important;
    }
    html[data-theme="dark"] .knob {
      transform: translateX(36px) !important;
      background: #29271f !important;
      box-shadow: 0 2px 10px rgba(0,0,0,.35), inset 0 0 0 1px rgba(224,189,117,.25) !important;
    }
    html[data-theme="dark"] .theme-toggle .sun {
      color: #77736b !important;
      transform: rotate(-25deg) scale(0.88) !important;
    }
    html[data-theme="dark"] .theme-toggle .moon {
      color: #e0bd75 !important;
      transform: rotate(0deg) scale(1.08) !important;
    }
    html[data-theme="light"] .theme-toggle .sun {
      color: #a7792b !important;
      transform: rotate(0deg) scale(1.08) !important;
    }
    html[data-theme="light"] .theme-toggle .moon {
      color: #7d7b91 !important;
      transform: rotate(25deg) scale(0.88) !important;
    }

    @media(max-width:370px) {
      .theme-toggle { width: 70px; }
      .knob { width: 28px; height: 28px; }
      .theme-toggle .icon { width: 28px; height: 28px; }
      html[data-theme="dark"] .knob { transform: translateX(32px) !important; }
    }

    /* ====================================================
       ENTIRE APP DARK MODE OVERRIDES (LUXE PALETTE)
       ==================================================== */
    html[data-theme="dark"] body {
      background: #111210 !important;
      background-color: #111210 !important;
      color: #f5f1e8 !important;
    }

    html[data-theme="dark"] .phone,
    html[data-theme="dark"] .mobile-page,
    html[data-theme="dark"] .mobile-app,
    html[data-theme="dark"] .mobile-container,
    html[data-theme="dark"] .app-screen,
    html[data-theme="dark"] .page,
    html[data-theme="dark"] .content-body,
    html[data-theme="dark"] .main-content,
    html[data-theme="dark"] main,
    html[data-theme="dark"] #app {
      background: #111210 !important;
      background-color: #111210 !important;
      color: #f5f1e8 !important;
      border-color: #34342e !important;
    }

    /* Top Headers, Topbars, Navbars across all pages */
    html[data-theme="dark"] .top-header,
    html[data-theme="dark"] .topbar,
    html[data-theme="dark"] .app-header,
    html[data-theme="dark"] .top,
    html[data-theme="dark"] .header,
    html[data-theme="dark"] .desktop-header,
    html[data-theme="dark"] .navbar {
      background: rgba(22, 23, 21, 0.96) !important;
      background-color: rgba(22, 23, 21, 0.96) !important;
      border-color: #34342e !important;
      color: #f5f1e8 !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.35) !important;
    }

    html[data-theme="dark"] .announcement {
      background: #0d0e0c !important;
      color: #f5f1e8 !important;
      border-bottom: 1px solid #2a2b25 !important;
    }
    html[data-theme="dark"] .announcement b {
      color: #e0bd75 !important;
    }
    html[data-theme="dark"] .ios-status-bar {
      background: #161715 !important;
      color: #f5f1e8 !important;
    }

    /* Brand Logo & Text */
    html[data-theme="dark"] .brand-title,
    html[data-theme="dark"] .brand-logo h1,
    html[data-theme="dark"] .logo,
    html[data-theme="dark"] .brandname {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .brand-tagline,
    html[data-theme="dark"] .brand-logo span,
    html[data-theme="dark"] .tagline {
      color: #aaa69c !important;
    }
    html[data-theme="dark"] .hub-gold,
    html[data-theme="dark"] .logo span,
    html[data-theme="dark"] .hub {
      color: #e0bd75 !important;
    }

    /* Circular Back Button in Dark Mode */
    html[data-theme="dark"] .back-btn,
    html[data-theme="dark"] #backBtn,
    html[data-theme="dark"] .sh-circular-back,
    html[data-theme="dark"] .back {
      background: #1b1c19 !important;
      background-color: #1b1c19 !important;
      border: 1px solid #34342e !important;
      color: #f5f1e8 !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25) !important;
    }
    html[data-theme="dark"] .back-btn svg,
    html[data-theme="dark"] #backBtn svg,
    html[data-theme="dark"] .sh-circular-back svg,
    html[data-theme="dark"] .back svg {
      stroke: #f5f1e8 !important;
    }
    html[data-theme="dark"] .back-btn:hover,
    html[data-theme="dark"] #backBtn:hover,
    html[data-theme="dark"] .sh-circular-back:hover,
    html[data-theme="dark"] .back:hover {
      background: #252622 !important;
      border-color: #e0bd75 !important;
      box-shadow: 0 4px 12px rgba(224,189,117,0.18) !important;
    }

    /* Header Icons & Hamburger */
    html[data-theme="dark"] .hamburger-btn span {
      background-color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .icon-btn,
    html[data-theme="dark"] .icon-link-btn,
    html[data-theme="dark"] .iconbtn,
    html[data-theme="dark"] .head-btn {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .icon-btn svg,
    html[data-theme="dark"] .icon-link-btn svg,
    html[data-theme="dark"] .iconbtn svg,
    html[data-theme="dark"] .head-btn svg {
      stroke: #f5f1e8 !important;
    }

    /* Headings, Paragraphs & Text */
    html[data-theme="dark"] h1, 
    html[data-theme="dark"] h2, 
    html[data-theme="dark"] h3, 
    html[data-theme="dark"] h4, 
    html[data-theme="dark"] h5, 
    html[data-theme="dark"] h6 {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] p,
    html[data-theme="dark"] .desc,
    html[data-theme="dark"] .subtitle,
    html[data-theme="dark"] .muted,
    html[data-theme="dark"] .text-muted,
    html[data-theme="dark"] .subtext {
      color: #aaa69c !important;
    }

    /* Cards, Product Grids & Containers */
    html[data-theme="dark"] .product-card,
    html[data-theme="dark"] .product-box,
    html[data-theme="dark"] .prod-card,
    html[data-theme="dark"] .category-card,
    html[data-theme="dark"] .cat-card,
    html[data-theme="dark"] .card,
    html[data-theme="dark"] .menu-card-container,
    html[data-theme="dark"] .order-card,
    html[data-theme="dark"] .compact-order-card,
    html[data-theme="dark"] .orders-card,
    html[data-theme="dark"] .step-card,
    html[data-theme="dark"] .address-card,
    html[data-theme="dark"] .payment-card,
    html[data-theme="dark"] .item-card,
    html[data-theme="dark"] .sheet-card,
    html[data-theme="dark"] .modal-content,
    html[data-theme="dark"] .modal-box {
      background: #1b1c19 !important;
      background-color: #1b1c19 !important;
      border-color: #34342e !important;
      color: #f5f1e8 !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
    }

    /* Links inside cards */
    html[data-theme="dark"] .product-title,
    html[data-theme="dark"] .prod-name,
    html[data-theme="dark"] .menu-title-primary,
    html[data-theme="dark"] .menu-item-label,
    html[data-theme="dark"] .order-item-title,
    html[data-theme="dark"] .address-name {
      color: #f5f1e8 !important;
    }

    /* Gold Price Display */
    html[data-theme="dark"] .price,
    html[data-theme="dark"] .product-price,
    html[data-theme="dark"] .prod-price,
    html[data-theme="dark"] .item-price,
    html[data-theme="dark"] .sum-total strong {
      color: #e0bd75 !important;
    }

    /* Old Price Strikethrough */
    html[data-theme="dark"] .old-price,
    html[data-theme="dark"] .original-price,
    html[data-theme="dark"] .item-old {
      color: #77736b !important;
    }

    /* Category Navigation & Filter Chips */
    html[data-theme="dark"] .category-pill,
    html[data-theme="dark"] .filter-chip,
    html[data-theme="dark"] .tab-item,
    html[data-theme="dark"] .links a,
    html[data-theme="dark"] .tab-btn {
      background: #22231f !important;
      border-color: #34342e !important;
      color: #d1ccc0 !important;
    }
    html[data-theme="dark"] .category-pill.active,
    html[data-theme="dark"] .filter-chip.active,
    html[data-theme="dark"] .tab-item.active,
    html[data-theme="dark"] .links a:hover,
    html[data-theme="dark"] .tab-btn.active {
      background: #e0bd75 !important;
      color: #111210 !important;
      border-color: #e0bd75 !important;
      font-weight: 700 !important;
    }

    /* Inputs, Search Bars & Textareas */
    html[data-theme="dark"] input,
    html[data-theme="dark"] select,
    html[data-theme="dark"] textarea,
    html[data-theme="dark"] .search input,
    html[data-theme="dark"] .search-bar,
    html[data-theme="dark"] .coupon-input {
      background: #1f201c !important;
      background-color: #1f201c !important;
      border-color: #3d3e37 !important;
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] input::placeholder,
    html[data-theme="dark"] textarea::placeholder,
    html[data-theme="dark"] .search input::placeholder {
      color: #7d7970 !important;
    }
    html[data-theme="dark"] input:focus,
    html[data-theme="dark"] select:focus,
    html[data-theme="dark"] textarea:focus,
    html[data-theme="dark"] .search input:focus {
      border-color: #e0bd75 !important;
      outline: none !important;
      box-shadow: 0 0 0 3px rgba(224, 189, 117, 0.22) !important;
    }

    /* Account Menu rows */
    html[data-theme="dark"] .menu-row-item {
      border-bottom-color: #2b2c26 !important;
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .menu-row-item:hover {
      background: #22231f !important;
    }
    html[data-theme="dark"] .menu-icon-circle {
      background: #3a3020 !important;
      color: #e0bd75 !important;
    }
    html[data-theme="dark"] .menu-icon-circle.heart-circle {
      background: #382424 !important;
      color: #ef4444 !important;
    }
    html[data-theme="dark"] .menu-chevron {
      color: #77736b !important;
    }
    html[data-theme="dark"] .luxury-profile-card {
      background: #161714 !important;
      border: 1px solid #3d3b2f !important;
    }
    html[data-theme="dark"] .profile-guest-subtext {
      color: #aaa69c !important;
    }
    html[data-theme="dark"] .profile-auth-action-btn {
      background: #22231f !important;
      border-color: #3d3b2f !important;
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .btn-edit-profile-action {
      background: rgba(224,189,117,0.14) !important;
      border-color: rgba(224,189,117,0.3) !important;
      color: #e0bd75 !important;
    }

    /* Cart Specific Dark Mode Styling (Mobile & Desktop) */
    html[data-theme="dark"] .user-bar {
      background: #181916 !important;
      border-bottom-color: #2e2f29 !important;
      color: #aaa69c !important;
    }
    html[data-theme="dark"] .user-bar strong {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .hero {
      background: linear-gradient(135deg, #1b1c19 0%, #151613 100%) !important;
      border-color: #34342e !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .hero-inner {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .hero-mark {
      background: linear-gradient(145deg, #2a2820, #1b1c19) !important;
      border-color: #3f3928 !important;
      color: #e0bd75 !important;
      box-shadow: inset 0 1px #333, 0 4px 12px rgba(0,0,0,0.3) !important;
    }
    html[data-theme="dark"] .hero-mark svg {
      stroke: #e0bd75 !important;
    }
    html[data-theme="dark"] .eyebrow {
      color: #e0bd75 !important;
    }
    html[data-theme="dark"] .hero h1,
    html[data-theme="dark"] .hero p {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .hero-meta {
      background: #171815 !important;
      border-top-color: #2e2f29 !important;
    }
    html[data-theme="dark"] .pill {
      background: #252620 !important;
      border-color: #3f3928 !important;
      color: #e0bd75 !important;
    }
    html[data-theme="dark"] .meta-text {
      color: #aaa69c !important;
    }
    html[data-theme="dark"] .progressbox {
      background: linear-gradient(110deg, #1c1d19, #161714) !important;
      border-color: #34342e !important;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25) !important;
    }
    html[data-theme="dark"] .progressrow {
      color: #aaa69c !important;
    }
    html[data-theme="dark"] .progressrow strong {
      color: #e0bd75 !important;
    }
    html[data-theme="dark"] .progressbar {
      background: #272822 !important;
    }
    html[data-theme="dark"] .progressfill {
      background: linear-gradient(90deg, #b8944b, #e0bd75, #faecc7) !important;
    }
    html[data-theme="dark"] .cart-item,
    html[data-theme="dark"] .item {
      background: #1a1b18 !important;
      border-color: #34342e !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.28) !important;
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .cart-item:hover,
    html[data-theme="dark"] .item:hover {
      border-color: #e0bd75 !important;
      box-shadow: 0 8px 24px rgba(224,189,117,0.12) !important;
    }
    html[data-theme="dark"] .product-visual {
      background: linear-gradient(145deg, #242521, #181916) !important;
    }
    html[data-theme="dark"] .category {
      color: #e0bd75 !important;
    }
    html[data-theme="dark"] .item-title {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .item-meta {
      color: #aaa69c !important;
    }
    html[data-theme="dark"] .remove,
    html[data-theme="dark"] .del-btn {
      background: #22231f !important;
      border-color: #34342e !important;
      color: #aaa69c !important;
    }
    html[data-theme="dark"] .remove:hover,
    html[data-theme="dark"] .del-btn:hover {
      background: rgba(239, 68, 68, 0.16) !important;
      border-color: rgba(239, 68, 68, 0.45) !important;
      color: #ef4444 !important;
    }
    html[data-theme="dark"] .price {
      color: #e0bd75 !important;
    }
    html[data-theme="dark"] .oldprice {
      color: #77736b !important;
    }
    html[data-theme="dark"] .qty,
    html[data-theme="dark"] .qty-wrap {
      background: #20211d !important;
      border-color: #3a3b34 !important;
    }
    html[data-theme="dark"] .qty button,
    html[data-theme="dark"] .qty-btn {
      background: #282924 !important;
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .qty button:hover,
    html[data-theme="dark"] .qty-btn:hover {
      background: #36372f !important;
      color: #e0bd75 !important;
    }
    html[data-theme="dark"] .qty span,
    html[data-theme="dark"] .qty-num {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .coupon,
    html[data-theme="dark"] .summary {
      background: linear-gradient(145deg, #1b1c19 0%, #151613 100%) !important;
      border-color: #34342e !important;
      box-shadow: 0 8px 28px rgba(0,0,0,0.28) !important;
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .coupon-icon {
      background: linear-gradient(145deg, #2b271d, #1c1d19) !important;
      border-color: #3f3928 !important;
      color: #e0bd75 !important;
    }
    html[data-theme="dark"] .coupon-title,
    html[data-theme="dark"] .sum-title,
    html[data-theme="dark"] .summary h2 {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .coupon-sub {
      color: #aaa69c !important;
    }
    html[data-theme="dark"] .coupon-entry input {
      background: #141512 !important;
      border-color: #3f3928 !important;
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .apply {
      background: linear-gradient(110deg, #e0bd75, #c7a45d) !important;
      color: #111210 !important;
      border-color: #e0bd75 !important;
      font-weight: 900 !important;
    }
    html[data-theme="dark"] .benefits {
      border-color: #34342e !important;
    }
    html[data-theme="dark"] .benefit {
      background: #1a1b18 !important;
      border-color: #34342e !important;
    }
    html[data-theme="dark"] .benefit:hover {
      border-color: #e0bd75 !important;
    }
    html[data-theme="dark"] .benefit strong {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .benefit span {
      color: #aaa69c !important;
    }
    html[data-theme="dark"] .benefit svg {
      stroke: #e0bd75 !important;
    }
    html[data-theme="dark"] .sumline {
      color: #aaa69c !important;
    }
    html[data-theme="dark"] .sumline strong {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .divider {
      background: #34342e !important;
    }
    html[data-theme="dark"] .total span {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .total strong {
      color: #e0bd75 !important;
    }
    html[data-theme="dark"] .taxnote {
      color: #77736b !important;
    }
    html[data-theme="dark"] .checkout {
      background: linear-gradient(110deg, #e0bd75 0%, #c7a45d 100%) !important;
      color: #111210 !important;
      border-color: #e0bd75 !important;
      box-shadow: 0 6px 20px rgba(224,189,117,0.25) !important;
      font-weight: 900 !important;
    }
    html[data-theme="dark"] .checkout svg {
      stroke: #111210 !important;
    }
    html[data-theme="dark"] .empty {
      background: #191a17 !important;
      border-color: #34342e !important;
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .empty-icon {
      background: #262722 !important;
      color: #e0bd75 !important;
    }
    html[data-theme="dark"] .empty h2 {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .empty p {
      color: #aaa69c !important;
    }
    html[data-theme="dark"] .delivery-box {
      background: linear-gradient(135deg, #22231f 0%, #1b1c19 100%) !important;
      border-color: #3d3b32 !important;
      box-shadow: 0 6px 20px rgba(0,0,0,0.25) !important;
    }
    html[data-theme="dark"] .bar {
      background: #34342e !important;
    }

    /* Orders Page Specific */
    html[data-theme="dark"] .card-action-btn {
      background: #22231f !important;
      border-color: #34342e !important;
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .card-action-btn:hover {
      background: #2d2e29 !important;
      border-color: #e0bd75 !important;
      color: #e0bd75 !important;
    }

    /* Modal / Bottom Sheet Dark Mode */
    html[data-theme="dark"] .sheet-card {
      background: #1b1c19 !important;
      border-color: #34342e !important;
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .sheet-title {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .sheet-close {
      background: #22231f !important;
      color: #f5f1e8 !important;
      border-color: #34342e !important;
    }
    html[data-theme="dark"] .sheet-card label {
      color: #aaa69c !important;
    }

    /* Footer in Dark Mode */
    html[data-theme="dark"] .footer {
      background: #0d0e0c !important;
      border-top: 1px solid #2a2b25 !important;
      color: #aaa69c !important;
    }
    html[data-theme="dark"] .footer strong {
      color: #f5f1e8 !important;
    }
    html[data-theme="dark"] .footer a {
      color: #aaa69c !important;
    }
    html[data-theme="dark"] .footer a:hover {
      color: #e0bd75 !important;
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // StyleHub Global Theme Controller
  function applyGlobalTheme(theme, save = true) {
    const isDark = theme === 'dark';
    const finalTheme = isDark ? 'dark' : 'light';
    activeTheme = finalTheme;
    document.documentElement.setAttribute('data-theme', finalTheme);
    document.documentElement.dataset.theme = finalTheme;
    
    // Update all theme toggle buttons across the page
    const toggles = document.querySelectorAll('.theme-toggle, #themeToggle, [data-role="theme-toggle"]');
    toggles.forEach(toggle => {
      toggle.setAttribute('aria-checked', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      toggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });

    const labels = document.querySelectorAll('.theme-label, #themeLabel, [data-role="theme-label"]');
    labels.forEach(lbl => {
      lbl.textContent = isDark ? 'DARK MODE' : 'LIGHT MODE';
    });

    if (save) {
      try {
        localStorage.setItem('stylehub-theme', finalTheme);
      } catch (e) {}
    }

    try {
      window.dispatchEvent(new CustomEvent('stylehub-theme-change', { detail: { theme: finalTheme, isDark } }));
    } catch(e) {}
  }

  function toggleGlobalTheme() {
    const current = document.documentElement.getAttribute('data-theme') || activeTheme;
    const next = current === 'dark' ? 'light' : 'dark';
    applyGlobalTheme(next, true);
    return next;
  }

  function hydrateThemeToggles() {
    const isDark = (document.documentElement.getAttribute('data-theme') || activeTheme) === 'dark';
    const toggles = document.querySelectorAll('.theme-toggle, #themeToggle, [data-role="theme-toggle"]');
    toggles.forEach(toggle => {
      toggle.setAttribute('aria-checked', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      toggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      if (!toggle.hasAttribute('data-theme-bound')) {
        toggle.setAttribute('data-theme-bound', 'true');
        toggle.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          toggleGlobalTheme();
        });
      }
    });

    const labels = document.querySelectorAll('.theme-label, #themeLabel, [data-role="theme-label"]');
    labels.forEach(lbl => {
      lbl.textContent = isDark ? 'DARK MODE' : 'LIGHT MODE';
    });
  }

  window.StyleHubTheme = {
    getTheme: () => document.documentElement.getAttribute('data-theme') || activeTheme,
    setTheme: applyGlobalTheme,
    toggleTheme: toggleGlobalTheme,
    isDark: () => (document.documentElement.getAttribute('data-theme') || activeTheme) === 'dark',
    hydrate: hydrateThemeToggles
  };

  // Sync with other open windows / tabs
  window.addEventListener('storage', function(e) {
    if (e.key === 'stylehub-theme' && e.newValue) {
      applyGlobalTheme(e.newValue, false);
    }
  });

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
    setupBottomNav();
  } else {
    window.addEventListener('DOMContentLoaded', function(){
      finishLoader();
      hydrateUser();
      setupBottomNav();
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
    document.body.style.transition = 'opacity 0.15s ease';
    document.body.style.opacity = '0.8';

    setTimeout(function(){
      window.location.href = path;
    }, 100);
  }
  window.styleHubGo = go;

  // Universal 3-Dot / Menu Opener (Preserves exact page to return back to)
  function openMenu() {
    if (typeof window.openMenuDrawer === 'function') {
      window.openMenuDrawer();
      return;
    }
    var cur = window.location.pathname.split('/').pop() || 'index.html';
    if (window.location.search) cur += window.location.search;
    if (window.location.hash) cur += window.location.hash;
    if (cur.includes('menu')) cur = 'index.html';
    try { sessionStorage.setItem('sh_menu_return_url', cur); } catch(e){}
    go('menu.html?return=' + encodeURIComponent(cur));
  }
  window.styleHubOpenMenu = openMenu;

  // Global Floating Toast
  function showGlobalToast(msg) {
    let t = document.getElementById('sh-global-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'sh-global-toast';
      t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#11131c;color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;z-index:2147483647;box-shadow:0 8px 30px rgba(0,0,0,0.28);font-family:Poppins,sans-serif;pointer-events:none;opacity:0;transition:opacity .25s ease;text-align:center;max-width:90vw;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.style.opacity = '0'; }, 2400);
  }
  window.showGlobalToast = showGlobalToast;

  // Global Search Keydown Listener
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const target = e.target;
      if (target && (target.id?.includes('search') || target.className?.includes('search') || target.placeholder?.toLowerCase().includes('search'))) {
        const q = (target.value || '').trim();
        if (q) {
          go(`category.html?search=${encodeURIComponent(q)}`);
        }
      }
    }
  });

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

    // Map legacy hash modals to direct dedicated pages
    if (h.includes('#about')) return 'about.html';
    if (h.includes('#contact')) return 'contact.html';
    if (h.includes('#support') || h.includes('#help')) return 'help.html';
    if (h.includes('#returns') || h.includes('#refund')) return 'returns.html';
    if (h.includes('#terms')) return 'terms.html';
    if (h.includes('#privacy')) return 'privacy.html';

    // Check hash or placeholder anchors
    if (h === '#' || h.startsWith('#')) {
      const hash = h.toLowerCase();
      if (hash === '#home' || t.includes('home')) return 'index.html';
      if (hash === '#categories' || hash === '#category' || t.includes('categor')) return 'category.html';
      if (hash === '#orders' || hash === '#order' || t.includes('orders') || t === 'order' || t.includes('my orders') || t.includes('track order')) return 'orders.html';
      if (hash === '#wishlist' || t.includes('wishlist')) return 'index.html#wishlist';
      if (hash === '#account' || hash === '#profile' || t.includes('account') || t.includes('profile')) return 'account.html';
      if (hash === '#addresses' || hash === '#address' || t.includes('address')) return 'address.html';
      if (hash === '#payments' || hash === '#payment' || t.includes('payment')) return 'checkout.html';
      if (hash === '#checkout' || t.includes('checkout')) return 'checkout.html';
      if (hash === '#shop' || t.includes('shop now') || t.includes('shop collection')) return 'category.html';
      if (hash === '#all-products' || t.includes('view all')) return 'category.html';
      if (hash === '#deals' || t.includes('deals')) return 'category.html?cat=deals';
      if (hash === '#new-arrivals' || t.includes('new arrival')) return 'category.html?cat=new';
      if (hash === '#about' || hash === '#about-us' || t.includes('about us') || t.includes('about starhub') || t === 'about') return 'about.html';
      if (hash === '#contact' || t.includes('contact us') || t.includes('contact') || t.includes('need help?')) return 'contact.html';
      if (hash === '#support' || hash === '#help' || t.includes('help & support') || t.includes('help center') || t.includes('24/7 support') || t.includes('support') || t === 'help') return 'help.html';
      if (hash === '#returns' || t.includes('returns & refunds') || t.includes('returns & exchange') || t.includes('easy returns') || t.includes('return')) return 'returns.html';
      if (hash === '#terms' || t.includes('terms & conditions') || t.includes('terms of service') || t.includes('terms')) return 'terms.html';
      if (hash === '#privacy' || t.includes('privacy policy') || t.includes('privacy')) return 'privacy.html';
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
    const row = e.target.closest('.menu-row, .menu-item, .nav-feature-item, .feature-col');
    const interactive = btn || a || row || e.target.closest('.category-card, .nav-node, .action-item');

    // Visual ripple feedback on click
    if (interactive) {
      spawnRipple(e, interactive);
    }

    // Special menu-row / feature item clicks (even if not an anchor tag)
    if (row && !a && !btn) {
      const rowTxt = (row.textContent || '').toLowerCase().trim();
      if (rowTxt.includes('order')) {
        e.preventDefault(); e.stopPropagation(); go('orders.html'); return;
      }
      if (rowTxt.includes('help & support') || rowTxt.includes('help center') || rowTxt.includes('24/7 support')) {
        e.preventDefault(); e.stopPropagation(); go('help.html'); return;
      }
      if (rowTxt.includes('about us') || rowTxt.includes('about')) {
        e.preventDefault(); e.stopPropagation(); go('about.html'); return;
      }
      if (rowTxt.includes('contact us') || rowTxt.includes('contact')) {
        e.preventDefault(); e.stopPropagation(); go('contact.html'); return;
      }
      if (rowTxt.includes('returns & refunds') || rowTxt.includes('easy returns') || rowTxt.includes('return')) {
        e.preventDefault(); e.stopPropagation(); go('returns.html'); return;
      }
      if (rowTxt.includes('terms & conditions') || rowTxt.includes('terms of service') || rowTxt.includes('terms')) {
        e.preventDefault(); e.stopPropagation(); go('terms.html'); return;
      }
      if (rowTxt.includes('privacy policy') || rowTxt.includes('privacy')) {
        e.preventDefault(); e.stopPropagation(); go('privacy.html'); return;
      }
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
      if (aria === 'menu' || cls.includes('mobile-menu-btn') || cls.includes('menu-trigger-btn') || cls.includes('btn-menu')) {
        e.preventDefault();
        e.stopPropagation();
        openMenu();
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

      // Back button with preserved router history & valid fallback routes
      if (aria === 'back' || cls.includes('back-btn') || cls.includes('sh-circular-back') || btn.id === 'backBtn' || btn.classList.contains('head-btn')) {
        const oc = btn.getAttribute('onclick') || '';
        if (oc && (oc.includes('close') || oc.includes('toggle'))) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        handleGlobalBackNavigation();
        return;
      }

      // Buy Now buttons
      if (cls.includes('btn-buy-now-d') || cls.includes('pdp-btn-buy')) {
        e.preventDefault();
        e.stopPropagation();
        go('checkout.html');
        return;
      }

      // Newsletter Subscribe button
      if (cls.includes('subscribe-btn') || (btn.textContent || '').trim().toLowerCase() === 'subscribe') {
        e.preventDefault();
        e.stopPropagation();
        const input = btn.parentElement ? btn.parentElement.querySelector('input') : null;
        if (input && input.value) input.value = '';
        showGlobalToast('Thank you for subscribing to STARHUB updates!');
        return;
      }

      // "Buy Again" button on order cards
      if (cls.includes('order-btn') || (btn.textContent || '').trim().toLowerCase() === 'buy again' || btn.dataset.action === 'Buy Again') {
        e.preventDefault();
        e.stopPropagation();
        const card = btn.closest('.order-item, .card, .history-card, tr, li');
        const title = card ? (card.querySelector('.title, .item-title, h4, h3, .product-title')?.textContent?.trim() || "Men's Premium Shirt") : "Men's Premium Shirt";
        const priceText = card ? (card.querySelector('.price, .item-price, .amount')?.textContent?.replace(/[^\d.]/g, '') || "899") : "899";
        const price = parseFloat(priceText) || 899;
        const img = card?.querySelector('img')?.src || 'assets/orders/shirt.jpg';
        try {
          let cart = JSON.parse(localStorage.getItem('xpord_cart') || '[]');
          cart.push({
            id: 'item-' + Date.now(),
            title: title,
            price: price,
            image: img,
            size: 'L',
            quantity: 1
          });
          localStorage.setItem('xpord_cart', JSON.stringify(cart));
          const u = JSON.parse(localStorage.getItem('xpord_user') || '{}');
          if (u.uid) localStorage.setItem('xpord_cart_' + u.uid, JSON.stringify(cart));
        } catch(err) {}
        showGlobalToast(`Added "${title}" to cart!`);
        setTimeout(() => { go('cart.html'); }, 600);
        return;
      }

      // Edit Profile button
      if (cls.includes('edit-btn') || (btn.textContent || '').trim().toLowerCase().includes('edit profile')) {
        e.preventDefault();
        e.stopPropagation();
        const currentName = document.querySelector('.profile-name, .user-name-display')?.textContent?.trim() || 'Member';
        const newName = prompt('Enter your name:', currentName);
        if (newName && newName.trim()) {
          try {
            const u = JSON.parse(localStorage.getItem('xpord_user') || '{}');
            u.name = newName.trim();
            u.displayName = newName.trim();
            localStorage.setItem('xpord_user', JSON.stringify(u));
            hydrateUser();
            showGlobalToast('Profile name updated!');
          } catch(err) {}
        }
        return;
      }

      // Catalog / Category Add-to-cart buttons
      if (cls.includes('add-cart-btn') || cls.includes('catalog-add-btn') || cls.includes('btn-add-cart-d')) {
        e.preventDefault();
        e.stopPropagation();
        const card = btn.closest('.product-card, .card, .product-box, .product-item');
        const title = card ? (card.querySelector('.product-title, .title, h3, h4')?.textContent?.trim() || "Men's Casual Shirt") : "Men's Casual Shirt";
        const priceText = card ? (card.querySelector('.price, .current-price, .item-price')?.textContent?.replace(/[^\d.]/g, '') || "999") : "999";
        const price = parseFloat(priceText) || 999;
        const img = card?.querySelector('img')?.src || 'assets/orders/shirt.jpg';
        try {
          let cart = JSON.parse(localStorage.getItem('xpord_cart') || '[]');
          const prodId = 'prod-' + title.toLowerCase().replace(/[^a-z0-9]/g, '-');
          const existing = cart.find(i => i.id === prodId || i.title === title);
          if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
          } else {
            cart.push({
              id: prodId,
              title: title,
              price: price,
              image: img,
              size: 'M',
              quantity: 1
            });
          }
          localStorage.setItem('xpord_cart', JSON.stringify(cart));
          const u = JSON.parse(localStorage.getItem('xpord_user') || '{}');
          if (u.uid) localStorage.setItem('xpord_cart_' + u.uid, JSON.stringify(cart));
        } catch(err) {}
        setupBottomNav();
        showGlobalToast(`Added "${title}" to cart!`);
        return;
      }
    }

    // View All links or buttons
    const viewAll = e.target.closest('.view-all-link, .btn-view-all, [data-action="view-all"]');
    if (viewAll) {
      e.preventDefault();
      e.stopPropagation();
      go('category.html');
      return;
    }

    // C. Universal Bottom Navigation Items Delegation
    const navItem = e.target.closest('.tab-item, .nav-node, .nav-link, .mob-nav-item, .sh-nav-btn, [data-nav-target]');
    if (navItem) {
      e.preventDefault();
      e.stopPropagation();
      const txt = (navItem.textContent || '').toLowerCase().trim();
      const targetAttr = navItem.getAttribute('data-nav-target');
      
      if (targetAttr) {
        go(targetAttr);
        return;
      }

      if (txt.includes('home')) {
        go('index.html');
      } else if (txt.includes('categor')) {
        go('category.html');
      } else if (txt.includes('wishlist')) {
        go('index.html#wishlist');
      } else if (txt.includes('cart') || txt.includes('bag')) {
        go('cart.html');
      } else if (txt.includes('account') || txt.includes('profile')) {
        go('account.html');
      } else if (txt.includes('deal')) {
        go('category.html?cat=deals');
      }
      return;
    }
  }, { capture: false, passive: false });

  // 7. Universal Bottom Nav Hydrator & Active Tab Highlighter
  // 7. GlobalBottomNavigation Component (Exact user approved design & switching logic)
  function getActiveNavigationTab() {
    const rawPath = window.location.pathname.toLowerCase();
    const fileName = (rawPath.split("/").pop() || "index.html").toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();

    if (hash.includes("wishlist") || search.includes("wishlist")) {
      return "wishlist";
    }
    if (fileName.includes("category")) {
      return "categories";
    }
    if (fileName.includes("cart")) {
      return "cart";
    }
    if (fileName.includes("account") || fileName.includes("login") || fileName.includes("signup") || fileName.includes("order")) {
      return "account";
    }
    if (fileName.includes("index") || fileName.includes("home") || fileName === "" || fileName === "index.html") {
      return "home";
    }
    return "home";
  }

  function getBadgesState() {
    let cartCount = 0;
    let wishCount = 0;
    try {
      const rawUser = localStorage.getItem("xpord_user");
      const u = rawUser ? JSON.parse(rawUser) : null;
      const uid = u && (u.uid || u.id);

      const cartData = (uid ? localStorage.getItem("xpord_cart_" + uid) : null) || localStorage.getItem("xpord_cart") || "[]";
      const cart = JSON.parse(cartData);
      if (Array.isArray(cart)) {
        cartCount = cart.reduce((sum, item) => sum + (Number(item.quantity || item.qty) || 1), 0);
      }

      const wishData = (uid ? localStorage.getItem("xpord_wishlist_" + uid) : null) || localStorage.getItem("xpord_wishlist") || "[]";
      const wish = JSON.parse(wishData);
      if (Array.isArray(wish)) {
        wishCount = wish.length;
      }
    } catch(e) {}
    return { cartCount, wishCount };
  }

  function purgeDuplicateBottomNavs() {
    const duplicates = document.querySelectorAll(
      ".bottom-nav:not(#GlobalBottomNavigation), .tab-bar:not(#GlobalBottomNavigation), .mobile-bottom-nav:not(#GlobalBottomNavigation), .bottom-navbar:not(#GlobalBottomNavigation), #sh-universal-bottom-nav:not(#GlobalBottomNavigation)"
    );
    duplicates.forEach(el => el.remove());
  }

  function moveNavIndicator(item) {
    const bottomNav = document.getElementById("GlobalBottomNavigation");
    if (!bottomNav || !item) return;
    const navRect = bottomNav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    if (navRect.width > 0 && itemRect.width > 0) {
      bottomNav.style.setProperty("--active-left", (itemRect.left - navRect.left) + "px");
      bottomNav.style.setProperty("--active-width", itemRect.width + "px");
    }
  }

  function setActiveNav(item) {
    const bottomNav = document.getElementById("GlobalBottomNavigation");
    if (!bottomNav) return;
    const navItems = Array.from(bottomNav.querySelectorAll(".navitem"));
    navItems.forEach(btn => {
      const active = (btn === item);
      btn.classList.toggle("selected", active);
      if (active) {
        btn.setAttribute("aria-current", "page");
      } else {
        btn.removeAttribute("aria-current");
      }
    });
    moveNavIndicator(item);
  }

  function mountGlobalBottomNavigation() {
    purgeDuplicateBottomNavs();

    const activeTab = getActiveNavigationTab();
    const { cartCount, wishCount } = getBadgesState();

    let nav = document.getElementById("GlobalBottomNavigation");
    if (!nav) {
      nav = document.createElement("nav");
      nav.id = "GlobalBottomNavigation";
      nav.className = "bottomnav";
      nav.setAttribute("aria-label", "Main navigation");
      document.body.appendChild(nav);
    } else if (nav.parentElement !== document.body) {
      document.body.appendChild(nav);
    }

    let gesture = document.getElementById("GlobalBottomGesture");
    if (!gesture) {
      gesture = document.createElement("div");
      gesture.id = "GlobalBottomGesture";
      gesture.className = "gesture";
      document.body.appendChild(gesture);
    }

    const tabIndexMap = {
      home: 0,
      categories: 1,
      wishlist: 2,
      cart: 3,
      account: 4
    };
    const activeIdx = tabIndexMap[activeTab] ?? 0;
    nav.style.setProperty("--active-left", `calc(${activeIdx * 20}% + 4px)`);
    nav.style.setProperty("--active-width", `calc(20% - 8px)`);

    nav.innerHTML = `
      <button class="navitem ${activeTab === 'home' ? 'selected' : ''}" data-action="Home" data-nav-target="index.html" ${activeTab === 'home' ? 'aria-current="page"' : ''}>
        <svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v11h-6v-7H9v7H3z"/></svg>
        <span>Home</span>
      </button>

      <button class="navitem ${activeTab === 'categories' ? 'selected' : ''}" data-action="Categories" data-nav-target="category.html" ${activeTab === 'categories' ? 'aria-current="page"' : ''}>
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        <span>Categories</span>
      </button>

      <button class="navitem ${activeTab === 'wishlist' ? 'selected' : ''}" data-action="Wishlist" data-nav-target="index.html#wishlist" ${activeTab === 'wishlist' ? 'aria-current="page"' : ''}>
        <span class="navicon">
          <svg viewBox="0 0 24 24"><path d="M20.8 4.8a5.4 5.4 0 0 0-7.6 0L12 6l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.4 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z"/></svg>
          <span class="navbadge" data-role="wishlist-badge" style="${wishCount > 0 ? '' : 'display:none;'}">${wishCount}</span>
        </span>
        <span>Wishlist</span>
      </button>

      <button class="navitem ${activeTab === 'cart' ? 'selected' : ''}" data-action="Cart" data-nav-target="cart.html" ${activeTab === 'cart' ? 'aria-current="page"' : ''}>
        <span class="navicon">
          <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M1 2h3l2.7 13.1a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L22 7H5"/></svg>
          <span class="navbadge stat-number-cart" data-role="cart-badge" style="${cartCount > 0 ? '' : 'display:none;'}">${cartCount}</span>
        </span>
        <span>Cart</span>
      </button>

      <button class="navitem ${activeTab === 'account' ? 'selected' : ''}" data-action="Account" data-nav-target="account.html" ${activeTab === 'account' ? 'aria-current="page"' : ''}>
        <svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2z" fill="currentColor" stroke="none"/></svg>
        <span>Account</span>
      </button>
    `;

    // Position sliding indicator pill initially
    requestAnimationFrame(() => {
      const selectedItem = nav.querySelector(".navitem.selected") || nav.querySelector(".navitem");
      if (selectedItem) {
        moveNavIndicator(selectedItem);
      }
    });

    // Attach click events
    nav.querySelectorAll(".navitem").forEach(item => {
      item.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();

        setActiveNav(item);

        const target = item.getAttribute("data-nav-target");
        if (!target) return;

        const curFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
        const curHash = window.location.hash.toLowerCase();
        const isCurrent = 
          (target === "index.html" && (curFile === "index.html" || curFile === "home-mobile.html" || curFile === "home-desktop.html") && !curHash) ||
          (target === "category.html" && (curFile === "category.html" || curFile === "category-mobile.html" || curFile === "category-desktop.html")) ||
          (target === "cart.html" && (curFile === "cart.html" || curFile === "cart-mobile.html" || curFile === "cart-desktop.html")) ||
          (target === "account.html" && (curFile === "account.html" || curFile === "account-mobile.html" || curFile === "account-desktop.html"));

        if (isCurrent) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        go(target);
      });
    });
  }

  function updateGlobalBadges() {
    const { cartCount, wishCount } = getBadgesState();
    const nav = document.getElementById("GlobalBottomNavigation");
    if (nav) {
      const cartBadge = nav.querySelector("[data-role=\"cart-badge\"]");
      if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? "flex" : "none";
      }

      const wishBadge = nav.querySelector("[data-role=\"wishlist-badge\"]");
      if (wishBadge) {
        wishBadge.textContent = wishCount;
        wishBadge.style.display = wishCount > 0 ? "flex" : "none";
      }
    }
  }

  // 8. Reusable Global Back Button Component (Exact Circular Design matching user screenshot)
  const BACK_ARROW_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#171717" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block;margin:auto;"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';

  function handleGlobalBackNavigation(fallbackUrl) {
    if (window.history.length > 1 && document.referrer && (document.referrer.includes(window.location.host) || !document.referrer.startsWith('http'))) {
      window.history.back();
    } else if (fallbackUrl) {
      if (window.styleHubGo) window.styleHubGo(fallbackUrl);
      else window.location.href = fallbackUrl;
    } else {
      const cur = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
      let target = 'index.html';
      if (cur.includes('product')) target = 'category.html';
      else if (cur.includes('checkout') || cur.includes('address')) target = 'cart.html';
      else if (cur.includes('orders')) target = 'account.html';
      else target = 'index.html';

      if (window.styleHubGo) window.styleHubGo(target);
      else window.location.href = target;
    }
  }
  window.handleGlobalBack = handleGlobalBackNavigation;

  function hydrateBackButtons() {
    const buttons = document.querySelectorAll(
      '.back-btn, #backBtn, button[aria-label="Back"], button[data-role="back-btn"], .head-btn#backBtn, .detail-back-btn, .pdp-mobile-back-btn, .sh-circular-back'
    );

    buttons.forEach(btn => {
      btn.classList.add('back-btn', 'sh-circular-back');
      btn.setAttribute('aria-label', 'Back');
      btn.innerHTML = BACK_ARROW_SVG;

      // Remove any leftover text child nodes
      Array.from(btn.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.remove();
        }
      });

      if (!btn.hasAttribute('data-back-bound')) {
        btn.setAttribute('data-back-bound', 'true');
        btn.addEventListener('click', function(e) {
          const oc = btn.getAttribute('onclick') || '';
          if (oc && (oc.includes('close') || oc.includes('toggle'))) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          handleGlobalBackNavigation();
        });
      }
    });
  }

  // Reusable BackButton Component API
  window.StyleHubBackButton = {
    render: function(targetContainer, options = {}) {
      const container = typeof targetContainer === 'string' ? document.querySelector(targetContainer) : targetContainer;
      if (!container) return null;
      let btn = container.querySelector('.back-btn, #backBtn');
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'back-btn sh-circular-back';
        btn.setAttribute('aria-label', options.ariaLabel || 'Back');
        if (options.id) btn.id = options.id;
        if (container.firstChild) {
          container.insertBefore(btn, container.firstChild);
        } else {
          container.appendChild(btn);
        }
      }
      btn.innerHTML = BACK_ARROW_SVG;
      btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof options.onClick === 'function') {
          options.onClick(e);
        } else {
          handleGlobalBackNavigation(options.fallbackUrl);
        }
      };
      return btn;
    },
    goBack: handleGlobalBackNavigation,
    hydrate: hydrateBackButtons
  };
  window.BackButton = window.StyleHubBackButton;

  // Global Singleton Export for Bottom Navigation
  window.GlobalBottomNavigation = {
    mount: mountGlobalBottomNavigation,
    updateBadges: updateGlobalBadges,
    purgeDuplicates: purgeDuplicateBottomNavs,
    setActive: setActiveNav,
    refresh: function() {
      mountGlobalBottomNavigation();
      updateGlobalBadges();
    }
  };

  function setupBottomNav() {
    mountGlobalBottomNavigation();
  }
  window.setupBottomNav = setupBottomNav;

  // Real-time synchronization & Hydration
  window.addEventListener("storage", function(e) {
    updateGlobalBadges();
    if (e.key === 'stylehub-theme' && e.newValue) {
      applyGlobalTheme(e.newValue, false);
    }
  });
  window.addEventListener("DOMContentLoaded", function() {
    hydrateBackButtons();
    hydrateThemeToggles();
  });
  window.addEventListener("load", function() {
    hydrateBackButtons();
    hydrateThemeToggles();
    const nav = document.getElementById("GlobalBottomNavigation");
    if (nav) {
      const selected = nav.querySelector(".navitem.selected");
      if (selected) moveNavIndicator(selected);
    }
  });
  window.addEventListener("pageshow", function() {
    hydrateBackButtons();
    hydrateThemeToggles();
    mountGlobalBottomNavigation();
    updateGlobalBadges();
  });
  window.addEventListener("resize", function() {
    const nav = document.getElementById("GlobalBottomNavigation");
    if (nav) {
      const selected = nav.querySelector(".navitem.selected");
      if (selected) moveNavIndicator(selected);
    }
  });
  window.addEventListener("popstate", function() {
    hydrateBackButtons();
    hydrateThemeToggles();
    mountGlobalBottomNavigation();
  });
  window.addEventListener("hashchange", function() {
    hydrateBackButtons();
    hydrateThemeToggles();
    mountGlobalBottomNavigation();
  });

})();
