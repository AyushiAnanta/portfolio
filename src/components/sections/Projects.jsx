import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data/content";
import { 
  FaGithub, 
  FaExternalLinkAlt, 
  FaStar, 
  FaCodeBranch, 
  FaArrowLeft, 
  FaLock,
  FaCode,
  FaExclamationCircle,
  FaPlay,
  FaCog,
  FaCheckCircle
} from "react-icons/fa";
import { BiGitRepoForked, BiGitPullRequest } from "react-icons/bi";
import "../../styles/Projects.css";

gsap.registerPlugin(ScrollTrigger);

const projectMeta = {
  "Sahayak": {
    star: 24, fork: 5, watch: 3,
    lang: { name: "Python", color: "#3572A5" },
    updatedAt: "Updated 2 months ago",
  },
  "AI Imposter": {
    star: 42, fork: 12, watch: 6,
    lang: { name: "JavaScript", color: "#f1e05a" },
    updatedAt: "Updated 4 months ago",
  },
  "oopsTube": {
    star: 18, fork: 3, watch: 2,
    lang: { name: "JavaScript", color: "#f1e05a" },
    updatedAt: "Updated 3 months ago",
  },
};

export default function Projects() {
  const sectionRef = useRef();
  const titleRef = useRef();
  const listRef = useRef();
  const detailRef = useRef();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("Code");
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  // Scroll trigger + initial list animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(detailRef.current, { opacity: 0, display: "none" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      ).fromTo(
        listRef.current.children,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: "power3.out" },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Escape key to close detail
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && selectedProject) closeProject();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProject]);

  const openProject = (project) => {
    setSelectedProject(project);
    setActiveTab("Code"); // Default tab
    gsap.to(listRef.current, {
      opacity: 0, x: -30, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        gsap.set(listRef.current, { display: "none" });
        gsap.set(detailRef.current, { display: "flex", opacity: 0, x: 30 });
        gsap.to(detailRef.current, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" });
      }
    });
  };

  const closeProject = () => {
    gsap.to(detailRef.current, {
      opacity: 0, x: 30, duration: 0.25, ease: "power2.in",
      onComplete: () => {
        gsap.set(detailRef.current, { display: "none" });
        setSelectedProject(null);
        setActiveTab("Code");
        gsap.set(listRef.current, { display: "flex", opacity: 0, x: -30 });
        gsap.to(listRef.current, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" });
      }
    });
  };

  return (
    <section className="projects" ref={sectionRef} id="projects">
      <div className="projects__inner">
        <p className="projects__tag">— things I've actually shipped</p>
        <h2 className="projects__title" ref={titleRef}>
          <span className="projects__title-user">AyushiAnanta</span>
          <span className="projects__title-sep"> / </span>
          repositories
        </h2>

        {/* ── LIST VIEW ─────────────────────────────────────────── */}
        <div className="projects__repo-list" ref={listRef}>
          {projects.map((p) => {
            const meta = projectMeta[p.name] || {};
            const lang = meta.lang || { name: "HTML", color: "#e34c26" };
            return (
              <div
                className="repo-row"
                key={p.name}
                onClick={() => openProject(p)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openProject(p)}
                aria-label={`Open ${p.name} repository details`}
              >
                {/* Left: name + description + meta */}
                <div className="repo-row__main">
                  <div className="repo-row__header">
                    <span className="repo-row__icon">
                      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                        <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
                      </svg>
                    </span>
                    <span className="repo-row__name">{p.name}</span>
                    <span className="repo-row__visibility">Public</span>
                  </div>
                  <p className="repo-row__desc">{p.desc}</p>
                  <div className="repo-row__meta">
                    <span className="repo-row__lang">
                      <span className="repo-row__lang-dot" style={{ backgroundColor: lang.color }} />
                      {lang.name}
                    </span>
                    <span className="repo-row__stat">
                      <FaStar /> {meta.star}
                    </span>
                    <span className="repo-row__stat">
                      <FaCodeBranch /> {meta.fork}
                    </span>
                    <span className="repo-row__updated">{meta.updatedAt}</span>
                    <div className="repo-row__tags">
                      {p.tags.map((tag) => (
                        <span className="repo-row__tag" key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: action buttons */}
                <div className="repo-row__actions" onClick={(e) => e.stopPropagation()}>
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="repo-row__btn demo"
                      aria-label={`${p.name} Live Demo`}
                    >
                      <FaExternalLinkAlt /> Live Demo
                    </a>
                  )}
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="repo-row__btn"
                      aria-label={`${p.name} GitHub`}
                    >
                      <FaGithub /> GitHub
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── DETAIL VIEW ───────────────────────────────────────── */}
        <div className="repo-detail" ref={detailRef}>
          {selectedProject && (() => {
            const p = selectedProject;
            const meta = projectMeta[p.name] || {};
            const lang = meta.lang || { name: "HTML", color: "#e34c26" };
            return (
              <>
                {/* Breadcrumb */}
                <div className="repo-detail__breadcrumb">
                  <button className="repo-detail__back" onClick={closeProject}>
                    <FaArrowLeft /> Back
                  </button>
                  <span className="repo-detail__crumb-owner">AyushiAnanta</span>
                  <span className="repo-detail__crumb-sep"> / </span>
                  <span className="repo-detail__crumb-name">{p.name}</span>
                  <span className="repo-detail__visibility">Public</span>
                </div>

                {/* Mock GitHub tabs */}
                <div className="repo-detail__tabs">
                  {[
                    { name: "Code", icon: <FaCode /> },
                    { name: "Issues", icon: <FaExclamationCircle />, count: 0 },
                    { name: "Pull requests", icon: <BiGitPullRequest />, count: 0 },
                    { name: "Actions", icon: <FaPlay /> },
                    { name: "Settings", icon: <FaCog /> }
                  ].map((tab) => {
                    const isActive = activeTab === tab.name;
                    return (
                      <button
                        key={tab.name}
                        className={`repo-detail__tab${isActive ? " active" : ""}`}
                        onClick={() => setActiveTab(tab.name)}
                        aria-label={`Open ${tab.name} tab`}
                      >
                        {tab.icon}
                        <span>{tab.name}</span>
                        {tab.count !== undefined && (
                          <span className="repo-detail__tab-count">{tab.count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Body depending on activeTab */}
                {activeTab === "Code" && (
                  <div className="repo-detail__body">
                    {/* Left: main content */}
                    <div className="repo-detail__main">
                      {/* Stats bar */}
                      <div className="repo-detail__stats-bar">
                        <span className="repo-detail__stat">
                          <FaStar /> <strong>{meta.star}</strong> stars
                        </span>
                        <span className="repo-detail__stat">
                          <BiGitRepoForked /> <strong>{meta.fork}</strong> forks
                        </span>
                        <span className="repo-detail__stat-updated">{meta.updatedAt}</span>
                      </div>

                      {/* README-style content */}
                      <div className="repo-detail__readme">
                        <div className="repo-detail__readme-header">
                          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                            <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0114.25 13H8.06l-2.573 2.573A1.457 1.457 0 013 14.543V13H1.75A1.75 1.75 0 010 11.25v-9.5z"/>
                          </svg>
                          README.md
                        </div>
                        <div className="repo-detail__readme-body">
                          <h3 className="repo-detail__readme-title">{p.name}</h3>
                          <p className="repo-detail__readme-subtitle">{p.subtitle}</p>
                          <p className="repo-detail__readme-desc">{p.desc}</p>

                          <h4 className="repo-detail__readme-h4">Highlights</h4>
                          <ul className="repo-detail__readme-list">
                            {p.bullets.map((bullet, idx) => (
                              <li key={idx}>
                                <span className="readme-bullet">▸</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="repo-detail__readme-actions">
                            {p.github && (
                              <a
                                href={p.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="repo-detail__action-btn"
                              >
                                <FaGithub /> View on GitHub
                              </a>
                            )}
                            {p.demo && (
                              <a
                                href={p.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="repo-detail__action-btn demo"
                              >
                                <FaExternalLinkAlt /> Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: About sidebar */}
                    <div className="repo-detail__sidebar">
                      <div className="repo-detail__about">
                        <h4>About</h4>
                        <p>{p.subtitle}</p>
                        <div className="repo-detail__sidebar-tags">
                          {p.tags.map((tag) => (
                            <span className="repo-detail__sidebar-tag" key={tag}>{tag}</span>
                          ))}
                        </div>
                        <div className="repo-detail__sidebar-stats">
                          <div className="repo-detail__sidebar-stat">
                            <FaStar /> <span><strong>{meta.star}</strong> stars</span>
                          </div>
                          <div className="repo-detail__sidebar-stat">
                            <BiGitRepoForked /> <span><strong>{meta.fork}</strong> forks</span>
                          </div>
                          <div className="repo-detail__sidebar-stat lang-row">
                            <span className="repo-detail__lang-dot" style={{ backgroundColor: lang.color }} />
                            <span>{lang.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Issues" && (
                  <div className="repo-detail__empty-state">
                    <FaExclamationCircle className="repo-detail__empty-icon" />
                    <h3 className="repo-detail__empty-title">0 Open Issues</h3>
                    <p className="repo-detail__empty-desc">
                      No issues because I am perfect.
                    </p>
                    <button 
                      className="repo-detail__empty-btn"
                      onClick={() => showToast("Access Denied: Perfection cannot be reported. 🚫")}
                    >
                      New Issue
                    </button>
                  </div>
                )}

                {activeTab === "Pull requests" && (
                  <div className="repo-detail__empty-state">
                    <BiGitPullRequest className="repo-detail__empty-icon" />
                    <h3 className="repo-detail__empty-title">0 Open Pull Requests</h3>
                    <p className="repo-detail__empty-desc">
                      Why wait for peer reviews when you write masterpiece code? All branches are merged.
                    </p>
                    <button 
                      className="repo-detail__empty-btn"
                      onClick={() => showToast("All branches are already up to date with main. ✅")}
                    >
                      New Pull Request
                    </button>
                  </div>
                )}

                {activeTab === "Actions" && (
                  <div className="repo-detail__actions-panel">
                    <div className="repo-detail__actions-log">
                      <div className="repo-detail__actions-log-title">
                        <FaCheckCircle className="repo-detail__log-success" /> All checks passed
                      </div>
                      <div className="repo-detail__log-line">
                        <span>✓ Ego Check</span>
                        <span className="repo-detail__log-success">Exceeded limits (0.01s)</span>
                      </div>
                      <div className="repo-detail__log-line">
                        <span>✓ Coffee Intake</span>
                        <span className="repo-detail__log-success">Peak optimization (120mg) (0.42s)</span>
                      </div>
                      <div className="repo-detail__log-line">
                        <span>✓ StackOverflow visits</span>
                        <span className="repo-detail__log-success">0 (No help needed) (0.00s)</span>
                      </div>
                      <div className="repo-detail__log-line">
                        <span>✓ CSS Centering</span>
                        <span className="repo-detail__log-success">Mastered on first try (0.02s)</span>
                      </div>
                      <div className="repo-detail__log-line">
                        <span>✓ Bugs Written</span>
                        <span className="repo-detail__log-success">0 (0.00s)</span>
                      </div>
                      <div className="repo-detail__log-line">
                        <span>✓ Git commits</span>
                        <span className="repo-detail__log-success">Shipped & flexing on Vercel (0.50s)</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Settings" && (
                  <div className="repo-detail__settings-panel">
                    <h3 className="repo-detail__settings-title">Repository Settings</h3>
                    <p className="repo-detail__settings-desc">
                      This repository is maintained by a solo developer. Settings are locked to prevent unsolicited opinions.
                    </p>
                    <div className="repo-detail__settings-options">
                      <div className="repo-detail__settings-option">
                        <div className="repo-detail__settings-option-label">
                          <span className="repo-detail__option-title">God Mode</span>
                          <span className="repo-detail__option-desc">Ensure developer performance is permanently elevated</span>
                        </div>
                        <div className="repo-detail__toggle active">
                          <div className="repo-detail__toggle-handle" />
                        </div>
                      </div>
                      <div className="repo-detail__settings-option">
                        <div className="repo-detail__settings-option-label">
                          <span className="repo-detail__option-title">Auto-fix Bugs</span>
                          <span className="repo-detail__option-desc">Instantly resolve compile errors on keypress</span>
                        </div>
                        <div className="repo-detail__toggle active">
                          <div className="repo-detail__toggle-handle" />
                        </div>
                      </div>
                      <div className="repo-detail__settings-option">
                        <div className="repo-detail__settings-option-label">
                          <span className="repo-detail__option-title">Accept Constructive Criticism</span>
                          <span className="repo-detail__option-desc">Enable pull request comments containing suggestions</span>
                        </div>
                        <div className="repo-detail__toggle">
                          <div className="repo-detail__toggle-handle" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>

      </div>

      {toast && (
        <div className="projects__toast">
          {toast}
        </div>
      )}
    </section>
  );
}
