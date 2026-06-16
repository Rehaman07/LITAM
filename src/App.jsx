import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import * as THREE from "three";

const letters = ["L", "I", "T", "A", "M"];
const navItems = [
  "Home",
  "Principal",
  "About",
  "News",
  "Events",
  "Placements",
  "Gallery",
  "Contact",
].map((label) => ({
  label,
  href: `#${label.toLowerCase()}`,
}));

const stats = [
  ["25+", "Years of academic excellence"],
  ["4,800+", "Students on campus"],
  ["92%", "Placement assistance outcomes"],
  ["120+", "Recruiting partners"],
];

const news = [
  {
    date: "16 Jun",
    title: "AI and Data Science Centre announces new industry lab sessions",
    tag: "Academics",
  },
  {
    date: "12 Jun",
    title: "Admissions help desk opens extended hours for counselling week",
    tag: "Admissions",
  },
  {
    date: "08 Jun",
    title: "Final year teams qualify for national innovation challenge",
    tag: "Achievement",
  },
];

const events = [
  ["21 Jun", "Freshers orientation and parent interaction", "Auditorium"],
  ["28 Jun", "Hack LITAM: 24-hour product sprint", "Innovation Hub"],
  ["05 Jul", "Career readiness bootcamp", "Placement Cell"],
];

const recruiters = [
  "Infosys",
  "TCS",
  "Wipro",
  "Accenture",
  "Cognizant",
  "Tech Mahindra",
  "Capgemini",
  "HCLTech",
];

const testimonials = [
  {
    quote:
      "LITAM gave me the space to build, present, fail fast, and try again. The placement preparation felt personal.",
    name: "Akhila R.",
    meta: "CSE, 2025",
  },
  {
    quote:
      "The faculty made complex subjects feel practical. Every semester had a project that pushed us closer to industry work.",
    name: "Naveen K.",
    meta: "ECE, 2024",
  },
  {
    quote:
      "Clubs, labs, and mentors helped me become confident enough to lead a team before graduating.",
    name: "Meghana S.",
    meta: "AI & DS, 2025",
  },
];

const gallery = [
  {
    title: "Innovation Hub",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Central Library",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Graduation Day",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Campus Life",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
  },
];

function CinematicField({ introDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 90);
    camera.position.set(0, 0, 16);

    const particles = new THREE.BufferGeometry();
    const count = window.innerWidth < 700 ? 420 : 760;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 24;
      positions[i3 + 1] = (Math.random() - 0.5) * 13;
      positions[i3 + 2] = (Math.random() - 0.5) * 22;

      const gold = Math.random() > 0.78;
      colors[i3] = gold ? 1 : 0.25;
      colors[i3 + 1] = gold ? 0.72 : 0.68;
      colors[i3 + 2] = gold ? 0.32 : 1;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: window.innerWidth < 700 ? 0.028 : 0.035,
      transparent: true,
      opacity: 0.72,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pointCloud = new THREE.Points(particles, particleMaterial);
    scene.add(pointCloud);

    const circuitGroup = new THREE.Group();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x2eb8ff,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < 34; i += 1) {
      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 10;
      const z = -7 - Math.random() * 7;
      const width = 0.5 + Math.random() * 1.7;
      const lift = Math.random() > 0.5 ? 0.45 : -0.45;
      const points = [
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(x + width, y, z),
        new THREE.Vector3(x + width, y + lift, z),
        new THREE.Vector3(x + width * 1.6, y + lift, z),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      circuitGroup.add(new THREE.Line(geometry, lineMaterial));
    }

    scene.add(circuitGroup);

    const ringGeometry = new THREE.RingGeometry(2.35, 2.4, 128);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x58c7ff,
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
      pointCloud.rotation.y = elapsed * 0.025;
      pointCloud.rotation.x = Math.sin(elapsed * 0.38) * 0.015;
      circuitGroup.rotation.z = Math.sin(elapsed * 0.24) * 0.015;
      circuitGroup.position.x = Math.sin(elapsed * 0.3) * 0.16;
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, introDone ? 13.2 : 14.7, 0.018);

      if (elapsed > 2.85 && elapsed < 4.25) {
        const progress = (elapsed - 2.85) / 1.4;
        ring.scale.setScalar(1 + progress * 5.6);
        ringMaterial.opacity = Math.sin(progress * Math.PI) * 0.45;
      } else {
        ringMaterial.opacity *= 0.92;
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
      lineMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, [introDone]);

  return <canvas ref={canvasRef} className="atmosphere-canvas" aria-hidden="true" />;
}

