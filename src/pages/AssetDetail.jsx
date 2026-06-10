import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const STATIC_BASE = API_BASE_URL.replace('/api', '');

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .ad-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .ad-root {
    font-family: 'DM Sans', sans-serif;
    color: #e2e8f0;
    max-width: 1000px;
    margin: 2rem auto;
    padding: 1.5rem;
    animation: ad-fadeUp 0.4s ease both;
  }

  @keyframes ad-fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ad-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1.1rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #94a3b8;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 2rem;
  }
  .ad-back-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.14);
    color: #f1f5f9;
  }

  .ad-header-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 24px;
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
  }
  @media(min-width: 768px) {
    .ad-header-card {
      grid-template-columns: 280px 1fr 180px;
    }
  }

  .ad-header-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4);
  }

  .ad-image-container {
    width: 100%;
    height: 250px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.01);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .ad-main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .ad-no-image {
    font-size: 4rem;
    color: rgba(148, 163, 184, 0.15);
  }

  .ad-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.7rem;
    border-radius: 7px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .ad-badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }

  .ad-qr-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1.2rem;
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    width: 170px;
    height: 170px;
    margin: 0 auto;
  }

  .ad-qr-btn {
    width: 100%;
    padding: 0.5rem;
    border-radius: 8px;
    background: rgba(99, 102, 241, 0.09);
    border: 1px solid rgba(99, 102, 241, 0.2);
    color: #818cf8;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
    margin-top: 0.5rem;
  }
  .ad-qr-btn:hover {
    background: rgba(99, 102, 241, 0.18);
  }

  .ad-detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .ad-panel {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    padding: 1.5rem;
  }

  .ad-panel-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ad-info-row {
    display: flex;
    justify-content: space-between;
    padding: 0.65rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    font-size: 0.85rem;
  }
  .ad-info-row:last-child {
    border-bottom: none;
  }
  .ad-info-label {
    color: #64748b;
  }
  .ad-info-value {
    color: #e2e8f0;
    font-weight: 500;
  }

  .ad-tabs-nav {
    display: flex;
    gap: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    margin-bottom: 1.5rem;
    overflow-x: auto;
  }
  .ad-tab-trigger {
    padding: 0.75rem 1.2rem;
    color: #64748b;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 0.88rem;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
  }
  .ad-tab-trigger:hover {
    color: #cbd5e1;
  }
  .ad-tab-trigger.active {
    color: #6366f1;
    border-bottom-color: #6366f1;
  }

  .ad-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.85rem;
  }
  .ad-table th {
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.02);
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #475569;
    letter-spacing: 0.08em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    font-family: 'DM Mono', monospace;
  }
  .ad-table td {
    padding: 0.85rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    color: #cbd5e1;
  }
  .ad-table tr:last-child td {
    border-bottom: none;
  }

  .ad-form-field {
    margin-bottom: 1.2rem;
  }
  .ad-form-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #475569;
    margin-bottom: 0.4rem;
  }
  .ad-form-input, .ad-form-select, .ad-form-textarea {
    width: 100%;
    padding: 0.7rem 0.9rem;
    background: #0a0e17;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    color: #e2e8f0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    outline: none;
    transition: all 0.2s;
  }
  .ad-form-input:focus, .ad-form-select:focus, .ad-form-textarea:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
  .ad-form-textarea {
    min-height: 80px;
    resize: vertical;
  }

  .ad-btn-primary {
    padding: 0.65rem 1.2rem;
    border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    font-weight: 600;
    border: none;
    font-size: 0.85rem;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
    transition: all 0.2s;
  }
  .ad-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(99, 102, 241, 0.35);
  }
  .ad-btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .ad-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 1rem;
  }
  .ad-gallery-item {
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.02);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .ad-gallery-item:hover {
    transform: scale(1.03);
  }
  .ad-gallery-img {
    width: 100%;
    height: 100px;
    object-fit: cover;
  }
  .ad-gallery-lbl {
    font-size: 0.68rem;
    padding: 0.4rem;
    text-align: center;
    color: #64748b;
    text-transform: uppercase;
    font-family: 'DM Mono', monospace;
  }
