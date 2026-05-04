import React from 'react';

export default function ProjectCard({ project, onClick, onDragStart }) {
    let completedStages = 0;
    let totalStages = 0;
    if (project.stages) {
        Object.values(project.stages).forEach(phaseStages => {
            totalStages += phaseStages.length;
            completedStages += phaseStages.filter(s => s.completed).length;
        });
    }
    
    // Calculate percentage, default to 0% if no stages
    const percent = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

    return (
        <div 
            className="card" 
            onClick={() => onClick(project)}
            draggable
            onDragStart={(e) => onDragStart(e, project.id)}
        >
            <div className="card-header">
                <div className="card-title">{project.title}</div>
            </div>
            <div className="card-footer">
                <div className="avatar-wrapper">
                    <div className="avatar">
                        {project.owner?.initials || '?'}
                    </div>
                    <span className="avatar-name">{project.owner?.name || 'Unknown'}</span>
                </div>
            </div>
        </div>
    );
}
