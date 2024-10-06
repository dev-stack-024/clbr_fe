// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgImage from "../media/alex-wigan-hKbmictIYDM-unsplash.jpg"

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/users/register', { name, email, password });
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: "center",
      justifyContent: 'center',
      width: '100%',
      height: "100vh",
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    }}>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      }}></div>

      <div style={{
        padding: '20px',
        width: '100%',
        maxWidth: '400px',
        margin: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
        borderRadius: '10px', // Rounded corners
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
        position: 'relative',
        zIndex: 1, // Keep the form above the overlay
      }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: '#007bff', border: 'none' }}>Register</button>
        </form>
      </div>
    </div>


  );
};

export default RegisterForm;
