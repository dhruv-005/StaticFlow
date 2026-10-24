import Link from "next/link";
import { Zap, ArrowLeft, BookOpen, Key, Rocket, Database, Shield, BarChart3 } from "lucide-react";
const sections = [
  { icon: BookOpen, title: "Getting Started", desc: "Install the CLI, create your first project, and deploy in under 5 minutes." },
  { icon: Key, title: "Authentication", desc: "Set up API keys, configure roles, and protect your endpoints." },
  { icon: Rocket, title: "Deployment", desc: "Deploy to production with one click. Custom domains and HTTPS." },
  { icon: Database, title: "Data Modeling", desc: "Define schemas, relationships, and validation rules." },
  { icon: Shield, title: "Security", desc: "Rate limiting, CORS, input validation, and encryption." },
  { icon: BarChart3, title: "Analytics", desc: "Monitor API usage, track errors, and optimize performance." },
];
export default function DocsPage() {
  return (
    <div className="min-h-screen bg-noir-950 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-noir-800/50 bg-noir-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-crimson flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div><span className="font-display font-bold text-xl">StaticFlow</span></Link>
          <Link href="/" className="btn-ghost btn-sm gap-2"><ArrowLeft className="w-4 h-4" /> Home</Link>
        </div>
      </header>
      <section className="pt-32 pb-20 px-4 relative">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16"><h1 className="text-4xl md:text-6xl font-display font-bold mb-4"><span className="text-gradient">Documentation</span></h1><p className="text-xl text-noir-400">Everything you need to build and deploy APIs.</p></div>
          <div className="rounded-xl border border-noir-800 bg-noir-900 p-6 mb-12 font-mono text-sm shadow-glow-sm">
            <p className="text-noir-500 mb-2"># Quick Start</p>
            <p><span className="text-crimson">$</span> npx staticflow init my-api</p>
            <p><span className="text-crimson">$</span> cd my-api</p>
            <p><span className="text-crimson">$</span> npx staticflow dev</p>
            <p className="text-green-400 mt-1">✓ API running at http://localhost:3001</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((s) => (
              <div key={s.title} className="card p-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-crimson/10 flex items-center justify-center mb-4 group-hover:bg-crimson/20 transition-colors"><s.icon className="w-6 h-6 text-crimson" /></div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-noir-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
