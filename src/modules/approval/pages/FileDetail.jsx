// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { approvalApi } from '../api/approvalApi';

// const FileDetail = () => {
//   const { id } = useParams();
//   const [file, setFile] = useState(null);

//   useEffect(() => {
//     approvalApi.getFileDetail(id).then(res => setFile(res.data)).catch(console.error);
//   }, [id]);

//   if (!file) return <div style={{ padding: '2rem', color: '#94a3b8' }}>Loading file details...</div>;

//   return (
//     <div style={{ padding: '2rem', color: 'white' }}>
//       <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
//         <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{file.title}</h2>
//         <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
//           <span style={{ padding: '0.3rem 0.7rem', background: '#6366f133', color: '#818cf8', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>{file.status.toUpperCase()}</span>
//           <span style={{ padding: '0.3rem 0.7rem', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', borderRadius: '8px', fontSize: '0.8rem' }}>Level {file.currentLevel} of {file.totalLevels}</span>
//         </div>

//         <div style={{ marginBottom: '2rem' }}>
//           <h4 style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Description</h4>
//           <p style={{ lineHeight: 1.6, color: '#e2e8f0' }}>{file.description || 'No description provided.'}</p>
//         </div>

//         <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem' }}>
//           <h4 style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Approval History</h4>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//              <div style={{ padding: '1rem', borderLeft: '2px solid #6366f1', background: 'rgba(99,102,241,0.05)', borderRadius: '0 12px 12px 0' }}>
//                <div style={{ fontWeight: 600 }}>File Submitted</div>
//                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>by {file.submittedBy?.name} on {new Date(file.createdAt).toLocaleString()}</div>
//              </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileDetail;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { approvalApi } from '../api/approvalApi';

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes fd-fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fd-fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes fd-gradShift{ 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes fd-pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes fd-shimmer  { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes fd-dot      { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
  @keyframes fd-drawLine { from{height:0} to{height:100%} }

  .fd-root * { box-sizing:border-box; margin:0; padding:0; }

  .fd-root {
    font-family: 'DM Sans', sans-serif;
    background: #08090d;
    min-height: 100vh;
    color: #e2e8f0;
    padding: 2.5rem 3rem;
    position: relative;
    overflow: hidden;
  }
  .fd-root::before {
    display: none;
  }
  .fd-orb {
    display: none;
  }

  .fd-inner { position:relative; z-index:1; max-width:900px; }

  /* ── Back button ── */
  .fd-back {
    display:inline-flex; align-items:center; gap:.45rem;
    background:transparent; border:1px solid rgba(255,255,255,0.08);
    color:#64748b; font-family:'DM Sans',sans-serif; font-size:.82rem; font-weight:500;
    padding:.45rem .9rem; border-radius:10px; cursor:pointer;
    transition:all .2s; margin-bottom:2rem;
    animation:fd-fadeIn .4s ease both;
  }
  .fd-back:hover { background:rgba(255,255,255,.05); color:#cbd5e1; border-color:rgba(255,255,255,.15); }

  /* ── Hero card ── */
  .fd-hero {
    background:rgba(255,255,255,.03);
    border:1px solid rgba(255,255,255,.07);
    border-radius:24px;
    padding:2.5rem;
    margin-bottom:1.5rem;
    position:relative; overflow:hidden;
    animation:fd-fadeUp .45s ease both;
  }
  .fd-hero::after {
    content:'';
    position:absolute; inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,.04) 0%,transparent 55%);
    pointer-events:none;
  }
  .fd-hero-accent {
    position:absolute; top:0;left:0;right:0; height:3px;
    background:linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4);
    border-radius:24px 24px 0 0;
  }

  .fd-eyebrow {
    font-size:.7rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase;
    color:#6366f1; margin-bottom:.4rem;
  }
  .fd-title {
    font-family:'Syne',sans-serif; font-size:1.9rem; font-weight:800;
    color:#f8fafc; line-height:1.15; margin-bottom:1.2rem;
  }

  /* ── Badge row ── */
  .fd-badges { display:flex; gap:.6rem; flex-wrap:wrap; margin-bottom:2rem; }
  .fd-badge {
    padding:.3rem .85rem; border-radius:8px; font-size:.75rem; font-weight:600;
    letter-spacing:.03em; text-transform:uppercase;
  }
  .fd-badge-status-submitted    { background:rgba(99,102,241,.18); color:#818cf8; border:1px solid rgba(99,102,241,.3); }
  .fd-badge-status-in_review { background:rgba(245,158,11,.15); color:#fbbf24; border:1px solid rgba(245,158,11,.3); }
  .fd-badge-status-approved     { background:rgba(16,185,129,.15); color:#34d399; border:1px solid rgba(16,185,129,.3); }
  .fd-badge-status-rejected     { background:rgba(239,68,68,.15);  color:#f87171; border:1px solid rgba(239,68,68,.3); }
  .fd-badge-level {
    background:rgba(255,255,255,.06); color:#94a3b8; border:1px solid rgba(255,255,255,.1);
  }

  /* ── Two-col meta ── */
  .fd-meta {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:1.2rem;
    margin-bottom:2rem;
  }
  .fd-meta-item {}
  .fd-meta-label {
    font-size:.72rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase;
    color:#475569; margin-bottom:.3rem;
  }
  .fd-meta-value { font-size:.92rem; color:#e2e8f0; font-weight:500; }

  /* ── Description ── */
  .fd-desc-label {
    font-size:.72rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase;
    color:#475569; margin-bottom:.5rem;
  }
  .fd-desc-text { font-size:.95rem; line-height:1.75; color:#cbd5e1; }

  /* ── Divider ── */
  .fd-divider { border:none; border-top:1px solid rgba(255,255,255,.07); margin:2rem 0; }

  /* ── Progress bar ── */
  .fd-progress-section { margin-bottom:2rem; }
  .fd-progress-header { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:.7rem; }
  .fd-progress-title {
    font-family:'Syne',sans-serif; font-size:.85rem; font-weight:700;
    text-transform:uppercase; letter-spacing:.06em; color:#94a3b8;
  }
  .fd-progress-pct { font-size:.8rem; color:#6366f1; font-weight:600; }
  .fd-progress-track {
    height:6px; background:rgba(255,255,255,.06); border-radius:99px; overflow:hidden;
  }
  .fd-progress-fill {
    height:100%;
    background:linear-gradient(90deg,#6366f1,#8b5cf6);
    border-radius:99px;
    transition:width .8s cubic-bezier(.34,1.56,.64,1);
  }
  .fd-progress-steps { display:flex; justify-content:space-between; margin-top:.6rem; }
  .fd-progress-step {
    font-size:.7rem; color:#334155; font-weight:500;
    flex:1; text-align:center;
  }
  .fd-progress-step.done  { color:#6366f1; }
  .fd-progress-step.active{ color:#a5b4fc; font-weight:700; }

  /* ── History timeline ── */
  .fd-history-card {
    background:rgba(255,255,255,.02);
    border:1px solid rgba(255,255,255,.06);
    border-radius:20px; padding:2rem;
    animation:fd-fadeUp .45s .1s ease both;
  }
  .fd-history-title {
    font-family:'Syne',sans-serif; font-size:.85rem; font-weight:700;
    text-transform:uppercase; letter-spacing:.06em; color:#94a3b8;
    margin-bottom:1.5rem;
  }

  .fd-timeline { position:relative; padding-left:1.8rem; }
  .fd-timeline::before {
    content:''; position:absolute; left:7px; top:8px;
    width:2px; background:rgba(255,255,255,.06);
    animation:fd-drawLine .6s .3s ease both;
    height: calc(100% - 16px);
  }

  .fd-tl-item {
    position:relative; margin-bottom:1.4rem;
    animation:fd-fadeUp .4s ease both;
  }
  .fd-tl-item:last-child { margin-bottom:0; }

  .fd-tl-dot {
    position:absolute; left:-1.8rem; top:5px;
    width:14px; height:14px; border-radius:50%;
    border:2px solid; display:flex; align-items:center; justify-content:center;
  }
  .fd-tl-dot svg { width:7px; height:7px; }

  .fd-tl-dot-submitted    { background:#1e1b4b; border-color:#6366f1; }
  .fd-tl-dot-review       { background:#1c1a09; border-color:#f59e0b; }
  .fd-tl-dot-approved     { background:#022c22; border-color:#10b981; }
  .fd-tl-dot-rejected     { background:#2a0a0a; border-color:#ef4444; }
  .fd-tl-dot-pending      { background:#111; border-color:#334155; }

  .fd-tl-event { font-size:.9rem; font-weight:600; color:#e2e8f0; margin-bottom:.2rem; }
  .fd-tl-meta  { font-size:.78rem; color:#475569; }
  .fd-tl-note  {
    margin-top:.5rem; padding:.6rem .9rem;
    background:rgba(255,255,255,.04); border-radius:8px;
    font-size:.82rem; color:#94a3b8; font-style:italic;
  }

  /* ── Loading state ── */
  .fd-loading-wrap {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    min-height:60vh; gap:1rem;
  }
  .fd-loading-dots { display:flex; gap:.4rem; }
  .fd-loading-dots span {
    width:8px; height:8px; border-radius:50%; background:#6366f1;
    animation:fd-dot 1.4s ease infinite both;
  }
  .fd-loading-dots span:nth-child(2){ animation-delay:.16s; }
  .fd-loading-dots span:nth-child(3){ animation-delay:.32s; }
  .fd-loading-text { font-size:.85rem; color:#334155; letter-spacing:.05em; }

  /* ── Shimmer blocks ── */
  .fd-shimmer {
    background:linear-gradient(90deg,rgba(255,255,255,.04) 0px,rgba(255,255,255,.09) 100px,rgba(255,255,255,.04) 200px);
    background-size:600px 100%; animation:fd-shimmer 1.4s infinite linear; border-radius:8px;
  }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const STATUS_DOT = {
  submitted:    'fd-tl-dot-submitted',
  in_review: 'fd-tl-dot-review',
  approved:     'fd-tl-dot-approved',
  rejected:     'fd-tl-dot-rejected',
};
const STATUS_BADGE = s => `fd-badge fd-badge-status-${s}`;
const fmt = d => new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
const pct = (cur, tot) => tot ? Math.round((cur / tot) * 100) : 0;

// ── Component ─────────────────────────────────────────────────────────────────
const FileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    approvalApi.getFileDetail(id)
      .then(res => setFile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="fd-root">
      <div className="fd-inner">
        <div className="fd-loading-wrap">
          <div className="fd-loading-dots"><span/><span/><span/></div>
          <div className="fd-loading-text">LOADING FILE DETAILS</div>
        </div>
      </div>
    </div>
  );

  if (!file) return null;

  const isWorkflow = file.useWorkflow && file.stages && file.stages.length > 0;
  const currentLevelIndex = isWorkflow ? file.currentStageIndex : (file.currentLevel - 1);
  const totalLevelsCount = isWorkflow ? file.stages.length : file.totalLevels;
  const progress = file.status === 'approved' ? 100 : pct(currentLevelIndex, totalLevelsCount);
  const history = file.approvalHistory || [];

  return (
    <div className="fd-root">
      <div className="fd-inner">

        {/* Back */}
        <button className="fd-back" onClick={() => navigate(-1)}>
          <Icon d="M19 12H5 M12 5l-7 7 7 7" size={13} /> Back
        </button>

        {/* Hero card */}
        <div className="fd-hero">
          <div className="fd-hero-accent" />
          <div className="fd-eyebrow">File Record · #{id}</div>
          <h2 className="fd-title">{file.title}</h2>

          <div className="fd-badges">
            <span className={STATUS_BADGE(file.status)}>{file.status.replace('_', ' ')}</span>
            <span className="fd-badge fd-badge-level">
              {isWorkflow 
                ? `Stage ${currentLevelIndex + 1} / ${totalLevelsCount}` 
                : `Level ${file.currentLevel} / ${file.totalLevels}`}
            </span>
            {file.department && (
              <span className="fd-badge fd-badge-level">{file.department}</span>
            )}
          </div>

          {/* Meta grid */}
          <div className="fd-meta">
            {[
              { label: 'Submitted By', value: file.submittedBy?.name || '—' },
              { label: 'Date Submitted', value: fmt(file.createdAt) },
              { label: 'Last Updated', value: file.updatedAt ? fmt(file.updatedAt) : '—' },
              { label: 'File Type', value: file.fileType || '—' },
            ].map(m => (
              <div className="fd-meta-item" key={m.label}>
                <div className="fd-meta-label">{m.label}</div>
                <div className="fd-meta-value">{m.value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="fd-desc-label">Description</div>
          <p className="fd-desc-text">{file.description || 'No description provided.'}</p>

          <hr className="fd-divider" />

          {/* Progress */}
          <div className="fd-progress-section">
            <div className="fd-progress-header">
              <span className="fd-progress-title">Approval Progress</span>
              <span className="fd-progress-pct">{progress}%</span>
            </div>
            <div className="fd-progress-track">
              <div className="fd-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="fd-progress-steps">
              {isWorkflow 
                ? file.stages.map((stage, i) => {
                    const cls = i < file.currentStageIndex ? 'done'
                              : i === file.currentStageIndex ? 'active' : '';
                    return (
                      <div key={i} className={`fd-progress-step ${cls}`} title={stage.name} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', padding: '0 4px' }}>
                        {stage.name}
                      </div>
                    );
                  })
                : Array.from({ length: file.totalLevels }, (_, i) => {
                    const step = i + 1;
                    const cls = step < file.currentLevel ? 'done'
                              : step === file.currentLevel ? 'active' : '';
                    return (
                      <div key={step} className={`fd-progress-step ${cls}`}>
                        L{step}
                      </div>
                    );
                  })
              }
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="fd-history-card">
          <div className="fd-history-title">Approval History</div>
          <div className="fd-timeline">

            {/* Always show submission */}
            <div className="fd-tl-item" style={{ animationDelay: '0.05s' }}>
              <div className={`fd-tl-dot fd-tl-dot-submitted`}>
                <Icon d="M5 12l5 5L20 7" />
              </div>
              <div className="fd-tl-event">File Submitted</div>
              <div className="fd-tl-meta">
                by <strong style={{ color: '#94a3b8' }}>{file.submittedBy?.name}</strong>
                {' · '}{fmt(file.createdAt)}
              </div>
            </div>

            {/* Dynamic history entries */}
            {history.map((entry, i) => (
              <div className="fd-tl-item" key={i} style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
                <div className={`fd-tl-dot ${STATUS_DOT[entry.action] || 'fd-tl-dot-pending'}`}>
                  <Icon d={entry.action === 'approved' ? "M5 12l5 5L20 7" : entry.action === 'rejected' ? "M18 6L6 18M6 6l12 12" : "M12 6v6l4 2"} />
                </div>
                <div className="fd-tl-event">
                  {entry.action === 'approved' ? 'Approved' :
                   entry.action === 'rejected' ? 'Rejected' :
                   entry.action === 'in_review' ? 'Moved to Review' : entry.action}
                  {entry.level && <span style={{ color:'#475569', fontWeight:400 }}> — Level {entry.level}</span>}
                </div>
                <div className="fd-tl-meta">
                  by <strong style={{ color:'#94a3b8' }}>{entry.approver?.name || 'Unknown'}</strong>
                  {' · '}{fmt(entry.timestamp || entry.createdAt)}
                </div>
                {entry.comment && <div className="fd-tl-note">"{entry.comment}"</div>}
              </div>
            ))}

            {/* Future steps placeholder */}
            {((isWorkflow && file.currentStageIndex < file.stages.length) || (!isWorkflow && file.currentLevel < file.totalLevels)) && file.status !== 'rejected' && file.status !== 'approved' && (
              <div className="fd-tl-item" style={{ animationDelay: `${0.1 + history.length * 0.06}s` }}>
                <div className="fd-tl-dot fd-tl-dot-pending" style={{ animation: 'fd-pulse 2s ease infinite' }}>
                  <Icon d="M12 6v6l4 2" />
                </div>
                <div className="fd-tl-event" style={{ color:'#334155' }}>
                  Awaiting {isWorkflow ? file.stages[file.currentStageIndex]?.name : `Level ${file.currentLevel}`} Review
                </div>
                <div className="fd-tl-meta">Pending approver action</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FileDetail;