function Intro({ onComplete }) {
  const [exit, setExit] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 70, damping: 22, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 70, damping: 22, mass: 0.6 });
  const bgX = useTransform(springX, [-1, 1], [-18, 18]);
  const bgY = useTransform(springY, [-1, 1], [-10, 10]);
  const bgTwoX = useTransform(bgX, (value) => value * -0.55);
  const bgTwoY = useTransform(bgY, (value) => value * -0.45);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setExit(true), 3600);
    const doneTimer = window.setTimeout(onComplete, 4450);
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
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      aria-label="LITAM cinematic intro"
    >
      <CinematicField introDone={exit} />
      <motion.div className="mesh mesh-one" style={{ x: bgX, y: bgY }} />
      <motion.div className="mesh mesh-two" style={{ x: bgTwoX, y: bgTwoY }} />
      <motion.div
        className="light-rays"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.65, 0.45, 0.75] }}
        transition={{ duration: 3.2, delay: 0.45, ease: "easeOut" }}
      />
      <motion.div
        className="scan-beam"
        initial={{ x: "-65vw", opacity: 0 }}
        animate={{ x: "68vw", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.15, delay: 0.86, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="camera-stage"
        initial={{ scale: 0.88, z: 0 }}
        animate={{ scale: [0.88, 0.94, 1], y: [10, 0, -2] }}
        transition={{ duration: 4.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="logo-wrap" aria-label="LITAM">
          {letters.map((letter, index) => (
            <motion.span
              className="metal-letter"
              key={letter}
              initial={{ opacity: 0, y: 42, rotateX: 72, filter: "blur(18px)", scale: 0.82 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 92,
                damping: 18,
                mass: 0.9,
                delay: 1.1 + index * 0.18,
              }}
              data-letter={letter}
              style={{ "--letter-delay": `${1.25 + index * 0.14}s` }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        <motion.div
          className="energy-ring"
          initial={{ opacity: 0, scale: 0.42 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.42, 1.1, 2.45] }}
          transition={{ duration: 1.45, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.p
          className="tagline"
          initial={{ opacity: 0, y: 14, letterSpacing: "0.34em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.16em" }}
          transition={{ duration: 1.15, delay: 3.0, ease: [0.16, 1, 0.3, 1] }}
        >
          Empowering Minds. Building Futures.
        </motion.p>
      </motion.div>
      <motion.div
        className="lens-flare"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: [0, 0.75, 0.25], scale: [0.7, 1.1, 1] }}
        transition={{ duration: 1.4, delay: 2.45, ease: "easeOut" }}
      />
    </motion.section>
  );
}

function SiteHeader({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="site-header">
      <div className="header-inner">
        <a className="brand-lockup" href="#home" aria-label="LITAM home">
          <span className="brand-mark">L</span>
          <span className="brand-copy">
            <strong>LITAM</strong>
            <small>Loyola Institute of Technology and Management</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links("nav-list")}
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label="Toggle theme">
            <span aria-hidden="true">{theme === "dark" ? "☾" : "☀"}</span>
          </button>
          <button
            className="menu-toggle"
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            <span className="sr-only">{menuOpen ? "Close navigation" : "Open navigation"}</span>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
      <motion.nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile primary navigation"
        initial={false}
        animate={menuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto", y: 0, pointerEvents: "auto" },
          closed: { opacity: 0, height: 0, y: -8, pointerEvents: "none" },
        }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      >
        {links("mobile-nav-list")}
      </motion.nav>
    </header>
  );
}

function Reveal({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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

function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="hero-media" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=82"
          alt=""
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-content">
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Innovation-led education
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.66, ease: [0.16, 1, 0.3, 1] }}
        >
          Loyola Institute of Technology and Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.62 }}
        >
          A disciplined, future-facing campus where engineering ambition meets mentorship, modern labs,
          and career-ready learning.
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.58 }}
        >
          <a className="primary-action" href="#about">
            Explore LITAM
          </a>
          <a className="secondary-action" href="#placements">
            View placements
          </a>
        </motion.div>
      </div>
      <div className="hero-panel">
        <span>Admissions 2026</span>
        <strong>Counselling support open</strong>
        <p>Programs in CSE, AI & DS, ECE, EEE, Mechanical, and Civil Engineering.</p>
      </div>
    </section>
  );
}

function PrincipalMessage() {
  return (
    <section className="section principal" id="principal">
      <Reveal className="principal-card">
        <div className="principal-portrait">
          <img
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=80"
            alt="Principal portrait"
          />
        </div>
        <div>
          <span className="eyebrow">Principal's Message</span>
          <h2>Education that builds skill, character, and confidence.</h2>
          <p>
            At LITAM, we prepare students to think clearly, solve responsibly, and lead with integrity.
            Our focus is not only academic achievement, but the habits that turn knowledge into useful
            work for society and industry.
          </p>
          <strong>Dr. A. Ramanathan</strong>
          <small>Principal, LITAM</small>
        </div>
      </Reveal>
    </section>
  );
}

