import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import GridLayout, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { FiCheck, FiMove, FiRotateCcw } from "react-icons/fi";
import { BoardShell } from "../components/BoardShell";
import { useEquipments } from "../hooks/useEquipments";
import { useFitContent } from "../hooks/useFitContent";
import { getSituation } from "../constants/situations";

const Grid = WidthProvider(GridLayout);

// Grade de 12 colunas x 12 linhas que sempre ocupa a altura da tela.
const COLS = 12;
const ROWS = 12;
const GAP = 16;
const STORAGE_KEY = "status-equip:painel-layout:v1";

const PANELS = [
  { i: "Liberado" },
  { i: "Em-liberação" },
  { i: "Não-liberado" },
  { i: "Apoio", small: true },
  { i: "Reserva", small: true },
  { i: "Proximo-dia", small: true },
];

const DEFAULT_LAYOUT = [
  { i: "Liberado", x: 0, y: 0, w: 3, h: 12 },
  { i: "Em-liberação", x: 3, y: 0, w: 3, h: 12 },
  { i: "Não-liberado", x: 6, y: 0, w: 3, h: 12 },
  { i: "Apoio", x: 9, y: 0, w: 3, h: 3 },
  { i: "Reserva", x: 9, y: 3, w: 3, h: 3 },
  { i: "Proximo-dia", x: 9, y: 6, w: 3, h: 6 },
];

// Ao arrastar, a grade empurra os outros quadros para baixo; aqui cada quadro
// é encurtado para não passar da última linha e sair da tela.
const withLimits = (layout) =>
  layout.map((l) => {
    const y = Math.min(l.y, ROWS - 2);
    return { ...l, y, h: Math.max(2, Math.min(l.h, ROWS - y)), minW: 2, minH: 2 };
  });

function loadLayout() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const ids = PANELS.map((p) => p.i);
    if (Array.isArray(saved) && ids.every((id) => saved.some((l) => l.i === id))) {
      return withLimits(saved.filter((l) => ids.includes(l.i)));
    }
  } catch {
    // layout salvo inválido ou storage bloqueado: usa o padrão
  }
  return withLimits(DEFAULT_LAYOUT);
}

function saveLayout(layout) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(layout.map(({ i, x, y, w, h }) => ({ i, x, y, w, h })))
    );
  } catch {
    // sem storage: o layout vale só até recarregar a página
  }
}

function clearLayout() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignora
  }
}

const useIsNarrow = () => {
  const query = "(max-width: 860px)";
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return narrow;
};

