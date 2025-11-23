// components/PacksHeroCard.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Acepta:
 *  - packs: array de packs
 *  - o total (number) + disponibles (number)
 */
export default function PacksHeroCard({ packs, total: totalProp, disponibles: dispProp }) {
  /* ===== Totales normalizados ===== */
  const total = useMemo(() => {
    if (Array.isArray(packs)) return packs.length;
    const n = Number(totalProp ?? 0);
    return Number.isFinite(n) ? n : 0;
  }, [packs, totalProp]);

  const disponibles = useMemo(() => {
    if (typeof dispProp === "number") return dispProp;
    if (Array.isArray(packs)) {
      return packs.filter(p => String(p?.estado || "").toLowerCase().includes("dispon")).length;
    }
    return 0;
  }, [packs, dispProp]);

  /* ===== Contador animado ===== */
  const [count, setCount] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = total;
    const DURATION = 900; // ms
    const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

    const step = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      const v = Math.round(from + (to - from) * ease(t));
      setCount(v);
      if (t < 1) raf.current = requestAnimationFrame(step);
    };

    cancelAnimationFrame(raf.current || 0);
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current || 0);
  }, [total]);

  return (
    <section
      className="relative mb-10 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#16192c] via-[#13162a] to-[#0f1226] p-6 sm:p-10"
      style={{
        boxShadow:
          "0 24px 60px rgba(3,6,24,.45), inset 0 1px 0 rgba(255,255,255,.05)",
      }}
      aria-label={`Resumen del catálogo: ${total} packs activos`}
    >
      {/* Glows decorativos */}
      <div className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative grid items-start gap-8 lg:grid-cols-[1.3fr_.7fr]">
        {/* ===== Texto principal ===== */}
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold tracking-[0.22em] text-white/80">
            Pack de Juegos Nintendo Switch
          </span>

          <p className="max-w-3xl text-lg sm:text-xl leading-relaxed text-white/85">
            <strong className="font-semibold">Cuentas Primarias</strong> — Juega
            directamente desde tu usuario sin problemas. 👾
          </p>

          {/* ===== Recordatorio añadido ===== */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur-sm">
            💡 <span className="font-semibold">Recuerda:</span>{" "}
            Para comprar un pack, simplemente haz <strong>click</strong> en el pack que te interese.
          </div>
        </div>

        {/* ===== Métrica principal ===== */}
        <div className="rounded-[24px] border border-white/10 bg-black/20 p-6 sm:p-8">
          <div className="mb-3 text-xs font-semibold tracking-[0.25em] text-white/70">
            DISPONIBLES
          </div>

          <div className="flex items-end gap-4">
            <div className="leading-none">
              <div
                className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent font-black"
                style={{ fontSize: "clamp(48px, 8vw, 76px)" }}
                aria-live="polite"
              >
                {count}
              </div>
              <div className="mt-2 text-white/70">packs activos</div>
            </div>
          </div>

          <p className="mt-6 text-sm text-white/70 italic">
            ⚡ Sincronizados con <br />nuestra base de datos
          </p>
        </div>
      </div>
    </section>
  );
}