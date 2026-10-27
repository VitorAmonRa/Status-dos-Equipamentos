import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { watchUser } from "../services/session";

const Loading = styled.div`
  display: grid;
  place-items: center;
  min-height: 100vh;
  color: var(--muted);
  font-size: 15px;
`;

export const PrivateRoute = ({ children }) => {
  const [state, setState] = useState("loading");

  useEffect(() => watchUser((user) => setState(user ? "signed" : "anonymous")), []);

  if (state === "loading") return <Loading>Carregando…</Loading>;
  if (state === "anonymous") return <Navigate to="/login" replace />;
  return children;
};
