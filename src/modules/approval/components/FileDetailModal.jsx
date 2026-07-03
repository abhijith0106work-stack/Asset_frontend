import React, { useState, useEffect } from 'react';
import { approvalApi } from '../api/approvalApi';
import { API_BASE_URL } from '../../../config';

const FileDetailModal = ({ file, isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && file) {
      fetchHistory();
    }
  }, [isOpen, file]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await approvalApi.getFileHistory(file._id);
      setHistory(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (!isOpen || !file) return null;

  let fileUrl = null;
  let ext = '';
  let isPdf = false;
  let isImage = false;

  if (file.fileUrl) {
    const cleanPath = file.fileUrl.replace(/\\/g, '/').replace(/^\//, '');
    fileUrl = `${API_BASE_URL.replace('/api', '')}/${cleanPath}`;
    const parts = cleanPath.split('.');
    ext = parts[parts.length - 1].toLowerCase();
    isPdf = ext === 'pdf';
    isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '2rem' }}>
      <div style={{ background: '#0f172a', width: '95%', maxWidth: '1200px', height: '90vh', padding: '2rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '2rem', overflow: 'hidden' }}>
        
        {/* Left: Preview */}
        <div style={{ flex: 1.2, background: '#1e293b', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: '#94a3b8' }}>Document Preview</div>
          {fileUrl ? (
            isPdf ? (
              <iframe src={fileUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="Preview" />
            ) : isImage ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', padding: '1rem' }}>
                <img src={fileUrl} style={{ maxWidth: '100%', borderRadius: '8px' }} alt="Preview" />
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem' }}>
                  {['doc', 'docx'].includes(ext) ? '📄' : (['xls', 'xlsx'].includes(ext) ? '📊' : '📁')}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', color: 'white', marginBottom: '0.3rem' }}>{file.fileName || 'Document'}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Preview not available in browser for {ext.toUpperCase()} files.</div>
                </div>
                <a 
                  href={fileUrl} 
                  download 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    background: '#6366f1',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(99,102,241,0.25)'
                  }}
                >
                  Download File
                </a>
              </div>
            )
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No file attached</div>
          )}
        </div>

        {/* Right: Info & Timeline */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '0.3rem' }}>{file.title}</h2>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Status: <span style={{ color: '#818cf8', fontWeight: 600 }}>{file.status.toUpperCase()}</span></div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingRight: '1rem' }}>
            
            {/* Description */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase' }}>Description</div>
              <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.6 }}>{file.description || 'No description provided.'}</p>
            </div>

            {/* Approval Timeline */}
            <div>
              <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase' }}>Approval History</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {history.map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: h.action === 'approved' ? '#10b981' : '#ef4444', border: '3px solid #0f172a', zIndex: 1 }}></div>
                      {i !== history.length - 1 && <div style={{ width: '2px', flex: 1, background: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>}
                    </div>
                    <div style={{ paddingBottom: '1rem' }}>
                      <div style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600 }}>{h.action.toUpperCase()} - Level {h.fromLevel}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>By {h.actorId?.name} on {new Date(h.createdAt).toLocaleString()}</div>
                      {h.remarks && <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.3rem', fontStyle: 'italic' }}>"{h.remarks}"</div>}
                    </div>
                  </div>
                ))}
                {history.length === 0 && !loading && <div style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>No history available yet.</div>}
              </div>
            </div>

            {/* Comments */}
            <div>
              <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase' }}>Comments & Discussion</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(file.comments || []).map((c, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                      <strong>{c.user?.name || 'User'}</strong>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{c.text}</div>
                  </div>
                ))}
                {(file.comments || []).length === 0 && <div style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>No comments.</div>}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default FileDetailModal;
