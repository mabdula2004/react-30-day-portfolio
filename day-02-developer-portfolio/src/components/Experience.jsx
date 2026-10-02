import { experience } from "../data/portfolio";

export default function Experience() {
  return (
    <section className="section experience shell" id="experience">
      <div className="section-heading compact">
        <div><span className="section-index">03</span><p>JOURNEY</p></div>
        <h2>Learning through <em>building</em>.</h2>
      </div>
      <div className="timeline">
        {experience.map((item) => (
          <article className="timeline-row" key={item.year}>
            <span className="timeline-year">{item.year}</span><h3>{item.title}</h3><p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
