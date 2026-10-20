import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export default function BlogPostPage() {
  return (
    <div className="flex flex-col">
      <article className="catalyst-container-narrow pt-32 pb-24">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors hover:opacity-70" style={{ color: "var(--text-muted)" }}>
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--text)" }}>Introducing StaticFlow</h1>
        <div className="mt-4 flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>October 15, 2024</span><span className="flex items-center gap-1"><Clock className="h-3 w-3" />5 min read</span>
        </div>
        <div className="mt-8 space-y-4 text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
          <p>Today we are announcing StaticFlow — the first platform that takes you from a natural language prompt to a fully deployed, secured, and documented API in under 20 minutes.</p>
          <p>Developers spend weeks building APIs that follow the same patterns. StaticFlow changes this by generating production-ready code from plain English descriptions.</p>
        </div>
      </article>
    </div>
  );
}
