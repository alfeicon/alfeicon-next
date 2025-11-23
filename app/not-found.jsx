// app/not-found.jsx
import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function GlobalNotFound() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-24 sm:pt-28 flex items-center justify-center">
      <section className="w-full rounded-[32px] border border-white/10 bg-gradient-to-b from-[#050814] via-[#050814] to-[#020309] shadow-[0_24px_60px_rgba(3,6,24,0.9)] px-6 sm:px-10 py-10 sm:py-14 flex flex-col items-center text-center">
        {/* circulito con efecto */}
        <div className="relative mb-6">
          <div className="absolute inset-0 blur-3xl bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.4),transparent)] opacity-70" />
          <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-white/5 border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.9)]">
            <span className="text-4xl sm:text-5xl">🔎</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
          Página no encontrada
        </h1>

        <p className="max-w-xl text-sm sm:text-base text-white/70 leading-relaxed">
          No pudimos encontrar la página que estás buscando. 
          Puede que el enlace esté roto o que el contenido ya no exista.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <BackButton />

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm font-medium text-white/90 hover:bg-white/20 hover:border-white/40 transition"
          >
            Ir al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}