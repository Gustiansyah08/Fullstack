import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch users when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect to login if token is not available
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        setError("Failed to load user data. Ensure token is valid.");
        console.error(error);

        // Redirect to login if unauthorized (401)
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchUsers();
  }, [navigate]);

  // Handle search by user ID
  const handleSearch = () => {
    if (searchId.trim() === "") {
      setFilteredUsers(users); // Reset to all users if search is empty
    } else {
      setFilteredUsers(
        users.filter((user) => user.id.toString() === searchId.trim())
      );
    }
  };

  // Clear search and reset to all users
  const clearSearch = () => {
    setSearchId("");
    setFilteredUsers(users);
  };

  // Delete user from the list
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Re-fetch users after deletion
      const response = await axios.get("http://127.0.0.1:8000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  // Logout user by clearing token
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className=""><h1 className="judul">User Dashboard</h1></div>
        <div className="profile">
          <span className="judul">Welcome</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <h1 className="judul">User Management</h1>
        {error && <p className="error-message">{error}</p>}

        {/* Search by ID */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="search-input"
            aria-label="Search User by ID"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
          <button onClick={clearSearch} className="clear-button">
            Clear
          </button>
                  {/* Add User Button */}
        <div className="add-user-container1">
          <button
            onClick={() => navigate("/add-user")}
            className="add-user-button"
          >
            Add User
          </button>
        </div>
        </div>
        

        {/* User Table */}
        <div className="user-table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.address}</td>
                    <td>{user.age}</td>
                    <td>{user.gender}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(`/edit-user/${user.id}`, { state: user })
                        }
                        className="edit-button"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
