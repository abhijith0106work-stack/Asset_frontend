import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import logoImg from '../../Assets/logo.png';

// Simple SVG icons (replace with proper icon library if needed)
const Icon = ({ path, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const DashboardHeader = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Global search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);

  // Self password reset state
  const [showResetModal, setShowResetModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resettingSelf, setResettingSelf]     = useState(false);
  const [resetError, setResetError]           = useState('');

  const handleSelfResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }
    setResettingSelf(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/users/me/password`, { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Your password has been changed successfully.');
      setShowResetModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setResetError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setResettingSelf(false);
    }
  };

  // Handle global search API call with 300ms debounce
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/dashboard/search?q=${searchQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSearchResults(res.data || []);
      } catch (err) {
        console.error('Search query failed', err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="db-topbar">
      {/* Scoped CSS for autocomplete dropdown */}
      <style>{`
        .search-container {
          position: relative;
          flex: 1;
          max-width: 460px;
        }
        .search-results-panel {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          right: 0;
          background: #10131a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
          z-index: 250;
          max-height: 350px;
          overflow-y: auto;
          animation: dropIn 0.2s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        html.light-mode .search-results-panel {
          background: #ffffff;
          border-color: rgba(0, 0, 0, 0.1);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .search-result-item {
          display: flex;
          flex-direction: column;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background 0.15s;
        }
        .search-result-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }
        .search-result-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.68rem;
          margin-bottom: 0.15rem;
        }
        .search-result-type {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #818cf8;
        }
        .search-result-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);
        }
        .search-result-snippet {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }
        .search-empty {
          padding: 1.5rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.8rem;
        }
        .db-user-pill {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .db-user-pill:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(99, 102, 241, 0.35);
        }
        html.light-mode .db-user-pill:hover {
          background: rgba(0, 0, 0, 0.06);
          border-color: rgba(99, 102, 241, 0.35);
        }
      `}</style>

      {/* Branding */}
      <div className="db-brand">
        <div className="db-logo-wrap">
          <img className="db-logo-img" src={logoImg} alt="Company Logo" onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }} />
          <span className="db-logo-fallback">A</span>
        </div>
        <div>
          <div className="db-brand-name">AssetTrack</div>
          <div className="db-brand-sub">Management Portal</div>
        </div>
      </div>

      {/* Center: Search */}
      <div className="search-container" ref={searchRef}>
        <input
          type="text"
          placeholder="Search assets, tickets, users…"
          className="db-search-input"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSearch(true);
          }}
          onFocus={() => setShowSearch(true)}
        />
        {showSearch && searchQuery.length >= 2 && (
          <div className="search-results-panel">
            {searchLoading ? (
              <div className="search-empty">Searching diagnostics...</div>
            ) : searchResults.length === 0 ? (
              <div className="search-empty">No matching records found.</div>
            ) : (
              searchResults.map((res) => (
                <div
                  key={res.id}
                  className="search-result-item"
                  onClick={() => {
                    setShowSearch(false);
                    if (res.type === 'Asset') navigate(`/asset/${res.id}`);
                    else alert(`Selected ${res.type}: ${res.name}\nDetails: ${res.snippet}`);
                  }}
                >
                  <div className="search-result-meta">
                    <span className="search-result-type">{res.type}</span>
                  </div>
                  <div className="search-result-name">{res.name}</div>
                  <div className="search-result-snippet">{res.snippet}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right side: theme toggle, user pill, logout */}
      <div className="db-topbar-right">
        {/* Theme toggle */}
        <button
          className="db-icon-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle dark / light mode"
        >
          {isDarkMode ? <Icon path="M12 3v1m0 16v1m8.66-12.66l-.71.71M5.05 18.95l-.71-.71M21 12h-1M4 12H3m16.95 5.05l-.71-.71M5.05 5.05l-.71.71" /> : <Icon path="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />}
        </button>

        {/* User pill (Click to Change Password) */}
        <div
          className="db-user-pill"
          onClick={() => { setShowResetModal(true); setResetError(''); }}
          title="Change Password"
        >
          <div className="db-avatar">
            {user.name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <span className="db-user-name">{user.name}</span>
          <span
            className="db-role-badge"
            style={{
              background: user.role === 'Super Admin' ? 'rgba(234,179,8,0.12)' : user.role === 'Admin' ? 'rgba(99,102,241,0.12)' : 'rgba(20,184,166,0.12)',
              border: user.role === 'Super Admin' ? 'rgba(234,179,8,0.35)' : user.role === 'Admin' ? 'rgba(99,102,241,0.35)' : 'rgba(20,184,166,0.35)',
              color: user.role === 'Super Admin' ? '#fbbf24' : user.role === 'Admin' ? '#818cf8' : '#2dd4bf',
            }}
          >
            {user.role}
          </span>
          <span style={{ display: 'inline-flex', opacity: 0.6, marginLeft: '0.2rem', color: 'var(--text-dim)' }}>
            <Icon size={12} path="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </span>
        </div>

        {/* Logout */}
        <button className="db-logout-btn" onClick={handleLogout}>
          <span>⏻</span>
          Logout
        </button>
      </div>

      {showResetModal && (
        <div className="um-overlay" onClick={e => e.target === e.currentTarget && setShowResetModal(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.78)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem',
          animation: 'um-overlayIn .2s ease both'
        }}>
          <div className="um-modal" style={{
            background: '#0d1117', border: '1px solid rgba(255,255,255,.09)',
            borderRadius: '24px', width: '100%', maxWidth: '400px',
            boxShadow: '0 30px 70px rgba(0,0,0,.6)', position: 'relative',
            animation: 'um-modalIn .3s cubic-bezier(.22,1,.36,1) both'
          }}>
            <style>{`
              .self-pw-field { margin-bottom: 1.1rem; }
              .self-pw-label { display: block; font-size: .7rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: #cbd5e1; margin-bottom: .42rem; }
              .self-pw-input { width: 100%; padding: .78rem 1rem; background: #0a0e1a; border: 1px solid rgba(255,255,255,.08); border-radius: 11px; color: #e2e8f0; font-family: 'DM Sans', sans-serif; font-size: .88rem; outline: none; transition: border-color .2s, box-shadow .2s; }
              .self-pw-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.12); }
              .self-pw-error { color: #fca5a5; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 10px; padding: 0.75rem; margin-bottom: 1rem; font-size: 0.8rem; }
            `}</style>
            <div className="um-modal-accent" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2.5px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)', borderRadius: '24px 24px 0 0' }} />
            <div className="um-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.8rem 2rem 0', marginBottom: '1.6rem' }}>
              <div className="um-modal-title" style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Change Password</div>
              <button className="um-modal-close" onClick={() => setShowResetModal(false)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid rgba(255,255,255,.09)', background: 'rgba(255,255,255,.04)', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .18s' }}>
                ✕
              </button>
            </div>
            <div className="um-modal-body" style={{ padding: '0 2rem 2rem' }}>
              <form onSubmit={handleSelfResetPassword}>
                {resetError && <div className="self-pw-error">{resetError}</div>}
                
                <div className="self-pw-field">
                  <label className="self-pw-label">Current Password</label>
                  <input
                    className="self-pw-input"
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="self-pw-field">
                  <label className="self-pw-label">New Password</label>
                  <input
                    className="self-pw-input"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <div className="self-pw-field" style={{ marginBottom: '1.5rem' }}>
                  <label className="self-pw-label">Confirm New Password</label>
                  <input
                    className="self-pw-input"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <div className="um-modal-footer" style={{ display: 'flex', gap: '0.8rem', marginTop: '1.4rem' }}>
                  <button type="button" className="um-cancel-btn" onClick={() => setShowResetModal(false)} style={{ flex: 1, padding: '.75rem', borderRadius: '11px', border: '1px solid rgba(255,255,255,.09)', background: 'rgba(255,255,255,.04)', color: '#cbd5e1', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '.85rem', fontWeight: 500 }}>
                    Cancel
                  </button>
                  <button type="submit" className="um-save-btn" disabled={resettingSelf} style={{ flex: 1, padding: '.75rem', borderRadius: '11px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '.9rem', fontWeight: 700 }}>
                    {resettingSelf ? 'Saving…' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
