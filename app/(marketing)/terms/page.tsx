export const metadata = {
  title: "Terms of Service — StaticFlow",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen px-4 py-16 sm:px-6 lg:px-8 max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
      <h1>Terms of Service</h1>
      <p className="text-neutral-500">Last updated: {new Date().toLocaleDateString()}</p>

      <h2>1. Acceptance</h2>
      <p>By using StaticFlow, you agree to these terms.</p>

      <h2>2. Account</h2>
      <p>You are responsible for keeping your credentials and API keys secure.</p>

      <h2>3. Acceptable Use</h2>
      <p>Do not use StaticFlow for illegal activity, abusive scraping, or to generate harmful code.</p>

      <h2>4. Service Availability</h2>
      <p>We aim for 99.9% uptime but do not guarantee uninterrupted service.</p>

      <h2>5. Limitation of Liability</h2>
      <p>StaticFlow is provided &quot;as is&quot; without warranty of any kind.</p>

      <h2>6. Changes</h2>
      <p>We may update these terms. Continued use means you accept the changes.</p>

      <h2>7. Contact</h2>
      <p>Questions? Email <a href="mailto:hello@staticflow.dev">hello@staticflow.dev</a>.</p>
    </main>
  );
}
