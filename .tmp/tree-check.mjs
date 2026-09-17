const chromium = await (async () => {
  for (const c of ["playwright", "/Users/studio/Build/notes/node_modules/playwright/index.mjs", "/Users/studio/Build/tarotdoxa/node_modules/playwright/index.mjs"]) {
    try { return (await import(c)).chromium; } catch {}
  }
  throw new Error("no playwright");
})();
const BASE = process.env.BASE || "http://127.0.0.1:3057";
let pass = 0, fail = 0;
const ok = (c, l, x = "") => { if (c) { pass++; console.log("PASS " + l); } else { fail++; console.log("FAIL " + l + " " + x); } };
const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const errors = [];
const mk = async (w, h) => { const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message)); page.on("console", (m) => { if (m.type() === "error" && !/timedtext|429/.test(m.text())) errors.push("console: " + m.text().slice(0, 160)); }); return { ctx, page }; };
const TREE = '[role="img"][aria-label^="Choose your own adventure"]';
const nodes = async (page) => page.locator(`${TREE} > div.absolute`).evaluateAll((els) => els.map((e) => ({
  label: e.querySelector("span.whitespace-nowrap")?.textContent?.trim(), left: e.style.left, cls: e.className })));
{
  const { ctx, page } = await mk(1440, 900);
  await page.goto(`${BASE}/videos`, { waitUntil: "networkidle" });
  // newest test round = all three paths
  let n = await nodes(page);
  ok(n.length === 13, "tree always has 13 nodes (three paths)", String(n.length));
  const gen = n.find((x) => x.label === "General"); const mon = n.find((x) => x.label === "Money"); const lov = n.find((x) => x.label === "Love");
  ok(gen && gen.left === "50%", "General branch sits in the center (left 50%)", gen && gen.left);
  ok(mon && parseFloat(mon.left) < 50 && lov && parseFloat(lov.left) > 50, "Money left of center, Love right of center", `${mon && mon.left} / ${lov && lov.left}`);
  ok(n.filter((x) => /opacity-30/.test(x.cls)).length === 0, "three-path month: no dim branches");
  const cards = await page.locator("#start button:has(h3)").allInnerTexts();
  ok(cards.length === 3 && /General Reading/.test(cards[1]), "choose grid order: Money, General, Love (General in the middle)", cards.map((c) => c.split("\n")[0]).join(" | "));
  const aria = await page.locator(TREE).getAttribute("aria-label");
  ok(/then Money, General or Love/.test(aria || "") && /offers Money, General and Love/.test(aria || ""), "aria-label names the fixed map and this month's paths", aria || "");
  await page.screenshot({ path: ".tmp/tree-3path.png", clip: { x: 0, y: 0, width: 1440, height: 900 } });
  // one-path month (general only): still 13 nodes, Money + Love dim
  await page.getByRole("button", { name: "TEST September 2026" }).click(); await page.waitForTimeout(500);
  n = await nodes(page);
  ok(n.length === 13, "one-path month: tree still 13 nodes", String(n.length));
  const dim = n.filter((x) => /opacity-30/.test(x.cls)).map((x) => x.label);
  ok(dim.length === 8 && dim.includes("Money") && dim.includes("Love") && !dim.includes("General"), "one-path month: Money + Love branches dim (8 nodes), General live", dim.join(","));
  ok((await page.locator("#start button:has(h3)").count()) === 1, "one-path month: one path card");
  const aria2 = await page.locator(TREE).getAttribute("aria-label");
  ok(/offers General\./.test(aria2 || ""), "aria-label: this month offers General", aria2 || "");
  await page.getByRole("button", { name: /General Reading/ }).first().click(); await page.waitForTimeout(600);
  ok((await page.evaluate(() => location.hash)) === "#general/2026-09", "hash after General pick");
  const chipCls = await page.locator(`${TREE} > div.absolute`).filter({ hasText: /^General$/ }).locator("span.brand-chip").first().getAttribute("class");
  ok(/outline/.test(chipCls || ""), "General chip is the current node after the pick", chipCls || "");
  const stageEl = await page.locator("#start").elementHandle(); const box = await stageEl.boundingBox();
  await page.screenshot({ path: ".tmp/tree-1path.png", clip: { x: 0, y: Math.max(0, box.y - 20), width: 1440, height: 700 } });
  // an old month: General dim, Money + Love live
  await page.getByRole("button", { name: "October 2025" }).click(); await page.waitForTimeout(500);
  n = await nodes(page); const dim2 = n.filter((x) => /opacity-30/.test(x.cls)).map((x) => x.label);
  ok(dim2.length === 4 && dim2[0] === "General", "old month: General branch dim, Money + Love live", dim2.join(","));
  ok((await page.locator("#start button:has(h3)").count()) === 2, "old month: two path cards");
  await ctx.close();
}
{
  const { ctx, page } = await mk(390, 844);
  await page.goto(`${BASE}/videos`, { waitUntil: "networkidle" });
  ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "no horizontal scroll at 390");
  const hidden = await page.locator(`${TREE} span.whitespace-nowrap.hidden`).count();
  ok(hidden === 9, "phone: nine reading labels hidden, chips carry the numbers", String(hidden));
  await page.screenshot({ path: ".tmp/tree-phone.png", clip: { x: 0, y: 0, width: 390, height: 1200 } });
  await ctx.close();
}
ok(errors.length === 0, "no console or page errors (YouTube's own 429s excluded)", errors.join(" || "));
await browser.close();
console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
