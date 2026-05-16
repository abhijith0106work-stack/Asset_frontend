// import { API_BASE_URL } from '../config';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CompanyManagement = () => {
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingCompany, setEditingCompany] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     address: '',
//     contactEmail: '',
//     contactPhone: ''
//   });
//   const [logoFile, setLogoFile] = useState(null);
//   const [logoPreview, setLogoPreview] = useState(null);

//   useEffect(() => {
//     fetchCompanies();
//   }, []);

//   const fetchCompanies = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${API_BASE_URL}/companies`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setCompanies(res.data);
//     } catch (err) {
//       console.error('Error fetching companies', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenModal = (company = null) => {
//     if (company) {
//       setEditingCompany(company);
//       setFormData({
//         name: company.name,
//         address: company.address || '',
//         contactEmail: company.contactEmail || '',
//         contactPhone: company.contactPhone || ''
//       });
//       setLogoPreview(company.logo ? `http://localhost:5000${company.logo}` : null);
//     } else {
//       setEditingCompany(null);
//       setFormData({ name: '', address: '', contactEmail: '', contactPhone: '' });
//       setLogoPreview(null);
//     }
//     setLogoFile(null);
//     setShowModal(true);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setLogoFile(file || null);
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setLogoPreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      
//       const data = new FormData();
//       Object.keys(formData).forEach(key => data.append(key, formData[key]));
//       if (logoFile) data.append('logo', logoFile);

//       if (editingCompany) {
//         await axios.put(`${API_BASE_URL}/companies/${editingCompany._id}`, data, config);
//       } else {
//         await axios.post(`${API_BASE_URL}/companies`, data, config);
//       }
      
//       setShowModal(false);
//       fetchCompanies();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Error saving company');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this company?')) return;
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${API_BASE_URL}/companies/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchCompanies();
//     } catch (err) {
//       alert('Error deleting company');
//     }
//   };

//   if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading companies...</div>;

//   return (
//     <div className="cm-root">
//       <style>{`
//         .cm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
//         .cm-title { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; }
//         .cm-add-btn { background: #6366f1; color: white; border: none; padding: 0.6rem 1.2rem; borderRadius: 8px; cursor: pointer; font-weight: 600; }
        
//         .cm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
//         .cm-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 1.5rem; border-radius: 12px; }
//         .cm-card-top { display: flex; gap: 1rem; margin-bottom: 1rem; }
//         .cm-logo-sm { width: 50px; height: 50px; border-radius: 8px; object-fit: contain; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
//         .cm-card-name { font-size: 1.2rem; font-weight: 600; color: #f8fafc; }
//         .cm-card-detail { font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.25rem; }
//         .cm-card-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
//         .cm-edit-btn { background: rgba(99,102,241,0.1); color: #818cf8; border: 1px solid rgba(99,102,241,0.2); padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; }
//         .cm-delete-btn { background: rgba(239,68,68,0.1); color: #fca5a5; border: 1px solid rgba(239,68,68,0.2); padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; }

//         .cm-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justifyContent: center; z-index: 1000; }
//         .cm-modal { background: #0f172a; width: 450px; padding: 2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); max-height: 90vh; overflow-y: auto; }
//         .cm-form-group { margin-bottom: 1.2rem; }
//         .cm-label { display: block; color: #94a3b8; font-size: 0.8rem; margin-bottom: 0.4rem; }
//         .cm-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.7rem; color: white; border-radius: 8px; }
//       `}</style>

//       <div className="cm-header">
//         <h2 className="cm-title">Companies Management</h2>
//         <button className="cm-add-btn" onClick={() => handleOpenModal()}>+ Add Company</button>
//       </div>

