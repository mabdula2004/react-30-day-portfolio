import { skills } from "../data/portfolio";

export default function About() {
  return (
    <section className="section about shell" id="about">
      <div className="section-heading compact">
        <div><span className="section-index">02</span><p>ABOUT</p></div>
        <h2>Curious by default. <em>Practical</em> by choice.</h2>
      </div>
      <div className="about-grid">
        <p className="about-lead">I enjoy turning ideas into usable products — from interface systems and mobile experiences to AI-powered workflows.</p>
        <div className="about-copy"><p>My focus is becoming a strong full-stack developer by pairing solid frontend fundamentals with databases, APIs and practical backend services.</p><p>I care about clean structure, thoughtful details and understanding why the code works — not just making it work.</p></div>
      </div>
      <div className="skills-marquee" aria-label="Technology skills">{skills.map((skill) => <span key={skill}>{skill}<i>✦</i></span>)}</div>
    </section>
  );
}
