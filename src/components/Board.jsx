import React from 'react';
import Lane from './Lane';


export default function Board({ lanes, projects, onCardClick, onDragStart, onDrop }) {
    return (
        <div className="board-wrapper">
            <div className="board">
                {lanes.map(lane => {
                    const laneProjects = Object.values(projects).filter(p => p.phase === lane.id);
                    return (
                        <Lane
                            key={lane.id}
                            lane={lane}
                            projects={laneProjects}
                            onCardClick={onCardClick}
                            onDragStart={onDragStart}
                            onDrop={onDrop}
                        />
                    );
                })}
            </div>
        </div>
    );
}
