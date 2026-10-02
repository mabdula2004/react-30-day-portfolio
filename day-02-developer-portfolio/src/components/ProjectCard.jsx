import { ArrowUpRight } from "lucide-react";

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-topline"><span>{project.number}</span><span>{project.type}</span></div>
      <div className="project-art" aria-hidden="true"><div className="art-window"><div /><div /><div /></div><span>{project.title}</span></div>
      <div className="project-copy">
        <div><h3>{project.title}</h3><p>{project.description}</p></div>
        <button className="project-arrow" type="button" aria-label={`View ${project.title}`}><ArrowUpRight size={20} /></button>
      </div>
      <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
    </article>
  );
}
