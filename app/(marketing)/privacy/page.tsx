export const metadata = {
  title: "Privacy Policy — StaticFlow",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-4 py-16 sm:px-6 lg:px-8 max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p className="text-neutral-500">Last updated: {new Date().toLocaleDateString()}</p>

      <h2>What we collect</h2>
      <ul>
        <li>Email address (for your account)</li>
        <li>Prompts and generated code (to improve the service)</li>
        <li>Usage data (which features you use)</li>
        <li>IP address and user agent (for security audit logs)</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>Deliver and improve StaticFlow</li>
        <li>Protect against abuse</li>
        <li>Send essential service notifications</li>
      </ul>

      <h2>Sharing</h2>
      <p>We do not sell your data. We share only with infrastructure providers (Vercel, Neon, Groq) under their respective privacy policies.</p>

      <h2>Your rights</h2>
      <p>Email <a href="mailto:hello@staticflow.dev">hello@staticflow.dev</a> to request data export or deletion.</p>

      <h2>Cookies</h2>
      <p>We use a single HTTP-only cookie for authentication. No tracking cookies.</p>
    </main>
  );
}
