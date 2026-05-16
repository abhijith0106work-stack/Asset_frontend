// import React, { useState, useEffect } from 'react';
// import { approvalApi } from '../api/approvalApi';
// import FileDetailModal from '../components/FileDetailModal';

// const MyFiles = ({ onNewClick }) => {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [resubmittingId, setResubmittingId] = useState(null);
//   const [resubmitComment, setResubmitComment] = useState('');
//   const [commentingFile, setCommentingFile] = useState(null);
//   const [newComment, setNewComment] = useState('');
//   const [viewingFile, setViewingFile] = useState(null);

//   const fetchFiles = async () => {
//     setLoading(true);
//     try {
//       const res = await approvalApi.getFiles();
//       setFiles(res.data);
//     } catch (err) { console.error(err); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => {
//     fetchFiles();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this submission?')) return;
//     try {
//       await approvalApi.deleteFile(id);
//       fetchFiles();
//     } catch (err) { alert(err.response?.data?.message || 'Error deleting file'); }
//   };

//   const handleResubmit = async (id) => {
//     try {
//       await approvalApi.resubmitFile(id, resubmitComment);
//       setResubmittingId(null);
//       setResubmitComment('');
//       fetchFiles();
//     } catch (err) { alert(err.response?.data?.message || 'Error resubmitting file'); }
//   };

//   const handleAddComment = async () => {
//     if (!newComment.trim()) return;
//     try {
//       await approvalApi.addComment(commentingFile._id, newComment);
//       setNewComment('');
//       // Refresh the specific file details or all files
//       fetchFiles();
//       setCommentingFile(null); // or keep open and refresh
//     } catch (err) { alert('Error adding comment'); }
//   };

//   return (
//     <div style={{ padding: '2rem', color: 'white' }}>
//       <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
//         <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>My Submitted Files</h2>
//         <button 
//           onClick={onNewClick}
//           style={{ 
//             background: '#6366f1', color: 'white', border: 'none', padding: '0.7rem 1.5rem', 
//             borderRadius: '12px', fontWeight: 600, cursor: 'pointer' 
//           }}
//         >+ New Submission</button>
//       </div>

//       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//         {files.map(file => (
//           <div key={file._id} style={{ 
//             background: 'rgba(255,255,255,0.03)', 
//             padding: '1.2rem', 
//             borderRadius: '16px', 
//             border: '1px solid rgba(255,255,255,0.08)',
//             display: 'flex',
//             justify: 'space-between',
//             alignItems: 'center'
//           }}>
//             <div>
//               <div 
//                 onClick={() => setViewingFile(file)}
//                 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.2rem', cursor: 'pointer', color: '#f1f5f9' }}
//                 onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'}
//                 onMouseLeave={(e) => e.currentTarget.style.color = '#f1f5f9'}
//               >
//                 {file.title}
//               </div>
//               <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Dept: {file.departmentId?.name || 'N/A'} • Submitted on {new Date(file.createdAt).toLocaleDateString()}</div>
//             </div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//               <div style={{ 
//                 padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
//                 background: file.status === 'approved' ? 'rgba(16,185,129,0.1)' : file.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
//                 color: file.status === 'approved' ? '#10b981' : file.status === 'rejected' ? '#ef4444' : '#818cf8',
//                 border: `1px solid ${file.status === 'approved' ? 'rgba(16,185,129,0.2)' : file.status === 'rejected' ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)'}`
//               }}>
//                 {file.status.toUpperCase().replace('_', ' ')}
//               </div>

//               <div style={{ display: 'flex', gap: '0.5rem' }}>
//                 {(file.status === 'submitted' || file.status === 'resubmitted') && (
//                   <>
//                     <button style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer' }} title="Edit">✏️</button>
//                     <button onClick={() => handleDelete(file._id)} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer' }} title="Delete">🗑️</button>
//                   </>
//                 )}
//                 {file.status === 'rejected' && (
//                   <button 
//                     onClick={() => setResubmittingId(file._id)}
//                     style={{ background: '#6366f1', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
//                   >Resubmit</button>
//                 )}
//                 <button 
//                   onClick={() => setCommentingFile(file)}
//                   style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer' }}
//                   title="Comments"
//                 >💬</button>
//               </div>
//             </div>
//           </div>
//         ))}
        
