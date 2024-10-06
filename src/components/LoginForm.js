import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { useAuth } from '../hooks/useAuth';
import { AuthContext } from '../context/AuthContext';
import bgImage from "../media/alex-wigan-hKbmictIYDM-unsplash.jpg"

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use context

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', { email, password });
      login(response.data.token); // Update context state
      navigate('/'); // Redirect to home page after login
    } catch (err) {
      setError('Invalid credentials');
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
        <h2 style={{ textAlign: 'center', color: '#333' }}>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <p className="mt-3">
          Don't have an account? <a href="/register">Create one</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
