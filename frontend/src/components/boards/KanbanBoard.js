// full code ok  .

// import React, { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { FiUpload } from 'react-icons/fi'; // Add this line

// const mockIssues = [
//   {
//     id: 'i1',
//     epic: 'p1',
//     epicName: 'Frontend',
//     status: 'todo',
//     type: 'Task',
//     title: 'Setup repo',
//     assignee: 'John Doe',
//     storyPoints: 3,
//     labels: [],
//     dueDate: '2025-09-30',
//     reporter: 'admin',
//     priority: 'High',
//     startDate: '2025-09-15',
//     description: 'Setup the initial repository structure and configuration',
//     subtasks: [
//       { id: 'st1', title: 'Create GitHub repository', completed: true },
//       { id: 'st2', title: 'Setup CI/CD pipeline', completed: false },
//       { id: 'st3', title: 'Configure linting and formatting', completed: false }
//     ],
//     comments: 'Initial setup required for the project'
//   },
//   {
//     id: 'i3',
//     epic: 'p2',
//     epicName: 'Middleware',
//     status: 'todo',
//     type: 'Subtask',
//     title: 'API integration',
//     assignee: 'Jane Smith',
//     storyPoints: 2,
//     labels: [],
//     dueDate: '',
//     reporter: 'lead-dev',
//     priority: 'Low',
//     startDate: '2025-09-18',
//     description: 'Integrate with external API services',
//     subtasks: [
//       { id: 'st4', title: 'Design API endpoints', completed: true },
//       { id: 'st5', title: 'Implement authentication', completed: false }
//     ],
//     comments: ''
//   }
// ];

// const defaultStatuses = ['backlog', 'todo', 'analysis', 'inprogress', 'blocked', 'code review', 'qa', 'milestone', 'done'];
// const mockEpics = [{ id: 'p1', name: 'Frontend' }, { id: 'p2', name: 'Middleware' }];
// const mockProjects = [
//   { id: 'p1', name: 'E-Commerce Platform' },
//   { id: 'p2', name: 'API Gateway Service' },
//   { id: 'p3', name: 'Mobile App Development' }
// ];

// const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 200));

// const listIssues = async (projectId) => {
//   await simulateApiDelay();
//   return mockIssues.filter(i => !projectId || i.epic === projectId || i.projectId === projectId);
// };
// const listEpics = async () => { await simulateApiDelay(); return mockEpics; };
// const getProjectName = async (projectId) => {
//   await simulateApiDelay();
//   const project = mockProjects.find(p => p.id === projectId);
//   return project ? project.name : 'Untitled Project';
// };
// const createEpicAPI = async (epicName) => {
//   await simulateApiDelay();
//   const newEpic = { id: 'p' + (mockEpics.length + 1), name: epicName };
//   mockEpics.push(newEpic);
//   return newEpic;
// };
// const deleteEpicAPI = async (epicId) => {
//   await simulateApiDelay();
//   const epicIndex = mockEpics.findIndex(epic => epic.id === epicId);
//   if (epicIndex > -1) mockEpics.splice(epicIndex, 1);
//   const issueIndices = [];
//   mockIssues.forEach((issue, index) => { if (issue.epic === epicId) issueIndices.push(index); });
//   issueIndices.sort((a, b) => b - a).forEach(index => { mockIssues.splice(index, 1); });
// };
// const moveIssue = async (issueId, status) => {
//   await simulateApiDelay();
//   const issue = mockIssues.find(i => i.id === issueId);
//   if (!issue) throw new Error('Issue not found');
//   issue.status = status;
// };
// const createIssueAPI = async (issue) => { await simulateApiDelay(); mockIssues.push(issue); };
// const deleteIssueAPI = async (issueId) => { await simulateApiDelay(); const idx = mockIssues.findIndex(i => i.id === issueId); if (idx > -1) mockIssues.splice(idx, 1); };
// const updateIssueAPI = async (updatedIssue) => {
//   await simulateApiDelay();
//   const idx = mockIssues.findIndex(i => i.id === updatedIssue.id);
//   if (idx > -1) mockIssues[idx] = { ...mockIssues[idx], ...updatedIssue };
// };

// const getSwimlanes = (issues, epics) =>
//   epics.map(epic => {
//     const epicIssues = issues.filter(i => (i.epic || i.projectId) === epic.id);
//     return { id: epic.id, title: epic.name, issues: epicIssues };
//   });

// export default function KanbanBoard() {
//   const { projectId } = useParams();
//   const [issues, setIssues] = useState([]);
//   const [epics, setEpics] = useState([]);
//   const [projectName, setProjectName] = useState('');
//   const [openSwimlanes, setOpenSwimlanes] = useState({});
//   const [customTitles, setCustomTitles] = useState({});
//   const [createLaneId, setCreateLaneId] = useState(null);
//   const [newTaskText, setNewTaskText] = useState('');
//   const [newTaskType, setNewTaskType] = useState('Task');
//   const [selectedIssue, setSelectedIssue] = useState(null);
//   const [editIssue, setEditIssue] = useState(null);
//   const [showCreateEpic, setShowCreateEpic] = useState(false);
//   const [showDeleteEpic, setShowDeleteEpic] = useState(false);
//   const [newEpicName, setNewEpicName] = useState('');
//   const [epicToDelete, setEpicToDelete] = useState('');
//   const [columnsByLane, setColumnsByLane] = useState({});
//   const [columnModal, setColumnModal] = useState(null);
//   const [columnInput, setColumnInput] = useState('');
//   const [hoveredAssigneeId, setHoveredAssigneeId] = useState(null);
//   const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
//   const [isMobile, setIsMobile] = useState(false);
//   const [activeSwimlane, setActiveSwimlane] = useState(null);

//   // State to store selected profile file
//   const [profileFile, setProfileFile] = useState(null);

//   // Handler for file input changes
//   const handleNewUserChange = (event) => {
//     const file = event.target.files[0];
//     setProfileFile(file);
//   };

//   // Draggable modal state
//   const [modalDrag, setModalDrag] = useState({
//     isDragging: false,
//     position: { x: 0, y: 0 },
//     startPosition: { x: 0, y: 0 }
//   });
//   const modalRef = useRef(null);

//   // Subtask management
//   const [newSubtaskText, setNewSubtaskText] = useState('');

//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const projectNameData = projectId ? await getProjectName(projectId) : 'All Projects';
//         const [issuesData, epicsData] = await Promise.all([
//           listIssues(projectId),
//           listEpics()
//         ]);
//         setIssues(issuesData);
//         setEpics(epicsData);
//         setProjectName(projectNameData);
//         const lanes = getSwimlanes(issuesData, epicsData);
//         const initialOpen = {}, initialTitles = {}, initialCols = {};
//         lanes.forEach(lane => {
//           initialOpen[lane.id] = true;
//           initialTitles[lane.id] = lane.title;
//           initialCols[lane.id] = defaultStatuses.slice();
//         });
//         setOpenSwimlanes(initialOpen);
//         setCustomTitles(initialTitles);
//         setColumnsByLane(initialCols);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchData();
//   }, [projectId]);

//   // Subtask functions
//   const addSubtask = () => {
//     if (!newSubtaskText.trim()) return;

//     const newSubtask = {
//       id: `st${Date.now()}`,
//       title: newSubtaskText.trim(),
//       completed: false
//     };

//     setEditIssue(prev => ({
//       ...prev,
//       subtasks: [...(prev.subtasks || []), newSubtask]
//     }));

//     setNewSubtaskText('');
//   };

//   const toggleSubtask = (subtaskId) => {
//     setEditIssue(prev => ({
//       ...prev,
//       subtasks: prev.subtasks.map(subtask =>
//         subtask.id === subtaskId
//           ? { ...subtask, completed: !subtask.completed }
//           : subtask
//       )
//     }));
//   };

//   const deleteSubtask = (subtaskId) => {
//     setEditIssue(prev => ({
//       ...prev,
//       subtasks: prev.subtasks.filter(subtask => subtask.id !== subtaskId)
//     }));
//   };

//   const handleSubtaskKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       addSubtask();
//     }
//   };

//   // Draggable modal functions
//   const handleModalMouseDown = (e) => {
//     if (isMobile) return; // Disable dragging on mobile

//     // Only start dragging if clicking on the header (not on buttons or inputs)
//     if (e.target.closest('.modal-close-btn') ||
//       e.target.closest('input') ||
//       e.target.closest('select') ||
//       e.target.closest('textarea') ||
//       e.target.closest('button') ||
//       e.target.closest('.subtask-item')) {
//       return;
//     }

//     setModalDrag({
//       isDragging: true,
//       position: modalDrag.position,
//       startPosition: {
//         x: e.clientX - modalDrag.position.x,
//         y: e.clientY - modalDrag.position.y
//       }
//     });
//   };

//   const handleModalMouseMove = (e) => {
//     if (!modalDrag.isDragging || isMobile) return;

//     const newX = e.clientX - modalDrag.startPosition.x;
//     const newY = e.clientY - modalDrag.startPosition.y;

//     setModalDrag(prev => ({
//       ...prev,
//       position: { x: newX, y: newY }
//     }));
//   };

//   const handleModalMouseUp = () => {
//     if (isMobile) return;
//     setModalDrag(prev => ({ ...prev, isDragging: false }));
//   };

//   // Reset modal position when closed
//   useEffect(() => {
//     if (!selectedIssue) {
//       setModalDrag({
//         isDragging: false,
//         position: { x: 0, y: 0 },
//         startPosition: { x: 0, y: 0 }
//       });
//     }
//   }, [selectedIssue]);

//   // Add event listeners for dragging
//   useEffect(() => {
//     if (modalDrag.isDragging) {
//       document.addEventListener('mousemove', handleModalMouseMove);
//       document.addEventListener('mouseup', handleModalMouseUp);
//       document.body.style.cursor = 'grabbing';
//       document.body.style.userSelect = 'none';
//     } else {
//       document.removeEventListener('mousemove', handleModalMouseMove);
//       document.removeEventListener('mouseup', handleModalMouseUp);
//       document.body.style.cursor = '';
//       document.body.style.userSelect = '';
//     }

//     return () => {
//       document.removeEventListener('mousemove', handleModalMouseMove);
//       document.removeEventListener('mouseup', handleModalMouseUp);
//       document.body.style.cursor = '';
//       document.body.style.userSelect = '';
//     };
//   }, [modalDrag.isDragging]);

//   const openAddColumnModal = (e, laneId, colIndex) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setModalPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
//     setColumnModal({ laneId, colIndex, type: 'add' });
//     setColumnInput('');
//   };
//   const openEditColumnModal = (e, laneId, colIndex, status) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setModalPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
//     setColumnModal({ laneId, colIndex, type: 'menu' });
//     setColumnInput(status);
//   };
//   const handleAddColumn = () => {
//     const name = columnInput.trim();
//     if (!name) return alert('Column name is required');
//     setColumnsByLane(prev => {
//       const cols = [...prev[columnModal.laneId]];
//       if (cols.includes(name.toLowerCase())) alert('Column name already exists');
//       else cols.splice(columnModal.colIndex + 1, 0, name.toLowerCase());
//       return { ...prev, [columnModal.laneId]: cols };
//     });
//     setColumnModal(null);
//     setColumnInput('');
//   };
//   const handleEditColumn = () => {
//     const name = columnInput.trim();
//     if (!name) return alert('Column name is required');
//     const { laneId, colIndex } = columnModal;
//     const oldCol = columnsByLane[laneId][colIndex];
//     if (columnsByLane[laneId].includes(name.toLowerCase()) && name.toLowerCase() !== oldCol) {
//       alert('Column name already exists');
//       return;
//     }
//     setColumnsByLane(prev => {
//       const cols = [...prev[laneId]];
//       cols[colIndex] = name.toLowerCase();
//       return { ...prev, [laneId]: cols };
//     });
//     const updatedIssues = issues.map(issue =>
//       (issue.epic || issue.projectId) === laneId && issue.status === oldCol ? { ...issue, status: name.toLowerCase() } : issue
//     );
//     setIssues(updatedIssues);
//     setColumnModal(null);
//     setColumnInput('');
//   };
//   const handleDeleteColumn = () => {
//     const { laneId, colIndex } = columnModal;
//     const removedCol = columnsByLane[laneId][colIndex];
//     setColumnsByLane(prev => {
//       const cols = [...prev[laneId]];
//       cols.splice(colIndex, 1);
//       return { ...prev, [laneId]: cols };
//     });
//     const updatedIssues = issues.map(issue =>
//       (issue.epic || issue.projectId) === laneId && issue.status === removedCol ? { ...issue, status: 'backlog' } : issue
//     );
//     setIssues(updatedIssues);
//     setColumnModal(null);
//     setColumnInput('');
//   };
//   const toggleSwimlane = (id) => setOpenSwimlanes(prev => ({ ...prev, [id]: !prev[id] }));
//   const byStatus = (collection, status) => collection.filter(i => i.status === status);

