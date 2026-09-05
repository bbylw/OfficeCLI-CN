export const site = {
  name: "OfficeCLI",
  github: "https://github.com/iOfficeAI/OfficeCLI",
  releases: "https://github.com/iOfficeAI/OfficeCLI/releases",
  official: "https://officecli.ai",
  discord: "https://discord.gg/2QAwJn7Egx",
  wiki: "https://github.com/iOfficeAI/OfficeCLI/wiki",
  skill: "https://officecli.ai/SKILL.md",
  issues: "https://github.com/iOfficeAI/OfficeCLI/issues",
  aionui: "https://github.com/iOfficeAI/AionUi",
  wikiCommand: (name: string) =>
    `https://github.com/iOfficeAI/OfficeCLI/wiki/command-${name}`,
  wikiFormat: (name: string) =>
    `https://github.com/iOfficeAI/OfficeCLI/wiki/${name}-reference`,
};

export type CommandItem = { name: string; desc: string; wiki?: string };

export const commandGroups: { title: string; items: CommandItem[] }[] = [
  {
    title: "读取与检查",
    items: [
      { name: "create", desc: "创建空白或带内容的文档", wiki: "create" },
      { name: "view", desc: "大纲/文本/统计/问题/HTML", wiki: "view" },
      { name: "get", desc: "按路径取元素与子树", wiki: "get" },
      { name: "query", desc: "CSS 风格选择器查询", wiki: "query" },
      { name: "validate", desc: "OpenXML 模式校验", wiki: "validate" },
    ],
  },
  {
    title: "修改与重组",
    items: [
      { name: "set", desc: "修改元素属性", wiki: "set" },
      { name: "add", desc: "添加或克隆元素", wiki: "add" },
      { name: "remove", desc: "删除元素", wiki: "remove" },
      { name: "move", desc: "移动元素到指定位置", wiki: "move" },
      { name: "swap", desc: "交换两个元素", wiki: "swap" },
    ],
  },
  {
    title: "自动化与集成",
    items: [
      { name: "batch", desc: "单次打开保存执行多条命令", wiki: "batch" },
      { name: "merge", desc: "模板合并填充 {{key}}", wiki: "merge" },
      { name: "watch", desc: "实时预览自动刷新", wiki: "watch" },
      { name: "mcp", desc: "启动 MCP 服务器", wiki: "mcp" },
      { name: "open", desc: "驻留模式文档常驻内存", wiki: "open" },
      { name: "raw", desc: "查看或改写原始 XML", wiki: "raw" },
      { name: "install", desc: "装二进制加技能文件", wiki: "install" },
    ],
  },
];

export type FormatFeature = { label: string; wiki: string };

export const formatFeatures: {
  format: string;
  icon: string;
  file: string;
  reference: string;
  features: FormatFeature[];
}[] = [
  {
    format: "Word",
    icon: "ph-file-doc",
    file: ".docx",
    reference: "word",
    features: [
      { label: "公式 OMML", wiki: "word-equation" },
      { label: "批注", wiki: "word-comment" },
      { label: "脚注", wiki: "word-footnote" },
      { label: "目录", wiki: "word-toc" },
      { label: "图表", wiki: "word-chart" },
      { label: "水印", wiki: "word-watermark" },
      { label: "书签", wiki: "word-bookmark" },
      { label: "页眉页脚", wiki: "word-header-footer" },
      { label: "表格", wiki: "word-table" },
      { label: "样式", wiki: "word-style" },
      { label: "图片 SVG", wiki: "word-picture" },
      { label: "超链接", wiki: "word-hyperlink" },
      { label: "域", wiki: "word-field" },
      { label: "内容控件 SDT", wiki: "word-sdt" },
      { label: "i18n 与 RTL", wiki: "i18n" },
    ],
  },
  {
    format: "Excel",
    icon: "ph-file-xls",
    file: ".xlsx",
    reference: "excel",
    features: [
      { label: "350+ 函数自动求值", wiki: "excel-cell" },
      { label: "数据透视表", wiki: "excel-pivottable" },
      { label: "条件格式", wiki: "excel-conditionalformatting" },
      { label: "图表", wiki: "excel-chart" },
      { label: "切片器", wiki: "excel-slicer" },
      { label: "迷你图", wiki: "excel-sparkline" },
      { label: "命名范围", wiki: "excel-namedrange" },
      { label: "数据验证", wiki: "excel-validation" },
      { label: "自动筛选", wiki: "excel-autofilter" },
      { label: "排序", wiki: "excel-sort" },
      { label: "表格", wiki: "excel-table" },
      { label: "批注", wiki: "excel-comment" },
      { label: "CSV/TSV 导入", wiki: "excel-sheet" },
      { label: "形状", wiki: "excel-shape" },
      { label: "OLE 对象", wiki: "excel-ole" },
    ],
  },
  {
    format: "PowerPoint",
    icon: "ph-file-ppt",
    file: ".pptx",
    reference: "powerpoint",
    features: [
      { label: "形状", wiki: "ppt-shape" },
      { label: "图表", wiki: "ppt-chart" },
      { label: "动画", wiki: "ppt-slide" },
      { label: "morph 过渡", wiki: "ppt-morph-check" },
      { label: "3D 模型 .glb", wiki: "ppt-3dmodel" },
      { label: "幻灯片缩放", wiki: "ppt-zoom" },
      { label: "公式", wiki: "ppt-equation" },
      { label: "主题", wiki: "ppt-theme" },
      { label: "视频音频", wiki: "ppt-video" },
      { label: "表格", wiki: "ppt-table" },
      { label: "连接线", wiki: "ppt-connector" },
      { label: "组合", wiki: "ppt-group" },
      { label: "备注", wiki: "ppt-notes" },
      { label: "批注", wiki: "ppt-comment" },
      { label: "占位符", wiki: "ppt-placeholder" },
    ],
  },
];

export const showcase = [
  { src: "/assets/designwhatmovesyou.gif", alt: "AI 智能体生成的设计主题演示文稿", label: "设计提案" },
  { src: "/assets/word2.gif", alt: "AI 智能体生成的项目建议书 Word 文档", label: "项目建议书" },
  { src: "/assets/horizon.gif", alt: "AI 智能体生成的商务演示文稿", label: "商务汇报" },
  { src: "/assets/excel2.gif", alt: "AI 智能体生成的成绩管理电子表格", label: "成绩管理" },
  { src: "/assets/efforless.gif", alt: "AI 智能体生成的科技风格演示文稿", label: "科技产品" },
  { src: "/assets/excel3.gif", alt: "AI 智能体生成的销售仪表盘电子表格", label: "销售仪表盘" },
];
