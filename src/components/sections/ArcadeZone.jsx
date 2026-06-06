import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { arcadeGames } from "../../data/content";
import "../../styles/ArcadeZone.css";

gsap.registerPlugin(ScrollTrigger);

// Build repeated reel array for smooth infinite-feeling spin
const REEL = [];
for (let i = 0; i < 8; i++) {
  arcadeGames.forEach((g) => REEL.push(g));
}
const ITEM_H = 100; // taller items for glassmorphic cards

export default function ArcadeZone() {
  const sectionRef = useRef();
  const titleRef = useRef();
  const introRef = useRef();
  const cabinetRef = useRef();
  const reelsRef = useRef([]);
  const reelsOffset = useRef([0, 0, 0]);

  const [credits, setCredits] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [statusText, setStatusText] = useState("INSERT COIN & PULL LEVER");
  const [statusColor, setStatusColor] = useState("var(--text-muted)");

  // Interactive fidget states
  const [leverPulled, setLeverPulled] = useState(false);
  const [isCoinDropping, setIsCoinDropping] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title + intro entrance
      gsap.fromTo(
        [titleRef.current, introRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Cabinet entrance — fade + rise from bottom
      gsap.fromTo(
        cabinetRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cabinetRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    // Initial reel positioning
    reelsRef.current.forEach((el) => {
      if (el) el.style.transform = `translateY(${ITEM_H}px)`;
    });

    return () => ctx.revert();
  }, []);

  const addCredits = () => {
    if (spinning || isCoinDropping) return;
    setIsCoinDropping(true);
    setTimeout(() => {
      setIsCoinDropping(false);
      setCredits((c) => c + 5);
      if (!spinning) {
        setStatusText("READY — PULL LEVER OR SPIN");
        setStatusColor("var(--text-muted)");
      }
    }, 600);
  };

  const doSpin = () => {
    if (spinning) return;
    if (credits <= 0) {
      setStatusText("OUT OF CREDITS");
      setStatusColor("var(--accent)");
      return;
    }

    setCredits((c) => c - 1);
    setSpinning(true);
    setSelectedGame(null);
    setStatusText("SPINNING...");
    setStatusColor("var(--purple-light)");

    // Jackpot sync — all three land on the same game
    const targetIndex = Math.floor(Math.random() * arcadeGames.length);
    const targets = [targetIndex, targetIndex, targetIndex];
    const spins = 4;
    let completed = 0;

    [0, 1, 2].forEach((ri) => {
      const reelEl = reelsRef.current[ri];
      if (!reelEl) return;

      const totalH = arcadeGames.length * ITEM_H;
      const targetOffset = (spins * arcadeGames.length + targets[ri]) * ITEM_H;
      const startOffset = reelsOffset.current[ri];
      const startY = -startOffset + ITEM_H;
      const targetY = -targetOffset + ITEM_H;

      gsap.fromTo(
        reelEl,
        { y: startY },
        {
          y: targetY,
          duration: 1.5 + ri * 0.3, // 300ms stagger: 1.5s, 1.8s, 2.1s
          ease: "back.out(1.2)",
          onComplete: () => {
            reelsOffset.current[ri] = targetOffset % totalH;

            // Apply neon highlight frame to settled target items
            const items = reelEl.children;
            const game = arcadeGames[targets[ri] % arcadeGames.length];
            for (let i = 0; i < items.length; i++) {
              const card = items[i];
              const isTarget = i % arcadeGames.length === targets[ri] % arcadeGames.length;
              if (isTarget) {
                card.style.boxShadow = `0 0 16px ${game.color}44, inset 0 0 8px ${game.color}11`;
                card.style.borderColor = game.color;
              } else {
                card.style.boxShadow = "";
                card.style.borderColor = "";
              }
            }

            completed++;
            if (completed === 3) {
              setSpinning(false);
              setSelectedGame(arcadeGames[targets[1]]);
            }
          },
        }
      );
    });
  };

  const handleLeverPull = () => {
    if (spinning) return;
    setLeverPulled(true);
    doSpin();
    setTimeout(() => setLeverPulled(false), 400);
  };

  return (
    <section className="arcade" ref={sectionRef} id="arcade">
      <div className="arcade__inner">
        <p className="arcade__tag">— interactive zone</p>
        <h2 className="arcade__title" ref={titleRef}>Arcade Zone</h2>
        <p className="arcade__intro" ref={introRef}>
          A collection of early builds from the start of my coding journey — these simple projects
          laid the foundation for my logic building and ignited my passion for software engineering.
        </p>

        {/* ═══ ARCADE CABINET ═══ */}
        <div className="arcade-cabinet" ref={cabinetRef}>

          {/* ── 1. MARQUEE ARCH ── */}
          <div className="cabinet__marquee">
            <div className="cabinet__marquee-glow" />
            <div className="marquee-led marquee-led--left" />
            <div className="cabinet__marquee-text">GAME ZONE</div>
            <div className="marquee-led marquee-led--right" />
          </div>

          {/* ── 2. SCREEN BEZEL ── */}
          <div className="cabinet__screen">
            <div className="cabinet__crt-overlay" />

            {/* Screen header row */}
            <div className="cabinet__screen-header">
              <span className="cabinet__sys-label">SYS://GAME_SELECT</span>
              <span className={`cabinet__credits ${credits <= 2 ? "cabinet__credits--low" : ""}`}>
                CREDITS: {String(credits).padStart(2, "0")}
              </span>
            </div>

            {/* ── 3. THREE VERTICAL REELS ── */}
            <div className="cabinet__reels-viewport">
              <div className="cabinet__reels-row">
                {/* Center highlight frame */}
                <div
                  className="cabinet__reel-highlight"
                  style={{
                    borderColor: selectedGame ? `${selectedGame.color}99` : "rgba(255,255,255,0.06)",
                    boxShadow: selectedGame
                      ? `0 0 24px ${selectedGame.color}33, inset 0 0 24px ${selectedGame.color}08`
                      : "none",
                  }}
                />

                {[0, 1, 2].map((ri) => (
                  <div className="cabinet__reel-col" key={ri}>
                    <div className="cabinet__reel-fade" />
                    <div
                      className="cabinet__reel-strip"
                      ref={(el) => (reelsRef.current[ri] = el)}
                    >
                      {REEL.map((g, idx) => (
                        <div
                          className="cabinet__reel-card"
                          key={idx}
                          style={{ borderColor: `${g.color}15` }}
                        >
                          <div
                            className="cabinet__reel-glow-ring"
                            style={{ boxShadow: `0 0 12px ${g.color}33` }}
                          />
                          <img
                            src={g.image}
                            alt={g.name}
                            className="cabinet__reel-icon"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 4. PHYSICAL CONTROLS BAR ── */}
          <div className="cabinet__controls">

            {/* Coin Slot */}
            <div className="cabinet__ctrl-group">
              <div
                className={`cabinet__coin-slot ${isCoinDropping ? "dropping" : ""}`}
                onClick={addCredits}
              >
                <div className="cabinet__coin-emoji">🪙</div>
                <div className="cabinet__coin-slit">
                  <div className="cabinet__coin-slit-line" />
                  <div className="cabinet__coin-slit-line" />
                </div>
              </div>
              <span className="cabinet__ctrl-label">INSERT COIN</span>
            </div>

            {/* SPIN Dome Button */}
            <div className="cabinet__ctrl-group">
              <button
                className={`cabinet__dome-btn ${spinning ? "cabinet__dome-btn--pressed" : ""}`}
                onClick={doSpin}
                disabled={spinning}
              >
                SPIN
              </button>
              <span className="cabinet__ctrl-label">SPIN</span>
            </div>

            {/* Lever */}
            <div className="cabinet__ctrl-group">
              <div
                className={`cabinet__lever ${leverPulled ? "cabinet__lever--pulled" : ""}`}
                onClick={handleLeverPull}
              >
                <div className="cabinet__lever-base" />
                <div className="cabinet__lever-shaft">
                  <div className="cabinet__lever-ball" />
                </div>
              </div>
              <span className="cabinet__ctrl-label">PULL</span>
            </div>
          </div>

          {/* ── 5. RESULT PANEL ── */}
          <div className="cabinet__result-area">
            {!selectedGame ? (
              <div className="cabinet__status" style={{ color: statusColor }}>
                {statusText}
              </div>
            ) : (
              <div
                className="cabinet__result-card"
                style={{
                  borderColor: `${selectedGame.color}33`,
                  background: `${selectedGame.color}08`,
                }}
              >
                <img
                  src={selectedGame.image}
                  alt={selectedGame.name}
                  className="cabinet__result-img"
                />
                <div className="cabinet__result-info">
                  <div className="cabinet__result-name">{selectedGame.name}</div>
                  <div className="cabinet__result-desc">{selectedGame.desc}</div>
                </div>
                <a
                  href={selectedGame.play}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cabinet__result-play"
                  style={{
                    borderColor: `${selectedGame.color}66`,
                    color: selectedGame.color,
                  }}
                >
                  PLAY →
                </a>
              </div>
            )}
          </div>

          {/* ── 6. ALL GAMES ROW ── */}
          <div className="cabinet__all-games">
            <div className="cabinet__all-games-label">ALL GAMES</div>
            <div className="cabinet__all-games-row">
              {arcadeGames.map((g) => (
                <a
                  href={g.play}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cabinet__game-chip"
                  key={g.name}
                >
                  <img
                    src={g.image}
                    alt={g.name}
                    className="cabinet__game-chip-img"
                    style={{ border: `2px solid ${g.color}44` }}
                  />
                  <span className="cabinet__game-chip-name">{g.name}</span>
                  <span
                    className="cabinet__game-chip-dot"
                    style={{
                      backgroundColor: g.color,
                      boxShadow: `0 0 6px ${g.color}`,
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
