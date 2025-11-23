// components/HomeButton.jsx
import Link from "next/link";

export default function HomeButton({ href, color, icon, children }) {
  return (
    <Link
      href={href}
      className="group relative flex h-[64px] items-center gap-3 rounded-2xl px-5
                 text-white font-semibold shadow-[0_12px_28px_rgba(0,0,0,.25)]
                 transition-transform hover:-translate-y-[2px] focus-visible:outline-none"
      style={{ background: color }}
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl">
        {icon}
      </span>
      <span className="text-[18px] leading-none">{children}</span>

      {/* brillo sutil al hover */}
      <span
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,.14), transparent 55%)" }}
      />
    </Link>
  );
}