// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { QRCodeSVG } from 'qrcode.react';
// import { API_BASE_URL } from '../config';

// const STATUS_COLORS = {
//   'Available':      { bg: 'rgba(16,185,129,0.1)',   text: '#10b981', dot: '#10b981' },
//   'In Use':         { bg: 'rgba(99,102,241,0.1)',  text: '#818cf8', dot: '#6366f1' },
//   'Maintenance':    { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b', dot: '#f59e0b' },
//   'Out of Service': { bg: 'rgba(239,68,68,0.1)',   text: '#fca5a5', dot: '#ef4444' },
// };

// const VehiclesList = ({ role }) => {
//   const [vehicles, setVehicles] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
  
//   const [formData, setFormData] = useState({
//     make: '', model: '', plateNumber: '', year: new Date().getFullYear(),
//     color: '', vin: '', company: '', assignedTo: '', status: 'Available'
//   });

//   const [qrModal, setQrModal] = useState(null); // Stores vehicle for QR view

//   const isAdmin = role === 'Super Admin' || role === 'Admin';
//   const isSuperAdmin = role === 'Super Admin';

//   useEffect(() => {
//     fetchVehicles();
//     if (isAdmin) {
//       fetchCompanies();
//       fetchUsers();
//     }
//   }, []);

//   const fetchVehicles = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const user = JSON.parse(localStorage.getItem('user'));
//       let url = `${API_BASE_URL}/vehicles`;
      
//       // If regular user, they might only see assigned vehicles or all if permitted
//       if (!isAdmin) url = `${API_BASE_URL}/vehicles/me`;

//       const res = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setVehicles(res.data);
//     } catch (err) {
//       console.error('Failed to fetch vehicles', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCompanies = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${API_BASE_URL}/companies`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setCompanies(res.data);
//     } catch (err) { console.error(err); }
//   };

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${API_BASE_URL}/users`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUsers(res.data);
//     } catch (err) { console.error(err); }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const token = localStorage.getItem('token');
//       const data = { 
//         ...formData,
//         year: formData.year ? Number(formData.year) : undefined
//       };
//       if (data.assignedTo === '') data.assignedTo = null;
//       if (!data.company) throw new Error('Please select a company');

//       if (editingId) {
//         await axios.put(`${API_BASE_URL}/vehicles/${editingId}`, data, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       } else {
//         await axios.post(`${API_BASE_URL}/vehicles`, data, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       }
//       setIsModalOpen(false);
//       fetchVehicles();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || err.message || 'Error saving vehicle');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const openAdd = () => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     setFormData({
//       make: '', model: '', plateNumber: '', year: new Date().getFullYear(),
//       color: '', vin: '', company: user?.company || '', assignedTo: '', status: 'Available'
//     });
//     setEditingId(null);
//     setIsModalOpen(true);
//   };

//   const openEdit = (v) => {
//     setFormData({
//       make: v.make,
//       model: v.model,
//       plateNumber: v.plateNumber,
//       year: v.year,
//       color: v.color || '',
//       vin: v.vin || '',
//       company: v.company?._id || v.company || '',
//       assignedTo: v.assignedTo?._id || v.assignedTo || '',
//       status: v.status
//     });
//     setEditingId(v._id);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${API_BASE_URL}/vehicles/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchVehicles();
//     } catch (err) { console.error(err); }
//   };

//   const downloadQR = (id, plate) => {
//     const svg = document.getElementById(id);
//     const xml = new XMLSerializer().serializeToString(svg);
//     const svg64 = btoa(xml);
//     const b64Start = 'data:image/svg+xml;base64,';
//     const image64 = b64Start + svg64;
//     const link = document.createElement('a');
//     link.href = image64;
//     link.download = `QR_${plate}.svg`;
//     link.click();
//   };

//   if (loading) return <div style={{ color: '#94a3b8', padding: '2rem' }}>Loading vehicles...</div>;

//   return (
//     <div className="vh-root">
//       <style>{`
//         .vh-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
//         .vh-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
//         .vh-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 1.5rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
//         .vh-card:hover { transform: translateY(-5px); border-color: rgba(99,102,241,0.3); background: rgba(255,255,255,0.05); }
        
