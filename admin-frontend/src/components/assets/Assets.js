

// this code is ok 



// import React, { useEffect, useState } from "react";


// // Mock API functions
// const mockAssets = [
//   { id: "1", email: "john@example.com", type: "Laptop", location: "Work From Office", status: "active", openDate: "2025-10-14T08:45:00.000Z" },
//   { id: "2", email: "user2@example.com", type: "Charger", location: "Work From Home", status: "maintenance", openDate: "2025-10-14T09:00:00.000Z" },
//   { id: "3", email: "user3@example.com", type: "Network Issue", location: "Work From Home", status: "inactive", openDate: "2025-10-13T14:00:00.000Z" },
// ];


// let assetsDB = [...mockAssets];


// const listAssets = () => Promise.resolve([...assetsDB]);
// const addAsset = (asset) => {
//   assetsDB.push(asset);
//   return Promise.resolve(asset);
// };


// const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// const formatDateTime = (isoString) => {
//   if (!isoString) return "-";
//   const date = new Date(isoString);
//   return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
// };

// export default function AssetsBoard() {
//   const [assets, setAssets] = useState([]);
//   const [email, setEmail] = useState("");
//   const [type, setType] = useState("Laptop");
//   const [location, setLocation] = useState("Work From Office");
//   const [editingId, setEditingId] = useState(null);
//   const [editFields, setEditFields] = useState({});
//   const [hoveredId, setHoveredId] = useState(null);
//   const [quickAdd, setQuickAdd] = useState({});
//   const [draggedAsset, setDraggedAsset] = useState(null);

//   useEffect(() => {
//     listAssets().then(setAssets);
//   }, []);

//   const add = async (status = "active") => {
//     const assetEmail = status === "form" ? email : quickAdd[status]?.email;
//     const assetType = status === "form" ? type : quickAdd[status]?.type || "Laptop";
//     const assetLocation = status === "form" ? location : quickAdd[status]?.location || "Work From Office";
//     if (!assetEmail?.trim()) return;

//     const now = new Date().toISOString();
//     const a = { 
//       id: generateId(), 
//       email: assetEmail, 
//       type: assetType, 
//       location: assetLocation, 
//       status: status === "form" ? "active" : status,
//       openDate: (status === "form" || status === "active") ? now : undefined,
//     };
//     await addAsset(a);
//     setAssets(await listAssets());

//     if (status === "form") {
//       setEmail("");
//       setType("Laptop");
//       setLocation("Work From Office");
//     } else {
//       setQuickAdd((prev) => ({ ...prev, [status]: { email: "", type: "Laptop", location: "Work From Office" } }));
//     }
//   };

//   const statusColumns = {
//     active: { title: "Active", color: "#22C55E", bgColor: "#C8E9DD" },
//     maintenance: { title: "Maintenance", color: "#EAB308", bgColor: "#FEF3C7" },
//     inactive: { title: "Inactive", color: "#EF4444", bgColor: "#FECACA" },
//     closed: { title: "Closed", color: "#6366F1", bgColor: "#E0E7FF" },
//   };

//   const groupedAssets = Object.keys(statusColumns).reduce((acc, status) => {
//     acc[status] = assets.filter((a) => a.status === status);
//     return acc;
//   }, {});

//   const handleDragStart = (e, asset) => {
//     setDraggedAsset(asset);
//     e.dataTransfer.effectAllowed = "move";
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "move";
//   };

//   const handleDrop = (e, newStatus) => {
//     e.preventDefault();
//     if (draggedAsset && draggedAsset.status !== newStatus) {
//       let updatedAsset = { ...draggedAsset, status: newStatus };
//       if (newStatus === "closed") {
//         updatedAsset.closeDate = new Date().toISOString();
//       }
//       if (newStatus === "active" && !updatedAsset.openDate) {
//         updatedAsset.openDate = new Date().toISOString();
//       }
//       setAssets(assets.map((a) => (a.id === draggedAsset.id ? updatedAsset : a)));
//     }
//     setDraggedAsset(null);
//   };