`;

const STATUS_BADGES = {
  Available: { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', text: '#34d399', dot: '#10b981' },
  Assigned: { bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.3)', text: '#818cf8', dot: '#6366f1' },
  'Under Maintenance': { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', text: '#fbbf24', dot: '#f59e0b' },
  Damaged: { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)', text: '#fca5a5', dot: '#ef4444' },
  Lost: { bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.3)', text: '#fda4af', dot: '#f43f5e' },
  Retired: { bg: 'rgba(100, 116, 139, 0.12)', border: 'rgba(100, 116, 139, 0.3)', text: '#94a3b8', dot: '#64748b' }
};

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('history');
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = user.role === 'Super Admin' || user.role === 'Admin';

  // Issue reporting form states
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [issuePriority, setIssuePriority] = useState('Medium');
  const [reporting, setReporting] = useState(false);
  const [reportedTicket, setReportedTicket] = useState(null);

  // Maintenance form states
  const [serviceDate, setServiceDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [cost, setCost] = useState('');
  const [maintenanceRemarks, setMaintenanceRemarks] = useState('');
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [loggingMaintenance, setLoggingMaintenance] = useState(false);

  // Photo upload states
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [photoType, setPhotoType] = useState('Photo');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // QR generation state
  const [qrGenerating, setQrGenerating] = useState(false);

  const fileInputRef = useRef();
  const mFileInputRef = useRef();

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  const fetchAsset = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/assets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAsset(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Asset not found');
      } else {
        setError('Error fetching asset details or unauthorized');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsset();
  }, [id]);

  const handleReportIssue = async (e) => {
    e.preventDefault();
    if (!issueTitle.trim() || !issueDesc.trim()) return;
    setReporting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/assets/${id}/report-issue`, {
        title: issueTitle,
        description: issueDesc,
        priority: issuePriority
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportedTicket(res.data);
      setIssueTitle('');
      setIssueDesc('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit issue ticket.');
    } finally {
      setReporting(false);
    }
  };

  const handleLogMaintenance = async (e) => {
    e.preventDefault();
    if (!vendor.trim()) return;
    setLoggingMaintenance(true);
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('serviceDate', serviceDate);
      fd.append('vendor', vendor);
      fd.append('cost', cost);
      fd.append('remarks', maintenanceRemarks);
      fd.append('updateStatus', String(updateStatus));
      if (invoiceFile) {
        fd.append('invoice', invoiceFile);
      }

      await axios.post(`${API_BASE_URL}/assets/${id}/maintenance`, fd, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setVendor('');
      setCost('');
      setMaintenanceRemarks('');
      setInvoiceFile(null);
      if (mFileInputRef.current) mFileInputRef.current.value = '';
      setUpdateStatus(false);
      
      fetchAsset();
      alert('Maintenance successfully logged!');
    } catch (err) {
      console.error(err);
      alert('Failed to log maintenance.');
    } finally {
      setLoggingMaintenance(false);
    }
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    if (!newPhotoFile) return;
    setUploadingPhoto(true);
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('image', newPhotoFile);
      fd.append('type', photoType);

      await axios.post(`${API_BASE_URL}/assets/${id}/images`, fd, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setNewPhotoFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchAsset();
      alert('Photo successfully uploaded!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload photo.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const generateAndDownloadQR = async () => {
    setQrGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/assets/${id}/generate-qr`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAsset(res.data);
      // Open label in new tab for saving/printing
      window.open(`${STATIC_BASE}${res.data.qrLabelImage}`, '_blank');
    } catch (err) {
      console.error(err);
      alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setQrGenerating(false);
    }
  };

  const printLabel = () => {
    if (!asset?.qrLabelImage) return generateAndDownloadQR();
    const w = window.open('', '_blank');
    w.document.write(`<html><body style="margin:0;padding:20px;text-align:center;"><img src="${STATIC_BASE}${asset.qrLabelImage}" style="max-width:100%;" onload="window.print();window.close();" /></body></html>`);
    w.document.close();
  };

  if (loading) {
    return <div style={{ color: 'white', padding: '3rem', textAlign: 'center' }}>Loading asset profile...</div>;
  }

  if (error || !asset) {
    return <div style={{ color: '#fca5a5', padding: '3rem', textAlign: 'center' }}>{error || 'Asset not found'}</div>;
  }

  // Calculate Warranty Status
  let warrantyStatus = 'N/A';
  let warrantyColor = '#64748b';
  let daysLeft = null;
  if (asset.warrantyExpiryDate) {
    const now = new Date();
    const expiry = new Date(asset.warrantyExpiryDate);
    daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) {
      warrantyStatus = 'Expired';
      warrantyColor = '#ef4444';
    } else if (daysLeft <= 30) {
      warrantyStatus = 'Expiring Soon';
      warrantyColor = '#fbbf24';
    } else {
      warrantyStatus = 'Warranty Valid';
      warrantyColor = '#10b981';
    }
  }

  const badge = STATUS_BADGES[asset.status] || STATUS_BADGES.Retired;
  const publicURL = `${window.location.origin}/asset/${asset._id}`;

  return (
    <div className="ad-root">
      <button onClick={() => navigate('/dashboard')} className="ad-back-btn">
        ← Back to Dashboard
      </button>

      {/* Header Profile Section */}
      <div className="ad-header-card">
        <div className="ad-image-container">
          {asset.image ? (
            <img src={`${STATIC_BASE}${asset.image}`} alt={asset.name} className="ad-main-image" />
          ) : (
            <div className="ad-no-image">◈</div>
          )}
        </div>

        <div>
          <div style={{ fontSize: '0.68rem', color: '#6366f1', fontFamily: 'DM Mono, monospace', fontWeight: 'bold', marginBottom: '0.3rem' }}>
            {asset.uniqueId}
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>
            {asset.name}
          </h1>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
            <span className="ad-badge" style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text }}>
              <span className="ad-badge-dot" style={{ background: badge.dot }} />
              {asset.status}
            </span>
            <span className="ad-badge" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
              {asset.category || asset.type}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: '#64748b' }}>Brand:</span> <strong style={{ color: '#cbd5e1' }}>{asset.brand || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Model:</span> <strong style={{ color: '#cbd5e1' }}>{asset.model || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Serial No:</span> <strong style={{ color: '#cbd5e1' }}>{asset.serialNumber || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>MAC:</span> <strong style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>{asset.macAddress || 'N/A'}</strong>
            </div>
          </div>
        </div>

        {/* QR Code Container */}
        <div style={{ textAlign: 'center' }}>
          <div className="ad-qr-box" style={{ overflow: 'hidden', borderRadius: '10px', background: '#fff', padding: '6px', display: 'inline-block' }}>
            {asset.qrLabelImage ? (
              <img src={`${STATIC_BASE}${asset.qrLabelImage}`} alt="QR Label" style={{ width: 110, height: 'auto', display: 'block' }} />
            ) : (
              <div style={{ width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', borderRadius: '8px', color: '#94a3b8', fontSize: '0.7rem', textAlign: 'center', padding: '8px' }}>
                QR not generated
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={generateAndDownloadQR} className="ad-qr-btn" disabled={qrGenerating}>
              {qrGenerating ? 'Generating...' : (asset.qrLabelImage ? 'Regenerate QR' : '⬇ Generate QR Label')}
            </button>
            {asset.qrLabelImage && (
              <button onClick={printLabel} className="ad-qr-btn" style={{ background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.3)', color: '#34d399' }}>
                🖨 Print Label
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Details and Warranty Row */}
      <div className="ad-detail-grid">
        {/* Assignment Information */}
        <div className="ad-panel">
          <h3 className="ad-panel-title">👥 Assignment Information</h3>
          <div className="ad-info-row">
            <span className="ad-info-label">Current User</span>
            <span className="ad-info-value">{asset.assignedTo ? asset.assignedTo.name : 'Unassigned'}</span>
          </div>
          <div className="ad-info-row">
            <span className="ad-info-label">Email</span>
            <span className="ad-info-value">{asset.assignedTo ? asset.assignedTo.email : 'N/A'}</span>
          </div>
          <div className="ad-info-row">
            <span className="ad-info-label">Company</span>
            <span className="ad-info-value">{asset.company ? asset.company.name : 'N/A'}</span>
          </div>
          <div className="ad-info-row">
            <span className="ad-info-label">Issue Date</span>
            <span className="ad-info-value">{asset.issuedDate ? new Date(asset.issuedDate).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>

        {/* Warranty Tracking */}
        <div className="ad-panel">
          <h3 className="ad-panel-title">🛡️ Warranty Information</h3>
          <div className="ad-info-row">
            <span className="ad-info-label">Provider</span>
            <span className="ad-info-value">{asset.warrantyProvider || 'N/A'}</span>
          </div>
          <div className="ad-info-row">
            <span className="ad-info-label">Start Date</span>
            <span className="ad-info-value">{asset.warrantyStartDate ? new Date(asset.warrantyStartDate).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="ad-info-row">
            <span className="ad-info-label">Expiry Date</span>
            <span className="ad-info-value">{asset.warrantyExpiryDate ? new Date(asset.warrantyExpiryDate).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="ad-info-row">
            <span className="ad-info-label">Warranty Status</span>
            <span style={{ color: warrantyColor, fontWeight: '700' }}>
              {warrantyStatus} {daysLeft !== null && daysLeft >= 0 && `(${daysLeft} days remaining)`}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="ad-tabs-nav">
        <button className={`ad-tab-trigger ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          📜 Assignment History
        </button>
        <button className={`ad-tab-trigger ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}>
          🔧 Maintenance History
        </button>
        <button className={`ad-tab-trigger ${activeTab === 'photos' ? 'active' : ''}`} onClick={() => setActiveTab('photos')}>
          🖼️ Photos & Labels ({asset.images?.length || 0})
        </button>
        <button className={`ad-tab-trigger ${activeTab === 'issue' ? 'active' : ''}`} onClick={() => setActiveTab('issue')}>
          ⚠️ Report Problem
        </button>
      </div>

      {/* Tab Content Panels */}
      <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.5rem' }}>
        
        {/* Assignment History Tab */}
        {activeTab === 'history' && (
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Permanent Assignment History</h3>
            {asset.assignmentHistory && asset.assignmentHistory.length > 0 ? (
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Assigned Date</th>
                    <th>Return Date</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {asset.assignmentHistory.map((h, idx) => (
                    <tr key={idx}>
                      <td><strong>{h.user?.name || 'N/A'}</strong></td>
                      <td>{h.user?.email || 'N/A'}</td>
                      <td>{h.assignedDate ? new Date(h.assignedDate).toLocaleDateString() : '—'}</td>
                      <td>{h.returnDate ? new Date(h.returnDate).toLocaleDateString() : <span style={{ color: '#34d399' }}>Active</span>}</td>
                      <td style={{ color: '#94a3b8' }}>{h.remarks || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: '#475569', fontSize: '0.85rem' }}>No assignment history found.</div>
            )}
          </div>
        )}

        {/* Maintenance History Tab */}
        {activeTab === 'maintenance' && (
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Maintenance & Service Log</h3>
            {asset.maintenanceHistory && asset.maintenanceHistory.length > 0 ? (
              <table className="ad-table" style={{ marginBottom: '2rem' }}>
                <thead>
                  <tr>
                    <th>Service Date</th>
                    <th>Vendor</th>
                    <th>Cost</th>
                    <th>Remarks</th>
                    <th>Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {asset.maintenanceHistory.map((m, idx) => (
                    <tr key={idx}>
                      <td>{m.serviceDate ? new Date(m.serviceDate).toLocaleDateString() : '—'}</td>
                      <td><strong>{m.vendor}</strong></td>
                      <td style={{ color: '#fbbf24', fontWeight: 500 }}>${m.cost || 0}</td>
                      <td>{m.remarks || '—'}</td>
                      <td>
                        {m.invoiceFile ? (
                          <a href={`${STATIC_BASE}${m.invoiceFile}`} target="_blank" rel="noreferrer" style={{ color: '#10b981', textDecoration: 'none' }}>
                            View Invoice ↗
                          </a>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '2rem' }}>No maintenance history found.</div>
            )}

            {/* Log Maintenance Form (Admins Only) */}
            {isAdmin && (
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '1.5rem', borderRadius: '14px' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#818cf8', fontWeight: 600 }}>🛠️ Log Repair or Service</h4>
                <form onSubmit={handleLogMaintenance}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="ad-form-field">
                      <label className="ad-form-label">Service Date</label>
                      <input type="date" className="ad-form-input" value={serviceDate} onChange={e => setServiceDate(e.target.value)} required />
                    </div>
                    <div className="ad-form-field">
                      <label className="ad-form-label">Vendor Name</label>
                      <input type="text" className="ad-form-input" placeholder="e.g. Dell Support" value={vendor} onChange={e => setVendor(e.target.value)} required />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="ad-form-field">
                      <label className="ad-form-label">Cost ($)</label>
                      <input type="number" className="ad-form-input" placeholder="e.g. 150" value={cost} onChange={e => setCost(e.target.value)} />
                    </div>
                    <div className="ad-form-field">
                      <label className="ad-form-label">Upload Invoice</label>
                      <input ref={mFileInputRef} type="file" className="ad-form-input" style={{ padding: '0.45rem' }} onChange={e => setInvoiceFile(e.target.files[0])} />
                    </div>
                  </div>
                  <div className="ad-form-field">
                    <label className="ad-form-label">Service Remarks</label>
                    <textarea className="ad-form-textarea" placeholder="Describe replacement parts or repair work done..." value={maintenanceRemarks} onChange={e => setMaintenanceRemarks(e.target.value)} required />
                  </div>
                  <div className="ad-form-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <input type="checkbox" id="m-status-check" checked={updateStatus} onChange={e => setUpdateStatus(e.target.checked)} style={{ cursor: 'pointer' }} />
                    <label htmlFor="m-status-check" style={{ fontSize: '0.82rem', color: '#cbd5e1', cursor: 'pointer' }}>
                      Set asset status to <strong>Under Maintenance</strong>
                    </label>
                  </div>
                  <button type="submit" className="ad-btn-primary" disabled={loggingMaintenance}>
                    {loggingMaintenance ? 'Saving...' : 'Log Maintenance'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Photos and Labels Tab */}
        {activeTab === 'photos' && (
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Photos, Stickers & Label Documents</h3>
            {asset.images && asset.images.length > 0 ? (
              <div className="ad-gallery" style={{ marginBottom: '2rem' }}>
                {asset.images.map((img, idx) => (
                  <div key={idx} className="ad-gallery-item" onClick={() => window.open(`${STATIC_BASE}${img.url}`, '_blank')}>
                    <img src={`${STATIC_BASE}${img.url}`} alt={img.type} className="ad-gallery-img" />
                    <div className="ad-gallery-lbl">{img.type}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '2rem' }}>No labels or stickers uploaded.</div>
            )}

            {/* Upload image form (Admins Only) */}
            {isAdmin && (
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '1.5rem', borderRadius: '14px' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#818cf8', fontWeight: 600 }}>🖼️ Upload Photo or Sticker Scan</h4>
                <form onSubmit={handleUploadPhoto}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
                    <div className="ad-form-field">
                      <label className="ad-form-label">Select Image File</label>
                      <input ref={fileInputRef} type="file" accept="image/*" className="ad-form-input" style={{ padding: '0.45rem' }} onChange={e => setNewPhotoFile(e.target.files[0])} required />
                    </div>
                    <div className="ad-form-field">
                      <label className="ad-form-label">Image Label Type</label>
                      <select className="ad-form-select" value={photoType} onChange={e => setPhotoType(e.target.value)}>
                        <option value="Photo">Device Photo</option>
                        <option value="Serial Sticker">Serial Sticker Scan</option>
                        <option value="Label">Physical Asset Label Scan</option>
                        <option value="Other">Other Document/Image</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="ad-btn-primary" disabled={uploadingPhoto} style={{ marginTop: '0.5rem' }}>
                    {uploadingPhoto ? 'Uploading...' : 'Upload Image'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Report Problem Tab */}
        {activeTab === 'issue' && (
          <div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>Report Problem / Issue</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Report a software or hardware problem for this asset. A ticket will automatically be created in the support module and linked to this asset profile.
            </p>

            {reportedTicket && (
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', padding: '1rem', borderRadius: '12px', color: '#34d399', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                🎉 Issue successfully reported! Ticket <strong>{reportedTicket.ticketId}</strong> has been generated and routed to the Operations queue.
              </div>
            )}

            <form onSubmit={handleReportIssue}>
              <div className="ad-form-field">
                <label className="ad-form-label">Issue Summary / Title <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" className="ad-form-input" placeholder="e.g. Screen flickering when charger is plugged in" value={issueTitle} onChange={e => setIssueTitle(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div className="ad-form-field">
                  <label className="ad-form-label">Priority Level</label>
                  <select className="ad-form-select" value={issuePriority} onChange={e => setIssuePriority(e.target.value)}>
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Critical">Critical Priority</option>
                  </select>
                </div>
              </div>

              <div className="ad-form-field">
                <label className="ad-form-label">Detailed Description <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea className="ad-form-textarea" placeholder="Provide details about the issue, error messages, and what steps you took before it happened..." value={issueDesc} onChange={e => setIssueDesc(e.target.value)} required />
              </div>

              <button type="submit" className="ad-btn-primary" disabled={reporting}>
                {reporting ? 'Submitting...' : 'Submit Issue Ticket'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AssetDetail;