//         .vh-plate { font-family: 'DM Mono', monospace; background: #1e293b; color: #f1f5f9; padding: 0.25rem 0.75rem; border-radius: 6px; font-weight: 600; font-size: 0.9rem; border: 1px solid rgba(255,255,255,0.1); width: fit-content; margin-bottom: 1rem; }
//         .vh-name { font-size: 1.25rem; font-weight: 700; color: white; margin-bottom: 0.25rem; }
//         .vh-meta { font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem; }
        
//         .vh-status { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; margin-bottom: 1.2rem; }
//         .vh-info-row { display: flex; justify-content: space-between; font-size: 0.8rem; color: #64748b; margin-bottom: 0.5rem; }
//         .vh-info-val { color: #cbd5e1; font-weight: 500; }
        
//         .vh-footer { display: flex; gap: 0.5rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.06); }
//         .vh-btn { flex: 1; padding: 0.5rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: #cbd5e1; cursor: pointer; font-size: 0.8rem; font-weight: 500; transition: all 0.2s; }
//         .vh-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
//         .vh-btn-primary { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.2); color: #818cf8; }
//         .vh-btn-primary:hover { background: rgba(99,102,241,0.2); }
        
//         .vh-add-btn { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border: none; padding: 0.7rem 1.4rem; border-radius: 12px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 15px rgba(99,102,241,0.3); }
        
//         .vh-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justifyContent: center; z-index: 1000; padding: 1rem; }
//         .vh-modal { background: #0f172a; width: 500px; padding: 2rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); max-height: 90vh; overflow-y: auto; }
//         .vh-input-group { margin-bottom: 1.25rem; }
//         .vh-label { display: block; color: #94a3b8; font-size: 0.8rem; margin-bottom: 0.4rem; font-weight: 500; }
//         .vh-input, .vh-select { width: 100%; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); padding: 0.8rem; color: white; border-radius: 12px; outline: none; transition: border-color 0.2s; }
//         .vh-select option { background: #0f172a; color: white; }
//         .vh-input:focus { border-color: #6366f1; }
//       `}</style>

//       <div className="vh-header">
//         <div>
//           <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>Vehicles Registry</h2>
//           <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage company fleet and vehicle assignments</p>
//         </div>
//         {isAdmin && <button className="vh-add-btn" onClick={openAdd}>+ Add Vehicle</button>}
//       </div>

//       <div className="vh-grid">
//         {vehicles.map(v => {
//           const sc = STATUS_COLORS[v.status] || STATUS_COLORS['Available'];
//           return (
//             <div key={v._id} className="vh-card">
//               <div className="vh-plate">{v.plateNumber}</div>
//               <h3 className="vh-name">{v.make} {v.model}</h3>
//               <div className="vh-meta">{v.year} • {v.color || 'N/A'}</div>
              
//               <div className="vh-status" style={{ background: sc.bg, color: sc.text }}>
//                 <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
//                 {v.status}
//               </div>

//               <div className="vh-info-row">
//                 <span>Company</span>
//                 <span className="vh-info-val">{v.company?.name || 'N/A'}</span>
//               </div>
//               <div className="vh-info-row">
//                 <span>Assigned To</span>
//                 <span className="vh-info-val">{v.assignedTo?.name || 'Unassigned'}</span>
//               </div>

//               <div className="vh-footer">
//                 <button className="vh-btn vh-btn-primary" onClick={() => setQrModal(v)}>QR Code</button>
//                 {isAdmin && <button className="vh-btn" onClick={() => openEdit(v)}>Edit</button>}
//                 {isSuperAdmin && <button className="vh-btn" style={{ color: '#fca5a5' }} onClick={() => handleDelete(v._id)}>Delete</button>}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {isModalOpen && (
//         <div className="vh-modal-overlay">
//           <div className="vh-modal">
//             <h3 style={{ marginBottom: '1.5rem', color: 'white', fontSize: '1.5rem' }}>{editingId ? 'Edit Vehicle' : 'Register Vehicle'}</h3>
//             <form onSubmit={handleSubmit}>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
//                 <div className="vh-input-group">
//                   <label className="vh-label">Make</label>
//                   <input className="vh-input" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} required placeholder="e.g. Toyota" />
//                 </div>
//                 <div className="vh-input-group">
//                   <label className="vh-label">Model</label>
//                   <input className="vh-input" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} required placeholder="e.g. Camry" />
//                 </div>
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
//                 <div className="vh-input-group">
//                   <label className="vh-label">Plate Number</label>
//                   <input className="vh-input" value={formData.plateNumber} onChange={e => setFormData({...formData, plateNumber: e.target.value})} required placeholder="e.g. ABC-1234" />
//                 </div>
//                 <div className="vh-input-group">
//                   <label className="vh-label">Year</label>
//                   <input className="vh-input" type="number" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
//                 </div>
//               </div>

