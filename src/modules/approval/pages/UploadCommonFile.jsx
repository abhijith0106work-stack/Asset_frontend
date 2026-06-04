import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';

const UploadCommonFile = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    tags: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const categories = ['HR', 'Finance', 'Operations', 'Procurement', 'IT', 'Vehicle Management', 'Policies', 'Templates', 'Training', 'Other'];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please attach a file');
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim()).filter(t => t)));
      data.append('file', file);

      await axios.post(`${API_BASE_URL}/common-files`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error uploading file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      <button 
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.85rem' }}
      >
        ← Back to Repository
      </button>

      <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border)', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Upload Shared Document</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Document Title *</label>
            <input 
              type="text" name="title" required
              value={formData.title} onChange={handleChange}
              style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }}
              placeholder="e.g. Employee Handbook 2026"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
            <textarea 
              name="description" rows="3"
              value={formData.description} onChange={handleChange}
              style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-main)', outline: 'none', resize: 'vertical' }}
              placeholder="Briefly describe the contents of this document..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
              <select 
                name="category" 
                value={formData.category} onChange={handleChange}
                style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tags (comma separated)</label>
              <input 
                type="text" name="tags"
                value={formData.tags} onChange={handleChange}
                style={{ width: '100%', padding: '0.85rem 1rem', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }}
                placeholder="e.g. hr, policy, urgent"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>File Attachment *</label>
            <div 
              onClick={() => fileInputRef.current.click()}
              style={{ 
                border: `2px dashed ${file ? 'rgba(16,185,129,0.4)' : 'rgba(99,102,241,0.3)'}`, 
                background: file ? 'rgba(16,185,129,0.05)' : 'rgba(99,102,241,0.02)',
                padding: '2rem', borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} style={{ display: 'none' }} />
              {file ? (
                <div>
                  <div style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '0.5rem' }}>✓</div>
                  <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem' }}>{file.name}</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              ) : (
                <div>
                  <div style={{ color: 'var(--accent)', fontSize: '2rem', marginBottom: '0.5rem' }}>⇧</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Click to browse or drag and drop file here</div>
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '1rem', borderRadius: '12px', border: 'none', 
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'var(--text-main)', 
              fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, marginTop: '1rem',
              boxShadow: '0 8px 25px rgba(99,102,241,0.3)'
            }}
          >
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadCommonFile;
