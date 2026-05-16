import React from 'react';

const Reports = () => {
  return (
    <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>
      <h2>Approval Reports</h2>
      <p style={{ color: '#64748b', marginTop: '1rem' }}>Generate and export PDF/Excel reports for file movements and Turnaround Time (TAT).</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
        <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          Status Summary
        </div>
        <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          Average TAT
        </div>
      </div>
    </div>
  );
};

export default Reports;
