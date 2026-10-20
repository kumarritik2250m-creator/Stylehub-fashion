import {auth, db, onAuthStateChanged, signOut} from './src/firebase.js';
import {doc, getDoc, collection, onSnapshot} from 'firebase/firestore';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const userDocId=u=>(u.email||u.uid).replace(/[^a-zA-Z0-9]/g,'_');
const localUser=()=>{try{return JSON.parse(localStorage.getItem('xpord_user')||'null')}catch{return null}};
let stopUser=null, stopOrders=null;
function setText(selector,text){document.querySelectorAll(selector).forEach(e=>e.textContent=text||'')}
function paintProfile(u,data={}){
 const old=localUser()||{}; const name=u.displayName||data.name||old.name||u.email?.split('@')[0]||'Member';
 const email=u.email||data.email||old.email||''; const phone=u.phoneNumber||data.phone||old.phone||''; const photo=u.photoURL||data.photoURL||old.photoURL||'';
 setText('.name',name); setText('.email',email); setText('.profile-name',name); setText('.profile-email',email);
 document.querySelectorAll('.avatar').forEach(a=>{if(photo)a.innerHTML=`<img src="${esc(photo)}" alt="${esc(name)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;});
 try{localStorage.setItem('xpord_user',JSON.stringify({...old,uid:u.uid,name,email,phone,photoURL:photo,updatedAt:new Date().toISOString()}))}catch(e){}
}
function paintOrders(orders){
 setText('.stat-number-orders',String(orders.length));
 const rows=[...document.querySelectorAll('.order-row,.order-card')]; rows.forEach((row,i)=>{const o=orders[i]; if(!o)return; const product=o.items?.[0]||o.cart?.[0]||{}; const title=product.title||product.product?.title||'Order'; const price=o.total??o.amount??product.price??''; const status=o.status||'Processing'; const img=product.image||product.primaryImage||product.product?.primaryImage||''; const h=row.querySelector('.order-info h4,.pname'); const meta=row.querySelector('.order-info .meta,.meta'); const pill=row.querySelector('.status-pill'); if(h)h.textContent=title; if(meta)meta.textContent=o.orderId?`#${o.orderId}`:`#${o.id}`; if(pill)pill.textContent=status; const thumb=row.querySelector('.order-thumb,.thumb'); if(thumb&&img)thumb.innerHTML=`<img src="${esc(img)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:10px">`; const priceEl=row.querySelector('.item-price,.price'); if(priceEl&&price!=='')priceEl.textContent=typeof price==='number'?`₹${price.toLocaleString('en-IN')}`:price;});
}
async function load(u){
 if(!u){location.href='login.html?redirect=index.html%23account';return}
 let initial={}; try{const s=await getDoc(doc(db,'users',userDocId(u)));if(s.exists())initial=s.data()}catch(e){}
 paintProfile(u,initial);
 const cart=()=>{try{return JSON.parse(localStorage.getItem(`xpord_cart_${u.uid}`)||localStorage.getItem('xpord_cart')||'[]')}catch{return[]}};
 const wish=()=>{try{return JSON.parse(localStorage.getItem(`xpord_wishlist_${u.uid}`)||localStorage.getItem('xpord_wishlist')||'[]')}catch{return[]}};
 setText('.stat-number-wishlist',String(wish().length)); setText('.stat-number-cart',String(cart().reduce((n,x)=>n+(Number(x.quantity)||1),0)));
 stopUser?.(); stopOrders?.();
 stopUser=onSnapshot(doc(db,'users',userDocId(u)),snap=>{if(snap.exists())paintProfile(u,snap.data())});
 stopOrders=onSnapshot(collection(db,'orders'),snap=>{const orders=[];snap.forEach(d=>{const o=d.data();if(o.uid===u.uid||o.userId===u.uid||o.email===u.email||o.userEmail===u.email)orders.push({id:d.id,...o})});orders.sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));paintOrders(orders)});
 const logoutEls=document.querySelectorAll('.logout'); logoutEls.forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',async e=>{e.preventDefault();try{await signOut(auth)}finally{localStorage.removeItem('xpord_user');location.href='index.html'}})});
 document.querySelectorAll('a').forEach(a=>{const t=(a.textContent||'').trim().toLowerCase(); if(t.includes('address'))a.href='address.html';});
}
onAuthStateChanged(auth,u=>load(u));
