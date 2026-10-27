import React from "react";
import styled from "styled-components";
import { FiPrinter } from "react-icons/fi";
import { AppHeader } from "../components/AppHeader";
import { useEquipments } from "../hooks/useEquipments";
import { POSITIONS, STATUS, getSituation } from "../constants/situations";
import logo from "../Images/portonave-logo.png";

// Substitui os botões de PDF da versão original: a página já sai formatada
// para impressão, e "Salvar como PDF" do navegador gera o arquivo.

const Sheet = styled.main`
  max-width: 900px;
  margin: 24px auto;
  padding: 40px 48px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);

  @media (max-width: 720px) {
    margin: 0;
    padding: 24px 16px;
    border-radius: 0;
  }

  @media print {
    margin: 0;
    padding: 0;
    border: 0;
    box-shadow: none;
    max-width: none;
  }
`;

const Head = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--text);

  img {
    height: 28px;
  }

  h1 {
    font-size: 22px;
  }

  p {
    font-size: 13px;
    color: var(--muted);
  }
`;

const PrintButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 10px;
  background: var(--brand);
  color: #fff;
  font-weight: 600;

  @media print {
    display: none;
  }
`;

const Block = styled.section`
  margin-top: 28px;
  break-inside: avoid;

  h2 {
    font-size: 15px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    padding: 8px 10px;
    border-bottom: 1px solid var(--border);
    text-align: left;
    vertical-align: top;
  }

  th {
    font-size: 12px;
    color: var(--muted);
    font-weight: 600;
  }

  td:first-child {
    width: 34%;
    font-weight: 600;
  }

  td small {
    color: var(--muted);
  }

  tr {
    break-inside: avoid;
  }
`;

const Dot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 8px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
`;

export const ReportPage = () => {
  const { bySituation } = useEquipments();
  const get = (v) => bySituation[v] || [];
  const groups = [...STATUS, getSituation("Reserva"), getSituation("Apoio")];

  return (
    <>
      <AppHeader>
        <small>Relatório</small>
      </AppHeader>
      <Sheet>
        <Head>
          <div>
            <img src={logo} alt="Portonave" />
            <h1>Status dos equipamentos</h1>
            <p>Gerado em {new Date().toLocaleString("pt-BR")}</p>
          </div>
          <PrintButton type="button" onClick={() => window.print()}>
            <FiPrinter aria-hidden /> Imprimir / salvar PDF
          </PrintButton>
        </Head>

        <Block>
          <h2>Equipamentos</h2>
          <Table>
            <thead>
              <tr>
                <th>Situação</th>
                <th>Equipamentos</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((s) => (
                <tr key={s.value}>
                  <td>
                    <Dot $color={s.color} />
                    {s.plural} ({get(s.value).length})
                  </td>
                  <td>{get(s.value).map((i) => i.name).join(", ") || <small>—</small>}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Block>

        <Block>
          <h2>Localização dos spreaders</h2>
          <Table>
            <thead>
              <tr>
                <th>Posição</th>
                <th>Spreader</th>
              </tr>
            </thead>
            <tbody>
              {POSITIONS.map((p) => (
                <tr key={p}>
                  <td>{p}</td>
                  <td>
                    {get(p).length ? (
                      get(p).map((i) => (
                        <div key={i.id}>
                          {i.name} <small>· {i.updated || i.created}</small>
                        </div>
                      ))
                    ) : (
                      <small>Livre</small>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Block>
      </Sheet>
    </>
  );
};
