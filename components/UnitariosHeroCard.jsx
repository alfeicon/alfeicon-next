// components/UnitariosHeroCard.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

export default function UnitariosHeroCard({ juegos, total: totalProp }) {
  const total = useMemo(() => {
    if (Array.isArray(juegos)) return juegos.length;
    const n = Number(totalProp ?? 0);
    return Number.isFinite(n) ? n : 0;
  }, [juegos, totalProp]);

  const [count, setCount] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = total;
    const DURATION = 900;
    const ease = (t) => 1 - Math.pow(1 - t, 3);

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
    >
      <div className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative grid items-start gap-8 lg:grid-cols-[1.3fr_.7fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold tracking-[0.22em] text-white/80">
            Juegos unitarios Nintendo Switch
          </span>

          <p className="max-w-3xl text-lg sm:text-xl leading-relaxed text-white/85">
            <strong className="font-semibold">Cuentas Primarias</strong> — Compra
            juegos individuales y juégalos directamente desde tu usuario.
            Escríbenos por WhatsApp si necesitas ayuda para elegir. 🎮
          </p>

          <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/85 flex items-center gap-3">
            <span className="text-xl">💡</span>
            <p>
              <strong>Recuerda:</strong> Para comprar un juego unitario, simplemente haz{" "}
              <span className="font-semibold">click</span> en el juego que te interese.
            </p>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/20 p-6 sm:p-8">
          <div className="mb-3 text-xs font-semibold tracking-[0.25em] text-white/70">
            JUEGOS DISPONIBLES
          </div>

          <div className="leading-none">
            <div
              className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent font-black"
              style={{ fontSize: "clamp(48px, 8vw, 76px)" }}
            >
              {count}
            </div>
          </div>

          <p className="mt-6 text-sm text-white/70 italic">
            ⚡ Sincronizados con <br /> nuestra base de datos.
          </p>

          <Link
            href="/unitarios?ofertas=1#unitarios"
            className="mt-6 inline-block rounded-full bg-emerald-400 text-[#0e1226] font-semibold px-5 py-2 text-sm shadow-md hover:bg-emerald-300 transition"
          >
            Ver ofertas disponibles
          </Link>
        </div>
      </div>
    </section>
  );
}