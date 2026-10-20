import Link from "next/link";

export function CatalystLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 no-underline">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold"
        style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
      >
        ⚡
      </div>
      <span className="text-base font-bold tracking-tight" style={{ color: "var(--text)" }}>
        StaticFlow
      </span>
    </Link>
  );
}
