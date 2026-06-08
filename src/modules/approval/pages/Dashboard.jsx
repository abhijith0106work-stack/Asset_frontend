import React, { useState, useEffect } from 'react';
import { approvalApi } from '../api/approvalApi';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';

import MyFiles from './MyFiles';
import PendingActions from './PendingActions';
import SubmitFile from './SubmitFile';
import Departments from './admin/Departments';
import Workflows from './admin/Workflows';
import Reports from './admin/Reports';
import CommonRepository from './CommonRepository';

// ── Inject keyframes & font once ──────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes pulseRing {
    0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
    70%  { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
    100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
  }
  @keyframes gradShift {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }

  .ap-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .ap-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    color: var(--text-main);
    padding: 2.5rem 3rem;
    position: relative;
    overflow: hidden;
  }

  /* subtle noise overlay */
  .ap-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  /* glowing orbs */
  .ap-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    z-index: 0;
  }
  .ap-orb-1 { width: 500px; height: 500px; background: var(--accent-glow); top: -150px; right: -100px; opacity: 0.5; }
  .ap-orb-2 { width: 350px; height: 350px; background: var(--accent-glow); bottom: 50px; left: -80px; opacity: 0.3; }

  .ap-inner { position: relative; z-index: 1; }

  /* ── Header ── */
  .ap-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2.8rem;
    animation: fadeUp 0.5s ease both;
  }

  .ap-title-block {}
  .ap-eyebrow {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 0.3rem;
  }
  .ap-title {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-main);
    line-height: 1.1;
  }
  .ap-title span {
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1);
    background-size: 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradShift 4s ease infinite;
  }

  /* ── Nav ── */
  .ap-nav {
    display: flex;
    gap: 0.3rem;
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 0.3rem;
    border-radius: 14px;
    backdrop-filter: blur(10px);
  }
  .ap-nav-btn {
    padding: 0.5rem 1.1rem;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 0.82rem;
    letter-spacing: 0.01em;
    transition: all 0.2s ease;
    position: relative;
    white-space: nowrap;
  }
  .ap-nav-btn.active {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 4px 20px var(--accent-glow);
    animation: pulseRing 2.5s ease infinite;
  }
  .ap-nav-btn:not(.active) {
    background: transparent;
    color: var(--text-dim);
  }
  .ap-nav-btn:not(.active):hover {
    background: var(--border-light);
    color: var(--text-main);
  }

  /* ── Stats grid ── */
  .ap-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 1.2rem;
    margin-bottom: 3rem;
  }

  .ap-card {
    position: relative;
    padding: 1.6rem 1.8rem;
    border-radius: 20px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    overflow: hidden;
    transition: transform 0.25s ease, border-color 0.25s ease;
    animation: fadeUp 0.5s ease both;
  }
  .ap-card:hover {
    transform: translateY(-4px);
    border-color: var(--accent);
  }
  .ap-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%);
    pointer-events: none;
  }

  .ap-card-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 20px 20px 0 0;
  }

  .ap-card-icon {
    width: 38px; height: 38px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .ap-card-label {
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 0.5rem;
  }

  .ap-card-value {
    font-family: 'Syne', sans-serif;
    font-size: 2.6rem;
    font-weight: 800;
    line-height: 1;
    animation: countUp 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  .ap-card-sub {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 0.4rem;
  }

  /* Loading shimmer */
  .ap-shimmer {
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.09) 100px, rgba(255,255,255,0.04) 200px);
    background-size: 400px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 8px;
    height: 2.6rem;
    width: 70%;
  }

  /* ── Recent activity ── */
  .ap-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 1rem;
  }

  .ap-activity-empty {
    background: var(--bg-card);
    border: 1px dashed var(--border);
    border-radius: 20px;
    padding: 3.5rem 2rem;
    text-align: center;
  }
  .ap-activity-empty-icon {
    font-size: 2.5rem;
    margin-bottom: 0.8rem;
    opacity: 0.4;
  }
  .ap-activity-empty-text {
    font-size: 0.9rem;
    color: var(--text-dim);
  }

  /* ── Quick actions ── */
  .ap-quick {
    display: flex;
    gap: 1rem;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
    animation: fadeUp 0.5s 0.15s ease both;
  }
  .ap-quick-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.3rem;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-main);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.84rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .ap-quick-btn:hover {
    background: var(--accent-glow);
    border-color: var(--accent);
    color: var(--accent);
    transform: translateY(-2px);
  }
  .ap-quick-btn.primary {
    background: var(--accent);
    border-color: var(--accent);
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 18px var(--accent-glow);
  }
  .ap-quick-btn.primary:hover {
    background: var(--accent);
    transform: translateY(-2px);
    box-shadow: 0 6px 24px var(--accent-glow);
  }
