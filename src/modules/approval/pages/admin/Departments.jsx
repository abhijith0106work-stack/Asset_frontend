import React, { useState, useEffect } from 'react';
import { approvalApi } from '../../api/approvalApi';

const Departments = () => {
  const [depts, setDepts] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptRes, userRes] = await Promise.all([
        approvalApi.getDepartments(),
        approvalApi.getAllUsers()
      ]);
      setDepts(deptRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await approvalApi.createDepartment({ name });
      setName('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating department');
    }
  };

  const currentUser = JSON.parse(localStorage.getItem('user'));

  const handleUpdateHoD = async (deptId, userId) => {
    try {
      await approvalApi.updateDepartment(deptId, { headOfDepartment: userId });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating Head of Department');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) return;
    try {
      await approvalApi.deleteDepartment(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting department');
    }
  };

  return (
    <div className="dept-root">
      <style>{`
        .dept-root { padding: 2rem 0; color: var(--text-main); }
        .dept-header { margin-bottom: 2.5rem; animation: deptFadeUp .4s ease; }
        .dept-title { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; }
        .dept-subtitle { color: var(--text-dim); font-size: 0.9rem; }

        .dept-form-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 20px; padding: 1.5rem; margin-bottom: 3rem;
          display: flex; gap: 1rem; align-items: center;
          animation: deptFadeUp .4s .1s ease both;
        }
        .dept-input {
          flex: 1; padding: 0.8rem 1.2rem; border-radius: 12px;
          background: var(--bg-main); border: 1px solid var(--border);
          color: var(--text-main); outline: none; transition: all .2s;
        }
        .dept-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
        .dept-add-btn {
          background: var(--accent); color: white; border: none;
          padding: 0.8rem 2rem; border-radius: 12px; font-weight: 700;
          cursor: pointer; transition: all .2s;
        }
        .dept-add-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px var(--accent-glow); }

        .dept-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem; animation: deptFadeUp .4s .2s ease both;
        }
        .dept-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 24px; padding: 1.8rem; position: relative;
          transition: all .2s ease;
        }
        .dept-card:hover { border-color: var(--accent); transform: translateY(-3px); }
        .dept-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
        .dept-card-title { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 700; }
        
        .hod-section { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }
        .hod-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.5rem; display: block; letter-spacing: 0.05em; }
        .hod-select {
          width: 100%; padding: 0.6rem; border-radius: 8px;
          background: var(--bg-main); border: 1px solid var(--border);
          color: var(--text-main); font-size: 0.85rem; outline: none;
        }
        .hod-select:focus { border-color: var(--accent); }

        .dept-badge {
          display: inline-block; padding: 0.2rem 0.6rem; border-radius: 6px;
          font-size: 0.7rem; font-weight: 700; background: var(--accent-glow); color: var(--accent);
          margin-bottom: 0.5rem;
        }

        .dept-del-btn {
          background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);
          width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s; font-size: 1.1rem;
        }
        .dept-del-btn:hover { background: #ef4444; color: white; transform: scale(1.1); }

        @keyframes deptFadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="dept-header">
        <h2 className="dept-title">Departments</h2>
        <p className="dept-subtitle">Manage organizational units and assign Department Heads</p>
      </div>

      <form className="dept-form-card" onSubmit={handleCreate}>
        <input 
          className="dept-input"
          placeholder="Enter new department name..."
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button type="submit" className="dept-add-btn">Create Department</button>
      </form>

      {loading ? (
        <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '4rem' }}>Loading departments...</div>
      ) : (
        <div className="dept-grid">
          {depts.map(d => (
            <div key={d._id} className="dept-card">
              <div className="dept-card-top">
                <div>
                  <span className="dept-badge">Active Unit</span>
                  <div className="dept-card-title">{d.name}</div>
                </div>
                {currentUser?.role === 'Super Admin' && (
                  <button className="dept-del-btn" title="Delete Department" onClick={() => handleDelete(d._id)}>×</button>
                )}
              </div>
              
              <div className="hod-section">
                <label className="hod-label">Head of Department</label>
                <select 
                  className="hod-select"
                  value={d.headOfDepartment?._id || ''}
                  onChange={(e) => handleUpdateHoD(d._id, e.target.value)}
                >
                  <option value="">No HoD Assigned</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          {depts.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
              No departments created yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Departments;