//   const onDragStart = (e, issueId) => e.dataTransfer.setData('text/plain', issueId);
//   const onDrop = async (e, targetStatus, swimlaneId) => {
//     e.preventDefault();
//     try {
//       const issueId = e.dataTransfer.getData('text/plain');
//       const issue = issues.find(i => i.id === issueId);
//       const srcLaneId = issue.epic || issue.projectId;
//       if (srcLaneId === swimlaneId && issue.status !== targetStatus) {
//         await moveIssue(issueId, targetStatus);
//         const refreshed = await listIssues(projectId);
//         setIssues(refreshed);
//       }
//     } catch (err) { console.error(err); }
//   };
//   const onDragOver = e => e.preventDefault();

//   const handleCreateClick = laneId => { setCreateLaneId(laneId); setNewTaskText(''); setNewTaskType('Task'); };
//   const handleCreateSubmit = async lane => {
//     if (!newTaskText.trim()) { alert('Task title is required'); return; }
//     const newIssue = {
//       id: Math.random().toString(36).slice(2),
//       epic: lane.id,
//       projectId: lane.id,
//       epicName: lane.title,
//       title: newTaskText,
//       status: 'backlog',
//       assignee: '',
//       type: newTaskType,
//       storyPoints: '',
//       labels: [],
//       dueDate: '',
//       reporter: 'system',
//       priority: 'Medium',
//       startDate: new Date().toISOString().split('T')[0],
//       description: '',
//       subtasks: [],
//       comments: ''
//     };
//     try {
//       await createIssueAPI(newIssue);
//       const refreshed = await listIssues(projectId);
//       setIssues(refreshed);
//       setCreateLaneId(null);
//     } catch (err) { console.error(err); }
//   };

//   const handleOpenModal = (issue) => {
//     setSelectedIssue(issue);
//     setEditIssue({ ...issue });
//     setNewSubtaskText('');
//     // Reset position when opening new modal
//     setModalDrag({
//       isDragging: false,
//       position: { x: 0, y: 0 },
//       startPosition: { x: 0, y: 0 }
//     });
//   };
//   const handleUpdateField = (field, value) => { setEditIssue(prev => ({ ...prev, [field]: value })); };
//   const handleSave = async () => {
//     await updateIssueAPI(editIssue);
//     const refreshed = await listIssues(projectId);
//     setIssues(refreshed);
//     setSelectedIssue(null);
//     setEditIssue(null);
//   };
//   const handleReset = () => { setEditIssue({ ...selectedIssue }); };

//   const handleCreateEpic = async () => {
//     if (!newEpicName.trim()) {
//       alert('Epic name is required');
//       return;
//     }
//     try {
//       await createEpicAPI(newEpicName);
//       const updatedEpics = await listEpics();
//       setEpics(updatedEpics);
//       setNewEpicName('');
//       setShowCreateEpic(false);
//       const newEpic = updatedEpics[updatedEpics.length - 1];
//       setOpenSwimlanes(prev => ({ ...prev, [newEpic.id]: true }));
//       setCustomTitles(prev => ({ ...prev, [newEpic.id]: newEpic.name }));
//       setColumnsByLane(prev => ({ ...prev, [newEpic.id]: defaultStatuses.slice() }));
//     } catch (error) {
//       console.error('Error creating epic:', error);
//     }
//   };

//   const handleDeleteEpic = async () => {
//     if (!epicToDelete) {
//       alert('Please select an epic to delete');
//       return;
//     }
//     if (!window.confirm(`Are you sure you want to delete the epic "${epics.find(e => e.id === epicToDelete)?.name}"? This will also delete all issues in this epic.`)) {
//       return;
//     }
//     try {
//       await deleteEpicAPI(epicToDelete);
//       const [refreshedIssues, refreshedEpics] = await Promise.all([
//         listIssues(projectId),
//         listEpics()
//       ]);
//       setIssues(refreshedIssues);
//       setEpics(refreshedEpics);
//       setEpicToDelete('');
//       setShowDeleteEpic(false);
//       setColumnsByLane(prev => {
//         const copy = { ...prev };
//         delete copy[epicToDelete];
//         return copy;
//       });
//       setOpenSwimlanes(prev => {
//         const copy = { ...prev };
//         delete copy[epicToDelete];
//         return copy;
//       });
//       setCustomTitles(prev => {
//         const copy = { ...prev };
//         delete copy[epicToDelete];
//         return copy;
//       });
//     } catch (error) {
//       console.error('Error deleting epic:', error);
//     }
//   };

//   const toggleMobileSwimlane = (laneId) => {
//     if (activeSwimlane === laneId) {
//       setActiveSwimlane(null);
//     } else {
//       setActiveSwimlane(laneId);
//     }
//   };

//   const swimlanes = getSwimlanes(issues, epics);

//   // Calculate subtask progress
//   const getSubtaskProgress = (subtasks) => {
//     if (!subtasks || subtasks.length === 0) return { completed: 0, total: 0, percentage: 0 };
//     const completed = subtasks.filter(st => st.completed).length;
//     const total = subtasks.length;
//     const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
//     return { completed, total, percentage };
//   };

//   return (
//     <div
//       className="board-wrap"
//       style={{
//         margin: 0,
//         padding: 0,
//         maxWidth: '100vw',
//         minHeight: '100vh',
//         background: '#19a0f7', // makes Kanban flush with browser edge
//         overflowX: 'auto'
//       }}
//     >
//       {/* Project Name Header */}
//       <div
//         className="project-header"
//         style={{
//           background: '#dbeafe',
//           borderRadius: 8,
//           padding: '20px 0px', // zero left/right
//           margin: 0,
//           marginBottom: 20,
//         }}
//       >
//         <h1 className="project-title">{projectName}</h1>
//         <div className="project-stats">
//           <span className="project-stat">{epics.length} Epics</span>
//           <span className="project-stat">{issues.length} Issues</span>
//           <span className="project-stat">
//             {issues.filter(issue => issue.status === 'done').length} Completed
//           </span>
//         </div>
//       </div>

//       {isMobile && (
//         <div className="mobile-swimlane-selector">
//           <select
//             value={activeSwimlane || ''}
//             onChange={(e) => setActiveSwimlane(e.target.value || null)}
//             className="mobile-select"
//           >
//             <option value="">All Swimlanes</option>
//             {swimlanes.map(lane => (
//               <option key={lane.id} value={lane.id}>{customTitles[lane.id] || lane.title}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       {swimlanes.map(lane => {
//         const isOpen = isMobile ? (activeSwimlane === null || activeSwimlane === lane.id) : openSwimlanes[lane.id];
//         const statuses = columnsByLane[lane.id] || defaultStatuses;

//         if (isMobile && activeSwimlane && activeSwimlane !== lane.id) {
//           return null;
//         }

//         return (
//           <section className="swimlane" key={lane.id}>
//             <header className="swimlane-header">
//               {!isMobile && (
//                 <button className="swimlane-toggle" onClick={() => toggleSwimlane(lane.id)}>
//                   {isOpen ? '▼' : '▶'}
//                 </button>
//               )}
//               <span className="swimlane-icon">⚡</span>
//               <input
//                 className="swimlane-title-input"
//                 value={customTitles[lane.id] || ''}
//                 onChange={e => setCustomTitles(prev => ({ ...prev, [lane.id]: e.target.value }))}
//               />
//               <span className="swimlane-count">{lane.issues.length} work items</span>
//               {isMobile && (
//                 <button
//                   className="mobile-swimlane-toggle"
//                   onClick={() => toggleMobileSwimlane(lane.id)}
//                 >
//                   {activeSwimlane === lane.id ? '▲' : '▼'}
//                 </button>
//               )}
//             </header>
//             {isOpen && (
//               <div className={`kanban-row ${isMobile ? 'mobile-view' : ''}`}>
//                 {statuses.map((status, idx) => {
//                   const issuesForStatus = byStatus(lane.issues, status);
//                   return (
//                     <div
//                       className={`kanban-column ${isMobile ? 'mobile-column' : ''}`}
//                       key={status}
//                       onDragOver={onDragOver}
//                       onDrop={e => onDrop(e, status, lane.id)}
//                     >
//                       <div className="col-header">
//                         <span className="col-title">{status.toUpperCase()}</span>
//                         {!isMobile && (
//                           <span className="col-icons">
//                             <button className="col-icon" title="Add Column" onClick={e => openAddColumnModal(e, lane.id, idx)}>＋</button>
//                             <button className="col-icon" title="Edit/Delete Column" onClick={e => openEditColumnModal(e, lane.id, idx, status)}>⋮</button>
//                           </span>
//                         )}
//                         {issuesForStatus.length > 0 && <span className="col-count">{issuesForStatus.length}</span>}
//                       </div>
//                       <div className="col-create">
//                         {status === 'backlog' && (
//                           createLaneId === lane.id ? (
//                             <div className="create-card">
//                               <textarea rows={2} className="create-input" placeholder="What needs to be done?" value={newTaskText} onChange={e => setNewTaskText(e.target.value)} />
//                               <div className="create-actions">
//                                 <select value={newTaskType} onChange={e => setNewTaskType(e.target.value)} className="create-select">
//                                   <option>Task</option><option>Subtask</option><option>Bug</option>
//                                 </select>
//                                 <button className="create-btn" onClick={() => handleCreateSubmit(lane)}>✔</button>
//                                 <button className="create-btn" onClick={() => setCreateLaneId(null)}>✖</button>
//                               </div>
//                             </div>
//                           ) : (<span className="create-link" onClick={() => handleCreateClick(lane.id)}>+ Create</span>)
//                         )}
//                       </div>
//                       {issuesForStatus.map(issue => {
//                         const isHovered = hoveredAssigneeId === issue.id;
//                         return (
//                           <div className="card-item" key={issue.id} draggable onDragStart={e => onDragStart(e, issue.id)} onClick={() => handleOpenModal(issue)}>
//                             <div className="card-top">
//                               <span className={`card-tag card-tag-${issue.type.toLowerCase()}`}>{issue.type}</span>
//                               <span className="card-id">{issue.id}</span>
//                             </div>
//                             <div className="card-title">{issue.title}</div>
//                             <div className="card-meta">
//                               {issue.assignee && (
//                                 <span className="card-assignee" onMouseEnter={() => setHoveredAssigneeId(issue.id)} onMouseLeave={() => setHoveredAssigneeId(null)}>
//                                   👤 {issue.assignee}
//                                 </span>
//                               )}
//                               {issue.dueDate && <span className="card-due">📅 {issue.dueDate}</span>}
//                               <span className={`card-priority ${issue.priority.toLowerCase()}`}>⚑ {issue.priority}</span>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </section>
//         );
//       })}
//       {/* Column Add/Edit modal */}
//       {columnModal && (columnModal.type === 'add' || columnModal.type === 'menu') && (
//         <div className="epic-modal-overlay" onClick={() => setColumnModal(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
//           <div className="epic-modal" onClick={e => e.stopPropagation()} style={{
//             position: isMobile ? 'fixed' : 'absolute',
//             top: isMobile ? '50%' : modalPosition.top,
//             left: isMobile ? '50%' : modalPosition.left,
//             transform: isMobile ? 'translate(-50%, -50%)' : 'translateX(-50%)',
//             minWidth: isMobile ? '90vw' : 280,
//             maxWidth: isMobile ? '95vw' : 320,
//             padding: 20,
//             borderRadius: 10,
//             background: 'white',
//             boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
//             zIndex: 1100
//           }}>
//             {columnModal.type === 'add' ? (
//               <>
//                 <h3 style={{ marginBottom: 15, fontWeight: 600, fontSize: 20, color: '#172b4d' }}>Add Column</h3>
//                 <input value={columnInput} onChange={e => setColumnInput(e.target.value)} placeholder="Column name" autoFocus className="epic-modal-input" style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 6, border: '1px solid #dfe1e5', marginBottom: 20, boxSizing: 'border-box' }} />
//                 <div className="epic-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
//                   <button className="btn-cancel" onClick={() => setColumnModal(null)} style={btnStyle.cancel}>Cancel</button>
//                   <button className="btn-create" onClick={handleAddColumn} style={btnStyle.create}>Add</button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <h3 style={{ marginBottom: 15, fontWeight: 600, fontSize: 20, color: '#172b4d' }}>Edit/Delete Column</h3>
//                 <input value={columnInput} onChange={e => setColumnInput(e.target.value)} placeholder="Column name" autoFocus className="epic-modal-input" style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 6, border: '1px solid #dfe1e5', marginBottom: 20, boxSizing: 'border-box' }} />
//                 <div className="epic-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
//                   <button className="btn-save" onClick={handleEditColumn} style={btnStyle.create}>Rename</button>
//                   <button className="btn-delete" onClick={handleDeleteColumn} style={btnStyle.delete}>Delete</button>
//                   <button className="btn-cancel" onClick={() => setColumnModal(null)} style={btnStyle.cancel}>Cancel</button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//       {/* Issue modal - Centered in the middle of the page */}
//       {selectedIssue && editIssue && (
//         <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
//           <div
//             className={`modal-container ${isMobile ? 'mobile-modal-container' : ''}`}
//             ref={modalRef}
//           >
//             <div
//               className={`modal ${isMobile ? 'mobile-modal' : ''} ${modalDrag.isDragging ? 'modal-dragging' : ''}`}
//               onClick={e => e.stopPropagation()}
//               onMouseDown={handleModalMouseDown}
//               style={
//                 !isMobile && modalDrag.position.x !== 0 && modalDrag.position.y !== 0
//                   ? {
//                     position: 'fixed',
//                     top: modalDrag.position.y,
//                     left: modalDrag.position.x,
//                     transform: 'none'
//                   }
//                   : {}
//               }
//             >
//               <div className="modal-header">
//                 <div className="modal-header-content">
//                   <span className="modal-epic-badge">{editIssue.epicName}</span>
//                   <h2 className="modal-title">{editIssue.title || 'Untitled Issue'}</h2>
//                   <div className="modal-id-type">
//                     <span className="modal-id">{editIssue.id}</span>
//                     <span className={`modal-type modal-type-${editIssue.type.toLowerCase()}`}>{editIssue.type}</span>
//                   </div>
//                 </div>
//                 <button className="modal-close-btn" onClick={() => setSelectedIssue(null)}>✖</button>
//               </div>

