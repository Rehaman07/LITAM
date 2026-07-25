import React, { useState, useMemo } from "react";
import "./GradeCalculator.css";

// Preset Grading Systems
interface GradeScale {
  [key: string]: number;
}

interface SystemInfo {
  name: string;
  scale: GradeScale;
  descriptions?: { [grade: string]: string };
}

const GRADING_SYSTEMS: { [key: string]: SystemInfo } = {
  jntuk_r23: {
    name: "JNTUK R23 Regulation (S=10, A=9, B=8, C=7, D=6, E=5, F=0)",
    scale: { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0 },
    descriptions: {
      S: "Outstanding (≥ 90%)",
      A: "Excellent (80–89%)",
      B: "Very Good (70–79%)",
      C: "Good (60–69%)",
      D: "Fair (50–59%)",
      E: "Sufficient (40–49%)",
      F: "Fail (< 40%)",
    },
  },
  jntuk_r20: {
    name: "JNTUK R20 Regulation (O=10, S=9, A=8, B=7, C=6, D=4, F=0)",
    scale: { O: 10, S: 9, A: 8, B: 7, C: 6, D: 4, F: 0 },
    descriptions: {
      O: "Outstanding (≥ 90%)",
      S: "Excellent (80–89%)",
      A: "Very Good (70–79%)",
      B: "Good (60–69%)",
      C: "Fair (50–59%)",
      D: "Satisfactory (40–49%)",
      F: "Fail (< 40%)",
    },
  },
  autonomous: {
    name: "Autonomous / Standard (O=10, A+=9, A=8, B+=7, B=6, C=5, D=4, F=0)",
    scale: { O: 10, "A+": 9, A: 8, "B+": 7, B: 6, C: 5, D: 4, F: 0 },
  },
  letter_10: {
    name: "10-Point Scale (A+=10, A=9, B+=8, B=7, C+=6, C=5, D=4, F=0)",
    scale: { "A+": 10, A: 9, "B+": 8, B: 7, "C+": 6, C: 5, D: 4, F: 0 },
  },
};

interface FormulaInfo {
  name: string;
  calc: (val: number) => number;
  formulaText: string;
  explanation?: string;
}

const PERCENTAGE_FORMULAS: { [key: string]: FormulaInfo } = {
  jntuk_official: {
    name: "Official Offset: (CGPA - 0.75) × 10",
    calc: (val: number) => (val > 0.75 ? (val - 0.75) * 10 : 0),
    formulaText: "Percentage (%) = (CGPA - 0.75) × 10",
    explanation: "Standard university reduction formula normalizing grade points into percentage marks.",
  },
  jntuk_direct: {
    name: "Direct Scale: CGPA × 10",
    calc: (val: number) => val * 10,
    formulaText: "Percentage (%) = CGPA × 10",
  },
  cbse: {
    name: "Standard CBSE: CGPA × 9.5",
    calc: (val: number) => val * 9.5,
    formulaText: "Percentage (%) = CGPA × 9.5",
  },
};

export interface CourseRow {
  id: string;
  name: string;
  credits: string;
  grade: string;
}

export interface SemesterRow {
  id: string;
  name: string;
  sgpa: string;
  credits: string;
}

const initialCourses: CourseRow[] = [
  { id: "course-1", name: "Course 1", credits: "3", grade: "Select" },
  { id: "course-2", name: "Course 2", credits: "3", grade: "Select" },
  { id: "course-3", name: "Course 3", credits: "3", grade: "Select" },
  { id: "course-4", name: "Course 4", credits: "3", grade: "Select" },
];

const initialSemesters: SemesterRow[] = Array.from({ length: 4 }, (_, i) => ({
  id: `sem-${i + 1}`,
  name: `Semester ${i + 1}`,
  sgpa: "0",
  credits: "20",
}));

const zeroSgpaResult = {
  sgpa: "0.00",
  numSgpa: 0,
  totalCredits: "0.0",
  totalCreditPoints: "0.00",
  percentage: "0.00",
};

const zeroCgpaResult = {
  cgpa: "0.00",
  numCgpa: 0,
  totalCredits: "0.0",
  totalWeightedPoints: "0.00",
  validSemesters: 0,
  percentage: "0.00",
};

