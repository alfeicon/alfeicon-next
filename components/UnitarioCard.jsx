// components/UnitarioCard.jsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

/* ===== Slug helper (para URL de detalle) ===== */
function slugify(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function UnitarioCard({ juego }) {
  const router = useRouter();

  const nombreDerivado =
    juego.nombre ||
    juego.juego ||
    juego.titulo ||
    juego.Nombre ||
    "Juego sin nombre";

  const {
    precioCLP,
    enOferta,
    precioOferta,
    precioOfertaCLP,
    espacio,
    imagen,
  } = juego;

  const precioNormal = Number(precioCLP || 0);

  const precioEnOfertaRaw =
    precioOfertaCLP != null && precioOfertaCLP !== ""
      ? Number(precioOfertaCLP)
      : precioOferta != null && precioOferta !== ""
      ? Number(precioOferta)
      : null;

  const tieneOferta =
    enOferta &&
    precioEnOfertaRaw != null &&
    !Number.isNaN(precioEnOfertaRaw) &&
    precioEnOfertaRaw > 0;

  const precioVisible =
    (tieneOferta ? precioEnOfertaRaw : precioNormal) || 0;

  const espacioTexto = espacio
    ? String(espacio).toUpperCase().includes("GB")
      ? String(espacio).toUpperCase()
      : `${String(espacio)} GB`
    : null;

  // 👉 slug SIEMPRE derivado del nombre (más estable que el id)
  const detalleSlug = slugify(nombreDerivado);

  const handleOpen = () => {
    router.push(`/unitarios/${detalleSlug}`);
  };

  return (
    <div
      className="group relative w-full max-w-[420px] mx-auto"
      onClick={handleOpen}
    >
      <div className="cursor-pointer flex flex-col h-full overflow-hidden rounded-[24px] border border-white/10 bg-[#050812] shadow-[0_18px_40px_rgba(3,6,24,0.65)] transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white/30">
        {/* Imagen tipo carta */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          {imagen ? (
            <Image
              src={imagen}
              alt={nombreDerivado}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-white/60 text-sm">
              Imagen no disponible
            </div>
          )}

          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(0,0,0,0),rgba(0,0,0,0.6))]" />
          <div className="absolute inset-0 ring-1 ring-white/10" />

          {tieneOferta && (
            <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-black">
              En oferta
            </span>
          )}

          {espacioTexto && (
            <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white/85 border border-white/20">
              {espacioTexto}
            </span>
          )}

          <span className="absolute left-3 bottom-3 inline-flex items-center rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 border border-white/20">
            Juego unitario
          </span>
        </div>

        {/* Contenido frontal */}
        <div className="flex flex-col flex-1 p-5 bg-gradient-to-b from-black/40 via-black/60 to-black/70 backdrop-blur-md">
          <h2 className="text-lg sm:text-xl font-semibold text-white leading-snug line-clamp-2">
            {nombreDerivado}
          </h2>

          {/* Precio abajo */}
          <div className="mt-auto pt-4 flex items-end justify-between gap-3">
            <div className="flex flex-col">
              {tieneOferta && (
                <span className="text-xs text-white/60 line-through">
                  ${precioNormal.toLocaleString("es-CL")}
                </span>
              )}

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                  ${precioVisible.toLocaleString("es-CL")}
                </span>
                <span className="text-[11px] font-semibold text-white/70">
                  CLP
                </span>
              </div>
            </div>

            <span className="text-[10px] text-white/45 text-right leading-tight">
              Toca para ver
              <br />
              más detalles →
            </span>
          </div>
        </div>
      </div>

      {/* Glow hover */}
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_0%_0%,rgba(94,234,212,0.12),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(129,140,248,0.18),transparent_55%),radial-gradient(circle_at_50%_100%,rgba(244,114,182,0.14),transparent_55%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}