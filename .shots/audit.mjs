// UI 打磨前审计：在各断点测量版面几何问题（溢出、换行、间距、对齐）
import { createRequire } from "node:module";
const require = createRequire("C:/Users/bbylw/.pwl/");
const { chromium } = require("playwright-core");

const exe = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const base = "http://localhost:4321";
const widths = [1440, 1024, 768, 390];

const browser = await chromium.launch({ executablePath: exe });

for (const w of widths) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: 900 },
    reducedMotion: "no-preference",
  });
  await ctx.addInitScript(() => localStorage.setItem("officecli-theme", "dark"));
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log(`[${w}] pageerror: ${e.message}`));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  const report = await page.evaluate(() => {
    const out = {};
    // 1. h1 行数（按 line box 估算）与是否超出一屏
    const h1 = document.querySelector("h1");
    out.h1Lines = Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight));
    out.heroBottom = document.querySelector("#formats").getBoundingClientRect().top;

    // 2. 各 .term 内部横向溢出量（px）
    out.terms = [...document.querySelectorAll(".term")].map((t) => {
      const body = t.querySelector(".term-body");
      const bar = t.querySelector(".term-bar");
      return {
        bar: bar ? bar.textContent.trim().slice(0, 12) : "",
        overflow: body ? body.scrollWidth - body.clientWidth : 0,
        clientW: body ? body.clientWidth : 0,
      };
    });

    // 3. 表格 wrapper 是否需要横向滚动（预期内）与矩阵首列内容
    out.tables = [...document.querySelectorAll(".matrix")].map((t) => ({
      scrollW: t.scrollWidth,
      clientW: t.clientWidth,
    }));

    // 4. 按钮文本是否折行（高度 > 单行）
    out.buttons = [...document.querySelectorAll(".btn")].map((b) => ({
      text: b.textContent.trim().slice(0, 14),
      h: Math.round(b.getBoundingClientRect().height),
      lineH: parseFloat(getComputedStyle(b).lineHeight),
    }));

    // 5. 非滚动容器内元素宽度超过父级（潜在被裁切）
    const skip = new Set(["SCRIPT", "STYLE", "VIDEO", "SVG", "IMG", "CODE", "BUTTON", "A"]);
    const overflows = [];
    document.querySelectorAll("div,span,p,li,td,th,h1,h2,h3").forEach((el) => {
      if (skip.has(el.tagName)) return;
      const p = el.parentElement;
      if (!p || getComputedStyle(el).position === "fixed") return;
      if (el.closest(".term-body, .gallery, .overflow-x-auto, .matrix")) return;
      if (el.scrollWidth > el.clientWidth + 2) {
        const r = el.getBoundingClientRect();
        overflows.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className && String(el.className).slice(0, 40)) || "",
          text: (el.textContent || "").trim().slice(0, 22),
          sw: el.scrollWidth,
          cw: el.clientWidth,
          top: Math.round(r.top),
        });
      }
    });
    out.overflows = overflows.slice(0, 12);

    // 6. 各 section 顶部间距（首个子元素相对 section 顶部）
    out.sections = [...document.querySelectorAll("main section[id]")].map((s) => {
      const first = s.firstElementChild;
      const gap = first ? first.getBoundingClientRect().top - s.getBoundingClientRect().top : 0;
      return { id: s.id, padTop: Math.round(gap) };
    });

    // 7. 图库卡片宽/画廊可视宽
    const g = document.querySelector(".gallery");
    const card = g && g.querySelector("figure");
    out.gallery = g
      ? {
          viewW: g.clientWidth,
          scrollW: g.scrollWidth,
          cardW: card ? Math.round(card.getBoundingClientRect().width) : 0,
          cardH: card ? Math.round(card.getBoundingClientRect().height) : 0,
          imgH: card ? Math.round(card.querySelector("video,img").getBoundingClientRect().height) : 0,
        }
      : null;

    // 8. 页脚/内容最大内容宽度是否一致
    const wraps = [...document.querySelectorAll(".wrap")].map((el) =>
      Math.round(el.getBoundingClientRect().width)
    );
    out.wrapWidths = [...new Set(wraps)];
    return out;
  });

  console.log(`\n===== width ${w} =====`);
  console.log(
    "h1 lines:", report.h1Lines,
    "| formats section top:", Math.round(report.heroBottom),
    "| wrap widths:", report.wrapWidths.join(",")
  );
  for (const t of report.terms) {
    if (t.overflow > 0) console.log(`  term [${t.bar}] overflow ${t.overflow}px (client ${t.clientW}px)`);
  }
  console.log("  tables scroll/client:", report.tables.map((t) => `${t.scrollW}/${t.clientW}`).join("  "));
  for (const b of report.buttons) {
    if (b.h > b.lineH + 6) console.log(`  BUTTON WRAP: "${b.text}" h=${b.h} line=${b.lineH}`);
  }
  for (const o of report.overflows) {
    console.log(`  OVERFLOW <${o.tag} .${o.cls}> "${o.text}" sw=${o.sw} cw=${o.cw} @y${o.top}`);
  }
  console.log("  section padTops:", report.sections.map((s) => `${s.id}:${s.padTop}`).join(" "));
  if (report.gallery) {
    console.log(
      `  gallery view=${report.gallery.viewW} scroll=${report.gallery.scrollW} card=${report.gallery.cardW}x${report.gallery.cardH} mediaH=${report.gallery.imgH}`
    );
  }
  await ctx.close();
}

await browser.close();
console.log("\naudit done");
