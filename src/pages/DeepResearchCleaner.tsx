import { useState, useEffect, useCallback, useRef } from "react";
import AppShell from "../components/AppShell";
import { useTools } from "../hooks/useTools";
import { toast } from "sonner";

// ─── Cleaning Engine ───────────────────────────────────────────────

interface CleanStats {
    puaChars: number;
    citations: number;
    entities: number;
    imageGroups: number;
    totalChanges: number;
}

const EMPTY_STATS: CleanStats = { puaChars: 0, citations: 0, entities: 0, imageGroups: 0, totalChanges: 0 };

function stripPUA(text: string): { result: string; count: number } {
    const regex = /[\uE000-\uF8FF]/g;
    let count = 0;
    const result = text.replace(regex, () => { count++; return ""; });
    return { result, count };
}

function cleanCitations(text: string): { result: string; count: number } {
    const regex = /cite(?:turn\d+(?:search|view)\d+)+/g;
    let count = 0;
    const result = text.replace(regex, () => { count++; return ""; });
    return { result, count };
}

function cleanEntities(text: string): { result: string; count: number } {
    const regex = /entity\["([^"]*)"\s*,\s*"([^"]*)"(?:\s*,\s*"([^"]*)")?\]/g;
    let count = 0;
    const result = text.replace(regex, (_m, type: string, name: string) => {
        count++;
        const t = type.toLowerCase();
        if (t === "book") return `\u300A${name}\u300B`;
        if (t === "people") return `**${name}**`;
        return name;
    });
    return { result, count };
}

function cleanImageGroups(text: string): { result: string; count: number } {
    const regex = /^.*image_group\{.*\}.*$/gm;
    let count = 0;
    const result = text.replace(regex, () => { count++; return ""; });
    return { result: result.replace(/\n{3,}/g, "\n\n"), count };
}

function cleanAll(input: string): { output: string; stats: CleanStats } {
    const s0 = stripPUA(input);
    const s1 = cleanCitations(s0.result);
    const s2 = cleanEntities(s1.result);
    const s3 = cleanImageGroups(s2.result);
    return {
        output: s3.result,
        stats: {
            puaChars: s0.count,
            citations: s1.count,
            entities: s2.count,
            imageGroups: s3.count,
            totalChanges: s0.count + s1.count + s2.count + s3.count,
        },
    };
}

// ─── Component ─────────────────────────────────────────────────────

export default function DeepResearchCleaner() {
    const { recordVisit } = useTools();
    useEffect(() => { recordVisit("deep-research-cleaner"); }, [recordVisit]);

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [stats, setStats] = useState<CleanStats>(EMPTY_STATS);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClean = useCallback((text: string) => {
        if (!text.trim()) {
            setOutput(""); setStats(EMPTY_STATS); return;
        }
        const r = cleanAll(text);
        setOutput(r.output);
        setStats(r.stats);
    }, []);

    useEffect(() => { handleClean(input); }, [input, handleClean]);

    // File handling
    const processFile = (file: File) => {
        if (!/\.(md|txt|markdown)$/i.test(file.name)) {
            toast.error("仅支持 .md / .txt / .markdown 文件");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setInput(e.target?.result as string);
            toast.success(`已加载: ${file.name}`);
        };
        reader.readAsText(file);
    };

    const handleCopy = () => {
        if (!output) { toast.warning("尚无结果可复制"); return; }
        navigator.clipboard.writeText(output).then(() => toast.success("已复制到剪贴板"));
    };

    const handleDownload = () => {
        if (!output) { toast.warning("尚无结果可下载"); return; }
        const blob = new Blob([output], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cleaned_${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("文件已下载");
    };

    const handleClear = () => {
        setInput(""); setOutput(""); setStats(EMPTY_STATS);
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.info("已清空");
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) { setInput(text); toast.success("已粘贴"); }
        } catch { toast.error("无法读取剪贴板，请手动粘贴"); }
    };

    return (
        <AppShell>
            {/* Tool Header */}
            <div className="tool-header">
                <div className="tool-header__left">
                    <h1 className="tool-header__title">Deep Research 清理器</h1>
                    <span className="badge">效率</span>
                    <span className="badge">AI</span>
                </div>
                <div className="tool-header__actions">
                    <button className="btn btn--secondary" onClick={handleClear}>清空</button>
                    <button className="btn btn--secondary" onClick={handleDownload}>下载 .md</button>
                    <button className="btn btn--primary" onClick={handleCopy}>复制结果</button>
                </div>
            </div>

            {/* Stats (only show when there are changes) */}
            {stats.totalChanges > 0 && (
                <div className="stats-inline" style={{ marginBottom: "var(--s-xl)" }}>
                    <div className="stats-inline__item">
                        <span className="stats-inline__dot" style={{ background: "#ef4444" }} />
                        <span className="stats-inline__count">{stats.puaChars}</span>
                        <span className="stats-inline__label">隐藏字符</span>
                    </div>
                    <div className="stats-inline__item">
                        <span className="stats-inline__dot" style={{ background: "#f59e0b" }} />
                        <span className="stats-inline__count">{stats.citations}</span>
                        <span className="stats-inline__label">引用标记</span>
                    </div>
                    <div className="stats-inline__item">
                        <span className="stats-inline__dot" style={{ background: "#8b5cf6" }} />
                        <span className="stats-inline__count">{stats.entities}</span>
                        <span className="stats-inline__label">实体标签</span>
                    </div>
                    <div className="stats-inline__item">
                        <span className="stats-inline__dot" style={{ background: "#06b6d4" }} />
                        <span className="stats-inline__count">{stats.imageGroups}</span>
                        <span className="stats-inline__label">图片指令</span>
                    </div>
                    <div className="stats-inline__item ml-auto">
                        <span className="stats-inline__dot" style={{ background: "var(--c-accent)" }} />
                        <span className="stats-inline__count">{stats.totalChanges}</span>
                        <span className="stats-inline__label">总清理</span>
                    </div>
                </div>
            )}

            {/* Workspace */}
            <div className="workspace">
                {/* Input Panel */}
                <div className="workspace__panel">
                    <div className="workspace__panel-head">
                        <span className="workspace__panel-title">原始 Markdown</span>
                        <div className="workspace__panel-actions">
                            <button className="btn btn--ghost" onClick={handlePaste}>粘贴</button>
                            <button className="btn btn--ghost" onClick={() => fileInputRef.current?.click()}>上传</button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".md,.txt,.markdown"
                                className="sr-only"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) processFile(file);
                                }}
                            />
                        </div>
                    </div>
                    <textarea
                        id="cleanerInput"
                        className={`textarea${isDragOver ? " is-dragover" : ""}`}
                        placeholder="粘贴 OpenAI Deep Research 导出的 Markdown，或拖拽文件到这里..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragOver(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) processFile(file);
                        }}
                    />
                    <p className="hint-bar">支持拖拽 .md / .txt / .markdown 文件</p>
                </div>

                {/* Output Panel */}
                <div className="workspace__panel">
                    <div className="workspace__panel-head">
                        <span className="workspace__panel-title">清理结果</span>
                        <div className="workspace__panel-actions">
                            <button className="btn btn--ghost" onClick={handleCopy}>复制</button>
                            <button className="btn btn--ghost" onClick={handleDownload}>下载</button>
                        </div>
                    </div>
                    <div className="code-block">
                        {output ? (
                            <pre>{output}</pre>
                        ) : (
                            <pre style={{ color: "var(--c-text-tertiary)", fontStyle: "italic" }}>
                                清理结果将在此处实时显示{"\n"}← 在左侧输入或上传文件即可开始
                            </pre>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
