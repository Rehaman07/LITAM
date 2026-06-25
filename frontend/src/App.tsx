// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import api from './api';

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import * as THREE from "three";
import litamLogo from "../images/logo.png";
import tcsLogo from "./assets/logos/tcs.png";
import infosysLogo from "./assets/logos/infosys.png";
import capgeminiLogo from "./assets/logos/capgemini.png";
import hclLogo from "./assets/logos/hcl.png";
import wiproLogo from "./assets/logos/wipro.png";
import accentureLogo from "./assets/logos/accenture.png";
import cognizantLogo from "./assets/logos/cognizant.png"; 
import techMahindraLogo from "./assets/logos/techmahindra.png";
import heroImage from "./assets/images/Main.jpg";
import directorImage from "./assets/images/Director_sir.jpg";

function AnimatedCounter({ value, duration = 2000, threshold = 0.4 }) {
  const [displayVal, setDisplayVal] = useState("0");
  const ref = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const match = `${value}`.match(/^([0-9.]+)(.*)$/);
    if (!match) {
      setDisplayVal(`${value}`);
      return undefined;
    }

    const target = Number(match[1]);
    const suffix = match[2] || "";
    const node = ref.current;

    if (!node || Number.isNaN(target)) {
      setDisplayVal(`${value}`);
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setDisplayVal(`${value}`);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
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
      },
      { threshold }
    );

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



const letters = ["L", "I", "T", "A", "M"];
const slugify = (label) =>
  label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const navItems = [
  "Home",
  "About",
  "Academics",
  "Admissions",
  "Research",
  "Placements",
  "Campus",
  "Contact",
].map((label) => ({
  label,
  href: `#${slugify(label)}`,
}));
const campusItems = [
  "Faculty",
  "Student Life",
  "News & Events",
  "Gallery",
].map((label) => ({
  label,
  href: `#${slugify(label)}`,
}));

const stats = [
  ["2001", "Established Institution"],
  ["NAAC A", "Accredited Institution"],
  ["27 Acres", "Sprawling Green Campus"],
  ["ISO", "9001:2015 Certified"],
];

const courseCategories = {
  btech: {
    title: "B.Tech Programs",
    code: "AP EAPCET / ECET Code: LOYL",
    courses: [
      { name: "Computer Science and Engineering", desc: "Deep dive into software engineering, advanced algorithms, full-stack systems, and distributed databases." },
      { name: "CSE - Artificial Intelligence & Machine Learning", desc: "Specialized study in neural networks, deep learning, computer vision, natural language processing, and smart systems." },
      { name: "CSE - Data Science", desc: "Focuses on big data analytics, statistical modeling, data visualization, and predictive machine learning models." },
      { name: "Electronics and Communication Engineering", desc: "Core curriculum in VLSI design, signal processing, embedded systems, Internet of Things, and telecommunications." },
      { name: "Electrical and Electronics Engineering", desc: "Study of power systems, power electronics, industrial control machines, automation, and green energy systems." },
      { name: "Civil Engineering", desc: "Covers structural design, geotech analysis, eco-friendly infrastructure, and construction management." },
      { name: "Mechanical Engineering", desc: "Hands-on study of robotics, manufacturing science, thermodynamics, CAD/CAM design, and structural automation." },
      { name: "Artificial Intelligence & Data Science", desc: "Future-focused program covering artificial intelligence, machine learning, deep learning, big data analytics, computer vision, natural language processing, and intelligent software systems."}    
    ]
  },
  mtech: {
    title: "M.Tech Programs",
    code: "AP PGECET Code: LOYL",
    courses: [
      { name: "Structural Engineering", desc: "Post-graduate advanced study of complex structural analytics, concrete technologies, and earthquake-resistant designs." }
    ]
  },
  diploma: {
    title: "Diploma Programs (Polytechnic)",
    code: "AP POLYCET Code: LITM",
    courses: [
      { name: "Computer Science and Engineering", desc: "Core technical training in programming languages, databases, web development basics, and hardware labs." },
      { name: "CSE - Artificial Intelligence & Machine Learning", desc: "Introductory curriculum in Python, basic AI tools, machine learning pipelines, and technical problem solving." },
      { name: "Electronics and Communication Engineering", desc: "Practical curriculum focused on circuit building, microcontrollers, IoT testing, and radio communications." },
      { name: "Electrical and Electronics Engineering", desc: "Hands-on polytechnic labs in wiring systems, electrical machines, power transmission systems, and safety procedures." },
      { name: "CSE - Data Science", desc: "Focuses on big data analytics, statistical modeling, data visualization, and predictive machine learning models."},
      { name: "Artificial Intelligence & Data Science", desc: "Industry-oriented diploma program introducing students to Python programming, artificial intelligence, machine learning, data analytics, databases, and modern intelligent technologies with hands-on learning."}
    ]
  },
  postgrad: {
    title: "Post-Graduate Programs",
    code: "AP ICET Code: LITM",
    courses: [
      { name: "MBA (Master of Business Administration)", desc: "Comprehensive management training specializing in Marketing, Finance, HR Management, and Operations." },
      { name: "MCA (Master of Computer Applications)", desc: "Advanced study of web engineering, database architecture, cloud structures, enterprise systems, and cyber security." }
    ]
  }
};

