import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConnection";
import { demoStore } from "./demoStore";

const DEMO_KEY = "status-equip:demo";

function detectDemo() {
  if (import.meta.env.MODE === "demo" || import.meta.env.VITE_DEMO_MODE === "true") return true;
  try {
    const param = new URLSearchParams(window.location.search).get("demo");
    if (param === "1") sessionStorage.setItem(DEMO_KEY, "1");
    if (param === "0") sessionStorage.removeItem(DEMO_KEY);
    return sessionStorage.getItem(DEMO_KEY) === "1";
  } catch {
    return false;
  }
}

export const isDemo = detectDemo();

// "created" é gravado como texto (toLocaleString), igual à versão original.
// Ordenar pelo texto mistura dias e meses, então ordenamos pela data interpretada.
function createdTime(created) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(created || "");
  if (!m) return 0;
  const [, d, mo, y, h, mi, s] = m;
  return new Date(+y, +mo - 1, +d, +h, +mi, +(s || 0)).getTime();
}

const sortItems = (list) =>
  list
    .map((item, index) => ({ item, index, t: createdTime(item.created) }))
    .sort((a, b) => a.t - b.t || a.index - b.index)
    .map(({ item }) => item);

const COLLECTION = "Equipamentos";

export function subscribeEquipments(onData, onError) {
  if (isDemo) return demoStore.subscribe((list) => onData(sortItems(list)));

  const queryRef = query(collection(db, COLLECTION), orderBy("created", "asc"));
  return onSnapshot(
    queryRef,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
        situation: d.data().situation,
        created: d.data().created,
        updated: d.data().updated,
      }));
      onData(sortItems(list));
    },
    onError
  );
}

export function addEquipment(name, situation) {
  if (isDemo) return demoStore.add(name, situation);
  return addDoc(collection(db, COLLECTION), {
    name,
    situation,
    created: new Date().toLocaleString("pt-BR"),
  });
}

export function removeEquipment(id) {
  if (isDemo) return demoStore.remove(id);
  return deleteDoc(doc(db, COLLECTION, id));
}

export function changeSituation(id, situation) {
  if (isDemo) return demoStore.update(id, situation);
  return updateDoc(doc(db, COLLECTION, id), {
    situation,
    updated: new Date().toLocaleString("pt-BR"),
  });
}
