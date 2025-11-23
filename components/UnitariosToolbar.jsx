// components/UnitariosToolbar.jsx
"use client";

import { useMemo } from "react";
import {
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import UnitarioCard from "@/components/UnitarioCard";

export default function UnitariosToolbar({ juegos = [] }) {
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const rawQ = (sp.get("q") || "").trim().toLowerCase();
  const minParam = sp.get("min");
  const maxParam = sp.get("max");
  const soloOfertas = sp.get("ofertas") === "1";

  // nombre principal del juego (ajustable a tu Sheet)
  const getNombre = (j) =>
    j.nombre ||
    j.juego ||
    j.titulo ||
    j.Titulo ||
    j.Nombre ||
    j.nombre_juego ||
    "";

  // normaliza texto (sin acentos, minúsculas)
  const normalize = (str) =>
    (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const { data, filtered, hayFiltros, minV, maxV } = useMemo(() => {
    let out = [...juegos];

    // === BÚSQUEDA POR NOMBRE ===
    if (rawQ) {
      const termNorm = normalize(rawQ);
      out = out.filter((j) => {
        const nombreNorm = normalize(getNombre(j));
        return nombreNorm.includes(termNorm);
      });
    }

    // === FILTROS POR PRECIO ===
    const precioBase = (j) =>
      j.precioOfertaCLP ?? j.precioCLP ?? j.precio ?? 0;

    const minV =
      minParam !== null && minParam !== "" ? Number(minParam) : null;
    const maxV =
      maxParam !== null && maxParam !== "" ? Number(maxParam) : null;

    if (minV != null && !Number.isNaN(minV)) {
      out = out.filter((j) => precioBase(j) >= minV);
    }
    if (maxV != null && !Number.isNaN(maxV)) {
      out = out.filter((j) => precioBase(j) <= maxV);
    }

    // === SOLO OFERTAS ===
    if (soloOfertas) {
      out = out.filter((j) => j.enOferta);
    }

    const filtrosActivos =
      Boolean(rawQ) || minV != null || maxV != null || soloOfertas;

    return {
      data: out,
      filtered: out.length,
      hayFiltros: filtrosActivos,
      minV,
      maxV,
    };
  }, [juegos, rawQ, minParam, maxParam, soloOfertas]);

  // ========= helpers URL =========
  const pushWithParams = (mutateFn) => {
    const params = new URLSearchParams(sp.toString());
    mutateFn(params);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const clearBusqueda = () => pushWithParams((p) => p.delete("q"));
  const clearMin = () => pushWithParams((p) => p.delete("min"));
  const clearMax = () => pushWithParams((p) => p.delete("max"));
  const clearOfertas = () => pushWithParams((p) => p.delete("ofertas"));
  const clearAll = () => router.push(pathname);

  return (
    <>
      {/* Chips de filtros activos */}
      {hayFiltros && (
        <div className="mt-2 mb-4 space-y-2">
          <p className="text-sm text-white/75 text-center sm:text-left">
            Resultado de tu búsqueda:{" "}
            <span className="font-semibold">
              {filtered} coincidencia{filtered === 1 ? "" : "s"}
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="text-white/60 mr-1">Filtros activos:</span>

            {rawQ && (
              <button
                onClick={clearBusqueda}
                className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-white/80 border border-white/15 hover:bg-white/10 transition"
              >
                <span>Búsqueda: “{rawQ}”</span>
                <span className="text-[10px]">✕</span>
              </button>
            )}

            {minV != null && !Number.isNaN(minV) && (
              <button
                onClick={clearMin}
                className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-white/80 border border-white/15 hover:bg-white/10 transition"
              >
                <span>Mín: ${minV.toLocaleString("es-CL")}</span>
                <span className="text-[10px]">✕</span>
              </button>
            )}

            {maxV != null && !Number.isNaN(maxV) && (
              <button
                onClick={clearMax}
                className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-white/80 border border-white/15 hover:bg-white/10 transition"
              >
                <span>Máx: ${maxV.toLocaleString("es-CL")}</span>
                <span className="text-[10px]">✕</span>
              </button>
            )}

            {soloOfertas && (
              <button
                onClick={clearOfertas}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-200 border border-emerald-400/40 hover:bg-emerald-500/25 transition"
              >
                <span>En oferta</span>
                <span className="text-[10px]">✕</span>
              </button>
            )}

            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1 rounded-full bg-transparent px-3 py-1 text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/15 transition"
            >
              Borrar todos
            </button>
          </div>
        </div>
      )}

      {/* Grid de cartas: 1 columna en móvil, 2 en tablet, 3 en desktop */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {data.map((juego, idx) => (
          <UnitarioCard
            key={juego.id ?? `${getNombre(juego)}-${idx}`}
            juego={juego}
          />
        ))}

        {data.length === 0 && (
          <div className="col-span-full text-center text-white/60 py-10">
            No se encontraron juegos con esos filtros.
          </div>
        )}
      </div>
    </>
  );
}