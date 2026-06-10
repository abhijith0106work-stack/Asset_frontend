import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import CommonFileViewer from './CommonFileViewer';
import UploadCommonFile from './UploadCommonFile';

const CommonRepository = () => {
  const [files, setFiles] = useState([]);
  const [allFolders, setAllFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null); // null means root
  const [folderPath, setFolderPath] = useState([{ id: null, name: 'Root' }]);
  
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('list'); // 'list', 'upload', 'viewer'
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderVisibility, setNewFolderVisibility] = useState('organization-wide');

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch files
      let filesUrl = `${API_BASE_URL}/common-files?`;
      if (filterCategory) filesUrl += `category=${filterCategory}&`;
      if (searchQuery) {
        filesUrl += `search=${searchQuery}&`;
      } else {
        // Only filter by folder if not searching globally
        filesUrl += `folderId=${currentFolderId || 'root'}&`;
      }
      const filesRes = await axios.get(filesUrl, { headers: { Authorization: `Bearer ${token}` } });
      setFiles(filesRes.data);

      // Fetch folders
      const foldersRes = await axios.get(`${API_BASE_URL}/approval/folders`, { headers: { Authorization: `Bearer ${token}` } });
      setAllFolders(foldersRes.data);
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
  }, [activeView, currentFolderId, filterCategory, searchQuery]);

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setActiveView('viewer');
  };

  const handleUploadSuccess = () => {
    setActiveView('list');
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/approval/folders`, {
        name: newFolderName,
        parentFolder: currentFolderId,
        visibility: newFolderVisibility
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setNewFolderName('');
      setShowNewFolderModal(false);
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error creating folder');
    }
  };

  const navigateToFolder = (folderId, folderName) => {
    if (folderId === null) {
      setFolderPath([{ id: null, name: 'Root' }]);
    } else {
      const idx = folderPath.findIndex(p => p.id === folderId);
      if (idx !== -1) {
        // Truncate path if clicking existing breadcrumb
        setFolderPath(folderPath.slice(0, idx + 1));
      } else {
        setFolderPath([...folderPath, { id: folderId, name: folderName }]);
      }
    }
    setCurrentFolderId(folderId);
    setSearchQuery(''); // clear search when navigating folder
  };

  const categories = ['HR', 'Finance', 'Operations', 'Procurement', 'IT', 'Vehicle Management', 'Policies', 'Templates', 'Training', 'Other'];

  // Filter child folders for active directory
  const currentFolders = searchQuery 
    ? allFolders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allFolders.filter(f => f.parentFolder === currentFolderId || (currentFolderId === null && !f.parentFolder));

  if (activeView === 'upload') {
    return (
      <UploadCommonFile 
        folderId={currentFolderId} 
        onBack={() => setActiveView('list')} 
        onSuccess={handleUploadSuccess} 
      />
    );
  }

  if (activeView === 'viewer' && selectedFile) {
    return <CommonFileViewer fileId={selectedFile._id} onBack={() => setActiveView('list')} />;
  }

  return (
    <div style={{ animation: 'fadeUp 0.5s ease both' }}>
      
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', background: 'var(--bg-card)', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.4rem' }}>Location:</span>
        {folderPath.map((folder, idx) => (
          <React.Fragment key={folder.id || 'root-crumb'}>
            {idx > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/</span>}
            <button 
              onClick={() => navigateToFolder(folder.id, folder.name)}
              style={{
                background: 'none', border: 'none', color: idx === folderPath.length - 1 ? 'var(--text-main)' : 'var(--accent)',
                fontWeight: idx === folderPath.length - 1 ? 700 : 500, cursor: 'pointer', fontSize: '0.8rem'
              }}
            >
              {folder.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
          <input 
            type="text" 
            placeholder="Search documents or folders..." 
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
        
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={() => setShowNewFolderModal(true)}
            style={{
              padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer',
              background: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '1.1rem', marginTop: '-2px' }}>📁</span>
            New Folder
          </button>
          
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
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s' }}>
          <form onSubmit={handleCreateFolder} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem', width: '90%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Create New Folder</h3>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>Folder Name</label>
              <input 
                type="text" 
                placeholder="e.g. HR Policies" 
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>Visibility Scope</label>
              <select 
                value={newFolderVisibility} 
                onChange={e => setNewFolderVisibility(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }}
              >
                <option value="private">Private (Only Creator)</option>
                <option value="department-only">Department Only</option>
                <option value="organization-wide">Organization-wide (All Shared)</option>
                <option value="confidential">Confidential</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setShowNewFolderModal(false)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-dim)', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ flex: 1, padding: '0.75rem', background: 'var(--accent)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Create Folder</button>
            </div>
          </form>
        </div>
      )}

      {/* Explorer Content */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[1,2,3,4].map(i => (
             <div key={i} className="ap-shimmer" style={{ height: '180px', width: '100%', borderRadius: '16px' }} />
          ))}
        </div>
      ) : (currentFolders.length === 0 && files.length === 0) ? (
        <div className="ap-activity-empty">
          <div className="ap-activity-empty-icon">📂</div>
          <div className="ap-activity-empty-text">This directory is empty.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          {/* Folders List */}
          {currentFolders.map((folder, idx) => (
            <div 
              key={folder._id} 
              onClick={() => navigateToFolder(folder._id, folder.name)}
              className="ap-card"
              style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', animationDelay: `${idx * 0.04}s`, minHeight: '80px' }}
            >
              <div style={{ 
                background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '0.6rem', 
                borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem'
              }}>
                📁
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {folder.name}
                </h4>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Folder • {folder.visibility.replace('-', ' ')}
                </span>
              </div>
            </div>
          ))}

          {/* Files List */}
          {files.map((file, idx) => (
            <div 
              key={file._id} 
              onClick={() => handleFileClick(file)}
              className="ap-card"
              style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', animationDelay: `${(currentFolders.length + idx) * 0.04}s` }}
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
