import { useState, useMemo, useEffect, useCallback } from "react";
import type { ToolItem } from "../types/tool";
import { TOOL_DATA } from "../data/tools";
import { StorageService } from "../services/storage";

export function useTools() {
    const [searchText, setSearchText] = useState("");
    const [activeTag, setActiveTag] = useState("all");

    // 从持久化存储加载状态
    const [favorites, setFavorites] = useState<string[]>(() =>
        StorageService.get<string[]>("favorites", [])
    );
    const [recent, setRecent] = useState<string[]>(() =>
        StorageService.get<string[]>("recent", [])
    );

    // 同步到 Storage
    useEffect(() => {
        StorageService.set("favorites", favorites);
    }, [favorites]);

    useEffect(() => {
        StorageService.set("recent", recent);
    }, [recent]);

    // 工具索引表，用于快速查找
    const toolMap = useMemo(() =>
        new Map(TOOL_DATA.map(t => [t.id, t])),
        []);

    // 1. 计算所有标签
    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        TOOL_DATA.forEach(t => t.tags.forEach(tag => tagSet.add(tag)));
        return ["all", ...Array.from(tagSet).sort()];
    }, []);

    // 2. 过滤工具列表
    const filteredTools = useMemo(() => {
        const query = searchText.trim().toLowerCase();
        return TOOL_DATA.filter(tool => {
            const matchText = !query ||
                tool.title.toLowerCase().includes(query) ||
                tool.desc.toLowerCase().includes(query) ||
                tool.tags.some(t => t.toLowerCase().includes(query));

            const matchTag = activeTag === "all" || tool.tags.includes(activeTag);
            return matchText && matchTag;
        });
    }, [searchText, activeTag]);

    // 3. 收藏工具列表 (确保数据存在)
    const favoriteTools = useMemo(() =>
        favorites.map(id => toolMap.get(id)).filter((t): t is ToolItem => !!t),
        [favorites, toolMap]);

    // 4. 最近使用工具列表 (确保数据存在 + 排序)
    const recentTools = useMemo(() =>
        recent.map(id => toolMap.get(id)).filter((t): t is ToolItem => !!t),
        [recent, toolMap]);

    // 操作：切换收藏
    const toggleFavorite = useCallback((id: string) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }, []);

    // 操作：记录点击
    const recordVisit = useCallback((id: string) => {
        if (!toolMap.has(id)) return;
        setRecent(prev => {
            const next = [id, ...prev.filter(i => i !== id)].slice(0, 10);
            return next;
        });
    }, [toolMap]);

    // 统计数据
    const stats = useMemo(() => ({
        total: TOOL_DATA.length,
        tagsCount: allTags.length - 1,
        lastUpdate: TOOL_DATA.length > 0 ? Math.max(...TOOL_DATA.map(t => t.mtime)) : 0
    }), [allTags]);

    return {
        searchText,
        setSearchText,
        activeTag,
        setActiveTag,
        allTags,
        filteredTools,
        favoriteTools,
        recentTools,
        isFavorite: (id: string) => favorites.includes(id),
        toggleFavorite,
        recordVisit,
        stats
    };
}
