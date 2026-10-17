import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://staticflow.dev";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/home`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/features`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/demo`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];
}