export function GradeCalculator() {
  const [activeTab, setActiveTab] = useState<"sgpa" | "cgpa">("sgpa");
  const [selectedSystemKey, setSelectedSystemKey] = useState("jntuk_r23");
  const [selectedFormulaKey, setSelectedFormulaKey] = useState("jntuk_official");
  const [showScaleModal, setShowScaleModal] = useState(false);
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  const [courses, setCourses] = useState<CourseRow[]>(initialCourses);
  const [semesters, setSemesters] = useState<SemesterRow[]>(initialSemesters);

  // Explicit calculation results state (default at zero until Calculate button is clicked)
  const [displayedSgpa, setDisplayedSgpa] = useState(zeroSgpaResult);
  const [displayedCgpa, setDisplayedCgpa] = useState(zeroCgpaResult);
  const [hasCalculated, setHasCalculated] = useState(false);

  const currentSystem = GRADING_SYSTEMS[selectedSystemKey] || GRADING_SYSTEMS.jntuk_r23;
  const currentGradeScale = currentSystem.scale;
  const currentDescriptions = currentSystem.descriptions;
  const currentFormulaObj = PERCENTAGE_FORMULAS[selectedFormulaKey] || PERCENTAGE_FORMULAS.jntuk_official;
  const currentFormula = currentFormulaObj.calc;

  // Live calculation of current course inputs
  const liveSgpaResult = useMemo(() => {
    let totalCredits = 0;
    let totalCreditPoints = 0;

    courses.forEach((c) => {
      const cr = parseFloat(c.credits);
      const gp = currentGradeScale[c.grade] ?? 0;
      if (!isNaN(cr) && cr > 0 && c.grade !== "Select") {
        totalCredits += cr;
        totalCreditPoints += cr * gp;
      }
    });

    const sgpa = totalCredits > 0 ? totalCreditPoints / totalCredits : 0;
    const percentage = currentFormula(sgpa);

    return {
      sgpa: sgpa.toFixed(2),
      numSgpa: sgpa,
      totalCredits: totalCredits.toFixed(1),
      totalCreditPoints: totalCreditPoints.toFixed(2),
      percentage: percentage.toFixed(2),
    };
  }, [courses, currentGradeScale, currentFormula]);

  // Live calculation of current semester inputs
  const liveCgpaResult = useMemo(() => {
    let totalCredits = 0;
    let totalWeightedPoints = 0;
    let validCount = 0;

    semesters.forEach((s) => {
      const sg = parseFloat(s.sgpa);
      const cr = parseFloat(s.credits);
      if (!isNaN(sg) && !isNaN(cr) && sg > 0 && cr > 0) {
        totalWeightedPoints += sg * cr;
        totalCredits += cr;
        validCount++;
      }
    });

    const cgpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
    const percentage = currentFormula(cgpa);

    return {
      cgpa: cgpa.toFixed(2),
      numCgpa: cgpa,
      totalCredits: totalCredits.toFixed(1),
      totalWeightedPoints: totalWeightedPoints.toFixed(2),
      validSemesters: validCount,
      percentage: percentage.toFixed(2),
    };
  }, [semesters, currentFormula]);

  // Handle Calculate Button Click
  const handleCalculate = () => {
    if (activeTab === "sgpa") {
      setDisplayedSgpa(liveSgpaResult);
    } else {
      setDisplayedCgpa(liveCgpaResult);
    }
    setHasCalculated(true);
  };

  // Handlers for SGPA Courses
  const handleCourseChange = (id: string, field: keyof CourseRow, value: string) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleAddCourse = () => {
    const nextIdx = courses.length + 1;
    setCourses((prev) => [
      ...prev,
      { id: `course-${Date.now()}`, name: `Course ${nextIdx}`, credits: "3", grade: "Select" },
    ]);
  };

  const handleRemoveCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleResetSgpa = () => {
    setCourses(initialCourses);
    setDisplayedSgpa(zeroSgpaResult);
    setHasCalculated(false);
  };

  // Handlers for CGPA Semesters
  const handleSemesterChange = (id: string, field: keyof SemesterRow, value: string) => {
    setSemesters((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleAddSemester = () => {
    const nextIdx = semesters.length + 1;
    setSemesters((prev) => [
      ...prev,
      { id: `sem-${Date.now()}`, name: `Semester ${nextIdx}`, sgpa: "0", credits: "20" },
    ]);
  };

  const handleRemoveSemester = (id: string) => {
    if (semesters.length <= 1) return;
    setSemesters((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResetCgpa = () => {
    setSemesters(initialSemesters);
    setDisplayedCgpa(zeroCgpaResult);
    setHasCalculated(false);
  };

  // Active Displayed Value & Classification Status
  const activeValue = activeTab === "sgpa" ? displayedSgpa.numSgpa : displayedCgpa.numCgpa;
  let statusBadge = { label: "Pending", class: "status-pending", level: "neutral" };
  
  if (hasCalculated && activeValue > 0) {
    if (activeValue >= 8.5) {
      statusBadge = { label: "Outstanding 🌟", class: "status-excellent", level: "green" };
    } else if (activeValue >= 7.75) {
      statusBadge = { label: "First Class with Distinction ✨", class: "status-excellent", level: "green" };
    } else if (activeValue >= 6.75) {
      statusBadge = { label: "First Class 🎖️", class: "status-good", level: "green" };
    } else if (activeValue >= 5.75) {
      statusBadge = { label: "Second Class 👍", class: "status-average", level: "orange" };
    } else if (activeValue >= 5.0) {
      statusBadge = { label: "Pass Division ✔️", class: "status-average", level: "orange" };
    } else {
      statusBadge = { label: "Needs Improvement ⚠️", class: "status-fail", level: "red" };
    }
  }

  // Radial Gauge Calculations
  const radius = 65;
  const circumference = Math.PI * radius;
  const progressRatio = Math.min(Math.max(activeValue / 10, 0), 1);
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <section className="grade-calc-section" id="grade-calculator">
      <div className="grade-calc-shell">
        {/* Header */}
        <header className="grade-calc-header">
          <div className="grade-calc-header-brand">
            <h2 className="grade-calc-main-title">Academic Grade Calculator</h2>
            <p className="grade-calc-subtitle">Calculate SGPA &amp; Percentage</p>
          </div>

          <div className="grade-calc-mode-nav">
            <div className="grade-calc-switcher">
              <button
                type="button"
                className={`grade-calc-tab-btn ${activeTab === "sgpa" ? "active" : ""}`}
                onClick={() => setActiveTab("sgpa")}
              >
                SGPA
              </button>
              <button
                type="button"
                className={`grade-calc-tab-btn ${activeTab === "cgpa" ? "active" : ""}`}
                onClick={() => setActiveTab("cgpa")}
              >
                CGPA
              </button>
            </div>
          </div>
        </header>

        {/* Core Dashboard Grid */}
        <div className="grade-calc-dashboard">
          {/* Left Input Panel */}
          <div className="grade-calc-input-panel">
            {/* Toolbar */}
            <div className="grade-calc-toolbar">
              <div className="grade-calc-system-picker">
                <label htmlFor="system-select-dropdown" className="visually-hidden">Grading Regulation</label>
                <select
                  id="system-select-dropdown"
                  className="grade-calc-select-pill"
                  value={selectedSystemKey}
                  onChange={(e) => setSelectedSystemKey(e.target.value)}
                >
                  {Object.keys(GRADING_SYSTEMS).map((key) => (
                    <option key={key} value={key}>
                      {GRADING_SYSTEMS[key].name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="grade-calc-icon-btn"
                onClick={() => setShowScaleModal(!showScaleModal)}
                title="View Grade Scale & Conversion Rules"
              >
                <span>ⓘ Grade Scale</span>
              </button>
            </div>

            {/* Collapsible Grade Scale Reference */}
            {showScaleModal && (
              <div className="grade-scale-drawer">
                <div className="drawer-header">
                  <span className="drawer-title">Grade Scale Reference ({currentSystem.name})</span>
                  <button
                    type="button"
                    className="drawer-close"
                    onClick={() => setShowScaleModal(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="grade-scale-grid">
                  {Object.entries(currentGradeScale).map(([grade, pt]) => {
                    const desc = currentDescriptions?.[grade] ? ` (${currentDescriptions[grade]})` : "";
                    return (
                      <div key={grade} className="grade-scale-item">
                        <span className="grade-badge">{grade}</span>
                        <span className="grade-pts">{pt} pts</span>
                        {desc && <span className="grade-desc">{desc}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SGPA TAB CONTENT */}
            {activeTab === "sgpa" ? (
              <div className="grade-calc-content-area">
                {/* Desktop View Table */}
                <div className="grade-calc-table-desktop">
                  <table className="grade-calc-clean-table">
                    <thead>
                      <tr>
                        <th style={{ width: "45%" }}>Course Name</th>
                        <th style={{ width: "20%" }}>Credit</th>
                        <th style={{ width: "22%" }}>Grade</th>
                        <th style={{ width: "13%", textAlign: "right" }}>Points</th>
                        <th style={{ width: "40px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => {
                        const cr = parseFloat(course.credits) || 0;
                        const gp = currentGradeScale[course.grade] ?? 0;
                        const cp = course.grade !== "Select" ? cr * gp : 0;

                        return (
                          <tr key={course.id} className="clean-row">
                            <td>
                              <input
                                type="text"
                                className="clean-input-text"
                                value={course.name}
                                onChange={(e) => handleCourseChange(course.id, "name", e.target.value)}
                                placeholder="Course Name"
                              />
                            </td>
                            <td>
                              <div className="clean-input-num-wrapper">
                                <input
                                  type="number"
                                  min="0.5"
                                  max="20"
                                  step="0.5"
                                  className="clean-input-num"
                                  value={course.credits}
                                  onChange={(e) => handleCourseChange(course.id, "credits", e.target.value)}
                                />
                              </div>
                            </td>
                            <td>
                              <select
                                className="clean-select"
                                value={course.grade}
                                onChange={(e) => handleCourseChange(course.id, "grade", e.target.value)}
                              >
                                <option value="Select">-- Select Grade --</option>
                                {Object.keys(currentGradeScale).map((g) => (
                                  <option key={g} value={g}>
                                    {g} ({currentGradeScale[g]} pts)
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <span className="points-display-val">{cp.toFixed(1)}</span>
                            </td>
                            <td>
                              {courses.length > 1 && (
                                <button
                                  type="button"
                                  className="row-delete-btn"
                                  title="Remove Course"
                                  onClick={() => handleRemoveCourse(course.id)}
                                >
                                  ✕
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Cards */}
                <div className="grade-calc-cards-mobile">
                  {courses.map((course, idx) => {
                    const cr = parseFloat(course.credits) || 0;
                    const gp = currentGradeScale[course.grade] ?? 0;
                    const cp = course.grade !== "Select" ? cr * gp : 0;

                    return (
                      <div className="mobile-course-card" key={course.id}>
                        <div className="mobile-card-header">
                          <input
                            type="text"
                            className="mobile-card-title-input"
                            value={course.name}
                            onChange={(e) => handleCourseChange(course.id, "name", e.target.value)}
                            placeholder={`Course ${idx + 1}`}
                          />
                          {courses.length > 1 && (
                            <button
                              type="button"
                              className="row-delete-btn"
                              onClick={() => handleRemoveCourse(course.id)}
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="mobile-card-controls">
                          <div className="mobile-field-group">
                            <label>Credit</label>
                            <input
                              type="number"
                              min="0.5"
                              max="20"
                              step="0.5"
                              className="clean-input-num"
                              value={course.credits}
                              onChange={(e) => handleCourseChange(course.id, "credits", e.target.value)}
                            />
                          </div>

                          <div className="mobile-field-group">
                            <label>Grade</label>
                            <select
                              className="clean-select"
                              value={course.grade}
                              onChange={(e) => handleCourseChange(course.id, "grade", e.target.value)}
                            >
                              <option value="Select">-- Select --</option>
                              {Object.keys(currentGradeScale).map((g) => (
                                <option key={g} value={g}>
                                  {g} ({currentGradeScale[g]} pts)
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mobile-field-group points-group">
                            <label>Points</label>
                            <div className="mobile-points-val">{cp.toFixed(1)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Secondary Actions */}
                <div className="grade-calc-footer-actions">
                  <button type="button" className="btn-secondary-link" onClick={handleAddCourse}>
                    <span>+</span> Add Course
                  </button>
                  <button type="button" className="btn-secondary-link text-subtle" onClick={handleResetSgpa}>
                    <span>↺</span> Reset
                  </button>
                </div>
              </div>
            ) : (
              /* CGPA TAB CONTENT */
              <div className="grade-calc-content-area">
                <div className="cgpa-semesters-list">
                  {semesters.map((sem) => {
                    const sg = parseFloat(sem.sgpa) || 0;
                    const cr = parseFloat(sem.credits) || 0;
                    const pts = sg * cr;

                    return (
                      <div className="cgpa-row-item" key={sem.id}>
                        <div className="cgpa-row-main">
                          <input
                            type="text"
                            className="clean-input-text sem-name-input"
                            value={sem.name}
                            onChange={(e) => handleSemesterChange(sem.id, "name", e.target.value)}
                          />
                          <div className="cgpa-inputs-flex">
                            <div className="cgpa-field">
                              <label>SGPA</label>
                              <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.01"
                                className="clean-input-num"
                                value={sem.sgpa}
                                onChange={(e) => handleSemesterChange(sem.id, "sgpa", e.target.value)}
                              />
                            </div>
                            <div className="cgpa-field">
                              <label>Credits</label>
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                className="clean-input-num"
                                value={sem.credits}
                                onChange={(e) => handleSemesterChange(sem.id, "credits", e.target.value)}
                              />
                            </div>
                            <div className="cgpa-field pts-field">
                              <label>Weighted Pts</label>
                              <span className="points-display-val">{pts.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        {semesters.length > 1 && (
                          <button
                            type="button"
                            className="row-delete-btn"
                            onClick={() => handleRemoveSemester(sem.id)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="grade-calc-footer-actions">
                  <button type="button" className="btn-secondary-link" onClick={handleAddSemester}>
                    <span>+</span> Add Semester
                  </button>
                  <button type="button" className="btn-secondary-link text-subtle" onClick={handleResetCgpa}>
                    <span>↺</span> Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Results Dashboard */}
          <div className="grade-calc-results-panel">
            {/* Focal Result Card */}
            <div className={`focal-result-card ${statusBadge.level}`}>
              <div className="focal-gauge-wrapper">
                <svg className="focal-gauge-svg" viewBox="0 0 160 100">
                  <defs>
                    <linearGradient id="primaryGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  <path className="focal-gauge-bg" d="M 15 90 A 65 65 0 0 1 145 90" />
                  <path
                    className="focal-gauge-fill"
                    d="M 15 90 A 65 65 0 0 1 145 90"
                    stroke="url(#primaryGaugeGrad)"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>

                <div className="focal-metric-overlay">
                  <span className="focal-metric-label">{activeTab === "sgpa" ? "SGPA" : "CGPA"}</span>
                  <div className="focal-score-display">
                    {activeTab === "sgpa" ? displayedSgpa.sgpa : displayedCgpa.cgpa}
                  </div>
                  <span className={`focal-status-badge ${statusBadge.class}`}>
                    {statusBadge.label}
                  </span>
                </div>
              </div>

              {/* Percentage Result Card */}
              <div className="percentage-card">
                <div className="perc-card-header">
                  <span className="perc-card-title">Percentage</span>
                  <button
                    type="button"
                    className="formula-tooltip-trigger"
                    onClick={() => setShowFormulaTooltip(!showFormulaTooltip)}
                    title="Toggle Formula Details"
                  >
                    ⓘ Formula
                  </button>
                </div>
                <div className="perc-card-val">
                  {activeTab === "sgpa" ? displayedSgpa.percentage : displayedCgpa.percentage}%
                </div>

                {showFormulaTooltip && (
                  <div className="formula-tooltip-popover">
                    <div className="formula-select-row">
                      <select
                        className="clean-select formula-select"
                        value={selectedFormulaKey}
                        onChange={(e) => setSelectedFormulaKey(e.target.value)}
                      >
                        {Object.keys(PERCENTAGE_FORMULAS).map((fk) => (
                          <option key={fk} value={fk}>
                            {PERCENTAGE_FORMULAS[fk].name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="formula-expression">{currentFormulaObj.formulaText}</div>
                    {currentFormulaObj.explanation && (
                      <p className="formula-explanation">{currentFormulaObj.explanation}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Dominant Primary Action Button -> Triggers Calculation */}
              <button
                type="button"
                className="btn-dominant-calculate"
                onClick={handleCalculate}
              >
                <span>Calculate {activeTab.toUpperCase()}</span>
              </button>

              {/* Progressive Disclosure: Collapsible Breakdown */}
              <div className="progressive-details-toggle">
                <button
                  type="button"
                  className="btn-toggle-breakdown"
                  onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
                >
                  <span>{showDetailedBreakdown ? "Hide Breakdown ▲" : "View Breakdown ▼"}</span>
                </button>
              </div>

              {showDetailedBreakdown && (
                <div className="breakdown-details-panel">
                  <div className="breakdown-item">
                    <span className="bd-label">Total Credits</span>
                    <span className="bd-val">
                      {activeTab === "sgpa" ? displayedSgpa.totalCredits : displayedCgpa.totalCredits}
                    </span>
                  </div>
                  <div className="breakdown-item">
                    <span className="bd-label">
                      {activeTab === "sgpa" ? "Credit Points" : "Weighted Points"}
                    </span>
                    <span className="bd-val">
                      {activeTab === "sgpa" ? displayedSgpa.totalCreditPoints : displayedCgpa.totalWeightedPoints}
                    </span>
                  </div>
                  {activeTab === "cgpa" && (
                    <div className="breakdown-item">
                      <span className="bd-label">Evaluated Semesters</span>
                      <span className="bd-val">{displayedCgpa.validSemesters}</span>
                    </div>
                  )}
                  <div className="breakdown-formula-note">
                    {activeTab === "sgpa"
                      ? "SGPA = Σ(Credits × Grade Points) / Σ(Credits)"
                      : "CGPA = Σ(Semester Credits × SGPA) / Σ(Credits)"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GradeCalculator;
