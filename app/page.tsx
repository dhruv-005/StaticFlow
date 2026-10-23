import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for learning and personal projects.",
    cta: "Start Free",
    popular: false,
    features: [
      "3 projects",
      "1,000 API requests/month",
      "AI API generation",
      "Built-in API tester",
      "Community support",
      "Basic analytics",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    desc: "For professional developers and small teams.",
    cta: "Start Pro Trial",
    popular: true,
    features: [
      "Unlimited projects",
      "100,000 API requests/month",
      "Advanced AI generation",
      "Custom domains",
      "Priority support",
      "Advanced analytics",
      "Team collaboration (up to 5)",
      "CI/CD integration",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For organizations with advanced security needs.",
    cta: "Contact Sales",
    popular: false,
    features: [
      "Everything in Pro",
      "Unlimited API requests",
      "SSO / SAML",
      "Dedicated infrastructure",
      "SLA guarantee",
      "24/7 premium support",
      "Unlimited team members",
      "Custom integrations",
      "SOC 2 compliance",
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <MarketingHeader />
      <main className="pt-32 pb-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="section-title mb-4">Simple, transparent pricing</h1>
            <p className="section-subtitle">Start free. Upgrade when you need more power.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 transition-all duration-200 relative ${
                  plan.popular
                    ? "border-crimson shadow-glow bg-[var(--card-bg)] scale-[1.02]"
                    : "border-[var(--border)] bg-[var(--card-bg)] hover:border-crimson/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge bg-crimson text-white text-xs px-3 py-1">Most Popular</span>
                  </div>
                )}

                <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mb-1">{plan.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">{plan.desc}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold font-display text-[var(--text-primary)]">{plan.price}</span>
                  <span className="text-sm text-[var(--text-muted)]">{plan.period}</span>
                </div>

                <Link
                  href="/signup"
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-8 ${
                    plan.popular
                      ? "bg-crimson text-white hover:bg-crimson-hover hover:shadow-glow"
                      : "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)] hover:border-crimson"
                  }`}
                >
                  {plan.cta} <ArrowRight size={16} />
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
