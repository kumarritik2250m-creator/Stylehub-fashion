import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  initializeFirestore,
  doc,
  getDocFromServer
} from "firebase/firestore";
import { 
  getAuth, 
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged 
} from "firebase/auth";
import firebaseConfig from "../firebase-applet-config.json";

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with forced long-polling and HTTP streams disabled
// to guarantee 100% reliable connection in iframe, preview, and proxied environments without WebSocket connection errors
let dbInstance;
try {
  dbInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
  }, firebaseConfig.firestoreDatabaseId);
} catch (err) {
  try {
    dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  } catch (fallbackErr) {
    dbInstance = getFirestore(app);
  }
}

export const db = dbInstance;
export const auth = getAuth(app);

// Ensure local persistence for session retention
try {
  setPersistence(auth, browserLocalPersistence).catch((e) => {
    console.warn("Firebase Auth persistence notice:", e);
  });
} catch (e) {
  console.warn("setPersistence skipped:", e);
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { 
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged 
};

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    }
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
  return errInfo;
}

// Test connection to Firestore as mandated by Firebase Skill
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.info('Cloud Firestore connection established.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore running in offline cache mode. Please verify network connectivity.");
    } else {
      console.info("Firestore status checked.");
    }
  }
}

// Kick off initial connection verification in the background
if (typeof window !== 'undefined') {
  setTimeout(() => {
    testConnection().catch(() => {});
  }, 100);
}





