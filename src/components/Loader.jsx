import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../styles/Loader.css";

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);
  const textRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.();
      },
    });

    // Animate line in, then name, then slide the whole loader up & out
    tl.fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(textRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.3"
    )
    .to({}, { duration: 0.6 }) // hold
    .to(loaderRef.current, {
      yPercent: -100,
      duration: 1,
      ease: "power4.inOut",
    });
  }, []);

  return (
    <div className="loader" ref={loaderRef}>
      <div className="loader__inner">
        <div className="loader__line" ref={lineRef} />
        <p className="loader__text" ref={textRef}>Ayushi Ananta</p>
      </div>
    </div>
  );
}
