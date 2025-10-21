import React, { useEffect, useState } from 'react';
import { listUsers, addUser } from '../../services/mockApi';
import { v4 as uuidv4 } from 'uuid';
import { FiUserPlus } from 'react-icons/fi';

export default function Users() {
	const [users, setUsers] = useState([]);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState('Developer');

	useEffect(() => {
		let mounted = true;
		listUsers().then((data) => mounted && setUsers(data || []));
		return () => (mounted = false);
	}, []);

	const create = async () => {
		const u = { id: uuidv4(), name, email, role };
		await addUser(u);
		setUsers(await listUsers());
		setName('');
		setEmail('');
	};

	return (
		<div className="grid" style={{ gap: 12 }}>
			<div className="card" aria-labelledby="users-title">
				<h2 id="users-title">Users</h2>
				<div className="form-row">
					<label>
						Name
						<input value={name} onChange={(e) => setName(e.target.value)} />
					</label>
				</div>
				<div className="form-row">
					<label>
						Email
						<input value={email} onChange={(e) => setEmail(e.target.value)} />
					</label>
				</div>
				<div className="form-row">
					<label>
						Role
						<select value={role} onChange={(e) => setRole(e.target.value)}>
							<option>Admin</option>
							<option>Manager</option>
							<option>Developer</option>
							<option>Reporter</option>
						</select>
					</label>
				</div>
				<button className="btn" onClick={create} style={{ marginTop: 8 }}>
					<FiUserPlus style={{ verticalAlign: 'middle', marginRight: 6 }} />
					Create user
				</button>
			</div>

			<div className="card" aria-labelledby="users-list-title">
				<h2 id="users-list-title">All users</h2>
				<table className="table" role="table" aria-label="Users table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Role</th>
						</tr>
					</thead>
					<tbody>
						{users.map((u) => (
							<tr key={u.id}>
								<td>{u.name}</td>
								<td>{u.email}</td>
								<td>{u.role}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

// for responsive is ok

// import React, { useEffect, useState } from 'react';
// import { listUsers, addUser, updateUser, deleteUser } from '../../services/mockApi';
// import { v4 as uuidv4 } from 'uuid';
// import { FiUserPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiSearch } from 'react-icons/fi';

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [role, setRole] = useState('Developer');
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     listUsers().then(setUsers);
//   }, []);

//   const create = async () => {
//     if (!name || !email) return;
//     const u = { id: uuidv4(), name, email, role };
//     await addUser(u);
//     setUsers(await listUsers());
//     setName('');
//     setEmail('');
//   };

//   const startEdit = (u) => {
//     setEditingId(u.id);
//     setEditForm({ name: u.name, email: u.email, role: u.role });
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditForm({ name: '', email: '', role: '' });
//   };

//   const saveEdit = async (id) => {
//     await updateUser({ id, ...editForm });
//     setUsers(await listUsers());
//     cancelEdit();
//   };

//   const remove = async (id) => {
//     await deleteUser(id);
//     setUsers(await listUsers());
//   };

//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.role.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="users-container">
//       {/* Header Section */}
//       <div className="users-header">
//         <h1 className="users-title">User Management</h1>
//         <p className="users-subtitle">Manage your team members and their roles</p>
//       </div>

//       <div className="users-grid">
//         {/* User creation form */}
//         <div className="users-form-card glassmorphism" aria-labelledby="users-form-title">
//           <div className="card-header">
//             <h2 id="users-form-title" className="card-title">
//               <FiUserPlus className="icon-spacing" />
//               Add New User
//             </h2>
//           </div>

//           <div className="form-grid">
//             <div className="input-group">
//               <label className="input-label">Full Name</label>
//               <input
//                 className="modern-input"
//                 value={name}
//                 onChange={e => setName(e.target.value)}
//                 placeholder="Enter full name"
//               />
//             </div>

//             <div className="input-group">
//               <label className="input-label">Email Address</label>
//               <input
//                 className="modern-input"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 placeholder="Enter email address"
//                 type="email"
//               />
//             </div>

//             <div className="input-group">
//               <label className="input-label">Role</label>
//               <select className="modern-select" value={role} onChange={e => setRole(e.target.value)}>
//                 <option>Admin</option>
//                 <option>Manager</option>
//                 <option>Developer</option>
//                 <option>Reporter</option>
//               </select>
//             </div>
//           </div>

//           <button className="create-btn" onClick={create}>
//             <FiUserPlus className="btn-icon" />
//             Create User
//           </button>
//         </div>

//         {/* User list section */}
//         <div className="users-list-card glassmorphism" aria-labelledby="users-list-title">
//           <div className="card-header">
//             <h2 id="users-list-title" className="card-title">Team Members ({filteredUsers.length})</h2>
//             <div className="search-container">
//               <FiSearch className="search-icon" />
//               <input
//                 type="text"
//                 className="search-input"
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="table-container">
//             <table className="modern-table" role="table" aria-label="Users table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Role</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map(u => (
//                   <tr key={u.id} className={editingId === u.id ? 'editing-row' : ''}>
//                     {editingId === u.id ? (
//                       <>
//                         <td>
//                           <input
//                             className="edit-input"
//                             value={editForm.name}
//                             onChange={e => setEditForm({ ...editForm, name: e.target.value })}
//                           />
//                         </td>
//                         <td>
//                           <input
//                             className="edit-input"
//                             value={editForm.email}
//                             onChange={e => setEditForm({ ...editForm, email: e.target.value })}
//                           />
//                         </td>
//                         <td>
//                           <select
//                             className="edit-select"
//                             value={editForm.role}
//                             onChange={e => setEditForm({ ...editForm, role: e.target.value })}
//                           >
//                             <option>Admin</option>
//                             <option>Manager</option>
//                             <option>Developer</option>
//                             <option>Reporter</option>
//                           </select>
//                         </td>
//                         <td>
//                           <div className="action-buttons">
//                             <button onClick={() => saveEdit(u.id)} className="btn-success" title="Save">
//                               <FiCheck />
//                             </button>
//                             <button onClick={cancelEdit} className="btn-cancel" title="Cancel">
//                               <FiX />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     ) : (
//                       <>
//                         <td>
//                           <div className="user-info">
//                             <div className="avatar">{u.name.charAt(0)}</div>
//                             <span>{u.name}</span>
//                           </div>
//                         </td>
//                         <td>{u.email}</td>
//                         <td>
//                           <span className={`role-badge role-${u.role.toLowerCase()}`}>
//                             {u.role}
//                           </span>
//                         </td>
//                         <td>
//                           <div className="action-buttons">
//                             <button onClick={() => startEdit(u)} className="btn-edit" title="Edit">
//                               <FiEdit2 />
//                             </button>
//                             <button onClick={() => remove(u.id)} className="btn-delete" title="Delete">
//                               <FiTrash2 />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {filteredUsers.length === 0 && (
//               <div className="empty-state">
//                 <p>No users found{searchTerm && ` matching "${searchTerm}"`}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .users-container {
//           min-height: 100vh;
//           background: "white";
//           padding: 20px;
//         }

//         .users-header {
//           text-align: center;
//           margin-bottom: 40px;
//           color: white;
//         }

//         .users-title {
//           font-size: 2.5rem;
//           font-weight: 700;
//           margin-bottom: 8px;
//         }

//         .users-subtitle {
//           font-size: 1.1rem;
//           opacity: 0.9;
//         }

//         .users-grid {
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 30px;
//           max-width: 1400px;
//           margin: 0 auto;
//         }

//         @media (min-width: 1024px) {
//           .users-grid {
//             grid-template-columns: 400px 1fr;
//           }
//         }

//         .glassmorphism {
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(10px);
//           border-radius: 20px;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
//         }

//         .users-form-card, .users-list-card {
//           padding: 30px;
//         }

//         .card-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 30px;
//           flex-wrap: wrap;
//           gap: 15px;
//         }

//         .card-title {
//           font-size: 1.5rem;
//           font-weight: 600;
//           color: #2d3748;
//           display: flex;
//           align-items: center;
//         }

//         .icon-spacing {
//           margin-right: 10px;
//         }

//         .form-grid {
//           display: grid;
//           gap: 20px;
//           margin-bottom: 30px;
//         }

//         .input-group {
//           display: flex;
//           flex-direction: column;
//         }

//         .input-label {
//           font-weight: 500;
//           margin-bottom: 8px;
//           color: #4a5568;
//         }

//         .modern-input, .modern-select {
//           padding: 12px 16px;
//           border: 2px solid #e2e8f0;
//           border-radius: 10px;
//           font-size: 1rem;
//           transition: all 0.3s ease;
//           background: white;
//         }

//         .modern-input:focus, .modern-select:focus {
//           outline: none;
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//         }

//         .create-btn {
//           width: 100%;
//           padding: 14px;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           border: none;
//           border-radius: 10px;
//           font-size: 1rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: transform 0.2s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .create-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
//         }

//         .btn-icon {
//           margin-right: 8px;
//         }

//         .search-container {
//           position: relative;
//           min-width: 250px;
//         }

//         .search-input {
//           padding: 12px 16px 12px 40px;
//           border: 2px solid #e2e8f0;
//           border-radius: 10px;
//           font-size: 1rem;
//           width: 100%;
//           transition: all 0.3s ease;
//         }

//         .search-input:focus {
//           outline: none;
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//         }

//         .search-icon {
//           position: absolute;
//           left: 12px;
//           top: 50%;
//           transform: translateY(-50%);
//           color: #a0aec0;
//         }

//         .table-container {
//           overflow-x: auto;
//           border-radius: 10px;
//         }

//         .modern-table {
//           width: 100%;
//           border-collapse: collapse;
//           min-width: 600px;
//         }

//         .modern-table th {
//           background: #f7fafc;
//           padding: 16px;
//           text-align: left;
//           font-weight: 600;
//           color: #4a5568;
//           border-bottom: 2px solid #e2e8f0;
//         }

//         .modern-table td {
//           padding: 16px;
//           border-bottom: 1px solid #e2e8f0;
//         }

//         .modern-table tr:hover {
//           background: #f7fafc;
//         }

//         .editing-row {
//           background: #fff9e6 !important;
//         }

//         .user-info {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-weight: 600;
//           font-size: 1.1rem;
//         }

//         .role-badge {
//           padding: 6px 12px;
//           border-radius: 20px;
//           font-size: 0.85rem;
//           font-weight: 500;
//         }

//         .role-admin { background: #fed7d7; color: #c53030; }
//         .role-manager { background: #feebc8; color: #d69e2e; }
//         .role-developer { background: #c6f6d5; color: #276749; }
//         .role-reporter { background: #e9d8fd; color: #6b46c1; }

//         .action-buttons {
//           display: flex;
//           gap: 8px;
//         }

//         .btn-edit, .btn-delete, .btn-success, .btn-cancel {
//           padding: 8px;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .btn-edit {
//           background: #e6fffa;
//           color: #234e52;
//         }

//         .btn-edit:hover {
//           background: #b2f5ea;
//         }

//         .btn-delete {
//           background: #fed7d7;
//           color: #c53030;
//         }

//         .btn-delete:hover {
//           background: #feb2b2;
//         }

//         .btn-success {
//           background: #c6f6d5;
//           color: #276749;
//         }

//         .btn-success:hover {
//           background: #9ae6b4;
//         }

//         .btn-cancel {
//           background: #fed7d7;
//           color: #c53030;
//         }

//         .btn-cancel:hover {
//           background: #feb2b2;
//         }

//         .edit-input, .edit-select {
//           padding: 8px 12px;
//           border: 2px solid #e2e8f0;
//           border-radius: 6px;
//           width: 100%;
//           font-size: 0.9rem;
//         }

//         .edit-input:focus, .edit-select:focus {
//           outline: none;
//           border-color: #667eea;
//         }

//         .empty-state {
//           text-align: center;
//           padding: 40px;
//           color: #a0aec0;
//           font-style: italic;
//         }

//         @media (max-width: 768px) {
//           .users-container {
//             padding: 10px;
//           }

//           .users-title {
//             font-size: 2rem;
//           }

//           .users-form-card, .users-list-card {
//             padding: 20px;
//           }

//           .card-header {
//             flex-direction: column;
//             align-items: stretch;
//           }

//           .search-container {
//             min-width: auto;
//           }

//           .modern-table {
//             font-size: 0.9rem;
//           }

//           .modern-table th,
//           .modern-table td {
//             padding: 12px 8px;
//           }

//           .action-buttons {
//             flex-direction: column;
//           }
//         }

//         @media (max-width: 480px) {
//           .users-title {
//             font-size: 1.75rem;
//           }

//           .card-title {
//             font-size: 1.25rem;
//           }

//           .user-info {
//             flex-direction: column;
//             gap: 6px;
//             text-align: center;
//           }

//           .avatar {
//             width: 32px;
//             height: 32px;
//             font-size: 0.9rem;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// import React, { useEffect, useState } from 'react';
// import { listUsers, addUser, updateUser, deleteUser } from '../../services/mockApi';
// import { v4 as uuidv4 } from 'uuid';
// import { FiUserPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiSearch } from 'react-icons/fi';

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [role, setRole] = useState('Developer');
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     listUsers().then(setUsers);
//   }, []);

//   const create = async () => {
//     if (!name || !email) return;
//     const u = { id: uuidv4(), name, email, role };
//     await addUser(u);
//     setUsers(await listUsers());
//     setName('');
//     setEmail('');
//   };

//   const startEdit = (u) => {
//     setEditingId(u.id);
//     setEditForm({ name: u.name, email: u.email, role: u.role });
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditForm({ name: '', email: '', role: '' });
//   };

//   const saveEdit = async (id) => {
//     console.log("Saving user:", id, editForm);
//     await updateUser(id, editForm);   // ✅ fixed: send id + patch separately
//     setUsers(await listUsers());
//     cancelEdit();
//   };

//   const remove = async (id) => {
//     await deleteUser(id);
//     setUsers(await listUsers());
//   };

//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.role.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="users-container">
//       {/* Header Section */}
//       <div className="users-header">
//         <h1 className="users-title">User Management</h1>
//         <p className="users-subtitle">Manage your team members and their roles</p>
//       </div>

//       <div className="users-grid">
//         {/* User creation form */}
//         <div className="users-form-card glassmorphism" aria-labelledby="users-form-title">
//           <div className="card-header">
//             <h2 id="users-form-title" className="card-title">
//               <FiUserPlus className="icon-spacing" />
//               Add New User
//             </h2>
//           </div>

//           <div className="form-grid">
//             <div className="input-group">
//               <label className="input-label">Full Name</label>
//               <input
//                 className="modern-input"
//                 value={name}
//                 onChange={e => setName(e.target.value)}
//                 placeholder="Enter full name"
//               />
//             </div>

//             <div className="input-group">
//               <label className="input-label">Email Address</label>
//               <input
//                 className="modern-input"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 placeholder="Enter email address"
//                 type="email"
//               />
//             </div>

//             <div className="input-group">
//               <label className="input-label">Role</label>
//               <select className="modern-select" value={role} onChange={e => setRole(e.target.value)}>
//                 <option>Admin</option>
//                 <option>Manager</option>
//                 <option>Developer</option>
//                 <option>Reporter</option>
//               </select>
//             </div>
//           </div>

//           <button className="create-btn" onClick={create}>
//             <FiUserPlus className="btn-icon" />
//             Create User
//           </button>
//         </div>

//         {/* User list section */}
//         <div className="users-list-card glassmorphism" aria-labelledby="users-list-title">
//           <div className="card-header">
//             <h2 id="users-list-title" className="card-title">Team Members ({filteredUsers.length})</h2>
//             <div className="search-container">
//               <FiSearch className="search-icon" />
//               <input
//                 type="text"
//                 className="search-input"
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="table-container">
//             <table className="modern-table" role="table" aria-label="Users table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Role</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map(u => (
//                   <tr key={u.id} className={editingId === u.id ? 'editing-row' : ''}>
//                     {editingId === u.id ? (
//                       <>
//                         <td>
//                           <input
//                             className="edit-input"
//                             value={editForm.name}
//                             onChange={e => setEditForm({ ...editForm, name: e.target.value })}
//                           />
//                         </td>
//                         <td>
//                           <input
//                             className="edit-input"
//                             value={editForm.email}
//                             onChange={e => setEditForm({ ...editForm, email: e.target.value })}
//                           />
//                         </td>
//                         <td>
//                           <select
//                             className="edit-select"
//                             value={editForm.role}
//                             onChange={e => setEditForm({ ...editForm, role: e.target.value })}
//                           >
//                             <option>Admin</option>
//                             <option>Manager</option>
//                             <option>Developer</option>
//                             <option>Reporter</option>
//                           </select>
//                         </td>
//                         <td>
//                           <div className="action-buttons">
//                             <button onClick={() => saveEdit(u.id)} className="btn-success" title="Save">
//                               <FiCheck />
//                             </button>
//                             <button onClick={cancelEdit} className="btn-cancel" title="Cancel">
//                               <FiX />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     ) : (
//                       <>
//                         <td>
//                           <div className="user-info">
//                             <div className="avatar">{u.name.charAt(0)}</div>
//                             <span>{u.name}</span>
//                           </div>
//                         </td>
//                         <td>{u.email}</td>
//                         <td>
//                           <span className={`role-badge role-${u.role.toLowerCase()}`}>
//                             {u.role}
//                           </span>
//                         </td>
//                         <td>
//                           <div className="action-buttons">
//                             <button onClick={() => startEdit(u)} className="btn-edit" title="Edit">
//                               <FiEdit2 />
//                             </button>
//                             <button onClick={() => remove(u.id)} className="btn-delete" title="Delete">
//                               <FiTrash2 />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {filteredUsers.length === 0 && (
//               <div className="empty-state">
//                 <p>No users found{searchTerm && ` matching "${searchTerm}"`}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* keep your CSS-in-JSX here */}
//       <style jsx>{`
//         .users-container {
//           min-height: 100vh;
//           background: "white";
//           padding: 20px;
//         }

//         .users-header {
//           text-align: center;
//           margin-bottom: 40px;
//           color: white;
//         }

//         .users-title {
//           font-size: 2.5rem;
//           font-weight: 700;
//           margin-bottom: 8px;
//         }

//         .users-subtitle {
//           font-size: 1.1rem;
//           opacity: 0.9;
//         }

//         .users-grid {
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 30px;
//           max-width: 1400px;
//           margin: 0 auto;
//         }

//         @media (min-width: 1024px) {
//           .users-grid {
//             grid-template-columns: 400px 1fr;
//           }
//         }

//         .glassmorphism {
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(10px);
//           border-radius: 20px;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
//         }

//         .users-form-card, .users-list-card {
//           padding: 30px;
//         }

//         .card-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 30px;
//           flex-wrap: wrap;
//           gap: 15px;
//         }

//         .card-title {
//           font-size: 1.5rem;
//           font-weight: 600;
//           color: #2d3748;
//           display: flex;
//           align-items: center;
//         }

//         .icon-spacing {
//           margin-right: 10px;
//         }

//         .form-grid {
//           display: grid;
//           gap: 20px;
//           margin-bottom: 30px;
//         }

//         .input-group {
//           display: flex;
//           flex-direction: column;
//         }

//         .input-label {
//           font-weight: 500;
//           margin-bottom: 8px;
//           color: #4a5568;
//         }

//         .modern-input, .modern-select {
//           padding: 12px 16px;
//           border: 2px solid #e2e8f0;
//           border-radius: 10px;
//           font-size: 1rem;
//           transition: all 0.3s ease;
//           background: white;
//         }

//         .modern-input:focus, .modern-select:focus {
//           outline: none;
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//         }

//         .create-btn {
//           width: 100%;
//           padding: 14px;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           border: none;
//           border-radius: 10px;
//           font-size: 1rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: transform 0.2s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .create-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
//         }

//         .btn-icon {
//           margin-right: 8px;
//         }

//         .search-container {
//           position: relative;
//           min-width: 250px;
//         }

//         .search-input {
//           padding: 12px 16px 12px 40px;
//           border: 2px solid #e2e8f0;
//           border-radius: 10px;
//           font-size: 1rem;
//           width: 100%;
//           transition: all 0.3s ease;
//         }

//         .search-input:focus {
//           outline: none;
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//         }

//         .search-icon {
//           position: absolute;
//           left: 12px;
//           top: 50%;
//           transform: translateY(-50%);
//           color: #a0aec0;
//         }

//         .table-container {
//           overflow-x: auto;
//           border-radius: 10px;
//         }

//         .modern-table {
//           width: 100%;
//           border-collapse: collapse;
//           min-width: 600px;
//         }

//         .modern-table th {
//           background: #f7fafc;
//           padding: 16px;
//           text-align: left;
//           font-weight: 600;
//           color: #4a5568;
//           border-bottom: 2px solid #e2e8f0;
//         }

//         .modern-table td {
//           padding: 16px;
//           border-bottom: 1px solid #e2e8f0;
//         }

//         .modern-table tr:hover {
//           background: #f7fafc;
//         }

//         .editing-row {
//           background: #fff9e6 !important;
//         }

//         .user-info {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-weight: 600;
//           font-size: 1.1rem;
//         }

//         .role-badge {
//           padding: 6px 12px;
//           border-radius: 20px;
//           font-size: 0.85rem;
//           font-weight: 500;
//         }

//         .role-admin { background: #fed7d7; color: #c53030; }
//         .role-manager { background: #feebc8; color: #d69e2e; }
//         .role-developer { background: #c6f6d5; color: #276749; }
//         .role-reporter { background: #e9d8fd; color: #6b46c1; }

//         .action-buttons {
//           display: flex;
//           gap: 8px;
//         }

//         .btn-edit, .btn-delete, .btn-success, .btn-cancel {
//           padding: 8px;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .btn-edit {
//           background: #e6fffa;
//           color: #234e52;
//         }

//         .btn-edit:hover {
//           background: #b2f5ea;
//         }

//         .btn-delete {
//           background: #fed7d7;
//           color: #c53030;
//         }

//         .btn-delete:hover {
//           background: #feb2b2;
//         }

//         .btn-success {
//           background: #c6f6d5;
//           color: #276749;
//         }

//         .btn-success:hover {
//           background: #9ae6b4;
//         }

//         .btn-cancel {
//           background: #fed7d7;
//           color: #c53030;
//         }

//         .btn-cancel:hover {
//           background: #feb2b2;
//         }

//         .edit-input, .edit-select {
//           padding: 8px 12px;
//           border: 2px solid #e2e8f0;
//           border-radius: 6px;
//           width: 100%;
//           font-size: 0.9rem;
//         }

//         .edit-input:focus, .edit-select:focus {
//           outline: none;
//           border-color: #667eea;
//         }

//         .empty-state {
//           text-align: center;
//           padding: 40px;
//           color: #a0aec0;
//           font-style: italic;
//         }

//         @media (max-width: 768px) {
//           .users-container {
//             padding: 10px;
//           }

//           .users-title {
//             font-size: 2rem;
//           }

//           .users-form-card, .users-list-card {
//             padding: 20px;
//           }

//           .card-header {
//             flex-direction: column;
//             align-items: stretch;
//           }

//           .search-container {
//             min-width: auto;
//           }

//           .modern-table {
//             font-size: 0.9rem;
//           }

//           .modern-table th,
//           .modern-table td {
//             padding: 12px 8px;
//           }

//           .action-buttons {
//             flex-direction: column;
//           }
//         }

//         @media (max-width: 480px) {
//           .users-title {
//             font-size: 1.75rem;
//           }

//           .card-title {
//             font-size: 1.25rem;
//           }

//           .user-info {
//             flex-direction: column;
//             gap: 6px;
//             text-align: center;
//           }

//           .avatar {
//             width: 32px;
//             height: 32px;
//             font-size: 0.9rem;
//           }
//         }
//       }</style>

//     </div>

//   );
// }

// import React, { useEffect, useState } from 'react';
// import { listUsers, addUser, updateUser, deleteUser } from '../../services/mockApi';
// import { v4 as uuidv4 } from 'uuid';
// import { FiUserPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiSearch } from 'react-icons/fi';

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [role, setRole] = useState('Developer');
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     listUsers().then(setUsers);
//   }, []);

//   const create = async () => {
//     if (!name || !email) return;
//     const u = { id: uuidv4(), name, email, role };
//     await addUser(u);
//     setUsers(await listUsers());
//     setName('');
//     setEmail('');
//   };

//   const startEdit = (u) => {
//     setEditingId(u.id);
//     setEditForm({ name: u.name, email: u.email, role: u.role });
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditForm({ name: '', email: '', role: '' });
//   };

//   const saveEdit = async (id) => {
//     await updateUser(id, editForm);
//     setUsers(await listUsers());
//     cancelEdit();
//   };

//   const remove = async (id) => {
//     await deleteUser(id);
//     setUsers(await listUsers());
//   };

//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.role.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="users-container">
//       {/* Header Section */}
//       <div className="users-header">
//         <h1 className="users-title">User Management</h1>
//         <p className="users-subtitle">Manage your team members and their roles</p>
//       </div>

//       <div className="users-grid">
//         {/* User creation form */}
//         <div className="users-form-card glassmorphism" aria-labelledby="users-form-title">
//           <div className="card-header">
//             <h2 id="users-form-title" className="card-title">
//               <FiUserPlus className="icon-spacing" />
//               Add New User
//             </h2>
//           </div>

//           <div className="form-grid">
//             <div className="input-group">
//               <label className="input-label">Full Name</label>
//               <input
//                 className="modern-input"
//                 value={name}
//                 onChange={e => setName(e.target.value)}
//                 placeholder="Enter full name"
//               />
//             </div>

//             <div className="input-group">
//               <label className="input-label">Email Address</label>
//               <input
//                 className="modern-input"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 placeholder="Enter email address"
//                 type="email"
//               />
//             </div>

//             <div className="input-group">
//               <label className="input-label">Role</label>
//               <select className="modern-select" value={role} onChange={e => setRole(e.target.value)}>
//                 <option>Admin</option>
//                 <option>Manager</option>
//                 <option>Developer</option>
//                 <option>Reporter</option>
//               </select>
//             </div>
//           </div>

//           <button className="create-btn" onClick={create}>
//             <FiUserPlus className="btn-icon" />
//             Create User
//           </button>
//         </div>

//         {/* User list section */}
//         <div className="users-list-card glassmorphism" aria-labelledby="users-list-title">
//           <div className="card-header">
//             <h2 id="users-list-title" className="card-title">Team Members ({filteredUsers.length})</h2>
//             <div className="search-container">
//               <FiSearch className="search-icon" />
//               <input
//                 type="text"
//                 className="search-input"
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="table-container">
//             <table className="modern-table" role="table" aria-label="Users table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Role</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map(u => (
//                   <tr key={u.id} className={editingId === u.id ? 'editing-row' : ''}>
//                     {editingId === u.id ? (
//                       <>
//                         <td>
//                           <input
//                             className="edit-input"
//                             value={editForm.name}
//                             onChange={e => setEditForm({ ...editForm, name: e.target.value })}
//                           />
//                         </td>
//                         <td>
//                           <input
//                             className="edit-input"
//                             value={editForm.email}
//                             onChange={e => setEditForm({ ...editForm, email: e.target.value })}
//                           />
//                         </td>
//                         <td>
//                           <select
//                             className="edit-select"
//                             value={editForm.role}
//                             onChange={e => setEditForm({ ...editForm, role: e.target.value })}
//                           >
//                             <option>Admin</option>
//                             <option>Manager</option>
//                             <option>Developer</option>
//                             <option>Reporter</option>
//                           </select>
//                         </td>
//                         <td>
//                           <div className="action-buttons">
//                             <button onClick={() => saveEdit(u.id)} className="btn-success" title="Save">
//                               <FiCheck />
//                             </button>
//                             <button onClick={cancelEdit} className="btn-cancel" title="Cancel">
//                               <FiX />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     ) : (
//                       <>
//                         <td>
//                           <div className="user-info">
//                             <div className="avatar">{u.name.charAt(0)}</div>
//                             <span>{u.name}</span>
//                           </div>
//                         </td>
//                         <td>{u.email}</td>
//                         <td>
//                           <span className={`role-badge role-${u.role.toLowerCase()}`}>
//                             {u.role}
//                           </span>
//                         </td>
//                         <td>
//                           <div className="action-buttons">
//                             <button onClick={() => startEdit(u)} className="btn-edit" title="Edit">
//                               <FiEdit2 />
//                             </button>
//                             <button onClick={() => remove(u.id)} className="btn-delete" title="Delete">
//                               <FiTrash2 />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {filteredUsers.length === 0 && (
//               <div className="empty-state">
//                 <p>No users found{searchTerm && ` matching "${searchTerm}"`}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ✅ Corrected CSS */}
//       <style jsx>{`
//         .users-container {
//           min-height: 100vh;
//           background: white; /* fixed */
//           padding: 20px;
//         }

//         .users-header {
//           text-align: center;
//           margin-bottom: 40px;
//           color: white;
//         }

//         .users-title {
//           font-size: 2.5rem;
//           font-weight: 700;
//           margin-bottom: 8px;
//         }

//         .users-subtitle {
//           font-size: 1.1rem;
//           opacity: 0.9;
//         }

//         .users-grid {
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 30px;
//           max-width: 1400px;
//           margin: 0 auto;
//         }

//         @media (min-width: 1024px) {
//           .users-grid {
//             grid-template-columns: 400px 1fr;
//           }
//         }

//         .glassmorphism {
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(10px);
//           border-radius: 20px;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
//         }

//         .users-form-card, .users-list-card {
//           padding: 30px;
//         }

//         .card-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 30px;
//           flex-wrap: wrap;
//           gap: 15px;
//         }

//         .card-title {
//           font-size: 1.5rem;
//           font-weight: 600;
//           color: #2d3748;
//           display: flex;
//           align-items: center;
//         }

//         .icon-spacing {
//           margin-right: 10px;
//         }

//         .form-grid {
//           display: grid;
//           gap: 20px;
//           margin-bottom: 30px;
//         }

//         .input-group {
//           display: flex;
//           flex-direction: column;
//         }

//         .input-label {
//           font-weight: 500;
//           margin-bottom: 8px;
//           color: #4a5568;
//         }

//         .modern-input, .modern-select {
//           padding: 12px 16px;
//           border: 2px solid #e2e8f0;
//           border-radius: 10px;
//           font-size: 1rem;
//           transition: all 0.3s ease;
//           background: white;
//         }

//         .modern-input:focus, .modern-select:focus {
//           outline: none;
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//         }

//         .create-btn {
//           width: 100%;
//           padding: 14px;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           border: none;
//           border-radius: 10px;
//           font-size: 1rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: transform 0.2s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .create-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
//         }

//         .btn-icon {
//           margin-right: 8px;
//         }

//         .search-container {
//           position: relative;
//           min-width: 250px;
//         }

//         .search-input {
//           padding: 12px 16px 12px 40px;
//           border: 2px solid #e2e8f0;
//           border-radius: 10px;
//           font-size: 1rem;
//           width: 100%;
//           transition: all 0.3s ease;
//         }

//         .search-input:focus {
//           outline: none;
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//         }

//         .search-icon {
//           position: absolute;
//           left: 12px;
//           top: 50%;
//           transform: translateY(-50%);
//           color: #a0aec0;
//         }

//         .table-container {
//           overflow-x: auto;
//           border-radius: 10px;
//         }

//         .modern-table {
//           width: 100%;
//           border-collapse: collapse;
//           min-width: 600px;
//         }

//         .modern-table th {
//           background: #f7fafc;
//           padding: 16px;
//           text-align: left;
//           font-weight: 600;
//           color: #4a5568;
//           border-bottom: 2px solid #e2e8f0;
//         }

//         .modern-table td {
//           padding: 16px;
//           border-bottom: 1px solid #e2e8f0;
//         }

//         .modern-table tr:hover {
//           background: #f7fafc;
//         }

//         .editing-row {
//           background: #fff9e6 !important;
//         }

//         .user-info {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-weight: 600;
//           font-size: 1.1rem;
//         }

//         .role-badge {
//           padding: 6px 12px;
//           border-radius: 20px;
//           font-size: 0.85rem;
//           font-weight: 500;
//         }

//         .role-admin { background: #fed7d7; color: #c53030; }
//         .role-manager { background: #feebc8; color: #d69e2e; }
//         .role-developer { background: #c6f6d5; color: #276749; }
//         .role-reporter { background: #e9d8fd; color: #6b46c1; }

//         .action-buttons {
//           display: flex;
//           gap: 8px;
//         }

//         .btn-edit, .btn-delete, .btn-success, .btn-cancel {
//           padding: 8px;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .btn-edit {
//           background: #e6fffa;
//           color: #234e52;
//         }

//         .btn-edit:hover {
//           background: #b2f5ea;
//         }

//         .btn-delete {
//           background: #fed7d7;
//           color: #c53030;
//         }

//         .btn-delete:hover {
//           background: #feb2b2;
//         }

//         .btn-success {
//           background: #c6f6d5;
//           color: #276749;
//         }

//         .btn-success:hover {
//           background: #9ae6b4;
//         }

//         .btn-cancel {
//           background: #fed7d7;
//           color: #c53030;
//         }

//         .btn-cancel:hover {
//           background: #feb2b2;
//         }

//         .edit-input, .edit-select {
//           padding: 8px 12px;
//           border: 2px solid #e2e8f0;
//           border-radius: 6px;
//           width: 100%;
//           font-size: 0.9rem;
//         }

//         .edit-input:focus, .edit-select:focus {
//           outline: none;
//           border-color: #667eea;
//         }

//         .empty-state {
//           text-align: center;
//           padding: 40px;
//           color: #a0aec0;
//           font-style: italic;
//         }

//         @media (max-width: 768px) {
//           .users-container {
//             padding: 10px;
//           }

//           .users-title {
//             font-size: 2rem;
//           }

//           .users-form-card, .users-list-card {
//             padding: 20px;
//           }

//           .card-header {
//             flex-direction: column;
//             align-items: stretch;
//           }

//           .search-container {
//             min-width: auto;
//           }

//           .modern-table {
//             font-size: 0.9rem;
//           }

//           .modern-table th,
//           .modern-table td {
//             padding: 12px 8px;
//           }

//           .action-buttons {
//             flex-direction: column;
//           }
//         }

//         @media (max-width: 480px) {
//           .users-title {
//             font-size: 1.75rem;
//           }

//           .card-title {
//             font-size: 1.25rem;
//           }

//           .user-info {
//             flex-direction: column;
//             gap: 6px;
//             text-align: center;
//           }

//           .avatar {
//             width: 32px;
//             height: 32px;
//             font-size: 0.9rem;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

////////////////////////////////////////////////////////////////////////////////////

// import React, { useEffect, useState } from 'react';
// // Import the new mockApi that uses localStorage
// import { listUsers, addUser, updateUser, deleteUser } from '../../services/mockApi';
// import { v4 as uuidv4 } from 'uuid';
// import { FiUserPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiSearch, FiUpload } from 'react-icons/fi';

// export default function Users() {
//   const defaultNewUser = {
//     firstName: '',
//     lastName: '',
//     email: '',
//     role: 'Developer',
//     department: 'Engineering',
//     active: true,
//     language: 'English',
//     mobileNumber: '',
//     dateFormat: 'YYYY-MM-DD',
//     passwordResetNeeded: false,
//     profileFile: null, // Note: This is client-side state for the file input
//   };

//   const [users, setUsers] = useState([]);
//   const [newUserForm, setNewUserForm] = useState(defaultNewUser);
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState(null);

//   // Destructure for easier use in the creation form
//   const {
//     firstName, lastName, email, role, department, active, language, mobileNumber, dateFormat, passwordResetNeeded, profileFile
//   } = newUserForm;

//   // --- Initial Data Fetch (Pulls from LocalStorage via mockApi) ---
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const data = await listUsers();
//         // Since mockApi is now responsible for normalization, we just set the data
//         setUsers(data);
//       } catch (err) {
//         console.error('Failed to load users:', err);
//         setError('Failed to load users');
//       }
//     };
//     fetchUsers();
//   }, []);

//   // --- Form Handlers ---
//   const handleNewUserChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     setNewUserForm(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value),
//     }));
//   };

//   const handleEditChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     setEditForm(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value),
//     }));
//   };

//   // --- CRUD Operations ---
//   const create = async () => {
//     if (!firstName.trim() || !lastName.trim() || !email.trim()) {
//       setError('First Name, Last Name, and Email are required.');
//       return;
//     }
//     try {
//       const newUser = {
//         id: uuidv4(),
//         ...newUserForm,
//         name: `${firstName.trim()} ${lastName.trim()}`,
//         // For mock persistence, store file metadata only
//         profileFile: profileFile ? { name: profileFile.name, size: profileFile.size } : null
//       };

//       await addUser(newUser);
//       // Re-fetch the updated list from mockApi (which contains localStorage data)
//       const updatedUsers = await listUsers();
//       setUsers(updatedUsers);
//       setNewUserForm(defaultNewUser);
//       setError(null);
//     } catch (err) {
//       console.error('Failed to add user:', err);
//       setError('Failed to add user');
//     }
//   };

//   const startEdit = (u) => {
//     setEditingId(u.id);
//     // Set edit form with the complete user object structure
//     setEditForm({ ...u });
//     setError(null);
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditForm({});
//     setError(null);
//   };

//   const saveEdit = async (id) => {
//     if (!editForm.firstName.trim() || !editForm.lastName.trim() || !editForm.email.trim()) {
//         setError('First Name, Last Name, and Email cannot be empty.');
//         return;
//     }
//     try {
//         const updatedUser = {
//             ...editForm,
//             name: `${editForm.firstName.trim()} ${editForm.lastName.trim()}`,
//             // Handle file update if a new file was selected during edit (for mock, we ignore the actual file)
//             profileFile: editForm.profileFile && editForm.profileFile.name ?
//                            { name: editForm.profileFile.name, size: editForm.profileFile.size } :
//                            editForm.profileFile
//         };

//         await updateUser(updatedUser);
//         const updatedUsers = await listUsers();
//         setUsers(updatedUsers);
//         cancelEdit();
//         setError(null);
//     } catch (err) {
//       console.error('Failed to update user:', err);
//       setError('User not found or failed to update');
//     }
//   };

//   const remove = async (id) => {
//     try {
//       await deleteUser(id);
//       const updatedUsers = await listUsers();
//       setUsers(updatedUsers);
//       setError(null);
//     } catch (err) {
//       console.error('Failed to delete user:', err);
//       setError('User not found or failed to delete');
//     }
//   };

//   // --- Filtering and Styling ---
//   const filteredUsers = users.filter(user => {
//     const searchLower = searchTerm.toLowerCase();
//     return (
//       (user.name && user.name.toLowerCase().includes(searchLower)) ||
//       (user.firstName && user.firstName.toLowerCase().includes(searchLower)) ||
//       (user.lastName && user.lastName.toLowerCase().includes(searchLower)) ||
//       (user.email && user.email.toLowerCase().includes(searchLower)) ||
//       (user.role && user.role.toLowerCase().includes(searchLower)) ||
//       (user.department && user.department.toLowerCase().includes(searchLower))
//     );
//   });

//   const getRoleColor = (roleOrDepartment) => {
//     const colors = {
//       'admin': 'role-admin',
//       'manager': 'role-manager',
//       'developer': 'role-developer',
//       'reporter': 'role-reporter',
//       'engineering': 'role-developer', // Reusing color
//       'sales': 'role-sales',
//       'hr': 'role-hr',
//       'marketing': 'role-marketing'
//     };
//     return colors[roleOrDepartment.toLowerCase()] || '';
//   };

//   return (
//     <div className="users-container">
//       {/* Header Section */}
//       <div className="users-header">
//         <h1 className="users-title">User Management System 🧑‍💼</h1>
//         <p className="users-subtitle">Manage your team members, roles, and administrative settings.</p>
//         {error && <p className="error-message">{error}</p>}
//       </div>

//       {/* --- */}

//       <div className="users-grid">
//         {/* User creation form */}
//         <div className="users-form-card glassmorphism" aria-labelledby="users-form-title">
//           <div className="card-header">
//             <h2 id="users-form-title" className="card-title">
//               <FiUserPlus className="icon-spacing" /> Add New User
//             </h2>
//           </div>

//           <div className="form-grid-expanded">
//             <div className="input-group">
//               <label className="input-label">First Name *</label>
//               <input
//                 className="modern-input"
//                 name="firstName"
//                 value={firstName}
//                 onChange={handleNewUserChange}
//                 placeholder="First Name"
//               />
//             </div>

//             <div className="input-group">
//               <label className="input-label">Last Name *</label>
//               <input
//                 className="modern-input"
//                 name="lastName"
//                 value={lastName}
//                 onChange={handleNewUserChange}
//                 placeholder="Last Name"
//               />
//             </div>

//             <div className="input-group">
//               <label className="input-label">Email Address *</label>
//               <input
//                 className="modern-input"
//                 name="email"
//                 value={email}
//                 onChange={handleNewUserChange}
//                 placeholder="Email Address"
//                 type="email"
//               />
//             </div>

//             <div className="input-group">
//               <label className="input-label">Mobile Number</label>
//               <input
//                 className="modern-input"
//                 name="mobileNumber"
//                 value={mobileNumber}
//                 onChange={handleNewUserChange}
//                 placeholder="Mobile Number"
//                 type="tel"
//               />
//             </div>

//             <div className="input-group">
//               <label className="input-label">Role</label>
//               <select className="modern-select" name="role" value={role} onChange={handleNewUserChange}>
//                 <option>Admin</option>
//                 <option>Manager</option>
//                 <option>Developer</option>
//                 <option>Reporter</option>
//               </select>
//             </div>

//             <div className="input-group">
//               <label className="input-label">Department</label>
//               <select className="modern-select" name="department" value={department} onChange={handleNewUserChange}>
//                 <option>Engineering</option>
//                 <option>Sales</option>
//                 <option>HR</option>
//                 <option>Marketing</option>
//               </select>
//             </div>

//             <div className="input-group">
//               <label className="input-label">Preferred Language</label>
//               <select className="modern-select" name="language" value={language} onChange={handleNewUserChange}>
//                 <option>English</option>
//                 <option>Spanish</option>
//                 <option>French</option>
//                 <option>German</option>
//               </select>
//             </div>

//             <div className="input-group">
//               <label className="input-label">Date Format</label>
//               <select className="modern-select" name="dateFormat" value={dateFormat} onChange={handleNewUserChange}>
//                 <option>YYYY-MM-DD</option>
//                 <option>MM/DD/YYYY</option>
//                 <option>DD/MM/YYYY</option>
//               </select>
//             </div>

//             <div className="input-group checkbox-group">
//               <label className="input-label">User Status</label>
//               <label className="checkbox-label">
//                 <input
//                   type="checkbox"
//                   name="active"
//                   checked={active}
//                   onChange={handleNewUserChange}
//                 />
//                 <span className="checkbox-text">{active ? 'Active' : 'Inactive'}</span>
//               </label>
//             </div>

//             <div className="input-group checkbox-group">
//               <label className="input-label">Password Reset</label>
//               <label className="checkbox-label">
//                 <input
//                   type="checkbox"
//                   name="passwordResetNeeded"
//                   checked={passwordResetNeeded}
//                   onChange={handleNewUserChange}
//                 />
//                 <span className="checkbox-text">Reset on next login</span>
//               </label>
//             </div>

//             <div className="input-group file-group">
//               <label className="input-label">Profile Picture</label>
//               <label htmlFor="profileFile" className="file-upload-btn">
//                 <FiUpload className="btn-icon" />
//                 {profileFile ? profileFile.name : 'Choose File'}
//               </label>
//               <input
//                 id="profileFile"
//                 type="file"
//                 name="profileFile"
//                 onChange={handleNewUserChange}
//                 accept="image/*"
//               />
//             </div>
//           </div>

//           <button className="create-btn" onClick={create}>
//             <FiUserPlus className="btn-icon" />
//             Create User
//           </button>
//         </div>

//         {/* User list section */}
//         <div className="users-list-card glassmorphism" aria-labelledby="users-list-title">
//           <div className="card-header">
//             <h2 id="users-list-title" className="card-title">
//               Team Members ({filteredUsers.length})
//             </h2>
//             <div className="search-container">
//               <FiSearch className="search-icon" />
//               <input
//                 type="text"
//                 className="search-input"
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="table-container">
//             <table className="modern-table" role="table" aria-label="Users table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Department</th>
//                   <th>Role</th>
//                   <th>Active</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map(u => (
//                   <tr key={u.id} className={editingId === u.id ? 'editing-row' : ''}>
//                     {editingId === u.id ? (
//                       <>
//                         <td>
//                           <input
//                             className="edit-input"
//                             name="firstName"
//                             value={editForm.firstName || ''}
//                             onChange={handleEditChange}
//                             placeholder="First Name"
//                           />
//                           <input
//                             className="edit-input"
//                             name="lastName"
//                             value={editForm.lastName || ''}
//                             onChange={handleEditChange}
//                             placeholder="Last Name"
//                             style={{marginTop: '5px'}}
//                           />
//                         </td>
//                         <td>
//                           <input
//                             className="edit-input"
//                             name="email"
//                             value={editForm.email || ''}
//                             onChange={handleEditChange}
//                           />
//                         </td>
//                         <td>
//                             <select
//                                 className="edit-select"
//                                 name="department"
//                                 value={editForm.department || defaultNewUser.department}
//                                 onChange={handleEditChange}
//                             >
//                                 <option>Engineering</option>
//                                 <option>Sales</option>
//                                 <option>HR</option>
//                                 <option>Marketing</option>
//                             </select>
//                         </td>
//                         <td>
//                           <select
//                             className="edit-select"
//                             name="role"
//                             value={editForm.role || defaultNewUser.role}
//                             onChange={handleEditChange}
//                           >
//                             <option>Admin</option>
//                             <option>Manager</option>
//                             <option>Developer</option>
//                             <option>Reporter</option>
//                           </select>
//                         </td>
//                         <td>
//                             <input
//                                 type="checkbox"
//                                 name="active"
//                                 checked={editForm.active || false}
//                                 onChange={handleEditChange}
//                             />
//                         </td>
//                         <td>
//                           <div className="action-buttons">
//                             <button onClick={() => saveEdit(u.id)} className="btn-success" title="Save">
//                               <FiCheck />
//                             </button>
//                             <button onClick={cancelEdit} className="btn-cancel" title="Cancel">
//                               <FiX />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     ) : (
//                       <>
//                         <td>
//                           <div className="user-info">
//                             <div className="avatar">{u.firstName ? u.firstName.charAt(0) : (u.name ? u.name.charAt(0) : 'U')}</div>
//                             <span>{u.firstName || u.name} {u.lastName}</span>
//                             <div className="file-indicator" title={u.profileFile ? `File: ${u.profileFile.name}` : 'No file'}>
//                                 {u.profileFile && '📁'}
//                             </div>
//                           </div>
//                         </td>
//                         <td>{u.email}</td>
//                         <td>
//                             <span className={`role-badge ${getRoleColor(u.department || 'engineering')}`}>
//                                 {u.department}
//                             </span>
//                         </td>
//                         <td>
//                           <span className={`role-badge ${getRoleColor(u.role || 'developer')}`}>
//                             {u.role}
//                           </span>
//                         </td>
//                         <td>
//                             <span className={`status-dot ${u.active ? 'status-active' : 'status-inactive'}`} title={u.active ? 'Active' : 'Inactive'}></span>
//                         </td>
//                         <td>
//                           <div className="action-buttons">
//                             <button onClick={() => startEdit(u)} className="btn-edit" title="Edit">
//                               <FiEdit2 />
//                             </button>
//                             <button onClick={() => remove(u.id)} className="btn-delete" title="Delete">
//                               <FiTrash2 />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {filteredUsers.length === 0 && (
//               <div className="empty-state">
//                 <p>No users found{searchTerm && ` matching "${searchTerm}"`}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         /* Existing Styles */
//         .users-container {
//           min-height: 100vh;
//           background: #f7f9fd; /* Lighter background */
//           padding: 20px;
//         }

//         .users-header {
//           text-align: center;
//           margin-bottom: 40px;
//           color: #2d3748;
//         }

//         .users-title {
//           font-size: 2.5rem;
//           font-weight: 700;
//           margin-bottom: 8px;
//         }

//         .users-subtitle {
//           font-size: 1.1rem;
//           opacity: 0.8;
//           color: #4a5568;
//         }

//         .error-message {
//             color: #e53e3e;
//             background: #fed7d7;
//             padding: 8px 15px;
//             border-radius: 8px;
//             margin-top: 15px;
//             display: inline-block;
//             font-weight: 500;
//         }

//         .users-grid {
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 30px;
//           max-width: 1400px;
//           margin: 0 auto;
//         }

//         @media (min-width: 1024px) {
//           .users-grid {
//             grid-template-columns: 450px 1fr; /* Increased form size */
//           }
//         }

//         .glassmorphism {
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(10px);
//           border-radius: 20px;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05); /* Lighter shadow */
//         }

//         .users-form-card,
//         .users-list-card {
//           padding: 30px;
//         }

//         .card-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 30px;
//           flex-wrap: wrap;
//           gap: 15px;
//         }

//         .card-title {
//           font-size: 1.5rem;
//           font-weight: 600;
//           color: #2d3748;
//           display: flex;
//           align-items: center;
//         }

//         .icon-spacing {
//           margin-right: 10px;
//         }

//         /* NEW/UPDATED Styles */
//         .form-grid-expanded {
//           display: grid;
//           grid-template-columns: 1fr 1fr; /* Two columns for a denser form */
//           gap: 20px;
//           margin-bottom: 30px;
//         }

//         .input-group {
//           display: flex;
//           flex-direction: column;
//         }

//         .input-label {
//           font-weight: 500;
//           margin-bottom: 8px;
//           color: #4a5568;
//         }

//         /* Checkbox and File Upload Styles */
//         .checkbox-group {
//             grid-column: span 1;
//         }

//         .checkbox-label {
//             display: flex;
//             align-items: center;
//             font-weight: 400;
//             color: #4a5568;
//             cursor: pointer;
//             padding: 10px;
//             background: #edf2f7;
//             border-radius: 8px;
//         }

//         .checkbox-label input[type="checkbox"] {
//             margin-right: 10px;
//             width: 18px;
//             height: 18px;
//             accent-color: #667eea;
//         }

//         .file-group input[type="file"] {
//           display: none;
//         }

//         .file-upload-btn {
//           padding: 12px 16px;
//           border: 2px solid #667eea;
//           border-radius: 10px;
//           font-size: 1rem;
//           font-weight: 500;
//           color: #667eea;
//           background: #ebf4ff;
//           cursor: pointer;
//           transition: background-color 0.2s;
//           display: flex;
//           align-items: center;
//           justify-content: flex-start;
//         }

//         .file-upload-btn:hover {
//           background: #d4e3ff;
//         }

//         .file-upload-btn .btn-icon {
//           margin-right: 8px;
//           font-size: 1.2rem;
//         }
//         /* End New Styles */

//         .modern-input,
//         .modern-select {
//           padding: 12px 16px;
//           border: 2px solid #e2e8f0;
//           border-radius: 10px;
//           font-size: 1rem;
//           transition: all 0.3s ease;
//           background: white;
//           width: 100%;
//           box-sizing: border-box;
//         }

//         .modern-input:focus,
//         .modern-select:focus {
//           outline: none;
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//         }

//         .create-btn {
//           grid-column: 1 / -1; /* Make button span both columns */
//           width: 100%;
//           padding: 14px;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           border: none;
//           border-radius: 10px;
//           font-size: 1rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: transform 0.2s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .create-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
//         }

//         .btn-icon {
//           margin-right: 8px;
//         }

//         .search-container {
//           position: relative;
//           min-width: 250px;
//         }

//         .search-input {
//           padding: 12px 16px 12px 40px;
//           border: 2px solid #e2e8f0;
//           border-radius: 10px;
//           font-size: 1rem;
//           width: 100%;
//           transition: all 0.3s ease;
//         }

//         .search-input:focus {
//           outline: none;
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//         }

//         .search-icon {
//           position: absolute;
//           left: 12px;
//           top: 50%;
//           transform: translateY(-50%);
//           color: #a0aec0;
//         }

//         .table-container {
//           overflow-x: auto;
//           border-radius: 10px;
//         }

//         .modern-table {
//           width: 100%;
//           border-collapse: collapse;
//           min-width: 800px; /* Increased min-width for new columns */
//         }

//         .modern-table th {
//           background: #f7fafc;
//           padding: 16px;
//           text-align: left;
//           font-weight: 600;
//           color: #4a5568;
//           border-bottom: 2px solid #e2e8f0;
//         }

//         .modern-table td {
//           padding: 16px;
//           border-bottom: 1px solid #e2e8f0;
//         }

//         .modern-table tr:hover {
//           background: #f7fafc;
//         }

//         .editing-row {
//           background: #fff9e6 !important;
//         }

//         .user-info {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .file-indicator {
//             font-size: 1.1em;
//             cursor: help;
//         }

//         .avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-weight: 600;
//           font-size: 1.1rem;
//           flex-shrink: 0;
//         }

//         /* New Status Dot */
//         .status-dot {
//             height: 10px;
//             width: 10px;
//             border-radius: 50%;
//             display: inline-block;
//             margin-right: 5px;
//         }

//         .status-active {
//             background-color: #48bb78; /* Green */
//         }

//         .status-inactive {
//             background-color: #e53e3e; /* Red */
//         }
//         /* End New Status Dot */

//         .role-badge {
//           padding: 6px 12px;
//           border-radius: 20px;
//           font-size: 0.85rem;
//           font-weight: 500;
//           white-space: nowrap; /* Prevents wrapping */
//         }

//         .role-admin {
//           background: #fed7d7;
//           color: #c53030;
//         }

//         .role-manager {
//           background: #feebc8;
//           color: #d69e2e;
//         }

//         .role-developer, .role-engineering {
//           background: #c6f6d5;
//           color: #276749;
//         }

//         .role-reporter {
//           background: #e9d8fd;
//           color: #6b46c1;
//         }

//         /* New Department Badges */
//         .role-sales {
//             background: #bee3f8;
//             color: #2c5282;
//         }

//         .role-hr {
//             background: #fff0f5;
//             color: #d53f8c;
//         }

//         .role-marketing {
//             background: #faf089;
//             color: #744210;
//         }
//         /* End New Department Badges */

//         .action-buttons {
//           display: flex;
//           gap: 8px;
//         }

//         .btn-edit,
//         .btn-delete,
//         .btn-success,
//         .btn-cancel {
//           padding: 8px;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .btn-edit {
//           background: #e6fffa;
//           color: #234e52;
//         }

//         .btn-edit:hover {
//           background: #b2f5ea;
//         }

//         .btn-delete {
//           background: #fed7d7;
//           color: #c53030;
//         }

//         .btn-delete:hover {
//           background: #feb2b2;
//         }

//         .btn-success {
//           background: #c6f6d5;
//           color: #276749;
//         }

//         .btn-success:hover {
//           background: #9ae6b4;
//         }

//         .btn-cancel {
//           background: #fed7d7;
//           color: #c53030;
//         }

//         .btn-cancel:hover {
//           background: #feb2b2;
//         }

//         .edit-input,
//         .edit-select {
//           padding: 8px 12px;
//           border: 2px solid #e2e8f0;
//           border-radius: 6px;
//           width: 100%;
//           font-size: 0.9rem;
//           box-sizing: border-box;
//         }

//         .edit-input:focus,
//         .edit-select:focus {
//           outline: none;
//           border-color: #667eea;
//         }

//         .empty-state {
//           text-align: center;
//           padding: 40px;
//           color: #a0aec0;
//           font-style: italic;
//         }

//         /* Media Queries */
//         @media (max-width: 768px) {
//           .users-container {
//             padding: 10px;
//           }

//           .users-title {
//             font-size: 2rem;
//           }

//           .users-form-card,
//           .users-list-card {
//             padding: 20px;
//           }

//           .form-grid-expanded {
//               grid-template-columns: 1fr; /* Single column layout for small screens */
//           }

//           .card-header {
//             flex-direction: column;
//             align-items: stretch;
//           }

//           .search-container {
//             min-width: auto;
//           }

//           .modern-table {
//             font-size: 0.85rem;
//             min-width: 600px;
//           }

//           .modern-table th,
//           .modern-table td {
//             padding: 10px 6px;
//           }

//           .action-buttons {
//             flex-direction: row; /* Keep action buttons inline on smaller screens */
//           }
//         }

//         @media (max-width: 480px) {
//           .users-title {
//             font-size: 1.75rem;
//           }

//           .card-title {
//             font-size: 1.25rem;
//           }

//           .user-info {
//             flex-direction: column;
//             gap: 6px;
//             text-align: center;
//             align-items: flex-start;
//           }

//           .avatar {
//             width: 32px;
//             height: 32px;
//             font-size: 1rem;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
