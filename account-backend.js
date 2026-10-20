import {auth, db, onAuthStateChanged, signOut, handleFirestoreError} from './src/firebase.js';
import {doc, getDoc, collection, onSnapshot, setDoc} from 'firebase/firestore';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const userDocId = u => (u?.email || u?.uid || 'guest').replace(/[^a-zA-Z0-9]/g, '_');
const localUser = () => {
  try { return JSON.parse(localStorage.getItem('xpord_user') || 'null'); } catch { return null; }
};

let stopUser = null, stopOrders = null;

function setText(selector, text) {
  document.querySelectorAll(selector).forEach(e => { e.textContent = text || ''; });
}

export function handleBuyAgain(productTitle, price, image) {
  const item = {
    id: 'c_' + Date.now(),
    productId: 'prod_' + Math.random().toString(36).substring(2, 8),
    title: productTitle || "Men's Apparel",
    specs: "Standard / L",
    price: Number(price) || 999,
    qty: 1,
    quantity: 1,
    image: image || 'assets/orders/shirt.jpg',
    stock: "In Stock"
  };

  try {
    const cart = JSON.parse(localStorage.getItem('xpord_cart') || '[]');
    cart.push(item);
    localStorage.setItem('xpord_cart', JSON.stringify(cart));
    const u = localUser();
    if (u?.uid) {
      localStorage.setItem(`xpord_cart_${u.uid}`, JSON.stringify(cart));
    }
  } catch(e) {}

  if (window.showToast) {
    window.showToast(`Added "${productTitle}" to cart!`);
  } else {
    alert(`Added "${productTitle}" to cart!`);
  }
  updateBadges(localUser());
}
window.handleBuyAgain = handleBuyAgain;

function updateBadges(user) {
  const uid = user?.uid;
  let cartCount = 0;
  let wishCount = 0;
  try {
    const cart = JSON.parse(localStorage.getItem(uid ? `xpord_cart_${uid}` : 'xpord_cart') || localStorage.getItem('xpord_cart') || '[]');
    cartCount = cart.reduce((sum, item) => sum + (Number(item.qty || item.quantity) || 1), 0);
  } catch(e) {}

  try {
    const wish = JSON.parse(localStorage.getItem(uid ? `xpord_wishlist_${uid}` : 'xpord_wishlist') || localStorage.getItem('xpord_wishlist') || '[]');
    wishCount = wish.length;
  } catch(e) {}

  setText('#header-cart-badge', String(cartCount));
  setText('#header-wish-badge', String(wishCount));
  setText('#nav-cart-badge', String(cartCount));
  setText('#nav-wish-badge', String(wishCount));
  setText('.stat-number-cart', String(cartCount));
  setText('.stat-number-wishlist', String(wishCount));
  if (typeof window !== 'undefined' && window.GlobalBottomNavigation && window.GlobalBottomNavigation.updateBadges) {
    window.GlobalBottomNavigation.updateBadges();
  }
}

function renderGuestOrdersState() {
  const container = document.getElementById('acc-orders-list') || document.querySelector('.order-cards-list');
  if (!container) return;
  container.innerHTML = `
    <div class="empty-guest-orders-box">
      <div class="empty-guest-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c59b27" stroke-width="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      </div>
      <div class="empty-guest-title">Please Log In</div>
      <div class="empty-guest-sub">Sign in to view your placed orders, delivery status & live tracking.</div>
      <a href="login.html?redirect=account.html" class="empty-guest-btn">Log In to View Orders</a>
    </div>
  `;
}

function renderNoOrdersState() {
  const container = document.getElementById('acc-orders-list') || document.querySelector('.order-cards-list');
  if (!container) return;
  container.innerHTML = `
    <div class="empty-guest-orders-box">
      <div class="empty-guest-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c59b27" stroke-width="2">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      </div>
      <div class="empty-guest-title">No Orders Yet</div>
      <div class="empty-guest-sub">You have not placed any orders yet. Start exploring our latest collections!</div>
      <a href="index.html" class="empty-guest-btn">Start Shopping</a>
    </div>
  `;
}

