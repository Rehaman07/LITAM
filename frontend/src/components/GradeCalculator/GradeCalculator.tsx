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

const PERCENTAGE_FORMULAS: { [key: string]: { name: string; calc: (val: number) => number; formulaText: string } } = {
  jntuk_r23: {
    name: "JNTUK R23: Percentage = CGPA × 10",
    calc: (val: number) => val * 10,
    formulaText: "Percentage = CGPA × 10",
  },
  jntuk_r20: {
    name: "JNTUK R20 / AICTE: (CGPA - 0.75) × 10",
    calc: (val: number) => (val > 0.75 ? (val - 0.75) * 10 : 0),
    formulaText: "Percentage = (CGPA - 0.75) × 10",
  },
  cbse: {
    name: "Standard: CGPA × 9.5",
    calc: (val: number) => val * 9.5,
    formulaText: "Percentage = CGPA × 9.5",
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

const initialCourses: CourseRow[] = Array.from({ length: 8 }, (_, i) => ({
  id: `course-${i + 1}`,
  name: `Course ${i + 1}`,
  credits: "3",
  grade: "F",
}));

const initialSemesters: SemesterRow[] = Array.from({ length: 8 }, (_, i) => ({
  id: `sem-${i + 1}`,
  name: `Semester ${i + 1}`,
  sgpa: "0",
  credits: "20",
}));

export function GradeCalculator() {
  const [activeTab, setActiveTab] = useState<"sgpa" | "cgpa">("sgpa");
  const [selectedSystemKey, setSelectedSystemKey] = useState("jntuk_r23");
  const [selectedFormulaKey, setSelectedFormulaKey] = useState("jntuk_r23");

  const [courses, setCourses] = useState<CourseRow[]>(initialCourses);
  const [semesters, setSemesters] = useState<SemesterRow[]>(initialSemesters);

  const currentSystem = GRADING_SYSTEMS[selectedSystemKey] || GRADING_SYSTEMS.jntuk_r23;
  const currentGradeScale = currentSystem.scale;
  const currentDescriptions = currentSystem.descriptions;
  const currentFormulaObj = PERCENTAGE_FORMULAS[selectedFormulaKey] || PERCENTAGE_FORMULAS.jntuk_r23;
  const currentFormula = currentFormulaObj.calc;

  // SGPA Calculation
  const sgpaResult = useMemo(() => {
    let totalCredits = 0;
    let totalCreditPoints = 0;

    courses.forEach((c) => {
      const cr = parseFloat(c.credits);
      const gp = currentGradeScale[c.grade] ?? 0;
      if (!isNaN(cr) && cr > 0) {
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

  // CGPA Calculation
  const cgpaResult = useMemo(() => {
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

  // Handlers for SGPA Courses
  const handleCourseChange = (id: string, field: keyof CourseRow, value: string) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleAddCourse = () => {
    const nextIdx = courses.length + 1;
    setCourses((prev) => [
      ...prev,
      { id: `course-${Date.now()}`, name: `Course ${nextIdx}`, credits: "3", grade: "F" },
    ]);
  };

  const handleRemoveCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleResetSgpa = () => {
    setCourses(initialCourses);
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
  };

  // Compute Classification Status
  const activeValue = activeTab === "sgpa" ? sgpaResult.numSgpa : cgpaResult.numCgpa;
  let statusBadge = { label: "Pending", class: "pending" };
  if (activeValue >= 7.75) {
    statusBadge = { label: "First Class with Distinction 🌟", class: "distinction" };
  } else if (activeValue >= 6.75) {
    statusBadge = { label: "First Class 🎖️", class: "first-class" };
  } else if (activeValue >= 5.75) {
    statusBadge = { label: "Second Class 👍", class: "second-class" };
  } else if (activeValue >= 5.0) {
    statusBadge = { label: "Pass Division ✔️", class: "pass" };
  } else if (activeValue > 0) {
    statusBadge = { label: "Needs Improvement ⚠️", class: "pending" };
  }

  // Radial Gauge Calculations
  const radius = 70;
  const circumference = Math.PI * radius;
  const progressRatio = Math.min(Math.max(activeValue / 10, 0), 1);
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <section className="grade-calc-section" id="grade-calculator">
      <div className="grade-calc-shell">
        {/* Top Header */}
        <div className="grade-calc-header">
          <div className="grade-calc-title-group">
            <div className="grade-calc-icon-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="grade-calc-title-text">
              <h2>Academic Grade Calculator</h2>
              <p>Supports JNTUK R23, R20 & Custom Regulations</p>
            </div>
          </div>

          <div className="grade-calc-nav-group">
            <div className="grade-calc-switcher">
              <button
                type="button"
                className={`grade-calc-tab-btn ${activeTab === "sgpa" ? "active" : ""}`}
                onClick={() => setActiveTab("sgpa")}
              >
                SGPA Mode
              </button>
              <button
                type="button"
                className={`grade-calc-tab-btn ${activeTab === "cgpa" ? "active" : ""}`}
                onClick={() => setActiveTab("cgpa")}
              >
                CGPA Mode
              </button>
            </div>
          </div>
        </div>

        {/* Main Body Grid */}
        <div className="grade-calc-body-grid">
          {/* Left Panel: Controls & Inputs */}
          <div className="grade-calc-main-card">
            {/* Info Banner & Settings */}
            <div className="grade-calc-info-banner">
              <div className="grade-calc-info-left">
                <div className="grade-calc-info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <span>
                  {activeTab === "sgpa"
                    ? "Enter credit units and select grades earned for each course."
                    : "Enter SGPA & Credits for completed academic semesters."}
                </span>
              </div>

              <select
                className="grade-calc-system-select"
                value={selectedSystemKey}
                onChange={(e) => {
                  const newSysKey = e.target.value;
                  setSelectedSystemKey(newSysKey);
                  // Automatically align percentage formula if switching to R23 or R20
                  if (newSysKey === "jntuk_r23") setSelectedFormulaKey("jntuk_r23");
                  else if (newSysKey === "jntuk_r20") setSelectedFormulaKey("jntuk_r20");
                }}
                title="Select Academic Grading System"
              >
                {Object.keys(GRADING_SYSTEMS).map((key) => (
                  <option key={key} value={key}>
                    {GRADING_SYSTEMS[key].name}
                  </option>
                ))}
              </select>
            </div>

            {/* SGPA PANEL */}
            {activeTab === "sgpa" ? (
              <>
                <div className="grade-calc-table-wrapper">
                  <table className="grade-calc-table">
                    <thead>
                      <tr>
                        <th style={{ width: "50px" }}>#</th>
                        <th>Course</th>
                        <th style={{ width: "120px" }}>Credit</th>
                        <th style={{ width: "170px" }}>Grade Letter</th>
                        <th style={{ width: "110px" }}>Grade Point</th>
                        <th style={{ width: "140px" }}>Credit Point</th>
                        <th style={{ width: "50px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course, idx) => {
                        const cr = parseFloat(course.credits) || 0;
                        const gp = currentGradeScale[course.grade] ?? 0;
                        const cp = cr * gp;

                        return (
                          <tr key={course.id}>
                            <td>
                              <span className="row-num-badge">
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                            </td>
                            <td>
                              <input
                                type="text"
                                className="calc-input-course"
                                value={course.name}
                                onChange={(e) => handleCourseChange(course.id, "name", e.target.value)}
                                placeholder="Course Name"
                              />
                            </td>
                            <td>
                              <div className="credit-input-group">
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  step="0.5"
                                  value={course.credits}
                                  onChange={(e) => handleCourseChange(course.id, "credits", e.target.value)}
                                />
                                <span>Cr</span>
                              </div>
                            </td>
                            <td>
                              <select
                                className="calc-select-grade"
                                value={course.grade}
                                onChange={(e) => handleCourseChange(course.id, "grade", e.target.value)}
                              >
                                <option value="F">Select Grade</option>
                                {Object.keys(currentGradeScale).map((g) => {
                                  const pts = currentGradeScale[g];
                                  const desc = currentDescriptions?.[g] ? ` (${currentDescriptions[g]})` : "";
                                  return (
                                    <option key={g} value={g}>
                                      {g} - {pts} pts{desc}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td>
                              <span className="val-grade-point">{gp.toFixed(2)}</span>
                            </td>
                            <td>
                              <span className="val-credit-point">{cp.toFixed(2)}</span>
                            </td>
                            <td>
                              {courses.length > 1 && (
                                <button
                                  type="button"
                                  className="btn-remove-row"
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
                    <tfoot>
                      <tr>
                        <td>Total</td>
                        <td>{courses.length} Courses</td>
                        <td>{sgpaResult.totalCredits} Cr</td>
                        <td colSpan={2}>Total Credit Points</td>
                        <td colSpan={2}>
                          <span className="val-credit-point">{sgpaResult.totalCreditPoints}</span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Actions Bar */}
                <div className="grade-calc-actions-bar">
                  <div className="grade-calc-btn-group">
                    <button type="button" className="btn-calc-action btn-calc-secondary" onClick={handleAddCourse}>
                      <span>+</span> Add Course
                    </button>
                    <button type="button" className="btn-calc-action btn-calc-secondary" onClick={handleResetSgpa}>
                      <span>↺</span> Reset All
                    </button>
                  </div>

                  <button type="button" className="btn-calc-action btn-calc-primary">
                    <span>🧮</span> Calculate SGPA
                  </button>
                </div>

                {/* Grading System Legend */}
                <div className="grade-legend-card">
                  <span style={{ fontWeight: 600, color: "var(--calc-text-main)" }}>Grade Reference ({currentSystem.name}):</span>
                  <div className="grade-legend-items">
                    {Object.entries(currentGradeScale).map(([grade, pt]) => {
                      const desc = currentDescriptions?.[grade] ? ` (${currentDescriptions[grade]})` : "";
                      return (
                        <span key={grade} className="grade-legend-pill">
                          <strong>{grade}</strong> = {pt} pts{desc}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              /* CGPA PANEL */
              <>
                <div className="cgpa-semesters-grid">
                  {semesters.map((sem, idx) => {
                    const sg = parseFloat(sem.sgpa) || 0;
                    const cr = parseFloat(sem.credits) || 0;
                    const pts = sg * cr;

                    return (
                      <div className="cgpa-sem-card" key={sem.id}>
                        <div className="cgpa-sem-header">
                          <span className="cgpa-sem-title">{sem.name}</span>
                          {semesters.length > 1 && (
                            <button
                              type="button"
                              className="btn-remove-row"
                              onClick={() => handleRemoveSemester(sem.id)}
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="cgpa-inputs-row">
                          <div className="cgpa-input-field">
                            <label>SGPA (0 - 10)</label>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.01"
                              value={sem.sgpa}
                              onChange={(e) => handleSemesterChange(sem.id, "sgpa", e.target.value)}
                              placeholder="0.00"
                            />
                          </div>
                          <div className="cgpa-input-field">
                            <label>Credits</label>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={sem.credits}
                              onChange={(e) => handleSemesterChange(sem.id, "credits", e.target.value)}
                              placeholder="20"
                            />
                          </div>
                        </div>

                        <div style={{ fontSize: "0.75rem", color: "var(--calc-text-muted)" }}>
                          Weighted Points: <strong style={{ color: "var(--calc-accent-blue)" }}>{pts.toFixed(2)}</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CGPA Actions */}
                <div className="grade-calc-actions-bar">
                  <div className="grade-calc-btn-group">
                    <button type="button" className="btn-calc-action btn-calc-secondary" onClick={handleAddSemester}>
                      <span>+</span> Add Semester
                    </button>
                    <button type="button" className="btn-calc-action btn-calc-secondary" onClick={handleResetCgpa}>
                      <span>↺</span> Reset Semesters
                    </button>
                  </div>

                  <button type="button" className="btn-calc-action btn-calc-primary">
                    <span>🧮</span> Calculate CGPA
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right Panel: Results & Performance Gauge */}
          <div className="grade-calc-results-card">
            <div className="results-top-header">
              <h3>Your Results</h3>
              <div className="trophy-badge" title="Performance Achievement">
                🏆
              </div>
            </div>

            {/* Radial SVG Arc Gauge */}
            <div className="gauge-container">
              <svg className="gauge-svg" viewBox="0 0 160 90">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>

                {/* Background Arc */}
                <path
                  className="gauge-bg-path"
                  d="M 10 80 A 70 70 0 0 1 150 80"
                />

                {/* Dynamic Progress Fill Arc */}
                <path
                  className="gauge-fill-path"
                  d="M 10 80 A 70 70 0 0 1 150 80"
                  stroke="url(#gaugeGradient)"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>

              <div className="gauge-content">
                <span className="gauge-label">{activeTab === "sgpa" ? "SGPA" : "CGPA"}</span>
                <span className="gauge-val">
                  {activeTab === "sgpa" ? sgpaResult.sgpa : cgpaResult.cgpa}
                </span>
                <span className="gauge-sub">Out of 10.00</span>
              </div>
            </div>

            {/* Percentage Display Box */}
            <div className="calc-percentage-box">
              <div className="calc-perc-title">Equivalent Percentage</div>
              <div className="calc-perc-val">
                {activeTab === "sgpa" ? sgpaResult.percentage : cgpaResult.percentage}%
              </div>
              <div className="calc-perc-sub">Formula: {currentFormulaObj.formulaText}</div>
              <div style={{ marginTop: "0.5rem" }}>
                <select
                  className="grade-calc-system-select"
                  style={{ width: "100%", fontSize: "0.75rem" }}
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
            </div>

            {/* Detailed Performance Metrics & Formula Box */}
            <div className="calc-stats-card">
              <div className="calc-stats-header">
                <span>Performance Summary</span>
                <span className={`badge-status ${statusBadge.class}`}>{statusBadge.label}</span>
              </div>

              <div className="calc-stats-list">
                <div className="calc-stat-row">
                  <span className="calc-stat-label">Total Credits:</span>
                  <span className="calc-stat-val">
                    {activeTab === "sgpa" ? sgpaResult.totalCredits : cgpaResult.totalCredits}
                  </span>
                </div>

                <div className="calc-stat-row">
                  <span className="calc-stat-label">
                    {activeTab === "sgpa" ? "Total Credit Points:" : "Weighted Semester Points:"}
                  </span>
                  <span className="calc-stat-val">
                    {activeTab === "sgpa" ? sgpaResult.totalCreditPoints : cgpaResult.totalWeightedPoints}
                  </span>
                </div>

                {activeTab === "cgpa" && (
                  <div className="calc-stat-row">
                    <span className="calc-stat-label">Evaluated Semesters:</span>
                    <span className="calc-stat-val">{cgpaResult.validSemesters}</span>
                  </div>
                )}

                <div style={{ marginTop: "0.4rem", paddingTop: "0.4rem", borderTop: "1px dashed rgba(255,255,255,0.08)", fontSize: "0.78rem", color: "var(--calc-text-dim)" }}>
                  <strong>{activeTab === "sgpa" ? "SGPA Formula:" : "CGPA Formula:"}</strong>
                  <br />
                  {activeTab === "sgpa"
                    ? "SGPA = Σ(Credits × Grade Points) / Σ(Credits)"
                    : "CGPA = Σ(Semester Credits × SGPA) / Total Credits"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GradeCalculator;
