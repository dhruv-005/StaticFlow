import { MessageSquare, Cpu, Shield, Rocket } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Describe Your API",
    description: "Type what you need in plain English. Our AI asks smart follow-up questions to understand every detail.",
    color: "text-cyber-cyan",
    line: "from-cyber-cyan",
  },
  {
    step: "02",
    icon: Cpu,
    title: "AI Generates Everything",
    description: "Endpoints, database schema, authentication, validation, error handling, Docker config — all auto-generated.",
    color: "text-cyber-purple",
    line: "from-cyber-purple",
  },
  {
    step: "03",
    icon: Shield,
    title: "Auto Security & Testing",
    description: "OWASP Top 10 scan, performance benchmarks, and load testing run automatically. AI fixes issues it finds.",
    color: "text-cyber-green",
    line: "from-cyber-green",
  },
  {
    step: "04",
    icon: Rocket,
    title: "One-Click Deploy",
    description: "Deploy to production with SSL, custom domains, monitoring, and auto-scaling. Your API is live in minutes.",
    color: "text-cyber-pink",
    line: "from-cyber-pink",
  },
];

export function HowItWorks() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black text-cyber-white sm:text-4xl">
            Prompt to{" "}
            <span className="neon-text">Production</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cyber-white/40">
            Four steps. Fifteen minutes. Zero manual coding.
          </p>
        </div>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-12 left-[12.5%] right-[12.5%] hidden h-px bg-gradient-to-r from-cyber-cyan/30 via-cyber-purple/30 to-cyber-pink/30 lg:block" />

          {steps.map((step) => (
            <div key={step.step} className="relative flex flex-col items-center text-center">
              {/* Step Number */}
              <div className={`relative z-10 mb-4 flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-cyber-white/5 bg-cyber-navy/50 backdrop-blur-sm`}>
                <step.icon className={`h-8 w-8 ${step.color}`} />
                <span className={`mt-1 text-xs font-bold ${step.color}`}>
                  STEP {step.step}
                </span>
              </div>

              <h3 className="mb-2 text-lg font-bold text-cyber-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-cyber-white/40">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
