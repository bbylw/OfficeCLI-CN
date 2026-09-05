# OfficeCLI 中文站

OfficeCLI（[iOfficeAI/OfficeCLI](https://github.com/iOfficeAI/OfficeCLI)）的中文介绍站。设计语言：终端墨黑·信号绿，等宽字体主导，单一信号绿强调。

## 技术栈

- Astro 7 + Tailwind CSS 4（`@tailwindcss/vite`）
- 字体自托管：Space Grotesk Variable + JetBrains Mono Variable（`@fontsource-variable`）
- 图标：@phosphor-icons/web regular
- 包管理：bun（`.npmrc` 钉官方 registry）

## 开发

```bash
bun install
bun run dev      # 开发
bun run build    # 构建到 dist/
bun run preview  # 本地预览（注意先停掉旧进程）
```

## 页面结构

单页落地页 + 404。区块：Hero（终端 + 幻灯片预览双联）、能力矩阵、演示画廊（README 实拍 GIF）、四个内置引擎、三层架构、AI 集成、对比表、安装、命令参考。

文案与数据全部来自上游 README 中文内容；命令的详细文档链接指向官方 Wiki。

## 部署

GitHub Pages workflow + 自定义域 `officecli.ndjp.net`（`public/CNAME`）。发布前需在 DNS 端添加 A 记录。
