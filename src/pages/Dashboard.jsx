// import { API_BASE_URL } from '../config';
// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import AssetsList from '../components/AssetsList';
// // import TicketsList from '../components/TicketsList';
// // import UsersManagement from '../components/UsersManagement';


// // const Dashboard = () => {
// //   const navigate = useNavigate();
// //   const user = JSON.parse(localStorage.getItem('user'));
// //   const [activeTab, setActiveTab] = useState('Overview');
// //   const [stats, setStats] = useState({
// //     totalAssets: '—',
// //     openTickets: '—',
// //     resolvedToday: '—',
// //     teamMembers: '—'
// //   });
// //   const [activities, setActivities] = useState([]);

// //   useEffect(() => {
// //     if (!user) return;
// //     if (activeTab === 'Overview') {
// //       fetchStats();
// //     }
// //   }, [activeTab]);

// //   const fetchStats = async () => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       const config = { headers: { Authorization: `Bearer ${token}` } };
      
// //       let assetsRes, ticketsRes, usersRes, activitiesRes;
      
// //       if (user.role === 'Super Admin' || user.role === 'Admin') {
// //         [assetsRes, ticketsRes, usersRes, activitiesRes] = await Promise.all([
// //           axios.get(`${API_BASE_URL}/assets`, config),
// //           axios.get(`${API_BASE_URL}/tickets`, config),
// //           axios.get(`${API_BASE_URL}/users`, config).catch(() => null),
// //           axios.get(`${API_BASE_URL}/activities`, config).catch(() => null)
// //         ]);
// //       } else {
// //         [assetsRes, ticketsRes, activitiesRes] = await Promise.all([
// //           axios.get(`${API_BASE_URL}/assets/me`, config),
// //           axios.get(`${API_BASE_URL}/tickets/me`, config),
// //           axios.get(`${API_BASE_URL}/activities`, config).catch(() => null)
// //         ]);
// //       }
      
// //       const assets = assetsRes?.data || [];
// //       const tickets = ticketsRes?.data || [];
// //       const users = usersRes?.data || [];
// //       const fetchedActivities = activitiesRes?.data || [];
      
// //       setActivities(fetchedActivities);
      
// //       const today = new Date();
// //       today.setHours(0,0,0,0);
      
// //       const resolvedTodayCount = tickets.filter(t => {
// //         if (t.status !== 'Resolved' && t.status !== 'Closed') return false;
// //         const d = new Date(t.updatedAt);
// //         return d >= today;
// //       }).length;
      
// //       const openTicketsCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
      
// //       setStats({
// //         totalAssets: assets.length,
// //         openTickets: openTicketsCount,
// //         resolvedToday: resolvedTodayCount,
// //         teamMembers: usersRes ? users.length : 'N/A'
// //       });
      
// //     } catch (err) {
// //       console.error('Failed to fetch stats', err);
// //     }
// //   };

// //   if (!user) {
// //     navigate('/login');
// //     return null;
// //   }

// //   const handleLogout = () => {
// //     localStorage.removeItem('token');
// //     localStorage.removeItem('user');
// //     navigate('/login');
// //   };

// //   const tabs = [
// //     { name: 'Overview', icon: '⊞' },
// //     { name: 'Assets',   icon: '◈' },
// //     { name: 'Tickets',  icon: '◎' },
// //     ...((user.role === 'Super Admin' || user.role === 'Admin')
// //       ? [{ name: 'Users', icon: '◉' }]
// //       : []),
// //   ];

// //   const getRoleBadgeColor = (role) => {
// //     if (role === 'Super Admin') return { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.35)', text: '#fbbf24' };
// //     if (role === 'Admin')       return { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.35)', text: '#818cf8' };
// //     return { bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.35)', text: '#2dd4bf' };
// //   };

// //   const roleStyle = getRoleBadgeColor(user.role);

// //   const overviewCards = [
// //     { label: 'Total Assets',   value: stats.totalAssets, icon: '◈', color: '#6366f1' },
// //     { label: 'Open Tickets',   value: stats.openTickets, icon: '◎', color: '#06b6d4' },
// //     { label: 'Resolved Today', value: stats.resolvedToday, icon: '✓', color: '#10b981' },
// //     { label: 'Team Members',   value: stats.teamMembers, icon: '◉', color: '#f59e0b' },
// //   ];

// //   return (
// //     <>
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

// //         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

// //         .db-root {
// //           min-height: 100vh;
// //           background: #07090f;
// //           font-family: 'DM Sans', sans-serif;
// //           color: #e2e8f0;
// //           display: flex;
// //           flex-direction: column;
// //           position: relative;
// //           overflow-x: hidden;
// //         }

// //         /* Subtle background texture */
// //         .db-root::before {
// //           content: '';
// //           position: fixed;
// //           inset: 0;
// //           background-image:
// //             radial-gradient(ellipse 70% 50% at 80% 10%, rgba(99,102,241,0.08) 0%, transparent 60%),
// //             radial-gradient(ellipse 50% 40% at 10% 90%, rgba(6,182,212,0.06) 0%, transparent 60%),
// //             linear-gradient(rgba(99,102,241,0.025) 1px, transparent 1px),
// //             linear-gradient(90deg, rgba(99,102,241,0.025) 1px, transparent 1px);
// //           background-size: 100% 100%, 100% 100%, 60px 60px, 60px 60px;
// //           pointer-events: none;
// //           z-index: 0;
// //         }

// //         /* ── TOPBAR ── */
// //         .db-topbar {
// //           position: sticky;
// //           top: 0;
// //           z-index: 100;
// //           display: flex;
// //           align-items: center;
// //           justify-content: space-between;
// //           padding: 0 2rem;
// //           height: 64px;
// //           background: rgba(7, 9, 15, 0.85);
// //           backdrop-filter: blur(20px);
// //           -webkit-backdrop-filter: blur(20px);
// //           border-bottom: 1px solid rgba(255,255,255,0.06);
// //           animation: slideDown 0.5s cubic-bezier(0.22,1,0.36,1) both;
// //         }

// //         @keyframes slideDown {
// //           from { opacity: 0; transform: translateY(-100%); }
// //           to   { opacity: 1; transform: translateY(0); }
// //         }

// //         /* Logo area */
// //         .db-brand {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.65rem;
// //           text-decoration: none;
// //         }

// //         .db-logo-wrap {
// //           width: 36px;
// //           height: 36px;
// //           border-radius: 10px;
// //           background: rgba(255,255,255,0.04);
// //           border: 1px solid rgba(255,255,255,0.09);
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           overflow: hidden;
// //           position: relative;
// //           flex-shrink: 0;
// //         }
// //         .db-logo-wrap::before {
// //           content: '';
// //           position: absolute;
// //           inset: 0;
// //           background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.1));
// //         }
// //         .db-logo-img {
// //           width: 24px;
// //           height: 24px;
// //           object-fit: contain;
// //           position: relative;
// //           z-index: 1;
// //           filter: drop-shadow(0 1px 4px rgba(99,102,241,0.5));
// //         }
// //         .db-logo-fallback {
// //           font-size: 1rem;
// //           font-weight: 700;
// //           background: linear-gradient(135deg, #6366f1, #06b6d4);
// //           -webkit-background-clip: text;
// //           -webkit-text-fill-color: transparent;
// //           background-clip: text;
// //           position: relative;
// //           z-index: 1;
// //           display: none;
// //         }

// //         .db-brand-name {
// //           font-size: 0.95rem;
// //           font-weight: 600;
// //           color: #f1f5f9;
// //           letter-spacing: -0.2px;
// //           line-height: 1;
// //         }
// //         .db-brand-sub {
// //           font-size: 0.62rem;
// //           color: rgba(148,163,184,0.45);
// //           letter-spacing: 0.1em;
// //           text-transform: uppercase;
// //           font-family: 'DM Mono', monospace;
// //         }

// //         /* Right side: user pill + logout */
// //         .db-topbar-right {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.75rem;
// //         }

// //         .db-user-pill {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.6rem;
// //           padding: 0.35rem 0.75rem 0.35rem 0.35rem;
// //           background: rgba(255,255,255,0.04);
// //           border: 1px solid rgba(255,255,255,0.07);
// //           border-radius: 100px;
// //         }

// //         .db-avatar {
// //           width: 28px;
// //           height: 28px;
// //           border-radius: 50%;
// //           background: linear-gradient(135deg, #6366f1, #06b6d4);
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           font-size: 0.7rem;
// //           font-weight: 700;
// //           color: #fff;
// //           flex-shrink: 0;
// //           letter-spacing: 0;
// //         }

// //         .db-user-name {
// //           font-size: 0.8rem;
// //           font-weight: 500;
// //           color: #cbd5e1;
// //           max-width: 120px;
// //           overflow: hidden;
// //           text-overflow: ellipsis;
// //           white-space: nowrap;
// //         }

// //         .db-role-badge {
// //           display: inline-flex;
// //           align-items: center;
// //           padding: 0.15rem 0.5rem;
// //           border-radius: 100px;
// //           font-size: 0.65rem;
// //           font-weight: 600;
// //           letter-spacing: 0.04em;
// //           font-family: 'DM Mono', monospace;
// //         }

// //         .db-logout-btn {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.4rem;
// //           padding: 0.45rem 0.85rem;
// //           background: rgba(239,68,68,0.08);
// //           border: 1px solid rgba(239,68,68,0.2);
// //           border-radius: 10px;
// //           color: #fca5a5;
// //           font-family: 'DM Sans', sans-serif;
// //           font-size: 0.78rem;
// //           font-weight: 500;
// //           cursor: pointer;
// //           transition: all 0.2s;
// //         }
// //         .db-logout-btn:hover {
// //           background: rgba(239,68,68,0.15);
// //           border-color: rgba(239,68,68,0.4);
// //           color: #fecaca;
// //         }

