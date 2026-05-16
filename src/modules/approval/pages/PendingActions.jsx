// import React, { useState, useEffect } from 'react';
// import { approvalApi } from '../api/approvalApi';
// import ApprovalActionModal from '../components/ApprovalActionModal';

// const PendingActions = () => {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const fetchPending = async () => {
//     setLoading(true);
//     try {
//       const res = await approvalApi.getFiles();
//       setFiles(res.data.filter(f => f.status === 'submitted' || f.status === 'under_review' || f.status === 'resubmitted'));
//     } catch (err) { console.error(err); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => {
//     fetchPending();
//   }, []);

//   return (
//     <div style={{ padding: '2rem', color: 'white' }}>
//       <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Awaiting My Action</h2>
      
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//         {files.map(file => (
//           <div key={file._id} style={{ 
//             background: 'rgba(255,255,255,0.03)', 
//             padding: '1.5rem', 
//             borderRadius: '20px', 
//             border: '1px solid rgba(255,255,255,0.1)',
//             display: 'flex',
//             justify: 'space-between',
//             alignItems: 'center'
//           }}>
//             <div>
//               <div style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.4rem' }}>{file.title}</div>
//               <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
//                 From: {file.submittedBy?.name} • Dept: {file.departmentId?.name} • Current Level: {file.currentLevel}
//               </div>
//             </div>
//             <button 
//               onClick={async () => { 
//                 try {
//                   const historyRes = await approvalApi.getFileHistory(file._id);
//                   setSelectedFile({ ...file, history: historyRes.data }); 
//                   setIsModalOpen(true); 
//                 } catch (err) { console.error(err); }
//               }}
//               style={{ 
//                 background: '#10b981', color: 'white', border: 'none', padding: '0.6rem 1.2rem', 
//                 borderRadius: '10px', fontWeight: 700, cursor: 'pointer' 
//               }}
//             >Take Action</button>
//           </div>
//         ))}
//         {files.length === 0 && !loading && <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No pending files to approve.</div>}
//       </div>

//       <ApprovalActionModal 
//         isOpen={isModalOpen}
//         file={selectedFile}
//         onClose={() => setIsModalOpen(false)}
//         onActionSuccess={fetchPending}
//       />
//     </div>
//   );
// };

// export default PendingActions;