//   const startEditing = (asset) => {
//     setEditingId(asset.id);
//     setEditFields({ ...asset });
//   };

//   const saveEdit = (id) => {
//     setAssets(assets.map((a) => (a.id === id ? { ...a, ...editFields } : a)));
//     setEditingId(null);
//   };

//   const cancelEdit = () => setEditingId(null);
//   const deleteAsset = (id) => setAssets(assets.filter((a) => a.id !== id));

//   const closeAssetCard = (id) => {
//     setAssets(
//       assets.map((a) =>
//         a.id === id && a.status !== "closed"
//           ? { ...a, status: "closed", closeDate: new Date().toISOString() }
//           : a
//       )
//     );
//   };

//   return (
//     <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", background: "#D0F0F4", minHeight: "100vh" }}>
//       <div style={{ textAlign: "center", marginBottom: "2rem" }}>
//         <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0, letterSpacing: "2px" }}>
//           FLOW TRACK
//         </h1>
//       </div>

//       <div
//         style={{
//           marginBottom: "2rem",
//           background: "#fff",
//           padding: "1.5rem",
//           borderRadius: "8px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//         }}
//       >
//         <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>Add Asset</h2>
//         <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
//           <input
//             placeholder="Email ID"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
//           />
//           <select
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//             style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
//           >
//             <option>Laptop</option>
//             <option>Charger</option>
//             <option>Network Issue</option>
//           </select>
//           <select
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
//           >
//             <option>Work From Home</option>
//             <option>Work From Office</option>
//           </select>
//           <button
//             onClick={() => add("form")}
//             style={{
//               padding: "0.5rem 1rem",
//               background: "#0052CC",
//               color: "#fff",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             Add
//           </button>
//         </div>
//       </div>

//       <div style={{ display: "flex", gap: "1.5rem" }}>
//         {Object.keys(statusColumns).map((status) => (
//           <div
//             key={status}
//             onDragOver={handleDragOver}
//             onDrop={(e) => handleDrop(e, status)}
//             style={{
//               flex: 1,
//               background: statusColumns[status].bgColor,
//               padding: "1.5rem",
//               borderRadius: "12px",
//               minHeight: "400px",
//             }}
//           >
//             <h3
//               style={{
//                 color: statusColumns[status].color,
//                 fontSize: "1.25rem",
//                 fontWeight: "bold",
//                 marginBottom: "1rem",
//                 textAlign: "center",
//               }}
//             >
//               {statusColumns[status].title}
//             </h3>

