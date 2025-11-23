// app/page.js
import Link from "next/link";
import Image from "next/image";
import { fetchPacks, fetchUnitarios } from "@/lib/sheets";
import PacksHomeCarousel from "@/components/PacksHomeCarousel";
import UnitariosHomeCarousel from "@/components/UnitariosHomeCarousel";

export const revalidate = 60;

// Normalizar juegos dentro de un pack
function toArray(juegos) {
  if (Array.isArray(juegos)) return juegos;
  if (!juegos) return [];
  return String(juegos)
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function HomePage() {
  const [packsRaw, unitariosRaw] = await Promise.all([
    fetchPacks({ soloDisponibles: true }),
    fetchUnitarios({ soloDisponibles: true }),
  ]);

  const packs = [...packsRaw]
    .map((p) => ({
      ...p,
      id: Number(p.id),
      juegos: toArray(p.juegos),
      precioCLP: Number(p.precioCLP || 0),
    }))
    .sort((a, b) => (a.id || 0) - (b.id || 0));

  const unitarios = [...unitariosRaw];

  const totalPacks = packs.length;
  const totalUnitarios = unitarios.length;

  // Para el inicio solo una previsualización
  const packsPreview = packs.slice(-4).reverse(); // últimos 4
  const unitariosPreview = unitarios.slice(0, 4); // primeros 4

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-24 sm:pt-28">
      {/* ============== HERO PRINCIPAL ============== */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#050814] shadow-[0_24px_60px_rgba(3,6,24,0.85)] p-6 sm:p-10 mb-12">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -top-32 -left-24 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-4">
            <p className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/70 border border-white/10">
              Alfeicon Games · Juegos digitales
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Compra juegos digitales para{" "}
              <span className="text-teal-300">Nintendo Switch</span>{" "}
              de forma fácil y segura.
            </h1>

            <p className="text-sm sm:text-base text-white/70 max-w-xl">
              Explora nuestro catálogo de packs y juegos unitarios, ahorra con
              ofertas especiales y recibe instrucciones claras para activar tus
              juegos en minutos.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/packs#packs"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm sm:text-base font-semibold text-white/90 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.12)] hover:bg-white/20 hover:border-white/40 transition"
              >
                <Image
                  src="/shippingbox.fill.svg"
                  alt="Packs de juegos"
                  width={18}
                  height={18}
                  className="opacity-90"
                />
                <span>Ver packs de juegos</span>
              </Link>

              <Link
                href="/unitarios#unitarios"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 py-2.5 text-sm sm:text-base font-semibold text-white backdrop-blur-md shadow-[0_18px_45px_rgba(0,0,0,0.55)] hover:bg-white/25 hover:border-white/50 transition"
              >
                <Image
                  src="/gamecontroller.circle.fill.svg"
                  alt="Juegos unitarios"
                  width={18}
                  height={18}
                  className="opacity-90"
                />
                <span>Ver juegos unitarios</span>
              </Link>

              <Link
                href="/instrucciones"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs sm:text-sm font-medium text-white/90 backdrop-blur-md hover:bg-white/15 hover:border-white/40 transition"
              >
                <Image
                  src="/book.pages.fill.svg"
                  alt="Instrucciones"
                  width={16}
                  height={16}
                  className="opacity-90"
                />
                <span>Instrucciones</span>
              </Link>
              <Link
                href="/terminos"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs sm:text-sm font-medium text-white/80 backdrop-blur-md hover:bg-white/15 hover:border-white/40 transition"
              >
                <Image
                  src="/person.crop.circle.badge.questionmark.svg"
                  alt="Términos y condiciones"
                  width={16}
                  height={16}
                  className="opacity-90"
                />
                <span>Términos y condiciones</span>
              </Link>
            </div>

            {/* 🔽 NUEVA LÍNEA EXPLÍCITA SOBRE LOS CARRUSELES */}
            <p className="flex items-center gap-2 text-xs sm:text-sm text-white/60 pt-2">
              <span className="inline-block animate-bounce">↓</span>
              <span>
                Desliza hacia abajo para ver packs recomendados y juegos
                unitarios destacados.
              </span>
            </p>

            {/* Mini ventajas */}
            <div className="flex flex-wrap gap-4 pt-3 text-xs sm:text-sm text-white/60">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Cuentas primarias y secundarias
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                Soporte por WhatsApp
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                Ofertas y packs exclusivos
              </div>
            </div>
          </div>

          {/* Resumen lateral */}
          <div className="flex-1 lg:max-w-sm">
            <div className="rounded-3xl border border-white/10 bg-black/40 px-5 py-5 sm:px-6 sm:py-6 backdrop-blur-md space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/50 font-semibold">
                RESUMEN RÁPIDO
              </p>

              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-center justify-between">
                  <span>Packs disponibles</span>
                  <span className="font-semibold text-teal-300">
                    {totalPacks}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Juegos unitarios</span>
                  <span className="font-semibold text-sky-300">
                    {totalUnitarios}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Medio de contacto</span>
                  <span className="font-semibold text-white">WhatsApp</span>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/15 to-violet-500/20 px-4 py-3 text-xs text-white/80 border border-white/10">
                <span className="font-semibold">Tip:</span> Si quieres
                recomendaciones personalizadas, escríbenos por WhatsApp.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== CARRUSEL PACKS ============== */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-white">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white/10">
              <Image
                src="/shippingbox.fill.svg"
                alt="Packs de juegos"
                width={20}
                height={20}
                className="opacity-90"
              />
            </span>
            Packs de juegos
          </h2>
          <Link
            href="/packs#packs"
            className="text-xs sm:text-sm font-semibold text-white/70 hover:text-white"
          >
            Ver todos →
          </Link>
        </div>

        <PacksHomeCarousel packs={packsPreview} limitGames={3} />
      </section>

      {/* ============== CARRUSEL UNITARIOS ============== */}
      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-white">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white/10">
              <Image
                src="/gamecontroller.circle.fill.svg"
                alt="Juegos unitarios"
                width={20}
                height={20}
                className="opacity-90"
              />
            </span>
            Juegos unitarios
          </h2>
          <Link
            href="/unitarios#unitarios"
            className="text-xs sm:text-sm font-semibold text-white/70 hover:text-white"
          >
            Ver todos →
          </Link>
        </div>

        <UnitariosHomeCarousel juegos={unitariosPreview} />
      </section>

      {/* ============== CÓMO FUNCIONA ============== */}
      <section className="mb-12">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
          ¿Cómo funciona?
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-white/50 font-semibold mb-2">
              Paso 1
            </p>
            <h3 className="text-sm font-semibold text-white mb-1">
              Elige tu juego o pack
            </h3>
            <p className="text-xs text-white/70">
              Entra al catálogo y elige lo que quieras comprar.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-white/50 font-semibold mb-2">
              Paso 2
            </p>
            <h3 className="text-sm font-semibold text-white mb-1">
              Escríbenos por WhatsApp
            </h3>
            <p className="text-xs text-white/70">
              Presiona el juego y el mensaje se prepara automáticamente.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-white/50 font-semibold mb-2">
              Paso 3
            </p>
            <h3 className="text-sm font-semibold text-white mb-1">
              Sigue las instrucciones
            </h3>
            <p className="text-xs text-white/70">
              Te enviamos los datos para instalar los juegos.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}