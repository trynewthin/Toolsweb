import { type ReactNode } from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
    children: ReactNode;
    title: string;
    tagline?: string;
    category?: string;
    heroTitle: string;
    heroDesc: string;
    stats?: Array<{ label: string; value: string | number }>;
    nav?: Array<{ label: string; href: string }>;
    actions?: ReactNode;
}

export default function Layout({
    children,
    title,
    tagline,
    category,
    heroTitle,
    heroDesc,
    stats,
    nav,
    actions,
}: LayoutProps) {
    return (
        <div className="page">
            <header className="topbar">
                <div className="brand">
                    <span className="brand__dot"></span>
                    <div>
                        <p className="brand__name">ToolsHub</p>
                        <p className="brand__tag">{tagline || "轻量 · 快速 · 可扩展"}</p>
                    </div>
                </div>
                <nav className="nav">
                    <Link to="/">首页</Link>
                    {nav?.map((item) => (
                        <a key={item.href} href={item.href}>
                            {item.label}
                        </a>
                    ))}
                </nav>
                {actions || <button className="ghost-btn">提交新工具</button>}
            </header>

            <main className="layout">
                <section className="hero">
                    <div>
                        {category && <p className="eyebrow">{category}</p>}
                        <h1>{heroTitle}</h1>
                        <p className="hero__desc">{heroDesc}</p>
                    </div>
                    {stats && (
                        <div className="hero__panel">
                            {stats.map((stat, index) => (
                                <div key={index} className="panel__item">
                                    <p className="panel__label">{stat.label}</p>
                                    <p className="panel__value">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {children}
            </main>

            <footer className="footer">
                <p>ToolsHub · {title} · 快速搭建 · 持续扩展</p>
            </footer>
        </div>
    );
}
