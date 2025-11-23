// app/terminos/page.jsx

export const revalidate = 3600;

const SECCIONES = [
  ["antes", "Antes de comprar"],
  ["instalacion", "Proceso de instalación"],
  ["cuentas", "Cuentas y juegos"],
  ["riesgo", "Riesgo de baneo"],
  ["sospecha", "Sospecha y pruebas"],
  ["garantia", "Garantía"],
  ["devoluciones", "Devoluciones"],
  ["pagos", "Pagos"],
  ["generales", "Condiciones generales"],
];

const CURRENT_YEAR = 2025; // fijo para evitar problemas de hidratación

export default function TerminosPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-24 sm:pt-28">
      {/* HERO */}
      <section className="mb-10">
        <p className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60 border border-white/10">
          Alfeicon Games · Información importante
        </p>

        <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
          Términos y condiciones
        </h1>

        <p className="mt-3 text-sm sm:text-base text-white/70 max-w-2xl">
          Lee con atención nuestras políticas de instalación, garantía,
          devoluciones y pagos antes de comprar un pack o juego unitario.
        </p>

        <div className="mt-4 text-xs sm:text-sm text-white/50">
          Última actualización:{" "}
          <span className="font-semibold">noviembre 2025</span>
        </div>
      </section>

      {/* NAV MÓVIL (chips horizontales) */}
      <nav className="mb-5 flex gap-2 overflow-x-auto lg:hidden scrollbar-none">
        {SECCIONES.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10 hover:text-white transition"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* LAYOUT PRINCIPAL – flex para que sticky funcione bien en desktop */}
      <section className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* NAV / SECCIONES DESKTOP */}
        <aside className="hidden lg:block lg:w-64 lg:shrink-0">
          <div className="sticky top-24 rounded-[28px] border border-white/10 bg-[#050814]/85 backdrop-blur px-5 py-5 shadow-[0_22px_60px_rgba(0,0,0,0.8)]">
            <h2 className="text-xs font-semibold tracking-[0.25em] text-white/60 uppercase mb-3">
              Secciones
            </h2>

            <nav className="flex flex-col gap-1 text-sm">
              {SECCIONES.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="flex items-center gap-2 rounded-full px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 transition text-xs sm:text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  <span>{label}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* CONTENIDO */}
        <div className="flex-1 space-y-6">
          {/* Resumen rápido */}
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-sm text-emerald-100">
            <p className="font-semibold">Resumen rápido</p>
            <p className="mt-1 text-emerald-100/80">
              Todas las compras son digitales, con instalación guiada y soporte
              por WhatsApp. Al comprar, aceptas los siguientes términos.
            </p>
          </div>

          {/* === SECCIÓN: Antes de comprar === */}
          <section
            id="antes"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#050814]/95 px-4 py-5 sm:px-6 sm:py-6 shadow-[0_18px_50px_rgba(0,0,0,0.85)]"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
              Antes de comprar
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-white/80">
              <li>
                Verifica el <strong>espacio disponible</strong> en la consola o
                memoria SD y la <strong>calidad de internet</strong>.
              </li>
              <li>
                Las instrucciones son para <strong>cuenta principal</strong>{" "}
                (juegas con tu usuario personal).
              </li>
              <li>
                Si compras más de un juego,{" "}
                <strong>descárgalos todos en el momento de la entrega</strong>.
                Al iniciar uno, las demás descargas se pausan.
              </li>
              <li>
                No somos <strong>tienda oficial de Nintendo</strong>. Solo
                entregamos la cuenta del proveedor; no administramos
                credenciales.
              </li>
            </ul>
          </section>

          {/* === Proceso de instalación === */}
          <section
            id="instalacion"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#050814]/95 px-4 py-5 sm:px-6 sm:py-6 shadow-[0_18px_50px_rgba(0,0,0,0.85)]"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
              Proceso de instalación
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-white/80">
              <li>
                El vendedor te acompaña en todo el proceso y responde tus dudas.
              </li>
              <li>
                Tiempo estimado de entrega/descarga: entre{" "}
                <strong>10 y 120 minutos</strong>, según el distribuidor.
              </li>
              <li>
                Es necesario iniciar las descargas{" "}
                <strong>en el momento de la entrega</strong>. Hay un paso
                crítico cercano a <strong>15 minutos</strong>.
              </li>
            </ul>

            <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-xs sm:text-sm text-amber-50">
              <span className="font-semibold">Importante:</span>{" "}
              Si no puedes seguir el procedimiento en ese momento, avísanos
              para coordinar. Si la cuenta caduca por no ejecutar los pasos a
              tiempo, <strong>Alfeicon Games no se hace responsable</strong>.
            </div>
          </section>

          {/* === Cuentas y juegos === */}
          <section
            id="cuentas"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#050814]/95 px-4 py-5 sm:px-6 sm:py-6 shadow-[0_18px_50px_rgba(0,0,0,0.85)]"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
              Cuentas y juegos
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-white/80">
              <li>
                Las cuentas son de tipo <strong>principal</strong>; juegas con
                tu usuario personal.
              </li>
              <li>
                No utilices la cuenta entregada para jugar ni{" "}
                <strong>modifiques su información</strong>.
              </li>
              <li>
                Cambiar datos de la cuenta <strong>anula la garantía</strong>.
              </li>
            </ul>
          </section>

          {/* === Riesgo de baneo === */}
          <section
            id="riesgo"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#050814]/95 px-4 py-5 sm:px-6 sm:py-6 shadow-[0_18px_50px_rgba(0,0,0,0.85)]"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
              Riesgo de baneo
            </h2>
            <p className="text-sm text-white/80">
              Existe una <strong>probabilidad muy baja</strong> de restricciones
              online por políticas de Nintendo, conocida en el mercado de juegos
              digitales.
            </p>
            <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs sm:text-sm text-red-100">
              De ocurrir un baneo, <strong>Alfeicon Games</strong> no asume
              responsabilidad, ya que depende de normas externas del fabricante.
            </div>
          </section>

          {/* === Sospecha y pruebas === */}
          <section
            id="sospecha"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#050814]/95 px-4 py-5 sm:px-6 sm:py-6 shadow-[0_18px_50px_rgba(0,0,0,0.85)]"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
              Sospecha y pruebas
            </h2>
            <p className="text-sm text-white/80">
              Para evaluar reposición o garantía, se requieren{" "}
              <strong>pruebas claras</strong> de que el fallo no fue por
              acciones del usuario.
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1.5 text-sm text-white/80">
              <li>
                Si las evidencias son <strong>insuficientes</strong>, podremos{" "}
                <strong>negar</strong> la reposición/devolución o intentar otra
                solución.
              </li>
            </ul>
          </section>

          {/* === Garantía === */}
          <section
            id="garantia"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#050814]/95 px-4 py-5 sm:px-6 sm:py-6 shadow-[0_18px_50px_rgba(0,0,0,0.85)]"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
              Garantía
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-white/80">
              <li>
                Clientes nuevos: <strong>10 días</strong> desde la compra.
              </li>
              <li>
                Clientes frecuentes (&gt; 5 compras):{" "}
                <strong>25 días</strong>.
              </li>
              <li>
                Cubre <strong>fallos del juego</strong> no causados por el
                usuario.
              </li>
              <li>
                Incluye <strong>reposición 1 vez</strong> o devolución del{" "}
                <strong>50%</strong> si no es posible reponer.
              </li>
            </ul>

            <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs sm:text-sm text-white/80">
              <p className="font-semibold mb-1">
                No aplica garantía en los siguientes casos:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Se elimina el juego o la cuenta de la consola.</li>
                <li>
                  Corte de luz/apagado u otra interrupción durante la descarga.
                </li>
                <li>Está fuera de plazo de garantía.</li>
                <li>
                  No se vinculó dentro del tiempo operativo indicado por el
                  vendedor.
                </li>
                <li>Se modifica la información de la cuenta.</li>
                <li>
                  Se trata de <strong>packs</strong> (no incluyen garantía salvo
                  tarifa con garantía acordada).
                </li>
              </ul>
            </div>

            <div className="mt-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs sm:text-sm text-emerald-100">
              Si un juego repuesto vuelve a fallar por lo mismo, ya{" "}
              <strong>no queda cubierto</strong>.
            </div>
          </section>

          {/* === Devoluciones === */}
          <section
            id="devoluciones"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#050814]/95 px-4 py-5 sm:px-6 sm:py-6 shadow-[0_18px_50px_rgba(0,0,0,0.85)]"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
              Devoluciones
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-white/80">
              <li>
                Si el vendedor informa que no hay stock tras tu pago, puedes
                pedir <strong>reembolso</strong> o elegir otro juego.
              </li>
              <li>
                Si la entrega supera un <strong>tiempo máximo razonable</strong>{" "}
                por gestión del distribuidor, puedes solicitar devolución.
              </li>
            </ul>
          </section>

          {/* === Pagos === */}
          <section
            id="pagos"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#050814]/95 px-4 py-5 sm:px-6 sm:py-6 shadow-[0_18px_50px_rgba(0,0,0,0.85)]"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
              Pagos
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-white/80">
              <li>
                Es necesario completar el <strong>pago total</strong> antes de
                la instalación.
              </li>
              <li>
                El pago debe enviarse a la{" "}
                <strong>cuenta proporcionada</strong> por el vendedor; de lo
                contrario, Alfeicon Games no asume responsabilidad por el
                dinero.
              </li>
            </ul>
          </section>

          {/* === Condiciones generales === */}
          <section
            id="generales"
            className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#050814]/95 px-4 py-5 sm:px-6 sm:py-6 shadow-[0_18px_50px_rgba(0,0,0,0.85)]"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
              Condiciones generales
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-white/80">
              <li>
                Al comprar aceptas estos <strong>Términos</strong> y las{" "}
                <strong>instrucciones</strong> enviadas por el vendedor.
              </li>
              <li>
                Los tiempos pueden variar según{" "}
                <strong>distribuidor</strong> y demanda.
              </li>
              <li>
                Promos (por ejemplo, <em>ruleta</em>) se rigen por sus reglas
                publicadas en el sitio o redes oficiales.
              </li>
            </ul>

            <p className="mt-4 text-xs sm:text-sm text-white/50">
              © {CURRENT_YEAR} Alfeicon Games — Información y soporte.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}