const facultyHighlights = [
  ["Experienced Faculty", "Our highly qualified educators bring years of academic research and corporate expertise into the classroom."],
  ["Mentorship Program", "Individual faculty advisors provide personalized support for academic pathing, project work, and personal wellbeing."],
  ["Industry Practice", "Strong corporate tie-ups translate standard curricula into modern lab work, workshops, and industry placements."]
];

const studentLife = [
  ["Technical & Cultural Fests", "Students manage, code, perform, and present at national hackathons, cultural festivals, and annual sports days."],
  ["Ragging-Free Environment", "A strictly monitored, friendly campus culture designed around student safety, dignity, and peer support."],
  ["Hostels & Canteen", "Separate boys' and girls' on-campus hostels with hygienic, modern food halls, gyms, and library access."]
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

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem("litam-theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  } catch {
    return "dark";
  }
  return "dark";
}

const news = [
  {
    date: "16 Jun",
    title: "Admissions counselling support now open for AP EAPCET, ECET, PGECET, ICET, and POLYCET candidates.",
    tag: "Admissions",
  },
  {
    date: "12 Jun",
    title: "LITAM celebrates NAAC 'A' grade accreditation renewal and expands state-of-the-art laboratory facilities.",
    tag: "Institution",
  },
  {
    date: "08 Jun",
    title: "Technical Hackathon & cultural fest dates announced; student clubs commence project development.",
    tag: "Campus",
  },
  {
    date: "02 Jun",
    title: "Placement cell signs new training and placement partnerships with leading MNCs for 2026 graduates.",
    tag: "Academic",
  }
];

const events = [
  ["21 Jun", "Freshers orientation and parent interaction", "Main Auditorium"],
  ["28 Jun", "Hack LITAM: 24-hour product development sprint", "Innovation Hub"],
  ["05 Jul", "Career readiness & resume building bootcamp", "Placement Cell"],
];

const recruiters = [
  { logo: techMahindraLogo, alt: "Tech Mahindra" },
  { logo: capgeminiLogo, alt: "Capgemini" },
  { logo: cognizantLogo, alt: "Cognizant" },
  { logo: hclLogo, alt: "HCL" },
  { logo: infosysLogo, alt: "Infosys" },
  { logo: tcsLogo, alt: "TCS" },
  { logo: wiproLogo, alt: "Wipro" },
  { logo: accentureLogo, alt: "Accenture" },
];

const testimonials = [
  {
    quote: "LITAM gave me the space to build, present, fail fast, and grow. The personal training from the placement cell was instrumental in helping me clear technical interviews with confidence.",
    name: "Akhila R.",
    meta: "CSE Graduate (Placed at TCS)",
  },
  {
    quote: "The academic rigor combined with hands-on lab experiments helped me understand core electronics topics. Faculty mentors guided me to build working prototypes for national competitions.",
    name: "Naveen K.",
    meta: "ECE Graduate (Placed at Capgemini)",
  },
  {
    quote: "Student life at LITAM is extremely vibrant. Being part of the Innovation Club helped me develop leadership and collaboration skills that are invaluable in my current software development role.",
    name: "Meghana S.",
    meta: "AI & DS Graduate (Placed at Accenture)",
  },
];

const gallery = [
  {
    title: "Innovation Hub",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Central Library",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Graduation Day",
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Campus Life",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
  },
];

