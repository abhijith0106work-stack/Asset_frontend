// src/modules/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const authCfg = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const AdminDashboard = () => {
  const [activePanel, setActivePanel] = useState('assets');
  const [stats, setStats] = useState({
    assets: { total: 0, assigned: 0, maintenance: 0 },
    tickets: { open: 0, critical: 0, closed: 0 },
    vehicles: { total: 0, active: 0, expiredDocs: 0 },
    files: { pending: 0, approved: 0, rejected: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const cfg = authCfg();
        const [assetsRes, ticketsRes, vehiclesRes, filesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/assets`, cfg).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/tickets`, cfg).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/vehicles`, cfg).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/approval/files`, cfg).catch(() => ({ data: [] })),
        ]);

        const assets = assetsRes.data || [];
        const tickets = ticketsRes.data || [];
        const vehicles = vehiclesRes.data || [];
        const files = filesRes.data || [];

        setStats({
          assets: {
            total: assets.length,
            assigned: assets.filter(a => a.status === 'Assigned').length,
            maintenance: assets.filter(a => a.status === 'Under Maintenance' || a.status === 'Maintenance').length,
          },
          tickets: {
            open: tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length,
            critical: tickets.filter(t => t.priority === 'High' || t.priority === 'Critical').length,
            closed: tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length,
          },
          vehicles: {
            total: vehicles.length,
            active: vehicles.filter(v => v.status === 'In Use').length,
            expiredDocs: vehicles.filter(v => {
              const now = new Date();
              return (v.insuranceExpiry && new Date(v.insuranceExpiry) < now) ||
                     (v.pollutionExpiry && new Date(v.pollutionExpiry) < now);
            }).length
          },
          files: {
            pending: files.filter(f => f.status === 'Pending').length,
            approved: files.filter(f => f.status === 'Approved').length,
            rejected: files.filter(f => f.status === 'Rejected').length,
          }
        });
      } catch (err) {
        console.error('Error fetching admin dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  const renderAssetPanel = () => (
    <div className="adm-panel">
      <h4 className="adm-panel-title">Asset Admin Workspace</h4>
      <div className="adm-grid">
        <div className="adm-widget">
          <div className="adm-widget-num">{stats.assets.total}</div>
          <div className="adm-widget-lbl">Total Registered Hardware</div>
        </div>
        <div className="adm-widget">
          <div className="adm-widget-num" style={{ color: '#2dd4bf' }}>{stats.assets.assigned}</div>
          <div className="adm-widget-lbl">Currently Assigned & Active</div>
        </div>
        <div className="adm-widget">
          <div className="adm-widget-num" style={{ color: '#f59e0b' }}>{stats.assets.maintenance}</div>
          <div className="adm-widget-lbl">Assets in Maintenance</div>
        </div>
      </div>
      <div className="adm-actions">
        <h5>Quick Operations</h5>
        <div className="adm-actions-buttons">
          <a href="/dashboard" className="adm-btn">◈ Catalog View</a>
          <button className="adm-btn primary-btn" onClick={() => window.location.reload()}>⚡ Recalibrate Buffer</button>
        </div>
      </div>
    </div>
  );

  const renderTicketPanel = () => (
    <div className="adm-panel">
      <h4 className="adm-panel-title">Ticketing & Dispatch Workspace</h4>
      <div className="adm-grid">
        <div className="adm-widget">
          <div className="adm-widget-num" style={{ color: '#6366f1' }}>{stats.tickets.open}</div>
          <div className="adm-widget-lbl">Active Pending Resolution</div>
        </div>
        <div className="adm-widget">
          <div className="adm-widget-num" style={{ color: '#f87171' }}>{stats.tickets.critical}</div>
          <div className="adm-widget-lbl">High Priority Escalations</div>
        </div>
        <div className="adm-widget">
          <div className="adm-widget-num" style={{ color: '#10b981' }}>{stats.tickets.closed}</div>
          <div className="adm-widget-lbl">Resolved Today</div>
        </div>
      </div>
      <div className="adm-actions">
        <h5>Dispatch Operations</h5>
        <div className="adm-actions-buttons">
          <a href="/dashboard" className="adm-btn">◎ Queue Management</a>
          <button className="adm-btn primary-btn" onClick={() => window.location.reload()}>⚡ Force SLAs Re-run</button>
        </div>
      </div>
    </div>
  );

  const renderVehiclePanel = () => (
    <div className="adm-panel">
      <h4 className="adm-panel-title">Fleet Logistics Command Panel</h4>
      <div className="adm-grid">
        <div className="adm-widget">
          <div className="adm-widget-num">{stats.vehicles.total}</div>
          <div className="adm-widget-lbl">Registered Fleet Assets</div>
        </div>
        <div className="adm-widget">
          <div className="adm-widget-num" style={{ color: '#06b6d4' }}>{stats.vehicles.active}</div>
          <div className="adm-widget-lbl">Vehicles In Use / Dispatched</div>
        </div>
        <div className="adm-widget">
          <div className="adm-widget-num" style={{ color: '#ef4444' }}>{stats.vehicles.expiredDocs}</div>
          <div className="adm-widget-lbl">Vehicles with Compliance Alerts</div>
        </div>
      </div>
      <div className="adm-actions">
        <h5>Logistical Actions</h5>
        <div className="adm-actions-buttons">
          <button className="adm-btn" onClick={() => window.location.reload()}>🚗 GPS Ping All</button>
          <button className="adm-btn primary-btn" onClick={() => window.location.reload()}>⚡ Run Compliance Checks</button>
        </div>
      </div>
    </div>
  );

  const renderFilesPanel = () => (
    <div className="adm-panel">
      <h4 className="adm-panel-title">Document Lifecycle & Approvals</h4>
      <div className="adm-grid">
        <div className="adm-widget">
          <div className="adm-widget-num" style={{ color: '#f59e0b' }}>{stats.files.pending}</div>
          <div className="adm-widget-lbl">Awaiting Digital Signatures</div>
        </div>
        <div className="adm-widget">
          <div className="adm-widget-num" style={{ color: '#10b981' }}>{stats.files.approved}</div>
          <div className="adm-widget-lbl">Completed Document Workflows</div>
        </div>
        <div className="adm-widget">
          <div className="adm-widget-num" style={{ color: '#f87171' }}>{stats.files.rejected}</div>
          <div className="adm-widget-lbl">Rejected Documents</div>
        </div>
      </div>
      <div className="adm-actions">
        <h5>Workflow Management</h5>
        <div className="adm-actions-buttons">
          <a href="/dashboard" className="adm-btn">📄 Document Hub</a>
          <button className="adm-btn primary-btn" onClick={() => window.location.reload()}>⚡ Sync Workflow Cache</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .adm-dashboard {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          margin-top: 1rem;
        }
        .adm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .adm-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .adm-tabs {
          display: flex;
          gap: 0.5rem;
        }
        .adm-tab {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .adm-tab:hover {
          color: var(--text-main);
          border-color: rgba(99, 102, 241, 0.3);
        }
        .adm-tab.active {
          background: rgba(99, 102, 241, 0.08);
          border-color: rgba(99, 102, 241, 0.4);
          color: #818cf8;
        }
        .adm-panel {
          animation: panelIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .adm-panel-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 1.5rem;
        }
        .adm-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .adm-widget {
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }
        .adm-widget-num {
          font-size: 2.2rem;
          font-weight: 700;
          font-family: 'DM Mono', monospace;
          color: var(--text-main);
          margin-bottom: 0.25rem;
          line-height: 1;
        }
        .adm-widget-lbl {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .adm-actions {
          background: rgba(255, 255, 255, 0.01);
          border: 1px dashed var(--border);
          border-radius: 12px;
          padding: 1.5rem;
        }
        .adm-actions h5 {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 1rem;
        }
        .adm-actions-buttons {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .adm-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          border: 1px solid rgba(99, 102, 241, 0.25);
          background: rgba(99, 102, 241, 0.05);
          color: #818cf8;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: all 0.2s;
        }
        .adm-btn:hover {
          background: rgba(99, 102, 241, 0.12);
          border-color: rgba(99, 102, 241, 0.45);
        }
        .adm-btn.primary-btn {
          background: #6366f1;
          color: #fff;
          border-color: transparent;
        }
        .adm-btn.primary-btn:hover {
          background: #4f46e5;
        }
        @media (max-width: 768px) {
          .adm-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="adm-dashboard">
        <div className="adm-header">
          <h3 className="adm-title">Admin Command Center</h3>
          <div className="adm-tabs">
            <button
              className={`adm-tab ${activePanel === 'assets' ? 'active' : ''}`}
              onClick={() => setActivePanel('assets')}
            >
              ◈ Assets
            </button>
            <button
              className={`adm-tab ${activePanel === 'tickets' ? 'active' : ''}`}
              onClick={() => setActivePanel('tickets')}
            >
              ◎ Tickets
            </button>
            <button
              className={`adm-tab ${activePanel === 'vehicles' ? 'active' : ''}`}
              onClick={() => setActivePanel('vehicles')}
            >
              🚗 Fleet
            </button>
            <button
              className={`adm-tab ${activePanel === 'files' ? 'active' : ''}`}
              onClick={() => setActivePanel('files')}
            >
              📄 Approvals
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading admin diagnostics...</div>
        ) : (
          <div className="adm-content">
            {activePanel === 'assets' && renderAssetPanel()}
            {activePanel === 'tickets' && renderTicketPanel()}
            {activePanel === 'vehicles' && renderVehiclePanel()}
            {activePanel === 'files' && renderFilesPanel()}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
