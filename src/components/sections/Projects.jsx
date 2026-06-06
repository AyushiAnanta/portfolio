import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data/content";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import "../../styles/Projects.css";

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
          {projects.map((p) => (
            <div className="project-card" key={p.name}>
              <div className="project-card__header">
                <div className="project-card__title-group">
                  <h3 className="project-card__title">{p.name}</h3>
                  <p className="project-card__subtitle">{p.subtitle}</p>
                </div>
                <div className="project-card__links">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card__link"
                      aria-label={`${p.name} GitHub Repository`}
                    >
                      <FaGithub />
                    </a>
                  )}
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card__link"
                      aria-label={`${p.name} Live Demo`}
                    >
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>

              <p className="project-card__desc">{p.desc}</p>

              <ul className="project-card__bullets">
                {p.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>

              <div className="project-card__tags">
                {p.tags.map((tag) => (
                  <span className="project-card__tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
