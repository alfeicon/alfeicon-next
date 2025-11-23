// app/packs/page.jsx
import PacksToolbar from "@/components/PacksToolbar";
import PacksHeroCard from "@/components/PacksHeroCard";
import { fetchPacks } from "@/lib/sheets";

export const revalidate = 60;

export default async function PacksPage() {
  // Traer todos los packs (incluye no disponibles)
  const packs = await fetchPacks({ soloDisponibles: false });

  // Normalizar/ordenar por ID
  const base = [...packs].sort((a, b) => Number(a.id) - Number(b.id));

  const total = base.length;
  const disponibles = base.filter(
    (p) => (p.estado || "").toLowerCase().includes("dispon")
  ).length;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-28">
      {/* Tarjeta de resumen de packs */}
      <PacksHeroCard total={total} disponibles={disponibles} />

      <div id="packs" />

      {/* Título de sección */}
      <header className="mb-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-white">
          Pack de Juegos
        </h2>
        <p className="text-sm text-white/60 mt-1">catálogo completo</p>
        {/* La barra de filtros ahora vive dentro de PacksToolbar,
            así evitamos duplicados (antes estaba <PackFilterChips /> aquí). */}
      </header>

      {/* Listado + filtros (chips, búsqueda, min/max) */}
      <PacksToolbar packs={base} />
    </main>
  );
}