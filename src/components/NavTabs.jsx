import React from 'react';
import { useDashboard } from '../context/DashboardContext';

export const NavTabs = ({ activeTab, setActiveTab }) => {
  const { user } = useDashboard();
  const isAdmin = user.role === 'Super Admin' || user.role === 'Admin';
  
  const tabs = [
    { name: 'Overview', icon: '⊞' },
    { name: 'Assets', icon: '◈' },
    { name: 'Tickets', icon: '◎' },
    { name: 'Vehicles', icon: '🚗' },
    ...(isAdmin ? [
      { name: 'Users', icon: '◉' },
      { name: 'Department', icon: '🏢' },
      { name: 'Admin', icon: '⚙' }
    ] : [
      { name: 'Employee', icon: '👤' }
    ])
  ];

  return (
    <nav className="db-nav">
      {tabs.map(t => (
        <button
          key={t.name}
          className={`db-tab ${activeTab === t.name ? 'active' : ''}`}
          onClick={() => setActiveTab(t.name)}
        >
          <span className="db-tab-icon">{t.icon}</span>
          <span>{t.name}</span>
        </button>
      ))}
    </nav>
  );
};
