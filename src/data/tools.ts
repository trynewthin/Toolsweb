import type { ToolItem } from "../types/tool";

export const TOOL_DATA: ToolItem[] = [
    {
        id: "curl2ffmpeg",
        title: "cURL 转 FFmpeg",
        desc: "提取 URL 与关键头，生成可直接使用的 FFmpeg 指令。",
        tags: ["效率", "开发"],
        path: "/tools/curl2ffmpeg",
        mtime: 1768979359882,
    },
    {
        id: "deep-research-cleaner",
        title: "Deep Research 清理器",
        desc: "一键清理 OpenAI Deep Research 导出 Markdown 中的引用标记、实体标签与图片指令。",
        tags: ["效率", "AI"],
        path: "/tools/deep-research-cleaner",
        mtime: 1740192797000,
    },
];
