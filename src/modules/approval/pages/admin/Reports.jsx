import React, { useState, useEffect } from 'react';
import { approvalApi } from '../../api/approvalApi';
import { exportToCSV } from '../../../../utils/exportUtils';

const Reports = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total:0, approved:0, rejected:0, pending:0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await approvalApi.getFiles();
      const data = res.data;
      setFiles(data);
      setStats({
        total: data.length,
        approved: data.filter(f => f.status === 'approved').length,
        rejected: data.filter(f => f.status === 'rejected').length,
        pending: data.filter(f => f.status === 'submitted' || f.status === 'under_review').length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = files.map(f => ({
      'File Name': f.originalName,
      'Submitted By': f.submitter?.name || 'Unknown',
      'Status': f.status.toUpperCase(),
      'Current Step': f.currentStepIndex + 1,
      'Department': f.department?.name || 'N/A',
      'Created At': new Date(f.createdAt).toLocaleString(),
      'Updated At': new Date(f.updatedAt).toLocaleString(),
    }));
    exportToCSV(exportData, `Approval_Report_${new Date().toLocaleDateString()}`);
  };

  if (loading) return <div style={{ color: '#94a3b8', textAlign: 'center', padding: '4rem' }}>Generating reports...</div>;

  return (
    <div className="rep-root">
      <style>{`
        .rep-root { animation: repFadeUp .4s ease both; }
        .rep-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; }
        .rep-title { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; color: #f8fafc; }
        .rep-subtitle { color: #64748b; font-size: 0.9rem; margin-top: 0.2rem; }
        
        .rep-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .rep-card { 
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); 
          padding: 1.8rem; border-radius: 24px; position: relative; overflow: hidden;
        }
        .rep-card-label { font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
        .rep-card-val { font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; color: #f1f5f9; line-height: 1; }
        
        .rep-table-wrap { 
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); 
          border-radius: 24px; overflow: hidden; 
        }
        .rep-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; }
        .rep-table th { padding: 1.2rem 1.5rem; background: rgba(255,255,255,0.03); color: #475569; font-weight: 700; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.05em; }
        .rep-table td { padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.04); color: #94a3b8; }
        .rep-table tr:hover { background: rgba(255,255,255,0.01); }
        
        .status-badge { padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
        .status-approved { background: rgba(16,185,129,0.1); color: #10b981; }
        .status-rejected { background: rgba(239,68,68,0.1); color: #f87171; }
        .status-pending { background: rgba(245,158,11,0.1); color: #f59e0b; }

        .export-btn {
          background: #6366f1; color: white; border: none; padding: 0.75rem 1.5rem; 
          border-radius: 12px; font-weight: 700; cursor: pointer; transition: all .2s;
          display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 15px rgba(99,102,241,0.3);
        }
        .export-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }

        @keyframes repFadeUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="rep-header">
        <div>
          <h2 className="rep-title">Approval Reports</h2>
          <p className="rep-subtitle">Overview of document movements and clearance status</p>
        </div>
        <button className="export-btn" onClick={handleExport}>
           📥 Export Master Data
        </button>
      </div>

      <div className="rep-grid">
        <div className="rep-card">
          <div className="rep-card-label">Total Submissions</div>
          <div className="rep-card-val">{stats.total}</div>
        </div>
        <div className="rep-card">
          <div className="rep-card-label" style={{ color: '#10b981' }}>Approved</div>
          <div className="rep-card-val" style={{ color: '#10b981' }}>{stats.approved}</div>
        </div>
        <div className="rep-card">
          <div className="rep-card-label" style={{ color: '#f87171' }}>Rejected</div>
          <div className="rep-card-val" style={{ color: '#f87171' }}>{stats.rejected}</div>
        </div>
        <div className="rep-card">
          <div className="rep-card-label" style={{ color: '#f59e0b' }}>In Process</div>
          <div className="rep-card-val" style={{ color: '#f59e0b' }}>{stats.pending}</div>
        </div>
      </div>

      <div className="rep-section">
        <h3 style={{ marginBottom: '1.2rem', fontSize: '1rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent File Movements</h3>
        <div className="rep-table-wrap">
          <table className="rep-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Submitter</th>
                <th>Department</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {files.slice(0, 10).map(f => (
                <tr key={f._id}>
                  <td style={{ color: '#f1f5f9', fontWeight: 500 }}>{f.originalName}</td>
                  <td>{f.submitter?.name}</td>
                  <td>{f.department?.name || '—'}</td>
                  <td>
                    <span className={`status-badge status-${f.status === 'approved' ? 'approved' : f.status === 'rejected' ? 'rejected' : 'pending'}`}>
                      {f.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{new Date(f.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {files.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#334155' }}>No data available to generate reports.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
