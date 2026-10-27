import React from "react";
import styled from "styled-components";
import { AppHeader } from "./AppHeader";
import { useClock } from "../hooks/useEquipments";

// Moldura escura dos painéis que ficam nas TVs (Painel e Spreaders).

const Page = styled.div`
  min-height: 100vh;
  background: radial-gradient(1200px 600px at 10% -10%, #1e293b 0%, transparent 60%), #080d18;
  color: #e2e8f0;
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #94a3b8;

  b {
    color: #e2e8f0;
    font-size: 22px;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.01em;
  }
`;

const Live = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${({ $ok }) => ($ok ? "#4ade80" : "#f87171")};
  font-weight: 600;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 0 0 currentColor;
    animation: ${({ $ok }) => ($ok ? "pulse 2s infinite" : "none")};
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.6); }
    70% { box-shadow: 0 0 0 8px rgba(74, 222, 128, 0); }
    100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
  }
`;

const Body = styled.main`
  padding: 20px 24px 28px;

  @media (max-width: 720px) {
    padding: 16px;
  }
`;

const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;

  h1 {
    font-size: clamp(22px, 2.2vw, 34px);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #fff;
  }
`;

const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
});

export const BoardShell = ({ title, error, lastUpdate, actions, children }) => {
  const now = useClock();
  return (
    <Page>
      <AppHeader dark />
      <Body>
        <TitleRow>
          <h1>{title}</h1>
          <Status>
            <Live $ok={!error}>{error ? "Sem conexão" : "Ao vivo"}</Live>
            {lastUpdate && <span>Atualizado {lastUpdate.toLocaleTimeString("pt-BR")}</span>}
            <span>{dateFmt.format(now)}</span>
            <b>{now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</b>
            {actions}
          </Status>
        </TitleRow>
        {children}
      </Body>
    </Page>
  );
};
