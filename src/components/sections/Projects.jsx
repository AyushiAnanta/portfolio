import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data/content";
import { FaGithub, FaExternalLinkAlt, FaStar, FaEye, FaCodeBranch, FaFolder } from "react-icons/fa";
import "../../styles/Projects.css";

const getProjectStats = (name) => {
  const stats = {
    "Sahayak": { star: 24, fork: 5, watch: 3 },
    "AI Imposter": { star: 42, fork: 12, watch: 6 },
    "oopsTube": { star: 18, fork: 3, watch: 2 }
  };
  return stats[name] || { star: 0, fork: 0, watch: 0 };
};

const getProjectLanguage = (name) => {
  const langs = {
    "Sahayak": { name: "Python", color: "#3572A5" },
    "AI Imposter": { name: "JavaScript", color: "#f1e05a" },
    "oopsTube": { name: "JavaScript", color: "#f1e05a" }
  };
  return langs[name] || { name: "HTML/CSS", color: "#e34c26" };
};

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef();
  const titleRef = useRef();
  const gridRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      ).fromTo(
        gridRef.current.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="projects" ref={sectionRef} id="projects">
      <div className="projects__inner">
        <p className="projects__tag">— things I've actually shipped</p>
        <h2 className="projects__title" ref={titleRef}>Featured Projects</h2>

        <div className="projects__grid" ref={gridRef}>
          {projects.map((p) => {
            const stats = getProjectStats(p.name);
            const lang = getProjectLanguage(p.name);
            return (
              <div className="project-repo-card" key={p.name}>
                <div className="project-repo-card__top">
                  <div className="project-repo-card__repo-info">
                    <FaFolder className="project-repo-card__repo-icon" />
                    <span className="project-repo-card__owner">AyushiAnanta</span>
                    <span className="project-repo-card__separator">/</span>
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-repo-card__name"
                    >
                      {p.name}
                    </a>
                  </div>
                  <div className="project-repo-card__stats">
                    <div className="project-repo-card__stat-btn" title="Watchers">
                      <FaEye />
                      <span>Watch</span>
                      <span className="project-repo-card__stat-count">{stats.watch}</span>
                    </div>
                    <div className="project-repo-card__stat-btn" title="Stars">
                      <FaStar />
                      <span>Star</span>
                      <span className="project-repo-card__stat-count">{stats.star}</span>
                    </div>
                    <div className="project-repo-card__stat-btn" title="Forks">
                      <FaCodeBranch />
                      <span>Fork</span>
                      <span className="project-repo-card__stat-count">{stats.fork}</span>
                    </div>
                  </div>
                </div>

                <div className="project-repo-card__body">
                  <p className="project-repo-card__subtitle">{p.subtitle}</p>
                  <p className="project-repo-card__desc">{p.desc}</p>

                  <ul className="project-repo-card__bullets">
                    {p.bullets.map((bullet, idx) => (
                      <li key={idx}>
                        <span className="bullet-icon">⚡</span>
                        <span className="bullet-text">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="project-repo-card__footer">
                  <div className="project-repo-card__meta">
                    <div className="project-repo-card__lang">
                      <span
                        className="project-repo-card__lang-dot"
                        style={{ backgroundColor: lang.color }}
                      ></span>
                      <span className="project-repo-card__lang-name">{lang.name}</span>
                    </div>
                    <div className="project-repo-card__tags">
                      {p.tags.map((tag) => (
                        <span className="project-repo-card__tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="project-repo-card__links">
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-repo-card__link-btn"
                        aria-label={`${p.name} GitHub Repository`}
                      >
                        <FaGithub /> GitHub
                      </a>
                    )}
                    {p.demo && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-repo-card__link-btn demo-btn"
                        aria-label={`${p.name} Live Demo`}
                      >
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