//               <div className="modal-content-scroll">
//                 <div className={`modal-content ${isMobile ? 'mobile-modal-content' : ''}`}>
//                   <div className="modal-section">
//                     <h3 className="modal-section-title">Details</h3>
//                     <div className="modal-grid">
//                       <div className="modal-field">
//                         <label className="modal-label">Title</label>
//                         <input
//                           className="modal-input"
//                           value={editIssue.title}
//                           onChange={e => handleUpdateField('title', e.target.value)}
//                           placeholder="Enter issue title"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label className="modal-label">Status</label>
//                         <select
//                           className="modal-select"
//                           value={editIssue.status}
//                           onChange={e => handleUpdateField('status', e.target.value)}
//                         >
//                           {columnsByLane[editIssue.epic]?.map(st => (
//                             <option key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</option>
//                           )) || defaultStatuses.map(st => (
//                             <option key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</option>
//                           ))}
//                         </select>
//                       </div>
//                       <div className="modal-field">
//                         <label className="modal-label">Assignee</label>
//                         <input
//                           className="modal-input"
//                           value={editIssue.assignee}
//                           onChange={e => handleUpdateField('assignee', e.target.value)}
//                           placeholder="Unassigned"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label className="modal-label">Reporter</label>
//                         <input
//                           className="modal-input modal-input-disabled"
//                           disabled
//                           value={editIssue.reporter}
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label className="modal-label">Priority</label>
//                         <select
//                           className="modal-select"
//                           value={editIssue.priority}
//                           onChange={e => handleUpdateField('priority', e.target.value)}
//                         >
//                           <option>Low</option>
//                           <option>Medium</option>
//                           <option>High</option>
//                            <option>Critical</option>

//                         </select>
//                       </div>
//                       <div className="modal-field">
//                         <label className="modal-label">Story Points</label>
//                         <input
//                           className="modal-input"
//                           type="number"
//                           value={editIssue.storyPoints}
//                           onChange={e => handleUpdateField('storyPoints', e.target.value)}
//                           placeholder="0"
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label className="modal-label">Start Date</label>
//                         <input
//                           className="modal-input"
//                           type="date"
//                           value={editIssue.startDate}
//                           onChange={e => handleUpdateField('startDate', e.target.value)}
//                         />
//                       </div>
//                       <div className="modal-field">
//                         <label className="modal-label">Due Date</label>
//                         <input
//                           className="modal-input"
//                           type="date"
//                           value={editIssue.dueDate}
//                           onChange={e => handleUpdateField('dueDate', e.target.value)}
//                         />
//                       </div>
//                       <div className="input-group file-group">
//                         <label className="input-label">Attach File</label>
//                         <label htmlFor="profileFile" className="file-upload-btn">
//                           <FiUpload className="btn-icon" />
//                           {profileFile ? profileFile.name : 'Choose File'}
//                         </label>
//                         <input
//                           id="profileFile"
//                           type="file"
//                           name="profileFile"
//                           onChange={handleNewUserChange}
//                           accept="image/*"
//                           style={{ display: 'none' }}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="modal-section">
//                     <h3 className="modal-section-title">Description</h3>
//                     <div className="modal-field-full">
//                       <textarea
//                         className="modal-textarea"
//                         rows="4"
//                         value={editIssue.description}
//                         onChange={e => handleUpdateField('description', e.target.value)}
//                         placeholder="Add a detailed description..."
//                       />
//                     </div>
//                   </div>

//                   <div className="modal-section">
//                     <h3 className="modal-section-title">Subtasks</h3>
//                     <div className="modal-field-full">
//                       <div className="subtasks-container">
//                         <div className="subtasks-header">
//                           <span className="subtasks-title">
//                             Subtasks ({getSubtaskProgress(editIssue.subtasks).completed}/{getSubtaskProgress(editIssue.subtasks).total})
//                           </span>
//                           {editIssue.subtasks && editIssue.subtasks.length > 0 && (
//                             <div className="subtask-progress-bar">
//                               <div
//                                 className="subtask-progress-fill"
//                                 style={{ width: `${getSubtaskProgress(editIssue.subtasks).percentage}%` }}
//                               ></div>
//                             </div>
//                           )}
//                         </div>

//                         <div className="subtasks-list">
//                           {editIssue.subtasks && editIssue.subtasks.length > 0 ? (
//                             editIssue.subtasks.map((subtask) => (
//                               <div key={subtask.id} className="subtask-item">
//                                 <label className="subtask-checkbox">
//                                   <input
//                                     type="checkbox"
//                                     checked={subtask.completed}
//                                     onChange={() => toggleSubtask(subtask.id)}
//                                   />
//                                   <span className={`subtask-text ${subtask.completed ? 'completed' : ''}`}>
//                                     {subtask.title}
//                                   </span>
//                                 </label>
//                                 <button
//                                   className="subtask-delete-btn"
//                                   onClick={() => deleteSubtask(subtask.id)}
//                                   title="Delete subtask"
//                                 >
//                                   ✕
//                                 </button>
//                               </div>
//                             ))
//                           ) : (
//                             <div className="no-subtasks">No subtasks added yet</div>
//                           )}
//                         </div>

//                         <div className="add-subtask">
//                           <input
//                             type="text"
//                             className="subtask-input"
//                             placeholder="Add a new subtask..."
//                             value={newSubtaskText}
//                             onChange={(e) => setNewSubtaskText(e.target.value)}
//                             onKeyPress={handleSubtaskKeyPress}
//                           />
//                           <button
//                             className="add-subtask-btn"
//                             onClick={addSubtask}
//                             disabled={!newSubtaskText.trim()}
//                           >
//                             Add
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="modal-section">
//                     <h3 className="modal-section-title">Comments</h3>
//                     <div className="modal-field-full">
//                       <textarea
//                         className="modal-textarea"
//                         rows="3"
//                         value={editIssue.comments}
//                         onChange={e => handleUpdateField('comments', e.target.value)}
//                         placeholder="Add comments..."
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="modal-actions">
//                 <button className="btn-reset" onClick={handleReset}>Reset Changes</button>
//                 <div className="modal-actions-right">
//                   <button
//                     className="modal-delete-btn"
//                     onClick={async () => {
//                       if (window.confirm('Are you sure you want to delete this issue?')) {
//                         await deleteIssueAPI(selectedIssue.id);
//                         const refreshed = await listIssues(projectId);
//                         setIssues(refreshed);
//                         setSelectedIssue(null);
//                       }
//                     }}
//                   >
//                     Delete Issue
//                   </button>
//                   <button className="btn-save" onClick={handleSave}>Save Changes</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Inline CSS styles */}
//       <style>{`

//   body {
//     font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
//     background-color: #D0F0F4;
//     margin: 0;
//     padding: 16px;
//   }
//   .board-wrap {
//     max-width: 100%;
//     overflow-x: auto;
//   }
//   .project-header {
//     background: #dbeafe;
//     border-radius: 8px;
//     padding: 20px 24px;
//     margin-bottom: 20px;
//     box-shadow: 0 1px 3px rgba(0,0,0,0.1);
//     border-left: 4px solid #1976d2;
//   }
//   .project-title {
//     margin: 0 0 12px 0;
//     font-size: 28px;
//     font-weight: 700;
//     color: #172b4d;
//     line-height: 1.2;
//   }
//   .project-stats {
//     display: flex;
//     gap: 20px;
//     flex-wrap: wrap;
//   }
//   .project-stat {
//     background: #dbeafe;
//     padding: 6px 12px;
//     border-radius: 16px;
//     font-size: 14px;
//     font-weight: 600;
//     color: #5e6c84;
//     display: flex;
//     align-items: center;
//     gap: 4px;
//   }
//   .project-stat:before {
//     content: "•";
//     color: #1976d2;
//     font-weight: bold;
//   }
//   @media (min-width: 768px) {
//     .swimlane {
//       background: #dbeafe;
//       border-radius: 8px;
//       margin-bottom: 16px;
//       box-shadow: 0 1px 3px rgba(0,0,0,0.1);
//       overflow: hidden;
//     }
//     .kanban-row {
//       display: flex;
//       padding: 16px;
//       gap: 12px;
//       overflow-x: auto;
//     }
//     .kanban-column {
//       flex: 0 0 260px;
//       background: #f5f6f8;
//       border-radius: 6px;
//       padding: 12px;
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//       border: 1px solid #dfe5e5;
//       user-select: none;
//       min-height: 400px;
//     }
//   }
//   @media (max-width: 767px) {
//     body {
//       padding: 8px;
//     }
//     .project-header {
//       padding: 16px;
//       margin-bottom: 16px;
//       border-left-width: 3px;
//     }
//     .project-title {
//       font-size: 22px;
//       margin-bottom: 10px;
//     }
//     .project-stats {
//       gap: 12px;
//     }
//     .project-stat {
//       font-size: 12px;
//       padding: 4px 10px;
//     }
//     .mobile-swimlane-selector {
//       margin-bottom: 16px;
//       position: sticky;
//       top: 0;
//       background: white;
//       padding: 12px;
//       border-radius: 8px;
//       box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//       z-index: 100;
//     }
//     .mobile-select {
//       width: 100%;
//       padding: 12px;
//       border: 1px solid #dfe5e5;
//       border-radius: 6px;
//       font-size: 16px;
//       background: white;
//     }
//     .swimlane {
//       background: #dbeafe;
//       border-radius: 8px;
//       margin-bottom: 12px;
//       box-shadow: 0 1px 3px rgba(0,0,0,0.1);
//       overflow: hidden;
//     }
//     .swimlane-header {
//       display: flex;
//       align-items: center;
//       padding: 12px;
//       background: #fafbfc;
//       border-bottom: 1px solid #dfe5e5;
//       font-weight: 600;
//       font-size: 14px;
//       color: #172b4d;
//       position: relative;
//     }
//     .mobile-swimlane-toggle {
//       background:#dbeafe;
//       border: none;
//       font-size: 16px;
//       color: #5e6c84;
//       margin-left: auto;
//       padding: 4px 8px;
//     }
//     .kanban-row.mobile-view {
//       display: block;
//       padding: 8px;
//       overflow-x: auto;
//       white-space: nowrap;
//     }
//     .kanban-column.mobile-column {
//       display: inline-block;
//       vertical-align: top;
//       width: 280px;
//       margin-right: 8px;
//       background: #dbeafe;
//       border-radius: 6px;
//       padding: 8px;
//       border: 1px solid #dfe5e5;
//       user-select: none;
//       min-height: 300px;
//     }
//     .col-header {
//       display: flex;
//       align-items: center;
//       margin-bottom: 8px;
//       gap: 6px;
//     }
//     .col-title {
//       font-weight: 600;
//       font-size: 11px;
//       color: #5e6c84;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//       flex-grow: 1;
//     }
//     .card-item {
//       background: #dbeafe;
//       border-radius: 6px;
//       padding: 10px;
//       box-shadow: 0 0 2px rgba(0,0,0,0.1);
//       cursor: pointer;
//       user-select: none;
//       display: flex;
//       flex-direction: column;
//       gap: 6px;
//       border: 1px solid #dfe5e5;
//       margin-bottom: 8px;
//     }
//     .card-title {
//       font-weight: 600;
//       font-size: 13px;
//       color: #2b3a59;
//       line-height: 1.3;
//     }
//     .card-meta {
//       display: flex;
//       gap: 6px;
//       font-size: 10px;
//       color: #6b7c93;
//       align-items: center;
//       flex-wrap: wrap;
//     }
//     .modal.mobile-modal {
//       width: 100%;
//       max-height: 90vh;
//       display: flex;
//       flex-direction: column;
//     }
//     .modal-content.mobile-modal-content {
//       display: flex;
//       flex-direction: column;
//       gap: 12px;
//       overflow-y: auto;
//     }
//     .modal-field {
//       display: flex;
//       flex-direction: column;
//       gap: 4px;
//     }
//     .modal-field input, .modal-field textarea, .modal-field select {
//       padding: 10px;
//       font-size: 16px;
//     }
//     .modal-actions {
//       display: flex;
//       gap: 8px;
//       justify-content: space-between;
//       margin-top: 16px;
//     }
//     .modal-actions button {
//       flex: 1;
//       padding: 12px;
//       font-size: 16px;
//     }
//   }