//             {groupedAssets[status].map((a) => (
//               <div
//                 key={a.id}
//                 draggable={editingId !== a.id && status !== "closed"}
//                 onDragStart={(e) => status !== "closed" && handleDragStart(e, a)}
//                 onMouseEnter={() => setHoveredId(a.id)}
//                 onMouseLeave={() => setHoveredId(null)}
//                 style={{
//                   padding: "1rem",
//                   marginBottom: "0.75rem",
//                   borderRadius: "8px",
//                   background: statusColumns[status].color,
//                   color: "#fff",
//                   fontWeight: "600",
//                   boxShadow:
//                     draggedAsset?.id === a.id
//                       ? "0 4px 12px rgba(0,0,0,0.2)"
//                       : "0 2px 4px rgba(0,0,0,0.1)",
//                   position: "relative",
//                   cursor: editingId === a.id || status === "closed" ? "default" : "move",
//                   opacity: draggedAsset?.id === a.id ? 0.5 : 1,
//                 }}
//               >
//                 {editingId === a.id ? (
//                   <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
//                     <input
//                       value={editFields.email}
//                       onChange={(e) => setEditFields({ ...editFields, email: e.target.value })}
//                       style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
//                     />
//                     <select
//                       value={editFields.type}
//                       onChange={(e) => setEditFields({ ...editFields, type: e.target.value })}
//                       style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
//                     >
//                       <option>Laptop</option>
//                       <option>Charger</option>
//                       <option>Network Issue</option>
//                     </select>
//                     <select
//                       value={editFields.location}
//                       onChange={(e) => setEditFields({ ...editFields, location: e.target.value })}
//                       style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
//                     >
//                       <option>Work From Home</option>
//                       <option>Work From Office</option>
//                     </select>
//                     <select
//                       value={editFields.status}
//                       onChange={(e) => setEditFields({ ...editFields, status: e.target.value })}
//                       style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
//                     >
//                       {Object.keys(statusColumns).map((s) => (
//                         <option key={s} value={s}>
//                           {statusColumns[s].title}
//                         </option>
//                       ))}
//                     </select>
//                     <input
//                       type="datetime-local"
//                       value={editFields.openDate ? new Date(editFields.openDate).toISOString().slice(0, 16) : ""}
//                       onChange={(e) =>
//                         setEditFields({ ...editFields, openDate: new Date(e.target.value).toISOString() })
//                       }
//                       style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
//                       placeholder="Open Date"
//                     />
//                     {(status === "closed" || editFields.status === "closed") && (
//                       <input
//                         type="datetime-local"
//                         value={editFields.closeDate ? new Date(editFields.closeDate).toISOString().slice(0, 16) : ""}
//                         onChange={(e) =>
//                           setEditFields({ ...editFields, closeDate: new Date(e.target.value).toISOString() })
//                         }
//                         style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
//                         placeholder="Close Date"
//                       />
//                     )}
//                     <div style={{ display: "flex", gap: "0.5rem" }}>
//                       <button
//                         onClick={() => saveEdit(a.id)}
//                         style={{
//                           background: "#36B37E",
//                           color: "#fff",
//                           border: "none",
//                           borderRadius: "4px",
//                           padding: "0.5rem",
//                           flex: 1,
//                           cursor: "pointer",
//                         }}
//                       >
//                         Save
//                       </button>
//                       <button
//                         onClick={cancelEdit}
//                         style={{
//                           background: "#DE350B",
//                           color: "#fff",
//                           border: "none",
//                           borderRadius: "4px",
//                           padding: "0.5rem",
//                           flex: 1,
//                           cursor: "pointer",
//                         }}
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div onClick={() => startEditing(a)} style={{ cursor: "pointer" }}>
//                     <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{a.email}</div>
//                     <div style={{ fontSize: "0.8rem", marginTop: "0.25rem", opacity: 0.9 }}>
//                       {a.type} | {a.location}
//                     </div>
//                     {(status === "active" || status === "maintenance" || status === "inactive" || status === "closed") && (
//                       <div style={{ fontSize: "0.75rem", marginTop: "0.25rem", opacity: 0.8 }}>
//                         Open Date: {formatDateTime(a.openDate)}
//                         {status === "closed" && (
//                           <>
//                             <br />
//                             Close Date: {formatDateTime(a.closeDate)}
//                           </>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {hoveredId === a.id && editingId !== a.id && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "4px",
//                       right: "4px",
//                       display: "flex",
//                       gap: "0.5rem",
//                     }}
//                   >
//                     {status !== "closed" && (
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           closeAssetCard(a.id);
//                         }}
//                         style={{
//                           background: "rgba(255,255,255,0.9)",
//                           border: "none",
//                           color: statusColumns.closed.color,
//                           cursor: "pointer",
//                           fontWeight: "bold",
//                           padding: "0.25rem 0.5rem",
//                           borderRadius: "4px",
//                         }}
//                       >
//                         Close Card
//                       </button>
//                     )}
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         startEditing(a);
//                       }}
//                       style={{
//                         background: "rgba(255,255,255,0.9)",
//                         border: "none",
//                         color: "#0052CC",
//                         cursor: "pointer",
//                         fontWeight: "bold",
//                         padding: "0.25rem 0.5rem",
//                         borderRadius: "4px",
//                       }}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         deleteAsset(a.id);
//                       }}
//                       style={{
//                         background: "rgba(255,255,255,0.9)",
//                         border: "none",
//                         color: "#DE350B",
//                         cursor: "pointer",
//                         fontWeight: "bold",
//                         padding: "0.25rem 0.5rem",
//                         borderRadius: "4px",
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}

