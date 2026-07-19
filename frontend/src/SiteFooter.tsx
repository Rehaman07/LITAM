

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p>© {new Date().getFullYear()} Loyola Institute of Technology & Management. All rights reserved.</p>
        <p style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
          Approved by AICTE | Affiliated to JNTUK | NAAC &apos;A&apos; Accredited Institution | ISO 9001:2015
        </p>
      </div>
    </footer>
  );
}
