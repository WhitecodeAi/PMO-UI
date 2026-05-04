import React from 'react';
import ProjectCard from './ProjectCard';

export default function Lane({ lane, projects, onCardClick, onDragStart, onDrop }) {
    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    return (
        <div 
            className="lane"
            onDragOver={handleDragOver}
            onDrop={(e) => onDrop(e, lane.id)}
        >
            <div className="lane-header">
                <div className="lane-title">
                    <h2>{lane.name}</h2>
                </div>
                <span className="lane-count">{projects.length}</span>
            </div>
            <div className="card-list">
                {projects.map(project => (
                    <ProjectCard 
                        key={project.id} 
                        project={project} 
                        onClick={onCardClick} 
                        onDragStart={onDragStart}
                    />
                ))}
            </div>
        </div>
    );
}
