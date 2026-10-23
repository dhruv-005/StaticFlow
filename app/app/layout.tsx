"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { useState } from "react";
import { X } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Desktop sidebar */}
      <AppSidebar />

      {/* Mobile nav overlay */}
      {mobileNav && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNav(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-[var(--sidebar-bg)] border-r border-[var(--border)] animate-fade-in">
            <div className="flex justify-end p-3">
              <button onClick={() => setMobileNav(false)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]">
                <X size={18} />
              </button>
            </div>
            <AppSidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <AppTopbar onMobileMenu={() => setMobileNav(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
