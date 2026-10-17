"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "Is StaticFlow free to use?", a: "Yes. The free tier includes 3 API projects with local AI generation, quick security scans, basic performance testing, auto documentation, and Vercel deployment. No credit card required." },
  { q: "What programming languages are supported?", a: "Node.js/Express, Python/FastAPI, Python/Django, Java/Spring Boot, Go/Gin, and PHP/Laravel. You choose your preferred stack when generating an API." },
  { q: "How does the security scanning work?", a: "Our engine combines OWASP ZAP, Nuclei, SQLMap, Semgrep, and custom AI analysis. It tests for SQL injection, XSS, CSRF, JWT vulnerabilities, and the full OWASP Top 10." },
  { q: "Can I use StaticFlow with existing code?", a: "Yes. The AI API Doctor feature lets you paste any existing API code for analysis. It identifies bugs, vulnerabilities, and performance issues, then suggests fixes." },
  { q: "Where are my APIs deployed?", a: "You choose. StaticFlow supports one-click deployment to Vercel, Render, Fly.io, Railway, AWS, GCP, and Azure. You can also export Docker containers." },
  { q: "Is the generated code production-ready?", a: "Yes. Every generated API includes input validation, error handling, HTTP status codes, rate limiting, CORS, security headers, JWT auth, and database indexing." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="catalyst-section">
      <div className="catalyst-container-narrow">
        <div className="mb-12 text-center">
          <span className="catalyst-badge mb-4 inline-flex">FAQ</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Frequently asked questions</h2>
        </div>

        <div className="catalyst-card divide-y" style={{ borderColor: "var(--border)" }}>
          {faqs.map((f, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                aria-expanded={open === i}
              >
                <span className="pr-4 text-base font-semibold" style={{ color: "var(--text)" }}>{f.q}</span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 transition-transform duration-200"
                  style={{ color: "var(--text-muted)", transform: open === i ? "rotate(180deg)" : "rotate(0)" }}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open === i ? "300px" : "0px", opacity: open === i ? 1 : 0 }}
              >
                <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
