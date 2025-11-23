// components/NavBar.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  // sombreado de navbar al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pathname = usePathname();
  const isHome = pathname === "/";
  const isPacks = pathname.startsWith("/packs");
  const isUnit = pathname.startsWith("/unitarios");

  /* ===== Drawer de búsqueda ===== */
  const [openSearch, setOpenSearch] = useState(false);
  const panelRef = useRef(null);

  // cerrar al hacer click fuera + ESC
  useEffect(() => {
    if (!openSearch) return;

    function onDocClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpenSearch(false);
      }
    }

    function onKey(e) {
      if (e.key === "Escape") setOpenSearch(false);
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openSearch]);

  // bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (!openSearch) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openSearch]);

  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState(sp.get("q") || "");
  const [min, setMin] = useState(sp.get("min") || "");
  const [max, setMax] = useState(sp.get("max") || "");

  // sincronizar campos cuando cambian los query params
  useEffect(() => {
    setQ(sp.get("q") || "");
    setMin(sp.get("min") || "");
    setMax(sp.get("max") || "");
  }, [sp]);

  function doSearch() {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (min) p.set("min", String(Number(min)));
    if (max) p.set("max", String(Number(max)));

    router.push(`${pathname}${p.toString() ? "?" + p.toString() : ""}`, {
      scroll: true,
    });
    setOpenSearch(false);
  }

  function clearSearch() {
    setQ("");
    setMin("");
    setMax("");
    router.push(pathname, { scroll: true });
  }

  /* ===== Menú hamburguesa ===== */
  const [menuOpen, setMenuOpen] = useState(false);

  // click en la lupa:
  // - si el drawer está abierto y no hay filtros → se cierra
  // - en cualquier otro caso → cierra menú y abre buscador
  const handleSearchClick = () => {
    const hasFilters = q.trim() || min || max;

    if (openSearch && !hasFilters) {
      setOpenSearch(false);
      return;
    }

    setMenuOpen(false);
    setOpenSearch(true);
  };

  // links con íconos
  const links = useMemo(() => {
    const base = {
      "/": {
        href: "/",
        label: "Inicio",
        icon: "/house.fill.svg",
      },
      "/packs": {
        href: "/packs",
        label: "Packs de juegos",
        icon: "/shippingbox.fill.svg",
      },
      "/unitarios": {
        href: "/unitarios",
        label: "Juegos unitarios",
        icon: "/gamecontroller.circle.fill.svg",
      },
      "/instrucciones": {
        href: "/instrucciones",
        label: "Instrucciones",
        icon: "/book.pages.fill.svg",
      },
      "/terminos": {
        href: "/terminos",
        label: "Términos y condiciones",
        icon: "/person.crop.circle.badge.questionmark.svg",
      },
    };

    const arr = [base["/"]];

    if (isPacks) {
      arr.push(base["/unitarios"]);
    } else if (isUnit) {
      arr.push(base["/packs"]);
    } else {
      arr.push(base["/packs"], base["/unitarios"]);
    }

    arr.push(base["/instrucciones"], base["/terminos"]);
    return arr;
  }, [isPacks, isUnit]);

  return (
    <>
      {/* ===== NAVBAR FIJA ===== */}
      <header
        className={[
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          scrolled
            ? "bg-[rgba(0,0,0,0.55)] backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.6)] border-b border-white/10"
            : "bg-[rgba(20,20,22,0.65)] backdrop-blur-sm border-b border-white/5",
        ].join(" ")}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="Alfeicon Games"
              width={28}
              height={28}
              className="opacity-95 group-hover:opacity-100 transition"
              priority
            />
            <span className="text-[16px] font-semibold tracking-wide text-white group-hover:text-white/90">
              Alfeicon Games
            </span>
          </Link>

          {/* Lado derecho */}
          <div className="flex items-center gap-3">
            {/* Lupa solo en packs/unitarios */}
            {(isPacks || isUnit) && (
              <button
                aria-label="Buscar"
                onClick={handleSearchClick}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 hover:bg-white/10 text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="16.65"
                    y1="16.65"
                    x2="21"
                    y2="21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}

            {/* Redes solo en home */}
            {isHome && (
              <div className="flex items-center gap-4">
                <a
                  href="https://instagram.com/alfeicon_games"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 hover:opacity-100 transition transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <Image
                    src="/instagram.svg"
                    alt="Instagram"
                    width={22}
                    height={22}
                    className="filter invert brightness-150 drop-shadow-[0_0_8px_rgba(255,120,255,0.45)]"
                  />
                </a>
                <a
                  href="https://facebook.com/alfeicon-games"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 hover:opacity-100 transition transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <Image
                    src="/facebook.svg"
                    alt="Facebook"
                    width={22}
                    height={22}
                    className="filter invert brightness-150 drop-shadow-[0_0_8px_rgba(90,150,255,0.4)]"
                  />
                </a>
                <a
                  href="https://wa.me/56926411278"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 hover:opacity-100 transition transform hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <Image
                    src="/whatsapp.svg"
                    alt="WhatsApp"
                    width={22}
                    height={22}
                    className="filter invert brightness-150 drop-shadow-[0_0_8px_rgba(50,255,150,0.55)]"
                  />
                </a>
              </div>
            )}

            {/* Menú hamburguesa en todas menos home */}
            {!isHome && (
              <button
                aria-label="Menú"
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 hover:bg-white/10 text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </nav>

        {/* Menú desplegable (con iconos) */}
        {!isHome && menuOpen && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-3 text-white">
            <div className="mt-2 grid gap-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-medium flex items-center justify-between"
                >
                  <span className="flex items-center gap-3">
                    {l.icon && (
                      <Image
                        src={l.icon}
                        alt={l.label}
                        width={18}
                        height={18}
                        className="opacity-90"
                      />
                    )}
                    {l.label}
                  </span>
                  <span className="text-xs text-white/50">›</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ===== DRAWER BÚSQUEDA PACKS/UNITARIOS ===== */}
      {(isPacks || isUnit) && openSearch && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-[80]">
          {/* Fondo oscuro */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Panel */}
          <div className="absolute inset-0 z-[81] flex items-start justify-end px-3 py-4 sm:px-6 sm:py-6">
            <aside
              ref={panelRef}
              className="relative ml-auto flex w-full max-w-[420px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#151922] text-white shadow-2xl transition-transform duration-200 max-h-[calc(100vh-4rem)] translate-x-0"
            >
              {/* Header del drawer */}
              <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
                <h3 className="font-bold">
                  Buscar {isPacks ? "packs" : "juegos"}
                </h3>
                <button
                  className="text-2xl"
                  onClick={() => setOpenSearch(false)}
                >
                  ×
                </button>
              </div>

              {/* Contenido del formulario */}
              <div className="px-4 py-4 grid gap-3">
                <label className="grid gap-1">
                  <span className="text-sm text-white/70">
                    {isPacks
                      ? "Nombres de juegos (separa por coma)"
                      : "Nombre del juego"}
                  </span>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={
                      isPacks
                        ? "Zelda, Mario, Animal Crossing…"
                        : "Zelda, Mario…"
                    }
                    className="h-11 rounded-xl bg-white/5 border border-white/10 px-3 outline-none focus:border-[#7c4dff] focus:ring-2 focus:ring-[#7c4dff]/30"
                  />
                  {isPacks && (
                    <p className="text-xs text-white/45">
                      Ej: Zelda, Mario, Pokémon (busca packs que contengan
                      cualquiera de esos juegos).
                    </p>
                  )}
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1">
                    <span className="text-sm text-white/70">
                      Precio mínimo (CLP)
                    </span>
                    <input
                      inputMode="numeric"
                      value={min}
                      onChange={(e) =>
                        setMin(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="0"
                      className="h-11 max-w-[150px] rounded-xl bg:white/5 bg-white/5 border border-white/10 px-3 outline-none focus:border-[#7c4dff] focus:ring-2 focus:ring-[#7c4dff]/30"
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-sm text-white/70">
                      Precio máximo (CLP)
                    </span>
                    <input
                      inputMode="numeric"
                      value={max}
                      onChange={(e) =>
                        setMax(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="80000"
                      className="h-11 max-w-[150px] rounded-xl bg:white/5 bg-white/5 border border-white/10 px-3 outline-none focus:border-[#7c4dff] focus:ring-2 focus:ring-[#7c4dff]/30"
                    />
                  </label>
                </div>
              </div>

              {/* Botones */}
              <div className="px-4 pb-4 pt-2 flex gap-2 justify-end bg-[#151922]">
                <button
                  className="h-11 px-4 rounded-xl border border-white/20 text-white/90 hover:bg-white/10"
                  onClick={clearSearch}
                >
                  Limpiar
                </button>
                <button
                  className="h-11 px-5 rounded-xl bg-[#7c4dff] text-white font-bold hover:opacity-90"
                  onClick={doSearch}
                >
                  Buscar
                </button>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* separador para que el contenido no quede bajo la barra */}
      <div className="h-16" />
    </>
  );
}