export interface ToolItem {
    id: string; // 唯一标识，通常与 path 相关
    title: string;
    desc: string;
    tags: string[];
    path: string;
    mtime: number; // 更新时间戳
    icon?: string; // 可选图标类名或 URL
}
