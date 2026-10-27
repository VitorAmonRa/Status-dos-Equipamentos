// Armazenamento em memória usado no modo demonstração (npm run demo ou ?demo=1).
// Não toca no Firebase: serve para ver e testar o visual sem login e sem mexer nos dados reais.

const now = () => new Date().toLocaleString("pt-BR");

let seq = 0;
const make = (name, situation) => ({ id: `demo-${++seq}`, name, situation, created: now() });

let items = [
  make("PORTÊINER 01", "Liberado"),
  make("PORTÊINER 02", "Liberado"),
  make("PORTÊINER 04", "Liberado"),
  make("RTG 03", "Liberado"),
  make("RTG 05", "Liberado"),
  make("RTG 07", "Liberado"),
  make("RTG 11", "Liberado"),
  make("REACH STACKER 02", "Liberado"),
  make("PORTÊINER 03", "Em-liberação"),
  make("RTG 08", "Em-liberação"),
  make("RTG 12", "Em-liberação"),
  make("PORTÊINER 05", "Não-liberado"),
  make("RTG 02 - troca de cabo", "Não-liberado"),
  make("TERMINAL TRACTOR 14", "Apoio"),
  make("EMPILHADEIRA 03", "Apoio"),
  make("SS 21", "Reserva"),
  make("SR 09", "Reserva"),
  make("28/10 - 1º turno", "Data"),
  make("PORTÊINER 06", "Proximo-dia"),
  make("RTG 14", "Proximo-dia"),
  make("SS 12", "RT01"),
  make("SS 15", "RT02"),
  make("SR 04", "RT04"),
  make("SS 08", "RT07"),
  make("SS 17", "RT10"),
  make("SR 02", "RT13"),
  make("SS 03", "ST01"),
  make("SR 11", "ST04"),
];

const listeners = new Set();
const emit = () => listeners.forEach((cb) => cb([...items]));

export const demoStore = {
  subscribe(cb) {
    listeners.add(cb);
    setTimeout(() => cb([...items]), 150);
    return () => listeners.delete(cb);
  },
  async add(name, situation) {
    items = [...items, make(name, situation)];
    emit();
  },
  async remove(id) {
    items = items.filter((i) => i.id !== id);
    emit();
  },
  async update(id, situation) {
    items = items.map((i) => (i.id === id ? { ...i, situation, updated: now() } : i));
    emit();
  },
};
