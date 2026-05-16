// import { API_BASE_URL } from '../config';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ROLE_CONFIG = {
//   'Super Admin': { bg: 'rgba(234,179,8,0.1)',   border: 'rgba(234,179,8,0.28)',   text: '#fbbf24', dot: '#f59e0b', icon: '★' },
//   'Admin':       { bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.28)',  text: '#a5b4fc', dot: '#6366f1', icon: '◆' },
//   'User':        { bg: 'rgba(20,184,166,0.1)',  border: 'rgba(20,184,166,0.28)',  text: '#5eead4', dot: '#14b8a6', icon: '◉' },
// };

// const getInitials = (name = '') =>
//   name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

// const AVATAR_GRADIENTS = [
//   'linear-gradient(135deg,#6366f1,#06b6d4)',
//   'linear-gradient(135deg,#f59e0b,#ef4444)',
//   'linear-gradient(135deg,#10b981,#6366f1)',
//   'linear-gradient(135deg,#8b5cf6,#ec4899)',
//   'linear-gradient(135deg,#0891b2,#10b981)',
// ];

// const UsersManagement = ({ role }) => {
//   const [users,      setUsers]      = useState([]);
//   const [companies,  setCompanies]  = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData,   setFormData]   = useState({ 
//     name: '', email: '', password: '', role: 'User', company: '', department: '', designation: '', phoneNumber: '',
//     modules: { assets: true, ticketing: true, vehicles: false, files: false }
//   });
//   const [editingId,  setEditingId]  = useState(null);
//   const [saving,     setSaving]     = useState(false);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [search,     setSearch]     = useState('');
//   const [filterRole, setFilterRole] = useState('All');
//   const [filterCompany, setFilterCompany] = useState('All');

//   useEffect(() => { 
//     fetchUsers(); 
//     fetchCompanies();
//     fetchDepartments();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${API_BASE_URL}/users`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUsers(res.data);
//     } catch (err) { console.error('Failed to fetch users', err); }
//   };

//   const fetchCompanies = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${API_BASE_URL}/companies`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setCompanies(res.data);
//     } catch (err) { console.error('Failed to fetch companies', err); }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${API_BASE_URL}/approval/departments`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setDepartments(res.data);
//     } catch (err) { console.error('Failed to fetch departments', err); }
//   };

//   const openAdd = () => {
//     setFormData({ 
//       name: '', email: '', password: '', role: 'User', company: '', department: '', designation: '', phoneNumber: '',
//       modules: { assets: true, ticketing: true, vehicles: false, files: false }
//     });
//     setEditingId(null);
//     setIsModalOpen(true);
//   };

//   const openEdit = (user) => {
//     setFormData({ 
//       name: user.name, 
//       email: user.email, 
//       password: '', 
//       role: user.role, 
//       company: user.company?._id || user.company || '',
//       department: user.department?._id || user.department || '',
//       designation: user.designation || '',
//       phoneNumber: user.phoneNumber || '',
//       modules: user.modules || { assets: true, ticketing: true, vehicles: false, files: false }
//     });
//     setEditingId(user._id);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setFormData({ 
//       name: '', email: '', password: '', role: 'User', company: '', department: '', designation: '', phoneNumber: '',
//       modules: { assets: true, ticketing: true, vehicles: false, files: false }
//     });
//     setEditingId(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (editingId) {
//         await axios.put(`${API_BASE_URL}/users/${editingId}`, formData, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       } else {
//         await axios.post(`${API_BASE_URL}/users`, formData, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//       }
//       closeModal();
//       fetchUsers();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Error saving user');
//     } finally { setSaving(false); }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${API_BASE_URL}/users/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setDeleteConfirm(null);
//       fetchUsers();
//     } catch (err) { console.error(err); }
//   };

//   const filtered = users.filter(u => {
//     const matchRole   = filterRole === 'All' || u.role === filterRole;
//     const matchCompany = filterCompany === 'All' || (u.company?._id || u.company) === filterCompany;
//     const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
//     return matchRole && matchCompany && matchSearch;
//   });

//   const exportCSV = () => {
//     const headers = ['Name', 'Email', 'Role', 'Company', 'Designation', 'Phone Number'];
//     const rows = filtered.map(u => [
//       u.name,
//       u.email,
//       u.role,
//       u.company?.name || 'N/A',
//       u.department?.name || 'N/A',
//       u.designation || 'N/A',
//       u.phoneNumber || 'N/A'
//     ]);

//     const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (role !== 'Super Admin' && role !== 'Admin') {
//     return (
//       <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(148,163,184,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
//         <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⊘</div>
//         <div>You don't have permission to view this page.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="um-root">
//       <style>{`
//         .um-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
//         .um-title-section { display: flex; align-items: center; gap: 1rem; }
//         .um-actions { display: flex; gap: 0.75rem; }
        
