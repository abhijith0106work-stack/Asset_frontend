// import React, { useState, useEffect } from 'react';
// import { approvalApi } from '../api/approvalApi';

// const SubmitFile = ({ onBack }) => {
//   const [formData, setFormData] = useState({ title: '', description: '', departmentId: '', assignedTo: '' });
//   const [file, setFile] = useState(null);
//   const [departments, setDepartments] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [useWorkflow, setUseWorkflow] = useState(true);

//   useEffect(() => {
//     approvalApi.getDepartments().then(res => setDepartments(res.data)).catch(console.error);
//   }, []);

//   useEffect(() => {
//     if (formData.departmentId) {
//       approvalApi.getUsersByDepartment(formData.departmentId)
//         .then(res => setUsers(res.data))
//         .catch(console.error);
//     } else {
//       setUsers([]);
//     }
//   }, [formData.departmentId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return alert('Please select a file to upload');
    
//     setSaving(true);
//     setError(null);
//     try {
//       const data = new FormData();
//       data.append('title', formData.title);
//       data.append('description', formData.description);
//       data.append('departmentId', formData.departmentId);
//       data.append('assignedTo', formData.assignedTo);
//       data.append('useWorkflow', useWorkflow);
//       data.append('file', file);

//       await approvalApi.submitFile(data);
//       alert('File submitted successfully!');
//       if (onBack) onBack();
//     } catch (err) { 
//       const msg = err.response?.data?.message || 'Error submitting file';
//       setError(msg);
//       alert(msg); 
//     }
//     finally { setSaving(false); }
//   };

//   return (
//     <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', color: 'white' }}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
//         <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
//         <h2 style={{ margin: 0 }}>Submit New File</h2>
//       </div>

//       {error && (
//         <div style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.9rem' }}>
//           <strong>Error:</strong> {error}
//           {error.includes('workflow') && <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>Please ask an Admin to configure a workflow for this department in the <strong>Admin &gt; Workflows</strong> tab.</div>}
//         </div>
//       )}
//       <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
//         <div style={{ marginBottom: '1.5rem' }}>
//           <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>File Title</label>
//           <input 
//             style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
//             value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required 
//           />
//         </div>
//         <div style={{ marginBottom: '1.5rem' }}>
//           <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>Department</label>
//           <select 
//             style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
//             value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} required
//           >
//             <option value="">Select Department</option>
//             {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
//           </select>
//         </div>

//         <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }} onClick={() => setUseWorkflow(!useWorkflow)}>
//             <div style={{ 
//               width: '40px', height: '20px', borderRadius: '20px', background: useWorkflow ? '#6366f1' : '#334155',
//               position: 'relative', transition: 'all 0.3s'
//             }}>
//               <div style={{ 
//                 width: '16px', height: '16px', borderRadius: '50%', background: 'white',
//                 position: 'absolute', top: '2px', left: useWorkflow ? '22px' : '2px', transition: 'all 0.3s'
//               }}></div>
//             </div>
//             <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 500 }}>Important Document (Use Multilevel Workflow)</span>
//           </div>
//           <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', marginLeft: '3.2rem' }}>
//             {useWorkflow 
//               ? 'This file will follow the department\'s standard multi-step approval process.' 
//               : 'This file will be sent directly to the assigned employee for a single-level approval.'}
//           </p>
//         </div>

//         <div style={{ marginBottom: '1.5rem' }}>
//           <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
//             {useWorkflow ? 'Assign to Level 1 Employee (Optional)' : 'Assign to Approver (Required)'}
//           </label>
//           <select 
//             style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
//             value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})}
//             disabled={!formData.departmentId}
//             required={!useWorkflow}
//           >
//             <option value="">Select Employee</option>
//             {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
//           </select>
//         </div>
//         <div style={{ marginBottom: '1.5rem' }}>
//           <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>Attachment (PDF, Word, Image)</label>
//           <input 
//             type="file" 
//             onChange={(e) => setFile(e.target.files[0])}
//             style={{ 
//               width: '100%', padding: '0.8rem', borderRadius: '12px', background: '#1e293b', 
//               border: '1px solid rgba(255,255,255,0.1)', color: 'white' 
//             }}
//             accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//             required
//           />
//         </div>

