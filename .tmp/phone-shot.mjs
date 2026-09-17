const chromium = await (async () => { for (const c of ["playwright", "/Users/studio/Build/notes/node_modules/playwright/index.mjs"]) { try { return (await import(c)).chromium; } catch {} } })();
const b = await chromium.launch(); const page = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await page.goto("http://127.0.0.1:3057/videos", { waitUntil: "networkidle" });
const box = await (await page.locator('[role="img"][aria-label^="Choose your own adventure"]').elementHandle()).boundingBox();
await page.screenshot({ path: ".tmp/tree-phone-tree.png", fullPage: true, clip: { x: 0, y: Math.max(0, box.y - 80), width: 390, height: 420 } });
await b.close(); console.log("phone tree shot ok");
