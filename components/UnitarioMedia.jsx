// components/UnitarioMedia.jsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function UnitarioMedia({ imagen, nombre, ytId }) {
  // image | video
  const [active, setActive] = useState(ytId ? "image" : "image");

  const showImage = active === "image" || !ytId;
  const showVideo = active === "video" && ytId;

  return (
    <div className="space-y-4">
      {/* Área principal compartida */}
      <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 bg-black/60">
        {showImage ? (
          imagen ? (
            <Image
              src={imagen}
              alt={nombre}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm">
              Imagen no disponible
            </div>
          )
        ) : null}

        {showVideo && (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
          />
        )}
      </div>

      {/* Miniaturas / tabs */}
      <div className="flex gap-3 overflow-x-auto">
        {/* Thumb imagen */}
        <button
          type="button"
          onClick={() => setActive("image")}
          className={`
            relative h-16 w-24 rounded-xl overflow-hidden shrink-0
            border ${active === "image" ? "border-emerald-400" : "border-white/10"}
            bg-black/60
          `}
        >
          {imagen ? (
            <Image
              src={imagen}
              alt={`${nombre} portada`}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white/60">
              Imagen
            </div>
          )}
        </button>

        {/* Thumb video, solo si hay tráiler */}
        {ytId && (
          <button
            type="button"
            onClick={() => setActive("video")}
            className={`
              relative h-16 w-24 rounded-xl overflow-hidden shrink-0
              border ${active === "video" ? "border-emerald-400" : "border-white/10"}
              bg-black/80 flex items-center justify-center
            `}
          >
            {imagen ? (
              <>
                <Image
                  src={imagen}
                  alt={`${nombre} trailer`}
                  fill
                  className="object-cover opacity-60"
                  sizes="96px"
                />
                {/* Icono play encima */}
                <div className="relative z-10 flex items-center justify-center">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70">
                    ▶
                  </span>
                </div>
              </>
            ) : (
              <span className="text-[10px] text-white/70">Tráiler</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}