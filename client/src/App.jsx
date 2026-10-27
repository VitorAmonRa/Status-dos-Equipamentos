import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyle from "./styles/GlobalStyle";
import { PrivateRoute } from "./components/PrivateRoute";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import { BoardPage } from "./pages/BoardPage";
import { SpreadersPage } from "./pages/SpreadersPage";
import { ReportPage } from "./pages/ReportPage";

// As rotas /PreviewPage e /PreviewSpreaderPage têm o mesmo endereço da versão
// original, para que TVs e favoritos continuem funcionando.
function App() {
  return (
    <>
      <GlobalStyle />
      <ToastContainer position="bottom-right" autoClose={2500} limit={4} newestOnTop />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/PreviewPage" element={<BoardPage />} />
          <Route path="/PreviewSpreaderPage" element={<SpreadersPage />} />
          <Route path="/relatorio" element={<ReportPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