function paintLoggedOutState() {
  setText('.profile-name', '');
  setText('.profile-email', '');
  setText('.user-name-display', '');
  setText('.user-email-display', '');
  setText('.name', '');
  setText('.email', '');
  setText('.stat-number-orders', '0');

  // Profile Header: Show Login button, NO personal name, NO email, NO member crown badge
  const metaContainers = document.querySelectorAll('.profile-meta-stack, #profileMetaStack');
  metaContainers.forEach(el => {
    el.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:flex-start; gap:4px;">
        <a href="login.html?redirect=account.html" class="profile-auth-action-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
          <span>Log In / Sign Up</span>
        </a>
        <div class="profile-guest-subtext">Sign in to view orders & member perks</div>
      </div>
    `;
  });

  // Avatar: Neutral silhouette
  document.querySelectorAll('.avatar, .avatar-ring-container').forEach(a => {
    a.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    `;
  });

  // Hide Edit Profile button when not logged in
  document.querySelectorAll('.btn-edit-profile-action, #accEditProfileBtn').forEach(b => {
    b.style.display = 'none';
  });

  // Recent Orders: show guest prompt
  renderGuestOrdersState();
  updateBadges(null);
}

function paintLoggedInProfile(u, data = {}) {
  const name = u.displayName || data.name || (u.email ? u.email.split('@')[0] : 'StyleHub Member');
  const email = u.email || data.email || '';
  const photo = u.photoURL || data.photoURL || '';

  // Profile Header: User Name, Email, Member Crown Badge
  const metaContainers = document.querySelectorAll('.profile-meta-stack, #profileMetaStack');
  metaContainers.forEach(el => {
    el.innerHTML = `
      <div class="user-name-title profile-name user-name-display name">${esc(name)}</div>
      <div class="user-email-text profile-email user-email-display email">${esc(email)}</div>
      <div class="member-badge-line">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
        </svg>
        <span>StyleHub Member</span>
      </div>
    `;
  });

  // Avatar
  document.querySelectorAll('.avatar, .avatar-ring-container').forEach(a => {
    if (photo) {
      a.innerHTML = `<img src="${esc(photo)}" alt="${esc(name)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
    } else {
      a.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      `;
    }
  });

  // Show Edit Profile button
  document.querySelectorAll('.btn-edit-profile-action, #accEditProfileBtn').forEach(b => {
    b.style.display = 'inline-flex';
  });

  updateBadges(u);
}

function paintOrdersList(orders) {
  const container = document.getElementById('acc-orders-list') || document.querySelector('.order-cards-list');
  if (!container) return;

  if (!orders || orders.length === 0) {
    renderNoOrdersState();
    return;
  }

  setText('.stat-number-orders', String(orders.length));

  container.innerHTML = orders.slice(0, 3).map(o => {
    const item = o.items?.[0] || o.cart?.[0] || {};
    const title = item.title || item.product?.title || 'Ordered Apparel';
    const rawPrice = o.total ?? o.amount ?? item.price ?? 999;
    const price = Number(rawPrice).toLocaleString('en-IN');
    const numericPrice = Number(rawPrice) || 999;
    const status = o.status || 'Processing';
    const statusClass = (status || '').toLowerCase();
    const orderId = o.orderId || o.id || ('SH' + Math.floor(100000 + Math.random() * 900000));
    const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : 'Recently';
    const img = item.image || item.primaryImage || 'assets/orders/shirt.jpg';
    const itemCount = (o.items?.length || 1);

    const isShipped = statusClass === 'shipped';
    const actionLabel = isShipped ? 'Track Order' : 'Buy Again';
    const actionFn = isShipped 
      ? `location.href='orders.html?orderId=${esc(orderId)}'` 
      : `window.handleBuyAgain('${esc(title)}', ${numericPrice}, '${esc(img)}')`;

    return `
      <article class="compact-order-card order-row order-card">
        <div class="card-left-group">
          <div class="product-thumb-box order-thumb thumb">
            <img src="${esc(img)}" alt="${esc(title)}" onerror="this.onerror=null;this.src='assets/orders/shirt.jpg'">
          </div>
          <div class="order-details-info order-info">
            <div class="product-name-heading pname">${esc(title)}</div>
            <div class="order-meta-id">Order #${esc(orderId)}</div>
            <div class="order-meta-sub meta">${esc(dateStr)} | ${itemCount} item${itemCount > 1 ? 's' : ''} | ₹${price}</div>
          </div>
        </div>
        <div class="card-right-group">
          <div class="badge-dots-row">
            <span class="status-chip ${esc(statusClass)} status-pill">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <span>${esc(status)}</span>
            </span>
            <button class="dots-menu-btn" onclick="openOrderMenu('${esc(orderId)}', '${esc(title)}')" title="More Options">⋮</button>
          </div>
          <button class="card-action-btn" onclick="${actionFn}">${actionLabel}</button>
        </div>
      </article>
    `;
  }).join('');
}