//         {resubmittingId && (
//           <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
//             <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '24px', width: '400px', border: '1px solid rgba(255,255,255,0.1)' }}>
//               <h3 style={{ marginBottom: '1rem' }}>Resubmit File</h3>
//               <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>Add a comment to explain the changes or address the rejection.</p>
//               <textarea 
//                 style={{ width: '100%', height: '100px', padding: '1rem', borderRadius: '12px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginBottom: '1.5rem' }}
//                 placeholder="Your comment..."
//                 value={resubmitComment}
//                 onChange={(e) => setResubmitComment(e.target.value)}
//               />
//               <div style={{ display: 'flex', gap: '1rem' }}>
//                 <button onClick={() => setResubmittingId(null)} style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>Cancel</button>
//                 <button onClick={() => handleResubmit(resubmittingId)} style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', background: '#6366f1', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Resubmit</button>
//               </div>
//             </div>
//           </div>
//         )}

//         {commentingFile && (
//           <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
//             <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '24px', width: '450px', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
//                 <h3 style={{ margin: 0 }}>Comments - {commentingFile.title}</h3>
//                 <button onClick={() => setCommentingFile(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
//               </div>
              
//               <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
//                 {(commentingFile.comments || []).length === 0 ? (
//                   <div style={{ textAlign: 'center', color: '#64748b', padding: '1rem' }}>No comments yet.</div>
//                 ) : (
//                   commentingFile.comments.map((c, i) => (
//                     <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
//                       <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.2rem' }}>{c.user?.name || 'User'}</div>
//                       <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{c.text}</div>
//                       <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.4rem' }}>{new Date(c.createdAt).toLocaleString()}</div>
//                     </div>
//                   ))
//                 )}
//               </div>

//               <div style={{ display: 'flex', gap: '0.5rem' }}>
//                 <input 
//                   style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
//                   placeholder="Type a comment..."
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
//                 />
//                 <button onClick={handleAddComment} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Send</button>
//               </div>
//             </div>
//           </div>
//         )}

//         <FileDetailModal 
//           isOpen={!!viewingFile}
//           file={viewingFile}
//           onClose={() => setViewingFile(null)}
//         />

//         {files.length === 0 && !loading && <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No files found.</div>}
//       </div>
//     </div>
//   );
// };

// export default MyFiles;


import React, { useState, useEffect } from 'react';
import { approvalApi } from '../api/approvalApi';
import FileDetailModal from '../components/FileDetailModal';

const STATUS_CONFIG = {
  approved:    { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.28)',  text: '#6ee7b7', dot: '#10b981', icon: '✓', label: 'Approved' },
  rejected:    { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.28)',   text: '#fca5a5', dot: '#ef4444', icon: '✕', label: 'Rejected' },
  submitted:   { bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.28)',  text: '#a5b4fc', dot: '#6366f1', icon: '⬆', label: 'Submitted' },
  resubmitted: { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.28)',  text: '#fcd34d', dot: '#f59e0b', icon: '↩', label: 'Resubmitted' },
  pending:     { bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.28)', text: '#94a3b8', dot: '#64748b', icon: '◌', label: 'Pending' },
};

const getStatus = (s) => STATUS_CONFIG[s] || STATUS_CONFIG['pending'];

