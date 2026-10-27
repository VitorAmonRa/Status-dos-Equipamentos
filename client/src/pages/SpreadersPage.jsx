import React from "react";
import styled from "styled-components";
import { BoardShell } from "../components/BoardShell";
import { useEquipments } from "../hooks/useEquipments";
import { POSITIONS, POSITION_COLOR } from "../constants/situations";

const Section = styled.section`
  & + & {
    margin-top: 24px;
  }

  h2 {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 650;
    color: #cbd5e1;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  h2 small {
    font-size: 13px;
    color: #64748b;
    text-transform: none;
    letter-spacing: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Tile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 104px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid ${({ $filled }) => ($filled ? `${POSITION_COLOR}80` : "rgba(255,255,255,0.07)")};
  background: ${({ $filled }) =>
    $filled ? `linear-gradient(160deg, ${POSITION_COLOR}40, ${POSITION_COLOR}14)` : "rgba(255,255,255,0.03)"};

  span {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: ${({ $filled }) => ($filled ? "#67e8f9" : "#64748b")};
  }

  strong {
    font-size: clamp(18px, 1.6vw, 26px);
    font-weight: 700;
    color: #fff;
    line-height: 1.15;
    overflow-wrap: anywhere;
  }

  em {
    font-style: normal;
    font-size: 15px;
    color: #475569;
  }
`;

const PositionGrid = ({ positions, bySituation }) => (
  <Grid>
    {positions.map((p) => {
      const list = bySituation[p] || [];
      return (
        <Tile key={p} $filled={list.length > 0}>
          <span>{p}</span>
          {list.length ? list.map((i) => <strong key={i.id}>{i.name}</strong>) : <em>Livre</em>}
        </Tile>
      );
    })}
  </Grid>
);

export const SpreadersPage = () => {
  const { bySituation, error, lastUpdate } = useEquipments();
  const rt = POSITIONS.filter((p) => p.startsWith("RT"));
  const st = POSITIONS.filter((p) => p.startsWith("ST"));
  const filled = (list) => list.filter((p) => bySituation[p]?.length).length;

  return (
    <BoardShell title="Localização dos spreaders" error={error} lastUpdate={lastUpdate}>
      <Section>
        <h2>
          RT <small>{filled(rt)} de {rt.length} ocupadas</small>
        </h2>
        <PositionGrid positions={rt} bySituation={bySituation} />
      </Section>
      <Section>
        <h2>
          ST <small>{filled(st)} de {st.length} ocupadas</small>
        </h2>
        <PositionGrid positions={st} bySituation={bySituation} />
      </Section>
    </BoardShell>
  );
};
