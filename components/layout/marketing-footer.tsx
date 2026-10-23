import Link from "next/link";
import { Code2, Github } from "lucide-react";

const sections = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/docs", label: "Documentation" },
      { href: "/how-it-works", label: "How It Works" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs", label: "API Reference" },
      { href: "/docs", label: "Getting Started" },
      { href: "/docs", label: "Authentication" },
      { href: "/docs", label: "Deployment" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/", label: "About" },
      { href: "/", label: "Blog" },
      { href: "/", label: "Careers" },
      { href: "/", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/", label: "Privacy Policy" },
      { href: "/", label: "Terms of Service" },
      { href: "/", label: "Cookie Policy" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-crimson flex items-center justify-center">
                <Code2 size={14} className="text-white" />
              </div>
              <span className="font-display font-bold text-[var(--text-primary)]">
                Static<span className="text-crimson">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              AI-powered API development platform. Build, test, and deploy in minutes.
            </p>
          </div>

          {/* Links */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[var(--text-muted)] hover:text-crimson transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-[var(--border)] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} StaticFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/dhruv-005/StaticFlow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-crimson transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
