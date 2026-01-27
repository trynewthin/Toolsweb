import { Link } from "react-router-dom";
import type { ToolItem } from "../types/tool";

interface ToolCardProps {
    tool: ToolItem;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
    onRecordVisit: (id: string) => void;
}

export function ToolCard({ tool, isFavorite, onToggleFavorite, onRecordVisit }: ToolCardProps) {
    return (
        <article className="tool-card">
            <div className="tool-card__head">
                <div className="tool-card__tags">
                    {tool.tags.map((tag) => (
                        <span className="badge" key={tag}>
                            {tag}
                        </span>
                    ))}
                </div>
                <button
                    className={`fav-btn${isFavorite ? " active" : ""}`}
                    title="收藏"
                    onClick={(e) => {
                        e.preventDefault();
                        onToggleFavorite(tool.id);
                    }}
                >
                    ★
                </button>
            </div>
            <h3>{tool.title}</h3>
            <p>{tool.desc}</p>
            <Link
                className="card-link"
                to={tool.path}
                onClick={() => onRecordVisit(tool.id)}
            >
                打开工具 →
            </Link>
        </article>
    );
}
