/* XPORD / StyleHub login controller - uses the existing Firebase backend. */
import {
  db, auth, GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,
  onAuthStateChanged
} from "./src/firebase.js";
import { doc, setDoc, getDoc } from "firebase/firestore";

let currentAuthTab = "login";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
const root = () => document.querySelector(isMobile() ? ".login-mobile" : ".login-desktop");
const q = (sel) => root()?.querySelector(sel) || null;

function showToast(message, type="info") {
  const box = q(".login-message");
  if (box) { box.textContent = message; box.className = `login-message ${type}`; }
  const container = document.getElementById("login-toast-container");
  if (container) {
    container.textContent = message;
    container.setAttribute("data-type", type);
    setTimeout(() => { if (container.textContent === message) container.textContent = ""; }, 4000);
  }
}
window.showToast = showToast;

function getUserSession() {
  try { return JSON.parse(localStorage.getItem("xpord_user") || "null"); } catch { return null; }
}

async function syncAndRedirectUser(userObj) {
  const now = Date.now();
  userObj.loginTimestamp = userObj.loginTimestamp || now;
  userObj.sessionExpiresAt = userObj.sessionExpiresAt || now + SESSION_DURATION_MS;
  userObj.lastActiveAt = now;
  try { localStorage.setItem("xpord_user", JSON.stringify(userObj)); } catch {}

  const uid = userObj.uid || (userObj.email ? userObj.email.replace(/[^a-zA-Z0-9]/g, "_") : "guest");
  const userDocId = userObj.email ? userObj.email.replace(/[^a-zA-Z0-9]/g, "_") : uid;
  let userCart = [], guestCart = [];
  try { userCart = JSON.parse(localStorage.getItem(`xpord_cart_${uid}`) || "[]"); } catch {}
  try { guestCart = JSON.parse(localStorage.getItem("xpord_cart") || "[]"); } catch {}
  try {
    const snap = await getDoc(doc(db, "users", userDocId));
    if (snap.exists() && Array.isArray(snap.data().cart) && !userCart.length) userCart = snap.data().cart;
  } catch (e) { console.warn("Cloud cart sync:", e); }
  const merged = [...userCart];
  if (Array.isArray(guestCart)) guestCart.forEach(item => {
    const found = merged.find(x => x.product && item.product && x.product.id === item.product.id && x.size === item.size);
    if (found) found.quantity = Math.max(found.quantity || 0, item.quantity || 0); else merged.push(item);
  });
  try {
    localStorage.setItem("xpord_cart", JSON.stringify(merged));
    localStorage.setItem(`xpord_cart_${uid}`, JSON.stringify(merged));
  } catch {}

  const rawIntent = sessionStorage.getItem("checkout_flow_intent");
  const pendingCheckout = localStorage.getItem("xpord_pending_checkout") === "true";
  const params = new URLSearchParams(location.search);
  const redirectParam = params.get("redirect");
  if (rawIntent) location.href = "index.html";
  else if (pendingCheckout || redirectParam === "checkout") location.href = "index.html#checkout";
  else if (redirectParam) location.href = redirectParam;
  else location.href = "account.html";
}

function setRegisterMode(register) {
  currentAuthTab = register ? "register" : "login";
  const panel = root();
  if (!panel) return;
  const extras = panel.querySelector(".auth-extra-fields");
  if (extras) extras.hidden = !register;
  const submit = panel.querySelector(".auth-submit");
  if (submit) submit.textContent = register ? "Create Account" : "Login";
  const title = panel.querySelector(".welcome h2") || panel.querySelector("h1");
  if (title && panel.classList.contains("login-desktop")) title.textContent = register ? "Create Your Account" : "Welcome Back!";
  const sign = panel.querySelector(".signup-link");
  const prefix = panel.querySelector(".signup-prefix");
  if (sign) sign.textContent = register ? "Login" : "Sign Up";
  if (prefix) prefix.textContent = register ? "Already have an account? " : "Don't have an account? ";
}
window.switchTab = (tab) => setRegisterMode(tab === "register");