`;

// ── Small icon components ─────────────────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  files:   "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
  pending: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2",
  check:   "M20 6L9 17l-5-5",
  x:       "M18 6L6 18M6 6l12 12",
  upload:  "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  eye:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
};

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color, icon, sub, delay, loading }) => (
  <div className="ap-card" style={{ animationDelay: delay }}>
    <div className="ap-card-accent" style={{ background: color }} />
    <div className="ap-card-icon" style={{ background: `${color}22`, color }}>
      <Icon d={icon} size={18} />
    </div>
    <div className="ap-card-label">{label}</div>
    {loading
      ? <div className="ap-shimmer" />
      : <div className="ap-card-value" style={{ color }}>{value}</div>
    }
    {sub && <div className="ap-card-sub">{sub}</div>}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const ApprovalDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'Super Admin' || user?.role === 'Admin';
  const [activeSubView, setActiveSubView] = useState('overview');
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [commonCount, setCommonCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const [wfRes, commonRes] = await Promise.all([
          approvalApi.getFiles(),
          axios.get(`${API_BASE_URL}/common-files`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const files = wfRes.data;
        setStats({
          total:    files.length,
          pending:  files.filter(f => f.status === 'submitted' || f.status === 'under_review').length,
          approved: files.filter(f => f.status === 'approved').length,
          rejected: files.filter(f => f.status === 'rejected').length,
        });
        setCommonCount(commonRes.data.length);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const navItems = [
    'overview', 'my-files', 'pending', 'common-repository',
    ...(isAdmin ? ['departments', 'workflows', 'reports'] : []),
  ];

  const label = v => v.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="ap-root">
      <div className="ap-orb ap-orb-1" />
      <div className="ap-orb ap-orb-2" />

      <div className="ap-inner">
        {/* Header */}
        <div className="ap-header">
          <div className="ap-title-block">
            <div className="ap-eyebrow">Document Management</div>
            <h2 className="ap-title">File <span>Approval</span> Module</h2>
          </div>

          <nav className="ap-nav">
            {navItems.map(v => (
              <button
                key={v}
                className={`ap-nav-btn${activeSubView === v ? ' active' : ''}`}
                onClick={() => setActiveSubView(v)}
              >
                {label(v)}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview */}
        {activeSubView === 'overview' && (
          <>
            {/* Stat cards */}
            <div className="ap-stats">
              <StatCard label="Total Files"      value={stats.total}    color="#6366f1" icon={ICONS.files}   sub="All submitted documents"  delay="0.05s" loading={loading} />
              <StatCard label="Pending Approval" value={stats.pending}  color="#f59e0b" icon={ICONS.pending} sub="Awaiting review"           delay="0.1s"  loading={loading} />
              <StatCard label="Approved"         value={stats.approved} color="#10b981" icon={ICONS.check}   sub="Successfully cleared"      delay="0.15s" loading={loading} />
              <StatCard label="Rejected"         value={stats.rejected} color="#ef4444" icon={ICONS.x}       sub="Returned for revision"    delay="0.2s"  loading={loading} />
              <StatCard label="Shared Documents" value={commonCount}    color="#8b5cf6" icon={ICONS.files}   sub="Common shared library"     delay="0.25s" loading={loading} />
            </div>

            {/* Quick actions */}
            <div className="ap-quick">
              <button className="ap-quick-btn primary" onClick={() => setActiveSubView('submit')}>
                <Icon d={ICONS.upload} size={15} /> Submit New File
              </button>
              <button className="ap-quick-btn" onClick={() => setActiveSubView('my-files')}>
                <Icon d={ICONS.files} size={15} /> My Files
              </button>
              <button className="ap-quick-btn" onClick={() => setActiveSubView('pending')}>
                <Icon d={ICONS.eye} size={15} /> Pending Actions
              </button>
              <button className="ap-quick-btn" onClick={() => setActiveSubView('common-repository')}>
                📁 Shared Documents
              </button>
            </div>

            {/* Activity */}
            <div style={{ animation: 'fadeUp 0.5s 0.25s ease both' }}>
              <div className="ap-section-title">Recent Activity</div>
              <div className="ap-activity-empty">
                <div className="ap-activity-empty-icon">📭</div>
                <div className="ap-activity-empty-text">No recent file movements found.</div>
              </div>
            </div>
          </>
        )}

        {activeSubView === 'my-files'    && <MyFiles onNewClick={() => setActiveSubView('submit')} />}
        {activeSubView === 'pending'     && <PendingActions />}
        {activeSubView === 'submit'      && <SubmitFile onBack={() => setActiveSubView('my-files')} />}
        {activeSubView === 'departments' && <Departments />}
        {activeSubView === 'workflows'   && <Workflows />}
        {activeSubView === 'reports'     && <Reports />}
        {activeSubView === 'common-repository' && <CommonRepository />}
      </div>
    </div>
  );
};

export default ApprovalDashboard;
