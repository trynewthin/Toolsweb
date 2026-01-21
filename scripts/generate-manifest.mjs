import { promises as fs } from "fs";
import path from "path";

const ROOT = path.resolve(".");
const TOOLS_DIR = path.join(ROOT, "tools");
const OUT_FILE = path.join(ROOT, "assets", "manifest.json");

const META_PATTERN = /<!--\s*TOOL_META\s*(\{[\s\S]*?\})\s*-->/i;

const readFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isFile() && e.name.endsWith(".html"));
};

const extractMeta = async (filePath) => {
  const content = await fs.readFile(filePath, "utf8");
  const match = content.match(META_PATTERN);
  if (!match) return null;
  try {
    const json = JSON.parse(match[1]);
    const stat = await fs.stat(filePath);
    return { ...json, mtime: stat.mtimeMs };
  } catch (err) {
    console.error(`Meta parse failed for ${filePath}:`, err.message);
    return null;
  }
};

const main = async () => {
  await fs.mkdir(path.join(ROOT, "assets"), { recursive: true });
  const files = (await readFiles(TOOLS_DIR)).filter((f) => !f.name.startsWith("tool-template"));
  const tools = [];

  for (const file of files) {
    const filePath = path.join(TOOLS_DIR, file.name);
    const meta = await extractMeta(filePath);
    if (meta) tools.push(meta);
  }

  tools.sort((a, b) => (b.mtime || 0) - (a.mtime || 0));

  await fs.writeFile(OUT_FILE, JSON.stringify({ tools }, null, 2), "utf8");
  console.log(`Manifest generated: ${OUT_FILE} (${tools.length} tools)`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
