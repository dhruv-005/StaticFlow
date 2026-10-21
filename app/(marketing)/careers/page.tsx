export const metadata = {
  title: "Careers — StaticFlow",
  description: "Join the StaticFlow team.",
};

export default function CareersPage() {
  return (
    <main className="min-h-screen px-4 py-16 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Careers</h1>
      <p className="text-lg text-neutral-500 mb-8">
        We&apos;re a small team building the future of API development.
      </p>

      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-8 text-center">
        <h2 className="text-2xl font-semibold mb-3">No open roles right now</h2>
        <p className="text-neutral-500 mb-6">
          We&apos;ll post openings here when we start hiring. In the meantime, feel free to reach out.
        </p>
        <a
          href="mailto:hello@staticflow.dev"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#DFFF00] text-black font-medium hover:opacity-90 transition"
        >
          Say hello →
        </a>
      </div>
    </main>
  );
}
