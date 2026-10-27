import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { FiGrid, FiLogOut, FiMonitor, FiPrinter, FiSliders } from "react-icons/fi";
import logo from "../Images/portonave-logo.png";
import { logout } from "../services/session";
import { isDemo } from "../services/equipments";

const LINKS = [
  { to: "/", label: "Gestão", icon: FiSliders },
  { to: "/PreviewPage", label: "Painel", icon: FiMonitor },
  { to: "/PreviewSpreaderPage", label: "Spreaders", icon: FiGrid },
  { to: "/relatorio", label: "Relatório", icon: FiPrinter },
];

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);

  ${({ $dark }) =>
    $dark &&
    css`
      background: rgba(8, 13, 24, 0.85);
      border-bottom-color: rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
    `}

  @media (max-width: 720px) {
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px 16px;
  }

  @media print {
    display: none;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  img {
    height: 30px;
    width: auto;
    padding: 5px 8px;
    border-radius: 8px;
    background: #fff;
  }

  strong {
    font-size: 15px;
    font-weight: 650;
    white-space: nowrap;
  }

  small {
    display: block;
    font-size: 12px;
    opacity: 0.6;
    font-weight: 400;
  }

  @media (max-width: 720px) {
    flex-wrap: wrap;
    row-gap: 6px;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 4px;
  margin-left: auto;
  overflow-x: auto;

  a,
  button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 10px;
    border: 0;
    background: transparent;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0.75;
    transition: background 0.15s, opacity 0.15s;
  }

  a:hover,
  button:hover {
    opacity: 1;
    background: ${({ $dark }) => ($dark ? "rgba(255,255,255,0.08)" : "#eef1f5")};
  }

  a.active {
    opacity: 1;
    background: ${({ $dark }) => ($dark ? "rgba(255,255,255,0.12)" : "#fde8e9")};
    color: ${({ $dark }) => ($dark ? "#fff" : "var(--brand-dark)")};
  }

  @media (max-width: 720px) {
    width: 100%;
    margin-left: 0;
    span {
      display: none;
    }
  }
`;

const DemoTag = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 999px;
  background: #fef3c7;
  color: #92400e;
`;

export const AppHeader = ({ dark = false, children, showLogout = false }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <Bar $dark={dark}>
      <Brand>
        <img src={logo} alt="Portonave" />
        <div>
          <strong>Status dos Equipamentos</strong>
          {children}
        </div>
        {isDemo && <DemoTag>DEMONSTRAÇÃO</DemoTag>}
      </Brand>
      <Nav $dark={dark}>
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end>
            <Icon aria-hidden /> <span>{label}</span>
          </NavLink>
        ))}
        {showLogout && (
          <button type="button" onClick={handleLogout} title="Sair">
            <FiLogOut aria-hidden /> <span>Sair</span>
          </button>
        )}
      </Nav>
    </Bar>
  );
};
