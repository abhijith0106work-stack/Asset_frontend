// src/modules/departments/DepartmentOverview.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const authCfg = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const DepartmentOverview = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/dashboard/departments`, authCfg());
        setDepartments(res.data || []);
      } catch (err) {
        console.error('Error fetching department overview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const totalSum = (key) => departments.reduce((acc, curr) => acc + (curr[key] || 0), 0);

  return (
    <>
      <style>{`
        .dept-overview {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          margin-top: 1rem;
        }
        .dept-header {
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 1rem;
        }
        .dept-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .dept-subtitle {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }
        .dept-stats-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .dept-stats-mini {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
        }
        .dept-stats-label {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        .dept-stats-val {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: 'DM Mono', monospace;
          color: var(--text-main);
        }
        .dept-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .dept-card {
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1.5rem;
          position: relative;
          transition: all 0.25s ease;
          overflow: hidden;
        }
        .dept-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.25);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.04);
        }
        .dept-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #06b6d4);
        }
        .dept-card-name {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 1rem;
        }
        .dept-metric-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .dept-metric-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
        }
        .dept-metric-lbl {
          color: var(--text-dim);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .dept-metric-val {
          font-family: 'DM Mono', monospace;
          font-weight: 600;
          color: var(--text-main);
        }
        .dept-progress-container {
          height: 4px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 0.25rem;
        }
        .dept-progress-bar {
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, #6366f1, #06b6d4);
        }
        @media (max-width: 768px) {
          .dept-stats-bar {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="dept-overview">
        <div className="dept-header">
          <h3 className="dept-title">Department Overview</h3>
          <div className="dept-subtitle">Per-department breakdown of company assets, active members, open tickets, and fleet vehicles.</div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading departments...</div>
        ) : departments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No departments found in the system.</div>
        ) : (
          <>
            <div className="dept-stats-bar">
              <div className="dept-stats-mini">
                <div className="dept-stats-label">Total Departments</div>
                <div className="dept-stats-val">{departments.length}</div>
              </div>
              <div className="dept-stats-mini">
                <div className="dept-stats-label">Allocated Assets</div>
                <div className="dept-stats-val">{totalSum('assets')}</div>
              </div>
              <div className="dept-stats-mini">
                <div className="dept-stats-label">Active Users</div>
                <div className="dept-stats-val">{totalSum('members')}</div>
              </div>
              <div className="dept-stats-mini">
                <div className="dept-stats-label">Open Tickets</div>
                <div className="dept-stats-val">{totalSum('openTickets')}</div>
              </div>
            </div>

            <div className="dept-grid">
              {departments.map(dept => {
                const maxAssets = Math.max(...departments.map(d => d.assets || 1));
                const percentage = Math.min(100, Math.round(((dept.assets || 0) / maxAssets) * 100));

                return (
                  <div key={dept._id} className="dept-card">
                    <h4 className="dept-card-name">{dept.name}</h4>
                    <div className="dept-metric-list">
                      <div>
                        <div className="dept-metric-item">
                          <span className="dept-metric-lbl">◈ Assigned Assets</span>
                          <span className="dept-metric-val">{dept.assets || 0}</span>
                        </div>
                        <div className="dept-progress-container">
                          <div className="dept-progress-bar" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>

                      <div className="dept-metric-item">
                        <span className="dept-metric-lbl">◎ Open Tickets</span>
                        <span className="dept-metric-val" style={{ color: (dept.openTickets || 0) > 0 ? '#f87171' : 'var(--text-dim)' }}>
                          {dept.openTickets || 0}
                        </span>
                      </div>

                      <div className="dept-metric-item">
                        <span className="dept-metric-lbl">🚗 Fleet Vehicles</span>
                        <span className="dept-metric-val">{dept.vehicles || 0}</span>
                      </div>

                      <div className="dept-metric-item">
                        <span className="dept-metric-lbl">◉ Team Members</span>
                        <span className="dept-metric-val">{dept.members || 0}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DepartmentOverview;
