import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { arcadeGames } from "../../data/content";
import "../../styles/ArcadeZone.css";

gsap.registerPlugin(ScrollTrigger);

const REEL = [];
for (let i = 0; i < 8; i++) arcadeGames.forEach((g) => REEL.push(g));
const ITEM_H = 110;

export default function ArcadeZone() {
  const sectionRef = useRef();
  const titleRef = useRef();
  const introRef = useRef();
  const cabinetRef = useRef();
  const controlsRef = useRef();
  const dockRef = useRef();
  const reelsRef = useRef([]);
  const reelsOffset = useRef([0, 0, 0]);

  const [credits, setCredits] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [statusText, setStatusText] = useState("INSERT COIN & PULL LEVER");
  const [statusColor, setStatusColor] = useState("var(--text-muted)");
  const [leverPulled, setLeverPulled] = useState(false);
  const [isCoinDropping, setIsCoinDropping] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title + intro
      gsap.fromTo(
        [titleRef.current, introRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      // Cabinet entrance — scale up + rise
      const cabTl = gsap.timeline({
        scrollTrigger: { trigger: cabinetRef.current, start: "top 85%", toggleActions: "play none none reverse" },
      });
      cabTl.fromTo(cabinetRef.current,
        { opacity: 0, scale: 0.92, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      // Controls deck fades in 150ms after
      cabTl.fromTo(controlsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.65"
      );
      // Dock chips stagger in
      if (dockRef.current) {
        cabTl.fromTo(dockRef.current.children,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power3.out" },
          "-=0.35"
        );
      }
    }, sectionRef);

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
      if (!spinning) { setStatusText("READY — PULL LEVER OR SPIN"); setStatusColor("var(--text-muted)"); }
    }, 600);
  };

  const doSpin = () => {
    if (spinning) return;
    if (credits <= 0) { setStatusText("OUT OF CREDITS"); setStatusColor("var(--accent)"); return; }
    setCredits((c) => c - 1);
    setSpinning(true);
    setSelectedGame(null);
    setStatusText("SPINNING...");
    setStatusColor("var(--purple-light)");

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

      gsap.fromTo(reelEl,
        { y: -startOffset + ITEM_H },
        {
          y: -targetOffset + ITEM_H,
          duration: 1.5 + ri * 0.3,
          ease: "back.out(1.2)",
          onComplete: () => {
            reelsOffset.current[ri] = targetOffset % totalH;
            const items = reelEl.children;
            const game = arcadeGames[targets[ri] % arcadeGames.length];
            for (let i = 0; i < items.length; i++) {
              const isTarget = i % arcadeGames.length === targets[ri] % arcadeGames.length;
              items[i].style.boxShadow = isTarget ? `0 0 18px ${game.color}55, inset 0 0 10px ${game.color}15` : "";
              items[i].style.borderColor = isTarget ? game.color : "";
            }
            completed++;
            if (completed === 3) { setSpinning(false); setSelectedGame(arcadeGames[targets[1]]); }
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

        {/* ═══ 3D CABINET SCENE ═══ */}
        <div className="cab-scene">
          <div className="cab-3d" ref={cabinetRef}>

            {/* ── MARQUEE ARCH ── */}
            <div className="cab-arch">
              <div className="cab-arch__glow" />
              <div className="cab-arch__led cab-arch__led--l" />
              <div className="cab-arch__led cab-arch__led--r" />
              <div className="cab-arch__led cab-arch__led--l2" />
              <div className="cab-arch__led cab-arch__led--r2" />
              <span className="cab-arch__title">GAME ZONE</span>
            </div>

            {/* ── CABINET BODY ── */}
            <div className="cab-body">
              {/* 3D side faces */}
              <div className="cab-side cab-side--left" />
              <div className="cab-side cab-side--right" />
              {/* Specular highlight stripe */}
              <div className="cab-body__specular" />

              {/* ── SCREEN BEZEL ── */}
              <div className="cab-screen">
                <div className="cab-screen__crt" />
                <div className="cab-screen__header">
                  <span className="cab-screen__sys">SYS://GAME_SELECT</span>
                  <span className={`cab-screen__credits ${credits <= 2 ? "cab-screen__credits--low" : ""}`}>
                    CREDITS: {String(credits).padStart(2, "0")}
                  </span>
                </div>

                {/* ── REELS ── */}
                <div className="cab-reels">
                  <span className="cab-reels__arrow cab-reels__arrow--l">◀</span>
                  <div className="cab-reels__row">
                    <div
                      className="cab-reels__highlight"
                      style={{
                        borderColor: selectedGame ? `${selectedGame.color}aa` : "rgba(255,255,255,0.06)",
                        boxShadow: selectedGame ? `0 0 20px ${selectedGame.color}44, inset 0 0 20px ${selectedGame.color}0a` : "none",
                      }}
                    />
                    {[0, 1, 2].map((ri) => (
                      <div className="cab-reels__col" key={ri}>
                        <div className="cab-reels__fade" />
                        <div className="cab-reels__strip" ref={(el) => (reelsRef.current[ri] = el)}>
                          {REEL.map((g, idx) => (
                            <div className="cab-reels__card" key={idx} style={{ borderColor: `${g.color}12` }}>
                              <div className="cab-reels__glow" style={{ boxShadow: `0 0 14px ${g.color}30` }} />
                              <img src={g.image} alt={g.name} className="cab-reels__icon" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <span className="cab-reels__arrow cab-reels__arrow--r">▶</span>
                </div>
              </div>

              {/* ── RESULT PANEL ── */}
              <div className="cab-result">
                {!selectedGame ? (
                  <div className="cab-result__status" style={{ color: statusColor }}>{statusText}</div>
                ) : (
                  <div className="cab-result__card" style={{ borderColor: `${selectedGame.color}33`, background: `${selectedGame.color}08` }}>
                    <img src={selectedGame.image} alt={selectedGame.name} className="cab-result__img" />
                    <div className="cab-result__info">
                      <div className="cab-result__name">{selectedGame.name}</div>
                      <div className="cab-result__desc">{selectedGame.desc}</div>
                    </div>
                    <a href={selectedGame.play} target="_blank" rel="noopener noreferrer" className="cab-result__play" style={{ borderColor: `${selectedGame.color}66`, color: selectedGame.color }}>
                      PLAY →
                    </a>
                  </div>
                )}
              </div>

              {/* ── CONTROLS DECK ── */}
              <div className="cab-controls" ref={controlsRef}>
                {/* Coin Slot */}
                <div className="cab-ctrl">
                  <div className={`cab-coin ${isCoinDropping ? "dropping" : ""}`} onClick={addCredits}>
                    <div className="cab-coin__emoji">🪙</div>
                    <div className="cab-coin__slit"><div className="cab-coin__line" /><div className="cab-coin__line" /></div>
                  </div>
                  <span className="cab-ctrl__label">INSERT COIN</span>
                </div>
                {/* SPIN */}
                <div className="cab-ctrl">
                  <button className={`cab-spin ${spinning ? "cab-spin--pressed" : ""}`} onClick={doSpin} disabled={spinning}>SPIN</button>
                  <span className="cab-ctrl__label">SPIN</span>
                </div>
                {/* Lever */}
                <div className="cab-ctrl">
                  <div className={`cab-lever ${leverPulled ? "cab-lever--pulled" : ""}`} onClick={handleLeverPull}>
                    <div className="cab-lever__base" />
                    <div className="cab-lever__shaft"><div className="cab-lever__ball" /></div>
                  </div>
                  <span className="cab-ctrl__label">PULL</span>
                </div>
              </div>
            </div>

            {/* ── BASE PEDESTAL ── */}
            <div className="cab-base">
              <div className="cab-dock" ref={dockRef}>
                {arcadeGames.map((g) => (
                  <a href={g.play} target="_blank" rel="noopener noreferrer" className="cab-dock__chip" key={g.name}>
                    <img src={g.image} alt={g.name} className="cab-dock__img" style={{ border: `2px solid ${g.color}44` }} />
                    <span className="cab-dock__name">{g.name}</span>
                    <span className="cab-dock__dot" style={{ backgroundColor: g.color, boxShadow: `0 0 8px ${g.color}` }} />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
