import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const STATUS_CONFIG = {
  Available: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: '#34d399', dot: '#10b981' },
  Assigned:  { bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.3)',  text: '#818cf8', dot: '#6366f1' },
  Damaged:   { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   text: '#fca5a5', dot: '#ef4444' },
  Retired:   { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.3)', text: '#94a3b8', dot: '#64748b' },
};

const TYPE_ICON = { IT: '◈', Stationary: '▣' };

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/assets/${id}`, {
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
    fetchAsset();
  }, [id]);

  if (loading) {
    return <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Loading asset details...</div>;
  }

  if (error || !asset) {
    return <div style={{ color: '#fca5a5', padding: '2rem', textAlign: 'center' }}>{error || 'Asset not found'}</div>;
  }

  const sc = STATUS_CONFIG[asset.status] || STATUS_CONFIG.Retired;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', background: '#0e1117', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontFamily: "'DM Sans', sans-serif" }}>
      <button 
        onClick={() => navigate('/dashboard')} 
        style={{ padding: '0.5rem 1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
      >
        ← Back to Dashboard
      </button>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          {asset.image ? (
            <img src={`http://localhost:5000${asset.image}`} alt={asset.name} style={{ width: '100%', height: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '250px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: 'rgba(148,163,184,0.3)' }}>
              {TYPE_ICON[asset.type] || '◈'}
            </div>
          )}
        </div>

        <div style={{ flex: '2 1 400px' }}>
          {asset.uniqueId && (
            <div style={{ fontSize: '1.2rem', color: '#818cf8', marginBottom: '0.2rem', fontFamily: "'DM Mono', monospace", fontWeight: '600' }}>
              {asset.uniqueId}
            </div>
          )}
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{asset.name}</h1>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {TYPE_ICON[asset.type]} {asset.type}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc.dot }} />
              {asset.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Sub Type</div>
              <div style={{ fontSize: '0.95rem' }}>{asset.subType || 'N/A'}</div>
            </div>
            
            {asset.type === 'Stationary' && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Condition</div>
                <div style={{ fontSize: '0.95rem' }}>{asset.condition || 'N/A'}</div>
              </div>
            )}

            {asset.type === 'IT' && (
              <>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Model</div>
                  <div style={{ fontSize: '0.95rem' }}>{asset.model || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Serial Number</div>
                  <div style={{ fontSize: '0.95rem' }}>{asset.serialNumber || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>MAC Address</div>
                  <div style={{ fontSize: '0.95rem', fontFamily: 'monospace' }}>{asset.macAddress || 'N/A'}</div>
                </div>
                {(asset.subType === 'Laptop' || asset.subType === 'Desktop') && (
                  <>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>OS Version</div>
                      <div style={{ fontSize: '0.95rem' }}>{asset.osVersion || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Software Licenses</div>
                      <div style={{ fontSize: '0.95rem' }}>{asset.softwareLicenses || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Device User Name</div>
                      <div style={{ fontSize: '0.95rem' }}>{asset.deviceUserName || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Device Password</div>
                      <div style={{ fontSize: '0.95rem', fontFamily: 'monospace' }}>{asset.devicePassword || 'N/A'}</div>
                    </div>
                  </>
                )}
              </>
            )}

            <div style={{ gridColumn: 'span 2', height: '1px', background: 'rgba(255,255,255,0.08)' }}></div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Assigned To</div>
              <div style={{ fontSize: '0.95rem' }}>{asset.assignedTo ? asset.assignedTo.name : 'Unassigned'}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Issued Date</div>
              <div style={{ fontSize: '0.95rem' }}>{asset.issuedDate ? new Date(asset.issuedDate).toLocaleDateString() : 'N/A'}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Return Date</div>
              <div style={{ fontSize: '0.95rem' }}>{asset.returnDate ? new Date(asset.returnDate).toLocaleDateString() : 'N/A'}</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