function CinematicField({ introDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 90);
    camera.position.set(0, 0, 16);

    const particles = new THREE.BufferGeometry();
    const count = window.innerWidth < 700 ? 350 : 650;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 24;
      positions[i3 + 1] = (Math.random() - 0.5) * 13;
      positions[i3 + 2] = (Math.random() - 0.5) * 22;

      const gold = Math.random() > 0.78;
      colors[i3] = gold ? 0.96 : 0.23;
      colors[i3 + 1] = gold ? 0.62 : 0.51;
      colors[i3 + 2] = gold ? 0.04 : 0.96;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: window.innerWidth < 700 ? 0.03 : 0.04,
      transparent: true,
      opacity: 0.65,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pointCloud = new THREE.Points(particles, particleMaterial);
    scene.add(pointCloud);

    const ringGeometry = new THREE.RingGeometry(2.35, 2.4, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.z = -1.5;
    scene.add(ring);

    let frame = 0;
    let rafId = 0;
    const start = performance.now();

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      const elapsed = (performance.now() - start) / 1000;
      pointCloud.rotation.y = elapsed * 0.02;
      pointCloud.rotation.x = Math.sin(elapsed * 0.3) * 0.015;
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, introDone ? 13 : 15, 0.02);

      if (elapsed > 2.5 && elapsed < 4) {
        const progress = (elapsed - 2.5) / 1.5;
        ring.scale.setScalar(1 + progress * 5.6);
        ringMaterial.opacity = Math.sin(progress * Math.PI) * 0.45;
      }

      if (frame % 2 === 0 || window.innerWidth > 700) {
        renderer.render(scene, camera);
      }
      frame += 1;
      rafId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      particles.dispose();
      particleMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, [introDone]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }} aria-hidden="true" />;
}

