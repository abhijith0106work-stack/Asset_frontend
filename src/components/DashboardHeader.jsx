import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Simple SVG icons (replace with proper icon library if needed)
const Icon = ({ path, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const DashboardHeader = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  // Global search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);

  // Fetch notifications (re‑used endpoint from Dashboard)
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/approval/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 30000);
    return () => clearInterval(iv);
  }, []);

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
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
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

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
      `}</style>

      {/* Branding */}
      <div className="db-brand">
        <div className="db-logo-wrap">
          <img className="db-logo-img" src="../Assets/logo.png" alt="Company Logo" onError={(e) => {
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

      {/* Right side: notifications, theme toggle, user pill, logout */}
      <div className="db-topbar-right">
        {/* Theme toggle */}
        <button
          className="db-icon-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle dark / light mode"
        >
          {isDarkMode ? <Icon path="M12 3v1m0 16v1m8.66-12.66l-.71.71M5.05 18.95l-.71-.71M21 12h-1M4 12H3m16.95 5.05l-.71-.71M5.05 5.05l-.71.71" /> : <Icon path="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />}
        </button>

        {/* Notification bell */}
        <div className="db-notif-wrap" ref={notifRef} style={{ position: 'relative' }}>
          <button
            className="db-icon-btn"
            onClick={() => setShowNotif(!showNotif)}
            title="Notifications"
          >
            <Icon path="M18 8a6 6 0 11-12 0 6 6 0 0112 0zM13 21h-2a2 2 0 004 0h-2z" />
            {unreadCount > 0 && (
              <span className="db-notif-badge">{unreadCount}</span>
            )}
          </button>

          {showNotif && (
            <div className="db-notif-panel">
              <div className="db-notif-header">
                <span className="db-notif-title">Notifications</span>
                <button className="db-notif-clear" onClick={() => setNotifications([])}>
                  Clear All
                </button>
              </div>
              <div className="db-notif-scroll">
                {notifications.length === 0 ? (
                  <div className="db-notif-empty">No new notifications.</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n._id} className="db-notif-item" onClick={() => {
                      // Mark as read locally and potentially navigate
                      setNotifications((prev) => prev.filter((i) => i._id !== n._id));
                    }}>
                      <div className="db-notif-dot" />
                      <div className="db-notif-content">
                        <div className="db-notif-msg">{n.message}</div>
                        <div className="db-notif-time">{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User pill */}
        <div className="db-user-pill">
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
        </div>

        {/* Logout */}
        <button className="db-logout-btn" onClick={handleLogout}>
          <span>⏻</span>
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
