"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Settings,
  Key,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronDown,
  Zap,
} from "lucide-react";

const menuItems = [
  { href: "/settings/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/keys", icon: Key, label: "API Keys" },
  { href: "/settings/billing", icon: CreditCard, label: "Billing" },
  { href: "/help", icon: HelpCircle, label: "Help & Support" },
];

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all hover:bg-cyber-white/5"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyber-purple/10 border border-cyber-purple/20 text-xs font-bold text-cyber-purple">
          JD
        </div>
        <span className="hidden text-sm font-medium text-cyber-white/60 sm:inline-block">
          John
        </span>
        <ChevronDown className="hidden h-3 w-3 text-cyber-white/30 sm:block" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-cyber-white/10 bg-cyber-navy/95 shadow-2xl backdrop-blur-xl">
            {/* User Info */}
            <div className="border-b border-cyber-white/5 px-4 py-3">
              <p className="text-sm font-bold text-cyber-white">John Doe</p>
              <p className="text-xs text-cyber-white/30">john@example.com</p>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-cyber-cyan/20 bg-cyber-cyan/5 px-2 py-0.5 text-[10px] font-semibold text-cyber-cyan">
                <Zap className="h-2.5 w-2.5" />
                Free Plan
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-cyber-white/50 hover:bg-cyber-white/5 hover:text-cyber-white transition-all"
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-cyber-white/5 py-1">
              <button
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-cyber-red/60 hover:bg-cyber-red/5 hover:text-cyber-red transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