const MyFiles = ({ onNewClick }) => {
  const [files,          setFiles]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [resubmittingId, setResubmittingId] = useState(null);
  const [resubmitComment,setResubmitComment]= useState('');
  const [commentingFile, setCommentingFile] = useState(null);
  const [newComment,     setNewComment]     = useState('');
  const [viewingFile,    setViewingFile]    = useState(null);
  const [deleteConfirm,  setDeleteConfirm]  = useState(null);
  const [filterStatus,   setFilterStatus]   = useState('all');

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await approvalApi.getFiles();
      setFiles(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFiles(); }, []);

  const handleDelete = async (id) => {
    try {
      await approvalApi.deleteFile(id);
      setDeleteConfirm(null);
      fetchFiles();
    } catch (err) { alert(err.response?.data?.message || 'Error deleting file'); }
  };

  const handleResubmit = async (id) => {
    try {
      await approvalApi.resubmitFile(id, resubmitComment);
      setResubmittingId(null);
      setResubmitComment('');
      fetchFiles();
    } catch (err) { alert(err.response?.data?.message || 'Error resubmitting'); }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await approvalApi.addComment(commentingFile._id, newComment);
      setNewComment('');
      fetchFiles();
      setCommentingFile(null);
    } catch (err) { alert('Error adding comment'); }
  };

  const counts = {
    all:         files.length,
    submitted:   files.filter(f => f.status === 'submitted').length,
    approved:    files.filter(f => f.status === 'approved').length,
    rejected:    files.filter(f => f.status === 'rejected').length,
    resubmitted: files.filter(f => f.status === 'resubmitted').length,
  };

  const filtered = filterStatus === 'all' ? files : files.filter(f => f.status === filterStatus);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        .mf-root { font-family:'DM Sans',sans-serif; color:var(--text-main); padding:2rem; }

        /* HEADER */
        .mf-header {
          display:flex; align-items:center; justify-content:space-between;
          flex-wrap:wrap; gap:1rem; margin-bottom:1.75rem;
          animation:mfUp .4s both;
        }
        .mf-title-wrap { display:flex; align-items:center; gap:.75rem; }
        .mf-title-icon {
          width:42px; height:42px; border-radius:12px;
          background:var(--accent-glow); border:1px solid rgba(99,102,241,0.25);
          display:flex; align-items:center; justify-content:center;
          font-size:1.2rem; color:var(--accent);
        }
        .mf-title { font-size:1.4rem; font-weight:700; color:var(--text-main); letter-spacing:-.4px; }
        .mf-subtitle { font-size:.72rem; color:var(--text-dim); font-family:'DM Mono',monospace; }

        .mf-new-btn {
          display:flex; align-items:center; gap:.5rem;
          padding:.6rem 1.2rem; border-radius:12px;
          font-family:'DM Sans',sans-serif; font-size:.83rem; font-weight:600;
          cursor:pointer; border:none;
          background:linear-gradient(135deg,#6366f1,#4f46e5);
          color:#fff; box-shadow:0 4px 16px rgba(99,102,241,.3);
          transition:all .2s;
        }
        .mf-new-btn:hover { transform:translateY(-1px); box-shadow:0 6px 22px rgba(99,102,241,.4); }

        /* STAT PILLS */
        .mf-pills {
          display:flex; gap:.6rem; flex-wrap:wrap;
          margin-bottom:1.5rem; animation:mfUp .4s .05s both;
        }
        .mf-pill {
          display:flex; align-items:center; gap:.45rem;
          padding:.4rem .85rem; border-radius:100px;
          background:var(--bg-card); border:1px solid var(--border);
          font-size:.74rem; font-weight:500; cursor:pointer;
          transition:all .18s; color:var(--text-dim); user-select:none;
        }
        .mf-pill:hover { background:var(--border-light); color:var(--text-main); }
        .mf-pill.active { border-color:var(--accent); background:var(--accent-glow); color:var(--accent); }
        .mf-pill-dot { width:6px; height:6px; border-radius:50%; background:var(--pd,#64748b); flex-shrink:0; }
        .mf-pill-n { font-family:'DM Mono',monospace; }

        /* FILE LIST */
        .mf-list {
          display:flex; flex-direction:column; gap:.75rem;
          animation:mfUp .4s .1s both;
        }

        /* FILE CARD */
        .mf-card {
          background:var(--bg-card);
          border:1px solid var(--border);
          border-radius:16px; padding:1.25rem 1.5rem;
          display:flex; align-items:center; gap:1.25rem;
          transition:all .2s;
          position:relative; overflow:hidden;
        }
        .mf-card:hover {
          border-color:var(--accent);
          box-shadow:0 4px 24px rgba(0,0,0,.25);
          transform:translateY(-1px);
        }
        .mf-card::before {
          content:''; position:absolute;
          left:0; top:0; bottom:0; width:3px;
          background:var(--card-accent, var(--border));
          border-radius:3px 0 0 3px;
        }

        /* File icon */
        .mf-file-icon {
          width:46px; height:46px; border-radius:12px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-size:1.3rem;
          background:var(--accent-glow); border:1px solid rgba(99,102,241,.15);
        }

        /* File info */
        .mf-info { flex:1; min-width:0; }
        .mf-fname {
          font-weight:600; font-size:.92rem; color:var(--text-main);
          cursor:pointer; transition:color .15s; display:inline;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:block;
        }
        .mf-fname:hover { color:var(--accent); }
        .mf-meta {
          display:flex; align-items:center; gap:.6rem; margin-top:.3rem;
          font-size:.72rem; color:var(--text-dim); flex-wrap:wrap;
          font-family:'DM Mono',monospace;
        }
        .mf-meta-sep { opacity:.3; }

        /* Status badge */
        .mf-status {
          display:inline-flex; align-items:center; gap:.4rem;
          padding:.22rem .65rem; border-radius:100px;
          font-size:.7rem; font-weight:700; white-space:nowrap; flex-shrink:0;
          letter-spacing:.02em;
        }
        .mf-status-dot { width:5px; height:5px; border-radius:50%; }

        /* Action buttons */
        .mf-actions { display:flex; align-items:center; gap:.45rem; flex-shrink:0; }
        .mf-action-btn {
          display:inline-flex; align-items:center; justify-content:center;
          width:32px; height:32px; border-radius:8px; cursor:pointer;
          border:1px solid var(--border);
          background:var(--bg-card);
          color:var(--text-dim); font-size:.85rem;
          transition:all .15s; flex-shrink:0;
        }
        .mf-action-btn:hover { background:var(--border-light); color:var(--text-main); }
        .mf-action-btn.danger:hover { background:rgba(239,68,68,.1); border-color:rgba(239,68,68,.25); color:#fca5a5; }
        .mf-action-btn.comment:hover { background:var(--accent-glow); border-color:rgba(99,102,241,.25); color:var(--accent); }

        .mf-resubmit-btn {
          display:inline-flex; align-items:center; gap:.35rem;
          padding:.3rem .75rem; border-radius:8px;
          font-family:'DM Sans',sans-serif; font-size:.73rem; font-weight:600;
          cursor:pointer; border:none;
          background:linear-gradient(135deg,#6366f1,#4f46e5);
          color:#fff; transition:all .15s;
        }
        .mf-resubmit-btn:hover { transform:translateY(-1px); }

        /* LOADING SKELETON */
        .mf-skeleton {
          background:var(--bg-card); border:1px solid var(--border);
          border-radius:16px; height:72px;
          background: linear-gradient(90deg, var(--bg-card) 25%, var(--border-light) 50%, var(--bg-card) 75%);
          background-size:200% 100%;
          animation:mfShimmer 1.4s infinite;
        }
        @keyframes mfShimmer {
          0%   { background-position:200% 0; }
          100% { background-position:-200% 0; }
        }

        /* EMPTY */
        .mf-empty {
          padding:4rem 1rem; text-align:center;
          color:var(--text-dim);
        }
        .mf-empty-icon { font-size:3rem; margin-bottom:1rem; opacity:.25; }
        .mf-empty-text { font-size:.85rem; margin-bottom:1.25rem; }
        .mf-empty-btn {
          display:inline-flex; align-items:center; gap:.4rem;
          padding:.55rem 1.1rem; border-radius:10px;
          font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:600;
          cursor:pointer; border:1px solid var(--accent);
          background:var(--accent-glow); color:var(--accent); transition:all .2s;
        }
        .mf-empty-btn:hover { background:rgba(99,102,241,.15); }

        /* MODAL BACKDROP */
        .mf-modal-bg {
          position:fixed; inset:0; background:rgba(0,0,0,.6);
          backdrop-filter:blur(8px); display:flex;
          align-items:center; justify-content:center;
          z-index:1100; padding:1rem;
          animation:mfFade .2s both;
        }
        @keyframes mfFade { from{opacity:0} to{opacity:1} }

        .mf-modal {
          background:var(--bg-panel); border:1px solid var(--border);
          border-radius:20px; width:100%;
          box-shadow:0 32px 80px rgba(0,0,0,.4);
          animation:mfModalIn .3s cubic-bezier(.22,1,.36,1) both;
          overflow:hidden;
        }
        @keyframes mfModalIn {
          from{opacity:0;transform:translateY(20px) scale(.97)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }

        .mf-modal-header {
          display:flex; align-items:center; justify-content:space-between;
          padding:1.3rem 1.75rem; border-bottom:1px solid var(--border);
        }
        .mf-modal-title { font-size:.95rem; font-weight:700; color:var(--text-main); }
        .mf-modal-close {
          width:28px; height:28px; border-radius:8px;
          background:var(--border-light); border:1px solid var(--border);
          color:var(--text-dim); display:flex; align-items:center;
          justify-content:center; cursor:pointer; font-size:.95rem; transition:all .15s;
        }
        .mf-modal-close:hover { background:rgba(239,68,68,.1); border-color:rgba(239,68,68,.25); color:#fca5a5; }

        .mf-modal-body { padding:1.5rem 1.75rem; }

        .mf-modal-label {
          font-size:.7rem; font-weight:600; letter-spacing:.07em;
          text-transform:uppercase; color:var(--text-dim);
          font-family:'DM Mono',monospace; margin-bottom:.45rem; display:block;
        }
        .mf-modal-hint { font-size:.75rem; color:var(--text-dim); margin-bottom:1rem; opacity: 0.8; }

        .mf-modal-textarea, .mf-modal-input {
          width:100%; padding:.75rem .9rem;
          background:var(--bg-main); border:1px solid var(--border);
          border-radius:10px; color:var(--text-main); font-size:.83rem;
          font-family:'DM Sans',sans-serif; outline:none; transition:all .2s;
          resize:vertical;
        }
        .mf-modal-textarea { min-height:100px; }
        .mf-modal-textarea:focus, .mf-modal-input:focus {
          border-color:var(--accent); background:var(--accent-glow);
          box-shadow:0 0 0 3px rgba(99,102,241,.1);
        }
        .mf-modal-textarea::placeholder, .mf-modal-input::placeholder { color:var(--text-muted); }

        .mf-modal-footer {
          display:flex; justify-content:flex-end; gap:.65rem;
          padding:1.1rem 1.75rem; border-top:1px solid var(--border);
        }
        .mf-btn-cancel {
          padding:.55rem 1.15rem; border-radius:10px;
          font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:500;
          cursor:pointer; background:var(--border-light);
          border:1px solid var(--border); color:var(--text-dim);
          transition:all .2s;
        }
        .mf-btn-cancel:hover { background:var(--border); color:var(--text-main); }
        .mf-btn-primary {
          padding:.55rem 1.25rem; border-radius:10px;
          font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:600;
          cursor:pointer; border:none; color:#fff;
          background:linear-gradient(135deg,#6366f1,#4f46e5);
          box-shadow:0 4px 14px rgba(99,102,241,.3); transition:all .2s;
        }
        .mf-btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(99,102,241,.4); }
        .mf-btn-danger {
          padding:.55rem 1.25rem; border-radius:10px;
          font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:600;
          cursor:pointer; border:none; color:#fff;
          background:linear-gradient(135deg,#ef4444,#b91c1c);
          box-shadow:0 4px 14px rgba(239,68,68,.25); transition:all .2s;
        }
        .mf-btn-danger:hover { transform:translateY(-1px); }

        /* COMMENTS */
        .mf-comments-list {
          flex:1; overflow-y:auto; display:flex; flex-direction:column;
          gap:.65rem; padding-right:.25rem; max-height:260px;
          margin-bottom:1rem;
        }
        .mf-comment-item {
          background:var(--border-light); padding:.8rem 1rem;
          border-radius:12px; border:1px solid var(--border);
        }
        .mf-comment-author { font-size:.7rem; color:var(--accent); font-weight:600; margin-bottom:.2rem; }
        .mf-comment-text { font-size:.83rem; color:var(--text-main); line-height:1.5; }
        .mf-comment-time { font-size:.63rem; color:var(--text-dim); opacity: 0.6; margin-top:.3rem; font-family:'DM Mono',monospace; }

        .mf-comment-input-row { display:flex; gap:.5rem; }
        .mf-comment-input {
          flex:1; padding:.65rem .9rem;
          background:var(--bg-main); border:1px solid var(--border);
          border-radius:10px; color:var(--text-main); font-size:.82rem;
          font-family:'DM Sans',sans-serif; outline:none; transition:all .2s;
        }
        .mf-comment-input:focus { border-color:var(--accent); background:var(--accent-glow); }
        .mf-comment-input::placeholder { color:var(--text-muted); }
        .mf-send-btn {
          padding:.65rem 1rem; border-radius:10px;
          font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:600;
          cursor:pointer; border:none; color:#fff;
          background:linear-gradient(135deg,#6366f1,#4f46e5);
          transition:all .15s;
        }
        .mf-send-btn:hover { transform:translateY(-1px); }

        /* DELETE CONFIRM */
        .mf-confirm-modal { max-width:360px; }
        .mf-confirm-body { padding:2rem 1.75rem; text-align:center; }
        .mf-confirm-icon { font-size:2rem; color:#fca5a5; margin-bottom:.65rem; }
        .mf-confirm-title { font-size:1rem; font-weight:700; color:var(--text-main); margin-bottom:.35rem; }
        .mf-confirm-sub { font-size:.8rem; color:var(--text-dim); line-height:1.5; }

        @keyframes mfUp {
          from{opacity:0;transform:translateY(10px)}
          to{opacity:1;transform:translateY(0)}
        }
      `}</style>

      <div className="mf-root">

        {/* HEADER */}
        <div className="mf-header">
          <div className="mf-title-wrap">
            <div className="mf-title-icon">📁</div>
            <div>
              <div className="mf-title">My Submitted Files</div>
              <div className="mf-subtitle">{files.length} total submission{files.length !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <button className="mf-new-btn" onClick={onNewClick}>
            <span style={{ fontSize:'1.1rem', lineHeight:1 }}>+</span>
            New Submission
          </button>
        </div>

        {/* STATUS FILTER PILLS */}
        <div className="mf-pills">
          {[
            { key:'all',         label:'All',         count:counts.all,         pd:'#64748b', pb:'rgba(100,116,139,.1)', pc:'rgba(100,116,139,.3)', pt:'#94a3b8' },
            { key:'submitted',   label:'Submitted',   count:counts.submitted,   pd:'#6366f1', pb:'rgba(99,102,241,.1)', pc:'rgba(99,102,241,.3)',  pt:'#a5b4fc' },
            { key:'resubmitted', label:'Resubmitted', count:counts.resubmitted, pd:'#f59e0b', pb:'rgba(245,158,11,.1)', pc:'rgba(245,158,11,.3)',  pt:'#fcd34d' },
            { key:'approved',    label:'Approved',    count:counts.approved,    pd:'#10b981', pb:'rgba(16,185,129,.1)', pc:'rgba(16,185,129,.3)',  pt:'#6ee7b7' },
            { key:'rejected',    label:'Rejected',    count:counts.rejected,    pd:'#ef4444', pb:'rgba(239,68,68,.1)',  pc:'rgba(239,68,68,.3)',   pt:'#fca5a5' },
          ].map(p => (
            <div
              key={p.key}
              className={`mf-pill${filterStatus === p.key ? ' active' : ''}`}
              style={{ '--pd':p.pd, '--pb':p.pb, '--pc':p.pc, '--pt':p.pt }}
              onClick={() => setFilterStatus(p.key)}
            >
              <span className="mf-pill-dot" />
              {p.label}
              <span className="mf-pill-n">{p.count}</span>
            </div>
          ))}
        </div>

        {/* FILE LIST */}
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
            {[1,2,3].map(i => <div key={i} className="mf-skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mf-empty">
            <div className="mf-empty-icon">📂</div>
            <div className="mf-empty-text">
              {filterStatus === 'all' ? 'No submissions yet.' : `No ${filterStatus} files found.`}
            </div>
            {filterStatus === 'all' && (
              <button className="mf-empty-btn" onClick={onNewClick}>
                + Create your first submission
              </button>
            )}
          </div>
        ) : (
          <div className="mf-list">
            {filtered.map(file => {
              const sc = getStatus(file.status);
              const accentMap = {
                approved: '#10b981', rejected: '#ef4444',
                submitted: '#6366f1', resubmitted: '#f59e0b',
              };
              return (
                <div
                  key={file._id}
                  className="mf-card"
                  style={{ '--card-accent': accentMap[file.status] || '#475569' }}
                >
                  {/* File icon */}
                  <div className="mf-file-icon">📄</div>

                  {/* Info */}
                  <div className="mf-info">
                    <div className="mf-fname" onClick={() => setViewingFile(file)}>
                      {file.title}
                    </div>
                    <div className="mf-meta">
                      <span>📂 {file.departmentId?.name || 'N/A'}</span>
                      <span className="mf-meta-sep">·</span>
                      <span>{new Date(file.createdAt).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' })}</span>
                      {(file.comments?.length > 0) && (
                        <>
                          <span className="mf-meta-sep">·</span>
                          <span>💬 {file.comments.length}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  <span
                    className="mf-status"
                    style={{ background:sc.bg, border:`1px solid ${sc.border}`, color:sc.text }}
                  >
                    <span className="mf-status-dot" style={{ background:sc.dot }} />
                    {sc.label}
                  </span>

                  {/* Actions */}
                  <div className="mf-actions">
                    {(file.status === 'submitted' || file.status === 'resubmitted') && (
                      <>
                        <button className="mf-action-btn" title="Edit">✎</button>
                        <button className="mf-action-btn danger" title="Delete" onClick={() => setDeleteConfirm(file)}>✕</button>
                      </>
                    )}
                    {file.status === 'rejected' && (
                      <button className="mf-resubmit-btn" onClick={() => setResubmittingId(file._id)}>
                        ↩ Resubmit
                      </button>
                    )}
                    <button className="mf-action-btn comment" title="Comments" onClick={() => setCommentingFile(file)}>
                      💬
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── RESUBMIT MODAL ── */}
      {resubmittingId && (
        <div className="mf-modal-bg" onClick={e => e.target === e.currentTarget && setResubmittingId(null)}>
          <div className="mf-modal" style={{ maxWidth:'440px' }}>
            <div className="mf-modal-header">
              <div className="mf-modal-title">↩ Resubmit File</div>
              <button className="mf-modal-close" onClick={() => setResubmittingId(null)}>✕</button>
            </div>
            <div className="mf-modal-body">
              <p className="mf-modal-hint">
                Explain the changes you've made or how you've addressed the rejection reason.
              </p>
              <label className="mf-modal-label">Your Comment</label>
              <textarea
                className="mf-modal-textarea"
                placeholder="Describe what changed…"
                value={resubmitComment}
                onChange={e => setResubmitComment(e.target.value)}
              />
            </div>
            <div className="mf-modal-footer">
              <button className="mf-btn-cancel" onClick={() => setResubmittingId(null)}>Cancel</button>
              <button className="mf-btn-primary" onClick={() => handleResubmit(resubmittingId)}>
                ↩ Resubmit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── COMMENTS MODAL ── */}
      {commentingFile && (
        <div className="mf-modal-bg" onClick={e => e.target === e.currentTarget && setCommentingFile(null)}>
          <div className="mf-modal" style={{ maxWidth:'480px' }}>
            <div className="mf-modal-header">
              <div style={{ display:'flex', flexDirection:'column', gap:'.15rem', minWidth:0 }}>
                <div className="mf-modal-title">💬 Comments</div>
                <div style={{ fontSize:'.7rem', color:'rgba(148,163,184,.45)', fontFamily:"'DM Mono',monospace", overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {commentingFile.title}
                </div>
              </div>
              <button className="mf-modal-close" onClick={() => setCommentingFile(null)}>✕</button>
            </div>

            <div className="mf-modal-body">
              <div className="mf-comments-list">
                {(commentingFile.comments || []).length === 0 ? (
                  <div style={{ textAlign:'center', padding:'2rem 0', color:'rgba(100,116,139,.5)', fontSize:'.8rem' }}>
                    No comments yet. Be the first!
                  </div>
                ) : (
                  commentingFile.comments.map((c, i) => (
                    <div key={i} className="mf-comment-item">
                      <div className="mf-comment-author">{c.user?.name || 'User'}</div>
                      <div className="mf-comment-text">{c.text}</div>
                      <div className="mf-comment-time">{new Date(c.createdAt).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="mf-comment-input-row">
                <input
                  className="mf-comment-input"
                  placeholder="Write a comment…"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                />
                <button className="mf-send-btn" onClick={handleAddComment}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div className="mf-modal-bg" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="mf-modal mf-confirm-modal">
            <div className="mf-confirm-body">
              <div className="mf-confirm-icon">⚠</div>
              <div className="mf-confirm-title">Delete Submission?</div>
              <div className="mf-confirm-sub">
                This will permanently delete <strong style={{ color:'#e2e8f0' }}>"{deleteConfirm.title}"</strong> and cannot be undone.
              </div>
            </div>
            <div className="mf-modal-footer">
              <button className="mf-btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="mf-btn-danger" onClick={() => handleDelete(deleteConfirm._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* FILE DETAIL MODAL */}
      <FileDetailModal
        isOpen={!!viewingFile}
        file={viewingFile}
        onClose={() => setViewingFile(null)}
      />
    </>
  );
};

export default MyFiles;