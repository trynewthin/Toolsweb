# ToolsHub

这是一个用于承载多工具的静态站点骨架，适合部署到 Vercel。

## 目录结构

- `index.html`：工具集合主页
- `tools/`：每个工具单独一个 HTML 文件
- `assets/css/`：通用样式
- `assets/js/`：公共脚本

## 新增工具步骤

1. 复制 `tools/tool-template.html` 并重命名
2. 在新文件中替换标题、说明与工具区域
3. 在 `index.html` 增加新卡片并链接到你的工具页面
