import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
  Available: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: '#34d399', dot: '#10b981' },
  Assigned:  { bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.3)',  text: '#818cf8', dot: '#6366f1' },
  Damaged:   { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   text: '#fca5a5', dot: '#ef4444' },
  Retired:   { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.3)', text: '#94a3b8', dot: '#64748b' },
};

const TYPE_ICON = { IT: '◈', Stationary: '▣' };

const AssetsList = ({ role }) => {
  const navigate = useNavigate();
  const [assets, setAssets]             = useState([]);
  const [users, setUsers]               = useState([]);
  const [companies, setCompanies]       = useState([]);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType,   setFilterType]   = useState('All');
  const [filterCompany, setFilterCompany] = useState('All');
  const [formData, setFormData] = useState({
    name: '', type: 'IT', status: 'Available', assignedTo: '',
    macAddress: '', serialNumber: '', purchaseDate: '', model: '',
    subType: '', condition: 'New', osVersion: '', softwareLicenses: '',
    devicePassword: '', deviceUserName: '', deviceLocation: '', company: ''
  });
  const [imageFile,      setImageFile]      = useState(null);
  const [imagePreview,   setImagePreview]   = useState(null);
  const [saving,         setSaving]         = useState(false);
  const [editingAssetId, setEditingAssetId] = useState(null);

  useEffect(() => {
    fetchAssets();
    fetchCompanies();
    if (role === 'Super Admin' || role === 'Admin') fetchUsers();
  }, [role]);

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = role === 'User'
        ? `${API_BASE_URL}/assets/me`
        : `${API_BASE_URL}/assets`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setAssets(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(res.data);
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'assignedTo') {
        if (value && updated.status === 'Available') updated.status = 'Assigned';
        if (!value && updated.status === 'Assigned') updated.status = 'Available';
      }
      return updated;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Asset name is required');
      return;
    }
    setSaving(true);
    try {
      const token  = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        payload.append(key, formData[key] || '');
      });
      if (imageFile) payload.append('image', imageFile);

      if (editingAssetId) {
        await axios.put(`${API_BASE_URL}/assets/${editingAssetId}`, payload, config);
      } else {
        await axios.post(`${API_BASE_URL}/assets`, payload, config);
      }

      closeModal();
      fetchAssets();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving asset');
    } finally { setSaving(false); }
  };

  const handleEdit = (asset) => {
    setEditingAssetId(asset._id);
    setFormData({
      name: asset.name || '',
      type: asset.type || 'IT',
      status: asset.status || 'Available',
      assignedTo: asset.assignedTo?._id || asset.assignedTo || '',
      macAddress: asset.macAddress || '',
      serialNumber: asset.serialNumber || '',
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
      model: asset.model || '',
      subType: asset.subType || '',
      condition: asset.condition || 'New',
      osVersion: asset.osVersion || '',
      softwareLicenses: asset.softwareLicenses || '',
      devicePassword: asset.devicePassword || '',
      deviceUserName: asset.deviceUserName || '',
      deviceLocation: asset.deviceLocation || '',
      company: asset.company?._id || asset.company || ''
    });
    setImagePreview(asset.image ? `http://localhost:5000${asset.image}` : null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/assets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAssets();
    } catch (err) { alert('Error deleting asset'); }
  };

  const downloadLabel = (asset) => {
    const qrCanvas = document.getElementById(`qr-${asset._id}`);
    if (!qrCanvas) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1050; canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    const drawContent = (logoImg = null) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR Code
      ctx.drawImage(qrCanvas, 30, 30, 240, 240);
      
      // Draw Logo (opposite side)
      if (logoImg) {
        ctx.drawImage(logoImg, canvas.width - 270, 30, 240, 240);
      }
      
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 45px sans-serif';
      ctx.fillText(asset.uniqueId ? `${asset.uniqueId} - ${asset.name}` : asset.name, 300, 80);
      
      ctx.font = '28px sans-serif';
      ctx.fillText(`Model: ${asset.model || 'N/A'}`, 300, 130);
      ctx.fillText(`SN: ${asset.serialNumber || 'N/A'}`, 300, 175);
      ctx.fillText(`Location: ${asset.deviceLocation || 'N/A'}`, 300, 220);
      ctx.fillText(`Company: ${asset.company?.name || 'N/A'}`, 300, 265);
      
      ctx.strokeStyle = '#000000'; ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
      
      const pngUrl = canvas.toDataURL('image/png');
      const dl = document.createElement('a');
      dl.href = pngUrl; dl.download = `label-${asset.uniqueId || asset._id}.png`;
      dl.click();
    };

    if (asset.company?.logo) {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Important for canvas
      img.src = `http://localhost:5000${asset.company.logo}`;
      img.onload = () => drawContent(img);
      img.onerror = () => drawContent(); // Fallback if logo fails to load
    } else {
      drawContent();
    }
  };

  const exportCSV = () => {
    const headers = ['Unique ID', 'Name', 'Type', 'Status', 'Assigned To', 'Location', 'Company'];
    const rows = filtered.map(a => [
      a.uniqueId || '',
      a.name,
      a.type,
      a.status,
      a.assignedTo?.name || 'Unassigned',
      a.deviceLocation || '',
      a.company?.name || 'N/A'
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "assets_export.csv";
    link.click();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAssetId(null);
    setFormData({
      name: '', type: 'IT', status: 'Available', assignedTo: '',
      macAddress: '', serialNumber: '', purchaseDate: '', model: '',
      subType: '', condition: 'New', osVersion: '', softwareLicenses: '',
      devicePassword: '', deviceUserName: '', deviceLocation: '', company: ''
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const filtered = assets.filter(a =>
    (filterStatus === 'All' || a.status === filterStatus) &&
    (filterType   === 'All' || a.type   === filterType) &&
    (filterCompany === 'All' || (a.company?._id || a.company) === filterCompany)
  );

  return (
    <div className="al-root">
      <style>{`
        .al-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .al-actions { display: flex; gap: 0.75rem; }
        .al-toolbar { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .al-select { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.6rem 1rem; color: white; outline: none; }
        .al-select option { background: #0f172a; }
        
        .al-table-wrap { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; }
        .al-table { width: 100%; border-collapse: collapse; text-align: left; }
        .al-table th { padding: 1.25rem 1.5rem; background: rgba(255,255,255,0.03); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .al-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 0.9rem; vertical-align: middle; }
        .al-asset-img { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1); }
        
        .al-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justifyContent: center; z-index: 1000; padding: 1rem; }
        .al-modal { background: #0f172a; width: 600px; padding: 2rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); max-height: 90vh; overflow-y: auto; }
        .al-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .al-form-group { margin-bottom: 1rem; }
        .al-label { display: block; color: #94a3b8; font-size: 0.75rem; margin-bottom: 0.4rem; }
        .al-input, .al-modal-select { width: 100%; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); padding: 0.7rem; color: white; border-radius: 8px; }
        .al-modal-select option { background: #0f172a; color: white; }
        
        .badge { padding: 0.2rem 0.6rem; border-radius: 100px; font-size: 0.75rem; font-weight: 600; }
        .btn-primary { background: #6366f1; color: white; border: none; padding: 0.7rem 1.4rem; border-radius: 10px; cursor: pointer; font-weight: 600; }
        .btn-secondary { background: rgba(255,255,255,0.05); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.1); padding: 0.7rem 1.4rem; border-radius: 10px; cursor: pointer; }
      `}</style>

      <div className="al-header">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9' }}>Asset Management</h2>
        <div className="al-actions">
          {(role === 'Super Admin' || role === 'Admin') && (
            <>
              <button className="btn-secondary" onClick={exportCSV}>Export CSV</button>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Asset</button>
            </>
          )}
        </div>
      </div>

      <div className="al-toolbar">
        <select className="al-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="IT">IT</option>
          <option value="Stationary">Stationary</option>
        </select>
        <select className="al-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="Damaged">Damaged</option>
          <option value="Retired">Retired</option>
        </select>
        <select className="al-select" value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
          <option value="All">All Companies</option>
          {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      <div className="al-table-wrap">
        <table className="al-table">
          <thead>
            <tr>
              <th>ID & Name</th>
              <th>Type</th>
              <th>Location</th>
              <th>Company</th>
              <th>Status</th>
              {(role === 'Super Admin' || role === 'Admin') && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map(asset => {
              const sc = STATUS_CONFIG[asset.status] || STATUS_CONFIG.Retired;
              return (
                <tr key={asset._id}>
                  <td>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      {asset.image ? <img src={`http://localhost:5000${asset.image}`} className="al-asset-img" alt="" /> : <div className="al-asset-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}>{TYPE_ICON[asset.type]}</div>}
                      <div>
                        <div style={{ color: '#818cf8', fontSize: '0.7rem', fontFamily: 'monospace' }}>{asset.uniqueId}</div>
                        <div onClick={() => navigate(`/asset/${asset._id}`)} style={{ cursor: 'pointer', fontWeight: 600, color: '#f1f5f9', textDecoration: 'underline' }}>{asset.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{asset.type}</td>
                  <td>{asset.deviceLocation || '—'}</td>
                  <td style={{ color: '#818cf8', fontWeight: 500 }}>{asset.company?.name || 'N/A'}</td>
                  <td>
                    <span className="badge" style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>{asset.status}</span>
                  </td>
                  {(role === 'Super Admin' || role === 'Admin') && (
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(asset)} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => downloadLabel(asset)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }}>Label</button>
                        <button onClick={() => handleDelete(asset._id)} style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }}>Del</button>
                        <div style={{ display: 'none' }}><QRCodeCanvas id={`qr-${asset._id}`} value={`http://localhost:3000/asset/${asset._id}`} size={256} /></div>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="al-modal-overlay">
          <div className="al-modal">
            <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>{editingAssetId ? 'Edit Asset' : 'New Asset'}</h3>
            <div className="al-form-grid">
              <div className="al-form-group">
                <label className="al-label">Asset Name</label>
                <input className="al-input" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="al-form-group">
                <label className="al-label">Type</label>
                <select className="al-modal-select" name="type" value={formData.type} onChange={handleChange}>
                  <option value="IT">IT</option>
                  <option value="Stationary">Stationary</option>
                </select>
              </div>
              <div className="al-form-group">
                <label className="al-label">Location</label>
                <input className="al-input" name="deviceLocation" value={formData.deviceLocation} onChange={handleChange} placeholder="e.g. Server Room" />
              </div>
              <div className="al-form-group">
                <label className="al-label">Company</label>
                <select className="al-modal-select" name="company" value={formData.company} onChange={handleChange}>
                  <option value="">Select Company</option>
                  {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="al-form-group">
                <label className="al-label">Status</label>
                <select className="al-modal-select" name="status" value={formData.status} onChange={handleChange}>
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              <div className="al-form-group">
                <label className="al-label">Assign To</label>
                <select className="al-modal-select" name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              </div>
              {formData.type === 'IT' && (
                <>
                  <div className="al-form-group">
                    <label className="al-label">Model</label>
                    <input className="al-input" name="model" value={formData.model} onChange={handleChange} />
                  </div>
                  <div className="al-form-group">
                    <label className="al-label">Serial Number</label>
                    <input className="al-input" name="serialNumber" value={formData.serialNumber} onChange={handleChange} />
                  </div>
                </>
              )}
            </div>
            
            <div className="al-form-group" style={{ marginTop: '1rem' }}>
              <label className="al-label">Asset Image</label>
              <input type="file" onChange={handleFileChange} style={{ color: '#94a3b8', fontSize: '0.8rem' }} />
              {imagePreview && <img src={imagePreview} style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: '8px' }} alt="" />}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn-secondary" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
              <button className="btn-primary" onClick={handleSubmit} style={{ flex: 1 }}>{saving ? 'Saving...' : editingAssetId ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetsList;
