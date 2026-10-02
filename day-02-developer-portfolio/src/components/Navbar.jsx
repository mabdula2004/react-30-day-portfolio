import { ArrowUpRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ theme, onToggleTheme }) {
  return (
    <header className="navbar shell">
      <a className="logo" href="#top" aria-label="Muhammad Abdullah home">MA<span>.</span></a>
      <nav className="nav-links" aria-label="Main navigation">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#experience">Experience</a>
      </nav>
      <div className="nav-actions">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <a className="contact-link" href="#contact">Let’s talk <ArrowUpRight size={15} /></a>
      </div>
    </header>
  );
}
