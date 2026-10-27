// Os valores ("value") são os mesmos gravados pela versão original no Firestore,
// então as duas versões continuam lendo e escrevendo os mesmos documentos.

export const STATUS = [
  { value: "Liberado", label: "Liberado", plural: "Liberados", color: "#16a34a" },
  { value: "Em-liberação", label: "Em liberação", plural: "Em liberação", color: "#eab308" },
  { value: "Não-liberado", label: "Não liberado", plural: "Não liberados", color: "#dc2626" },
];

export const PLANNING = [
  { value: "Apoio", label: "Apoio", plural: "Equipamentos de apoio", color: "#f97316" },
  { value: "Reserva", label: "Spreader reserva", plural: "Spreaders reserva", color: "#2563eb" },
  { value: "Proximo-dia", label: "Próximo dia", plural: "Programação do dia", color: "#8b5cf6" },
  {
    value: "Data",
    label: "Data da programação",
    plural: "Data da programação",
    color: "#0d9488",
    hint: "Texto que aparece no topo da Programação do dia (ex.: 28/10 - 1º turno)",
  },
];

const pad = (n) => String(n).padStart(2, "0");

export const POSITIONS = [
  ...Array.from({ length: 18 }, (_, i) => `RT${pad(i + 1)}`),
  ...Array.from({ length: 6 }, (_, i) => `ST${pad(i + 1)}`),
];

export const POSITION_COLOR = "#0891b2";

const byValue = Object.fromEntries(
  [...STATUS, ...PLANNING].map((s) => [s.value, s])
);

export function getSituation(value) {
  if (byValue[value]) return byValue[value];
  if (POSITIONS.includes(value)) {
    return { value, label: value, plural: value, color: POSITION_COLOR, isPosition: true };
  }
  return { value, label: value || "Sem situação", plural: value, color: "#94a3b8" };
}

export const ALL_OPTIONS = [
  { group: "Status", items: STATUS },
  { group: "Planejamento", items: PLANNING },
  { group: "Posição do spreader", items: POSITIONS.map((p) => getSituation(p)) },
];
