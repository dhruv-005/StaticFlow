import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-md text-center space-y-6">
        <p className="text-8xl font-bold" style={{ color: "var(--border)" }}>404</p>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Page not found</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>The page you are looking for does not exist or has been moved.</p>
        </div>
        <Link href="/" className="catalyst-btn-primary inline-flex text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
