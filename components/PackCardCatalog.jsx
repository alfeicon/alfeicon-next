// components/PackCardCatalog.jsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import gameImages from "@/data/gameImages.json";

/* ================= Helpers para imágenes ================= */
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

function openWhatsApp({ phone, text }) {
  const enc = encodeURIComponent(text);
  const url = `https://wa.me/${phone}?text=${enc}`;
  window.open(url, "_blank");
}

function toArrayConsola(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  return String(value)
    .split(/,|\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/* ================= Temas ================= */
const CARD_THEMES = [
  {
    gradient: "linear-gradient(160deg, #12143a 0%, #1f1a68 55%, #352d7a 100%)",
    panel: "rgba(7, 10, 24, 0.96)",
  },
  {
    gradient: "linear-gradient(165deg, #101935 0%, #162a78 55%, #2644a8 100%)",
    panel: "rgba(7, 11, 26, 0.96)",
  },
  {
    gradient: "linear-gradient(165deg, #18153a 0%, #2a165d 50%, #411c6f 100%)",
    panel: "rgba(10, 7, 26, 0.96)",
  },
];

/* ================= Card Catálogo ================= */
export default function PackCardCatalog({ pack }) {
  if (!pack) return null;

  const theme =
    CARD_THEMES[(Number(pack.id || 1) - 1) % CARD_THEMES.length] ||
    CARD_THEMES[0];

  const juegos = useMemo(
    () => (pack.juegos || []).map((j) => String(j).trim()).filter(Boolean),
    [pack.juegos]
  );

  const totalJuegos = juegos.length;
  const visibles = juegos.slice(0, 4); // 👈 solo 4 en la card
  const ocultos = Math.max(totalJuegos - visibles.length, 0);

  const titulo = pack.id ? `Pack ${pack.id}` : pack.titulo || "Pack";
  const subtituloBase = pack.estado || "Cuenta Primaria";
  const consolas = toArrayConsola(pack.consola || "Nintendo Switch");

  const subtitulo =
    consolas.length > 0
      ? `${subtituloBase} · ${consolas.join(", ")}`
      : subtituloBase;

  const heroImg =
    findImageForTitle(juegos[0]) ||
    findImageForTitle(juegos[1]) ||
    findImageForTitle(juegos[2]) ||
    null;

  const precio = Number(pack.precioCLP || 0);

  const [showModal, setShowModal] = useState(false);

  const handleBuy = () => {
    vibrate(40);
    const msg = `Hola! Me interesa el ${titulo} por $${precio.toLocaleString(
      "es-CL"
    )} CLP.`;
    openWhatsApp({ phone: "56926411278", text: msg });
  };

  const openModal = () => {
    vibrate(25);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <>
      {/* ===== Card principal ===== */}
      <article
        className="flex flex-col rounded-[30px] border border-white/10 bg-black/40 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
        style={{ backgroundImage: theme.gradient }}
      >
        {/* Imagen */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          {heroImg ? (
            <Image src={heroImg} alt={titulo} fill className="object-cover" />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: theme.gradient }}
            />
          )}
        </div>

        {/* Contenido principal */}
        <div
          className="flex flex-col flex-1 px-6 pt-5 pb-4"
          style={{ background: theme.panel, backdropFilter: "blur(18px)" }}
        >
          {/* Header: título + precio */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-white">{titulo}</h2>
              <p className="mt-1 text-sm text-white/70">{subtitulo}</p>
            </div>

            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">
                Precio
              </p>
              <p className="text-xl font-extrabold text-white leading-tight">
                ${precio.toLocaleString("es-CL")}
              </p>
            </div>
          </div>

          {/* Compatibilidad */}
          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/55 mb-1">
              Compatibilidad
            </p>
            <div className="flex flex-wrap gap-2">
              {consolas.map((c, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-white/90 border border-white/15"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Lista corta de juegos */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55">
                Juegos incluidos
              </span>
              <span className="text-[11px] font-bold text-white/70 opacity-90">
                ({totalJuegos})
              </span>
            </div>

            <div className="rounded-[26px] border border-white/12 bg-black/25 px-3 py-3">
              {visibles.length > 0 ? (
                <ul className="space-y-2 text-sm text-white/90">
                  {visibles.map((juego, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 rounded-2xl bg-white/6 px-3 py-2 border border-white/10 transition-colors duration-150 hover:bg-white/10"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-[11px] text-white/65">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{juego}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-white/60">
                  Este pack todavía no tiene juegos listados.
                </p>
              )}
            </div>

            {/* Botón ver más (abre modal) */}
            {ocultos > 0 && (
              <button
                type="button"
                onClick={openModal}
                className="mt-2 text-[11px] font-medium text-white/75 hover:text-white underline underline-offset-2"
              >
                Ver lista completa (+{ocultos} juegos)
              </button>
            )}
          </div>

          {/* CTA Comprar */}
          <div className="mt-5">
            <button
              type="button"
              onClick={handleBuy}
              className="w-full inline-flex items-center justify-center rounded-full bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-slate-100 transition"
            >
              Comprar Pack
            </button>
          </div>
        </div>
      </article>

      {/* ===== Modal con lista completa de juegos ===== */}
      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          {/* Fondo oscuro */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Contenedor modal */}
          <div
            className="relative z-[71] w-full max-w-xl max-h-[80vh] rounded-3xl bg-[#050814] border border-white/15 shadow-[0_24px_70px_rgba(0,0,0,0.85)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-white/10">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-[0.24em] font-semibold">
                  Lista completa
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {titulo}
                </h3>
                <p className="mt-1 text-xs text-white/60">
                  {totalJuegos} juego{totalJuegos === 1 ? "" : "s"} incluidos
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {/* Lista completa scrolleable */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {juegos.length > 0 ? (
                <ul className="space-y-2 text-sm text-white/90">
                  {juegos.map((juego, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 rounded-2xl bg-white/6 px-3 py-2 border border-white/10"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-[11px] text-white/65">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{juego}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-white/60">
                  Este pack todavía no tiene juegos listados.
                </p>
              )}
            </div>

            {/* Footer modal */}
            <div className="px-5 py-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-white/60">
                Serás llevado a WhatsApp para concretar la compra.
              </p>
              <button
                type="button"
                onClick={handleBuy}
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs sm:text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
              >
                Comprar Pack
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}