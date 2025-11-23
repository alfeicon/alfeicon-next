// components/UnitarioCardMini.jsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function UnitarioCardMini({ juego }) {
  if (!juego) return null;

  const {
    slug,
    id,
    titulo,
    nombre,
    imagen,
    imageUrl,
    precioCLP,
    precio,
  } = juego;

  const displayName = titulo || nombre || "Juego unitario";

  // Precio base (normal)
  const basePriceRaw = precioCLP || precio || 0;
  const basePrice = basePriceRaw != null ? Number(basePriceRaw) : 0;

  // Precio oferta (si viene desde la hoja)
  const offerPriceRaw =
    juego?.precioOfertaCLP ?? juego?.precioOferta ?? null;
  const offerPrice =
    offerPriceRaw != null ? Number(offerPriceRaw) : null;

  const hasOfferPrice =
    offerPrice != null &&
    !Number.isNaN(offerPrice) &&
    offerPrice > 0;

  const isOnSale =
    hasOfferPrice ||
    juego?.enOferta === true ||
    juego?.enOferta === "TRUE" ||
    juego?.oferta === true ||
    juego?.oferta === "TRUE";

  const finalPrice = hasOfferPrice ? offerPrice : basePrice;

  const imgSrc = imageUrl || imagen || "/logo.png";

  return (
    <Link
      href={`/unitarios/${slug || id}`}
      className="
        group
        flex h-full w-[250px] sm:w-[260px]
        flex-col overflow-hidden rounded-3xl
        border border-white/10
        bg-[#050814]
        shadow-[0_18px_40px_rgba(0,0,0,0.7)]
      "
    >
      {/* Imagen (estilo Nintendo, bien protagonista) */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={imgSrc}
          alt={displayName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />

        {isOnSale && (
          <div className="absolute left-3 top-3 rounded-full bg-emerald-400 px-3 py-1 text-[11px] font-semibold text-black shadow-lg">
            En oferta
          </div>
        )}

        <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-white/80">
          Juego unitario
        </div>
      </div>

      {/* Zona de texto tipo “card Nintendo” */}
      <div className="flex h-full flex-col px-4 pb-4 pt-3 text-white">
        {/* Nombre del juego */}
        <p className="text-[15px] sm:text-[16px] font-semibold leading-snug line-clamp-2 text-left">
          {displayName}
        </p>

        {/* Precio grande + posible precio tachado */}
        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex flex-col">
            {finalPrice > 0 ? (
              <>
                {isOnSale &&
                  basePrice &&
                  basePrice !== finalPrice && (
                    <span className="text-xs text-white/50 line-through">
                      ${Number(basePrice).toLocaleString("es-CL")}
                    </span>
                  )}

                <div className="flex items-baseline gap-1">
                  <span className="text-[18px] sm:text-[20px] font-bold">
                    ${Number(finalPrice).toLocaleString("es-CL")}
                  </span>
                  <span className="text-[11px] text-white/60">CLP</span>
                </div>
              </>
            ) : (
              <span className="text-[13px] font-normal text-white/70">
                Precio a consultar
              </span>
            )}
          </div>
        </div>

        {/* CTA “Toca para ver detalles” más abajo y discreto */}
        <p className="mt-3 text-[11px] text-white/55 text-left">
          Toca para ver detalles →
        </p>
      </div>
    </Link>
  );
}