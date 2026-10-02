import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Work from "./components/Work";
import About from "./components/About";
import Experience from "./components/Experience";
import Contact from "./components/Contact";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("portfolio-theme") || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  return (
    <>
      <Navbar theme={theme} onToggleTheme={() => setTheme((current) => current === "light" ? "dark" : "light")} />
      <Hero />
      <Work />
      <About />
      <Experience />
      <Contact />
    </>
  );
}
