import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ROLE_CONFIG = {
  'Super Admin': { bg: 'rgba(234,179,8,0.1)',   border: 'rgba(234,179,8,0.28)',   text: '#fbbf24', dot: '#f59e0b', icon: '★' },
  'Admin':       { bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.28)',  text: '#a5b4fc', dot: '#6366f1', icon: '◆' },
  'User':        { bg: 'rgba(20,184,166,0.1)',  border: 'rgba(20,184,166,0.28)',  text: '#5eead4', dot: '#14b8a6', icon: '◉' },
};

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#6366f1,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#10b981,#6366f1)',
  'linear-gradient(135deg,#8b5cf6,#ec4899)',
  'linear-gradient(135deg,#0891b2,#10b981)',
];

const UsersManagement = ({ role }) => {
  const [users,      setUsers]      = useState([]);
  const [companies,  setCompanies]  = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData,   setFormData]   = useState({ name: '', email: '', password: '', role: 'User', company: '', designation: '', phoneNumber: '' });
  const [editingId,  setEditingId]  = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search,     setSearch]     = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterCompany, setFilterCompany] = useState('All');

  useEffect(() => { 
    fetchUsers(); 
    fetchCompanies();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) { console.error('Failed to fetch users', err); }
  };

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(res.data);
    } catch (err) { console.error('Failed to fetch companies', err); }
  };

  const openAdd = () => {
    setFormData({ name: '', email: '', password: '', role: 'User', company: '', designation: '', phoneNumber: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (user) => {
    setFormData({ 
      name: user.name, 
      email: user.email, 
      password: '', 
      role: user.role, 
      company: user.company?._id || user.company || '',
      designation: user.designation || '',
      phoneNumber: user.phoneNumber || ''
    });
    setEditingId(user._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', email: '', password: '', role: 'User', company: '', designation: '', phoneNumber: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (editingId) {
        await axios.put(`http://localhost:5000/api/users/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/users', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving user');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) { console.error(err); }
  };

  const filtered = users.filter(u => {
    const matchRole   = filterRole === 'All' || u.role === filterRole;
    const matchCompany = filterCompany === 'All' || (u.company?._id || u.company) === filterCompany;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchCompany && matchSearch;
  });

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Company', 'Designation', 'Phone Number'];
    const rows = filtered.map(u => [
      u.name,
      u.email,
      u.role,
      u.company?.name || 'N/A',
      u.designation || 'N/A',
      u.phoneNumber || 'N/A'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (role !== 'Super Admin' && role !== 'Admin') {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(148,163,184,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⊘</div>
        <div>You don't have permission to view this page.</div>
      </div>
    );
  }

  return (
    <div className="um-root">
      <style>{`
        .um-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .um-title-section { display: flex; align-items: center; gap: 1rem; }
        .um-actions { display: flex; gap: 0.75rem; }
        
        .um-toolbar { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .um-search-box { flex: 1; min-width: 250px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.6rem 1rem; color: white; outline: none; }
        .um-select-filter { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.6rem 1rem; color: white; outline: none; min-width: 150px; }
        .um-select-filter option { background: #0f172a; }

        .um-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
        .um-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.5rem; transition: transform 0.2s; position: relative; overflow: hidden; }
        .um-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.15); }
        .um-card-header { display: flex; gap: 1rem; margin-bottom: 1.2rem; }
        .um-avatar { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justifyContent: center; font-weight: 700; color: white; font-size: 1.1rem; }
        .um-user-info { flex: 1; }
        .um-name { font-size: 1.1rem; font-weight: 600; color: #f8fafc; }
        .um-email { font-size: 0.85rem; color: #94a3b8; }
        
        .um-card-meta { display: flex; flex-direction: column; gap: 0.5rem; }
        .um-badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; width: fit-content; }
        .um-company-tag { font-size: 0.8rem; color: #818cf8; font-weight: 500; display: flex; align-items: center; gap: 0.4rem; }
        .um-detail-row { font-size: 0.8rem; color: #94a3b8; display: flex; align-items: center; gap: 0.4rem; margin-top: 0.2rem; }

        .um-card-footer { display: flex; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.06); }
        .um-edit-btn { flex: 1; padding: 0.5rem; border-radius: 8px; border: 1px solid rgba(99,102,241,0.2); background: rgba(99,102,241,0.1); color: #818cf8; cursor: pointer; transition: all 0.2s; }
        .um-edit-btn:hover { background: rgba(99,102,241,0.2); }
        .um-delete-btn { flex: 1; padding: 0.5rem; border-radius: 8px; border: 1px solid rgba(239,68,68,0.2); background: rgba(239,68,68,0.1); color: #fca5a5; cursor: pointer; transition: all 0.2s; }
        .um-delete-btn:hover { background: rgba(239,68,68,0.2); }
        
        .um-add-btn { background: #6366f1; color: white; border: none; padding: 0.7rem 1.4rem; border-radius: 10px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 12px rgba(99,102,241,0.3); }
        .um-export-btn { background: rgba(255,255,255,0.05); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.1); padding: 0.7rem 1.4rem; border-radius: 10px; cursor: pointer; font-weight: 600; }

        .um-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justifyContent: center; z-index: 1000; padding: 1rem; }
        .um-modal { background: #0f172a; width: 480px; padding: 2rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); max-height: 90vh; overflow-y: auto; }
        .um-form-group { margin-bottom: 1.2rem; }
        .um-label { display: block; color: #94a3b8; font-size: 0.8rem; margin-bottom: 0.4rem; }
        .um-input, .um-modal-select { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.75rem; color: white; border-radius: 10px; outline: none; }
      `}</style>

      <div className="um-header">
        <div className="um-title-section">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9' }}>Users Management</h2>
        </div>
        <div className="um-actions">
          <button className="um-export-btn" onClick={exportCSV}>Export CSV</button>
          <button className="um-add-btn" onClick={openAdd}>+ Add User</button>
        </div>
      </div>

      <div className="um-toolbar">
        <input 
          className="um-search-box" 
          placeholder="Search users..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
        />
        <select className="um-select-filter" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="All">All Roles</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
        <select className="um-select-filter" value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
          <option value="All">All Companies</option>
          {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      <div className="um-grid">
        {filtered.map((user, i) => {
          const rc = ROLE_CONFIG[user.role] || ROLE_CONFIG['User'];
          const grad = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
          return (
            <div key={user._id} className="um-card">
              <div className="um-card-header">
                <div className="um-avatar" style={{ background: grad }}>{getInitials(user.name)}</div>
                <div className="um-user-info">
                  <div className="um-name">{user.name}</div>
                  <div className="um-email">{user.email}</div>
                  {user.designation && <div style={{ fontSize: '0.8rem', color: '#6366f1', marginTop: '0.2rem' }}>{user.designation}</div>}
                </div>
              </div>
              <div className="um-card-meta">
                <div className="um-badge" style={{ background: rc.bg, border: `1px solid ${rc.border}`, color: rc.text }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: rc.dot }} />
                  {user.role}
                </div>
                <div className="um-company-tag">🏢 {user.company?.name || 'No Company'}</div>
                {user.phoneNumber && <div className="um-detail-row">📞 {user.phoneNumber}</div>}
              </div>
              <div className="um-card-footer">
                <button className="um-edit-btn" onClick={() => openEdit(user)}>Edit</button>
                <button className="um-delete-btn" onClick={() => setDeleteConfirm(user)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="um-modal-overlay">
          <div className="um-modal">
            <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>{editingId ? 'Edit User' : 'New User'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="um-form-group">
                  <label className="um-label">Full Name</label>
                  <input className="um-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="um-form-group">
                  <label className="um-label">Email Address</label>
                  <input className="um-input" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="um-form-group">
                  <label className="um-label">Designation</label>
                  <input className="um-input" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} placeholder="e.g. IT Manager" />
                </div>
                <div className="um-form-group">
                  <label className="um-label">Phone Number</label>
                  <input className="um-input" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} placeholder="e.g. +1234567890" />
                </div>
              </div>

              <div className="um-form-group">
                <label className="um-label">Password {editingId && '(Leave blank to keep current)'}</label>
                <input className="um-input" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!editingId} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="um-form-group">
                  <label className="um-label">Role</label>
                  <select className="um-modal-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                    {role === 'Super Admin' && <option value="Super Admin">Super Admin</option>}
                  </select>
                </div>
                <div className="um-form-group">
                  <label className="um-label">Company</label>
                  <select className="um-modal-select" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}>
                    <option value="">Select Company</option>
                    {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="um-delete-btn" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="um-add-btn" style={{ flex: 1 }}>{saving ? 'Saving...' : editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="um-modal-overlay">
          <div className="um-modal" style={{ maxWidth: '350px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>Confirm Delete</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="um-export-btn" onClick={() => setDeleteConfirm(null)} style={{ flex: 1 }}>Cancel</button>
              <button className="um-delete-btn" onClick={() => handleDelete(deleteConfirm._id)} style={{ flex: 1 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
