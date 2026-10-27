import { useLayoutEffect, useRef, useState } from "react";

// Diminui a escala do conteúdo (via --fit) até ele caber no quadro.
// Se nem na escala mínima couber, o quadro passa a rolar.
const MIN = 0.5;
const STEP = 0.05;

export function useFitContent(deps = []) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const fit = () => {
      let s = 1;
      el.style.setProperty("--fit", s);
      while (el.scrollHeight > el.clientHeight + 1 && s > MIN) {
        s = Math.max(MIN, +(s - STEP).toFixed(2));
        el.style.setProperty("--fit", s);
      }
      setScale(s);
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ref, scale, overflowing: scale <= MIN };
}
