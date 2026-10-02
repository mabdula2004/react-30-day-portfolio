import { ArrowDownRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero shell" id="top">
      <div className="hero-kicker"><span className="status-dot" /> Available for opportunities <Sparkles size={14} /></div>
      <div className="hero-grid">
        <div>
          <p className="micro-label">FULL-STACK DEVELOPER • PAKISTAN</p>
          <h1>I build digital products that feel <em>clear, fast</em> and human.</h1>
        </div>
        <div className="hero-side">
          <p>Computer Science student building modern web and mobile experiences with React, React Native, Supabase and AI.</p>
          <a href="#work" className="circle-link" aria-label="Explore selected work"><ArrowDownRight size={25} /></a>
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="visual-card card-a"><span>01</span><strong>WEB</strong></div>
        <div className="visual-card card-b"><span>02</span><strong>MOBILE</strong></div>
        <div className="visual-card card-c"><span>03</span><strong>AI</strong></div>
        <div className="visual-orbit"><span>BUILD</span><span>LEARN</span><span>SHIP</span></div>
      </div>
    </section>
  );
}
