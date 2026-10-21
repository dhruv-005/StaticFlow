import Link from "next/link";

export const metadata = {
  title: "Documentation — StaticFlow",
  description: "Learn how to use StaticFlow.",
};

export default function DocsPage() {
  const sections = [
    { title: "Getting Started", desc: "Install, sign up, generate your first API", href: "/demo" },
    { title: "API Reference",  desc: "All endpoints with examples", href: "/api-reference" },
    { title: "Features",       desc: "Complete feature list", href: "/features" },
    { title: "Pricing",        desc: "Plans and pricing", href: "/pricing" },
    { title: "Blog",           desc: "Tutorials and updates", href: "/blog" },
    { title: "About",          desc: "What StaticFlow is", href: "/about" },
  ];

  return (
    <main className="min-h-screen px-4 py-16 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Documentation</h1>
      <p className="text-lg text-neutral-500 mb-10">
        Everything you need to build APIs with StaticFlow.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-[#DFFF00] transition"
          >
            <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-neutral-500">{s.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
