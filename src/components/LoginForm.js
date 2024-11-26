import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import bgImage from "../media/alex-wigan-hKbmictIYDM-unsplash.jpg"

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
      console.log(process.env.REACT_APP_BACKEND_URL)
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, { email, password });
      login(response.data.token, response.data);
      if (response.data.user.role === "admin") {
        navigate('/admin');
      }
      else {
        navigate('/map');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/forgot-password`, { email });
      setResetSuccess(true);
      setError('');
    } catch (err) {
      setError('Failed to send reset email');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/reset-password`, {
        email,
        otp: resetToken,
        newPassword
      });
      setShowForgotPassword(false);
      setResetSuccess(false);
      setError('');
    } catch (err) {
      setError('Password reset failed');
    }
  };

  if (showForgotPassword) {
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
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 1,
        }}>
          <h2 style={{ textAlign: 'center', color: '#333' }}>Reset Password</h2>
          {!resetSuccess ? (
            <form onSubmit={handleForgotPassword}>
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
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-primary">Send OTP</button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label htmlFor="resetToken" className="form-label">OTP</label>
                <input
                  type="text"
                  className="form-control"
                  id="resetToken"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-primary">Reset Password</button>
            </form>
          )}
        </div>
      </div>
    );
  }

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
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 1,
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
          <button
            type="button"
            className="btn btn-link"
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot Password?
          </button>
        </form>
        <p className="mt-3">
          Don't have an account? <a href="/register">Create one</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;