import { Metadata } from "next";
import { PricingCards } from "@/components/landing/pricing-cards";
import { FAQ } from "@/components/landing/faq";
import { Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — StaticFlow",
  description: "Start free. Scale when you're ready. No hidden costs, no credit card required.",
};

const comparison = [
  { feature: "API Projects", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "AI Generation", free: "Local (Ollama)", pro: "Cloud + Local", enterprise: "Custom AI" },
  { feature: "Security Scans", free: "Quick only", pro: "Deep + Full", enterprise: "OWASP Audit" },
  { feature: "Performance Tests", free: "Basic", pro: "Advanced", enterprise: "Custom" },
  { feature: "Team Members", free: "1", pro: "5", enterprise: "Unlimited" },
  { feature: "Custom Domains", free: false, pro: true, enterprise: true },
  { feature: "CI/CD Pipeline", free: false, pro: true, enterprise: true },
  { feature: "Compliance Checker", free: false, pro: false, enterprise: true },
  { feature: "Voice-to-API", free: false, pro: false, enterprise: true },
  { feature: "SLA Guarantee", free: false, pro: false, enterprise: true },
  { feature: "Support", free: "Community", pro: "Priority", enterprise: "Dedicated" },
];

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto h-4 w-4 text-cyber-green" />
    ) : (
      <X className="mx-auto h-4 w-4 text-cyber-white/20" />
    );
  }
  return <span className="text-sm text-cyber-white/70">{value}</span>;
}

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="relative px-6 pt-32 pb-10 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-black tracking-tight text-cyber-white sm:text-5xl">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h1>
          <p className="mt-4 text-lg text-cyber-white/50">
            Start building for free. Upgrade when your APIs need more power.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 py-10">
        <PricingCards />
      </section>

      {/* Comparison Table */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-cyber-white">
            Feature <span className="neon-text">Comparison</span>
          </h2>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-cyber-white/5">
                    <th className="px-6 py-4 text-sm font-semibold text-cyber-white/60">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-cyber-white/60">
                      Free
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-cyber-cyan">
                      Pro
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-cyber-purple">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={`border-b border-cyber-white/5 ${
                        i % 2 === 0 ? "bg-cyber-white/[0.01]" : ""
                      }`}
                    >
                      <td className="px-6 py-3 text-sm text-cyber-white/80">
                        {row.feature}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <CellValue value={row.free} />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <CellValue value={row.pro} />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <CellValue value={row.enterprise} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <FAQ />
      </section>
    </div>
  );
}
