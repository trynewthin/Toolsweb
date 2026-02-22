import { type ReactNode } from "react";
import { Link } from "react-router-dom";

interface AppShellProps {
    children: ReactNode;
    /** Extra elements in the topbar right area */
    topbarExtra?: ReactNode;
}

/**
 * Global application shell: sticky topbar + page container.
 * Every page renders inside this shell.
 */
export default function AppShell({ children, topbarExtra }: AppShellProps) {
    return (
        <>
            <header className="topbar">
                <Link to="/" className="topbar__brand">
                    <span className="topbar__dot" />
                    <span>ToolsHub</span>
                </Link>

                <nav className="topbar__nav">
                    {topbarExtra}
                    <Link to="/" className="topbar__link">首页</Link>
                </nav>
            </header>

            <main className="page-container">
                {children}
            </main>
        </>
    );
}
