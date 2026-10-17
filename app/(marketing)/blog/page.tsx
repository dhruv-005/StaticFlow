import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const posts = [
  { slug: "introducing-staticflow", title: "Introducing StaticFlow: The AI-Powered API Builder", excerpt: "From a text prompt to a fully deployed, secured API in under 20 minutes.", date: "Oct 15, 2024", read: "5 min" },
  { slug: "owasp-api-security", title: "How StaticFlow Handles OWASP Top 10 Vulnerabilities", excerpt: "A deep dive into automated security scanning and AI-powered fixes.", date: "Oct 10, 2024", read: "8 min" },
  { slug: "prompt-engineering", title: "Prompt Engineering for API Generation", excerpt: "Write the perfect prompts to get production-quality APIs.", date: "Oct 5, 2024", read: "6 min" },
];

export default function BlogPage() {
  return (
    <div className="flex flex-col">
      <section className="catalyst-section pt-32">
        <div className="catalyst-container-narrow text-center">
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Blog</h1>
          <p className="mt-4 text-base" style={{ color: "var(--text-muted)" }}>Engineering insights, tutorials, and product updates.</p>
        </div>
      </section>
      <section className="pb-24">
        <div className="catalyst-container-narrow space-y-6">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="catalyst-card catalyst-card-hover block p-6">
              <div className="flex items-center gap-3 mb-2 text-xs" style={{ color: "var(--text-muted)" }}>
                <span>{p.date}</span><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.read}</span>
              </div>
              <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{p.title}</h2>
              <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>{p.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--text)" }}>Read more <ArrowRight className="h-3 w-3" /></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
