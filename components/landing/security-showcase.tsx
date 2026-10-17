import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Bug } from "lucide-react";

const scanResults = [
  { name: "SQL Injection", status: "pass", tests: 500 },
  { name: "Cross-Site Scripting (XSS)", status: "pass", tests: 300 },
  { name: "Authentication Bypass", status: "pass", tests: 150 },
  { name: "JWT Token Manipulation", status: "pass", tests: 80 },
  { name: "CSRF Protection", status: "pass", tests: 60 },
  { name: "Rate Limiting", status: "warn", tests: 40 },
  { name: "CORS Configuration", status: "pass", tests: 25 },
  { name: "Header Security", status: "pass", tests: 30 },
];

export function SecurityShowcase() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black text-cyber-white sm:text-4xl">
            Enterprise-Grade{" "}
            <span className="neon-text">Security</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cyber-white/40">
            Every generated API is automatically scanned against OWASP Top 10
            vulnerabilities before deployment.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Score Card */}
          <div className="glass-card flex flex-col items-center justify-center p-10">
            <div className="relative mb-6">
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-cyber-green/30 bg-cyber-green/5">
                <div className="text-center">
                  <p className="text-5xl font-black text-cyber-green">A+</p>
                  <p className="text-sm text-cyber-green/60">95/100</p>
                </div>
              </div>
              <ShieldCheck className="absolute -top-2 -right-2 h-8 w-8 text-cyber-green" />
            </div>
            <h3 className="text-xl font-bold text-cyber-white">Security Score</h3>
            <p className="mt-2 text-sm text-cyber-white/40">
              Based on 1,185 automated security tests
            </p>
            <div className="mt-6 flex gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-cyber-green">0</p>
                <p className="text-xs text-cyber-white/30">Critical</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyber-green">0</p>
                <p className="text-xs text-cyber-white/30">High</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyber-yellow">1</p>
                <p className="text-xs text-cyber-white/30">Medium</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyber-white/40">3</p>
                <p className="text-xs text-cyber-white/30">Low</p>
              </div>
            </div>
          </div>

          {/* Scan Results */}
          <div className="glass-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Bug className="h-4 w-4 text-cyber-cyan" />
              <h3 className="font-bold text-cyber-white">OWASP Scan Results</h3>
            </div>
            <div className="space-y-2">
              {scanResults.map((result) => (
                <div
                  key={result.name}
                  className="flex items-center justify-between rounded-lg border border-cyber-white/5 bg-cyber-white/[0.02] px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    {result.status === "pass" ? (
                      <CheckCircle2 className="h-4 w-4 text-cyber-green" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-cyber-yellow" />
                    )}
                    <span className="text-sm text-cyber-white/70">
                      {result.name}
                    </span>
                  </div>
                  <span className="text-xs text-cyber-white/30 font-mono">
                    {result.tests} tests
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
