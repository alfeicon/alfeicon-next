// app/layout.js
import "./globals.css";
import NavBar from "@/components/NavBar";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Alfeicon Games",
  description: "Juegos digitales Nintendo Switch",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-theme="inline">
      <body className="home-bg">
        {/* NavBar */}
        <div id="navbar-root">
          <NavBar />
        </div>

        {/* Contenido principal con padding para evitar que quede debajo del header */}
        <div className="pt-16">{children}</div>

        {/* 🔥 Activar Vercel Analytics en TODA la app */}
        <Analytics />
      </body>
    </html>
  );
}