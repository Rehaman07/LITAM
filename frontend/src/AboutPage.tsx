import React from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import litamLogo from "../images/logo.png";
import SiteFooter from "./SiteFooter";

function Reveal({ children, className = "", delay = 0, style = {} }: any) {
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

function SectionHeading({eyebrow, title, text}: any) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="gradient-text">{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function AnimatedCounter({value, duration = 2000, threshold = 0.4}: any) {
  const [displayVal, setDisplayVal] = React.useState("0");
  const ref = React.useRef(null);
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    const match = `${value}`.match(/^([0-9.]+)(.*)$/);
    if (!match) {
      setDisplayVal(`${value}`);
      return undefined;
    }

    const target = Number(match[1]);
    const suffix = match[2] || "";
    const node = ref.current;

    if (!node || Number.isNaN(target) || typeof IntersectionObserver === "undefined") {
      setDisplayVal(`${value}`);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (entry.isIntersecting) {
        let start = 0;
        setDisplayVal("0");
        const increment = target / (duration / 16);

        timerRef.current = window.setInterval(() => {
          start += increment;
          if (start >= target) {
            setDisplayVal(`${target}${suffix}`);
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          } else {
            setDisplayVal(`${Math.floor(start)}${suffix}`);
          }
        }, 16);
      } else {
        setDisplayVal("0");
      }
    }, { threshold });

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, duration, threshold]);

  return <span ref={ref}>{displayVal}</span>;
}

const stats = [
  ["2001", "Established Institution"],
  ["NAAC A", "Accredited Institution"],
  ["27 Acres", "Sprawling Green Campus"],
  ["ISO", "9001:2015 Certified"],
];

const institutionDetails = [
  ["Approved by", "AICTE, New Delhi"],
  ["Affiliated to", "JNTUK, Kakinada"],
  ["Accreditation", "NAAC A Grade"],
  ["Certification", "ISO 9001:2015"],
  ["Campus size", "27-acre green campus"],
  ["Built-up area", "232,102+ square feet"],
];

const uniqueFeatures = [
  "State-of-the-art laboratories",
  "High-speed campus-wide Wi-Fi",
  "Dedicated training & placement cell",
  "Comprehensive aptitude & coding training",
  "Inter-state industrial visits & study tours",
  "Extensive bus transit routes across regions",
];

function AboutSection() {
  return (
    <section className="section split-section" id="about">
      <div className="glowing-orb orb-accent" style={{ top: "10%", left: "5%" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <Reveal>
          <SectionHeading
            eyebrow="About LITAM"
            title="Established in 2001, providing state-of-the-art technical & management education."
            text="Loyola Institute of Technology and Management operates under the Santhi Nikethan Minority Education Society, serving students from urban, rural, and semi-urban communities across Andhra Pradesh."
          />
        </Reveal>
        <div className="stats-grid">
          {stats.map(([value, label], index) => {
            const statValue = `${value}`;
            const isAnimated = /^[0-9.]+(?:\s*[A-Za-z%]+|\+)?$/.test(statValue);

            return (
              <Reveal className="stat-card stat-card--featured glass" key={label} delay={index * 0.05}>
                <strong>{isAnimated ? <AnimatedCounter value={statValue} /> : statValue}</strong>
                <span>{label}</span>
              </Reveal>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <Reveal className="institution-card glass">
          {institutionDetails.map(([label, value]) => (
            <div className="institution-row" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </Reveal>
        <Reveal className="features-card">
          <h3 style={{ marginBottom: "16px", fontSize: "1.25rem" }} className="gradient-text">Key Features</h3>
          <ul>
            {uniqueFeatures.map((feature, idx) => (
              <li key={feature} className="glass" style={{ transitionDelay: `${idx * 0.05}s` }}>
                {feature}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export default function AboutPage({theme, onToggleTheme}: any) {
  return (
    <motion.main className="site" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
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
      <AboutSection />
      <SiteFooter />
    </motion.main>
  );
}
