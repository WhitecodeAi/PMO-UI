import React from 'react';

export default function Topbar({ activeView, onViewChange }) {
  return (
    <header className="topbar">
        <div className="header-left">
            <div className="header-title-row">
                <div className="header-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                </div>
                <h1>Projects</h1>
            </div>
            
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
        </div>
        <div className="header-right">
            {/* The right side can have filters or other global actions later */}
        </div>
    </header>
  );
}