async function submitAuth() {
  const email = q(".auth-email")?.value.trim().toLowerCase();
  const password = q(".auth-password")?.value || "";
  const name = q(".auth-name")?.value.trim() || "";
  const phone = q(".auth-phone")?.value.trim() || "";
  const register = currentAuthTab === "register";
  if (!email || !password) return showToast("Please enter email and password.", "error");
  if (register && name.length < 2) return showToast("Please enter your full name.", "error");
  if (register && password.length < 6) return showToast("Password must be at least 6 characters.", "error");
  const submit = q(".auth-submit");
  if (submit) { submit.disabled = true; submit.textContent = "Processing..."; }
  try {
    let user, displayName = name || email.split("@")[0];
    if (register) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        user = cred.user;
        await updateProfile(user, { displayName: name });
        displayName = name;
      } catch (e) {
        if (e.code === "auth/email-already-in-use") { setRegisterMode(false); throw new Error("Email already registered. Please login."); }
        throw e;
      }
    } else {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      user = cred.user;
      displayName = user.displayName || displayName;
    }
    const userObj = { uid:user.uid, name:displayName, email, phone, photoURL:user.photoURL||"", password, updatedAt:new Date().toISOString() };
    try { await setDoc(doc(db,"users",email.replace(/[^a-zA-Z0-9]/g,"_")), userObj, { merge:true }); } catch(e) { console.warn("User Firestore save:",e); }
    showToast(register ? `Account created! Welcome, ${displayName}.` : `Welcome back, ${displayName}!`, "success");
    await syncAndRedirectUser(userObj);
  } catch (e) {
    console.error(e);
    let msg = e.message || "Authentication failed.";
    if (e.code === "auth/invalid-credential" || e.code === "auth/wrong-password") msg = "Incorrect email or password.";
    if (e.code === "auth/user-not-found") msg = "No account found with this email. Please sign up.";
    showToast(msg,"error");
  } finally {
    if (submit) { submit.disabled=false; submit.textContent=register ? "Create Account" : "Login"; }
  }
}
window.handleFormSubmit = (e) => { e?.preventDefault(); submitAuth(); };

window.handleGoogleSignIn = async function() {
  const btn = q(".google-auth");
  try {
    if (btn) { btn.disabled=true; btn.dataset.originalText=btn.textContent; btn.textContent="Connecting to Google..."; }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({prompt:"select_account"});
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userObj = { uid:user.uid, name:user.displayName || (user.email?.split("@")[0] || "Member"), email:user.email || "", phone:user.phoneNumber || "", photoURL:user.photoURL || "", updatedAt:new Date().toISOString() };
    try { await setDoc(doc(db,"users",user.uid),userObj,{merge:true}); } catch(e) { console.warn("Firestore user sync:",e); }
    await syncAndRedirectUser(userObj);
  } catch(e) { showToast(e.message || "Google Sign-In failed.","error"); }
  finally { if(btn){btn.disabled=false;btn.textContent=btn.dataset.originalText||"Continue with Google";} }
};

function bind() {
  const panel = root(); if (!panel) return;
  panel.querySelector(".auth-submit")?.addEventListener("click", submitAuth);
  panel.querySelector(".google-auth")?.addEventListener("click", window.handleGoogleSignIn);
  panel.querySelector(".signup-link")?.addEventListener("click", e => { e.preventDefault(); const r = new URLSearchParams(location.search).get("redirect"); location.href = r ? `signup.html?redirect=${encodeURIComponent(r)}` : "signup.html"; });
  panel.querySelector(".forgot a")?.addEventListener("click", async e => {
    e.preventDefault();
    const email = q(".auth-email")?.value.trim();
    if (!email) return showToast("Enter your email first, then use Forgot Password.","info");
    const { sendPasswordResetEmail } = await import("firebase/auth");
    try { await sendPasswordResetEmail(auth,email); showToast("Password reset email sent.","success"); } catch(e) { showToast(e.message || "Could not send reset email.","error"); }
  });
  panel.querySelectorAll(".auth-password").forEach(input => {
    input.addEventListener("keydown", e => { if(e.key === "Enter") submitAuth(); });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const session = getUserSession();
  const params = new URLSearchParams(location.search);
  if (session?.email || auth.currentUser) {
    const target = params.get("redirect");
    if (target) location.href = target; else location.href = "account.html";
    return;
  }
  bind();
});

onAuthStateChanged(auth, user => {
  if (user && location.pathname.endsWith("login.html")) {
    const params = new URLSearchParams(location.search);
    if (params.get("redirect") === "index.html#account") location.href = "account.html";
  }
});
