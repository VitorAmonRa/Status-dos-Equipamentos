import React, { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { toast } from "react-toastify";
import { FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { AppHeader } from "../components/AppHeader";
import { SituationSelect } from "../components/SituationSelect";
import { useEquipments } from "../hooks/useEquipments";
import {
  PLANNING,
  POSITIONS,
  STATUS,
  getSituation,
} from "../constants/situations";
import { addEquipment, changeSituation, removeEquipment } from "../services/equipments";

const Main = styled.main`
  display: grid;
  grid-template-columns: minmax(320px, 400px) 1fr;
  gap: 24px;
  align-items: start;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    padding: 16px;
  }
`;

const Card = styled.section`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 20px;

  h2 {
    font-size: 16px;
    font-weight: 650;
    margin-bottom: 4px;
  }

  > p {
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 16px;
  }
`;

const Sticky = styled(Card)`
  position: sticky;
  top: 80px;

  @media (max-width: 960px) {
    position: static;
  }
`;

const Kpis = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
`;

const Kpi = styled.div`
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  border-top: 3px solid ${({ $color }) => $color};

  span {
    font-size: 13px;
    color: var(--muted);
  }

  strong {
    display: block;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin: 16px 0 8px;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 84px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: #f8fafc;
  resize: vertical;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: var(--brand);
    background: #fff;
  }
`;

const Hint = styled.small`
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted);
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: #fff;
  font-size: 13px;
  transition: background 0.12s, border-color 0.12s;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
  }

  &:hover {
    border-color: ${({ $color }) => $color};
  }

  ${({ $active, $color }) =>
    $active &&
    css`
      background: ${$color}1a;
      border-color: ${$color};
      font-weight: 600;
    `}

  em {
    font-style: normal;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }
`;

const PositionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
`;

const PositionButton = styled.button`
  position: relative;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #fff;
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;

  ${({ $occupied }) =>
    $occupied &&
    css`
      background: #ecfeff;
      color: #0e7490;
    `}

  ${({ $active }) =>
    $active &&
    css`
      background: #0891b2;
      border-color: #0891b2;
      color: #fff;
    `}
`;

