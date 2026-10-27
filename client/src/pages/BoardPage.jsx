import React from "react";
import styled from "styled-components";
import { BoardShell } from "../components/BoardShell";
import { useEquipments } from "../hooks/useEquipments";
import { STATUS, getSituation } from "../constants/situations";

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(260px, 0.9fr);
  gap: 16px;
  align-items: start;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Side = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 1280px) {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
`;

const Panel = styled.section`
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  overflow: hidden;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 18px;
    border-top: 4px solid ${({ $color }) => $color};
    background: linear-gradient(180deg, ${({ $color }) => $color}26, transparent);
  }

  h2 {
    font-size: ${({ $small }) => ($small ? "16px" : "clamp(18px, 1.6vw, 24px)")};
    font-weight: 650;
    color: #fff;
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

const List = styled.ul`
  list-style: none;
  display: grid;
  gap: 8px;
  padding: 12px;
  grid-template-columns: ${({ $small }) => ($small ? "1fr" : "repeat(auto-fill, minmax(150px, 1fr))")};

  li {
    padding: ${({ $small }) => ($small ? "8px 12px" : "12px 14px")};
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.06);
    border-left: 3px solid ${({ $color }) => $color};
    font-size: ${({ $small }) => ($small ? "15px" : "clamp(15px, 1.15vw, 20px)")};
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
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(13, 148, 136, 0.18);
  color: #5eead4;
  font-weight: 600;
  font-size: 14px;
`;

const Column = ({ situation, items, small, children }) => (
  <Panel $color={situation.color} $small={small}>
    <header>
      <h2>{situation.plural}</h2>
      <span>{items.length}</span>
    </header>
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
  </Panel>
);

export const BoardPage = () => {
  const { bySituation, error, lastUpdate } = useEquipments();
  const get = (v) => bySituation[v] || [];
  const dates = get("Data");

  return (
    <BoardShell title="Situação dos equipamentos" error={error} lastUpdate={lastUpdate}>
      <Layout>
        {STATUS.map((s) => (
          <Column key={s.value} situation={s} items={get(s.value)} />
        ))}
        <Side>
          <Column situation={getSituation("Apoio")} items={get("Apoio")} small />
          <Column situation={getSituation("Reserva")} items={get("Reserva")} small />
          <Column situation={getSituation("Proximo-dia")} items={get("Proximo-dia")} small>
            {dates.map((d) => (
              <DateTag key={d.id}>{d.name}</DateTag>
            ))}
          </Column>
        </Side>
      </Layout>
    </BoardShell>
  );
};
