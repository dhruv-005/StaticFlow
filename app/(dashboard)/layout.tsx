"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/components/theme-provider";

/* ── tiny inline SVG icons ── */
const Icon = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    <path d={d} />
  </svg>
);

const Icons = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  folder:
    "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  shield:
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  menu: "M3 12h18M3 6h18M3 18h18",
  x: "M18 6L6 18M6 6l12 12",
  sun: "M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z",
  moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
};

/* ── nav config ── */
const NAV = [
  { href: "/overview", label: "Overview", icon: Icons.grid },
  { href: "/builder", label: "Builder", icon: Icons.code },
  { href: "/projects", label: "Projects", icon: Icons.folder },
];

/* ── loading skeleton ── */
function LoadingScreen() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--bg)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--accent)] animate-pulse" />
        <p className="text-sm text-[var(--muted)]">Loading…</p>
      </div>
    </div>
  );
}

/* ── main layout ── */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isAdmin, loading } = useAuth();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  /* redirect if not logged in */
  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  /* close sidebar on route change (mobile) */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* lock body scroll when sidebar open on mobile */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (loading || !user) return <LoadingScreen />;

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const navItems = [
    ...NAV,
    ...(isAdmin
      ? [{ href: "/admin", label: "Admin", icon: Icons.shield }]
      : []),
  ];

  const isActive = (href: string) => {
    if (href === "/overview") return pathname === "/overview";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-[100dvh] overflow-hidden bg-[var(--bg)]">
      {/* ── mobile backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* ── sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-[100dvh] w-[260px] max-w-[85vw]
          bg-[var(--surface)] border-r border-[var(--border)]
          flex flex-col
          transition-transform duration-300 ease-in-out
          lg:sticky lg:z-auto lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* logo row */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[var(--border)] shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <span className="text-[var(--bg)] font-bold text-sm">SF</span>
          </div>
          <span className="font-semibold text-[var(--text)] text-[15px]">
            StaticFlow
          </span>
          <button
            className="ml-auto lg:hidden p-1.5 rounded-md text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <Icon d={Icons.x} />
          </button>
        </div>

        {/* nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-colors min-w-0
                  ${
                    active
                      ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/50"
                  }
                `}
              >
                <Icon d={item.icon} />
                <span className="truncate">{item.label}</span>
                {item.href === "/admin" && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)] font-bold shrink-0">
                    ADMIN
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* bottom section */}
        <div className="px-3 py-3 border-t border-[var(--border)] space-y-1 shrink-0">
          {/* theme toggle */}
          <button
            onClick={toggle}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/50 transition-colors"
          >
            <Icon d={theme === "dark" ? Icons.sun : Icons.moon} />
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>

          {/* user info */}
          <div className="flex items-center gap-3 px-3 py-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-xs font-bold text-[var(--accent)] shrink-0">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text)] truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-[var(--muted)] truncate">
                {user.email}
              </p>
            </div>
            {isAdmin && (
              <span className="text-[9px] px-1 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)] font-bold shrink-0">
                A
              </span>
            )}
          </div>

          {/* logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Icon d={Icons.logout} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── main column ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-14 border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="p-2 -ml-2 rounded-md text-[var(--text)] hover:bg-[var(--border)] transition-colors"
            aria-label="Open menu"
          >
            <Icon d={Icons.menu} />
          </button>
          <span className="font-semibold text-[var(--text)] text-[15px]">
            StaticFlow
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-md text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-colors"
              aria-label="Toggle theme"
            >
              <Icon d={theme === "dark" ? Icons.sun : Icons.moon} size={16} />
            </button>
          </div>
        </header>

        {/* scrollable content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
