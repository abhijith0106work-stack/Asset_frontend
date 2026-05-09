import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(res.data);
    } catch (err) {
      console.error('Error fetching companies', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (company = null) => {
    if (company) {
      setEditingCompany(company);
      setFormData({
        name: company.name,
        address: company.address || '',
        contactEmail: company.contactEmail || '',
        contactPhone: company.contactPhone || ''
      });
      setLogoPreview(company.logo ? `http://localhost:5000${company.logo}` : null);
    } else {
      setEditingCompany(null);
      setFormData({ name: '', address: '', contactEmail: '', contactPhone: '' });
      setLogoPreview(null);
    }
    setLogoFile(null);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (logoFile) data.append('logo', logoFile);

      if (editingCompany) {
        await axios.put(`http://localhost:5000/api/companies/${editingCompany._id}`, data, config);
      } else {
        await axios.post('http://localhost:5000/api/companies', data, config);
      }
      
      setShowModal(false);
      fetchCompanies();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving company');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCompanies();
    } catch (err) {
      alert('Error deleting company');
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading companies...</div>;

  return (
    <div className="cm-root">
      <style>{`
        .cm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .cm-title { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; }
        .cm-add-btn { background: #6366f1; color: white; border: none; padding: 0.6rem 1.2rem; borderRadius: 8px; cursor: pointer; font-weight: 600; }
        
        .cm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .cm-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 1.5rem; border-radius: 12px; }
        .cm-card-top { display: flex; gap: 1rem; margin-bottom: 1rem; }
        .cm-logo-sm { width: 50px; height: 50px; border-radius: 8px; object-fit: contain; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
        .cm-card-name { font-size: 1.2rem; font-weight: 600; color: #f8fafc; }
        .cm-card-detail { font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.25rem; }
        .cm-card-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
        .cm-edit-btn { background: rgba(99,102,241,0.1); color: #818cf8; border: 1px solid rgba(99,102,241,0.2); padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; }
        .cm-delete-btn { background: rgba(239,68,68,0.1); color: #fca5a5; border: 1px solid rgba(239,68,68,0.2); padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; }

        .cm-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justifyContent: center; z-index: 1000; }
        .cm-modal { background: #0f172a; width: 450px; padding: 2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); max-height: 90vh; overflow-y: auto; }
        .cm-form-group { margin-bottom: 1.2rem; }
        .cm-label { display: block; color: #94a3b8; font-size: 0.8rem; margin-bottom: 0.4rem; }
        .cm-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.7rem; color: white; border-radius: 8px; }
      `}</style>

      <div className="cm-header">
        <h2 className="cm-title">Companies Management</h2>
        <button className="cm-add-btn" onClick={() => handleOpenModal()}>+ Add Company</button>
      </div>

      <div className="cm-grid">
        {companies.map(c => (
          <div key={c._id} className="cm-card">
            <div className="cm-card-top">
              {c.logo ? <img src={`http://localhost:5000${c.logo}`} className="cm-logo-sm" alt="logo" /> : <div className="cm-logo-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏢</div>}
              <div className="cm-card-name">{c.name}</div>
            </div>
            <div className="cm-card-detail">📍 {c.address || 'No address'}</div>
            <div className="cm-card-detail">✉️ {c.contactEmail || 'No email'}</div>
            <div className="cm-card-detail">📞 {c.contactPhone || 'No phone'}</div>
            <div className="cm-card-actions">
              <button className="cm-edit-btn" onClick={() => handleOpenModal(c)}>Edit</button>
              <button className="cm-delete-btn" onClick={() => handleDelete(c._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="cm-modal-overlay">
          <div className="cm-modal">
            <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>{editingCompany ? 'Edit Company' : 'New Company'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="cm-form-group">
                <label className="cm-label">Company Name</label>
                <input className="cm-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="cm-form-group">
                <label className="cm-label">Address</label>
                <input className="cm-input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="cm-form-group">
                <label className="cm-label">Contact Email</label>
                <input className="cm-input" type="email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
              </div>
              <div className="cm-form-group">
                <label className="cm-label">Contact Phone</label>
                <input className="cm-input" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
              </div>
              <div className="cm-form-group">
                <label className="cm-label">Company Logo</label>
                <input type="file" onChange={handleFileChange} style={{ color: '#94a3b8', fontSize: '0.8rem' }} />
                {logoPreview && <img src={logoPreview} style={{ width: '100px', height: '100px', objectFit: 'contain', marginTop: '0.5rem', background: 'white', padding: '5px', borderRadius: '8px' }} alt="preview" />}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="cm-delete-btn" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="cm-add-btn" style={{ flex: 1 }}>{editingCompany ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
