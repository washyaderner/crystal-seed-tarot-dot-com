// Smoke test for /videos: renders, nav, CSP, JSON-LD, the adventure flow, hash restore, grid embed.
//
// Run against a local production build:
//   npm run build && PORT=3057 npm run start &
//   node execution/videos-smoke.mjs
// Or against production:
//   BASE=https://crystalseedtarot.com INTRO=0 node execution/videos-smoke.mjs
// INTRO=0 skips the 42 s wait for the intro's real ENDED event. Screenshots land in OUT
// (default .tmp/videos-smoke). Needs Playwright: this repo does not carry it, so the
// import falls back to the copies other projects on this machine already have.
const chromium = await (async () => {
  const candidates = [
    "playwright",
    "/Users/studio/Build/notes/node_modules/playwright/index.mjs",
    "/Users/studio/Build/tarotdoxa/node_modules/playwright/index.mjs",
  ];
  for (const c of candidates) {
    try { return (await import(c)).chromium; } catch {}
  }
  throw new Error("Playwright not found; install it or add a path to the candidates list");
})();

const BASE = process.env.BASE || "http://127.0.0.1:3057";
const OUT = process.env.OUT || ".tmp/videos-smoke";
import { mkdirSync } from "node:fs";
mkdirSync(OUT, { recursive: true });
const WAIT_FOR_INTRO_END = process.env.INTRO !== "0";
let pass = 0, fail = 0;
const ok = (cond, label, extra = "") => {
  if (cond) { pass++; console.log(`PASS ${label}`); }
  else { fail++; console.log(`FAIL ${label} ${extra}`); }
};

const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const errors = [];
const mk = async (w, h) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text().slice(0, 200)}`); });
  return { ctx, page };
};

// ---------- Desktop ----------
{
  const { ctx, page } = await mk(1440, 900);
  const res = await page.goto(`${BASE}/videos`, { waitUntil: "networkidle" });
  ok(res.status() === 200, "GET /videos 200");
  const csp = res.headers()["content-security-policy"] || "";
  ok(/frame-src[^;]*youtube-nocookie\.com/.test(csp), "CSP frame-src allows youtube-nocookie");
  ok(/script-src [^;]*www\.youtube\.com/.test(csp), "CSP script-src allows www.youtube.com");
  ok((await page.title()).includes("Interactive Tarot Readings"), "title", await page.title());
  ok(await page.locator('header nav a[href="/videos"]').count() === 1, "desktop nav has Videos link");
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  const list = ld.map((t) => { try { return JSON.parse(t); } catch { return null; } }).find((j) => j && j["@type"] === "ItemList");
  ok(list && list.itemListElement.length === 23, "JSON-LD ItemList has 23 videos", String(list && list.itemListElement.length));
  ok(await page.locator("h1", { hasText: "Interactive Tarot Readings" }).count() === 1, "h1 present");
  ok(await page.getByRole("button", { name: /Money & Career/ }).count() >= 1, "Money & Career path button");
  ok(await page.getByRole("button", { name: /Love & Relationships/ }).count() >= 1, "Love & Relationships path button");
  const noHScroll = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  ok(noHScroll, "no horizontal scroll at 1440");
  await page.screenshot({ path: `${OUT}/desktop-1-choose.png`, fullPage: true });

  // Start Money & Career
  await page.getByRole("button", { name: /Money & Career/ }).first().click();
  await page.waitForTimeout(500);
  ok(await page.evaluate(() => location.hash) === "#money/2025-10", "hash after topic pick", await page.evaluate(() => location.hash));
  const iframe = page.locator(".player-glow iframe");
  await iframe.first().waitFor({ state: "attached", timeout: 15000 }).catch(() => {});
  const src = (await iframe.first().getAttribute("src").catch(() => "")) || "";
  ok(src.includes("youtube-nocookie.com") && src.includes("MS6HI6c15T0"), "player iframe loads the Oct money intro", src.slice(0, 120));
  ok(await page.getByRole("button", { name: /^Reading 1, / }).count() === 1, "three reading cards rendered (card 1)");
  ok(await page.getByRole("button", { name: /^Reading 3, / }).count() === 1, "three reading cards rendered (card 3)");
  const promptEarly = await page.locator("p[aria-live]").innerText();
  ok(promptEarly.includes("laying out"), "prompt: intro playing", promptEarly);
  await page.waitForTimeout(2500);
  const mode = promptEarly.includes("tap it below") ? "iframe-fallback" : "api";
  console.log(`INFO player mode: ${mode}`);
  await page.screenshot({ path: `${OUT}/desktop-2-intro.png`, fullPage: false });

  if (WAIT_FOR_INTRO_END && mode === "api") {
    // The Oct money intro is 42 s. Wait for the real ENDED event from the IFrame API.
    const called = await page.locator("p[aria-live]", { hasText: "Which one is calling you" }).waitFor({ timeout: 75000 }).then(() => true).catch(() => false);
    ok(called, "IFrame API reported the intro ENDED -> cards are calling");
    if (called) {
      ok(await page.locator(".card-calling").count() === 3, "three cards carry the calling animation");
      await page.screenshot({ path: `${OUT}/desktop-3-calling.png`, fullPage: false });
    }
  }

  // Pick reading 2
  await page.getByRole("button", { name: /^Reading 2, / }).click();
  await page.waitForTimeout(800);
  ok(await page.evaluate(() => location.hash) === "#money/2025-10/2", "hash after reading pick", await page.evaluate(() => location.hash));
  ok(await page.getByRole("button", { name: /^Now playing: Reading 2/ }).count() === 1, "card 2 shows Now playing");
  const header = await page.locator(".player-glow").locator("xpath=preceding-sibling::div[1]").innerText();
  ok(header.includes("Reading 2") && header.includes("7 min"), "player header says Reading 2 · 7 min", header);
  await page.screenshot({ path: `${OUT}/desktop-4-reading.png`, fullPage: false });

  // Switch to Love via the control
  await page.getByRole("button", { name: /Switch to Love/ }).click();
  await page.waitForTimeout(500);
  ok(await page.evaluate(() => location.hash) === "#love/2025-10", "switch topic -> love intro hash", await page.evaluate(() => location.hash));

  // Change round
  await page.getByRole("button", { name: /September 2025/ }).first().click();
  await page.waitForTimeout(400);
  ok(await page.evaluate(() => location.hash) === "#love/2025-09", "round switch -> sept hash", await page.evaluate(() => location.hash));

  // Start over clears the hash
  await page.getByRole("button", { name: "Start over" }).click();
  await page.waitForTimeout(400);
  ok(await page.evaluate(() => location.hash) === "", "start over clears hash", await page.evaluate(() => location.hash));
  ok(await page.locator(".player-glow").count() === 0, "player unmounted on start over");

  // Archive: jump to Sept love reading 3 directly
  await page.getByRole("button", { name: /^Reading 3 · / }).nth(3).click().catch(() => {});
  await page.waitForTimeout(600);
  const h2 = await page.evaluate(() => location.hash);
  ok(/^#(money|love)\/2025-(09|10)\/3$/.test(h2), "archive card jumps straight to a reading", h2);

  // Channel grid: play a lesson in place
  await page.getByRole("button", { name: /Play Swords in Tarot/ }).click();
  const gridFrame = page.locator('iframe[title*="Swords in Tarot"]');
  await gridFrame.waitFor({ state: "attached", timeout: 10000 }).catch(() => {});
  const gsrc = (await gridFrame.getAttribute("src").catch(() => "")) || "";
  ok(gsrc.includes("Tcc9MKQ56TI"), "grid card became an embed", gsrc.slice(0, 100));
  await page.screenshot({ path: `${OUT}/desktop-5-grid.png`, fullPage: true });
  await ctx.close();
}

// ---------- Deep link restore ----------
{
  const { ctx, page } = await mk(1280, 800);
  await page.goto(`${BASE}/videos#love/2025-09/3`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const header = await page.locator(".player-glow").locator("xpath=preceding-sibling::div[1]").innerText().catch(() => "");
  ok(header.includes("Love & Relationships") && header.includes("September 2025") && header.includes("Reading 3"), "deep link restores love/sept/3", header);
  ok(await page.getByRole("button", { name: /^Now playing: Reading 3/ }).count() === 1, "deep link: card 3 is Now playing");
  ok(await page.evaluate(() => location.hash) === "#love/2025-09/3", "deep link hash kept");
  await ctx.close();
}

