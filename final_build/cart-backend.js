import { auth, db, onAuthStateChanged, signOut, handleFirestoreError } from './src/firebase.js';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';

/**
 * StyleHub Real Firestore Cart Engine (Premium Luxe Edition)
 * Synchronizes real cart items, quantities, coupons, and user sessions in real time with Cloud Firestore.
 */

export const DEFAULT_CART_ITEMS = [];

// Active State
let currentCartItems = [];
let appliedCoupon = null;
let activeUserId = null;
let activeUserEmail = null;
let unsubscribeCartSnapshot = null;
let isUpdatingFirestore = false;

function getGuestId() {
  try {
    let gid = localStorage.getItem('stylehub_guest_cart_id');
    if (!gid) {
      gid = 'guest_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem('stylehub_guest_cart_id', gid);
    }
    return gid;
  } catch (e) {
    return 'guest_default';
  }
}

function userDocKey(user) {
  if (user?.uid) return user.uid;
  if (user?.email) return user.email.replace(/[^a-zA-Z0-9]/g, '_');
  try {
    const savedUser = JSON.parse(localStorage.getItem('xpord_user') || 'null');
    if (savedUser?.uid) return savedUser.uid;
    if (savedUser?.email) return savedUser.email.replace(/[^a-zA-Z0-9]/g, '_');
  } catch (e) {}
  return getGuestId();
}

function showToast(msg) {
  const t = document.getElementById('toast') || document.getElementById('toast-msg');
  if (t) {
    t.textContent = msg;
    t.style.display = 'block';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
      t.style.display = 'none';
    }, 2500);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Ensure default verified coupons exist in Firestore
async function seedCouponsIfMissing() {
  if (!db) return;
  const verifiedCoupons = [
    { id: "STYLEHUB20", code: "STYLEHUB20", discountPercent: 20, minOrder: 500, active: true, description: "20% off on all apparel" },
    { id: "STYLE10", code: "STYLE10", discountPercent: 10, minOrder: 0, active: true, description: "10% off your subtotal" },
    { id: "FIRST50", code: "FIRST50", discountPercent: 50, maxDiscount: 500, minOrder: 999, active: true, description: "50% off on first order up to ₹500" },
    { id: "WELCOME10", code: "WELCOME10", discountPercent: 10, minOrder: 0, active: true, description: "10% Welcome Discount" },
    { id: "XPORD20", code: "XPORD20", discountPercent: 20, minOrder: 500, active: true, description: "20% Exclusive Discount" }
  ];

  for (const c of verifiedCoupons) {
    try {
      const snap = await getDoc(doc(db, 'coupons', c.id));
      if (!snap.exists()) {
        await setDoc(doc(db, 'coupons', c.id), c);
      }
    } catch (e) {}
  }
}

