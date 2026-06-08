import React, { useState, useEffect } from 'react';
import { approvalApi } from '../../api/approvalApi';

const Workflows = () => {
  const [workflows, setWorkflows] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('list'); // 'list' or 'editor'
  
  // Editor State
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [templateDept, setTemplateDept] = useState('');
  const [stages, setStages] = useState([]);

  // System Roles list for dropdowns
  const SYSTEM_ROLES = ['Super Admin', 'Admin', 'Company Admin', 'Head of Department', 'Employee'];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [wfRes, deptRes, userRes] = await Promise.all([
        approvalApi.getWorkflows(),
        approvalApi.getDepartments(),
        approvalApi.getAllUsers()
      ]);
      setWorkflows(wfRes.data);
      setDepartments(deptRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const startNewTemplate = () => {
    setEditingTemplateId(null);
    setTemplateName('');
    setTemplateDesc('');
    setTemplateDept('');
    setStages([
      {
        name: 'Initial Review',
        type: 'sequential',
        stepNumber: 1,
        approvers: [{ approverType: 'user', user: '', department: '', role: '' }],
        minApprovalsRequired: 1,
        rules: { conditionField: '', conditionOperator: '==', conditionValue: '', skipIfFalse: true },
        escalationTimeLimit: 0,
        escalateTo: ''
      }
    ]);
    setActiveView('editor');
  };

  const startEditTemplate = (wf) => {
    setEditingTemplateId(wf._id);
    setTemplateName(wf.name);
    setTemplateDesc(wf.description || '');
    setTemplateDept(wf.department?._id || wf.department || '');
    
    // Format stages to match editor structure
    const formattedStages = wf.stages.map((stage, idx) => ({
      name: stage.name,
      type: stage.type,
      stepNumber: stage.stepNumber || (idx + 1),
      approvers: stage.approvers.map(app => ({
        approverType: app.approverType,
        user: app.user?._id || app.user || '',
        department: app.department?._id || app.department || '',
        role: app.role || ''
      })),
      minApprovalsRequired: stage.minApprovalsRequired || 1,
      rules: {
        conditionField: stage.rules?.conditionField || '',
        conditionOperator: stage.rules?.conditionOperator || '==',
        conditionValue: stage.rules?.conditionValue || '',
        skipIfFalse: stage.rules?.skipIfFalse !== false
      },
      escalationTimeLimit: stage.escalationTimeLimit || 0,
      escalateTo: stage.escalateTo?._id || stage.escalateTo || ''
    }));

    setStages(formattedStages.length > 0 ? formattedStages : [
      {
        name: 'Initial Review',
        type: 'sequential',
        stepNumber: 1,
        approvers: [{ approverType: 'user', user: '', department: '', role: '' }],
        minApprovalsRequired: 1,
        rules: { conditionField: '', conditionOperator: '==', conditionValue: '', skipIfFalse: true },
        escalationTimeLimit: 0,
        escalateTo: ''
      }
    ]);
    setActiveView('editor');
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure you want to delete/deactivate this workflow template?')) return;
    try {
      await approvalApi.deleteWorkflow(id);
      fetchInitialData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting template');
    }
  };

  const addStage = () => {
    setStages([
      ...stages,
      {
        name: `Stage ${stages.length + 1}`,
        type: 'sequential',
        stepNumber: stages.length + 1,
        approvers: [{ approverType: 'user', user: '', department: '', role: '' }],
        minApprovalsRequired: 1,
        rules: { conditionField: '', conditionOperator: '==', conditionValue: '', skipIfFalse: true },
        escalationTimeLimit: 0,
        escalateTo: ''
      }
    ]);
  };

  const removeStage = (idx) => {
    const updated = stages.filter((_, i) => i !== idx).map((stage, i) => ({
      ...stage,
      stepNumber: i + 1
    }));
    setStages(updated);
  };

  const moveStage = (idx, direction) => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === stages.length - 1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...stages];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    
    // Recalculate step numbers
    const final = updated.map((stage, i) => ({
      ...stage,
      stepNumber: i + 1
    }));
    setStages(final);
  };

  const updateStageField = (stageIdx, field, val) => {
    const updated = [...stages];
    updated[stageIdx] = { ...updated[stageIdx], [field]: val };
    setStages(updated);
  };

  const updateStageRules = (stageIdx, field, val) => {
    const updated = [...stages];
    updated[stageIdx].rules = { ...updated[stageIdx].rules, [field]: val };
    setStages(updated);
  };

  const addApprover = (stageIdx) => {
    const updated = [...stages];
    updated[stageIdx].approvers = [
      ...updated[stageIdx].approvers,
      { approverType: 'user', user: '', department: '', role: '' }
    ];
    setStages(updated);
  };

  const removeApprover = (stageIdx, appIdx) => {
    const updated = [...stages];
    updated[stageIdx].approvers = updated[stageIdx].approvers.filter((_, i) => i !== appIdx);
    setStages(updated);
  };

  const updateApprover = (stageIdx, appIdx, field, val) => {
    const updated = [...stages];
    updated[stageIdx].approvers[appIdx] = {
      ...updated[stageIdx].approvers[appIdx],
      [field]: val
    };
    setStages(updated);
  };

  const handleSave = async () => {
    if (!templateName.trim()) return alert('Template Name is required');
    if (stages.length === 0) return alert('At least one approval stage is required');

    // Validation
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      if (!stage.name.trim()) return alert(`Stage ${i+1} Name is required`);
      if (stage.approvers.length === 0) return alert(`Stage "${stage.name}" requires at least one approver`);
      
      for (let j = 0; j < stage.approvers.length; j++) {
        const app = stage.approvers[j];
        if (app.approverType === 'user' && !app.user) return alert(`Select a user for approver ${j+1} in stage "${stage.name}"`);
        if (app.approverType === 'department' && !app.department) return alert(`Select a department for approver ${j+1} in stage "${stage.name}"`);
        if (app.approverType === 'role' && !app.role) return alert(`Enter or select a role for approver ${j+1} in stage "${stage.name}"`);
      }
    }

    const payload = {
      name: templateName,
      description: templateDesc,
      department: templateDept || null,
      stages: stages.map(s => ({
        ...s,
        minApprovalsRequired: s.type === 'parallel' ? Number(s.minApprovalsRequired || 1) : 1,
        escalationTimeLimit: Number(s.escalationTimeLimit || 0),
        escalateTo: s.escalateTo || null,
        rules: s.type === 'conditional' ? s.rules : undefined
      }))
    };

    setLoading(true);
    try {
      if (editingTemplateId) {
        await approvalApi.updateWorkflow(editingTemplateId, payload);
        alert('Workflow template updated successfully!');
      } else {
        await approvalApi.createWorkflow(payload);
        alert('Workflow template created successfully!');
      }
      setActiveView('list');
      fetchInitialData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving workflow template');
      setLoading(false);
    }
  };

  if (activeView === 'editor') {
    return (
      <div className="wf-builder-container" style={{ animation: 'fadeUp 0.4s ease both' }}>
        <button className="wf-back-btn" onClick={() => setActiveView('list')}>
          ← Back to Templates
        </button>

        <div className="wf-form-card">
          <div className="wf-form-header">
            <h2 className="wf-form-title">{editingTemplateId ? 'Edit Workflow Template' : 'Create Workflow Template'}</h2>
            <p className="wf-form-subtitle">Configure approval levels, routing criteria, and timers</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="wf-input-label">Template Name *</label>
                <input 
                  type="text" 
                  value={templateName} 
                  onChange={e => setTemplateName(e.target.value)}
                  placeholder="e.g. Procurement Validation Chain"
                  className="wf-input-text"
                />
              </div>
              <div>
                <label className="wf-input-label">Department Scope (Optional)</label>
                <select 
                  value={templateDept} 
                  onChange={e => setTemplateDept(e.target.value)}
                  className="wf-select-field"
                >
                  <option value="">Global / All Departments</option>
                  {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                  If left empty, this template can be selected by any department.
                </span>
              </div>
            </div>

            <div>
              <label className="wf-input-label">Description</label>
              <textarea 
                value={templateDesc} 
                onChange={e => setTemplateDesc(e.target.value)}
                placeholder="Describe the usage or triggers of this template..."
                className="wf-textarea-field"
                rows="2"
              />
            </div>
          </div>

          {/* Stages Builder */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 700 }}>Workflow Stages</h3>
              <button onClick={addStage} className="wf-add-stage-btn">+ Add Approval Stage</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {stages.map((stage, sIdx) => (
                <div key={sIdx} className="wf-stage-card">
                  
                  {/* Stage Header Controls */}
                  <div className="wf-stage-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span className="wf-stage-badge">Step {stage.stepNumber}</span>
                      <input 
                        type="text" 
                        value={stage.name} 
                        onChange={e => updateStageField(sIdx, 'name', e.target.value)}
                        placeholder="Stage Name (e.g. Finance Clearance)"
                        className="wf-stage-title-input"
                      />
                    </div>
                    <div className="wf-stage-controls">
                      <button disabled={sIdx === 0} onClick={() => moveStage(sIdx, 'up')} className="wf-icon-btn" title="Move Up">▲</button>
                      <button disabled={sIdx === stages.length - 1} onClick={() => moveStage(sIdx, 'down')} className="wf-icon-btn" title="Move Down">▼</button>
                      <button onClick={() => removeStage(sIdx)} className="wf-icon-btn delete" title="Remove Stage">✕</button>
                    </div>
                  </div>

                  {/* Stage Settings Grid */}
                  <div className="wf-stage-grid">
                    <div>
                      <label className="wf-input-label">Routing Type</label>
                      <select 
                        value={stage.type} 
                        onChange={e => updateStageField(sIdx, 'type', e.target.value)}
                        className="wf-select-field"
                      >
                        <option value="sequential">Sequential (All review in order)</option>
                        <option value="parallel">Parallel (All review at once)</option>
                        <option value="optional">Optional (Any one approver suffices)</option>
                        <option value="conditional">Conditional (Runs only if rules met)</option>
                      </select>
                    </div>

                    {stage.type === 'parallel' && (
                      <div>
                        <label className="wf-input-label">Min Approvals Required</label>
                        <input 
                          type="number" 
                          min="1" 
                          max={stage.approvers.length}
                          value={stage.minApprovalsRequired}
                          onChange={e => updateStageField(sIdx, 'minApprovalsRequired', Math.max(1, Number(e.target.value)))}
                          className="wf-input-text"
                        />
                      </div>
                    )}

                    {/* Conditional Rules Section */}
                    {stage.type === 'conditional' && (
                      <div style={{ gridColumn: 'span 2', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.8rem' }}>Condition Rule Setup</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr 120px', gap: '0.8rem', alignItems: 'center' }}>
                          <div>
                            <input 
                              type="text" 
                              placeholder="Field Name (e.g. amount)"
                              value={stage.rules?.conditionField || ''} 
                              onChange={e => updateStageRules(sIdx, 'conditionField', e.target.value)}
                              className="wf-input-text"
                              style={{ padding: '0.55rem' }}
                            />
                          </div>
                          <div>
                            <select 
                              value={stage.rules?.conditionOperator || '=='} 
                              onChange={e => updateStageRules(sIdx, 'conditionOperator', e.target.value)}
                              className="wf-select-field"
                              style={{ padding: '0.55rem' }}
                            >
                              <option value="==">==</option>
                              <option value=">">&gt;</option>
                              <option value="<">&lt;</option>
                            </select>
                          </div>
                          <div>
                            <input 
                              type="text" 
                              placeholder="Value (e.g. 5000)"
                              value={stage.rules?.conditionValue || ''} 
                              onChange={e => updateStageRules(sIdx, 'conditionValue', e.target.value)}
                              className="wf-input-text"
                              style={{ padding: '0.55rem' }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <input 
                              type="checkbox" 
                              checked={stage.rules?.skipIfFalse !== false} 
                              onChange={e => updateStageRules(sIdx, 'skipIfFalse', e.target.checked)}
                              id={`skip-${sIdx}`}
                            />
                            <label htmlFor={`skip-${sIdx}`} style={{ fontSize: '0.75rem', cursor: 'pointer' }}>Skip if False</label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Approvers Config */}
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                        <label className="wf-input-label" style={{ margin: 0 }}>Approver List</label>
                        <button onClick={() => addApprover(sIdx)} className="wf-add-approver-btn">+ Add Approver</button>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {stage.approvers.map((app, aIdx) => (
                          <div key={aIdx} style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: '0.8rem', alignItems: 'center', background: 'var(--bg-main)', padding: '0.6rem 0.8rem', borderRadius: '10px' }}>
                            <select 
                              value={app.approverType} 
                              onChange={e => updateApprover(sIdx, aIdx, 'approverType', e.target.value)}
                              className="wf-select-field"
                              style={{ padding: '0.5rem' }}
                            >
                              <option value="user">Specific User</option>
                              <option value="department">Department Head</option>
                              <option value="role">Role-Based</option>
                            </select>

                            {app.approverType === 'user' && (
                              <select 
                                value={app.user} 
                                onChange={e => updateApprover(sIdx, aIdx, 'user', e.target.value)}
                                className="wf-select-field"
                                style={{ padding: '0.5rem' }}
                              >
                                <option value="">-- Choose User --</option>
                                {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                              </select>
                            )}

                            {app.approverType === 'department' && (
                              <select 
                                value={app.department} 
                                onChange={e => updateApprover(sIdx, aIdx, 'department', e.target.value)}
                                className="wf-select-field"
                                style={{ padding: '0.5rem' }}
                              >
                                <option value="">-- Choose Department --</option>
                                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                              </select>
                            )}

                            {app.approverType === 'role' && (
                              <select 
                                value={app.role} 
                                onChange={e => updateApprover(sIdx, aIdx, 'role', e.target.value)}
                                className="wf-select-field"
                                style={{ padding: '0.5rem' }}
                              >
                                <option value="">-- Choose Role --</option>
                                {SYSTEM_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                            )}

                            <button 
                              disabled={stage.approvers.length <= 1}
                              onClick={() => removeApprover(sIdx, aIdx)} 
                              className="wf-remove-app-btn"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SLA Escalation */}
                    <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <div>
                        <label className="wf-input-label">SLA Time Limit (Hours, 0 for None)</label>
                        <input 
                          type="number" 
                          min="0"
                          value={stage.escalationTimeLimit}
                          onChange={e => updateStageField(sIdx, 'escalationTimeLimit', Math.max(0, Number(e.target.value)))}
                          className="wf-input-text"
                          placeholder="e.g. 24"
                        />
                      </div>
                      <div>
                        <label className="wf-input-label">Escalate To (Breach Target User)</label>
                        <select 
                          value={stage.escalateTo} 
                          onChange={e => updateStageField(sIdx, 'escalateTo', e.target.value)}
                          className="wf-select-field"
                          disabled={!stage.escalationTimeLimit}
                        >
                          <option value="">-- Select Escalator --</option>
                          {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                        </select>
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSave} className="wf-save-btn">
            Confirm and Save Template
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wf-root-container">
      <style>{`
        .wf-root-container { padding: 1.5rem 0; color: var(--text-main); }
        
        .wf-dashboard-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 2rem; animation: fadeUp .4s ease;
        }
        .wf-title { font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800; }
        .wf-subtitle { color: var(--text-dim); font-size: 0.85rem; margin-top: 0.2rem; }
        
        .wf-create-btn {
          padding: 0.65rem 1.25rem; border-radius: 12px; border: none; cursor: pointer;
          background: linear-gradient(135deg, var(--accent), #8b5cf6); color: white;
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600;
          box-shadow: 0 4px 15px var(--accent-glow); transition: all 0.2s;
        }
        .wf-create-btn:hover { transform: translateY(-1.5px); box-shadow: 0 6px 20px var(--accent-glow); }

        .wf-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem; animation: fadeUp .4s .1s both;
        }
        
        .wf-template-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 20px; padding: 1.5rem; display: flex; flex-direction: column;
          justify-content: space-between; min-height: 200px; transition: all 0.25s ease;
        }
        .wf-template-card:hover {
          transform: translateY(-3px); border-color: var(--accent);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }
        
        .wf-temp-title { font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 700; color: var(--text-main); }
        .wf-temp-dept { font-size: 0.72rem; color: var(--accent); font-weight: 600; text-transform: uppercase; margin-bottom: 0.65rem; }
        .wf-temp-desc { font-size: 0.83rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.2rem; flex-grow: 1; }
        
        .wf-temp-stats {
          display: flex; gap: 1rem; border-top: 1px solid var(--border);
          padding-top: 0.9rem; margin-top: auto; font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--text-dim);
        }

        .wf-temp-actions { display: flex; gap: 0.5rem; margin-top: 1.2rem; }
        .wf-temp-act-btn {
          flex: 1; padding: 0.45rem; font-size: 0.75rem; font-weight: 600;
          border-radius: 8px; cursor: pointer; text-align: center; font-family: 'DM Sans', sans-serif;
        }
        .wf-temp-act-btn.edit { background: var(--border-light); border: 1px solid var(--border); color: var(--text-main); }
        .wf-temp-act-btn.edit:hover { background: var(--border); }
        .wf-temp-act-btn.del { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: #fca5a5; }
        .wf-temp-act-btn.del:hover { background: rgba(239,68,68,0.18); }

        /* EDITOR STYLING */
        .wf-builder-container { max-width: 900px; margin: 0 auto; }
        .wf-back-btn {
          background: transparent; border: 1px solid var(--border); color: var(--text-dim);
          padding: 0.5rem 1rem; borderRadius: 10px; cursor: pointer; font-size: 0.8rem;
          margin-bottom: 1.5rem; transition: all 0.2s;
        }
        .wf-back-btn:hover { background: var(--border-light); color: var(--text-main); }
        
        .wf-form-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 24px; padding: 2.2rem; position: relative;
        }
        .wf-form-card::before {
          content: ''; position: absolute; top:0; left:0; right:0; height:3px;
          background: linear-gradient(90deg, var(--accent), #8b5cf6); border-radius: 24px 24px 0 0;
        }
        
        .wf-form-header { margin-bottom: 2rem; }
        .wf-form-title { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; }
        .wf-form-subtitle { color: var(--text-dim); font-size: 0.83rem; margin-top: 0.2rem; }
        
        .wf-input-label {
          display: block; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.5rem;
        }
        .wf-input-text, .wf-select-field, .wf-textarea-field {
          width: 100%; padding: 0.75rem 0.95rem; border-radius: 10px;
          background: var(--bg-main); border: 1px solid var(--border);
          color: var(--text-main); font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
          outline: none; transition: all 0.2s;
        }
        .wf-input-text:focus, .wf-select-field:focus, .wf-textarea-field:focus {
          border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow);
        }
        .wf-textarea-field { resize: vertical; }
        
        .wf-add-stage-btn {
          padding: 0.5rem 1rem; border-radius: 10px; border: 1px solid var(--accent);
          background: var(--accent-glow); color: var(--accent); font-weight: 600;
          font-size: 0.78rem; cursor: pointer; transition: all 0.2s;
        }
        .wf-add-stage-btn:hover { background: rgba(99,102,241,0.2); }
        
        .wf-stage-card {
          background: var(--bg-main); border: 1px solid var(--border);
          border-radius: 18px; padding: 1.5rem; position: relative;
        }
        
        .wf-stage-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 1.25rem; padding-bottom: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .wf-stage-badge {
          padding: 0.22rem 0.55rem; border-radius: 6px; background: var(--accent-glow);
          color: var(--accent); font-family: 'DM Mono', monospace; font-size: 0.7rem; font-weight: 700;
        }
        .wf-stage-title-input {
          background: transparent; border: none; color: var(--text-main);
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem;
          outline: none; width: 220px; border-bottom: 1px dashed transparent;
        }
        .wf-stage-title-input:focus { border-bottom-color: var(--accent); }
        
        .wf-stage-controls { display: flex; gap: 0.3rem; }
        .wf-icon-btn {
          width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border);
          background: var(--bg-card); color: var(--text-dim); font-size: 0.7rem;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .wf-icon-btn:hover:not(:disabled) { background: var(--border-light); color: var(--text-main); }
        .wf-icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .wf-icon-btn.delete:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.2); color: #ef4444; }

        .wf-stage-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
        
        .wf-add-approver-btn {
          background: transparent; border: none; color: var(--accent); font-size: 0.72rem;
          font-weight: 600; cursor: pointer; text-decoration: underline;
        }
        .wf-add-approver-btn:hover { color: #818cf8; }
        
        .wf-remove-app-btn {
          background: transparent; border: none; color: var(--text-muted); cursor: pointer;
          font-size: 0.8rem; padding: 0.2rem;
        }
        .wf-remove-app-btn:hover:not(:disabled) { color: #ef4444; }
        .wf-remove-app-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .wf-save-btn {
          width: 100%; padding: 1rem; border-radius: 12px; border: none; cursor: pointer;
          background: linear-gradient(135deg, var(--accent), #8b5cf6); color: white;
          font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700;
          box-shadow: 0 4px 18px var(--accent-glow); transition: all 0.2s;
        }
        .wf-save-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px var(--accent-glow); }
      `}</style>

      {/* DASHBOARD HEADER */}
      <div className="wf-dashboard-header">
        <div>
          <h2 className="wf-title">Workflow Configuration</h2>
          <p className="wf-subtitle">Define and organize document routing templates and approval requirements</p>
        </div>
        <button className="wf-create-btn" onClick={startNewTemplate}>
          + New Template
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {[1,2,3].map(i => (
            <div key={i} className="ap-shimmer" style={{ height: '200px', width: '100%', borderRadius: '20px' }} />
          ))}
        </div>
      ) : workflows.length === 0 ? (
        <div className="ap-activity-empty">
          <div className="ap-activity-empty-icon">⚙️</div>
          <div className="ap-activity-empty-text">No workflow templates created yet. Get started by creating one!</div>
        </div>
      ) : (
        <div className="wf-grid">
          {workflows.map(wf => (
            <div key={wf._id} className="wf-template-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="wf-temp-dept">
                    {wf.department?.name || wf.department || 'Global'}
                  </span>
                  <span style={{ fontSize: '0.62rem', background: wf.isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: wf.isActive ? '#10b981' : '#ef4444', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                    {wf.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <h3 className="wf-temp-title">{wf.name}</h3>
                <p className="wf-temp-desc">{wf.description || 'No description provided.'}</p>
              </div>
              
              <div>
                <div className="wf-temp-stats">
                  <span>Stages: <strong>{wf.stages?.length || 0}</strong></span>
                  <span>Step Type: <strong>{wf.stages?.[0]?.type || 'N/A'}</strong></span>
                </div>

                <div className="wf-temp-actions">
                  <button onClick={() => startEditTemplate(wf)} className="wf-temp-act-btn edit">Configure</button>
                  <button onClick={() => handleDeactivate(wf._id)} className="wf-temp-act-btn del">Deactivate</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workflows;
