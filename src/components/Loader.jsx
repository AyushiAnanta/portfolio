import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../styles/Loader.css";

export default function Loader({ isReady, onComplete }) {
  const loaderRef = useRef(null);
  const textRef = useRef(null);
  const lineRef = useRef(null);
  const introDoneRef = useRef(false);
  const exitStartedRef = useRef(false);
  const isReadyRef = useRef(isReady);

  // Keep ref up to date with latest isReady prop
  isReadyRef.current = isReady;

  const triggerExit = () => {
    if (exitStartedRef.current) return;
    exitStartedRef.current = true;

    gsap.to(loaderRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: "power4.inOut",
      onComplete: () => {
        onComplete?.();
      },
    });
  };

  useEffect(() => {
    // Animate line in, then name text in
    const introTl = gsap.timeline({
      onComplete: () => {
        introDoneRef.current = true;
        // Check fresh value of isReady from ref!
        if (isReadyRef.current) {
          triggerExit();
        }
      },
    });

    introTl
      .fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(
        textRef.current,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.3"
      );

    // Fallback safety timeout (max 5s) so page is never permanently stuck
    const safetyTimer = setTimeout(() => {
      triggerExit();
    }, 5000);

    return () => {
      introTl.kill();
      clearTimeout(safetyTimer);
    };
  }, []);

  // When isReady becomes true after intro animation has finished
  useEffect(() => {
    if (isReady && introDoneRef.current) {
      triggerExit();
    }
  }, [isReady]);

  return (
    <div className="loader" ref={loaderRef}>
      <div className="loader__inner">
        <div className="loader__line" ref={lineRef} />
        <p className="loader__text" ref={textRef}>Ayushi Ananta</p>
      </div>
    </div>
  );
}
