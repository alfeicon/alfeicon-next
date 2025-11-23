// app/instrucciones/page.jsx
"use client";

import Image from "next/image";
import Link from "next/link";

// Generamos la lista de imágenes + etiqueta de paso
// Cambia 17 por la cantidad real de páginas
const PAGES = Array.from({ length: 17 }, (_, i) => {
  const num = String(i + 1).padStart(4, "0");
  const src = `/instrucciones/Instrucciones_2025_alfeicongames_page-${num}.jpg`;

  // El último es "Paso extra", el resto "Paso 1", "Paso 2", etc.
  const label = i === 16 ? "Paso extra" : `Paso ${i + 1}`;

  return { src, label };
});

export default function InstruccionesPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 pt-28">
      {/* Cabecera */}
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Instrucciones de compra
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Paso a paso para comprar y cargar tus juegos digitales.
          </p>
        </div>

        {/* Botón volver al inicio */}
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
        >
          ⬅ Volver al inicio
        </Link>
      </header>

      <p className="text-xs text-white/50 mb-4 text-center sm:text-left">
        Desliza hacia abajo para ver todas las páginas de las instrucciones.
      </p>

      {/* Lista de páginas como “manual” */}
      <div className="space-y-6">
        {PAGES.map(({ src, label }, idx) => (
          <figure
            key={src}
            className="overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-[0_18px_40px_rgba(3,6,24,0.55)]"
          >
            {/* Cabecera del paso */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 border border-white/10 text-[11px] font-semibold text-white/80 tracking-[0.16em] uppercase">
                {label}
              </span>
              <span className="text-[11px] text-white/40">
                Página {idx + 1}
              </span>
            </div>

            {/* Imagen de la instrucción */}
            <Image
              src={src}
              alt={`Instrucciones Alfeicon Games — ${label}`}
              width={1600}
              height={900}
              className="w-full h-auto"
            />
          </figure>
        ))}
      </div>
    </main>
  );
}