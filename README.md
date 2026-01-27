# ToolsHub

ToolsHub 是一个现代化、高性能且易于扩展的在线工具箱骨架。它旨在提供一个统一的、具有极佳视觉体验的平台来承载各种日常开发与生活辅助工具。

## ✨ 特性

- **现代化技术栈**：基于 React 19、Vite 7 和 Tailwind 4 构建，享受极致的开发与运行速度。
- **精美设计**：内置现代化的 UI 交互，支持响应式布局、卡片化展示及优雅的微动画。
- **智能化管理**：支持全文关键词检索、标签分类过滤，并具备基于 `localStorage` 的工具收藏与最近使用记录。
- **开发者友好**：高度模块化的设计，添加新工具如同新增一个 React 页面一样简单。
- **Vercel 预配置**：完美支持一键部署到 Vercel 云平台。

## 🛠️ 技术栈

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS 4, Shadcn UI
- **Routing**: React Router 6
- **Icons**: Phosphor Icons

## 📂 目录结构

```text
src/
├── components/      # 通用组件与 UI 库 (Shadcn UI)
├── pages/           # 工具页面定义
│   ├── Home.tsx     # 门户主页（包含工具分发逻辑）
│   ├── Tarot.tsx    # 塔罗抽卡工具
│   └── Curl2Ffmpeg.tsx # cURL 转 FFmpeg 工具
├── assets/          # 静态资源
├── App.tsx          # 路由配置
└── main.tsx         # 入口文件
```

## 🚀 快速开始

### 运行
```bash
bun install    # 或 npm install
bun dev        # 启动开发服务器
```

### 构建
```bash
bun build      # 生成生产预览
```

## ➕ 如何新增工具

1. **创建页面**：在 `src/pages/` 目录下创建一个新的 React 组件文件（例如 `MyNewTool.tsx`）。
2. **配置路由**：在 `src/App.tsx` 中导入您的组件并添加一个新的 `<Route>`。
3. **注册列表**：在 `src/pages/Home.tsx` 的 `TOOL_LIST` 常量中添加您的工具元数据（标题、描述、路径、标签）。

---

Made with ❤️ for developers.
