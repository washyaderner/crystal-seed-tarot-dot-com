const chromium = await (async () => { for (const c of ["playwright", "/Users/studio/Build/notes/node_modules/playwright/index.mjs"]) { try { return (await import(c)).chromium; } catch {} } })();
const b = await chromium.launch(); const page = await (await b.newContext({ viewport: { width: 1200, height: 900 } })).newPage();
await page.goto("https://crystalseedtarot.com/videos?cb=" + Date.now(), { waitUntil: "networkidle" });
const tree = page.locator('[role="img"][aria-label^="Choose your own adventure"]');
const box = await (await tree.elementHandle()).boundingBox();
const labels = await page.locator('[role="img"][aria-label^="Choose your own adventure"] > div.absolute').evaluateAll((els) => els.map((e) => [e.querySelector("span.whitespace-nowrap")?.textContent?.trim(), e.style.left, /opacity-30/.test(e.className) ? "dim" : "live"]));
console.log("live tree nodes:", JSON.stringify(labels));
await page.screenshot({ path: ".tmp/prod-tree.png", fullPage: true, clip: { x: 0, y: Math.max(0, box.y - 60), width: 1200, height: 420 } });
await b.close(); console.log("prod tree shot ok");