function Intro({ onComplete }) {
  const [exit, setExit] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const bgX = useTransform(springX, [-1, 1], [-15, 15]);
  const bgY = useTransform(springY, [-1, 1], [-8, 8]);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setExit(true), 3200);
    const doneTimer = window.setTimeout(onComplete, 4000);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete]);

  const handlePointerMove = (event) => {
    mouseX.set((event.clientX / window.innerWidth - 0.5) * 2);
    mouseY.set((event.clientY / window.innerHeight - 0.5) * 2);
  };

  return (
    <motion.section
      className="intro"
      onPointerMove={handlePointerMove}
      initial={{ opacity: 1 }}
      animate={{ opacity: exit ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      aria-label="LITAM cinematic intro"
    >
      <CinematicField introDone={exit} />
      <motion.div
        className="camera-stage"
        initial={{ scale: 0.9, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 3.5, ease: "easeOut" }}
      >
        <div className="logo-wrap" aria-label="LITAM">
          {letters.map((letter, index) => (
            <motion.span
              className="metal-letter"
              key={letter}
              initial={{ opacity: 0, y: 35, rotateX: 60 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 15,
                delay: 0.5 + index * 0.15,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        <motion.p
          className="tagline"
          initial={{ opacity: 0, letterSpacing: "0.4em" }}
          animate={{ opacity: 1, letterSpacing: "0.25em" }}
          transition={{ duration: 1, delay: 1.8 }}
        >
          Empowering Minds. Building Futures.
        </motion.p>
      </motion.div>
    </motion.section>
  );
}
function SiteHeader({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const links = (className) => (
    <ul className={className}>
      {navItems.map((item) => (
        <li key={item.href}>
          <a href={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-inner">
        <a className="brand-lockup" href="#home" aria-label="LITAM home">
          <span className="brand-mark">
            <img src={litamLogo} alt="LITAM Logo" width="46" height="46" />
          </span>
          <span className="brand-copy">
            <strong>LITAM</strong>
            <small>Loyola Institute of Technology & Management</small>
          </span>
        </a>
        <nav className="desktop-nav flex items-center gap-6 whitespace-nowrap" aria-label="Primary navigation">
          {links("nav-list")}
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label="Toggle theme">
            <div className={`theme-icon ${theme === "dark" ? "moon-icon" : "sun-icon"}`} aria-hidden="true" />
          </button>
          <a className="portal-link" href="#contact">
            Portal
          </a>
          <a className="btn-apply-header" href="#contact">
            Apply Now
          </a>
          <button
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            aria-label="Toggle Menu"
          >
            <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        className={`mobile-nav ${menuOpen ? "open" : ""}`}
        aria-label="Mobile primary navigation"
      >
        {links("mobile-nav-list")}
      </nav>
    </header>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="gradient-text">{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="glowing-orb orb-primary" style={{ top: "10%", left: "15%" }} />
      <div className="glowing-orb orb-accent" style={{ bottom: "5%", right: "10%" }} />
      <img
        className="hero-bg-image"
        src={heroImage}
        alt=""
        aria-hidden="true"
      />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-mesh" aria-hidden="true" />
      <div className="hero-grid-pattern" aria-hidden="true" />
      <div className="light-streak" aria-hidden="true" />
      <div className="light-streak" style={{ top: "60%", animationDelay: "-6s", animationDuration: "16s" }} aria-hidden="true" />
      
      <div className="section">
        <div className="hero-content">
          <Reveal>
            <span className="eyebrow">Innovation-Led Education</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="hero-title gradient-text">
              <span>Loyola Institute of</span>
              <span>Technology &</span>
              <span>Management</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p>
              A disciplined, future-facing campus where engineering ambition meets elite mentorship, advanced laboratory research, and career-ready practice.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="hero-signals" aria-label="Institution highlights">
            <span>AI & Data Science</span>
            <span>Advanced Labs</span>
            <span>Industry-Ready Training</span>
          </Reveal>
          <Reveal delay={0.3} className="hero-actions">
            <a className="btn btn-primary" href="#academics">
              Explore Programs
            </a>
            <a className="btn btn-secondary" href="#placements">
              View Placements
            </a>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="hero-footer-grid">
              <div className="hero-announcement glass">
                <span className="badge-admissions">Admissions 2026</span>
                <strong>Counselling Support Active</strong>
                <p>Apply for CSE, AI & ML, Data Science, ECE, EEE, Mechanical, or Civil Engineering.</p>
              </div>
              
              <div className="hero-stat-card glass">
                <div className="stat-glow-effect" aria-hidden="true" />
                <strong className="stat-number">
                  <AnimatedCounter value="2001" />
                </strong>
                <span className="stat-label">Academic Legacy</span>
              </div>
              
              <div className="hero-stat-card glass">
                <div className="stat-glow-effect" aria-hidden="true" />
                <strong className="stat-number">
                  NAAC A
                </strong>
                <span className="stat-label">National Grade</span>
              </div>

              <div className="hero-stat-card glass">
                <div className="stat-glow-effect" aria-hidden="true" />
                <strong className="stat-number">
                  <AnimatedCounter value="250+" />
                </strong>
                <span className="stat-label">Recruiter Network</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PrincipalMessage() {
  return (
    <section className="section" id="principal-message">
      <div className="glowing-orb orb-primary" style={{ top: "30%", right: "10%" }} />
      <Reveal>
        <div className="principal-card glass">
          <div className="principal-portrait">
            <img
              src={directorImage}
              alt="E. Vamsi Krishna Sir, MBA, M-Tech. - Director, LITAM"
            />
          </div>
          <div>
            <span className="eyebrow">Director's Message</span>
            <h2 className="gradient-text">Education that builds skill, character, and confidence.</h2>
            <p>
              &quot;At LITAM, we prepare students to think clearly, solve responsibly, and lead with integrity.
              Our curriculum blends conceptual rigor with real-world application, instilling in candidates the technical competence and ethical fortitude required to innovate solutions for contemporary global challenges.&quot;
            </p>
            <div className="principal-meta">
              <strong>E. Vamsi Krishna Sir, MBA, M-Tech.</strong>
              <small>Director, LITAM</small>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function AboutAndStats() {
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
              <Reveal className="stat-card glass" key={label} delay={index * 0.05}>
                <strong>
                  {isAnimated ? <AnimatedCounter value={statValue} /> : statValue}
                </strong>
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

function AcademicsSection() {
  const [activeTab, setActiveTab] = useState("btech");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/')
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categoryMap = {
    "btech": { title: "B.Tech Programs", code: "AP EAPCET / ECET Code: LOYL" },
    "mtech": { title: "M.Tech Programs", code: "AP PGECET Code: LOYL" },
    "diploma": { title: "Diploma Programs (Polytechnic)", code: "AP POLYCET Code: LITM" },
    "postgrad": { title: "Post-Graduate Programs", code: "AP ICET Code: LITM" }
  };
  const categoryKeys = Object.keys(categoryMap);

  return (
    <section className="section" id="academics">
      <div className="glowing-orb orb-primary" style={{ bottom: "5%", left: "10%" }} />
      <Reveal>
        <SectionHeading
          eyebrow="Academics"
          title="Courses designed for tomorrow's technology landscapes."
          text="Explore undergraduate, post-graduate, and diploma courses combining modern laboratory modules with comprehensive aptitude mentoring."
        />
      </Reveal>

      <div className="course-explorer">
        <Reveal className="tabs-list">
          {categoryKeys.map((key) => (
            <button
              key={key}
              className="ab-btn"
              onClick={() => setActiveTab(key)}
            >
              {key === "btech" ? "B.Tech" : key === "mtech" ? "M.Tech" : key === "diploma" ? "Diploma" : "Post-Grad"}
            </button>
          ))}
        </Reveal>

        <div className="courses-grid">
          {loading ? <p>Loading courses...</p> : (courses.filter(c => c.category === activeTab).length > 0 ? courses.filter(c => c.category === activeTab).map((course, index) => (
            <Reveal className="course-card glass" key={course.name} delay={index * 0.05}>
              <span className="course-tag">{categoryMap[activeTab].title}</span>
              <strong>{course.name}</strong>
              <p>{course.description}</p>
            </Reveal>
          )) : courseCategories[activeTab].courses.map((course, index) => (
            <Reveal className="course-card glass" key={course.name} delay={index * 0.05}>
              <span className="course-tag">{categoryMap[activeTab].title}</span>
              <strong>{course.name}</strong>
              <p>{course.desc}</p>
            </Reveal>
          )))}
        </div>

        <Reveal style={{ textAlign: "center", marginTop: "16px" }}>
          <span className="badge badge-info">{categoryMap[activeTab].code}</span>
        </Reveal>
      </div>
    </section>
  );
}

function EligibilityEstimator() {
  const [courseLevel, setCourseLevel] = useState("btech");
  const [hasEntrance, setHasEntrance] = useState("yes");

  const estData = useMemo(() => {
    switch (courseLevel) {
      case "btech":
        return {
          code: "LOYL",
          exam: "AP EAPCET / AP ECET",
          duration: "4 Years (3 Years for lateral entry)",
          criteria: "Intermediate (10+2) with MPC subjects or equivalent diploma.",
          path: "Convenor quota admissions through online EAPCET counselling, or Management quota."
        };
      case "mtech":
        return {
          code: "LOYL",
          exam: "AP PGECET / GATE",
          duration: "2 Years (4 Semesters)",
          criteria: "B.E./B.Tech degree in matching engineering branches with qualifying percentage.",
          path: "Admissions based on PGECET counselling rank or GATE scores."
        };
      case "diploma":
        return {
          code: "LITM",
          exam: "AP POLYCET",
          duration: "3 Years (6 Semesters)",
          criteria: "Secondary School Certificate (SSC / 10th standard) pass with Mathematics.",
          path: "Convenor admissions based on POLYCET state rank, or Direct Management entry."
        };
      case "mba":
        return {
          code: "LITM",
          exam: "AP ICET",
          duration: "2 Years (4 Semesters)",
          criteria: "Recognized Bachelor's degree (3-year duration) with minimum 50% marks.",
          path: "Online ICET counselling under LOYL convenor code, or college admissions cell."
        };
      case "mca":
        return {
          code: "LITM",
          exam: "AP ICET",
          duration: "2 Years (4 Semesters)",
          criteria: "Bachelor's degree with Mathematics at 10+2 level or Graduation level.",
          path: "Rank-based admissions via state ICET counselling convenor allotment."
        };
      default:
        return {};
    }
  }, [courseLevel]);

  return (
    <section className="section" id="admissions">
      <div className="glowing-orb orb-accent" style={{ top: "30%", right: "15%" }} />
      <Reveal>
        <SectionHeading
          eyebrow="Admissions Support"
          title="Calculate eligibility & verify admission codes instantly."
          text="Select your desired program level and discover specific entry examinations, course durations, and state counselling guidelines."
        />
      </Reveal>

      <div className="estimator-layout">
        <Reveal className="glass glass-card">
          <h3 style={{ marginBottom: "24px" }} className="gradient-text">Eligibility Calculator</h3>
          <div className="form-group">
            <label htmlFor="course-select">Select Target Course</label>
            <select
              id="course-select"
              className="form-select"
              value={courseLevel}
              onChange={(e) => setCourseLevel(e.target.value)}
            >
              <option value="btech">B.Tech (Bachelor of Technology)</option>
              <option value="mtech">M.Tech (Master of Technology)</option>
              <option value="diploma">Diploma (Polytechnic Courses)</option>
              <option value="mba">MBA (Business Administration)</option>
              <option value="mca">MCA (Computer Applications)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="exam-select">Have you cleared the state entrance exam?</label>
            <select
              id="exam-select"
              className="form-select"
              value={hasEntrance}
              onChange={(e) => setHasEntrance(e.target.value)}
            >
              <option value="yes">Yes, I have a rank card</option>
              <option value="no">No, exploring Management/Direct Quota</option>
            </select>
          </div>

          <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>Have questions? Speak to an advisor:</span>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a href="tel:+919505798369" className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "0.8rem" }}>
                Call 9505 798 369
              </a>
              <a href="tel:+917416516222" className="btn btn-secondary" style={{ padding: "10px 20px", fontSize: "0.8rem" }}>
                Call 7416 516 222
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal className="estimator-results glass glass-card">
          <div className="results-header">
            <h3 className="gradient-text">Admission Specifications</h3>
            <span className="badge badge-info">Counselling Code: {estData.code}</span>
          </div>

          <div className="results-grid">
            <div className="result-item">
              <span>Required Exam</span>
              <strong>{estData.exam}</strong>
            </div>
            <div className="result-item">
              <span>Duration</span>
              <strong>{estData.duration}</strong>
            </div>
            <div className="result-item" style={{ gridColumn: "1 / -1" }}>
              <span>Academic Criteria</span>
              <p style={{ fontSize: "0.92rem", marginTop: "4px" }}>{estData.criteria}</p>
            </div>
            <div className="result-item" style={{ gridColumn: "1 / -1" }}>
              <span>Admission Pathway</span>
              <p style={{ fontSize: "0.92rem", marginTop: "4px" }}>
                {hasEntrance === "yes"
                  ? estData.path
                  : `Direct Management Admission available. Visit LITAM campus with intermediate/SSC documents to lock in your seats.`}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FacultyAndResearch() {
  return (
    <section className="section split-section" id="faculty">
      <div className="glowing-orb orb-primary" style={{ bottom: "10%", right: "5%" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <Reveal>
          <SectionHeading
            eyebrow="Faculty"
            title="A mentoring-first academic environment."
            text="LITAM focuses heavily on student-faculty interactivity, ensuring concepts are fully digested in the classroom and actively applied in laboratories."
          />
        </Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {facultyHighlights.map(([title, text], index) => (
            <Reveal className="glass glass-card" key={title} delay={index * 0.05} style={{ padding: "24px" }}>
              <strong style={{ fontSize: "1.15rem", color: "var(--primary)", display: "block", marginBottom: "6px", fontFamily: "var(--font-heading)" }}>{title}</strong>
              <p style={{ fontSize: "0.92rem" }}>{text}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }} id="research">
        <Reveal>
          <SectionHeading
            eyebrow="Research & Innovation"
            title="Translating practical ideas into technical prototypes."
            text="LITAM provides computer labs, core technical design rooms, research journals, and expert mentoring to support student paper publication and patent design."
          />
        </Reveal>
        <div className="stats-grid">
          <Reveal className="stat-card glass">
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-faint)", fontWeight: "800" }}>Focus Fields</span>
            <strong style={{ fontSize: "1.75rem", marginBlock: "8px" }} className="gradient-text">AI, IoT & Energy</strong>
            <p style={{ fontSize: "0.88rem" }}>Student research teams build smart microgrid modules, automation systems, and computer vision tools.</p>
          </Reveal>
          <Reveal className="stat-card glass">
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-faint)", fontWeight: "800" }}>Innovation Path</span>
            <strong style={{ fontSize: "1.75rem", marginBlock: "8px" }} className="gradient-text">Build, Test, Present</strong>
            <p style={{ fontSize: "0.88rem" }}>Progress from simple laboratory projects to research paper publications and national engineering awards.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function NewsAndEvents() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Admissions", "Institution", "Campus", "Academic"];
  
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/news/')
      .then(res => {
        setNewsData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredNews = useMemo(() => {
    const dataToFilter = newsData.length > 0 ? newsData : news;
    if (activeFilter === "All") return dataToFilter;
    return dataToFilter.filter((n) => n.tag === activeFilter);
  }, [activeFilter, newsData]);

  return (
    <section className="section" id="news-and-events">
      <div className="glowing-orb orb-accent" style={{ top: "15%", left: "10%" }} />
      <Reveal>
        <SectionHeading
          eyebrow="Updates Feed"
          title="Announcements, admissions & highlights."
          text="Stay aligned with upcoming exam schedules, counselling events, placement drives, and campus club updates."
        />
      </Reveal>

      <div className="dashboard-layout">
        <div className="news-feed">
          <div className="feed-header">
            <h3 style={{ fontSize: "1.25rem" }} className="gradient-text">Latest News</h3>
            <div className="feed-filters">
              {filters.map((f) => (
                <button
                  key={f}
                  className="filter-btn"
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {loading ? <p>Loading news...</p> : (filteredNews.length > 0 ? (
              filteredNews.map((item, index) => (
                <Reveal className="news-card glass" key={index} delay={index * 0.1}>
                  <div className="news-date">{item.date}</div>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: "8px" }}>{item.tag}</span>
                    <p style={{ color: "var(--text-light)" }}>{item.title}</p>
                  </div>
                </Reveal>
              ))
            ) : (
              <p style={{ color: "var(--text-faint)" }}>No recent updates available for this category.</p>
            ))}
          </div>
        </div>

        <div className="events-panel glass">
          <h3 style={{ fontSize: "1.25rem", marginBottom: "24px" }} className="gradient-text">Upcoming Events</h3>
          <ul className="events-list">
            <Reveal delay={0.1}>
              <li className="event-item">
                <div className="event-calendar">
                  <span>AUG</span>
                  <strong>24</strong>
                </div>
                <div className="event-info">
                  <h4>Tech Symposium 2024</h4>
                  <p>National level technical paper presentation & coding challenge.</p>
                </div>
              </li>
            </Reveal>
            <Reveal delay={0.2}>
              <li className="event-item">
                <div className="event-calendar">
                  <span>SEP</span>
                  <strong>15</strong>
                </div>
                <div className="event-info">
                  <h4>Mega Placement Drive</h4>
                  <p>Over 40+ MNCs visiting campus for recruitment.</p>
                </div>
              </li>
            </Reveal>
            <Reveal delay={0.3}>
              <li className="event-item">
                <div className="event-calendar">
                  <span>OCT</span>
                  <strong>10</strong>
                </div>
                <div className="event-info">
                  <h4>Alumni Meet & Greet</h4>
                  <p>Annual gathering of LITAM alumni for networking and mentorship.</p>
                </div>
              </li>
            </Reveal>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Placements() {
  const duplicatedRecruiters = useMemo(() => [...recruiters, ...recruiters], []);

  return (
    <section className="section" id="placements">
      <div className="glowing-orb orb-primary" style={{ top: "10%", right: "10%" }} />
      <Reveal>
        <SectionHeading
          eyebrow="Placements"
          title="Launch your career with guaranteed industrial momentum."
          text="LITAM's active training and placement cell runs exhaustive aptitude preparation, mock coding challenges, and direct recruiter onboarding."
        />
      </Reveal>

      <div className="placement-highlights">
        <Reveal className="placement-highlight glass">
          <span>Highest CTC Package</span>
          <strong>12 LPA</strong>
          <p>Students placed across software architectures, web design, core hardware systems, and corporate consulting.</p>
        </Reveal>
        <Reveal className="placement-highlight glass" delay={0.1}>
          <span>Training Hours</span>
          <strong>300+ Hrs</strong>
          <p>Structured coaching in quantitative methods, data structures, professional styling, and resume building.</p>
        </Reveal>
      </div>

      <Reveal style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "1.15rem", color: "var(--text-muted)" }}>Our Recruiter Network</h3>
      </Reveal>
      
      <div className="recruiters-marquee" aria-label="Recruiters carousel">
        <motion.div
          className="recruiters-track"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {duplicatedRecruiters.map((company, index) => (
            <div className="logo-item" key={index}>
              <img
                src={company.logo}
                alt={company.alt}
                className="company-logo"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function StudentLifeSection() {
  return (
    <section className="section" id="campus">
      <div className="glowing-orb orb-accent" style={{ bottom: "10%", left: "5%" }} />
      <Reveal>
        <SectionHeading
          eyebrow="Student Life"
          title="A campus rhythm balancing focus and self-discovery."
          text="Academics at LITAM is coupled with vibrant student associations, multi-disciplinary clubs, and secure support infrastructure."
        />
      </Reveal>

      <div className="courses-grid" style={{ marginTop: "16px" }}>
        {studentLife.map(([title, text], idx) => (
          <Reveal className="course-card glass" key={title} delay={idx * 0.05}>
            <strong>{title}</strong>
            <p>{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section" id="testimonials">
      <div className="glowing-orb orb-primary" style={{ top: "40%", left: "20%" }} />
      <Reveal>
        <SectionHeading
          eyebrow="Success Stories"
          title="Confidence builds when candidates are seen, challenged & mentored."
          text="Hear directly from recent graduates who translated classroom teachings into high-paying professional roles."
        />
      </Reveal>

      <Reveal className="slider-container glass glass-card">
        <div className="slider-track">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="slider-item"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p>&quot;{testimonials[index].quote}&quot;</p>
              <div className="slider-item-meta">
                <strong>{testimonials[index].name}</strong>
                <span>{testimonials[index].meta}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="slider-controls">
          <div className="slider-pagination">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${index === idx ? "active" : ""}`}
                onClick={() => setIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
          <div className="slider-buttons">
            <button className="slider-btn" onClick={handlePrev} aria-label="Previous Slide">←</button>
            <button className="slider-btn" onClick={handleNext} aria-label="Next Slide">→</button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function GalleryPreview() {
  return (
    <section className="section" id="gallery">
      <Reveal>
        <SectionHeading
          eyebrow="Gallery"
          title="A preview of our modern laboratory & research infrastructure."
          text="Step inside our high-tech digital computing labs, academic halls, and resource-filled libraries."
        />
      </Reveal>
      <div className="gallery-grid" style={{ marginTop: "16px" }}>
        {gallery.map((item, index) => (
          <Reveal className="gallery-item" key={item.title} delay={index * 0.05}>
            <img src={item.image} alt={item.title} loading="lazy" />
            <div className="gallery-overlay">
              <span>{item.title}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", course: "btech", message: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Full name is required";
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^[0-9\s+-]{10,15}$/.test(formData.phone.trim())) {
      tempErrors.phone = "Provide a valid phone number";
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      tempErrors.email = "Provide a valid email address";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1200);
    }
  };

  return (
    <section className="section" id="contact">
      <div className="glowing-orb orb-primary" style={{ bottom: "5%", right: "15%" }} />
      <Reveal>
        <SectionHeading
          eyebrow="Contact Us"
          title="Direct queries to our admissions & partnership cells."
          text="Fill out the contact form below or reach out directly to secure engineering guidance and campus visit bookings."
        />
      </Reveal>

      <div className="contact-layout">
        <div className="contact-info-list">
          <Reveal className="contact-info-card glass">
            <div className="contact-info-icon">☏</div>
            <div className="contact-info-text">
              <span>Phone Enquiries</span>
              <strong>+91 9505798369</strong>
              <p>Direct support lines for counselling registration and eligibility assistance.</p>
            </div>
          </Reveal>

          <Reveal className="contact-info-card glass" delay={0.05}>
            <div className="contact-info-icon">✉</div>
            <div className="contact-info-text">
              <span>Office Desk Support</span>
              <strong>+91 7416516222</strong>
              <p>Reach out for academic certification issues, fees, hostels, and bus routes.</p>
            </div>
          </Reveal>

          <Reveal className="contact-info-card glass" delay={0.1}>
            <div className="contact-info-icon">⚲</div>
            <div className="contact-info-text">
              <span>Campus Location</span>
              <strong>Palnadu / Guntur region, AP</strong>
              <p>LITAM Engineering Campus, Andhra Pradesh, India.</p>
            </div>
          </Reveal>
        </div>

        <Reveal className="glass glass-card">
          {!isSubmitted ? (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <h3 style={{ marginBottom: "24px" }} className="gradient-text">Submit an Inquiry</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name-input">Full Name *</label>
                  <input
                    id="name-input"
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInput}
                    placeholder="Enter your name"
                  />
                  {errors.name && <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: "600" }}>{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone-input">Phone Number *</label>
                  <input
                    id="phone-input"
                    type="tel"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInput}
                    placeholder="e.g. 9876543210"
                  />
                  {errors.phone && <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: "600" }}>{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email-input">Email Address (Optional)</label>
                <input
                  id="email-input"
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInput}
                  placeholder="name@domain.com"
                />
                {errors.email && <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: "600" }}>{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="inquiry-course">Branch of Interest</label>
                <select
                  id="inquiry-course"
                  name="course"
                  className="form-select"
                  value={formData.course}
                  onChange={handleInput}
                >
                  <option value="btech">B.Tech (Engineering)</option>
                  <option value="diploma">Diploma (Polytechnic)</option>
                  <option value="postgrad">Post-Graduate (MBA/MCA)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message-input">Message / Questions</label>
                <textarea
                  id="message-input"
                  name="message"
                  className="form-input"
                  value={formData.message}
                  onChange={handleInput}
                  placeholder="Tell us about your educational background or questions..."
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "16px" }} disabled={isSubmitting}>
                {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry"}
              </button>
            </form>
          ) : (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <h3 className="gradient-text">Thank You!</h3>
              <p>Your educational inquiry has been logged successfully. An admissions advisor from LITAM will contact you via phone shortly.</p>
              <button className="btn btn-secondary" onClick={() => { setFormData({ name: "", email: "", phone: "", course: "btech", message: "" }); setIsSubmitted(false); }}>
                Submit Another Inquiry
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function WebsiteContent({ theme, onToggleTheme }) {
  return (
    <motion.main
      className="site"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <SiteHeader theme={theme} onToggleTheme={onToggleTheme} />
      <HeroSection />
      <PrincipalMessage />
      <AboutAndStats />
      <AcademicsSection />
      <EligibilityEstimator />
      <FacultyAndResearch />
      <NewsAndEvents />
      <Placements />
      <StudentLifeSection />
      <Testimonials />
      <GalleryPreview />
      <ContactSection />
      <footer className="site-footer">
        <div className="footer-inner">
          <p>© {new Date().getFullYear()} Loyola Institute of Technology & Management. All rights reserved.</p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
            Approved by AICTE | Affiliated to JNTUK | NAAC &apos;A&apos; Accredited Institution | ISO 9001:2015
          </p>
        </div>
      </footer>
    </motion.main>
  );
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("litam-theme", theme);
    } catch {
      // Storage unavailable in private browsing modes
    }
  }, [theme]);

  return (
    <>
      <AnimatePresence>
        {!introComplete && <Intro onComplete={() => setIntroComplete(true)} />}
      </AnimatePresence>
      <WebsiteContent
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      />
    </>
  );
}



