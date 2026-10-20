/* StyleHub Sign Up controller - uses the existing Firebase backend. */
import {
  db, auth, GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, updateProfile
} from "./src/firebase.js";
import { doc, setDoc } from "firebase/firestore";

const mobile = window.matchMedia("(max-width: 767px)").matches;
const scope = mobile ? ".phone" : ".page";
const q = (s) => document.querySelector(`${scope} ${s}`) || document.querySelector(s);

function message(text, type="info") {
  let el = document.getElementById("signup-message");
  if (!el) {
    el = document.createElement("div");
    el.id = "signup-message";
    Object.assign(el.style, {position:"fixed",left:"50%",bottom:"24px",transform:"translateX(-50%)",zIndex:"9999",padding:"12px 18px",borderRadius:"10px",background:"#111827",color:"#fff",font:"500 13px/1.4 Arial,sans-serif",boxShadow:"0 8px 30px rgba(0,0,0,.18)",maxWidth:"90vw",textAlign:"center"});
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.style.background = type === "error" ? "#b42318" : type === "success" ? "#18794e" : "#111827";
  clearTimeout(window.__signupToastTimer);
  window.__signupToastTimer = setTimeout(() => el.remove(), 4500);
}

function inputs() {
  const all = [...document.querySelectorAll(`${scope} input`)].filter(i => i.type !== "checkbox");
  return {
    name: all[0], email: all[1], phone: all[2], password: all[3], confirm: all[4]
  };
}

function goLogin() {
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect");
  location.href = redirect ? `login.html?redirect=${encodeURIComponent(redirect)}` : "login.html";
}

async function createAccount() {
  const {name,email,phone,password,confirm} = inputs();
  const terms = document.querySelector(`${scope} .agree input[type="checkbox"]`) || document.querySelector('.agree input[type="checkbox"]');
  const fullName = name?.value.trim() || "";
  const emailValue = email?.value.trim().toLowerCase() || "";
  const phoneValue = phone?.value.trim() || "";
  const pass = password?.value || "";
  const confirmPass = confirm?.value || "";

  if (fullName.length < 2) return message("Please enter your full name.", "error");
  if (!emailValue) return message("Please enter your email address.", "error");
  if (pass.length < 6) return message("Password must be at least 6 characters.", "error");
  if (pass !== confirmPass) return message("Passwords do not match.", "error");
  if (terms && !terms.checked) return message("Please agree to the Terms & Conditions and Privacy Policy.", "error");

  const btn = q(".create-btn");
  if (btn) { btn.disabled = true; btn.dataset.original = btn.textContent; btn.textContent = "Creating Account..."; }
  try {
    const cred = await createUserWithEmailAndPassword(auth, emailValue, pass);
    const user = cred.user;
    await updateProfile(user, {displayName: fullName});
    const userObj = {
      uid: user.uid,
      name: fullName,
      email: emailValue,
      phone: phoneValue,
      photoURL: user.photoURL || "",
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, "users", emailValue.replace(/[^a-zA-Z0-9]/g, "_")), userObj, {merge:true});
    } catch (e) { console.warn("User Firestore save:", e); }

    const now = Date.now();
    userObj.loginTimestamp = now;
    userObj.sessionExpiresAt = now + 8 * 60 * 60 * 1000;
    userObj.lastActiveAt = now;
    localStorage.setItem("xpord_user", JSON.stringify(userObj));
    localStorage.setItem(`xpord_cart_${user.uid}`, localStorage.getItem("xpord_cart") || "[]");

    message(`Account created! Welcome, ${fullName}.`, "success");
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");
    setTimeout(() => { location.href = redirect || "index.html#account"; }, 500);
  } catch (e) {
    console.error(e);
    let msg = e.message || "Could not create your account.";
    if (e.code === "auth/email-already-in-use") msg = "This email is already registered. Please login.";
    if (e.code === "auth/invalid-email") msg = "Please enter a valid email address.";
    message(msg, "error");
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = btn.dataset.original || "Create Account"; }
  }
}

async function googleSignup() {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({prompt:"select_account"});
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userObj = {
      uid:user.uid,
      name:user.displayName || (user.email?.split("@")[0] || "Member"),
      email:user.email || "",
      phone:user.phoneNumber || "",
      photoURL:user.photoURL || "",
      updatedAt:new Date().toISOString()
    };
    try { await setDoc(doc(db,"users",user.uid),userObj,{merge:true}); } catch(e) { console.warn("Firestore user sync:",e); }
    localStorage.setItem("xpord_user", JSON.stringify({...userObj, loginTimestamp:Date.now(), sessionExpiresAt:Date.now()+8*60*60*1000, lastActiveAt:Date.now()}));
    const params = new URLSearchParams(location.search);
    location.href = params.get("redirect") || "index.html#account";
  } catch(e) {
    message(e.message || "Google Sign-In failed.", "error");
  }
}

function bind() {
  document.querySelectorAll(".create-btn").forEach(b => b.addEventListener("click", createAccount));
  document.querySelectorAll(".login-line a").forEach(a => a.addEventListener("click", e => {e.preventDefault(); goLogin();}));
  document.querySelectorAll(".back-arrow").forEach(a => a.addEventListener("click", goLogin));
  document.querySelectorAll(".social-btn-sm").forEach((b,i) => {
    b.addEventListener("click", () => {
      if (i === 0) googleSignup();
      else message(i === 1 ? "Apple Sign-In is not connected to the existing Firebase backend." : "Facebook Sign-In is not connected to the existing Firebase backend.", "info");
    });
  });
  document.querySelectorAll(".input-wrap input[type='password']").forEach((input,idx) => {
    const wrap = input.parentElement;
    const eye = wrap?.querySelectorAll("svg")[1];
    if (eye) eye.style.cursor = "pointer";
    eye?.addEventListener("click", () => { input.type = input.type === "password" ? "text" : "password"; });
    input.addEventListener("keydown", e => { if(e.key === "Enter") createAccount(); });
  });
}

document.addEventListener("DOMContentLoaded", bind);