//         .um-toolbar { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
//         .um-search-box { flex: 1; min-width: 250px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.6rem 1rem; color: white; outline: none; }
//         .um-select-filter { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.6rem 1rem; color: white; outline: none; min-width: 150px; }
//         .um-select-filter option { background: #0f172a; }

//         .um-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
//         .um-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.5rem; transition: transform 0.2s; position: relative; overflow: hidden; }
//         .um-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.15); }
//         .um-card-header { display: flex; gap: 1rem; margin-bottom: 1.2rem; }
//         .um-avatar { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justifyContent: center; font-weight: 700; color: white; font-size: 1.1rem; }
//         .um-user-info { flex: 1; }
//         .um-name { font-size: 1.1rem; font-weight: 600; color: #f8fafc; }
//         .um-email { font-size: 0.85rem; color: #94a3b8; }
        
//         .um-card-meta { display: flex; flex-direction: column; gap: 0.5rem; }
//         .um-badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; width: fit-content; }
//         .um-company-tag { font-size: 0.8rem; color: #818cf8; font-weight: 500; display: flex; align-items: center; gap: 0.4rem; }
//         .um-detail-row { font-size: 0.8rem; color: #94a3b8; display: flex; align-items: center; gap: 0.4rem; margin-top: 0.2rem; }

//         .um-card-footer { display: flex; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.06); }
//         .um-edit-btn { flex: 1; padding: 0.5rem; border-radius: 8px; border: 1px solid rgba(99,102,241,0.2); background: rgba(99,102,241,0.1); color: #818cf8; cursor: pointer; transition: all 0.2s; }
//         .um-edit-btn:hover { background: rgba(99,102,241,0.2); }
//         .um-delete-btn { flex: 1; padding: 0.5rem; border-radius: 8px; border: 1px solid rgba(239,68,68,0.2); background: rgba(239,68,68,0.1); color: #fca5a5; cursor: pointer; transition: all 0.2s; }
//         .um-delete-btn:hover { background: rgba(239,68,68,0.2); }
        
//         .um-add-btn { background: #6366f1; color: white; border: none; padding: 0.7rem 1.4rem; border-radius: 10px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
//         .um-export-btn { background: rgba(255,255,255,0.05); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.1); padding: 0.7rem 1.4rem; border-radius: 10px; cursor: pointer; font-weight: 600; }

//         .um-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justifyContent: center; z-index: 1000; padding: 1rem; }
//         .um-modal { background: #0f172a; width: 480px; padding: 2rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); max-height: 90vh; overflow-y: auto; }
//         .um-form-group { margin-bottom: 1.2rem; }
//         .um-label { display: block; color: #94a3b8; font-size: 0.8rem; margin-bottom: 0.4rem; }
//         .um-input, .um-modal-select { width: 100%; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); padding: 0.75rem; color: white; border-radius: 10px; outline: none; }
//         .um-modal-select option { background: #0f172a; color: white; }
//       `}</style>

//       <div className="um-header">
//         <div className="um-title-section">
//           <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9' }}>Users Management</h2>
//         </div>
//         <div className="um-actions">
//           <button className="um-export-btn" onClick={exportCSV}>Export CSV</button>
//           <button className="um-add-btn" onClick={openAdd}>+ Add User</button>
//         </div>
//       </div>

//       <div className="um-toolbar">
//         <input 
//           className="um-search-box" 
//           placeholder="Search users..." 
//           value={search} 
//           onChange={e => setSearch(e.target.value)}
//         />
//         <select className="um-select-filter" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
//           <option value="All">All Roles</option>
//           <option value="Super Admin">Super Admin</option>
//           <option value="Admin">Admin</option>
//           <option value="User">User</option>
//         </select>
//         <select className="um-select-filter" value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
//           <option value="All">All Companies</option>
//           {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//         </select>
//       </div>

