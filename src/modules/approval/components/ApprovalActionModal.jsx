import React, { useState } from 'react';
import { approvalApi } from '../api/approvalApi';
import { API_BASE_URL } from '../../../config';

const ApprovalActionModal = ({ file, isOpen, onClose, onActionSuccess }) => {
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !file) return null;

  const handleAction = async (type) => {
    setLoading(true);
    try {
      if (type === 'approve') {
        await approvalApi.approveFile({ fileId: file._id, remarks });
      } else if (type === 'requestChanges') {
        await approvalApi.rejectFile({ fileId: file._id, remarks, requestChanges: true });
      } else {
        await approvalApi.rejectFile({ fileId: file._id, remarks, requestChanges: false });
      }
      onActionSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing action');
    } finally {
      setLoading(false);
    }
  };

  let fileUrl = null;
  if (file.fileUrl) {
    const cleanPath = file.fileUrl.replace(/\\/g, '/').replace(/^\//, '');
    fileUrl = `${API_BASE_URL.replace('/api', '')}/${cleanPath}`;
  } else if (file.attachments && file.attachments.length > 0 && file.attachments[0].url) {
    const cleanPath = file.attachments[0].url.replace(/\\/g, '/').replace(/^\//, '');
    fileUrl = `${API_BASE_URL.replace('/api', '')}/${cleanPath}`;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
      <div style={{ background: '#0f172a', width: '90%', maxWidth: '1100px', height: '85vh', padding: '2rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '2rem', overflow: 'hidden' }}>
        
        {/* Left: File Viewer */}
        <div style={{ flex: 1.5, background: '#1e293b', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: '#94a3b8' }}>Document Preview - Debug URL: {fileUrl}</div>
          {fileUrl ? (
            fileUrl.toLowerCase().endsWith('.pdf') ? (
              <iframe src={fileUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="Preview" />
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', padding: '1rem' }}>
                <img src={fileUrl} style={{ maxWidth: '100%', borderRadius: '8px' }} alt="Preview" />
              </div>
            )
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>No file attached</div>
          )}
        </div>

        {/* Right: Action Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'white', fontSize: '1.5rem' }}>Review File</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>{file.title}</p>
          
          <div style={{ marginBottom: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
            
            {/* Movement History (Timeline) */}
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase' }}>Audit Trail</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(file.history || []).length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>No movements yet.</div>
                ) : (
                  file.history.map((h, i) => {
                    const stageName = file.stages && file.stages[h.stageIndex] ? file.stages[h.stageIndex].name : `Level ${h.stageIndex + 1}`;
                    return (
                      <div key={i} style={{ fontSize: '0.75rem', color: '#94a3b8', borderLeft: '2px solid rgba(129,140,248,0.3)', paddingLeft: '0.75rem' }}>
                        <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{h.action.toUpperCase()} - {stageName}</div>
                        <div>{h.actorId?.name} • {new Date(h.createdAt).toLocaleDateString()}</div>
                        {h.remarks && <div style={{ color: '#64748b', fontStyle: 'italic', marginTop: '0.2rem' }}>"{h.remarks}"</div>}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Comments History */}
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', overflowY: 'auto', maxHeight: '200px' }}>
              <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.75rem' }}>Discussion History</div>
              {(file.comments || []).length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>No comments yet.</div>
              ) : (
                file.comments.map((c, i) => (
                  <div key={i} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{c.user?.name || 'User'}</span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '0.2rem' }}>{c.text}</div>
                  </div>
                ))
              )}
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.6rem', color: '#94a3b8', fontSize: '0.85rem' }}>Approval Remarks</label>
              <textarea 
                style={{ width: '100%', height: '100px', padding: '1rem', borderRadius: '16px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white', resize: 'none' }}
                placeholder="Provide your decision comments here..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button 
              onClick={() => handleAction('reject')}
              disabled={loading}
              style={{ flex: 1, padding: '1rem', borderRadius: '14px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', fontWeight: 700, cursor: 'pointer' }}
            >Reject</button>
            <button 
              onClick={() => handleAction('requestChanges')}
              disabled={loading}
              style={{ flex: 1.3, padding: '1rem', borderRadius: '14px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', fontWeight: 700, cursor: 'pointer' }}
            >Request Changes</button>
            <button 
              onClick={() => handleAction('approve')}
              disabled={loading}
              style={{ flex: 1.1, padding: '1rem', borderRadius: '14px', background: '#6366f1', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >{loading ? '...' : 'Approve'}</button>
          </div>
          <button onClick={onClose} style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}>Close Review</button>
        </div>

      </div>
    </div>
  );
};

export default ApprovalActionModal;
