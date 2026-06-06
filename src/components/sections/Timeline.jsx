import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience, education, achievements } from "../../data/content";
import "../../styles/Timeline.css";

gsap.registerPlugin(ScrollTrigger);

export default function Timeline() {
  const sectionRef = useRef();
  const titleRef = useRef();
  const contentRef = useRef();

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
        contentRef.current.querySelectorAll(".timeline__group, .timeline__achievements"),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="timeline-section" ref={sectionRef} id="timeline">
      <div className="timeline-section__inner">
        <p className="timeline-section__tag">— history</p>
        <h2 className="timeline-section__title" ref={titleRef}>Education & Experience</h2>

        <div className="timeline__container" ref={contentRef}>
          {/* Main Dual Timelines Grid */}
          <div className="timeline__grid">
            
            {/* Experience Column */}
            <div className="timeline__group">
              <h3 className="timeline__group-title">Work Experience</h3>
              <div className="timeline__list">
                {experience.map((exp, idx) => (
                  <div className="timeline-item" key={idx}>
                    <div className="timeline-item__node" />
                    <div className="timeline-item__card">
                      <div className="timeline-item__header">
                        <div className="timeline-item__title-box">
                          <h4 className="timeline-item__title">{exp.role}</h4>
                          <span className="timeline-item__company">{exp.company}</span>
                        </div>
                        <span className="timeline-item__date">{exp.duration}</span>
                      </div>
                      {exp.type && <span className="timeline-item__badge">{exp.type}</span>}
                      <ul className="timeline-item__bullets">
                        {exp.bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Column */}
            <div className="timeline__group">
              <h3 className="timeline__group-title">Education</h3>
              <div className="timeline__list">
                {education.map((edu, idx) => (
                  <div className="timeline-item" key={idx}>
                    <div className="timeline-item__node timeline-item__node--blue" />
                    <div className="timeline-item__card">
                      <div className="timeline-item__header">
                        <div className="timeline-item__title-box">
                          <h4 className="timeline-item__title">{edu.degree}</h4>
                          <span className="timeline-item__company">{edu.institution}</span>
                        </div>
                        <span className="timeline-item__date">{edu.duration}</span>
                      </div>
                      <div className="timeline-item__grade-container">
                        <span className="timeline-item__grade-label">Grade / Score:</span>
                        <span className="timeline-item__grade-val">{edu.grade}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Achievements Grid Row */}
          <div className="timeline__achievements">
            <h3 className="timeline__achievements-title">Achievements & Leadership</h3>
            <div className="timeline__achievements-grid">
              {achievements.map((ach, idx) => (
                <div className="achievement-card" key={idx}>
                  <span className="achievement-card__year">{ach.year}</span>
                  <h4 className="achievement-card__title">{ach.title}</h4>
                  <p className="achievement-card__desc">{ach.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
