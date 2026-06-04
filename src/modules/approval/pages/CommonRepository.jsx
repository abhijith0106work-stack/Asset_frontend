import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import CommonFileViewer from './CommonFileViewer';
import UploadCommonFile from './UploadCommonFile';

const CommonRepository = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('list'); // 'list', 'upload', 'viewer'
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = `${API_BASE_URL}/common-files?`;
      if (filterCategory) url += `category=${filterCategory}&`;
      if (searchQuery) url += `search=${searchQuery}&`;
      
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'list') {
      fetchFiles();
    }
  }, [activeView, filterCategory, searchQuery]);

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setActiveView('viewer');
  };

  const handleUploadSuccess = () => {
    setActiveView('list');
  };

  const categories = ['HR', 'Finance', 'Operations', 'Procurement', 'IT', 'Vehicle Management', 'Policies', 'Templates', 'Training', 'Other'];

  if (activeView === 'upload') {
    return <UploadCommonFile onBack={() => setActiveView('list')} onSuccess={handleUploadSuccess} />;
  }

  if (activeView === 'viewer' && selectedFile) {
    return <CommonFileViewer fileId={selectedFile._id} onBack={() => setActiveView('list')} />;
  }

  return (
    <div style={{ animation: 'fadeUp 0.5s ease both' }}>
      
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
          <input 
            type="text" 
            placeholder="Search documents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)',
              background: 'var(--bg-card)', color: 'var(--text-main)', flex: 1, outline: 'none'
            }}
          />
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)',
              background: 'var(--bg-card)', color: 'var(--text-dim)', outline: 'none'
            }}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        
        <button 
          onClick={() => setActiveView('upload')}
          style={{
            padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
            background: 'var(--accent)', color: 'var(--text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem',
            boxShadow: '0 4px 15px var(--accent-glow)'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" />
          </svg>
          Upload Document
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[1,2,3,4].map(i => (
             <div key={i} className="ap-shimmer" style={{ height: '180px', width: '100%', borderRadius: '16px' }} />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="ap-activity-empty">
          <div className="ap-activity-empty-icon">📂</div>
          <div className="ap-activity-empty-text">No documents found in the common repository.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {files.map((file, idx) => (
            <div 
              key={file._id} 
              onClick={() => handleFileClick(file)}
              className="ap-card"
              style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', animationDelay: `${idx * 0.05}s` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ 
                  background: 'rgba(99,102,241,0.1)', color: '#818cf8', padding: '0.5rem', 
                  borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />
                  </svg>
                </div>
                <span style={{ 
                  fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '8px', 
                  background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-dim)' 
                }}>
                  v{file.currentVersion}
                </span>
              </div>
              
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                {file.title}
              </h3>
              
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {file.description || 'No description provided.'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  By {file.uploadedBy?.name || 'Unknown'}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600 }}>
                  {file.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommonRepository;
