// src/pages/AdminRolePermissions.jsx
import React, { useEffect, useState } from "react";
import api from "../components/api";

function AdminRolePermissions() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState({
    manageUsers: false,
    manageTasks: false,
    viewReports: false,
    sendNotifications: false,
    manageRoles: false,
  });

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: { ...permissions },
  });

  const token = localStorage.getItem("token");

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/roles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoles(res.data.roles || []);
      } catch (err) {
        console.error("Error fetching roles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, [token]);

  // Select a role to edit
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setPermissions(role.permissions || {});
  };

  // Handle permission checkbox change
  const handlePermissionChange = (e) => {
    setPermissions({ ...permissions, [e.target.name]: e.target.checked });
  };

  // Update role permissions
  const handleUpdatePermissions = async () => {
    try {
      await api.put(
        `/admin/roles/${selectedRole._id}`,
        { permissions },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Permissions updated successfully");

      // Update roles state locally
      setRoles((prev) =>
        prev.map((r) =>
          r._id === selectedRole._id ? { ...r, permissions } : r
        )
      );

      setSelectedRole(null);
    } catch (err) {
      console.error("Error updating permissions:", err);
      alert("Failed to update permissions");
    }
  };

  // Handle new role form change
  const handleNewRoleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setNewRole((prev) => ({
        ...prev,
        permissions: { ...prev.permissions, [name]: checked },
      }));
    } else {
      setNewRole((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Create new role
  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/admin/roles",
        newRole,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Role created successfully");
      setRoles((prev) => [...prev, res.data.role]);
      setNewRole({ name: "", description: "", permissions: { ...permissions } });
    } catch (err) {
      console.error("Error creating role:", err);
      alert("Failed to create role");
    }
  };

  if (loading) return <p className="p-6">Loading roles...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Role & Permissions Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {roles.map((role) => (
          <div
            key={role._id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
            onClick={() => handleSelectRole(role)}
          >
            <h2 className="text-xl font-semibold">{role.name}</h2>
            <p className="text-gray-500 mt-2">
              {role.description || "No description"}
            </p>
          </div>
        ))}
      </div>

      {/* Edit Permissions */}
      {selectedRole && (
        <div className="bg-white p-6 rounded-xl shadow max-w-md mb-6">
          <h2 className="text-2xl font-bold mb-4">
            Edit Permissions: {selectedRole.name}
          </h2>

          {Object.keys(permissions).map((key) => (
            <div key={key} className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                name={key}
                checked={permissions[key]}
                onChange={handlePermissionChange}
                className="w-5 h-5"
              />
              <label className="capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
            </div>
          ))}

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleUpdatePermissions}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => setSelectedRole(null)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Create New Role */}
      <div className="bg-white p-6 rounded-xl shadow max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create New Role</h2>

        <form onSubmit={handleCreateRole}>
          <input
            type="text"
            name="name"
            placeholder="Role Name"
            value={newRole.name}
            onChange={handleNewRoleChange}
            required
            className="w-full p-2 mb-3 border rounded"
          />
          <textarea
            name="description"
            placeholder="Role Description"
            value={newRole.description}
            onChange={handleNewRoleChange}
            className="w-full p-2 mb-3 border rounded"
          />

          <p className="font-semibold mb-2">Permissions:</p>
          {Object.keys(newRole.permissions).map((key) => (
            <div key={key} className="flex items-center gap-3 mb-2">
              <input
                type="checkbox"
                name={key}
                checked={newRole.permissions[key]}
                onChange={handleNewRoleChange}
                className="w-5 h-5"
              />
              <label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
            </div>
          ))}

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition mt-4"
          >
            Create Role
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminRolePermissions;
