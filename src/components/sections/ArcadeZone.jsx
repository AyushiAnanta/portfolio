import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { arcadeGames } from "../../data/content";
import { FaGithub, FaPlay, FaVolumeUp, FaVolumeMute, FaDice } from "react-icons/fa";
import "../../styles/ArcadeZone.css";

gsap.registerPlugin(ScrollTrigger);

// ── Web Audio API 8-Bit Retro Sound Synthesizer ──
let audioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function play8BitSound(type, soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === "coin") {
      // 8-bit Coin chime (B5 -> E6)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "tick") {
      // Reel tick / mechanical click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(420 + Math.random() * 250, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === "lever") {
      // Mechanical lever clunk
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.18);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === "win") {
      // 8-bit Victory fanfare arpeggio (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.12, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.18);
      });
    } else if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(750, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch {
    // Fallback if audio permissions blocked
  }
}

function resolveImgUrl(path) {
  if (!path) return "";
  const base = import.meta.env.BASE_URL || "/";
  if (path.startsWith("/")) {
    return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }
  return path;
}

const getReelDimensions = () => {
  const width = typeof window !== "undefined" ? window.innerWidth : 1024;
  if (width <= 480) {
    return { itemH: 96, centerOffset: 67 };
  } else if (width <= 768) {
    return { itemH: 108, centerOffset: 76 };
  } else {
    return { itemH: 126, centerOffset: 87 };
  }
};

const REEL = [];
for (let i = 0; i < 8; i++) arcadeGames.forEach((g) => REEL.push(g));

const MARQUEE_LEDS = Array.from({ length: 12 });

