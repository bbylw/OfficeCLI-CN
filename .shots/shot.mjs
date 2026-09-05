// 截图验收：暗/亮 × 桌面/移动 全页矩阵 + 首屏
import { createRequire } from "node:module";
const require = createRequire("C:/Users/bbylw/.pwl/");
const { chromium } = require("playwright-core");

const exe = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const base = "http://localhost:4321";
const outDir = new URL("./", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const matrix = [
  { name: "dark-desktop", theme: "dark", w: 1440, h: 900 },
  { name: "light-desktop", theme: "light", w: 1440, h: 900 },
  { name: "dark-mobile", theme: "dark", w: 390, h: 844 },
  { name: "light-mobile", theme: "light", w: 390, h: 844 },
];

const browser = await chromium.launch({ executablePath: exe });
const errors = [];

for (const m of matrix) {
  const ctx = await browser.newContext({
    viewport: { width: m.w, height: m.h },
    reducedMotion: "no-preference",
    deviceScaleFactor: 1.5,
  });
  await ctx.addInitScript((t) => localStorage.setItem("officecli-theme", t), m.theme);
  const page = await ctx.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[${m.name}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[${m.name}] ${err.message}`));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // 触发懒加载 GIF
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 1200));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${outDir}${m.name}-full.png`, fullPage: true });
  await page.screenshot({ path: `${outDir}${m.name}-hero.png` });
  await ctx.close();
}

{
  // 404 页快照（暗色桌面）
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + "/404", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outDir}404.png` });
  await ctx.close();
}

console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "0 console errors");
await browser.close();
