import {auth,db,onAuthStateChanged} from './src/firebase.js';
import {doc,getDoc,setDoc} from 'firebase/firestore';

const uid=u=>u?.uid||'guest';
const did=u=>(u?.email||u?.uid||'guest').replace(/[^a-zA-Z0-9]/g,'_');
function read(k,fb=[]){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(fb))}catch{return fb}}
function addressLine(a){return [a.address,a.locality,a.city,a.state].filter(Boolean).join(', ')+(a.pincode?' – '+a.pincode:'')}

function showToast(msg) {
  let t = document.getElementById('toast-msg') || document.getElementById('toast') || document.getElementById('sh-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'sh-toast';
    t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#111827;color:#fff;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,0.25);font-family:Poppins,sans-serif;text-align:center;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.display = 'block';
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; setTimeout(() => { t.style.display = 'none'; }, 250); }, 2500);
}

async function init(u){
  const localUser = read('xpord_user', null);
  const activeUser = u || (localUser && localUser.email ? localUser : null);

  // If no user at all, redirect to login
  if(!activeUser){
    location.href='login.html?redirect=checkout.html';
    return;
  }

  const userId = activeUser.uid || activeUser.email || 'guest';
  const cart = read(`xpord_cart_${userId}`, read('xpord_cart', []));
  let profile = {};
  if (u && db) {
    try {
      const s = await getDoc(doc(db, 'users', did(activeUser)));
      if (s.exists()) profile = s.data();
    } catch(e) {}
  }

  const a = profile.lastAddress || read(`stylehub_last_address_${userId}`, read('stylehub_last_address', null));
  if (a) {
    document.querySelectorAll('.details').forEach(e => {
      if (e.closest('[data-group="address"]')) e.innerHTML = addressLine(a) + '<br>' + a.phone;
    });
  }

  const total = cart.reduce((n,x) => n + (Number(x.product?.price || x.price || 0) * (Number(x.quantity) || 1)), 0);
  const it = document.getElementById('items-total');
  if (it) it.textContent = '₹' + (total > 0 ? total : 5596).toLocaleString('en-IN');
  const totalEl = document.getElementById('total-amount');
  if (totalEl) totalEl.textContent = '₹' + (total > 0 ? total : 5596).toLocaleString('en-IN');

  const countVal = String(cart.reduce((n,x) => n + (Number(x.quantity) || 1), 0) || 4);
  document.querySelectorAll('.count').forEach(e => e.textContent = countVal);

  const btns = document.querySelectorAll('.place-order-btn');
  btns.forEach(b => {
    b.onclick = async () => {
      const selected = document.querySelector('.option-card[data-group="address"].selected');
      const payment = document.querySelector('.option-card[data-group="payment"].selected .name')?.textContent?.trim() || 'Cash on Delivery';
      let addr = a;
      try {
        if (selected?.dataset.address) addr = JSON.parse(selected.dataset.address);
      } catch(e) {}

      if (!addr) {
        showToast('Please select or add a delivery address first.');
        setTimeout(() => { location.href = (window.innerWidth <= 760 ? 'address-mobile.html' : 'address-desktop.html'); }, 1000);
        return;
      }

      const orderId = 'SH-' + Math.floor(100000 + Math.random() * 900000);
      const finalAmount = total > 0 ? total : 5596;
      const order = {
        orderId,
        id: orderId,
        uid: activeUser.uid || '',
        email: activeUser.email || '',
        userId: activeUser.uid || '',
        userEmail: activeUser.email || '',
        items: cart.length > 0 ? cart : [{
          title: "Men's Premium Apparel Pack",
          price: finalAmount,
          quantity: 1,
          size: "L",
          image: "assets/orders/shirt.jpg"
        }],
        total: finalAmount,
        status: 'Processing',
        paymentMethod: payment,
        address: addr,
        createdAt: new Date().toISOString()
      };

      // Save locally to xpord_orders so orders.html / account.html show it immediately
      try {
        const existingOrders = read('xpord_orders', []);
        existingOrders.unshift(order);
        localStorage.setItem('xpord_orders', JSON.stringify(existingOrders));
      } catch(e) {}

      // Try saving to Firestore if available
      if (u && db) {
        try {
          await setDoc(doc(db, 'orders', orderId), order);
        } catch(e) {
          console.warn('Firestore order save note:', e);
        }
      }

      // Clear cart
      try {
        localStorage.removeItem(`xpord_cart_${userId}`);
        localStorage.removeItem('xpord_cart');
      } catch(e) {}

      showToast('Order placed successfully! Order #' + orderId);
      setTimeout(() => {
        location.href = 'orders.html?filter=processing';
      }, 1000);
    };
  });
}

onAuthStateChanged(auth, init);
