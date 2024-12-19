import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./EditUser.css"; // File CSS untuk styling

function EditUser() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Wrap 'user' dalam useMemo agar tetap stabil
  const user = useMemo(() => location.state || {}, [location.state]);

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    age: user.age || "",
    gender: user.gender || "",
    role: user.role || "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State untuk loading

  useEffect(() => {
    // Pastikan user.id ada sebelum melakukan update
    if (!user.id) {
      setError("User ID tidak ditemukan.");
      return;
    }
  }, [user]); // Dependensi pada 'user'

  // Handle perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle submit form untuk mengupdate data pengguna
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true); // Set loading menjadi true sebelum request

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/users/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Navigasi kembali ke dashboard setelah berhasil mengupdate
      navigate("/dashboard");
    } catch (error) {
      setError("Gagal mengupdate data pengguna.");
      console.error(error);
    } finally {
      setLoading(false); // Set loading menjadi false setelah request selesai
    }
  };

  return (
    <div className="edit-user-container">
      <header className="edit-user-header">
        <div className="logo">Edit User</div>
      </header>

      <main className="edit-user-main">
        <h1>Update User Information</h1>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="edit-user-form">
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
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default EditUser;