// ---------- Nav widths ----------
for (const w of [768, 1024]) {
  const { ctx, page } = await mk(w, 800);
  await page.goto(`${BASE}/videos`, { waitUntil: "domcontentloaded" });
  const m = await page.evaluate(() => {
    const ul = document.querySelector("header nav ul");
    const nav = document.querySelector("header nav");
    if (!ul || !nav) return null;
    const r = ul.getBoundingClientRect(), n = nav.getBoundingClientRect();
    const lis = [...ul.querySelectorAll("li")].map((li) => li.getBoundingClientRect().top);
    return { ulRight: r.right, navRight: n.right, rows: new Set(lis.map((t) => Math.round(t))).size, hscroll: document.documentElement.scrollWidth - window.innerWidth, visible: getComputedStyle(ul).display };
  });
  console.log(`INFO nav@${w}:`, JSON.stringify(m));
  ok(m && m.rows === 1, `nav links on one row at ${w}`);
  ok(m && m.hscroll <= 0, `no horizontal overflow at ${w}`);
  await page.screenshot({ path: `${OUT}/nav-${w}.png` });
  await ctx.close();
}

// ---------- Mobile ----------
{
  const { ctx, page } = await mk(390, 844);
  await page.goto(`${BASE}/videos`, { waitUntil: "networkidle" });
  ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "no horizontal scroll at 390");
  await page.screenshot({ path: `${OUT}/mobile-1-choose.png`, fullPage: true });
  await page.getByRole("button", { name: /Love & Relationships/ }).first().click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/mobile-2-intro.png`, fullPage: false });
  await page.getByRole("button", { name: /^Reading 1, / }).click();
  await page.waitForTimeout(800);
  ok(await page.evaluate(() => location.hash) === "#love/2025-10/1", "mobile pick -> hash");
  await page.screenshot({ path: `${OUT}/mobile-3-reading.png`, fullPage: false });
  // hamburger menu carries Videos
  await page.getByRole("button", { name: "Open menu" }).click();
  ok(await page.locator('a[href="/videos"]:visible').count() >= 1, "mobile menu has Videos");
  await ctx.close();
}

await browser.close();
const relevant = errors.filter((e) => !/youtube|ytimg|googlevideo|doubleclick|play\.google|Failed to load resource/i.test(e));
console.log(`\nerrors (all): ${errors.length}; errors (ours): ${relevant.length}`);
relevant.forEach((e) => console.log("  ", e));
console.log(`\nRESULT pass=${pass} fail=${fail}`);
process.exit(fail ? 1 : 0);
