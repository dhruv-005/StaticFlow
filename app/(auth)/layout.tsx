import { CatalystLogo } from "@/components/shared/catalyst-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      {/* Left Panel — Branding (desktop only) */}
      <div
        className="hidden w-1/2 flex-col justify-between p-12 lg:flex"
        style={{ backgroundColor: "var(--surface)", borderRight: "1px solid var(--border)" }}
      >
        <CatalystLogo href="/" />

        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight" style={{ color: "var(--text)" }}>
            Enterprise APIs,{" "}
            <span style={{ color: "var(--text-muted)" }}>delivered intelligently.</span>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Describe your API requirements in plain language. StaticFlow handles generation,
            security auditing, performance testing, and multi-cloud deployment.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-4">
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>10K+</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>APIs Built</p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>99.9%</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Uptime</p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>A+</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Security</p>
            </div>
          </div>
        </div>

        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          &copy; {new Date().getFullYear()} StaticFlow. All rights reserved.
        </p>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="mb-8 lg:hidden">
          <CatalystLogo href="/" />
        </div>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