//   /* Card Styles */
//   .card-item {
//     background: #dbeafe;
//     border-radius: 8px;
//     padding: 12px;
//     box-shadow: 0 0 2px rgba(0,0,0,0.1);
//     cursor: pointer;
//     user-select: none;
//     display: flex;
//     flex-direction: column;
//     gap: 8px;
//     border: 1px solid #dfe5e5;
//     transition: box-shadow 0.2s ease, border-color 0.2s ease;
//   }

//   .card-item:hover {
//     box-shadow: 0px 2px 10px rgba(0,0,0,0.15);
//     border-color: #a2adba;
//   }

//   .card-top {
//     display: flex;
//     justify-content: space-between;
//     align-items: flex-start;
//     gap: 8px;
//   }

//   .card-tag {
//     padding: 2px 6px;
//     border-radius: 4px;
//     font-size: 10px;
//     font-weight: 600;
//     text-transform: uppercase;
//   }

//   .card-tag-task { background: #e3f2fd; color: #1976d2; }
//   .card-tag-subtask { background: #f3e5f5; color: #7b1fa2; }
//   .card-tag-bug { background: #dbeafe; color: #d32f2f; }

//   .card-id {
//     font-size: 10px;
//     color: #6b7c93;
//     font-family: 'Monaco', 'Menlo', monospace;
//     font-weight: 600;
//   }

//   .card-title {
//     font-weight: 600;
//     font-size: 14px;
//     color: #2b3a59;
//     line-height: 1.3;
//     margin: 0;
//     word-break: break-word;
//   }

//   .card-meta {
//     display: flex;
//     flex-direction: column;
//     gap: 6px;
//   }

//   .card-assignee {
//     display: flex;
//     align-items: center;
//     gap: 4px;
//     font-size: 11px;
//     color: #5e6c84;
//     font-weight: 500;
//   }

//   .card-due {
//     display: flex;
//     align-items: center;
//     gap: 4px;
//     font-size: 11px;
//     color: #d32f2f;
//     font-weight: 500;
//   }

//   .card-priority {
//     display: flex;
//     align-items: center;
//     gap: 4px;
//     font-size: 11px;
//     font-weight: 600;
//     padding: 2px 6px;
//     border-radius: 4px;
//     width: fit-content;
//   }

//   .card-priority.high { background: #ffebee; color: #d32f2f; }
//   .card-priority.medium { background: #fff3e0; color: #f57c00; }
//   .card-priority.low { background: #e8f5e8; color: #388e3c; }

//   /* Modal Subtasks Styles */
//   .subtasks-container {
//     display: flex;
//     flex-direction: column;
//     gap: 12px;
//   }

//   .subtasks-header {
//     display: flex;
//     flex-direction: column;
//     gap: 8px;
//   }

//   .subtasks-title {
//     font-size: 14px;
//     font-weight: 600;
//     color: #44546f;
//   }

//   .subtasks-list {
//     display: flex;
//     flex-direction: column;
//     gap: 8px;
//     max-height: 200px;
//     overflow-y: auto;
//   }

//   .subtask-item {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding: 8px 12px;
//     background: #dbeafe;
//     border-radius: 6px;
//     border: 1px solid #e1e4e8;
//     transition: background-color 0.2s;
//   }

//   .subtask-item:hover {
//     background: #f1f2f4;
//   }

//   .subtask-checkbox {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     flex: 1;
//     cursor: pointer;
//     margin: 0;
//   }

//   .subtask-checkbox input[type="checkbox"] {
//     margin: 0;
//     cursor: pointer;
//   }

//   .subtask-text {
//     font-size: 14px;
//     color: #44546f;
//     transition: all 0.2s;
//   }

//   .subtask-text.completed {
//     text-decoration: line-through;
//     color: #8b9cb1;
//   }

//   .subtask-delete-btn {
//     background: none;
//     border: none;
//     color: #d32f2f;
//     cursor: pointer;
//     padding: 4px;
//     border-radius: 4px;
//     font-size: 12px;
//     transition: background-color 0.2s;
//   }

//   .subtask-delete-btn:hover {
//     background: #ffebee;
//   }

//   .no-subtasks {
//     text-align: center;
//     color: #8b9cb1;
//     font-style: italic;
//     padding: 16px;
//     font-size: 14px;
//   }

//   .add-subtask {
//     display: flex;
//     gap: 8px;
//   }

//   .subtask-input {
//     flex: 1;
//     padding: 8px 12px;
//     border: 2px solid #dfe1e6;
//     border-radius: 6px;
//     font-size: 14px;
//     transition: border-color 0.2s;
//   }

//   .subtask-input:focus {
//     outline: none;
//     border-color: #1976d2;
//   }

//   .add-subtask-btn {
//     padding: 8px 16px;
//     background: #1976d2;
//     color: white;
//     border: none;
//     border-radius: 6px;
//     font-size: 14px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: background-color 0.2s;
//   }

//   .add-subtask-btn:hover:not(:disabled) {
//     background: #1565c0;
//   }

//   .add-subtask-btn:disabled {
//     background: #b0bec5;
//     cursor: not-allowed;
//   }

//   /* Enhanced Modal Styles - Centered Positioning */
//   .modal-overlay {
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background: rgba(0,0,0,0.6);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     z-index: 10000;
//     padding: 20px;
//   }

//   .modal-container {
//     max-width: 1000px;
//     max-height: 90vh;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   position: fixed;
//   // top: 0;
//   left: 400px;
//   width: 900px;
//   height: 100%;
//   z-index: 999;
//   }

// .file-upload-container {
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   font-family: Arial, sans-serif;
// }

// .file-upload-btn {
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   padding: 10px 20px;
//   background-color: #007bff;
//   border-radius: 8px;
//   color: white;
//   font-weight: 600;
//   font-size: 16px;
//   cursor: pointer;
//   user-select: none;
//   border: none;
//   transition: background-color 0.25s ease;
// }

// .file-upload-btn:hover {
//   background-color: #0056b3;
// }

// .btn-icon {
//   font-size: 20px;
// }

// #profileFile {
//   display: inline-block;
//   margin-left: 10px;
//   font-size: 14px;
//   color: #555;
//   cursor: pointer;
// }

//   .modal {
//     background: white;
//     border-radius: 12px;
//     width: 100%;
//     max-height: 90vh;
//     display: flex;
//     flex-direction: column;
//     overflow: hidden;
//     box-shadow: 0 20px 60px rgba(0,0,0,0.3);
//     margin: 0 auto;
//     transition: box-shadow 0.2s ease;
//   }

//   .modal-dragging {
//     box-shadow: 0 25px 80px rgba(0,0,0,0.4);
//     cursor: grabbing;
//   }

//   .modal-header {
//     display: flex;
//     justify-content: space-between;
//     align-items: flex-start;
//     padding: 24px;
//     background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
//     border-bottom: 1px solid #e1e4e8;
//     flex-shrink: 0;
//     cursor: grab;
//     transition: background-color 0.2s ease;
//   }

//   .modal-header:hover {
//     background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
//   }

//   .modal-dragging .modal-header {
//     cursor: grabbing;
//     background: linear-gradient(135deg, #dee2e6 0%, #ced4da 100%);
//   }

//   .modal-header-content {
//     flex: 1;
//     min-width: 0;
//   }

//   .modal-epic-badge {
//     display: inline-block;
//     background: #1976d2;
//     color: white;
//     padding: 4px 12px;
//     border-radius: 16px;
//     font-size: 12px;
//     font-weight: 600;
//     margin-bottom: 8px;
//   }

//   .modal-title {
//     margin: 0 0 8px 0;
//     font-size: 24px;
//     font-weight: 700;
//     color: #172b4d;
//     line-height: 1.3;
//     word-wrap: break-word;
//   }

//   .modal-id-type {
//     display: flex;
//     gap: 12px;
//     align-items: center;
//   }

//   .modal-id {
//     font-size: 14px;
//     color: #5e6c84;
//     font-family: 'Monaco', 'Menlo', monospace;
//   }

//   .modal-type {
//     padding: 2px 8px;
//     border-radius: 4px;
//     font-size: 12px;
//     font-weight: 600;
//     text-transform: uppercase;
//   }

//   .modal-type-task { background: #e3f2fd; color: #1976d2; }
//   .modal-type-subtask { background: #f3e5f5; color: #7b1fa2; }
//   .modal-type-bug { background: #ffebee; color: #d32f2f; }

//   .modal-close-btn {
//     background: none;
//     border: none;
//     font-size: 20px;
//     color: #5e6c84;
//     cursor: pointer;
//     padding: 8px;
//     margin: -8px;
//     border-radius: 4px;
//     transition: background-color 0.2s;
//     flex-shrink: 0;
//   }

//   .modal-close-btn:hover {
//     background: rgba(0,0,0,0.1);
//   }

//   .modal-content-scroll {
//     flex: 1;
//     overflow-y: auto;
//     padding: 0 24px;
//   }

//   .modal-content {
//     padding: 24px 0;
//     display: flex;
//     flex-direction: column;
//     gap: 24px;
//   }

//   .modal-section {
//     display: flex;
//     flex-direction: column;
//     gap: 16px;
//   }

//   .modal-section-title {
//     font-size: 18px;
//     font-weight: 600;
//     color: #172b4d;
//     margin: 0;
//     padding-bottom: 8px;
//     border-bottom: 2px solid #f0f0f0;
//   }

//   .modal-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//     gap: 16px;
//   }

//   .modal-field {
//     display: flex;
//     flex-direction: column;
//     gap: 6px;
//   }

//   .modal-field-full {
//     grid-column: 1 / -1;
//     display: flex;
//     flex-direction: column;
//     gap: 6px;
//   }

//   .modal-label {
//     font-size: 14px;
//     font-weight: 600;
//     color: #44546f;
//     margin: 0;
//   }

//   .modal-input, .modal-select, .modal-textarea {
//     padding: 12px;
//     border: 2px solid #dfe1e6;
//     border-radius: 8px;
//     font-size: 14px;
//     font-family: inherit;
//     transition: border-color 0.2s, box-shadow 0.2s;
//     background: white;
//   }

//   .modal-input:focus, .modal-select:focus, .modal-textarea:focus {
//     outline: none;
//     border-color: #1976d2;
//     box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
//   }

//   .modal-input-disabled {
//     background: #f8f9fa;
//     color: #6b778c;
//     cursor: not-allowed;
//   }

//   .modal-textarea {
//     resize: vertical;
//     min-height: 80px;
//     line-height: 1.5;
//   }

//   .modal-actions {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 20px 24px;
//     background: #f8f9fa;
//     border-top: 1px solid #e1e4e8;
//     gap: 16px;
//     flex-shrink: 0;
//   }

//   .modal-actions-right {
//     display: flex;
//     gap: 12px;
//     align-items: center;
//   }

//   .btn-reset {
//     padding: 10px 20px;
//     border: 1px solid #dcdfe4;
//     background: white;
//     color: #44546f;
//     border-radius: 6px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: all 0.2s;
//   }

//   .btn-reset:hover {
//     background: #f1f2f4;
//     border-color: #c1c7d0;
//   }

//   .btn-save {
//     padding: 10px 24px;
//     border: none;
//     background: #1976d2;
//     color: white;
//     border-radius: 6px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: background-color 0.2s;
//   }

//   .btn-save:hover {
//     background: #1565c0;
//   }

//   .modal-delete-btn {
//     padding: 10px 20px;
//     border: 1px solid #ffcdd2;
//     background: white;
//     color: #d32f2f;
//     border-radius: 6px;
//     font-weight: 600;
//     cursor: pointer;
//     transition: all 0.2s;
//   }

//   .modal-delete-btn:hover {
//     background: #ffebee;
//     border-color: #ef5350;
//   }

