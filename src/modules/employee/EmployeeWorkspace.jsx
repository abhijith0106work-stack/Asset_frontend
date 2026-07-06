// src/modules/employee/EmployeeWorkspace.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const authCfg = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const EmployeeWorkspace = () => {
  const [activeSubTab, setActiveSubTab] = useState('assets');
  const [assets, setAssets] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Password reset state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cfg = authCfg();
        const [assetsRes, vehiclesRes, ticketsRes, filesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/assets/me`, cfg).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/vehicles/me`, cfg).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/tickets`, cfg).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/approval/files`, cfg).catch(() => ({ data: [] })),
        ]);

        setAssets(assetsRes.data || []);
        setVehicles(vehiclesRes.data || []);
        setTickets(ticketsRes.data || []);

        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userFiles = (filesRes.data || []).filter(f => f.uploadedBy?._id === currentUser._id || f.uploadedBy === currentUser._id);
        setFiles(userFiles);
      } catch (err) {
        console.error('Error fetching employee workspace data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderAssets = () => (
    <div className="emp-grid">
      {assets.length === 0 ? (
        <div className="emp-empty">No assets currently assigned to you.</div>
      ) : (
        assets.map(asset => (
          <div key={asset._id} className="emp-card asset-glow">
            <div className="emp-card-header">
              <span className="emp-badge asset-badge">{asset.type || 'Hardware'}</span>
              <span className="emp-status">{asset.status}</span>
            </div>
            <h4 className="emp-card-title">{asset.name}</h4>
            <div className="emp-card-body">
              <p><strong>Asset ID:</strong> {asset.assetId}</p>
              <p><strong>Serial Number:</strong> {asset.serialNumber || 'N/A'}</p>
              <p><strong>MAC Address:</strong> {asset.macAddress || 'N/A'}</p>
              <p><strong>Location:</strong> {asset.deviceLocation || 'Office'}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderVehicles = () => (
    <div className="emp-grid">
      {vehicles.length === 0 ? (
        <div className="emp-empty">No vehicles currently assigned to you.</div>
      ) : (
        vehicles.map(vehicle => (
          <div key={vehicle._id} className="emp-card vehicle-glow">
            <div className="emp-card-header">
              <span className="emp-badge vehicle-badge">Fleet</span>
              <span className="emp-status">{vehicle.status}</span>
            </div>
            <h4 className="emp-card-title">{vehicle.make} {vehicle.model}</h4>
            <div className="emp-card-body">
              <p><strong>Registration No:</strong> {vehicle.registrationNumber}</p>
              <p><strong>Plate Number:</strong> {vehicle.plateNumber || 'N/A'}</p>
              <p><strong>Odometer:</strong> {vehicle.odometer} km</p>
              <p><strong>Last Service:</strong> {vehicle.lastServiceDate ? new Date(vehicle.lastServiceDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderTickets = () => (
    <div className="emp-table-wrap">
      {tickets.length === 0 ? (
        <div className="emp-empty">You have not raised or been assigned any tickets.</div>
      ) : (
        <table className="emp-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t._id}>
                <td className="emp-mono">#{t.ticketId || t._id.slice(-6)}</td>
                <td>{t.title}</td>
                <td>{t.category}</td>
                <td>
                  <span className={`emp-prio prio-${(t.priority || 'Low').toLowerCase()}`}>
                    {t.priority || 'Low'}
                  </span>
                </td>
                <td>
                  <span className={`emp-status-badge status-${t.status.toLowerCase().replace(' ', '-')}`}>
                    {t.status}
                  </span>
                </td>
                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderFiles = () => (
    <div className="emp-table-wrap">
      {files.length === 0 ? (
        <div className="emp-empty">No files uploaded for approval.</div>
      ) : (
        <table className="emp-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Workflow</th>
              <th>Current Stage</th>
              <th>Status</th>
              <th>Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {files.map(f => (
              <tr key={f._id}>
                <td>{f.fileName || f.title}</td>
                <td>{f.workflowId?.name || 'N/A'}</td>
                <td>Stage {f.currentStage || 1}</td>
                <td>
                  <span className={`emp-status-badge status-${f.status.toLowerCase()}`}>
                    {f.status}
                  </span>
                </td>
                <td>{new Date(f.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setUpdating(true);
    try {
      const cfg = authCfg();
      await axios.put(`${API_BASE_URL}/users/me/password`, { currentPassword, newPassword }, cfg);
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setUpdating(false);
    }
  };

  const renderSecurity = () => (
    <div className="emp-security-card">
      <h4 className="emp-card-title" style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem' }}>Change Password</h4>
      {error && <div className="emp-error-msg">{error}</div>}
      {success && <div className="emp-success-msg">{success}</div>}
      <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Current Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
            style={{
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              outline: 'none',
              transition: 'border-color .2s'
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            minLength={6}
            style={{
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              outline: 'none',
              transition: 'border-color .2s'
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Confirm New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            style={{
              padding: '0.75rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              outline: 'none',
              transition: 'border-color .2s'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={updating}
          style={{
            padding: '0.75rem',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontFamily: 'Syne, sans-serif',
            fontSize: '.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '0.5rem',
            transition: 'opacity 0.2s',
            boxShadow: '0 4px 12px rgba(99,102,241,.2)'
          }}
        >
          {updating ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );

  return (
    <>
      <style>{`
        .emp-security-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1rem;
        }
        .emp-error-msg {
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          color: #fca5a5;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }
        .emp-success-msg {
          padding: 0.75rem;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 8px;
          color: #a7f3d0;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }

        .emp-workspace {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          margin-top: 1rem;
        }
        .emp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 1rem;
        }
        .emp-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .emp-sub-tabs {
          display: flex;
          gap: 0.5rem;
        }
        .emp-sub-tab {
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
        .emp-sub-tab:hover {
          color: var(--text-main);
          border-color: rgba(99, 102, 241, 0.3);
        }
        .emp-sub-tab.active {
          background: rgba(99, 102, 241, 0.08);
          border-color: rgba(99, 102, 241, 0.4);
          color: #818cf8;
        }
        .emp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .emp-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem;
          position: relative;
          transition: all 0.25s ease;
        }
        .emp-card:hover {
          transform: translateY(-3px);
        }
        .asset-glow:hover {
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.05);
        }
        .vehicle-glow:hover {
          border-color: rgba(6, 182, 212, 0.3);
          box-shadow: 0 8px 30px rgba(6, 182, 212, 0.05);
        }
        .emp-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .emp-badge {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
        .asset-badge {
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
        }
        .vehicle-badge {
          background: rgba(6, 182, 212, 0.1);
          color: #22d3ee;
        }
        .emp-status {
          font-size: 0.72rem;
          color: var(--text-dim);
        }
        .emp-card-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 0.75rem;
        }
        .emp-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: var(--text-dim);
        }
        .emp-card-body strong {
          color: var(--text-main);
          font-weight: 500;
        }
        .emp-empty {
          grid-column: 1 / -1;
          padding: 3rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.85rem;
          background: rgba(255, 255, 255, 0.01);
          border: 1px dashed var(--border);
          border-radius: 12px;
        }
        .emp-table-wrap {
          overflow-x: auto;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border);
          border-radius: 12px;
        }
        .emp-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.82rem;
        }
        .emp-table th {
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-main);
          font-weight: 600;
          padding: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .emp-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          color: var(--text-dim);
        }
        .emp-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.01);
        }
        .emp-mono {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          color: #818cf8;
        }
        .emp-prio {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 600;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .prio-high { background: rgba(239, 68, 68, 0.1); color: #f87171; }
        .prio-medium { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
        .prio-low { background: rgba(16, 185, 129, 0.1); color: #34d399; }
        .emp-status-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 500;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
        }
        .status-open { background: rgba(99, 102, 241, 0.1); color: #818cf8; }
        .status-in-progress { background: rgba(6, 182, 212, 0.1); color: #22d3ee; }
        .status-resolved, .status-approved { background: rgba(16, 185, 129, 0.1); color: #34d399; }
        .status-pending { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
        .status-rejected { background: rgba(239, 68, 68, 0.1); color: #f87171; }
      `}</style>

      <div className="emp-workspace">
        <div className="emp-header">
          <h3 className="emp-title">Personal Workspace</h3>
          <div className="emp-sub-tabs">
            <button
              className={`emp-sub-tab ${activeSubTab === 'assets' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('assets')}
            >
              My Assets ({assets.length})
            </button>
            <button
              className={`emp-sub-tab ${activeSubTab === 'vehicles' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('vehicles')}
            >
              My Vehicle ({vehicles.length})
            </button>
            <button
              className={`emp-sub-tab ${activeSubTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('tickets')}
            >
              My Tickets ({tickets.length})
            </button>
            <button
              className={`emp-sub-tab ${activeSubTab === 'files' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('files')}
            >
              My Files ({files.length})
            </button>
            <button
              className={`emp-sub-tab ${activeSubTab === 'security' ? 'active' : ''}`}
              onClick={() => { setActiveSubTab('security'); setError(''); setSuccess(''); }}
            >
              🔑 Security
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlignment: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading workspace...</div>
        ) : (
          <div className="emp-content">
            {activeSubTab === 'assets' && renderAssets()}
            {activeSubTab === 'vehicles' && renderVehicles()}
            {activeSubTab === 'tickets' && renderTickets()}
            {activeSubTab === 'files' && renderFiles()}
            {activeSubTab === 'security' && renderSecurity()}
          </div>
        )}
      </div>
    </>
  );
};

export default EmployeeWorkspace;
