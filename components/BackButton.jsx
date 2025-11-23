// components/BackButton.jsx
"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-white/80 hover:text-white px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition"
    >
      <span className="text-lg leading-none">←</span>
      <span className="text-xs sm:text-sm font-medium">
        Volver atrás
      </span>
    </button>
  );
}