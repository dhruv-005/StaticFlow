import Link from "next/link";
import { ArrowRight, Zap, Shield, Code2, Database, Globe, BarChart3, ChevronDown, Menu, X, Sun, Moon } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant Generation", desc: "Describe your API in plain English. Get working endpoints in seconds." },
  { icon: Code2, title: "Visual Builder", desc: "Drag, drop, and configure. No boilerplate, no setup." },
  { icon: Database, title: "Mock Data", desc: "Auto-seed realistic test data for every endpoint you create." },
  { icon: Shield, title: "Auth Ready", desc: "API key management and role-based access out of the box." },
  { icon: Globe, title: "One-Click Deploy", desc: "Push to production instantly. HTTPS, CDN, and scaling handled." },
  { icon: BarChart3, title: "Built-in Analytics", desc: "Monitor requests, latency, and errors from your dashboard." },
];

const steps = [
  { num: "01", title: "Describe Your API", desc: "Tell StaticFlow what entities you need — users, products, orders, anything." },
  { num: "02", title: "Configure & Customize", desc: "Set fields, relationships, validation rules, and auth requirements." },
  { num: "03", title: "Test in Real-Time", desc: "Use the built-in API tester to hit your endpoints before deploying." },
  { num: "04", title: "Deploy & Scale", desc: "One click to production. Your API is live with full documentation." },
];

const faqs = [
  { q: "Is StaticFlow free to use?", a: "Yes! The free tier includes 3 projects, 10 endpoints each, and 1,000 requests/day." },
  { q: "Can I use my own database?", a: "Absolutely. Connect PostgreSQL, MySQL, or MongoDB in the settings panel." },
  { q: "How does deployment work?", a: "Click deploy, and we provision a live URL with HTTPS in under 30 seconds." },
  { q: "Is my data secure?", a: "All data is encrypted at rest and in transit. SOC 2 compliance on Enterprise plans." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-noir-950 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-noir-800/50 bg-noir-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-crimson flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl">StaticFlow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-noir-400">
            <Link href="/features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost btn-sm">Log In</Link>
            <Link href="/signup" className="btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-crimson/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-crimson/30 bg-crimson/5 text-crimson text-sm font-medium mb-8">
            <Zap className="w-4 h-4" /> Now in Public Beta
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            Build APIs in <span className="text-gradient">Minutes</span>,<br />Not Months
          </h1>
          <p className="text-xl text-noir-400 max-w-2xl mx-auto mb-10">
            StaticFlow generates production-ready REST APIs from a simple description. Mock, test, and deploy — all from one dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary btn-lg gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/how-it-works" className="btn-secondary btn-lg">
              See How It Works
            </Link>
          </div>
          <div className="mt-16 rounded-xl border border-noir-800 bg-noir-900/80 p-6 text-left font-mono text-sm text-noir-300 max-w-2xl mx-auto shadow-glow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-crimson" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-noir-500">terminal</span>
            </div>
            <p><span className="text-crimson">$</span> npx staticflow init my-api</p>
            <p className="text-green-400">✓ Created 5 endpoints in 3.2s</p>
            <p><span className="text-crimson">$</span> npx staticflow deploy</p>
            <p className="text-green-400">✓ Live at https://my-api.staticflow.dev</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Everything You Need</h2>
            <p className="section-subtitle mx-auto">A complete toolkit for API development, from prototype to production.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card p-6 group">
                <div className="w-12 h-12 rounded-lg bg-crimson/10 flex items-center justify-center mb-4 group-hover:bg-crimson/20 transition-colors">
                  <f.icon className="w-6 h-6 text-crimson" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-noir-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-noir-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="section-subtitle mx-auto">Four steps from idea to live API.</p>
          </div>
          <div className="space-y-12">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-6 items-start">
                <span className="text-4xl font-display font-bold text-crimson/30">{s.num}</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-noir-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="card group">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-medium list-none">
                  {f.q}
                  <ChevronDown className="w-5 h-5 text-noir-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-noir-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center card p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-crimson/5" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build?</h2>
            <p className="text-noir-400 mb-8">Join thousands of developers shipping APIs faster with StaticFlow.</p>
            <Link href="/signup" className="btn-primary btn-lg gap-2">
              Start Building Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-noir-800 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-crimson flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold">StaticFlow</span>
          </div>
          <p className="text-noir-500 text-sm">© 2025 StaticFlow. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-noir-400">
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <a href="https://github.com/dhruv-005/StaticFlow" target="_blank" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