//   @media (max-width: 767px) {
//     .modal-overlay {
//       padding: 10px;
//     }

//     .modal-container.mobile-modal-container {
//       width: 100%;
//       height: 100%;
//       padding: 0;
//     }

//     .modal.mobile-modal {
//       width: 100%;
//       max-height: 100%;
//       border-radius: 0;
//       margin: 0;
//     }

//     .modal-header {
//       padding: 16px;
//       flex-direction: column;
//       gap: 12px;
//       cursor: default;
//     }

//     .modal-close-btn {
//       align-self: flex-end;
//       margin: 0;
//     }

//     .modal-content-scroll {
//       padding: 0 16px;
//     }

//     .modal-content {
//       padding: 16px 0;
//       gap: 20px;
//     }

//     .modal-grid {
//       grid-template-columns: 1fr;
//       gap: 12px;
//     }

//     .modal-actions {
//       padding: 16px;
//       flex-direction: column;
//       gap: 12px;
//     }

//     .modal-actions-right {
//       width: 100%;
//       justify-content: space-between;
//     }

//     .btn-reset, .modal-delete-btn, .btn-save {
//       flex: 1;
//       text-align: center;
//     }

//     .add-subtask {
//       flex-direction: column;
//     }

//     .subtasks-list {
//       max-height: 150px;
//     }
//   }

//   .swimlane-header {
//     display: flex;
//     align-items: center;
//     padding: 12px 16px;
//     background: #fafbfc;
//     border-bottom: 1px solid #dfe5e5;
//     font-weight: 600;
//     font-size: 14px;
//     color: #172b4d;
//   }
//   .swimlane-toggle, .swimlane-icon {
//     color: #5e6c84;
//     margin-right: 8px;
//     cursor: pointer;
//   }
//   .swimlane-toggle {
//     border: none;
//     background: transparent;
//     font-size: 14px;
//   }
//   .swimlane-icon {
//     font-size: 18px;
//   }
//   .swimlane-title-input {
//     border: 1px solid #dfe5e5;
//     border-radius: 4px;
//     padding: 4px 8px;
//     font-size: 14px;
//     font-weight: 600;
//     background: white;
//     margin-right: 8px;
//     min-width: 150px;
//     color: #172b4d;
//   }
//   .swimlane-title-input:focus {
//     outline: none;
//     border-color: #1976d2;
//   }
//   .swimlane-count {
//     color: #5e6c84;
//     font-size: 12px;
//     font-weight: normal;
//   }
//   .col-header {
//     display: flex;
//     align-items: center;
//     margin-bottom: 4px;
//     gap: 6px;
//   }
//   .col-title {
//     font-weight: 600;
//     font-size: 12px;
//     color: #5e6c84;
//     text-transform: uppercase;
//     letter-spacing: 0.5px;
//     flex-grow: 1;
//   }
//   .col-count {
//     background: #dfe5e5;
//     color: #5e6c84;
//     border-radius: 12px;
//     padding: 2px 8px;
//     font-size: 11px;
//     font-weight: 600;
//     min-width: 20px;
//     text-align: center;
//   }
//   .col-icons {
//     display: flex;
//     gap: 6px;
//   }
//   .col-icon {
//     cursor: pointer;
//     color: #5e6c84;
//     font-size: 18px;
//     background: none;
//     border: none;
//     padding: 0;
//   }
//   .create-card {
//     background: white;
//     padding: 10px;
//     border-radius: 6px;
//     box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
//     display: flex;
//     flex-direction: column;
//     gap: 10px;
//   }
//   button {
//     cursor: pointer;
//     transition: background-color 0.2s;
//   }
//   button:hover {
//     opacity: 0.9;
//   }
//   @media (max-width: 767px) {
//     button, .card-item, .col-icon {
//       min-height: 44px;
//       min-width: 44px;
//     }
//     .card-item {
//       touch-action: manipulation;
//     }
//   }
// `}</style>

//     </div>
//   );
// }

// const btnStyle = {
//   cancel: {
//     padding: '10px 18px',
//     borderRadius: '6px',
//     border: 'none',
//     backgroundColor: '#5e6c84',
//     color: 'white',
//     fontWeight: '600',
//     fontSize: '14px',
//     cursor: 'pointer'
//   },
//   create: {
//     padding: '10px 18px',
//     borderRadius: '6px',
//     border: 'none',
//     backgroundColor: '#1976d2',
//     color: 'white',
//     fontWeight: '600',
//     fontSize: '14px',
//     cursor: 'pointer'
//   },
//   delete: {
//     padding: '10px 18px',
//     borderRadius: '6px',
//     border: 'none',
//     backgroundColor: '#d32f2f',
//     color: 'white',
//     fontWeight: '600',
//     fontSize: '14px',
//     cursor: 'pointer'
//   }
// };

// for updates

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FiUpload } from "react-icons/fi"; // Add this line

const mockIssues = [
  {
    id: "i1",
    epic: "p1",
    epicName: "Frontend",
    status: "todo",
    type: "Task",
    title: "Setup repo",
    assignee: "John Doe",
    storyPoints: 3,
    labels: [],
    dueDate: "2025-09-30",
    reporter: "admin",
    priority: "High",
    startDate: "2025-09-15",
    description: "Setup the initial repository structure and configuration",
    subtasks: [
      { id: "st1", title: "Create GitHub repository", completed: true },
      { id: "st2", title: "Setup CI/CD pipeline", completed: false },
      {
        id: "st3",
        title: "Configure linting and formatting",
        completed: false,
      },
    ],
    comments: "Initial setup required for the project",
  },
  {
    id: "i3",
    epic: "p2",
    epicName: "Middleware",
    status: "todo",
    type: "Subtask",
    title: "API integration",
    assignee: "Jane Smith",
    storyPoints: 2,
    labels: [],
    dueDate: "",
    reporter: "lead-dev",
    priority: "Low",
    startDate: "2025-09-18",
    description: "Integrate with external API services",
    subtasks: [
      { id: "st4", title: "Design API endpoints", completed: true },
      { id: "st5", title: "Implement authentication", completed: false },
    ],
    comments: "",
  },
];

const defaultStatuses = [
  "backlog",
  "todo",
  "inprogress",
  "code review",
  "done",
];
const mockEpics = [
  { id: "p1", name: "Frontend" },
  { id: "p2", name: "Middleware" },
];
const mockProjects = [
  { id: "p1", name: "E-Commerce Platform" },
  { id: "p2", name: "API Gateway Service" },
  { id: "p3", name: "Mobile App Development" },
];

const simulateApiDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 200));

const listIssues = async (projectId) => {
  await simulateApiDelay();
  return mockIssues.filter(
    (i) => !projectId || i.epic === projectId || i.projectId === projectId,
  );
};
const listEpics = async () => {
  await simulateApiDelay();
  return mockEpics;
};
const getProjectName = async (projectId) => {
  await simulateApiDelay();
  const project = mockProjects.find((p) => p.id === projectId);
  return project ? project.name : "Untitled Project";
};
const createEpicAPI = async (epicName) => {
  await simulateApiDelay();
  const newEpic = { id: "p" + (mockEpics.length + 1), name: epicName };
  mockEpics.push(newEpic);
  return newEpic;
};
const deleteEpicAPI = async (epicId) => {
  await simulateApiDelay();
  const epicIndex = mockEpics.findIndex((epic) => epic.id === epicId);
  if (epicIndex > -1) mockEpics.splice(epicIndex, 1);
  const issueIndices = [];
  mockIssues.forEach((issue, index) => {
    if (issue.epic === epicId) issueIndices.push(index);
  });
  issueIndices
    .sort((a, b) => b - a)
    .forEach((index) => {
      mockIssues.splice(index, 1);
    });
};
const moveIssue = async (issueId, status) => {
  await simulateApiDelay();
  const issue = mockIssues.find((i) => i.id === issueId);
  if (!issue) throw new Error("Issue not found");
  issue.status = status;
};
const createIssueAPI = async (issue) => {
  await simulateApiDelay();
  mockIssues.push(issue);
};
const deleteIssueAPI = async (issueId) => {
  await simulateApiDelay();
  const idx = mockIssues.findIndex((i) => i.id === issueId);
  if (idx > -1) mockIssues.splice(idx, 1);
};
const updateIssueAPI = async (updatedIssue) => {
  await simulateApiDelay();
  const idx = mockIssues.findIndex((i) => i.id === updatedIssue.id);
  if (idx > -1) mockIssues[idx] = { ...mockIssues[idx], ...updatedIssue };
};

const getSwimlanes = (issues, epics) =>
  epics.map((epic) => {
    const epicIssues = issues.filter(
      (i) => (i.epic || i.projectId) === epic.id,
    );
    return { id: epic.id, title: epic.name, issues: epicIssues };
  });

