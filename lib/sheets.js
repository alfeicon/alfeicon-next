// lib/sheets.js

/* ================== CSV PARSER GENÉRICO ================== */
function parseCSV(csv) {
  const rows = [];
  let row = [], cell = "", inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const c = csv[i], n = csv[i + 1];

    if (c === '"' && n === '"') { cell += '"'; i++; continue; } // comillas escapadas
    if (c === '"') { inQuotes = !inQuotes; continue; }

    if (c === "," && !inQuotes) { row.push(cell); cell = ""; continue; }

    if ((c === "\n" || c === "\r") && !inQuotes) {
      if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
      row = []; cell = "";
      if (c === "\r" && n === "\n") i++; // consumir \r\n
      continue;
    }
    cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function headerIndex(headers, name) {
  return headers.findIndex(
    (h) => (h || "").trim().toLowerCase() === name.toLowerCase()
  );
}

/* ================== PACKS DE JUEGOS ================== */
export async function fetchPacks() {
  const url = process.env.SHEETS_CSV_URL;
  if (!url) throw new Error("Falta SHEETS_CSV_URL en .env.local");

  const res = await fetch(url, { cache: "no-store" });
  const csv = await res.text();
  const rows = parseCSV(csv);
  if (!rows.length) return [];

  const [headers, ...data] = rows;

  const iId      = headerIndex(headers, "Pack ID");
  const iJuegos  = headerIndex(headers, "Juegos Incluidos");
  const iPrecio  = headerIndex(headers, "Precio CLP");
  const iEstado  = headerIndex(headers, "Estado");
  const iConsola = headerIndex(headers, "Consola");

  const packs = data
    .map((r) => {
      const id = Number(String(r[iId] || "").trim());
      const juegosStr  = (r[iJuegos]  || "").trim();
      const consolaRaw = (r[iConsola] || "Nintendo Switch").trim();

      // Precio: limpia $, puntos, etc.
      const precio =
        Number(String(r[iPrecio] || "0").replace(/\D+/g, "")) || 0;

      // Juegos: separar por coma, punto y coma o salto de línea
      const juegos = juegosStr
        .split(/,|;|\n|·/g)
        .map((s) => s.trim())
        .filter(Boolean);

      // Título simple: primer juego o "Pack"
      const titulo = juegos[0] || "Pack";

      // Consola completa (ej: "Nintendo Switch, Nintendo Switch 2")
      const consola = consolaRaw || "Nintendo Switch";

      return {
        id,
        titulo,
        consola,
        precioCLP: precio,
        estado: (r[iEstado] || "").trim(),
        juegos,
      };
    })
    .filter((p) => Number.isFinite(p.id) && p.id > 0);

  return packs;
}

export async function fetchPackById(id) {
  const packs = await fetchPacks();
  return packs.find((p) => String(p.id) === String(id)) || null;
}

/* ================== JUEGOS UNITARIOS ================== */

export async function fetchUnitarios() {
  const url = process.env.SHEETS_UNITARIOS_CSV_URL;
  if (!url) throw new Error("Falta SHEETS_UNITARIOS_CSV_URL en .env.local");

  const res = await fetch(url, { cache: "no-store" });
  const csv = await res.text();
  const rows = parseCSV(csv);
  if (!rows.length) return [];

  const [headers, ...data] = rows;

  const iNombre       = headerIndex(headers, "NOMBRE DE JUEGOS");
  const iPrecio       = headerIndex(headers, "Precio");
  const iEnOferta     = headerIndex(headers, "En Oferta");
  const iPrecioOferta = headerIndex(headers, "Precio Oferta");
  const iEspacio      = headerIndex(headers, "Espacio necesario");
  const iImagen       = headerIndex(headers, "imagen");

  // 👇 NUEVO: índices para descripción y trailer
  const iDescripcion  = headerIndex(headers, "descripcion");
  const iTrailer      = headerIndex(headers, "trailer");

  const juegos = data
    .map((r, idx) => {
      const nombre = (r[iNombre] || "").trim();
      if (!nombre) return null;

      // Precio base
      const precioBase =
        Number(String(r[iPrecio] || "0").replace(/\D+/g, "")) || 0;

      // En oferta: "SI", "SÍ", "si", etc.
      const flagOferta = String(r[iEnOferta] || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // quita tildes

      const enOferta = flagOferta === "si";

      // Precio oferta (si existe)
      const precioOfertaNum =
        Number(String(r[iPrecioOferta] || "0").replace(/\D+/g, "")) || 0;

      const precioOfertaCLP =
        enOferta && precioOfertaNum > 0 ? precioOfertaNum : null;

      const espacio = (r[iEspacio] || "").trim();
      const imagen  = (r[iImagen] || "").trim();

      // 👇 NUEVO: descripción y trailer (si la columna no existe, queda "")
      const descripcion =
        iDescripcion !== -1 ? (r[iDescripcion] || "").trim() : "";
      const trailer =
        iTrailer !== -1 ? (r[iTrailer] || "").trim() : "";

      const titulo = nombre;

      return {
        id: idx + 1,              // ID secuencial
        titulo,                   // nombre del juego
        juegos: [titulo],         // para componentes que esperan "juegos"
        consola: "Nintendo Switch",
        precioCLP: precioBase,
        enOferta,
        precioOfertaCLP,
        espacio,
        imagen,
        descripcion,              // 👈 ahora viaja al front
        trailer,                  // 👈 idem
        estado: enOferta ? "En oferta" : "Disponible",
      };
    })
    .filter(Boolean);

  return juegos;
}