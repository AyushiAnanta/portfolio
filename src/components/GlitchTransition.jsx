import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/GlitchTransition.css"

gsap.registerPlugin(ScrollTrigger);

export default function GlitchTransition({ heroRef }) {
  const glitchRef = useRef();
  const firedRef = useRef(false);

  useEffect(() => {
    if (!heroRef?.current) return;

    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "bottom 80%",   // fires when bottom of hero hits 80% of viewport
      onEnter: () => {
        if (firedRef.current) return;
        firedRef.current = true;
        fireGlitch();
      },
      // Reset if they scroll back up to hero
      onLeaveBack: () => {
        firedRef.current = false;
      },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  const fireGlitch = () => {
    const el = glitchRef.current;
    if (!el) return;

    const tl = gsap.timeline();

    // Slam it visible
    tl.set(el, { display: "block", opacity: 1 })

      // RGB channel splits â€” move the pseudo layers via CSS vars
      .to(el, {
        "--glitch-x": "6px",
        "--glitch-r": "-4px",
        duration: 0.04,
        ease: "none",
      })
      .to(el, { "--glitch-x": "-5px", "--glitch-r": "5px", duration: 0.04 })
      .to(el, { "--glitch-x": "3px",  "--glitch-r": "-2px", duration: 0.03 })
      .to(el, { "--glitch-x": "0px",  "--glitch-r": "0px",  duration: 0.03 })

      // Flicker opacity
      .to(el, { opacity: 0.6, duration: 0.03 })
      .to(el, { opacity: 1,   duration: 0.03 })
      .to(el, { opacity: 0.3, duration: 0.02 })
      .to(el, { opacity: 1,   duration: 0.02 })

      // One more hard glitch burst
      .to(el, { "--glitch-x": "-8px", "--glitch-r": "8px", duration: 0.04 })
      .to(el, { "--glitch-x": "0px",  "--glitch-r": "0px", duration: 0.04 })

      // Flash white then slam off
      .to(el, { backgroundColor: "rgba(255,255,255,0.15)", duration: 0.05 })
      .to(el, { opacity: 0, duration: 0.15, ease: "power2.in" })
      .set(el, { display: "none", backgroundColor: "transparent" });
  };

  return (
    <div
      className="glitch-overlay"
      ref={glitchRef}
      style={{ display: "none" }}
    />
  );
}
