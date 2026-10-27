import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConnection";
import { isDemo } from "./equipments";

const DEMO_USER = { uid: "demo", email: "demo@portonave" };

export function watchUser(cb) {
  if (isDemo) {
    cb(DEMO_USER);
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => cb(user ? { uid: user.uid, email: user.email } : null));
}

export function login(email, password) {
  if (isDemo) return Promise.resolve(DEMO_USER);
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  if (isDemo) return Promise.resolve();
  return signOut(auth);
}
