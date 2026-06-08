import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { exportToCSV } from '../utils/exportUtils';
import { API_BASE_URL } from '../config';

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  @keyframes tl-fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes tl-fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes tl-shimmer   { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes tl-spin      { to{transform:rotate(360deg)} }
  @keyframes tl-modalIn   { from{opacity:0;transform:translateY(18px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes tl-overlayIn { from{opacity:0} to{opacity:1} }
  @keyframes tl-gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes tl-pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }

  .tl-root * { box-sizing:border-box; margin:0; padding:0; }
  .tl-root { font-family:'DM Sans',sans-serif; color:#e2e8f0; padding:2rem 0; }

  /* ── Header ── */
  .tl-header {
    display:flex; justify-content:space-between; align-items:flex-end;
    margin-bottom:1.8rem; animation:tl-fadeUp .4s ease both;
  }
  .tl-eyebrow { font-size:.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#06b6d4;margin-bottom:.3rem; }
  .tl-title   { font-family:'Syne',sans-serif;font-size:1.7rem;font-weight:800;color:#f8fafc; }

  .tl-raise-btn {
    display:flex;align-items:center;gap:.45rem;
    padding:.6rem 1.2rem;border-radius:12px;border:none;cursor:pointer;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);background-size:200%;
    color:#fff;font-family:'DM Sans',sans-serif;font-size:.84rem;font-weight:600;
    box-shadow:0 4px 18px rgba(99,102,241,.4);transition:all .2s;
    animation:tl-gradShift 5s ease infinite;
  }
  .tl-raise-btn:hover { transform:translateY(-2px);box-shadow:0 6px 24px rgba(99,102,241,.55); }

  /* ── Toolbar ── */
  .tl-toolbar {
    display:flex;gap:.85rem;margin-bottom:2rem;flex-wrap:wrap;align-items:center;
    animation:tl-fadeUp .4s .05s ease both;
  }

  /* view tabs */
  .tl-tabs {
    display:flex;gap:.25rem;
    background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);
    padding:.3rem;border-radius:13px;
  }
  .tl-tab {
    padding:.46rem 1.05rem;border-radius:9px;cursor:pointer;
    font-size:.8rem;font-weight:500;color:#475569;
    transition:all .2s;white-space:nowrap;user-select:none;
  }
  .tl-tab:hover { color:#94a3b8;background:rgba(255,255,255,.04); }
  .tl-tab.active {
    background:#6366f1;color:#fff;
    box-shadow:0 3px 12px rgba(99,102,241,.4);
    font-weight:600;
  }

  /* filter select */
  .tl-filter-wrap { position:relative; }
  .tl-filter-wrap::after {
    content:'';position:absolute;right:.85rem;top:50%;transform:translateY(-50%);
    border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #334155;
    pointer-events:none;
  }
  .tl-filter {
    appearance:none;padding:.6rem 2rem .6rem 1rem;
    background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
    border-radius:11px;color:#94a3b8;font-family:'DM Sans',sans-serif;font-size:.82rem;
    outline:none;cursor:pointer;transition:border-color .2s;
  }
  .tl-filter:focus { border-color:#6366f1; }
  .tl-filter option { background:#0f172a; }

  .tl-count { font-size:.74rem;color:#334155;font-family:'DM Mono',monospace;white-space:nowrap; }

  /* ── Grid ── */
  .tl-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:1.2rem; }

  /* ── Ticket card ── */
  .tl-card {
    background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);
    border-radius:20px;padding:1.5rem;
    position:relative;overflow:hidden;
    display:flex;flex-direction:column;
    transition:transform .22s,border-color .22s;
    animation:tl-fadeUp .4s ease both;
  }
  .tl-card:hover { transform:translateY(-3px);border-color:rgba(255,255,255,.12); }
  .tl-card::after {
    content:'';position:absolute;inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,.025) 0%,transparent 60%);
    pointer-events:none;
  }
  .tl-card-accent { position:absolute;top:0;left:0;right:0;height:2.5px;border-radius:20px 20px 0 0; }

  /* card header */
  .tl-card-head { display:flex;justify-content:space-between;align-items:flex-start;gap:.7rem;margin-bottom:.9rem; }

  /* badges */
  .tl-badge {
    display:inline-flex;align-items:center;gap:.35rem;
    padding:.24rem .65rem;border-radius:7px;
    font-size:.68rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
    white-space:nowrap;
  }
  .tl-badge-dot { width:5px;height:5px;border-radius:50%;animation:tl-pulse 2.2s ease infinite; }

  /* title & desc */
  .tl-card-title { font-family:'Syne',sans-serif;font-size:.98rem;font-weight:700;color:#f1f5f9;margin-bottom:.5rem;line-height:1.3; }
  .tl-card-desc  { font-size:.8rem;color:#475569;line-height:1.65;flex-grow:1;margin-bottom:1rem; }

  /* meta chips */
  .tl-meta { display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.1rem; }
  .tl-meta-chip {
    display:inline-flex;align-items:center;gap:.3rem;
    padding:.2rem .6rem;border-radius:6px;
    font-size:.7rem;font-weight:600;
    background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);color:#475569;
  }
  .tl-meta-chip a { color:inherit;text-decoration:none; }
  .tl-meta-chip.attach { color:#10b981;border-color:rgba(16,185,129,.25);background:rgba(16,185,129,.07); }
  .tl-meta-chip.vehicle { color:#fbbf24;border-color:rgba(245,158,11,.25);background:rgba(245,158,11,.07); }
  .tl-meta-chip.cat     { color:#818cf8;border-color:rgba(99,102,241,.25);background:rgba(99,102,241,.07); }

  /* card footer */
  .tl-card-footer {
    display:flex;justify-content:space-between;align-items:center;
    padding-top:1rem;border-top:1px solid rgba(255,255,255,.05);
  }
  .tl-by { display:flex;flex-direction:column;gap:.18rem; }
  .tl-by-row { font-size:.73rem;color:#334155;display:flex;align-items:center;gap:.35rem; }
  .tl-by-val { color:#475569;font-weight:500; }

  .tl-manage-btn {
    display:flex;align-items:center;gap:.35rem;
    padding:.46rem .9rem;border-radius:9px;cursor:pointer;
    border:1px solid rgba(99,102,241,.25);background:rgba(99,102,241,.09);
    color:#818cf8;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:600;
    transition:all .18s;
  }
  .tl-manage-btn:hover { background:rgba(99,102,241,.18);border-color:rgba(99,102,241,.45); }

  /* ── Empty ── */
  .tl-empty {
    grid-column:1/-1;text-align:center;padding:4rem 2rem;
    background:rgba(255,255,255,.02);border:1px dashed rgba(255,255,255,.07);border-radius:20px;
    animation:tl-fadeUp .4s ease both;
  }
  .tl-empty-icon  { font-size:2.4rem;opacity:.3;margin-bottom:.8rem; }
  .tl-empty-title { font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:#334155;margin-bottom:.35rem; }
  .tl-empty-sub   { font-size:.82rem;color:#1e293b; }

  /* ── Skeleton ── */
  .tl-skel { background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:20px;padding:1.5rem;animation:tl-fadeUp .4s ease both; }
  .tl-skel-line { background:linear-gradient(90deg,rgba(255,255,255,.04) 0px,rgba(255,255,255,.09) 100px,rgba(255,255,255,.04) 200px);background-size:600px 100%;animation:tl-shimmer 1.4s infinite linear;border-radius:6px; }

  /* ── OVERLAY ── */
  .tl-overlay {
    position:fixed;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(8px);
    display:flex;align-items:center;justify-content:center;z-index:1000;padding:1rem;
    animation:tl-overlayIn .2s ease both;
  }

  /* ── MODAL ── */
  .tl-modal {
    background:#0d1117;border:1px solid rgba(255,255,255,.09);
    border-radius:24px;width:100%;max-width:500px;
    max-height:90vh;overflow-y:auto;
    box-shadow:0 30px 70px rgba(0,0,0,.6);position:relative;
    animation:tl-modalIn .3s cubic-bezier(.22,1,.36,1) both;
  }
  .tl-modal::-webkit-scrollbar { width:4px; }
  .tl-modal::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08);border-radius:4px; }
  .tl-modal-accent { position:absolute;top:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4);border-radius:24px 24px 0 0; }

  .tl-modal-header {
    display:flex;justify-content:space-between;align-items:center;
    padding:1.8rem 2rem 0;margin-bottom:1.5rem;
  }
  .tl-modal-title { font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#f8fafc; }
  .tl-modal-close {
    width:30px;height:30px;border-radius:8px;border:1px solid rgba(255,255,255,.09);
    background:rgba(255,255,255,.04);color:#64748b;cursor:pointer;
    display:flex;align-items:center;justify-content:center;transition:all .18s;
  }
  .tl-modal-close:hover { background:rgba(255,255,255,.08);color:#94a3b8; }
  .tl-modal-body { padding:0 2rem 2rem; }

  /* form */
  .tl-2col { display:grid;grid-template-columns:1fr 1fr;gap:1rem; }
  .tl-field { margin-bottom:1.1rem; }
  .tl-label {
    display:block;font-size:.7rem;font-weight:600;letter-spacing:.1em;
    text-transform:uppercase;color:#334155;margin-bottom:.42rem;
  }
  .tl-input,.tl-select,.tl-textarea {
    width:100%;padding:.78rem 1rem;
    background:#0a0e1a;border:1px solid rgba(255,255,255,.08);
    border-radius:11px;color:#e2e8f0;
    font-family:'DM Sans',sans-serif;font-size:.88rem;outline:none;
    transition:border-color .2s,box-shadow .2s;appearance:none;
  }
  .tl-input:focus,.tl-select:focus,.tl-textarea:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12); }
  .tl-input::placeholder,.tl-textarea::placeholder { color:#1e293b; }
  .tl-textarea { min-height:90px;resize:vertical;line-height:1.6; }
  .tl-select option { background:#0a0e1a; }
  .tl-select-wrap { position:relative; }
  .tl-select-wrap::after {
    content:'';position:absolute;right:.9rem;top:50%;transform:translateY(-50%);
    border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #334155;
    pointer-events:none;
  }

  /* file dropzone */
  .tl-file-zone {
    border:2px dashed rgba(255,255,255,.09);border-radius:12px;padding:1.2rem;
    text-align:center;cursor:pointer;transition:all .2s;background:rgba(255,255,255,.02);
    position:relative;
  }
  .tl-file-zone:hover { border-color:rgba(99,102,241,.3);background:rgba(99,102,241,.04); }
  .tl-file-zone.has-file { border-color:rgba(16,185,129,.35);background:rgba(16,185,129,.05); }
  .tl-file-zone input { position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%; }
  .tl-file-name { font-size:.8rem;color:#34d399;font-weight:600; }
  .tl-file-hint { font-size:.76rem;color:#334155; }

  /* modal footer */
  .tl-modal-footer { display:flex;gap:.8rem;margin-top:1.4rem; }
  .tl-cancel-btn {
    flex:1;padding:.75rem;border-radius:11px;border:1px solid rgba(255,255,255,.09);
    background:rgba(255,255,255,.04);color:#64748b;
    font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:500;cursor:pointer;transition:all .18s;
  }
  .tl-cancel-btn:hover { background:rgba(255,255,255,.08);color:#94a3b8; }
  .tl-save-btn {
    flex:1;padding:.75rem;border-radius:11px;border:none;cursor:pointer;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);background-size:200%;
    color:#fff;font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;
    box-shadow:0 4px 18px rgba(99,102,241,.38);transition:all .2s;
    display:flex;align-items:center;justify-content:center;gap:.5rem;
    animation:tl-gradShift 5s ease infinite;
  }
  .tl-save-btn:hover { transform:translateY(-2px);box-shadow:0 6px 24px rgba(99,102,241,.5); }
  .tl-save-btn:disabled { opacity:.55;cursor:not-allowed;transform:none; }
  .tl-spinner { width:15px;height:15px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:tl-spin .65s linear infinite; }

  /* manage modal ticket preview */
  .tl-preview {
    background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);
    border-radius:13px;padding:1rem 1.2rem;margin-bottom:1.2rem;
  }
  .tl-preview-title { font-family:'Syne',sans-serif;font-size:.92rem;font-weight:700;color:#f1f5f9;margin-bottom:.4rem; }
  .tl-preview-badges { display:flex;gap:.5rem;flex-wrap:wrap; }

  /* New Wide Manage layout */
  .tl-modal.manage-wide { max-width: 880px; }
  .tl-manage-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
  @media(min-width: 768px) {
    .tl-manage-grid { grid-template-columns: 1fr 1fr; }
  }
  .tl-manage-col-left { display: flex; flex-direction: column; gap: 1rem; }
  .tl-manage-col-right {
    display: flex; flex-direction: column;
    border-left: 1px solid rgba(255,255,255,0.07);
    padding-left: 1.5rem;
    min-height: 380px;
  }
  @media(max-width: 767px) {
    .tl-manage-col-right { border-left: none; padding-left: 0; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 1.5rem; }
  }
  .tl-modal-tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: 1rem; }
  .tl-modal-tab-btn {
    padding: 0.5rem 1rem; background: none; border: none; color: #64748b; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; border-bottom: 2px solid transparent; font-size: 0.8rem;
  }
  .tl-modal-tab-btn:hover { color: #cbd5e1; }
  .tl-modal-tab-btn.active { color: #6366f1; border-bottom-color: #6366f1; }
  
  .tl-comments-list { display: flex; flex-direction: column; gap: 0.8rem; max-height: 250px; overflow-y: auto; margin-bottom: 1rem; padding-right: 0.5rem; }
  .tl-comments-list::-webkit-scrollbar { width: 3px; }
  .tl-comments-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 3px; }
  .tl-comment-item { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 0.7rem; border-radius: 10px; }
  .tl-comment-meta { display: flex; justify-content: space-between; font-size: 0.68rem; color: #64748b; margin-bottom: 0.25rem; font-family: 'DM Mono', monospace; }
  .tl-comment-text { font-size: 0.8rem; color: #cbd5e1; line-height: 1.4; }
  
  .tl-comment-form { display: flex; flex-direction: column; gap: 0.6rem; }
  .tl-comment-input-row { display: flex; gap: 0.5rem; }
  .tl-comment-file-zone { border: 1px dashed rgba(255,255,255,0.08); padding: 0.4rem; border-radius: 8px; font-size: 0.75rem; text-align: center; color: #64748b; cursor: pointer; position: relative; }
  .tl-comment-file-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  
  .tl-activities-list { display: flex; flex-direction: column; gap: 0.8rem; max-height: 350px; overflow-y: auto; padding-right: 0.5rem; }
  .tl-activities-list::-webkit-scrollbar { width: 3px; }
  .tl-activities-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 3px; }
  .tl-activity-item { display: flex; gap: 0.6rem; font-size: 0.78rem; position: relative; padding-bottom: 0.5rem; }
  .tl-activity-item::before { content: ''; position: absolute; left: 7px; top: 18px; bottom: 0; width: 1px; background: rgba(255,255,255,0.05); }
  .tl-activity-item:last-child::before { display: none; }
  .tl-activity-dot { width: 15px; height: 15px; border-radius: 50%; background: #6366f1; border: 3px solid #0d1117; flex-shrink: 0; }
  .tl-activity-info { display: flex; flex-direction: column; }
  .tl-activity-action { font-weight: 600; color: #f8fafc; }
  .tl-activity-remarks { font-size: 0.72rem; color: #64748b; margin-top: 0.15rem; }
  .tl-activity-meta { font-size: 0.65rem; color: #475569; margin-top: 0.1rem; font-family: 'DM Mono', monospace; }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const PRIORITY_CFG = {
  High:   { bg:'rgba(239,68,68,.12)',   border:'rgba(239,68,68,.28)',   text:'#fca5a5', dot:'#ef4444',  bar:'#ef4444'  },
  Medium: { bg:'rgba(245,158,11,.12)',  border:'rgba(245,158,11,.28)',  text:'#fcd34d', dot:'#f59e0b',  bar:'#f59e0b'  },
  Low:    { bg:'rgba(16,185,129,.12)',  border:'rgba(16,185,129,.28)',  text:'#6ee7b7', dot:'#10b981',  bar:'#10b981'  },
};

const STATUS_CFG = {
  'Open':               { bg:'rgba(239,68,68,.1)',    border:'rgba(239,68,68,.28)',   text:'#fca5a5', dot:'#ef4444'  },
  'In Progress':        { bg:'rgba(99,102,241,.1)',   border:'rgba(99,102,241,.28)',  text:'#a5b4fc', dot:'#6366f1'  },
  'Pending Approval':   { bg:'rgba(245,158,11,.1)',   border:'rgba(245,158,11,.28)',  text:'#fcd34d', dot:'#f59e0b'  },
  'Done':               { bg:'rgba(16,185,129,.1)',   border:'rgba(16,185,129,.28)',  text:'#6ee7b7', dot:'#10b981'  },
  'Closed':             { bg:'rgba(100,116,139,.1)',  border:'rgba(100,116,139,.28)', text:'#94a3b8', dot:'#64748b'  },
  'Not Possible':       { bg:'rgba(239,68,68,.15)',   border:'rgba(239,68,68,.3)',    text:'#f87171', dot:'#dc2626'  },
  'Need Clarification': { bg:'rgba(168,85,247,.1)',   border:'rgba(168,85,247,.28)',  text:'#d8b4fe', dot:'#a855f7'  },
};

const CAT_ICONS = {
  IT:         <Ico d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" size={12} />,
  Stationary: <Ico d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" size={12} />,
  Vehicle:    <Ico d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v5a2 2 0 0 1-2 2h-3" size={12} />,
  Other:      <Ico d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4 M12 16h.01" size={12} />,
};

// ── Component ─────────────────────────────────────────────────────────────────
// ── Component ─────────────────────────────────────────────────────────────────
const TicketsList = ({ role, onTicketCreated }) => {
  const [tickets, setTickets]               = useState([]);
  const [users, setUsers]                   = useState([]);
  const [departments, setDepartments]       = useState([]);
  const [vehicles, setVehicles]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [isRaiseOpen, setIsRaiseOpen]       = useState(false);
  const [isManageOpen, setIsManageOpen]     = useState(false);
  const [currentTicket, setCurrentTicket]   = useState(null);
  const [filterStatus, setFilterStatus]     = useState('All');
  const [ticketView, setTicketView]         = useState('Raised');
  const [saving, setSaving]                 = useState(false);
  const [attachFile, setAttachFile]         = useState(null);

  // Comments and activities states
  const [comments, setComments]             = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentFile, setCommentFile]       = useState(null);
  const [activities, setActivities]         = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [modalTab, setModalTab]             = useState('comments'); // 'comments' | 'activity'

  const [raiseForm, setRaiseForm] = useState({ title:'', description:'', priority:'Medium', category:'IT', vehicleId:'' });
  const [manageForm, setManageForm] = useState({ assignedTo:'', assignedDepartment:'', status:'', remarks:'' });

  const fileRef = useRef();
  const commentFileRef = useRef();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isOpsAdmin  = (currentUser.role === 'Admin' || currentUser.role === 'Company Admin') && currentUser.department?.name?.toLowerCase().includes('operations');
  const isSuperAdmin = currentUser.role === 'Super Admin';
  const isAdminOrOps = isSuperAdmin || isOpsAdmin;

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => {
    fetchTickets();
    if (isAdminOrOps) {
      fetchUsers();
      fetchDepartments();
    }
    fetchVehicles();
  }, [role]);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/tickets`, { headers:{ Authorization:`Bearer ${token}` } });
      setTickets(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/users`, { headers:{ Authorization:`Bearer ${token}` } });
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/departments`, { headers:{ Authorization:`Bearer ${token}` } });
      setDepartments(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/vehicles`, { headers:{ Authorization:`Bearer ${token}` } });
      setVehicles(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchComments = async (tid) => {
    setLoadingComments(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/tickets/${tid}/comments`, { headers:{ Authorization:`Bearer ${token}` } });
      setComments(res.data);
    } catch (err) { console.error(err); }
    finally { setLoadingComments(false); }
  };

  const fetchActivities = async (tid) => {
    setLoadingActivities(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/tickets/${tid}/activities`, { headers:{ Authorization:`Bearer ${token}` } });
      setActivities(res.data);
    } catch (err) { console.error(err); }
    finally { setLoadingActivities(false); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim() && !commentFile) return;
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('content', commentContent);
      if (commentFile) fd.append('attachment', commentFile);
      
      await axios.post(`${API_BASE_URL}/tickets/${currentTicket._id}/comments`, fd, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setCommentContent('');
      setCommentFile(null);
      if (commentFileRef.current) commentFileRef.current.value = '';
      fetchComments(currentTicket._id);
      fetchActivities(currentTicket._id);
    } catch (err) {
      console.error(err);
      alert('Failed to post comment.');
    }
  };

  const setR = (k, v) => setRaiseForm(p => ({ ...p, [k]: v }));
  const setM = (k, v) => setManageForm(p => ({ ...p, [k]: v }));

  const handleRaise = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      Object.entries(raiseForm).forEach(([k, v]) => v && fd.append(k, v));
      if (attachFile) fd.append('attachment', attachFile);
      await axios.post(`${API_BASE_URL}/tickets`, fd, { headers:{ Authorization:`Bearer ${token}` } });
      setIsRaiseOpen(false);
      setRaiseForm({ title:'', description:'', priority:'Medium', category:'IT', vehicleId:'' });
      setAttachFile(null);
      fetchTickets();
      onTicketCreated?.();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const openManage = (ticket) => {
    setCurrentTicket(ticket);
    setManageForm({
      assignedTo: ticket.assignedTo?._id||ticket.assignedTo||'',
      assignedDepartment: ticket.assignedDepartment?._id||ticket.assignedDepartment||'',
      status: ticket.status,
      remarks: ticket.remarks||''
    });
    setIsManageOpen(true);
    setModalTab('comments');
    fetchComments(ticket._id);
    fetchActivities(ticket._id);
  };

  const handleManage = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const data = { status: manageForm.status, remarks: manageForm.remarks };
      if (isAdminOrOps) {
        data.assignedTo = manageForm.assignedTo || null;
        data.assignedDepartment = manageForm.assignedDepartment || null;
      }
      await axios.put(`${API_BASE_URL}/tickets/${currentTicket._id}`, data, { headers:{ Authorization:`Bearer ${token}` } });
      setIsManageOpen(false); fetchTickets();
    } catch (err) { 
      alert(err.response?.data?.message || 'Error updating ticket');
    }
    finally { setSaving(false); }
  };

  const getStatusOpts = (ticket) => {
    const isAssignee = (ticket.assignedTo?._id||ticket.assignedTo) === currentUser._id;
    const isCreator  = (ticket.createdBy?._id||ticket.createdBy) === currentUser._id;
    
    if (isSuperAdmin || isOpsAdmin) return ['Open','In Progress','Need Clarification','Done','Closed'];
    if (isAssignee) return ['In Progress','Not Possible','Need Clarification','Pending Approval'];
    if (isCreator) return [ticket.status, 'Pending Approval'];
    return [ticket.status];
  };

  const filtered = tickets.filter(t => {
    const mS = filterStatus === 'All' || t.status === filterStatus;
    const mV = ticketView === 'All' ? true
      : ticketView === 'Raised'   ? (t.createdBy?._id||t.createdBy) === currentUser._id
      : (t.assignedTo?._id||t.assignedTo) === currentUser._id;
    return mS && mV;
  });

  return (
    <div className="tl-root">

      {/* Header */}
      <div className="tl-header">
        <div>
          <div className="tl-eyebrow">Support</div>
          <h2 className="tl-title">Tickets</h2>
        </div>
        <div style={{ display:'flex', gap:'.75rem' }}>
          <button className="tl-raise-btn" style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0' }} 
            onClick={() => exportToCSV(filtered, `Tickets_Export_${new Date().toLocaleDateString()}`, ['ticketId', 'title', 'status', 'priority', 'category', 'assignedTo', 'createdBy', 'createdAt'])}>
            <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" size={15} /> Export CSV
          </button>
          <button className="tl-raise-btn" onClick={() => setIsRaiseOpen(true)}>
            <Ico d="M12 5v14 M5 12h14" size={15} /> Raise Ticket
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="tl-toolbar">
        <div className="tl-tabs">
          {isAdminOrOps && (
            <div className={`tl-tab${ticketView === 'All' ? ' active' : ''}`} onClick={() => setTicketView('All')}>All</div>
          )}
          <div className={`tl-tab${ticketView === 'Raised' ? ' active' : ''}`} onClick={() => setTicketView('Raised')}>Raised By Me</div>
          <div className={`tl-tab${ticketView === 'Assigned' ? ' active' : ''}`} onClick={() => setTicketView('Assigned')}>Assigned To Me</div>
        </div>

        <div className="tl-filter-wrap">
          <select className="tl-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            {Object.keys(STATUS_CFG).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <span className="tl-count">{filtered.length} ticket{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Grid */}
      <div className="tl-grid">
        {loading
          ? [0,1,2,3].map(i => (
            <div key={i} className="tl-skel" style={{ animationDelay:`${i*.07}s` }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'.9rem' }}>
                <div className="tl-skel-line" style={{ height:22,width:'30%',borderRadius:7 }} />
                <div className="tl-skel-line" style={{ height:22,width:'28%',borderRadius:7 }} />
              </div>
              <div className="tl-skel-line" style={{ height:17,width:'75%',marginBottom:'.55rem' }} />
              <div className="tl-skel-line" style={{ height:12,width:'90%',marginBottom:'.4rem' }} />
              <div className="tl-skel-line" style={{ height:12,width:'65%',marginBottom:'1.2rem' }} />
              <div style={{ display:'flex',justifyContent:'space-between',paddingTop:'1rem',borderTop:'1px solid rgba(255,255,255,.04)' }}>
                <div className="tl-skel-line" style={{ height:12,width:'40%' }} />
                <div className="tl-skel-line" style={{ height:30,width:'22%',borderRadius:9 }} />
              </div>
            </div>
          ))
          : filtered.length === 0
            ? (
              <div className="tl-empty">
                <div className="tl-empty-icon">🎫</div>
                <div className="tl-empty-title">No tickets found</div>
                <div className="tl-empty-sub">Try a different filter or raise a new ticket.</div>
              </div>
            )
            : filtered.map((ticket, i) => {
              const sc = STATUS_CFG[ticket.status] || STATUS_CFG['Closed'];
              const pc = PRIORITY_CFG[ticket.priority] || PRIORITY_CFG.Medium;
              return (
                <div className="tl-card" key={ticket._id} style={{ animationDelay:`${i*.05}s` }}>
                  <div className="tl-card-accent" style={{ background: pc.bar }} />

                  <div className="tl-card-head">
                    <span className="tl-badge" style={{ background:pc.bg, border:`1px solid ${pc.border}`, color:pc.text }}>
                      <span className="tl-badge-dot" style={{ background:pc.dot }} />
                      {ticket.priority}
                    </span>
                    <span className="tl-badge" style={{ background:sc.bg, border:`1px solid ${sc.border}`, color:sc.text }}>
                      <span className="tl-badge-dot" style={{ background:sc.dot }} />
                      {ticket.status}
                    </span>
                  </div>

                  <div className="tl-card-title">
                    <span style={{ color:'#6366f1', fontSize:'.8rem', marginRight:'.5rem', fontFamily:'DM Mono, monospace' }}>
                      #{ticket.ticketId || ticket._id.slice(-6).toUpperCase()}
                    </span>
                    {ticket.title}
                  </div>
                  <div className="tl-card-desc">{ticket.description}</div>

                  <div className="tl-meta">
                    <span className="tl-meta-chip cat">
                      {CAT_ICONS[ticket.category]} {ticket.category}
                    </span>
                    {ticket.vehicleId && (
                      <span className="tl-meta-chip vehicle">
                        <Ico d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v5a2 2 0 0 1-2 2h-3" size={11} />
                        {ticket.vehicleId.plateNumber}
                      </span>
                    )}
                    {ticket.attachment && (
                      <span className="tl-meta-chip attach">
                        <Ico d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" size={11} />
                        <a href={`${API_BASE_URL.replace('/api','')}${ticket.attachment}`} target="_blank" rel="noreferrer">Attachment</a>
                      </span>
                    )}
                  </div>

                  <div className="tl-card-footer">
                    <div className="tl-by">
                      <div className="tl-by-row">
                        <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                        <span className="tl-by-val">{ticket.createdBy?.name || 'Unknown'}</span>
                      </div>
                      <div className="tl-by-row" style={{ color:'#1e293b' }}>
                        <Ico d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" size={12} />
                        <span>{ticket.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                    </div>
                    <button className="tl-manage-btn" onClick={() => openManage(ticket)}>
                      <Ico d="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" size={13} /> Manage
                    </button>
                  </div>
                </div>
              );
            })
        }
      </div>

      {/* Raise Ticket Modal */}
      {isRaiseOpen && (
        <div className="tl-overlay" onClick={e => e.target === e.currentTarget && setIsRaiseOpen(false)}>
          <div className="tl-modal">
            <div className="tl-modal-accent" />
            <div className="tl-modal-header">
              <div className="tl-modal-title">Raise New Ticket</div>
              <button className="tl-modal-close" onClick={() => setIsRaiseOpen(false)}>
                <Ico d="M18 6L6 18 M6 6l12 12" size={14} />
              </button>
            </div>
            <div className="tl-modal-body">
              <form onSubmit={handleRaise}>
                <div className="tl-field">
                  <label className="tl-label">Title <span style={{color:'#ef4444'}}>*</span></label>
                  <input className="tl-input" placeholder="Brief summary of the issue" value={raiseForm.title} onChange={e => setR('title', e.target.value)} required />
                </div>
                <div className="tl-field">
                  <label className="tl-label">Description <span style={{color:'#ef4444'}}>*</span></label>
                  <textarea className="tl-textarea" placeholder="Describe the issue in detail…" value={raiseForm.description} onChange={e => setR('description', e.target.value)} required />
                </div>

                <div className="tl-2col">
                  <div className="tl-field">
                    <label className="tl-label">Priority</label>
                    <div className="tl-select-wrap">
                      <select className="tl-select" value={raiseForm.priority} onChange={e => setR('priority', e.target.value)}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="tl-field">
                    <label className="tl-label">Category</label>
                    <div className="tl-select-wrap">
                      <select className="tl-select" value={raiseForm.category} onChange={e => setR('category', e.target.value)}>
                        <option value="IT">IT</option>
                        <option value="Stationary">Stationary</option>
                        <option value="Vehicle">Vehicle</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {raiseForm.category === 'Vehicle' && (
                  <div className="tl-field">
                    <label className="tl-label">Vehicle <span style={{color:'#ef4444'}}>*</span></label>
                    <div className="tl-select-wrap">
                      <select className="tl-select" value={raiseForm.vehicleId} onChange={e => setR('vehicleId', e.target.value)} required>
                        <option value="">Select vehicle</option>
                        {vehicles.map(v => <option key={v._id} value={v._id}>{v.plateNumber} – {v.make} {v.model}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                <div className="tl-field">
                  <label className="tl-label">Attachment</label>
                  <div className={`tl-file-zone${attachFile ? ' has-file' : ''}`} onClick={() => fileRef.current?.click()}>
                    <input ref={fileRef} type="file" style={{ display:'none' }} onChange={e => setAttachFile(e.target.files[0])} />
                    {attachFile
                      ? <div className="tl-file-name"><Ico d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" size={13} /> {attachFile.name}</div>
                      : <div className="tl-file-hint">Click to attach a file</div>
                    }
                  </div>
                </div>

                <div className="tl-modal-footer">
                  <button type="button" className="tl-cancel-btn" onClick={() => setIsRaiseOpen(false)}>Cancel</button>
                  <button type="submit" className="tl-save-btn" disabled={saving}>
                    {saving ? <><span className="tl-spinner" /> Submitting…</> : <><Ico d="M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z" size={15} /> Submit</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Manage Ticket Modal */}
      {isManageOpen && currentTicket && (
        <div className="tl-overlay" onClick={e => e.target === e.currentTarget && setIsManageOpen(false)}>
          <div className="tl-modal manage-wide">
            <div className="tl-modal-accent" />
            <div className="tl-modal-header">
              <div className="tl-modal-title">Manage Ticket #{currentTicket.ticketId || currentTicket._id.slice(-6).toUpperCase()}</div>
              <button className="tl-modal-close" onClick={() => setIsManageOpen(false)}>
                <Ico d="M18 6L6 18 M6 6l12 12" size={14} />
              </button>
            </div>
            <div className="tl-modal-body">
              {/* Ticket preview */}
              <div className="tl-preview">
                <div className="tl-preview-title">{currentTicket.title}</div>
                <div style={{ fontSize: '.8rem', color: '#64748b', marginBottom: '.6rem' }}>{currentTicket.description}</div>
                <div className="tl-preview-badges">
                  {[PRIORITY_CFG[currentTicket.priority], STATUS_CFG[currentTicket.status]].map((cfg, i) => cfg && (
                    <span key={i} className="tl-badge" style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, color:cfg.text, fontSize:'.66rem' }}>
                      <span className="tl-badge-dot" style={{ background:cfg.dot }} />
                      {i === 0 ? currentTicket.priority : currentTicket.status}
                    </span>
                  ))}
                  {currentTicket.assetId && (
                    <span className="tl-badge" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#a5b4fc', cursor: 'pointer' }} onClick={() => navigate(`/asset/${currentTicket.assetId._id || currentTicket.assetId}`)}>
                      🖥️ Linked Asset: {currentTicket.assetId.name || 'View Profile'}
                    </span>
                  )}
                </div>
              </div>

              <div className="tl-manage-grid">
                {/* Left Column: Form */}
                <div className="tl-manage-col-left">
                  <form onSubmit={handleManage}>
                    <div className="tl-field">
                      <label className="tl-label">Update Status</label>
                      <div className="tl-select-wrap">
                        <select className="tl-select" value={manageForm.status} onChange={e => setM('status', e.target.value)}>
                          {getStatusOpts(currentTicket).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    {isAdminOrOps && (
                      <>
                        <div className="tl-field">
                          <label className="tl-label">Assign Department</label>
                          <div className="tl-select-wrap">
                            <select className="tl-select" value={manageForm.assignedDepartment} onChange={e => setM('assignedDepartment', e.target.value)}>
                              <option value="">Unassigned</option>
                              {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="tl-field">
                          <label className="tl-label">Assign Technician</label>
                          <div className="tl-select-wrap">
                            <select className="tl-select" value={manageForm.assignedTo} onChange={e => setM('assignedTo', e.target.value)}>
                              <option value="">Unassigned</option>
                              {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role}) · {u.department?.name || 'No dept'}</option>)}
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="tl-field">
                      <label className="tl-label">Remarks / Resolution</label>
                      <textarea className="tl-textarea" placeholder="Add resolution details or notes…" value={manageForm.remarks} onChange={e => setM('remarks', e.target.value)} />
                    </div>

                    <div className="tl-modal-footer" style={{ padding: 0 }}>
                      <button type="button" className="tl-cancel-btn" onClick={() => setIsManageOpen(false)}>Cancel</button>
                      <button type="submit" className="tl-save-btn" disabled={saving}>
                        {saving ? <><span className="tl-spinner" /> Updating…</> : <><Ico d="M20 6L9 17l-5-5" size={15} /> Update Ticket</>}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Column: Collaboration & Activity timeline */}
                <div className="tl-manage-col-right">
                  <div className="tl-modal-tabs">
                    <button type="button" className={`tl-modal-tab-btn${modalTab === 'comments' ? ' active' : ''}`} onClick={() => setModalTab('comments')}>
                      💬 Comments ({comments.length})
                    </button>
                    <button type="button" className={`tl-modal-tab-btn${modalTab === 'activity' ? ' active' : ''}`} onClick={() => setModalTab('activity')}>
                      ⏱️ Activity Log ({activities.length})
                    </button>
                  </div>

                  {modalTab === 'comments' && (
                    <div style={{ display:'flex', flexDirection:'column', flexGrow:1 }}>
                      <div className="tl-comments-list">
                        {loadingComments ? (
                          <div style={{fontSize:'.75rem',color:'#64748b'}}>Loading comments...</div>
                        ) : comments.length === 0 ? (
                          <div style={{fontSize:'.75rem',color:'#475569',textAlign:'center',padding:'1.5rem'}}>No comments yet. Start the conversation!</div>
                        ) : comments.map(c => (
                          <div key={c._id} className="tl-comment-item">
                            <div className="tl-comment-meta">
                              <span>{c.userId?.name || 'User'} ({c.userId?.role || 'Staff'})</span>
                              <span>{new Date(c.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <div className="tl-comment-text">{c.content}</div>
                            {c.attachment && (
                              <div style={{marginTop:'.35rem', fontSize:'.7rem'}}>
                                📎 <a href={`http://localhost:5000${c.attachment}`} target="_blank" rel="noreferrer" style={{color:'#10b981',textDecoration:'none'}}>View Attachment</a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleAddComment} className="tl-comment-form">
                        <div className="tl-comment-input-row">
                          <input className="tl-input" placeholder="Type a comment…" value={commentContent} onChange={e => setCommentContent(e.target.value)} />
                          <button type="submit" className="tl-raise-btn" style={{padding:'0 .8rem', borderRadius:'10px', boxShadow:'none'}} disabled={!commentContent.trim() && !commentFile}>Post</button>
                        </div>
                        <div className="tl-comment-file-zone" onClick={() => commentFileRef.current?.click()}>
                          <input ref={commentFileRef} type="file" style={{display:'none'}} onChange={e => setCommentFile(e.target.files[0])} />
                          {commentFile ? `📎 ${commentFile.name}` : 'Attach image/log file'}
                        </div>
                      </form>
                    </div>
                  )}

                  {modalTab === 'activity' && (
                    <div className="tl-activities-list">
                      {loadingActivities ? (
                        <div style={{fontSize:'.75rem',color:'#64748b'}}>Loading activities...</div>
                      ) : activities.length === 0 ? (
                        <div style={{fontSize:'.75rem',color:'#475569',textAlign:'center',padding:'1.5rem'}}>No activities logged.</div>
                      ) : activities.map(act => (
                        <div key={act._id} className="tl-activity-item">
                          <div className="tl-activity-dot" />
                          <div className="tl-activity-info">
                            <span className="tl-activity-action">{act.action}</span>
                            {act.remarks && <span className="tl-activity-remarks">"{act.remarks}"</span>}
                            <span className="tl-activity-meta">By {act.actorId?.name || 'System'} · {new Date(act.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsList;
