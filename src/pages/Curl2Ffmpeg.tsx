import { useState, useEffect } from "react";
import AppShell from "../components/AppShell";
import { useTools } from "../hooks/useTools";
import { toast } from "sonner";

export default function Curl2Ffmpeg() {
  const { recordVisit } = useTools();
  useEffect(() => { recordVisit("curl2ffmpeg"); }, [recordVisit]);

  const [input, setInput] = useState("");
  const [proxy, setProxy] = useState("http://127.0.0.1:7890");
  const [output, setOutput] = useState("");

  const handleConvert = () => {
    if (!input.trim()) {
      toast.error("请输入 cURL 内容");
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
    toast.success("指令已生成");
  };

  const handleCopy = () => {
    if (!output) {
      toast.warning("尚无指令可复制");
      return;
    }
    navigator.clipboard.writeText(output).then(() => toast.success("已复制到剪贴板"));
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    toast.info("已清空");
  };

  return (
    <AppShell>
      {/* Tool Header */}
      <div className="tool-header">
        <div className="tool-header__left">
          <h1 className="tool-header__title">cURL → FFmpeg</h1>
          <span className="badge">效率</span>
          <span className="badge">开发</span>
        </div>
        <div className="tool-header__actions">
          <button className="btn btn--secondary" onClick={handleClear}>清空</button>
          <button className="btn btn--primary" onClick={handleConvert}>转换 ⚡</button>
          <button className="btn btn--secondary" onClick={handleCopy}>复制指令</button>
        </div>
      </div>

      {/* Workspace */}
      <div className="workspace">
        {/* Input Panel */}
        <div className="workspace__panel">
          <div className="workspace__panel-head">
            <span className="workspace__panel-title">输入 cURL</span>
          </div>
          <textarea
            id="curlInput"
            className="textarea"
            style={{ minHeight: 360 }}
            placeholder="粘贴从浏览器 DevTools 复制的 cURL (bash) 命令..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex items-center gap-sm">
            <label className="text-sm text-muted" htmlFor="proxyInput">代理</label>
            <input
              type="text"
              id="proxyInput"
              className="input"
              placeholder="如 http://127.0.0.1:7890"
              value={proxy}
              onChange={(e) => setProxy(e.target.value)}
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="workspace__panel">
          <div className="workspace__panel-head">
            <span className="workspace__panel-title">FFmpeg 输出</span>
            <div className="workspace__panel-actions">
              <button className="btn btn--ghost" onClick={handleCopy}>复制</button>
            </div>
          </div>
          <div className="code-block" style={{ minHeight: 360 }}>
            <pre>{output || "转换后的 FFmpeg 指令将在此处显示..."}</pre>
          </div>
          <p className="hint-bar">
            自动提取 URL、Referer、Cookie、User-Agent 并拼装为 FFmpeg 参数
          </p>
        </div>
      </div>
    </AppShell>
  );
}
