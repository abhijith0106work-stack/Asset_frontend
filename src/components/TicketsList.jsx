import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PRIORITY_CONFIG = {
  High:   { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.28)',   text: '#fca5a5', dot: '#ef4444', icon: '▲' },
  Medium: { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.28)',  text: '#fcd34d', dot: '#f59e0b', icon: '◆' },
  Low:    { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.28)', text: '#6ee7b7', dot: '#10b981', icon: '▼' },
};

const STATUS_CONFIG = {
  'Open':             { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.28)',   text: '#fca5a5', dot: '#ef4444' },
  'In Progress':      { bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.28)',  text: '#a5b4fc', dot: '#6366f1' },
  'Pending Approval': { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.28)',  text: '#fcd34d', dot: '#f59e0b' },
  'Done':             { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.28)', text: '#6ee7b7', dot: '#10b981' },
  'Closed':           { bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.28)',text: '#94a3b8', dot: '#64748b' },
};

const CATEGORY_ICON = { IT: '◈', Stationary: '▣', Other: '◎' };

const TicketsList = ({ role }) => {
  const [tickets, setTickets]               = useState([]);
  const [users, setUsers]                   = useState([]);
  const [isRaiseModalOpen, setIsRaiseModalOpen]   = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket]   = useState(null);
  const [filterStatus,   setFilterStatus]   = useState('All');
  const [ticketView, setTicketView] = useState('Raised'); // 'Raised' or 'Assigned'
  const [saving, setSaving] = useState(false);

  const [raiseForm, setRaiseForm] = useState({ title: '', description: '', priority: 'Medium', category: 'IT' });
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [manageForm, setManageForm] = useState({ assignedTo: '', status: '', remarks: '' });

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchTickets();
    if (role === 'Super Admin' || role === 'Admin') fetchUsers();
  }, [role]);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleRaiseSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('title', raiseForm.title);
      fd.append('description', raiseForm.description);
      fd.append('priority', raiseForm.priority);
      fd.append('category', raiseForm.category);
      if (attachmentFile) fd.append('attachment', attachmentFile);
      await axios.post('http://localhost:5000/api/tickets', fd, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsRaiseModalOpen(false);
      setRaiseForm({ title: '', description: '', priority: 'Medium', category: 'IT' });
      setAttachmentFile(null);
      fetchTickets();
    } catch (err) { alert('Error raising ticket'); }
    finally { setSaving(false); }
  };

  const openManageModal = (ticket) => {
    setCurrentTicket(ticket);
    setManageForm({ 
      assignedTo: ticket.assignedTo?._id || ticket.assignedTo || '', 
      status: ticket.status,
      remarks: ticket.remarks || ''
    });
    setIsManageModalOpen(true);
  };

  const handleManageSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/tickets/${currentTicket._id}`, manageForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsManageModalOpen(false);
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating ticket');
    } finally { setSaving(false); }
  };

  const isAdmin = role === 'Super Admin' || role === 'Admin';

  const filtered = tickets.filter(t => {
    const statusMatch = filterStatus === 'All' || t.status === filterStatus;
    const viewMatch = ticketView === 'All' 
      ? true 
      : ticketView === 'Raised' 
        ? t.createdBy?._id === currentUser._id || t.createdBy === currentUser._id
        : t.assignedTo?._id === currentUser._id || t.assignedTo === currentUser._id;
    return statusMatch && viewMatch;
  });

  return (
    <div className="tl-root">
      <style>{`
        .tl-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .tl-toolbar { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; align-items: center; }
        
        .tl-tabs { display: flex; background: rgba(255,255,255,0.04); padding: 0.25rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); }
        .tl-tab { padding: 0.5rem 1.2rem; border-radius: 10px; cursor: pointer; font-size: 0.85rem; font-weight: 600; color: #94a3b8; transition: all 0.2s; }
        .tl-tab.active { background: #6366f1; color: white; box-shadow: 0 4px 12px rgba(99,102,241,0.3); }

        .tl-select { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.6rem 1rem; color: white; outline: none; }
        .tl-select option { background: #0f172a; }

        .tl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
        .tl-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.5rem; position: relative; display: flex; flex-direction: column; }
        .tl-card-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
        .tl-title { font-size: 1.1rem; font-weight: 600; color: #f1f5f9; margin-bottom: 0.5rem; }
        .tl-desc { font-size: 0.85rem; color: #94a3b8; line-height: 1.5; margin-bottom: 1.2rem; flex-grow: 1; }
        
        .tl-meta { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .badge { padding: 0.2rem 0.6rem; border-radius: 100px; font-size: 0.7rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem; }
        
        .tl-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.06); }
        .tl-user-info { font-size: 0.75rem; color: #64748b; }
        .tl-manage-btn { background: rgba(99,102,241,0.1); color: #818cf8; border: 1px solid rgba(99,102,241,0.2); padding: 0.4rem 0.8rem; border-radius: 8px; cursor: pointer; font-size: 0.8rem; }

        .tl-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justifyContent: center; z-index: 1000; padding: 1rem; }
        .tl-modal { background: #0f172a; width: 480px; padding: 2rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); }
        .tl-form-group { margin-bottom: 1.2rem; }
        .tl-label { display: block; color: #94a3b8; font-size: 0.8rem; margin-bottom: 0.4rem; }
        .tl-input, .tl-modal-select, .tl-textarea { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.75rem; color: white; border-radius: 10px; outline: none; }
        .tl-textarea { min-height: 100px; resize: none; }
        
        .btn-primary { background: #6366f1; color: white; border: none; padding: 0.7rem 1.4rem; border-radius: 10px; cursor: pointer; font-weight: 600; width: 100%; }
        .btn-secondary { background: rgba(255,255,255,0.05); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.1); padding: 0.7rem 1.4rem; border-radius: 10px; cursor: pointer; width: 100%; }
      `}</style>

      <div className="tl-header">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9' }}>Tickets</h2>
        <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setIsRaiseModalOpen(true)}>+ Raise Ticket</button>
      </div>

      <div className="tl-toolbar">
        <div className="tl-tabs">
          {isAdmin && <div className={`tl-tab ${ticketView === 'All' ? 'active' : ''}`} onClick={() => setTicketView('All')}>All Tickets</div>}
          <div className={`tl-tab ${ticketView === 'Raised' ? 'active' : ''}`} onClick={() => setTicketView('Raised')}>Raised By Me</div>
          <div className={`tl-tab ${ticketView === 'Assigned' ? 'active' : ''}`} onClick={() => setTicketView('Assigned')}>Assigned To Me</div>
        </div>

        <select className="tl-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending Approval">Pending Approval</option>
          <option value="Done">Done</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="tl-grid">
        {filtered.map(ticket => {
          const sc = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.Closed;
          const pc = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.Medium;
          return (
            <div key={ticket._id} className="tl-card">
              <div className="tl-card-header">
                <span className="badge" style={{ background: pc.bg, border: `1px solid ${pc.border}`, color: pc.text }}>{pc.icon} {ticket.priority}</span>
                <span className="badge" style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>{ticket.status}</span>
              </div>
              <div className="tl-title">{ticket.title}</div>
              <div className="tl-desc">{ticket.description}</div>
              <div className="tl-meta">
                <span style={{ fontSize: '0.75rem', color: '#6366f1' }}>{CATEGORY_ICON[ticket.category]} {ticket.category}</span>
                {ticket.attachment && <a href={`http://localhost:5000${ticket.attachment}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#10b981', textDecoration: 'none' }}>📎 Attachment</a>}
              </div>
              {ticket.remarks && (
                <div style={{ background: 'rgba(234,179,8,0.05)', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #fbbf24', fontSize: '0.8rem', marginBottom: '1rem', color: '#d1d5db' }}>
                  <strong>Remarks:</strong> {ticket.remarks}
                </div>
              )}
              <div className="tl-footer">
                <div className="tl-user-info">
                  By: {ticket.createdBy?.name || 'User'}<br/>
                  Assignee: {ticket.assignedTo?.name || 'Unassigned'}
                </div>
                <button className="tl-manage-btn" onClick={() => openManageModal(ticket)}>Manage</button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            No tickets found in this view.
          </div>
        )}
      </div>

      {isRaiseModalOpen && (
        <div className="tl-modal-overlay">
          <div className="tl-modal">
            <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>Raise New Ticket</h3>
            <form onSubmit={handleRaiseSubmit}>
              <div className="tl-form-group">
                <label className="tl-label">Title</label>
                <input className="tl-input" value={raiseForm.title} onChange={e => setRaiseForm({...raiseForm, title: e.target.value})} required />
              </div>
              <div className="tl-form-group">
                <label className="tl-label">Description</label>
                <textarea className="tl-textarea" value={raiseForm.description} onChange={e => setRaiseForm({...raiseForm, description: e.target.value})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="tl-form-group">
                  <label className="tl-label">Priority</label>
                  <select className="tl-modal-select" value={raiseForm.priority} onChange={e => setRaiseForm({...raiseForm, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="tl-form-group">
                  <label className="tl-label">Category</label>
                  <select className="tl-modal-select" value={raiseForm.category} onChange={e => setRaiseForm({...raiseForm, category: e.target.value})}>
                    <option value="IT">IT</option>
                    <option value="Stationary">Stationary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="tl-form-group">
                <label className="tl-label">Attachment</label>
                <input type="file" onChange={e => setAttachmentFile(e.target.files[0])} style={{ color: '#94a3b8', fontSize: '0.8rem' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsRaiseModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{saving ? 'Submitting...' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isManageModalOpen && (
        <div className="tl-modal-overlay">
          <div className="tl-modal">
            <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>Manage Ticket</h3>
            <form onSubmit={handleManageSubmit}>
              <div className="tl-form-group">
                <label className="tl-label">Status</label>
                <select className="tl-modal-select" value={manageForm.status} onChange={e => setManageForm({...manageForm, status: e.target.value})}>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending Approval">Pending Approval</option>
                  {isAdmin && <option value="Done">Done</option>}
                  {isAdmin && <option value="Closed">Closed</option>}
                </select>
                {!isAdmin && manageForm.status !== 'Pending Approval' && manageForm.status !== 'Open' && manageForm.status !== 'In Progress' && (
                  <div style={{ fontSize: '0.7rem', color: '#fca5a5', marginTop: '0.4rem' }}>Only Admins can set status to Done or Closed.</div>
                )}
              </div>
              {isAdmin && (
                <div className="tl-form-group">
                  <label className="tl-label">Assign To</label>
                  <select className="tl-modal-select" value={manageForm.assignedTo} onChange={e => setManageForm({...manageForm, assignedTo: e.target.value})}>
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                  </select>
                </div>
              )}
              <div className="tl-form-group">
                <label className="tl-label">Remarks / Resolution Details</label>
                <textarea className="tl-textarea" value={manageForm.remarks} onChange={e => setManageForm({...manageForm, remarks: e.target.value})} placeholder="Add details about the work or resolution..." />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsManageModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{saving ? 'Updating...' : 'Update Ticket'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsList;
