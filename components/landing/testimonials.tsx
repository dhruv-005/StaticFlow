import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO at LaunchPad",
    avatar: "SC",
    content:
      "StaticFlow cut our API development time from 3 weeks to 2 days. The security scanning alone saved us from two critical vulnerabilities before we went live.",
    rating: 5,
    color: "text-cyber-cyan",
  },
  {
    name: "Marcus Johnson",
    role: "Indie Developer",
    avatar: "MJ",
    content:
      "I built and deployed a complete SaaS backend in one weekend. Authentication, payments, webhooks — everything generated from a single conversation with the AI.",
    rating: 5,
    color: "text-cyber-purple",
  },
  {
    name: "Priya Patel",
    role: "Lead Engineer at MedTech",
    avatar: "PP",
    content:
      "The HIPAA compliance checker is a game-changer. We used to spend months on compliance audits. StaticFlow handles it automatically during generation.",
    rating: 5,
    color: "text-cyber-green",
  },
  {
    name: "Alex Rivera",
    role: "Freelance Developer",
    avatar: "AR",
    content:
      "I deliver APIs to clients 5x faster now. The auto-documentation and Postman export means I don't waste hours writing docs anymore.",
    rating: 5,
    color: "text-cyber-pink",
  },
  {
    name: "James Kim",
    role: "Student at MIT",
    avatar: "JK",
    content:
      "As a student learning backend development, StaticFlow taught me best practices by showing me production-quality code. It's like having a senior dev mentor.",
    rating: 5,
    color: "text-cyber-yellow",
  },
  {
    name: "Elena Volkov",
    role: "DevOps at ScaleUp",
    avatar: "EV",
    content:
      "The one-click deployment to multiple clouds with auto-scaling and SSL is incredible. We replaced our entire DevOps pipeline for new microservices.",
    rating: 5,
    color: "text-cyber-blue",
  },
];

export function Testimonials() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black text-cyber-white sm:text-4xl">
            Loved by{" "}
            <span className="neon-text">Developers</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cyber-white/40">
            Join thousands of developers who ship APIs faster with StaticFlow.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="glass-card relative p-6 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 h-6 w-6 text-cyber-white/5" />

              {/* Stars */}
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-cyber-yellow text-cyber-yellow"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="mb-6 text-sm leading-relaxed text-cyber-white/60">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-current/20 bg-current/5 text-sm font-bold ${t.color}`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-cyber-white">{t.name}</p>
                  <p className="text-xs text-cyber-white/40">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