//       <div className="cm-grid">
//         {companies.map(c => (
//           <div key={c._id} className="cm-card">
//             <div className="cm-card-top">
//               {c.logo ? <img src={`http://localhost:5000${c.logo}`} className="cm-logo-sm" alt="logo" /> : <div className="cm-logo-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏢</div>}
//               <div className="cm-card-name">{c.name}</div>
//             </div>
//             <div className="cm-card-detail">📍 {c.address || 'No address'}</div>
//             <div className="cm-card-detail">✉️ {c.contactEmail || 'No email'}</div>
//             <div className="cm-card-detail">📞 {c.contactPhone || 'No phone'}</div>
//             <div className="cm-card-actions">
//               <button className="cm-edit-btn" onClick={() => handleOpenModal(c)}>Edit</button>
//               <button className="cm-delete-btn" onClick={() => handleDelete(c._id)}>Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {showModal && (
//         <div className="cm-modal-overlay">
//           <div className="cm-modal">
//             <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>{editingCompany ? 'Edit Company' : 'New Company'}</h3>
//             <form onSubmit={handleSubmit}>
//               <div className="cm-form-group">
//                 <label className="cm-label">Company Name</label>
//                 <input className="cm-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
//               </div>
//               <div className="cm-form-group">
//                 <label className="cm-label">Address</label>
//                 <input className="cm-input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
//               </div>
//               <div className="cm-form-group">
//                 <label className="cm-label">Contact Email</label>
//                 <input className="cm-input" type="email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
//               </div>
//               <div className="cm-form-group">
//                 <label className="cm-label">Contact Phone</label>
//                 <input className="cm-input" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
//               </div>
//               <div className="cm-form-group">
//                 <label className="cm-label">Company Logo</label>
//                 <input type="file" onChange={handleFileChange} style={{ color: '#94a3b8', fontSize: '0.8rem' }} />
//                 {logoPreview && <img src={logoPreview} style={{ width: '100px', height: '100px', objectFit: 'contain', marginTop: '0.5rem', background: 'white', padding: '5px', borderRadius: '8px' }} alt="preview" />}
//               </div>
//               <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
//                 <button type="button" className="cm-delete-btn" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
//                 <button type="submit" className="cm-add-btn" style={{ flex: 1 }}>{editingCompany ? 'Update' : 'Create'}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompanyManagement;