//       <div className="um-grid">
//         {filtered.map((user, i) => {
//           const rc = ROLE_CONFIG[user.role] || ROLE_CONFIG['User'];
//           const grad = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
//           return (
//             <div key={user._id} className="um-card">
//               <div className="um-card-header">
//                 <div className="um-avatar" style={{ background: grad }}>{getInitials(user.name)}</div>
//                 <div className="um-user-info">
//                   <div className="um-name">{user.name}</div>
//                   <div className="um-email">{user.email}</div>
//                   {user.designation && <div style={{ fontSize: '0.8rem', color: '#6366f1', marginTop: '0.2rem' }}>{user.designation}</div>}
//                 </div>
//               </div>
//               <div className="um-card-meta">
//                 <div className="um-badge" style={{ background: rc.bg, border: `1px solid ${rc.border}`, color: rc.text }}>
//                   <span style={{ width: 6, height: 6, borderRadius: '50%', background: rc.dot }} />
//                   {user.role}
//                 </div>
//                 <div className="um-company-tag">🏢 {user.company?.name || 'No Company'}</div>
//                 {user.department && <div className="um-detail-row">📁 Dept: {user.department.name}</div>}
//                 {user.phoneNumber && <div className="um-detail-row">📞 {user.phoneNumber}</div>}
//               </div>
//               <div className="um-card-footer">
//                 <button className="um-edit-btn" onClick={() => openEdit(user)}>Edit</button>
//                 <button className="um-delete-btn" onClick={() => setDeleteConfirm(user)}>Delete</button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {isModalOpen && (
//         <div className="um-modal-overlay">
//           <div className="um-modal">
//             <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>{editingId ? 'Edit User' : 'New User'}</h3>
//             <form onSubmit={handleSubmit}>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
//                 <div className="um-form-group">
//                   <label className="um-label">Full Name</label>
//                   <input className="um-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
//                 </div>
//                 <div className="um-form-group">
//                   <label className="um-label">Email Address</label>
//                   <input className="um-input" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
//                 </div>
//               </div>
              
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
//                 <div className="um-form-group">
//                   <label className="um-label">Designation</label>
//                   <input className="um-input" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} placeholder="e.g. IT Manager" />
//                 </div>
//                 <div className="um-form-group">
//                   <label className="um-label">Phone Number</label>
//                   <input className="um-input" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} placeholder="e.g. +1234567890" />
//                 </div>
//               </div>

//               <div className="um-form-group">
//                 <label className="um-label">Password {editingId && '(Leave blank to keep current)'}</label>
//                 <input className="um-input" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!editingId} />
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
//                 <div className="um-form-group">
//                   <label className="um-label">Role</label>
//                   <select className="um-modal-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
//                     <option value="User">User</option>
//                     <option value="Admin">Admin</option>
//                     {role === 'Super Admin' && <option value="Super Admin">Super Admin</option>}
//                   </select>
//                 </div>
//                 <div className="um-form-group">
//                   <label className="um-label">Company</label>
//                   <select className="um-modal-select" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}>
//                     <option value="">Select Company</option>
//                     {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//                   </select>
//                 </div>
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
//                 <div className="um-form-group">
//                   <label className="um-label">Department</label>
//                   <select className="um-modal-select" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
//                     <option value="">No Department</option>
//                     {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
//                   </select>
//                 </div>
//               </div>

//               <div className="um-form-group" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
//                 <label className="um-label" style={{ color: '#818cf8', fontWeight: 600, marginBottom: '1rem' }}>Module Permissions</label>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
//                   {Object.keys(formData.modules).map(mod => (
//                     <label key={mod} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: '#e2e8f0', fontSize: '0.9rem' }}>
//                       <input 
//                         type="checkbox" 
//                         checked={formData.modules[mod]} 
//                         onChange={e => setFormData({
//                           ...formData, 
//                           modules: { ...formData.modules, [mod]: e.target.checked }
//                         })}
//                         style={{ width: '18px', height: '18px', accentColor: '#6366f1' }}
//                       />
//                       {mod.charAt(0).toUpperCase() + mod.slice(1)}
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
//                 <button type="button" className="um-delete-btn" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
//                 <button type="submit" className="um-add-btn" style={{ flex: 1 }}>{saving ? 'Saving...' : editingId ? 'Update' : 'Create'}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {deleteConfirm && (
//         <div className="um-modal-overlay">
//           <div className="um-modal" style={{ maxWidth: '350px', textAlign: 'center' }}>
//             <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
//             <h3 style={{ color: 'white', marginBottom: '1rem' }}>Confirm Delete</h3>
//             <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.</p>
//             <div style={{ display: 'flex', gap: '1rem' }}>
//               <button className="um-export-btn" onClick={() => setDeleteConfirm(null)} style={{ flex: 1 }}>Cancel</button>
//               <button className="um-delete-btn" onClick={() => handleDelete(deleteConfirm._id)} style={{ flex: 1 }}>Delete</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UsersManagement;


