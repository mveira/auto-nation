import type { MetadataRoute } from "next"
import { getAllServices } from "@/services/services.service"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/book`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.7 },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = getAllServices().map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...serviceRoutes]
}