// //         /* ── NAV TABS ── */
// //         .db-nav {
// //           position: relative;
// //           z-index: 10;
// //           display: flex;
// //           align-items: center;
// //           gap: 0.25rem;
// //           padding: 0 2rem;
// //           background: rgba(255,255,255,0.015);
// //           border-bottom: 1px solid rgba(255,255,255,0.05);
// //           animation: fadeIn 0.5s 0.1s both;
// //         }

// //         @keyframes fadeIn {
// //           from { opacity: 0; }
// //           to   { opacity: 1; }
// //         }

// //         .db-tab {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.5rem;
// //           padding: 0.9rem 1.25rem;
// //           cursor: pointer;
// //           font-size: 0.82rem;
// //           font-weight: 500;
// //           color: rgba(148,163,184,0.6);
// //           border-bottom: 2px solid transparent;
// //           transition: all 0.2s ease;
// //           letter-spacing: 0.01em;
// //           position: relative;
// //           white-space: nowrap;
// //           user-select: none;
// //         }

// //         .db-tab:hover {
// //           color: rgba(226,232,240,0.85);
// //           background: rgba(255,255,255,0.03);
// //         }

// //         .db-tab.active {
// //           color: #818cf8;
// //           border-bottom-color: #6366f1;
// //           background: rgba(99,102,241,0.05);
// //         }

// //         .db-tab-icon {
// //           font-size: 1rem;
// //           line-height: 1;
// //           opacity: 0.7;
// //         }
// //         .db-tab.active .db-tab-icon {
// //           opacity: 1;
// //         }

// //         /* ── MAIN CONTENT ── */
// //         .db-main {
// //           position: relative;
// //           z-index: 5;
// //           flex: 1;
// //           padding: 2rem;
// //           animation: contentIn 0.5s 0.2s cubic-bezier(0.22,1,0.36,1) both;
// //         }

// //         @keyframes contentIn {
// //           from { opacity: 0; transform: translateY(12px); }
// //           to   { opacity: 1; transform: translateY(0); }
// //         }

// //         /* ── OVERVIEW ── */
// //         .db-welcome {
// //           margin-bottom: 2rem;
// //         }

// //         .db-welcome-label {
// //           font-size: 0.7rem;
// //           font-weight: 500;
// //           letter-spacing: 0.12em;
// //           text-transform: uppercase;
// //           color: rgba(148,163,184,0.45);
// //           font-family: 'DM Mono', monospace;
// //           margin-bottom: 0.4rem;
// //         }

// //         .db-welcome-heading {
// //           font-size: 1.75rem;
// //           font-weight: 700;
// //           letter-spacing: -0.5px;
// //           color: #f1f5f9;
// //           line-height: 1.2;
// //         }

// //         .db-welcome-heading span {
// //           background: linear-gradient(90deg, #818cf8, #22d3ee);
// //           -webkit-background-clip: text;
// //           -webkit-text-fill-color: transparent;
// //           background-clip: text;
// //         }

// //         .db-welcome-sub {
// //           font-size: 0.83rem;
// //           color: rgba(148,163,184,0.55);
// //           margin-top: 0.4rem;
// //           font-weight: 300;
// //           line-height: 1.6;
// //         }

// //         /* Stat cards */
// //         .db-stats-grid {
// //           display: grid;
// //           grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
// //           gap: 1rem;
// //           margin-bottom: 2rem;
// //         }

// //         .db-stat-card {
// //           background: rgba(255,255,255,0.03);
// //           border: 1px solid rgba(255,255,255,0.06);
// //           border-radius: 16px;
// //           padding: 1.25rem 1.5rem;
// //           position: relative;
// //           overflow: hidden;
// //           transition: border-color 0.2s, transform 0.2s;
// //         }

// //         .db-stat-card:hover {
// //           border-color: rgba(255,255,255,0.1);
// //           transform: translateY(-2px);
// //         }

// //         .db-stat-card::before {
// //           content: '';
// //           position: absolute;
// //           top: 0; left: 0; right: 0;
// //           height: 2px;
// //           background: var(--stat-color);
// //           opacity: 0.6;
// //         }

// //         .db-stat-card::after {
// //           content: '';
// //           position: absolute;
// //           top: -30px; right: -20px;
// //           width: 80px; height: 80px;
// //           border-radius: 50%;
// //           background: var(--stat-color);
// //           opacity: 0.06;
// //           filter: blur(16px);
// //         }

// //         .db-stat-icon {
// //           font-size: 1.4rem;
// //           margin-bottom: 0.75rem;
// //           color: var(--stat-color);
// //           opacity: 0.85;
// //         }

// //         .db-stat-value {
// //           font-size: 1.8rem;
// //           font-weight: 700;
// //           color: #f1f5f9;
// //           letter-spacing: -1px;
// //           font-family: 'DM Mono', monospace;
// //           line-height: 1;
// //           margin-bottom: 0.3rem;
// //         }

// //         .db-stat-label {
// //           font-size: 0.72rem;
// //           color: rgba(148,163,184,0.5);
// //           letter-spacing: 0.05em;
// //           text-transform: uppercase;
// //           font-weight: 500;
// //         }

// //         /* Quick info panel */
// //         .db-info-panel {
// //           background: rgba(255,255,255,0.025);
// //           border: 1px solid rgba(255,255,255,0.06);
// //           border-radius: 16px;
// //           padding: 1.5rem;
// //           display: flex;
// //           align-items: flex-start;
// //           gap: 1rem;
// //         }

// //         .db-info-dot {
// //           width: 8px; height: 8px;
// //           border-radius: 50%;
// //           background: #6366f1;
// //           margin-top: 0.35rem;
// //           flex-shrink: 0;
// //           box-shadow: 0 0 8px #6366f1;
// //           animation: pulse 2s ease-in-out infinite;
// //         }

// //         @keyframes pulse {
// //           0%, 100% { opacity: 1; transform: scale(1); }
// //           50% { opacity: 0.5; transform: scale(0.7); }
// //         }

// //         .db-info-text {
// //           font-size: 0.83rem;
// //           color: rgba(148,163,184,0.65);
// //           line-height: 1.7;
// //           font-weight: 300;
// //         }

// //         .db-info-text strong {
// //           color: #94a3b8;
// //           font-weight: 500;
// //         }

// //         /* Quick action row */
// //         .db-quick-actions {
// //           display: flex;
// //           gap: 0.75rem;
// //           margin-top: 1rem;
// //           flex-wrap: wrap;
// //         }

// //         .db-quick-btn {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.5rem;
// //           padding: 0.5rem 1rem;
// //           border-radius: 10px;
// //           font-family: 'DM Sans', sans-serif;
// //           font-size: 0.78rem;
// //           font-weight: 500;
// //           cursor: pointer;
// //           border: 1px solid rgba(99,102,241,0.25);
// //           background: rgba(99,102,241,0.07);
// //           color: #818cf8;
// //           transition: all 0.2s;
// //         }
// //         .db-quick-btn:hover {
// //           background: rgba(99,102,241,0.14);
// //           border-color: rgba(99,102,241,0.45);
// //         }

// //         /* ── ACTIVITY LOG ── */
// //         .db-activity-section {
// //           margin-top: 2rem;
// //           background: rgba(255,255,255,0.02);
// //           border: 1px solid rgba(255,255,255,0.06);
// //           border-radius: 16px;
// //           padding: 1.5rem;
// //           backdrop-filter: blur(10px);
// //         }
// //         .db-activity-title {
// //           font-size: 1.1rem;
// //           font-weight: 600;
// //           color: #f8fafc;
// //           margin-bottom: 1rem;
// //           display: flex;
// //           align-items: center;
// //           gap: 0.5rem;
// //         }
// //         .db-activity-list {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 0.75rem;
// //         }
// //         .db-activity-item {
// //           display: flex;
// //           align-items: flex-start;
// //           gap: 1rem;
// //           padding: 0.75rem;
// //           border-radius: 10px;
// //           background: rgba(255,255,255,0.015);
// //           border: 1px solid rgba(255,255,255,0.03);
// //           transition: background 0.2s;
// //         }
// //         .db-activity-item:hover {
// //           background: rgba(255,255,255,0.04);
// //         }
// //         .db-activity-icon {
// //           width: 32px;
// //           height: 32px;
// //           border-radius: 8px;
// //           background: rgba(99,102,241,0.1);
// //           color: #818cf8;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           font-size: 1rem;
// //           flex-shrink: 0;
// //         }
// //         .db-activity-content {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 0.2rem;
// //         }
// //         .db-activity-action {
// //           font-size: 0.85rem;
// //           color: #e2e8f0;
// //           font-weight: 500;
// //         }
// //         .db-activity-details {
// //           font-size: 0.75rem;
// //           color: rgba(148,163,184,0.8);
// //         }
// //         .db-activity-meta {
// //           font-size: 0.7rem;
// //           color: rgba(148,163,184,0.5);
// //           margin-top: 0.1rem;
// //         }
// //       `}</style>

// //       <div className="db-root">

// //         {/* ── TOPBAR ── */}
// //         <header className="db-topbar">
// //           {/* Brand / Logo */}
// //           <div className="db-brand">
// //             <div className="db-logo-wrap">
// //               <img
// //                 className="db-logo-img"
// //                 src="../Assets/logo.png"
// //                 alt="Company Logo"
// //                 onError={(e) => {
// //                   e.target.style.display = 'none';
// //                   e.target.nextSibling.style.display = 'block';
// //                 }}
// //               />
// //               <span className="db-logo-fallback">A</span>
// //             </div>
// //             <div>
// //               <div className="db-brand-name">AssetTrack</div>
// //               <div className="db-brand-sub">Management Portal</div>
// //             </div>
// //           </div>

