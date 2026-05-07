import React, { useState, useEffect } from 'react';
import Topbar from './components/Topbar';
import Board from './components/Board';
import DetailsPanel from './components/DetailsPanel';
import ProjectPool from './components/ProjectPool';
import Sidebar from './components/Sidebar';
import { projectData as initialProjectData, lanes, intakeData as initialIntakeData } from './data';

function App() {
  const [activeView, setActiveView] = useState('board');
  const [role, setRole] = useState('pmo'); // 'pmo' or 'business'
  const [projects, setProjects] = useState(initialProjectData);
  const [intakeRequests, setIntakeRequests] = useState(initialIntakeData);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Force business users out of the board view
  useEffect(() => {
    if (role === 'business' && activeView === 'board') {
      setActiveView('intake');
    }
  }, [role, activeView]);

  const handleAssignPM = (intakeId, targetPhase = 'initiation', pmName = "New PM", pmInitials = "NP", pmColor = "#546a7b") => {
    const request = intakeRequests.find(r => r.id === intakeId);
    if (!request) return;

    const laneInfo = lanes.find(l => l.id === targetPhase) || lanes[0];
    
    const newProject = {
      id: intakeId,
      title: request.title,
      phase: targetPhase,
      phaseName: laneInfo.name,
      description: `Project request assigned to ${pmName}. Original requester: ${request.requester}.`,
      details: request.details,
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
      [intakeId]: newProject
    }));

    setIntakeRequests(prev => prev.filter(r => r.id !== intakeId));
  };

  const handleUpdatePM = (projectId, pmName, pmInitials, pmColor) => {
    setProjects(prev => {
      const projectKey = Object.keys(prev).find(key => prev[key].id === projectId);
      if (!projectKey) return prev;
      return {
        ...prev,
        [projectKey]: {
          ...prev[projectKey],
          owner: { name: pmName, initials: pmInitials, color: pmColor },
          team: [{ initials: pmInitials, color: pmColor }]
        }
      };
    });
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

  const handleStatusChange = (projectId, newPhaseId) => {
    setProjects(prev => {
      const projectKey = Object.keys(prev).find(key => prev[key].id === projectId);
      if (!projectKey) return prev;

      const laneInfo = lanes.find(l => l.id === newPhaseId);
      if (!laneInfo) return prev;

      return {
        ...prev,
        [projectKey]: {
          ...prev[projectKey],
          phase: newPhaseId,
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
  const selectedIntake = intakeRequests.find(r => r.id === selectedProjectId);
  const selectedProject = selectedProjectKey ? projects[selectedProjectKey] : selectedIntake;

  return (
    <div className="app-container">
      <Sidebar activeView={activeView} onViewChange={setActiveView} role={role} />
      <main className="main-content">
        <Topbar activeView={activeView} onViewChange={setActiveView} role={role} setRole={setRole} />
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
            lanes={lanes}
            intakeRequests={intakeRequests}
            onAssignPM={handleAssignPM}
            onUpdatePM={handleUpdatePM}
            onCreateRequest={handleCreateRequest}
            onStatusChange={handleStatusChange}
            onCardClick={handleCardClick}
            role={role}
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
