import {auth,db,onAuthStateChanged} from './src/firebase.js';
import {doc,getDoc,setDoc} from 'firebase/firestore';

const id=u=>(u?.email||u?.uid||'guest').replace(/[^a-zA-Z0-9]/g,'_');
const val=i=>document.getElementById(i)?.value.trim()||'';

function fill(a={}){
  for(const [k,v] of Object.entries({name:a.name,phone:a.phone,pincode:a.pincode,address:a.address,locality:a.locality,city:a.city,state:a.state,landmark:a.landmark})) {
    const e=document.getElementById('f-'+k);
    if(e) e.value=v||'';
  }
  const c=document.getElementById('f-save');
  if(c) c.checked=a.save!==false;
}

async function init(u){
  let localUser = null;
  try { localUser = JSON.parse(localStorage.getItem('xpord_user') || 'null'); } catch(e) {}
  const activeUser = u || (localUser && localUser.email ? localUser : null);

  if(!activeUser){
    location.href='login.html?redirect=address.html';
    return;
  }

  const userId = activeUser.uid || activeUser.email || 'guest';

  if (u && db) {
    try {
      const s = await getDoc(doc(db, 'users', id(activeUser)));
      if (s.exists() && s.data().lastAddress) fill(s.data().lastAddress);
      else {
        const a = JSON.parse(localStorage.getItem(`stylehub_last_address_${userId}`) || localStorage.getItem('stylehub_last_address') || 'null');
        if (a) fill(a);
      }
    } catch(e) {}
  } else {
    try {
      const a = JSON.parse(localStorage.getItem(`stylehub_last_address_${userId}`) || localStorage.getItem('stylehub_last_address') || 'null');
      if (a) fill(a);
    } catch(e) {}
  }

  window.saveAddress = async function(){
    const a = {
      name: val('f-name'),
      phone: val('f-phone').replace(/\D/g,''),
      pincode: val('f-pincode'),
      address: val('f-address'),
      locality: val('f-locality'),
      city: val('f-city'),
      state: document.getElementById('f-state')?.value||'',
      landmark: val('f-landmark'),
      save: document.getElementById('f-save')?.checked!==false
    };

    if(!a.name||!a.phone||!a.pincode||!a.address||!a.locality||!a.city||!a.state){
      if(window.toast) toast('Please fill all required fields');
      return;
    }
    if(!/^\d{10}$/.test(a.phone)||!/^[1-9]\d{5}$/.test(a.pincode)){
      if(window.toast) toast('Please check phone number and pincode');
      return;
    }

    try {
      if (u && db) {
        const ref = doc(db, 'users', id(activeUser));
        const s = await getDoc(ref);
        const d = s.exists() ? s.data() : {};
        const addresses = Array.isArray(d.addresses) ? d.addresses.filter(x => JSON.stringify(x) !== JSON.stringify(a)) : [];
        addresses.unshift(a);
        await setDoc(ref, {
          uid: activeUser.uid || '',
          email: activeUser.email || '',
          name: activeUser.displayName || d.name || '',
          phone: activeUser.phoneNumber || a.phone,
          lastAddress: a,
          addresses: addresses.slice(0, 10),
          updatedAt: new Date().toISOString()
        }, {merge: true});
      }

      localStorage.setItem(`stylehub_last_address_${userId}`, JSON.stringify(a));
      localStorage.setItem('stylehub_last_address', JSON.stringify(a));
      localStorage.setItem('stylehub_address_result', JSON.stringify({mode:'new', address:a}));
      if (window.toast) toast('Address saved successfully!');
      setTimeout(() => {
        location.href = 'checkout.html';
      }, 500);
    } catch(e) {
      localStorage.setItem('stylehub_last_address', JSON.stringify(a));
      location.href = 'checkout.html';
    }
  };
}

onAuthStateChanged(auth, init);