import React, { useState, useEffect } from 'react';
import { approvalApi } from '../api/approvalApi';
import ApprovalActionModal from '../components/ApprovalActionModal';

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes pa-fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pa-fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes pa-shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes pa-dot     { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
  @keyframes pa-pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.45)} 70%{box-shadow:0 0 0 10px rgba(16,185,129,0)} }
  @keyframes pa-spin    { to{transform:rotate(360deg)} }
  @keyframes pa-gradShift{ 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

  .pa-root * { box-sizing:border-box; margin:0; padding:0; }
  .pa-root {
    font-family:'DM Sans',sans-serif;
    color:var(--text-main);
    padding:2rem 0;
    position:relative;
  }

  /* ── Header ── */
  .pa-header {
    display:flex; justify-content:space-between; align-items:flex-end;
    margin-bottom:2rem;
    animation:pa-fadeUp .4s ease both;
  }
  .pa-eyebrow {
    font-size:.7rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase;
    color:var(--accent); margin-bottom:.3rem;
  }
  .pa-title {
    font-family:'Syne',sans-serif; font-size:1.7rem; font-weight:800; color:var(--text-main);
  }
  .pa-count-pill {
    background:var(--accent-glow); border:1px solid rgba(16,185,129,.3);
    color:var(--accent); font-size:.78rem; font-weight:700;
    padding:.3rem .75rem; border-radius:99px; letter-spacing:.03em;
    animation:pa-fadeIn .5s .2s both;
  }

  /* ── Filter bar ── */
  .pa-filters {
    display:flex; gap:.5rem; margin-bottom:1.5rem; flex-wrap:wrap;
    animation:pa-fadeUp .4s .05s ease both;
  }
  .pa-filter-btn {
    padding:.38rem .9rem; border-radius:8px; border:1px solid var(--border);
    background:var(--bg-card); color:var(--text-dim);
    font-family:'DM Sans',sans-serif; font-size:.78rem; font-weight:500;
    cursor:pointer; transition:all .18s;
  }
  .pa-filter-btn:hover { background:var(--border-light); color:var(--text-main); }
  .pa-filter-btn.active {
    background:var(--accent-glow); border-color:var(--accent);
    color:var(--accent); font-weight:600;
  }

  /* ── File cards ── */
  .pa-list { display:flex; flex-direction:column; gap:.9rem; }

  .pa-card {
    background:var(--bg-card);
    border:1px solid var(--border);
    border-radius:18px;
    padding:1.4rem 1.6rem;
    display:flex; align-items:center; gap:1.2rem;
    transition:transform .2s ease, border-color .2s ease, background .2s ease;
    animation:pa-fadeUp .4s ease both;
    position:relative; overflow:hidden;
  }
  .pa-card::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,.03) 0%,transparent 60%);
    pointer-events:none;
  }
  .pa-card:hover {
    transform:translateY(-2px);
    border-color:var(--accent);
    background:var(--border-light);
  }

  /* left accent line */
  .pa-card-bar {
    position:absolute; left:0; top:0; bottom:0; width:3px; border-radius:18px 0 0 18px;
  }

  /* ── File icon ── */
  .pa-file-icon {
    width:44px; height:44px; border-radius:12px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center; font-size:1.1rem;
  }

  /* ── Main info ── */
  .pa-card-info { flex:1; min-width:0; }
  .pa-card-title {
    font-family:'Syne',sans-serif; font-weight:700; font-size:1rem;
    color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    margin-bottom:.35rem;
  }
  .pa-card-meta {
    display:flex; gap:.9rem; flex-wrap:wrap; align-items:center;
  }
  .pa-meta-chip {
    display:flex; align-items:center; gap:.3rem;
    font-size:.76rem; color:var(--text-dim);
  }
  .pa-meta-chip svg { opacity:.6; }

  /* ── Status badges ── */
  .pa-badge {
    padding:.25rem .65rem; border-radius:6px;
    font-size:.7rem; font-weight:700; letter-spacing:.04em; text-transform:uppercase;
    flex-shrink:0;
  }
  .pa-badge-submitted    { background:rgba(99,102,241,.18); color:#818cf8; border:1px solid rgba(99,102,241,.3); }
  .pa-badge-under_review { background:rgba(245,158,11,.15); color:#fbbf24; border:1px solid rgba(245,158,11,.3); }
  .pa-badge-resubmitted  { background:rgba(6,182,212,.15);  color:#22d3ee; border:1px solid rgba(6,182,212,.3); }

  /* ── Level indicator ── */
  .pa-level {
    display:flex; flex-direction:column; align-items:center; gap:.25rem;
    flex-shrink:0; min-width:52px;
  }
  .pa-level-num {
    font-family:'Syne',sans-serif; font-size:1.3rem; font-weight:800;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    background-size:200%; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation:pa-gradShift 3s ease infinite;
  }
  .pa-level-label { font-size:.62rem; text-transform:uppercase; letter-spacing:.1em; color:#334155; }

  /* ── Action button ── */
  .pa-action-btn {
    display:flex; align-items:center; gap:.45rem;
    background:#10b981; color:#fff;
    border:none; padding:.6rem 1.2rem; border-radius:11px;
    font-family:'DM Sans',sans-serif; font-size:.83rem; font-weight:700;
    cursor:pointer; flex-shrink:0; white-space:nowrap;
    transition:all .2s ease;
    box-shadow:0 4px 16px rgba(16,185,129,.3);
  }
  .pa-action-btn:hover {
    background:#059669; transform:translateY(-2px);
    box-shadow:0 6px 22px rgba(16,185,129,.45);
    animation:pa-pulse 1.8s ease infinite;
  }
  .pa-action-btn:disabled {
    background:#1e3a30; color:#2d6a52; cursor:not-allowed;
    box-shadow:none; transform:none; animation:none;
  }
  .pa-action-btn .pa-spinner {
    width:13px; height:13px; border:2px solid rgba(255,255,255,.3);
    border-top-color:#fff; border-radius:50%; animation:pa-spin .6s linear infinite;
  }

  /* ── Empty state ── */
  .pa-empty {
    text-align:center; padding:4rem 2rem;
    background:var(--bg-card);
    border:1px dashed var(--border); border-radius:20px;
    animation:pa-fadeUp .4s ease both;
  }
  .pa-empty-icon { font-size:2.8rem; opacity:.35; margin-bottom:1rem; }
  .pa-empty-title { font-family:'Syne',sans-serif; font-size:1.1rem; font-weight:700; color:var(--text-dim); margin-bottom:.4rem; }
  .pa-empty-sub   { font-size:.85rem; color:var(--text-dim); }

  /* ── Skeleton ── */
  .pa-skel-card {
    background:var(--bg-card); border:1px solid var(--border);
    border-radius:18px; padding:1.4rem 1.6rem;
    display:flex; align-items:center; gap:1.2rem;
    animation:pa-fadeUp .4s ease both;
  }
  .pa-skel {
    background:linear-gradient(90deg,rgba(255,255,255,.04) 0px,rgba(255,255,255,.09) 100px,rgba(255,255,255,.04) 200px);
    background-size:600px 100%; animation:pa-shimmer 1.4s infinite linear; border-radius:6px;
  }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const STATUS_BAR = { submitted: '#6366f1', under_review: '#f59e0b', resubmitted: '#06b6d4' };
const STATUS_ICON_BG = { submitted: 'rgba(99,102,241,.15)', under_review: 'rgba(245,158,11,.12)', resubmitted: 'rgba(6,182,212,.12)' };

const FILTERS = ['all', 'submitted', 'under_review', 'resubmitted'];

const SkeletonCard = ({ delay }) => (
  <div className="pa-skel-card" style={{ animationDelay: delay }}>
    <div className="pa-skel" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
      <div className="pa-skel" style={{ height: 16, width: '55%' }} />
      <div className="pa-skel" style={{ height: 12, width: '75%' }} />
    </div>
    <div className="pa-skel" style={{ width: 90, height: 34, borderRadius: 11, flexShrink: 0 }} />
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────
const PendingActions = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await approvalApi.getFiles();
      setFiles(res.data.filter(f =>
        ['submitted', 'under_review', 'resubmitted'].includes(f.status)
      ));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleAction = async (file) => {
    setLoadingId(file._id);
    try {
      const historyRes = await approvalApi.getFileHistory(file._id);
      setSelectedFile({ ...file, history: historyRes.data });
      setIsModalOpen(true);
    } catch (err) { console.error(err); }
    finally { setLoadingId(null); }
  };

  const visible = filter === 'all' ? files : files.filter(f => f.status === filter);

  return (
    <div className="pa-root">
      {/* Header */}
      <div className="pa-header">
        <div>
          <div className="pa-eyebrow">Review Queue</div>
          <h2 className="pa-title">Awaiting My Action</h2>
        </div>
        {!loading && (
          <span className="pa-count-pill">
            {visible.length} {visible.length === 1 ? 'file' : 'files'} pending
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="pa-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`pa-filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            {f !== 'all' && (
              <span style={{ marginLeft: '.35rem', opacity: .7 }}>
                ({files.filter(x => x.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="pa-list">
        {loading
          ? [0, 1, 2].map(i => <SkeletonCard key={i} delay={`${i * 0.07}s`} />)
          : visible.length === 0
            ? (
              <div className="pa-empty">
                <div className="pa-empty-icon">✅</div>
                <div className="pa-empty-title">All caught up!</div>
                <div className="pa-empty-sub">No files are waiting for your approval right now.</div>
              </div>
            )
            : visible.map((file, i) => (
              <div
                className="pa-card"
                key={file._id}
                style={{ animationDelay: `${i * 0.055}s` }}
              >
                <div
                  className="pa-card-bar"
                  style={{ background: STATUS_BAR[file.status] || '#6366f1' }}
                />

                {/* Icon */}
                <div
                  className="pa-file-icon"
                  style={{ background: STATUS_ICON_BG[file.status] || 'rgba(99,102,241,.15)' }}
                >
                  <Icon
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6"
                    size={20}
                  />
                </div>

                {/* Info */}
                <div className="pa-card-info">
                  <div className="pa-card-title">{file.title}</div>
                  <div className="pa-card-meta">
                    {file.submittedBy?.name && (
                      <span className="pa-meta-chip">
                        <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                        {file.submittedBy.name}
                      </span>
                    )}
                    {file.departmentId?.name && (
                      <span className="pa-meta-chip">
                        <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        {file.departmentId.name}
                      </span>
                    )}
                    <span className={`pa-badge pa-badge-${file.status}`}>
                      {file.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Level */}
                <div className="pa-level">
                  <span className="pa-level-num">{file.currentLevel}</span>
                  <span className="pa-level-label">Level</span>
                </div>

                {/* CTA */}
                <button
                  className="pa-action-btn"
                  onClick={() => handleAction(file)}
                  disabled={loadingId === file._id}
                >
                  {loadingId === file._id
                    ? <><span className="pa-spinner" /> Loading</>
                    : <><Icon d="M9 12l2 2 4-4 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={15} /> Take Action</>
                  }
                </button>
              </div>
            ))
        }
      </div>

      <ApprovalActionModal
        isOpen={isModalOpen}
        file={selectedFile}
        onClose={() => setIsModalOpen(false)}
        onActionSuccess={fetchPending}
      />
    </div>
  );
};

export default PendingActions;