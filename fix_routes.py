import os, shutil, subprocess

print("🧹 [1/4] Removing conflicting [id] directories...")
conflicting_dirs = [
    "app/(dashboard)/builder/[id]",
    "app/(dashboard)/docs/[id]",
    "app/(dashboard)/security/[id]",
    "app/(dashboard)/performance/[id]",
    "app/(dashboard)/deploy/[id]",
    "app/(dashboard)/monitoring/[id]",
    "app/(dashboard)/marketplace/[id]",
]
for d in conflicting_dirs:
    if os.path.exists(d):
        shutil.rmtree(d)
        print(f"  ✔ Removed duplicate: {d}")

print("📄 [2/4] Ensuring correct dynamic pages exist...")
routes = {
    "app/(dashboard)/builder/[projectId]/page.tsx": """"use client";
import BuilderPage from "../page";
export default function Page() { return <BuilderPage />; }
""",
    "app/(dashboard)/docs/[projectId]/page.tsx": """"use client";
import DocsPage from "../page";
export default function Page() { return <DocsPage />; }
""",
    "app/(dashboard)/security/[scanId]/page.tsx": """"use client";
import SecurityPage from "../page";
export default function Page() { return <SecurityPage />; }
""",
    "app/(dashboard)/performance/[testId]/page.tsx": """"use client";
import PerformancePage from "../page";
export default function Page() { return <PerformancePage />; }
""",
    "app/(dashboard)/deploy/[projectId]/page.tsx": """"use client";
import DeployPage from "../page";
export default function Page() { return <DeployPage />; }
""",
    "app/(dashboard)/monitoring/[projectId]/page.tsx": """"use client";
import MonitoringPage from "../page";
export default function Page() { return <MonitoringPage />; }
""",
    "app/(dashboard)/marketplace/[templateId]/page.tsx": """"use client";
import MarketplacePage from "../page";
export default function Page() { return <MarketplacePage />; }
""",
    "app/(marketing)/blog/[slug]/page.tsx": """"use client";
export default function BlogPostPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20 text-white">
      <h1 className="text-3xl font-bold">StaticFlow Engineering Blog</h1>
      <p className="text-xs text-white/50 mt-2">Latest architectural insights and tutorials.</p>
    </div>
  );
}
"""
}

for path, content in routes.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)

print("🧪 [3/4] Running Prisma generate & local Next.js build verification...")
subprocess.run(["npx", "prisma", "generate"], check=True)
res = subprocess.run(["npm", "run", "build"], capture_output=True, text=True)

if res.returncode == 0:
    print("\n🎉 SUCCESS: LOCAL BUILD PASSED WITH 0 ERRORS!\n")
else:
    print("\n❌ Build error output:\n", res.stdout, res.stderr)
    exit(1)
