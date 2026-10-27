import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import { FiArrowRight, FiMonitor } from "react-icons/fi";
import { login } from "../services/session";
import logo from "../Images/portonave-logo.png";
import photo from "../Images/imagemUm.jpg";

const Page = styled.main`
  display: grid;
  grid-template-columns: minmax(360px, 480px) 1fr;
  min-height: 100vh;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Side = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  padding: 48px clamp(24px, 6vw, 64px);
  background: var(--surface);

  img {
    width: 180px;
  }

  h1 {
    font-size: 28px;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  p {
    margin-top: 8px;
    color: var(--muted);
  }
`;

const Photo = styled.div`
  position: relative;
  background: url(${photo}) center / cover no-repeat;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, rgba(8, 13, 24, 0.55), rgba(8, 13, 24, 0.1));
  }

  @media (max-width: 860px) {
    display: none;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
  }

  input {
    height: 46px;
    padding: 0 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #f8fafc;
    transition: border-color 0.15s, background 0.15s;
  }

  input:focus {
    outline: none;
    border-color: var(--brand);
    background: #fff;
  }
`;

const Primary = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 46px;
  margin-top: 8px;
  border: 0;
  border-radius: 10px;
  background: var(--brand);
  color: #fff;
  font-weight: 600;
  transition: background 0.15s;

  &:hover {
    background: var(--brand-dark);
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

const Secondary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--muted);

  &:hover {
    color: var(--text);
  }
`;

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha e-mail e senha");
      return;
    }
    setBusy(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch {
      toast.error("E-mail ou senha incorretos");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page>
      <Side>
        <img src={logo} alt="Portonave" />
        <div>
          <h1>Status dos Equipamentos</h1>
          <p>Entre para atualizar a situação dos equipamentos e spreaders.</p>
        </div>
        <Form onSubmit={handleLogin}>
          <label>
            E-mail
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <Primary type="submit" disabled={busy}>
            {busy ? "Entrando…" : "Entrar"} <FiArrowRight aria-hidden />
          </Primary>
        </Form>
        <Secondary to="/PreviewPage">
          <FiMonitor aria-hidden /> Ver o painel sem entrar
        </Secondary>
      </Side>
      <Photo aria-hidden />
    </Page>
  );
};
