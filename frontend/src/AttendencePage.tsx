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
  total_students?: number;
  absent_today?: number;
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
  
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDate, setUploadDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const [notifyLoading, setNotifyLoading] = useState<string>("");
  const [notifyMessage, setNotifyMessage] = useState("");

  const handleNotify = async (targetType: string, targetId: string | number, action: string) => {
    setNotifyLoading(`${targetType}-${action}`);
    setNotifyMessage("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/attendance/notify/`, {
        target_type: targetType,
        target_id: targetId,
        date: new Date().toISOString().split('T')[0],
        action: action
      });
      setNotifyMessage(res.data.message);
      setTimeout(() => setNotifyMessage(""), 5000);
    } catch (err: any) {
      setNotifyMessage(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setNotifyLoading("");
    }
  };
  
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !selectedSection || !uploadDate) return;
    
    setUploading(true);
    setUploadMessage("");
    
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("section_id", selectedSection);
    formData.append("date", uploadDate);
    
    try {
      const res = await axios.post(`${API_BASE_URL}/api/attendance/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUploadMessage(`Success! ${res.data.created} records created, ${res.data.updated} updated.`);
      setUploadFile(null);
    } catch (err: any) {
      setUploadMessage(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setUploading(false);
    }
  };

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

            {notifyMessage && (
              <div style={{ marginBottom: "2rem", padding: "1rem", borderRadius: "8px", background: notifyMessage.startsWith("Error") ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)", color: notifyMessage.startsWith("Error") ? "#ef4444" : "#10b981", fontSize: "0.95rem", textAlign: "center", fontWeight: "bold" }}>
                {notifyMessage}
              </div>
            )}

            {selectedBranch && !selectedSection && (
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ padding: "2rem", borderRadius: "12px", background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)", border: "1px solid var(--line)", marginBottom: "2rem", textAlign: "center" }}>
                  <h3 style={{ marginBottom: "1rem" }}>Branch Dashboard</h3>
                  <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "1.5rem" }}>
                    <div>
                      <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--text)" }}>
                        {sections.reduce((acc, s) => acc + (s.total_students || 0), 0)}
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Total Students</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ef4444" }}>
                        {sections.reduce((acc, s) => acc + (s.absent_today || 0), 0)}
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Absent Today</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <button className="btn" onClick={() => handleNotify('branch', selectedBranch, 'push')} disabled={notifyLoading !== ""} style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
                      {notifyLoading === `branch-push` ? "..." : "🔔 PUSH ABSENTEES"}
                    </button>
                    <button className="btn" onClick={() => handleNotify('branch', selectedBranch, 'sms')} disabled={notifyLoading !== ""} style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
                      {notifyLoading === `branch-sms` ? "..." : "📱 SMS ABSENTEES"}
                    </button>
                    <button className="btn btn-primary" onClick={() => handleNotify('branch', selectedBranch, 'call')} disabled={notifyLoading !== ""}>
                      {notifyLoading === `branch-call` ? "Calling..." : "📞 CALL ABSENTEES"}
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                  {sections.map(section => (
                    <div key={section.id} style={{ padding: "1.5rem", borderRadius: "12px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--line)" }}>
                      <h4 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>{section.name}</h4>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        <span>Students: <strong>{section.total_students || 0}</strong></span>
                        <span>Absent: <strong style={{ color: "#ef4444" }}>{section.absent_today || 0}</strong></span>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        <button className="btn" onClick={() => setSelectedSection(section.id.toString())} style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", background: "var(--surface)" }}>View & Upload</button>
                        <button className="btn" onClick={() => handleNotify('section', section.id, 'push')} disabled={notifyLoading !== ""} style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", background: "var(--surface)" }}>Push</button>
                        <button className="btn" onClick={() => handleNotify('section', section.id, 'sms')} disabled={notifyLoading !== ""} style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", background: "var(--surface)" }}>SMS</button>
                        <button className="btn" onClick={() => handleNotify('section', section.id, 'call')} disabled={notifyLoading !== ""} style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", background: "var(--surface)", color: "var(--primary)", borderColor: "var(--primary)" }}>Call</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedSection && (
              <div style={{ marginBottom: "2rem", padding: "1.5rem", borderRadius: "12px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--line)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h4>Admin: Upload Attendance Spreadsheet</h4>
                  <button className="btn" onClick={() => setSelectedSection("")} style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>&larr; Back to Branch</button>
                </div>
                <form onSubmit={handleFileUpload} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>Date</label>
                    <input 
                      type="date" 
                      value={uploadDate}
                      onChange={(e) => setUploadDate(e.target.value)}
                      required
                      style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--text)" }}
                    />
                  </div>
                  <div style={{ flex: "2 1 300px" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>Excel File (.xlsx)</label>
                    <input 
                      type="file" 
                      accept=".xlsx, .xls, .csv"
                      onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                      required
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--text)" }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={uploading || !uploadFile} style={{ padding: "0.85rem 1.5rem" }}>
                    {uploading ? "Importing..." : "Import Attendance"}
                  </button>
                </form>
                {uploadMessage && (
                  <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: "8px", background: uploadMessage.startsWith("Error") ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)", color: uploadMessage.startsWith("Error") ? "#ef4444" : "#10b981", fontSize: "0.9rem" }}>
                    {uploadMessage}
                  </div>
                )}
              </div>
            )}

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