function AboutAndStats() {
  return (
    <section className="section split-section" id="about">
      <Reveal>
        <SectionHeading
          eyebrow="About LITAM"
          title="A campus designed for rigorous learning and practical outcomes."
          text="LITAM brings together strong fundamentals, project-based learning, active mentoring, and a campus culture built around curiosity and service."
        />
      </Reveal>
      <div className="stats-grid">
        {stats.map(([value, label], index) => (
          <Reveal className="stat-card" key={label}>
            <motion.strong
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              {value}
            </motion.strong>
            <span>{label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function NewsAndEvents() {
  return (
    <section className="section news-events" id="news">
      <Reveal>
        <SectionHeading
          eyebrow="Latest updates"
          title="News, announcements, and campus moments."
          text="Stay close to academic alerts, student achievements, and opportunities around campus."
        />
      </Reveal>
      <div className="content-grid">
        <div className="news-list">
          {news.map((item) => (
            <Reveal className="news-card" key={item.title}>
              <time>{item.date}</time>
              <div>
                <span>{item.tag}</span>
                <h3>{item.title}</h3>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="events-card" id="events">
          <span className="eyebrow">Upcoming Events</span>
          {events.map(([date, title, place]) => (
            <div className="event-row" key={title}>
              <time>{date}</time>
              <div>
                <strong>{title}</strong>
                <span>{place}</span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Placements() {
  const duplicatedRecruiters = useMemo(() => [...recruiters, ...recruiters], []);

  return (
    <section className="section placements" id="placements">
      <Reveal>
        <SectionHeading
          eyebrow="Placements"
          title="Career preparation with measurable momentum."
          text="The placement cell blends aptitude training, technical mentoring, interview readiness, and recruiter engagement."
        />
      </Reveal>
      <div className="placement-grid">
        <Reveal className="placement-highlight">
          <span>Highest package</span>
          <strong>12 LPA</strong>
          <p>Students placed across software, core engineering, consulting, and emerging technology roles.</p>
        </Reveal>
        <Reveal className="placement-highlight">
          <span>Training hours</span>
          <strong>300+</strong>
          <p>Structured preparation across communication, aptitude, coding, and domain interviews.</p>
        </Reveal>
      </div>
      <div className="recruiter-marquee" aria-label="Recruiters carousel">
        <motion.div
          className="recruiter-track"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        >
          {duplicatedRecruiters.map((name, index) => (
            <span key={`${name}-${index}`}>{name}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section testimonials">
      <Reveal>
        <SectionHeading
          eyebrow="Student voices"
          title="Confidence grows when students are seen, guided, and challenged."
        />
      </Reveal>
      <div className="testimonial-grid">
        {testimonials.map((item) => (
          <Reveal className="testimonial-card" key={item.name}>
            <p>“{item.quote}”</p>
            <strong>{item.name}</strong>
            <span>{item.meta}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function GalleryPreview() {
  return (
    <section className="section gallery-section" id="gallery">
      <Reveal>
        <SectionHeading
          eyebrow="Gallery"
          title="A quick look at spaces where learning becomes memorable."
        />
      </Reveal>
      <div className="gallery-grid">
        {gallery.map((item) => (
          <Reveal className="gallery-item" key={item.title}>
            <img src={item.image} alt={item.title} loading="lazy" />
            <span>{item.title}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ContactInfo() {
  return (
    <section className="section contact-section" id="contact">
      <Reveal className="contact-card">
        <div>
          <span className="eyebrow">Contact</span>
          <h2>Talk to LITAM admissions and campus support.</h2>
          <p>Reach out for admissions, campus visits, academic information, and placement partnerships.</p>
        </div>
        <div className="contact-list">
          <a href="tel:+919876543210">+91 98765 43210</a>
          <a href="mailto:info@litam.edu.in">info@litam.edu.in</a>
          <span>LITAM Campus, Andhra Pradesh, India</span>
        </div>
      </Reveal>
    </section>
  );
}

function WebsiteContent({ theme, onToggleTheme }) {
  return (
    <motion.main
      className="site"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      <SiteHeader theme={theme} onToggleTheme={onToggleTheme} />
      <HeroSection />
      <PrincipalMessage />
      <AboutAndStats />
      <NewsAndEvents />
      <Placements />
      <Testimonials />
      <GalleryPreview />
      <ContactInfo />
    </motion.main>
  );
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("litam-theme") || "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("litam-theme", theme);
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
