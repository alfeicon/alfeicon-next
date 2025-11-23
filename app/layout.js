// app/layout.js
import "./globals.css";
import NavBar from "@/components/NavBar";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";

export const metadata = {
  title: "Alfeicon Games",
  description: "Juegos digitales Nintendo Switch",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-theme="inline">
      <body className="home-bg">
        {/* 👇 NavBar envuelto en Suspense por el uso de useSearchParams */}
        <Suspense fallback={<div className="h-16" />}>
          <div id="navbar-root">
            <NavBar />
          </div>
        </Suspense>

        {/* padding-top para que el contenido no quede debajo del header */}
        <div className="pt-16">{children}</div>

        {/* Analytics de Vercel */}
        <Analytics />
      </body>
    </html>
  );
}