//               <div className="vh-input-group">
//                 <label className="vh-label">VIN (Optional)</label>
//                 <input className="vh-input" value={formData.vin} onChange={e => setFormData({...formData, vin: e.target.value})} placeholder="Vehicle Identification Number" />
//               </div>

//               <div className="vh-input-group">
//                 <label className="vh-label">Company</label>
//                 <select className="vh-select" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required>
//                   <option value="">Select Company</option>
//                   {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//                 </select>
//                 {companies.length === 0 && <p style={{ color: '#fca5a5', fontSize: '0.7rem', marginTop: '0.4rem' }}>⚠️ No companies found. Please create one first.</p>}
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
//                 <div className="vh-input-group">
//                   <label className="vh-label">Status</label>
//                   <select className="vh-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
//                     <option value="Available">Available</option>
//                     <option value="In Use">In Use</option>
//                     <option value="Maintenance">Maintenance</option>
//                     <option value="Out of Service">Out of Service</option>
//                   </select>
//                 </div>
//                 <div className="vh-input-group">
//                   <label className="vh-label">Assign To</label>
//                   <select className="vh-select" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})}>
//                     <option value="">Unassigned</option>
//                     {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
//                   </select>
//                 </div>
//               </div>

//               <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
//                 <button type="button" className="vh-btn" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.8rem' }}>Cancel</button>
//                 <button type="submit" className="vh-add-btn" style={{ flex: 1 }}>{saving ? 'Saving...' : editingId ? 'Update' : 'Register'}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {qrModal && (
//         <div className="vh-modal-overlay">
//           <div className="vh-modal" style={{ width: '350px', textAlign: 'center' }}>
//             <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>Vehicle QR Code</h3>
//             <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', display: 'inline-block', marginBottom: '1.5rem' }}>
//               <QRCodeSVG 
//                 id={`qr-${qrModal._id}`}
//                 value={JSON.stringify({ type: 'vehicle', id: qrModal._id, plate: qrModal.plateNumber })}
//                 size={200}
//                 level="H"
//                 includeMargin={true}
//               />
//             </div>
//             <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
//               <strong>{qrModal.plateNumber}</strong><br/>
//               {qrModal.make} {qrModal.model}
//             </p>
//             <div style={{ display: 'flex', gap: '1rem' }}>
//               <button className="vh-btn" onClick={() => setQrModal(null)}>Close</button>
//               <button className="vh-add-btn" style={{ flex: 1 }} onClick={() => downloadQR(`qr-${qrModal._id}`, qrModal.plateNumber)}>Download SVG</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VehiclesList;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { API_BASE_URL } from '../config';

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  @keyframes vh-fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes vh-fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes vh-shimmer   { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes vh-spin      { to{transform:rotate(360deg)} }
  @keyframes vh-modalIn   { from{opacity:0;transform:translateY(18px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes vh-overlayIn { from{opacity:0} to{opacity:1} }
  @keyframes vh-gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes vh-pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }

  .vh-root * { box-sizing:border-box; margin:0; padding:0; }
  .vh-root { font-family:'DM Sans',sans-serif; color:#e2e8f0; padding:2rem 0; }

  /* ── Header ── */
  .vh-header {
    display:flex; justify-content:space-between; align-items:flex-end;
    margin-bottom:2rem; animation:vh-fadeUp .4s ease both;
  }
  .vh-eyebrow { font-size:.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#06b6d4;margin-bottom:.3rem; }
  .vh-title   { font-family:'Syne',sans-serif;font-size:1.7rem;font-weight:800;color:#f8fafc; }
  .vh-sub     { font-size:.82rem;color:#334155;margin-top:.2rem; }

  .vh-add-btn {
    display:flex;align-items:center;gap:.45rem;
    padding:.6rem 1.2rem;border-radius:12px;border:none;cursor:pointer;
    background:linear-gradient(135deg,#6366f1,#4f46e5);
    color:#fff;font-family:'DM Sans',sans-serif;font-size:.84rem;font-weight:600;
    box-shadow:0 4px 18px rgba(99,102,241,.4);transition:all .2s;
    background-size:200%;animation:vh-gradShift 5s ease infinite;
  }
  .vh-add-btn:hover { transform:translateY(-2px);box-shadow:0 6px 24px rgba(99,102,241,.5); }

  /* ── Grid ── */
  .vh-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.2rem; }

  /* ── Vehicle card ── */
  .vh-card {
    background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);
    border-radius:22px;padding:1.6rem;
    position:relative;overflow:hidden;
    transition:transform .22s,border-color .22s,background .22s;
    animation:vh-fadeUp .4s ease both;
  }
  .vh-card:hover { transform:translateY(-4px);border-color:rgba(99,102,241,.25);background:rgba(255,255,255,.05); }
  .vh-card::after {
    content:'';position:absolute;inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,.03) 0%,transparent 60%);
    pointer-events:none;
  }
  .vh-card-accent {
    position:absolute;top:0;left:0;right:0;height:2.5px;border-radius:22px 22px 0 0;
  }

  /* plate */
  .vh-plate {
    display:inline-flex;align-items:center;gap:.5rem;
    font-family:'DM Mono',monospace;
    background:#0d1117;color:#f1f5f9;
    padding:.28rem .75rem;border-radius:7px;
    font-weight:600;font-size:.85rem;
    border:1px solid rgba(255,255,255,.1);
    margin-bottom:1rem;letter-spacing:.05em;
  }
  .vh-plate svg { color:#475569; }

  .vh-make  { font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#f1f5f9;margin-bottom:.2rem; }
  .vh-year  { font-size:.78rem;color:#475569;margin-bottom:1rem;font-family:'DM Mono',monospace; }

  /* status badge */
  .vh-status {
    display:inline-flex;align-items:center;gap:.4rem;
    padding:.28rem .7rem;border-radius:7px;
    font-size:.72rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
    margin-bottom:1.2rem;
  }
  .vh-status-dot { width:6px;height:6px;border-radius:50%;animation:vh-pulse 2.2s ease infinite; }

  /* info rows */
  .vh-info { display:flex;flex-direction:column;gap:.4rem;margin-bottom:1.4rem; }
  .vh-info-row {
    display:flex;justify-content:space-between;align-items:center;
    font-size:.78rem;padding:.3rem 0;
    border-bottom:1px solid rgba(255,255,255,.04);
  }
  .vh-info-row:last-child { border-bottom:none; }
  .vh-info-key { color:#334155;display:flex;align-items:center;gap:.4rem; }
  .vh-info-key svg { color:#1e293b; }
  .vh-info-val { color:#94a3b8;font-weight:500;font-size:.78rem; }

  /* card footer */
  .vh-card-footer {
    display:flex;gap:.55rem;
    padding-top:1.1rem;border-top:1px solid rgba(255,255,255,.05);
  }
  .vh-btn {
    flex:1;display:flex;align-items:center;justify-content:center;gap:.35rem;
    padding:.5rem .6rem;border-radius:9px;cursor:pointer;
    border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);
    color:#64748b;font-family:'DM Sans',sans-serif;font-size:.76rem;font-weight:500;
    transition:all .18s;
  }
  .vh-btn:hover { background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.15);color:#94a3b8; }
  .vh-btn-qr   { background:rgba(6,182,212,.08);border-color:rgba(6,182,212,.22);color:#22d3ee; }
  .vh-btn-qr:hover { background:rgba(6,182,212,.16);border-color:rgba(6,182,212,.4); }
  .vh-btn-edit { background:rgba(99,102,241,.08);border-color:rgba(99,102,241,.22);color:#818cf8; }
  .vh-btn-edit:hover { background:rgba(99,102,241,.16);border-color:rgba(99,102,241,.4); }
  .vh-btn-del  { background:rgba(239,68,68,.07);border-color:rgba(239,68,68,.2);color:#fca5a5; }
  .vh-btn-del:hover { background:rgba(239,68,68,.14);border-color:rgba(239,68,68,.4); }

  /* ── Empty ── */
  .vh-empty {
    grid-column:1/-1;text-align:center;padding:4rem 2rem;
    background:rgba(255,255,255,.02);border:1px dashed rgba(255,255,255,.07);border-radius:22px;
    animation:vh-fadeUp .4s ease both;
  }
  .vh-empty-icon  { font-size:2.5rem;opacity:.3;margin-bottom:.8rem; }
  .vh-empty-title { font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:#334155;margin-bottom:.35rem; }
  .vh-empty-sub   { font-size:.82rem;color:#1e293b; }

  /* ── Skeleton ── */
  .vh-skel { background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:22px;padding:1.6rem;animation:vh-fadeUp .4s ease both; }
  .vh-skel-line { background:linear-gradient(90deg,rgba(255,255,255,.04) 0px,rgba(255,255,255,.09) 100px,rgba(255,255,255,.04) 200px);background-size:600px 100%;animation:vh-shimmer 1.4s infinite linear;border-radius:6px; }

  /* ── OVERLAY ── */
  .vh-overlay {
    position:fixed;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(8px);
    display:flex;align-items:center;justify-content:center;z-index:1000;padding:1rem;
    animation:vh-overlayIn .2s ease both;
  }

  /* ── MODAL ── */
  .vh-modal {
    background:#0d1117;border:1px solid rgba(255,255,255,.09);
    border-radius:24px;width:100%;max-width:520px;
    max-height:90vh;overflow-y:auto;
    box-shadow:0 30px 70px rgba(0,0,0,.6);position:relative;
    animation:vh-modalIn .3s cubic-bezier(.22,1,.36,1) both;
  }
  .vh-modal::-webkit-scrollbar { width:4px; }
  .vh-modal::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08);border-radius:4px; }

  .vh-modal-accent { position:absolute;top:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4);border-radius:24px 24px 0 0; }

  .vh-modal-header {
    display:flex;justify-content:space-between;align-items:center;
    padding:1.8rem 2rem 0;margin-bottom:1.6rem;
  }
  .vh-modal-title { font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#f8fafc; }
  .vh-modal-close {
    width:30px;height:30px;border-radius:8px;border:1px solid rgba(255,255,255,.09);
    background:rgba(255,255,255,.04);color:#64748b;cursor:pointer;
    display:flex;align-items:center;justify-content:center;transition:all .18s;
  }
  .vh-modal-close:hover { background:rgba(255,255,255,.08);color:#94a3b8; }

  .vh-modal-body { padding:0 2rem 2rem; }

  .vh-2col { display:grid;grid-template-columns:1fr 1fr;gap:1rem; }
  .vh-field { margin-bottom:1.1rem; }
  .vh-label {
    display:block;font-size:.7rem;font-weight:600;letter-spacing:.1em;
    text-transform:uppercase;color:#334155;margin-bottom:.42rem;
  }
  .vh-input, .vh-select {
    width:100%;padding:.78rem 1rem;
    background:#0a0e1a;border:1px solid rgba(255,255,255,.08);
    border-radius:11px;color:#e2e8f0;
    font-family:'DM Sans',sans-serif;font-size:.88rem;outline:none;
    transition:border-color .2s,box-shadow .2s;appearance:none;
  }
  .vh-input:focus,.vh-select:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12); }
  .vh-input::placeholder { color:#1e293b; }
  .vh-select option { background:#0a0e1a; }
  .vh-select-wrap { position:relative; }
  .vh-select-wrap::after {
    content:'';position:absolute;right:1rem;top:50%;transform:translateY(-50%);
    border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #334155;
    pointer-events:none;
  }
  .vh-warn { font-size:.72rem;color:#f87171;margin-top:.4rem;display:flex;align-items:center;gap:.3rem; }

  /* modal footer */
  .vh-modal-footer { display:flex;gap:.8rem;margin-top:1.4rem; }
  .vh-cancel-btn {
    flex:1;padding:.75rem;border-radius:11px;border:1px solid rgba(255,255,255,.09);
    background:rgba(255,255,255,.04);color:#64748b;
    font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:500;cursor:pointer;transition:all .18s;
  }
  .vh-cancel-btn:hover { background:rgba(255,255,255,.08);color:#94a3b8; }
  .vh-save-btn {
    flex:1;padding:.75rem;border-radius:11px;border:none;cursor:pointer;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);background-size:200%;
    color:#fff;font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;
    box-shadow:0 4px 18px rgba(99,102,241,.38);transition:all .2s;
    display:flex;align-items:center;justify-content:center;gap:.5rem;
    animation:vh-gradShift 5s ease infinite;
  }
  .vh-save-btn:hover { transform:translateY(-2px);box-shadow:0 6px 24px rgba(99,102,241,.5); }
  .vh-save-btn:disabled { opacity:.55;cursor:not-allowed;transform:none; }
  .vh-spinner { width:15px;height:15px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:vh-spin .65s linear infinite; }

  /* ── QR Modal ── */
  .vh-qr-modal {
    background:#0d1117;border:1px solid rgba(255,255,255,.09);
    border-radius:24px;width:100%;max-width:360px;padding:2.2rem;
    text-align:center;position:relative;
    box-shadow:0 30px 70px rgba(0,0,0,.6);
    animation:vh-modalIn .3s cubic-bezier(.22,1,.36,1) both;
  }
  .vh-qr-modal-accent { position:absolute;top:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,#06b6d4,#8b5cf6);border-radius:24px 24px 0 0; }
  .vh-qr-title { font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#f8fafc;margin-bottom:1.5rem; }
  .vh-qr-box   { background:#fff;padding:1.2rem;border-radius:16px;display:inline-block;margin-bottom:1.4rem; }
  .vh-qr-plate { font-family:'DM Mono',monospace;font-size:.95rem;font-weight:700;color:#f1f5f9;margin-bottom:.25rem; }
  .vh-qr-name  { font-size:.8rem;color:#475569;margin-bottom:1.4rem; }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const STATUS_CFG = {
  'Available':      { bg:'rgba(16,185,129,.12)',  text:'#34d399', dot:'#10b981', bar:'#10b981' },
  'In Use':         { bg:'rgba(99,102,241,.12)',  text:'#818cf8', dot:'#6366f1', bar:'#6366f1' },
  'Maintenance':    { bg:'rgba(245,158,11,.12)',  text:'#fbbf24', dot:'#f59e0b', bar:'#f59e0b' },
  'Out of Service': { bg:'rgba(239,68,68,.12)',   text:'#f87171', dot:'#ef4444', bar:'#ef4444' },
};

const SkeletonCard = ({ delay }) => (
  <div className="vh-skel" style={{ animationDelay: delay }}>
    <div className="vh-skel-line" style={{ height: 22, width: '45%', marginBottom: '1rem' }} />
    <div className="vh-skel-line" style={{ height: 18, width: '70%', marginBottom: '.4rem' }} />
    <div className="vh-skel-line" style={{ height: 12, width: '35%', marginBottom: '1.2rem' }} />
    <div className="vh-skel-line" style={{ height: 26, width: '32%', marginBottom: '1.2rem', borderRadius: 7 }} />
    {[65, 55, 60].map((w, i) => (
      <div key={i} className="vh-skel-line" style={{ height: 11, width: `${w}%`, marginBottom: '.55rem' }} />
    ))}
    <div style={{ display: 'flex', gap: '.55rem', marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,.04)' }}>
      {[1,1,1].map((_, i) => <div key={i} className="vh-skel-line" style={{ flex: 1, height: 34, borderRadius: 9 }} />)}
    </div>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────
const VehiclesList = ({ role }) => {
  const [vehicles, setVehicles]   = useState([]);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers]         = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [qrModal, setQrModal]     = useState(null);

  const [formData, setFormData] = useState({
    make:'', model:'', plateNumber:'', year: new Date().getFullYear(),
    color:'', vin:'', company:'', assignedTo:'', status:'Available'
  });

  const isAdmin      = role === 'Super Admin' || role === 'Admin';
  const isSuperAdmin = role === 'Super Admin';

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => {
    fetchVehicles();
    if (isAdmin) { fetchCompanies(); fetchUsers(); }
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = isAdmin ? `${API_BASE_URL}/vehicles` : `${API_BASE_URL}/vehicles/me`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setVehicles(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/companies`, { headers: { Authorization: `Bearer ${token}` } });
      setCompanies(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  const openAdd = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    setFormData({ make:'', model:'', plateNumber:'', year: new Date().getFullYear(), color:'', vin:'', company: user?.company||'', assignedTo:'', status:'Available' });
    setEditingId(null); setIsModalOpen(true);
  };

  const openEdit = (v) => {
    setFormData({ make: v.make, model: v.model, plateNumber: v.plateNumber, year: v.year, color: v.color||'', vin: v.vin||'', company: v.company?._id||v.company||'', assignedTo: v.assignedTo?._id||v.assignedTo||'', status: v.status });
    setEditingId(v._id); setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const data = { ...formData, year: formData.year ? Number(formData.year) : undefined };
      if (data.assignedTo === '') data.assignedTo = null;
      if (!data.company) throw new Error('Please select a company');
      const cfg = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) {
        await axios.put(`${API_BASE_URL}/vehicles/${editingId}`, data, cfg);
      } else {
        await axios.post(`${API_BASE_URL}/vehicles`, data, cfg);
      }
      setIsModalOpen(false); fetchVehicles();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/vehicles/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchVehicles();
    } catch (err) { console.error(err); }
  };

  const downloadQR = (id, plate) => {
    const svg = document.getElementById(id);
    const xml = new XMLSerializer().serializeToString(svg);
    const link = document.createElement('a');
    link.href = 'data:image/svg+xml;base64,' + btoa(xml);
    link.download = `QR_${plate}.svg`;
    link.click();
  };

  return (
    <div className="vh-root">
      {/* Header */}
      <div className="vh-header">
        <div>
          <div className="vh-eyebrow">Fleet Management</div>
          <h2 className="vh-title">Vehicles Registry</h2>
          <p className="vh-sub">Manage company fleet and vehicle assignments</p>
        </div>
        {isAdmin && (
          <button className="vh-add-btn" onClick={openAdd}>
            <Ico d="M12 5v14 M5 12h14" size={15} /> Add Vehicle
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="vh-grid">
        {loading
          ? [0,1,2,3].map(i => <SkeletonCard key={i} delay={`${i*.07}s`} />)
          : vehicles.length === 0
            ? (
              <div className="vh-empty">
                <div className="vh-empty-icon">🚗</div>
                <div className="vh-empty-title">No vehicles registered</div>
                <div className="vh-empty-sub">{isAdmin ? 'Click "Add Vehicle" to register the first one.' : 'No vehicles are assigned to you.'}</div>
              </div>
            )
            : vehicles.map((v, i) => {
              const sc = STATUS_CFG[v.status] || STATUS_CFG['Available'];
              return (
                <div className="vh-card" key={v._id} style={{ animationDelay:`${i*.06}s` }}>
                  <div className="vh-card-accent" style={{ background: sc.bar }} />

                  <div className="vh-plate">
                    <Ico d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z M9 9h6 M9 12h6 M9 15h4" size={12} />
                    {v.plateNumber}
                  </div>

                  <div className="vh-make">{v.make} {v.model}</div>
                  <div className="vh-year">{v.year}{v.color ? ` · ${v.color}` : ''}</div>

                  <div className="vh-status" style={{ background: sc.bg, color: sc.text }}>
                    <span className="vh-status-dot" style={{ background: sc.dot }} />
                    {v.status}
                  </div>

                  <div className="vh-info">
                    <div className="vh-info-row">
                      <span className="vh-info-key"><Ico d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> Company</span>
                      <span className="vh-info-val">{v.company?.name || '—'}</span>
                    </div>
                    <div className="vh-info-row">
                      <span className="vh-info-key"><Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /> Assigned To</span>
                      <span className="vh-info-val">{v.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                    {v.vin && (
                      <div className="vh-info-row">
                        <span className="vh-info-key"><Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /> VIN</span>
                        <span className="vh-info-val" style={{ fontFamily:'DM Mono,monospace', fontSize:'.72rem' }}>{v.vin}</span>
                      </div>
                    )}
                  </div>

                  <div className="vh-card-footer">
                    <button className="vh-btn vh-btn-qr" onClick={() => setQrModal(v)}>
                      <Ico d="M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h3 M14 21h3 M17 17h3v4 M20 14v3" size={13} /> QR
                    </button>
                    {isAdmin && (
                      <button className="vh-btn vh-btn-edit" onClick={() => openEdit(v)}>
                        <Ico d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={13} /> Edit
                      </button>
                    )}
                    {isSuperAdmin && (
                      <button className="vh-btn vh-btn-del" onClick={() => handleDelete(v._id)}>
                        <Ico d="M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" size={13} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
        }
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="vh-overlay" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="vh-modal">
            <div className="vh-modal-accent" />
            <div className="vh-modal-header">
              <div className="vh-modal-title">{editingId ? 'Edit Vehicle' : 'Register Vehicle'}</div>
              <button className="vh-modal-close" onClick={() => setIsModalOpen(false)}>
                <Ico d="M18 6L6 18 M6 6l12 12" size={14} />
              </button>
            </div>
            <div className="vh-modal-body">
              <form onSubmit={handleSubmit}>
                <div className="vh-2col">
                  <div className="vh-field">
                    <label className="vh-label">Make <span style={{color:'#ef4444'}}>*</span></label>
                    <input className="vh-input" placeholder="Toyota" value={formData.make} onChange={e => set('make', e.target.value)} required />
                  </div>
                  <div className="vh-field">
                    <label className="vh-label">Model <span style={{color:'#ef4444'}}>*</span></label>
                    <input className="vh-input" placeholder="Camry" value={formData.model} onChange={e => set('model', e.target.value)} required />
                  </div>
                </div>

                <div className="vh-2col">
                  <div className="vh-field">
                    <label className="vh-label">Plate Number <span style={{color:'#ef4444'}}>*</span></label>
                    <input className="vh-input" placeholder="ABC-1234" value={formData.plateNumber} onChange={e => set('plateNumber', e.target.value)} required />
                  </div>
                  <div className="vh-field">
                    <label className="vh-label">Year</label>
                    <input className="vh-input" type="number" value={formData.year} onChange={e => set('year', e.target.value)} />
                  </div>
                </div>

                <div className="vh-2col">
                  <div className="vh-field">
                    <label className="vh-label">Color</label>
                    <input className="vh-input" placeholder="e.g. White" value={formData.color} onChange={e => set('color', e.target.value)} />
                  </div>
                  <div className="vh-field">
                    <label className="vh-label">VIN</label>
                    <input className="vh-input" placeholder="Optional" value={formData.vin} onChange={e => set('vin', e.target.value)} />
                  </div>
                </div>

                <div className="vh-field">
                  <label className="vh-label">Company <span style={{color:'#ef4444'}}>*</span></label>
                  <div className="vh-select-wrap">
                    <select className="vh-select" value={formData.company} onChange={e => set('company', e.target.value)} required>
                      <option value="">Select Company</option>
                      {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  {companies.length === 0 && <p className="vh-warn"><Ico d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" size={12} /> No companies found. Create one first.</p>}
                </div>

                <div className="vh-2col">
                  <div className="vh-field">
                    <label className="vh-label">Status</label>
                    <div className="vh-select-wrap">
                      <select className="vh-select" value={formData.status} onChange={e => set('status', e.target.value)}>
                        <option>Available</option>
                        <option>In Use</option>
                        <option>Maintenance</option>
                        <option>Out of Service</option>
                      </select>
                    </div>
                  </div>
                  <div className="vh-field">
                    <label className="vh-label">Assign To</label>
                    <div className="vh-select-wrap">
                      <select className="vh-select" value={formData.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
                        <option value="">Unassigned</option>
                        {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="vh-modal-footer">
                  <button type="button" className="vh-cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="vh-save-btn" disabled={saving}>
                    {saving
                      ? <><span className="vh-spinner" /> Saving…</>
                      : <><Ico d="M20 6L9 17l-5-5" size={15} /> {editingId ? 'Update' : 'Register'}</>
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrModal && (
        <div className="vh-overlay" onClick={e => e.target === e.currentTarget && setQrModal(null)}>
          <div className="vh-qr-modal">
            <div className="vh-qr-modal-accent" />
            <div className="vh-qr-title">Vehicle QR Code</div>
            <div className="vh-qr-box">
              <QRCodeSVG
                id={`qr-${qrModal._id}`}
                value={JSON.stringify({ type:'vehicle', id:qrModal._id, plate:qrModal.plateNumber })}
                size={190} level="H" includeMargin
              />
            </div>
            <div className="vh-qr-plate">{qrModal.plateNumber}</div>
            <div className="vh-qr-name">{qrModal.make} {qrModal.model} · {qrModal.year}</div>
            <div className="vh-modal-footer">
              <button className="vh-cancel-btn" onClick={() => setQrModal(null)}>Close</button>
              <button className="vh-save-btn" onClick={() => downloadQR(`qr-${qrModal._id}`, qrModal.plateNumber)}>
                <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" size={15} /> Download SVG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesList;