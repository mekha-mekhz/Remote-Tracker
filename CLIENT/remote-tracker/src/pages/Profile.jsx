import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../components/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/me"); 
        setProfile(res.data.user);   // ✅ FIXED
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (!profile) return <p className="text-white p-4">No profile data found.</p>;

  return (
    <div className="p-6 text-white">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>

        {/* EDIT BUTTON */}
        <Link 
          to="/edit-profile"
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg font-semibold"
        >
          Edit Profile
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex items-center gap-6">

        {/* Photo */}
       <img
  src={
    profile?.profilePhoto && profile.profilePhoto.startsWith("http")
      ? profile.profilePhoto
      : "/default.jpg"
  }
  alt="Profile"
  className="w-32 h-32 rounded-full border-4 border-teal-500 object-cover"
  onError={(e) => (e.target.src = "/default.jpg")}
/>

        {/* Basic Details */}
        <div>
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          <p className="text-gray-300">{profile.role}</p>
          <p className="text-gray-400">{profile.email}</p>
        </div>
      </div>

      {/* More Info */}
   <div className="bg-gray-800 mt-6 p-6 rounded-lg">
  <h2 className="text-xl font-semibold mb-4">Personal Details</h2>

  <div className="space-y-2 text-gray-300">
    <p><strong>Name:</strong> {profile.name}</p>
    <p><strong>Email:</strong> {profile.email}</p>
    <p><strong>Role:</strong> {profile.role}</p>
    <p><strong>Position:</strong> {profile.position}</p>
    <p><strong>Status:</strong> {profile.isActive ? "Active" : "Inactive"}</p>
    <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
  </div>
</div>


    </div>
  );
}

export default Profile;