import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  @keyframes um-fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes um-fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes um-shimmer   { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes um-spin      { to{transform:rotate(360deg)} }
  @keyframes um-modalIn   { from{opacity:0;transform:translateY(18px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes um-overlayIn { from{opacity:0} to{opacity:1} }
  @keyframes um-gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes um-pulse     { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes um-shake     { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }

  .um-root * { box-sizing:border-box; margin:0; padding:0; }
  .um-root { font-family:'DM Sans',sans-serif; color:#e2e8f0; padding:2rem 0; }

  /* ── Header ── */
  .um-header {
    display:flex; justify-content:space-between; align-items:flex-end;
    margin-bottom:1.8rem; animation:um-fadeUp .4s ease both;
  }
  .um-eyebrow { font-size:.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#6366f1;margin-bottom:.3rem; }
  .um-title   { font-family:'Syne',sans-serif;font-size:1.7rem;font-weight:800;color:#f8fafc; }
  .um-header-actions { display:flex;gap:.7rem;align-items:center; }

  .um-export-btn {
    display:flex;align-items:center;gap:.4rem;
    padding:.55rem 1rem;border-radius:10px;
    border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.04);
    color:#64748b;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:500;cursor:pointer;
    transition:all .18s;
  }
  .um-export-btn:hover { background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.14);color:#94a3b8; }

  .um-add-btn {
    display:flex;align-items:center;gap:.45rem;
    padding:.58rem 1.15rem;border-radius:11px;border:none;cursor:pointer;
    background:#6366f1;color:#fff;
    font-family:'DM Sans',sans-serif;font-size:.84rem;font-weight:600;
    box-shadow:0 4px 18px rgba(99,102,241,.38);transition:all .2s;
  }
  .um-add-btn:hover { background:#5254cc;transform:translateY(-2px);box-shadow:0 6px 22px rgba(99,102,241,.5); }

  /* ── Toolbar ── */
  .um-toolbar {
    display:flex;gap:.85rem;margin-bottom:2rem;flex-wrap:wrap;align-items:center;
    animation:um-fadeUp .4s .05s ease both;
  }
  .um-search-wrap { position:relative;flex:1;min-width:220px; }
  .um-search-ico  { position:absolute;left:.9rem;top:50%;transform:translateY(-50%);color:#334155;pointer-events:none; }
  .um-search {
    width:100%;padding:.65rem 1rem .65rem 2.5rem;
    background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
    border-radius:11px;color:#e2e8f0;font-family:'DM Sans',sans-serif;font-size:.85rem;
    outline:none;transition:border-color .2s,box-shadow .2s;
  }
  .um-search:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1); }
  .um-search::placeholder { color:#1e293b; }

  .um-filter-wrap { position:relative; }
  .um-filter-wrap::after {
    content:'';position:absolute;right:.8rem;top:50%;transform:translateY(-50%);
    border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #334155;
    pointer-events:none;
  }
  .um-filter {
    appearance:none;padding:.65rem 2rem .65rem 1rem;
    background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
    border-radius:11px;color:#94a3b8;font-family:'DM Sans',sans-serif;font-size:.82rem;
    outline:none;cursor:pointer;transition:border-color .2s;
  }
  .um-filter:focus { border-color:#6366f1; }
  .um-filter option { background:#0f172a; }

  /* results count */
  .um-count { font-size:.75rem;color:#334155;font-family:'DM Mono',monospace;white-space:nowrap; }

  /* ── Grid ── */
  .um-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.2rem; }

  /* ── User card ── */
  .um-card {
    background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);
    border-radius:20px;padding:1.5rem;
    position:relative;overflow:hidden;
    transition:transform .22s,border-color .22s;
    animation:um-fadeUp .4s ease both;
  }
  .um-card:hover { transform:translateY(-3px);border-color:rgba(255,255,255,.12); }
  .um-card::after {
    content:'';position:absolute;inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,.025) 0%,transparent 60%);
    pointer-events:none;
  }
  .um-card-accent { position:absolute;top:0;left:0;right:0;height:2.5px;border-radius:20px 20px 0 0; }

  /* card header */
  .um-card-head { display:flex;gap:.9rem;align-items:flex-start;margin-bottom:1.1rem; }
  .um-avatar {
    width:46px;height:46px;border-radius:13px;flex-shrink:0;
    display:flex;align-items:center;justify-content:center;
    font-family:'Syne',sans-serif;font-size:.95rem;font-weight:800;color:#fff;
  }
  .um-name { font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:#f1f5f9;margin-bottom:.15rem; }
  .um-email { font-size:.76rem;color:#334155;font-family:'DM Mono',monospace; }
  .um-designation { font-size:.76rem;color:#6366f1;margin-top:.2rem;font-weight:500; }

  /* meta */
  .um-meta { display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.2rem; }
  .um-role-badge {
    display:inline-flex;align-items:center;gap:.4rem;
    padding:.25rem .7rem;border-radius:7px;
    font-size:.7rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
    width:fit-content;
  }
  .um-role-dot { width:6px;height:6px;border-radius:50%;animation:um-pulse 2.2s ease infinite; }

  .um-detail { display:flex;align-items:center;gap:.5rem;font-size:.78rem;color:#475569; }
  .um-detail svg { color:#334155;flex-shrink:0; }
  .um-detail-val { color:#64748b; }

  /* module chips */
  .um-modules { display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.3rem; }
  .um-mod-chip {
    padding:.18rem .55rem;border-radius:5px;
    font-size:.64rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;
    font-family:'DM Mono',monospace;
  }
  .um-mod-on  { background:rgba(99,102,241,.12);color:#818cf8;border:1px solid rgba(99,102,241,.25); }
  .um-mod-off { background:rgba(255,255,255,.03);color:#1e293b;border:1px solid rgba(255,255,255,.06); }

  /* card footer */
  .um-card-footer { display:flex;gap:.6rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,.05); }
  .um-edit-btn {
    flex:1;display:flex;align-items:center;justify-content:center;gap:.35rem;
    padding:.5rem;border-radius:9px;cursor:pointer;
    border:1px solid rgba(99,102,241,.22);background:rgba(99,102,241,.08);
    color:#818cf8;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:600;transition:all .18s;
  }
  .um-edit-btn:hover { background:rgba(99,102,241,.18);border-color:rgba(99,102,241,.4); }
  .um-del-btn {
    flex:1;display:flex;align-items:center;justify-content:center;gap:.35rem;
    padding:.5rem;border-radius:9px;cursor:pointer;
    border:1px solid rgba(239,68,68,.2);background:rgba(239,68,68,.07);
    color:#fca5a5;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:600;transition:all .18s;
  }
  .um-del-btn:hover { background:rgba(239,68,68,.15);border-color:rgba(239,68,68,.4); }

  /* ── Empty / forbidden ── */
  .um-empty, .um-forbidden {
    text-align:center;padding:4rem 2rem;
    background:rgba(255,255,255,.02);border:1px dashed rgba(255,255,255,.07);border-radius:20px;
    animation:um-fadeUp .4s ease both;
  }
  .um-empty-icon { font-size:2.4rem;opacity:.3;margin-bottom:.8rem; }
  .um-empty-title { font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:#334155;margin-bottom:.35rem; }
  .um-empty-sub   { font-size:.82rem;color:#1e293b; }

  /* ── OVERLAY ── */
  .um-overlay {
    position:fixed;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(8px);
    display:flex;align-items:center;justify-content:center;z-index:1000;padding:1rem;
    animation:um-overlayIn .2s ease both;
  }

  /* ── MODAL ── */
  .um-modal {
    background:#0d1117;border:1px solid rgba(255,255,255,.09);
    border-radius:24px;width:100%;max-width:500px;
    max-height:90vh;overflow-y:auto;
    box-shadow:0 30px 70px rgba(0,0,0,.6);position:relative;
    animation:um-modalIn .3s cubic-bezier(.22,1,.36,1) both;
  }
  .um-modal::-webkit-scrollbar { width:4px; }
  .um-modal::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08);border-radius:4px; }

  .um-modal-accent { position:absolute;top:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4);border-radius:24px 24px 0 0; }

  .um-modal-header {
    display:flex;justify-content:space-between;align-items:center;
    padding:1.8rem 2rem 0;margin-bottom:1.6rem;
  }
  .um-modal-title { font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#f8fafc; }
  .um-modal-close {
    width:30px;height:30px;border-radius:8px;border:1px solid rgba(255,255,255,.09);
    background:rgba(255,255,255,.04);color:#64748b;cursor:pointer;
    display:flex;align-items:center;justify-content:center;transition:all .18s;
  }
  .um-modal-close:hover { background:rgba(255,255,255,.08);color:#94a3b8; }
  .um-modal-body { padding:0 2rem 2rem; }

  /* form */
  .um-2col { display:grid;grid-template-columns:1fr 1fr;gap:1rem; }
  .um-field { margin-bottom:1.1rem; }
  .um-label {
    display:block;font-size:.7rem;font-weight:600;letter-spacing:.1em;
    text-transform:uppercase;color:#334155;margin-bottom:.42rem;
  }
  .um-input, .um-select {
    width:100%;padding:.78rem 1rem;
    background:#0a0e1a;border:1px solid rgba(255,255,255,.08);
    border-radius:11px;color:#e2e8f0;
    font-family:'DM Sans',sans-serif;font-size:.88rem;outline:none;
    transition:border-color .2s,box-shadow .2s;appearance:none;
  }
  .um-input:focus,.um-select:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12); }
  .um-input::placeholder { color:#1e293b; }
  .um-select option { background:#0a0e1a; }
  .um-select-wrap { position:relative; }
  .um-select-wrap::after {
    content:'';position:absolute;right:.9rem;top:50%;transform:translateY(-50%);
    border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #334155;
    pointer-events:none;
  }
  .um-hint { font-size:.7rem;color:#334155;margin-top:.3rem; }

  /* modules section */
  .um-modules-section {
    background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);
    border-radius:13px;padding:1.1rem 1.2rem;margin-bottom:1.1rem;
  }
  .um-modules-title {
    font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
    color:#6366f1;margin-bottom:.9rem;
  }
  .um-modules-grid { display:grid;grid-template-columns:1fr 1fr;gap:.7rem; }
  .um-toggle-row {
    display:flex;align-items:center;justify-content:space-between;
    padding:.5rem .7rem;border-radius:9px;
    background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);
    cursor:pointer;transition:background .18s;
  }
  .um-toggle-row:hover { background:rgba(255,255,255,.06); }
  .um-toggle-name { font-size:.82rem;font-weight:500;color:#94a3b8; }
  .um-toggle-track {
    width:34px;height:18px;border-radius:99px;flex-shrink:0;
    position:relative;transition:background .22s;
  }
  .um-toggle-thumb {
    width:13px;height:13px;border-radius:50%;background:#fff;
    position:absolute;top:2.5px;transition:left .22s;
    box-shadow:0 1px 3px rgba(0,0,0,.4);
  }

  /* modal footer */
  .um-modal-footer { display:flex;gap:.8rem;margin-top:1.4rem; }
  .um-cancel-btn {
    flex:1;padding:.75rem;border-radius:11px;border:1px solid rgba(255,255,255,.09);
    background:rgba(255,255,255,.04);color:#64748b;
    font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:500;cursor:pointer;transition:all .18s;
  }
  .um-cancel-btn:hover { background:rgba(255,255,255,.08);color:#94a3b8; }
  .um-save-btn {
    flex:1;padding:.75rem;border-radius:11px;border:none;cursor:pointer;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);background-size:200%;
    color:#fff;font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;
    box-shadow:0 4px 18px rgba(99,102,241,.38);transition:all .2s;
    display:flex;align-items:center;justify-content:center;gap:.5rem;
    animation:um-gradShift 5s ease infinite;
  }
  .um-save-btn:hover { transform:translateY(-2px);box-shadow:0 6px 24px rgba(99,102,241,.5); }
  .um-save-btn:disabled { opacity:.55;cursor:not-allowed;transform:none; }
  .um-spinner { width:15px;height:15px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:um-spin .65s linear infinite; }

  /* ── Delete confirm ── */
  .um-confirm-modal {
    background:#0d1117;border:1px solid rgba(239,68,68,.2);
    border-radius:24px;width:100%;max-width:360px;padding:2.2rem;
    text-align:center;position:relative;
    box-shadow:0 30px 70px rgba(0,0,0,.6);
    animation:um-modalIn .3s cubic-bezier(.22,1,.36,1) both,um-shake .4s .3s ease both;
  }
  .um-confirm-accent { position:absolute;top:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,#ef4444,#f97316);border-radius:24px 24px 0 0; }
  .um-confirm-icon  { font-size:2.4rem;margin-bottom:.8rem;opacity:.85; }
  .um-confirm-title { font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#f8fafc;margin-bottom:.6rem; }
  .um-confirm-body  { font-size:.84rem;color:#475569;line-height:1.6;margin-bottom:1.6rem; }
  .um-confirm-body strong { color:#94a3b8; }
  .um-confirm-foot  { display:flex;gap:.8rem; }
  .um-confirm-del   {
    flex:1;padding:.72rem;border-radius:11px;border:1px solid rgba(239,68,68,.3);
    background:rgba(239,68,68,.12);color:#fca5a5;
    font-family:'Syne',sans-serif;font-size:.88rem;font-weight:700;cursor:pointer;transition:all .18s;
  }
  .um-confirm-del:hover { background:rgba(239,68,68,.22);border-color:rgba(239,68,68,.5); }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ROLE_CFG = {
  'Super Admin': { bg:'rgba(234,179,8,.1)',  border:'rgba(234,179,8,.28)',  text:'#fbbf24', dot:'#f59e0b', bar:'#f59e0b' },
  'Admin':       { bg:'rgba(99,102,241,.1)', border:'rgba(99,102,241,.28)', text:'#a5b4fc', dot:'#6366f1', bar:'#6366f1' },
  'User':        { bg:'rgba(20,184,166,.1)', border:'rgba(20,184,166,.28)', text:'#5eead4', dot:'#14b8a6', bar:'#14b8a6' },
};

const GRADIENTS = [
  'linear-gradient(135deg,#6366f1,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#10b981,#6366f1)',
  'linear-gradient(135deg,#8b5cf6,#ec4899)',
  'linear-gradient(135deg,#0891b2,#10b981)',
];

const initials = (n = '') => n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const MOD_LABELS = { assets: 'Assets', ticketing: 'Tickets', vehicles: 'Vehicles', files: 'Files' };

// ── Component ─────────────────────────────────────────────────────────────────
const UsersManagement = ({ role }) => {
  const [users, setUsers]           = useState([]);
  const [companies, setCompanies]   = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [saving, setSaving]         = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch]         = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterCompany, setFilterCompany] = useState('All');

  const [formData, setFormData] = useState({
    name:'', email:'', password:'', role:'User', company:'', department:'', designation:'', phoneNumber:'',
    modules:{ assets:true, ticketing:true, vehicles:false, files:false }
  });

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => { fetchUsers(); fetchCompanies(); fetchDepartments(); }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/users`, { headers: { Authorization:`Bearer ${token}` } });
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/companies`, { headers: { Authorization:`Bearer ${token}` } });
      setCompanies(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/approval/departments`, { headers: { Authorization:`Bearer ${token}` } });
      setDepartments(res.data);
    } catch (err) { console.error(err); }
  };

  const blank = () => ({
    name:'', email:'', password:'', role:'User', company:'', department:'', designation:'', phoneNumber:'',
    modules:{ assets:true, ticketing:true, vehicles:false, files:false }
  });

  const openAdd  = () => { setFormData(blank()); setEditingId(null); setIsModalOpen(true); };
  const openEdit = (u)  => {
    setFormData({
      name: u.name, email: u.email, password:'', role: u.role,
      company: u.company?._id || u.company || '',
      department: u.department?._id || u.department || '',
      designation: u.designation || '',
      phoneNumber: u.phoneNumber || '',
      modules: u.modules || { assets:true, ticketing:true, vehicles:false, files:false }
    });
    setEditingId(u._id); setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setFormData(blank()); setEditingId(null); };
  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));
  const setMod = (k, v) => setFormData(p => ({ ...p, modules: { ...p.modules, [k]: v } }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const cfg = { headers: { Authorization:`Bearer ${token}` } };
      if (editingId) { await axios.put(`${API_BASE_URL}/users/${editingId}`, formData, cfg); }
      else           { await axios.post(`${API_BASE_URL}/users`, formData, cfg); }
      closeModal(); fetchUsers();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/users/${id}`, { headers: { Authorization:`Bearer ${token}` } });
      setDeleteConfirm(null); fetchUsers();
    } catch (err) { console.error(err); }
  };

  const exportCSV = () => {
    const headers = ['Name','Email','Role','Company','Department','Designation','Phone'];
    const rows = filtered.map(u => [u.name, u.email, u.role, u.company?.name||'N/A', u.department?.name||'N/A', u.designation||'N/A', u.phoneNumber||'N/A']);
    const blob = new Blob([[headers,...rows].map(r=>r.join(',')).join('\n')], { type:'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filtered = users.filter(u => {
    const mR = filterRole === 'All' || u.role === filterRole;
    const mC = filterCompany === 'All' || (u.company?._id||u.company) === filterCompany;
    const mS = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return mR && mC && mS;
  });

  if (role !== 'Super Admin' && role !== 'Admin') {
    return (
      <div className="um-root">
        <div className="um-forbidden">
          <div className="um-empty-icon">⊘</div>
          <div className="um-empty-title">Access Denied</div>
          <div className="um-empty-sub">You don't have permission to view this page.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="um-root">

      {/* Header */}
      <div className="um-header">
        <div>
          <div className="um-eyebrow">Administration</div>
          <h2 className="um-title">Users Management</h2>
        </div>
        <div className="um-header-actions">
          <button className="um-export-btn" onClick={exportCSV}>
            <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" size={14} /> Export CSV
          </button>
          <button className="um-add-btn" onClick={openAdd}>
            <Ico d="M12 5v14 M5 12h14" size={14} /> Add User
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="um-toolbar">
        <div className="um-search-wrap">
          <span className="um-search-ico"><Ico d="M21 21l-4.35-4.35 M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={15} /></span>
          <input className="um-search" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="um-filter-wrap">
          <select className="um-filter" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
            <option value="All">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>
        <div className="um-filter-wrap">
          <select className="um-filter" value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
            <option value="All">All Companies</option>
            {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <span className="um-count">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Grid */}
      <div className="um-grid">
        {filtered.length === 0
          ? (
            <div style={{ gridColumn:'1/-1' }} className="um-empty">
              <div className="um-empty-icon">👥</div>
              <div className="um-empty-title">No users found</div>
              <div className="um-empty-sub">Try adjusting your search or filters.</div>
            </div>
          )
          : filtered.map((u, i) => {
            const rc   = ROLE_CFG[u.role] || ROLE_CFG['User'];
            const grad = GRADIENTS[i % GRADIENTS.length];
            return (
              <div className="um-card" key={u._id} style={{ animationDelay:`${i*.05}s` }}>
                <div className="um-card-accent" style={{ background: rc.bar }} />

                <div className="um-card-head">
                  <div className="um-avatar" style={{ background: grad }}>{initials(u.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="um-name">{u.name}</div>
                    <div className="um-email">{u.email}</div>
                    {u.designation && <div className="um-designation">{u.designation}</div>}
                  </div>
                </div>

                <div className="um-meta">
                  <div className="um-role-badge" style={{ background:rc.bg, border:`1px solid ${rc.border}`, color:rc.text }}>
                    <span className="um-role-dot" style={{ background:rc.dot }} />
                    {u.role}
                  </div>

                  <div className="um-detail">
                    <Ico d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <span className="um-detail-val">{u.company?.name || 'No company'}</span>
                  </div>

                  {u.department && (
                    <div className="um-detail">
                      <Ico d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      <span className="um-detail-val">{u.department.name}</span>
                    </div>
                  )}

                  {u.phoneNumber && (
                    <div className="um-detail">
                      <Ico d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12" />
                      <span className="um-detail-val">{u.phoneNumber}</span>
                    </div>
                  )}

                  {u.modules && (
                    <div className="um-modules">
                      {Object.entries(u.modules).map(([k, v]) => (
                        <span key={k} className={`um-mod-chip ${v ? 'um-mod-on' : 'um-mod-off'}`}>
                          {MOD_LABELS[k] || k}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="um-card-footer">
                  <button className="um-edit-btn" onClick={() => openEdit(u)}>
                    <Ico d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={13} /> Edit
                  </button>
                  <button className="um-del-btn" onClick={() => setDeleteConfirm(u)}>
                    <Ico d="M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" size={13} /> Delete
                  </button>
                </div>
              </div>
            );
          })
        }
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="um-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="um-modal">
            <div className="um-modal-accent" />
            <div className="um-modal-header">
              <div className="um-modal-title">{editingId ? 'Edit User' : 'New User'}</div>
              <button className="um-modal-close" onClick={closeModal}>
                <Ico d="M18 6L6 18 M6 6l12 12" size={14} />
              </button>
            </div>
            <div className="um-modal-body">
              <form onSubmit={handleSubmit}>
                <div className="um-2col">
                  <div className="um-field">
                    <label className="um-label">Full Name <span style={{color:'#ef4444'}}>*</span></label>
                    <input className="um-input" placeholder="Jane Smith" value={formData.name} onChange={e => set('name', e.target.value)} required />
                  </div>
                  <div className="um-field">
                    <label className="um-label">Email <span style={{color:'#ef4444'}}>*</span></label>
                    <input className="um-input" type="email" placeholder="jane@company.com" value={formData.email} onChange={e => set('email', e.target.value)} required />
                  </div>
                </div>

                <div className="um-2col">
                  <div className="um-field">
                    <label className="um-label">Designation</label>
                    <input className="um-input" placeholder="IT Manager" value={formData.designation} onChange={e => set('designation', e.target.value)} />
                  </div>
                  <div className="um-field">
                    <label className="um-label">Phone</label>
                    <input className="um-input" placeholder="+1 555 0000" value={formData.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} />
                  </div>
                </div>

                <div className="um-field">
                  <label className="um-label">Password {editingId && <span style={{color:'#334155',textTransform:'none',letterSpacing:0}}>— leave blank to keep current</span>}</label>
                  <input className="um-input" type="password" placeholder="••••••••" value={formData.password} onChange={e => set('password', e.target.value)} required={!editingId} />
                </div>

                <div className="um-2col">
                  <div className="um-field">
                    <label className="um-label">Role</label>
                    <div className="um-select-wrap">
                      <select className="um-select" value={formData.role} onChange={e => set('role', e.target.value)}>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        {role === 'Super Admin' && <option value="Super Admin">Super Admin</option>}
                      </select>
                    </div>
                  </div>
                  <div className="um-field">
                    <label className="um-label">Company</label>
                    <div className="um-select-wrap">
                      <select className="um-select" value={formData.company} onChange={e => set('company', e.target.value)}>
                        <option value="">Select Company</option>
                        {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="um-field">
                  <label className="um-label">Department</label>
                  <div className="um-select-wrap">
                    <select className="um-select" value={formData.department} onChange={e => set('department', e.target.value)}>
                      <option value="">No Department</option>
                      {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Module toggles */}
                <div className="um-modules-section">
                  <div className="um-modules-title">Module Permissions</div>
                  <div className="um-modules-grid">
                    {Object.keys(formData.modules).map(mod => (
                      <div key={mod} className="um-toggle-row" onClick={() => setMod(mod, !formData.modules[mod])}>
                        <span className="um-toggle-name">{MOD_LABELS[mod]}</span>
                        <div className="um-toggle-track" style={{ background: formData.modules[mod] ? '#6366f1' : '#1e293b' }}>
                          <div className="um-toggle-thumb" style={{ left: formData.modules[mod] ? '18px' : '2px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="um-modal-footer">
                  <button type="button" className="um-cancel-btn" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="um-save-btn" disabled={saving}>
                    {saving
                      ? <><span className="um-spinner" /> Saving…</>
                      : <><Ico d="M20 6L9 17l-5-5" size={15} /> {editingId ? 'Update' : 'Create'}</>
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="um-overlay" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="um-confirm-modal">
            <div className="um-confirm-accent" />
            <div className="um-confirm-icon">🗑</div>
            <div className="um-confirm-title">Delete User?</div>
            <div className="um-confirm-body">
              You're about to permanently delete <strong>{deleteConfirm.name}</strong>.<br />This action cannot be undone.
            </div>
            <div className="um-confirm-foot">
              <button className="um-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="um-confirm-del" onClick={() => handleDelete(deleteConfirm._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;