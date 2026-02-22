import AppShell from "../components/AppShell";
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
  } = useTools();

  return (
    <AppShell
      topbarExtra={
        <div className="home-search">
          <span className="home-search__icon">⌕</span>
          <input
            id="searchInput"
            className="input"
            type="text"
            placeholder="搜索工具..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      }
    >
      {/* Tag Filters */}
      <div className="home-filters" style={{ marginBottom: "var(--s-2xl)" }}>
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`chip${activeTag === tag ? " is-active" : ""}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag === "all" ? "全部" : tag}
          </button>
        ))}
      </div>

      {/* Recent */}
      {recentTools.length > 0 && (
        <section className="home-section" id="recent">
          <h2 className="home-section__title">最近使用</h2>
          <div className="tool-grid">
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

      {/* Favorites */}
      {favoriteTools.length > 0 && (
        <section className="home-section" id="favorites">
          <h2 className="home-section__title">我的收藏</h2>
          <div className="tool-grid">
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

      {/* All Tools */}
      <section className="home-section" id="all">
        <h2 className="home-section__title">全部工具</h2>
        {filteredTools.length > 0 ? (
          <div className="tool-grid">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isFavorite={isFavorite(tool.id)}
                onToggleFavorite={toggleFavorite}
                onRecordVisit={recordVisit}
              />
            ))}
          </div>
        ) : (
          <p className="home-empty">未找到匹配的工具</p>
        )}
      </section>
    </AppShell>
  );
}
