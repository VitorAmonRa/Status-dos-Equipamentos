import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  :root {
    --brand: #e30613;
    --brand-dark: #b0040f;
    --bg: #f3f5f8;
    --surface: #ffffff;
    --border: #e2e7ee;
    --text: #0f172a;
    --muted: #64748b;
    --radius: 14px;
    --shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 4px 16px rgba(15, 23, 42, 0.05);
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    min-height: 100%;
  }

  body {
    font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }

  button, input, select, textarea {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  :focus-visible {
    outline: 2px solid var(--brand);
    outline-offset: 2px;
  }

  .Toastify__toast {
    border-radius: 10px;
    font-size: 14px;
  }
`;
