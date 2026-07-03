import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/contentful";

const BASE = "https://crystalseedtarot.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/services",
    "/events",
    "/gallery",
    "/reviews",
    "/blog",
    "/contact",
  ].map((path) => ({ url: `${BASE}${path}` }));

  let posts: MetadataRoute.Sitemap = [];
  try {
    const response = await getAllBlogPosts();
    posts = (response?.items ?? [])
      .filter((item) => item?.fields?.slug)
      .map((item) => ({ url: `${BASE}/blog/${item.fields.slug}` }));
  } catch {
    // Contentful unavailable at build: ship the static pages only
  }

  return [...staticPages, ...posts];
}