// //           {/* Right: user info + logout */}
// //           <div className="db-topbar-right">
// //             <div className="db-user-pill">
// //               <div className="db-avatar">
// //                 {user.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
// //               </div>
// //               <span className="db-user-name">{user.name}</span>
// //               <span
// //                 className="db-role-badge"
// //                 style={{
// //                   background: roleStyle.bg,
// //                   border: `1px solid ${roleStyle.border}`,
// //                   color: roleStyle.text,
// //                 }}
// //               >
// //                 {user.role}
// //               </span>
// //             </div>
// //             <button className="db-logout-btn" onClick={handleLogout}>
// //               <span>⏻</span>
// //               Logout
// //             </button>
// //           </div>
// //         </header>

// //         {/* ── NAVIGATION TABS ── */}
// //         <nav className="db-nav">
// //           {tabs.map(tab => (
// //             <div
// //               key={tab.name}
// //               className={`db-tab${activeTab === tab.name ? ' active' : ''}`}
// //               onClick={() => setActiveTab(tab.name)}
// //             >
// //               <span className="db-tab-icon">{tab.icon}</span>
// //               {tab.name}
// //             </div>
// //           ))}
// //         </nav>

// //         {/* ── MAIN CONTENT ── */}
// //         <main className="db-main">

// //           {activeTab === 'Overview' && (
// //             <>
// //               <div className="db-welcome">
// //                 <div className="db-welcome-label">Dashboard Overview</div>
// //                 <div className="db-welcome-heading">
// //                   Welcome back, <span>{user.name?.split(' ')[0]}</span>
// //                 </div>
// //                 <div className="db-welcome-sub">
// //                   Here's a snapshot of your {user.role === 'Super Admin' || user.role === 'Admin' ? 'system' : 'workspace'} — everything looks good today.
// //                 </div>
// //               </div>

// //               {/* Stat cards */}
// //               <div className="db-stats-grid">
// //                 {overviewCards.map(card => (
// //                   <div
// //                     key={card.label}
// //                     className="db-stat-card"
// //                     style={{ '--stat-color': card.color }}
// //                   >
// //                     <div className="db-stat-icon">{card.icon}</div>
// //                     <div className="db-stat-value">{card.value}</div>
// //                     <div className="db-stat-label">{card.label}</div>
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* Info panel */}
// //               <div className="db-info-panel">
// //                 <div className="db-info-dot" />
// //                 <div>
// //                   <div className="db-info-text">
// //                     You're signed in as <strong>{user.role}</strong>.{' '}
// //                     {user.role === 'Super Admin' || user.role === 'Admin'
// //                       ? 'You have full access to manage assets, tickets, and user accounts across the system.'
// //                       : 'You can view and manage your assigned assets and raise support tickets from the tabs above.'}
// //                   </div>
// //                   <div className="db-quick-actions">
// //                     <button className="db-quick-btn" onClick={() => setActiveTab('Assets')}>
// //                       ◈ View Assets
// //                     </button>
// //                     <button className="db-quick-btn" onClick={() => setActiveTab('Tickets')}>
// //                       ◎ Open Tickets
// //                     </button>
// //                     {(user.role === 'Super Admin' || user.role === 'Admin') && (
// //                       <button className="db-quick-btn" onClick={() => setActiveTab('Users')}>
// //                         ◉ Manage Users
// //                       </button>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Activity Log */}
// //               <div className="db-activity-section">
// //                 <div className="db-activity-title">
// //                   <span style={{ color: '#818cf8' }}>⚡</span> Recent Activity
// //                 </div>
// //                 {activities.length > 0 ? (
// //                   <div className="db-activity-list">
// //                     {activities.map((act) => (
// //                       <div key={act._id} className="db-activity-item">
// //                         <div className="db-activity-icon">
// //                           {act.action.includes('Ticket') ? '◎' : act.action.includes('Asset') ? '◈' : act.action.includes('User') ? '◉' : '✓'}
// //                         </div>
// //                         <div className="db-activity-content">
// //                           <div className="db-activity-action">
// //                             {user.role === 'Super Admin' && <strong>{act.user?.name}</strong>}
// //                             {user.role === 'Super Admin' ? ' ' : ''}
// //                             {act.action}
// //                           </div>
// //                           <div className="db-activity-details">{act.details}</div>
// //                           <div className="db-activity-meta">
// //                             {new Date(act.createdAt).toLocaleString()}
// //                           </div>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 ) : (
// //                   <div style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.6)' }}>No recent activity.</div>
// //                 )}
// //               </div>
// //             </>
// //           )}

// //           {activeTab === 'Assets'  && <AssetsList role={user.role} />}
// //           {activeTab === 'Tickets' && <TicketsList role={user.role} />}
// //           {activeTab === 'Users' && (user.role === 'Super Admin' || user.role === 'Admin') && (
// //             <UsersManagement role={user.role} />
// //           )}

// //         </main>
// //       </div>
// //     </>
// //   );
// // };

// // export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import AssetsList from '../components/AssetsList';
// import TicketsList from '../components/TicketsList';
// import UsersManagement from '../components/UsersManagement';
// import CompanyManagement from '../components/CompanyManagement';
// import ApprovalDashboard from '../modules/approval/pages/Dashboard';
// import MyFiles from '../modules/approval/pages/MyFiles';
// import PendingActions from '../modules/approval/pages/PendingActions';
// import VehiclesList from '../components/VehiclesList';


// const Dashboard = () => {
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem('user'));
//   const [activeTab, setActiveTab] = useState('Overview');
//   const [stats, setStats] = useState({
//     totalAssets: '—',
//     openTickets: '—',
//     resolvedToday: '—',
//     teamMembers: '—'
//   });
//   const [activities, setActivities] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(true);

//   useEffect(() => {
//     if (!user) return;
//     fetchStats();
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (!user) return;
//     if (activeTab === 'Overview') {
//       fetchStats();
//     }
//   }, [activeTab]);

//   const fetchStats = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const config = { headers: { Authorization: `Bearer ${token}` } };

//       let assetsRes, ticketsRes, usersRes, activitiesRes;

//       if (user.role === 'Super Admin' || user.role === 'Admin') {
//         [assetsRes, ticketsRes, usersRes, activitiesRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/assets`, config),
//           axios.get(`${API_BASE_URL}/tickets`, config),
//           axios.get(`${API_BASE_URL}/users`, config).catch(() => null),
//           axios.get(`${API_BASE_URL}/activities`, config).catch(() => null)
//         ]);
//       } else {
//         [assetsRes, ticketsRes, activitiesRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/assets/me`, config),
//           axios.get(`${API_BASE_URL}/tickets`, config),
//           axios.get(`${API_BASE_URL}/activities`, config).catch(() => null)
//         ]);
//       }

//       const assets = assetsRes?.data || [];
//       const tickets = ticketsRes?.data || [];
//       const users = usersRes?.data || [];
//       const fetchedActivities = activitiesRes?.data || [];

//       setActivities(fetchedActivities);

//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const resolvedTodayCount = tickets.filter(t => {
//         if (t.status !== 'Resolved' && t.status !== 'Closed') return false;
//         const d = new Date(t.updatedAt);
//         return d >= today;
//       }).length;

//       const openTicketsCount = tickets.filter(
//         t => t.status === 'Open' || t.status === 'In Progress'
//       ).length;

//       setStats({
//         totalAssets: assets.length,
//         openTickets: openTicketsCount,
//         resolvedToday: resolvedTodayCount,
//         teamMembers: usersRes ? users.length : 'N/A'
//       });

//     } catch (err) {
//       console.error('Failed to fetch stats', err);
//     }
//   };

//   const fetchNotifications = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${API_BASE_URL}/approval/notifications`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setNotifications(res.data);
//     } catch (err) { console.error('Failed to fetch notifications', err); }
//   };

//   const markNotificationAsRead = (id) => {
//     // Locally mark as read for now
//     setNotifications(notifications.filter(n => n._id !== id));
//   };

//   if (!user) {
//     navigate('/login');
//     return null;
//   }

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   const isAdmin = user.role === 'Super Admin' || user.role === 'Admin';

//   const tabs = [
//     { name: 'Overview', icon: '⊞' },
//     ...(user.modules?.assets ? [{ name: 'Assets', icon: '◈' }] : []),
//     ...(user.modules?.ticketing ? [{ name: 'Tickets', icon: '◎' }] : []),
//     ...(user.modules?.vehicles ? [{ name: 'Vehicles', icon: '🚗' }] : []),
//     ...(user.modules?.files ? [{ name: 'File Approval', icon: '📁' }] : []),
//     ...(isAdmin ? [{ name: 'Users', icon: '◉' }] : []),
//     ...(user.role === 'Super Admin' ? [{ name: 'Companies', icon: '🏢' }] : []),
//   ];

//   const getRoleBadgeColor = (role) => {
//     if (role === 'Super Admin') return { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.35)', text: '#fbbf24' };
//     if (role === 'Admin')       return { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.35)', text: '#818cf8' };
//     return { bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.35)', text: '#2dd4bf' };
//   };

//   const roleStyle = getRoleBadgeColor(user.role);

//   const overviewCards = isAdmin 
//     ? [
//         { label: 'Total Assets',   value: stats.totalAssets,   icon: '◈', color: '#6366f1' },
//         { label: 'Open Tickets',   value: stats.openTickets,   icon: '◎', color: '#06b6d4' },
//         { label: 'Resolved Today', value: stats.resolvedToday, icon: '✓', color: '#10b981' },
//         { label: 'Team Members',   value: stats.teamMembers,   icon: '◉', color: '#f59e0b' }
//       ]
//     : [
//         { label: 'Open Tickets',   value: stats.openTickets,   icon: '◎', color: '#06b6d4' },
//         { label: 'Resolved Today', value: stats.resolvedToday, icon: '✓', color: '#10b981' },
//         { label: 'Assets',         value: stats.totalAssets,   icon: '◈', color: '#6366f1' }
//       ];

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

