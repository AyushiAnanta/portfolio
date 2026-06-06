import { useState, useEffect } from "react";
import "../styles/Navbar.css";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home", id: "home" },
    { label: "About", href: "#about", id: "about" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "Arcade", href: "#arcade", id: "arcade" },
    { label: "Timeline", href: "#timeline", id: "timeline" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Dynamic styling when scrolling
      setScrolled(window.scrollY > 20);

      // Section tracker
      const sections = ["home", "about", "projects", "arcade", "timeline"];
      const scrollPosition = window.scrollY + 120; // offset for nav header height

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger initial run
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <a href="#home" className="navbar__logo" onClick={(e) => handleLinkClick(e, "#home")}>
          Ayushi<span className="navbar__logo-dot">.</span>
        </a>

        {/* Desktop Links */}
        <nav className="navbar__nav">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`navbar__link ${activeSection === link.id ? "navbar__link--active" : ""}`}
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          className={`navbar__toggle ${mobileMenuOpen ? "navbar__toggle--open" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="navbar__toggle-line"></span>
          <span className="navbar__toggle-line"></span>
          <span className="navbar__toggle-line"></span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`navbar__mobile ${mobileMenuOpen ? "navbar__mobile--open" : ""}`}>
        <nav className="navbar__mobile-nav">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`navbar__mobile-link ${activeSection === link.id ? "navbar__mobile-link--active" : ""}`}
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
