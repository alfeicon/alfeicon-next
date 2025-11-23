// app/unitarios/page.jsx
import UnitariosHeroCard from "@/components/UnitariosHeroCard";
import UnitariosToolbar from "@/components/UnitariosToolbar";
import { fetchUnitarios } from "@/lib/sheets";

export const revalidate = 60;

export default async function UnitariosPage() {
  const juegos = await fetchUnitarios();
  const total = juegos.length;
  const enOferta = juegos.filter((j) => j.enOferta).length;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-28">
      <UnitariosHeroCard juegos={juegos} total={total} enOferta={enOferta} />

      {/* ancla para botones tipo “Ver catálogo completo / Ver ofertas” */}
      <div id="unitarios" />

      <header className="mb-6">
        <h2 className="text-3xl sm:text-4xl font-black text-white text-center sm:text-left">
          Catálogo de juegos unitarios
        </h2>
      </header>

      {/* Toolbar que lee los parámetros de la URL (q, min, max, ofertas) */}
      <UnitariosToolbar juegos={juegos} />
    </main>
  );
}