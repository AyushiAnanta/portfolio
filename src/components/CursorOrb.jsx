import { useEffect, useRef } from "react";
import "../styles/CursorOrb.css";

export default function CursorOrb() {
  const orbRef = useRef();
  const trailRef = useRef();
  const pos = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef();

  useEffect(() => {
    const onMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const onMouseOver = (e) => {
      if (e.target && e.target.closest("a, button, .btn, [role='button']")) {
        orbRef.current?.classList.add("cursor-hover");
        trailRef.current?.classList.add("cursor-hover");
      } else {
        orbRef.current?.classList.remove("cursor-hover");
        trailRef.current?.classList.remove("cursor-hover");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onMouseOver);

    const loop = () => {
      // Smooth lerp so orb lags slightly behind cursor — feels alive
      current.current.x += (pos.current.x - current.current.x) * 0.12;
      current.current.y += (pos.current.y - current.current.y) * 0.12;

      if (orbRef.current) {
        orbRef.current.style.transform =
          `translate(${current.current.x - 10}px, ${current.current.y - 10}px)`;
      }
      // Trail is even lazier
      if (trailRef.current) {
        trailRef.current.style.transform =
          `translate(${current.current.x - 20}px, ${current.current.y - 20}px)`;
      }

      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Outer glow trail */}
      <div className="cursor-trail" ref={trailRef} />
      {/* Inner orb */}
      <div className="cursor-orb" ref={orbRef} />
    </>
  );
}