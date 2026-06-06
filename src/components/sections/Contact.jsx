import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contact } from "../../data/content";
import { FaLinkedinIn, FaGithub, FaRegFileAlt } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
import "../../styles/Contact.css";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef();
  const cardRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="contact-section" ref={sectionRef} id="contact">
      <div className="contact-section__inner">
        <p className="contact-section__tag">— say hi</p>
        
        <div className="contact-card" ref={cardRef}>
          <h2 className="contact-card__title">let's talk.</h2>
          <p className="contact-card__sub">
            Seriously though — whether it's a collab, an internship, or just a interesting conversation, I'm usually one message away.
          </p>

          <div className="contact-info">
            <a href={`mailto:${contact.email}`} className="contact-info__item">
              <FiMail className="contact-info__icon" />
              <span>{contact.email}</span>
            </a>
            <a href={`tel:${contact.phone}`} className="contact-info__item">
              <FiPhone className="contact-info__icon" />
              <span>{contact.phone}</span>
            </a>
          </div>

          {/* Social Row with Vertical Dividers as requested */}
          <div className="contact-socials">
            <div className="contact-socials__divider" />
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-socials__link"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
            
            <div className="contact-socials__divider" />
            
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-socials__link"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            
            <div className="contact-socials__divider" />
            
            <a
              href={contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-socials__link"
              aria-label="Resume Document"
            >
              <FaRegFileAlt />
            </a>
            <div className="contact-socials__divider" />
          </div>
        </div>
      </div>
    </section>
  );
}
