import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Card = {
  name: string;
  desc: string;
};

type Slot = {
  id: string;
  label: string;
  x: number;
  y: number;
  rotate?: number;
};

type Spread = {
  name: string;
  slots: Slot[];
};

const DECK: Card[] = [
  { name: "0 愚者", desc: "新开始 / 冒险 / 自由" },
  { name: "I 魔术师", desc: "行动力 / 资源 / 开创" },
  { name: "II 女祭司", desc: "直觉 / 潜意识 / 观察" },
  { name: "III 女皇", desc: "丰盛 / 滋养 / 成长" },
  { name: "IV 皇帝", desc: "秩序 / 边界 / 责任" },
  { name: "V 教皇", desc: "传统 / 指引 / 规则" },
  { name: "VI 恋人", desc: "选择 / 连接 / 价值观" },
  { name: "VII 战车", desc: "推进 / 控制 / 胜利" },
  { name: "VIII 力量", desc: "勇气 / 柔韧 / 内在力量" },
  { name: "IX 隐者", desc: "独处 / 搜索 / 内省" },
  { name: "X 命运之轮", desc: "变化 / 周期 / 转机" },
  { name: "XI 正义", desc: "平衡 / 因果 / 决断" },
  { name: "XII 倒吊人", desc: "换角度 / 暂停 / 牺牲" },
  { name: "XIII 死神", desc: "结束 / 转化 / 重生" },
  { name: "XIV 节制", desc: "调和 / 节奏 / 复原" },
  { name: "XV 恶魔", desc: "束缚 / 欲望 / 觉察" },
  { name: "XVI 塔", desc: "冲击 / 崩塌 / 真相" },
  { name: "XVII 星星", desc: "希望 / 复苏 / 指引" },
  { name: "XVIII 月亮", desc: "迷雾 / 情绪 / 潜意识" },
  { name: "XIX 太阳", desc: "清晰 / 成功 / 喜悦" },
  { name: "XX 审判", desc: "觉醒 / 回顾 / 召唤" },
  { name: "XXI 世界", desc: "完成 / 整合 / 新阶段" },
];

const SPREADS: Record<string, Spread> = {
  one: {
    name: "单张",
    slots: [{ id: "guide", label: "指引", x: 50, y: 50 }],
  },
  three: {
    name: "三张",
    slots: [
      { id: "past", label: "过去", x: 30, y: 50 },
      { id: "present", label: "现在", x: 50, y: 50 },
      { id: "future", label: "未来", x: 70, y: 50 },
    ],
  },
  celtic: {
    name: "凯尔特十字",
    slots: [
      { id: "s1", label: "现状", x: 42, y: 50 },
      { id: "s2", label: "阻碍", x: 42, y: 50, rotate: 90 },
      { id: "s3", label: "潜意识", x: 42, y: 73 },
      { id: "s4", label: "过去", x: 26, y: 50 },
      { id: "s5", label: "目标", x: 42, y: 27 },
      { id: "s6", label: "未来", x: 58, y: 50 },
      { id: "s7", label: "自我", x: 74, y: 72 },
      { id: "s8", label: "环境", x: 74, y: 54 },
      { id: "s9", label: "希望/恐惧", x: 74, y: 36 },
      { id: "s10", label: "结果", x: 74, y: 18 },
    ],
  },
};

