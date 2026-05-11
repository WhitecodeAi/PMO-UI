import React, { useState } from 'react';

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

export default function ProjectPool({ projects = {}, lanes = [], intakeRequests = [], onAssignPM, onUpdatePM, onCreateRequest, onStatusChange, onCardClick, role }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeExpanded, setActiveExpanded] = useState(true);
  const [intakeExpanded, setIntakeExpanded] = useState(true);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [modalTab, setModalTab] = useState('details');
  const [scopeExpanded, setScopeExpanded] = useState(false);
  const [clientExpanded, setClientExpanded] = useState(true);
  
  const PM_USERS = [
    { name: "Unassigned", initials: "?", color: "#dfe1e6", isUnassigned: true },
    { name: "Shruti Jog", initials: "SJ", color: "#0052cc" },
    { name: "Dharmaraj Pandhare", initials: "DP", color: "#ff5630" },
    { name: "Aditya", initials: "A", color: "#0052cc" },
    { name: "Ganesh Samgir", initials: "GS", color: "#546a7b" },
    { name: "AvaniKaneriya", initials: "A", color: "#36b37e" },
    { name: "Jaydeep", initials: "JK", color: "#ff5630" }
  ];
  
  const [newReq, setNewReq] = useState({ 
    title: '', 
    epic: 'Web Development', 
    priority: 'Medium',
    contactPerson: '',
    role: '',
    contactNumber: '',
    email: '',
    existingWebsite: '',
    hostingPlan: '',
    supportHrs: '',
    pages: '',
    features: [],
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

  const calculateNextId = () => {
    const allIds = [
      ...Object.keys(projects),
      ...intakeRequests.map(r => r.id)
    ];
    let maxNum = 0;
    allIds.forEach(id => {
      const match = id.match(/WC(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `WC${(maxNum + 1).toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: calculateNextId(),
      title: newReq.title,
      epic: newReq.epic,
      requester: newReq.contactPerson,
      priority: newReq.priority,
      date: new Date().toISOString().split('T')[0],
      details: {
        role: newReq.role,
        contactNumber: newReq.contactNumber,
        email: newReq.email,
        existingWebsite: newReq.existingWebsite,
        hostingPlan: newReq.hostingPlan,
        supportHrs: newReq.supportHrs,
        pages: newReq.pages,
        features: newReq.features,
        scope: newReq.scope
      }
    };
    onCreateRequest(newRequest);
    setIsModalOpen(false);
    setNewReq({ 
      title: '', epic: 'Web Development', priority: 'Medium',
      contactPerson: '', role: '', contactNumber: '', email: '', 
      existingWebsite: '', hostingPlan: '', supportHrs: '', pages: '', features: [], scope: ''
    });
  };

  const handlePMSelect = (projectId, user, isIntake) => {
    if (isIntake) {
      if (!user.isUnassigned) {
        onAssignPM(projectId, 'initiation', user.name, user.initials, user.color);
      }
    } else {
      if (!user.isUnassigned && onUpdatePM) {
        onUpdatePM(projectId, user.name, user.initials, user.color);
      }
    }
    setDropdownOpenId(null);
  };

  const renderActiveRow = (project) => (
    <div className="pool-row" key={project.id}>
      <div className="pool-row-left" onClick={() => onCardClick && onCardClick(project)} style={{ cursor: 'pointer' }}>
        <span className="pool-id">{project.id.toUpperCase()}</span>
        <span className="pool-title">{project.title}</span>
      </div>
      <div className="pool-row-right">
        {role === 'business' ? (
          <>
            <span className="status-badge" style={{ padding: '4px 8px', background: '#f1f5f9', color: '#475569', borderRadius: '4px', fontSize: '12px', fontWeight: '500', minWidth: '100px', textAlign: 'center' }}>
              {project.phaseName}
            </span>
            <div className="avatar-dropdown-container">
              <div 
                className="user-avatar mini" 
                style={{ backgroundColor: project.owner?.color || '#475569', cursor: 'default' }} 
                title={project.owner?.name}
              >
                {project.owner?.initials || '?'}
              </div>
            </div>
          </>
        ) : (
          <>
            <select 
              className="status-dropdown" 
              value={project.phase}
              onChange={(e) => onStatusChange(project.id, e.target.value)}
            >
              {lanes.map(lane => (
                <option key={lane.id} value={lane.id}>{lane.name}</option>
              ))}
            </select>
            <div className="avatar-dropdown-container">
              <div 
                className="user-avatar mini" 
                style={{ backgroundColor: project.owner?.color || '#475569' }} 
                title={project.owner?.name}
                onClick={() => setDropdownOpenId(dropdownOpenId === project.id ? null : project.id)}
              >
                {project.owner?.initials || '?'}
              </div>
              {dropdownOpenId === project.id && (
                <div className="pm-dropdown-menu">
                  {PM_USERS.map((u, i) => (
                    <div key={i} className="pm-dropdown-item" onClick={() => handlePMSelect(project.id, u, false)}>
                      <div className={`user-avatar mini ${u.isUnassigned ? 'unassigned' : ''}`} style={{ backgroundColor: u.isUnassigned ? '' : u.color }}>
                        {u.initials}
                      </div>
                      <span>{u.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderIntakeRow = (item) => (
    <div className="pool-row" key={item.id}>
      <div className="pool-row-left" onClick={() => onCardClick && onCardClick(item)} style={{ cursor: 'pointer' }}>
        <span className="pool-id">{item.id}</span>
        <span className="pool-title">{item.title}</span>
      </div>
      <div className="pool-row-right">
        {role === 'business' ? (
          <span className="status-badge" style={{ padding: '4px 8px', background: '#f1f5f9', color: '#475569', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>New Project</span>
        ) : (
          <>
            <select 
              className="status-dropdown" 
              value="intake"
              onChange={(e) => {
                if(e.target.value !== 'intake') {
                  onAssignPM(item.id, e.target.value, "Jane Doe", "JD", "#6d597a");
                }
              }}
            >
              <option value="intake">New Project</option>
              {lanes.map(lane => (
                <option key={lane.id} value={lane.id}>{lane.name}</option>
              ))}
            </select>
            
            <div className="avatar-dropdown-container">
              <div 
                className="user-avatar mini unassigned" 
                title="Click to Assign PM"
                onClick={() => setDropdownOpenId(dropdownOpenId === item.id ? null : item.id)}
              >
                ?
              </div>
              {dropdownOpenId === item.id && (
                <div className="pm-dropdown-menu">
                  {PM_USERS.map((u, i) => (
                    <div key={i} className="pm-dropdown-item" onClick={() => handlePMSelect(item.id, u, true)}>
                      <div className={`user-avatar mini ${u.isUnassigned ? 'unassigned' : ''}`} style={{ backgroundColor: u.isUnassigned ? '' : u.color }}>
                        {u.initials}
                      </div>
                      <span>{u.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const activeAccordion = (
    <div className="pool-accordion" key="active">
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
  );

  const intakeAccordion = (
    <div className="pool-accordion" key="intake">
      <div className="pool-accordion-header" onClick={() => setIntakeExpanded(!intakeExpanded)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg className={`chevron ${intakeExpanded ? 'expanded' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <h3>{role === 'business' ? 'New Projects' : 'Intake Queue'} <span className="item-count">({filteredIntake.length} work items)</span></h3>
        </div>
        {role === 'business' && (
          <button 
            className="create-btn" 
            style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '13px' }}
            onClick={(e) => {
              e.stopPropagation();
              setScopeExpanded(false);
              setClientExpanded(true);
              setIsModalOpen(true);
            }}
          >
            Create New
          </button>
        )}
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
      </div>

      <div className="pool-content">
        {role === 'business' ? (
          <>
            {intakeAccordion}
            {activeAccordion}
          </>
        ) : (
          <>
            {activeAccordion}
            {intakeAccordion}
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>Add New Project</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-body-scroll">
              <div className="form-group">
                <label>Project Name</label>
                <input type="text" required value={newReq.title} onChange={e => setNewReq({...newReq, title: e.target.value})} placeholder="e.g. Rajiv Gandhi Arts..." />
              </div>

              <div className="form-panel">
                <div 
                  className="form-panel-header" 
                  onClick={() => setClientExpanded(!clientExpanded)}
                >
                  <svg className={`chevron ${clientExpanded ? 'expanded' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s', transform: clientExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  Important Details
                </div>

                {clientExpanded && (
                  <div className="form-panel-content">
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
                      <div className="form-group flex-2">
                        <label>Existing Website</label>
                        <input type="text" value={newReq.existingWebsite} onChange={e => setNewReq({...newReq, existingWebsite: e.target.value})} placeholder="e.g. not have, or www.example.com" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-panel">
                <div 
                  className="form-panel-header" 
                  onClick={() => setScopeExpanded(!scopeExpanded)}
                >
                  <svg className={`chevron ${scopeExpanded ? 'expanded' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s', transform: scopeExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  Scope & Features
                </div>
                
                {scopeExpanded && (
                  <div className="form-panel-content">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Hosting Plan</label>
                        <input type="text" value={newReq.hostingPlan} onChange={e => setNewReq({...newReq, hostingPlan: e.target.value})} placeholder="e.g. 10 GB" />
                      </div>
                      <div className="form-group">
                        <label>Support Hrs</label>
                        <input type="text" value={newReq.supportHrs} onChange={e => setNewReq({...newReq, supportHrs: e.target.value})} placeholder="e.g. 20" />
                      </div>
                      <div className="form-group">
                        <label>Pages</label>
                        <input type="text" value={newReq.pages} onChange={e => setNewReq({...newReq, pages: e.target.value})} placeholder="e.g. 50" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Scope & Features</label>
                      <div className="features-grid">
                        {FEATURE_OPTIONS.map(feat => (
                          <label key={feat} className="feature-checkbox">
                            <input 
                              type="checkbox" 
                              checked={newReq.features.includes(feat)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewReq({...newReq, features: [...newReq.features, feat]});
                                } else {
                                  setNewReq({...newReq, features: newReq.features.filter(f => f !== feat)});
                                }
                              }}
                            />
                            <span>{feat}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Other Comments / Requirements</label>
                      <textarea 
                        rows="3" 
                        value={newReq.scope} 
                        onChange={e => setNewReq({...newReq, scope: e.target.value})} 
                        placeholder="Any additional requirements or custom features..."
                      />
                    </div>
                  </div>
                )}
              </div>
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