//         :root {
//           --bg-main: #07090f;
//           --bg-card: rgba(255,255,255,0.03);
//           --bg-topbar: rgba(7, 9, 15, 0.85);
//           --text-main: #e2e8f0;
//           --text-dim: rgba(148,163,184,0.45);
//           --border: rgba(255,255,255,0.06);
//           --card-shadow: none;
//         }

//         .light-theme {
//           --bg-main: #f1f5f9;
//           --bg-card: #ffffff;
//           --bg-topbar: rgba(255, 255, 255, 0.85);
//           --text-main: #0f172a;
//           --text-dim: #64748b;
//           --border: #e2e8f0;
//           --card-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
//         }

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         .db-root {
//           min-height: 100vh;
//           background: var(--bg-main);
//           font-family: 'DM Sans', sans-serif;
//           color: var(--text-main);
//           display: flex;
//           flex-direction: column;
//           position: relative;
//           overflow-x: hidden;
//           transition: background 0.3s, color 0.3s;
//         }

//         /* Subtle background texture */
//         .db-root::before {
//           content: '';
//           position: fixed;
//           inset: 0;
//           background-image:
//             radial-gradient(ellipse 70% 50% at 80% 10%, rgba(99,102,241,0.08) 0%, transparent 60%),
//             radial-gradient(ellipse 50% 40% at 10% 90%, rgba(6,182,212,0.06) 0%, transparent 60%),
//             linear-gradient(rgba(99,102,241,0.025) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(99,102,241,0.025) 1px, transparent 1px);
//           background-size: 100% 100%, 100% 100%, 60px 60px, 60px 60px;
//           pointer-events: none;
//           z-index: 0;
//         }

//         /* ── TOPBAR ── */
//         .db-topbar {
//           position: sticky;
//           top: 0;
//           z-index: 100;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 0 2rem;
//           height: 64px;
//           background: var(--bg-topbar);
//           backdrop-filter: blur(20px);
//           -webkit-backdrop-filter: blur(20px);
//           border-bottom: 1px solid var(--border);
//           animation: slideDown 0.5s cubic-bezier(0.22,1,0.36,1) both;
//           transition: background 0.3s, border 0.3s;
//         }

//         @keyframes slideDown {
//           from { opacity: 0; transform: translateY(-100%); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         /* Logo area */
//         .db-brand {
//           display: flex;
//           align-items: center;
//           gap: 0.65rem;
//           text-decoration: none;
//         }

//         .db-logo-wrap {
//           width: 36px;
//           height: 36px;
//           border-radius: 10px;
//           background: rgba(255,255,255,0.04);
//           border: 1px solid rgba(255,255,255,0.09);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           overflow: hidden;
//           position: relative;
//           flex-shrink: 0;
//         }
//         .db-logo-wrap::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.1));
//         }
//         .db-logo-img {
//           width: 24px;
//           height: 24px;
//           object-fit: contain;
//           position: relative;
//           z-index: 1;
//           filter: drop-shadow(0 1px 4px rgba(99,102,241,0.5));
//         }
//         .db-logo-fallback {
//           font-size: 1rem;
//           font-weight: 700;
//           background: linear-gradient(135deg, #6366f1, #06b6d4);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           position: relative;
//           z-index: 1;
//           display: none;
//         }

//         .db-brand-name {
//           font-size: 0.95rem;
//           font-weight: 600;
//           color: #f1f5f9;
//           letter-spacing: -0.2px;
//           line-height: 1;
//         }
//         .db-brand-sub {
//           font-size: 0.62rem;
//           color: rgba(148,163,184,0.45);
//           letter-spacing: 0.1em;
//           text-transform: uppercase;
//           font-family: 'DM Mono', monospace;
//         }

//         /* Right side: user pill + logout */
//         .db-topbar-right {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//         }

//         .db-user-pill {
//           display: flex;
//           align-items: center;
//           gap: 0.6rem;
//           padding: 0.35rem 0.75rem 0.35rem 0.35rem;
//           background: rgba(255,255,255,0.04);
//           border: 1px solid rgba(255,255,255,0.07);
//           border-radius: 100px;
//         }

//         .db-avatar {
//           width: 28px;
//           height: 28px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, #6366f1, #06b6d4);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 0.7rem;
//           font-weight: 700;
//           color: #fff;
//           flex-shrink: 0;
//           letter-spacing: 0;
//         }

//         .db-user-name {
//           font-size: 0.8rem;
//           font-weight: 500;
//           color: #cbd5e1;
//           max-width: 120px;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//         }

//         .db-role-badge {
//           display: inline-flex;
//           align-items: center;
//           padding: 0.15rem 0.5rem;
//           border-radius: 100px;
//           font-size: 0.65rem;
//           font-weight: 600;
//           letter-spacing: 0.04em;
//           font-family: 'DM Mono', monospace;
//         }

//         .db-logout-btn {
//           display: flex;
//           align-items: center;
//           gap: 0.4rem;
//           padding: 0.45rem 0.85rem;
//           background: rgba(239,68,68,0.08);
//           border: 1px solid rgba(239,68,68,0.2);
//           border-radius: 10px;
//           color: #fca5a5;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 0.78rem;
//           font-weight: 500;
//           cursor: pointer;
//           transition: all 0.2s;
//         }
//         .db-logout-btn:hover {
//           background: rgba(239,68,68,0.15);
//           border-color: rgba(239,68,68,0.4);
//           color: #fecaca;
//         }

//         /* ── NAV TABS ── */
//         .db-nav {
//           position: relative;
//           z-index: 10;
//           display: flex;
//           align-items: center;
//           gap: 0.25rem;
//           padding: 0 2rem;
//           background: rgba(255,255,255,0.015);
//           border-bottom: 1px solid rgba(255,255,255,0.05);
//           animation: fadeIn 0.5s 0.1s both;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to   { opacity: 1; }
//         }

//         .db-tab {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.9rem 1.25rem;
//           cursor: pointer;
//           font-size: 0.82rem;
//           font-weight: 500;
//           color: rgba(148,163,184,0.6);
//           border-bottom: 2px solid transparent;
//           transition: all 0.2s ease;
//           letter-spacing: 0.01em;
//           position: relative;
//           white-space: nowrap;
//           user-select: none;
//         }

//         .db-tab:hover {
//           color: rgba(226,232,240,0.85);
//           background: rgba(255,255,255,0.03);
//         }

//         .db-tab.active {
//           color: #818cf8;
//           border-bottom-color: #6366f1;
//           background: rgba(99,102,241,0.05);
//         }

//         .db-tab-icon {
//           font-size: 1rem;
//           line-height: 1;
//           opacity: 0.7;
//         }
//         .db-tab.active .db-tab-icon {
//           opacity: 1;
//         }

//         /* ── MAIN CONTENT ── */
//         .db-main {
//           position: relative;
//           z-index: 5;
//           flex: 1;
//           padding: 2rem;
//           animation: contentIn 0.5s 0.2s cubic-bezier(0.22,1,0.36,1) both;
//         }

//         @keyframes contentIn {
//           from { opacity: 0; transform: translateY(12px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         /* ── OVERVIEW ── */
//         .db-welcome {
//           margin-bottom: 2rem;
//         }

//         .db-welcome-label {
//           font-size: 0.7rem;
//           font-weight: 500;
//           letter-spacing: 0.12em;
//           text-transform: uppercase;
//           color: rgba(148,163,184,0.45);
//           font-family: 'DM Mono', monospace;
//           margin-bottom: 0.4rem;
//         }

//         .db-welcome-heading {
//           font-size: 1.75rem;
//           font-weight: 700;
//           letter-spacing: -0.5px;
//           color: #f1f5f9;
//           line-height: 1.2;
//         }

//         .db-welcome-heading span {
//           background: linear-gradient(90deg, #818cf8, #22d3ee);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }

//         .db-welcome-sub {
//           font-size: 0.83rem;
//           color: rgba(148,163,184,0.55);
//           margin-top: 0.4rem;
//           font-weight: 300;
//           line-height: 1.6;
//         }

//         /* Stat cards */
//         .db-stats-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
//           gap: 1rem;
//           margin-bottom: 2rem;
//         }

//         .db-stat-card {
//           background: rgba(255,255,255,0.03);
//           border: 1px solid rgba(255,255,255,0.06);
//           border-radius: 16px;
//           padding: 1.25rem 1.5rem;
//           position: relative;
//           overflow: hidden;
//           transition: border-color 0.2s, transform 0.2s;
//         }

//         .db-stat-card:hover {
//           border-color: rgba(255,255,255,0.1);
//           transform: translateY(-2px);
//         }

//         .db-stat-card::before {
//           content: '';
//           position: absolute;
//           top: 0; left: 0; right: 0;
//           height: 2px;
//           background: var(--stat-color);
//           opacity: 0.6;
//         }

//         .db-stat-card::after {
//           content: '';
//           position: absolute;
//           top: -30px; right: -20px;
//           width: 80px; height: 80px;
//           border-radius: 50%;
//           background: var(--stat-color);
//           opacity: 0.06;
//           filter: blur(16px);
//         }

//         .db-stat-icon {
//           font-size: 1.4rem;
//           margin-bottom: 0.75rem;
//           color: var(--stat-color);
//           opacity: 0.85;
//         }

//         .db-stat-value {
//           font-size: 1.8rem;
//           font-weight: 700;
//           color: #f1f5f9;
//           letter-spacing: -1px;
//           font-family: 'DM Mono', monospace;
//           line-height: 1;
//           margin-bottom: 0.3rem;
//         }

//         .db-stat-label {
//           font-size: 0.72rem;
//           color: rgba(148,163,184,0.5);
//           letter-spacing: 0.05em;
//           text-transform: uppercase;
//           font-weight: 500;
//         }

//         /* Quick info panel */
//         .db-info-panel {
//           background: rgba(255,255,255,0.025);
//           border: 1px solid rgba(255,255,255,0.06);
//           border-radius: 16px;
//           padding: 1.5rem;
//           display: flex;
//           align-items: flex-start;
//           gap: 1rem;
//         }

//         .db-info-dot {
//           width: 8px; height: 8px;
//           border-radius: 50%;
//           background: #6366f1;
//           margin-top: 0.35rem;
//           flex-shrink: 0;
//           box-shadow: 0 0 8px #6366f1;
//           animation: pulse 2s ease-in-out infinite;
//         }

//         @keyframes pulse {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.5; transform: scale(0.7); }
//         }

//         .db-info-text {
//           font-size: 0.83rem;
//           color: rgba(148,163,184,0.65);
//           line-height: 1.7;
//           font-weight: 300;
//         }

//         .db-info-text strong {
//           color: #94a3b8;
//           font-weight: 500;
//         }

//         /* Quick action row */
//         .db-quick-actions {
//           display: flex;
//           gap: 0.75rem;
//           margin-top: 1rem;
//           flex-wrap: wrap;
//         }

//         .db-quick-btn {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.5rem 1rem;
//           border-radius: 10px;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 0.78rem;
//           font-weight: 500;
//           cursor: pointer;
//           border: 1px solid rgba(99,102,241,0.25);
//           background: rgba(99,102,241,0.07);
//           color: #818cf8;
//           transition: all 0.2s;
//         }
//         .db-quick-btn:hover {
//           background: rgba(99,102,241,0.14);
//           border-color: rgba(99,102,241,0.45);
//         }

//         /* ── ACTIVITY LOG ── */
//         .db-activity-section {
//           margin-top: 2rem;
//           background: rgba(255,255,255,0.02);
//           border: 1px solid rgba(255,255,255,0.06);
//           border-radius: 16px;
//           padding: 1.5rem;
//           backdrop-filter: blur(10px);
//         }
//         .db-activity-title {
//           font-size: 1.1rem;
//           font-weight: 600;
//           color: #f8fafc;
//           margin-bottom: 1rem;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//         }
//         .db-activity-list {
//           display: flex;
//           flex-direction: column;
//           gap: 0.75rem;
//         }
//         .db-activity-item {
//           display: flex;
//           align-items: flex-start;
//           gap: 1rem;
//           padding: 0.75rem;
//           border-radius: 10px;
//           background: rgba(255,255,255,0.015);
//           border: 1px solid rgba(255,255,255,0.03);
//           transition: background 0.2s;
//         }
//         .db-activity-item:hover {
//           background: rgba(255,255,255,0.04);
//         }
//         .db-activity-icon {
//           width: 32px;
//           height: 32px;
//           border-radius: 8px;
//           background: rgba(99,102,241,0.1);
//           color: #818cf8;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 1rem;
//           flex-shrink: 0;
//         }
//         .db-activity-content {
//           display: flex;
//           flex-direction: column;
//           gap: 0.2rem;
//         }
//         .db-activity-action {
//           font-size: 0.85rem;
//           color: #e2e8f0;
//           font-weight: 500;
//         }
//         .db-activity-details {
//           font-size: 0.75rem;
//           color: rgba(148,163,184,0.8);
//         }
//         .db-activity-meta {
//           font-size: 0.7rem;
//           color: rgba(148,163,184,0.5);
//           margin-top: 0.1rem;
//         }
//       `}</style>

//       <div className={`db-root ${!isDarkMode ? 'light-theme' : ''}`}>

//         {/* ── TOPBAR ── */}
//         <header className="db-topbar">
//           {/* Brand / Logo */}
//           <div className="db-brand">
//             <div className="db-logo-wrap">
//               <img
//                 className="db-logo-img"
//                 src="../Assets/logo.png"
//                 alt="Company Logo"
//                 onError={(e) => {
//                   e.target.style.display = 'none';
//                   e.target.nextSibling.style.display = 'block';
//                 }}
//               />
//               <span className="db-logo-fallback">A</span>
//             </div>
//             <div>
//               <div className="db-brand-name">AssetTrack</div>
//               <div className="db-brand-sub">Management Portal</div>
//             </div>
//           </div>

//           {/* Right: user info + logout */}
//           <div className="db-topbar-right">
//             {/* Theme Toggle */}
//             <button 
//               onClick={() => setIsDarkMode(!isDarkMode)}
//               style={{ 
//                 background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', 
//                 borderRadius: '10px', color: 'var(--text-dim)', padding: '0.5rem', cursor: 'pointer',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
//               }}
//             >
//               <span style={{ fontSize: '1.2rem' }}>{isDarkMode ? '☀️' : '🌙'}</span>
//             </button>

//             {/* Notification Bell */}
//             <div style={{ position: 'relative' }}>
//               <button 
//                 onClick={() => setShowNotifications(!showNotifications)}
//                 style={{ 
//                   background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', 
//                   borderRadius: '10px', color: '#94a3b8', padding: '0.5rem', cursor: 'pointer',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
//                 }}
//               >
//                 <span style={{ fontSize: '1.2rem' }}>🔔</span>
//                 {notifications.filter(n => !n.isRead).length > 0 && (
//                   <span style={{ 
//                     position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', 
//                     color: 'white', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '10px',
//                     fontWeight: 'bold', border: '2px solid #07090f'
//                   }}>
//                     {notifications.filter(n => !n.isRead).length}
//                   </span>
//                 )}
//               </button>

//               {showNotifications && (
//                 <div style={{ 
//                   position: 'absolute', top: '45px', right: '0', width: '300px', 
//                   background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', 
//                   borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 1000,
//                   maxHeight: '400px', overflowY: 'auto'
//                 }}>
//                   <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Notifications</span>
//                     <button onClick={() => setNotifications([])} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.75rem', cursor: 'pointer' }}>Clear All</button>
//                   </div>
//                   {notifications.length === 0 ? (
//                     <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>No new notifications</div>
//                   ) : (
//                     notifications.map(n => (
//                       <div 
//                         key={n._id} 
//                         onClick={() => {
//                           markNotificationAsRead(n._id);
//                           setActiveTab('File Approval');
//                           setShowNotifications(false);
//                         }}
//                         style={{ 
//                           padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.03)', 
//                           cursor: 'pointer', transition: 'background 0.2s'
//                         }}
//                       >
//                         <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.25rem' }}>{n.message}</div>
//                         <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{new Date(n.createdAt).toLocaleString()}</div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>

//             <div className="db-user-pill">
//               <div className="db-avatar">
//                 {user.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
//               </div>
//               <span className="db-user-name">{user.name}</span>
//               <span
//                 className="db-role-badge"
//                 style={{
//                   background: roleStyle.bg,
//                   border: `1px solid ${roleStyle.border}`,
//                   color: roleStyle.text,
//                 }}
//               >
//                 {user.role}
//               </span>
//             </div>
//             <button className="db-logout-btn" onClick={handleLogout}>
//               <span>⏻</span>
//               Logout
//             </button>
//           </div>
//         </header>

//         {/* ── NAVIGATION TABS ── */}
//         <nav className="db-nav">
//           {tabs.map(tab => (
//             <div
//               key={tab.name}
//               className={`db-tab${activeTab === tab.name ? ' active' : ''}`}
//               onClick={() => setActiveTab(tab.name)}
//             >
//               <span className="db-tab-icon">{tab.icon}</span>
//               {tab.name}
//             </div>
//           ))}
//         </nav>

//         {/* ── MAIN CONTENT ── */}
//         <main className="db-main">

//           {activeTab === 'Overview' && (
//             <>
//               <div className="db-welcome">
//                 <div className="db-welcome-label">Dashboard Overview</div>
//                 <div className="db-welcome-heading">
//                   Welcome back, <span>{user.name?.split(' ')[0]}</span>
//                 </div>
//                 <div className="db-welcome-sub">
//                   Here's a snapshot of your {isAdmin ? 'system' : 'workspace'} — everything looks good today.
//                 </div>
//               </div>

//               {/* Stat cards */}
//               <div className="db-stats-grid">
//                 {overviewCards.map(card => (
//                   <div
//                     key={card.label}
//                     className="db-stat-card"
//                     style={{ '--stat-color': card.color }}
//                   >
//                     <div className="db-stat-icon">{card.icon}</div>
//                     <div className="db-stat-value">{card.value}</div>
//                     <div className="db-stat-label">{card.label}</div>
//                   </div>
//                 ))}
//               </div>

//               {/* Info panel */}
//               <div className="db-info-panel">
//                 <div className="db-info-dot" />
//                 <div>
//                   <div className="db-info-text">
//                     You're signed in as <strong>{user.role}</strong>.{' '}
//                     {isAdmin
//                       ? 'You have full access to manage assets, tickets, and user accounts across the system.'
//                       : 'You can view and manage your assigned assets and raise support tickets from the tabs above.'}
//                   </div>
//                   <div className="db-quick-actions">
//                     <button className="db-quick-btn" onClick={() => setActiveTab('Assets')}>
//                       ◈ View Assets
//                     </button>
//                     <button className="db-quick-btn" onClick={() => setActiveTab('Tickets')}>
//                       ◎ Open Tickets
//                     </button>
//                     {isAdmin && (
//                       <button className="db-quick-btn" onClick={() => setActiveTab('Users')}>
//                         ◉ Manage Users
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Activity Log */}
//               <div className="db-activity-section">
//                 <div className="db-activity-title">
//                   <span style={{ color: '#818cf8' }}>⚡</span> Recent Activity
//                 </div>
//                 {activities.length > 0 ? (
//                   <div className="db-activity-list">
//                     {activities.map((act) => (
//                       <div key={act._id} className="db-activity-item">
//                         <div className="db-activity-icon">
//                           {act.action.includes('Ticket') ? '◎'
//                             : act.action.includes('Asset') ? '◈'
//                             : act.action.includes('User') ? '◉'
//                             : '✓'}
//                         </div>
//                         <div className="db-activity-content">
//                           <div className="db-activity-action">
//                             {user.role === 'Super Admin' && <strong>{act.user?.name}</strong>}
//                             {user.role === 'Super Admin' ? ' ' : ''}
//                             {act.action}
//                           </div>
//                           <div className="db-activity-details">{act.details}</div>
//                           <div className="db-activity-meta">
//                             {new Date(act.createdAt).toLocaleString()}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.6)' }}>
//                     No recent activity.
//                   </div>
//                 )}
//               </div>
//             </>
//           )}

