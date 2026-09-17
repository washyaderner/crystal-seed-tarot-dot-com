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
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message)); page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text().slice(0, 160)); }); page.on("response", (r) => { if (r.status() >= 400) errors.push(`http ${r.status()} ${r.url().slice(0, 120)}`); }); return { ctx, page }; };
const labels = async (page) => page.locator('[role="img"][aria-label^="Choose your own adventure"] span.whitespace-nowrap').allInnerTexts();
{
  const { ctx, page } = await mk(1440, 900);
  await page.goto(`${BASE}/videos`, { waitUntil: "networkidle" });
  ok((await page.getByRole("button", { name: "TEST October 2026" }).count()) === 1, "round chip: TEST October 2026 (newest)");
  const paths = await page.locator("#start button:has(h3)").allInnerTexts();
  ok(paths.length === 3 && /General Reading/.test(paths.join()), "3-path round shows three path cards incl. General", paths.join(" | "));
  const l1 = await labels(page);
  ok(l1.length === 13 && l1.includes("General") && l1.includes("General 3"), "path tree has 13 nodes for three paths", l1.join(","));
  const aria = await page.locator('[role="img"][aria-label^="Choose your own adventure"]').getAttribute("aria-label");
  ok(/Money, Love or General/.test(aria || ""), "tree aria-label names the three paths", aria || "");
  await page.getByRole("button", { name: /General Reading/ }).first().click(); await page.waitForTimeout(600);
  ok((await page.evaluate(() => location.hash)) === "#general/2026-10", "hash after General pick", await page.evaluate(() => location.hash));
  const src0 = (await page.locator(".player-glow iframe").first().getAttribute("src").catch(() => "")) || "";
  ok(src0.includes("71ZoRwWras0"), "player loads the general intro", src0.slice(0, 100));
  ok((await page.getByRole("button", { name: /^Reading 2, / }).count()) === 1, "three reading cards under the player");
  await page.getByRole("button", { name: /^Reading 2, / }).click(); await page.waitForTimeout(800);
  ok((await page.evaluate(() => location.hash)) === "#general/2026-10/2", "hash after reading 2", await page.evaluate(() => location.hash));
  const head = await page.locator(".player-glow").locator("xpath=preceding-sibling::div[1]").innerText();
  ok(/General Reading/.test(head) && /Reading 2/.test(head), "player header shows General Reading · Reading 2 (API mode swaps without a new iframe src)", head);
  const switches = await page.locator("button", { hasText: /^Switch to / }).allInnerTexts();
  ok(switches.length === 2 && /Money/.test(switches.join()) && /Love/.test(switches.join()), "two Switch-to buttons for the other paths", switches.join(" | "));
  await page.getByRole("button", { name: "TEST September 2026" }).click(); await page.waitForTimeout(600);
  ok((await page.evaluate(() => location.hash)) === "#general/2026-09", "round switch keeps General (it exists in Sept)", await page.evaluate(() => location.hash));
  ok((await page.locator("button", { hasText: /^Switch to / }).count()) === 0, "one-path round: no Switch-to buttons");
  await page.getByRole("button", { name: "Start over" }).click(); await page.waitForTimeout(500);
  const paths2 = await page.locator("#start button:has(h3)").allInnerTexts();
  ok(paths2.length === 1 && /General Reading/.test(paths2[0]), "one-path round shows one centered path card", paths2.join(" | "));
  const l2 = await labels(page); ok(l2.length === 5, "path tree has 5 nodes for one path", l2.join(","));
  await page.getByRole("button", { name: /General Reading/ }).first().click(); await page.waitForTimeout(500);
  await page.getByRole("button", { name: "October 2025" }).click(); await page.waitForTimeout(600);
  ok((await page.locator("#start button:has(h3)").count()) === 2, "switching to a round without General resets to its two paths");
  ok(!(await page.evaluate(() => location.hash)), "hash cleared when the topic resets", await page.evaluate(() => location.hash));
  const archiveCols = await page.locator("h4:has-text('TEST October 2026')").locator("xpath=../..").locator("div.grid > div").count();
  ok(archiveCols === 3, "archive block for the 3-path round has 3 topic columns", String(archiveCols));
  await page.screenshot({ path: ".tmp/general-check-desktop.png", fullPage: true });
  await ctx.close();
}
{
  const { ctx, page } = await mk(1440, 900);
  await page.goto(`${BASE}/videos#general/2026-09/3`, { waitUntil: "networkidle" }); await page.waitForTimeout(800);
  const src = (await page.locator(".player-glow iframe").first().getAttribute("src").catch(() => "")) || "";
  ok(src.includes("vwJm9y-dPk8"), "deep link #general/2026-09/3 restores reading 3", src.slice(0, 100));
  const cur = await page.locator('[role="img"][aria-label^="Choose your own adventure"]').getAttribute("aria-label");
  ok(/You picked General, reading 3/.test(cur || ""), "tree reports General, reading 3", cur || "");
  await ctx.close();
}
{
  const { ctx, page } = await mk(1440, 900);
  await page.goto(`${BASE}/videos#general/2025-10/1`, { waitUntil: "networkidle" }); await page.waitForTimeout(500);
  ok((await page.locator("#start button:has(h3)").count()) === 3 && (await page.locator(".player-glow").count()) === 0, "a hash naming a path the round lacks is ignored (choose stage of the newest round, no player)");
  await ctx.close();
}
{
  const { ctx, page } = await mk(390, 844);
  await page.goto(`${BASE}/videos`, { waitUntil: "networkidle" });
  ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "no horizontal scroll at 390 with three paths");
  const hidden = await page.locator('[role="img"][aria-label^="Choose your own adventure"] span.whitespace-nowrap.hidden').count();
  ok(hidden === 9, "reading labels hidden on phones for a three-path round", String(hidden));
  await page.getByRole("button", { name: /General Reading/ }).first().click(); await page.waitForTimeout(600);
  ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "no horizontal scroll at 390 after the pick");
  await page.screenshot({ path: ".tmp/general-check-phone.png", fullPage: true });
  await ctx.close();
}
ok(errors.length === 0, "no console or page errors", errors.join(" || "));
await browser.close();
console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
