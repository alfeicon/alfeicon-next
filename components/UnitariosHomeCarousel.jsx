// components/UnitariosHomeCarousel.jsx
"use client";

import UnitarioCardMini from "@/components/UnitarioCardMini";

export default function UnitariosHomeCarousel({ juegos = [] }) {
  if (!Array.isArray(juegos) || juegos.length === 0) return null;

  return (
    <div className="-mx-4 px-4 sm:mx-0 sm:px-0 mt-4 mb-6">
      <div
        className="
          flex
          gap-6 sm:gap-8          /* 👉 un poco más de espacio entre tarjetas */
          overflow-x-auto
          pb-6
          scroll-smooth
          snap-x snap-mandatory
        "
      >
        {juegos.map((juego, idx) => (
          <div
            key={juego.id ?? idx}
            className="
              snap-start
              w-[260px] sm:w-[300px]  /* 👉 un poco más angostas que antes, para que se vean más en pantalla */
            "
          >
            <UnitarioCardMini juego={juego} />
          </div>
        ))}
      </div>
    </div>
  );
}