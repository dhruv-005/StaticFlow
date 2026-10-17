import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/shared/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StaticFlow — Enterprise API Platform",
    template: "%s | StaticFlow",
  },
  description:
    "Describe your API requirements in plain language. StaticFlow handles generation, security auditing, testing, and deployment.",
  metadataBase: new URL("https://staticflow.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://staticflow.dev",
    siteName: "StaticFlow",
    title: "StaticFlow — Enterprise API Platform",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8F6" },
    { media: "(prefers-color-scheme: dark)", color: "#171815" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('staticflow-theme');var d=window.matchMedia('(prefers-color-scheme:dark)').matches;var theme=t||(d?'dark':'light');document.documentElement.setAttribute('data-theme',theme)}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
