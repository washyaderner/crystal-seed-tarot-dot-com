// Smoke test for /videos: renders, nav, CSP, JSON-LD, the adventure flow, hash restore, grid embed.
//
// Run against a local production build:
//   npm run build && PORT=3057 npm run start &
//   node execution/videos-smoke.mjs
// Or against production:
//   BASE=https://crystalseedtarot.com INTRO=0 node execution/videos-smoke.mjs
// INTRO=0 skips the wait for the newest intro's real ENDED event. Screenshots land in OUT
// (default .tmp/videos-smoke). Needs Playwright: this repo does not carry it, so the
// import falls back to the copies other projects on this machine already have.
//
// Expectations come from lib/youtube-videos.json (the newest round, its first path, its
// intro and readings), so a new month never needs a hand edit here; the nightly watchdog
// runs this same file against production after every push.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const DATA = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "lib", "youtube-videos.json"), "utf8"));
const TOPIC_ORDER = ["money", "general", "love"];
const TOPIC_LABEL = { money: "Money & Career", general: "General Reading", love: "Love & Relationships" };
const TOPIC_SHORT = { money: "Money", general: "General", love: "Love" };
const NEWEST = DATA.rounds[0];
const SECOND = DATA.rounds[1];
const inRound = (round) => (v) => (v.kind === "intro" || v.kind === "reading") && v.round === round.key;
const topicsIn = (round) => TOPIC_ORDER.filter((t) => DATA.videos.some((v) => inRound(round)(v) && v.topic === t));
const PATH = topicsIn(NEWEST)[0];                       // the first path the newest month offers
const OTHER = topicsIn(NEWEST).find((t) => t !== PATH); // a second path in the same month, if any
const INTRO = DATA.videos.find((v) => v.kind === "intro" && v.round === NEWEST.key && v.topic === PATH);
const READING2 = DATA.videos.find((v) => v.kind === "reading" && v.round === NEWEST.key && v.topic === PATH && v.choice === 2);
const fmt = (s) => (s < 60 ? `${s} sec` : `${Math.round(s / 60)} min`);
// The map's breathing rule, computed the same way lib/youtube-videos.ts does it (FRESH_DAYS = 21)
const FRESH_DAYS = 21;
const FRESH = TOPIC_ORDER.filter((t) => {
  const newest = DATA.videos.filter((v) => (v.kind === "intro" || v.kind === "reading") && v.topic === t).map((v) => v.published).sort().pop();
  return newest && Date.parse(`${newest}T12:00:00Z`) > Date.now() - FRESH_DAYS * 86400000;
});
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
console.log(`INFO newest round ${NEWEST.key} path ${PATH} intro ${INTRO.id} (${INTRO.duration} s); ${DATA.videos.length} videos; fresh paths: ${FRESH.join(", ") || "none"}`);
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
  ok(list && list.itemListElement.length === DATA.videos.length, `JSON-LD ItemList has ${DATA.videos.length} videos`, String(list && list.itemListElement.length));
  ok(list && list.itemListElement.some((e) => e.item.url.endsWith(INTRO.id)), "JSON-LD carries the newest intro");
  ok(await page.locator("h1", { hasText: "Interactive Tarot Readings" }).count() === 1, "h1 present");
  ok(await page.getByRole("button", { name: new RegExp(esc(TOPIC_LABEL[PATH])) }).count() >= 1, `${TOPIC_LABEL[PATH]} path button (newest month)`);
  ok(await page.getByRole("button", { name: new RegExp(esc(NEWEST.label)) }).count() === 1, `round chip ${NEWEST.label}`);
  ok((await page.getByRole("button", { name: new RegExp(esc(NEWEST.label)) }).innerText()).toLowerCase().includes("newest"), "newest round chip carries the newest badge");
  const noHScroll = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  ok(noHScroll, "no horizontal scroll at 1440");
  // The map: every path lit at the start, the fresh ones breathing
  const tree = await page.evaluate(() =>
    [...document.querySelectorAll("[data-node]")].map((n) => ({
      id: n.dataset.node, state: n.dataset.state, fresh: n.dataset.fresh === "true",
      opacity: getComputedStyle(n).opacity, anim: getComputedStyle(n).animationName,
    })));
  const topicNodes = tree.filter((n) => TOPIC_ORDER.includes(n.id));
  ok(tree.length === 13, "map has 13 nodes", String(tree.length));
  ok(topicNodes.length === 3 && topicNodes.every((n) => n.state === "open"), "all three paths are open at the start (none dimmed)", JSON.stringify(topicNodes.map((n) => [n.id, n.state])));
  ok(topicNodes.every((n) => Number(n.opacity) >= 0.35), "no path sits dim at the start", JSON.stringify(topicNodes.map((n) => [n.id, n.opacity])));
  ok(JSON.stringify(topicNodes.filter((n) => n.fresh).map((n) => n.id)) === JSON.stringify(FRESH), `fresh paths breathe: ${FRESH.join(", ") || "none"}`, JSON.stringify(topicNodes.map((n) => [n.id, n.fresh, n.anim])));
  ok(topicNodes.every((n) => (n.fresh ? n.anim === "path-breathe" : n.anim === "none")), "breathing animation only on fresh paths", JSON.stringify(topicNodes.map((n) => [n.id, n.anim])));
  await page.screenshot({ path: `${OUT}/desktop-1-choose.png`, fullPage: true });

  // Start the newest month's first path
  await page.getByRole("button", { name: new RegExp(esc(TOPIC_LABEL[PATH])) }).first().click();
  await page.waitForTimeout(500);
  ok(await page.evaluate(() => location.hash) === `#${PATH}/${NEWEST.key}`, "hash after topic pick", await page.evaluate(() => location.hash));
  const picked = await page.evaluate((id) => { const n = document.querySelector(`[data-node="${id}"]`); return { state: n?.dataset.state, anim: getComputedStyle(n).animationName }; }, PATH);
  ok(picked.state === "current" && picked.anim === "none", "picked path is current and stops breathing", JSON.stringify(picked));
  const iframe = page.locator(".player-glow iframe");
  await iframe.first().waitFor({ state: "attached", timeout: 15000 }).catch(() => {});
  const src = (await iframe.first().getAttribute("src").catch(() => "")) || "";
  ok(src.includes("youtube-nocookie.com") && src.includes(INTRO.id), `player iframe loads the ${NEWEST.short} ${PATH} intro`, src.slice(0, 120));
  ok(await page.getByRole("button", { name: /^Reading 1, / }).count() === 1, "three reading cards rendered (card 1)");
  ok(await page.getByRole("button", { name: /^Reading 3, / }).count() === 1, "three reading cards rendered (card 3)");
  const promptEarly = await page.locator("p[aria-live]").innerText();
  ok(promptEarly.includes("laying out"), "prompt: intro playing", promptEarly);
  await page.waitForTimeout(2500);
  const mode = promptEarly.includes("tap it below") ? "iframe-fallback" : "api";
  console.log(`INFO player mode: ${mode}`);
  await page.screenshot({ path: `${OUT}/desktop-2-intro.png`, fullPage: false });

  if (WAIT_FOR_INTRO_END && mode === "api") {
    // Wait for the real ENDED event from the IFrame API (the intro's length plus slack).
    const called = await page.locator("p[aria-live]", { hasText: "Which one is calling you" }).waitFor({ timeout: (INTRO.duration + 45) * 1000 }).then(() => true).catch(() => false);
    ok(called, "IFrame API reported the intro ENDED -> cards are calling");
    if (called) {
      ok(await page.locator(".card-calling").count() === 3, "three cards carry the calling animation");
      await page.screenshot({ path: `${OUT}/desktop-3-calling.png`, fullPage: false });
    }
  }

  // Pick reading 2
  await page.getByRole("button", { name: /^Reading 2, / }).click();
  await page.waitForTimeout(800);
  ok(await page.evaluate(() => location.hash) === `#${PATH}/${NEWEST.key}/2`, "hash after reading pick", await page.evaluate(() => location.hash));
  ok(await page.getByRole("button", { name: /^Now playing: Reading 2/ }).count() === 1, "card 2 shows Now playing");
  const header = await page.locator(".player-glow").locator("xpath=preceding-sibling::div[1]").innerText();
  ok(header.includes("Reading 2") && header.includes(fmt(READING2.duration)), `player header says Reading 2 · ${fmt(READING2.duration)}`, header);
  await page.screenshot({ path: `${OUT}/desktop-4-reading.png`, fullPage: false });

  // Switch to another path in the same month, when the month has one
  let topicNow = PATH;
  if (OTHER) {
    await page.getByRole("button", { name: new RegExp(`Switch to ${esc(TOPIC_SHORT[OTHER])}`) }).click();
    await page.waitForTimeout(500);
    ok(await page.evaluate(() => location.hash) === `#${OTHER}/${NEWEST.key}`, `switch topic -> ${OTHER} intro hash`, await page.evaluate(() => location.hash));
    topicNow = OTHER;
  } else {
    ok(await page.getByRole("button", { name: /Switch to / }).count() === 0, "single-path month shows no Switch button");
  }

  // Change round: the path follows when the older month has it, else the stage resets
  await page.getByRole("button", { name: new RegExp(esc(SECOND.label)) }).first().click();
  await page.waitForTimeout(400);
  const expectRound = topicsIn(SECOND).includes(topicNow) ? `#${topicNow}/${SECOND.key}` : "";
  ok(await page.evaluate(() => location.hash) === expectRound, `round switch -> ${expectRound || "reset (path not in that month)"}`, await page.evaluate(() => location.hash));
  if (!expectRound) {
    // start the older month's first path so the rest of the flow has a player to test
    await page.getByRole("button", { name: new RegExp(esc(TOPIC_LABEL[topicsIn(SECOND)[0]])) }).first().click();
    await page.waitForTimeout(400);
  }

  // Start over clears the hash
  await page.getByRole("button", { name: "Start over" }).click();
  await page.waitForTimeout(400);
  ok(await page.evaluate(() => location.hash) === "", "start over clears hash", await page.evaluate(() => location.hash));
  ok(await page.locator(".player-glow").count() === 0, "player unmounted on start over");

  // Archive: jump to Sept love reading 3 directly
  await page.getByRole("button", { name: /^Reading 3 · / }).nth(3).click().catch(() => {});
  await page.waitForTimeout(600);
  const h2 = await page.evaluate(() => location.hash);
  ok(/^#(money|general|love)\/\d{4}-\d{2}\/3$/.test(h2), "archive card jumps straight to a reading", h2);

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
  await page.getByRole("button", { name: new RegExp(esc(TOPIC_LABEL[PATH])) }).first().click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/mobile-2-intro.png`, fullPage: false });
  await page.getByRole("button", { name: /^Reading 1, / }).click();
  await page.waitForTimeout(800);
  ok(await page.evaluate(() => location.hash) === `#${PATH}/${NEWEST.key}/1`, "mobile pick -> hash", await page.evaluate(() => location.hash));
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
