import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CharacterScene from "../Character/CharacterScene";
import { hero } from "../../data/content";
import "../../styles/Landing.css";

gsap.registerPlugin(ScrollTrigger);

const engName = ["A", "y", "u", "s", "h", "i", " ", "A", "n", "a", "n", "t", "a"];
const mappingHin = ["आ", "यु", "यु", "षी", "षी", "षी ", " ", "अ", "न", "अ", "न", "ता", " ता"];

function Letter({ eng, hin }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className={`landing__name-letter ${isHovered ? "is-hindi" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? hin : eng}
    </span>
  );
}

export default function Landing({ heroRef }) {
  const contentRef = useRef();
  const canvasRef = useRef();

  // --- Entry animations (same as before) ---
  const greetRef = useRef();
  const nameRef = useRef();
  const taglineRef = useRef();
  const subRef = useRef();
  const ctaRef = useRef();

  useEffect(() => {
    // Entry stagger
    const entryTl = gsap.timeline({ delay: 2.2 });
    entryTl
      .fromTo(greetRef.current,
        { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .fromTo(nameRef.current,
        { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.2")
      .fromTo(taglineRef.current,
        { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.2")
      .fromTo(subRef.current,
        { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.2")
      .fromTo(ctaRef.current,
        { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.1");

    // --- Zoom-out scroll effect ---
    const ctx = gsap.context(() => {
      // Text side â€” shrinks + fades as you scroll
      gsap.to(contentRef.current, {
        scale: 0.75,
        opacity: 0,
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,           // ties directly to scroll position
        },
      });

      // Canvas/model side â€” zooms out slightly slower for depth
      gsap.to(canvasRef.current, {
        scale: 0.85,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,         // slightly lazier than text
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="landing" ref={heroRef} id="home">
      {/* Text content */}
      <div className="landing__text" ref={contentRef}>
        <p className="landing__greeting" ref={greetRef}>{hero.greeting}</p>
        <h1 className="landing__name" ref={nameRef}>
          {engName.map((char, index) => {
            if (char === " ") {
              return <span key={index} className="landing__name-space">&nbsp;</span>;
            }
            return (
              <Letter
                key={index}
                eng={char}
                hin={mappingHin[index]}
              />
            );
          })}
        </h1>
        <h2 className="landing__tagline" ref={taglineRef}>{hero.tagline}</h2>
        <p className="landing__sub" ref={subRef}>{hero.sub}</p>
        <div className="landing__cta" ref={ctaRef}>
          <a href="#about" className="btn btn--primary">See my work</a>
          <a href="#contact" className="btn btn--ghost">Get in touch</a>
        </div>
      </div>

      {/* 3D model */}
      <div className="landing__canvas" ref={canvasRef}>
        <CharacterScene />
      </div>

      
    </section>
  );
}