import { API_BASE_URL } from '../config';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { exportToCSV } from '../utils/exportUtils';

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  @keyframes cm-fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes cm-fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes cm-shimmer   { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes cm-spin      { to{transform:rotate(360deg)} }
  @keyframes cm-modalIn   { from{opacity:0;transform:translateY(18px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes cm-overlayIn { from{opacity:0} to{opacity:1} }
  @keyframes cm-gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

  .cm-root * { box-sizing:border-box; margin:0; padding:0; }
  .cm-root { font-family:'DM Sans',sans-serif; color:#e2e8f0; padding:2rem 0; }

  /* ── Header ── */
  .cm-header {
    display:flex; justify-content:space-between; align-items:flex-end;
    margin-bottom:2rem; animation:cm-fadeUp .4s ease both;
  }
  .cm-eyebrow { font-size:.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#6366f1;margin-bottom:.3rem; }
  .cm-title   { font-family:'Syne',sans-serif;font-size:1.7rem;font-weight:800;color:#f8fafc; }

  .cm-add-btn {
    display:flex;align-items:center;gap:.45rem;
    padding:.6rem 1.2rem;border-radius:12px;border:none;cursor:pointer;
    background:#6366f1;color:#fff;
    font-family:'DM Sans',sans-serif;font-size:.84rem;font-weight:600;
    box-shadow:0 4px 18px rgba(99,102,241,.4);transition:all .2s;
  }
  .cm-add-btn:hover { background:#5254cc;transform:translateY(-2px);box-shadow:0 6px 24px rgba(99,102,241,.5); }

  /* ── Grid ── */
  .cm-grid {
    display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
    gap:1.2rem;
  }

  /* ── Company card ── */
  .cm-card {
    background:rgba(255,255,255,.03);
    border:1px solid rgba(255,255,255,.07);
    border-radius:20px;padding:1.6rem;
    position:relative;overflow:hidden;
    transition:transform .22s,border-color .22s;
    animation:cm-fadeUp .4s ease both;
  }
  .cm-card:hover { transform:translateY(-3px);border-color:rgba(255,255,255,.12); }
  .cm-card::after {
    content:'';position:absolute;inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,.03) 0%,transparent 60%);
    pointer-events:none;
  }
  .cm-card-accent {
    position:absolute;top:0;left:0;right:0;height:2.5px;
    background:linear-gradient(90deg,#6366f1,#8b5cf6);
    border-radius:20px 20px 0 0;
  }

  /* card top */
  .cm-card-top { display:flex;align-items:center;gap:1rem;margin-bottom:1.2rem; }
  .cm-logo-wrap {
    width:52px;height:52px;border-radius:13px;flex-shrink:0;
    background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);
    display:flex;align-items:center;justify-content:center;overflow:hidden;
    position:relative;
  }
  .cm-logo-wrap::before {
    content:'';position:absolute;inset:0;
    background:linear-gradient(135deg,rgba(99,102,241,.15),rgba(6,182,212,.08));
  }
  .cm-logo-img { width:38px;height:38px;object-fit:contain;position:relative;z-index:1; }
  .cm-logo-fb  { font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;background:linear-gradient(135deg,#6366f1,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;position:relative;z-index:1; }
  .cm-card-name { font-family:'Syne',sans-serif;font-size:1.05rem;font-weight:700;color:#f1f5f9; }

  /* meta */
  .cm-meta { display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.4rem; }
  .cm-meta-row {
    display:flex;align-items:center;gap:.55rem;
    font-size:.8rem;color:#475569;
  }
  .cm-meta-row svg { color:#334155;flex-shrink:0; }
  .cm-meta-val { color:#94a3b8; }

  /* actions */
  .cm-actions { display:flex;gap:.65rem; }
  .cm-edit-btn {
    flex:1;display:flex;align-items:center;justify-content:center;gap:.4rem;
    padding:.5rem .9rem;border-radius:10px;cursor:pointer;
    background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.25);
    color:#818cf8;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:600;
    transition:all .18s;
  }
  .cm-edit-btn:hover { background:rgba(99,102,241,.18);border-color:rgba(99,102,241,.4); }
  .cm-del-btn {
    flex:1;display:flex;align-items:center;justify-content:center;gap:.4rem;
    padding:.5rem .9rem;border-radius:10px;cursor:pointer;
    background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);
    color:#fca5a5;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:600;
    transition:all .18s;
  }
  .cm-del-btn:hover { background:rgba(239,68,68,.16);border-color:rgba(239,68,68,.4); }

  /* ── Empty state ── */
  .cm-empty {
    grid-column:1/-1;text-align:center;
    padding:4rem 2rem;border-radius:20px;
    background:rgba(255,255,255,.02);border:1px dashed rgba(255,255,255,.07);
    animation:cm-fadeUp .4s ease both;
  }
  .cm-empty-icon { font-size:2.5rem;opacity:.3;margin-bottom:.8rem; }
  .cm-empty-title { font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:#334155;margin-bottom:.35rem; }
  .cm-empty-sub   { font-size:.82rem;color:#1e293b; }

  /* ── Skeleton ── */
  .cm-skel {
    background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);
    border-radius:20px;padding:1.6rem;animation:cm-fadeUp .4s ease both;
  }
  .cm-skel-line {
    background:linear-gradient(90deg,rgba(255,255,255,.04) 0px,rgba(255,255,255,.09) 100px,rgba(255,255,255,.04) 200px);
    background-size:600px 100%;animation:cm-shimmer 1.4s infinite linear;border-radius:6px;
  }

  /* ── MODAL OVERLAY ── */
  .cm-overlay {
    position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);
    display:flex;align-items:center;justify-content:center;z-index:1000;padding:1rem;
    animation:cm-overlayIn .2s ease both;
  }

  /* ── MODAL ── */
  .cm-modal {
    background:#0d1117;
    border:1px solid rgba(255,255,255,.09);
    border-radius:24px;width:100%;max-width:460px;
    max-height:90vh;overflow-y:auto;
    box-shadow:0 30px 70px rgba(0,0,0,.6);
    position:relative;
    animation:cm-modalIn .3s cubic-bezier(.22,1,.36,1) both;
  }
  .cm-modal::-webkit-scrollbar { width:4px; }
  .cm-modal::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08);border-radius:4px; }

  .cm-modal-accent {
    position:absolute;top:0;left:0;right:0;height:2.5px;
    background:linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4);
    border-radius:24px 24px 0 0;
  }

  .cm-modal-header {
    display:flex;justify-content:space-between;align-items:center;
    padding:1.8rem 2rem 0;margin-bottom:1.6rem;
  }
  .cm-modal-title { font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#f8fafc; }
  .cm-modal-close {
    width:30px;height:30px;border-radius:8px;border:1px solid rgba(255,255,255,.09);
    background:rgba(255,255,255,.04);color:#64748b;cursor:pointer;
    display:flex;align-items:center;justify-content:center;transition:all .18s;
  }
  .cm-modal-close:hover { background:rgba(255,255,255,.08);color:#94a3b8; }

  .cm-modal-body { padding:0 2rem 2rem; }

  /* form fields */
  .cm-field { margin-bottom:1.2rem; }
  .cm-label {
    display:block;font-size:.7rem;font-weight:600;letter-spacing:.1em;
    text-transform:uppercase;color:#334155;margin-bottom:.45rem;
  }
  .cm-input {
    width:100%;padding:.78rem 1rem;
    background:#0a0e1a;border:1px solid rgba(255,255,255,.08);
    border-radius:11px;color:#e2e8f0;
    font-family:'DM Sans',sans-serif;font-size:.88rem;outline:none;
    transition:border-color .2s,box-shadow .2s;
  }
  .cm-input:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12); }
  .cm-input::placeholder { color:#1e293b; }

  /* logo upload */
  .cm-logo-upload {
    border:2px dashed rgba(255,255,255,.09);border-radius:13px;
    padding:1.4rem;text-align:center;cursor:pointer;
    transition:all .2s;background:rgba(255,255,255,.02);position:relative;
  }
  .cm-logo-upload.has-preview { border-color:rgba(16,185,129,.35);background:rgba(16,185,129,.05); }
  .cm-logo-upload:hover { border-color:rgba(99,102,241,.35);background:rgba(99,102,241,.05); }
  .cm-logo-upload input { position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%; }
  .cm-upload-icon { font-size:.9rem;color:#334155;margin-bottom:.3rem; }
  .cm-upload-text { font-size:.78rem;color:#334155; }
  .cm-preview {
    width:70px;height:70px;object-fit:contain;border-radius:10px;
    background:rgba(255,255,255,.06);padding:6px;margin:0 auto;display:block;
  }

  /* modal footer */
  .cm-modal-footer { display:flex;gap:.8rem; }
  .cm-cancel-btn {
    flex:1;padding:.75rem;border-radius:11px;border:1px solid rgba(255,255,255,.09);
    background:rgba(255,255,255,.04);color:#64748b;
    font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:500;cursor:pointer;transition:all .18s;
  }
  .cm-cancel-btn:hover { background:rgba(255,255,255,.08);color:#94a3b8; }
  .cm-save-btn {
    flex:1;padding:.75rem;border-radius:11px;border:none;cursor:pointer;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);background-size:200%;
    color:#fff;font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;
    box-shadow:0 4px 18px rgba(99,102,241,.38);transition:all .2s;
    display:flex;align-items:center;justify-content:center;gap:.5rem;
    animation:cm-gradShift 5s ease infinite;
  }
  .cm-save-btn:hover { transform:translateY(-2px);box-shadow:0 6px 24px rgba(99,102,241,.5); }
  .cm-save-btn:disabled { opacity:.55;cursor:not-allowed;transform:none; }
  .cm-spinner { width:15px;height:15px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:cm-spin .6s linear infinite; }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const SkeletonCard = ({ delay }) => (
  <div className="cm-skel" style={{ animationDelay: delay }}>
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
      <div className="cm-skel-line" style={{ width: 52, height: 52, borderRadius: 13, flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '.5rem', justifyContent: 'center' }}>
        <div className="cm-skel-line" style={{ height: 16, width: '60%' }} />
        <div className="cm-skel-line" style={{ height: 11, width: '40%' }} />
      </div>
    </div>
    {[70, 55, 65].map((w, i) => (
      <div key={i} className="cm-skel-line" style={{ height: 11, width: `${w}%`, marginBottom: '.55rem' }} />
    ))}
    <div style={{ display: 'flex', gap: '.65rem', marginTop: '1.2rem' }}>
      <div className="cm-skel-line" style={{ flex: 1, height: 34, borderRadius: 10 }} />
      <div className="cm-skel-line" style={{ flex: 1, height: 34, borderRadius: 10 }} />
    </div>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────
const CompanyManagement = () => {
  const [companies, setCompanies]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData]         = useState({ name:'', address:'', contactEmail:'', contactPhone:'' });
  const [logoFile, setLogoFile]         = useState(null);
  const [logoPreview, setLogoPreview]   = useState(null);
  const fileRef                          = useRef();

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => { fetchCompanies(); }, []);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/companies`, { headers: { Authorization:`Bearer ${token}` } });
      setCompanies(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openModal = (company = null) => {
    if (company) {
      setEditingCompany(company);
      setFormData({ name: company.name, address: company.address||'', contactEmail: company.contactEmail||'', contactPhone: company.contactPhone||'' });
      setLogoPreview(company.logo ? `http://localhost:5000${company.logo}` : null);
    } else {
      setEditingCompany(null);
      setFormData({ name:'', address:'', contactEmail:'', contactPhone:'' });
      setLogoPreview(null);
    }
    setLogoFile(null);
    setShowModal(true);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    setLogoFile(f || null);
    if (f) { const r = new FileReader(); r.onloadend = () => setLogoPreview(r.result); r.readAsDataURL(f); }
  };

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const cfg   = { headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'multipart/form-data' } };
      const data  = new FormData();
      Object.keys(formData).forEach(k => data.append(k, formData[k]));
      if (logoFile) data.append('logo', logoFile);
      if (editingCompany) {
        await axios.put(`${API_BASE_URL}/companies/${editingCompany._id}`, data, cfg);
      } else {
        await axios.post(`${API_BASE_URL}/companies`, data, cfg);
      }
      setShowModal(false);
      fetchCompanies();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this company? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/companies/${id}`, { headers:{ Authorization:`Bearer ${token}` } });
      fetchCompanies();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="cm-root">
      {/* Header */}
      <div className="cm-header">
        <div>
          <div className="cm-eyebrow">Super Admin</div>
          <h2 className="cm-title">Companies</h2>
        </div>
        <div style={{ display:'flex', gap:'.75rem' }}>
          <button className="cm-edit-btn" style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0' }} 
            onClick={() => exportToCSV(companies, `Companies_Export_${new Date().toLocaleDateString()}`, ['name', 'address', 'contactEmail', 'contactPhone'])}>
            <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" size={15} /> Export CSV
          </button>
          <button className="cm-add-btn" onClick={() => openModal()}>
            <Ico d="M12 5v14 M5 12h14" size={15} /> Add Company
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="cm-grid">
        {loading
          ? [0,1,2].map(i => <SkeletonCard key={i} delay={`${i*.07}s`} />)
          : companies.length === 0
            ? (
              <div className="cm-empty">
                <div className="cm-empty-icon">🏢</div>
                <div className="cm-empty-title">No companies yet</div>
                <div className="cm-empty-sub">Click "Add Company" to create the first one.</div>
              </div>
            )
            : companies.map((c, i) => (
              <div className="cm-card" key={c._id} style={{ animationDelay:`${i*.06}s` }}>
                <div className="cm-card-accent" />
                <div className="cm-card-top">
                  <div className="cm-logo-wrap">
                    {c.logo
                      ? <img className="cm-logo-img" src={`http://localhost:5000${c.logo}`} alt={c.name} />
                      : <span className="cm-logo-fb">{c.name?.[0]?.toUpperCase() || '?'}</span>
                    }
                  </div>
                  <div>
                    <div className="cm-card-name">{c.name}</div>
                  </div>
                </div>

                <div className="cm-meta">
                  <div className="cm-meta-row">
                    <Ico d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                    <span className="cm-meta-val">{c.address || 'No address'}</span>
                  </div>
                  <div className="cm-meta-row">
                    <Ico d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" />
                    <span className="cm-meta-val">{c.contactEmail || 'No email'}</span>
                  </div>
                  <div className="cm-meta-row">
                    <Ico d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                    <span className="cm-meta-val">{c.contactPhone || 'No phone'}</span>
                  </div>
                </div>

                <div className="cm-actions">
                  <button className="cm-edit-btn" onClick={() => openModal(c)}>
                    <Ico d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={13} />
                    Edit
                  </button>
                  <button className="cm-del-btn" onClick={() => handleDelete(c._id)}>
                    <Ico d="M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={13} />
                    Delete
                  </button>
                </div>
              </div>
            ))
        }
      </div>

      {/* Modal */}
      {showModal && (
        <div className="cm-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="cm-modal">
            <div className="cm-modal-accent" />
            <div className="cm-modal-header">
              <div className="cm-modal-title">
                {editingCompany ? 'Edit Company' : 'New Company'}
              </div>
              <button className="cm-modal-close" onClick={() => setShowModal(false)}>
                <Ico d="M18 6L6 18 M6 6l12 12" size={14} />
              </button>
            </div>

            <div className="cm-modal-body">
              <form onSubmit={handleSubmit}>
                <div className="cm-field">
                  <label className="cm-label">Company Name <span style={{color:'#ef4444'}}>*</span></label>
                  <input className="cm-input" placeholder="Acme Corporation" value={formData.name}
                    onChange={e => set('name', e.target.value)} required />
                </div>
                <div className="cm-field">
                  <label className="cm-label">Address</label>
                  <input className="cm-input" placeholder="123 Main St, City" value={formData.address}
                    onChange={e => set('address', e.target.value)} />
                </div>
                <div className="cm-field">
                  <label className="cm-label">Contact Email</label>
                  <input className="cm-input" type="email" placeholder="contact@company.com" value={formData.contactEmail}
                    onChange={e => set('contactEmail', e.target.value)} />
                </div>
                <div className="cm-field">
                  <label className="cm-label">Contact Phone</label>
                  <input className="cm-input" placeholder="+1 (555) 000-0000" value={formData.contactPhone}
                    onChange={e => set('contactPhone', e.target.value)} />
                </div>

                <div className="cm-field">
                  <label className="cm-label">Company Logo</label>
                  <div className={`cm-logo-upload${logoPreview ? ' has-preview' : ''}`}
                    onClick={() => fileRef.current?.click()}>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:'none'}} />
                    {logoPreview
                      ? <img className="cm-preview" src={logoPreview} alt="preview" />
                      : <>
                          <div className="cm-upload-icon"><Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" size={20} /></div>
                          <div className="cm-upload-text">Click to upload logo</div>
                        </>
                    }
                  </div>
                  {logoPreview && (
                    <button type="button" onClick={() => { setLogoPreview(null); setLogoFile(null); }}
                      style={{ marginTop:'.5rem',background:'none',border:'none',color:'#64748b',fontSize:'.75rem',cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>
                      Remove logo
                    </button>
                  )}
                </div>

                <div className="cm-modal-footer">
                  <button type="button" className="cm-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="cm-save-btn" disabled={saving}>
                    {saving
                      ? <><span className="cm-spinner" /> Saving…</>
                      : <><Ico d="M20 6L9 17l-5-5" size={15} /> {editingCompany ? 'Update' : 'Create'}</>
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
