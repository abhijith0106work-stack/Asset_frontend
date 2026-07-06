import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';

const CommonFileViewer = ({ fileId, onBack }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  
  const [isUploadingVersion, setIsUploadingVersion] = useState(false);
  const [versionNumber, setVersionNumber] = useState('');
  const [changeLog, setChangeLog] = useState('');
  const [newVersionFile, setNewVersionFile] = useState(null);
  const versionInputRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', description: '', category: '', tags: '' });
  
  const [isEditingText, setIsEditingText] = useState(false);
  const [textContent, setTextContent] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [savingText, setSavingText] = useState(false);

  const editableExtensions = ['.txt', '.js', '.jsx', '.json', '.html', '.css', '.md', '.py', '.java', '.cpp', '.h', '.csv', '.xml', '.yaml', '.yml'];
  const fileNameLower = file?.fileName?.toLowerCase() || '';
  const isTextEditable = editableExtensions.some(ext => fileNameLower.endsWith(ext));

  const fNameParts = file?.fileName?.split('.') || [];
  const ext = fNameParts.length > 1 ? fNameParts[fNameParts.length - 1].toLowerCase() : '';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);

  const user = JSON.parse(localStorage.getItem('user'));
  const canEditOrDelete = file?.uploadedBy?._id === user?._id || user?.role === 'Super Admin' || user?.role === 'Admin';

  const fetchFile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/common-files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFile(res.data);
      
      const fileData = res.data;
      const fNameLower = fileData.fileName?.toLowerCase() || '';
      const isEditable = editableExtensions.some(ext => fNameLower.endsWith(ext));
      if (isEditable && fileData.fileUrl) {
        const cleanUrl = fileData.fileUrl.replace(/\\/g, '/').replace(/^\//, '');
        const fullUrl = `${API_BASE_URL.replace('/api', '')}/${cleanUrl}`;
        axios.get(fullUrl)
          .then(textRes => {
            const text = typeof textRes.data === 'object' ? JSON.stringify(textRes.data, null, 2) : textRes.data;
            setTextContent(text);
            setEditedText(text);
          })
          .catch(textErr => {
            console.error('Failed to fetch text content:', textErr);
            setTextContent(null);
          });
      } else {
        setTextContent(null);
        setIsEditingText(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTextContent = async () => {
    setSavingText(true);
    try {
      const currentVerNum = parseFloat(file.currentVersion);
      const nextVerNum = isNaN(currentVerNum) ? '1.1' : (currentVerNum + 0.1).toFixed(1);
      
      const editedBlob = new Blob([editedText], { type: 'text/plain' });
      const editedFile = new File([editedBlob], file.fileName || 'document.txt', { type: 'text/plain' });
      
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('versionNumber', nextVerNum);
      data.append('changeLog', `Direct edit via web editor`);
      data.append('file', editedFile);

      await axios.post(`${API_BASE_URL}/common-files/${fileId}/version`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      
      setIsEditingText(false);
      fetchFile();
    } catch (err) {
      console.error(err);
      alert('Error saving updated document content');
    } finally {
      setSavingText(false);
    }
  };

  useEffect(() => {
    fetchFile();
  }, [fileId]);

  const getFullFileUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const cleanUrl = url.replace(/\\/g, '/').replace(/^\//, '');
    return `${API_BASE_URL.replace('/api', '')}/${cleanUrl}`;
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      // Track download
      await axios.post(`${API_BASE_URL}/common-files/${fileId}/download`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local state to reflect download
      setFile(prev => ({ ...prev, downloadsCount: prev.downloadsCount + 1 }));
      
      const fullUrl = getFullFileUrl(file.fileUrl);
      window.open(fullUrl, '_blank');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/common-files/${fileId}/comments`, { text: commentText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommentText('');
      fetchFile(); // Refresh to get new comment
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadVersion = async (e) => {
    e.preventDefault();
    if (!newVersionFile || !versionNumber) return alert('File and Version Number are required');

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('versionNumber', versionNumber);
      data.append('changeLog', changeLog);
      data.append('file', newVersionFile);

      await axios.post(`${API_BASE_URL}/common-files/${fileId}/version`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      
      setIsUploadingVersion(false);
      setNewVersionFile(null);
      setVersionNumber('');
      setChangeLog('');
      fetchFile();
    } catch (err) {
      console.error(err);
      alert('Error uploading new version');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/common-files/${fileId}`, {
        ...editData,
        tags: editData.tags.split(',').map(t => t.trim()).filter(t => t)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      fetchFile();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error updating file details');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this shared document?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/common-files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onBack();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting file');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>Loading document details...</div>;
  if (!file) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>Document not found</div>;

  return (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
      <button 
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.85rem' }}
      >
        ← Back to Repository
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Details & Preview/Download */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            
            {isEditing ? (
              <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <input type="text" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} required style={{ padding: '0.8rem', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }} placeholder="Title" />
                <textarea value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} rows="3" style={{ padding: '0.8rem', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }} placeholder="Description" />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <select value={editData.category} onChange={e => setEditData({...editData, category: e.target.value})} style={{ flex: 1, padding: '0.8rem', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}>
                    {['HR', 'Finance', 'Operations', 'Procurement', 'IT', 'Vehicle Management', 'Policies', 'Templates', 'Training', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="text" value={editData.tags} onChange={e => setEditData({...editData, tags: e.target.value})} style={{ flex: 1, padding: '0.8rem', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }} placeholder="Tags (comma separated)" />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button type="submit" style={{ padding: '0.6rem 1.2rem', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Save Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '0.6rem 1.2rem', background: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>{file.title}</h2>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                      Category: <strong style={{ color: 'var(--accent)' }}>{file.category}</strong> • Uploaded by {file.uploadedBy?.name}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                      v{file.currentVersion}
                    </div>
                    {canEditOrDelete && (
                      <>
                        <button onClick={() => { setEditData({ title: file.title, description: file.description, category: file.category, tags: file.tags.join(', ') }); setIsEditing(true); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', padding: '0.3rem 0.6rem', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' }}>Edit</button>
                        <button onClick={handleDelete} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.3rem 0.6rem', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' }}>Delete</button>
                      </>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {file.description || 'No description provided.'}
                </p>
                
                {file.tags && file.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                    {file.tags.map(t => (
                      <span key={t} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', color: 'var(--text-dim)' }}>#{t}</span>
                    ))}
                  </div>
                )}
              </>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={handleDownload}
                style={{ 
                  padding: '0.8rem 1.5rem', borderRadius: '10px', border: 'none', 
                  background: 'var(--accent)', color: 'var(--accent-text)', 
                  fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" /></svg>
                Download Document
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}><strong>{file.downloadsCount}</strong> Downloads</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}><strong>{file.viewsCount}</strong> Views</div>
            </div>
          </div>

          {/* Document Preview Card */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '520px' }}>
            <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span>Document Preview</span>
                {isTextEditable && canEditOrDelete && (
                  <button 
                    onClick={() => {
                      if (isEditingText) {
                        setEditedText(textContent);
                      }
                      setIsEditingText(!isEditingText);
                    }}
                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {isEditingText ? 'Cancel Edit' : 'Edit Document'}
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                {isEditingText && (
                  <button 
                    onClick={handleSaveTextContent}
                    disabled={savingText}
                    style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {savingText ? 'Saving...' : 'Save As New Version'}
                  </button>
                )}
                <a href={getFullFileUrl(file.fileUrl)} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Open in New Tab 🡥</a>
              </div>
            </div>
            {isEditingText ? (
              <textarea 
                value={editedText}
                onChange={e => setEditedText(e.target.value)}
                style={{ 
                  flex: 1, 
                  background: 'rgba(15,23,42,0.6)', 
                  color: '#f8fafc', 
                  border: 'none', 
                  outline: 'none', 
                  padding: '1.2rem', 
                  fontFamily: 'Space Mono, monospace', 
                  fontSize: '0.85rem', 
                  lineHeight: 1.6, 
                  resize: 'none' 
                }}
                placeholder="Edit file contents..."
              />
            ) : (
              file.fileUrl ? (
                file.fileUrl.toLowerCase().endsWith('.pdf') ? (
                  <iframe src={getFullFileUrl(file.fileUrl)} style={{ width: '100%', height: '100%', border: 'none' }} title="Preview" />
                ) : isTextEditable && textContent !== null ? (
                  <pre style={{ 
                    flex: 1, 
                    margin: 0, 
                    padding: '1.2rem', 
                    overflow: 'auto', 
                    background: 'rgba(15,23,42,0.6)', 
                    color: '#f8fafc', 
                    fontFamily: 'Space Mono, monospace', 
                    fontSize: '0.85rem', 
                    lineHeight: 1.6,
                    textAlign: 'left'
                  }}>
                    {textContent}
                  </pre>
                ) : isImage ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', padding: '1rem' }}>
                    <img src={getFullFileUrl(file.fileUrl)} style={{ maxWidth: '100%', borderRadius: '8px' }} alt="Preview" />
                  </div>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3.5rem' }}>
                      {['doc', 'docx'].includes(ext) ? '📄' : (['xls', 'xlsx'].includes(ext) ? '📊' : '📁')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1rem', color: 'white', marginBottom: '0.3rem' }}>{file.fileName || 'Document'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Preview not available in browser for {ext.toUpperCase()} files.</div>
                    </div>
                    <a 
                      href={getFullFileUrl(file.fileUrl)} 
                      download 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.65rem 1.25rem',
                        borderRadius: '10px',
                        background: 'var(--accent)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        boxShadow: '0 4px 12px var(--accent-glow)'
                      }}
                    >
                      Download File
                    </a>
                  </div>
                )
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>No file attached</div>
              )
            )}
          </div>

          {/* Comments Section */}
          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Discussion</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {file.comments?.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', padding: '1rem' }}>No comments yet.</div>
              ) : (
                file.comments.map(c => (
                  <div key={c._id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{c.user?.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{c.text}</div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.8rem' }}>
              <input 
                type="text" 
                value={commentText} onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..." 
                style={{ flex: 1, padding: '0.75rem 1rem', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }}
              />
              <button 
                type="submit" 
                style={{ padding: '0.75rem 1.2rem', borderRadius: '10px', border: 'none', background: 'var(--accent)', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer' }}
              >
                Post
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Version History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>Version History</h3>
              <button 
                onClick={() => setIsUploadingVersion(!isUploadingVersion)}
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
              >
                + New Version
              </button>
            </div>

            {isUploadingVersion && (
              <form onSubmit={handleUploadVersion} style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <input 
                  type="text" placeholder="Version Number (e.g. 1.1)" value={versionNumber} onChange={e => setVersionNumber(e.target.value)} required
                  style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.8rem' }}
                />
                <input 
                  type="text" placeholder="Change Log (optional)" value={changeLog} onChange={e => setChangeLog(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.8rem' }}
                />
                
                <div 
                  onClick={() => versionInputRef.current.click()}
                  style={{ border: '1px dashed var(--border)', padding: '0.8rem', borderRadius: '6px', textAlign: 'center', cursor: 'pointer', fontSize: '0.8rem', color: newVersionFile ? '#10b981' : 'var(--text-dim)' }}
                >
                  <input type="file" ref={versionInputRef} onChange={e => setNewVersionFile(e.target.files[0])} style={{ display: 'none' }} />
                  {newVersionFile ? newVersionFile.name : 'Click to attach file'}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={() => setIsUploadingVersion(false)} style={{ flex: 1, padding: '0.5rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '0.5rem', background: 'var(--accent)', border: 'none', borderRadius: '6px', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Upload</button>
                </div>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[...file.versions].reverse().map((v, idx) => (
                <div key={v._id} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                  {idx !== file.versions.length - 1 && <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '-16px', width: '2px', background: 'var(--border)' }} />}
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: idx === 0 ? 'var(--accent)' : 'var(--bg-main)', border: `2px solid ${idx === 0 ? 'var(--accent)' : 'var(--border)'}`, flexShrinks: 0, zIndex: 1 }} />
                  <div style={{ flex: 1, paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: idx === 0 ? 'var(--text-main)' : 'var(--text-dim)' }}>Version {v.versionNumber}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(v.createdAt).toLocaleDateString()}</span>
                    </div>
                    {v.changeLog && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>"{v.changeLog}"</div>}
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>By {v.uploadedBy?.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default CommonFileViewer;
