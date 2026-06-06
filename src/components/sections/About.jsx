import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
        statsRef.current.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about" ref={sectionRef} id="about">
      <div className="about__inner">

        {/* Small tag label */}
        <p className="about__tag" ref={tagRef}>— about me</p>

        {/* Big chunky headline — 3 lines */}
        <div className="about__headline">
          <h2 ref={line1Ref}>I'm a builder.</h2>
          <h2 ref={line2Ref}>
            I make things that{" "}
            <span className="about__highlight">think</span>,
          </h2>
          <h2 ref={line3Ref}>
            things that{" "}
            <span className="about__highlight--blue">ship</span>.
          </h2>
        </div>

        {/* Bio paragraph */}
        <p className="about__bio" ref={bioRef}>
          CS undergrad at NIIT University (CGPA 9.93) obsessed with building
          at the intersection of web and AI. From multilingual grievance
          platforms to LLM-powered detective games — I like my projects to
          actually do something. National finalist at CyberForHer (EY &amp; DSCI),
          selected from 700+ applicants.
        </p>

        {/* Stats row */}
        <div className="about__stats" ref={statsRef}>
          {stats.map((s) => (
            <div className="about__stat" key={s.label}>
              <span className="about__stat-value">{s.value}</span>
              <span className="about__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}