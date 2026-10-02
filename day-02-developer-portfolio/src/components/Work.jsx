import ProjectCard from "./ProjectCard";
import { projects } from "../data/portfolio";

export default function Work() {
  return (
    <section className="section shell" id="work">
      <div className="section-heading">
        <div><span className="section-index">01</span><p>SELECTED WORK</p></div>
        <h2>Projects built around <em>real problems</em>, not just screens.</h2>
      </div>
      <div className="projects-grid">{projects.map((project) => <ProjectCard project={project} key={project.number} />)}</div>
    </section>
  );
}
