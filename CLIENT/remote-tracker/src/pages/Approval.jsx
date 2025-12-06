import React, { useEffect, useState } from "react";
import api from "../components/api";

function Approval() {
  const [pendingUsers, setPendingUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/pending-users");
      setPendingUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const approveUser = async (id) => {
    try {
      await api.put(`/verify/${id}`);
      alert("User Approved!");
      fetchUsers();
    } catch (err) {
      alert("Error approving user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Pending User Approvals</h1>

      <div className="space-y-4">
        {pendingUsers.map((user) => (
          <div
            key={user._id}
            className="p-4 bg-gray-100 rounded-xl flex justify-between"
          >
            <div>
              <p><b>Name:</b> {user.name}</p>
              <p><b>Email:</b> {user.email}</p>
              <p><b>Position:</b> {user.position}</p>
            </div>

            <button
              onClick={() => approveUser(user._id)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Approve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Approval;
