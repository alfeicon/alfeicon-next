"use client";

import { useMemo, useState, useRef } from "react";
import Image from "next/image";
import gameImages from "@/data/gameImages.json";

/* ================= Helpers ================= */
function normalizeTitle(title = "") {
  return String(title)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[™®©]/g, "")
    .replace(/[:’'‘!?.(),-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const IMAGES_INDEX = (() => {
  const idx = {};
  for (const item of gameImages || []) {
    if (!item?.name || !item?.url) continue;
    const base = normalizeTitle(item.name);
    const bare = base.replace(/[^a-z0-9 ]/g, "");
    idx[base] = item.url;
    idx[bare] = item.url;
  }
  return idx;
})();

function findImageForTitle(title) {
  if (!title) return null;
  const key = normalizeTitle(title);
  const bare = key.replace(/[^a-z0-9 ]/g, "");

  if (IMAGES_INDEX[key]) return IMAGES_INDEX[key];
  if (IMAGES_INDEX[bare]) return IMAGES_INDEX[bare];

  const keys = Object.keys(IMAGES_INDEX);
  const short = key.slice(0, 14);

  const hit =
    keys.find((k) => k.startsWith(short)) ||
    keys.find((k) => k.includes(short)) ||
    keys.find((k) => k.replace(/\(.*?\)/g, "").trim() === key);

  return hit ? IMAGES_INDEX[hit] : null;
}

function vibrate(ms = 35) {
  try {
    navigator?.vibrate(ms);
  } catch {
    /* no-op */
  }
}

function openWhatsAppSmart({ phone, text }) {
  const enc = encodeURIComponent(text);
  const app = `whatsapp://send?phone=${phone}&text=${enc}`;
  const web = `https://wa.me/${phone}?text=${enc}`;
  window.location.href = app;

  setTimeout(() => window.open(web, "_blank"), 600);
}

/* ================= Componente ================= */
export default function PackCardClassic({
  pack,
  limitGames = null,
  simpleMode = true, // 👈 modo inicio (sin modal)
  compact = false,  // 👈 nuevo: reduce espacio interno
}) {
  if (!pack) return null;

  const theme =
    CARD_THEMES[(Number(pack.id || 1) - 1) % CARD_THEMES.length] ||
    CARD_THEMES[0];

  const juegos = useMemo(
    () => (pack.juegos || []).map((j) => j.trim()).filter(Boolean),
    [pack.juegos]
  );

  const total = juegos.length;
  const visibles = limitGames ? juegos.slice(0, limitGames) : juegos;
  const ocultos = limitGames ? total - visibles.length : 0;

  const titulo = pack.id ? `Pack ${pack.id}` : pack.titulo || "Pack";
  const subtitulo = pack.estado || "Cuenta Primaria";

  const heroImg =
    findImageForTitle(juegos[0]) ||
    findImageForTitle(juegos[1]) ||
    findImageForTitle(juegos[2]) ||
    null;

  /* ===== Modal ===== */
  const [showConfirm, setShowConfirm] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const yesBtnRef = useRef(null);

  const openConfirm = () => {
    if (simpleMode) return; // 👈 en inicio NO hay modal
    vibrate(25);
    setShowConfirm(true);
  };

  const confirmYes = () => {
    vibrate(40);
    setRedirecting(true);

    const precio = Number(pack.precioCLP || 0).toLocaleString("es-CL");
    const msg = `Hola! Quiero comprar el ${titulo} por $${precio} CLP`;

    setTimeout(() => {
      openWhatsAppSmart({ phone: "56926411278", text: msg });
      setTimeout(() => setShowConfirm(false), 500);
    }, 1200);
  };

  const confirmNo = () => setShowConfirm(false);

  const isCompact = compact; // por si después quieres otras variantes

  return (
    <>
      {/* ===== CARD ===== */}
      <article
        role="button"
        tabIndex={0}
        onClick={openConfirm}
        className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0e19]
                   shadow-[0_22px_50px_rgba(3,6,24,0.55)] transition-transform duration-300 hover:-translate-y-1"
        style={{ backgroundImage: theme.gradient }}
      >
        {/* Imagen */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          {heroImg ? (
            <Image
              src={heroImg}
              alt={titulo}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: theme.gradient }}
            />
          )}
        </div>

        {/* Contenido */}
        <div
          className={`relative flex flex-col rounded-t-none rounded-b-[28px] p-6 sm:p-7
            ${simpleMode ? "h-[310px] sm:h-[330px]" : "h-auto"}`}
          style={{ background: theme.panel, backdropFilter: "blur(18px)" }}
        >
          {/* Título */}
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white">{titulo}</h2>
            <p className="text-sm text-white/70">{subtitulo}</p>
          </div>

          {/* Juegos */}
          <div
            className={`space-y-2 ${
              isCompact ? "mt-4" : "mt-auto"
            }`} // 👈 aquí achicamos el espacio
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-white/65">
              Juegos incluidos
            </p>

            <ul className="list-disc space-y-1 pl-5 text-[15px] text-white/90">
              {visibles.map((j, i) => (
                <li key={i}>{j}</li>
              ))}
            </ul>

            {ocultos > 0 && (
              <p className="text-sm font-semibold text-white/90">
                ver más (+{ocultos})
              </p>
            )}
          </div>

          {/* Precio (solo modo normal) */}
          {!simpleMode && (
            <div className="pt-3">
              <p className="text-xs text-white/50 uppercase tracking-[0.3em]">
                Precio
              </p>
              <h3 className="text-3xl font-extrabold text-white">
                ${Number(pack.precioCLP || 0).toLocaleString("es-CL")}
              </h3>
            </div>
          )}
        </div>
      </article>

      {/* ===== MODAL (solo fuera del inicio) ===== */}
      {!simpleMode && showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0e1226] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">
              ¿Quieres comprar el {titulo}?
            </h3>

            {!redirecting ? (
              <>
                <p className="mt-2 text-sm text-white/70">
                  Serás llevado a WhatsApp para concretar tu compra.
                </p>

                <div className="mt-5 flex justify-end gap-3">
                  <button
                    onClick={confirmNo}
                    className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                  >
                    No
                  </button>
                  <button
                    ref={yesBtnRef}
                    onClick={confirmYes}
                    className="rounded-full bg-white px-5 py-2 text-sm font-bold text-[#0c1022] hover:opacity-95"
                  >
                    Sí
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-4 flex items-center gap-3 text-white/90">
                <span className="inline-flex h-3 w-3 animate-ping rounded-full bg-emerald-400" />
                <p>Serás llevado a WhatsApp…</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ================= Temas ================= */
const CARD_THEMES = [
  {
    gradient: "linear-gradient(160deg, #12143a 0%, #1f1a68 55%, #352d7a 100%)",
    panel: "rgba(11, 14, 32, 0.70)",
  },
  {
    gradient: "linear-gradient(165deg, #101935 0%, #162a78 55%, #2644a8 100%)",
    panel: "rgba(7, 12, 26, 0.70)",
  },
  {
    gradient: "linear-gradient(165deg, #18153a 0%, #2a165d 50%, #411c6f 100%)",
    panel: "rgba(15, 10, 26, 0.72)",
  },
];