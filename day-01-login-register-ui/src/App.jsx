import { CheckCircle2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import AuthPanel from "./components/AuthPanel";
import ThemeToggle from "./components/ThemeToggle";

const benefits = [
  "A focused workspace for your daily projects",
  "Fast, clean and distraction-free collaboration",
  "Responsive experience across desktop and mobile"
];

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("nexa-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("nexa-theme", theme);
  }, [theme]);

  return (
    <main className="page-shell">
      <header className="topbar">
        <a href="#" className="brand">
          <span className="brand-mark">N</span>
          <span>Nexa</span>
        </a>

        <ThemeToggle
          theme={theme}
          onToggle={() =>
            setTheme((value) => (value === "light" ? "dark" : "light"))
          }
        />
      </header>

      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />
      <div className="grid-overlay" />

      <section className="auth-layout">
        <div className="story-panel">
          <div className="story-content">
            <div className="status-pill">
              <Sparkles size={15} />
              Built for focused teams
            </div>

            <h2>Turn your next idea into something people can use.</h2>

            <p>
              A polished authentication experience with modern responsive UI
              patterns, clear hierarchy, accessible controls, and light/dark themes.
            </p>

            <div className="benefit-list">
              {benefits.map((benefit) => (
                <div className="benefit-item" key={benefit}>
                  <CheckCircle2 size={18} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mini-proof">
              <div className="avatar-stack">
                <span>MA</span><span>AK</span><span>ZS</span>
              </div>
              <div>
                <strong>12.4k+</strong>
                <span>makers building with Nexa</span>
              </div>
            </div>
          </div>
        </div>

        <AuthPanel />
      </section>
    </main>
  );
}