import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import EditUser from './components/EditUser';
import AddUser from './components/AddUser'; // Import komponen AddUser

// Komponen untuk cek apakah sudah login (misal cek token)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Mengecek token login
  console.log('Token:', token); // Cek token di console
  if (!token) {
    return <Navigate to="/login" />; // Redirect ke halaman login jika tidak ada token
  }
  return children; // Menampilkan children jika sudah login
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman login */}
        <Route path="/login" element={<Login />} />

        {/* Halaman register */}
        <Route path="/register" element={<Register />} />

        {/* Halaman dashboard, hanya bisa diakses jika sudah login */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Halaman untuk tambah user */}
        <Route
          path="/add-user"
          element={
            <ProtectedRoute>
              <AddUser />
            </ProtectedRoute>
          }
        />
        
        {/* Halaman edit user */}
        <Route path="/edit-user/:id" element={<EditUser />} />

        {/* Halaman utama, misalnya langsung ke /login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
