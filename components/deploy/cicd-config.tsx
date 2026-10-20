"use client";

import { useState } from "react";
import { GitBranch, Copy, Check } from "lucide-react";

export function CicdConfig() {
  const [copied, setCopied] = useState(false);

  const workflowYaml = `# .github/workflows/staticflow-deploy.yml
name: StaticFlow CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run OWASP Security Audit
        run: npx @staticflow/cli scan --strict

      - name: Run Automated Endpoint Tests
        run: npm test

      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        env:
          STATICFLOW_API_TOKEN: \${{ secrets.STATICFLOW_API_TOKEN }}
        run: npx @staticflow/cli deploy --prod
`;

  const copyYaml = () => {
    navigator.clipboard.writeText(workflowYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <GitBranch className="h-5 w-5 text-cyber-cyan" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">GitHub Actions Pipeline Template</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Automated CI/CD security scanning, regression testing, and production deployment</p>
          </div>
        </div>

        <button
          onClick={copyYaml}
          className="neon-button flex items-center gap-1.5 !px-3 !py-1.5 text-xs"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-cyber-green" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copied Workflow" : "Copy YAML"}</span>
        </button>
      </div>

      <pre className="rounded-xl border border-cyber-white/10 bg-black/90 p-4 font-mono text-xs text-cyber-white/80 overflow-x-auto no-scrollbar">
        <code>{workflowYaml}</code>
      </pre>
    </div>
  );
}
