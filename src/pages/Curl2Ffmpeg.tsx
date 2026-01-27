import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useTools } from "../hooks/useTools";
import { toast } from "sonner";

export default function Curl2Ffmpeg() {
  const { recordVisit } = useTools();

  useEffect(() => {
    recordVisit("curl2ffmpeg");
  }, [recordVisit]);

  const [input, setInput] = useState("");
  const [proxy, setProxy] = useState("http://127.0.0.1:7890");
  const [output, setOutput] = useState("等待输入...");

  const handleConvert = () => {
    if (!input.trim()) {
      toast.error("请输入 cURL 内容");
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
    toast.success("指令已更新");
  };

  const handleCopy = () => {
    if (output === "等待输入..." || output === "请输入内容") {
      toast.warning("尚无有效内容可复制");
      return;
    }
    navigator.clipboard.writeText(output).then(() => {
      toast.success("已复制到剪贴板");
    });
  };

  const handleClear = () => {
    setInput("");
    setOutput("等待输入...");
    toast.info("已清空输入");
  };

  return (
    <Layout
      title="cURL 转 FFmpeg"
      tagline="cURL 转 FFmpeg"
      category="效率 / 开发"
      heroTitle="cURL 转 FFmpeg 指令生成器"
      heroDesc="自动提取 URL、Referer、Cookie 与 User-Agent，拼装为可直接使用的下载命令。"
      nav={[{ label: "工具面板", href: "#converter" }]}
      stats={[
        { label: "输入来源", value: "浏览器 cURL" },
        { label: "输出格式", value: "FFmpeg" },
      ]}
      actions={
        <div className="flex gap-3">
          <button className="secondary-btn" onClick={handleClear}>清空</button>
          <button className="primary-btn" onClick={handleCopy}>复制指令</button>
        </div>
      }
    >
      <style>{`
        .converter-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .converter-grid {
            grid-template-columns: 1fr;
            align-items: start;
          }
        }
        .tool-card {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .tool-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
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
          font-family: inherit;
        }
        .tool-form textarea {
          flex: 1;
          min-height: 320px;
          resize: vertical;
        }
        .tool-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin-top: auto;
        }
        .output-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
        }
        .output-area {
          background: #1e1a16;
          color: #f1efe9;
          padding: 24px;
          border-radius: 16px;
          position: relative;
          flex: 1;
          min-height: 280px;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
        }
        .output-area pre {
          white-space: pre-wrap;
          word-break: break-all;
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          font-family: "JetBrains Mono", "Space Mono", monospace;
        }
        .copy-overlay {
          position: absolute;
          top: 12px;
          right: 12px;
        }
        .hint {
          color: var(--muted);
          font-size: 13px;
          background: var(--bg-deep);
          padding: 12px;
          border-radius: 10px;
          border-left: 4px solid var(--accent);
          margin-top: auto;
        }
        .section-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 8px;
        }
      `}</style>

      <div className="converter-grid" id="converter">
        {/* 左侧：输入 */}
        <section className="tool-card">
          <div className="section-header">
            <h3>粘贴 cURL 命令</h3>
            <span className="badge">步骤 1</span>
          </div>
          <div className="tool-form">
            <textarea
              id="curlInput"
              placeholder="在这里粘贴从 Chrome 代码检查器复制的 cURL (bash) 命令..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
            ></textarea>

            <div className="tool-actions">
              <div style={{ flex: 1 }}>
                <label htmlFor="proxyInput" style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>本地代理地址</label>
                <input
                  type="text"
                  id="proxyInput"
                  placeholder="如 http://127.0.0.1:7890"
                  value={proxy}
                  onChange={(event) => setProxy(event.target.value)}
                />
              </div>
              <button
                className="primary-btn"
                onClick={handleConvert}
                style={{ alignSelf: 'flex-end', height: '44px' }}
              >
                立即转换 ⚡
              </button>
              <button
                className="secondary-btn"
                onClick={handleClear}
                style={{ alignSelf: 'flex-end', height: '44px' }}
              >
                清空
              </button>
            </div>
          </div>
        </section>

        {/* 右侧：输出 */}
        <section className="tool-card">
          <div className="section-header">
            <h3>FFmpeg 输出指令</h3>
            <span className="badge">步骤 2</span>
          </div>
          <div className="output-container">
            <div className="output-area">
              <div className="copy-overlay">
                <button className="ghost-btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none' }} onClick={handleCopy}>
                  点击复制
                </button>
              </div>
              <pre>{output}</pre>
            </div>
            <div className="hint">
              <strong>提示：</strong> 此转换器会自动识别并提取 URL 及关键请求头（UA/Referer/Cookie），并将其包装为 FFmpeg 兼容的参数。
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
