import { useState } from "react";
import { Link } from "react-router-dom";

export default function Curl2Ffmpeg() {
  const [input, setInput] = useState("");
  const [proxy, setProxy] = useState("http://127.0.0.1:7890");
  const [output, setOutput] = useState("等待输入...");

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput("请输入内容");
      return;
    }

    const urlMatch = input.match(/(https?:\/\/\S+)/);
    const url = urlMatch ? urlMatch[1].replace(/["']$/, "") : "未找到URL";

    const getHeader = (name: string) => {
      const regex = new RegExp(`-H ['"]${name}:\\s*([^'"]+)['"]`, "i");
      const match = input.match(regex);
      return match ? match[1] : null;
    };

    const ua = getHeader("User-Agent") || "Mozilla/5.0";
    const referer = getHeader("Referer");
    const cookie = getHeader("Cookie");

    let ffmpeg = `ffmpeg -user_agent "${ua}" `;
    if (referer) ffmpeg += `-headers "Referer: ${referer}" `;
    if (cookie) ffmpeg += `-headers "Cookie: ${cookie}" `;
    if (proxy) ffmpeg += `-http_proxy "${proxy}" `;

    ffmpeg += `-i "${url}" -c copy -bsf:a aac_adtstoasc "output_${Date.now()}.mp4"`;
    setOutput(ffmpeg);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      alert("已复制到剪贴板");
    });
  };

  return (
    <div className="page">
      <style>{`
        .tool-form {
          display: grid;
          gap: 16px;
        }
        .tool-form label {
          font-weight: 600;
        }
        .tool-form textarea,
        .tool-form input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(30, 26, 22, 0.1);
          font-family: "Space Grotesk", "Epilogue", sans-serif;
        }
        .tool-form textarea {
          min-height: 180px;
          resize: vertical;
        }
        .tool-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }
        .output-area {
          background: #1e1a16;
          color: #f1efe9;
          padding: 18px;
          border-radius: 16px;
          position: relative;
        }
        .output-area pre {
          white-space: pre-wrap;
          word-break: break-all;
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
        }
        .copy-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 6px 12px;
          border-radius: 999px;
          border: none;
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
          cursor: pointer;
          font-size: 12px;
        }
        .hint {
          color: var(--muted);
          font-size: 12px;
        }
      `}</style>

      <header className="topbar">
        <div className="brand">
          <span className="brand__dot"></span>
          <div>
            <p className="brand__name">ToolsHub</p>
            <p className="brand__tag">cURL 转 FFmpeg</p>
          </div>
        </div>
        <nav className="nav">
          <Link to="/">返回首页</Link>
          <a href="#converter">工具区</a>
        </nav>
        <button className="ghost-btn" onClick={handleCopy}>
          复制指令
        </button>
      </header>

      <main className="layout">
        <section className="hero">
          <div>
            <p className="eyebrow">效率 / 开发</p>
            <h1>cURL 转 FFmpeg 指令生成器</h1>
            <p className="hero__desc">自动提取 URL、Referer、Cookie 与 User-Agent，拼装为可直接使用的下载命令。</p>
          </div>
          <div className="hero__panel">
            <div className="panel__item">
              <p className="panel__label">输入来源</p>
              <p className="panel__value">浏览器 cURL</p>
            </div>
            <div className="panel__item">
              <p className="panel__label">输出</p>
              <p className="panel__value">FFmpeg</p>
            </div>
          </div>
        </section>

        <section className="tool-card" id="converter">
          <div className="tool-card__head">
            <span className="badge">步骤 1</span>
          </div>
          <h3>粘贴 cURL 命令</h3>
          <div className="tool-form">
            <label htmlFor="curlInput">从浏览器复制的 cURL 命令</label>
            <textarea
              id="curlInput"
              placeholder="curl 'https://...' -H 'User-Agent: ...' ..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
            ></textarea>
            <div className="tool-actions">
              <label htmlFor="proxyInput">本地代理地址</label>
              <input
                type="text"
                id="proxyInput"
                value={proxy}
                onChange={(event) => setProxy(event.target.value)}
              />
              <button className="primary-btn" onClick={handleConvert}>
                立即转换
              </button>
            </div>
          </div>
        </section>

        <section className="tool-card">
          <div className="tool-card__head">
            <span className="badge">步骤 2</span>
          </div>
          <h3>FFmpeg 输出指令</h3>
          <div className="output-area">
            <button className="copy-btn" onClick={handleCopy}>
              复制指令
            </button>
            <pre>{output}</pre>
          </div>
          <p className="hint">提示：此工具会自动提取 URL、Referer、Cookie 和 User-Agent，并移除多余的 Header 以保证指令简洁。</p>
        </section>
      </main>

      <footer className="footer">
        <p>ToolsHub · 快速生成可用指令</p>
      </footer>
    </div>
  );
}
