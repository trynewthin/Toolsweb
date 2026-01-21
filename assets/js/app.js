const searchInput = document.querySelector("#searchInput");
const chipContainer = document.querySelector(".chips");
const grid = document.querySelector("#toolGrid");
const totalEl = document.querySelector("#totalTools");
const tagsEl = document.querySelector("#activeTags");
const updatedEl = document.querySelector("#lastUpdated");

let cards = [];
let tools = [];

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
          ${(tool.tags || []).map((t) => `<span class="badge">${t}</span>`).join("")}
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

const init = async () => {
  try {
    const res = await fetch("assets/manifest.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("manifest not found");
    const manifest = await res.json();
    tools = manifest.tools || [];
    tools.sort((a, b) => (b.mtime || 0) - (a.mtime || 0));
    renderChips(tools);
    renderCards(tools);
    updateStats(tools);
    applyFilter();
    bindChipEvents();
  } catch (err) {
    grid.innerHTML = '<p class="muted">未找到 manifest，请运行 npm run build 生成工具清单。</p>';
    console.error(err);
  }
};

searchInput?.addEventListener("input", applyFilter);

init();
