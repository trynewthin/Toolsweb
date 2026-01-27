import Layout from "../components/Layout";
import { ToolCard } from "../components/ToolCard";
import { useTools } from "../hooks/useTools";

export default function Home() {
  const {
    searchText,
    setSearchText,
    activeTag,
    setActiveTag,
    allTags,
    filteredTools,
    favoriteTools,
    recentTools,
    isFavorite,
    toggleFavorite,
    recordVisit,
    stats
  } = useTools();

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "--";
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const renderEmpty = (text: string) => <p className="muted">{text}</p>;

  return (
    <Layout
      title="全功能在线工具箱"
      heroTitle="把你的工具整理成一个强大且好用的工作台。"
      heroDesc="每个工具一个独立组件页面，直接复用模板即可扩展。"
      nav={[
        { label: "工具清单", href: "#all" },
        { label: "收藏", href: "#favorites" },
        { label: "最近", href: "#recent" },
      ]}
      stats={[
        { label: "工具总数", value: stats.total },
        { label: "活跃分类", value: stats.tagsCount },
        { label: "最近更新", value: formatDate(stats.lastUpdate) },
      ]}
    >
      {/* 最近使用 - 仅在有记录时显示 */}
      {recentTools.length > 0 && (
        <section className="board" id="recent">
          <div className="board__header">
            <h2>最近使用</h2>
            <p className="muted">快速访问您上次打开的工具。</p>
          </div>
          <div className="grid">
            {recentTools.map((tool) => (
              <ToolCard
                key={`recent-${tool.id}`}
                tool={tool}
                isFavorite={isFavorite(tool.id)}
                onToggleFavorite={toggleFavorite}
                onRecordVisit={recordVisit}
              />
            ))}
          </div>
        </section>
      )}

      {/* 收藏工具 - 仅在有记录时显示 */}
      {favoriteTools.length > 0 && (
        <section className="board" id="favorites">
          <div className="board__header">
            <h2>我的收藏</h2>
            <p className="muted">标记喜爱的工具，以便快速访问。</p>
          </div>
          <div className="grid">
            {favoriteTools.map((tool) => (
              <ToolCard
                key={`fav-${tool.id}`}
                tool={tool}
                isFavorite={isFavorite(tool.id)}
                onToggleFavorite={toggleFavorite}
                onRecordVisit={recordVisit}
              />
            ))}
          </div>
        </section>
      )}

      {/* 全部工具清单 */}
      <section className="filter" id="all">
        <div className="flex justify-between items-end">
          <div>
            <h2>工具清单</h2>
            <p className="muted">通过关键词检索或分类浏览所有可用工具。</p>
          </div>
        </div>

        <div className="filter__controls">
          <input
            id="searchInput"
            type="text"
            placeholder="搜索工具名称 / 标签 / 描述..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="chips">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`chip${activeTag === tag ? " active" : ""}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag === "all" ? "全部" : tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid" id="toolGrid">
        {filteredTools.length > 0
          ? filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isFavorite={isFavorite(tool.id)}
              onToggleFavorite={toggleFavorite}
              onRecordVisit={recordVisit}
            />
          ))
          : renderEmpty("未找到匹配的工具")}
      </section>
    </Layout>
  );
}