// Altura de cada linha para a grade inteira caber entre o topo dela e o fim da tela.
const useRowHeight = (ref, deps) => {
  const [rowHeight, setRowHeight] = useState(48);
  useLayoutEffect(() => {
    const measure = () => {
      if (!ref.current) return;
      const top = ref.current.getBoundingClientRect().top + window.scrollY;
      const available = window.innerHeight - top - 30; // padding inferior da página
      setRowHeight(Math.max(28, Math.floor((available - GAP * (ROWS - 1)) / ROWS)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);
  return rowHeight;
};

const GridArea = styled.div`
  margin: 0 -${GAP}px;

  .react-grid-item.react-grid-placeholder {
    background: #38bdf8;
    opacity: 0.18;
    border-radius: 16px;
  }

  .react-grid-item > .react-resizable-handle {
    width: 22px;
    height: 22px;
    background: none;
    z-index: 2;
  }

  .react-grid-item > .react-resizable-handle::after {
    right: 6px;
    bottom: 6px;
    width: 10px;
    height: 10px;
    border-right: 3px solid #e2e8f0;
    border-bottom: 3px solid #e2e8f0;
    opacity: 0.7;
  }

  ${({ $editing }) =>
    $editing &&
    css`
      background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: calc(100% / ${COLS}) calc(100% / ${ROWS});
      border-radius: 16px;
    `}
`;

const Stack = styled.div`
  display: grid;
  gap: 16px;
`;

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  overflow: hidden;

  ${({ $editing }) =>
    $editing &&
    css`
      border: 1px dashed rgba(148, 163, 184, 0.6);
      background: rgba(255, 255, 255, 0.06);
    `}

  header {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border-top: 4px solid ${({ $color }) => $color};
    background: linear-gradient(180deg, ${({ $color }) => $color}26, transparent);
    cursor: ${({ $editing }) => ($editing ? "move" : "default")};
  }

  h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: ${({ $small }) => ($small ? "16px" : "clamp(18px, 1.6vw, 24px)")};
    font-weight: 650;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  header span {
    min-width: 40px;
    padding: 2px 10px;
    border-radius: 999px;
    background: ${({ $color }) => $color};
    color: #fff;
    font-weight: 700;
    font-size: ${({ $small }) => ($small ? "14px" : "18px")};
    text-align: center;
    font-variant-numeric: tabular-nums;
  }
`;

const Content = styled.div`
  --fit: 1;
  flex: 1;
  min-height: 0;
  overflow: ${({ $scroll }) => ($scroll ? "auto" : "hidden")};
`;

const List = styled.ul`
  list-style: none;
  display: grid;
  gap: calc(8px * var(--fit));
  padding: 12px;
  grid-template-columns: ${({ $small }) =>
    $small ? "1fr" : "repeat(auto-fill, minmax(calc(150px * var(--fit)), 1fr))"};

  li {
    padding: ${({ $small }) =>
      $small ? "calc(8px * var(--fit)) 12px" : "calc(12px * var(--fit)) 14px"};
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.06);
    border-left: 3px solid ${({ $color }) => $color};
    font-size: ${({ $small }) =>
      $small ? "calc(15px * var(--fit))" : "calc(clamp(15px, 1.15vw, 20px) * var(--fit))"};
    font-weight: 600;
    color: #f1f5f9;
    overflow-wrap: anywhere;
  }
`;

const Empty = styled.p`
  padding: 18px;
  color: #64748b;
  font-size: 14px;
`;

const DateTag = styled.p`
  margin: 12px 12px 0;
  padding: calc(8px * var(--fit)) 12px;
  border-radius: 10px;
  background: rgba(13, 148, 136, 0.18);
  color: #5eead4;
  font-weight: 600;
  font-size: calc(14px * var(--fit));
`;

const ToolButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: ${({ $primary }) => ($primary ? "#e30613" : "rgba(255,255,255,0.06)")};
  border-color: ${({ $primary }) => ($primary ? "#e30613" : "rgba(255,255,255,0.14)")};
  color: #f1f5f9;
  font-size: 13px;
  font-weight: 600;

  &:hover {
    background: ${({ $primary }) => ($primary ? "#b0040f" : "rgba(255,255,255,0.12)")};
  }
`;

const EditHint = styled.p`
  margin: -6px 0 14px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.25);
  color: #bae6fd;
  font-size: 14px;
`;

const Column = ({ situation, items, small, editing, children }) => {
  const { ref, overflowing } = useFitContent([items.length, items.map((i) => i.name).join("|")]);
  return (
    <Panel $color={situation.color} $small={small} $editing={editing}>
      <header className="drag-handle">
        <h2>
          {editing && <FiMove aria-hidden />}
          {situation.plural}
        </h2>
        <span>{items.length}</span>
      </header>
      <Content ref={ref} $scroll={overflowing}>
        {children}
        {items.length ? (
          <List $color={situation.color} $small={small}>
            {items.map((i) => (
              <li key={i.id}>{i.name}</li>
            ))}
          </List>
        ) : (
          <Empty>Nenhum equipamento</Empty>
        )}
      </Content>
    </Panel>
  );
};

export const BoardPage = () => {
  const { bySituation, error, lastUpdate } = useEquipments();
  const [layout, setLayout] = useState(loadLayout);
  const [editing, setEditing] = useState(false);
  const narrow = useIsNarrow();
  const gridRef = useRef(null);
  const rowHeight = useRowHeight(gridRef, [editing, narrow]);

  const get = (v) => bySituation[v] || [];

  const renderPanel = ({ i, small }) => (
    <Column key={i} situation={getSituation(i)} items={get(i)} small={small} editing={editing}>
      {i === "Proximo-dia" &&
        get("Data").map((d) => <DateTag key={d.id}>{d.name}</DateTag>)}
    </Column>
  );

  const handleChange = useCallback((next) => {
    const limited = withLimits(next);
    setLayout(limited);
    saveLayout(limited);
  }, []);

  const handleReset = () => {
    clearLayout();
    setLayout(withLimits(DEFAULT_LAYOUT));
  };

  const actions = narrow ? null : editing ? (
    <>
      <ToolButton type="button" onClick={handleReset}>
        <FiRotateCcw aria-hidden /> Restaurar padrão
      </ToolButton>
      <ToolButton type="button" $primary onClick={() => setEditing(false)}>
        <FiCheck aria-hidden /> Concluir
      </ToolButton>
    </>
  ) : (
    <ToolButton type="button" onClick={() => setEditing(true)}>
      <FiMove aria-hidden /> Organizar
    </ToolButton>
  );

  return (
    <BoardShell
      title="Situação dos equipamentos"
      error={error}
      lastUpdate={lastUpdate}
      actions={actions}
    >
      {editing && (
        <EditHint>
          Arraste os quadros pelo título e mude o tamanho pelo canto inferior direito. O layout
          fica salvo neste navegador, então cada TV pode ter o seu.
        </EditHint>
      )}
      {narrow ? (
        <Stack>{PANELS.map(renderPanel)}</Stack>
      ) : (
        <GridArea ref={gridRef} $editing={editing}>
          <Grid
            layout={layout}
            cols={COLS}
            maxRows={ROWS}
            rowHeight={rowHeight}
            margin={[GAP, GAP]}
            containerPadding={[GAP, 0]}
            isDraggable={editing}
            isResizable={editing}
            draggableHandle=".drag-handle"
            compactType="vertical"
            onDragStop={handleChange}
            onResizeStop={handleChange}
          >
            {PANELS.map((p) => (
              <div key={p.i}>{renderPanel(p)}</div>
            ))}
          </Grid>
        </GridArea>
      )}
    </BoardShell>
  );
};