//         <div style={{ marginBottom: '2rem' }}>
//           <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>Description</label>
//           <textarea 
//             style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white', minHeight: '100px' }}
//             value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
//           />
//         </div>

//         {departments.length === 0 ? (
//           <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
//             No departments found. Please create one in <strong>Admin &gt; Departments</strong> first.
//           </div>
//         ) : (
//           <button 
//             type="submit" 
//             disabled={saving}
//             style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#6366f1', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}
//           >
//             {saving ? 'Submitting...' : 'Submit for Approval'}
//           </button>
//         )}
//       </form>
//     </div>
//   );
// };

// export default SubmitFile;


import React, { useState, useEffect, useRef } from 'react';
import { approvalApi } from '../api/approvalApi';

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes sf-fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes sf-fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes sf-spin    { to{transform:rotate(360deg)} }
  @keyframes sf-gradShift{ 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes sf-pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.45)} 70%{box-shadow:0 0 0 10px rgba(99,102,241,0)} }
  @keyframes sf-shake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
  @keyframes sf-dropIn  { from{opacity:0;transform:scale(.97) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }

  .sf-root * { box-sizing:border-box; margin:0; padding:0; }
  .sf-root {
    font-family:'DM Sans',sans-serif;
    color:var(--text-main);
    padding:2rem 0;
    max-width:640px;
    margin:0 auto;
  }

  /* ── Back btn ── */
  .sf-back {
    display:inline-flex; align-items:center; gap:.45rem;
    background:transparent; border:1px solid var(--border);
    color:var(--text-dim); font-family:'DM Sans',sans-serif; font-size:.82rem; font-weight:500;
    padding:.45rem .9rem; border-radius:10px; cursor:pointer;
    transition:all .2s; margin-bottom:2rem;
    animation:sf-fadeIn .4s ease both;
  }
  .sf-back:hover { background:var(--border-light); color:var(--text-main); border-color:var(--accent); }

  /* ── Header ── */
  .sf-header {
    margin-bottom:2rem;
    animation:sf-fadeUp .4s ease both;
  }
  .sf-eyebrow {
    font-size:.7rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase;
    color:var(--accent); margin-bottom:.3rem;
  }
  .sf-title {
    font-family:'Syne',sans-serif; font-size:1.7rem; font-weight:800; color:var(--text-main);
  }

  /* ── Error banner ── */
  .sf-error {
    background:rgba(239,68,68,.08); color:#fca5a5;
    padding:1rem 1.2rem; border-radius:14px; margin-bottom:1.5rem;
    border:1px solid rgba(239,68,68,.25); font-size:.88rem; line-height:1.6;
    animation:sf-shake .35s ease, sf-fadeIn .3s ease;
    display:flex; gap:.8rem; align-items:flex-start;
  }
  .sf-error-icon { flex-shrink:0; margin-top:.1rem; color:#ef4444; }
  .sf-error-hint { font-size:.78rem; color:var(--text-dim); margin-top:.4rem; }

  /* ── Card ── */
  .sf-card {
    background:var(--bg-card);
    border:1px solid var(--border);
    border-radius:24px;
    padding:2.2rem;
    position:relative; overflow:hidden;
    animation:sf-dropIn .45s ease both;
  }
  .sf-card::before {
    content:''; position:absolute; top:0;left:0;right:0; height:3px;
    background:linear-gradient(90deg,var(--accent),#8b5cf6,#06b6d4);
    border-radius:24px 24px 0 0;
  }
  .sf-card::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,.03) 0%,transparent 55%);
    pointer-events:none;
  }

  /* ── Field group ── */
  .sf-field { margin-bottom:1.5rem; }
  .sf-label {
    display:block; font-size:.74rem; font-weight:600; letter-spacing:.09em;
    text-transform:uppercase; color:var(--text-dim); margin-bottom:.55rem;
  }
  .sf-label span { color:#ef4444; margin-left:.2rem; }

  .sf-input, .sf-select, .sf-textarea {
    width:100%; padding:.8rem 1rem;
    border-radius:12px;
    background:var(--bg-main);
    border:1px solid var(--border);
    color:var(--text-main);
    font-family:'DM Sans',sans-serif; font-size:.9rem;
    transition:border-color .2s, box-shadow .2s;
    outline:none;
    appearance:none;
  }
  .sf-input:focus, .sf-select:focus, .sf-textarea:focus {
    border-color:var(--accent);
    box-shadow:0 0 0 3px var(--accent-glow);
  }
  .sf-input:disabled, .sf-select:disabled { opacity:.4; cursor:not-allowed; }
  .sf-select option { background:var(--bg-main); }
  .sf-textarea { min-height:100px; resize:vertical; line-height:1.6; }

  /* select arrow */
  .sf-select-wrap { position:relative; }
  .sf-select-wrap::after {
    content:''; position:absolute; right:1rem; top:50%; transform:translateY(-50%);
    width:0; height:0;
    border-left:5px solid transparent;
    border-right:5px solid transparent;
    border-top:5px solid var(--text-dim);
    pointer-events:none;
  }

  /* ── File drop zone ── */
  .sf-dropzone {
    border:2px dashed var(--border);
    border-radius:14px; padding:2rem 1.5rem;
    text-align:center; cursor:pointer;
    transition:all .2s ease;
    background:var(--bg-card);
    position:relative;
  }
  .sf-dropzone.dragging {
    border-color:var(--accent); background:var(--accent-glow);
    box-shadow:0 0 0 4px var(--accent-glow);
  }
  .sf-dropzone.has-file {
    border-color:rgba(16,185,129,.4); background:rgba(16,185,129,.06);
  }
  .sf-dropzone input[type="file"] {
    position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%;
  }
  .sf-drop-icon {
    width:44px; height:44px; border-radius:12px;
    background:var(--accent-glow); color:var(--accent);
    display:flex; align-items:center; justify-content:center;
    margin:0 auto .8rem;
  }
  .sf-drop-title { font-size:.9rem; font-weight:600; color:var(--text-main); margin-bottom:.25rem; }
  .sf-drop-sub   { font-size:.76rem; color:var(--text-dim); }
  .sf-drop-file  {
    display:flex; align-items:center; justify-content:center; gap:.6rem;
    font-size:.87rem; font-weight:600; color:#34d399;
  }

  /* ── Toggle ── */
  .sf-toggle-row {
    background:var(--bg-card);
    border:1px solid var(--border);
    border-radius:14px; padding:1.1rem 1.2rem;
    margin-bottom:1.5rem;
  }
  .sf-toggle-top {
    display:flex; align-items:center; gap:.9rem; cursor:pointer; user-select:none;
  }
  .sf-toggle-track {
    width:40px; height:22px; border-radius:99px; flex-shrink:0;
    position:relative; transition:background .25s;
  }
  .sf-toggle-thumb {
    width:16px; height:16px; border-radius:50%; background:white;
    position:absolute; top:3px; transition:left .25s;
    box-shadow:0 1px 4px rgba(0,0,0,.4);
  }
  .sf-toggle-label { font-size:.88rem; font-weight:600; color:var(--text-main); }
  .sf-toggle-hint  { font-size:.76rem; color:var(--text-dim); margin-top:.55rem; padding-left:3.1rem; line-height:1.5; }

  /* ── Divider ── */
  .sf-divider { border:none; border-top:1px solid rgba(255,255,255,.06); margin:1.8rem 0; }

  /* ── No-dept notice ── */
  .sf-no-dept {
    text-align:center; padding:1.5rem; border-radius:12px;
    background:var(--bg-card); border:1px dashed var(--border);
    color:var(--text-dim); font-size:.85rem;
  }
  .sf-no-dept strong { color:var(--text-main); }

  /* ── Submit btn ── */
  .sf-submit {
    width:100%; padding:1rem; border-radius:13px;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    background-size:200%;
    color:white; border:none;
    font-family:'Syne',sans-serif; font-size:1rem; font-weight:700;
    cursor:pointer; letter-spacing:.02em;
    transition:all .2s ease;
    box-shadow:0 4px 20px rgba(99,102,241,.4);
    display:flex; align-items:center; justify-content:center; gap:.6rem;
    animation:sf-gradShift 4s ease infinite;
  }
  .sf-submit:hover:not(:disabled) {
    transform:translateY(-2px);
    box-shadow:0 6px 28px rgba(99,102,241,.55);
    animation:sf-pulse 1.8s ease infinite, sf-gradShift 4s ease infinite;
  }
  .sf-submit:disabled {
    opacity:.6; cursor:not-allowed; transform:none;
    animation:sf-gradShift 4s ease infinite;
  }
  .sf-spinner {
    width:16px; height:16px; border:2px solid rgba(255,255,255,.3);
    border-top-color:#fff; border-radius:50%; animation:sf-spin .6s linear infinite;
  }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
const SubmitFile = ({ onBack }) => {
  const [formData, setFormData] = useState({ title: '', description: '', departmentId: '', assignedTo: '' });
  const [file, setFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [dynamicFields, setDynamicFields] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [useWorkflow, setUseWorkflow] = useState(true);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    approvalApi.getDepartments().then(res => setDepartments(res.data)).catch(console.error);
    approvalApi.getWorkflows().then(res => setTemplates(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (formData.departmentId) {
      approvalApi.getUsersByDepartment(formData.departmentId)
        .then(res => setUsers(res.data)).catch(console.error);
    } else { setUsers([]); }
  }, [formData.departmentId]);

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  const handleFile = (f) => {
    if (f) setFile(f);
  };

  const availableTemplates = templates.filter(t => t.isActive && (!t.department || t.department._id === formData.departmentId || t.department === formData.departmentId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select a file to upload.'); return; }
    if (useWorkflow && !selectedTemplateId) { setError('Please select a workflow template.'); return; }
    setSaving(true); setError(null);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('departmentId', formData.departmentId);
      data.append('assignedTo', formData.assignedTo);
      data.append('useWorkflow', useWorkflow);
      if (useWorkflow) {
        data.append('workflowTemplateId', selectedTemplateId);
        Object.entries(dynamicFields).forEach(([k, v]) => {
          data.append(k, v);
        });
      }
      data.append('file', file);
      await approvalApi.submitFile(data);
      if (onBack) onBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting file.');
    } finally { setSaving(false); }
  };

  const noDept = departments.length === 0;

  return (
    <div className="sf-root">
      {/* Back */}
      <button className="sf-back" onClick={onBack}>
        <Icon d="M19 12H5 M12 5l-7 7 7 7" size={13} /> Back
      </button>

      {/* Header */}
      <div className="sf-header">
        <div className="sf-eyebrow">Document Submission</div>
        <h2 className="sf-title">Submit New File</h2>
      </div>

      {/* Error */}
      {error && (
        <div className="sf-error">
          <span className="sf-error-icon"><Icon d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4 M12 16h.01" size={18} /></span>
          <div>
            <strong>Error:</strong> {error}
            {error.toLowerCase().includes('workflow') && (
              <div className="sf-error-hint">Ask an Admin to configure a workflow for this department in <strong>Admin › Workflows</strong>.</div>
            )}
          </div>
        </div>
      )}

      {/* Form card */}
      <form className="sf-card" onSubmit={handleSubmit}>

        {/* Title */}
        <div className="sf-field">
          <label className="sf-label">File Title <span>*</span></label>
          <input
            className="sf-input"
            placeholder="e.g. Q3 Budget Proposal"
            value={formData.title}
            onChange={e => set('title', e.target.value)}
            required
          />
        </div>

        {/* Department */}
        <div className="sf-field">
          <label className="sf-label">Department <span>*</span></label>
          <div className="sf-select-wrap">
            <select
              className="sf-select"
              value={formData.departmentId}
              onChange={e => set('departmentId', e.target.value)}
              required
            >
              <option value="">Select Department</option>
              {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>
        </div>

        {/* Workflow toggle */}
        <div className="sf-toggle-row">
          <div className="sf-toggle-top" onClick={() => setUseWorkflow(v => !v)}>
            <div className="sf-toggle-track" style={{ background: useWorkflow ? '#6366f1' : '#1e293b' }}>
              <div className="sf-toggle-thumb" style={{ left: useWorkflow ? '21px' : '3px' }} />
            </div>
            <span className="sf-toggle-label">Important Document — Use Multilevel Workflow</span>
          </div>
          <p className="sf-toggle-hint">
            {useWorkflow
              ? "This file will follow the department's standard multi-step approval chain."
              : 'This file will be sent directly to the assigned approver for single-level sign-off.'}
          </p>
        </div>

        {/* Workflow Template Selector */}
        {useWorkflow && (
          <div className="sf-field">
            <label className="sf-label">Workflow Template <span>*</span></label>
            <div className="sf-select-wrap">
              <select
                className="sf-select"
                value={selectedTemplateId}
                onChange={e => {
                  setSelectedTemplateId(e.target.value);
                  setDynamicFields({});
                }}
                required={useWorkflow}
              >
                <option value="">Select Workflow Template</option>
                {availableTemplates.map(t => (
                  <option key={t._id} value={t._id}>
                    {t.name} ({t.stages?.length || 0} stages)
                  </option>
                ))}
              </select>
            </div>
            {availableTemplates.length === 0 && formData.departmentId && (
              <span style={{ fontSize: '0.72rem', color: '#fca5a5', marginTop: '0.3rem', display: 'block' }}>
                No active templates found for this department. Create one in Workflow Configuration or turn off workflow routing.
              </span>
            )}
          </div>
        )}

        {/* Dynamic Condition Fields */}
        {useWorkflow && selectedTemplateId && (() => {
          const selectedTemplate = templates.find(t => t._id === selectedTemplateId);
          if (!selectedTemplate) return null;
          const conditionFields = [];
          selectedTemplate.stages.forEach(stage => {
            if (stage.type === 'conditional' && stage.rules?.conditionField) {
              conditionFields.push(stage.rules.conditionField);
            }
          });
          const uniqueFields = [...new Set(conditionFields)];
          if (uniqueFields.length === 0) return null;
          return (
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required Conditional Metadata</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {uniqueFields.map(field => (
                  <div key={field}>
                    <label className="sf-label">{field.charAt(0).toUpperCase() + field.slice(1)} <span>*</span></label>
                    <input
                      type="text"
                      className="sf-input"
                      placeholder={`Enter value for ${field}`}
                      value={dynamicFields[field] || ''}
                      onChange={e => setDynamicFields({ ...dynamicFields, [field]: e.target.value })}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Assign to */}
        <div className="sf-field">
          <label className="sf-label">
            {useWorkflow ? 'Assign to Level 1 Employee' : <>Assign to Approver <span>*</span></>}
          </label>
          <div className="sf-select-wrap">
            <select
              className="sf-select"
              value={formData.assignedTo}
              onChange={e => set('assignedTo', e.target.value)}
              disabled={!formData.departmentId}
              required={!useWorkflow}
            >
              <option value="">{formData.departmentId ? 'Select Employee' : 'Choose a department first'}</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name} — {u.role}</option>)}
            </select>
          </div>
        </div>

        {/* File upload */}
        <div className="sf-field">
          <label className="sf-label">Attachment <span>*</span></label>
          <div
            className={`sf-dropzone${dragging ? ' dragging' : ''}${file ? ' has-file' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={e => handleFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
            {file ? (
              <div className="sf-drop-file">
                <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" size={18} />
                {file.name}
                <span style={{ color:'#475569', fontWeight:400, fontSize:'.75rem' }}>
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
            ) : (
              <>
                <div className="sf-drop-icon">
                  <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" size={20} />
                </div>
                <div className="sf-drop-title">Drop file here or click to browse</div>
                <div className="sf-drop-sub">PDF, Word, JPG, PNG accepted</div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="sf-field" style={{ marginBottom: '2rem' }}>
          <label className="sf-label">Description</label>
          <textarea
            className="sf-textarea"
            placeholder="Briefly describe the purpose of this document…"
            value={formData.description}
            onChange={e => set('description', e.target.value)}
          />
        </div>

        <hr className="sf-divider" />

        {/* Submit */}
        {noDept ? (
          <div className="sf-no-dept">
            No departments found. Please create one in <strong>Admin › Departments</strong> first.
          </div>
        ) : (
          <button type="submit" className="sf-submit" disabled={saving}>
            {saving
              ? <><span className="sf-spinner" /> Submitting…</>
              : <><Icon d="M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z" size={16} /> Submit for Approval</>
            }
          </button>
        )}
      </form>
    </div>
  );
};

export default SubmitFile;