// components/PacksHomeCarousel.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PackCardClassic from "@/components/PackCardClassic";

// === helper: mismo slugify que usas en /unitarios/[slug] ===
function slugify(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// helper para subtítulo en el modal
function getSubtituloPack(pack) {
  if (!pack) return "";
  return pack.estado || pack.tipoCuenta || "Cuenta Primaria";
}

export default function PacksHomeCarousel({ packs = [] }) {
  const router = useRouter();
  const [packActivo, setPackActivo] = useState(null);

  // Bloquear scroll del body + ocultar navbar cuando el modal está abierto
  useEffect(() => {
    const navbar = document.getElementById("navbar-root");

    if (packActivo) {
      const scrollY = window.scrollY || window.pageYOffset;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";

      navbar?.classList.add("navbar-hidden");
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";

      if (top) {
        const y = parseInt(top.replace("-", "").replace("px", ""), 10) || 0;
        window.scrollTo(0, y);
      }

      navbar?.classList.remove("navbar-hidden");
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      navbar?.classList.remove("navbar-hidden");
    };
  }, [packActivo]);

  const abrirModal = (pack) => setPackActivo(pack);
  const cerrarModal = () => setPackActivo(null);

  const buildWhatsAppHref = (pack) => {
    if (!pack) return "#";
    const id = pack.id ?? "";
    const nombre = pack.titulo || `Pack ${id}`;
    const precio = Number(pack.precioCLP || 0).toLocaleString("es-CL");
    const texto = encodeURIComponent(
      `Hola! Me interesa el Pack ${id}: "${nombre}" por $${precio} CLP.`
    );
    return `https://wa.me/56926411278?text=${texto}`;
  };

  const comprarPack = () => {
    if (!packActivo) return;
    const href = buildWhatsAppHref(packActivo);
    window.open(href, "_blank");
  };

  // 👉 cuando haces click en un juego del pack
  const handleJuegoClick = (nombreJuego) => {
    if (!nombreJuego) return;
    const slug = slugify(nombreJuego);
    cerrarModal(); // cierro modal para que no quede detrás
    router.push(`/unitarios/${slug}`);
  };

  return (
    <>
      {/* ░░░ Carrusel inicio ░░░ */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-6 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory">
          {packs.map((p) => (
            <div
              key={p.id ?? p.titulo}
              className="shrink-0 w-[260px] sm:w-[280px] snap-start"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => abrirModal(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") abrirModal(p);
                }}
                className="
                  w-full text-left h-full cursor-pointer
                  transition-transform duration-200 ease-out
                  hover:-translate-y-1 hover:scale-[1.02]
                "
              >
                <div className="relative h-[500px] sm:h-[520px] overflow-hidden rounded-[24px]">
                  <div className="absolute inset-0">
                    <PackCardClassic
                      pack={p}
                      limitGames={3}
                      simpleMode={true}
                      compact={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ░░░ Modal de detalle del pack ░░░ */}
      {packActivo && (
        <div
          className="
            fixed inset-0 z-40 
            flex 
            items-start sm:items-center
            justify-center 
            px-2 sm:px-4
            pt-[calc(env(safe-area-inset-top)+12px)]
            pb-[calc(env(safe-area-inset-bottom)+12px)]
            pointer-events-auto
          "
        >
          {/* Fondo oscuro */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={cerrarModal}
          />

          {/* Contenido del modal */}
          <div
            className="
              relative z-50 
              w-full max-w-3xl 
              max-h-[calc(100svh-30px)] sm:max-h-[90vh]
              overflow-y-auto
              rounded-3xl bg-[#050814]
              border border-white/15
              shadow-[0_24px_70px_rgba(0,0,0,0.85)]
              flex flex-col
              pointer-events-auto
            "
          >
            {/* Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-white/10">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-[0.24em] font-semibold">
                  Detalle del pack
                </p>

                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {packActivo.id ? `Pack ${packActivo.id}` : "Pack"}
                </h2>

                <p className="mt-1 text-sm text-white/70">
                  {getSubtituloPack(packActivo)}
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarModal}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {/* Info fija */}
            <div className="px-5 pt-4 pb-3 border-b border-white/10 text-sm text-white/80">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-[0.24em] font-semibold">
                    Información
                  </p>
                  <p className="mt-1">
                    {packActivo.consola || "Nintendo Switch"}{" "}
                    {packActivo.estado ? `• ${packActivo.estado}` : null}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/60">Precio</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">
                    $
                    {Number(packActivo.precioCLP || 0).toLocaleString("es-CL")}{" "}
                    <span className="text-xs font-semibold text-white/60 align-middle">
                      CLP
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de juegos (click → detalle unitario) */}
            <div className="px-5 py-4">
              <p className="text-xs text-white/50 uppercase tracking-[0.24em] font-semibold">
                Juegos incluidos
              </p>

              <div className="mt-3 space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {Array.isArray(packActivo.juegos) &&
                packActivo.juegos.length > 0 ? (
                  packActivo.juegos.map((juego, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJuegoClick(juego);
                      }}
                      className="
                        w-full flex items-center justify-between gap-3
                        rounded-xl bg-white/5 px-3 py-2
                        border border-white/10
                        text-left text-sm text-white
                        hover:bg-white/10
                        transition
                      "
                    >
                      <span className="flex-1">
                        <span className="mr-2 text-[11px] text-white/50">
                          {idx + 1}.
                        </span>
                        {juego}
                      </span>
                      <span className="text-[11px] text-emerald-400/80">
                        Ver detalles →
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-white/60">
                    Este pack no tiene juegos listados en la base de datos.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-white/60">
                Serás llevado a WhatsApp para concretar la compra de este pack.
              </p>
              <button
                type="button"
                onClick={comprarPack}
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs sm:text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
              >
                Comprar por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}