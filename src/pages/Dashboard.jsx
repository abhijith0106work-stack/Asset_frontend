// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import AssetsList from '../components/AssetsList';
// import TicketsList from '../components/TicketsList';
// import UsersManagement from '../components/UsersManagement';


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
//           axios.get('http://localhost:5000/api/assets', config),
//           axios.get('http://localhost:5000/api/tickets', config),
//           axios.get('http://localhost:5000/api/users', config).catch(() => null),
//           axios.get('http://localhost:5000/api/activities', config).catch(() => null)
//         ]);
//       } else {
//         [assetsRes, ticketsRes, activitiesRes] = await Promise.all([
//           axios.get('http://localhost:5000/api/assets/me', config),
//           axios.get('http://localhost:5000/api/tickets/me', config),
//           axios.get('http://localhost:5000/api/activities', config).catch(() => null)
//         ]);
//       }
      
//       const assets = assetsRes?.data || [];
//       const tickets = ticketsRes?.data || [];
//       const users = usersRes?.data || [];
//       const fetchedActivities = activitiesRes?.data || [];
      
//       setActivities(fetchedActivities);
      
//       const today = new Date();
//       today.setHours(0,0,0,0);
      
//       const resolvedTodayCount = tickets.filter(t => {
//         if (t.status !== 'Resolved' && t.status !== 'Closed') return false;
//         const d = new Date(t.updatedAt);
//         return d >= today;
//       }).length;
      
//       const openTicketsCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
      
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