//           {activeTab === 'Assets'  && <AssetsList role={user.role} />}
//           {activeTab === 'Tickets' && <TicketsList role={user.role} onTicketCreated={fetchStats} />}
//           {activeTab === 'Vehicles' && <VehiclesList role={user.role} />}
//           {activeTab === 'Users' && isAdmin && (
//             <UsersManagement role={user.role} />
//           )}
//           {activeTab === 'Companies' && user.role === 'Super Admin' && (
//             <CompanyManagement />
//           )}
          
//           {/* Approval Module Consolidated Component */}
//           {activeTab === 'File Approval' && <ApprovalDashboard />}

//         </main>
//       </div>
//     </>
//   );
// };

// export default Dashboard;


import { API_BASE_URL } from '../config';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AssetsList from '../components/AssetsList';
import TicketsList from '../components/TicketsList';
import UsersManagement from '../components/UsersManagement';
import CompanyManagement from '../components/CompanyManagement';
import ApprovalDashboard from '../modules/approval/pages/Dashboard';
import VehiclesList from '../components/VehiclesList';
import Departments from '../modules/approval/pages/admin/Departments';

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  @keyframes db-slideDown  { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
  @keyframes db-fadeUp     { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes db-fadeIn     { from{opacity:0} to{opacity:1} }
  @keyframes db-gradShift  { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes db-pulse      { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
  @keyframes db-ringPulse  { 0%{box-shadow:0 0 0 0 rgba(99,102,241,.45)} 70%{box-shadow:0 0 0 8px rgba(99,102,241,0)} 100%{box-shadow:0 0 0 0 rgba(99,102,241,0)} }
  @keyframes db-shimmer    { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyndef db-notifSlide  { from{opacity:0;transform:translateY(-8px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes db-notifSlide { from{opacity:0;transform:translateY(-8px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes db-badgePop   { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }

  .db-root *, .db-root *::before, .db-root *::after { box-sizing:border-box; margin:0; padding:0; }

  .db-root {
    --bg-main: #08090d;
    --bg-topbar: rgba(8,9,13,.82);
    --bg-card: rgba(255,255,255,.03);
    --bg-panel: #0f1623;
    --text-main: #e2e8f0;
    --text-dim: #64748b;
    --text-muted: #334155;
    --border: rgba(255,255,255,.06);
    --border-light: rgba(255,255,255,.04);
    --accent: #6366f1;
    --accent-glow: rgba(99,102,241,.15);

    min-height:100vh;
    background: var(--bg-main);
    font-family:'DM Sans',sans-serif;
    color: var(--text-main);
    display:flex; flex-direction:column;
    position:relative; overflow-x:hidden;
    transition: background 0.3s, color 0.3s;
  }

  .db-root.light-mode {
    --bg-main: #f8fafc;
    --bg-topbar: rgba(255,255,255,.8);
    --bg-card: #ffffff;
    --bg-panel: #ffffff;
    --text-main: #0f172a;
    --text-dim: #475569;
    --text-muted: #94a3b8;
    --border: #e2e8f0;
    --border-light: #f1f5f9;
    --accent: #4f46e5;
    --accent-glow: rgba(79,70,229,.1);
  }

  /* Toast System */
  .db-toast-container {
    position: fixed; bottom: 2rem; right: 2rem;
    display: flex; flex-direction: column; gap: .75rem;
    z-index: 9999;
  }
  .db-toast {
    background: var(--bg-panel); border: 1px solid var(--border);
    padding: .85rem 1.25rem; border-radius: 14px;
    box-shadow: 0 10px 30px rgba(0,0,0,.2);
    display: flex; align-items: center; gap: .85rem;
    animation: db-notifSlide .3s cubic-bezier(.22,1,.36,1) both;
    min-width: 280px; max-width: 400px;
  }
  .db-toast-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--accent-glow); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: .9rem; flex-shrink: 0; }
  .db-toast-msg { font-size: .84rem; font-weight: 500; color: var(--text-main); flex: 1; }
  .db-toast-close { background: none; border: none; color: var(--text-dim); cursor: pointer; padding: .2rem; font-size: .8rem; display: flex; align-items: center; justify-content: center; opacity: .6; transition: all .2s; margin-left: .5rem; }
  .db-toast-close:hover { color: #ef4444; opacity: 1; transform: scale(1.1); }


  /* Ambient background */
  .db-root::before {
    content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
    background:
      radial-gradient(ellipse 60% 50% at 85% 5%,  rgba(99,102,241,.1)  0%, transparent 65%),
      radial-gradient(ellipse 50% 40% at 5%  90%,  rgba(6,182,212,.07)  0%, transparent 65%),
      radial-gradient(ellipse 40% 30% at 50% 50%,  rgba(139,92,246,.04) 0%, transparent 70%);
  }
  /* Subtle grid */
  .db-root::after {
    content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
    background-image:
      linear-gradient(rgba(99,102,241,.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,.018) 1px, transparent 1px);
    background-size:64px 64px;
  }

  /* ── TOPBAR ── */
  .db-topbar {
    position:sticky; top:0; z-index:200;
    display:flex; align-items:center; justify-content:space-between;
    padding:0 2rem; height:64px;
    background:rgba(8,9,13,.82);
    backdrop-filter:blur(20px);
    border-bottom:1px solid rgba(255,255,255,.06);
    animation:db-slideDown .5s cubic-bezier(.22,1,.36,1) both;
  }

  /* Brand */
  .db-brand { display:flex; align-items:center; gap:.7rem; text-decoration:none; }
  .db-logo-wrap {
    width:36px; height:36px; border-radius:10px;
    background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.09);
    display:flex; align-items:center; justify-content:center;
    overflow:hidden; position:relative; flex-shrink:0;
  }
  .db-logo-wrap::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,rgba(99,102,241,.25),rgba(6,182,212,.12));
  }
  .db-logo-img  { width:22px;height:22px;object-fit:contain;position:relative;z-index:1;filter:drop-shadow(0 1px 4px rgba(99,102,241,.5)); }
  .db-logo-fb   { font-family:'Syne',sans-serif;font-size:.95rem;font-weight:800;background:linear-gradient(135deg,#6366f1,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;position:relative;z-index:1;display:none; }
  .db-brand-name{ font-family:'Syne',sans-serif;font-size:.95rem;font-weight:700;color:#f1f5f9;letter-spacing:-.2px; }
  .db-brand-sub { font-size:.58rem;color:#334155;letter-spacing:.12em;text-transform:uppercase;font-family:'DM Mono',monospace; }

  /* Topbar right */
  .db-topbar-right { display:flex;align-items:center;gap:.65rem; }

  /* Theme toggle */
  .db-icon-btn {
    width:36px;height:36px;border-radius:10px;
    background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);
    color:#64748b;display:flex;align-items:center;justify-content:center;
    cursor:pointer;transition:all .2s;font-size:1rem;
  }
  .db-icon-btn:hover { background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.12);color:#94a3b8; }

  /* Notification bell */
  .db-notif-wrap { position:relative; }
  .db-notif-badge {
    position:absolute;top:-5px;right:-5px;
    background:#ef4444;color:#fff;
    font-size:.58rem;font-weight:700;font-family:'DM Mono',monospace;
    padding:2px 5px;border-radius:99px;border:2px solid #08090d;
    animation:db-badgePop .3s cubic-bezier(.34,1.56,.64,1) both;
    min-width:18px;text-align:center;line-height:1.2;
  }

  /* Notification dropdown */
  .db-notif-panel {
    position:absolute;top:calc(100% + 10px);right:0;width:320px;
    background:#0f1623;border:1px solid rgba(255,255,255,.09);
    border-radius:18px;box-shadow:0 20px 50px rgba(0,0,0,.6);
    z-index:300;overflow:hidden;
    animation:db-notifSlide .2s ease both;
  }
  .db-notif-header {
    padding:.9rem 1.2rem;border-bottom:1px solid rgba(255,255,255,.06);
    display:flex;justify-content:space-between;align-items:center;
  }
  .db-notif-title { font-family:'Syne',sans-serif;font-size:.85rem;font-weight:700;color:#f1f5f9; }
  .db-notif-clear { background:none;border:none;color:#6366f1;font-size:.72rem;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif; }
  .db-notif-clear:hover { color:#818cf8; }
  .db-notif-scroll { max-height:360px;overflow-y:auto; }
  .db-notif-item {
    padding:.9rem 1.2rem;border-bottom:1px solid rgba(255,255,255,.04);
    cursor:pointer;transition:background .15s;display:flex;gap:.8rem;align-items:flex-start;
  }
  .db-notif-item:hover { background:rgba(255,255,255,.04); }
  .db-notif-dot { width:7px;height:7px;border-radius:50%;background:#6366f1;margin-top:.35rem;flex-shrink:0;box-shadow:0 0 6px #6366f1; }
  .db-notif-msg  { font-size:.82rem;color:#cbd5e1;line-height:1.5;margin-bottom:.2rem; }
  .db-notif-time { font-size:.68rem;color:#334155;font-family:'DM Mono',monospace; }
  .db-notif-empty{ padding:2rem;text-align:center;color:#334155;font-size:.82rem; }

  /* User pill */
  .db-user-pill {
    display:flex;align-items:center;gap:.55rem;
    padding:.3rem .75rem .3rem .3rem;
    background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:99px;
  }
  .db-avatar {
    width:28px;height:28px;border-radius:50%;
    background:linear-gradient(135deg,#6366f1,#06b6d4);
    display:flex;align-items:center;justify-content:center;
    font-size:.68rem;font-weight:700;color:#fff;flex-shrink:0;
  }
  .db-user-name {
    font-size:.8rem;font-weight:500;color:#cbd5e1;
    max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  }
  .db-role-badge {
    display:inline-flex;align-items:center;
    padding:.15rem .5rem;border-radius:99px;
    font-size:.62rem;font-weight:600;letter-spacing:.03em;
    font-family:'DM Mono',monospace;
  }

  /* Logout */
  .db-logout {
    display:flex;align-items:center;gap:.4rem;
    padding:.42rem .85rem;
    background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.18);
    border-radius:10px;color:#fca5a5;
    font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:500;cursor:pointer;
    transition:all .2s;
  }
  .db-logout:hover { background:rgba(239,68,68,.14);border-color:rgba(239,68,68,.35);color:#fecaca; }

  /* ── NAV ── */
  .db-nav {
    position:relative;z-index:100;
    display:flex;align-items:center;gap:.15rem;
    padding:0 2rem;
    background:rgba(255,255,255,.012);
    border-bottom:1px solid rgba(255,255,255,.05);
    animation:db-fadeIn .4s .1s both;
    overflow-x:auto; scrollbar-width:none;
  }
  .db-nav::-webkit-scrollbar { display:none; }

  .db-tab {
    display:flex;align-items:center;gap:.45rem;
    padding:.85rem 1.1rem;cursor:pointer;
    font-size:.8rem;font-weight:500;
    color:#475569;
    border-bottom:2px solid transparent;
    transition:all .2s ease;
    white-space:nowrap;user-select:none;
    position:relative;
  }
  .db-tab:hover { color:#94a3b8;background:rgba(255,255,255,.025); }
  .db-tab.active { color:#818cf8;border-bottom-color:#6366f1;background:rgba(99,102,241,.06); }
  .db-tab-icon { font-size:.95rem;opacity:.65; }
  .db-tab.active .db-tab-icon { opacity:1; }

  /* ── MAIN ── */
  .db-main {
    position:relative;z-index:5;flex:1;padding:2.5rem 2.5rem;
    animation:db-fadeUp .45s .15s cubic-bezier(.22,1,.36,1) both;
  }

  /* ── WELCOME ── */
  .db-welcome { margin-bottom:2.5rem; }
  .db-welcome-label {
    font-size:.68rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;
    color:#334155;font-family:'DM Mono',monospace;margin-bottom:.35rem;
  }
  .db-welcome-heading {
    font-family:'Syne',sans-serif;
    font-size:2rem;font-weight:800;color:#f1f5f9;letter-spacing:-.5px;line-height:1.15;
  }
  .db-welcome-heading span {
    background:linear-gradient(90deg,#818cf8,#22d3ee,#818cf8);
    background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
    animation:db-gradShift 5s ease infinite;
  }
  .db-welcome-sub {
    font-size:.85rem;color:#334155;margin-top:.5rem;font-weight:300;line-height:1.7;
  }

  /* ── STAT CARDS ── */
  .db-stats { display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-bottom:2rem; }

  .db-stat {
    background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);
    border-radius:18px;padding:1.4rem 1.6rem;
    position:relative;overflow:hidden;
    transition:transform .22s,border-color .22s;
    animation:db-fadeUp .4s ease both;
  }
  .db-stat:hover { transform:translateY(-3px);border-color:rgba(255,255,255,.11); }
  .db-stat::before {
    content:''; position:absolute;top:0;left:0;right:0;height:2.5px;
    background:var(--sc);border-radius:18px 18px 0 0;
  }
  .db-stat::after {
    content:''; position:absolute;top:-25px;right:-15px;
    width:70px;height:70px;border-radius:50%;
    background:var(--sc);opacity:.07;filter:blur(14px);
  }
  .db-stat-icon-wrap {
    width:36px;height:36px;border-radius:10px;
    background:rgba(255,255,255,.05);
    display:flex;align-items:center;justify-content:center;
    margin-bottom:.85rem;font-size:1rem;
    color:var(--sc);
  }
  .db-stat-val {
    font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;
    color:#f1f5f9;letter-spacing:-1px;line-height:1;margin-bottom:.3rem;
    color:var(--sc);
  }
  .db-stat-lbl {
    font-size:.7rem;color:#334155;letter-spacing:.08em;
    text-transform:uppercase;font-weight:500;
  }

  /* ── INFO PANEL ── */
  .db-info {
    background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.06);
    border-radius:16px;padding:1.4rem 1.6rem;
    display:flex;align-items:flex-start;gap:1rem;margin-bottom:2rem;
  }
  .db-info-pulse {
    width:8px;height:8px;border-radius:50%;background:#6366f1;
    margin-top:.35rem;flex-shrink:0;
    box-shadow:0 0 8px #6366f1;animation:db-pulse 2.2s ease infinite;
  }
  .db-info-text { font-size:.84rem;color:#475569;line-height:1.75;font-weight:300; }
  .db-info-text strong { color:#64748b;font-weight:500; }
  .db-quick-row { display:flex;gap:.6rem;margin-top:.85rem;flex-wrap:wrap; }
  .db-quick-btn {
    display:flex;align-items:center;gap:.4rem;
    padding:.45rem .9rem;border-radius:9px;
    border:1px solid rgba(99,102,241,.2);background:rgba(99,102,241,.07);
    color:#818cf8;font-family:'DM Sans',sans-serif;font-size:.77rem;font-weight:500;cursor:pointer;
    transition:all .18s;
  }
  .db-quick-btn:hover { background:rgba(99,102,241,.14);border-color:rgba(99,102,241,.4);transform:translateY(-1px); }

  /* ── ACTIVITY ── */
  .db-activity {
    background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);
    border-radius:18px;padding:1.6rem;
  }
  .db-activity-head {
    font-family:'Syne',sans-serif;font-size:.82rem;font-weight:700;
    text-transform:uppercase;letter-spacing:.08em;color:#334155;
    margin-bottom:1.2rem;display:flex;align-items:center;gap:.5rem;
  }
  .db-activity-head span { color:#6366f1; }
  .db-act-list { display:flex;flex-direction:column;gap:.6rem; }
  .db-act-item {
    display:flex;align-items:flex-start;gap:.9rem;
    padding:.8rem 1rem;border-radius:12px;
    background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.03);
    transition:background .18s;
  }
  .db-act-item:hover { background:rgba(255,255,255,.04); }
  .db-act-ico {
    width:32px;height:32px;border-radius:9px;
    background:rgba(99,102,241,.1);color:#818cf8;
    display:flex;align-items:center;justify-content:center;
    font-size:.9rem;flex-shrink:0;
  }
  .db-act-action { font-size:.84rem;color:#e2e8f0;font-weight:500;margin-bottom:.15rem; }
  .db-act-detail { font-size:.75rem;color:#64748b; }
  .db-act-time   { font-size:.68rem;color:#334155;font-family:'DM Mono',monospace;margin-top:.15rem; }
  .db-act-empty  { font-size:.8rem;color:#1e293b;text-align:center;padding:2rem; }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const Svg = ({ d, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ROLE_STYLE = {
  'Super Admin': { bg:'rgba(234,179,8,.12)', border:'rgba(234,179,8,.3)', color:'#fbbf24' },
  'Admin':       { bg:'rgba(99,102,241,.12)', border:'rgba(99,102,241,.3)', color:'#818cf8' },
};
const roleStyle = r => ROLE_STYLE[r] || { bg:'rgba(20,184,166,.12)', border:'rgba(20,184,166,.3)', color:'#2dd4bf' };

const TAB_ICONS = {
  Overview: <Svg d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  Assets:   <Svg d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />,
  Tickets:  <Svg d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  Vehicles: <Svg d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v5a2 2 0 0 1-2 2h-3 M14 17a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M20 17a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />,
  Departments: <Svg d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />,
  'File Approval': <Svg d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" />,
  Users:    <Svg d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  Companies:<Svg d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />,
};

const ACT_ICON = a =>
  a?.includes('Ticket') ? <Svg d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  : a?.includes('Asset')  ? <Svg d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
  : a?.includes('User')   ? <Svg d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
  : <Svg d="M20 6L9 17l-5-5" />;

// ── Component ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState({ totalAssets:'—', openTickets:'—', resolvedToday:'—', teamMembers:'—' });
  const [activities, setActivities] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const [toasts, setToasts] = useState([]);
  const notifRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  // Inject styles
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchStats();
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 30000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!user || activeTab !== 'Overview') return;
    fetchStats();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Dashboard: No token found!");
        return;
      }
      const cfg = { headers: { Authorization: `Bearer ${token}` } };
      let assetsRes, ticketsRes, usersRes, activitiesRes;

      if (user.role === 'Super Admin' || user.role === 'Admin') {
        [assetsRes, ticketsRes, usersRes, activitiesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/assets`, cfg).catch(err => { console.error("Failed to fetch assets", err); return null; }),
          axios.get(`${API_BASE_URL}/tickets`, cfg).catch(err => { console.error("Failed to fetch tickets", err); return null; }),
          axios.get(`${API_BASE_URL}/users`, cfg).catch(err => { console.error("Failed to fetch users", err); return null; }),
          axios.get(`${API_BASE_URL}/activities`, cfg).catch(err => { console.error("Failed to fetch activities", err); return null; }),
        ]);
      } else {
        [assetsRes, ticketsRes, activitiesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/assets/me`, cfg).catch(err => { console.error("Failed to fetch my assets", err); return null; }),
          axios.get(`${API_BASE_URL}/tickets`, cfg).catch(err => { console.error("Failed to fetch tickets", err); return null; }),
          axios.get(`${API_BASE_URL}/activities`, cfg).catch(err => { console.error("Failed to fetch activities", err); return null; }),
        ]);
      }
      const assets   = assetsRes?.data || [];
      const tickets  = ticketsRes?.data || [];
      const users    = usersRes?.data || [];
      const acts     = activitiesRes?.data || [];

      if (!assetsRes || !ticketsRes) {
        console.warn("Critical stats fetch returned null. Check individual request logs.");
      }

      setActivities(acts);
      setLoadingActivities(false);
      
      const today = new Date(); today.setHours(0,0,0,0);
      const newStats = {
        totalAssets:   assetsRes ? assets.length : 'Error',
        openTickets:   ticketsRes ? tickets.filter(t => !['Resolved','Closed','Done'].includes(t.status)).length : 'Error',
        resolvedToday: ticketsRes ? tickets.filter(t => ['Resolved','Closed','Done'].includes(t.status) && new Date(t.updatedAt) >= today).length : 'Error',
        teamMembers:   usersRes ? users.length : 'N/A',
      };
      console.log("Setting stats:", newStats);
      setStats(newStats);
      setLoadingStats(false);
    } catch (err) { 
      console.error("fetchStats major failure:", err);
      setLoadingStats(false);
      setLoadingActivities(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/approval/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const newOnes = res.data.filter(n => !n.isRead && !notifications.find(old => old._id === n._id));
      if (newOnes.length > 0) {
        newOnes.forEach(n => addToast(n.message, 'info'));
      }

      setNotifications(res.data);
    } catch (err) { console.error(err); }
  };

  if (!user) { navigate('/login'); return null; }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isAdmin = user.role === 'Super Admin' || user.role === 'Admin';
  const rs = roleStyle(user.role);

  const tabs = [
    { name:'Overview' },
    ...(user.modules?.assets    ? [{ name:'Assets' }]         : []),
    ...(user.modules?.ticketing ? [{ name:'Tickets' }]        : []),
    ...(user.modules?.vehicles  ? [{ name:'Vehicles' }]       : []),
    ...(user.modules?.files     ? [{ name:'File Approval' }]  : []),
    ...(isAdmin                 ? [{ name:'Departments' }, { name:'Users' }]  : []),
    ...(user.role === 'Super Admin' ? [{ name:'Companies' }]  : []),
  ];

  const statCards = isAdmin
    ? [
        { label:'Total Assets',   value:stats.totalAssets,   color:'#6366f1', d:'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z' },
        { label:'Open Tickets',   value:stats.openTickets,   color:'#06b6d4', d:'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
        { label:'Resolved Today', value:stats.resolvedToday, color:'#10b981', d:'M20 6L9 17l-5-5' },
        { label:'Team Members',   value:stats.teamMembers,   color:'#f59e0b', d:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
      ]
    : [
        { label:'Open Tickets',   value:stats.openTickets,   color:'#06b6d4', d:'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
        { label:'Resolved Today', value:stats.resolvedToday, color:'#10b981', d:'M20 6L9 17l-5-5' },
        { label:'Assets',         value:stats.totalAssets,   color:'#6366f1', d:'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z' },
      ];

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`db-root ${!isDark ? 'light-mode' : ''}`}>

      {/* Toasts */}
      <div className="db-toast-container">
        {toasts.map(t => (
          <div key={t.id} className="db-toast">
            <div className="db-toast-icon">⚡</div>
            <div className="db-toast-msg">{t.message}</div>
            <button className="db-toast-close" onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))}>✕</button>
          </div>
        ))}
      </div>

      {/* ── TOPBAR ── */}
      <header className="db-topbar">
        <div className="db-brand">
          <div className="db-logo-wrap">
            <img className="db-logo-img" src="../Assets/logo.png" alt="Logo"
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
            <span className="db-logo-fb">A</span>
          </div>
          <div>
            <div className="db-brand-name">AssetTrack</div>
            <div className="db-brand-sub">Management Portal</div>
          </div>
        </div>

        <div className="db-topbar-right">
          {/* Theme toggle */}
          <button className="db-icon-btn" onClick={() => setIsDark(v => !v)} title="Toggle theme">
            {isDark ? <Svg d="M12 3v1m0 16v1M4.22 4.22l.71.71m12.02 12.02.71.71M3 12h1m16 0h1M4.93 19.07l.71-.71M18.36 5.64l.71-.71 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" size={16} />
                     : <Svg d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" size={16} />}
          </button>

          {/* Notifications */}
          <div className="db-notif-wrap" ref={notifRef}>
            <button className="db-icon-btn" onClick={() => setShowNotif(v => !v)}>
              <Svg d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" size={16} />
              {unread > 0 && <span className="db-notif-badge">{unread}</span>}
            </button>
            {showNotif && (
              <div className="db-notif-panel">
                <div className="db-notif-header">
                  <span className="db-notif-title">Notifications</span>
                  <button className="db-notif-clear" onClick={() => setNotifications([])}>Clear all</button>
                </div>
                <div className="db-notif-scroll">
                  {notifications.length === 0
                    ? <div className="db-notif-empty">You're all caught up ✓</div>
                    : notifications.map(n => (
                      <div key={n._id} className="db-notif-item" onClick={() => {
                        setNotifications(p => p.filter(x => x._id !== n._id));
                        setActiveTab('File Approval');
                        setShowNotif(false);
                      }}>
                        <div className="db-notif-dot" />
                        <div>
                          <div className="db-notif-msg">{n.message}</div>
                          <div className="db-notif-time">{new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </div>

          {/* User pill */}
          <div className="db-user-pill">
            <div className="db-avatar">
              {user.name?.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}
            </div>
            <span className="db-user-name">{user.name}</span>
            <span className="db-role-badge" style={{ background:rs.bg, border:`1px solid ${rs.border}`, color:rs.color, transition:'all .3s' }}>
              {user.role}
            </span>
          </div>

          <button className="db-logout" onClick={handleLogout}>
            <Svg d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* ── NAV ── */}
      <nav className="db-nav">
        {tabs.map(tab => (
          <div key={tab.name}
            className={`db-tab${activeTab === tab.name ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.name)}
          >
            <span className="db-tab-icon">{TAB_ICONS[tab.name]}</span>
            {tab.name}
          </div>
        ))}
      </nav>

      {/* ── MAIN ── */}
      <main className="db-main">

        {activeTab === 'Overview' && (
          <>
            {/* Welcome */}
            <div className="db-welcome">
              <div className="db-welcome-label">Dashboard Overview</div>
              <div className="db-welcome-heading">
                Welcome back, <span>{user.name?.split(' ')[0]}</span>
              </div>
              <div className="db-welcome-sub">
                Here's a snapshot of your {isAdmin ? 'system' : 'workspace'} — everything looks good today.
              </div>
            </div>

            {/* Stats */}
            <div className="db-stats">
              {loadingStats ? (
                [0,1,2,3].map(i => <div key={i} className="db-stat" style={{ '--sc':'#334155', opacity:.4 }}>Loading...</div>)
              ) : (
                statCards.map((c, i) => (
                  <div className="db-stat" key={c.label} style={{ '--sc':c.color, animationDelay:`${i*.07}s` }}>
                    <div className="db-stat-icon-wrap"><Svg d={c.d} size={17} /></div>
                    <div className="db-stat-val">{c.value}</div>
                    <div className="db-stat-lbl">{c.label}</div>
                  </div>
                ))
              )}
            </div>

            {/* Info panel */}
            <div className="db-info">
              <div className="db-info-pulse" />
              <div>
                <div className="db-info-text">
                  Signed in as <strong>{user.role}</strong>.{' '}
                  {isAdmin
                    ? 'You have full access to manage assets, tickets, and user accounts across the system.'
                    : 'You can view and manage your assigned assets and raise support tickets from the tabs above.'}
                </div>
                <div className="db-quick-row">
                  {user.modules?.assets && (
                    <button className="db-quick-btn" onClick={() => setActiveTab('Assets')}>
                      <Svg d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" size={13} />
                      Assets
                    </button>
                  )}
                  {user.modules?.ticketing && (
                    <button className="db-quick-btn" onClick={() => setActiveTab('Tickets')}>
                      <Svg d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" size={13} />
                      Tickets
                    </button>
                  )}
                  {isAdmin && (
                    <button className="db-quick-btn" onClick={() => setActiveTab('Users')}>
                      <Svg d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={13} />
                      Users
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="db-activity">
              <div className="db-activity-head">
                <span>⚡</span> Recent Activity
              </div>
              {loadingActivities ? (
                <div className="db-act-empty">Loading activity...</div>
              ) : activities.length > 0 ? (
                <div className="db-act-list">
                  {activities.map(act => (
                    <div key={act._id} className="db-act-item">
                      <div className="db-act-ico">{ACT_ICON(act.action)}</div>
                      <div>
                        <div className="db-act-action">
                          {user.role === 'Super Admin' && <strong style={{ color:'#94a3b8' }}>{act.user?.name} </strong>}
                          {act.action}
                        </div>
                        <div className="db-act-detail">{act.details}</div>
                        <div className="db-act-time">{new Date(act.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="db-act-empty">No recent activity to display.</div>
              )}
            </div>
          </>
        )}

        {activeTab === 'Assets'       && <AssetsList role={user.role} />}
        {activeTab === 'Tickets'      && <TicketsList role={user.role} onTicketCreated={fetchStats} />}
        {activeTab === 'Vehicles'     && <VehiclesList role={user.role} />}
        {activeTab === 'Users'        && isAdmin && <UsersManagement role={user.role} />}
        {activeTab === 'Companies'    && user.role === 'Super Admin' && <CompanyManagement />}
        {activeTab === 'Departments'  && isAdmin && <Departments />}
        {activeTab === 'File Approval' && <ApprovalDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;