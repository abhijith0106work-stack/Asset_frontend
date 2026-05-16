import React, { useState, useEffect } from 'react';
import { approvalApi } from '../../api/approvalApi';

const Workflows = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [levelCount, setLevelCount] = useState(3);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    approvalApi.getDepartments().then(res => setDepartments(res.data)).catch(console.error);
  }, []);

  const handleSave = async () => {
    if (!selectedDept) return alert('Select a department');
    setSaving(true);
    try {
      const levels = Array.from({ length: levelCount }, (_, i) => ({
        levelNumber: i + 1,
        levelName: `Level ${i + 1} Approval`
      }));
      await approvalApi.saveWorkflow({ departmentId: selectedDept, levelCount, levels });
      alert('Workflow saved successfully!');
    } catch (err) { 
      alert(err.response?.data?.message || 'Error saving workflow'); 
    }
    finally { setSaving(false); }
  };

  return (
    <div className="wf-root">
      <style>{`
        .wf-root { padding: 2rem 0; color: var(--text-main); max-width: 800px; margin: 0 auto; }
        .wf-header { text-align: center; margin-bottom: 3rem; animation: wfFadeUp .4s ease; }
        .wf-title { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; }
        .wf-subtitle { color: var(--text-dim); font-size: 0.9rem; }

        .wf-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 24px; padding: 2.5rem;
          animation: wfFadeUp .4s .1s ease both;
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
        }

        .wf-field { margin-bottom: 2rem; }
        .wf-label { display: block; margin-bottom: 0.75rem; color: var(--text-dim); font-size: 0.85rem; font-weight: 600; letter-spacing: 0.02em; }
        .wf-select {
          width: 100%; padding: 0.9rem 1.2rem; border-radius: 12px;
          background: var(--bg-main); border: 1px solid var(--border);
          color: var(--text-main); font-size: 0.95rem; outline: none; transition: all .2s;
        }
        .wf-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }

        .wf-range-wrap { margin-bottom: 2.5rem; }
        .wf-range-val { color: var(--accent); font-weight: 800; font-size: 1.2rem; }
        .wf-range { width: 100%; accent-color: var(--accent); cursor: pointer; }
        .wf-range-labels { display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-muted); }

        .wf-stages { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 2.5rem; }
        .wf-stage {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem; background: var(--bg-main); border: 1px solid var(--border);
          border-radius: 14px; animation: wfFadeUp .3s ease both;
        }
        .wf-stage-num {
          width: 32px; height: 32px; border-radius: 50%; background: var(--accent);
          color: white; display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 800; flex-shrink: 0;
        }
        .wf-stage-name { font-size: 0.9rem; font-weight: 600; color: var(--text-main); }

        .wf-save-btn {
          width: 100%; padding: 1.1rem; border-radius: 14px;
          background: var(--accent); color: white; border: none;
          font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700;
          cursor: pointer; transition: all .2s;
          box-shadow: 0 4px 20px var(--accent-glow);
        }
        .wf-save-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 24px var(--accent-glow); }
        .wf-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        @keyframes wfFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="wf-header">
        <h2 className="wf-title">Workflow Configuration</h2>
        <p className="wf-subtitle">Define approval chains and validation stages for each department</p>
      </div>

      <div className="wf-card">
        <div className="wf-field">
          <label className="wf-label">Select Department</label>
          <select 
            className="wf-select"
            value={selectedDept} 
            onChange={e => setSelectedDept(e.target.value)}
          >
            <option value="">-- Choose Unit --</option>
            {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>

        <div className="wf-range-wrap">
          <label className="wf-label">
            Approval Stages: <span className="wf-range-val">{levelCount}</span>
          </label>
          <input 
            type="range" min="1" max="5" 
            className="wf-range"
            value={levelCount} 
            onChange={e => setLevelCount(parseInt(e.target.value))}
          />
          <div className="wf-range-labels">
            <span>Simple (1)</span>
            <span>Complex (5)</span>
          </div>
        </div>

        <div className="wf-stages">
          {Array.from({ length: levelCount }).map((_, i) => (
            <div key={i} className="wf-stage" style={{ animationDelay: (i * 0.05) + 's' }}>
              <div className="wf-stage-num">{i + 1}</div>
              <div className="wf-stage-name">Stage {i + 1} Validation</div>
            </div>
          ))}
        </div>

        <button 
          className="wf-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving Changes...' : 'Confirm Workflow Setup'}
        </button>
      </div>
    </div>
  );
};

export default Workflows;
