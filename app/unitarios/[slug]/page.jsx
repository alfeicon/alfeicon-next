// app/unitarios/[slug]/page.jsx
import { notFound } from "next/navigation";
import { fetchUnitarios } from "@/lib/sheets";
import UnitarioMedia from "@/components/UnitarioMedia";
import BackButton from "@/components/BackButton"; // 👈 nuevo

export const revalidate = 60;

/* ==== helpers ==== */
function slugify(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getYouTubeId(url = "") {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    if (u.pathname.startsWith("/embed/"))
      return u.pathname.replace("/embed/", "");
    return null;
  } catch {
    return null;
  }
}

function matchSlug(juego, slug) {
  const nombreDerivado =
    juego.nombre || juego.juego || juego.titulo || juego.Nombre || "";

  const slugNombre = slugify(nombreDerivado);

  // 1) si más adelante agregas juego.slug en la hoja, funcionará igual
  if (juego.slug && slug === juego.slug) return true;

  // 2) slug derivado del nombre (lo que usamos ahora)
  return slug === slugNombre;
}

/* ==== Página de detalle ==== */
export default async function UnitarioDetallePage({ params }) {
  // Next 15: params es un Promise
  const { slug } = await params;

  const unitarios = await fetchUnitarios({ soloDisponibles: true });
  const juego = unitarios.find((j) => matchSlug(j, slug));

  if (!juego) {
    return notFound();
  }

  const nombreDerivado =
    juego.nombre || juego.juego || juego.titulo || juego.Nombre || "Juego";

  const {
    precioCLP,
    enOferta,
    precioOferta,
    precioOfertaCLP,
    espacio,
    imagen,
    descripcion,
    trailer,
    consola,
    genero,
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

  const ytId = getYouTubeId(trailer);

  const waText = encodeURIComponent(
    `Hola! Me interesa el juego unitario "${nombreDerivado}" por $${precioVisible.toLocaleString(
      "es-CL"
    )} CLP.`
  );
  const waHref = `https://wa.me/56926411278?text=${waText}`;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-24 sm:pt-28">
      {/* Migas / título pequeño */}
      <p className="text-xs sm:text-sm text-white/50 mb-2">
        Tienda · Juegos unitarios ·{" "}
        <span className="text-white/80">{nombreDerivado}</span>
      </p>

      {/* Título + botón volver atrás en la misma fila */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
          {nombreDerivado}
        </h1>

        <BackButton />
      </div>

      {/* ==== layout principal: media (imagen/tráiler) + info ==== */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#050814] shadow-[0_24px_60px_rgba(3,6,24,0.85)] p-4 sm:p-6 lg:p-8 mb-10">
        {/* glow de fondo */}
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute -top-32 -left-24 h-64 w-64 rounded-full bg-fuchsia-500/12 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 h-64 w-64 rounded-full bg-cyan-500/12 blur-3xl" />
        </div>

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
          {/* ---- Columna izquierda: media intercambiable ---- */}
          <UnitarioMedia imagen={imagen} nombre={nombreDerivado} ytId={ytId} />

          {/* ---- Columna derecha: info / precio / CTA ---- */}
          <div className="rounded-3xl border border-white/10 bg-black/40 px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 backdrop-blur-md space-y-5">
            {/* Consola / espacio */}
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-white/80">
              {consola && (
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1">
                  {consola}
                </span>
              )}
              {genero && (
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1">
                  {genero}
                </span>
              )}
              {espacioTexto && (
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1">
                  Tamaño aprox: {espacioTexto}
                </span>
              )}
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1">
                Juego digital
              </span>
            </div>

            {/* Precio */}
            <div>
              <p className="text-xs text-white/60 mb-1">Precio</p>
              {tieneOferta && (
                <p className="text-sm text-white/60 line-through">
                  ${precioNormal.toLocaleString("es-CL")} CLP
                </p>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  ${precioVisible.toLocaleString("es-CL")}
                </span>
                <span className="text-xs font-semibold text-white/70">
                  CLP
                </span>
                {tieneOferta && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-semibold text-black uppercase tracking-[0.18em]">
                    En oferta
                  </span>
                )}
              </div>
            </div>

            {/* Botón WhatsApp */}
            <div className="space-y-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm sm:text-base font-semibold text-black shadow-[0_18px_45px_rgba(0,0,0,0.8)] hover:bg-emerald-400 transition"
              >
                Comprar por WhatsApp
              </a>
              <p className="text-[11px] text-white/60">
                Te redirigiremos a WhatsApp para coordinar el pago y el acceso a
                la cuenta con el juego.
              </p>
            </div>

            {/* Datos rápidos */}
            <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-white/70">
              <p>• Entrega digital del juego. No se envía nada físico.</p>
              <p>
                • Requiere conexión a internet para descargar el contenido en tu
                consola.
              </p>
              <p>• Soporte personalizado por WhatsApp si tienes dudas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==== Descripción / info adicional ==== */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 className="text-sm sm:text-base font-semibold text-white mb-2">
            Descripción del juego
          </h2>
          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
            {descripcion ||
              "Este juego no tiene una descripción detallada cargada aún. Si tienes dudas sobre la jugabilidad o el contenido, pregúntanos por WhatsApp y te orientamos."}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6 space-y-3 text-sm text-white/80">
          <h2 className="text-sm sm:text-base font-semibold text-white mb-1">
            Información del producto
          </h2>
          <div className="space-y-1 text-xs sm:text-sm">
            <p>
              <span className="text-white/60">Formato: </span>
              Digital (cuenta Nintendo)
            </p>
            {consola && (
              <p>
                <span className="text-white/60">Consola: </span>
                {consola}
              </p>
            )}
            {espacioTexto && (
              <p>
                <span className="text-white/60">Espacio necesario: </span>
                {espacioTexto}
              </p>
            )}
            {genero && (
              <p>
                <span className="text-white/60">Género: </span>
                {genero}
              </p>
            )}
            <p className="text-white/60 mt-2">
              * La disponibilidad y precio pueden cambiar. Siempre confirmamos
              el valor final por WhatsApp antes de concretar la compra.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}