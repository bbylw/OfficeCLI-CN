// 生成社交分享卡（og:image）：1200×630 首屏暗色截图 → public/assets/og-image.png
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const require = createRequire("C:/Users/bbylw/.pwl/");
const { chromium } = require("playwright-core");

const exe = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const base = "http://localhost:4321";
const out = fileURLToPath(new URL("../public/assets/og-image.png", import.meta.url));

const browser = await chromium.launch({ executablePath: exe });
const ctx = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
  reducedMotion: "no-preference",
});
await ctx.addInitScript(() => localStorage.setItem("officecli-theme", "dark"));
const page = await ctx.newPage();
page.on("pageerror", (err) => console.error("PAGEERROR", err.message));
await page.goto(base, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: out, type: "png" });
await ctx.close();
await browser.close();
console.log("og-image saved:", out);