export default function KanbanBoard() {
  const { projectId } = useParams();
  const [issues, setIssues] = useState([]);
  const [epics, setEpics] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [openSwimlanes, setOpenSwimlanes] = useState({});
  const [customTitles, setCustomTitles] = useState({});
  const [createLaneId, setCreateLaneId] = useState(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskType, setNewTaskType] = useState("Task");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editIssue, setEditIssue] = useState(null);
  const [showCreateEpic, setShowCreateEpic] = useState(false);
  const [showDeleteEpic, setShowDeleteEpic] = useState(false);
  const [newEpicName, setNewEpicName] = useState("");
  const [epicToDelete, setEpicToDelete] = useState("");
  const [columnsByLane, setColumnsByLane] = useState({});
  const [columnModal, setColumnModal] = useState(null);
  const [columnInput, setColumnInput] = useState("");
  const [hoveredAssigneeId, setHoveredAssigneeId] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [activeSwimlane, setActiveSwimlane] = useState(null);

  // State to store selected profile file
  const [profileFile, setProfileFile] = useState(null);

  // Handler for file input changes
  const handleNewUserChange = (event) => {
    const file = event.target.files[0];
    setProfileFile(file);
  };

  // Draggable modal state
  const [modalDrag, setModalDrag] = useState({
    isDragging: false,
    position: { x: 0, y: 0 },
    startPosition: { x: 0, y: 0 },
  });
  const modalRef = useRef(null);

  // Subtask management
  const [newSubtaskText, setNewSubtaskText] = useState("");

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectNameData = projectId
          ? await getProjectName(projectId)
          : "All Projects";
        const [issuesData, epicsData] = await Promise.all([
          listIssues(projectId),
          listEpics(),
        ]);
        setIssues(issuesData);
        setEpics(epicsData);
        setProjectName(projectNameData);
        const lanes = getSwimlanes(issuesData, epicsData);
        const initialOpen = {},
          initialTitles = {},
          initialCols = {};
        lanes.forEach((lane) => {
          initialOpen[lane.id] = true;
          initialTitles[lane.id] = lane.title;
          initialCols[lane.id] = defaultStatuses.slice();
        });
        setOpenSwimlanes(initialOpen);
        setCustomTitles(initialTitles);
        setColumnsByLane(initialCols);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [projectId]);

  // Subtask functions
  const addSubtask = () => {
    if (!newSubtaskText.trim()) return;

    const newSubtask = {
      id: `st${Date.now()}`,
      title: newSubtaskText.trim(),
      completed: false,
    };

    setEditIssue((prev) => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), newSubtask],
    }));

    setNewSubtaskText("");
  };

  const toggleSubtask = (subtaskId) => {
    setEditIssue((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, completed: !subtask.completed }
          : subtask,
      ),
    }));
  };

  const deleteSubtask = (subtaskId) => {
    setEditIssue((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((subtask) => subtask.id !== subtaskId),
    }));
  };

  const handleSubtaskKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubtask();
    }
  };

  // Draggable modal functions
  const handleModalMouseDown = (e) => {
    if (isMobile) return; // Disable dragging on mobile

    // Only start dragging if clicking on the header (not on buttons or inputs)
    if (
      e.target.closest(".modal-close-btn") ||
      e.target.closest("input") ||
      e.target.closest("select") ||
      e.target.closest("textarea") ||
      e.target.closest("button") ||
      e.target.closest(".subtask-item")
    ) {
      return;
    }

    setModalDrag({
      isDragging: true,
      position: modalDrag.position,
      startPosition: {
        x: e.clientX - modalDrag.position.x,
        y: e.clientY - modalDrag.position.y,
      },
    });
  };

  const handleModalMouseMove = (e) => {
    if (!modalDrag.isDragging || isMobile) return;

    const newX = e.clientX - modalDrag.startPosition.x;
    const newY = e.clientY - modalDrag.startPosition.y;

    setModalDrag((prev) => ({
      ...prev,
      position: { x: newX, y: newY },
    }));
  };

  const handleModalMouseUp = () => {
    if (isMobile) return;
    setModalDrag((prev) => ({ ...prev, isDragging: false }));
  };

  // Reset modal position when closed
  useEffect(() => {
    if (!selectedIssue) {
      setModalDrag({
        isDragging: false,
        position: { x: 0, y: 0 },
        startPosition: { x: 0, y: 0 },
      });
    }
  }, [selectedIssue]);

  // Add event listeners for dragging
  useEffect(() => {
    if (modalDrag.isDragging) {
      document.addEventListener("mousemove", handleModalMouseMove);
      document.addEventListener("mouseup", handleModalMouseUp);
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleModalMouseMove);
      document.removeEventListener("mouseup", handleModalMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleModalMouseMove);
      document.removeEventListener("mouseup", handleModalMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [modalDrag.isDragging]);

  const openAddColumnModal = (e, laneId, colIndex) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    });
    setColumnModal({ laneId, colIndex, type: "add" });
    setColumnInput("");
  };
  const openEditColumnModal = (e, laneId, colIndex, status) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    });
    setColumnModal({ laneId, colIndex, type: "menu" });
    setColumnInput(status);
  };
  const handleAddColumn = () => {
    const name = columnInput.trim();
    if (!name) return alert("Column name is required");
    setColumnsByLane((prev) => {
      const cols = [...prev[columnModal.laneId]];
      if (cols.includes(name.toLowerCase()))
        alert("Column name already exists");
      else cols.splice(columnModal.colIndex + 1, 0, name.toLowerCase());
      return { ...prev, [columnModal.laneId]: cols };
    });
    setColumnModal(null);
    setColumnInput("");
  };
  const handleEditColumn = () => {
    const name = columnInput.trim();
    if (!name) return alert("Column name is required");
    const { laneId, colIndex } = columnModal;
    const oldCol = columnsByLane[laneId][colIndex];
    if (
      columnsByLane[laneId].includes(name.toLowerCase()) &&
      name.toLowerCase() !== oldCol
    ) {
      alert("Column name already exists");
      return;
    }
    setColumnsByLane((prev) => {
      const cols = [...prev[laneId]];
      cols[colIndex] = name.toLowerCase();
      return { ...prev, [laneId]: cols };
    });
    const updatedIssues = issues.map((issue) =>
      (issue.epic || issue.projectId) === laneId && issue.status === oldCol
        ? { ...issue, status: name.toLowerCase() }
        : issue,
    );
    setIssues(updatedIssues);
    setColumnModal(null);
    setColumnInput("");
  };
  const handleDeleteColumn = () => {
    const { laneId, colIndex } = columnModal;
    const removedCol = columnsByLane[laneId][colIndex];
    setColumnsByLane((prev) => {
      const cols = [...prev[laneId]];
      cols.splice(colIndex, 1);
      return { ...prev, [laneId]: cols };
    });
    const updatedIssues = issues.map((issue) =>
      (issue.epic || issue.projectId) === laneId && issue.status === removedCol
        ? { ...issue, status: "backlog" }
        : issue,
    );
    setIssues(updatedIssues);
    setColumnModal(null);
    setColumnInput("");
  };
  const toggleSwimlane = (id) =>
    setOpenSwimlanes((prev) => ({ ...prev, [id]: !prev[id] }));
  const byStatus = (collection, status) =>
    collection.filter((i) => i.status === status);

  const onDragStart = (e, issueId) =>
    e.dataTransfer.setData("text/plain", issueId);
  const onDrop = async (e, targetStatus, swimlaneId) => {
    e.preventDefault();
    try {
      const issueId = e.dataTransfer.getData("text/plain");
      const issue = issues.find((i) => i.id === issueId);
      const srcLaneId = issue.epic || issue.projectId;
      if (srcLaneId === swimlaneId && issue.status !== targetStatus) {
        await moveIssue(issueId, targetStatus);
        const refreshed = await listIssues(projectId);
        setIssues(refreshed);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const onDragOver = (e) => e.preventDefault();

  const handleCreateClick = (laneId) => {
    setCreateLaneId(laneId);
    setNewTaskText("");
    setNewTaskType("Task");
  };
  const handleCreateSubmit = async (lane) => {
    if (!newTaskText.trim()) {
      alert("Task title is required");
      return;
    }
    const newIssue = {
      id: Math.random().toString(36).slice(2),
      epic: lane.id,
      projectId: lane.id,
      epicName: lane.title,
      title: newTaskText,
      status: "backlog",
      assignee: "",
      type: newTaskType,
      storyPoints: "",
      labels: [],
      dueDate: "",
      reporter: "system",
      priority: "Medium",
      startDate: new Date().toISOString().split("T")[0],
      description: "",
      subtasks: [],
      comments: "",
    };
    try {
      await createIssueAPI(newIssue);
      const refreshed = await listIssues(projectId);
      setIssues(refreshed);
      setCreateLaneId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (issue) => {
    setSelectedIssue(issue);
    setEditIssue({ ...issue });
    setNewSubtaskText("");
    // Reset position when opening new modal
    setModalDrag({
      isDragging: false,
      position: { x: 0, y: 0 },
      startPosition: { x: 0, y: 0 },
    });
  };
  const handleUpdateField = (field, value) => {
    setEditIssue((prev) => ({ ...prev, [field]: value }));
  };
  const handleSave = async () => {
    await updateIssueAPI(editIssue);
    const refreshed = await listIssues(projectId);
    setIssues(refreshed);
    setSelectedIssue(null);
    setEditIssue(null);
  };
  const handleReset = () => {
    setEditIssue({ ...selectedIssue });
  };

  const handleCreateEpic = async () => {
    if (!newEpicName.trim()) {
      alert("Epic name is required");
      return;
    }
    try {
      await createEpicAPI(newEpicName);
      const updatedEpics = await listEpics();
      setEpics(updatedEpics);
      setNewEpicName("");
      setShowCreateEpic(false);
      const newEpic = updatedEpics[updatedEpics.length - 1];
      setOpenSwimlanes((prev) => ({ ...prev, [newEpic.id]: true }));
      setCustomTitles((prev) => ({ ...prev, [newEpic.id]: newEpic.name }));
      setColumnsByLane((prev) => ({
        ...prev,
        [newEpic.id]: defaultStatuses.slice(),
      }));
    } catch (error) {
      console.error("Error creating epic:", error);
    }
  };

  const handleDeleteEpic = async () => {
    if (!epicToDelete) {
      alert("Please select an epic to delete");
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete the epic "${epics.find((e) => e.id === epicToDelete)?.name}"? This will also delete all issues in this epic.`,
      )
    ) {
      return;
    }
    try {
      await deleteEpicAPI(epicToDelete);
      const [refreshedIssues, refreshedEpics] = await Promise.all([
        listIssues(projectId),
        listEpics(),
      ]);
      setIssues(refreshedIssues);
      setEpics(refreshedEpics);
      setEpicToDelete("");
      setShowDeleteEpic(false);
      setColumnsByLane((prev) => {
        const copy = { ...prev };
        delete copy[epicToDelete];
        return copy;
      });
      setOpenSwimlanes((prev) => {
        const copy = { ...prev };
        delete copy[epicToDelete];
        return copy;
      });
      setCustomTitles((prev) => {
        const copy = { ...prev };
        delete copy[epicToDelete];
        return copy;
      });
    } catch (error) {
      console.error("Error deleting epic:", error);
    }
  };

  const toggleMobileSwimlane = (laneId) => {
    if (activeSwimlane === laneId) {
      setActiveSwimlane(null);
    } else {
      setActiveSwimlane(laneId);
    }
  };

  const swimlanes = getSwimlanes(issues, epics);

  // Calculate subtask progress
  const getSubtaskProgress = (subtasks) => {
    if (!subtasks || subtasks.length === 0)
      return { completed: 0, total: 0, percentage: 0 };
    const completed = subtasks.filter((st) => st.completed).length;
    const total = subtasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  return (
    <div
      className="board-wrap"
      style={{
        margin: 0,
        padding: 0,
        maxWidth: "100vw",
        minHeight: "100vh",
        background: "#19a0f7", // makes Kanban flush with browser edge
        overflowX: "auto",
      }}
    >
      {/* Project Name Header */}
      <div
        className="project-header"
        style={{
          background: "#dbeafe",
          borderRadius: 8,
          padding: "20px 0px", // zero left/right
          margin: 0,
          marginBottom: 20,
        }}
      >
        <h1 className="project-title">{projectName}</h1>
        <div className="project-stats">
          <span className="project-stat">{epics.length} Epics</span>
          <span className="project-stat">{issues.length} Issues</span>
          <span className="project-stat">
            {issues.filter((issue) => issue.status === "done").length} Completed
          </span>
        </div>
      </div>

      {isMobile && (
        <div className="mobile-swimlane-selector">
          <select
            value={activeSwimlane || ""}
            onChange={(e) => setActiveSwimlane(e.target.value || null)}
            className="mobile-select"
          >
            <option value="">All Swimlanes</option>
            {swimlanes.map((lane) => (
              <option key={lane.id} value={lane.id}>
                {customTitles[lane.id] || lane.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {swimlanes.map((lane) => {
        const isOpen = isMobile
          ? activeSwimlane === null || activeSwimlane === lane.id
          : openSwimlanes[lane.id];
        const statuses = columnsByLane[lane.id] || defaultStatuses;

        if (isMobile && activeSwimlane && activeSwimlane !== lane.id) {
          return null;
        }

        return (
          <section className="swimlane" key={lane.id}>
            <header className="swimlane-header">
              {!isMobile && (
                <button
                  className="swimlane-toggle"
                  onClick={() => toggleSwimlane(lane.id)}
                >
                  {isOpen ? "▼" : "▶"}
                </button>
              )}
              <span className="swimlane-icon">⚡</span>
              <input
                className="swimlane-title-input"
                value={customTitles[lane.id] || ""}
                onChange={(e) =>
                  setCustomTitles((prev) => ({
                    ...prev,
                    [lane.id]: e.target.value,
                  }))
                }
              />
              <span className="swimlane-count">
                {lane.issues.length} work items
              </span>
              {isMobile && (
                <button
                  className="mobile-swimlane-toggle"
                  onClick={() => toggleMobileSwimlane(lane.id)}
                >
                  {activeSwimlane === lane.id ? "▲" : "▼"}
                </button>
              )}
            </header>
            {isOpen && (
              <div className={`kanban-row ${isMobile ? "mobile-view" : ""}`}>
                {statuses.map((status, idx) => {
                  const issuesForStatus = byStatus(lane.issues, status);
                  return (
                    <div
                      className={`kanban-column ${isMobile ? "mobile-column" : ""}`}
                      key={status}
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, status, lane.id)}
                    >
                      <div className="col-header">
                        <span className="col-title">
                          {status.toUpperCase()}
                        </span>
                        {!isMobile && (
                          <span className="col-icons">
                            <button
                              className="col-icon"
                              title="Add Column"
                              onClick={(e) =>
                                openAddColumnModal(e, lane.id, idx)
                              }
                            >
                              ＋
                            </button>
                            <button
                              className="col-icon"
                              title="Edit/Delete Column"
                              onClick={(e) =>
                                openEditColumnModal(e, lane.id, idx, status)
                              }
                            >
                              ⋮
                            </button>
                          </span>
                        )}
                        {issuesForStatus.length > 0 && (
                          <span className="col-count">
                            {issuesForStatus.length}
                          </span>
                        )}
                      </div>
                      <div className="col-create">
                        {status === "backlog" &&
                          (createLaneId === lane.id ? (
                            <div className="create-card">
                              <textarea
                                rows={2}
                                className="create-input"
                                placeholder="What needs to be done?"
                                value={newTaskText}
                                onChange={(e) => setNewTaskText(e.target.value)}
                              />
                              <div className="create-actions">
                                <select
                                  value={newTaskType}
                                  onChange={(e) =>
                                    setNewTaskType(e.target.value)
                                  }
                                  className="create-select"
                                >
                                  <option>Task</option>
                                  <option>Subtask</option>
                                  <option>Bug</option>
                                </select>
                                <button
                                  className="create-btn"
                                  onClick={() => handleCreateSubmit(lane)}
                                >
                                  ✔
                                </button>
                                <button
                                  className="create-btn"
                                  onClick={() => setCreateLaneId(null)}
                                >
                                  ✖
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span
                              className="create-link"
                              onClick={() => handleCreateClick(lane.id)}
                            >
                              + Create
                            </span>
                          ))}
                      </div>
                      {issuesForStatus.map((issue) => {
                        const isHovered = hoveredAssigneeId === issue.id;
                        return (
                          <div
                            className="card-item"
                            key={issue.id}
                            draggable
                            onDragStart={(e) => onDragStart(e, issue.id)}
                            onClick={() => handleOpenModal(issue)}
                          >
                            <div className="card-top">
                              <span
                                className={`card-tag card-tag-${issue.type.toLowerCase()}`}
                              >
                                {issue.type}
                              </span>
                              <span className="card-id">{issue.id}</span>
                            </div>
                            <div className="card-title">{issue.title}</div>
                            <div className="card-meta">
                              {issue.assignee && (
                                <span
                                  className="card-assignee"
                                  onMouseEnter={() =>
                                    setHoveredAssigneeId(issue.id)
                                  }
                                  onMouseLeave={() =>
                                    setHoveredAssigneeId(null)
                                  }
                                >
                                  👤 {issue.assignee}
                                </span>
                              )}
                              {issue.dueDate && (
                                <span className="card-due">
                                  📅 {issue.dueDate}
                                </span>
                              )}
                              <span
                                className={`card-priority ${issue.priority.toLowerCase()}`}
                              >
                                ⚑ {issue.priority}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
      {/* Column Add/Edit modal */}
      {columnModal &&
        (columnModal.type === "add" || columnModal.type === "menu") && (
          <div
            className="epic-modal-overlay"
            onClick={() => setColumnModal(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
            }}
          >
            <div
              className="epic-modal"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: isMobile ? "fixed" : "absolute",
                top: isMobile ? "50%" : modalPosition.top,
                left: isMobile ? "50%" : modalPosition.left,
                transform: isMobile
                  ? "translate(-50%, -50%)"
                  : "translateX(-50%)",
                minWidth: isMobile ? "90vw" : 280,
                maxWidth: isMobile ? "95vw" : 320,
                padding: 20,
                borderRadius: 10,
                background: "white",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                zIndex: 1100,
              }}
            >
              {columnModal.type === "add" ? (
                <>
                  <h3
                    style={{
                      marginBottom: 15,
                      fontWeight: 600,
                      fontSize: 20,
                      color: "#172b4d",
                    }}
                  >
                    Add Column
                  </h3>
                  <input
                    value={columnInput}
                    onChange={(e) => setColumnInput(e.target.value)}
                    placeholder="Column name"
                    autoFocus
                    className="epic-modal-input"
                    style={{
                      width: "100%",
                      padding: 12,
                      fontSize: 16,
                      borderRadius: 6,
                      border: "1px solid #dfe1e5",
                      marginBottom: 20,
                      boxSizing: "border-box",
                    }}
                  />
                  <div
                    className="epic-modal-actions"
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 12,
                      flexWrap: isMobile ? "wrap" : "nowrap",
                    }}
                  >
                    <button
                      className="btn-cancel"
                      onClick={() => setColumnModal(null)}
                      style={btnStyle.cancel}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-create"
                      onClick={handleAddColumn}
                      style={btnStyle.create}
                    >
                      Add
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3
                    style={{
                      marginBottom: 15,
                      fontWeight: 600,
                      fontSize: 20,
                      color: "#172b4d",
                    }}
                  >
                    Edit/Delete Column
                  </h3>
                  <input
                    value={columnInput}
                    onChange={(e) => setColumnInput(e.target.value)}
                    placeholder="Column name"
                    autoFocus
                    className="epic-modal-input"
                    style={{
                      width: "100%",
                      padding: 12,
                      fontSize: 16,
                      borderRadius: 6,
                      border: "1px solid #dfe1e5",
                      marginBottom: 20,
                      boxSizing: "border-box",
                    }}
                  />
                  <div
                    className="epic-modal-actions"
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 12,
                      flexWrap: isMobile ? "wrap" : "nowrap",
                    }}
                  >
                    <button
                      className="btn-save"
                      onClick={handleEditColumn}
                      style={btnStyle.create}
                    >
                      Rename
                    </button>
                    <button
                      className="btn-delete"
                      onClick={handleDeleteColumn}
                      style={btnStyle.delete}
                    >
                      Delete
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => setColumnModal(null)}
                      style={btnStyle.cancel}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      {/* Issue modal - Centered in the middle of the page */}
      {selectedIssue && editIssue && (
        <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
          <div
            className={`modal-container ${isMobile ? "mobile-modal-container" : ""}`}
            ref={modalRef}
          >
            <div
              className={`modal ${isMobile ? "mobile-modal" : ""} ${modalDrag.isDragging ? "modal-dragging" : ""}`}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={handleModalMouseDown}
              style={
                !isMobile &&
                modalDrag.position.x !== 0 &&
                modalDrag.position.y !== 0
                  ? {
                      position: "fixed",
                      top: modalDrag.position.y,
                      left: modalDrag.position.x,
                      transform: "none",
                    }
                  : {}
              }
            >
              <div className="modal-header">
                <div className="modal-header-content">
                  <span className="modal-epic-badge">{editIssue.epicName}</span>
                  <h2 className="modal-title">
                    {editIssue.title || "Untitled Issue"}
                  </h2>
                  <div className="modal-id-type">
                    <span className="modal-id">{editIssue.id}</span>
                    <span
                      className={`modal-type modal-type-${editIssue.type.toLowerCase()}`}
                    >
                      {editIssue.type}
                    </span>
                  </div>
                </div>
                <button
                  className="modal-close-btn"
                  onClick={() => setSelectedIssue(null)}
                >
                  ✖
                </button>
              </div>

              <div className="modal-content-scroll">
                <div
                  className={`modal-content ${isMobile ? "mobile-modal-content" : ""}`}
                >
                  <div className="modal-section">
                    <h3 className="modal-section-title">Details</h3>
                    <div className="modal-grid">
                      <div className="modal-field">
                        <label className="modal-label">Title</label>
                        <input
                          className="modal-input"
                          value={editIssue.title}
                          onChange={(e) =>
                            handleUpdateField("title", e.target.value)
                          }
                          placeholder="Enter issue title"
                        />
                      </div>
                      <div className="modal-field">
                        <label className="modal-label">Status</label>
                        <select
                          className="modal-select"
                          value={editIssue.status}
                          onChange={(e) =>
                            handleUpdateField("status", e.target.value)
                          }
                        >
                          {columnsByLane[editIssue.epic]?.map((st) => (
                            <option key={st} value={st}>
                              {st.charAt(0).toUpperCase() + st.slice(1)}
                            </option>
                          )) ||
                            defaultStatuses.map((st) => (
                              <option key={st} value={st}>
                                {st.charAt(0).toUpperCase() + st.slice(1)}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="modal-field">
                        <label className="modal-label">Assignee</label>
                        <input
                          className="modal-input"
                          value={editIssue.assignee}
                          onChange={(e) =>
                            handleUpdateField("assignee", e.target.value)
                          }
                          placeholder="Unassigned"
                        />
                      </div>
                      <div className="modal-field">
                        <label className="modal-label">Reporter</label>
                        <input
                          className="modal-input modal-input-disabled"
                          disabled
                          value={editIssue.reporter}
                        />
                      </div>
                      <div className="modal-field">
                        <label className="modal-label">Priority</label>
                        <select
                          className="modal-select"
                          value={editIssue.priority}
                          onChange={(e) =>
                            handleUpdateField("priority", e.target.value)
                          }
                        >
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                          <option>Critical</option>
                        </select>
                      </div>
                      <div className="modal-field">
                        <label className="modal-label">Story Points</label>
                        <input
                          className="modal-input"
                          type="number"
                          value={editIssue.storyPoints}
                          onChange={(e) =>
                            handleUpdateField("storyPoints", e.target.value)
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="modal-field">
                        <label className="modal-label">Start Date</label>
                        <input
                          className="modal-input"
                          type="date"
                          value={editIssue.startDate}
                          onChange={(e) =>
                            handleUpdateField("startDate", e.target.value)
                          }
                        />
                      </div>
                      <div className="modal-field">
                        <label className="modal-label">Due Date</label>
                        <input
                          className="modal-input"
                          type="date"
                          value={editIssue.dueDate}
                          onChange={(e) =>
                            handleUpdateField("dueDate", e.target.value)
                          }
                        />
                      </div>
                      <div className="input-group file-group">
                        <label className="input-label">Attach File</label>
                        <label
                          htmlFor="profileFile"
                          className="file-upload-btn"
                        >
                          <FiUpload className="btn-icon" />
                          {profileFile ? profileFile.name : "Choose File"}
                        </label>
                        <input
                          id="profileFile"
                          type="file"
                          name="profileFile"
                          onChange={handleNewUserChange}
                          accept="image/*"
                          style={{ display: "none" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-section">
                    <h3 className="modal-section-title">Description</h3>
                    <div className="modal-field-full">
                      <textarea
                        className="modal-textarea"
                        rows="4"
                        value={editIssue.description}
                        onChange={(e) =>
                          handleUpdateField("description", e.target.value)
                        }
                        placeholder="Add a detailed description..."
                      />
                    </div>
                  </div>

                  <div className="modal-section">
                    <h3 className="modal-section-title">Subtasks</h3>
                    <div className="modal-field-full">
                      <div className="subtasks-container">
                        <div className="subtasks-header">
                          <span className="subtasks-title">
                            Subtasks (
                            {getSubtaskProgress(editIssue.subtasks).completed}/
                            {getSubtaskProgress(editIssue.subtasks).total})
                          </span>
                          {editIssue.subtasks &&
                            editIssue.subtasks.length > 0 && (
                              <div className="subtask-progress-bar">
                                <div
                                  className="subtask-progress-fill"
                                  style={{
                                    width: `${getSubtaskProgress(editIssue.subtasks).percentage}%`,
                                  }}
                                ></div>
                              </div>
                            )}
                        </div>

                        <div className="subtasks-list">
                          {editIssue.subtasks &&
                          editIssue.subtasks.length > 0 ? (
                            editIssue.subtasks.map((subtask) => (
                              <div key={subtask.id} className="subtask-item">
                                <label className="subtask-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={subtask.completed}
                                    onChange={() => toggleSubtask(subtask.id)}
                                  />
                                  <span
                                    className={`subtask-text ${subtask.completed ? "completed" : ""}`}
                                  >
                                    {subtask.title}
                                  </span>
                                </label>
                                <button
                                  className="subtask-delete-btn"
                                  onClick={() => deleteSubtask(subtask.id)}
                                  title="Delete subtask"
                                >
                                  ✕
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="no-subtasks">
                              No subtasks added yet
                            </div>
                          )}
                        </div>

                        <div className="add-subtask">
                          <input
                            type="text"
                            className="subtask-input"
                            placeholder="Add a new subtask..."
                            value={newSubtaskText}
                            onChange={(e) => setNewSubtaskText(e.target.value)}
                            onKeyPress={handleSubtaskKeyPress}
                          />
                          <button
                            className="add-subtask-btn"
                            onClick={addSubtask}
                            disabled={!newSubtaskText.trim()}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-section">
                    <h3 className="modal-section-title">Comments</h3>
                    <div className="modal-field-full">
                      <textarea
                        className="modal-textarea"
                        rows="3"
                        value={editIssue.comments}
                        onChange={(e) =>
                          handleUpdateField("comments", e.target.value)
                        }
                        placeholder="Add comments..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-reset" onClick={handleReset}>
                  Reset Changes
                </button>
                <div className="modal-actions-right">
                  <button
                    className="modal-delete-btn"
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this issue?",
                        )
                      ) {
                        await deleteIssueAPI(selectedIssue.id);
                        const refreshed = await listIssues(projectId);
                        setIssues(refreshed);
                        setSelectedIssue(null);
                      }
                    }}
                  >
                    Delete Issue
                  </button>
                  <button className="btn-save" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline CSS styles */}
      <style>{`

  body {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
    background-color: #D0F0F4;
    margin: 0;
    padding: 16px;
  }
  .board-wrap {
    max-width: 100%;
    overflow-x: auto;
  }
  .project-header {
    background: #dbeafe;
    border-radius: 8px;
    padding: 20px 24px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border-left: 4px solid #1976d2;
  }
  .project-title {
    margin: 0 0 12px 0;
    font-size: 28px;
    font-weight: 700;
    color: #172b4d;
    line-height: 1.2;
  }
  .project-stats {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }
  .project-stat {
    background: #dbeafe;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
    color: #5e6c84;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .project-stat:before {
    content: "•";
    color: #1976d2;
    font-weight: bold;
  }
  @media (min-width: 768px) {
    .swimlane {
      background: #dbeafe;
      border-radius: 8px;
      margin-bottom: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .kanban-row {
      display: flex;
      padding: 16px;
      gap: 12px;
      overflow-x: auto;
    }
    .kanban-column {
      flex: 0 0 260px;
      background: #f5f6f8;
      border-radius: 6px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      border: 1px solid #dfe5e5;
      user-select: none;
      min-height: 400px;
    }
  }
  @media (max-width: 767px) {
    body {
      padding: 8px;
    }
    .project-header {
      padding: 16px;
      margin-bottom: 16px;
      border-left-width: 3px;
    }
    .project-title {
      font-size: 22px;
      margin-bottom: 10px;
    }
    .project-stats {
      gap: 12px;
    }
    .project-stat {
      font-size: 12px;
      padding: 4px 10px;
    }
    .mobile-swimlane-selector {
      margin-bottom: 16px;
      position: sticky;
      top: 0;
      background: white;
      padding: 12px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 100;
    }
    .mobile-select {
      width: 100%;
      padding: 12px;
      border: 1px solid #dfe5e5;
      border-radius: 6px;
      font-size: 16px;
      background: white;
    }
    .swimlane {
      background: #dbeafe;
      border-radius: 8px;
      margin-bottom: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .swimlane-header {
      display: flex;
      align-items: center;
      padding: 12px;
      background: #fafbfc;
      border-bottom: 1px solid #dfe5e5;
      font-weight: 600;
      font-size: 14px;
      color: #172b4d;
      position: relative;
    }
    .mobile-swimlane-toggle {
      background:#dbeafe;
      border: none;
      font-size: 16px;
      color: #5e6c84;
      margin-left: auto;
      padding: 4px 8px;
    }
    .kanban-row.mobile-view {
      display: block;
      padding: 8px;
      overflow-x: auto;
      white-space: nowrap;
    }
    .kanban-column.mobile-column {
      display: inline-block;
      vertical-align: top;
      width: 280px;
      margin-right: 8px;
      background: #dbeafe;
      border-radius: 6px;
      padding: 8px;
      border: 1px solid #dfe5e5;
      user-select: none;
      min-height: 300px;
    }
    .col-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 6px;
    }
    .col-title {
      font-weight: 600;
      font-size: 11px;
      color: #5e6c84;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      flex-grow: 1;
    }
    .card-item {
      background: #dbeafe;
      border-radius: 6px;
      padding: 10px;
      box-shadow: 0 0 2px rgba(0,0,0,0.1);
      cursor: pointer;
      user-select: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
      border: 1px solid #dfe5e5;
      margin-bottom: 8px;
    }
    .card-title {
      font-weight: 600;
      font-size: 13px;
      color: #2b3a59;
      line-height: 1.3;
    }
    .card-meta {
      display: flex;
      gap: 6px;
      font-size: 10px;
      color: #6b7c93;
      align-items: center;
      flex-wrap: wrap;
    }
    .modal.mobile-modal {
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }
    .modal-content.mobile-modal-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow-y: auto;
    }
    .modal-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .modal-field input, .modal-field textarea, .modal-field select {
      padding: 10px;
      font-size: 16px;
    }
    .modal-actions {
      display: flex;
      gap: 8px;
      justify-content: space-between;
      margin-top: 16px;
    }
    .modal-actions button {
      flex: 1;
      padding: 12px;
      font-size: 16px;
    }
  }

  /* Card Styles */
  .card-item {
    background: #dbeafe;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 0 2px rgba(0,0,0,0.1);
    cursor: pointer;
    user-select: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid #dfe5e5;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .card-item:hover {
    box-shadow: 0px 2px 10px rgba(0,0,0,0.15);
    border-color: #a2adba;
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  .card-tag {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .card-tag-task { background: #e3f2fd; color: #1976d2; }
  .card-tag-subtask { background: #f3e5f5; color: #7b1fa2; }
  .card-tag-bug { background: #dbeafe; color: #d32f2f; }

  .card-id {
    font-size: 10px;
    color: #6b7c93;
    font-family: 'Monaco', 'Menlo', monospace;
    font-weight: 600;
  }

  .card-title {
    font-weight: 600;
    font-size: 14px;
    color: #2b3a59;
    line-height: 1.3;
    margin: 0;
    word-break: break-word;
  }

  .card-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .card-assignee {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #5e6c84;
    font-weight: 500;
  }

  .card-due {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #d32f2f;
    font-weight: 500;
  }

  .card-priority {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    width: fit-content;
  }

  .card-priority.high { background: #ffebee; color: #d32f2f; }
  .card-priority.medium { background: #fff3e0; color: #f57c00; }
  .card-priority.low { background: #e8f5e8; color: #388e3c; }

  /* Modal Subtasks Styles */
  .subtasks-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .subtasks-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .subtasks-title {
    font-size: 14px;
    font-weight: 600;
    color: #44546f;
  }

  .subtasks-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 200px;
    overflow-y: auto;
  }

  .subtask-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: #dbeafe;
    border-radius: 6px;
    border: 1px solid #e1e4e8;
    transition: background-color 0.2s;
  }

  .subtask-item:hover {
    background: #f1f2f4;
  }

  .subtask-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    cursor: pointer;
    margin: 0;
  }

  .subtask-checkbox input[type="checkbox"] {
    margin: 0;
    cursor: pointer;
  }

  .subtask-text {
    font-size: 14px;
    color: #44546f;
    transition: all 0.2s;
  }

  .subtask-text.completed {
    text-decoration: line-through;
    color: #8b9cb1;
  }

  .subtask-delete-btn {
    background: none;
    border: none;
    color: #d32f2f;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    font-size: 12px;
    transition: background-color 0.2s;
  }

  .subtask-delete-btn:hover {
    background: #ffebee;
  }

  .no-subtasks {
    text-align: center;
    color: #8b9cb1;
    font-style: italic;
    padding: 16px;
    font-size: 14px;
  }

  .add-subtask {
    display: flex;
    gap: 8px;
  }

  .subtask-input {
    flex: 1;
    padding: 8px 12px;
    border: 2px solid #dfe1e6;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
  }

  .subtask-input:focus {
    outline: none;
    border-color: #1976d2;
  }

  .add-subtask-btn {
    padding: 8px 16px;
    background: #1976d2;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .add-subtask-btn:hover:not(:disabled) {
    background: #1565c0;
  }

  .add-subtask-btn:disabled {
    background: #b0bec5;
    cursor: not-allowed;
  }

  /* Enhanced Modal Styles - Centered Positioning */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
  }

  .modal-container {
    max-width: 1000px;
    max-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
  position: fixed;
  // top: 0;
  left: 400px;
  width: 900px;
  height: 100%;
  z-index: 999; 
  }

.file-upload-container {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: Arial, sans-serif;
}

.file-upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #007bff;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  border: none;
  transition: background-color 0.25s ease;
}

.file-upload-btn:hover {
  background-color: #0056b3;
}

.btn-icon {
  font-size: 20px;
}

#profileFile {
  display: inline-block;
  margin-left: 10px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
}

  .modal {
    background: white;
    border-radius: 12px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    margin: 0 auto;
    transition: box-shadow 0.2s ease;
  }

  .modal-dragging {
    box-shadow: 0 25px 80px rgba(0,0,0,0.4);
    cursor: grabbing;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 1px solid #e1e4e8;
    flex-shrink: 0;
    cursor: grab;
    transition: background-color 0.2s ease;
  }

  .modal-header:hover {
    background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  }

  .modal-dragging .modal-header {
    cursor: grabbing;
    background: linear-gradient(135deg, #dee2e6 0%, #ced4da 100%);
  }

  .modal-header-content {
    flex: 1;
    min-width: 0;
  }

  .modal-epic-badge {
    display: inline-block;
    background: #1976d2;
    color: white;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .modal-title {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 700;
    color: #172b4d;
    line-height: 1.3;
    word-wrap: break-word;
  }

  .modal-id-type {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .modal-id {
    font-size: 14px;
    color: #5e6c84;
    font-family: 'Monaco', 'Menlo', monospace;
  }

  .modal-type {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .modal-type-task { background: #e3f2fd; color: #1976d2; }
  .modal-type-subtask { background: #f3e5f5; color: #7b1fa2; }
  .modal-type-bug { background: #ffebee; color: #d32f2f; }

  .modal-close-btn {
    background: none;
    border: none;
    font-size: 20px;
    color: #5e6c84;
    cursor: pointer;
    padding: 8px;
    margin: -8px;
    border-radius: 4px;
    transition: background-color 0.2s;
    flex-shrink: 0;
  }

  .modal-close-btn:hover {
    background: rgba(0,0,0,0.1);
  }

  .modal-content-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 0 24px;
  }

  .modal-content {
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .modal-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .modal-section-title {
    font-size: 18px;
    font-weight: 600;
    color: #172b4d;
    margin: 0;
    padding-bottom: 8px;
    border-bottom: 2px solid #f0f0f0;
  }

  .modal-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }

  .modal-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .modal-field-full {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .modal-label {
    font-size: 14px;
    font-weight: 600;
    color: #44546f;
    margin: 0;
  }

  .modal-input, .modal-select, .modal-textarea {
    padding: 12px;
    border: 2px solid #dfe1e6;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
    background: white;
  }

  .modal-input:focus, .modal-select:focus, .modal-textarea:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
  }

  .modal-input-disabled {
    background: #f8f9fa;
    color: #6b778c;
    cursor: not-allowed;
  }

  .modal-textarea {
    resize: vertical;
    min-height: 80px;
    line-height: 1.5;
  }

  .modal-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: #f8f9fa;
    border-top: 1px solid #e1e4e8;
    gap: 16px;
    flex-shrink: 0;
  }

  .modal-actions-right {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .btn-reset {
    padding: 10px 20px;
    border: 1px solid #dcdfe4;
    background: white;
    color: #44546f;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-reset:hover {
    background: #f1f2f4;
    border-color: #c1c7d0;
  }

  .btn-save {
    padding: 10px 24px;
    border: none;
    background: #1976d2;
    color: white;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-save:hover {
    background: #1565c0;
  }

  .modal-delete-btn {
    padding: 10px 20px;
    border: 1px solid #ffcdd2;
    background: white;
    color: #d32f2f;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .modal-delete-btn:hover {
    background: #ffebee;
    border-color: #ef5350;
  }

  @media (max-width: 767px) {
    .modal-overlay {
      padding: 10px;
    }
    
    .modal-container.mobile-modal-container {
      width: 100%;
      height: 100%;
      padding: 0;
    }

    .modal.mobile-modal {
      width: 100%;
      max-height: 100%;
      border-radius: 0;
      margin: 0;
    }

    .modal-header {
      padding: 16px;
      flex-direction: column;
      gap: 12px;
      cursor: default;
    }

    .modal-close-btn {
      align-self: flex-end;
      margin: 0;
    }

    .modal-content-scroll {
      padding: 0 16px;
    }

    .modal-content {
      padding: 16px 0;
      gap: 20px;
    }

    .modal-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .modal-actions {
      padding: 16px;
      flex-direction: column;
      gap: 12px;
    }

    .modal-actions-right {
      width: 100%;
      justify-content: space-between;
    }

    .btn-reset, .modal-delete-btn, .btn-save {
      flex: 1;
      text-align: center;
    }

    .add-subtask {
      flex-direction: column;
    }

    .subtasks-list {
      max-height: 150px;
    }
  }

  .swimlane-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: #fafbfc;
    border-bottom: 1px solid #dfe5e5;
    font-weight: 600;
    font-size: 14px;
    color: #172b4d;
  }
  .swimlane-toggle, .swimlane-icon {
    color: #5e6c84;
    margin-right: 8px;
    cursor: pointer;
  }
  .swimlane-toggle {
    border: none;
    background: transparent;
    font-size: 14px;
  }
  .swimlane-icon {
    font-size: 18px;
  }
  .swimlane-title-input {
    border: 1px solid #dfe5e5;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 14px;
    font-weight: 600;
    background: white;
    margin-right: 8px;
    min-width: 150px;
    color: #172b4d;
  }
  .swimlane-title-input:focus {
    outline: none;
    border-color: #1976d2;
  }
  .swimlane-count {
    color: #5e6c84;
    font-size: 12px;
    font-weight: normal;
  }
  .col-header {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    gap: 6px;
  }
  .col-title {
    font-weight: 600;
    font-size: 12px;
    color: #5e6c84;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex-grow: 1;
  }
  .col-count {
    background: #dfe5e5;
    color: #5e6c84;
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 600;
    min-width: 20px;
    text-align: center;
  }
  .col-icons {
    display: flex;
    gap: 6px;
  }
  .col-icon {
    cursor: pointer;
    color: #5e6c84;
    font-size: 18px;
    background: none;
    border: none;
    padding: 0;
  }
  .create-card {
    background: white;
    padding: 10px;
    border-radius: 6px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  button {
    cursor: pointer;
    transition: background-color 0.2s;
  }
  button:hover {
    opacity: 0.9;
  }
  @media (max-width: 767px) {
    button, .card-item, .col-icon {
      min-height: 44px;
      min-width: 44px;
    }
    .card-item {
      touch-action: manipulation;
    }
  }
`}</style>
    </div>
  );
}

const btnStyle = {
  cancel: {
    padding: "10px 18px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#5e6c84",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  create: {
    padding: "10px 18px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#1976d2",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  delete: {
    padding: "10px 18px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#d32f2f",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
};
