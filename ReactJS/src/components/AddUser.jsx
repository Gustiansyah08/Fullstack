import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddUser.css"; // File CSS untuk styling

function AddUser() {
  const navigate = useNavigate();

  // State untuk menyimpan form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    gender: "Male", // Default "Male"
    role: "User",  // Default "User"
    password: "",  // Field password ditambahkan
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State untuk loading

  // Handle perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle submit form untuk menambah pengguna
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true); // Set loading menjadi true sebelum request

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users", // Endpoint untuk menambah pengguna
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Setelah berhasil, navigasi ke dashboard
      navigate("/dashboard");
    } catch (error) {
      setError("Gagal menambahkan pengguna.");
      console.error(error);
    } finally {
      setLoading(false); // Set loading menjadi false setelah request selesai
    }
  };

  return (
    <div className="add-user-container">
      <header className="add-user-header">
        <div className="logo">Add User</div>
      </header>

      <main className="add-user-main">
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="add-user-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading} // Disable tombol saat loading
          >
            {loading ? "Saving..." : "Add User"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default AddUser;
