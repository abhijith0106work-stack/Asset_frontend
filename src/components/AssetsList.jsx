import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  @keyframes al-fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes al-fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes al-shimmer   { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes al-spin      { to{transform:rotate(360deg)} }
  @keyframes al-modalIn   { from{opacity:0;transform:translateY(18px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes al-overlayIn { from{opacity:0} to{opacity:1} }
  @keyframes al-gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes al-pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
  @keyframes al-rowIn     { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }

  .al-root * { box-sizing:border-box; margin:0; padding:0; }
  .al-root { font-family:'DM Sans',sans-serif; color:#e2e8f0; padding:2rem 0; }

  /* ── Header ── */
  .al-header {
    display:flex; justify-content:space-between; align-items:flex-end;
    margin-bottom:1.8rem; animation:al-fadeUp .4s ease both;
  }
  .al-eyebrow { font-size:.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#8b5cf6;margin-bottom:.3rem; }
  .al-title   { font-family:'Syne',sans-serif;font-size:1.7rem;font-weight:800;color:#f8fafc; }
  .al-header-actions { display:flex;gap:.7rem;align-items:center; }

  .al-export-btn {
    display:flex;align-items:center;gap:.4rem;
    padding:.55rem 1rem;border-radius:10px;
    border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.04);
    color:#64748b;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:500;cursor:pointer;
    transition:all .18s;
  }
  .al-export-btn:hover { background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.14);color:#94a3b8; }

  .al-add-btn {
    display:flex;align-items:center;gap:.45rem;
    padding:.58rem 1.15rem;border-radius:11px;border:none;cursor:pointer;
    background:#6366f1;color:#fff;
    font-family:'DM Sans',sans-serif;font-size:.84rem;font-weight:600;
    box-shadow:0 4px 18px rgba(99,102,241,.38);transition:all .2s;
  }
  .al-add-btn:hover { background:#5254cc;transform:translateY(-2px);box-shadow:0 6px 22px rgba(99,102,241,.5); }

  /* ── Toolbar ── */
  .al-toolbar {
    display:flex;gap:.85rem;margin-bottom:2rem;flex-wrap:wrap;align-items:center;
    animation:al-fadeUp .4s .05s ease both;
  }
  .al-filter-wrap { position:relative; }
  .al-filter-wrap::after {
    content:'';position:absolute;right:.85rem;top:50%;transform:translateY(-50%);
    border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #334155;
    pointer-events:none;
  }
  .al-filter {
    appearance:none;padding:.6rem 2rem .6rem 1rem;
    background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
    border-radius:11px;color:#94a3b8;font-family:'DM Sans',sans-serif;font-size:.82rem;
    outline:none;cursor:pointer;transition:border-color .2s;
  }
  .al-filter:focus { border-color:#6366f1; }
  .al-filter option { background:#0f172a; }
  .al-count { font-size:.74rem;color:#334155;font-family:'DM Mono',monospace;white-space:nowrap; }

  /* ── Table ── */
  .al-table-wrap {
    background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);
    border-radius:20px;overflow:hidden;
    animation:al-fadeUp .4s .1s ease both;
  }
  .al-table { width:100%;border-collapse:collapse;text-align:left; }
  .al-table th {
    padding:1rem 1.4rem;
    background:rgba(255,255,255,.03);
    font-size:.68rem;font-weight:600;text-transform:uppercase;
    color:#334155;letter-spacing:.1em;
    border-bottom:1px solid rgba(255,255,255,.06);
    font-family:'DM Mono',monospace;
  }
  .al-table td {
    padding:1rem 1.4rem;
    border-bottom:1px solid rgba(255,255,255,.04);
    font-size:.84rem;vertical-align:middle;
    animation:al-rowIn .35s ease both;
  }
  .al-table tr:last-child td { border-bottom:none; }
  .al-table tbody tr { transition:background .15s; }
  .al-table tbody tr:hover td { background:rgba(255,255,255,.025); }

  /* asset cell */
  .al-asset-cell { display:flex;gap:.8rem;align-items:center; }
  .al-asset-thumb {
    width:38px;height:38px;border-radius:10px;object-fit:cover;
    border:1px solid rgba(255,255,255,.09);flex-shrink:0;
  }
  .al-asset-thumb-fb {
    width:38px;height:38px;border-radius:10px;flex-shrink:0;
    background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
    display:flex;align-items:center;justify-content:center;color:#475569;
  }
  .al-asset-uid { font-size:.65rem;color:#6366f1;font-family:'DM Mono',monospace;margin-bottom:.15rem; }
  .al-asset-name {
    font-weight:600;color:#f1f5f9;cursor:pointer;
    transition:color .15s;text-decoration:none;
  }
  .al-asset-name:hover { color:#a5b4fc; }

  /* status badge */
  .al-badge {
    display:inline-flex;align-items:center;gap:.35rem;
    padding:.25rem .65rem;border-radius:7px;
    font-size:.7rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
  }
  .al-badge-dot { width:5px;height:5px;border-radius:50%;animation:al-pulse 2.2s ease infinite; }

  /* type chip */
  .al-type-chip {
    display:inline-flex;align-items:center;gap:.3rem;
    padding:.2rem .6rem;border-radius:6px;
    background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.22);
    color:#c4b5fd;font-size:.72rem;font-weight:600;font-family:'DM Mono',monospace;
  }

  /* action btns */
  .al-action-row { display:flex;gap:.5rem;align-items:center; }
  .al-act-btn {
    display:flex;align-items:center;gap:.28rem;
    padding:.36rem .7rem;border-radius:7px;cursor:pointer;
    font-family:'DM Sans',sans-serif;font-size:.74rem;font-weight:600;
    border:1px solid;transition:all .15s;
  }
  .al-act-edit   { background:rgba(99,102,241,.08); border-color:rgba(99,102,241,.22); color:#818cf8; }
  .al-act-edit:hover { background:rgba(99,102,241,.18); }
  .al-act-label  { background:rgba(16,185,129,.08); border-color:rgba(16,185,129,.22); color:#34d399; }
  .al-act-label:hover { background:rgba(16,185,129,.18); }
  .al-act-del    { background:rgba(239,68,68,.07); border-color:rgba(239,68,68,.2); color:#fca5a5; }
  .al-act-del:hover { background:rgba(239,68,68,.16); }

  /* ── Empty ── */
  .al-empty {
    text-align:center;padding:4rem 2rem;
    animation:al-fadeUp .4s ease both;
  }
  .al-empty-icon  { font-size:2.4rem;opacity:.25;margin-bottom:.8rem; }
  .al-empty-title { font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:#334155;margin-bottom:.35rem; }
  .al-empty-sub   { font-size:.82rem;color:#1e293b; }

  /* ── Skeleton rows ── */
  .al-skel-line { background:linear-gradient(90deg,rgba(255,255,255,.04) 0px,rgba(255,255,255,.09) 100px,rgba(255,255,255,.04) 200px);background-size:600px 100%;animation:al-shimmer 1.4s infinite linear;border-radius:6px; }

  /* ── OVERLAY ── */
  .al-overlay {
    position:fixed;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(8px);
    display:flex;align-items:center;justify-content:center;z-index:1000;padding:1rem;
    animation:al-overlayIn .2s ease both;
  }

  /* ── MODAL ── */
  .al-modal {
    background:#0d1117;border:1px solid rgba(255,255,255,.09);
    border-radius:24px;width:100%;max-width:620px;
    max-height:90vh;overflow-y:auto;
    box-shadow:0 30px 70px rgba(0,0,0,.6);position:relative;
    animation:al-modalIn .3s cubic-bezier(.22,1,.36,1) both;
  }
  .al-modal::-webkit-scrollbar { width:4px; }
  .al-modal::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08);border-radius:4px; }
  .al-modal-accent { position:absolute;top:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4);border-radius:24px 24px 0 0; }
  .al-modal-header {
    display:flex;justify-content:space-between;align-items:center;
    padding:1.8rem 2rem 0;margin-bottom:1.5rem;
  }
  .al-modal-title { font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#f8fafc; }
  .al-modal-close {
    width:30px;height:30px;border-radius:8px;border:1px solid rgba(255,255,255,.09);
    background:rgba(255,255,255,.04);color:#64748b;cursor:pointer;
    display:flex;align-items:center;justify-content:center;transition:all .18s;
  }
  .al-modal-close:hover { background:rgba(255,255,255,.08);color:#94a3b8; }
  .al-modal-body { padding:0 2rem 2rem; }

  /* form */
  .al-2col { display:grid;grid-template-columns:1fr 1fr;gap:1rem; }
  .al-field { margin-bottom:1.05rem; }
  .al-label {
    display:block;font-size:.7rem;font-weight:600;letter-spacing:.1em;
    text-transform:uppercase;color:#334155;margin-bottom:.42rem;
  }
  .al-input,.al-select {
    width:100%;padding:.75rem 1rem;
    background:#0a0e1a;border:1px solid rgba(255,255,255,.08);
    border-radius:11px;color:#e2e8f0;
    font-family:'DM Sans',sans-serif;font-size:.88rem;outline:none;
    transition:border-color .2s,box-shadow .2s;appearance:none;
  }
  .al-input:focus,.al-select:focus { border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12); }
  .al-input::placeholder { color:#1e293b; }
  .al-select option { background:#0a0e1a; }
  .al-select-wrap { position:relative; }
  .al-select-wrap::after {
    content:'';position:absolute;right:.9rem;top:50%;transform:translateY(-50%);
    border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #334155;
    pointer-events:none;
  }

  /* section divider */
  .al-section-label {
    font-size:.68rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;
    color:#6366f1;margin:1.4rem 0 .9rem;display:flex;align-items:center;gap:.6rem;
  }
  .al-section-label::after { content:'';flex:1;height:1px;background:rgba(99,102,241,.15); }

  /* image upload */
  .al-img-zone {
    border:2px dashed rgba(255,255,255,.09);border-radius:13px;
    padding:1.2rem;text-align:center;cursor:pointer;
    transition:all .2s;background:rgba(255,255,255,.02);position:relative;
  }
  .al-img-zone:hover  { border-color:rgba(99,102,241,.3);background:rgba(99,102,241,.04); }
  .al-img-zone.has-img{ border-color:rgba(16,185,129,.35);background:rgba(16,185,129,.05); }
  .al-img-zone input  { position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%; }
  .al-img-preview { width:72px;height:72px;object-fit:cover;border-radius:10px;display:block;margin:0 auto; }
  .al-img-hint { font-size:.76rem;color:#334155; }

  /* modal footer */
  .al-modal-footer { display:flex;gap:.8rem;margin-top:1.5rem; }
  .al-cancel-btn {
    flex:1;padding:.75rem;border-radius:11px;border:1px solid rgba(255,255,255,.09);
    background:rgba(255,255,255,.04);color:#64748b;
    font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:500;cursor:pointer;transition:all .18s;
  }
  .al-cancel-btn:hover { background:rgba(255,255,255,.08);color:#94a3b8; }
  .al-save-btn {
    flex:1;padding:.75rem;border-radius:11px;border:none;cursor:pointer;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);background-size:200%;
    color:#fff;font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;
    box-shadow:0 4px 18px rgba(99,102,241,.38);transition:all .2s;
    display:flex;align-items:center;justify-content:center;gap:.5rem;
    animation:al-gradShift 5s ease infinite;
  }
  .al-save-btn:hover { transform:translateY(-2px);box-shadow:0 6px 24px rgba(99,102,241,.5); }
  .al-save-btn:disabled { opacity:.55;cursor:not-allowed;transform:none; }
  .al-spinner { width:15px;height:15px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:al-spin .65s linear infinite; }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const STATUS_CFG = {
  Available: { bg:'rgba(16,185,129,.12)',  border:'rgba(16,185,129,.3)',  text:'#34d399', dot:'#10b981', bar:'#10b981' },
  Assigned:  { bg:'rgba(99,102,241,.12)',  border:'rgba(99,102,241,.3)',  text:'#818cf8', dot:'#6366f1', bar:'#6366f1' },
  Damaged:   { bg:'rgba(239,68,68,.12)',   border:'rgba(239,68,68,.3)',   text:'#fca5a5', dot:'#ef4444', bar:'#ef4444' },
  Retired:   { bg:'rgba(100,116,139,.12)', border:'rgba(100,116,139,.3)', text:'#94a3b8', dot:'#64748b', bar:'#64748b' },
};

const TYPE_ICONS = {
  IT:         <Ico d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" size={15} />,
  Stationary: <Ico d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" size={15} />,
};

const BLANK_FORM = {
  name:'', type:'IT', status:'Available', assignedTo:'',
  macAddress:'', serialNumber:'', purchaseDate:'', model:'',
  subType:'', condition:'New', osVersion:'', softwareLicenses:'',
  devicePassword:'', deviceUserName:'', deviceLocation:'', company:''
};

// ── Component ─────────────────────────────────────────────────────────────────
const AssetsList = ({ role }) => {
  const navigate = useNavigate();
  const [assets, setAssets]             = useState([]);
  const [users, setUsers]               = useState([]);
  const [companies, setCompanies]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType,   setFilterType]   = useState('All');
  const [filterCompany, setFilterCompany] = useState('All');
  const [formData, setFormData]         = useState(BLANK_FORM);
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving]             = useState(false);
  const [editingId, setEditingId]       = useState(null);
  const imgRef = useRef();
  const isAdmin = role === 'Super Admin' || role === 'Admin';

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => {
    fetchAssets(); fetchCompanies();
    if (isAdmin) fetchUsers();
  }, [role]);

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = role === 'User' ? `${API_BASE_URL}/assets/me` : `${API_BASE_URL}/assets`;
      const res = await axios.get(url, { headers:{ Authorization:`Bearer ${token}` } });
      setAssets(res.data);
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
  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/companies`, { headers:{ Authorization:`Bearer ${token}` } });
      setCompanies(res.data);
    } catch (err) { console.error(err); }
  };

  const set = (k, v) => setFormData(p => {
    const u = { ...p, [k]: v };
    if (k === 'assignedTo') {
      if (v && u.status === 'Available') u.status = 'Assigned';
      if (!v && u.status === 'Assigned') u.status = 'Available';
    }
    return u;
  });

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setImageFile(f || null);
    if (f) { const r = new FileReader(); r.onloadend = () => setImagePreview(r.result); r.readAsDataURL(f); }
    else { setImagePreview(null); }
  };

  const handleEdit = (asset) => {
    setEditingId(asset._id);
    setFormData({
      name: asset.name||'', type: asset.type||'IT', status: asset.status||'Available',
      assignedTo: asset.assignedTo?._id||asset.assignedTo||'',
      macAddress: asset.macAddress||'', serialNumber: asset.serialNumber||'',
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
      model: asset.model||'', subType: asset.subType||'', condition: asset.condition||'New',
      osVersion: asset.osVersion||'', softwareLicenses: asset.softwareLicenses||'',
      devicePassword: asset.devicePassword||'', deviceUserName: asset.deviceUserName||'',
      deviceLocation: asset.deviceLocation||'', company: asset.company?._id||asset.company||''
    });
    setImagePreview(asset.image ? `http://localhost:5000${asset.image}` : null);
    setImageFile(null); setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const cfg = { headers:{ Authorization:`Bearer ${token}` } };
      const payload = new FormData();
      Object.keys(formData).forEach(k => payload.append(k, formData[k]||''));
      if (imageFile) payload.append('image', imageFile);
      if (editingId) { await axios.put(`${API_BASE_URL}/assets/${editingId}`, payload, cfg); }
      else           { await axios.post(`${API_BASE_URL}/assets`, payload, cfg); }
      closeModal(); fetchAssets();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this asset? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/assets/${id}`, { headers:{ Authorization:`Bearer ${token}` } });
      fetchAssets();
    } catch (err) { console.error(err); }
  };

  const downloadLabel = (asset) => {
    const qrCanvas = document.getElementById(`qr-${asset._id}`);
    if (!qrCanvas) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1050; canvas.height = 300;
    const ctx = canvas.getContext('2d');
    const draw = (logo = null) => {
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(qrCanvas, 30, 30, 240, 240);
      if (logo) ctx.drawImage(logo, canvas.width-270, 30, 240, 240);
      ctx.fillStyle = '#000'; ctx.font = 'bold 45px sans-serif';
      ctx.fillText(asset.uniqueId ? `${asset.uniqueId} - ${asset.name}` : asset.name, 300, 80);
      ctx.font = '28px sans-serif';
      ctx.fillText(`Model: ${asset.model||'N/A'}`, 300, 130);
      ctx.fillText(`SN: ${asset.serialNumber||'N/A'}`, 300, 175);
      ctx.fillText(`Location: ${asset.deviceLocation||'N/A'}`, 300, 220);
      ctx.fillText(`Company: ${asset.company?.name||'N/A'}`, 300, 265);
      ctx.strokeStyle = '#000'; ctx.lineWidth = 4;
      ctx.strokeRect(2,2,canvas.width-4,canvas.height-4);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `label-${asset.uniqueId||asset._id}.png`;
      link.click();
    };
    if (asset.company?.logo) {
      const img = new Image(); img.crossOrigin = 'anonymous';
      img.src = `http://localhost:5000${asset.company.logo}`;
      img.onload = () => draw(img); img.onerror = () => draw();
    } else { draw(); }
  };

  const exportCSV = () => {
    const headers = ['Unique ID','Name','Type','Status','Assigned To','Location','Company'];
    const rows = filtered.map(a => [a.uniqueId||'', a.name, a.type, a.status, a.assignedTo?.name||'Unassigned', a.deviceLocation||'', a.company?.name||'N/A']);
    const blob = new Blob([[headers,...rows].map(r=>r.join(',')).join('\n')], { type:'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
    link.download = 'assets_export.csv'; link.click();
  };

  const closeModal = () => { setIsModalOpen(false); setEditingId(null); setFormData(BLANK_FORM); setImageFile(null); setImagePreview(null); };

  const filtered = assets.filter(a =>
    (filterStatus  === 'All' || a.status === filterStatus) &&
    (filterType    === 'All' || a.type   === filterType) &&
    (filterCompany === 'All' || (a.company?._id||a.company) === filterCompany)
  );

  return (
    <div className="al-root">

      {/* Header */}
      <div className="al-header">
        <div>
          <div className="al-eyebrow">Inventory</div>
          <h2 className="al-title">Asset Management</h2>
        </div>
        {isAdmin && (
          <div className="al-header-actions">
            <button className="al-export-btn" onClick={exportCSV}>
              <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" size={14} /> Export CSV
            </button>
            <button className="al-add-btn" onClick={() => setIsModalOpen(true)}>
              <Ico d="M12 5v14 M5 12h14" size={14} /> Add Asset
            </button>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="al-toolbar">
        <div className="al-filter-wrap">
          <select className="al-filter" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="All">All Types</option>
            <option value="IT">IT</option>
            <option value="Stationary">Stationary</option>
          </select>
        </div>
        <div className="al-filter-wrap">
          <select className="al-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            {Object.keys(STATUS_CFG).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="al-filter-wrap">
          <select className="al-filter" value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
            <option value="All">All Companies</option>
            {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <span className="al-count">{filtered.length} asset{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="al-table-wrap">
        <table className="al-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Type</th>
              <th>Location</th>
              <th>Company</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading
              ? [0,1,2,3,4].map(i => (
                <tr key={i}>
                  <td colSpan={isAdmin ? 6 : 5}>
                    <div style={{ display:'flex',gap:'.8rem',alignItems:'center' }}>
                      <div className="al-skel-line" style={{ width:38,height:38,borderRadius:10,flexShrink:0 }} />
                      <div style={{ flex:1,display:'flex',flexDirection:'column',gap:'.4rem' }}>
                        <div className="al-skel-line" style={{ height:11,width:'20%' }} />
                        <div className="al-skel-line" style={{ height:14,width:'45%' }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
              : filtered.length === 0
                ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5}>
                      <div className="al-empty">
                        <div className="al-empty-icon">📦</div>
                        <div className="al-empty-title">No assets found</div>
                        <div className="al-empty-sub">Try adjusting your filters or add a new asset.</div>
                      </div>
                    </td>
                  </tr>
                )
                : filtered.map((asset, i) => {
                  const sc = STATUS_CFG[asset.status] || STATUS_CFG.Retired;
                  return (
                    <tr key={asset._id} style={{ animationDelay:`${i*.04}s` }}>
                      <td>
                        <div className="al-asset-cell">
                          {asset.image
                            ? <img src={`http://localhost:5000${asset.image}`} className="al-asset-thumb" alt="" />
                            : <div className="al-asset-thumb-fb">{TYPE_ICONS[asset.type] || <Ico d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />}</div>
                          }
                          <div>
                            {asset.uniqueId && <div className="al-asset-uid">{asset.uniqueId}</div>}
                            <div className="al-asset-name" onClick={() => navigate(`/asset/${asset._id}`)}>{asset.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="al-type-chip">
                          {TYPE_ICONS[asset.type]} {asset.type}
                        </span>
                      </td>
                      <td style={{ color:'#64748b', fontSize:'.8rem' }}>{asset.deviceLocation || '—'}</td>
                      <td style={{ color:'#818cf8', fontWeight:500, fontSize:'.8rem' }}>{asset.company?.name || '—'}</td>
                      <td>
                        <span className="al-badge" style={{ background:sc.bg, border:`1px solid ${sc.border}`, color:sc.text }}>
                          <span className="al-badge-dot" style={{ background:sc.dot }} />
                          {asset.status}
                        </span>
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="al-action-row">
                            <button className="al-act-btn al-act-edit" onClick={() => handleEdit(asset)}>
                              <Ico d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={11} /> Edit
                            </button>
                            <button className="al-act-btn al-act-label" onClick={() => downloadLabel(asset)}>
                              <Ico d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" size={11} /> Label
                            </button>
                            <button className="al-act-btn al-act-del" onClick={() => handleDelete(asset._id)}>
                              <Ico d="M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" size={11} /> Del
                            </button>
                            {/* Hidden QR for label generation */}
                            <div style={{ display:'none' }}>
                              <QRCodeCanvas id={`qr-${asset._id}`} value={`http://localhost:3000/asset/${asset._id}`} size={256} />
                            </div>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="al-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="al-modal">
            <div className="al-modal-accent" />
            <div className="al-modal-header">
              <div className="al-modal-title">{editingId ? 'Edit Asset' : 'New Asset'}</div>
              <button className="al-modal-close" onClick={closeModal}>
                <Ico d="M18 6L6 18 M6 6l12 12" size={14} />
              </button>
            </div>
            <div className="al-modal-body">

              <div className="al-section-label">Basic Info</div>
              <div className="al-2col">
                <div className="al-field">
                  <label className="al-label">Asset Name <span style={{color:'#ef4444'}}>*</span></label>
                  <input className="al-input" placeholder="e.g. Dell Laptop" value={formData.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="al-field">
                  <label className="al-label">Type</label>
                  <div className="al-select-wrap">
                    <select className="al-select" value={formData.type} onChange={e => set('type', e.target.value)}>
                      <option value="IT">IT</option>
                      <option value="Stationary">Stationary</option>
                    </select>
                  </div>
                </div>
                <div className="al-field">
                  <label className="al-label">Location</label>
                  <input className="al-input" placeholder="e.g. Server Room" value={formData.deviceLocation} onChange={e => set('deviceLocation', e.target.value)} />
                </div>
                <div className="al-field">
                  <label className="al-label">Company</label>
                  <div className="al-select-wrap">
                    <select className="al-select" value={formData.company} onChange={e => set('company', e.target.value)}>
                      <option value="">Select Company</option>
                      {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="al-field">
                  <label className="al-label">Status</label>
                  <div className="al-select-wrap">
                    <select className="al-select" value={formData.status} onChange={e => set('status', e.target.value)}>
                      {Object.keys(STATUS_CFG).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="al-field">
                  <label className="al-label">Assign To</label>
                  <div className="al-select-wrap">
                    <select className="al-select" value={formData.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
                      <option value="">Unassigned</option>
                      {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {formData.type === 'IT' && (
                <>
                  <div className="al-section-label">Device Details</div>
                  <div className="al-2col">
                    <div className="al-field">
                      <label className="al-label">Model</label>
                      <input className="al-input" placeholder="e.g. Latitude 5520" value={formData.model} onChange={e => set('model', e.target.value)} />
                    </div>
                    <div className="al-field">
                      <label className="al-label">Serial Number</label>
                      <input className="al-input" placeholder="SN-XXXXXXXX" value={formData.serialNumber} onChange={e => set('serialNumber', e.target.value)} />
                    </div>
                    <div className="al-field">
                      <label className="al-label">MAC Address</label>
                      <input className="al-input" placeholder="00:00:00:00:00:00" value={formData.macAddress} onChange={e => set('macAddress', e.target.value)} />
                    </div>
                    <div className="al-field">
                      <label className="al-label">OS Version</label>
                      <input className="al-input" placeholder="e.g. Windows 11" value={formData.osVersion} onChange={e => set('osVersion', e.target.value)} />
                    </div>
                    <div className="al-field">
                      <label className="al-label">Device Username</label>
                      <input className="al-input" value={formData.deviceUserName} onChange={e => set('deviceUserName', e.target.value)} />
                    </div>
                    <div className="al-field">
                      <label className="al-label">Device Password</label>
                      <input className="al-input" type="password" value={formData.devicePassword} onChange={e => set('devicePassword', e.target.value)} />
                    </div>
                    <div className="al-field">
                      <label className="al-label">Purchase Date</label>
                      <input className="al-input" type="date" value={formData.purchaseDate} onChange={e => set('purchaseDate', e.target.value)} />
                    </div>
                    <div className="al-field">
                      <label className="al-label">Condition</label>
                      <div className="al-select-wrap">
                        <select className="al-select" value={formData.condition} onChange={e => set('condition', e.target.value)}>
                          <option value="New">New</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                          <option value="Poor">Poor</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="al-section-label">Image</div>
              <div className={`al-img-zone${imagePreview ? ' has-img' : ''}`} onClick={() => imgRef.current?.click()}>
                <input ref={imgRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display:'none' }} />
                {imagePreview
                  ? <img src={imagePreview} className="al-img-preview" alt="preview" />
                  : <div className="al-img-hint">
                      <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" size={20} style={{ marginBottom:'.4rem',color:'#334155' }} />
                      <div>Click to upload image</div>
                    </div>
                }
              </div>
              {imagePreview && (
                <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }}
                  style={{ marginTop:'.5rem',background:'none',border:'none',color:'#475569',fontSize:'.74rem',cursor:'pointer',fontFamily:'DM Sans,sans-serif' }}>
                  Remove image
                </button>
              )}

              <div className="al-modal-footer">
                <button className="al-cancel-btn" onClick={closeModal}>Cancel</button>
                <button className="al-save-btn" onClick={handleSubmit} disabled={saving}>
                  {saving
                    ? <><span className="al-spinner" /> Saving…</>
                    : <><Ico d="M20 6L9 17l-5-5" size={15} /> {editingId ? 'Update' : 'Create'}</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetsList;
