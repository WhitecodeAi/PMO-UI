import React, { useEffect, useState } from 'react';

export default function DetailsPanel({ project, isOpen, onClose, onToggleStage, onUpdateStageDetail, lanes }) {
    const [expandedPhase, setExpandedPhase] = useState(null);
    const [isTeamExpanded, setIsTeamExpanded] = useState(false);

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

    let totalStages = 0;
    let completedStages = 0;
    if (project.stages) {
        Object.values(project.stages).forEach(phaseStages => {
            totalStages += phaseStages.length;
            completedStages += phaseStages.filter(s => s.completed).length;
        });
    }
    const progressPercentage = totalStages === 0 ? 0 : Math.round((completedStages / totalStages) * 100);

    return (
        <div className={`side-panel-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <aside className={`side-panel ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="panel-inner">
                    <div className="panel-header">
                        <div className="panel-header-content">
                            <span className="panel-phase" style={{ color: project.color }}>
                                {project.phaseName}
                            </span>
                            <h2>{project.title}</h2>
                        </div>
                        <button className="btn-close" onClick={onClose}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    
                    <div className="panel-content">
                        <div className="section details-grid" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="detail-item" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                                <span className="label" style={{ minWidth: '100px' }}>Project Manager:</span>
                                <div className="value avatar-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div className="avatar" style={{ backgroundColor: project.owner.color, width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white', fontWeight: '600' }}>
                                        {project.owner.initials}
                                    </div>
                                    <span>{project.owner.name}</span>
                                </div>
                            </div>
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
                                    </div>
                                    <span className="phase-accordion-badge">
                                        {project.team?.length || 0}
                                    </span>
                                </div>
                                {isTeamExpanded && (
                                    <div className="phase-accordion-content">
                                        <div className="team-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {project.team?.map((member, idx) => (
                                                <div key={idx} className="team-member" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div className="avatar" style={{ backgroundColor: member.color, width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white', fontWeight: '600' }}>
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
                                    const phaseStages = project.stages[lane.id] || [];
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
                        
                        <div className="section comments-section">
                            <h3>Recent Activity</h3>
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
                    </div>
                </div>
            </aside>
        </div>
    );
}
