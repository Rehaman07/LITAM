// @ts-nocheck
import React from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import litamLogo from "../images/logo.png";

// Helper components copied/adapted from App.tsx since they aren't exported
function Reveal({ children, delay = 0, className = "" }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const controls = useAnimation();
  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
      }}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function CampusHeader({ theme, onToggleTheme }) {
  return (
    <header className="campus-header">
      <div className="campus-header-inner">
        <Link className="campus-brand-lockup" to="/#home" aria-label="LITAM home">
          <span className="campus-brand-mark">
            <img src={litamLogo} alt="LITAM Logo" width="54" height="54" />
          </span>
          <span className="campus-brand-copy">
            <strong>LITAM</strong>
            <small>Loyola Institute of Technology & Management</small>
          </span>
        </Link>

        <div className="campus-header-actions">
          <Link className="campus-back-home" to="/#home">
            <span aria-hidden="true">←</span>
            <span>Back to Home</span>
          </Link>
          <button className="theme-toggle campus-theme-toggle" type="button" onClick={onToggleTheme} aria-label="Toggle theme">
            <div className={`theme-icon ${theme === "dark" ? "moon-icon" : "sun-icon"}`} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

const studentLifeDefault = [
  ["Technical & Cultural Fests", "Students manage, code, perform, and present at national hackathons, cultural festivals, and annual sports days."],
  ["Ragging-Free Environment", "A strictly monitored, friendly campus culture designed around student safety, dignity, and peer support."],
  ["Innovation & Incubation", "24/7 labs where students can tinker, build IoT devices, and prototype software under expert guidance."],
  ["Sports & Athletics", "Extensive grounds and courts for cricket, volleyball, basketball, and indoor games."],
];

const galleryDefault = [
  { title: "LITAM Front Campus View", image: "/assets/images/Main.jpg" },
  { title: "LITAM Buildings", image: "/assets/images/Litam.jpg" }
];

const pickSection = (content, sectionName) => {
  if (!content || !content[sectionName] || !Array.isArray(content[sectionName])) return [];
  return content[sectionName];
};

function StudentLifeSection({ content }) {
  const items = pickSection(content, "student_life");
  const cards = items.length > 0
    ? items.map((item) => [item.title, item.message])
    : studentLifeDefault;
  return (
    <section className="section" id="student-life">
      <div className="glowing-orb orb-accent" style={{ bottom: "10%", left: "5%" }} />
      <Reveal>
        <SectionHeading
          eyebrow="Student Life"
          title="A campus rhythm balancing focus and self-discovery."
          text="Academics at LITAM is coupled with vibrant student associations, multi-disciplinary clubs, and secure support infrastructure."
        />
      </Reveal>

      <div className="courses-grid" style={{ marginTop: "16px" }}>
        {cards.map(([title, text], idx) => (
          <Reveal className="course-card glass" key={title} delay={idx * 0.05}>
            <strong>{title}</strong>
            <p>{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CampusGallery({ content }) {
  // Combine both campus and student_life images if any
  const campusItems = pickSection(content, "campus");
  const studentLifeItems = pickSection(content, "student_life").filter(item => item.image); // only those with images
  const items = [...campusItems, ...studentLifeItems];

  const cards = items.length > 0
    ? items.map((item) => ({ title: item.title, image: item.image }))
    : galleryDefault;

  return (
    <section className="section" id="campus-gallery">
      <Reveal>
        <SectionHeading
          eyebrow="Campus & Student Gallery"
          title="A vibrant view of our modern infrastructure & student life."
          text="Step inside our high-tech digital computing labs, academic halls, and resource-filled libraries."
        />
      </Reveal>
      <div className="gallery-grid" style={{ marginTop: "16px" }}>
        {cards.map((item, index) => (
          item.image && (
          <Reveal className="gallery-item" key={index} delay={index * 0.05}>
            <img src={item.image} alt={item.title} loading="lazy" />
            <div className="gallery-overlay">
              <span>{item.title}</span>
            </div>
          </Reveal>
          )
        ))}
      </div>
    </section>
  );
}

export default function CampusPage({ content, theme, onToggleTheme }) {
  return (
    <div className="page-container campus-page" style={{ paddingTop: "96px", minHeight: "100vh" }}>
      <CampusHeader theme={theme} onToggleTheme={onToggleTheme} />
      <StudentLifeSection content={content} />
      <CampusGallery content={content} />
    </div>
  );
}
