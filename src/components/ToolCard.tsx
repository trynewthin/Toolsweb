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
        <article className="card tool-card">
            <div className="tool-card__top">
                <div className="tool-card__tags">
                    {tool.tags.map((tag) => (
                        <span className="badge" key={tag}>{tag}</span>
                    ))}
                </div>
                <button
                    className={`btn--icon${isFavorite ? " is-active" : ""}`}
                    title={isFavorite ? "取消收藏" : "收藏"}
                    onClick={(e) => {
                        e.preventDefault();
                        onToggleFavorite(tool.id);
                    }}
                >
                    {isFavorite ? "★" : "☆"}
                </button>
            </div>
            <h3 className="tool-card__title">{tool.title}</h3>
            <p className="tool-card__desc">{tool.desc}</p>
            <Link
                className="tool-card__link"
                to={tool.path}
                onClick={() => onRecordVisit(tool.id)}
            >
                打开工具 <span>→</span>
            </Link>
        </article>
    );
}
