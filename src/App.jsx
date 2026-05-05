import React, { useState } from 'react';
import Topbar from './components/Topbar';
import Board from './components/Board';
import DetailsPanel from './components/DetailsPanel';
import ProjectPool from './components/ProjectPool';
import Sidebar from './components/Sidebar';
import { projectData as initialProjectData, lanes, intakeData as initialIntakeData } from './data';

function App() {
  const [activeView, setActiveView] = useState('board');
  const [projects, setProjects] = useState(initialProjectData);
  const [intakeRequests, setIntakeRequests] = useState(initialIntakeData);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleAssignPM = (intakeId, pmName = "New PM", pmInitials = "NP", pmColor = "#8b5cf6") => {
    const request = intakeRequests.find(r => r.id === intakeId);
    if (!request) return;

    // Create new project object
    const newProjectId = `p${Date.now()}`;
    const newProject = {
      id: newProjectId,
      title: request.title,
      phase: 'initiation',
      phaseName: 'Project Initiation',
      description: `Project request assigned to ${pmName}. Original requester: ${request.requester}.`,
      owner: {
        name: pmName,
        initials: pmInitials,
        color: pmColor
      },
      date: new Date().toISOString().split('T')[0],
      tags: [
        { text: request.priority, class: `tag-${request.priority.toLowerCase()}` },
        { text: request.epic, class: "tag-backend" }
      ],
      team: [
        { initials: pmInitials, color: pmColor }
      ],
      stages: {
        initiation: [
          { id: "init_1", name: "Introduction Meeting", details: { date: "" }, desc: "Meet with stakeholders", completed: false },
          { id: "init_2", name: "Requirements Gathering", desc: "Identify core needs", completed: false },
          { id: "init_3", name: "Resource Allocation", desc: "Assign team members", completed: false }
        ],
        design: [
          { id: "des_1", name: "Wireframing", desc: "Low-fidelity layout", completed: false },
          { id: "des_2", name: "UI Mockups", desc: "High-fidelity design", completed: false }
        ],
        development: [
          { id: "dev_1", name: "Frontend Implementation", desc: "Build UI components", completed: false },
          { id: "dev_2", name: "Backend Integration", desc: "API connectivity", completed: false }
        ],
        testing: [
          { id: "qa_1", name: "Unit Testing", desc: "Component level tests", completed: false }
        ],
        golive: [
          { id: "go_1", name: "Production Deployment", desc: "Push to live server", completed: false }
        ]
      }
    };

    setProjects(prev => ({
      ...prev,
      [newProjectId]: newProject
    }));

    setIntakeRequests(prev => prev.filter(r => r.id !== intakeId));
  };

  const handleCreateRequest = (newRequest) => {
    setIntakeRequests(prev => [...prev, newRequest]);
  };

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
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="main-content">
        <Topbar activeView={activeView} onViewChange={setActiveView} />
        {activeView === 'board' ? (
          <Board 
            lanes={lanes} 
            projects={projects} 
            onCardClick={handleCardClick} 
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ) : (
          <ProjectPool 
            projects={projects}
            intakeRequests={intakeRequests}
            onAssignPM={handleAssignPM}
            onCreateRequest={handleCreateRequest}
          />
        )}
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
