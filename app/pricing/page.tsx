import Link from "next/link";
import { Zap, ArrowLeft, Check } from "lucide-react";
const plans = [
  { name: "Free", price: "$0", period: "forever", desc: "Perfect for prototyping.", features: ["3 projects", "10 endpoints each", "1,000 requests/day", "Community support", "Basic analytics"], cta: "Get Started", hl: false },
  { name: "Pro", price: "$29", period: "/month", desc: "For professionals and teams.", features: ["Unlimited projects", "Unlimited endpoints", "100K requests/day", "Priority support", "Advanced analytics", "Custom domains", "Team collaboration"], cta: "Start Free Trial", hl: true },
  { name: "Enterprise", price: "Custom", period: "", desc: "For organizations.", features: ["Everything in Pro", "Unlimited requests", "SSO & SAML", "Dedicated support", "SLA guarantee", "On-premise option", "Custom integrations"], cta: "Contact Sales", hl: false },
];
export default function PricingPage() {
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
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16"><h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Simple <span className="text-gradient">Pricing</span></h1><p className="text-xl text-noir-400">Start free. Scale when ready.</p></div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((p) => (
              <div key={p.name} className={`card-static p-8 flex flex-col ${p.hl ? "border-crimson/50 shadow-glow relative" : ""}`}>
                {p.hl && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-crimson text-white text-xs font-bold rounded-full">Most Popular</div>}
                <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                <p className="text-noir-400 text-sm mb-4">{p.desc}</p>
                <div className="mb-6"><span className="text-4xl font-display font-bold">{p.price}</span><span className="text-noir-400">{p.period}</span></div>
                <ul className="space-y-3 mb-8 flex-1">{p.features.map((f) => (<li key={f} className="flex items-center gap-2 text-sm text-noir-300"><Check className="w-4 h-4 text-crimson flex-shrink-0" /> {f}</li>))}</ul>
                <Link href="/signup" className={p.hl ? "btn-primary btn-lg w-full text-center" : "btn-secondary btn-lg w-full text-center"}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