//             <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
//               <input
//                 placeholder="Email ID"
//                 value={quickAdd[status]?.email || ""}
//                 onChange={(e) =>
//                   setQuickAdd((prev) => ({
//                     ...prev,
//                     [status]: { ...prev[status], email: e.target.value },
//                   }))
//                 }
//                 style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
//               />
//               <select
//                 value={quickAdd[status]?.type || "Laptop"}
//                 onChange={(e) =>
//                   setQuickAdd((prev) => ({
//                     ...prev,
//                     [status]: { ...prev[status], type: e.target.value },
//                   }))
//                 }
//                 style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
//               >
//                 <option>Laptop</option>
//                 <option>Charger</option>
//                 <option>Network Issue</option>
//               </select>
//               <select
//                 value={quickAdd[status]?.location || "Work From Office"}
//                 onChange={(e) =>
//                   setQuickAdd((prev) => ({
//                     ...prev,
//                     [status]: { ...prev[status], location: e.target.value },
//                   }))
//                 }
//                 style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
//               >
//                 <option>Work From Home</option>
//                 <option>Work From Office</option>
//               </select>
//               <button
//                 onClick={() => add(status)}
//                 style={{
//                   background: "#fff",
//                   color: "#333",
//                   border: "none",
//                   borderRadius: "4px",
//                   padding: "0.5rem",
//                   cursor: "pointer",
//                   fontWeight: "600",
//                 }}
//               >
//                 Add
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


















// for description  ok 


import React, { useEffect, useState } from "react";

// Mock API functions
const mockAssets = [
  { id: "1", email: "john@example.com", type: "Laptop", location: "Work From Office", status: "active", openDate: "2025-10-14T08:45:00.000Z", description: "" },
  { id: "2", email: "user2@example.com", type: "Charger", location: "Work From Home", status: "maintenance", openDate: "2025-10-14T09:00:00.000Z", description: "" },
  { id: "3", email: "user3@example.com", type: "Network Issue", location: "Work From Home", status: "inactive", openDate: "2025-10-13T14:00:00.000Z", description: "" },
];

let assetsDB = [...mockAssets];

