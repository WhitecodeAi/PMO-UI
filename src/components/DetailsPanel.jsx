import React, { useEffect, useState } from 'react';

const FEATURE_OPTIONS = [
  "Malware Protection",
  "Maintenance and support",
  "News & Notices (Add, Update, Delete)",
  "Highlights (Add, Update, Delete)",
  "Events (Add, Update, Delete)",
  "Photo Gallery (Add, Update, Delete)",
  "College News Paper Gallery",
  "Time table Display (Add, Update, Delete)",
  "GR & Report(PDF File) (Add, Update, Delete)",
  "Other Notices (Add, Update, Delete)",
  "Download Section (Add, Update, Delete)",
  "Mobile Responsive",
  "Admin Panel",
  "File Manager",
  "SSL Certificate"
];

export default function DetailsPanel({ project, isOpen, onClose, onToggleStage, onUpdateStageDetail, onUpdateIntakeDetails, isIntake, lanes }) {
    const [expandedPhase, setExpandedPhase] = useState(null);
    const [isTeamExpanded, setIsTeamExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('execution');

    const handleDateMask = (e, projectId, phaseId, stageId) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        
        let formattedValue = '';
        if (value.length > 0) formattedValue = value.substring(0, 2);
        if (value.length > 2) formattedValue += '/' + value.substring(2, 4);
        if (value.length > 4) formattedValue += '/' + value.substring(4, 8);
        
        onUpdateStageDetail(projectId, phaseId, stageId, 'date', formattedValue);
    };

    const TEAM_NAMES = {
        'JS': 'John Smith',
        'AL': 'Amy Lee',
        'MK': 'Mike Kelly',
        'JD': 'Jane Doe',
        'TR': 'Tom Rogers'
    };

    // Update expanded phase when project changes
    useEffect(() => {
        if (project && isOpen) {
            setExpandedPhase(project.phase);
        }
    }, [project?.id, isOpen]);
    // Handle escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!project) {
        return (
            <div className={`side-panel-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
                <aside className={`side-panel ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}></aside>
            </div>
        );
    }

    const owner = project.owner || { name: 'Unassigned', initials: '?', color: '#dfe1e6' };
    const phaseName = project.phaseName || 'New Project';
    const color = project.color || '#42526e';
    const team = project.team || [];
    const stages = project.stages || {};

    let totalStages = 0;
    let completedStages = 0;
    Object.values(stages).forEach(phaseStages => {
        totalStages += phaseStages.length;
        completedStages += phaseStages.filter(s => s.completed).length;
    });
    const progressPercentage = totalStages === 0 ? 0 : Math.round((completedStages / totalStages) * 100);

    const details = project.details || {};

    return (
        <div className={`side-panel-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <aside className={`side-panel ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="panel-inner">
                    <div className="panel-header">
                        <div className="panel-header-content">
                            <span className="panel-phase" style={{ color: color }}>
                                {phaseName}
                            </span>
                            <h2>{project.title}</h2>
                        </div>
                        <button className="btn-close" onClick={onClose}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    
                    {!isIntake && (
                        <div className="clean-tabs" style={{ margin: '16px 24px 0 24px', flexShrink: 0 }}>
                            <button 
                                className={`clean-tab ${activeTab === 'execution' ? 'active' : ''}`}
                                onClick={() => setActiveTab('execution')}
                            >
                                Execution
                            </button>
                            <button 
                                className={`clean-tab ${activeTab === 'business' ? 'active' : ''}`}
                                onClick={() => setActiveTab('business')}
                            >
                                Business Brief
                            </button>
                            <button 
                                className={`clean-tab ${activeTab === 'activity' ? 'active' : ''}`}
                                onClick={() => setActiveTab('activity')}
                            >
                                Activity
                            </button>
                        </div>
                    )}

                    <div className="panel-content" style={{ paddingTop: '16px' }}>
                        {!isIntake && activeTab === 'execution' && (
                            <>
                                <div className="section details-grid" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

                            <div style={{ display: 'flex', gap: '24px' }}>
                                <div className="detail-item" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                                    <span className="label" style={{ minWidth: '100px' }}>Start Date:</span>
                                    <div className="value date-value">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        Sep 01, 2026
                                    </div>
                                </div>
                                <div className="detail-item" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                                    <span className="label" style={{ minWidth: '80px' }}>Target Date:</span>
                                    <div className="value date-value">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        {project.date}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="section">
                            <div className={`phase-accordion-item ${isTeamExpanded ? 'expanded' : ''}`}>
                                <div 
                                    className="phase-accordion-header"
                                    onClick={() => setIsTeamExpanded(!isTeamExpanded)}
                                >
                                    <div className="phase-accordion-title">
                                        <svg className={`chevron ${isTeamExpanded ? 'expanded' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                        Team Members
                                        <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--text-tertiary)', marginLeft: '8px' }}>
                                            (PM: {owner.name})
                                        </span>
                                    </div>
                                    <span className="phase-accordion-badge">
                                        {team.length || 0}
                                    </span>
                                </div>
                                {isTeamExpanded && (
                                    <div className="phase-accordion-content">
                                        <div className="team-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {team.map((member, idx) => (
                                                <div key={idx} className="team-member" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div className="user-avatar mini" style={{ backgroundColor: member.color }}>
                                                        {member.initials}
                                                    </div>
                                                    <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                                                        {member.name || TEAM_NAMES[member.initials] || 'Team Member'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="section stages-section">
                            
                            <div className="phases-accordion">
                                {lanes && lanes.map(lane => {
                                    const phaseStages = stages[lane.id] || [];
                                    const phaseTotal = phaseStages.length;
                                    const phaseCompleted = phaseStages.filter(s => s.completed).length;
                                    const isExpanded = expandedPhase === lane.id;

                                    return (
                                        <div key={lane.id} className={`phase-accordion-item ${isExpanded ? 'expanded' : ''}`}>
                                            <div 
                                                className="phase-accordion-header"
                                                onClick={() => setExpandedPhase(isExpanded ? null : lane.id)}
                                            >
                                                <div className="phase-accordion-title">
                                                    <svg className={`chevron ${isExpanded ? 'expanded' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                                    {lane.name}
                                                </div>
                                                <span className="phase-accordion-badge">
                                                    {phaseCompleted}/{phaseTotal}
                                                </span>
                                            </div>
                                            {isExpanded && (
                                                <div className="phase-accordion-content">
                                                    <ul className="stage-list">
                                                        {phaseStages.map(stage => (
                                                            <li key={stage.id} className={`stage-item ${stage.completed ? 'completed' : ''}`}>
                                                                <div 
                                                                    className="stage-checkbox" 
                                                                    onClick={() => onToggleStage(project.id, lane.id, stage.id)}
                                                                ></div>
                                                                <div className="stage-content">
                                                                    <div 
                                                                        className="stage-name"
                                                                        onClick={() => onToggleStage(project.id, lane.id, stage.id)}
                                                                    >
                                                                        {stage.name}
                                                                    </div>
                                                                    {stage.details !== undefined && (
                                                                        <div className="stage-details" onClick={(e) => e.stopPropagation()}>
                                                                            {stage.details.date !== undefined && (
                                                                                <div className="stage-input-group">
                                                                                    <div className="stage-input-wrapper">
                                                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                                                        <input 
                                                                                            type="text" 
                                                                                            className="stage-input date-mask" 
                                                                                            placeholder="DD/MM/YYYY" 
                                                                                            value={stage.details.date}
                                                                                            onChange={(e) => handleDateMask(e, project.id, lane.id, stage.id)}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                            </>
                        )}

                        {(isIntake || activeTab === 'business') && (
                            <div className="section business-brief">
                                {isIntake || (project.details && Object.keys(project.details).length > 0) ? (
                                    <div className="phase-accordion-content" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>Intake Requirements</h3>
                                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Details submitted by the business team.</p>
                                        </div>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                                            <div className="form-group">
                                                <label>Contact Person</label>
                                                {isIntake ? <input type="text" value={details.contactPerson || project.requester || ''} onChange={e => onUpdateIntakeDetails(project.id, 'contactPerson', e.target.value)} /> : <strong style={{ color: 'var(--text-primary)' }}>{details.contactPerson || project.requester || 'N/A'}</strong>}
                                            </div>
                                            <div className="form-group">
                                                <label>Role</label>
                                                {isIntake ? <input type="text" value={details.role || ''} onChange={e => onUpdateIntakeDetails(project.id, 'role', e.target.value)} /> : <strong style={{ color: 'var(--text-primary)' }}>{details.role || 'N/A'}</strong>}
                                            </div>
                                            <div className="form-group">
                                                <label>Phone</label>
                                                {isIntake ? <input type="text" value={details.contactNumber || ''} onChange={e => onUpdateIntakeDetails(project.id, 'contactNumber', e.target.value)} /> : <strong style={{ color: 'var(--text-primary)' }}>{details.contactNumber || 'N/A'}</strong>}
                                            </div>
                                            <div className="form-group">
                                                <label>Email</label>
                                                {isIntake ? <input type="text" value={details.email || ''} onChange={e => onUpdateIntakeDetails(project.id, 'email', e.target.value)} /> : <strong style={{ color: 'var(--text-primary)' }}>{details.email || 'N/A'}</strong>}
                                            </div>
                                            {(isIntake || details.existingWebsite) && (
                                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                                    <label>Existing Website</label>
                                                    {isIntake ? <input type="text" value={details.existingWebsite || ''} onChange={e => onUpdateIntakeDetails(project.id, 'existingWebsite', e.target.value)} /> : <strong style={{ color: 'var(--text-primary)' }}><a href={details.existingWebsite} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>{details.existingWebsite}</a></strong>}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '13px' }}>
                                            {(isIntake || details.hostingPlan) && (
                                                <div className="form-group">
                                                    <label>Hosting Plan</label>
                                                    {isIntake ? <input type="text" value={details.hostingPlan || ''} onChange={e => onUpdateIntakeDetails(project.id, 'hostingPlan', e.target.value)} /> : <strong style={{ color: 'var(--text-primary)' }}>{details.hostingPlan}</strong>}
                                                </div>
                                            )}
                                            {(isIntake || details.supportHrs) && (
                                                <div className="form-group">
                                                    <label>Support Hours</label>
                                                    {isIntake ? <input type="text" value={details.supportHrs || ''} onChange={e => onUpdateIntakeDetails(project.id, 'supportHrs', e.target.value)} /> : <strong style={{ color: 'var(--text-primary)' }}>{details.supportHrs}</strong>}
                                                </div>
                                            )}
                                            {(isIntake || details.pages) && (
                                                <div className="form-group">
                                                    <label>Estimated Pages</label>
                                                    {isIntake ? <input type="text" value={details.pages || ''} onChange={e => onUpdateIntakeDetails(project.id, 'pages', e.target.value)} /> : <strong style={{ color: 'var(--text-primary)' }}>{details.pages}</strong>}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {(isIntake || (details.features && details.features.length > 0)) && (
                                            <div className="form-group">
                                                <label>Scope & Features</label>
                                                {isIntake ? (
                                                    <div className="features-grid">
                                                        {FEATURE_OPTIONS.map(feat => (
                                                            <label key={feat} className="feature-checkbox">
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={(details.features || []).includes(feat)}
                                                                    onChange={(e) => {
                                                                        const currentFeatures = details.features || [];
                                                                        if (e.target.checked) {
                                                                            onUpdateIntakeDetails(project.id, 'features', [...currentFeatures, feat]);
                                                                        } else {
                                                                            onUpdateIntakeDetails(project.id, 'features', currentFeatures.filter(f => f !== feat));
                                                                        }
                                                                    }}
                                                                />
                                                                <span>{feat}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                        {details.features.map(f => (
                                                            <span key={f} style={{ background: '#e6efff', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', color: '#0052cc', fontWeight: '500' }}>
                                                                {f}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {(isIntake || details.scope) && (
                                            <div className="form-group">
                                                <label>Additional Scope & Comments</label>
                                                {isIntake ? (
                                                    <textarea value={details.scope || ''} onChange={e => onUpdateIntakeDetails(project.id, 'scope', e.target.value)} rows="3" />
                                                ) : (
                                                    <div style={{ padding: '16px', background: 'var(--bg-lane)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                                                        <p style={{ fontSize: '13px', margin: 0, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{details.scope}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="empty-state" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px dashed var(--border-light)' }}>
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '16px', opacity: 0.5, display: 'block', margin: '0 auto 16px auto' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>No Business Brief added</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {!isIntake && activeTab === 'activity' && (
                            <div className="section comments-section">
                                <div className="activity-list">
                                    <div className="activity-item">
                                        <div className="avatar" style={{ backgroundColor: '#10b981', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: '600' }}>MK</div>
                                        <div className="activity-content">
                                            <div className="activity-header">
                                                <span className="name">Maria Kelly</span>
                                                <span className="time">2h ago</span>
                                            </div>
                                            <p className="comment">Moved project to current phase and updated the target date.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="comment-input-area">
                                    <div className="avatar" style={{ backgroundColor: '#3b82f6', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: '600' }}>JS</div>
                                    <input type="text" placeholder="Write a comment..." />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </div>
    );
}
