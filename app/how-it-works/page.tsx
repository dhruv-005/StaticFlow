import Link from "next/link";
import { Zap, ArrowLeft, ArrowRight } from "lucide-react";
const steps = [
  { num: "01", title: "Describe Your API", desc: "Tell StaticFlow what entities you need — users, products, orders, anything.", code: "$ npx staticflow init my-api\n> What entities do you need?\n> users, products, orders" },
  { num: "02", title: "Configure & Customize", desc: "Set fields, relationships, validation rules, and auth requirements.", code: "model User {\n  id    String @id\n  email String @unique\n  role  Role   @default(USER)\n}" },
  { num: "03", title: "Test in Real-Time", desc: "Use the built-in API tester to hit your endpoints with mock data.", code: "GET /api/v1/users\n> 200 OK (12ms)\n> { data: [...], total: 42 }" },
  { num: "04", title: "Deploy & Scale", desc: "One click to production. HTTPS, CDN, and auto-scaling.", code: "$ npx staticflow deploy\n✓ Live at my-api.staticflow.dev\n✓ 5 endpoints • HTTPS • CDN" },
];
export default function HowItWorksPage() {
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
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-16"><h1 className="text-4xl md:text-6xl font-display font-bold mb-4">How It <span className="text-gradient">Works</span></h1><p className="text-xl text-noir-400">Four steps from idea to live API.</p></div>
          <div className="space-y-16">
            {steps.map((s) => (
              <div key={s.num} className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1"><span className="text-5xl font-display font-bold text-crimson/20">{s.num}</span><h3 className="text-2xl font-bold mt-2 mb-3">{s.title}</h3><p className="text-noir-400 leading-relaxed">{s.desc}</p></div>
                <div className="flex-1 w-full"><div className="rounded-xl border border-noir-800 bg-noir-900 p-5 font-mono text-sm text-noir-300 shadow-glow-sm"><pre className="whitespace-pre-wrap">{s.code}</pre></div></div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16"><Link href="/signup" className="btn-primary btn-lg gap-2">Start Building Free <ArrowRight className="w-5 h-5" /></Link></div>
        </div>
      </section>
    </div>
  );
}
