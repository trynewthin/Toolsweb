const searchInput = document.querySelector("#searchInput");
const chipContainer = document.querySelector(".chips");
const grid = document.querySelector("#toolGrid");
const favoritesGrid = document.querySelector("#favoritesGrid");
const recentGrid = document.querySelector("#recentGrid");
const totalEl = document.querySelector("#totalTools");
const tagsEl = document.querySelector("#activeTags");
const updatedEl = document.querySelector("#lastUpdated");

let cards = [];
let tools = [];
let favorites = new Set(JSON.parse(localStorage.getItem("toolFavorites") || "[]"));
let recent = JSON.parse(localStorage.getItem("toolRecent") || "[]");

const formatDate = (ts) => {
  if (!ts) return "--";
  const date = new Date(ts);
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
};

const updateStats = (list) => {
  const tagSet = new Set();
  list.forEach((t) => (t.tags || []).forEach((tag) => tagSet.add(tag)));
  totalEl.textContent = list.length;
  tagsEl.textContent = tagSet.size;
  updatedEl.textContent = list[0]?.mtime ? formatDate(list[0].mtime) : "--";
};

const renderChips = (list) => {
  const tagSet = new Set();
  list.forEach((t) => (t.tags || []).forEach((tag) => tagSet.add(tag)));
  const tags = Array.from(tagSet).sort();
  chipContainer.innerHTML = ["all", ...tags]
    .map((tag, idx) => `<button class="chip${idx === 0 ? " active" : ""}" data-filter="${tag}">${tag === "all" ? "全部" : tag}</button>`)
    .join("");
};

const renderCards = (list) => {
  grid.innerHTML = list
    .map(
      (tool) => `
      <article class="tool-card" data-tags="${(tool.tags || []).join(",")}">
        <div class="tool-card__head">
          <div class="tool-card__tags">${(tool.tags || []).map((t) => `<span class="badge">${t}</span>`).join("")}</div>
          <button class="fav-btn ${favorites.has(tool.path) ? "active" : ""}" data-path="${tool.path}" title="收藏">★</button>
        </div>
        <h3>${tool.title || "未命名工具"}</h3>
        <p>${tool.desc || ""}</p>
        <a href="${tool.path}" class="card-link">打开工具 →</a>
      </article>
    `,
    )
    .join("");
  cards = Array.from(document.querySelectorAll(".tool-card"));
};

const renderSubGrid = (target, list) => {
  if (!target) return;
  if (!list.length) {
    target.innerHTML = '<p class="muted">暂无数据</p>';
    return;
  }
  target.innerHTML = list
    .map(
      (tool) => `
      <article class="tool-card" data-tags="${(tool.tags || []).join(",")}">
        <div class="tool-card__head">
          <div class="tool-card__tags">${(tool.tags || []).map((t) => `<span class="badge">${t}</span>`).join("")}</div>
          <button class="fav-btn ${favorites.has(tool.path) ? "active" : ""}" data-path="${tool.path}" title="收藏">★</button>
        </div>
        <h3>${tool.title || "未命名工具"}</h3>
        <p>${tool.desc || ""}</p>
        <a href="${tool.path}" class="card-link">打开工具 →</a>
      </article>
    `,
    )
    .join("");
};

const applyFilter = () => {
  const text = (searchInput?.value || "").trim().toLowerCase();
  const activeChip = document.querySelector(".chip.active");
  const tag = activeChip ? activeChip.dataset.filter : "all";

  cards.forEach((card) => {
    const title = card.querySelector("h3")?.textContent?.toLowerCase() || "";
    const desc = card.querySelector("p")?.textContent?.toLowerCase() || "";
    const tags = card.dataset.tags || "";

    const matchText = title.includes(text) || desc.includes(text) || tags.includes(text);
    const matchTag = tag === "all" || tags.includes(tag);

    card.style.display = matchText && matchTag ? "flex" : "none";
  });
};

const bindChipEvents = () => {
  chipContainer.addEventListener("click", (e) => {
    const target = e.target.closest(".chip");
    if (!target) return;
    chipContainer.querySelectorAll(".chip").forEach((item) => item.classList.remove("active"));
    target.classList.add("active");
    applyFilter();
  });
};

const bindFavoriteEvents = (scope = document) => {
  scope.addEventListener("click", (e) => {
    const btn = e.target.closest(".fav-btn");
    if (!btn) return;
    const path = btn.dataset.path;
    if (!path) return;
    if (favorites.has(path)) {
      favorites.delete(path);
    } else {
      favorites.add(path);
    }
    localStorage.setItem("toolFavorites", JSON.stringify(Array.from(favorites)));
    renderAllSections();
  });
};

const recordRecent = (path) => {
  if (!path) return;
  const rest = recent.filter((p) => p !== path);
  recent = [path, ...rest].slice(0, 8);
  localStorage.setItem("toolRecent", JSON.stringify(recent));
};

const hydrateLinks = () => {
  grid.addEventListener("click", (e) => {
    const link = e.target.closest("a.card-link");
    if (!link) return;
    recordRecent(link.getAttribute("href"));
  });
};

const mapByPath = (list) => {
  const map = new Map();
  list.forEach((t) => map.set(t.path, t));
  return map;
};

const renderAllSections = () => {
  renderCards(tools);
  const map = mapByPath(tools);
  const favList = Array.from(favorites)
    .map((p) => map.get(p))
    .filter(Boolean);
  const recentList = recent
    .map((p) => map.get(p))
    .filter(Boolean);
  renderSubGrid(favoritesGrid, favList);
  renderSubGrid(recentGrid, recentList);
  applyFilter();
};

const init = async () => {
  try {
    const res = await fetch("assets/manifest.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("manifest not found");
    const manifest = await res.json();
    tools = manifest.tools || [];
    tools.sort((a, b) => (b.mtime || 0) - (a.mtime || 0));
    renderChips(tools);
    renderAllSections();
    updateStats(tools);
    bindChipEvents();
    bindFavoriteEvents(document);
    hydrateLinks();
  } catch (err) {
    grid.innerHTML = '<p class="muted">未找到 manifest，请运行 npm run build 生成工具清单。</p>';
    console.error(err);
  }
};

searchInput?.addEventListener("input", applyFilter);

init();
