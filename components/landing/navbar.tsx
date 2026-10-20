"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "/features", label: "Features" },
  { href: "/demo", label: "Demo" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b transition-all duration-200"
      style={{
        background: scrolled ? "var(--surface)" : "var(--bg)",
        borderColor: scrolled ? "var(--border)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
            style={{ background: "var(--accent)", color: "#171815" }}
          >
            SF
          </div>
          <span className="text-lg font-bold" style={{ color: "var(--text)" }}>
            StaticFlow
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{
                color: pathname === link.href ? "var(--accent)" : "var(--muted)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="ghost" size="sm" style={{ color: "var(--text)" }}>
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" style={{ background: "var(--accent)", color: "#171815" }}>
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-lg p-2 md:hidden"
          onClick={() => setOpen(!open)}
          style={{ color: "var(--text)" }}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className="overflow-hidden transition-all duration-300 md:hidden"
        style={{
          maxHeight: open ? 400 : 0,
          background: "var(--surface)",
          borderTop: open ? "1px solid var(--border)" : "none",
        }}
      >
        <nav className="flex flex-col px-4 py-3">
          {LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium"
              style={{
                color: pathname === link.href ? "var(--accent)" : "var(--text)",
                background: pathname === link.href ? "var(--bg)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <Link href="/login">
              <Button variant="outline" className="w-full" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="w-full" style={{ background: "var(--accent)", color: "#171815" }}>
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}