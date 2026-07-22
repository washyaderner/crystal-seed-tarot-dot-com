import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/contentful";

const BASE = "https://crystalseedtarot.com";

// Routes are derived from the app directory, never hand-listed.
//
// WHY: this file used to carry a hardcoded array of 8 paths. When the Magic of
// Tarot class funnel shipped (14209ea), /events/magic-of-tarot was never added
// to it, so the page with the signup form on it stayed out of the sitemap and
// out of Google. Nothing failed, nothing warned. A hand-kept list of routes
// drifts from the routes that actually exist the moment anyone adds a page.
//
// Safe to touch the filesystem here: /sitemap.xml is statically prerendered at
// build time (confirmed in .next/prerender-manifest.json), so this runs during
// `next build` in Node, not per-request in a serverless function.
const APP_DIR = path.join(process.cwd(), "app");

/** A page opts out by exporting `robots: { index: false }`, same as the UI does. */
function isNoIndex(pageFile: string): boolean {
  try {
    return /robots\s*:\s*{[^}]*index\s*:\s*false/.test(fs.readFileSync(pageFile, "utf8"));
  } catch {
    return false;
  }
}

/**
 * Walk app/ and collect every static, indexable route.
 * Every skip fails safe (toward leaving a route OUT of the sitemap):
 *   [slug]  dynamic segments have no single URL; blog posts come from Contentful below
 *   (group) route groups are organizational, not URL segments
 *   _priv   Next treats underscore-prefixed folders as private
 *   api     route handlers, never pages
 */
function collectRoutes(dir: string, prefix = ""): string[] {
  const routes: string[] = [];
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return routes;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const { name } = entry;
    if (name.startsWith("[") || name.startsWith("(") || name.startsWith("_") || name === "api") {
      continue;
    }

    const childDir = path.join(dir, name);
    const route = `${prefix}/${name}`;
    const pageFile = path.join(childDir, "page.tsx");

    if (fs.existsSync(pageFile) && !isNoIndex(pageFile)) {
      routes.push(route);
    }
    routes.push(...collectRoutes(childDir, route));
  }

  return routes;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rootPage = path.join(APP_DIR, "page.tsx");
  const staticRoutes = [
    ...(fs.existsSync(rootPage) && !isNoIndex(rootPage) ? [""] : []),
    ...collectRoutes(APP_DIR),
  ].sort();

  const staticPages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE}${route}`,
  }));

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
