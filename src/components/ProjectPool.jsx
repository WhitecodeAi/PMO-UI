import React, { useState } from 'react';

export default function ProjectPool({ projects = {}, intakeRequests = [], onAssignPM, onCreateRequest }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeExpanded, setActiveExpanded] = useState(true);
  const [intakeExpanded, setIntakeExpanded] = useState(true);
  
  const [newReq, setNewReq] = useState({ 
    title: '', 
    epic: 'Web Development', 
    priority: 'Medium',
    contactPerson: '',
    role: '',
    contactNumber: '',
    email: '',
    scope: ''
  });

  const activeProjectsList = Object.values(projects).filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIntake = intakeRequests.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.requester?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: `REQ-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      title: newReq.title,
      epic: newReq.epic,
      requester: newReq.contactPerson,
      priority: newReq.priority,
      date: new Date().toISOString().split('T')[0],
      details: {
        role: newReq.role,
        contactNumber: newReq.contactNumber,
        email: newReq.email,
        scope: newReq.scope
      }
    };
    onCreateRequest(newRequest);
    setIsModalOpen(false);
    setNewReq({ 
      title: '', epic: 'Web Development', priority: 'Medium',
      contactPerson: '', role: '', contactNumber: '', email: '', scope: ''
    });
  };

  const renderActiveRow = (project) => (
    <div className="pool-row" key={project.id}>
      <div className="pool-row-left">
        <input type="checkbox" className="pool-checkbox" />
        <span className="pool-id">{project.id.toUpperCase()}</span>
        <span className="pool-title">{project.title}</span>
      </div>
      <div className="pool-row-right">
        {project.tags && project.tags.map((tag, i) => (
          <span key={i} className={`epic-badge ${tag.class || ''}`}>{tag.text}</span>
        ))}
        <span className="status-badge active-status">{project.phaseName}</span>
        <div className="user-avatar mini" style={{ backgroundColor: project.owner?.color || '#0052cc' }}>
          {project.owner?.initials || '?'}
        </div>
      </div>
    </div>
  );

  const renderIntakeRow = (item) => (
    <div className="pool-row" key={item.id}>
      <div className="pool-row-left">
        <input type="checkbox" className="pool-checkbox" />
        <span className="pool-id">{item.id}</span>
        <span className="pool-title">{item.title}</span>
      </div>
      <div className="pool-row-right">
        <span className="epic-badge">{item.epic}</span>
        <select 
          className="status-dropdown" 
          value="intake"
          onChange={(e) => {
            if(e.target.value === 'initiation') {
              // Simulating assigning a PM when moving out of intake
              onAssignPM(item.id, "Sarah Jenkins", "SJ", "#10b981");
            }
          }}
        >
          <option value="intake">INTAKE</option>
          <option value="initiation">INITIATION</option>
        </select>
        
        <span className={`priority-icon priority-${item.priority.toLowerCase()}`} title={item.priority}>
          {item.priority === 'Critical' && '↑↑'}
          {item.priority === 'High' && '↑'}
          {item.priority === 'Medium' && '='}
          {item.priority === 'Low' && '↓'}
        </span>
        
        <div 
          className="user-avatar mini unassigned" 
          title="Click to Assign PM"
          onClick={() => onAssignPM(item.id, "Jane Doe", "JD", "#ec4899")}
        >
          ?
        </div>
      </div>
    </div>
  );

  return (
    <div className="pool-container">
      <div className="pool-actions-bar">
        <div className="search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search backlog..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="create-btn" onClick={() => setIsModalOpen(true)}>
          Create New
        </button>
      </div>

      <div className="pool-content">
        {/* Active Projects Accordion */}
        <div className="pool-accordion">
          <div className="pool-accordion-header" onClick={() => setActiveExpanded(!activeExpanded)}>
            <svg className={`chevron ${activeExpanded ? 'expanded' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
            <h3>Active Projects <span className="item-count">({activeProjectsList.length} work items)</span></h3>
          </div>
          {activeExpanded && (
            <div className="pool-accordion-body">
              {activeProjectsList.length > 0 ? (
                activeProjectsList.map(renderActiveRow)
              ) : (
                <div className="empty-row">No active projects found.</div>
              )}
            </div>
          )}
        </div>

        {/* Intake Queue Accordion */}
        <div className="pool-accordion">
          <div className="pool-accordion-header" onClick={() => setIntakeExpanded(!intakeExpanded)}>
            <svg className={`chevron ${intakeExpanded ? 'expanded' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
            <h3>Intake Queue <span className="item-count">({filteredIntake.length} work items)</span></h3>
          </div>
          {intakeExpanded && (
            <div className="pool-accordion-body">
              {filteredIntake.length > 0 ? (
                filteredIntake.map(renderIntakeRow)
              ) : (
                <div className="empty-row">No new requests in the queue.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>Create New Project Request</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Project Name</label>
                  <input type="text" required value={newReq.title} onChange={e => setNewReq({...newReq, title: e.target.value})} placeholder="e.g. Rajiv Gandhi Arts..." />
                </div>
                <div className="form-group flex-1">
                  <label>Epic / Category</label>
                  <select value={newReq.epic} onChange={e => setNewReq({...newReq, epic: e.target.value})}>
                    <option value="Web Development">Web Development</option>
                    <option value="Backend">Backend</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Person</label>
                  <input type="text" required value={newReq.contactPerson} onChange={e => setNewReq({...newReq, contactPerson: e.target.value})} placeholder="Name" />
                </div>
                <div className="form-group">
                  <label>Role / Designation</label>
                  <input type="text" value={newReq.role} onChange={e => setNewReq({...newReq, role: e.target.value})} placeholder="e.g. IQAC Co-Ordinator" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="text" value={newReq.contactNumber} onChange={e => setNewReq({...newReq, contactNumber: e.target.value})} placeholder="Phone number" />
                </div>
                <div className="form-group">
                  <label>Email ID</label>
                  <input type="email" value={newReq.email} onChange={e => setNewReq({...newReq, email: e.target.value})} placeholder="Email address" />
                </div>
              </div>

              <div className="form-group">
                <label>Scope & Features</label>
                <textarea 
                  required 
                  rows="6" 
                  value={newReq.scope} 
                  onChange={e => setNewReq({...newReq, scope: e.target.value})} 
                  placeholder="Paste features from email here (Hosting plan, pages, modules...)"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add to Pool</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
