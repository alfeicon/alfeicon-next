// components/PacksToolbar.jsx
"use client";

import { useMemo } from "react";
import {
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
// 👇 AHORA usamos la card especial del catálogo
import PackCardCatalog from "@/components/PackCardCatalog";

function toArray(juegos) {
  if (Array.isArray(juegos)) return juegos;
  if (!juegos) return [];
  return String(juegos)
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function PacksToolbar({ packs = [] }) {
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // filtros que vienen desde la barra de búsqueda
  const rawQ = (sp.get("q") || "").toLowerCase();
  const minParam = sp.get("min");
  const maxParam = sp.get("max");

  const {
    data,
    total,
    filtered,
    hayFiltros,
    tokens,
    minV,
    maxV,
  } = useMemo(() => {
    // normalizar packs
    let out = [...packs].map((p) => ({
      ...p,
      id: Number(p.id),
      titulo: (p.titulo || "").trim(),
      estado: (p.estado || "").trim(),
      precioCLP: Number(p.precioCLP || 0),
      juegos: toArray(p.juegos),
      consola: p.consola || "Nintendo Switch",
    }));

    const totalPacks = out.length;

    // helper para normalizar texto (case-insensitive y sin acentos)
    const normalize = (str) =>
      (str || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    // ---- filtros de texto (q puede venir con comas) ----
    const tokens = rawQ
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const normalizedTokens = tokens.map((t) => normalize(t));

    if (normalizedTokens.length > 0) {
      out = out.filter((p) => {
        const tituloNorm = normalize(p.titulo || `Pack #${p.id}`);
        const juegosNorm = p.juegos.map((j) => normalize(j));
        return normalizedTokens.some(
          (t) =>
            tituloNorm.includes(t) ||
            juegosNorm.some((j) => j.includes(t))
        );
      });
    }

    // ---- filtros de precio ----
    const minV =
      minParam !== null && minParam !== "" ? Number(minParam) : null;
    const maxV =
      maxParam !== null && maxParam !== "" ? Number(maxParam) : null;

    if (minV != null && !Number.isNaN(minV)) {
      out = out.filter((p) => (p.precioCLP || 0) >= minV);
    }
    if (maxV != null && !Number.isNaN(maxV)) {
      out = out.filter((p) => (p.precioCLP || 0) <= maxV);
    }

    // ordenar siempre por ID
    out.sort((a, b) => (a.id || 0) - (b.id || 0));

    const filtrosActivos =
      tokens.length > 0 || minV != null || maxV != null;

    return {
      data: out,
      total: totalPacks,
      filtered: out.length,
      hayFiltros: filtrosActivos,
      tokens,
      minV,
      maxV,
    };
  }, [packs, rawQ, minParam, maxParam]);

  // ========= helpers para modificar la URL (igual que en Unitarios) =========
  const pushWithParams = (mutateFn) => {
    const params = new URLSearchParams(sp.toString());
    mutateFn(params);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const clearBusqueda = () => pushWithParams((p) => p.delete("q"));
  const clearMin = () => pushWithParams((p) => p.delete("min"));
  const clearMax = () => pushWithParams((p) => p.delete("max"));
  const clearAll = () => router.push(pathname);

  return (
    <>
      {hayFiltros && (
        <div className="mt-2 mb-4 space-y-2">
          {/* Texto de coincidencias: igual que Unitarios */}
          <p className="text-sm text-white/75 text-center sm:text-left">
            Resultado de tu búsqueda:{" "}
            <span className="font-semibold">
              {filtered} coincidencia{filtered === 1 ? "" : "s"}
            </span>
          </p>

          {/* Barra de chips de filtros activos */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="text-white/60 mr-1">Filtros activos:</span>

            {tokens.length > 0 && (
              <button
                type="button"
                onClick={clearBusqueda}
                className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-white/80 border border-white/15 hover:bg-white/10 transition"
              >
                <span>Búsqueda: “{tokens.join(", ")}”</span>
                <span className="text-[10px]">✕</span>
              </button>
            )}

            {minV != null && !Number.isNaN(minV) && (
              <button
                type="button"
                onClick={clearMin}
                className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-white/80 border border-white/15 hover:bg-white/10 transition"
              >
                <span>Mín: ${minV.toLocaleString("es-CL")}</span>
                <span className="text-[10px]">✕</span>
              </button>
            )}

            {maxV != null && !Number.isNaN(maxV) && (
              <button
                type="button"
                onClick={clearMax}
                className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-white/80 border border-white/15 hover:bg-white/10 transition"
              >
                <span>Máx: ${maxV.toLocaleString("es-CL")}</span>
                <span className="text-[10px]">✕</span>
              </button>
            )}

            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 rounded-full bg-transparent px-3 py-1 text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/15 transition"
            >
              Borrar todos
            </button>
          </div>
        </div>
      )}

      {/* Grid de cards (catálogo) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((p) => (
          <PackCardCatalog
            key={p.id ?? `${p.titulo}-${Math.random()}`}
            pack={p}
          />
        ))}

        {data.length === 0 && (
          <div className="col-span-full text-center text-white/60 py-10">
            No se encontraron packs con esos filtros.
          </div>
        )}
      </div>
    </>
  );
}