"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Code2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
];

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="flex items-center justify-between rounded-pill bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] px-5 py-3 shadow-card">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-crimson flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow">
              <Code2 size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-[var(--text-primary)] tracking-tight">
              Static<span className="text-crimson">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-crimson rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-medium bg-crimson text-white rounded-xl hover:bg-crimson-hover hover:shadow-glow transition-all duration-200 active:scale-[0.98]">
              Get Started
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 rounded-2xl bg-[var(--bg-surface)]/95 backdrop-blur-xl border border-[var(--border)] p-4 shadow-card animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-crimson hover:bg-crimson-soft rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[var(--border)] mt-2 pt-2 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-medium text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-elevated)]">
                Sign In
              </Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-medium text-center bg-crimson text-white rounded-xl hover:bg-crimson-hover">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