const listAssets = () => Promise.resolve([...assetsDB]);
const addAsset = (asset) => {
  assetsDB.push(asset);
  return Promise.resolve(asset);
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const formatDateTime = (isoString) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export default function AssetsBoard() {
  const [assets, setAssets] = useState([]);
  const [email, setEmail] = useState("");
  const [type, setType] = useState("Laptop");
  const [location, setLocation] = useState("Work From Office");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [hoveredId, setHoveredId] = useState(null);
  const [quickAdd, setQuickAdd] = useState({});
  const [draggedAsset, setDraggedAsset] = useState(null);

  useEffect(() => {
    listAssets().then(setAssets);
  }, []);

  const add = async (status = "active") => {
    const assetEmail = status === "form" ? email : quickAdd[status]?.email;
    const assetType = status === "form" ? type : quickAdd[status]?.type || "Laptop";
    const assetLocation = status === "form" ? location : quickAdd[status]?.location || "Work From Office";
    const assetDescription = status === "form" ? description : quickAdd[status]?.description || "";
    if (!assetEmail?.trim()) return;

    const now = new Date().toISOString();
    const a = {
      id: generateId(),
      email: assetEmail,
      type: assetType,
      location: assetLocation,
      status: status === "form" ? "active" : status,
      openDate: (status === "form" || status === "active") ? now : undefined,
      description: assetDescription,
    };
    await addAsset(a);
    setAssets(await listAssets());

    if (status === "form") {
      setEmail("");
      setType("Laptop");
      setLocation("Work From Office");
      setDescription("");
    } else {
      setQuickAdd((prev) => ({ ...prev, [status]: { email: "", type: "Laptop", location: "Work From Office", description: "" } }));
    }
  };

  const statusColumns = {
    active: { title: "Active", color: "#22C55E", bgColor: "#C8E9DD" },
    maintenance: { title: "Maintenance", color: "#EAB308", bgColor: "#FEF3C7" },
    inactive: { title: "Inactive", color: "#EF4444", bgColor: "#FECACA" },
    closed: { title: "Closed", color: "#6366F1", bgColor: "#E0E7FF" },
  };

  const groupedAssets = Object.keys(statusColumns).reduce((acc, status) => {
    acc[status] = assets.filter((a) => a.status === status);
    return acc;
  }, {});

  const handleDragStart = (e, asset) => {
    setDraggedAsset(asset);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedAsset && draggedAsset.status !== newStatus) {
      let updatedAsset = { ...draggedAsset, status: newStatus };
      if (newStatus === "closed") {
        updatedAsset.closeDate = new Date().toISOString();
      }
      if (newStatus === "active" && !updatedAsset.openDate) {
        updatedAsset.openDate = new Date().toISOString();
      }
      setAssets(assets.map((a) => (a.id === draggedAsset.id ? updatedAsset : a)));
    }
    setDraggedAsset(null);
  };

  const startEditing = (asset) => {
    setEditingId(asset.id);
    setEditFields({ ...asset });
  };

  const saveEdit = (id) => {
    setAssets(assets.map((a) => (a.id === id ? { ...a, ...editFields } : a)));
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);
  const deleteAsset = (id) => setAssets(assets.filter((a) => a.id !== id));

  const closeAssetCard = (id) => {
    setAssets(
      assets.map((a) =>
        a.id === id && a.status !== "closed"
          ? { ...a, status: "closed", closeDate: new Date().toISOString() }
          : a
      )
    );
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", background: "#D0F0F4", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0, letterSpacing: "2px" }}>
          FLOW TRACK
        </h1>
      </div>

      <div
        style={{
          marginBottom: "2rem",
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>Add Asset</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <input
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option>Laptop</option>
            <option>Charger</option>
            <option>Network Issue</option>
          </select>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option>Work From Home</option>
            <option>Work From Office</option>
          </select>
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ flex: 2, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button
            onClick={() => add("form")}
            style={{
              padding: "0.5rem 1rem",
              background: "#0052CC",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1.5rem" }}>
        {Object.keys(statusColumns).map((status) => (
          <div
            key={status}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
            style={{
              flex: 1,
              background: statusColumns[status].bgColor,
              padding: "1.5rem",
              borderRadius: "12px",
              minHeight: "400px",
            }}
          >
            <h3
              style={{
                color: statusColumns[status].color,
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {statusColumns[status].title}
            </h3>

            {groupedAssets[status].map((a) => (
              <div
                key={a.id}
                draggable={editingId !== a.id && status !== "closed"}
                onDragStart={(e) => status !== "closed" && handleDragStart(e, a)}
                onMouseEnter={() => setHoveredId(a.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  padding: "1rem",
                  marginBottom: "0.75rem",
                  borderRadius: "8px",
                  background: statusColumns[status].color,
                  color: "#fff",
                  fontWeight: "600",
                  boxShadow:
                    draggedAsset?.id === a.id
                      ? "0 4px 12px rgba(0,0,0,0.2)"
                      : "0 2px 4px rgba(0,0,0,0.1)",
                  position: "relative",
                  cursor: editingId === a.id || status === "closed" ? "default" : "move",
                  opacity: draggedAsset?.id === a.id ? 0.5 : 1,
                }}
              >
                {editingId === a.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <input
                      value={editFields.email}
                      onChange={(e) => setEditFields({ ...editFields, email: e.target.value })}
                      style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
                    />
                    <select
                      value={editFields.type}
                      onChange={(e) => setEditFields({ ...editFields, type: e.target.value })}
                      style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
                    >
                      <option>Laptop</option>
                      <option>Charger</option>
                      <option>Network Issue</option>
                    </select>
                    <select
                      value={editFields.location}
                      onChange={(e) => setEditFields({ ...editFields, location: e.target.value })}
                      style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
                    >
                      <option>Work From Home</option>
                      <option>Work From Office</option>
                    </select>
                    <input
                      value={editFields.description || ""}
                      onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
                      placeholder="Description"
                      style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
                    />
                    <select
                      value={editFields.status}
                      onChange={(e) => setEditFields({ ...editFields, status: e.target.value })}
                      style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
                    >
                      {Object.keys(statusColumns).map((s) => (
                        <option key={s} value={s}>
                          {statusColumns[s].title}
                        </option>
                      ))}
                    </select>
                    <input
                      type="datetime-local"
                      value={editFields.openDate ? new Date(editFields.openDate).toISOString().slice(0, 16) : ""}
                      onChange={(e) =>
                        setEditFields({ ...editFields, openDate: new Date(e.target.value).toISOString() })
                      }
                      style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
                      placeholder="Open Date"
                    />
                    {(status === "closed" || editFields.status === "closed") && (
                      <input
                        type="datetime-local"
                        value={editFields.closeDate ? new Date(editFields.closeDate).toISOString().slice(0, 16) : ""}
                        onChange={(e) =>
                          setEditFields({ ...editFields, closeDate: new Date(e.target.value).toISOString() })
                        }
                        style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
                        placeholder="Close Date"
                      />
                    )}
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => saveEdit(a.id)}
                        style={{
                          background: "#36B37E",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0.5rem",
                          flex: 1,
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{
                          background: "#DE350B",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0.5rem",
                          flex: 1,
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => startEditing(a)} style={{ cursor: "pointer" }}>
                    <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{a.email}</div>
                    <div style={{ fontSize: "0.8rem", marginTop: "0.25rem", opacity: 0.9 }}>
                      {a.type} | {a.location}
                    </div>
                    {a.description && (
                      <div style={{ fontSize: "0.75rem", marginTop: "0.25rem", fontStyle: "italic", opacity: 0.85 }}>
                        Description: {a.description}
                      </div>
                    )}
                    {(status === "active" || status === "maintenance" || status === "inactive" || status === "closed") && (
                      <div style={{ fontSize: "0.75rem", marginTop: "0.25rem", opacity: 0.8 }}>
                        Open Date: {formatDateTime(a.openDate)}
                        {status === "closed" && (
                          <>
                            <br />
                            Close Date: {formatDateTime(a.closeDate)}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {hoveredId === a.id && editingId !== a.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    {status !== "closed" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeAssetCard(a.id);
                        }}
                        style={{
                          background: "rgba(255,255,255,0.9)",
                          border: "none",
                          color: statusColumns.closed.color,
                          cursor: "pointer",
                          fontWeight: "bold",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                        }}
                      >
                        Close Card
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(a);
                      }}
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        border: "none",
                        color: "#0052CC",
                        cursor: "pointer",
                        fontWeight: "bold",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAsset(a.id);
                      }}
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        border: "none",
                        color: "#DE350B",
                        cursor: "pointer",
                        fontWeight: "bold",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <input
                placeholder="Email ID"
                value={quickAdd[status]?.email || ""}
                onChange={(e) =>
                  setQuickAdd((prev) => ({
                    ...prev,
                    [status]: { ...prev[status], email: e.target.value },
                  }))
                }
                style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
              />
              <select
                value={quickAdd[status]?.type || "Laptop"}
                onChange={(e) =>
                  setQuickAdd((prev) => ({
                    ...prev,
                    [status]: { ...prev[status], type: e.target.value },
                  }))
                }
                style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
              >
                <option>Laptop</option>
                <option>Charger</option>
                <option>Network Issue</option>
              </select>
              <select
                value={quickAdd[status]?.location || "Work From Office"}
                onChange={(e) =>
                  setQuickAdd((prev) => ({
                    ...prev,
                    [status]: { ...prev[status], location: e.target.value },
                  }))
                }
                style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
              >
                <option>Work From Home</option>
                <option>Work From Office</option>
              </select>
              <input
                placeholder="Description"
                value={quickAdd[status]?.description || ""}
                onChange={(e) =>
                  setQuickAdd((prev) => ({
                    ...prev,
                    [status]: { ...prev[status], description: e.target.value },
                  }))
                }
                style={{ padding: "0.5rem", borderRadius: "4px", border: "none" }}
              />
              <button
                onClick={() => add(status)}
                style={{
                  background: "#fff",
                  color: "#333",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
