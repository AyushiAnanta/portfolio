import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { arcadeGames } from "../../data/content";
import "../../styles/ArcadeZone.css";

gsap.registerPlugin(ScrollTrigger);

// Build the repeated reel array to allow smooth infinite-feeling spin
const REEL = [];
for (let i = 0; i < 8; i++) {
  arcadeGames.forEach((g) => REEL.push(g));
}
const ITEM_H = 80;


export default function ArcadeZone() {
  const sectionRef = useRef();
  const titleRef = useRef();
  const introRef = useRef();
  const reelsRef = useRef([]);
  const reelsOffset = useRef([0, 0, 0]);

  const [tokens, setTokens] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [statusText, setStatusText] = useState("INSERT TOKENS & SPIN SELECTOR");
  const [statusColor, setStatusColor] = useState("var(--text-muted)");

  // Interactive Fidget States
  const [leverPulled, setLeverPulled] = useState(false);
  const [isCoinDropping, setIsCoinDropping] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, sectionRef);

    // Initial positioning of reels to center index 0
    reelsRef.current.forEach((el) => {
      if (el) el.style.transform = `translateY(${ITEM_H}px)`;
    });

    return () => ctx.revert();
  }, []);

  const addTokens = () => {
    if (spinning || isCoinDropping) return;
    setIsCoinDropping(true);

    // Trigger visual coin drop, then increment tokens
    setTimeout(() => {
      setIsCoinDropping(false);
      setTokens((t) => t + 5);
      if (!spinning) {
        setStatusText("SELECT GAME TO LAUNCH");
        setStatusColor("var(--text-muted)");
      }
    }, 600);
  };

  const doSpin = () => {
    if (spinning) return;
    if (tokens <= 0) {
      setStatusText("OUT OF TOKENS");
      setStatusColor("var(--accent)");
      return;
    }

    setTokens((t) => t - 1);
    setSpinning(true);
    setSelectedGame(null);
    setStatusText("SHUFFLING ARCHIVE...");
    setStatusColor("var(--purple-light)");

    // Synchronize to land on the same game symbol (Jackpot style!)
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
          duration: 1.5 + ri * 0.3, // Exactly 300ms stagger!
          ease: "back.out(1.2)", // Rubber band bounce and settle ease
          onComplete: () => {
            reelsOffset.current[ri] = targetOffset % totalH;
            // Highlight target item inside the column
            const items = reelEl.children;
            for (let i = 0; i < items.length; i++) {
              const imgEl = items[i].querySelector(".arcade-cabinet__reel-img");
              const nameEl = items[i].querySelector(".arcade-cabinet__reel-name");
              const isTarget = i % arcadeGames.length === targets[ri] % arcadeGames.length;
              if (imgEl) {
                imgEl.style.boxShadow = isTarget ? `0 0 10px ${arcadeGames[targets[ri] % arcadeGames.length].color}66` : "";
                imgEl.style.borderColor = isTarget ? arcadeGames[targets[ri] % arcadeGames.length].color : "";
              }
              if (nameEl) {
                nameEl.style.color = isTarget ? "#fff" : "var(--text-muted)";
              }
            }

            completed++;
            if (completed === 3) {
              setSpinning(false);
              const loadedGame = arcadeGames[targets[1]];
              setSelectedGame(loadedGame);
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
    setTimeout(() => {
      setLeverPulled(false);
    }, 400); // Springs back after 400ms
  };

  return (
    <section className="arcade" ref={sectionRef} id="arcade">
      <div className="arcade__inner">
        <p className="arcade__tag">— interactive zone</p>
        <h2 className="arcade__title" ref={titleRef}>Arcade Zone</h2>
        <p className="arcade__intro" ref={introRef}>
          These are games that I built initially in my journey that helped me in logic building and sparked my interest in this field.
        </p>

        {/* Curved Glass Arcade Cabinet */}
        <div className="arcade-cabinet">
          {/* Cabinet Top Header */}
          <div className="arcade-cabinet__top">
            <div className="marquee-led led-left" />
            <div className="arcade-cabinet__marquee">
              <div className="arcade-cabinet__marquee-glowing-title">GAME ZONE</div>
              <div className="arcade-cabinet__marquee-subtitle">
                INSERT TOKEN · SHUFFLE INDEX
              </div>
            </div>
            <div className="marquee-led led-right" />
          </div>

          {/* Cabinet Screen */}
          <div className="arcade-cabinet__screen">
            {/* Subtle Screen Scanline/CRT overlay */}
            <div className="arcade-cabinet__crt-overlay" />
            
            {/* Screen Header */}
            <div className="arcade-cabinet__screen-header">
              <div className="arcade-cabinet__sys-status">SYS://GAME_SHUFFLE</div>
              <div className="arcade-cabinet__credits">
                TOKENS: {String(tokens).padStart(2, "0")}
              </div>
            </div>

            {/* Cabinet Reels Slot */}
            <div className="arcade-cabinet__reels-wrapper">
              <div className="arcade-cabinet__reels-box">
                {/* Center target cursor guide */}
                <div
                  className="arcade-cabinet__indicator"
                  style={{
                    borderColor: selectedGame ? `${selectedGame.color}99` : "rgba(255,255,255,0.06)",
                    boxShadow: selectedGame
                      ? `0 0 20px ${selectedGame.color}22, inset 0 0 20px ${selectedGame.color}05`
                      : "none",
                  }}
                />

                {[0, 1, 2].map((ri) => (
                  <div className="arcade-cabinet__reel-col" key={ri}>
                    <div className="arcade-cabinet__reel-fade" />
                    <div
                      className="arcade-cabinet__reel-inner"
                      ref={(el) => (reelsRef.current[ri] = el)}
                    >
                      {REEL.map((g, idx) => (
                        <div className="arcade-cabinet__reel-item" key={idx}>
                          <img
                            src={g.image}
                            alt={g.name}
                            className="arcade-cabinet__reel-img"
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "6px",
                              border: `1.5px solid ${g.color}33`,
                              objectFit: "cover"
                            }}
                          />
                          <div className="arcade-cabinet__reel-name">{g.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Result Screen */}
            <div className="arcade-cabinet__result-area">
              {!selectedGame ? (
                <div
                  className="arcade-cabinet__status-text"
                  style={{ color: statusColor }}
                >
                  {statusText}
                </div>
              ) : (
                <div
                  className="arcade-cabinet__result-panel"
                  style={{
                    background: `${selectedGame.color}05`,
                    border: `1px solid ${selectedGame.color}22`,
                  }}
                >
                  <img
                    src={selectedGame.image}
                    alt={selectedGame.name}
                    className="arcade-cabinet__result-preview"
                  />
                  <div className="arcade-cabinet__result-info">
                    <div
                      className="arcade-cabinet__result-tag"
                      style={{ color: selectedGame.color }}
                    >
                      // INDEX LOADED
                    </div>
                    <div className="arcade-cabinet__result-title">
                      {selectedGame.name}
                    </div>
                    <div className="arcade-cabinet__result-desc">
                      {selectedGame.desc}
                    </div>
                  </div>
                  <a
                    href={selectedGame.play}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--ghost arcade-cabinet__result-play-btn"
                    style={{
                      borderColor: `${selectedGame.color}66`,
                      color: selectedGame.color,
                    }}
                  >
                    PLAY GAME →
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Integrated All Games Row */}
          <div className="arcade-cabinet__all-games">
            <div className="arcade-cabinet__all-games-title">ALL PROJECTS</div>
            <div className="arcade-cabinet__games-grid">
              {arcadeGames.map((g) => (
                <a
                  href={g.play}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="arcade-cabinet__game-link"
                  key={g.name}
                >
                  <span
                    className="arcade-cabinet__game-dot"
                    style={{
                      backgroundColor: g.color,
                      boxShadow: `0 0 8px ${g.color}`
                    }}
                  />
                  <img
                    src={g.image}
                    alt={g.name}
                    className="arcade-cabinet__game-thumb"
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      border: `1px solid ${g.color}33`,
                      objectFit: "cover"
                    }}
                  />
                  <div className="arcade-cabinet__game-text">
                    <div className="arcade-cabinet__game-name">{g.name}</div>
                    <div className="arcade-cabinet__game-tag">{g.tag}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Interactive Console Deck (Fidgets Area) */}
          <div className="arcade-cabinet__deck">
            {/* Left: Tactile Coin Slot */}
            <div className="arcade-cabinet__coin-wrapper">
              <div 
                className={`arcade-cabinet__coin-slot ${isCoinDropping ? "dropping" : ""}`}
                onClick={addTokens}
              >
                {/* Floating Token animation */}
                <div className="arcade-cabinet__falling-coin">🪙</div>
                <div className="arcade-cabinet__slot-glowing-opening" />
              </div>
              <div className="arcade-cabinet__control-label">+INSERT COIN</div>
            </div>

            {/* Center: Glowing Dome Push Button */}
            <div className="arcade-cabinet__button-wrapper">
              <button
                className={`arcade-cabinet__dome-btn ${spinning ? "pressed" : ""}`}
                onClick={doSpin}
                disabled={spinning}
              >
                SPIN
              </button>
              <div className="arcade-cabinet__control-label">LAUNCH</div>
            </div>

            {/* Right: Spring-loaded 3D Pull Lever */}
            <div className="arcade-cabinet__lever-wrapper">
              <div 
                className={`arcade-cabinet__lever ${leverPulled ? "pulled" : ""}`}
                onClick={handleLeverPull}
              >
                <div className="arcade-cabinet__lever-base" />
                <div className="arcade-cabinet__lever-shaft">
                  <div className="arcade-cabinet__lever-ball" />
                </div>
              </div>
              <div className="arcade-cabinet__control-label">PULL LEVER</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