const Submit = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  margin-top: 20px;
  border: 0;
  border-radius: 10px;
  background: var(--brand);
  color: #fff;
  font-weight: 600;

  &:hover {
    background: var(--brand-dark);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
`;

const Search = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 220px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: #f8fafc;
  color: var(--muted);

  input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    color: var(--text);
    outline: none;
  }
`;

const Group = styled.div`
  margin-top: 20px;

  h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 650;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--muted);
    margin-bottom: 8px;
  }

  h3::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 3px;
    background: ${({ $color }) => $color};
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 8px 8px 8px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  margin-bottom: 6px;
  background: #fff;
  transition: background 0.12s;

  &:hover {
    background: #f8fafc;
  }

  div {
    min-width: 0;
  }

  strong {
    display: block;
    font-weight: 600;
    font-size: 14px;
    overflow-wrap: anywhere;
  }

  small {
    font-size: 12px;
    color: var(--muted);
  }
`;

const IconButton = styled.button`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--muted);

  &:hover {
    color: #dc2626;
    background: #fef2f2;
    border-color: #fecaca;
  }
`;

const Empty = styled.p`
  padding: 32px 0;
  text-align: center;
  color: var(--muted);
  font-size: 14px;
`;

const UndoButton = styled.button`
  margin-left: 12px;
  padding: 4px 10px;
  border: 1px solid currentColor;
  border-radius: 6px;
  background: transparent;
  font-weight: 600;
`;

// Vários nomes de uma vez: um por linha ou separados por vírgula/ponto e vírgula.
const splitNames = (text) =>
  text
    .split(/[\n;,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

const POSITIONS_GROUP = { value: "__posicoes", plural: "Spreaders posicionados", color: "#0891b2" };
const ORDER = [...STATUS, ...PLANNING, POSITIONS_GROUP].map((s) => s.value);

export const AdminPage = () => {
  const { items, bySituation, loading, error } = useEquipments();
  const [names, setNames] = useState("");
  const [situation, setSituation] = useState("Liberado");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const isDate = situation === "Data";
  const toAdd = isDate ? (names.trim() ? [names.trim()] : []) : splitNames(names);
  const count = (value) => bySituation[value]?.length || 0;
  const positioned = POSITIONS.filter((p) => count(p) > 0).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toAdd.length) {
      toast.error("Digite ao menos um equipamento");
      return;
    }
    setSaving(true);
    try {
      await Promise.all(toAdd.map((n) => addEquipment(n, situation)));
      const label = getSituation(situation).label;
      toast.success(
        toAdd.length === 1
          ? `${toAdd[0]} → ${label}`
          : `${toAdd.length} equipamentos → ${label}`
      );
      setNames("");
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível salvar. Tente de novo.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = async (item, next) => {
    try {
      await changeSituation(item.id, next);
      toast.success(`${item.name} → ${getSituation(next).label}`);
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível alterar a situação");
    }
  };

  const handleDelete = async (item) => {
    try {
      await removeEquipment(item.id);
      toast.info(
        ({ closeToast }) => (
          <span>
            {item.name} removido
            <UndoButton
              onClick={() => {
                addEquipment(item.name, item.situation);
                closeToast();
              }}
            >
              Desfazer
            </UndoButton>
          </span>
        ),
        { autoClose: 5000 }
      );
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível remover");
    }
  };

  const groups = useMemo(() => {
    const term = search.trim().toLowerCase();
    const visible = items.filter(
      (i) =>
        (filter === "all" || i.situation === filter) &&
        (!term || i.name?.toLowerCase().includes(term))
    );
    // Todas as posições RT/ST ficam num grupo só, ordenadas pela posição.
    const keyOf = (v) => (POSITIONS.includes(v) ? POSITIONS_GROUP.value : v);
    const map = {};
    for (const item of visible) (map[keyOf(item.situation)] ||= []).push(item);
    if (map[POSITIONS_GROUP.value]) {
      map[POSITIONS_GROUP.value].sort(
        (a, b) => POSITIONS.indexOf(a.situation) - POSITIONS.indexOf(b.situation)
      );
    }
    return Object.keys(map)
      .sort((a, b) => {
        const ia = ORDER.indexOf(a);
        const ib = ORDER.indexOf(b);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      })
      .map((value) => ({
        situation: value === POSITIONS_GROUP.value ? POSITIONS_GROUP : getSituation(value),
        items: map[value],
      }));
  }, [items, filter, search]);

  return (
    <>
      <AppHeader showLogout>
        <small>Gestão</small>
      </AppHeader>
      <Main>
        <Kpis>
          {STATUS.map((s) => (
            <Kpi key={s.value} $color={s.color}>
              <span>{s.plural}</span>
              <strong>{count(s.value)}</strong>
            </Kpi>
          ))}
          <Kpi $color="#2563eb">
            <span>Spreaders reserva</span>
            <strong>{count("Reserva")}</strong>
          </Kpi>
          <Kpi $color="#0891b2">
            <span>Posições ocupadas</span>
            <strong>
              {positioned}
              <small style={{ fontSize: 15, color: "var(--muted)" }}> / {POSITIONS.length}</small>
            </strong>
          </Kpi>
        </Kpis>

        <Sticky as="form" onSubmit={handleSubmit}>
          <h2>Adicionar</h2>
          <p>Escolha a situação e digite um ou mais equipamentos.</p>

          <FieldLabel>Status</FieldLabel>
          <Chips>
            {STATUS.map((s) => (
              <Chip
                type="button"
                key={s.value}
                $color={s.color}
                $active={situation === s.value}
                onClick={() => setSituation(s.value)}
              >
                {s.label}
              </Chip>
            ))}
          </Chips>

          <FieldLabel>Planejamento</FieldLabel>
          <Chips>
            {PLANNING.map((s) => (
              <Chip
                type="button"
                key={s.value}
                $color={s.color}
                $active={situation === s.value}
                onClick={() => setSituation(s.value)}
              >
                {s.label}
              </Chip>
            ))}
          </Chips>

          <FieldLabel>Posição do spreader</FieldLabel>
          <PositionGrid>
            {POSITIONS.map((p) => (
              <PositionButton
                type="button"
                key={p}
                $active={situation === p}
                $occupied={count(p) > 0}
                title={bySituation[p]?.map((i) => i.name).join(", ") || "Livre"}
                onClick={() => setSituation(p)}
              >
                {p}
              </PositionButton>
            ))}
          </PositionGrid>

          <FieldLabel htmlFor="names">
            {isDate ? "Data / texto da programação" : "Equipamentos"}
          </FieldLabel>
          <Textarea
            id="names"
            value={names}
            onChange={(e) => setNames(e.target.value)}
            placeholder={isDate ? "28/10 - 1º turno" : "RTG 05\nPORTÊINER 02, SS 14"}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit(e);
            }}
          />
          <Hint>
            {isDate
              ? getSituation("Data").hint
              : "Um por linha ou separados por vírgula. Ctrl+Enter para salvar."}
          </Hint>

          <Submit type="submit" disabled={saving || !toAdd.length}>
            <FiPlus aria-hidden />
            {toAdd.length > 1 ? `Adicionar ${toAdd.length}` : "Adicionar"} como “
            {getSituation(situation).label}”
          </Submit>
        </Sticky>

        <Card>
          <h2>Equipamentos cadastrados</h2>
          <p>Troque a situação direto na lista, sem precisar apagar e cadastrar de novo.</p>

          <Toolbar>
            <Search>
              <FiSearch aria-hidden />
              <input
                type="search"
                placeholder="Buscar equipamento"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Search>
          </Toolbar>
          <Chips>
            <Chip
              type="button"
              $color="#475569"
              $active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              Todos <em>{items.length}</em>
            </Chip>
            {[...STATUS, ...PLANNING].map((s) => (
              <Chip
                type="button"
                key={s.value}
                $color={s.color}
                $active={filter === s.value}
                onClick={() => setFilter(filter === s.value ? "all" : s.value)}
              >
                {s.label} <em>{count(s.value)}</em>
              </Chip>
            ))}
          </Chips>

          {error && <Empty>Erro ao carregar os dados. Verifique sua conexão.</Empty>}
          {loading && !error && <Empty>Carregando…</Empty>}
          {!loading && !error && groups.length === 0 && (
            <Empty>{items.length ? "Nada encontrado com esse filtro." : "Nenhum equipamento cadastrado."}</Empty>
          )}

          {groups.map(({ situation: s, items: list }) => (
            <Group key={s.value} $color={s.color}>
              <h3>
                {s.plural} · {list.length}
              </h3>
              {list.map((item) => (
                <Row key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    {(item.updated || item.created) && (
                      <small>
                        {item.updated ? `Alterado em ${item.updated}` : `Desde ${item.created}`}
                      </small>
                    )}
                  </div>
                  <SituationSelect
                    value={item.situation}
                    onChange={(next) => handleChange(item, next)}
                    aria-label={`Situação de ${item.name}`}
                  />
                  <IconButton
                    type="button"
                    onClick={() => handleDelete(item)}
                    title="Remover"
                    aria-label={`Remover ${item.name}`}
                  >
                    <FiTrash2 />
                  </IconButton>
                </Row>
              ))}
            </Group>
          ))}
        </Card>
      </Main>
    </>
  );
};
