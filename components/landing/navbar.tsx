"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { CatalystLogo } from "@/components/shared/catalyst-logo";

const links = [
  { href: "/features", label: "Features" },
  { href: "/demo", label: "Demo" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        backgroundColor: scrolled ? "var(--surface)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <nav className="catalyst-container flex h-16 items-center justify-between">
        <CatalystLogo href="/home" />

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: pathname === l.href ? "var(--text)" : "var(--text-muted)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href="/login" className="text-sm font-medium transition-colors hover:opacity-70" style={{ color: "var(--text-muted)" }}>
            Log in
          </Link>
          <Link href="/register" className="catalyst-btn-primary !py-2 !px-4 !text-sm">
            Get Started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: "var(--text)" }} aria-label="Menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t md:hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="catalyst-container flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                style={{
                  color: pathname === l.href ? "var(--text)" : "var(--text-muted)",
                  backgroundColor: pathname === l.href ? "var(--surface-muted)" : "transparent",
                }}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
              <Link href="/login" className="catalyst-btn-secondary !justify-center" onClick={() => setMobileOpen(false)}>Log in</Link>
              <Link href="/register" className="catalyst-btn-primary !justify-center" onClick={() => setMobileOpen(false)}>Get Started Free</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