// Synchronize state with both Firestore & LocalStorage
export async function syncCartToFirestore(items, coupon = appliedCoupon) {
  if (isUpdatingFirestore) return;
  isUpdatingFirestore = true;

  try {
    const cartId = activeUserId || getGuestId();
    const totalQty = items.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * (Number(item.qty) || 1)), 0);

    let discountAmount = 0;
    if (coupon) {
      if (coupon.discountPercent) {
        discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else if (coupon.discountAmount) {
        discountAmount = Number(coupon.discountAmount) || 0;
      }
    }
    const delivery = subtotal === 0 || subtotal >= 2000 ? 0 : 99;
    const finalTotal = Math.max(0, subtotal - discountAmount + delivery);

    // 1. Save to LocalStorage for offline and multi-page sync
    try {
      const storageItems = items.map(i => ({
        id: i.id,
        productId: i.productId || i.id,
        title: i.title,
        price: i.price,
        quantity: i.qty,
        qty: i.qty,
        image: i.image,
        specs: i.specs,
        size: i.specs ? i.specs.split('/')[0]?.trim() : 'M',
        color: i.specs ? i.specs.split('/')[1]?.trim() : ''
      }));
      localStorage.setItem('xpord_cart', JSON.stringify(storageItems));
      if (activeUserId && !activeUserId.startsWith('guest_')) {
        localStorage.setItem(`xpord_cart_${activeUserId}`, JSON.stringify(storageItems));
      }
    } catch (e) {}

    // 2. Persist to Firestore carts collection
    if (db) {
      const payload = {
        id: cartId,
        userId: activeUserId || cartId,
        userEmail: activeUserEmail || '',
        items: items.map(i => ({
          id: i.id,
          productId: i.productId || i.id,
          title: i.title,
          price: Number(i.price),
          qty: Number(i.qty) || 1,
          specs: i.specs || '',
          image: i.image || '',
          stock: i.stock || 'In Stock'
        })),
        itemCount: totalQty,
        subtotal: subtotal,
        discount: discountAmount,
        couponCode: coupon?.code || '',
        delivery: delivery,
        total: finalTotal,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'carts', cartId), payload, { merge: true });

      // Mirror to users collection if authenticated
      if (activeUserId && !activeUserId.startsWith('guest_')) {
        try {
          await setDoc(doc(db, 'users', activeUserId), {
            cart: payload.items,
            lastCartTotal: finalTotal,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (ue) {}
      }
    }
  } catch (err) {
    handleFirestoreError(err, 'write', 'carts');
  } finally {
    isUpdatingFirestore = false;
  }
}

// Generate HTML for cart item cards matching StyleHub Luxe Redesign
function renderCartItemsHtml(items) {
  return items.map(item => {
    const unitPrice = Number(item.price) || 0;
    const oldPrice = Number(item.oldPrice || item.old || Math.round(unitPrice * 1.25));
    const savingsAmount = Math.max(0, oldPrice - unitPrice);
    const savingsPercent = oldPrice > unitPrice ? Math.round((savingsAmount / oldPrice) * 100) : 0;
    const title = item.title || "Men's Apparel";
    const specs = item.specs || 'Size: M';
    const category = item.category || "MEN'S FASHION";
    const img = item.image || 'assets/shirt.jpg';

    return `
      <article class="cart-item" data-id="${item.id}">
        <div class="product-visual">
          <img src="${img}" alt="${escapeHtml(title)}" onerror="this.src='assets/shirt.jpg'" />
        </div>
        <div class="item-info">
          <div class="item-top">
            <div>
              <div class="category">${escapeHtml(category)}</div>
              <div class="item-title">${escapeHtml(title)}</div>
              <div class="item-meta">
                <span>${escapeHtml(specs)}</span>
                <span class="swatch"></span>
              </div>
            </div>
            <button class="remove" aria-label="Remove item" onclick="window.StyleHubCart ? window.StyleHubCart.removeItem('${item.id}') : removeItem('${item.id}')" title="Remove item">
              <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2m-10 0 1 14h10l1-14M10 10v6m4-6v6"/></svg>
            </button>
          </div>
          <div class="item-bottom">
            <div>
              <div class="priceblock">
                <span class="price">₹${unitPrice.toLocaleString('en-IN')}</span>
                ${oldPrice > unitPrice ? `<span class="oldprice">₹${oldPrice.toLocaleString('en-IN')}</span>` : ''}
              </div>
              ${savingsAmount > 0 ? `<div class="discount">Save ₹${savingsAmount.toLocaleString('en-IN')} (${savingsPercent}%)</div>` : ''}
            </div>
            <div class="qty">
              <button onclick="window.StyleHubCart ? window.StyleHubCart.changeQty('${item.id}', -1) : changeQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
              <span>${item.qty}</span>
              <button onclick="window.StyleHubCart ? window.StyleHubCart.changeQty('${item.id}', 1) : changeQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Master Render Function supporting new StyleHub Luxe Redesign as well as backward compatibility
export function renderCart() {
  const items = currentCartItems;
  const listEl = document.getElementById('cartList') || document.getElementById('cart-items-list') || document.getElementById('desktop-cart-rows');
  const activeLayout = document.getElementById('activeLayout') || document.getElementById('active-cart-view') || document.getElementById('cart-active-container') || document.querySelector('.layout');
  const emptyEl = document.getElementById('empty') || document.getElementById('empty-cart-view') || document.getElementById('cart-empty-container');
  const progressBox = document.getElementById('progressbox') || document.querySelector('.progressbox');

  const totalQty = items.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * (Number(item.qty) || 1)), 0);

  const oldSubtotal = items.reduce((sum, item) => {
    const oldPrice = Number(item.oldPrice || item.old || Math.round(Number(item.price) * 1.25));
    return sum + (oldPrice * (Number(item.qty) || 1));
  }, 0);
  const totalSavings = Math.max(0, oldSubtotal - subtotal);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.discountAmount) {
      discount = Number(appliedCoupon.discountAmount) || 0;
    }
  }

  const deliveryThreshold = 2000;
  const delivery = subtotal === 0 || subtotal >= deliveryThreshold ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discount + delivery);

  // Update header badges
  const headerCount = document.getElementById('headerCount');
  const cartBadge = document.getElementById('cart-badge');
  const navCartBadge = document.getElementById('nav-cart-badge');
  const headerCartBadge = document.getElementById('header-cart-badge');
  if (headerCount) headerCount.textContent = totalQty;
  if (cartBadge) cartBadge.textContent = totalQty;
  if (navCartBadge) navCartBadge.textContent = totalQty;
  if (headerCartBadge) headerCartBadge.textContent = totalQty;

  // Hero titles & counts
  const heroCount = document.getElementById('heroCount');
  const dHeroCount = document.getElementById('d-heroCount');
  const cartHeading = document.getElementById('cart-heading');
  const cartHeadingD = document.getElementById('cart-heading-d');
  const heroText = `${totalQty} item${totalQty === 1 ? '' : 's'} in your bag`;
  if (heroCount) heroCount.textContent = heroText;
  if (dHeroCount) dHeroCount.textContent = heroText;
  if (cartHeading) cartHeading.textContent = 'Shopping Bag';
  if (cartHeadingD) cartHeadingD.textContent = 'Shopping Bag';

  // Section item count
  const itemCount = document.getElementById('itemCount');
  if (itemCount) itemCount.textContent = `(${totalQty})`;

  // Progress Bar for Free Delivery
  const progressText = document.getElementById('progressText');
  const progressAmount = document.getElementById('progressAmount');
  const progressFill = document.getElementById('progressFill');
  if (subtotal >= deliveryThreshold) {
    if (progressText) progressText.textContent = 'You’ve unlocked free delivery!';
    if (progressAmount) progressAmount.textContent = 'Unlocked ✓';
    if (progressFill) progressFill.style.width = '100%';
  } else if (subtotal > 0) {
    const diff = deliveryThreshold - subtotal;
    if (progressText) progressText.textContent = 'You’re close to free delivery!';
    if (progressAmount) progressAmount.textContent = `Add ₹${diff.toLocaleString('en-IN')} more`;
    if (progressFill) progressFill.style.width = `${Math.min(100, Math.round((subtotal / deliveryThreshold) * 100))}%`;
  } else {
    if (progressText) progressText.textContent = 'Add items to unlock free delivery!';
    if (progressAmount) progressAmount.textContent = `Add ₹${deliveryThreshold.toLocaleString('en-IN')} more`;
    if (progressFill) progressFill.style.width = '0%';
  }

  // Summary figures
  const summaryQty = document.getElementById('summaryQty') || document.getElementById('summary-items-count') || document.getElementById('d-summary-qty');
  const subtotalEl = document.getElementById('subtotal') || document.getElementById('summary-subtotal') || document.getElementById('d-summary-subtotal');
  const savingsEl = document.getElementById('savings') || document.getElementById('summary-savings');
  const savingsLine = document.getElementById('savingsLine');
  const couponDiscountEl = document.getElementById('couponDiscount') || document.getElementById('summary-discount') || document.getElementById('d-summary-discount');
  const deliveryEl = document.getElementById('delivery');
  const totalEl = document.getElementById('total') || document.getElementById('summary-total') || document.getElementById('d-summary-total');

  if (summaryQty) summaryQty.textContent = totalQty;
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (savingsEl) savingsEl.textContent = `−₹${totalSavings.toLocaleString('en-IN')}`;
  if (savingsLine) savingsLine.style.display = totalSavings > 0 ? 'flex' : 'none';
  if (couponDiscountEl) couponDiscountEl.textContent = `−₹${discount.toLocaleString('en-IN')}`;
  if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'FREE' : `₹${delivery}`;
  if (totalEl) totalEl.textContent = `₹${finalTotal.toLocaleString('en-IN')}`;

  // Empty vs active layout
  if (items.length === 0) {
    if (activeLayout) activeLayout.style.display = 'none';
    if (progressBox) progressBox.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'block';
  } else {
    if (activeLayout) activeLayout.style.display = window.innerWidth >= 650 ? 'grid' : 'block';
    if (progressBox) progressBox.style.display = 'block';
    if (emptyEl) emptyEl.style.display = 'none';
    if (listEl) listEl.innerHTML = renderCartItemsHtml(items);
  }
}

// Cart Item Mutators
export async function changeQty(id, delta) {
  const item = currentCartItems.find(x => x.id === id);
  if (!item) return;

  item.qty = Number(item.qty || 1) + Number(delta);
  if (item.qty <= 0) {
    currentCartItems = currentCartItems.filter(x => x.id !== id);
    showToast("Item removed from your bag");
  }

  renderCart();
  await syncCartToFirestore(currentCartItems, appliedCoupon);
}

export async function removeItem(id) {
  currentCartItems = currentCartItems.filter(x => x.id !== id);
  renderCart();
  showToast("Item removed from your bag");
  await syncCartToFirestore(currentCartItems, appliedCoupon);
}

export async function clearAll() {
  currentCartItems = [];
  appliedCoupon = null;
  const couponMsg = document.getElementById('couponMsg');
  if (couponMsg) couponMsg.style.display = 'none';
  const couponInput = document.getElementById('coupon') || document.getElementById('coupon-code-input');
  if (couponInput) couponInput.value = '';

  renderCart();
  showToast("Your bag is now empty");
  await syncCartToFirestore([], null);
}

// Real Firestore Coupon Logic
export async function applyCoupon(codeOverride) {
  const couponInput = document.getElementById('coupon') || document.getElementById('coupon-code-input') || document.getElementById('coupon-d-input');
  const couponMsg = document.getElementById('couponMsg');
  const rawCode = (codeOverride || couponInput?.value || '').trim().toUpperCase();

  if (!rawCode) {
    if (couponMsg) {
      couponMsg.style.display = 'block';
      couponMsg.style.color = '#d62e45';
      couponMsg.textContent = 'Please enter a promo code first.';
    }
    showToast("Please enter a promo code");
    return;
  }

  const subtotal = currentCartItems.reduce((sum, item) => sum + (Number(item.price) * (Number(item.qty) || 1)), 0);

  try {
    let couponData = null;
    if (db) {
      const snap = await getDoc(doc(db, 'coupons', rawCode));
      if (snap.exists()) {
        couponData = snap.data();
      }
    }

    if (!couponData) {
      const hardcodedFallbacks = {
        'STYLEHUB20': { code: 'STYLEHUB20', discountPercent: 20, minOrder: 500, description: "20% off on all apparel" },
        'STYLE10': { code: 'STYLE10', discountPercent: 10, minOrder: 0, description: "10% off your subtotal" },
        'XPORD20': { code: 'XPORD20', discountPercent: 20, minOrder: 500, description: "20% Exclusive Discount" },
        'WELCOME10': { code: 'WELCOME10', discountPercent: 10, minOrder: 0, description: "10% Welcome Discount" },
        'FIRST50': { code: 'FIRST50', discountPercent: 50, maxDiscount: 500, minOrder: 999, description: "50% off on first order up to ₹500" }
      };
      couponData = hardcodedFallbacks[rawCode] || null;
    }

    if (!couponData || couponData.active === false) {
      if (couponMsg) {
        couponMsg.style.display = 'block';
        couponMsg.style.color = '#d62e45';
        couponMsg.textContent = "That code isn't valid. Try STYLEHUB20 or STYLE10.";
      }
      showToast("Invalid promo code");
      return;
    }

    if (couponData.minOrder && subtotal < couponData.minOrder) {
      if (couponMsg) {
        couponMsg.style.display = 'block';
        couponMsg.style.color = '#d62e45';
        couponMsg.textContent = `Minimum order amount of ₹${couponData.minOrder} required.`;
      }
      showToast(`Minimum order ₹${couponData.minOrder} required`);
      return;
    }

    appliedCoupon = couponData;
    renderCart();

    if (couponMsg) {
      couponMsg.style.display = 'block';
      couponMsg.style.color = '#167947';
      couponMsg.textContent = `Success! ${rawCode} applied — ${couponData.discountPercent ? couponData.discountPercent + '% off' : 'discount applied'}.`;
    }
    showToast(`Promo code '${rawCode}' applied!`);
    await syncCartToFirestore(currentCartItems, appliedCoupon);
  } catch (err) {
    handleFirestoreError(err, 'get', 'coupons');
    showToast("Could not verify coupon");
  }
}

// User Logout Logic
export async function handleLogout() {
  try {
    if (auth) {
      await signOut(auth);
    }
  } catch (e) {}

  currentCartItems = [];
  appliedCoupon = null;

  try {
    localStorage.removeItem('xpord_user');
    localStorage.removeItem('xpord_cart');
    localStorage.removeItem('xpord_wishlist');
    localStorage.removeItem('xpord_shipping_address');
    localStorage.removeItem('xpord_orders');
    if (activeUserId) {
      localStorage.removeItem(`xpord_cart_${activeUserId}`);
    }
    sessionStorage.clear();
  } catch (e) {}

  const userBar = document.getElementById('user-display-name');
  if (userBar) userBar.textContent = 'Guest Shopper';

  const badges = ['cart-badge', 'nav-cart-badge', 'header-cart-badge', 'headerCount', 'wishlist-badge', 'nav-wish-badge', 'header-wish-badge'];
  badges.forEach(b => {
    const el = document.getElementById(b);
    if (el) el.textContent = '0';
  });

  renderCart();
  showToast("Logged out successfully. Cart cleared.");
}

export function proceedToCheckout() {
  if (currentCartItems.length === 0) {
    showToast("Your bag is empty. Add items to checkout.");
    return;
  }
  const user = auth?.currentUser || JSON.parse(localStorage.getItem('xpord_user') || 'null');
  if (!user || (!user.uid && !user.email)) {
    try {
      sessionStorage.setItem('checkout_flow_intent', JSON.stringify({ type: 'checkout_bag' }));
      localStorage.setItem('xpord_pending_checkout', 'true');
    } catch(e) {}
    showToast("Please log in to proceed to checkout.");
    setTimeout(() => {
      window.location.href = 'login.html?redirect=checkout.html';
    }, 350);
    return;
  }

  syncCartToFirestore(currentCartItems, appliedCoupon).finally(() => {
    if (window.styleHubGo) {
      window.styleHubGo('checkout.html');
    } else {
      window.location.href = 'checkout.html';
    }
  });
}

// Load cart data from Firestore
async function loadCartData(user) {
  const cartId = userDocKey(user);
  activeUserId = user?.uid || (user ? userDocKey(user) : getGuestId());
  activeUserEmail = user?.email || null;

  // Update User Bar in UI
  const userDisplayEl = document.getElementById('user-display-name');
  if (userDisplayEl) {
    if (user?.displayName) {
      userDisplayEl.textContent = `${user.displayName} (${user.email || ''})`;
    } else if (user?.email) {
      userDisplayEl.textContent = `${user.email.split('@')[0]} (${user.email})`;
    } else {
      try {
        const local = JSON.parse(localStorage.getItem('xpord_user') || 'null');
        if (local?.name || local?.email) {
          userDisplayEl.textContent = `${local.name || local.email.split('@')[0]}`;
        } else {
          userDisplayEl.innerHTML = `Guest Shopper · <a href="login.html?redirect=cart.html" style="color:#b9934d;text-decoration:underline;font-weight:700;">Sign in to sync</a>`;
        }
      } catch (e) {
        userDisplayEl.textContent = 'Guest Shopper';
      }
    }
  }

  // Cancel any prior listener
  if (unsubscribeCartSnapshot) {
    unsubscribeCartSnapshot();
    unsubscribeCartSnapshot = null;
  }

  let firestoreLoaded = false;

  if (db) {
    try {
      const cartSnap = await getDoc(doc(db, 'carts', cartId));
      if (cartSnap.exists()) {
        const data = cartSnap.data();
        if (Array.isArray(data.items) && data.items.length > 0) {
          currentCartItems = data.items.map((it, idx) => ({
            id: it.id || ('c' + idx),
            productId: it.productId || it.id || ('prod_' + idx),
            title: it.title || "Men's Apparel",
            specs: it.specs || 'Size: M',
            price: Number(it.price || 999),
            qty: Number(it.qty || it.quantity || 1),
            image: it.image || 'assets/shirt.jpg',
            stock: it.stock || 'In Stock'
          }));
          if (data.couponCode) {
            appliedCoupon = { code: data.couponCode, discountAmount: data.discount };
          }
          firestoreLoaded = true;
        }
      }
    } catch (e) {
      handleFirestoreError(e, 'get', `carts/${cartId}`);
    }

    // Set up Realtime onSnapshot listener
    try {
      unsubscribeCartSnapshot = onSnapshot(doc(db, 'carts', cartId), (snapshot) => {
        if (!isUpdatingFirestore && snapshot.exists()) {
          const remoteData = snapshot.data();
          if (Array.isArray(remoteData.items)) {
            currentCartItems = remoteData.items.map((it, idx) => ({
              id: it.id || ('c' + idx),
              productId: it.productId || it.id || ('prod_' + idx),
              title: it.title || "Men's Apparel",
              specs: it.specs || 'Size: M',
              price: Number(it.price || 999),
              qty: Number(it.qty || it.quantity || 1),
              image: it.image || 'assets/shirt.jpg',
              stock: it.stock || 'In Stock'
            }));
            renderCart();
          }
        }
      }, (err) => {
        handleFirestoreError(err, 'get', `carts/${cartId}`);
      });
    } catch (e) {}
  }

  // Fallback to LocalStorage
  if (!firestoreLoaded) {
    let localItems = null;
    try {
      const saved = JSON.parse(localStorage.getItem(`xpord_cart_${activeUserId}`) || localStorage.getItem('xpord_cart') || 'null');
      if (Array.isArray(saved) && saved.length > 0) {
        localItems = saved.map((s, idx) => ({
          id: s.id || ('c' + idx),
          productId: s.productId || s.id || ('prod_' + idx),
          title: s.title || s.product?.title || "Men's Apparel",
          specs: s.specs || ((s.size ? s.size : 'M') + (s.color ? ' / ' + s.color : '')),
          price: Number(s.price || s.product?.price || 1299),
          qty: Number(s.quantity || s.qty || 1),
          image: s.image || s.product?.image || 'assets/shirt.jpg',
          stock: s.stock || 'In Stock'
        }));
      }
    } catch (e) {}

    currentCartItems = localItems && localItems.length > 0 ? localItems : [];
    syncCartToFirestore(currentCartItems, appliedCoupon);
  }

  renderCart();
}

// Global window bridge
window.StyleHubCart = {
  changeQty,
  removeItem,
  clearAll,
  applyCoupon,
  handleLogout,
  proceedToCheckout,
  renderCart,
  syncCartToFirestore
};

// Aliases for inline HTML onclick calls
window.changeQty = changeQty;
window.removeItem = removeItem;
window.clearAll = clearAll;
window.clearAllCart = clearAll;
window.applyCoupon = applyCoupon;
window.applyCouponAction = applyCoupon;
window.applyCouponDesktop = applyCoupon;
window.changeQtyDesktop = changeQty;
window.removeDesktopItem = removeItem;
window.proceedToCheckout = proceedToCheckout;
window.proceedToCheckoutDesktop = proceedToCheckout;
window.handleLogout = handleLogout;

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  seedCouponsIfMissing().catch(() => {});

  if (auth) {
    onAuthStateChanged(auth, (user) => {
      loadCartData(user).catch(err => {
        console.warn("Cart init error:", err);
      });
    });
  } else {
    loadCartData(null).catch(() => {});
  }
});
