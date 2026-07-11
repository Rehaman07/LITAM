const fs = require('fs');
const css = `
:root[data-theme="light"] .section-admissions { background-color: var(--bg-admissions, #FFF8E8); }
:root[data-theme="light"] .section-admissions .glass { border-left: 4px solid var(--brand-orange); }

:root[data-theme="light"] .section-placements { background-color: var(--bg-placements, #EEF7FF); }
:root[data-theme="light"] .section-placements .glass { border-left: 4px solid var(--brand-green); }

:root[data-theme="light"] .section-academics { background-color: var(--bg-labs, #F2FFF5); }
:root[data-theme="light"] .section-academics .glass { border-left: 4px solid var(--brand-purple); }

:root[data-theme="light"] .section-faculty { background-color: var(--bg-research, #FFF2FA); }
:root[data-theme="light"] .section-faculty .glass { border-left: 4px solid var(--brand-blue); }

:root[data-theme="light"] .section-updates { background-color: var(--bg-events, #fdf5ff); }
:root[data-theme="light"] .section-campus { background-color: var(--bg-campus, #f0faff); }
:root[data-theme="light"] .section-gallery { background-color: #f1f5f9; }

:root[data-theme="light"] .btn-admissions { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white !important; border: none; box-shadow: 0 4px 15px rgba(234, 88, 12, 0.3); }
:root[data-theme="light"] .btn-placements { background: transparent; color: var(--brand-green) !important; border: 2px solid var(--brand-green); box-shadow: none; }
:root[data-theme="light"] .btn-placements:hover { background: var(--brand-green); color: white !important; }

:root[data-theme="light"] .principal-card {
  background: linear-gradient(135deg, #ffffff, #eef5ff) !important;
  box-shadow: 0 20px 60px rgba(0,0,0,.08) !important;
  border-radius: 32px !important;
  flex-direction: row;
  align-items: center;
}
:root[data-theme="light"] .principal-portrait {
  box-shadow: 0 25px 45px rgba(30,70,180,.18) !important;
}
@media (max-width: 768px) {
  :root[data-theme="light"] .principal-card { flex-direction: column; }
}

.principal-portrait img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}
`;
fs.appendFileSync('d:/RehamanWorkSpace/Projects/LITAM/frontend/src/styles.css', css, 'utf8');
