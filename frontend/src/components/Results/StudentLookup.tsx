// Results feature deferred. Components intentionally not routed.
// Restore requires re-adding the `results` app, Celery task, and API routes.
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api';

const Reveal = ({ children, delay = 0, className = '', style = {} }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

export default function StudentLookup() {
  const [hallTicket, setHallTicket] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    if (!hallTicket.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.get(`/results/students/${hallTicket.trim()}/`);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Result not found for this Hall Ticket number.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const response = await api.get(`/results/students/${result.hall_ticket_number}/download_pdf/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `result_${result.hall_ticket_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      alert('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="section" id="results">
      <div className="glowing-orb orb-primary" style={{ top: "20%", left: "10%" }} />
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Student Results Portal</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Enter your hall ticket number to instantly view your SGPA/CGPA and download your official branded results PDF.
          </p>
        </div>
      </Reveal>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Reveal className="glass glass-card">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1 }}
              placeholder="Enter Hall Ticket Number..."
              value={hallTicket}
              onChange={(e) => setHallTicket(e.target.value.toUpperCase())}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !hallTicket.trim()}>
              {loading ? 'Searching...' : 'Get Results'}
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ color: 'var(--accent)', marginTop: '16px' }}>
                {error}
              </motion.div>
            )}

            {result && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--text)' }}>{result.hall_ticket_number}</h3>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                      <span className="badge badge-info">SGPA: {result.sgpa}</span>
                      <span className="badge badge-info">CGPA: {result.cgpa}</span>
                    </div>
                  </div>
                  <button onClick={handleDownload} className="btn btn-secondary" disabled={downloading}>
                    {downloading ? 'Generating PDF...' : 'Download PDF'}
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '12px 8px' }}>Course Code</th>
                        <th style={{ padding: '12px 8px' }}>Course Name</th>
                        <th style={{ padding: '12px 8px' }}>Credits</th>
                        <th style={{ padding: '12px 8px' }}>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.course_grades.map((grade: any) => (
                        <tr key={grade.course_code} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '12px 8px' }}>{grade.course_code}</td>
                          <td style={{ padding: '12px 8px' }}>{grade.course_name}</td>
                          <td style={{ padding: '12px 8px' }}>{grade.credits}</td>
                          <td style={{ padding: '12px 8px' }}>
                            <strong style={{ color: 'var(--primary)' }}>{grade.grade}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
