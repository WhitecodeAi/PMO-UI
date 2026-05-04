import React, { useState } from 'react';
import Topbar from './components/Topbar';
import Board from './components/Board';
import DetailsPanel from './components/DetailsPanel';
import { projectData as initialProjectData, lanes } from './data';

function App() {
  const [projects, setProjects] = useState(initialProjectData);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleCardClick = (project) => {
    setSelectedProjectId(project.id);
  };

  const handleDragStart = (e, projectId) => {
    e.dataTransfer.setData('projectId', projectId);
  };

  const handleDrop = (e, laneId) => {
    const projectId = e.dataTransfer.getData('projectId');
    if (!projectId) return;

    setProjects(prev => {
      const projectKey = Object.keys(prev).find(key => prev[key].id === projectId);
      if (!projectKey) return prev;

      const laneInfo = lanes.find(l => l.id === laneId);

      return {
        ...prev,
        [projectKey]: {
          ...prev[projectKey],
          phase: laneId,
          phaseName: laneInfo.name,
          color: laneInfo.color
        }
      };
    });
  };

  const closePanel = () => {
    setSelectedProjectId(null);
  };

  const handleToggleStage = (projectId, phaseId, stageId) => {
    setProjects(prev => {
      // Find the project key (e.g. 'Alpha Migration')
      const projectKey = Object.keys(prev).find(key => prev[key].id === projectId);
      if (!projectKey) return prev;

      const project = prev[projectKey];
      const phaseStages = project.stages[phaseId];
      const updatedPhaseStages = phaseStages.map(stage => 
        stage.id === stageId ? { ...stage, completed: !stage.completed } : stage
      );

      return {
        ...prev,
        [projectKey]: {
          ...project,
          stages: {
            ...project.stages,
            [phaseId]: updatedPhaseStages
          }
        }
      };
    });
  };

  const handleUpdateStageDetail = (projectId, phaseId, stageId, field, value) => {
    setProjects(prev => {
      const projectKey = Object.keys(prev).find(key => prev[key].id === projectId);
      if (!projectKey) return prev;

      const project = prev[projectKey];
      const phaseStages = project.stages[phaseId];
      const updatedPhaseStages = phaseStages.map(stage => 
        stage.id === stageId 
          ? { ...stage, details: { ...stage.details, [field]: value } } 
          : stage
      );

      return {
        ...prev,
        [projectKey]: {
          ...project,
          stages: {
            ...project.stages,
            [phaseId]: updatedPhaseStages
          }
        }
      };
    });
  };

  // Find the full project object based on selected ID
  const selectedProjectKey = Object.keys(projects).find(key => projects[key].id === selectedProjectId);
  const selectedProject = selectedProjectKey ? projects[selectedProjectKey] : null;

  return (
    <div className="app-container">
      <main className="main-content">
        <Topbar />
        <Board 
          lanes={lanes} 
          projects={projects} 
          onCardClick={handleCardClick} 
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />
      </main>
      <DetailsPanel 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={closePanel}
        onToggleStage={handleToggleStage}
        onUpdateStageDetail={handleUpdateStageDetail}
        lanes={lanes}
      />
    </div>
  );
}

export default App;
