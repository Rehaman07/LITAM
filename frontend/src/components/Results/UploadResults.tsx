import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

export default function UploadResults() {
  const [file, setFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  
  const fetchBatches = async () => {
    try {
      const response = await api.get('/results/batches/');
      setBatches(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBatches();
    const interval = setInterval(fetchBatches, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (e: any) => {
    e.preventDefault();
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await api.post('/results/batches/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFile(null);
      fetchBatches();
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="section" id="admin-results">
      <div className="glowing-orb orb-accent" style={{ top: "30%", right: "10%" }} />
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Admin Results Ingestion</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Upload raw results PDFs to automatically parse, compute SGPAs, and populate the student database using the async ingestion pipeline.
          </p>
        </div>
      </Reveal>

      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
        <Reveal className="glass glass-card">
          <h3 style={{ marginBottom: '16px' }}>Upload New Batch</h3>
          <form onSubmit={handleUpload}>
            <input 
              type="file" 
              accept="application/pdf"
              onChange={(e: any) => setFile(e.target.files ? e.target.files[0] : null)}
              style={{ display: 'block', marginBottom: '16px', color: 'var(--text)' }}
            />
            <button type="submit" className="btn btn-primary" disabled={!file || uploading}>
              {uploading ? 'Uploading...' : 'Process PDF'}
            </button>
          </form>
        </Reveal>

        <Reveal className="glass glass-card" delay={0.1}>
          <h3 style={{ marginBottom: '16px' }}>Processing Batches</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {batches.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No batches uploaded yet.</p>
            ) : (
              batches.map(batch => (
                <div key={batch.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div>
                    <strong>Batch #{batch.id}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(batch.uploaded_at).toLocaleString()}</div>
                    {batch.error_message && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--accent)', marginTop: '4px' }}>Error: {batch.error_message}</div>
                    )}
                  </div>
                  <span className={`badge ${batch.status === 'COMPLETED' ? 'badge-info' : batch.status === 'FAILED' ? 'badge-accent' : 'badge-primary'}`}>
                    {batch.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
