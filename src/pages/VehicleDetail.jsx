import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Ico = ({ d, size = 16, color = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const STATUS_CFG = {
  'Available': { bg:'rgba(16,185,129,.12)', border:'rgba(16,185,129,.3)', text:'#34d399', dot:'#10b981' },
  'Assigned': { bg:'rgba(99,102,241,.12)', border:'rgba(99,102,241,.3)', text:'#818cf8', dot:'#6366f1' },
  'In Use': { bg:'rgba(59,130,246,.12)', border:'rgba(59,130,246,.3)', text:'#60a5fa', dot:'#3b82f6' },
  'Maintenance': { bg:'rgba(245,158,11,.12)', border:'rgba(245,158,11,.3)', text:'#fbbf24', dot:'#f59e0b' },
  'Breakdown': { bg:'rgba(239,68,68,.12)', border:'rgba(239,68,68,.3)', text:'#fca5a5', dot:'#ef4444' },
  'Out of Service': { bg:'rgba(100,116,139,.12)', border:'rgba(100,116,139,.3)', text:'#94a3b8', dot:'#64748b' }
};

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
  const [issueForm, setIssueForm] = useState({ title: '', description: '', priority: 'Medium' });
  const [savingIssue, setSavingIssue] = useState(false);

  useEffect(() => {
    fetchVehicleDetails();
    logQRScan();
  }, [id]);

  const fetchVehicleDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API_BASE_URL}/vehicles/${id}/details`, { headers });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logQRScan = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${API_BASE_URL}/vehicles/${id}/qr-logs`, { action: 'Vehicle Profile Viewed' }, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (err) { console.error('QR Log failed'); }
  };

  const handleReportIssue = async (e) => {
    e.preventDefault();
    setSavingIssue(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/vehicles/${id}/issue`, issueForm, { headers: { Authorization: `Bearer ${token}` } });
      setIsReportIssueOpen(false);
      setIssueForm({ title: '', description: '', priority: 'Medium' });
      alert('Issue reported successfully. A ticket has been automatically created for Operations.');
    } catch (err) {
      alert('Failed to report issue.');
    } finally {
      setSavingIssue(false);
    }
  };

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading Vehicle Profile...</div>;
  if (!data || !data.vehicle) return <div style={{ color: '#ef4444', padding: '2rem' }}>Vehicle not found or access denied.</div>;

  const { vehicle, documents, services, assignments, trips, fuel, repairs, incidents } = data;
  const sCfg = STATUS_CFG[vehicle.status] || STATUS_CFG['Available'];
  const driver = vehicle.assignedTo;

  return (
    <div className="vd-wrapper">
      <style>{`
        .vd-wrapper { padding: 2rem; max-width: 1200px; margin: 0 auto; color: #f8fafc; font-family: 'Syne', 'DM Sans', sans-serif; }
        .vd-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
        .vd-title-section { display: flex; flex-direction: column; gap: 0.5rem; }
        .vd-title { font-size: 2rem; font-weight: 800; font-family: 'Syne', sans-serif; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .vd-subtitle { font-family: 'DM Mono', monospace; font-size: 0.9rem; color: #94a3b8; }
        .vd-badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .vd-badge-dot { width: 6px; height: 6px; border-radius: 50%; }
        
        .vd-actions { display: flex; gap: 1rem; }
        .vd-btn-report { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; font-weight: 600; font-family: 'DM Sans'; }
        .vd-btn-report:hover { background: rgba(239, 68, 68, 0.2); }
        
        .vd-tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 2rem; overflow-x: auto; }
        .vd-tab { padding: 0.8rem 1.5rem; background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; white-space: nowrap; }
        .vd-tab:hover { color: #cbd5e1; }
        .vd-tab.active { color: #6366f1; border-bottom-color: #6366f1; }
        
        .vd-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media(min-width: 900px) { .vd-grid { grid-template-columns: 350px 1fr; } }
        
        .vd-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 1.5rem; }
        .vd-card-title { font-size: 1.1rem; font-weight: 700; color: #f1f5f9; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem; }
        
        .vd-info-list { display: flex; flex-direction: column; gap: 0.8rem; }
        .vd-info-row { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px dashed rgba(255,255,255,0.05); padding-bottom: 0.5rem; }
        .vd-info-label { font-size: 0.8rem; color: #64748b; }
        .vd-info-val { font-size: 0.9rem; color: #e2e8f0; font-weight: 500; text-align: right; }
        
        .vd-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .vd-table th { text-align: left; padding: 0.8rem; color: #94a3b8; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .vd-table td { padding: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.02); color: #cbd5e1; }
        .vd-table tr:hover td { background: rgba(255,255,255,0.01); }
        
        .vd-doc-status { padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
        .vd-doc-valid { background: rgba(16,185,129,.1); color: #10b981; }
        .vd-doc-warn { background: rgba(245,158,11,.1); color: #f59e0b; }
        .vd-doc-expired { background: rgba(239,68,68,.1); color: #ef4444; }
        
        .vd-timeline { display: flex; flex-direction: column; gap: 1rem; position: relative; padding-left: 1.5rem; }
        .vd-timeline::before { content:''; position: absolute; left: 6px; top: 8px; bottom: 0; width: 2px; background: rgba(255,255,255,0.05); }
        .vd-tl-item { position: relative; padding-bottom: 1rem; }
        .vd-tl-dot { position: absolute; left: -1.5rem; top: 4px; width: 14px; height: 14px; border-radius: 50%; background: #6366f1; border: 3px solid #0f172a; }
        .vd-tl-dot.repair { background: #f59e0b; }
        .vd-tl-dot.incident { background: #ef4444; }
        .vd-tl-title { font-weight: 600; color: #f8fafc; font-size: 0.9rem; margin-bottom: 0.2rem; }
        .vd-tl-meta { font-size: 0.75rem; color: #64748b; margin-bottom: 0.4rem; font-family: 'DM Mono', monospace; }
        .vd-tl-desc { font-size: 0.85rem; color: #cbd5e1; }
        
        /* Modal for reporting issues */
        .vd-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem; }
        .vd-modal { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; width: 100%; max-width: 500px; overflow: hidden; }
        .vd-modal-header { padding: 1.2rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
        .vd-modal-title { font-weight: 700; color: #f8fafc; }
        .vd-modal-close { background: none; border: none; color: #94a3b8; cursor: pointer; }
        .vd-modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .vd-input, .vd-textarea, .vd-select { width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #f1f5f9; font-family: 'DM Sans'; margin-top: 0.4rem; }
        .vd-submit-btn { background: #ef4444; color: #fff; padding: 0.8rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 1rem; }
      `}</style>

      <div className="vd-header">
        <div className="vd-title-section">
          <div className="vd-title">{vehicle.make} {vehicle.model}</div>
          <div className="vd-subtitle">Plate: {vehicle.plateNumber} • VIN: {vehicle.vin || 'N/A'} • Odo: {vehicle.odometer} km</div>
          <div style={{ marginTop: '0.8rem' }}>
            <span className="vd-badge" style={{ background: sCfg.bg, border: `1px solid ${sCfg.border}`, color: sCfg.text }}>
              <span className="vd-badge-dot" style={{ background: sCfg.dot }} />
              {vehicle.status}
            </span>
          </div>
        </div>
        <div className="vd-actions">
          <button className="vd-btn-report" onClick={() => setIsReportIssueOpen(true)}>
            <Ico d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" />
            Report Issue
          </button>
        </div>
      </div>

      <div className="vd-tabs">
        {['Overview', 'Documents', 'Maintenance', 'Operations'].map(t => (
          <button key={t} className={`vd-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="vd-grid">
        {/* Persistent Left Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="vd-card">
            <div className="vd-card-title"><Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> Vehicle Details</div>
            <div className="vd-info-list">
              <div className="vd-info-row"><span className="vd-info-label">Year</span><span className="vd-info-val">{vehicle.year}</span></div>
              <div className="vd-info-row"><span className="vd-info-label">Color</span><span className="vd-info-val">{vehicle.color}</span></div>
              <div className="vd-info-row"><span className="vd-info-label">Company</span><span className="vd-info-val">{vehicle.company?.name || 'N/A'}</span></div>
              <div className="vd-info-row"><span className="vd-info-label">Next Service Due</span><span className="vd-info-val">{vehicle.nextServiceDue ? new Date(vehicle.nextServiceDue).toLocaleDateString() : 'N/A'}</span></div>
            </div>
          </div>

          <div className="vd-card">
            <div className="vd-card-title"><Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /> Assigned Driver</div>
            {driver ? (
              <div className="vd-info-list">
                <div className="vd-info-row"><span className="vd-info-label">Name</span><span className="vd-info-val">{driver.name}</span></div>
                <div className="vd-info-row"><span className="vd-info-label">Contact</span><span className="vd-info-val">{driver.phone || 'N/A'}</span></div>
                <div className="vd-info-row"><span className="vd-info-label">License No</span><span className="vd-info-val">{driver.licenseNumber || 'N/A'}</span></div>
                <div className="vd-info-row"><span className="vd-info-label">License Expiry</span><span className="vd-info-val">{driver.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString() : 'N/A'}</span></div>
              </div>
            ) : (
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No driver assigned currently.</div>
            )}
          </div>
        </div>

        {/* Dynamic Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {activeTab === 'Overview' && (
            <div className="vd-card" style={{ minHeight: '400px' }}>
              <div className="vd-card-title">Image Gallery</div>
              {vehicle.images && Object.values(vehicle.images).some(i => i) ? (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1rem' }}>
                  {Object.entries(vehicle.images).map(([view, url]) => url && (
                    <div key={view} style={{ position:'relative', borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)' }}>
                      <img src={`http://localhost:5000${url}`} alt={view} style={{ width:'100%', height:'200px', objectFit:'cover' }} />
                      <div style={{ position:'absolute', bottom:0, width:'100%', padding:'0.5rem', background:'rgba(0,0,0,0.6)', textTransform:'capitalize', fontSize:'0.8rem', textAlign:'center' }}>{view} View</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#64748b', fontSize: '0.9rem', textAlign:'center', padding:'3rem' }}>No images uploaded for this vehicle.</div>
              )}
            </div>
          )}

          {activeTab === 'Documents' && (
            <div className="vd-card">
              <div className="vd-card-title"><Ico d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" /> Document Repository</div>
              <div style={{ overflowX: 'auto' }}>
                <table className="vd-table">
                  <thead>
                    <tr>
                      <th>Document Type</th>
                      <th>Expiry Date</th>
                      <th>Days Left</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.length > 0 ? documents.map(d => {
                      const daysLeft = d.expiryDate ? Math.ceil((new Date(d.expiryDate) - new Date()) / 86400000) : null;
                      const statCls = daysLeft === null ? '' : daysLeft < 0 ? 'vd-doc-expired' : daysLeft <= 30 ? 'vd-doc-warn' : 'vd-doc-valid';
                      return (
                        <tr key={d._id}>
                          <td>{d.documentType}</td>
                          <td>{d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : 'N/A'}</td>
                          <td>{daysLeft !== null ? daysLeft : '-'}</td>
                          <td><span className={`vd-doc-status ${statCls}`}>{daysLeft < 0 ? 'Expired' : daysLeft <= 30 ? 'Expiring Soon' : 'Valid'}</span></td>
                          <td>
                            <a href={`http://localhost:5000${d.fileUrl}`} target="_blank" rel="noreferrer" style={{ color:'#6366f1', textDecoration:'none', fontSize:'0.8rem' }}>View</a>
                          </td>
                        </tr>
                      );
                    }) : <tr><td colSpan="5" style={{textAlign:'center'}}>No documents uploaded.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Maintenance' && (
            <>
              <div className="vd-card">
                <div className="vd-card-title"><Ico d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 9.36l-7.1 7.1a1 1 0 0 1-1.41 0l-1.42-1.42a1 1 0 0 1 0-1.41l7.1-7.1a6 6 0 0 1 9.36-7.94l-3.77 3.77z" /> Service History</div>
                {services.length > 0 ? (
                  <div className="vd-timeline">
                    {services.map(s => (
                      <div key={s._id} className="vd-tl-item">
                        <div className="vd-tl-dot" />
                        <div className="vd-tl-title">{s.serviceType} @ {s.workshop}</div>
                        <div className="vd-tl-meta">{new Date(s.serviceDate).toLocaleDateString()} • Odo: {s.odometer} km • Cost: ${s.cost}</div>
                        {s.remarks && <div className="vd-tl-desc">"{s.remarks}"</div>}
                        {s.invoice && <a href={`http://localhost:5000${s.invoice}`} target="_blank" rel="noreferrer" style={{color:'#10b981', fontSize:'0.75rem', marginTop:'0.3rem', display:'inline-block'}}>📎 View Invoice</a>}
                      </div>
                    ))}
                  </div>
                ) : <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No periodic services logged.</div>}
              </div>

              <div className="vd-card">
                <div className="vd-card-title"><Ico d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" /> Major Repairs</div>
                {repairs && repairs.length > 0 ? (
                  <div className="vd-timeline">
                    {repairs.map(r => (
                      <div key={r._id} className="vd-tl-item">
                        <div className="vd-tl-dot repair" />
                        <div className="vd-tl-title">{r.repairType} by {r.vendor}</div>
                        <div className="vd-tl-meta">{new Date(r.repairDate).toLocaleDateString()} • Cost: ${r.cost}</div>
                        {r.remarks && <div className="vd-tl-desc">"{r.remarks}"</div>}
                      </div>
                    ))}
                  </div>
                ) : <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No major repairs logged.</div>}
              </div>
            </>
          )}

          {activeTab === 'Operations' && (
            <>
              <div className="vd-card">
                <div className="vd-card-title"><Ico d="M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /> Fuel Logs</div>
                {fuel && fuel.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="vd-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Station</th>
                          <th>Liters</th>
                          <th>Cost</th>
                          <th>Odometer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fuel.map(f => (
                          <tr key={f._id}>
                            <td>{new Date(f.date).toLocaleDateString()}</td>
                            <td>{f.fuelStation}</td>
                            <td>{f.liters} L</td>
                            <td>${f.amount}</td>
                            <td>{f.odometer} km</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No fuel logs recorded.</div>}
              </div>

              <div className="vd-card">
                <div className="vd-card-title"><Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /> Assignment History</div>
                {assignments && assignments.length > 0 ? (
                  <div className="vd-timeline">
                    {assignments.map(assgn => (
                      <div key={assgn._id} className="vd-tl-item">
                        <div className="vd-tl-dot" style={{ background: '#3b82f6' }} />
                        <div className="vd-tl-title">Assigned to: {assgn.userId?.name || 'Unknown User'} ({assgn.userId?.department?.name || 'N/A'})</div>
                        <div className="vd-tl-meta">From: {new Date(assgn.assignedDate).toLocaleDateString()} {assgn.releasedDate ? `To: ${new Date(assgn.releasedDate).toLocaleDateString()}` : '(Current)'}</div>
                        {assgn.remarks && <div className="vd-tl-desc">"{assgn.remarks}"</div>}
                      </div>
                    ))}
                  </div>
                ) : <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No assignment history found.</div>}
              </div>

              <div className="vd-card">
                <div className="vd-card-title"><Ico d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> Incidents & Accidents</div>
                {incidents && incidents.length > 0 ? (
                  <div className="vd-timeline">
                    {incidents.map(inc => (
                      <div key={inc._id} className="vd-tl-item">
                        <div className="vd-tl-dot incident" />
                        <div className="vd-tl-title">{inc.incidentType} (Driver: {inc.driverId?.name || 'Unknown'})</div>
                        <div className="vd-tl-meta">{new Date(inc.incidentDate).toLocaleDateString()} • Damage Cost: ${inc.cost} • Claim: {inc.claimStatus}</div>
                        <div className="vd-tl-desc">{inc.description}</div>
                      </div>
                    ))}
                  </div>
                ) : <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Clean record. No incidents logged.</div>}
              </div>

              <div className="vd-card">
                <div className="vd-card-title"><Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> Trip History</div>
                {trips && trips.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="vd-table">
                      <thead>
                        <tr>
                          <th>Start Time</th>
                          <th>Destination</th>
                          <th>Purpose</th>
                          <th>Distance</th>
                          <th>Driver</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trips.map(t => (
                          <tr key={t._id}>
                            <td>{new Date(t.startTime).toLocaleDateString()} {new Date(t.startTime).toLocaleTimeString()}</td>
                            <td>{t.destination}</td>
                            <td>{t.purpose}</td>
                            <td>{t.distance ? `${t.distance} km` : 'Active'}</td>
                            <td>{t.driverId?.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No trips logged.</div>}
              </div>
            </>
          )}

        </div>
      </div>

      {isReportIssueOpen && (
        <div className="vd-modal-overlay" onClick={e => e.target === e.currentTarget && setIsReportIssueOpen(false)}>
          <div className="vd-modal">
            <div className="vd-modal-header">
              <div className="vd-modal-title">Report Vehicle Issue</div>
              <button className="vd-modal-close" onClick={() => setIsReportIssueOpen(false)}><Ico d="M18 6L6 18 M6 6l12 12" size={18} /></button>
            </div>
            <form className="vd-modal-body" onSubmit={handleReportIssue}>
              <div>
                <label style={{ fontSize:'0.8rem', color:'#94a3b8' }}>Issue Title</label>
                <input required className="vd-input" placeholder="e.g. Engine making noise" value={issueForm.title} onChange={e => setIssueForm({...issueForm, title: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize:'0.8rem', color:'#94a3b8' }}>Description</label>
                <textarea required className="vd-textarea" rows={4} placeholder="Provide details about the problem..." value={issueForm.description} onChange={e => setIssueForm({...issueForm, description: e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize:'0.8rem', color:'#94a3b8' }}>Severity / Priority</label>
                <select className="vd-select" value={issueForm.priority} onChange={e => setIssueForm({...issueForm, priority: e.target.value})}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical (Breakdown)</option>
                </select>
              </div>
              <button type="submit" className="vd-submit-btn" disabled={savingIssue}>
                {savingIssue ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default VehicleDetail;
