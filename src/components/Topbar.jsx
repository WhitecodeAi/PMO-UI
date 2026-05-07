import React from 'react';

export default function Topbar({ activeView, onViewChange, role, setRole }) {
  return (
    <header className="topbar">
        <div className="header-left">
            <div className="header-title-row">
                <div className="header-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                </div>
                <h1>Projects</h1>
            </div>
            
            {role === 'pmo' && (
              <div className="project-tabs">
                <button 
                  className={`project-tab ${activeView === 'intake' ? 'active' : ''}`}
                  onClick={() => onViewChange('intake')}
                >
                  Projects Pool
                </button>
                <button 
                  className={`project-tab ${activeView === 'board' ? 'active' : ''}`}
                  onClick={() => onViewChange('board')}
                >
                  Status Board
                </button>
              </div>
            )}
        </div>
        <div className="header-right">
            <div className="role-switcher" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
              <label>Viewing as:</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', fontWeight: '500', cursor: 'pointer' }}
              >
                <option value="pmo">PMO Team</option>
                <option value="business">Business Team</option>
              </select>
            </div>
        </div>
    </header>
  );
}
