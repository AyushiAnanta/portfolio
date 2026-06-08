import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about, skills } from "../../data/content";
import "../../styles/About.css";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "9.93", label: "CGPA" },
  { value: "3+", label: "Projects Shipped" },
  { value: "700+", label: "Hackathon Applicants Beaten" },
  { value: "100+", label: "Students Mentored" },
];

export default function About() {
  const sectionRef = useRef();
  const tagRef = useRef();
  const line1Ref = useRef();
  const line2Ref = useRef();
  const line3Ref = useRef();
  const bioRef = useRef();
  const statsRef = useRef();
  const skillsRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(tagRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      )
      .fromTo(line1Ref.current,
        { opacity: 0, y: 60, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 0.8, ease: "power4.out" },
        "-=0.2"
      )
      .fromTo(line2Ref.current,
        { opacity: 0, y: 60, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 0.8, ease: "power4.out" },
        "-=0.5"
      )
      .fromTo(line3Ref.current,
        { opacity: 0, y: 60, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 0.8, ease: "power4.out" },
        "-=0.5"
      )
      .fromTo(bioRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        skillsRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        skillsRef.current.querySelectorAll(".terminal-category-col"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" },
        "-=0.4"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about" ref={sectionRef} id="about">
      <div className="about__inner">

        {/* Small tag label */}
        <p className="about__tag" ref={tagRef}>— the person behind the code</p>

        {/* Big chunky headline — 3 lines */}
        <div className="about__headline">
          <h2 ref={line1Ref}>obsessed with coffee & code.</h2>
          <h2 ref={line2Ref}>
            if your office offers both,
          </h2>
          <h2 ref={line3Ref}>
            <span className="about__highlight">hire me</span> please ;)
          </h2>
        </div>

        {/* Bio paragraph */}
        <p className="about__bio" ref={bioRef}>
          {about.bio}
        </p>

        

        {/* Single Terminal with All Skills */}
        <div className="about__skills-container">
          <h3 className="about__skills-title">Core Skills</h3>
          <div className="about__skills-terminal" ref={skillsRef}>
            <div className="terminal-header">
              <div className="terminal-buttons">
                <span className="btn-close"></span>
                <span className="btn-min"></span>
                <span className="btn-max"></span>
              </div>
              <div className="terminal-title">get-skills.sh</div>
            </div>
            <div className="terminal-body">
              <div className="terminal-command">
                <span className="terminal-prompt">~</span> ./get-skills.sh --all
              </div>

              <div className="terminal-grid">
                {Object.entries(skills).map(([category, items]) => (
                  <div className="terminal-category-col" key={category}>
                    <div className="terminal-category-header">[ {category.toUpperCase()} ]</div>
                    <div className="terminal-output-list">
                      {items.map((skill) => (
                        <div className="terminal-skill-item" key={skill}>
                          <span className="terminal-bullet">&gt;</span> {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="terminal-command mt-2">
                <span className="terminal-prompt">~</span> <span className="terminal-cursor"></span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}