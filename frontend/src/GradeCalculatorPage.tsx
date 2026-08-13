import { Link } from "react-router-dom";
import GradeCalculator from "./components/GradeCalculator/GradeCalculator";

export default function GradeCalculatorPage({ theme, onToggleTheme }: { theme: string; onToggleTheme: () => void }) {
  return (
    <main className="site site-wrapper">
      <header className="site-header scrolled">
        <div className="header-inner">
          <Link to="/" className="brand-lockup" style={{ textDecoration: "none" }}>
            <div className="brand-copy">
              <strong>LITAM</strong>
              <small>Loyola Institute of Technology &amp; Management</small>
            </div>
          </Link>
          <div className="header-actions">
            <Link to="/" className="nav-list" style={{ marginRight: "20px", textDecoration: "none", fontWeight: "bold", color: "var(--text)" }}>
              &larr; Back to Home
            </Link>
            <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <div className="sun-icon theme-icon" /> : <div className="moon-icon theme-icon" />}
            </button>
          </div>
        </div>
      </header>
      <section style={{ paddingTop: "110px" }}>
        <GradeCalculator />
      </section>
    </main>
  );
}