const shuffle = (arr: Card[]) => {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

type Placed = { slotId: string; card: Card };

type Snapshot = {
  spreadKey: string;
  remaining: Card[];
  placed: Placed[];
};

export default function Tarot() {
  const [spreadKey, setSpreadKey] = useState("three");
  const [remaining, setRemaining] = useState<Card[]>(() => shuffle(DECK));
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [history, setHistory] = useState<Snapshot[]>([]);

  const spread = SPREADS[spreadKey];

  const nextEmptySlot = useMemo(() => {
    const used = new Set(placed.map((item) => item.slotId));
    return spread.slots.find((slot) => !used.has(slot.id)) || null;
  }, [placed, spread]);

  const updateHistory = () => {
    setHistory((prev) => {
      const next = prev.slice();
      next.push({
        spreadKey,
        remaining: remaining.slice(),
        placed: placed.map((item) => ({ ...item })),
      });
      return next.length > 50 ? next.slice(1) : next;
    });
  };

  const reset = () => {
    setRemaining(shuffle(DECK));
    setPlaced([]);
    setHistory([]);
  };

  const undo = () => {
    setHistory((prev) => {
      const next = prev.slice();
      const last = next.pop();
      if (last) {
        setSpreadKey(last.spreadKey);
        setRemaining(last.remaining.slice());
        setPlaced(last.placed.map((item) => ({ ...item })));
      }
      return next;
    });
  };

  const reshuffle = () => {
    updateHistory();
    setRemaining((prev) => shuffle(prev));
  };

  const draw = (index: number) => {
    if (!nextEmptySlot) return;
    if (!remaining.length) return;
    updateHistory();

    setRemaining((prev) => {
      const copy = prev.slice();
      const picked = copy.splice(index, 1)[0];
      setPlaced((prevPlaced) => [...prevPlaced, { slotId: nextEmptySlot.id, card: picked }]);
      return copy;
    });
  };

  const statusText = nextEmptySlot ? `下一张将落在「${nextEmptySlot.label}」` : "已抽满该排阵";

  const canUndo = history.length > 0;

  return (
    <div className="page">
      <style>{`
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }

        .toolbar select {
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid rgba(30, 26, 22, 0.1);
          background: #fff;
          font-family: inherit;
        }

        .toolbar .hint {
          font-size: 12px;
          color: var(--muted);
        }

        .table {
          position: relative;
          background: radial-gradient(circle at 30% 20%, #fff4ea 0%, transparent 45%),
            radial-gradient(circle at 80% 10%, #ffe7dc 0%, transparent 40%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6));
          border: 1px solid var(--line);
          border-radius: 24px;
          padding: 18px;
          min-height: 440px;
          overflow: hidden;
        }

        .table::before {
          content: "";
          position: absolute;
          inset: 12px;
          border-radius: 18px;
          border: 1px dashed rgba(30, 26, 22, 0.15);
          pointer-events: none;
        }

        .slot {
          position: absolute;
          width: 110px;
          height: 170px;
          transform: translate(-50%, -50%);
          border-radius: 16px;
          border: 1px solid rgba(30, 26, 22, 0.15);
          background: rgba(255, 255, 255, 0.65);
          display: grid;
          place-items: center;
        }

        .slot__label {
          font-size: 12px;
          color: var(--muted);
          text-align: center;
          padding: 0 10px;
        }

        .card {
          width: 110px;
          height: 170px;
          border-radius: 16px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.55s ease;
        }

        .card.is-flipped {
          transform: rotateY(180deg);
        }

        .card__face {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          backface-visibility: hidden;
          border: 1px solid rgba(30, 26, 22, 0.14);
          overflow: hidden;
        }

        .card__back {
          background: linear-gradient(135deg, #1e1a16, #3c2f27);
          color: rgba(255, 255, 255, 0.9);
          display: grid;
          place-items: center;
        }

        .card__back::before {
          content: "";
          position: absolute;
          inset: 10px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .card__back span {
          font-weight: 700;
          letter-spacing: 0.14em;
          font-size: 12px;
          z-index: 1;
        }

        .card__front {
          background: #fff;
          transform: rotateY(180deg);
          display: grid;
          grid-template-rows: auto 1fr;
        }

        .card__title {
          padding: 12px 12px 0;
          font-weight: 700;
          font-size: 12px;
          color: var(--text);
        }

        .card__desc {
          padding: 10px 12px 14px;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.4;
          display: grid;
          align-content: center;
        }

        .deck {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 10px 2px 2px;
          scroll-snap-type: x mandatory;
        }

        .deck::-webkit-scrollbar {
          height: 10px;
        }

        .deck::-webkit-scrollbar-thumb {
          background: rgba(30, 26, 22, 0.15);
          border-radius: 999px;
        }

        .deck-card {
          scroll-snap-align: start;
          flex: 0 0 auto;
          cursor: pointer;
        }

        .deck-card:active {
          transform: translateY(1px);
        }

        .empty {
          color: var(--muted);
          font-size: 13px;
        }

        @media (max-width: 640px) {
          .table {
            min-height: 520px;
          }
          .slot,
          .card {
            width: 96px;
            height: 150px;
          }
        }
      `}</style>

      <header className="topbar">
        <div className="brand">
          <span className="brand__dot"></span>
          <div>
            <p className="brand__name">ToolsHub</p>
            <p className="brand__tag">塔罗抽卡</p>
          </div>
        </div>
        <nav className="nav">
          <Link to="/">返回首页</Link>
          <a href="#table">桌面</a>
          <a href="#deck">牌库</a>
        </nav>
        <button className="ghost-btn" onClick={reset}>
          重置
        </button>
      </header>

      <main className="layout">
        <section className="hero">
          <div>
            <p className="eyebrow">娱乐 / 交互</p>
            <h1>点击牌背翻面并加入牌阵。</h1>
            <p className="hero__desc">支持单张、三张与凯尔特十字。所有操作在本地完成。</p>
          </div>
          <div className="hero__panel">
            <div className="panel__item">
              <p className="panel__label">当前排阵</p>
              <p className="panel__value">{spread.name}</p>
            </div>
            <div className="panel__item">
              <p className="panel__label">已抽</p>
              <p className="panel__value">{placed.length}</p>
            </div>
          </div>
        </section>

        <section className="tool-card">
          <div className="tool-card__head">
            <div className="tool-card__tags">
              <span className="badge">排阵</span>
              <span className="badge badge--alt">抽卡</span>
            </div>
          </div>
          <h3>控制面板</h3>
          <div className="toolbar">
            <label htmlFor="spreadSelect">选择排阵</label>
            <select
              id="spreadSelect"
              value={spreadKey}
              onChange={(event) => {
                setSpreadKey(event.target.value);
                reset();
              }}
            >
              <option value="three">三张（过去 / 现在 / 未来）</option>
              <option value="one">单张（指引）</option>
              <option value="celtic">凯尔特十字（10 张）</option>
            </select>
            <button className="secondary-btn" onClick={undo} disabled={!canUndo}>
              撤销
            </button>
            <button className="secondary-btn" onClick={reshuffle}>
              洗牌
            </button>
            <span className="hint">{statusText}</span>
          </div>
        </section>

        <section className="tool-card" id="table">
          <div className="tool-card__head">
            <div className="tool-card__tags">
              <span className="badge">桌面</span>
            </div>
          </div>
          <h3>牌阵区域</h3>
          <div className="table" id="tableArea">
            {spread.slots.map((slot) => {
              const current = placed.find((item) => item.slotId === slot.id);
              const baseStyle: React.CSSProperties = {
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                transform: `translate(-50%, -50%)${slot.rotate ? ` rotate(${slot.rotate}deg)` : ""}`,
              };

              if (!current) {
                return (
                  <div className="slot" key={slot.id} style={baseStyle}>
                    <div className="slot__label">{slot.label}</div>
                  </div>
                );
              }

              return (
                <div className="slot" key={slot.id} style={baseStyle}>
                  <div className={`card is-flipped${slot.rotate ? "" : ""}`}>
                    <div className="card__face card__back">
                      <span>TAROT</span>
                    </div>
                    <div className="card__face card__front">
                      <div className="card__title">{current.card.name}</div>
                      <div className="card__desc">{current.card.desc}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="tool-card" id="deck">
          <div className="tool-card__head">
            <div className="tool-card__tags">
              <span className="badge">牌库</span>
            </div>
          </div>
          <h3>浮动牌背（点击抽卡）</h3>
          <div className="deck" id="deckArea">
            {remaining.length === 0 ? (
              <div className="empty">牌库已抽完，可以撤销或重置。</div>
            ) : (
              remaining.slice(0, 12).map((card, index) => (
                <div className="deck-card" key={`${card.name}-${index}`} onClick={() => draw(index)}>
                  <div className="card">
                    <div className="card__face card__back">
                      <span>TAROT</span>
                    </div>
                    <div className="card__face card__front">
                      <div className="card__title">{card.name}</div>
                      <div className="card__desc">{card.desc}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <p className="hint">提示：每次点击会抽取一张随机牌并翻面落位。抽满后可撤销或重置。</p>
        </section>
      </main>

      <footer className="footer">
        <p>ToolsHub · 本地抽卡 · 可扩展牌义与更多排阵</p>
      </footer>
    </div>
  );
}
