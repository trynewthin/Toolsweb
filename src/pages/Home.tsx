import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type ToolItem = {
  title?: string;
  desc?: string;
  tags?: string[];
  path: string;
  mtime?: number;
};

const TOOL_LIST: ToolItem[] = [
  {
    title: "cURL 转 FFmpeg",
    desc: "提取 URL 与关键头，生成可直接使用的 FFmpeg 指令。",
    tags: ["效率", "开发"],
    path: "/tools/curl2ffmpeg",
    mtime: 1768979359882.1643,
  },
  {
    title: "塔罗抽卡",
    desc: "支持排阵的抽卡桌面：点击牌背翻面并落位。",
    tags: ["娱乐", "效率"],
    path: "/tools/tarot",
    mtime: 1768979600000,
  },
];

const formatDate = (timestamp?: number) => {
  if (!timestamp) return "--";
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export default function Home() {
  const [tools] = useState<ToolItem[]>(() => TOOL_LIST.slice());
  const [searchText, setSearchText] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const fav = JSON.parse(localStorage.getItem("toolFavorites") || "[]");
    setFavorites(new Set(fav));
    setRecent(JSON.parse(localStorage.getItem("toolRecent") || "[]"));
  }, []);

  const tagList = useMemo(() => {
    const tagSet = new Set<string>();
    tools.forEach((tool) => (tool.tags || []).forEach((tag) => tagSet.add(tag)));
    return ["all", ...Array.from(tagSet).sort()];
  }, [tools]);

  const tagCount = useMemo(() => {
    const tagSet = new Set<string>();
    tools.forEach((tool) => (tool.tags || []).forEach((tag) => tagSet.add(tag)));
    return tagSet.size;
  }, [tools]);

  const filteredTools = useMemo(() => {
    const text = searchText.trim().toLowerCase();
    return tools.filter((tool) => {
      const title = tool.title?.toLowerCase() || "";
      const desc = tool.desc?.toLowerCase() || "";
      const tags = (tool.tags || []).join(",");
      const matchText = !text || title.includes(text) || desc.includes(text) || tags.includes(text);
      const matchTag = activeTag === "all" || (tool.tags || []).includes(activeTag);
      return matchText && matchTag;
    });
  }, [tools, searchText, activeTag]);

  const toolMap = useMemo(() => new Map(tools.map((tool) => [tool.path, tool])), [tools]);

  const favoriteTools = useMemo(() => {
    return Array.from(favorites)
      .map((path) => toolMap.get(path))
      .filter(Boolean) as ToolItem[];
  }, [favorites, toolMap]);

  const recentTools = useMemo(() => {
    return recent.map((path) => toolMap.get(path)).filter(Boolean) as ToolItem[];
  }, [recent, toolMap]);

  const toggleFavorite = (path: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      localStorage.setItem("toolFavorites", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const recordRecent = (path: string) => {
    setRecent((prev) => {
      const next = [path, ...prev.filter((item) => item !== path)].slice(0, 8);
      localStorage.setItem("toolRecent", JSON.stringify(next));
      return next;
    });
  };

  const renderCard = (tool: ToolItem) => (
    <article key={tool.path} className="tool-card" data-tags={(tool.tags || []).join(",")}>
      <div className="tool-card__head">
        <div className="tool-card__tags">
          {(tool.tags || []).map((tag) => (
            <span className="badge" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <button
          className={`fav-btn${favorites.has(tool.path) ? " active" : ""}`}
          data-path={tool.path}
          title="收藏"
          onClick={() => toggleFavorite(tool.path)}
        >
          ★
        </button>
      </div>
      <h3>{tool.title || "未命名工具"}</h3>
      <p>{tool.desc || ""}</p>
      <Link className="card-link" to={tool.path} onClick={() => recordRecent(tool.path)}>
        打开工具 →
      </Link>
    </article>
  );

  const renderEmpty = () => <p className="muted">暂无数据</p>;

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand__dot"></span>
          <div>
            <p className="brand__name">ToolsHub</p>
            <p className="brand__tag">轻量 · 快速 · 可扩展</p>
          </div>
        </div>
        <nav className="nav">
          <a href="#all">全部工具</a>
          <a href="#favorites">收藏</a>
          <a href="#recent">最近</a>
        </nav>
        <button className="ghost-btn">提交新工具</button>
      </header>

      <main className="layout">
        <section className="hero">
          <div>
            <p className="eyebrow">在线工具集合</p>
            <h1>把你的工具整理成一个强大且好用的工作台。</h1>
            <p className="hero__desc">每个工具一个独立组件页面，直接复用模板即可扩展。</p>
            <div className="hero__actions">
              <button className="primary-btn">查看模板</button>
              <button className="secondary-btn">规划分类</button>
            </div>
          </div>
          <div className="hero__panel">
            <div className="panel__item">
              <p className="panel__label">工具总数</p>
              <p className="panel__value" id="totalTools">
                {tools.length}
              </p>
            </div>
            <div className="panel__item">
              <p className="panel__label">活跃分类</p>
              <p className="panel__value" id="activeTags">
                {tagCount}
              </p>
            </div>
            <div className="panel__item">
              <p className="panel__label">最近更新</p>
              <p className="panel__value" id="lastUpdated">
                {formatDate(tools[0]?.mtime)}
              </p>
            </div>
          </div>
        </section>

        <section className="filter" id="all">
          <div>
            <h2>工具清单</h2>
            <p className="muted">用关键词快速找到工具，或按标签浏览。</p>
          </div>
          <div className="filter__controls">
            <input
              id="searchInput"
              type="text"
              placeholder="搜索工具名称 / 标签"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            <div className="chips">
              {tagList.map((tag) => (
                <button
                  key={tag}
                  className={`chip${activeTag === tag ? " active" : ""}`}
                  data-filter={tag}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag === "all" ? "全部" : tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="board" id="favorites">
          <div className="board__header">
            <h2>收藏</h2>
            <p className="muted">标记喜爱的工具，快速访问。</p>
          </div>
          <div className="grid" id="favoritesGrid">
            {favoriteTools.length ? favoriteTools.map(renderCard) : renderEmpty()}
          </div>
        </section>

        <section className="board" id="recent">
          <div className="board__header">
            <h2>最近使用</h2>
            <p className="muted">记录你最近打开的工具。</p>
          </div>
          <div className="grid" id="recentGrid">
            {recentTools.length ? recentTools.map(renderCard) : renderEmpty()}
          </div>
        </section>

        <section className="grid" id="toolGrid">
          {filteredTools.map(renderCard)}
        </section>
      </main>

      <footer className="footer">
        <p>Made for your toolbox · 快速搭建 · 持续扩展</p>
      </footer>
    </div>
  );
}
