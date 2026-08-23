import { useEffect, useRef } from "react";
import "../styles/CursorOrb.css";

export default function CursorOrb() {
  const cursorRef = useRef();
  const lastTouchTime = useRef(0);

  useEffect(() => {
    const onMove = (e) => {
      // Ignore touch-emulated mouse events
      if (Date.now() - lastTouchTime.current < 1000) {
        return;
      }

      if (cursorRef.current) {
        cursorRef.current.classList.remove("cursor-hidden");
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onMouseDown = () => {
      if (Date.now() - lastTouchTime.current < 1000) {
        return;
      }
      cursorRef.current?.classList.add("cursor-active");
    };

    const onMouseUp = () => {
      cursorRef.current?.classList.remove("cursor-active");
    };

    const onTouchStart = () => {
      lastTouchTime.current = Date.now();
      cursorRef.current?.classList.add("cursor-hidden");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  return (
    <div className="pixel-cursor" ref={cursorRef}>
      <svg
        viewBox="0 0 16 22"
        width="20"
        height="28"
        className="pixel-cursor__svg"
      >
        {/* Drop Shadow */}
        <g fill="rgba(0,0,0,0.4)">
          <rect x="2" y="2" width="2" height="18" />
          <rect x="4" y="4" width="2" height="14" />
          <rect x="6" y="6" width="2" height="12" />
          <rect x="8" y="8" width="2" height="10" />
          <rect x="10" y="10" width="2" height="6" />
          <rect x="12" y="12" width="2" height="3" />
          <rect x="8" y="18" width="2" height="4" />
          <rect x="10" y="20" width="2" height="2" />
        </g>
        {/* Dark Pixel Border */}
        <g fill="#0b0b1a">
          <rect x="0" y="0" width="2" height="18" />
          <rect x="2" y="0" width="2" height="2" />
          <rect x="2" y="16" width="2" height="2" />
          <rect x="4" y="2" width="2" height="2" />
          <rect x="4" y="14" width="2" height="2" />
          <rect x="6" y="4" width="2" height="2" />
          <rect x="6" y="12" width="4" height="2" />
          <rect x="8" y="6" width="2" height="2" />
          <rect x="6" y="14" width="2" height="4" />
          <rect x="8" y="18" width="2" height="4" />
          <rect x="10" y="8" width="2" height="2" />
          <rect x="10" y="18" width="2" height="2" />
          <rect x="12" y="10" width="2" height="2" />
          <rect x="12" y="14" width="2" height="4" />
          <rect x="14" y="12" width="2" height="2" />
        </g>
        {/* Main Purple Pixel Body */}
        <g fill="#c084fc">
          <rect x="2" y="2" width="2" height="14" />
          <rect x="4" y="4" width="2" height="10" />
          <rect x="6" y="6" width="2" height="6" />
          <rect x="8" y="8" width="2" height="4" />
          <rect x="10" y="10" width="2" height="2" />
          <rect x="12" y="12" width="2" height="2" />
          <rect x="8" y="14" width="2" height="4" />
          <rect x="10" y="16" width="2" height="2" />
        </g>
        {/* White Accent Highlights */}
        <g fill="#ffffff">
          <rect x="2" y="2" width="2" height="10" />
          <rect x="4" y="4" width="2" height="6" />
          <rect x="6" y="6" width="2" height="2" />
        </g>
      </svg>
    </div>
  );
}