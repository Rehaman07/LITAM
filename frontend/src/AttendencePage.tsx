import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import litamLogo from "../images/logo.png";
import { Link } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";
import axios from "axios";

// Get base URL from environment or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface AttendencePageProps {
  theme: string;
  onToggleTheme: () => void;
}

interface Course {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

interface Section {
  id: number;
  name: string;
}

interface Student {
  id: number;
  roll_number: string;
  name: string;
  present_count: number;
  absent_count: number;
  attendance_percentage: number;
}

export default function AttendencePage({ theme, onToggleTheme }: AttendencePageProps) {
  const [user, setUser] = useState<User | null>(null);
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Courses on load if user is logged in
  useEffect(() => {
    if (user) {
      axios.get(`${API_BASE_URL}/api/attendance/courses/`)
        .then(res => setCourses(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  // Fetch Branches when Course changes
  useEffect(() => {
    setSelectedBranch("");
    setSelectedSection("");
    setBranches([]);
    setSections([]);
    setStudents([]);
    if (selectedCourse) {
      axios.get(`${API_BASE_URL}/api/attendance/branches/?course_id=${selectedCourse}`)
        .then(res => setBranches(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedCourse]);

  // Fetch Sections when Branch changes
  useEffect(() => {
    setSelectedSection("");
    setSections([]);
    setStudents([]);
    if (selectedBranch) {
      axios.get(`${API_BASE_URL}/api/attendance/sections/?branch_id=${selectedBranch}`)
        .then(res => setSections(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedBranch]);

  // Fetch Students (with Polling) when Section changes
  useEffect(() => {
    let interval: any;
    
    const fetchStudents = () => {
      if (!selectedSection) return;
      axios.get(`${API_BASE_URL}/api/attendance/students/?section_id=${selectedSection}`)
        .then(res => setStudents(res.data))
        .catch(err => console.error(err));
    };

    if (selectedSection) {
      setLoading(true);
      fetchStudents();
      setLoading(false);
      
      // Lightweight polling every 5 seconds for real-time updates
      interval = setInterval(fetchStudents, 5000);
    } else {
      setStudents([]);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedSection]);

  return (
    <motion.main
      className="site site-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <header className={`site-header scrolled`}>
        <div className="header-inner">
          <Link to="/" className="brand-lockup" style={{ textDecoration: "none" }}>
            <div className="brand-mark">
              <img src={litamLogo} alt="LITAM Logo" />
            </div>
            <div className="brand-copy">
              <strong>LITAM</strong>
              <small>Loyola Institute of Technology & Management</small>
            </div>
          </Link>
          <div className="header-actions">
            <Link
              to="/"
              className="nav-list"
              style={{
                marginRight: "20px",
                textDecoration: "none",
                fontWeight: "bold",
                color: "var(--text)",
              }}
            >
              &larr; Back to Home
            </Link>
            <button
              className="theme-toggle"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <div className="sun-icon theme-icon" />
              ) : (
                <div className="moon-icon theme-icon" />
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="section" style={{ paddingTop: "150px", minHeight: "100vh" }}>
        <div className="section-heading" style={{ alignItems: "center", textAlign: "center" }}>
          <span className="eyebrow">Student Portal</span>
          <h2 className="gradient-text">LITAM Attendance</h2>
          <p>Track live attendance records seamlessly.</p>
        </div>
        
        {!user ? (
          <div className="glass" style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem", borderRadius: "12px", textAlign: "center" }}>
            <h3>Authentication Required</h3>
            <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>Please log in to view the attendance dashboard.</p>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: "1.5rem", display: "inline-block", textDecoration: "none" }}>
              Login to Portal
            </Link>
          </div>
        ) : (
          <div className="glass" style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem", borderRadius: "16px" }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
              <div style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>Course</label>
                <select 
                  style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--text)" }}
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              
              <div style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>Branch</label>
                <select 
                  style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--text)" }}
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  disabled={!selectedCourse || branches.length === 0}
                >
                  <option value="">Select Branch</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>Section</label>
                <select 
                  style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--text)" }}
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  disabled={!selectedBranch || sections.length === 0}
                >
                  <option value="">Select Section</option>
                  {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            {selectedSection && (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--line)", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      <th style={{ padding: "1rem", fontWeight: "600" }}>Student Name</th>
                      <th style={{ padding: "1rem", fontWeight: "600" }}>Present</th>
                      <th style={{ padding: "1rem", fontWeight: "600" }}>Absent</th>
                      <th style={{ padding: "1rem", fontWeight: "600" }}>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Loading students...</td>
                      </tr>
                    ) : students.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>No students found in this section.</td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.id} style={{ borderBottom: "1px solid var(--line)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: "1rem", fontWeight: "500" }}>
                            {student.name}
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{student.roll_number}</div>
                          </td>
                          <td style={{ padding: "1rem", color: "#10b981", fontWeight: "bold" }}>{student.present_count}</td>
                          <td style={{ padding: "1rem", color: "#ef4444", fontWeight: "bold" }}>{student.absent_count}</td>
                          <td style={{ padding: "1rem", fontWeight: "bold" }}>
                            {student.attendance_percentage !== null 
                              ? `${student.attendance_percentage.toFixed(1)}%` 
                              : "N/A"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>
    </motion.main>
  );
}
