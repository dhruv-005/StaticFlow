import Link from "next/link";
import { Check, Zap, Crown, Building2 } from "lucide-react";

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: "$0",
    period: "forever",
    description: "Perfect for side projects and learning.",
    color: "text-cyber-white",
    borderColor: "border-cyber-white/10",
    buttonClass:
      "border border-cyber-white/20 text-cyber-white hover:bg-cyber-white/10",
    features: [
      "3 API projects",
      "Local AI generation",
      "Quick security scan",
      "Basic performance test",
      "Auto documentation",
      "Deploy to Vercel",
      "Community support",
    ],
  },
  {
    name: "Pro",
    icon: Crown,
    price: "$29",
    period: "/month",
    description: "For professional developers and small teams.",
    color: "text-cyber-cyan",
    borderColor: "border-cyber-cyan/30",
    buttonClass: "neon-button",
    popular: true,
    features: [
      "Unlimited API projects",
      "Cloud AI (Groq + Gemini)",
      "Deep + Full security scans",
      "Advanced performance testing",
      "Team collaboration (5)",
      "Custom domains",
      "CI/CD integration",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "$99",
    period: "/month",
    description: "For organizations with advanced needs.",
    color: "text-cyber-purple",
    borderColor: "border-cyber-purple/20",
    buttonClass:
      "border border-cyber-purple/30 text-cyber-purple hover:bg-cyber-purple/10",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "OWASP full audit",
      "Compliance (GDPR, HIPAA)",
      "Voice-to-API",
      "Multi-cloud deploy",
      "Dedicated support",
      "99.9% SLA guarantee",
    ],
  },
];

export function PricingCards() {
  return (
    <section className="relative px-6 py-24" id="pricing">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black text-cyber-white sm:text-4xl">
            Start Free,{" "}
            <span className="gradient-text">Scale Fearlessly</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cyber-white/40">
            No credit card required. No hidden fees. Upgrade only when you need
            more power.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card relative flex flex-col p-8 transition-all duration-300 hover:scale-[1.02] ${plan.borderColor} ${
                plan.popular ? "lg:scale-105 lg:shadow-2xl lg:shadow-cyber-cyan/10" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyber-cyan px-4 py-1 text-xs font-bold text-cyber-space">
                  MOST POPULAR
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <plan.icon className={`h-5 w-5 ${plan.color}`} />
                  <h3 className={`text-lg font-bold ${plan.color}`}>
                    {plan.name}
                  </h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-cyber-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-cyber-white/40">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-2 text-sm text-cyber-white/40">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${plan.color}`}
                    />
                    <span className="text-sm text-cyber-white/60">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/register"
                className={`flex items-center justify-center rounded-lg px-6 py-3 text-sm font-bold transition-all ${plan.buttonClass}`}
              >
                {plan.name === "Free"
                  ? "Get Started Free"
                  : plan.name === "Pro"
                    ? "Start Pro Trial"
                    : "Contact Sales"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
