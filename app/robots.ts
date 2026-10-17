import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/settings/", "/_next/"],
    },
    sitemap: "https://staticflow.dev/sitemap.xml",
  };
}
