// src/pages/DashboardRoot.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import DashboardHeader from '../components/DashboardHeader';
import { NavTabs } from '../components/NavTabs';
import { DepartmentOverview } from '../modules/departments/DepartmentOverview';
import { EmployeeWorkspace } from '../modules/employee/EmployeeWorkspace';
import { AdminDashboard } from '../modules/admin/AdminDashboard';
import AssetsList from '../components/AssetsList';
import TicketsList from '../components/TicketsList';
import UsersManagement from '../components/UsersManagement';
import VehiclesList from '../components/VehiclesList';
import '../styles/dashboard.css';

// ─── Helpers ────────────────────────────────────────────────────────────
const authCfg = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const roleStyle = (role) => {
  if (role === 'Super Admin') return { bg: 'rgba(234,179,8,.12)', border: 'rgba(234,179,8,.35)', text: '#fbbf24' };
  if (role === 'Admin') return { bg: 'rgba(99,102,241,.12)', border: 'rgba(99,102,241,.35)', text: '#818cf8' };
  return { bg: 'rgba(20,184,166,.12)', border: 'rgba(20,184,166,.35)', text: '#2dd4bf' };
};

// ─── KPI Cards ──────────────────────────────────────────────────────────
const KPICards = ({ kpis, loading }) => {
  const cards = [
    { label: 'Total Assets', value: kpis.assets, icon: '◈', color: '#6366f1' },
    { label: 'Open Tickets', value: kpis.tickets, icon: '◎', color: '#06b6d4' },
    { label: 'Team Members', value: kpis.users, icon: '◉', color: '#f59e0b' },
    { label: 'Vehicles', value: kpis.vehicles, icon: '🚗', color: '#10b981' },
    { label: 'Files Pending', value: kpis.files, icon: '📄', color: '#8b5cf6' },
    { label: 'Departments', value: kpis.departments, icon: '🏢', color: '#ec4899' },
  ];

  if (loading) {
    return (
      <div className="db-stats-grid">
        {cards.map((c) => (
          <div key={c.label} className="db-stat-card" style={{ '--stat-color': c.color }}>
            <div className="db-stat-icon">{c.icon}</div>
            <div className="db-stat-value" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, height: 36, width: 60 }} />
            <div className="db-stat-label">{c.label}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="db-stats-grid">
      {cards.map((c) => (
        <div key={c.label} className="db-stat-card" style={{ '--stat-color': c.color }}>
          <div className="db-stat-icon">{c.icon}</div>
          <div className="db-stat-value">{c.value ?? '—'}</div>
          <div className="db-stat-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
};

// ─── Action Center ──────────────────────────────────────────────────────
const ActionCenter = ({ pending, loading }) => {
  const { approvals = [], expiries = [], overdueTickets = [] } = pending || {};

  const urgencyConfig = {
    approvals: { label: '🕐 Pending Approvals', color: '#fcd34d', bg: 'rgba(251,191,36,.08)', border: 'rgba(251,191,36,.25)' },
    expiries: { label: '⚠️ Expiring Assets', color: '#fb923c', bg: 'rgba(251,146,60,.08)', border: 'rgba(251,146,60,.25)' },
    overdue: { label: '🔴 Overdue Tickets', color: '#f87171', bg: 'rgba(248,113,113,.08)', border: 'rgba(248,113,113,.25)' },
  };

  if (loading) {
    return (
      <section className="action-center">
        <h3>Action Center</h3>
        <div className="action-grid">
          {Object.values(urgencyConfig).map((u) => (
            <div key={u.label} className="action-card" style={{ background: u.bg, border: `1px solid ${u.border}` }}>
              <h4 style={{ color: u.color }}>{u.label}</h4>
              <p>Loading…</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const sections = [
    { key: 'approvals', items: approvals },
    { key: 'expiries', items: expiries },
    { key: 'overdue', items: overdueTickets },
  ];

  return (
    <section className="action-center">
      <h3>Action Center</h3>
      <div className="action-grid">
        {sections.map(({ key, items }) => {
          const u = urgencyConfig[key];
          return (
            <div key={key} className="action-card" style={{ background: u.bg, border: `1px solid ${u.border}` }}>
              <h4 style={{ color: u.color }}>{u.label}</h4>
              {items.length === 0 ? (
                <p style={{ color: u.color, opacity: 0.7 }}>All clear ✓</p>
              ) : (
                <ul>
                  {items.slice(0, 5).map((it, i) => (
                    <li key={i} style={{ color: u.color }}>
                      {it.title || it.name || it.assetName || JSON.stringify(it)}
                    </li>
                  ))}
                  {items.length > 5 && (
                    <li style={{ color: u.color, opacity: 0.6 }}>+{items.length - 5} more</li>
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ─── Activity Feed ──────────────────────────────────────────────────────
const ActivityFeed = ({ activities = [] }) => {
  const icon = (action = '') => {
    if (action.toLowerCase().includes('ticket')) return '◎';
    if (action.toLowerCase().includes('asset')) return '◈';
    if (action.toLowerCase().includes('user')) return '◉';
    if (action.toLowerCase().includes('file')) return '📄';
    return '✓';
  };

  return (
    <section className="db-activity-section">
      <div className="db-activity-title">
        <span style={{ color: '#818cf8' }}>⚡</span> Recent Activity
      </div>
      {activities.length === 0 ? (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No recent activity.</div>
      ) : (
        <div className="db-activity-list">
          {activities.slice(0, 10).map((act) => (
            <div key={act._id} className="db-activity-item">
              <div className="db-activity-icon">{icon(act.action)}</div>
              <div className="db-activity-content">
                <div className="db-activity-action">{act.action}</div>
                <div className="db-activity-details">{act.details}</div>
                <div className="db-activity-meta">{new Date(act.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// ─── Quick Actions ──────────────────────────────────────────────────────
const QuickActions = ({ user, setActiveTab }) => {
  const isAdmin = user?.role === 'Super Admin' || user?.role === 'Admin';
  const actions = [
    { label: '◈ View Assets', tab: 'Assets' },
    { label: '◎ Open Tickets', tab: 'Tickets' },
    { label: '🚗 Vehicles', tab: 'Vehicles' },
    ...(isAdmin ? [
      { label: '◉ Manage Users', tab: 'Users' },
      { label: '🏢 Departments', tab: 'Department' },
    ] : []),
  ];

  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
      {actions.map((a) => (
        <button key={a.tab} className="db-quick-btn" onClick={() => setActiveTab(a.tab)}>
          {a.label}
        </button>
      ))}
    </div>
  );
};

// ─── Calendar Widget ────────────────────────────────────────────────────
const CalendarWidget = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/dashboard/widgets/calendar`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="db-widget-card">
      <div className="db-widget-header">
        <span>📅</span> Upcoming Events
      </div>
      {loading ? (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading events...</div>
      ) : events.length === 0 ? (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No upcoming events.</div>
      ) : (
        <div className="db-widget-list">
          {events.map((evt, idx) => (
            <div key={idx} className="db-widget-item">
              <div className="db-widget-date-badge">
                <span className="db-widget-day">{new Date(evt.date).getDate()}</span>
                <span className="db-widget-month">{new Date(evt.date).toLocaleString('en-US', { month: 'short' })}</span>
              </div>
              <div className="db-widget-item-content">
                <div className="db-widget-item-title">{evt.title}</div>
                <span className={`db-widget-tag tag-${evt.type}`}>{evt.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Announcements Widget ───────────────────────────────────────────────
const AnnouncementsWidget = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/dashboard/widgets/announcements`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnnouncements(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="db-widget-card" style={{ marginTop: '1.5rem' }}>
      <div className="db-widget-header">
        <span>📣</span> Announcements
      </div>
      {loading ? (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No announcements.</div>
      ) : (
        <div className="db-widget-list">
          {announcements.map((ann, idx) => (
            <div key={idx} className="db-widget-ann-item">
              <div className="db-widget-ann-title">{ann.title}</div>
              <div className="db-widget-ann-content">{ann.content}</div>
              <div className="db-widget-ann-meta">
                <span>By {ann.author}</span> • <span>{new Date(ann.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Warranty Alerts Widget ─────────────────────────────────────────────
const WarrantyWidget = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarranty = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/assets/warranty-alerts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        // Not admin or no data — silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchWarranty();
  }, []);

  if (loading) return (
    <div className="db-widget-card" style={{ marginTop: '1.5rem' }}>
      <div className="db-widget-header"><span>🛡️</span> Warranty Monitor</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading warranty data...</div>
    </div>
  );

  if (!data) return null;

  const { expiringWarranties = [], expiredWarranties = [] } = data;
  if (expiringWarranties.length === 0 && expiredWarranties.length === 0) return (
    <div className="db-widget-card" style={{ marginTop: '1.5rem' }}>
      <div className="db-widget-header"><span>🛡️</span> Warranty Monitor</div>
      <div style={{ fontSize: '0.8rem', color: '#34d399', padding: '0.5rem 0' }}>✓ All warranties are valid.</div>
    </div>
  );

  return (
    <div className="db-widget-card" style={{ marginTop: '1.5rem', borderColor: expiringWarranties.length > 0 || expiredWarranties.length > 0 ? 'rgba(251,191,36,0.25)' : undefined }}>
      <div className="db-widget-header">
        <span>🛡️</span> Warranty Monitor
        <span style={{ marginLeft: 'auto', fontSize: '0.68rem', fontFamily: 'monospace', color: '#fbbf24' }}>
          {expiredWarranties.length} Expired · {expiringWarranties.length} Expiring Soon
        </span>
      </div>
      <div className="db-widget-list">
        {expiredWarranties.slice(0, 3).map((a, i) => (
          <div key={i} className="db-widget-item" style={{ borderLeft: '3px solid #ef4444', paddingLeft: '0.75rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>{a.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{a.uniqueId} · {a.assignedTo?.name || 'Unassigned'}</div>
            </div>
            <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', borderRadius: '99px', background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', whiteSpace: 'nowrap' }}>
              EXPIRED
            </span>
          </div>
        ))}
        {expiringWarranties.slice(0, 3).map((a, i) => {
          const days = Math.ceil((new Date(a.warrantyExpiryDate) - new Date()) / 86400000);
          return (
            <div key={i} className="db-widget-item" style={{ borderLeft: '3px solid #fbbf24', paddingLeft: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>{a.name}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{a.uniqueId} · {a.assignedTo?.name || 'Unassigned'}</div>
              </div>
              <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', borderRadius: '99px', background: 'rgba(251,191,36,0.12)', color: '#fcd34d', border: '1px solid rgba(251,191,36,0.3)', whiteSpace: 'nowrap' }}>
                {days}d left
              </span>
            </div>
          );
        })}
        {(expiredWarranties.length + expiringWarranties.length) > 6 && (
          <div style={{ fontSize: '0.74rem', color: '#64748b', textAlign: 'center', padding: '0.5rem 0' }}>
            +{(expiredWarranties.length + expiringWarranties.length) - 6} more — check Assets module
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Overview Page ──────────────────────────────────────────────────────
const OverviewPage = ({ user, kpis, kpiLoading, pending, pendingLoading, activities, setActiveTab }) => {
  const firstName = user?.name?.split(' ')[0] || 'there';
  const isAdmin = user?.role === 'Super Admin' || user?.role === 'Admin';

  return (
    <>
      {/* Welcome banner */}
      <div className="db-welcome">
        <div className="db-welcome-label">Dashboard Overview</div>
        <div className="db-welcome-heading">
          Welcome back, <span className="db-gradient-text">{firstName}</span>
        </div>
        <div className="db-welcome-sub">
          {isAdmin
            ? `Here's your organization snapshot — all systems operational.`
            : `Here's your personal workspace — everything assigned to you.`}
        </div>
      </div>

      {/* KPI Grid */}
      <KPICards kpis={kpis} loading={kpiLoading} />

      {/* Action Center (admins) */}
      {isAdmin && <ActionCenter pending={pending} loading={pendingLoading} />}

      {/* Quick actions */}
      <QuickActions user={user} setActiveTab={setActiveTab} />

      {/* Activity feed & Widgets Grid */}
      <div className="db-overview-layout">
        <div className="db-overview-left">
          <ActivityFeed activities={activities} />
        </div>
        <div className="db-overview-right">
          <CalendarWidget />
          {isAdmin && <WarrantyWidget />}
          <AnnouncementsWidget />
        </div>
      </div>
    </>
  );
};

// ─── DashboardRoot (main layout) ────────────────────────────────────────
const DashboardRoot = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [activeTab, setActiveTab] = useState('Overview');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('app_theme') === 'dark');

  // Data state
  const [kpis, setKpis] = useState({});
  const [kpiLoading, setKpiLoading] = useState(true);
  const [pending, setPending] = useState({});
  const [pendingLoading, setPendingLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  // Auth guard
  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
  }, [navigate]);

  // Apply theme
  useEffect(() => {
    localStorage.setItem('app_theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('light-mode', !isDark);
  }, [isDark]);

  // Fetch KPIs using centralized endpoint
  useEffect(() => {
    const fetch = async () => {
      setKpiLoading(true);
      try {
        const cfg = authCfg();
        const kpisRes = await axios.get(`${API_BASE_URL}/dashboard/kpis`, cfg);
        const actsRes = await axios.get(`${API_BASE_URL}/dashboard/activity?limit=10`, cfg).catch(() => ({ data: [] }));
        
        setKpis(kpisRes.data || {});
        setActivities(actsRes?.data || []);
      } catch (err) {
        console.error('KPI fetch error', err);
      } finally {
        setKpiLoading(false);
      }
    };
    fetch();
  }, [user?.role]);

  // Fetch pending items (action center)
  useEffect(() => {
    const isAdmin = user?.role === 'Super Admin' || user?.role === 'Admin';
    if (!isAdmin) { setPendingLoading(false); return; }
    const fetch = async () => {
      setPendingLoading(true);
      try {
        const cfg = authCfg();
        const pendingRes = await axios.get(`${API_BASE_URL}/dashboard/pending`, cfg);
        setPending(pendingRes.data || { approvals: [], expiries: [], overdueTickets: [] });
      } catch (err) {
        console.error('Pending fetch error', err);
      } finally {
        setPendingLoading(false);
      }
    };
    fetch();
  }, [user?.role]);

  const renderPage = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <OverviewPage
            user={user}
            kpis={kpis}
            kpiLoading={kpiLoading}
            pending={pending}
            pendingLoading={pendingLoading}
            activities={activities}
            setActiveTab={setActiveTab}
          />
        );
      case 'Assets':
        return <AssetsList role={user.role} />;
      case 'Tickets':
        return <TicketsList role={user.role} />;
      case 'Vehicles':
        return <VehiclesList role={user.role} />;
      case 'Users':
        return (user.role === 'Super Admin' || user.role === 'Admin') ? <UsersManagement /> : null;
      case 'Department':
        return <DepartmentOverview />;
      case 'Employee':
        return <EmployeeWorkspace />;
      case 'Admin':
        return <AdminDashboard />;
      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        .db-welcome { margin-bottom: 2rem; }
        .db-welcome-label { font-size:.7rem; font-weight:500; letter-spacing:.12em; text-transform:uppercase; color:var(--text-muted); font-family:'DM Mono',monospace; margin-bottom:.4rem; }
        .db-welcome-heading { font-size:1.75rem; font-weight:700; letter-spacing:-.5px; color:var(--text-main); line-height:1.2; }
        .db-gradient-text { background:linear-gradient(90deg,#818cf8,#22d3ee); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .db-welcome-sub { font-size:.83rem; color:var(--text-muted); margin-top:.4rem; font-weight:300; line-height:1.6; }
        .db-quick-btn { display:flex; align-items:center; gap:.5rem; padding:.5rem 1rem; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:.78rem; font-weight:500; cursor:pointer; border:1px solid rgba(99,102,241,.25); background:rgba(99,102,241,.07); color:#818cf8; transition:all .2s; }
        .db-quick-btn:hover { background:rgba(99,102,241,.14); border-color:rgba(99,102,241,.45); }
        .db-activity-section { margin-top:2rem; background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:1.5rem; }
        .db-activity-title { font-size:1.1rem; font-weight:600; color:var(--text-main); margin-bottom:1rem; display:flex; align-items:center; gap:.5rem; }
        .db-activity-list { display:flex; flex-direction:column; gap:.75rem; }
        .db-activity-item { display:flex; align-items:flex-start; gap:1rem; padding:.75rem; border-radius:10px; background:rgba(255,255,255,.02); border:1px solid var(--border); transition:background .2s; }
        .db-activity-item:hover { background:rgba(255,255,255,.04); }
        .db-activity-icon { width:32px; height:32px; border-radius:8px; background:rgba(99,102,241,.1); color:#818cf8; display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; }
        .db-activity-content { display:flex; flex-direction:column; gap:.2rem; }
        .db-activity-action { font-size:.85rem; color:var(--text-main); font-weight:500; }
        .db-activity-details { font-size:.75rem; color:var(--text-dim); }
        .db-activity-meta { font-size:.7rem; color:var(--text-muted); }
        
        /* Widgets layout */
        .db-overview-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        @media (max-width: 1024px) {
          .db-overview-layout {
            grid-template-columns: 1fr;
          }
        }
        .db-widget-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
        }
        .db-widget-header {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .db-widget-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .db-widget-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .db-widget-item:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .db-widget-date-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.2);
          flex-shrink: 0;
        }
        .db-widget-day {
          font-size: 0.95rem;
          font-weight: 700;
          color: #818cf8;
          line-height: 1;
        }
        .db-widget-month {
          font-size: 0.65rem;
          font-weight: 500;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .db-widget-item-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .db-widget-item-title {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);
        }
        .db-widget-tag {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          width: fit-content;
        }
        .tag-audit { background: rgba(99, 102, 241, 0.1); color: #818cf8; }
        .tag-maintenance { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
        .tag-event { background: rgba(16, 185, 129, 0.1); color: #34d399; }
        
        .db-widget-ann-item {
          padding: 0.75rem;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border);
          transition: all 0.2s;
        }
        .db-widget-ann-item:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(99, 102, 241, 0.2);
        }
        .db-widget-ann-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }
        .db-widget-ann-content {
          font-size: 0.78rem;
          color: var(--text-dim);
          line-height: 1.4;
          margin-bottom: 0.4rem;
        }
        .db-widget-ann-meta {
          font-size: 0.68rem;
          color: var(--text-muted);
        }
      `}</style>

      <div className="db-root">
        <DashboardHeader isDarkMode={isDark} setIsDarkMode={setIsDark} />
        <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="db-main">{renderPage()}</main>
      </div>
    </>
  );
};

export default DashboardRoot;
