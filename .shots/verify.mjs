// 交互回归：主题切换、持久化、横向溢出、画廊滚动、锚点导航
import { createRequire } from "node:module";
const require = createRequire("C:/Users/bbylw/.pwl/");
const { chromium } = require("playwright-core");

const exe = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const base = "http://localhost:4321";
const browser = await chromium.launch({ executablePath: exe });
let pass = 0, fail = 0;
const check = (name, ok) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  ok ? pass++ : fail++;
};

// 1. 主题切换 + localStorage 持久化
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  check("默认暗色", (await page.getAttribute("html", "data-theme")) === "dark");
  await page.click("#theme-toggle");
  check("切换到亮色", (await page.getAttribute("html", "data-theme")) === "light");
  await page.reload({ waitUntil: "networkidle" });
  check("刷新后保持亮色", (await page.getAttribute("html", "data-theme")) === "light");
  await ctx.close();
}

// 2. 移动端无横向溢出 + 画廊可滚 + 锚点跳转
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("移动端无横向溢出", overflow === 0);
  const scrollable = await page.evaluate(() => {
    const g = document.querySelector(".gallery");
    g.scrollLeft = 500;
    return g.scrollLeft > 0;
  });
  check("演示画廊横向可滚", scrollable);
  await page.click('a.btn-solid[href="#install"]');
  await page.waitForTimeout(3000);
  const nearInstall = await page.evaluate(() => {
    const el = document.getElementById("install");
    return Math.abs(el.getBoundingClientRect().top) < 200;
  });
  check("锚点跳转到安装区", nearInstall);
  await ctx.close();
}

// 3.5 画廊按钮 + 主题切换图标可见性
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  const navShown = await page.evaluate(() => {
    const ctrl = document.getElementById("showcase-controls");
    return ctrl && !ctrl.hidden;
  });
  check("画廊滚动按钮在溢出时可见", navShown);
  const before = await page.evaluate(() => document.getElementById("showcase-gallery").scrollLeft);
  await page.click("#gallery-next");
  await page.waitForTimeout(900);
  const after = await page.evaluate(() => document.getElementById("showcase-gallery").scrollLeft);
  check("下一张按钮可滚动画廊", after > before);
  const darkIcons = await page.$$eval("#theme-toggle svg", (els) => els.map((e) => getComputedStyle(e).display));
  check("暗色主题显示月亮图标", darkIcons[0] === "none" && darkIcons[1] !== "none");
  await page.click("#theme-toggle");
  const lightIcons = await page.$$eval("#theme-toggle svg", (els) => els.map((e) => getComputedStyle(e).display));
  check("亮色主题显示太阳图标", lightIcons[0] !== "none" && lightIcons[1] === "none");
  await ctx.close();
}

// 4. 桌面导航单行 + 404 页
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  const navH = await page.evaluate(() => document.querySelector("header").getBoundingClientRect().height);
  check("导航高度 ≤ 80px", navH <= 80);
  await page.goto(base + "/nonexistent", { waitUntil: "networkidle" });
  check("404 页渲染", (await page.textContent("h1")).includes("不存在"));
  await ctx.close();
}

await browser.close();
console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