export default function ArcadeZone() {
  const sectionRef   = useRef();
  const tagRef       = useRef();
  const titleRef     = useRef();
  const introRef     = useRef();
  const hudRef       = useRef();
  const cabinetRef   = useRef();
  const controlsRef  = useRef();
  const reelsRef     = useRef([]);
  const reelsOffset  = useRef([0, 0, 0]);
  const gamesGridRef = useRef();

  const [score,         setScore]         = useState(450);
  const [highScore,     setHighScore]     = useState(9990);
  const [credits,       setCredits]       = useState(10);
  const [streak,        setStreak]        = useState(0);
  const [soundEnabled,  setSoundEnabled]  = useState(true);
  const [spinning,      setSpinning]      = useState(false);
  const [selectedGame,  setSelectedGame]  = useState(arcadeGames[0]);
  const [statusText,    setStatusText]    = useState("READY TO PLAY // PULL LEVER TO SPIN");
  const [statusColor,   setStatusColor]   = useState("var(--arcade-green)");
  const [leverPulled,   setLeverPulled]   = useState(false);
  const [isCoinDropping,setIsCoinDropping]= useState(false);
  const [scorePopup,    setScorePopup]    = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [tagRef.current, titleRef.current, introRef.current, hudRef.current],
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

      const cabTl = gsap.timeline({
        scrollTrigger: {
          trigger: cabinetRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      cabTl.fromTo(
        cabinetRef.current,
        { opacity: 0, scale: 0.92, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.1)" }
      );
      cabTl.fromTo(
        controlsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.6"
      );

      gsap.fromTo(
        gamesGridRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gamesGridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    // Initialise reel strip positions (jumbled and centered)
    const { itemH, centerOffset } = getReelDimensions();
    const initialTargets = [0, 1, 2];
    reelsRef.current.forEach((el, ri) => {
      if (el) {
        const startOffset = initialTargets[ri] * itemH;
        el.style.transform = `translateY(${centerOffset - startOffset}px)`;
        reelsOffset.current[ri] = initialTargets[ri];
      }
    });

    const handleResize = () => {
      const { itemH, centerOffset } = getReelDimensions();
      reelsRef.current.forEach((el, ri) => {
        if (el) {
          const startOffset = reelsOffset.current[ri] * itemH;
          el.style.transform = `translateY(${centerOffset - startOffset}px)`;
        }
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const addCredits = useCallback(() => {
    if (spinning || isCoinDropping) return;
    play8BitSound("coin", soundEnabled);
    setIsCoinDropping(true);
    setTimeout(() => {
      setIsCoinDropping(false);
      setCredits((c) => c + 5);
      setScore((s) => s + 20);
      if (!spinning) {
        setStatusText("READY — PULL LEVER OR PRESS SPIN");
        setStatusColor("var(--arcade-green)");
      }
    }, 550);
  }, [spinning, isCoinDropping, soundEnabled]);

  const doSpin = useCallback(() => {
    if (spinning) return;
    if (credits <= 0) {
      play8BitSound("click", soundEnabled);
      setStatusText("OUT OF CREDITS — INSERT COIN!");
      setStatusColor("var(--arcade-pink)");
      return;
    }

    play8BitSound("lever", soundEnabled);
    setCredits((c) => c - 1);
    setScore((s) => s + 50);
    setSpinning(true);
    setSelectedGame(null);
    setStatusText("SPINNING REELS...");
    setStatusColor("var(--arcade-cyan)");

    // Periodic reel tick sound while spinning
    const tickInterval = setInterval(() => {
      play8BitSound("tick", soundEnabled);
    }, 120);

    const targetIndex = Math.floor(Math.random() * arcadeGames.length);
    const targets = [targetIndex, targetIndex, targetIndex];
    const spins = 4;
    let completed = 0;

    const { itemH, centerOffset } = getReelDimensions();

    [0, 1, 2].forEach((ri) => {
      const reelEl = reelsRef.current[ri];
      if (!reelEl) return;

      const targetSymbolIndex = targets[ri];
      const startSymbolIndex = reelsOffset.current[ri];

      const startOffset  = startSymbolIndex * itemH;
      const targetOffset = (spins * arcadeGames.length + targetSymbolIndex) * itemH;

      gsap.fromTo(
        reelEl,
        { y: -startOffset + centerOffset },
        {
          y: -targetOffset + centerOffset,
          duration: 1.6 + ri * 0.35,
          ease: "back.out(1.2)",
          onComplete: () => {
            const baseSymbolIndex = targetSymbolIndex % arcadeGames.length;
            reelsOffset.current[ri] = baseSymbolIndex;
            gsap.set(reelEl, { y: -baseSymbolIndex * itemH + centerOffset });

            // Highlight landed card
            const items = reelEl.children;
            const game  = arcadeGames[baseSymbolIndex];
            for (let i = 0; i < items.length; i++) {
              const isTarget = i % arcadeGames.length === baseSymbolIndex;
              items[i].style.boxShadow   = isTarget ? `0 0 18px ${game.color}88, inset 0 0 12px ${game.color}33` : "";
              items[i].style.borderColor = isTarget ? game.color : "";
            }

            completed++;
            if (completed === 3) {
              clearInterval(tickInterval);
              setSpinning(false);
              const landedGame = arcadeGames[targets[1]];
              setSelectedGame(landedGame);
              play8BitSound("win", soundEnabled);

              setStreak((prev) => prev + 1);
              setScore((s) => {
                const newScore = s + 500;
                if (newScore > highScore) setHighScore(newScore);
                return newScore;
              });

              setScorePopup("+500 PTS!");
              setTimeout(() => setScorePopup(null), 2000);

              setStatusText(`★ JACKPOT! ${landedGame.name.toUpperCase()} UNLOCKED ★`);
              setStatusColor(landedGame.color);
            }
          },
        }
      );
    });
  }, [spinning, credits, soundEnabled, highScore]);

  const handleLeverPull = () => {
    if (spinning) return;
    setLeverPulled(true);
    doSpin();
    setTimeout(() => setLeverPulled(false), 450);
  };

  const handleQuickPick = () => {
    if (spinning) return;
    play8BitSound("click", soundEnabled);
    doSpin();
  };

  return (
    <section className="arcade" ref={sectionRef} id="arcade">
      {/* ── Seamless Ambient Fades (Top & Bottom) ── */}
      <div className="arcade__fade-top" />
      <div className="arcade__fade-bottom" />

      <div className="arcade__inner">

        {/* ═══ SECTION HEADER (Matches App Design) ═══ */}
        <div className="arcade__header">
          <p className="arcade__tag" ref={tagRef}>— origin story & mini-games</p>
          <h2 className="arcade__title" ref={titleRef}>
            <span className="arcade__title-user">AyushiAnanta</span>
            <span className="arcade__title-sep"> / </span>
            arcade zone
            <span className="arcade__retro-badge">🕹️ 8-BIT RETRO</span>
          </h2>
          <p className="arcade__intro" ref={introRef}>
            These games were how I taught myself to code — messy, creative, and pure retro joy. Insert a coin, pull the lever, or pick a cartridge below!
          </p>
        </div>

        {/* ═══ RETRO ARCADE TOP HUD BAR ═══ */}
        <div className="arcade__hud" ref={hudRef}>
          <div className="arcade__hud-item arcade__hud-score">
            <span className="arcade__hud-label">1UP SCORE</span>
            <span className="arcade__hud-val">{String(score).padStart(6, "0")}</span>
            {scorePopup && <span className="arcade__score-popup">{scorePopup}</span>}
          </div>

          <div className="arcade__hud-item arcade__hud-hi">
            <span className="arcade__hud-label">HIGH SCORE</span>
            <span className="arcade__hud-val arcade__hud-val--gold">{String(highScore).padStart(6, "0")}</span>
          </div>

          <div className="arcade__hud-item arcade__hud-credits">
            <span className="arcade__hud-label">CREDITS</span>
            <span className={`arcade__hud-val ${credits <= 2 ? "arcade__hud-val--alert" : ""}`}>
              {String(credits).padStart(2, "0")}
            </span>
          </div>

          <button
            className={`arcade__sound-toggle ${soundEnabled ? "is-on" : "is-off"}`}
            onClick={() => {
              play8BitSound("click", true);
              setSoundEnabled(!soundEnabled);
            }}
            title="Toggle 8-bit sound"
            aria-label="Toggle sound"
          >
            {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
            <span>{soundEnabled ? "SFX ON" : "SFX MUTED"}</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════
           3D PIXELATED ARCADE CABINET
           ═══════════════════════════════════════════ */}
        <div className="cab-scene">
          <div className="cab-3d" ref={cabinetRef}>

            {/* ── PIXEL MARQUEE ARCH ── */}
            <div className="cab-arch">
              <div className="cab-arch__glow" />

              {/* Blinking marquee LEDs */}
              <div className="cab-arch__leds-top">
                {MARQUEE_LEDS.map((_, i) => (
                  <div className={`cab-arch__led-pixel led-${i % 4}`} key={i} />
                ))}
              </div>

              <div className="cab-arch__banner">
                <span className="cab-arch__sparkle">★</span>
                <span className="cab-arch__title">RETRO ARCADE 1999</span>
                <span className="cab-arch__sparkle">★</span>
              </div>

              <div className="cab-arch__sub">★ 3-REEL GAME SELECTOR ★</div>
            </div>

            {/* ── CRT SCREEN BEZEL ── */}
            <div className="cab-screen">
              <div className="cab-screen__scanlines" />
              <div className="cab-screen__vignette" />

              <div className="cab-screen__header">
                <span className="cab-screen__sys">
                  <span className="cab-screen__blink">●</span> SYS://SELECT_ROM
                </span>
                <span className="cab-screen__streak">
                  STREAK: {streak > 0 ? `🔥 x${streak}` : "0"}
                </span>
                <span className={`cab-screen__credits ${credits <= 2 ? "cab-screen__credits--low" : ""}`}>
                  CREDITS: {String(credits).padStart(2, "0")}
                </span>
              </div>

              {/* ── REELS CONTAINER ── */}
              <div className="cab-reels">
                <div className="cab-reels__arrow cab-reels__arrow--left">▶</div>
                <div className="cab-reels__row">
                  <div
                    className="cab-reels__highlight"
                    style={{
                      borderColor: selectedGame
                        ? selectedGame.color
                        : "var(--arcade-purple-light)",
                      boxShadow: selectedGame
                        ? `0 0 20px ${selectedGame.color}88, inset 0 0 15px ${selectedGame.color}22`
                        : "none",
                    }}
                  />
                  {[0, 1, 2].map((ri) => (
                    <div className="cab-reels__col" key={ri}>
                      <div className="cab-reels__fade" />
                      <div
                        className="cab-reels__strip"
                        ref={(el) => (reelsRef.current[ri] = el)}
                      >
                        {REEL.map((g, idx) => (
                          <div
                            className="cab-reels__card"
                            key={idx}
                            style={{ borderColor: `${g.color}44`, cursor: "pointer" }}
                            onClick={() => {
                              if (spinning) return;
                              play8BitSound("click", soundEnabled);
                              setSelectedGame(g);
                              setStatusText(`★ ${g.name.toUpperCase()} READY TO PLAY ★`);
                              setStatusColor(g.color);
                            }}
                            title={`Click to select & play ${g.name}`}
                          >
                            <div
                              className="cab-reels__glow"
                              style={{ boxShadow: `0 0 15px ${g.color}33` }}
                            />
                            <img
                              src={resolveImgUrl(g.image)}
                              alt={g.name}
                              className="cab-reels__icon"
                              loading="lazy"
                            />
                            <span className="cab-reels__name" style={{ color: g.color }}>
                              {g.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cab-reels__arrow cab-reels__arrow--right">◀</div>
              </div>

              {/* ── RESULT & STATUS PANEL ── */}
              <div className="cab-result">
                {!selectedGame ? (
                  <div className="cab-result__status" style={{ color: statusColor }}>
                    <span className="cab-result__status-text">{statusText}</span>
                  </div>
                ) : (
                  <div
                    className="cab-result__card"
                    style={{
                      borderColor: selectedGame.color,
                      boxShadow: `0 0 25px ${selectedGame.color}33, inset 0 0 15px ${selectedGame.color}15`,
                    }}
                  >
                    <a
                      href={selectedGame.play}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Play ${selectedGame.name}`}
                      style={{ display: "contents" }}
                    >
                      <img
                        src={resolveImgUrl(selectedGame.image)}
                        alt={selectedGame.name}
                        className="cab-result__img"
                        style={{ borderColor: selectedGame.color }}
                        loading="lazy"
                      />
                    </a>
                    <div className="cab-result__info">
                      <div className="cab-result__badge-row">
                        <span className="cab-result__badge" style={{ borderColor: selectedGame.color, color: selectedGame.color }}>
                          {selectedGame.genre}
                        </span>
                        <span className="cab-result__tag">{selectedGame.tag}</span>
                      </div>
                      <a
                        href={selectedGame.play}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cab-result__name-link"
                      >
                        <div className="cab-result__name" style={{ color: selectedGame.color }}>
                          {selectedGame.name}
                        </div>
                      </a>
                      <div className="cab-result__desc">{selectedGame.desc}</div>
                    </div>
                    <div className="cab-result__actions">
                      <a
                        href={selectedGame.play}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cab-result__btn cab-result__btn--play"
                        style={{
                          background: selectedGame.color,
                          boxShadow: `0 0 15px ${selectedGame.color}88`,
                        }}
                      >
                        ▶ PLAY NOW
                      </a>
                      <a
                        href={selectedGame.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cab-result__btn cab-result__btn--code"
                        aria-label={`${selectedGame.name} GitHub Repository`}
                      >
                        <FaGithub /> CODE
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* ── CONTROLS DECK ── */}
              <div className="cab-controls" ref={controlsRef}>

                {/* Coin Slot */}
                <div className="cab-ctrl">
                  <div
                    className={`cab-coin ${isCoinDropping ? "is-dropping" : ""}`}
                    onClick={addCredits}
                    title="Insert coin (+5 credits)"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && addCredits()}
                  >
                    <div className="cab-coin__pixel-coin">🪙</div>
                    <div className="cab-coin__bezel">
                      <div className="cab-coin__slit" />
                    </div>
                  </div>
                  <span className="cab-ctrl__label">INSERT COIN</span>
                </div>

                {/* Spin Dome Push Button */}
                <div className="cab-ctrl">
                  <button
                    className={`cab-spin ${spinning ? "cab-spin--pressed" : ""}`}
                    onClick={doSpin}
                    disabled={spinning}
                    aria-label="Spin slot reels"
                  >
                    <div className="cab-spin__cap">
                      {spinning ? "SPIN" : "BET 1"}
                    </div>
                  </button>
                  <span className="cab-ctrl__label">A: SPIN</span>
                </div>

                {/* Quick Pick / Random Button */}
                <div className="cab-ctrl">
                  <button
                    className="cab-quick"
                    onClick={handleQuickPick}
                    disabled={spinning}
                    title="Random game pick"
                    aria-label="Random pick"
                  >
                    <FaDice />
                  </button>
                  <span className="cab-ctrl__label">B: RANDOM</span>
                </div>

                {/* Mechanical Lever / Joystick */}
                <div className="cab-ctrl">
                  <div
                    className={`cab-lever ${leverPulled ? "cab-lever--pulled" : ""}`}
                    onClick={handleLeverPull}
                    title="Pull lever to spin"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleLeverPull()}
                  >
                    <div className="cab-lever__base">
                      <div className="cab-lever__slot" />
                    </div>
                    <div className="cab-lever__shaft">
                      <div className="cab-lever__ball" />
                    </div>
                  </div>
                  <span className="cab-ctrl__label">PULL LEVER</span>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
           ALL GAMES CARTRIDGE / PCB SHELF
           ═══════════════════════════════════════════ */}
        <div className="arcade__shelf-header">
          <div className="arcade__shelf-line" />
          <h3 className="arcade__shelf-title">
            <span className="arcade__shelf-icon">💾</span> SELECTABLE CARTRIDGES // 4 ROMS LOADED
          </h3>
          <div className="arcade__shelf-line" />
        </div>

        <div className="arcade__games-grid" ref={gamesGridRef}>
          {arcadeGames.map((game) => (
            <div
              className="arcade-card"
              key={game.name}
              style={{ "--game-color": game.color }}
            >
              {/* Cartridge Header with Pixel Badge */}
              <div className="arcade-card__top">
                <span className="arcade-card__badge" style={{ color: game.color, borderColor: game.color }}>
                  [{game.badge}]
                </span>
                <span className="arcade-card__genre">{game.genre}</span>
                <span className="arcade-card__tag" style={{ background: `${game.color}22`, color: game.color }}>
                  {game.tag}
                </span>
              </div>

              {/* Game Cartridge Image with Scanlines & Play Overlay */}
              <a
                href={game.play}
                target="_blank"
                rel="noopener noreferrer"
                className="arcade-card__img-container"
                title={`Play ${game.name}`}
              >
                <img src={resolveImgUrl(game.image)} alt={game.name} className="arcade-card__img" loading="lazy" />
                <div className="arcade-card__crt-overlay" />
                <div className="arcade-card__overlay">
                  <span
                    className="arcade-card__play-btn"
                    style={{ background: game.color, boxShadow: `0 0 20px ${game.color}aa` }}
                    aria-label={`Play ${game.name}`}
                  >
                    <FaPlay />
                  </span>
                </div>
              </a>

              {/* Cartridge Content */}
              <div className="arcade-card__content">
                <div className="arcade-card__name-row">
                  <a
                    href={game.play}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="arcade-card__name-link"
                    style={{ textDecoration: "none" }}
                  >
                    <h3 className="arcade-card__name" style={{ color: game.color }}>
                      {game.name}
                    </h3>
                  </a>
                  <span className="arcade-card__diff" title={`Difficulty: ${game.difficulty}`}>
                    {game.difficulty === "EASY" && "★☆☆ EASY"}
                    {game.difficulty === "MEDIUM" && "★★☆ MED"}
                    {game.difficulty === "HARD" && "★★★ HARD"}
                  </span>
                </div>
                <p className="arcade-card__desc">{game.desc}</p>
                <div className="arcade-card__actions">
                  <a
                    href={game.play}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="arcade-card__btn arcade-card__btn--primary"
                    style={{
                      background: game.color,
                      color: "#0a0a14",
                      boxShadow: `0 0 15px ${game.color}66`,
                    }}
                  >
                    <FaPlay className="btn-icon" /> PLAY NOW
                  </a>
                  <a
                    href={game.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="arcade-card__btn arcade-card__btn--icon"
                    aria-label={`${game.name} GitHub Repository`}
                  >
                    <FaGithub /> CODE
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