//   if (!user) {
//     navigate('/login');
//     return null;
//   }

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   const tabs = [
//     { name: 'Overview', icon: '⊞' },
//     { name: 'Assets',   icon: '◈' },
//     { name: 'Tickets',  icon: '◎' },
//     ...((user.role === 'Super Admin' || user.role === 'Admin')
//       ? [{ name: 'Users', icon: '◉' }]
//       : []),
//   ];

//   const getRoleBadgeColor = (role) => {
//     if (role === 'Super Admin') return { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.35)', text: '#fbbf24' };
//     if (role === 'Admin')       return { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.35)', text: '#818cf8' };
//     return { bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.35)', text: '#2dd4bf' };
//   };

//   const roleStyle = getRoleBadgeColor(user.role);

//   const overviewCards = [
//     { label: 'Total Assets',   value: stats.totalAssets, icon: '◈', color: '#6366f1' },
//     { label: 'Open Tickets',   value: stats.openTickets, icon: '◎', color: '#06b6d4' },
//     { label: 'Resolved Today', value: stats.resolvedToday, icon: '✓', color: '#10b981' },
//     { label: 'Team Members',   value: stats.teamMembers, icon: '◉', color: '#f59e0b' },
//   ];

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         .db-root {
//           min-height: 100vh;
//           background: #07090f;
//           font-family: 'DM Sans', sans-serif;
//           color: #e2e8f0;
//           display: flex;
//           flex-direction: column;
//           position: relative;
//           overflow-x: hidden;
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
//           background: rgba(7, 9, 15, 0.85);
//           backdrop-filter: blur(20px);
//           -webkit-backdrop-filter: blur(20px);
//           border-bottom: 1px solid rgba(255,255,255,0.06);
//           animation: slideDown 0.5s cubic-bezier(0.22,1,0.36,1) both;
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

//       <div className="db-root">

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
//                   Here's a snapshot of your {user.role === 'Super Admin' || user.role === 'Admin' ? 'system' : 'workspace'} — everything looks good today.
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
//                     {user.role === 'Super Admin' || user.role === 'Admin'
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
//                     {(user.role === 'Super Admin' || user.role === 'Admin') && (
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
//                           {act.action.includes('Ticket') ? '◎' : act.action.includes('Asset') ? '◈' : act.action.includes('User') ? '◉' : '✓'}
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
//                   <div style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.6)' }}>No recent activity.</div>
//                 )}
//               </div>
//             </>
//           )}

//           {activeTab === 'Assets'  && <AssetsList role={user.role} />}
//           {activeTab === 'Tickets' && <TicketsList role={user.role} />}
//           {activeTab === 'Users' && (user.role === 'Super Admin' || user.role === 'Admin') && (
//             <UsersManagement role={user.role} />
//           )}

//         </main>
//       </div>
//     </>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AssetsList from '../components/AssetsList';
import TicketsList from '../components/TicketsList';
import UsersManagement from '../components/UsersManagement';
import CompanyManagement from '../components/CompanyManagement';


const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState({
    totalAssets: '—',
    openTickets: '—',
    resolvedToday: '—',
    teamMembers: '—'
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetchStats();
  }, []);

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'Overview') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      let assetsRes, ticketsRes, usersRes, activitiesRes;

      if (user.role === 'Super Admin' || user.role === 'Admin') {
        [assetsRes, ticketsRes, usersRes, activitiesRes] = await Promise.all([
          axios.get('https://asset-backend-r4qe.onrender.com/api/assets', config),
          axios.get('https://asset-backend-r4qe.onrender.com/api/tickets', config),
          axios.get('https://asset-backend-r4qe.onrender.com/api/users', config).catch(() => null),
          axios.get('https://asset-backend-r4qe.onrender.com/api/activities', config).catch(() => null)
        ]);
      } else {
        [assetsRes, ticketsRes, activitiesRes] = await Promise.all([
          axios.get('https://asset-backend-r4qe.onrender.com/api/assets/me', config),
          axios.get('https://asset-backend-r4qe.onrender.com/api/tickets', config),
          axios.get('https://asset-backend-r4qe.onrender.com/api/activities', config).catch(() => null)
        ]);
      }

      const assets = assetsRes?.data || [];
      const tickets = ticketsRes?.data || [];
      const users = usersRes?.data || [];
      const fetchedActivities = activitiesRes?.data || [];

      setActivities(fetchedActivities);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const resolvedTodayCount = tickets.filter(t => {
        if (t.status !== 'Resolved' && t.status !== 'Closed') return false;
        const d = new Date(t.updatedAt);
        return d >= today;
      }).length;

      const openTicketsCount = tickets.filter(
        t => t.status === 'Open' || t.status === 'In Progress'
      ).length;

      setStats({
        totalAssets: assets.length,
        openTickets: openTicketsCount,
        resolvedToday: resolvedTodayCount,
        teamMembers: usersRes ? users.length : 'N/A'
      });

    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isAdmin = user.role === 'Super Admin' || user.role === 'Admin';

  const tabs = [
    { name: 'Overview', icon: '⊞' },
    { name: 'Assets',   icon: '◈' },
    { name: 'Tickets',  icon: '◎' },
    ...(isAdmin ? [{ name: 'Users', icon: '◉' }] : []),
    ...(user.role === 'Super Admin' ? [{ name: 'Companies', icon: '🏢' }] : []),
  ];

  const getRoleBadgeColor = (role) => {
    if (role === 'Super Admin') return { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.35)', text: '#fbbf24' };
    if (role === 'Admin')       return { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.35)', text: '#818cf8' };
    return { bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.35)', text: '#2dd4bf' };
  };

  const roleStyle = getRoleBadgeColor(user.role);

  const overviewCards = isAdmin 
    ? [
        { label: 'Total Assets',   value: stats.totalAssets,   icon: '◈', color: '#6366f1' },
        { label: 'Open Tickets',   value: stats.openTickets,   icon: '◎', color: '#06b6d4' },
        { label: 'Resolved Today', value: stats.resolvedToday, icon: '✓', color: '#10b981' },
        { label: 'Team Members',   value: stats.teamMembers,   icon: '◉', color: '#f59e0b' }
      ]
    : [
        { label: 'Open Tickets',   value: stats.openTickets,   icon: '◎', color: '#06b6d4' },
        { label: 'Resolved Today', value: stats.resolvedToday, icon: '✓', color: '#10b981' },
        { label: 'Assets',         value: stats.totalAssets,   icon: '◈', color: '#6366f1' }
      ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .db-root {
          min-height: 100vh;
          background: #07090f;
          font-family: 'DM Sans', sans-serif;
          color: #e2e8f0;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow-x: hidden;
        }

        /* Subtle background texture */
        .db-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(ellipse 70% 50% at 80% 10%, rgba(99,102,241,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 10% 90%, rgba(6,182,212,0.06) 0%, transparent 60%),
            linear-gradient(rgba(99,102,241,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.025) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 60px 60px, 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── TOPBAR ── */
        .db-topbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 64px;
          background: rgba(7, 9, 15, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          animation: slideDown 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-100%); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Logo area */
        .db-brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
        }

        .db-logo-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }
        .db-logo-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.1));
        }
        .db-logo-img {
          width: 24px;
          height: 24px;
          object-fit: contain;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 1px 4px rgba(99,102,241,0.5));
        }
        .db-logo-fallback {
          font-size: 1rem;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          z-index: 1;
          display: none;
        }

        .db-brand-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #f1f5f9;
          letter-spacing: -0.2px;
          line-height: 1;
        }
        .db-brand-sub {
          font-size: 0.62rem;
          color: rgba(148,163,184,0.45);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-family: 'DM Mono', monospace;
        }

        /* Right side: user pill + logout */
        .db-topbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .db-user-pill {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.35rem 0.75rem 0.35rem 0.35rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 100px;
        }

        .db-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
          letter-spacing: 0;
        }

        .db-user-name {
          font-size: 0.8rem;
          font-weight: 500;
          color: #cbd5e1;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .db-role-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.15rem 0.5rem;
          border-radius: 100px;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          font-family: 'DM Mono', monospace;
        }

        .db-logout-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          color: #fca5a5;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .db-logout-btn:hover {
          background: rgba(239,68,68,0.15);
          border-color: rgba(239,68,68,0.4);
          color: #fecaca;
        }

        /* ── NAV TABS ── */
        .db-nav {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0 2rem;
          background: rgba(255,255,255,0.015);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          animation: fadeIn 0.5s 0.1s both;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .db-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.9rem 1.25rem;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 500;
          color: rgba(148,163,184,0.6);
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
          position: relative;
          white-space: nowrap;
          user-select: none;
        }

        .db-tab:hover {
          color: rgba(226,232,240,0.85);
          background: rgba(255,255,255,0.03);
        }

        .db-tab.active {
          color: #818cf8;
          border-bottom-color: #6366f1;
          background: rgba(99,102,241,0.05);
        }

        .db-tab-icon {
          font-size: 1rem;
          line-height: 1;
          opacity: 0.7;
        }
        .db-tab.active .db-tab-icon {
          opacity: 1;
        }

        /* ── MAIN CONTENT ── */
        .db-main {
          position: relative;
          z-index: 5;
          flex: 1;
          padding: 2rem;
          animation: contentIn 0.5s 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes contentIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── OVERVIEW ── */
        .db-welcome {
          margin-bottom: 2rem;
        }

        .db-welcome-label {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(148,163,184,0.45);
          font-family: 'DM Mono', monospace;
          margin-bottom: 0.4rem;
        }

        .db-welcome-heading {
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #f1f5f9;
          line-height: 1.2;
        }

        .db-welcome-heading span {
          background: linear-gradient(90deg, #818cf8, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .db-welcome-sub {
          font-size: 0.83rem;
          color: rgba(148,163,184,0.55);
          margin-top: 0.4rem;
          font-weight: 300;
          line-height: 1.6;
        }

        /* Stat cards */
        .db-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .db-stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }

        .db-stat-card:hover {
          border-color: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        .db-stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--stat-color);
          opacity: 0.6;
        }

        .db-stat-card::after {
          content: '';
          position: absolute;
          top: -30px; right: -20px;
          width: 80px; height: 80px;
          border-radius: 50%;
          background: var(--stat-color);
          opacity: 0.06;
          filter: blur(16px);
        }

        .db-stat-icon {
          font-size: 1.4rem;
          margin-bottom: 0.75rem;
          color: var(--stat-color);
          opacity: 0.85;
        }

        .db-stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -1px;
          font-family: 'DM Mono', monospace;
          line-height: 1;
          margin-bottom: 0.3rem;
        }

        .db-stat-label {
          font-size: 0.72rem;
          color: rgba(148,163,184,0.5);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* Quick info panel */
        .db-info-panel {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .db-info-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #6366f1;
          margin-top: 0.35rem;
          flex-shrink: 0;
          box-shadow: 0 0 8px #6366f1;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }

        .db-info-text {
          font-size: 0.83rem;
          color: rgba(148,163,184,0.65);
          line-height: 1.7;
          font-weight: 300;
        }

        .db-info-text strong {
          color: #94a3b8;
          font-weight: 500;
        }

        /* Quick action row */
        .db-quick-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .db-quick-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid rgba(99,102,241,0.25);
          background: rgba(99,102,241,0.07);
          color: #818cf8;
          transition: all 0.2s;
        }
        .db-quick-btn:hover {
          background: rgba(99,102,241,0.14);
          border-color: rgba(99,102,241,0.45);
        }

        /* ── ACTIVITY LOG ── */
        .db-activity-section {
          margin-top: 2rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }
        .db-activity-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #f8fafc;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .db-activity-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .db-activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 10px;
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(255,255,255,0.03);
          transition: background 0.2s;
        }
        .db-activity-item:hover {
          background: rgba(255,255,255,0.04);
        }
        .db-activity-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(99,102,241,0.1);
          color: #818cf8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }
        .db-activity-content {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .db-activity-action {
          font-size: 0.85rem;
          color: #e2e8f0;
          font-weight: 500;
        }
        .db-activity-details {
          font-size: 0.75rem;
          color: rgba(148,163,184,0.8);
        }
        .db-activity-meta {
          font-size: 0.7rem;
          color: rgba(148,163,184,0.5);
          margin-top: 0.1rem;
        }
      `}</style>

      <div className="db-root">

        {/* ── TOPBAR ── */}
        <header className="db-topbar">
          {/* Brand / Logo */}
          <div className="db-brand">
            <div className="db-logo-wrap">
              <img
                className="db-logo-img"
                src="../Assets/logo.png"
                alt="Company Logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="db-logo-fallback">A</span>
            </div>
            <div>
              <div className="db-brand-name">AssetTrack</div>
              <div className="db-brand-sub">Management Portal</div>
            </div>
          </div>

          {/* Right: user info + logout */}
          <div className="db-topbar-right">
            <div className="db-user-pill">
              <div className="db-avatar">
                {user.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <span className="db-user-name">{user.name}</span>
              <span
                className="db-role-badge"
                style={{
                  background: roleStyle.bg,
                  border: `1px solid ${roleStyle.border}`,
                  color: roleStyle.text,
                }}
              >
                {user.role}
              </span>
            </div>
            <button className="db-logout-btn" onClick={handleLogout}>
              <span>⏻</span>
              Logout
            </button>
          </div>
        </header>

        {/* ── NAVIGATION TABS ── */}
        <nav className="db-nav">
          {tabs.map(tab => (
            <div
              key={tab.name}
              className={`db-tab${activeTab === tab.name ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.name)}
            >
              <span className="db-tab-icon">{tab.icon}</span>
              {tab.name}
            </div>
          ))}
        </nav>

        {/* ── MAIN CONTENT ── */}
        <main className="db-main">

          {activeTab === 'Overview' && (
            <>
              <div className="db-welcome">
                <div className="db-welcome-label">Dashboard Overview</div>
                <div className="db-welcome-heading">
                  Welcome back, <span>{user.name?.split(' ')[0]}</span>
                </div>
                <div className="db-welcome-sub">
                  Here's a snapshot of your {isAdmin ? 'system' : 'workspace'} — everything looks good today.
                </div>
              </div>

              {/* Stat cards */}
              <div className="db-stats-grid">
                {overviewCards.map(card => (
                  <div
                    key={card.label}
                    className="db-stat-card"
                    style={{ '--stat-color': card.color }}
                  >
                    <div className="db-stat-icon">{card.icon}</div>
                    <div className="db-stat-value">{card.value}</div>
                    <div className="db-stat-label">{card.label}</div>
                  </div>
                ))}
              </div>

              {/* Info panel */}
              <div className="db-info-panel">
                <div className="db-info-dot" />
                <div>
                  <div className="db-info-text">
                    You're signed in as <strong>{user.role}</strong>.{' '}
                    {isAdmin
                      ? 'You have full access to manage assets, tickets, and user accounts across the system.'
                      : 'You can view and manage your assigned assets and raise support tickets from the tabs above.'}
                  </div>
                  <div className="db-quick-actions">
                    <button className="db-quick-btn" onClick={() => setActiveTab('Assets')}>
                      ◈ View Assets
                    </button>
                    <button className="db-quick-btn" onClick={() => setActiveTab('Tickets')}>
                      ◎ Open Tickets
                    </button>
                    {isAdmin && (
                      <button className="db-quick-btn" onClick={() => setActiveTab('Users')}>
                        ◉ Manage Users
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div className="db-activity-section">
                <div className="db-activity-title">
                  <span style={{ color: '#818cf8' }}>⚡</span> Recent Activity
                </div>
                {activities.length > 0 ? (
                  <div className="db-activity-list">
                    {activities.map((act) => (
                      <div key={act._id} className="db-activity-item">
                        <div className="db-activity-icon">
                          {act.action.includes('Ticket') ? '◎'
                            : act.action.includes('Asset') ? '◈'
                            : act.action.includes('User') ? '◉'
                            : '✓'}
                        </div>
                        <div className="db-activity-content">
                          <div className="db-activity-action">
                            {user.role === 'Super Admin' && <strong>{act.user?.name}</strong>}
                            {user.role === 'Super Admin' ? ' ' : ''}
                            {act.action}
                          </div>
                          <div className="db-activity-details">{act.details}</div>
                          <div className="db-activity-meta">
                            {new Date(act.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.6)' }}>
                    No recent activity.
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'Assets'  && <AssetsList role={user.role} />}
          {activeTab === 'Tickets' && <TicketsList role={user.role} onTicketCreated={fetchStats} />}
          {activeTab === 'Users' && isAdmin && (
            <UsersManagement role={user.role} />
          )}
          {activeTab === 'Companies' && user.role === 'Super Admin' && (
            <CompanyManagement />
          )}

        </main>
      </div>
    </>
  );
};

export default Dashboard;