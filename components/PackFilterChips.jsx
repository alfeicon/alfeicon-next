// components/PackFilterChips.jsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function formatCLP(value) {
  const n = Number(value);
  if (!n) return null;
  return n.toLocaleString("es-CL");
}

export default function PackFilterChips() {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const q   = sp.get("q")   || "";
  const min = sp.get("min") || "";
  const max = sp.get("max") || "";

  const hasFilters = q.trim() || min || max;
  if (!hasFilters) return null; // si no hay filtros, no se muestra nada

  function updateParams(patch) {
    const params = new URLSearchParams(sp.toString());

    Object.entries(patch).forEach(([key, val]) => {
      if (!val) params.delete(key);
      else params.set(key, val);
    });

    const qs = params.toString();
    router.push(`${pathname}${qs ? "?" + qs : ""}`, { scroll: true });
  }

  const minTxt = min ? formatCLP(min) : null;
  const maxTxt = max ? formatCLP(max) : null;

  return (
    <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm text-white/80">
      <span className="mr-1 text-xs uppercase tracking-wide text-white/50">
        Filtros:
      </span>

      {q.trim() && (
        <button
          onClick={() => updateParams({ q: null })}
          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 hover:bg-white/10"
        >
          <span>{q}</span>
          <span className="text-xs text-white/60">×</span>
        </button>
      )}

      {minTxt && (
        <button
          onClick={() => updateParams({ min: null })}
          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 hover:bg-white/10"
        >
          <span>Min ${minTxt}</span>
          <span className="text-xs text-white/60">×</span>
        </button>
      )}

      {maxTxt && (
        <button
          onClick={() => updateParams({ max: null })}
          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 hover:bg-white/10"
        >
          <span>Max ${maxTxt}</span>
          <span className="text-xs text-white/60">×</span>
        </button>
      )}

      {/* Limpiar TODOS los filtros */}
      <button
        onClick={() => updateParams({ q: null, min: null, max: null })}
        className="ml-1 inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-white/70 hover:bg-white/10"
      >
        Limpiar filtros
      </button>
    </div>
  );
}