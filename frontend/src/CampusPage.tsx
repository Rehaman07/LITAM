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

const campusDefault = [
  { title: "LITAM Main Building", image: "/assets/images/Main.jpg", message: "Main administrative & academic block" },
  { title: "LITAM Campus Grounds", image: "/assets/images/Litam.jpg", message: "Sprawling green campus" }
];

const studentGalleryDefault = [
  { title: "Technical & Cultural Fests", image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80", message: "Annual campus festival celebrations" },
  { title: "Hands-on Workshops", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80", message: "Student technical hackathons and coding sprints" },
  { title: "Sports & Athletics", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80", message: "Inter-departmental sports tournament" }
];

const pickSection = (content: any, sectionName: string) => {
  if (!content || !content[sectionName] || !Array.isArray(content[sectionName])) return [];
  return content[sectionName];
};

function StudentLifeSection({ content }: { content: any }) {
  const items = pickSection(content, "student_life");
  const cards = items.length > 0
    ? items.map((item: any) => [item.title, item.message])
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
        {cards.map(([title, text]: any, idx: number) => (
          <Reveal className="course-card glass" key={title || idx} delay={idx * 0.05}>
            <strong>{title}</strong>
            <p>{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CampusGallery({ content, onSelectImage }: { content: any; onSelectImage: (img: string, title: string) => void }) {
  const campusItems = pickSection(content, "campus").filter((item: any) => item.image);
  const galleryItems = pickSection(content, "gallery").filter((item: any) => item.image);
  const items = campusItems.length > 0 ? campusItems : galleryItems;

  const cards = items.length > 0
    ? items.map((item: any) => ({ title: item.title, image: item.image, message: item.message }))
    : campusDefault;

  return (
    <section className="section" id="campus-gallery">
      <Reveal>
        <SectionHeading
          eyebrow="Campus Gallery"
          title="Explore our modern infrastructure & campus environment."
          text="Step inside our high-tech digital computing labs, academic halls, and resource-filled libraries."
        />
      </Reveal>
      <div className="gallery-grid" style={{ marginTop: "16px" }}>
        {cards.map((item: any, index: number) => (
          item.image && (
            <Reveal className="gallery-item" key={index} delay={index * 0.05}>
              <div 
                style={{ cursor: "pointer", width: "100%", height: "100%" }} 
                onClick={() => onSelectImage(item.image, item.title)}
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="gallery-overlay">
                  <span>{item.title}</span>
                </div>
              </div>
            </Reveal>
          )
        ))}
      </div>
    </section>
  );
}

function StudentGallerySection({ content, onSelectImage }: { content: any; onSelectImage: (img: string, title: string) => void }) {
  const studentLifeImages = pickSection(content, "student_life").filter((item: any) => item.image);
  const galleryImages = pickSection(content, "gallery").filter((item: any) => item.image);
  const items = studentLifeImages.length > 0 ? studentLifeImages : galleryImages;

  const cards = items.length > 0
    ? items.map((item: any) => ({ title: item.title, image: item.image, message: item.message }))
    : studentGalleryDefault;

  return (
    <section className="section" id="student-gallery" style={{ marginTop: "40px" }}>
      <Reveal>
        <SectionHeading
          eyebrow="Student Gallery"
          title="Moments & events captured from student life at LITAM."
          text="Highlights from hackathons, cultural festivals, sports tournaments, and technical workshops."
        />
      </Reveal>
      <div className="gallery-grid" style={{ marginTop: "16px" }}>
        {cards.map((item: any, index: number) => (
          item.image && (
            <Reveal className="gallery-item" key={index} delay={index * 0.05}>
              <div 
                style={{ cursor: "pointer", width: "100%", height: "100%" }}
                onClick={() => onSelectImage(item.image, item.title)}
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="gallery-overlay">
                  <span>{item.title}</span>
                </div>
              </div>
            </Reveal>
          )
        ))}
      </div>
    </section>
  );
}

export default function CampusPage({ content, theme, onToggleTheme }: { content: any; theme: string; onToggleTheme: () => void }) {
  const [activeLightbox, setActiveLightbox] = React.useState<{ image: string; title: string } | null>(null);

  return (
    <div className="page-container campus-page" style={{ paddingTop: "96px", minHeight: "100vh" }}>
      <CampusHeader theme={theme} onToggleTheme={onToggleTheme} />
      <StudentLifeSection content={content} />
      <CampusGallery content={content} onSelectImage={(image, title) => setActiveLightbox({ image, title })} />
      <StudentGallerySection content={content} onSelectImage={(image, title) => setActiveLightbox({ image, title })} />

      {activeLightbox && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setActiveLightbox(null)}
        >
          <div style={{ position: "absolute", top: "20px", right: "20px" }}>
            <button
              onClick={() => setActiveLightbox(null)}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "#fff",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
          <div onClick={(e) => e.stopPropagation()} style={{ textAlign: "center", maxWidth: "90vw", maxHeight: "85vh" }}>
            <img
              src={activeLightbox.image}
              alt={activeLightbox.title}
              style={{ maxWidth: "100%", maxHeight: "75vh", borderRadius: "12px", objectFit: "contain" }}
            />
            <h3 style={{ color: "#fff", marginTop: "12px", fontSize: "1.2rem" }}>{activeLightbox.title}</h3>
          </div>
        </div>
      )}
    </div>
  );
}
