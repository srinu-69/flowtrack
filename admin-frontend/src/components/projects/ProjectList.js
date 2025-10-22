

//after the deployment

import React, { useEffect, useState } from 'react';
import { listProjects, addProject, deleteProject, updateProject } from '../../services/mockApi';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiChevronUp, FiChevronDown, FiUsers, FiCalendar } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

// Reusable input component
function InputField({ label, value, onChange, icon: Icon, placeholder, maxLength }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '0.25rem', color: '#172B4D' }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #DFE1E6', borderRadius: '4px', background: '#D0F0F4' }}>
        {Icon && <Icon style={{ marginLeft: '8px', color: '#6B778C' }} />}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  );
}

// Reusable textarea component for description
function TextAreaField({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '0.25rem', color: '#172B4D' }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #DFE1E6',
          borderRadius: '4px',
          outline: 'none',
          fontSize: '14px',
          background: '#D0F0F4',
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [type, setType] = useState('Software');
  const [leadsInput, setLeadsInput] = useState('');
  const [description, setDescription] = useState(''); // Added description state
  const [expanded, setExpanded] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editKey, setEditKey] = useState('');
  const [editType, setEditType] = useState('');
  const [editLeadsInput, setEditLeadsInput] = useState('');
  const [editDescription, setEditDescription] = useState(''); // Added edit description state

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await listProjects();
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    }
  };

  const createProject = async () => {
    if (!name.trim()) return;
    const now = new Date().toISOString();
    const p = {
      id: uuidv4(),
      key: key.toUpperCase() || 'PRJ',
      name,
      type,
      leads: leadsInput
        ? leadsInput.split(',').map(l => l.trim()).filter(l => l)
        : ['Unassigned'],
      description: description || '', // Include description
      lastUpdated: now,
      createdAt: now,
    };
    await addProject(p);
    setName('');
    setKey('');
    setLeadsInput('');
    setType('Software');
    setDescription(''); // Reset description
    loadProjects();
  };

  const removeProject = async (id) => {
    await deleteProject(id);
    loadProjects();
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditKey(p.key);
    setEditType(p.type);
    setEditLeadsInput((p.leads || []).join(', '));
    setEditDescription(p.description || ''); // Set description for editing
  };

  const saveEdit = async (id) => {
    const updated = {
      ...projects.find(p => p.id === id),
      name: editName,
      key: editKey,
      type: editType,
      leads: editLeadsInput
        ? editLeadsInput.split(',').map(l => l.trim()).filter(l => l)
        : ['Unassigned'],
      description: editDescription, // Save description
      lastUpdated: new Date().toISOString(),
    };
    await updateProject(id, updated);
    setEditingId(null);
    loadProjects();
  };

  // Safe function to get leads for display
  const getLeadsDisplay = (project) => {
    if (!project.leads || !Array.isArray(project.leads)) {
      return 'Unassigned';
    }
    return project.leads.join(', ');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar create project form */}
      <div style={{ width: '320px', borderRight: '1px solid #DFE1E6', padding: '1rem', background: '#D0F0F4', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '1rem' }}>Create Project</h2>

        <InputField label="Project Name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter project name" />
        <InputField label="Project Key" value={key} onChange={e => setKey(e.target.value)} placeholder="e.g. PROJ" maxLength={10} />
        <InputField label="Project Type" value={type} onChange={e => setType(e.target.value)} placeholder="Software, Business..." />
        <InputField label="Leads (comma separated)" value={leadsInput} onChange={e => setLeadsInput(e.target.value)} placeholder="John Doe, Jane Smith" icon={FiUsers} />
        
        {/* Added Description Field */}
        <TextAreaField 
          label="Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="Enter project description (optional)"
          rows={4}
        />

        <button
          onClick={createProject}
          style={{
            width: '100%',
            background: '#0052CC',
            color: 'white',
            padding: '8px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Create Project
        </button>
      </div>

      {/* Main project list */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '1.5rem' }}>Projects</h2>

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {(projects || []).map(p => (
            <div
              key={p.id}
              style={{
                background: '#D0F0F4',
                border: '1px solid #DFE1E6',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {editingId === p.id ? (
                <>
                  <InputField label="Name" value={editName} onChange={e => setEditName(e.target.value)} />
                  <InputField label="Key" value={editKey} onChange={e => setEditKey(e.target.value)} />
                  <InputField label="Type" value={editType} onChange={e => setEditType(e.target.value)} />
                  <InputField label="Leads" value={editLeadsInput} onChange={e => setEditLeadsInput(e.target.value)} />
                  
                  {/* Added Editable Description Field */}
                  <TextAreaField 
                    label="Description" 
                    value={editDescription} 
                    onChange={e => setEditDescription(e.target.value)} 
                    placeholder="Enter project description"
                    rows={3}
                  />
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button onClick={() => saveEdit(p.id)} style={{ background: '#36B37E', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                      <FiCheck />
                    </button>
                    <button onClick={() => setEditingId(null)} style={{ background: '#FF5630', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                      <FiX />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    <Link to={`/projects/${p.id}`} style={{ color: '#0052CC', textDecoration: 'none' }}>
                      {p.name || 'Unnamed Project'}
                    </Link>
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6B778C', marginBottom: '0.5rem' }}>{p.type || 'Software'} Project</p>
                  <p style={{ fontSize: '13px', marginBottom: '0.5rem' }}>Key: {p.key || 'N/A'}</p>
                  <p style={{ fontSize: '13px', marginBottom: '0.5rem' }}>Leads: {getLeadsDisplay(p)}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => startEdit(p)} style={{ background: '#FFAB00', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                        <FiEdit2 />
                      </button>
                      <button onClick={() => removeProject(p.id)} style={{ background: '#FF5630', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                        <FiTrash2 />
                      </button>
                    </div>
                    <button onClick={() => setExpanded({ ...expanded, [p.id]: !expanded[p.id] })} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0052CC' }}>
                      {expanded[p.id] ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>

                  {expanded[p.id] && (
                    <div style={{ marginTop: '0.5rem', fontSize: '13px', color: '#172B4D' }}>
                      <p>{p.description || 'No description provided.'}</p>
                    </div>
                  )}
                </>
              )}

              {/* Metadata */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 'auto',
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #EBECF0',
                  fontSize: '12px',
                  color: '#6B778C',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiCalendar size={12} />
                  {p.createdAt ? (
                    <>Created {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}</>
                  ) : (
                    <>Created just now</>
                  )}
                </div>
                <div>
                  {p.lastUpdated ? (
                    <>Updated {formatDistanceToNow(new Date(p.lastUpdated), { addSuffix: true })}</>
                  ) : (
                    <>Updated just now</>
                  )}
                </div>
              </div>
            </div>
          ))}

          {(projects || []).length === 0 && (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '3rem 2rem',
                background: '#fff',
                borderRadius: '8px',
                border: '1px dashed #DFE1E6',
                color: '#6B778C',
              }}
            >
              <p style={{ marginBottom: '1rem' }}>No projects yet.</p>
              <p style={{ fontSize: '14px' }}>Create your first project using the form on the left.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}