// Global user profile edit handler
window.handleProfileSave = async function(e) {
  if (e) e.preventDefault();
  const nameInput = document.getElementById('editNameInput');
  const phoneInput = document.getElementById('editPhoneInput');
  const newName = nameInput?.value?.trim();
  const newPhone = phoneInput?.value?.trim();

  const u = auth?.currentUser || localUser();
  if (!u) {
    if (window.showToast) window.showToast('Please log in first to update profile.');
    return;
  }

  const updatedData = {
    ...u,
    name: newName || u.name,
    phone: newPhone || u.phone,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem('xpord_user', JSON.stringify(updatedData));
    if (db && u.email) {
      await setDoc(doc(db, 'users', userDocId(u)), updatedData, { merge: true });
    }
    paintLoggedInProfile(u, updatedData);
    if (window.closeProfileModal) window.closeProfileModal();
    if (window.showToast) window.showToast('Profile updated successfully!');
  } catch(err) {
    console.warn('Failed to update profile:', err);
  }
};

// Global Logout Handler
window.handleLogout = async function() {
  try {
    if (auth?.currentUser) {
      await signOut(auth);
    }
  } catch(e) {}

  try {
    localStorage.removeItem('xpord_user');
  } catch(e) {}

  paintLoggedOutState();
  if (window.showToast) {
    window.showToast('Logged out successfully.');
  }
};
window.accountLogout = window.handleLogout;

// Initial synchronous paint based on cached session
const cached = localUser();
if (cached && (cached.email || cached.uid)) {
  paintLoggedInProfile(cached, cached);
} else {
  paintLoggedOutState();
}

async function load(u) {
  const cachedUser = localUser();
  const activeUser = u || (cachedUser && (cachedUser.email || cachedUser.uid) ? cachedUser : null);

  if (!activeUser) {
    paintLoggedOutState();
    return;
  }

  // User is logged in: Paint their real profile
  paintLoggedInProfile(activeUser, cachedUser || {});

  // Load real user orders from localStorage first
  let userOrders = [];
  try {
    const rawLocal = localStorage.getItem('xpord_orders');
    if (rawLocal) {
      const parsed = JSON.parse(rawLocal);
      if (Array.isArray(parsed)) {
        userOrders = parsed.filter(o => {
          const matchUid = activeUser.uid && (o.uid === activeUser.uid || o.userId === activeUser.uid);
          const matchEmail = activeUser.email && (o.email === activeUser.email || o.userEmail === activeUser.email);
          return matchUid || matchEmail || !o.uid; // include newly placed order
        });
      }
    }
  } catch(e) {}

  paintOrdersList(userOrders);

  // Firestore sync for profile and live orders
  if (u && db) {
    getDoc(doc(db, 'users', userDocId(u)))
      .then(s => {
        if (s.exists()) {
          paintLoggedInProfile(u, s.data());
        }
      })
      .catch(e => console.warn('Firestore user fetch:', e));

    stopUser?.(); stopOrders?.();
    stopUser = onSnapshot(doc(db, 'users', userDocId(u)), snap => {
      if (snap.exists()) paintLoggedInProfile(u, snap.data());
    }, err => {
      handleFirestoreError(err, 'get', 'users/' + userDocId(u));
    });

    stopOrders = onSnapshot(collection(db, 'orders'), snap => {
      const remoteOrders = [];
      snap.forEach(d => {
        const o = d.data();
        const matchUid = u.uid && (o.uid === u.uid || o.userId === u.uid);
        const matchEmail = u.email && (o.email === u.email || o.userEmail === u.email);
        if (matchUid || matchEmail) {
          remoteOrders.push({ id: d.id, ...o });
        }
      });
      remoteOrders.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

      // Merge remote orders with local orders
      const merged = [...remoteOrders];
      userOrders.forEach(lo => {
        if (!merged.some(ro => ro.id === lo.id || ro.orderId === lo.orderId)) {
          merged.push(lo);
        }
      });
      merged.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
      paintOrdersList(merged);
    }, err => {
      handleFirestoreError(err, 'list', 'orders');
    });
  }
}

onAuthStateChanged(auth, u => load(u));
